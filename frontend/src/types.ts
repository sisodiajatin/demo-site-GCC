export type OrgType = "organization" | "municipality" | "committee" | "individual";

export type FocusArea =
  | "energy"
  | "food"
  | "transportation"
  | "waste"
  | "economics"
  | "environmental";

// The split GCC's published survey analysis leads with.
export type ClimateApproach = "mitigation" | "adaptation" | "both";

export type StaffSize = "1-5" | "6+";

export interface Organization {
  id: number;
  name: string;
  org_type: OrgType;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  focus_areas: FocusArea[];
  age_years: number | null;
  staff_size: StaffSize | null;
  climate_approach: ClimateApproach | null;
  barriers: string[];
  mission_summary: string | null;
  website: string | null;
}

export interface CoverageGap {
  lat: number;
  lng: number;
  size: number;
}

export interface Stats {
  total: number;
  by_focus: Record<string, number>;
  by_type: Record<string, number>;
  by_approach: Record<string, number>;
  by_staff_size: Record<string, number>;
}

export const ORG_TYPES: OrgType[] = ["organization", "municipality", "committee", "individual"];

export const FOCUS_AREAS: FocusArea[] = [
  "energy",
  "food",
  "transportation",
  "waste",
  "economics",
  "environmental",
];

export type View = "map" | "list" | "analysis";

export const CLIMATE_APPROACHES: ClimateApproach[] = ["mitigation", "adaptation", "both"];

// Ordered smallest to largest -- staff size is a tier, not a set of labels,
// so the charts encode it with one hue getting darker rather than two hues.
export const STAFF_SIZES: StaffSize[] = ["1-5", "6+"];
