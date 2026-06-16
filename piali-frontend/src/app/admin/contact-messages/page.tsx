import { cookies } from "next/headers";
import type { ContactMessage } from "@/types/contact";
import MessagesTable from "./_components/MessagesTable";

const GRADIENT = "linear-gradient(90deg, #e91e8c, #8b5cf6)";
const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8080";

export const dynamic = "force-dynamic";

async function getMessages(): Promise<ContactMessage[]> {
  const token = (await cookies()).get("auth_token")?.value;
  const res = await fetch(`${BACKEND}/api/v1/contact-messages`, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("❌ AdminContactMessages:", res.status);
    return [];
  }
  return res.json();
}

export default async function AdminContactMessagesPage() {
  const messages = await getMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", maxWidth: "1100px" }}>
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <span style={{ fontSize: "22px" }}>✉️</span>
          <h1 style={{ fontSize: "22px", fontWeight: 900 }}>Mensajes de contacto</h1>
        </div>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
          Mensajes recibidos desde el formulario del sitio
          {" · "}
          <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 800 }}>
            {messages.length} en total{unread > 0 ? `, ${unread} sin leer` : ""}
          </span>
        </p>
      </div>

      <MessagesTable initialMessages={messages} />
    </div>
  );
}
