from sqlalchemy import Column, Integer, String, Float, JSON
from .database import Base


class Organization(Base):
    """
    A community-level climate/sustainability org, municipality, committee,
    or individual respondent. Field choices deliberately mirror the
    categories used in Green Community Catalysts' own Localized Climate
    Action Initiative survey (org_type, focus_areas, barriers) so seeded
    demo data reads the same way their real survey data would.
    """

    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    # organization | municipality | committee | individual
    org_type = Column(String, index=True, nullable=False)

    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)

    # subset of: energy, food, transportation, waste, economics, environmental
    focus_areas = Column(JSON, default=list)

    age_years = Column(Integer, nullable=True)

    # "1-5" | "6+"
    staff_size = Column(String, nullable=True)

    # mitigation | adaptation | both -- the split GCC's own published analysis
    # leads with ("67.5% mitigation-focused"), so the dashboard can reproduce
    # that chart instead of only counting things they don't report on.
    climate_approach = Column(String, index=True, nullable=True)

    # subset of: staffing, funding, community_engagement, other
    barriers = Column(JSON, default=list)

    mission_summary = Column(String, nullable=True)
    website = Column(String, nullable=True)
