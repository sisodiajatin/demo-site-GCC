import type { CSSProperties } from "react";
import type { Stats } from "../types";

interface Props {
  stats: Stats | null;
}

const TYPE_LABELS: Record<string, string> = {
  organization: "Organizations",
  municipality: "Municipalities",
  committee: "Committees",
  individual: "Individuals",
};

export function StatsBar({ stats }: Props) {
  if (!stats) return null;

  const topFocus = Object.entries(stats.by_focus).sort((a, b) => b[1] - a[1]);

  return (
    <div style={styles.bar}>
      <div style={styles.totalBlock}>
        <span style={styles.totalNumber}>{stats.total}</span>
        <span style={styles.totalLabel}>respondents shown</span>
      </div>

      <div style={styles.divider} />

      <div style={styles.group}>
        {Object.entries(stats.by_type).map(([type, count]) => (
          <div key={type} style={styles.pill}>
            <span style={styles.pillCount}>{count}</span>
            <span style={styles.pillLabel}>{TYPE_LABELS[type] ?? type}</span>
          </div>
        ))}
      </div>

      <div style={styles.divider} />

      <div style={styles.group}>
        {topFocus.slice(0, 4).map(([focus, count]) => (
          <div key={focus} style={styles.focusPill}>
            {focus} <strong>{count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  bar: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    padding: "12px 20px",
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
    flexWrap: "wrap",
  },
  totalBlock: { display: "flex", flexDirection: "column", lineHeight: 1.1 },
  totalNumber: { fontSize: 22, fontWeight: 700, color: "var(--forest)" },
  totalLabel: { fontSize: 12, color: "var(--ink-muted)" },
  divider: { width: 1, height: 28, background: "var(--border)" },
  group: { display: "flex", gap: 10, flexWrap: "wrap" },
  pill: {
    display: "flex",
    alignItems: "baseline",
    gap: 6,
    padding: "4px 10px",
    background: "var(--forest-light)",
    borderRadius: 999,
    fontSize: 12,
  },
  pillCount: { fontWeight: 700, color: "var(--forest)" },
  pillLabel: { color: "var(--ink)" },
  focusPill: {
    padding: "4px 10px",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: 999,
    fontSize: 12,
    textTransform: "capitalize",
    color: "var(--ink-muted)",
  },
};
