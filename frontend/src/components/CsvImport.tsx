import { useRef, useState, type CSSProperties } from "react";

interface Props {
  onImported: () => void;
}

interface ImportResult {
  imported: number;
  skipped: number;
  errors: { row: number; reason: string }[];
}

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

export function CsvImport({ onImported }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${BASE_URL}/organizations/import-csv`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`Import failed: ${res.status} ${res.statusText}`);
      const data: ImportResult = await res.json();
      setResult(data);
      onImported();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.label}>Import CSV</div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileSelected}
        disabled={uploading}
        style={styles.fileInput}
      />
      {uploading && <p style={styles.status}>Importing…</p>}
      {result && (
        <p style={{ ...styles.status, color: "var(--forest)" }}>
          {result.imported} imported
          {result.skipped > 0 ? `, ${result.skipped} skipped` : ""}
          {result.errors.length > 0 && (
            <>
              <br />
              {result.errors.slice(0, 3).map((e, i) => (
                <span key={i} style={styles.errLine}>
                  Row {e.row}: {e.reason}
                  <br />
                </span>
              ))}
            </>
          )}
        </p>
      )}
      {error && <p style={{ ...styles.status, color: "#a23b1a" }}>{error}</p>}
      <p style={styles.hint}>
        Columns: name, org_type, latitude, longitude, city, state, focus_areas, age_years,
        staff_size, climate_approach, barriers, mission_summary, website. Use ";" to separate
        multiple focus areas or barriers in one cell. climate_approach is mitigation, adaptation,
        or both.
      </p>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: {
    borderTop: "1px solid var(--border)",
    paddingTop: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--ink-muted)",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  fileInput: { fontSize: 12, width: "100%" },
  status: { fontSize: 12, margin: 0, lineHeight: 1.5 },
  errLine: { color: "var(--ink-muted)" },
  hint: { fontSize: 11, color: "var(--ink-muted)", lineHeight: 1.5, margin: 0 },
};
