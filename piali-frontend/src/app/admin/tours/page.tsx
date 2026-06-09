import { getAllTours } from "@/lib/api/tours.api";
import { getDestinations } from "@/lib/api/destinations.api";
import type { Tour } from "@/types/tour";
import type { Destination } from "@/types/destination";
import ToursTable from "./_components/ToursTable";

const GRADIENT = "linear-gradient(90deg, #e91e8c, #8b5cf6)";

export default async function AdminToursPage() {
  const [tours, destinations] = await Promise.all([
    getAllTours().catch((e) => { console.error("❌ tours:", e.message); return [] as Tour[]; }),
    // Necesitamos los destinos para el select del formulario
    getDestinations().catch((e) => { console.error("❌ destinations:", e.message); return [] as Destination[]; }),
  ]);

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", maxWidth: "1200px" }}>
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <span style={{ fontSize: "22px" }}>🗺️</span>
          <h1 style={{ fontSize: "22px", fontWeight: 900 }}>Tours</h1>
        </div>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
          Gestiona los tours disponibles para tus viajeros
          {" · "}
          <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 800 }}>
            {tours.length} registrado{tours.length !== 1 ? "s" : ""}
          </span>
        </p>
      </div>

      <ToursTable initialTours={tours} destinations={destinations} />
    </div>
  );
}