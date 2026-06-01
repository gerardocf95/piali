import { NextRequest, NextResponse } from "next/server";

const SPRING_BOOT_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Llamamos a Spring Boot
    const backendRes = await fetch(`${SPRING_BOOT_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // Si Spring Boot devuelve error, lo reenviamos al cliente
    if (!backendRes.ok) {
      const errorBody = await backendRes.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorBody.message ?? "Credenciales incorrectas" },
        { status: backendRes.status }
      );
    }

    // 3. Extraemos el token que devuelve el backend
    const data = await backendRes.json();
    const token: string = data.accessToken ?? data.token ?? data.jwt;

    if (!token) {
      return NextResponse.json(
        { message: "El servidor no devolvió un token válido" },
        { status: 502 }
      );
    }

    // 4. Creamos la respuesta y seteamos la cookie HttpOnly
    //    El navegador NUNCA podrá leer este token desde JS → seguro contra XSS
    const response = NextResponse.json({ ok: true });

    response.cookies.set("auth_token", token, {
      httpOnly: true,                              // ← JS no puede leerla
      secure: process.env.NODE_ENV === "production", // ← HTTPS en producción
      sameSite: "lax",                             // ← protección CSRF básica
      path: "/",
      maxAge: 60 * 60 * 24, // 24 horas (ajusta según tu JWT)
    });

    return response;
  } catch (err) {
    console.error("[/api/auth/login]", err);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}