"use client";

// ─────────────────────────────────────────────────────────────────────────────
// TourModal — crear o editar un tour
// Los campos están agrupados en 4 secciones para que el formulario
// no se sienta abrumador:
//   1. Info básica  (nombre, tipo, dificultad, destacado/disponible)
//   2. Destino y logística  (destinationId, transporte, salida)
//   3. Precios y duración
//   4. Contenido  (descripción, imagen, incluye, no incluye, itinerario)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import type { Tour } from "@/types/tour";
import type { Destination } from "@/types/destination";
import type { TourPayload } from "@/lib/api/tours.api";

const TOUR_TYPES = ["CULTURAL", "AVENTURA", "GASTRONOMICO", "NATURALEZA", "HISTORICO", "OTRO"];
const DIFFICULTY_LEVELS = ["FACIL", "MODERADO", "DIFICIL"];
const TRANSPORT_TYPES = ["CARRO","AUTOBUS", "VAN", "AVION", "MIXTO"];

const TOUR_TYPE_LABEL: Record<string, string> = {
  CULTURAL: "Cultural", AVENTURA: "Aventura", GASTRONOMICO: "Gastronómico",
  NATURALEZA: "Naturaleza", HISTORICO: "Histórico", OTRO: "Otro",
};
const DIFFICULTY_LABEL: Record<string, string> = {
  FACIL: "Fácil", MODERADO: "Moderado", DIFICIL: "Difícil",
};
const TRANSPORT_LABEL: Record<string, string> = {
  CARRO: "Carro", AUTOBUS: "Autobús", VAN: "Van", AVION: "Avión", MIXTO: "Mixto",
};

const EMPTY_FORM: TourPayload = {
  destinationId: 0,
  name: "",
  description: "",
  imageUrl: "",
  tourType: "CULTURAL",
  difficultyLevel: "FACIL",
  pricePerPerson: 0,
  childPrice: 0,
  durationDays: 1,
  nights: 0,
  minGroupSize: 1,
  maxGroupSize: 20,
  departurePoint: "",
  transportType: "CARRO",
  includes: "",
  notIncludes: "",
  itinerary: "",
  available: true,
  featured: false,
};

interface Props {
  tour?: Tour;
  destinations: Destination[];   // para el select de destino
  onSave: (payload: TourPayload) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function TourModal({ tour, destinations, onSave, onCancel, loading }: Props) {
  const [form, setForm] = useState<TourPayload>(
    tour ? tourToPayload(tour) : EMPTY_FORM
  );
  const [errors, setErrors] = useState<Partial<Record<keyof TourPayload, string>>>({});

  useEffect(() => {
    if (tour) setForm(tourToPayload(tour));
  }, [tour]);

  function set<K extends keyof TourPayload>(key: K, value: TourPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.name.trim())         e.name = "Obligatorio";
    if (!form.description.trim())  e.description = "Obligatorio";
    if (form.destinationId === 0)  e.destinationId = "Selecciona un destino";
    if (form.pricePerPerson <= 0)  e.pricePerPerson = "Debe ser mayor a 0";
    if (form.durationDays < 1)     e.durationDays = "Mínimo 1 día";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    console.log("📦 form antes de enviar:", form.featured, form.available);
    await onSave(form);
  }

  const isEdit = Boolean(tour);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.75)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "24px", overflowY: "auto",
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#13131f",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px", padding: "32px",
          width: "100%", maxWidth: "640px",
          margin: "auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 900, marginBottom: "4px" }}>
              {isEdit ? "Editar tour" : "Nuevo tour"}
            </h2>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
              {isEdit ? `Modificando: ${tour!.name}` : "Completa los datos del tour"}
            </p>
          </div>
          <button onClick={onCancel} style={closeBtnStyle}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* ── Sección 1: Info básica ── */}
          <Section title="Información básica">
            <Field label="Nombre del tour" error={errors.name} required>
              <input value={form.name} onChange={(e) => set("name", e.target.value)}
                placeholder="Ej. Pueblos Mágicos de Querétaro" style={inp(!!errors.name)} />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Field label="Tipo de tour" error={errors.tourType}>
                <select value={form.tourType} onChange={(e) => set("tourType", e.target.value)}
                  style={{ ...inp(false), cursor: "pointer" }}>
                  {TOUR_TYPES.map((t) => (
                    <option key={t} value={t} style={{ background: "#1a1a2e" }}>{TOUR_TYPE_LABEL[t]}</option>
                  ))}
                </select>
              </Field>
              <Field label="Dificultad" error={errors.difficultyLevel}>
                <select value={form.difficultyLevel} onChange={(e) => set("difficultyLevel", e.target.value)}
                  style={{ ...inp(false), cursor: "pointer" }}>
                  {DIFFICULTY_LEVELS.map((d) => (
                    <option key={d} value={d} style={{ background: "#1a1a2e" }}>{DIFFICULTY_LABEL[d]}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Toggles: disponible y destacado */}
            <div style={{ display: "flex", gap: "20px" }}>
              <Toggle label="Disponible" value={form.available} onChange={(v) => set("available", v)} />
              <Toggle label="Destacado en home" value={form.featured} onChange={(v) => set("featured", v)} />
            </div>
          </Section>

          {/* ── Sección 2: Destino y logística ── */}
          <Section title="Destino y logística">
            <Field label="Destino" error={errors.destinationId} required>
              <select
                value={form.destinationId}
                onChange={(e) => set("destinationId", Number(e.target.value))}
                style={{ ...inp(!!errors.destinationId), cursor: "pointer" }}
              >
                <option value={0} style={{ background: "#1a1a2e" }}>Selecciona un destino...</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.id} style={{ background: "#1a1a2e" }}>{d.name}</option>
                ))}
              </select>
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Field label="Tipo de transporte">
                <select value={form.transportType} onChange={(e) => set("transportType", e.target.value)}
                  style={{ ...inp(false), cursor: "pointer" }}>
                  {TRANSPORT_TYPES.map((t) => (
                    <option key={t} value={t} style={{ background: "#1a1a2e" }}>{TRANSPORT_LABEL[t]}</option>
                  ))}
                </select>
              </Field>
              <Field label="Punto de salida">
                <input value={form.departurePoint} onChange={(e) => set("departurePoint", e.target.value)}
                  placeholder="Ej. Metro Observatorio" style={inp(false)} />
              </Field>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px" }}>
              <Field label="Días" error={errors.durationDays} required>
                <input type="number" min={1} value={form.durationDays}
                  onChange={(e) => set("durationDays", Number(e.target.value))} style={inp(!!errors.durationDays)} />
              </Field>
              <Field label="Noches">
                <input type="number" min={0} value={form.nights}
                  onChange={(e) => set("nights", Number(e.target.value))} style={inp(false)} />
              </Field>
              <Field label="Min. personas">
                <input type="number" min={1} value={form.minGroupSize}
                  onChange={(e) => set("minGroupSize", Number(e.target.value))} style={inp(false)} />
              </Field>
              <Field label="Máx. personas">
                <input type="number" min={1} value={form.maxGroupSize}
                  onChange={(e) => set("maxGroupSize", Number(e.target.value))} style={inp(false)} />
              </Field>
            </div>
          </Section>

          {/* ── Sección 3: Precios ── */}
          <Section title="Precios">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Field label="Precio por persona (MXN)" error={errors.pricePerPerson} required>
                <input type="number" min={0} value={form.pricePerPerson}
                  onChange={(e) => set("pricePerPerson", Number(e.target.value))}
                  placeholder="Ej. 1500" style={inp(!!errors.pricePerPerson)} />
              </Field>
              <Field label="Precio niño (MXN)">
                <input type="number" min={0} value={form.childPrice}
                  onChange={(e) => set("childPrice", Number(e.target.value))}
                  placeholder="Ej. 900" style={inp(false)} />
              </Field>
            </div>
          </Section>

          {/* ── Sección 4: Contenido ── */}
          <Section title="Contenido">
            <Field label="URL de imagen">
              <input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)}
                placeholder="https://..." style={inp(false)} />
              {form.imageUrl && (
                <img src={form.imageUrl} alt="preview"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                  style={{ marginTop: "8px", width: "100%", height: "110px", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)" }} />
              )}
            </Field>

            <Field label="Descripción" error={errors.description} required>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
                placeholder="Describe el tour..." rows={3}
                style={{ ...inp(!!errors.description), resize: "vertical" }} />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Field label="Incluye">
                <textarea value={form.includes} onChange={(e) => set("includes", e.target.value)}
                  placeholder="Transporte, guía, desayuno..." rows={3}
                  style={{ ...inp(false), resize: "vertical" }} />
              </Field>
              <Field label="No incluye">
                <textarea value={form.notIncludes} onChange={(e) => set("notIncludes", e.target.value)}
                  placeholder="Gastos personales..." rows={3}
                  style={{ ...inp(false), resize: "vertical" }} />
              </Field>
            </div>

            <Field label="Itinerario">
              <textarea value={form.itinerary} onChange={(e) => set("itinerary", e.target.value)}
                placeholder="Día 1: Salida a las 7am..." rows={4}
                style={{ ...inp(false), resize: "vertical" }} />
            </Field>
          </Section>
        </div>

        {/* Botones */}
        <div style={{ display: "flex", gap: "10px", marginTop: "28px" }}>
          <button onClick={onCancel} disabled={loading} style={cancelBtnStyle}>Cancelar</button>
          <button onClick={handleSubmit} disabled={loading} style={submitBtnStyle(loading)}>
            {loading ? (
              <>
                <Spinner />
                {isEdit ? "Guardando..." : "Creando..."}
              </>
            ) : (isEdit ? "Guardar cambios" : "Crear tour")}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function tourToPayload(tour: Tour): TourPayload {
  return {
    destinationId: tour.destination.id,
    name: tour.name,
    description: tour.description,
    imageUrl: tour.imageUrl,
    tourType: tour.tourType,
    difficultyLevel: tour.difficultyLevel,
    pricePerPerson: tour.pricePerPerson,
    childPrice: tour.childPrice,
    durationDays: tour.durationDays,
    nights: tour.nights,
    minGroupSize: tour.minGroupSize,
    maxGroupSize: tour.maxGroupSize,
    departurePoint: tour.departurePoint,
    transportType: tour.transportType,
    includes: tour.includes,
    notIncludes: tour.notIncludes,
    itinerary: tour.itinerary,
    available: tour.available,
    featured: tour.featured,
  };
}

function inp(hasError: boolean): React.CSSProperties {
  return {
    width: "100%", background: "rgba(255,255,255,0.05)",
    border: `1px solid ${hasError ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: "10px", padding: "11px 14px",
    fontSize: "14px", color: "#fff", outline: "none",
    boxSizing: "border-box", fontFamily: "'Nunito', sans-serif",
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: "11px", fontWeight: 800, color: "rgba(233,30,140,0.7)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
        {title}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children, error, required }: { label: string; children: React.ReactNode; error?: string; required?: boolean }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}{required && <span style={{ color: "#e91e8c", marginLeft: "3px" }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: "11px", color: "#fca5a5", marginTop: "4px" }}>⚠ {error}</p>}
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        display: "flex", alignItems: "center", gap: "8px",
        background: "none", border: "none", cursor: "pointer",
        padding: 0, fontFamily: "'Nunito', sans-serif",
      }}
    >
      <div style={{
        width: "36px", height: "20px", borderRadius: "999px",
        background: value ? "linear-gradient(90deg,#e91e8c,#8b5cf6)" : "rgba(255,255,255,0.1)",
        position: "relative", transition: "background 0.2s", flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", top: "3px",
          left: value ? "19px" : "3px",
          width: "14px", height: "14px",
          borderRadius: "50%", background: "#fff",
          transition: "left 0.2s",
        }} />
      </div>
      <span style={{ fontSize: "13px", color: value ? "#fff" : "rgba(255,255,255,0.4)", fontWeight: 700 }}>
        {label}
      </span>
    </button>
  );
}

function Spinner() {
  return (
    <span style={{
      width: "14px", height: "14px",
      border: "2px solid rgba(255,255,255,0.3)",
      borderTopColor: "#fff", borderRadius: "50%",
      display: "inline-block", animation: "spin 0.7s linear infinite",
    }} />
  );
}

const closeBtnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px", color: "rgba(255,255,255,0.5)", cursor: "pointer",
  width: "32px", height: "32px", fontSize: "16px",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontFamily: "monospace",
};

const cancelBtnStyle: React.CSSProperties = {
  flex: 1, padding: "13px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px", color: "rgba(255,255,255,0.6)",
  fontSize: "14px", fontWeight: 700,
  cursor: "pointer", fontFamily: "'Nunito', sans-serif",
};

function submitBtnStyle(loading: boolean): React.CSSProperties {
  return {
    flex: 2, padding: "13px",
    background: loading ? "rgba(233,30,140,0.3)" : "linear-gradient(135deg,#e91e8c,#8b5cf6)",
    border: "none", borderRadius: "10px",
    color: "#fff", fontSize: "14px", fontWeight: 800,
    cursor: loading ? "not-allowed" : "pointer",
    fontFamily: "'Nunito', sans-serif",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
  };
}