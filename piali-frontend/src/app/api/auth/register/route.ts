import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await req.json();

    const backendRes = await fetch(`${BACKEND}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    if (!backendRes.ok) {
      const errorBody = await backendRes.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorBody.message ?? "No se pudo completar el registro" },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    const token: string = data.accessToken ?? data.token ?? data.jwt;

    if (!token) {
      return NextResponse.json(
        { message: "El servidor no devolvió un token válido" },
        { status: 502 }
      );
    }

    // Igual que en login: guardamos el JWT en cookie HttpOnly y dejamos al usuario logueado.
    const response = NextResponse.json({ ok: true });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 horas
    });

    return response;
  } catch (err) {
    console.error("[/api/auth/register]", err);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
