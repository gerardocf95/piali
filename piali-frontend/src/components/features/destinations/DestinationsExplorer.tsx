"use client";

import { useMemo, useState } from "react";
import type { Destination } from "@/types/destination";
import { DestinationCard } from "./DestinationCard";
import { GRADIENT, stateLabel } from "@/lib/constants";

export default function DestinationsExplorer({ destinations }: { destinations: Destination[] }) {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<string>("ALL");

  // Estados presentes entre los destinos, ordenados alfabéticamente por su etiqueta
  const states = useMemo(() => {
    const set = new Set(destinations.map((d) => d.state));
    return Array.from(set).sort((a, b) => stateLabel(a).localeCompare(stateLabel(b)));
  }, [destinations]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return destinations.filter((d) => {
      const matchesState = state === "ALL" || d.state === state;
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        stateLabel(d.state).toLowerCase().includes(q);
      return matchesState && matchesQuery;
    });
  }, [destinations, query, state]);

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
          placeholder="Buscar destino o estado…"
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
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "999px",
            padding: "12px 20px",
            color: "#fff",
            fontSize: "14px",
            fontFamily: "'Nunito', sans-serif",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="ALL" style={{ background: "#13131f" }}>Todos los estados</option>
          {states.map((s) => (
            <option key={s} value={s} style={{ background: "#13131f" }}>
              {stateLabel(s)}
            </option>
          ))}
        </select>
      </div>

      {/* ── Resultados ── */}
      {filtered.length > 0 ? (
        <>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "20px" }}>
            {filtered.length} destino{filtered.length !== 1 ? "s" : ""}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
            {filtered.map((dest) => (
              <DestinationCard key={dest.id} dest={dest} />
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(255,255,255,0.4)" }}>
          <p style={{ fontSize: "40px", marginBottom: "12px", background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block" }}>🏞️</p>
          <p style={{ fontSize: "15px", fontWeight: 700, marginBottom: "6px", color: "rgba(255,255,255,0.7)" }}>
            No encontramos destinos
          </p>
          <p style={{ fontSize: "13px" }}>Prueba con otra búsqueda o cambia el estado.</p>
        </div>
      )}
    </>
  );
}
