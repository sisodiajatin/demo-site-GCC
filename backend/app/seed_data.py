"""
DEMO DATA ONLY.

These are fictional organizations invented for this prototype. None of
this is drawn from Green Community Catalysts' real Localized Climate
Action Initiative survey responses -- that data belongs to their real
respondents. Town names and coordinates are real (New England, mirroring
GCC's actual geographic focus); org names and details are made up.
"""

DEMO_ORGANIZATIONS = [
    {"name": "North Shore Climate Alliance", "org_type": "organization",
     "latitude": 42.5584, "longitude": -70.8801, "city": "Beverly", "state": "MA",
     "focus_areas": ["energy", "transportation"], "age_years": 6, "staff_size": "6+",
     "barriers": ["funding"], "mission_summary": "Residential engagement and clean energy outreach on the North Shore.",
     "website": "https://example.org/north-shore-climate"},

    {"name": "Salem Sustainability Network", "org_type": "organization",
     "latitude": 42.5195, "longitude": -70.8967, "city": "Salem", "state": "MA",
     "focus_areas": ["waste", "food"], "age_years": 4, "staff_size": "1-5",
     "barriers": ["staffing", "community_engagement"], "mission_summary": "Composting and low-waste living programs for Salem households.",
     "website": None},

    {"name": "Marblehead Green Committee", "org_type": "committee",
     "latitude": 42.5001, "longitude": -70.8578, "city": "Marblehead", "state": "MA",
     "focus_areas": ["energy"], "age_years": 9, "staff_size": "1-5",
     "barriers": ["funding", "staffing"], "mission_summary": "Town-appointed committee advising on municipal energy policy.",
     "website": None},

    {"name": "Cape Ann Resilience Project", "org_type": "organization",
     "latitude": 42.6159, "longitude": -70.6620, "city": "Gloucester", "state": "MA",
     "focus_areas": ["environmental", "economics"], "age_years": 3, "staff_size": "1-5",
     "barriers": ["funding"], "mission_summary": "Coastal resilience planning and blue-economy workforce programs.",
     "website": "https://example.org/cape-ann-resilience"},

    {"name": "Lynn Climate Action Collaborative", "org_type": "organization",
     "latitude": 42.4668, "longitude": -70.9495, "city": "Lynn", "state": "MA",
     "focus_areas": ["energy", "transportation", "environmental"], "age_years": 2, "staff_size": "1-5",
     "barriers": ["funding", "community_engagement"], "mission_summary": "Equity-focused climate organizing in Lynn's residential neighborhoods.",
     "website": None},

    {"name": "Cambridge Office of Sustainability", "org_type": "municipality",
     "latitude": 42.3736, "longitude": -71.1097, "city": "Cambridge", "state": "MA",
     "focus_areas": ["energy", "waste", "transportation", "environmental"], "age_years": 14, "staff_size": "6+",
     "barriers": ["community_engagement"], "mission_summary": "City department coordinating Cambridge's net-zero action plan.",
     "website": "https://example.gov/cambridge-sustainability"},

    {"name": "Worcester County Clean Energy Coalition", "org_type": "organization",
     "latitude": 42.2626, "longitude": -71.8023, "city": "Worcester", "state": "MA",
     "focus_areas": ["energy", "economics"], "age_years": 7, "staff_size": "6+",
     "barriers": ["staffing"], "mission_summary": "Solar and weatherization access programs across Worcester County.",
     "website": "https://example.org/worcester-clean-energy"},

    {"name": "Pioneer Valley Sustainability Hub", "org_type": "organization",
     "latitude": 42.3251, "longitude": -72.6412, "city": "Northampton", "state": "MA",
     "focus_areas": ["food", "waste", "economics"], "age_years": 11, "staff_size": "6+",
     "barriers": ["funding"], "mission_summary": "Local food systems and circular-economy programs in the Pioneer Valley.",
     "website": "https://example.org/pioneer-valley-hub"},

    {"name": "Berkshire Climate Collective", "org_type": "organization",
     "latitude": 42.4501, "longitude": -73.2454, "city": "Pittsfield", "state": "MA",
     "focus_areas": ["energy", "environmental"], "age_years": 5, "staff_size": "1-5",
     "barriers": ["funding", "staffing"], "mission_summary": "Rural weatherization and land conservation in the Berkshires.",
     "website": None},

    {"name": "Outer Cape Coastal Resilience", "org_type": "organization",
     "latitude": 42.0522, "longitude": -70.1786, "city": "Provincetown", "state": "MA",
     "focus_areas": ["environmental"], "age_years": 2, "staff_size": "1-5",
     "barriers": ["funding", "community_engagement"], "mission_summary": "Sea-level rise planning for Outer Cape towns.",
     "website": None},

    {"name": "MetroWest Climate Committee", "org_type": "committee",
     "latitude": 42.2793, "longitude": -71.4162, "city": "Framingham", "state": "MA",
     "focus_areas": ["transportation", "energy"], "age_years": 8, "staff_size": "1-5",
     "barriers": ["community_engagement"], "mission_summary": "Regional committee coordinating climate action across MetroWest towns.",
     "website": None},

    {"name": "Upper Valley Sustainable Futures", "org_type": "organization",
     "latitude": 43.6428, "longitude": -72.2518, "city": "Lebanon", "state": "NH",
     "focus_areas": ["energy", "food", "transportation"], "age_years": 6, "staff_size": "6+",
     "barriers": ["staffing"], "mission_summary": "Household engagement programs across the NH/VT Upper Valley.",
     "website": "https://example.org/upper-valley-futures"},

    {"name": "Hanover Energy Committee", "org_type": "committee",
     "latitude": 43.7022, "longitude": -72.2896, "city": "Hanover", "state": "NH",
     "focus_areas": ["energy"], "age_years": 12, "staff_size": "1-5",
     "barriers": ["funding"], "mission_summary": "Volunteer committee advising the town on energy efficiency.",
     "website": None},

    {"name": "City of Concord Sustainability Office", "org_type": "municipality",
     "latitude": 43.2081, "longitude": -71.5376, "city": "Concord", "state": "NH",
     "focus_areas": ["waste", "energy"], "age_years": 5, "staff_size": "1-5",
     "barriers": ["staffing", "funding"], "mission_summary": "Municipal office managing Concord's climate action plan.",
     "website": "https://example.gov/concord-sustainability"},

    {"name": "Seacoast Climate Network", "org_type": "organization",
     "latitude": 43.0718, "longitude": -70.7626, "city": "Portsmouth", "state": "NH",
     "focus_areas": ["environmental", "economics"], "age_years": 4, "staff_size": "1-5",
     "barriers": ["community_engagement"], "mission_summary": "Coastal advocacy and green-business network on the NH Seacoast.",
     "website": None},

    {"name": "Burlington Electric & Climate Dept", "org_type": "municipality",
     "latitude": 44.4759, "longitude": -73.2121, "city": "Burlington", "state": "VT",
     "focus_areas": ["energy", "transportation"], "age_years": 16, "staff_size": "6+",
     "barriers": ["community_engagement"], "mission_summary": "Municipal utility and climate office behind Burlington's net-zero energy goals.",
     "website": "https://example.gov/burlington-electric"},

    {"name": "Central Vermont Climate Action", "org_type": "organization",
     "latitude": 44.2601, "longitude": -72.5754, "city": "Montpelier", "state": "VT",
     "focus_areas": ["food", "energy"], "age_years": 9, "staff_size": "1-5",
     "barriers": ["funding"], "mission_summary": "Farm-to-table and home energy programs in central Vermont.",
     "website": None},

    {"name": "Windham County Green Alliance", "org_type": "organization",
     "latitude": 42.8509, "longitude": -72.5579, "city": "Brattleboro", "state": "VT",
     "focus_areas": ["waste", "environmental"], "age_years": 3, "staff_size": "1-5",
     "barriers": ["staffing", "funding"], "mission_summary": "Zero-waste and land-stewardship initiatives in Windham County.",
     "website": None},

    {"name": "Portland Sustainability Council", "org_type": "municipality",
     "latitude": 43.6591, "longitude": -70.2568, "city": "Portland", "state": "ME",
     "focus_areas": ["energy", "waste", "transportation"], "age_years": 10, "staff_size": "6+",
     "barriers": ["funding"], "mission_summary": "City council overseeing Portland's One Climate Future plan.",
     "website": "https://example.gov/portland-sustainability"},

    {"name": "Midcoast Maine Climate Collective", "org_type": "organization",
     "latitude": 44.1034, "longitude": -69.1089, "city": "Rockland", "state": "ME",
     "focus_areas": ["economics", "environmental"], "age_years": 5, "staff_size": "1-5",
     "barriers": ["community_engagement", "funding"], "mission_summary": "Working-waterfront resilience and creative-economy climate programs.",
     "website": None},

    {"name": "Acadia Region Sustainability Project", "org_type": "organization",
     "latitude": 44.3876, "longitude": -68.2039, "city": "Bar Harbor", "state": "ME",
     "focus_areas": ["environmental", "transportation"], "age_years": 7, "staff_size": "1-5",
     "barriers": ["funding"], "mission_summary": "Visitor-season transportation and conservation planning near Acadia.",
     "website": None},

    {"name": "Providence Climate Justice Coalition", "org_type": "organization",
     "latitude": 41.8240, "longitude": -71.4128, "city": "Providence", "state": "RI",
     "focus_areas": ["energy", "economics", "environmental"], "age_years": 6, "staff_size": "6+",
     "barriers": ["funding", "staffing"], "mission_summary": "Equity-centered climate organizing in Providence neighborhoods.",
     "website": "https://example.org/providence-climate-justice"},

    {"name": "Aquidneck Island Resilience Network", "org_type": "organization",
     "latitude": 41.4901, "longitude": -71.3128, "city": "Newport", "state": "RI",
     "focus_areas": ["environmental"], "age_years": 4, "staff_size": "1-5",
     "barriers": ["funding"], "mission_summary": "Coastal flooding resilience across Aquidneck Island towns.",
     "website": None},

    {"name": "New Haven Climate Movement", "org_type": "organization",
     "latitude": 41.3083, "longitude": -72.9279, "city": "New Haven", "state": "CT",
     "focus_areas": ["transportation", "energy"], "age_years": 8, "staff_size": "6+",
     "barriers": ["community_engagement"], "mission_summary": "Transit-oriented climate advocacy and youth organizing.",
     "website": "https://example.org/new-haven-climate"},

    {"name": "Capital Region Sustainability Alliance", "org_type": "organization",
     "latitude": 41.7658, "longitude": -72.6734, "city": "Hartford", "state": "CT",
     "focus_areas": ["energy", "waste"], "age_years": 5, "staff_size": "1-5",
     "barriers": ["staffing", "funding"], "mission_summary": "Weatherization and recycling access programs in greater Hartford.",
     "website": None},

    {"name": "Local sustainability advocate", "org_type": "individual",
     "latitude": 42.5259, "longitude": -70.8967, "city": "Salem", "state": "MA",
     "focus_areas": ["food"], "age_years": None, "staff_size": None,
     "barriers": ["community_engagement"], "mission_summary": "Individual respondent working on a neighborhood community-garden effort.",
     "website": None},

    {"name": "Local sustainability advocate", "org_type": "individual",
     "latitude": 41.8340, "longitude": -71.4300, "city": "Providence", "state": "RI",
     "focus_areas": ["transportation"], "age_years": None, "staff_size": None,
     "barriers": ["funding"], "mission_summary": "Individual respondent advocating for protected bike infrastructure.",
     "website": None},

    {"name": "Local sustainability advocate", "org_type": "individual",
     "latitude": 44.4859, "longitude": -73.2251, "city": "Burlington", "state": "VT",
     "focus_areas": ["energy"], "age_years": None, "staff_size": None,
     "barriers": ["staffing"], "mission_summary": "Individual respondent organizing a neighborhood solar co-op.",
     "website": None},
]
