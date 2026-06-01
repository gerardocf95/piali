import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8080";

async function forwardToBackend(
  method: string,
  id: string,
  body?: unknown
) {
  const token = (await cookies()).get("auth_token")?.value;
  return fetch(`${BACKEND}/api/v1/destinations/${id}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  console.log("🔑 token:", (await cookies()).get("auth_token")?.value ? "presente" : "ausente");
  console.log("📦 body:", body);
  console.log("🌐 url:", `${BACKEND}/api/v1/destinations/${id}`);

  const res = await forwardToBackend("PUT", id, body);
  console.log("📡 backend status:", res.status);
  const data = await res.json().catch(() => ({}));
  console.log("📡 backend response:", data);
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await forwardToBackend("DELETE", id);
  return new NextResponse(null, { status: res.status });
}