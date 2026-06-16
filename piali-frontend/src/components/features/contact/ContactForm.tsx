"use client";

import { useState, FormEvent } from "react";
import { GRADIENT, whatsappLink } from "@/lib/constants";
import { createContactMessage } from "@/lib/api/contact.api";

type Fields = { name: string; email: string; phone: string; message: string };

const EMPTY: Fields = { name: "", email: "", phone: "", message: "" };

const BORDER_IDLE = "rgba(255,255,255,0.1)";
const BORDER_ERROR = "rgba(239,68,68,0.6)";

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 700,
  color: "rgba(255,255,255,0.55)",
  marginBottom: "8px",
};

const inputBase: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: `1px solid ${BORDER_IDLE}`,
  borderRadius: "10px",
  padding: "12px 14px",
  fontSize: "14px",
  color: "#fff",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'Nunito', sans-serif",
  transition: "border-color 0.2s",
};

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [form, setForm] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  function set<K extends keyof Fields>(key: K, value: Fields[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    if (status === "error") setStatus("idle");
  }

  function validate(): boolean {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (!form.name.trim()) next.name = "Cuéntanos tu nombre";
    if (!form.message.trim()) next.message = "Escribe tu mensaje";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Correo no válido";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function buildWhatsAppMessage(): string {
    const lines = ["¡Hola Piali! 👋 Me gustaría más información.", "", `Nombre: ${form.name.trim()}`];
    if (form.email.trim()) lines.push(`Correo: ${form.email.trim()}`);
    if (form.phone.trim()) lines.push(`Teléfono: ${form.phone.trim()}`);
    lines.push("", `Mensaje: ${form.message.trim()}`);
    return lines.join("\n");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      await createContactMessage({
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        message: form.message.trim(),
      });
      setStatus("sent");
      setForm(EMPTY);
    } catch {
      setStatus("error");
    }
  }

  function handleWhatsApp() {
    if (!validate()) return;
    window.open(whatsappLink(buildWhatsAppMessage()), "_blank", "noopener,noreferrer");
  }

  // ── Estado de éxito ──
  if (status === "sent") {
    return (
      <div style={{ textAlign: "center", padding: "32px 8px" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(74,222,128,0.18), rgba(139,92,246,0.18))", border: "1px solid rgba(74,222,128,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", margin: "0 auto 18px" }}>
          ✅
        </div>
        <h3 style={{ fontSize: "18px", fontWeight: 900, marginBottom: "8px" }}>¡Mensaje enviado!</h3>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: "24px" }}>
          Gracias por escribirnos. Te responderemos lo antes posible.
        </p>
        <button
          onClick={() => setStatus("idle")}
          style={{ background: "transparent", color: "#fff", fontWeight: 800, fontSize: "14px", padding: "12px 28px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.25)", cursor: "pointer", fontFamily: "'Nunito', sans-serif" }}
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Nombre */}
      <div>
        <label htmlFor="cf-name" style={labelStyle}>Nombre *</label>
        <input
          id="cf-name"
          type="text"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Tu nombre"
          style={{ ...inputBase, borderColor: errors.name ? BORDER_ERROR : BORDER_IDLE }}
        />
        {errors.name && <p style={{ color: "#fca5a5", fontSize: "12px", marginTop: "6px" }}>{errors.name}</p>}
      </div>

      {/* Correo + Teléfono */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <label htmlFor="cf-email" style={labelStyle}>Correo</label>
          <input
            id="cf-email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="tucorreo@email.com"
            style={{ ...inputBase, borderColor: errors.email ? BORDER_ERROR : BORDER_IDLE }}
          />
          {errors.email && <p style={{ color: "#fca5a5", fontSize: "12px", marginTop: "6px" }}>{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="cf-phone" style={labelStyle}>Teléfono</label>
          <input
            id="cf-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="Opcional"
            style={inputBase}
          />
        </div>
      </div>

      {/* Mensaje */}
      <div>
        <label htmlFor="cf-message" style={labelStyle}>Mensaje *</label>
        <textarea
          id="cf-message"
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="¿A dónde te gustaría viajar? ¿Cuántas personas? ¿Fechas aproximadas?"
          rows={4}
          style={{ ...inputBase, resize: "vertical", borderColor: errors.message ? BORDER_ERROR : BORDER_IDLE }}
        />
        {errors.message && <p style={{ color: "#fca5a5", fontSize: "12px", marginTop: "6px" }}>{errors.message}</p>}
      </div>

      {/* Error de envío */}
      {status === "error" && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>⚠️</span>
          <p style={{ fontSize: "13px", color: "#fca5a5", margin: 0 }}>
            No se pudo enviar el mensaje. Intenta de nuevo o escríbenos por WhatsApp.
          </p>
        </div>
      )}

      {/* Acciones */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "4px" }}>
        <button
          type="submit"
          disabled={sending}
          style={{
            flex: "1 1 200px",
            background: sending ? "rgba(255,255,255,0.12)" : GRADIENT,
            color: sending ? "rgba(255,255,255,0.5)" : "#fff",
            fontWeight: 800,
            fontSize: "15px",
            padding: "14px",
            borderRadius: "999px",
            border: "none",
            cursor: sending ? "not-allowed" : "pointer",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          {sending ? "Enviando…" : "Enviar mensaje"}
        </button>
        <button
          type="button"
          onClick={handleWhatsApp}
          disabled={sending}
          style={{
            flex: "1 1 160px",
            background: "transparent",
            color: "#fff",
            fontWeight: 800,
            fontSize: "14px",
            padding: "14px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.25)",
            cursor: sending ? "not-allowed" : "pointer",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          💬 WhatsApp
        </button>
      </div>

      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", lineHeight: 1.6, margin: 0 }}>
        Tu mensaje llega directo a nuestro equipo. También puedes escribirnos por WhatsApp para una respuesta inmediata.
      </p>
    </form>
  );
}
