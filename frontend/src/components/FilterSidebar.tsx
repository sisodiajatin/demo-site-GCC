import type { CSSProperties } from "react";
import { ORG_TYPES, FOCUS_AREAS, type OrgType, type FocusArea } from "../types";
import { CsvImport } from "./CsvImport";

interface Props {
  search: string;
  orgType: OrgType | "";
  focusArea: FocusArea | "";
  showGaps: boolean;
  view: "map" | "list";
  onSearchChange: (v: string) => void;
  onOrgTypeChange: (v: OrgType | "") => void;
  onFocusAreaChange: (v: FocusArea | "") => void;
  onShowGapsChange: (v: boolean) => void;
  onViewChange: (v: "map" | "list") => void;
  onImported: () => void;
}

export function FilterSidebar({
  search,
  orgType,
  focusArea,
  showGaps,
  view,
  onSearchChange,
  onOrgTypeChange,
  onFocusAreaChange,
  onShowGapsChange,
  onViewChange,
  onImported,
}: Props) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.viewToggle}>
        <button
          style={{ ...styles.toggleBtn, ...(view === "map" ? styles.toggleBtnActive : {}) }}
          onClick={() => onViewChange("map")}
        >
          Map
        </button>
        <button
          style={{ ...styles.toggleBtn, ...(view === "list" ? styles.toggleBtnActive : {}) }}
          onClick={() => onViewChange("list")}
        >
          List
        </button>
      </div>

      <label style={styles.label}>
        Search
        <input
          type="text"
          style={styles.select}
          placeholder="Name or city..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>

      <label style={styles.label}>
        Type
        <select
          style={styles.select}
          value={orgType}
          onChange={(e) => onOrgTypeChange(e.target.value as OrgType | "")}
        >
          <option value="">All types</option>
          {ORG_TYPES.map((t) => (
            <option key={t} value={t}>
              {t[0].toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </label>

      <label style={styles.label}>
        Focus area
        <select
          style={styles.select}
          value={focusArea}
          onChange={(e) => onFocusAreaChange(e.target.value as FocusArea | "")}
        >
          <option value="">All focus areas</option>
          {FOCUS_AREAS.map((f) => (
            <option key={f} value={f}>
              {f[0].toUpperCase() + f.slice(1)}
            </option>
          ))}
        </select>
      </label>

      {view === "map" && (
        <label style={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={showGaps}
            onChange={(e) => onShowGapsChange(e.target.checked)}
          />
          Show coverage gaps
        </label>
      )}

      <p style={styles.note}>
        Coverage gaps are grid cells with no respondents nearby — a rough stand-in for what GCC
        calls "climate resource deserts."
      </p>

      <CsvImport onImported={onImported} />
    </aside>
  );
}

const styles: Record<string, CSSProperties> = {
  sidebar: {
    width: 240,
    flexShrink: 0,
    padding: 20,
    background: "var(--surface)",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  viewToggle: {
    display: "flex",
    background: "var(--bg)",
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  toggleBtn: {
    flex: 1,
    padding: "6px 0",
    border: "none",
    borderRadius: 6,
    background: "transparent",
    color: "var(--ink-muted)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  toggleBtnActive: {
    background: "var(--surface)",
    color: "var(--forest)",
    boxShadow: "var(--shadow)",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    color: "var(--ink-muted)",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  select: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    fontSize: 14,
    fontWeight: 400,
    textTransform: "none",
    letterSpacing: "normal",
    color: "var(--ink)",
    background: "var(--surface)",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "var(--ink)",
  },
  note: {
    fontSize: 12,
    color: "var(--ink-muted)",
    lineHeight: 1.5,
    marginTop: "auto",
  },
};
