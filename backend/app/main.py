import csv
import io
import math
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas
from .database import Base, engine, SessionLocal, get_db
from .seed_data import DEMO_ORGANIZATIONS

Base.metadata.create_all(bind=engine)


def _seed(db: Session) -> int:
    for row in DEMO_ORGANIZATIONS:
        db.add(models.Organization(**row))
    db.commit()
    return len(DEMO_ORGANIZATIONS)


def seed_if_empty():
    db: Session = SessionLocal()
    try:
        if db.query(models.Organization).count() == 0:
            _seed(db)
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    seed_if_empty()
    yield


app = FastAPI(
    title="Climate Organizations Map API",
    description=(
        "Prototype API for a community climate-organizations map, built "
        "as an interview project idea inspired by Green Community "
        "Catalysts' Localized Climate Action Initiative. All data served "
        "here is fictional demo data, not GCC's real survey responses."
    ),
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# Response categories, kept in one place so the API, the CSV importer, and the
# zero-filled stats buckets can't drift apart.
ORG_TYPES = ("organization", "municipality", "committee", "individual")
CLIMATE_APPROACHES = ("mitigation", "adaptation", "both")
STAFF_SIZES = ("1-5", "6+")


def _valid_coords(latitude: float | None, longitude: float | None) -> bool:
    """A coordinate pair is usable only if it is present, finite, and on
    the globe. Guards the grid scan in /coverage-gaps against garbage that
    would otherwise blow up its bounding box."""
    if latitude is None or longitude is None:
        return False
    if not (math.isfinite(latitude) and math.isfinite(longitude)):
        return False
    return -90 <= latitude <= 90 and -180 <= longitude <= 180


def _filtered_organizations(
    db: Session,
    org_type: str | None = None,
    focus_area: str | None = None,
    search: str | None = None,
    climate_approach: str | None = None,
) -> list[models.Organization]:
    """The one place filtering happens, so /organizations and /stats cannot
    drift apart and report different numbers for the same selection."""
    query = db.query(models.Organization)
    if org_type:
        query = query.filter(models.Organization.org_type == org_type)
    if climate_approach:
        query = query.filter(models.Organization.climate_approach == climate_approach)
    if search:
        like = f"%{search.lower()}%"
        query = query.filter(
            models.Organization.name.ilike(like) | models.Organization.city.ilike(like)
        )
    results = query.all()
    if focus_area:
        results = [o for o in results if focus_area in (o.focus_areas or [])]
    return results


@app.get("/")
def root():
    return {"status": "ok", "docs": "/docs"}


@app.get("/organizations", response_model=list[schemas.OrganizationOut])
def get_organizations(
    org_type: str | None = None,
    focus_area: str | None = None,
    search: str | None = None,
    climate_approach: str | None = None,
    db: Session = Depends(get_db),
):
    """List orgs, optionally filtered by type, focus area, climate approach,
    and/or a free-text search against name and city."""
    return _filtered_organizations(db, org_type, focus_area, search, climate_approach)


@app.get("/organizations/{org_id}", response_model=schemas.OrganizationOut)
def get_organization(org_id: int, db: Session = Depends(get_db)):
    org = db.query(models.Organization).filter(models.Organization.id == org_id).first()
    if org is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org


# A grid finer than the data extent can justify would produce a rectangle
# list no browser can draw, so refuse rather than ship it.
MAX_GRID_CELLS = 5000


@app.get("/coverage-gaps", response_model=list[schemas.CoverageGap])
def get_coverage_gaps(
    grid_size: float = Query(0.5, gt=0, le=90),
    db: Session = Depends(get_db),
):
    """
    Grid the bounding box of all orgs and flag empty cells that *border a
    cell containing organizations* -- a simple stand-in for GCC's "climate
    resource desert" idea.

    The neighbour rule matters. Flagging every empty cell in the bounding
    box marks open ocean and the wilderness past the edge of the data,
    which buries the interesting cases: an unserved area with served
    neighbours is a hole in coverage, whereas an unserved area with no
    served neighbours is usually just somewhere nobody lives.

    It is a heuristic standing in for population data, not a substitute for
    it. A real version would measure distance to the nearest organization
    and weight by who actually lives there. Said out loud as a known
    limitation.
    """
    orgs = [
        o for o in db.query(models.Organization).all()
        if _valid_coords(o.latitude, o.longitude)
    ]
    if not orgs:
        return []

    lats = [o.latitude for o in orgs]
    lngs = [o.longitude for o in orgs]
    min_lat, max_lat = min(lats), max(lats)
    min_lng, max_lng = min(lngs), max(lngs)

    lat_steps = math.ceil((max_lat - min_lat) / grid_size)
    lng_steps = math.ceil((max_lng - min_lng) / grid_size)
    if lat_steps * lng_steps > MAX_GRID_CELLS:
        raise HTTPException(
            status_code=422,
            detail=(
                f"grid_size {grid_size} would produce {lat_steps * lng_steps} cells over "
                f"the current data extent (max {MAX_GRID_CELLS}). Use a larger grid_size."
            ),
        )

    # Which cells hold at least one org. Bucket each org once rather than
    # rescanning every org per cell.
    occupied: set[tuple[int, int]] = set()
    for o in orgs:
        i = int((o.latitude - min_lat) // grid_size)
        j = int((o.longitude - min_lng) // grid_size)
        occupied.add((i, j))

    def borders_coverage(i: int, j: int) -> bool:
        return any(
            (i + di, j + dj) in occupied
            for di in (-1, 0, 1)
            for dj in (-1, 0, 1)
            if not (di == 0 and dj == 0)
        )

    gaps = []
    for i in range(lat_steps):
        for j in range(lng_steps):
            if (i, j) in occupied or not borders_coverage(i, j):
                continue
            gaps.append({
                "lat": min_lat + i * grid_size,
                "lng": min_lng + j * grid_size,
                "size": grid_size,
            })
    return gaps


@app.get("/stats", response_model=schemas.StatsOut)
def get_stats(
    org_type: str | None = None,
    focus_area: str | None = None,
    search: str | None = None,
    climate_approach: str | None = None,
    db: Session = Depends(get_db),
):
    """Counts by type, focus area, climate approach, and staff size for the
    *current selection*, using the same filters as /organizations -- so the
    dashboard always describes the rows the map is actually showing.

    by_approach and by_staff_size are the two splits GCC's own published
    survey analysis leads with, recomputed live instead of re-exported.
    """
    orgs = _filtered_organizations(db, org_type, focus_area, search, climate_approach)
    focus_counts: dict[str, int] = {}
    for o in orgs:
        for f in (o.focus_areas or []):
            focus_counts[f] = focus_counts.get(f, 0) + 1

    # Zero-filled from the canonical category lists so a category that drops to
    # zero under a filter still renders as an empty slot rather than vanishing.
    type_counts = {t: sum(1 for o in orgs if o.org_type == t) for t in ORG_TYPES}
    approach_counts = {
        a: sum(1 for o in orgs if o.climate_approach == a) for a in CLIMATE_APPROACHES
    }
    staff_counts = {s: sum(1 for o in orgs if o.staff_size == s) for s in STAFF_SIZES}

    return {
        "total": len(orgs),
        "by_focus": focus_counts,
        "by_type": type_counts,
        "by_approach": approach_counts,
        "by_staff_size": staff_counts,
    }


REQUIRED_CSV_FIELDS = ["name", "org_type", "latitude", "longitude", "city", "state"]
VALID_ORG_TYPES = set(ORG_TYPES)
VALID_APPROACHES = set(CLIMATE_APPROACHES)


def _parse_list_cell(value: str) -> list[str]:
    """focus_areas/barriers are stored in CSV as a semicolon-separated
    cell, e.g. "energy;food" -- commas are already taken by the CSV
    delimiter itself."""
    if not value:
        return []
    return [v.strip() for v in value.split(";") if v.strip()]


@app.post("/organizations/import-csv")
async def import_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Bulk-import organizations from a CSV export. Expected columns:
    name, org_type, latitude, longitude, city, state, focus_areas,
    age_years, staff_size, climate_approach, barriers, mission_summary,
    website

    This is intentionally forgiving: bad rows are skipped and reported
    rather than failing the whole import, since a real-world survey
    export will always have a few messy rows.
    """
    raw = (await file.read()).decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(raw))

    imported = 0
    errors: list[dict] = []

    for i, row in enumerate(reader, start=2):  # row 1 is the header
        missing = [f for f in REQUIRED_CSV_FIELDS if not row.get(f)]
        if missing:
            errors.append({"row": i, "reason": f"missing required field(s): {', '.join(missing)}"})
            continue

        org_type = row["org_type"].strip().lower()
        if org_type not in VALID_ORG_TYPES:
            errors.append({"row": i, "reason": f"invalid org_type '{org_type}'"})
            continue

        try:
            latitude = float(row["latitude"])
            longitude = float(row["longitude"])
        except ValueError:
            errors.append({"row": i, "reason": "latitude/longitude must be numeric"})
            continue

        # float() happily accepts "nan"/"inf" and any out-of-range number,
        # and letting those through poisons the /coverage-gaps bounding box.
        if not _valid_coords(latitude, longitude):
            errors.append({
                "row": i,
                "reason": "latitude must be between -90 and 90, longitude between -180 and 180",
            })
            continue

        # Optional, but a closed vocabulary: a typo here would silently skew the
        # mitigation/adaptation chart, so report it rather than drop it quietly.
        climate_approach = (row.get("climate_approach") or "").strip().lower() or None
        if climate_approach and climate_approach not in VALID_APPROACHES:
            errors.append({
                "row": i,
                "reason": (
                    f"invalid climate_approach '{climate_approach}' "
                    f"(expected one of: {', '.join(CLIMATE_APPROACHES)})"
                ),
            })
            continue

        age_years = None
        if row.get("age_years"):
            try:
                age_years = int(row["age_years"])
            except ValueError:
                pass  # non-fatal -- just leave it unset

        db.add(models.Organization(
            name=row["name"].strip(),
            org_type=org_type,
            latitude=latitude,
            longitude=longitude,
            city=row["city"].strip(),
            state=row["state"].strip(),
            focus_areas=_parse_list_cell(row.get("focus_areas", "")),
            age_years=age_years,
            staff_size=(row.get("staff_size") or "").strip() or None,
            climate_approach=climate_approach,
            barriers=_parse_list_cell(row.get("barriers", "")),
            mission_summary=(row.get("mission_summary") or "").strip() or None,
            website=(row.get("website") or "").strip() or None,
        ))
        imported += 1

    db.commit()
    return {"imported": imported, "skipped": len(errors), "errors": errors}


@app.post("/organizations/reset-demo")
def reset_demo_data(db: Session = Depends(get_db)):
    """
    Drop every organization and reseed the original demo set.

    The SQLite file lives inside the container, so without this, "get back
    to a known state" depends on Docker's container lifecycle -- and only
    `docker compose down` actually discards it. `stop`, `restart`, a machine
    reboot, or Docker Desktop closing all quietly preserve imported rows,
    which is a bad thing to discover shortly before a demo. This makes the
    reset something the app owns rather than an incantation you have to
    remember correctly under pressure.
    """
    removed = db.query(models.Organization).delete()
    db.commit()
    seeded = _seed(db)
    return {"removed": removed, "seeded": seeded}
