from pydantic import BaseModel, ConfigDict


class OrganizationBase(BaseModel):
    name: str
    org_type: str
    latitude: float
    longitude: float
    city: str
    state: str
    focus_areas: list[str] = []
    age_years: int | None = None
    staff_size: str | None = None
    climate_approach: str | None = None
    barriers: list[str] = []
    mission_summary: str | None = None
    website: str | None = None


class OrganizationOut(OrganizationBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class CoverageGap(BaseModel):
    lat: float
    lng: float
    size: float


class StatsOut(BaseModel):
    total: int
    by_focus: dict[str, int]
    by_type: dict[str, int]
    by_approach: dict[str, int]
    by_staff_size: dict[str, int]
