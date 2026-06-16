"use client";

import { useMemo, useState } from "react";
import type { Tour, TourType } from "@/types/tour";
import TourGridCard from "./TourGridCard";
import { GRADIENT, TOUR_TYPE_LABEL } from "@/lib/constants";

const TYPE_OPTIONS: { value: TourType | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todos" },
  { value: "CULTURAL", label: TOUR_TYPE_LABEL.CULTURAL },
  { value: "AVENTURA", label: TOUR_TYPE_LABEL.AVENTURA },
  { value: "GASTRONOMICO", label: TOUR_TYPE_LABEL.GASTRONOMICO },
  { value: "NATURALEZA", label: TOUR_TYPE_LABEL.NATURALEZA },
  { value: "HISTORICO", label: TOUR_TYPE_LABEL.HISTORICO },
];

export default function ToursExplorer({ tours }: { tours: Tour[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TourType | "ALL">("ALL");

  // Solo mostramos tipos que realmente existen entre los tours
  const availableTypes = useMemo(() => {
    const set = new Set(tours.map((t) => t.tourType));
    return TYPE_OPTIONS.filter((o) => o.value === "ALL" || set.has(o.value as TourType));
  }, [tours]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tours.filter((t) => {
      const matchesType = type === "ALL" || t.tourType === type;
      const matchesQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.destination?.name?.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }, [tours, query, type]);

  return (
    <>
      {/* ── Barra de filtros ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o destino…"
          style={{
            flex: "1 1 260px",
            minWidth: "200px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "999px",
            padding: "12px 20px",
            color: "#fff",
            fontSize: "14px",
            fontFamily: "'Nunito', sans-serif",
            outline: "none",
          }}
        />
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {availableTypes.map((opt) => {
            const active = type === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setType(opt.value)}
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  padding: "9px 18px",
                  borderRadius: "999px",
                  cursor: "pointer",
                  color: active ? "#fff" : "rgba(255,255,255,0.6)",
                  background: active ? GRADIENT : "rgba(255,255,255,0.05)",
                  border: active ? "1px solid transparent" : "1px solid rgba(255,255,255,0.12)",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Resultados ── */}
      {filtered.length > 0 ? (
        <>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "20px" }}>
            {filtered.length} tour{filtered.length !== 1 ? "s" : ""} disponible{filtered.length !== 1 ? "s" : ""}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
            {filtered.map((tour) => (
              <TourGridCard key={tour.id} tour={tour} />
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(255,255,255,0.4)" }}>
          <p style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</p>
          <p style={{ fontSize: "15px", fontWeight: 700, marginBottom: "6px", color: "rgba(255,255,255,0.7)" }}>
            No encontramos tours con esos filtros
          </p>
          <p style={{ fontSize: "13px" }}>Prueba con otra búsqueda o cambia el tipo de experiencia.</p>
        </div>
      )}
    </>
  );
}
