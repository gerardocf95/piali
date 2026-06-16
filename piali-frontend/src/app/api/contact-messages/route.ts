import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8080";

// POST público: crea un mensaje desde el formulario de contacto.
export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(`${BACKEND}/api/v1/contact-messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

// GET admin: lista los mensajes (adjunta el JWT desde la cookie).
export async function GET() {
  const token = (await cookies()).get("auth_token")?.value;

  const res = await fetch(`${BACKEND}/api/v1/contact-messages`, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    cache: "no-store",
  });

  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}
