import { useEffect, useState, type CSSProperties } from "react";
import { FilterSidebar } from "./components/FilterSidebar";
import { MapView } from "./components/MapView";
import { OrgListView } from "./components/OrgListView";
import { StatsBar } from "./components/StatsBar";
import { fetchOrganizations, fetchCoverageGaps, fetchStats } from "./api";
import type { Organization, CoverageGap, Stats, OrgType, FocusArea } from "./types";

export default function App() {
  const [search, setSearch] = useState("");
  const [orgType, setOrgType] = useState<OrgType | "">("");
  const [focusArea, setFocusArea] = useState<FocusArea | "">("");
  const [showGaps, setShowGaps] = useState(true);
  const [view, setView] = useState<"map" | "list">("map");

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [gaps, setGaps] = useState<CoverageGap[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Orgs and stats always move together, so they load together -- otherwise
  // the stats bar keeps describing a selection the map has moved on from.
  function loadSelection() {
    const filters = {
      orgType: orgType || undefined,
      focusArea: focusArea || undefined,
      search: search || undefined,
    };
    fetchOrganizations(filters).then(setOrganizations).catch((e) => setError(String(e)));
    fetchStats(filters).then(setStats).catch((e) => setError(String(e)));
  }

  // Coverage gaps describe the whole dataset's reach, not the current
  // filter, so they only reload when the underlying data changes.
  function loadGaps() {
    fetchCoverageGaps().then(setGaps).catch((e) => setError(String(e)));
  }

  function refetchAll() {
    loadSelection();
    loadGaps();
  }

  useEffect(() => {
    loadSelection();
  }, [orgType, focusArea, search]);

  useEffect(() => {
    loadGaps();
  }, []);

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>Climate Organizations Map</h1>
        <p style={styles.subtitle}>
          Prototype for Green Community Catalysts' Localized Climate Action Initiative — demo
          data only
        </p>
      </header>

      <StatsBar stats={stats} />

      {error && <div style={styles.error}>{error} — is the backend running on port 8000?</div>}

      <div style={styles.body}>
        <FilterSidebar
          search={search}
          orgType={orgType}
          focusArea={focusArea}
          showGaps={showGaps}
          view={view}
          onSearchChange={setSearch}
          onOrgTypeChange={setOrgType}
          onFocusAreaChange={setFocusArea}
          onShowGapsChange={setShowGaps}
          onViewChange={setView}
          onImported={refetchAll}
        />

        <main style={styles.main}>
          {view === "map" ? (
            <MapView organizations={organizations} gaps={gaps} showGaps={showGaps} />
          ) : (
            <OrgListView organizations={organizations} />
          )}
        </main>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  app: { height: "100vh", display: "flex", flexDirection: "column" },
  header: {
    padding: "16px 20px 4px",
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
  },
  title: { margin: 0, fontSize: 20, fontWeight: 700, color: "var(--ink)" },
  subtitle: { margin: "4px 0 12px", fontSize: 13, color: "var(--ink-muted)" },
  body: { flex: 1, display: "flex", minHeight: 0 },
  main: { flex: 1, position: "relative" },
  error: {
    padding: "8px 20px",
    background: "#f8e6da",
    color: "#7a3b1a",
    fontSize: 13,
  },
};
