import type { Metadata } from "next";
import { getDestinations } from "@/lib/api/destinations.api";
import DestinationsExplorer from "@/components/features/destinations/DestinationsExplorer";
import { GRADIENT } from "@/lib/constants";

// Render dinámico: los datos dependen del backend en tiempo de petición.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Destinos — Pueblos Mágicos de México",
  description:
    "Descubre los pueblos mágicos y destinos que Piali tiene para ti: cada rincón de México con su historia, distancia desde CDMX y los tours disponibles.",
  alternates: { canonical: "/destinations" },
  openGraph: {
    title: "Destinos | Piali",
    description: "Cada destino guarda una historia. Explora los pueblos mágicos de México.",
  },
};

export default async function DestinationsPage() {
  // Si el backend falla, dejamos que el error se propague al error.tsx de la ruta.
  const destinations = await getDestinations();

  return (
    <main style={{ backgroundColor: "#0a0a0f", color: "#fff", fontFamily: "'Nunito', sans-serif", paddingTop: "64px", minHeight: "100vh" }}>
      {/* ── Encabezado ── */}
      <section style={{ padding: "64px 48px 32px", textAlign: "center" }}>
        <span style={{ display: "inline-block", fontSize: "11px", padding: "4px 16px", borderRadius: "999px", border: "1px solid rgba(139,92,246,0.4)", background: "rgba(139,92,246,0.15)", color: "#a78bfa", marginBottom: "16px" }}>
          Destinos
        </span>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, marginBottom: "12px" }}>
          Pueblos{" "}
          <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Mágicos
          </span>
        </h1>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
          Cada destino guarda una historia. Explora los lugares que conforman las experiencias de Piali.
        </p>
      </section>

      {/* ── Contenido ── */}
      <section style={{ padding: "0 48px 96px", maxWidth: "1200px", margin: "0 auto" }}>
        {destinations.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(255,255,255,0.4)" }}>
            <p style={{ fontSize: "40px", marginBottom: "12px" }}>🏞️</p>
            <p style={{ fontSize: "15px", fontWeight: 700, marginBottom: "6px", color: "rgba(255,255,255,0.7)" }}>
              Aún no hay destinos publicados
            </p>
            <p style={{ fontSize: "13px" }}>Vuelve pronto: estamos sumando nuevos rincones de México.</p>
          </div>
        ) : (
          <DestinationsExplorer destinations={destinations} />
        )}
      </section>
    </main>
  );
}
