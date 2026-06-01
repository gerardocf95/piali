import { getDestinations } from "@/lib/api/destinations.api";
import type { Destination } from "@/types/destination";
import DestinationsTable from "./_components/DestinationsTable";

const GRADIENT = "linear-gradient(90deg, #e91e8c, #8b5cf6)";

export default async function AdminDestinationsPage() {
  const destinations = await getDestinations().catch((e) => {
    console.error("❌ AdminDestinations:", e.message);
    return [] as Destination[];
  });

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", maxWidth: "1100px" }}>
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <span style={{ fontSize: "22px" }}>📍</span>
          <h1 style={{ fontSize: "22px", fontWeight: 900 }}>Destinos</h1>
        </div>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
          Gestiona los destinos disponibles para tus tours
          {" · "}
          <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 800 }}>
            {destinations.length} registrado{destinations.length !== 1 ? "s" : ""}
          </span>
        </p>
      </div>

      <DestinationsTable initialDestinations={destinations} />
    </div>
  );
}