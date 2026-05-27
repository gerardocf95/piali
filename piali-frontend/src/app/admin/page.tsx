import Link from "next/link";
import { getDestinations } from "@/lib/api/destinations.api";
import { getFeaturedTours } from "@/lib/api/tours.api";
import { MetricCard } from "./_components/MetricCard";
import type { Destination } from "@/types/destination";
import type { Tour } from "@/types/tour";

const GRADIENT = "linear-gradient(90deg, #e91e8c, #8b5cf6)";

const TOUR_TYPE_LABEL: Record<string, string> = {
  CULTURAL:     "Cultural",
  AVENTURA:     "Aventura",
  GASTRONOMICO: "Gastronómico",
  NATURALEZA:   "Naturaleza",
  HISTORICO:    "Histórico",
};

// Convierte "ESTADO_DE_MEXICO" → "Estado de Mexico"
function formatState(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function AdminDashboardPage() {
  const [destinations, tours] = await Promise.all([
    getDestinations().catch(() => [] as Destination[]),
    getFeaturedTours().catch(() => [] as Tour[]),
  ]);

  const toursByType = tours.reduce<Record<string, number>>((acc, t) => {
    acc[t.tourType] = (acc[t.tourType] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", maxWidth: "1200px" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "4px" }}>Dashboard</h1>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
          Resumen general de tu agencia de viajes
        </p>
      </div>

      {/* ── Métricas ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "14px",
          marginBottom: "24px",
        }}
      >
        <MetricCard icon="📍" label="Destinos registrados" value={destinations.length} sub="En base de datos"   href="/admin/destinations" />
        <MetricCard icon="🗺️" label="Tours disponibles"    value={tours.length}        sub="Activos en el sitio" href="/admin/tours" />
        <MetricCard icon="⭐" label="Satisfacción"         value="100%"                sub="Basado en reseñas" />
        <MetricCard icon="✈️" label="Años de experiencia"  value="7+"                  sub="Desde 2018" />
      </div>

      {/* ── Fila inferior ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>

        {/* Últimos destinos */}
        <div
          style={{
            background: "#13131f",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "22px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 800 }}>Últimos destinos</h2>
            <Link href="/admin/destinations" style={{ fontSize: "11px", color: "#e91e8c", textDecoration: "none", fontWeight: 700 }}>
              Ver todos →
            </Link>
          </div>

          {destinations.length === 0 ? (
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)", textAlign: "center", padding: "24px 0" }}>
              Sin destinos aún
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {destinations.slice(0, 6).map((d) => (
                <div
                  key={d.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "9px 10px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  {d.imageUrl ? (
                    <img
                      src={d.imageUrl}
                      alt={d.name}
                      style={{ width: "34px", height: "34px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "34px", height: "34px", borderRadius: "8px",
                        background: "rgba(233,30,140,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "15px", flexShrink: 0,
                      }}
                    >
                      📍
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {d.name}
                    </p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
                      {d.state ? formatState(d.state) : "México"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tours por tipo */}
        <div
          style={{
            background: "#13131f",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "22px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 800 }}>Tours por tipo</h2>
            <Link href="/admin/tours" style={{ fontSize: "11px", color: "#e91e8c", textDecoration: "none", fontWeight: 700 }}>
              Ver todos →
            </Link>
          </div>

          {tours.length === 0 ? (
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)", textAlign: "center", padding: "24px 0" }}>
              Sin tours aún
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {Object.entries(toursByType).map(([type, count]) => {
                const pct = Math.round((count / tours.length) * 100);
                return (
                  <div key={type}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>
                        {TOUR_TYPE_LABEL[type] ?? type}
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: 800, color: "#f472b6" }}>
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div style={{ height: "5px", borderRadius: "999px", background: "rgba(255,255,255,0.07)" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: GRADIENT, borderRadius: "999px" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}