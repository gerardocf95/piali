import type { Tour } from "@/types/tour";

export type TourPayload = {
  destinationId: number;
  name: string;
  description: string;
  imageUrl: string;
  tourType: string;
  difficultyLevel: string;
  pricePerPerson: number;
  childPrice: number;
  durationDays: number;
  nights: number;
  minGroupSize: number;
  maxGroupSize: number;
  departurePoint: string;
  transportType: string;
  includes: string;
  notIncludes: string;
  itinerary: string;
  available: boolean;
  featured: boolean;
};

const BASE = process.env.BACKEND_URL ?? "http://localhost:8080";

// ── READ (server components → fetch nativo) ───────────────────────────────────
export async function getFeaturedTours(): Promise<Tour[]> {
  const res = await fetch(`${BASE}/api/v1/tours/featured`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function getAllTours(): Promise<Tour[]> {
    const url = `${BASE}/api/v1/tours`;
    console.log("🌐 getAllTours url:", url);
    const res = await fetch(url, { cache: "no-store" });
    console.log("📡 getAllTours status:", res.status);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
}

export async function getTourById(id: number): Promise<Tour> {
  const res = await fetch(`${BASE}/api/v1/tours/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

// ── MUTACIONES (client components → pasan por Next.js para adjuntar JWT) ─────
export async function createTour(payload: TourPayload): Promise<Tour> {
  const res = await fetch("/api/tours", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function updateTour(id: number, payload: TourPayload): Promise<Tour> {
  const res = await fetch(`/api/tours/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function deleteTour(id: number): Promise<void> {
  const res = await fetch(`/api/tours/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}