"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { createReview } from "@/lib/api/reviews.api";
import type { Destination } from "@/types/destination";

const GRADIENT_135 = "linear-gradient(135deg, #e91e8c 0%, #8b5cf6 100%)";

interface ReviewFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

const fieldStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  padding: "12px 14px",
  fontSize: "14px",
  color: "#fff",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'Nunito', sans-serif",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 700,
  color: "rgba(255,255,255,0.55)",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

export default function ReviewFormModal({ open, onOpenChange, onCreated }: ReviewFormModalProps) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [destinationId, setDestinationId] = useState<string>("");
  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Carga los destinos al abrir el modal.
  useEffect(() => {
    if (!open) return;
    fetch("/api/destinations", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Destination[]) => setDestinations(data))
      .catch(() => setDestinations([]));
  }, [open]);

  function resetForm() {
    setDestinationId("");
    setStars(0);
    setHovered(0);
    setMessage("");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!destinationId) {
      setError("Selecciona un destino.");
      return;
    }
    if (stars < 1) {
      setError("Selecciona una calificación de 1 a 5 estrellas.");
      return;
    }

    setLoading(true);
    try {
      await createReview({
        destinationId: Number(destinationId),
        stars,
        message: message.trim(),
      });
      resetForm();
      onOpenChange(false);
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar la reseña.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 200,
          }}
        />
        <Dialog.Content
          aria-describedby={undefined}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "calc(100% - 32px)",
            maxWidth: "460px",
            background: "#13131f",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "28px",
            zIndex: 201,
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          <Dialog.Title
            style={{ fontSize: "20px", fontWeight: 900, color: "#fff", margin: 0, marginBottom: "4px" }}
          >
            Deja tu reseña
          </Dialog.Title>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: 0, marginBottom: "20px" }}>
            Cuéntanos cómo te fue en tu viaje
          </p>

          <form onSubmit={handleSubmit}>
            {/* Destino */}
            <div style={{ marginBottom: "18px" }}>
              <label htmlFor="destination" style={labelStyle}>
                Destino
              </label>
              <select
                id="destination"
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
                style={fieldStyle}
              >
                <option value="" disabled>
                  Selecciona un destino
                </option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.id} style={{ background: "#13131f" }}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Estrellas */}
            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Calificación</label>
              <div style={{ display: "flex", gap: "6px" }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setStars(n)}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "28px",
                      lineHeight: 1,
                      padding: 0,
                      color: (hovered || stars) >= n ? "#fbbf24" : "rgba(255,255,255,0.2)",
                      transition: "color 0.15s",
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Comentario */}
            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="message" style={labelStyle}>
                Comentario <span style={{ textTransform: "none", fontWeight: 400 }}>(opcional)</span>
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="¿Qué fue lo que más te gustó?"
                style={{ ...fieldStyle, resize: "vertical" }}
              />
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  marginBottom: "16px",
                }}
              >
                <p style={{ fontSize: "13px", color: "#fca5a5", margin: 0 }}>⚠️ {error}</p>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <Dialog.Close asChild>
                <button
                  type="button"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    padding: "12px 20px",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.7)",
                    cursor: "pointer",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? "rgba(255,255,255,0.1)" : GRADIENT_135,
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: 800,
                  color: loading ? "rgba(255,255,255,0.4)" : "#fff",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                {loading ? "Enviando..." : "Enviar reseña"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
