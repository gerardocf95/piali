import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const read = req.nextUrl.searchParams.get("read") ?? "true";
  const token = (await cookies()).get("auth_token")?.value;

  const res = await fetch(`${BACKEND}/api/v1/contact-messages/${id}/read?read=${read}`, {
    method: "PATCH",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
