import type { Review, ReviewPayload } from "@/types/review";

const BASE = process.env.BACKEND_URL ?? "http://localhost:8080";

// ── READ (server component → directo al backend, endpoints públicos) ──────────
export async function getReviews(): Promise<Review[]> {
  const res = await fetch(`${BASE}/api/v1/reviews`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function getReviewsWithComments(): Promise<Review[]> {
  const res = await fetch(`${BASE}/api/v1/reviews/with-comments`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

// ── MUTACIÓN (client component → pasa por Next.js para adjuntar el JWT) ────────
export async function createReview(payload: ReviewPayload): Promise<Review> {
  const res = await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? `Error ${res.status}`);
  }
  return res.json();
}
