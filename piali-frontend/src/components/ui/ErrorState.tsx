import Link from "next/link";
import { GRADIENT } from "@/lib/constants";

type Props = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  homeLink?: boolean;
};

/**
 * Mensaje de error amigable. Presentacional: puede usarse dentro de un
 * `error.tsx` (boundary) pasándole `onRetry`, o de forma estática.
 */
export default function ErrorState({
  title = "Algo salió mal",
  message = "No pudimos cargar la información en este momento. Por favor intenta de nuevo en unos segundos.",
  onRetry,
  homeLink = true,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "80px 24px",
        color: "#fff",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(233,30,140,0.15), rgba(139,92,246,0.15))",
          border: "1px solid rgba(233,30,140,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
          marginBottom: "20px",
        }}
      >
        ⚠️
      </div>
      <h2 style={{ fontSize: "20px", fontWeight: 900, marginBottom: "8px" }}>{title}</h2>
      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", maxWidth: "420px", lineHeight: 1.7, marginBottom: "28px" }}>
        {message}
      </p>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{ background: GRADIENT, color: "#fff", fontWeight: 800, fontSize: "14px", padding: "12px 28px", borderRadius: "999px", border: "none", cursor: "pointer", fontFamily: "'Nunito', sans-serif" }}
          >
            Reintentar
          </button>
        )}
        {homeLink && (
          <Link
            href="/"
            style={{ background: "transparent", color: "#fff", fontWeight: 800, fontSize: "14px", padding: "12px 28px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.25)", textDecoration: "none" }}
          >
            Volver al inicio
          </Link>
        )}
      </div>
    </div>
  );
}
