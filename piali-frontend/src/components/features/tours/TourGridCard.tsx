import Link from "next/link";
import type { Tour } from "@/types/tour";
import { formatPrice } from "@/lib/utils";
import { GRADIENT, DIFFICULTY_LABEL, tourTypeLabel, stateLabel } from "@/lib/constants";

/**
 * Tarjeta de tour con el diseño del home (estilos inline).
 * Reutilizable en el listado /tours y en el detalle de un destino.
 */
export default function TourGridCard({ tour }: { tour: Tour }) {
  return (
    <Link href={`/tours/${tour.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div
        style={{
          background: "#13131f",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div style={{ height: "200px", position: "relative", background: "#1a1a2e", overflow: "hidden" }}>
          {tour.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tour.imageUrl} alt={tour.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
          <span style={{ position: "absolute", top: "12px", left: "12px", background: GRADIENT, color: "#fff", fontSize: "11px", fontWeight: 800, padding: "4px 12px", borderRadius: "999px" }}>
            {formatPrice(tour.pricePerPerson)}
          </span>
          {!tour.available && (
            <span style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.7)", color: "rgba(255,255,255,0.85)", fontSize: "10px", fontWeight: 700, padding: "4px 10px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.15)" }}>
              Agotado
            </span>
          )}
          <span style={{ position: "absolute", bottom: "12px", left: "12px", fontSize: "12px", color: "rgba(255,255,255,0.85)", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
            📍 {tour.destination ? stateLabel(tour.destination.state) : "México"}
          </span>
        </div>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
          <h3 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "8px" }}>{tour.name}</h3>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "12px", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {tour.description}
          </p>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
            <span style={{ fontSize: "10px", padding: "3px 10px", borderRadius: "999px", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.1)" }}>
              {tourTypeLabel(tour.tourType)}
            </span>
            <span style={{ fontSize: "10px", padding: "3px 10px", borderRadius: "999px", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.1)" }}>
              {DIFFICULTY_LABEL[tour.difficultyLevel] ?? tour.difficultyLevel}
            </span>
          </div>
          <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
              ⏱ {tour.durationDays} día{tour.durationDays > 1 ? "s" : ""}
            </span>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#e91e8c" }}>Ver Detalles →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
