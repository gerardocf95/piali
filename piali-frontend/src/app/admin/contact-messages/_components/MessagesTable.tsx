"use client";

import { useMemo, useState } from "react";
import type { ContactMessage } from "@/types/contact";
import { markMessageRead, deleteContactMessage } from "@/lib/api/contact.api";

const GRADIENT = "linear-gradient(90deg, #e91e8c, #8b5cf6)";

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function MessagesTable({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const visible = useMemo(
    () => (onlyUnread ? messages.filter((m) => !m.read) : messages),
    [messages, onlyUnread],
  );

  async function toggleRead(m: ContactMessage) {
    setBusyId(m.id);
    try {
      await markMessageRead(m.id, !m.read);
      setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, read: !m.read } : x)));
    } catch {
      alert("No se pudo actualizar el mensaje.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(m: ContactMessage) {
    if (!confirm(`¿Eliminar el mensaje de ${m.name}?`)) return;
    setBusyId(m.id);
    try {
      await deleteContactMessage(m.id);
      setMessages((prev) => prev.filter((x) => x.id !== m.id));
    } catch {
      alert("No se pudo eliminar el mensaje.");
    } finally {
      setBusyId(null);
    }
  }

  if (messages.length === 0) {
    return (
      <div style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "60px 24px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
        <p style={{ fontSize: "36px", marginBottom: "12px" }}>📭</p>
        <p style={{ fontSize: "15px", fontWeight: 700, color: "rgba(255,255,255,0.7)", marginBottom: "4px" }}>
          Aún no hay mensajes
        </p>
        <p style={{ fontSize: "13px" }}>Cuando alguien use el formulario de contacto, aparecerá aquí.</p>
      </div>
    );
  }

  return (
    <>
      {/* Filtros */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "18px" }}>
        {[
          { v: false, label: `Todos (${messages.length})` },
          { v: true, label: `Sin leer (${messages.filter((m) => !m.read).length})` },
        ].map((opt) => {
          const active = onlyUnread === opt.v;
          return (
            <button
              key={String(opt.v)}
              onClick={() => setOnlyUnread(opt.v)}
              style={{
                fontSize: "13px",
                fontWeight: 700,
                padding: "8px 16px",
                borderRadius: "999px",
                cursor: "pointer",
                color: active ? "#fff" : "rgba(255,255,255,0.6)",
                background: active ? GRADIENT : "rgba(255,255,255,0.05)",
                border: active ? "1px solid transparent" : "1px solid rgba(255,255,255,0.12)",
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Lista */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {visible.map((m) => {
          const busy = busyId === m.id;
          return (
            <div
              key={m.id}
              style={{
                background: "#13131f",
                border: m.read ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(233,30,140,0.35)",
                borderRadius: "14px",
                padding: "18px 20px",
                opacity: busy ? 0.6 : 1,
                transition: "opacity 0.15s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "10px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  {!m.read && <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#e91e8c", flexShrink: 0 }} />}
                  <span style={{ fontSize: "15px", fontWeight: 800 }}>{m.name}</span>
                  {m.email && (
                    <a href={`mailto:${m.email}`} style={{ fontSize: "13px", color: "#a78bfa", textDecoration: "none" }}>
                      {m.email}
                    </a>
                  )}
                  {m.phone && (
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>📞 {m.phone}</span>
                  )}
                </div>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>
                  {formatDate(m.createdAt)}
                </span>
              </div>

              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, whiteSpace: "pre-line", marginBottom: "14px" }}>
                {m.message}
              </p>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  onClick={() => toggleRead(m)}
                  disabled={busy}
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "7px 14px",
                    borderRadius: "999px",
                    cursor: busy ? "not-allowed" : "pointer",
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  {m.read ? "Marcar como no leído" : "Marcar como leído"}
                </button>
                <button
                  onClick={() => remove(m)}
                  disabled={busy}
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "7px 14px",
                    borderRadius: "999px",
                    cursor: busy ? "not-allowed" : "pointer",
                    background: "transparent",
                    color: "#fca5a5",
                    border: "1px solid rgba(239,68,68,0.3)",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
