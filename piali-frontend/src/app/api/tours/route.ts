import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function POST(req: NextRequest) {
  const token = (await cookies()).get("auth_token")?.value;
  const body = await req.json();
  console.log("📦 tour payload:", JSON.stringify(body, null, 2));

  const res = await fetch(`${BACKEND}/api/v1/tours`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  console.log("📡 backend status:", res.status);
  console.log("📡 backend response:", JSON.stringify(data, null, 2));
  return NextResponse.json(data, { status: res.status });
}