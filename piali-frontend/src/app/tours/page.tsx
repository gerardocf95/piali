import type { Metadata } from "next";
import { getAllTours } from "@/lib/api/tours.api";
import ToursExplorer from "@/components/features/tours/ToursExplorer";
import { GRADIENT } from "@/lib/constants";

// Render dinámico: los datos dependen del backend en tiempo de petición.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tours a Pueblos Mágicos",
  description:
    "Explora todos los tours de Piali a los pueblos mágicos de México: experiencias culturales, de aventura, gastronómicas y de naturaleza saliendo desde CDMX.",
  alternates: { canonical: "/tours" },
  openGraph: {
    title: "Tours a Pueblos Mágicos | Piali",
    description: "Encuentra la experiencia perfecta para tu próxima escapada por México.",
  },
};

export default async function ToursPage() {
  // Si el backend falla, dejamos que el error se propague al error.tsx de la ruta.
  const tours = await getAllTours();

  return (
    <main style={{ backgroundColor: "#0a0a0f", color: "#fff", fontFamily: "'Nunito', sans-serif", paddingTop: "64px", minHeight: "100vh" }}>
      {/* ── Encabezado ── */}
      <section style={{ padding: "64px 48px 32px", textAlign: "center" }}>
        <span style={{ display: "inline-block", fontSize: "11px", padding: "4px 16px", borderRadius: "999px", border: "1px solid rgba(139,92,246,0.4)", background: "rgba(139,92,246,0.15)", color: "#a78bfa", marginBottom: "16px" }}>
          Paquetes de Viaje
        </span>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, marginBottom: "12px" }}>
          Nuestros{" "}
          <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Tours
          </span>
        </h1>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
          Encuentra la experiencia perfecta para tu próxima escapada por los rincones más mágicos de México.
        </p>
      </section>

      {/* ── Contenido ── */}
      <section style={{ padding: "0 48px 96px", maxWidth: "1200px", margin: "0 auto" }}>
        {tours.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(255,255,255,0.4)" }}>
            <p style={{ fontSize: "40px", marginBottom: "12px" }}>🧳</p>
            <p style={{ fontSize: "15px", fontWeight: 700, marginBottom: "6px", color: "rgba(255,255,255,0.7)" }}>
              Aún no hay tours publicados
            </p>
            <p style={{ fontSize: "13px" }}>Vuelve pronto: estamos preparando nuevas experiencias.</p>
          </div>
        ) : (
          <ToursExplorer tours={tours} />
        )}
      </section>
    </main>
  );
}
