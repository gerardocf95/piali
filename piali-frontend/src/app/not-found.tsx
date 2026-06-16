import Link from "next/link";
import { GRADIENT } from "@/lib/constants";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0a0f",
        color: "#fff",
        fontFamily: "'Nunito', sans-serif",
        paddingTop: "64px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "120px 32px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decoración de fondo */}
      <div style={{ position: "absolute", top: "-150px", right: "-150px", width: "420px", height: "420px", borderRadius: "50%", background: "radial-gradient(circle, rgba(233,30,140,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-150px", left: "-150px", width: "420px", height: "420px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <p style={{ fontSize: "clamp(80px, 18vw, 160px)", fontWeight: 900, lineHeight: 1, background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          404
        </p>
        <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, marginBottom: "12px" }}>
          Este destino no está en el mapa
        </h1>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)", maxWidth: "440px", lineHeight: 1.7, marginBottom: "36px" }}>
          La página que buscas no existe o cambió de lugar. Pero México tiene muchos rincones mágicos
          esperándote.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/" style={{ background: GRADIENT, color: "#fff", fontWeight: 800, fontSize: "14px", padding: "14px 32px", borderRadius: "999px", textDecoration: "none" }}>
            Volver al inicio
          </Link>
          <Link href="/tours" style={{ background: "transparent", color: "#fff", fontWeight: 800, fontSize: "14px", padding: "14px 32px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.25)", textDecoration: "none" }}>
            Ver tours
          </Link>
          <Link href="/destinations" style={{ background: "transparent", color: "#fff", fontWeight: 800, fontSize: "14px", padding: "14px 32px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.25)", textDecoration: "none" }}>
            Ver destinos
          </Link>
        </div>
      </div>
    </main>
  );
}
