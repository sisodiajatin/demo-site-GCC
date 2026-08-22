import { useState, type CSSProperties } from "react";
import { resetDemoData } from "../api";

interface Props {
  onReset: () => void;
}

/**
 * Restores the original demo set after a CSV import.
 *
 * Without this the only way back to a known state is `docker compose down`,
 * and every other way of stopping the stack -- `stop`, `restart`, a reboot,
 * Docker Desktop closing -- silently keeps the imported rows, because the
 * SQLite file lives inside the container.
 */
export function ResetDemoData({ onReset }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReset() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const result = await resetDemoData();
      setMessage(`Removed ${result.removed}, restored ${result.seeded}.`);
      onReset();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.label}>Demo data</div>

      {confirming ? (
        <>
          <p style={styles.warn}>
            This deletes every organization, including anything imported, and restores the
            original demo set.
          </p>
          <div style={styles.row}>
            <button
              type="button"
              style={{ ...styles.btn, ...styles.btnDanger }}
              onClick={handleReset}
              disabled={busy}
            >
              {busy ? "Resetting…" : "Yes, reset"}
            </button>
            <button
              type="button"
              style={styles.btn}
              onClick={() => setConfirming(false)}
              disabled={busy}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <button type="button" style={styles.btn} onClick={() => setConfirming(true)}>
          Reset to demo data
        </button>
      )}

      {message && <p style={{ ...styles.status, color: "var(--forest)" }}>{message}</p>}
      {error && <p style={{ ...styles.status, color: "#a23b1a" }}>{error}</p>}
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
  row: { display: "flex", gap: 8 },
  btn: {
    padding: "6px 12px",
    border: "1px solid var(--border)",
    borderRadius: 8,
    background: "var(--surface)",
    color: "var(--ink)",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  btnDanger: { borderColor: "var(--gap-amber)", color: "var(--gap-amber)" },
  warn: { fontSize: 11, color: "var(--ink-muted)", lineHeight: 1.5, margin: 0 },
  status: { fontSize: 12, margin: 0, lineHeight: 1.5 },
};
