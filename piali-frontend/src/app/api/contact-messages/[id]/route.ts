import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8080";

async function authHeaders() {
  const token = (await cookies()).get("auth_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${BACKEND}/api/v1/contact-messages/${id}`, {
    method: "DELETE",
    headers: { ...(await authHeaders()) },
  });
  return new NextResponse(null, { status: res.status });
}
