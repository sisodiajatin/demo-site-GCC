# Climate Organizations Map

A small full-stack prototype: an interactive map and directory of community
climate organizations, built as a project idea for an interview at
[Green Community Catalysts](https://www.greencommunitycatalysts.com/).

## Why this exists

GCC's own [Localized Climate Action Initiative](https://www.greencommunitycatalysts.com/localized-climate-action-initiative)
lays out 5 phases — data collection, analysis, mapping, dissemination, and
solution development — and says outright that they're looking for help with
phases 2 through 5. As of this project being built, their `/map` page is a
"work in progress" placeholder and their `/survey-data` page shows static,
manually-exported chart images rather than a live dashboard.

This project is a small, honest attempt at those two gaps:

| GCC's stated phase | What this project does |
|---|---|
| Phase 1 — Data collection | A CSV import endpoint that bulk-loads organizations from a survey-style export, skipping and reporting bad rows instead of failing the whole batch |
| Phase 2 — Data analysis | An Analysis view that reproduces the two splits GCC's published survey analysis leads with — mitigation vs. adaptation, and staff size — recomputed live from whatever's currently filtered, so a new import updates the charts instead of requiring a re-exported image |
| Phase 3 — Mapping organizations | An interactive map with pins, popups, filters by org type / focus area / climate approach, and free-text search by name or city |
| Phase 5 — Solution development ("climate resource deserts") | A coverage-gap overlay that grids the map and flags unserved cells bordering served ones — holes in coverage, not just empty space |

**All data in this project is fictional demo data** — 28 made-up
organizations spread across real New England towns, built to mirror the
shape of GCC's real survey (same `org_type` categories, same 6 focus areas,
same barrier list, same mitigation/adaptation split, same `1-5` / `6+` staff
banding) without using any of their actual respondents' data.

The demo set is weighted so 67.9% of it is mitigation-focused, close to the
67.5% in GCC's Sept–Oct 2025 snapshot — deliberately, so the Analysis view
demonstrates reproducing a chart they actually publish. **The invented
numbers are not findings**; they show that the pipeline computes, not
anything true about New England climate organizations.

## Stack

- **Backend:** FastAPI + SQLAlchemy + SQLite
- **Frontend:** React + TypeScript (Vite) + react-leaflet
- **Deployment:** Docker Compose (nginx serving the built frontend, proxying
  `/api` through to the backend container)

## Running it

### Option A — Docker Compose (closest to how it'd actually deploy)

```bash
docker compose up --build
```

- Frontend: http://localhost:8080
- Backend docs: http://localhost:8000/docs

### Option B — locally, for development

```bash
# backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# frontend, in a second terminal
cd frontend
npm install
npm run dev
```

- Frontend dev server: http://localhost:5173 (proxies API calls to :8000)
- Backend: http://localhost:8000

The SQLite database is created and seeded automatically on first run —
nothing to configure.

## API

| Endpoint | What it does |
|---|---|
| `GET /organizations` | List orgs. Optional `org_type`, `focus_area`, `climate_approach`, and `search` (matches name or city) query params |
| `GET /organizations/{id}` | Single org |
| `POST /organizations/import-csv` | Bulk-import orgs from a CSV file (multipart upload). See `sample-import.csv` for the expected columns and a ready-to-use example |
| `POST /organizations/reset-demo` | Delete every org and restore the original demo set. Exposed in the UI as "Reset to demo data" |
| `GET /coverage-gaps` | Grid cells with no nearby orgs. Optional `grid_size` (degrees, default 0.5) |
| `GET /stats` | Counts by type, focus area, climate approach, and staff size. Takes the same filter params as `/organizations`, so the stats and charts always describe the current selection |

## Known limitations (said out loud on purpose)

- **Coverage-gap detection is a naive grid scan**, not a real geospatial
  index. An empty cell only counts as a gap if a neighbouring cell has
  organizations in it — without that rule the overlay flags open ocean and
  everything past the edge of the data, which buries the cases worth
  looking at. That neighbour test is a heuristic standing in for population
  data, not a substitute for it: a cell can still be mostly water, and the
  grid knows nothing about who lives where. At real scale I'd reach for
  PostGIS or a k-d tree for actual nearest-neighbour distance, weighted by
  population, instead of fixed grid cells. The
  endpoint refuses a `grid_size` that would produce more than 5,000 cells
  over the current data extent, rather than returning a rectangle list no
  browser can draw.
- **Coordinates are validated on import, but nothing else is.** Rows whose
  lat/lng aren't finite and on the globe are skipped and reported — without
  that check a single `inf` row would stretch the coverage-gap bounding box
  until the request never finished. Names, cities, and websites are still
  taken as given.
- **The schema is inferred from GCC's published charts, not from their real
  export.** `climate_approach` and the staff bands were reverse-engineered
  from the percentages they report; the real survey almost certainly has
  fields and free-text answers this doesn't model. It would need a look at
  an actual export before it could be trusted.
- **`focus_area` filtering happens in Python**, not SQL, because SQLite's
  JSON querying is awkward. Fine at this scale; at a few thousand rows I'd
  normalize `focus_areas` into a proper join table.
- **The write endpoints have no auth** — anyone who can reach the API can
  add rows, and `POST /organizations/reset-demo` will happily delete
  everything. That's acceptable for a local demo and clearly not for a
  deployment; both endpoints would need at minimum an admin token, and the
  reset almost certainly shouldn't exist outside a demo build at all.
- **The API can create and read, but not update or delete individual
  rows.** Fixing a typo in one organization's name means resetting the
  whole dataset. The write side is a prototype.
- **The import is additive only** — there's no de-duplication, so importing
  the same file twice creates duplicate rows. A real version would match on
  something like name + city before inserting.
