import { useState, type CSSProperties } from "react";
import { CLIMATE_APPROACHES, STAFF_SIZES } from "../types";
import type { Stats } from "../types";

interface Props {
  stats: Stats | null;
}

interface Segment {
  key: string;
  label: string;
  count: number;
  color: string;
}

/**
 * Reproduces the two splits GCC's own published survey analysis leads with --
 * mitigation vs adaptation, and staff size -- except recomputed from whatever
 * is currently filtered instead of re-exported by hand as a chart image.
 *
 * Chart colours live in index.css. Approach is nominal categorical (three
 * distinct hues); staff size is ordinal (one hue, light to dark), because
 * "1-5" then "6+" is a tier and the colour should carry that order.
 */
export function AnalysisView({ stats }: Props) {
  const [asTable, setAsTable] = useState(false);

  if (!stats) return <p style={styles.empty}>Loading…</p>;

  if (stats.total === 0) {
    return <p style={styles.empty}>No organizations match the current filters.</p>;
  }

  const approach: Segment[] = CLIMATE_APPROACHES.map((key, i) => ({
    key,
    label: key === "both" ? "Both" : key[0].toUpperCase() + key.slice(1),
    count: stats.by_approach[key] ?? 0,
    color: [`var(--cat-1)`, `var(--cat-2)`, `var(--cat-3)`][i],
  }));

  const staff: Segment[] = STAFF_SIZES.map((key, i) => ({
    key,
    label: key === "1-5" ? "1–5 staff" : "6+ staff",
    count: stats.by_staff_size[key] ?? 0,
    color: [`var(--seq-low)`, `var(--seq-high)`][i],
  }));

  return (
    <div style={styles.wrap}>
      <header style={styles.head}>
        <div>
          <h2 style={styles.title}>Survey analysis</h2>
          <p style={styles.subtitle}>
            Recomputed live from the {stats.total} organization
            {stats.total === 1 ? "" : "s"} currently shown — change a filter or import a
            CSV and these update with it.
          </p>
        </div>
        <button
          type="button"
          style={styles.toggle}
          onClick={() => setAsTable((v) => !v)}
          aria-pressed={asTable}
        >
          {asTable ? "Show charts" : "Show table"}
        </button>
      </header>

      {asTable ? (
        <>
          <DataTable caption="Climate approach" segments={approach} />
          <DataTable caption="Staff size" segments={staff} />
        </>
      ) : (
        <>
          <Chart
            title="Mitigation vs. adaptation"
            note="The split GCC's published analysis leads with."
            heroKey="mitigation"
            heroSuffix="mitigation-focused"
            segments={approach}
          />
          <Chart
            title="Staff size"
            note="Capacity of responding organizations."
            heroKey="6+"
            heroSuffix="have 6+ staff"
            segments={staff}
          />
        </>
      )}
    </div>
  );
}

function Chart({
  title,
  note,
  heroKey,
  heroSuffix,
  segments,
}: {
  title: string;
  note: string;
  heroKey: string;
  heroSuffix: string;
  segments: Segment[];
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  // Denominator is the rows that actually answered, not every row -- an import
  // with the column left blank shouldn't silently inflate the percentage.
  const answered = segments.reduce((sum, s) => sum + s.count, 0);
  const hero = segments.find((s) => s.key === heroKey)?.count ?? 0;
  const pct = (n: number) => (answered === 0 ? 0 : (n / answered) * 100);

  if (answered === 0) {
    return (
      <section style={styles.card}>
        <h3 style={styles.chartTitle}>{title}</h3>
        <p style={styles.noData}>No organizations in this selection reported this field.</p>
      </section>
    );
  }

  const visible = segments.filter((s) => s.count > 0);

  return (
    <section style={styles.card}>
      <h3 style={styles.chartTitle}>{title}</h3>
      <p style={styles.chartNote}>{note}</p>

      <p style={styles.hero}>
        {pct(hero).toFixed(1)}%
        <span style={styles.heroSuffix}>{heroSuffix}</span>
      </p>

      <div style={styles.bar} role="img" aria-label={`${title}: ${segments
        .map((s) => `${s.label} ${s.count}`)
        .join(", ")}`}>
        {visible.map((s, i) => (
          <div
            key={s.key}
            title={`${s.label}: ${s.count} of ${answered} (${pct(s.count).toFixed(1)}%)`}
            onMouseEnter={() => setHovered(s.key)}
            onMouseLeave={() => setHovered(null)}
            style={{
              flexGrow: s.count,
              flexBasis: 0,
              minWidth: 3,
              background: s.color,
              height: "100%",
              // 4px rounding on the outer ends only, so the bar reads as one
              // measure rather than a row of separate pills.
              borderTopLeftRadius: i === 0 ? 4 : 0,
              borderBottomLeftRadius: i === 0 ? 4 : 0,
              borderTopRightRadius: i === visible.length - 1 ? 4 : 0,
              borderBottomRightRadius: i === visible.length - 1 ? 4 : 0,
              opacity: hovered === null || hovered === s.key ? 1 : 0.45,
              transition: "opacity 120ms ease",
              cursor: "default",
            }}
          />
        ))}
      </div>

      {/* Every value is permanently visible here, not hidden behind a hover --
          required relief because the aqua slot sits under 3:1 on white. */}
      <ul style={styles.legend}>
        {segments.map((s) => (
          <li
            key={s.key}
            style={{
              ...styles.legendItem,
              opacity: hovered === null || hovered === s.key ? 1 : 0.5,
            }}
            onMouseEnter={() => setHovered(s.key)}
            onMouseLeave={() => setHovered(null)}
          >
            <span style={{ ...styles.swatch, background: s.color }} aria-hidden="true" />
            <span style={styles.legendLabel}>{s.label}</span>
            <span style={styles.legendValue}>{s.count}</span>
            <span style={styles.legendPct}>{pct(s.count).toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DataTable({ caption, segments }: { caption: string; segments: Segment[] }) {
  const answered = segments.reduce((sum, s) => sum + s.count, 0);
  return (
    <section style={styles.card}>
      <h3 style={styles.chartTitle}>{caption}</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Category</th>
            <th style={{ ...styles.th, textAlign: "right" }}>Count</th>
            <th style={{ ...styles.th, textAlign: "right" }}>Share</th>
          </tr>
        </thead>
        <tbody>
          {segments.map((s) => (
            <tr key={s.key}>
              <td style={styles.td}>{s.label}</td>
              <td style={{ ...styles.td, ...styles.numeric }}>{s.count}</td>
              <td style={{ ...styles.td, ...styles.numeric }}>
                {answered === 0 ? "—" : `${((s.count / answered) * 100).toFixed(1)}%`}
              </td>
            </tr>
          ))}
          <tr>
            <td style={{ ...styles.td, ...styles.totalCell }}>Reported</td>
            <td style={{ ...styles.td, ...styles.numeric, ...styles.totalCell }}>{answered}</td>
            <td style={{ ...styles.td, ...styles.numeric, ...styles.totalCell }}>100.0%</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: {
    height: "100%",
    overflowY: "auto",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  head: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 },
  title: { margin: 0, fontSize: 18, fontWeight: 700, color: "var(--ink)" },
  subtitle: { margin: "4px 0 0", fontSize: 13, color: "var(--ink-muted)", maxWidth: "60ch" },
  toggle: {
    flexShrink: 0,
    padding: "6px 12px",
    border: "1px solid var(--border)",
    borderRadius: 8,
    background: "var(--surface)",
    color: "var(--ink)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: 18,
    maxWidth: 720,
    boxShadow: "var(--shadow)",
  },
  chartTitle: { margin: 0, fontSize: 14, fontWeight: 700, color: "var(--ink)" },
  chartNote: { margin: "2px 0 14px", fontSize: 12, color: "var(--ink-muted)" },
  hero: {
    margin: "0 0 12px",
    fontSize: 48,
    lineHeight: 1,
    fontWeight: 700,
    color: "var(--ink)",
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "-0.02em",
  },
  heroSuffix: {
    fontSize: 14,
    fontWeight: 500,
    color: "var(--ink-muted)",
    letterSpacing: 0,
    marginLeft: 10,
  },
  // 2px gap renders the page surface between segments, so adjacent fills stay
  // separable without a border darkening either colour.
  bar: { display: "flex", gap: 2, height: 28, width: "100%", marginBottom: 14 },
  legend: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexWrap: "wrap",
    gap: "6px 22px",
  },
  legendItem: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, transition: "opacity 120ms ease" },
  swatch: { width: 10, height: 10, borderRadius: 2, flexShrink: 0 },
  legendLabel: { color: "var(--ink)" },
  legendValue: { color: "var(--ink)", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  legendPct: { color: "var(--ink-muted)", fontVariantNumeric: "tabular-nums" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 10 },
  th: {
    textAlign: "left",
    padding: "8px 10px",
    borderBottom: "1px solid var(--border)",
    color: "var(--ink-muted)",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    fontWeight: 600,
  },
  td: { padding: "8px 10px", borderBottom: "1px solid var(--border)", color: "var(--ink)" },
  numeric: { textAlign: "right", fontVariantNumeric: "tabular-nums" },
  totalCell: { fontWeight: 700, borderBottom: "none" },
  empty: { padding: 20, color: "var(--ink-muted)" },
  noData: { margin: 0, fontSize: 13, color: "var(--ink-muted)" },
};
