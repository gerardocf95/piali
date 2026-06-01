"use client";

// ─────────────────────────────────────────────────────────────────────────────
// DestinationsTable — Client Component
//
// Recibe la lista inicial del Server Component (page.tsx) para evitar
// el flash de "cargando..." en el primer render. Luego gestiona el estado
// local de la lista para que las operaciones CRUD actualicen la UI
// instantáneamente sin hacer un full-page refresh.
//
// Flujo de cada operación:
//   Crear  → abre modal vacío → onSave → POST → agrega al array local → cierra
//   Editar → abre modal con datos → onSave → PUT → reemplaza en array → cierra
//   Borrar → abre confirmación → onConfirm → DELETE → elimina del array → cierra
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import type { Destination } from "@/types/destination";
import {
  createDestination,
  updateDestination,
  deleteDestination,
  type DestinationPayload,
} from "@/lib/api/destinations.api";
import DestinationModal from "./DestinationModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

const GRADIENT = "linear-gradient(90deg, #e91e8c, #8b5cf6)";

// Convierte "ESTADO_DE_MEXICO" → "Estado De Mexico"
function formatState(raw: string) {
  return raw.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

interface Props {
  initialDestinations: Destination[];
}

export default function DestinationsTable({ initialDestinations }: Props) {
  // ── Estado principal ──────────────────────────────────────────────────────
  const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Estado de modales ─────────────────────────────────────────────────────
  // modalMode: null = cerrado, "create" = crear, "edit" = editar
  const [modalMode, setModalMode] = useState<null | "create" | "edit">(null);
  const [editing, setEditing] = useState<Destination | null>(null);
  const [deletingDestination, setDeletingDestination] = useState<Destination | null>(null);

  // ── Búsqueda local ────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const filtered = destinations.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.state.toLowerCase().includes(search.toLowerCase())
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  function openCreate() {
    setEditing(null);
    setModalMode("create");
    setError(null);
  }

  function openEdit(dest: Destination) {
    setEditing(dest);
    setModalMode("edit");
    setError(null);
  }

  function closeModal() {
    setModalMode(null);
    setEditing(null);
  }

  // Crear o editar según el modo actual
  async function handleSave(payload: DestinationPayload) {
    setLoading(true);
    setError(null);
    try {
      if (modalMode === "create") {
        const created = await createDestination(payload);
        // Agrega el nuevo destino al principio de la lista
        setDestinations((prev) => [created, ...prev]);
      } else if (modalMode === "edit" && editing) {
        const updated = await updateDestination(editing.id, payload);
        // Reemplaza el destino editado en la lista
        setDestinations((prev) =>
          prev.map((d) => (d.id === updated.id ? updated : d))
        );
      }
      closeModal();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      setError(`No se pudo guardar: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingDestination) return;
    setLoading(true);
    try {
      await deleteDestination(deletingDestination.id);
      // Elimina de la lista local
      setDestinations((prev) => prev.filter((d) => d.id !== deletingDestination.id));
      setDeletingDestination(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      setError(`No se pudo eliminar: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Barra superior: búsqueda + botón crear ── */}
      <div style={{
        display: "flex", gap: "12px", marginBottom: "20px",
        flexWrap: "wrap", alignItems: "center",
      }}>
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
            fontFamily: "'Nunito', sans-serif",
            display: "flex", alignItems: "center", gap: "6px",
            whiteSpace: "nowrap",
          }}
        >
          + Nuevo destino
        </button>
      </div>

      {/* ── Mensaje de error global ── */}
      {error && (
        <div style={{
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: "10px", padding: "12px 16px", marginBottom: "16px",
          display: "flex", alignItems: "center", gap: "8px",
          fontSize: "13px", color: "#fca5a5",
        }}>
          ⚠️ {error}
          <button
            onClick={() => setError(null)}
            style={{ marginLeft: "auto", background: "none", border: "none", color: "#fca5a5", cursor: "pointer", fontSize: "16px" }}
          >×</button>
        </div>
      )}

      {/* ── Tabla ── */}
      <div style={{
        background: "#13131f",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        overflow: "hidden",
      }}>
        {/* Encabezado */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.2fr 1fr 1fr 120px",
          padding: "12px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          fontSize: "11px", fontWeight: 700,
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase", letterSpacing: "0.06em",
        }}>
          <span>Destino</span>
          <span>Estado</span>
          <span>Distancia</span>
          <span>Precio base</span>
          <span style={{ textAlign: "right" }}>Acciones</span>
        </div>

        {/* Filas */}
        {filtered.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "14px" }}>
            {search ? "No hay resultados para esa búsqueda" : "No hay destinos registrados aún"}
          </div>
        ) : (
          filtered.map((dest, i) => (
            <div
              key={dest.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.2fr 1fr 1fr 120px",
                padding: "14px 20px",
                alignItems: "center",
                borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {/* Columna 1: imagen + nombre + descripción corta */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                {dest.imageUrl ? (
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
                  />
                ) : (
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "8px",
                    background: "rgba(233,30,140,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px", flexShrink: 0,
                  }}>📍</div>
                )}
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 800, fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {dest.name}
                  </p>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {dest.description}
                  </p>
                </div>
              </div>

              {/* Columna 2: estado */}
              <span style={{
                fontSize: "12px", padding: "3px 10px", borderRadius: "999px",
                background: "rgba(139,92,246,0.12)",
                border: "1px solid rgba(139,92,246,0.2)",
                color: "#a78bfa", fontWeight: 700,
                display: "inline-block", maxWidth: "fit-content",
              }}>
                {formatState(dest.state)}
              </span>

              {/* Columna 3: distancia */}
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>
                {dest.distanceKmFromCDMX} km
              </span>

              {/* Columna 4: precio */}
              <span style={{ fontSize: "13px", fontWeight: 800, color: "#e91e8c" }}>
                {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(dest.basePrice)}
              </span>

              {/* Columna 5: acciones */}
              <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                <ActionButton
                  label="✏️"
                  title="Editar"
                  onClick={() => openEdit(dest)}
                  color="rgba(255,255,255,0.07)"
                />
                <ActionButton
                  label="🗑️"
                  title="Eliminar"
                  onClick={() => setDeletingDestination(dest)}
                  color="rgba(239,68,68,0.1)"
                  hoverColor="rgba(239,68,68,0.2)"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Conteo */}
      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", marginTop: "12px", textAlign: "right" }}>
        {filtered.length} de {destinations.length} destino{destinations.length !== 1 ? "s" : ""}
      </p>

      {/* ── Modales ── */}
      {modalMode !== null && (
        <DestinationModal
          destination={modalMode === "edit" && editing ? editing : undefined}
          onSave={handleSave}
          onCancel={closeModal}
          loading={loading}
        />
      )}

      {deletingDestination && (
        <DeleteConfirmModal
          name={deletingDestination.name}
          onConfirm={handleDelete}
          onCancel={() => setDeletingDestination(null)}
          loading={loading}
        />
      )}
    </>
  );
}

// ── Pequeño botón de acción (editar / eliminar) ───────────────────────────────
function ActionButton({
  label, title, onClick, color, hoverColor,
}: {
  label: string; title: string; onClick: () => void;
  color: string; hoverColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
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