import type { Organization, CoverageGap, Stats } from "./types";

// In dev, Vite proxies /api -> http://localhost:8000 (see vite.config.ts).
// In the Docker build, nginx does the same proxying in front of the
// built static files. Either way the frontend only ever talks to /api.
const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Request to ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export interface OrgFilters {
  orgType?: string;
  focusArea?: string;
  search?: string;
}

// /organizations and /stats take the same filters, so they build the same
// query string -- that's what keeps the stats bar describing the rows the
// map is actually showing.
function filterQuery(filters: OrgFilters): string {
  const params = new URLSearchParams();
  if (filters.orgType) params.set("org_type", filters.orgType);
  if (filters.focusArea) params.set("focus_area", filters.focusArea);
  if (filters.search) params.set("search", filters.search);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchOrganizations(filters: OrgFilters): Promise<Organization[]> {
  return getJSON<Organization[]>(`/organizations${filterQuery(filters)}`);
}

export function fetchCoverageGaps(gridSize = 0.5): Promise<CoverageGap[]> {
  return getJSON<CoverageGap[]>(`/coverage-gaps?grid_size=${gridSize}`);
}

export function fetchStats(filters: OrgFilters = {}): Promise<Stats> {
  return getJSON<Stats>(`/stats${filterQuery(filters)}`);
}
