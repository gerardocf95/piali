"use client";

import { useState } from "react";
import type { Tour } from "@/types/tour";
import type { Destination } from "@/types/destination";
import { createTour, updateTour, deleteTour, type TourPayload } from "@/lib/api/tours.api";
import TourModal from "./TourModal";
import DeleteConfirmModal from "../../destinations/_components/DeleteConfirmModal";

const GRADIENT = "linear-gradient(90deg, #e91e8c, #8b5cf6)";

const TOUR_TYPE_LABEL: Record<string, string> = {
  CULTURAL: "Cultural", AVENTURA: "Aventura", GASTRONOMICO: "Gastronómico",
  NATURALEZA: "Naturaleza", HISTORICO: "Histórico", OTRO: "Otro",
};
const DIFFICULTY_LABEL: Record<string, string> = {
  FACIL: "Fácil", MODERADO: "Moderado", DIFICIL: "Difícil",
};

interface Props {
  initialTours: Tour[];
  destinations: Destination[];
}

export default function ToursTable({ initialTours, destinations }: Props) {
  const [tours, setTours] = useState<Tour[]>(initialTours);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalMode, setModalMode] = useState<null | "create" | "edit">(null);
  const [editing, setEditing] = useState<Tour | null>(null);
  const [deletingTour, setDeletingTour] = useState<Tour | null>(null);

  const [search, setSearch] = useState("");
  const filtered = tours.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.destination?.state?.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() { setEditing(null); setModalMode("create"); setError(null); }
  function openEdit(tour: Tour) { setEditing(tour); setModalMode("edit"); setError(null); }
  function closeModal() { setModalMode(null); setEditing(null); }

  async function handleSave(payload: TourPayload) {
    setLoading(true);
    setError(null);
    try {
      if (modalMode === "create") {
        const created = await createTour(payload);
        setTours((prev) => [created, ...prev]);
      } else if (modalMode === "edit" && editing) {
        const updated = await updateTour(editing.id, payload);
        setTours((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      }
      closeModal();
    } catch (e: unknown) {
      setError(`No se pudo guardar: ${e instanceof Error ? e.message : "Error desconocido"}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingTour) return;
    setLoading(true);
    try {
      await deleteTour(deletingTour.id);
      setTours((prev) => prev.filter((t) => t.id !== deletingTour.id));
      setDeletingTour(null);
    } catch (e: unknown) {
      setError(`No se pudo eliminar: ${e instanceof Error ? e.message : "Error desconocido"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Barra superior */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍  Buscar por nombre o estado..."
          style={{
            flex: 1, minWidth: "200px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px", padding: "10px 14px",
            fontSize: "13px", color: "#fff", outline: "none",
            fontFamily: "'Nunito', sans-serif",
          }}
        />
        <button
          onClick={openCreate}
          style={{
            background: GRADIENT, border: "none", borderRadius: "10px",
            color: "#fff", fontWeight: 800, fontSize: "13px",
            padding: "10px 22px", cursor: "pointer",
            fontFamily: "'Nunito', sans-serif", whiteSpace: "nowrap",
          }}
        >
          + Nuevo tour
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: "10px", padding: "12px 16px", marginBottom: "16px",
          display: "flex", alignItems: "center", gap: "8px",
          fontSize: "13px", color: "#fca5a5",
        }}>
          ⚠️ {error}
          <button onClick={() => setError(null)}
            style={{ marginLeft: "auto", background: "none", border: "none", color: "#fca5a5", cursor: "pointer", fontSize: "16px" }}>
            ×
          </button>
        </div>
      )}

      {/* Tabla */}
      <div style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>
        {/* Encabezado */}
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1fr 120px",
          padding: "12px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          fontSize: "11px", fontWeight: 700,
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase", letterSpacing: "0.06em",
        }}>
          <span>Tour</span>
          <span>Destino</span>
          <span>Tipo</span>
          <span>Precio</span>
          <span>Duración</span>
          <span style={{ textAlign: "right" }}>Acciones</span>
        </div>

        {/* Filas */}
        {filtered.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "14px" }}>
            {search ? "No hay resultados para esa búsqueda" : "No hay tours registrados aún"}
          </div>
        ) : (
          filtered.map((tour, i) => (
            <div
              key={tour.id}
              style={{
                display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1fr 120px",
                padding: "14px 20px", alignItems: "center",
                borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {/* Columna 1: imagen + nombre */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                {tour.imageUrl ? (
                  <img src={tour.imageUrl} alt={tour.name}
                    style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "8px",
                    background: "rgba(233,30,140,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px", flexShrink: 0,
                  }}>🗺️</div>
                )}
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 800, fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {tour.name}
                  </p>
                  <div style={{ display: "flex", gap: "4px", marginTop: "3px" }}>
                    <Badge color="rgba(233,30,140,0.15)" border="rgba(233,30,140,0.25)" text={tour.available ? "Disponible" : "No disponible"} textColor={tour.available ? "#f472b6" : "rgba(255,255,255,0.3)"} />
                    {tour.featured && <Badge color="rgba(251,191,36,0.1)" border="rgba(251,191,36,0.2)" text="Destacado" textColor="#fbbf24" />}
                  </div>
                </div>
              </div>

              {/* Columna 2: destino */}
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                📍 {tour.destination?.name ?? "—"}
              </span>

              {/* Columna 3: tipo + dificultad */}
              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                <span style={{ fontSize: "11px", color: "#a78bfa" }}>{TOUR_TYPE_LABEL[tour.tourType] ?? tour.tourType}</span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{DIFFICULTY_LABEL[tour.difficultyLevel] ?? tour.difficultyLevel}</span>
              </div>

              {/* Columna 4: precio */}
              <span style={{ fontSize: "13px", fontWeight: 800, color: "#e91e8c" }}>
                {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(tour.pricePerPerson)}
              </span>

              {/* Columna 5: duración */}
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>
                ⏱ {tour.durationDays} día{tour.durationDays > 1 ? "s" : ""}
              </span>

              {/* Columna 6: acciones */}
              <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                <ActionBtn label="✏️" title="Editar" onClick={() => openEdit(tour)} color="rgba(255,255,255,0.07)" />
                <ActionBtn label="🗑️" title="Eliminar" onClick={() => setDeletingTour(tour)}
                  color="rgba(239,68,68,0.1)" hoverColor="rgba(239,68,68,0.2)" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Conteo */}
      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", marginTop: "12px", textAlign: "right" }}>
        {filtered.length} de {tours.length} tour{tours.length !== 1 ? "s" : ""}
      </p>

      {/* Modales */}
      {modalMode !== null && (
        <TourModal
          tour={modalMode === "edit" && editing ? editing : undefined}
          destinations={destinations}
          onSave={handleSave}
          onCancel={closeModal}
          loading={loading}
        />
      )}

      {deletingTour && (
        <DeleteConfirmModal
          name={deletingTour.name}
          onConfirm={handleDelete}
          onCancel={() => setDeletingTour(null)}
          loading={loading}
        />
      )}
    </>
  );
}

function Badge({ color, border, text, textColor }: { color: string; border: string; text: string; textColor: string }) {
  return (
    <span style={{
      fontSize: "10px", padding: "2px 7px", borderRadius: "999px",
      background: color, border: `1px solid ${border}`, color: textColor, fontWeight: 700,
    }}>
      {text}
    </span>
  );
}

function ActionBtn({ label, title, onClick, color, hoverColor }: {
  label: string; title: string; onClick: () => void; color: string; hoverColor?: string;
}) {
  return (
    <button onClick={onClick} title={title} style={{
      background: color, border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "7px", width: "32px", height: "32px",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "14px", cursor: "pointer", transition: "background 0.15s",
    }}
      onMouseEnter={(e) => { if (hoverColor) e.currentTarget.style.background = hoverColor; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = color; }}
    >
      {label}
    </button>
  );
}