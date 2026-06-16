import type { ContactMessage, ContactMessagePayload } from "@/types/contact";

// ── Público (formulario de contacto) ──────────────────────────────────────────
export async function createContactMessage(payload: ContactMessagePayload): Promise<void> {
  const res = await fetch("/api/contact-messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}

// ── Admin (pasan por Next.js para adjuntar el JWT) ────────────────────────────
export async function markMessageRead(id: number, read = true): Promise<ContactMessage> {
  const res = await fetch(`/api/contact-messages/${id}/read?read=${read}`, { method: "PATCH" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function deleteContactMessage(id: number): Promise<void> {
  const res = await fetch(`/api/contact-messages/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}
