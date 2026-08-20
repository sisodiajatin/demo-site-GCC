import type { CSSProperties } from "react";
import type { Organization } from "../types";

interface Props {
  organizations: Organization[];
}

export function OrgListView({ organizations }: Props) {
  return (
    <div style={styles.wrap}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Location</th>
            <th style={styles.th}>Focus areas</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((org) => (
            <tr key={org.id} style={styles.tr}>
              <td style={styles.td}>
                <div style={{ fontWeight: 600 }}>{org.name}</div>
                {org.mission_summary && (
                  <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>
                    {org.mission_summary}
                  </div>
                )}
              </td>
              <td style={{ ...styles.td, textTransform: "capitalize" }}>{org.org_type}</td>
              <td style={styles.td}>
                {org.city}, {org.state}
              </td>
              <td style={{ ...styles.td, textTransform: "capitalize" }}>
                {org.focus_areas.join(", ") || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {organizations.length === 0 && (
        <p style={{ padding: 20, color: "var(--ink-muted)" }}>
          No organizations match the current filters.
        </p>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { flex: 1, overflow: "auto", background: "var(--surface)" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: {
    textAlign: "left",
    padding: "10px 16px",
    borderBottom: "1px solid var(--border)",
    color: "var(--ink-muted)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    position: "sticky",
    top: 0,
    background: "var(--surface)",
  },
  tr: { borderBottom: "1px solid var(--border)" },
  td: { padding: "10px 16px", verticalAlign: "top" },
};
