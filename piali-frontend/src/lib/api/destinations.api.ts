import type { Destination } from "@/types/destination";

export type DestinationPayload = Omit<Destination, "id" | "createdAt" | "featuredOrder">;

const BASE = process.env.BACKEND_URL ?? "http://localhost:8080";

// ── READ (server component → directo al backend) ──────────────────────────
export async function getDestinations(): Promise<Destination[]> {
  console.log("📡 GET", `${BASE}/api/v1/destinations`);
  const res = await fetch(`${BASE}/api/v1/destinations`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

// ── MUTACIONES (client component → pasan por Next.js para adjuntar el JWT) ──
export async function createDestination(payload: DestinationPayload): Promise<Destination> {
  const res = await fetch("/api/destinations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function updateDestination(id: number, payload: DestinationPayload): Promise<Destination> {
  const res = await fetch(`/api/destinations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function deleteDestination(id: number): Promise<void> {
  const res = await fetch(`/api/destinations/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}