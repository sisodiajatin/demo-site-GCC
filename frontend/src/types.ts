export type OrgType = "organization" | "municipality" | "committee" | "individual";

export type FocusArea =
  | "energy"
  | "food"
  | "transportation"
  | "waste"
  | "economics"
  | "environmental";

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
  staff_size: "1-5" | "6+" | null;
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
