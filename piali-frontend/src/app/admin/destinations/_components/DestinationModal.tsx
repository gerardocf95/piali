"use client";

// ─────────────────────────────────────────────────────────────────────────────
// DestinationModal — crear o editar un destino
//
// Si recibe `destination` → modo edición (los campos se pre-rellenan)
// Si no recibe `destination` → modo creación (campos vacíos)
//
// onSave recibe el payload ya listo; el padre (DestinationsTable) llama a la
// API y luego cierra el modal si todo sale bien.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import type { Destination, MexicanState } from "@/types/destination";
import type { DestinationPayload } from "@/lib/api/destinations.api";

// Lista completa de estados mexicanos (viene de tu tipo MexicanState)
const MEXICAN_STATES: MexicanState[] = [
  "AGUASCALIENTES","BAJA_CALIFORNIA","BAJA_CALIFORNIA_SUR","CAMPECHE",
  "CHIAPAS","CHIHUAHUA","CDMX","COAHUILA","COLIMA","DURANGO",
  "GUANAJUATO","GUERRERO","HIDALGO","JALISCO","ESTADO_DE_MEXICO","MICHOACAN",
  "MORELOS","NAYARIT","NUEVO_LEON","OAXACA","PUEBLA","QUERETARO",
  "QUINTANA_ROO","SAN_LUIS_POTOSI","SINALOA","SONORA","TABASCO",
  "TAMAULIPAS","TLAXCALA","VERACRUZ","YUCATAN","ZACATECAS",
];

// Convierte "ESTADO_DE_MEXICO" → "Estado De Mexico" para mostrar en el select
function formatStateLabel(s: string) {
  return s.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

interface Props {
  destination?: Destination;   // undefined = crear, definido = editar
  onSave: (payload: DestinationPayload) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

// Estado inicial vacío (para el modo "crear")
const EMPTY_FORM: DestinationPayload = {
  name: "",
  state: "CDMX",
  distanceKmFromCDMX: 0,
  description: "",
  imageUrl: "",
  basePrice: 0,
};

export default function DestinationModal({ destination, onSave, onCancel, loading }: Props) {
  // Inicializamos el form con los datos del destino (editar) o vacío (crear)
  const [form, setForm] = useState<DestinationPayload>(
    destination
      ? {
          name: destination.name,
          state: destination.state,
          distanceKmFromCDMX: destination.distanceKmFromCDMX,
          description: destination.description,
          imageUrl: destination.imageUrl,
          basePrice: destination.basePrice,
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState<Partial<Record<keyof DestinationPayload, string>>>({});

  // Si el modal se reutiliza para editar otro destino, actualiza el form
  useEffect(() => {
    if (destination) {
      setForm({
        name: destination.name,
        state: destination.state,
        distanceKmFromCDMX: destination.distanceKmFromCDMX,
        description: destination.description,
        imageUrl: destination.imageUrl,
        basePrice: destination.basePrice,
      });
    }
  }, [destination]);

  // Helper: actualiza un campo del form de forma genérica
  function handleChange<K extends keyof DestinationPayload>(key: K, value: DestinationPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Limpia el error del campo al modificarlo
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  // Validación básica antes de enviar
  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!form.description.trim()) newErrors.description = "La descripción es obligatoria";
    if (form.basePrice <= 0) newErrors.basePrice = "El precio debe ser mayor a 0";
    if (form.distanceKmFromCDMX < 0) newErrors.distanceKmFromCDMX = "La distancia no puede ser negativa";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    await onSave(form);
  }

  const isEdit = Boolean(destination);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px", overflowY: "auto",
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#13131f",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding: "32px",
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 900, marginBottom: "4px" }}>
              {isEdit ? "Editar destino" : "Nuevo destino"}
            </h2>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
              {isEdit ? `Modificando: ${destination!.name}` : "Completa los datos del destino"}
            </p>
          </div>
          <button
            onClick={onCancel}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px", color: "rgba(255,255,255,0.5)", cursor: "pointer",
              width: "32px", height: "32px", fontSize: "16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "monospace",
            }}
          >
            ×
          </button>
        </div>

        {/* Campos del formulario */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

          {/* Nombre */}
          <Field label="Nombre" error={errors.name} required>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ej. Teotihuacán"
              style={inputStyle(!!errors.name)}
            />
          </Field>

          {/* Estado + Distancia (fila de 2) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Estado" error={errors.state} required>
              <select
                value={form.state}
                onChange={(e) => handleChange("state", e.target.value as MexicanState)}
                style={{ ...inputStyle(false), cursor: "pointer" }}
              >
                {MEXICAN_STATES.map((s) => (
                  <option key={s} value={s} style={{ background: "#1a1a2e" }}>
                    {formatStateLabel(s)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Distancia desde CDMX (km)" error={errors.distanceKmFromCDMX}>
              <input
                type="number"
                min={0}
                value={form.distanceKmFromCDMX}
                onChange={(e) => handleChange("distanceKmFromCDMX", Number(e.target.value))}
                style={inputStyle(!!errors.distanceKmFromCDMX)}
              />
            </Field>
          </div>

          {/* Precio base */}
          <Field label="Precio base (MXN)" error={errors.basePrice} required>
            <input
              type="number"
              min={0}
              value={form.basePrice}
              onChange={(e) => handleChange("basePrice", Number(e.target.value))}
              placeholder="Ej. 1500"
              style={inputStyle(!!errors.basePrice)}
            />
          </Field>

          {/* URL de imagen */}
          <Field label="URL de imagen" error={errors.imageUrl}>
            <input
              value={form.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              placeholder="https://..."
              style={inputStyle(!!errors.imageUrl)}
            />
            {/* Preview de la imagen si tiene URL */}
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="preview"
                onError={(e) => (e.currentTarget.style.display = "none")}
                style={{
                  marginTop: "8px", width: "100%", height: "120px",
                  objectFit: "cover", borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
            )}
          </Field>

          {/* Descripción */}
          <Field label="Descripción" error={errors.description} required>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe el destino..."
              rows={4}
              style={{ ...inputStyle(!!errors.description), resize: "vertical" }}
            />
          </Field>
        </div>

        {/* Botones */}
        <div style={{ display: "flex", gap: "10px", marginTop: "28px" }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1, padding: "13px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "rgba(255,255,255,0.6)",
              fontSize: "14px", fontWeight: 700,
              cursor: "pointer", fontFamily: "'Nunito', sans-serif",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              flex: 2, padding: "13px",
              background: loading
                ? "rgba(233,30,140,0.3)"
                : "linear-gradient(135deg, #e91e8c, #8b5cf6)",
              border: "none", borderRadius: "10px",
              color: "#fff", fontSize: "14px", fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Nunito', sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: "14px", height: "14px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff", borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }} />
                {isEdit ? "Guardando..." : "Creando..."}
              </>
            ) : (isEdit ? "Guardar cambios" : "Crear destino")}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Helpers de estilo ────────────────────────────────────────────────────────

// Estilos base para todos los inputs/selects/textareas
function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: `1px solid ${hasError ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: "10px",
    padding: "11px 14px",
    fontSize: "14px",
    color: "#fff",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Nunito', sans-serif",
  };
}

// Componente pequeño para label + input + mensaje de error
function Field({
  label, children, error, required,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label style={{
        display: "block", fontSize: "11px", fontWeight: 700,
        color: "rgba(255,255,255,0.45)", marginBottom: "7px",
        textTransform: "uppercase", letterSpacing: "0.05em",
      }}>
        {label}{required && <span style={{ color: "#e91e8c", marginLeft: "3px" }}>*</span>}
      </label>
      {children}
      {error && (
        <p style={{ fontSize: "11px", color: "#fca5a5", marginTop: "5px" }}>⚠ {error}</p>
      )}
    </div>
  );
}