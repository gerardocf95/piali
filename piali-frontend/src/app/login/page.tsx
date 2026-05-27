"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const GRADIENT = "linear-gradient(90deg, #e91e8c, #8b5cf6)";
const GRADIENT_135 = "linear-gradient(135deg, #e91e8c 0%, #8b5cf6 100%)";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Llamamos a nuestro Route Handler (NO directamente a Spring Boot)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? "Credenciales incorrectas");
        return;
      }

      // Login exitoso → la cookie ya fue seteada por el Route Handler
      console.log("✅ Login OK, redirigiendo a:", redirectTo);
      //router.push(redirectTo);
      //router.refresh(); // importante: refresca el layout para que el middleware detecte la cookie

      window.location.href = redirectTo;
    } catch {
      setError("No se pudo conectar con el servidor. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0a0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Nunito', sans-serif",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decoración de fondo */}
      <div
        style={{
          position: "absolute",
          top: "-200px",
          right: "-200px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(233,30,140,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-200px",
          left: "-200px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#13131f",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "40px 36px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo / Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span
              style={{
                fontSize: "26px",
                fontWeight: 900,
                background: GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Piali
            </span>
          </Link>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginTop: "8px" }}>
            Panel de administración
          </p>
        </div>

        {/* Título */}
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 900,
            color: "#fff",
            marginBottom: "6px",
          }}
        >
          Bienvenido de vuelta
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "28px" }}>
          Ingresa tus credenciales para continuar
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.55)",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@piali.mx"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                padding: "12px 14px",
                fontSize: "14px",
                color: "#fff",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(233,30,140,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.55)",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Contraseña
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "12px 44px 12px 14px",
                  fontSize: "14px",
                  color: "#fff",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(233,30,140,0.6)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              {/* Toggle mostrar contraseña */}
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "16px",
                  padding: "4px",
                  lineHeight: 1,
                }}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "10px",
                padding: "12px 14px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "14px" }}>⚠️</span>
              <p style={{ fontSize: "13px", color: "#fca5a5", margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Botón submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "rgba(255,255,255,0.1)" : GRADIENT_135,
              border: "none",
              borderRadius: "10px",
              padding: "14px",
              fontSize: "15px",
              fontWeight: 800,
              color: loading ? "rgba(255,255,255,0.4)" : "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Nunito', sans-serif",
              transition: "opacity 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Verificando...
              </>
            ) : (
              "Iniciar sesión →"
            )}
          </button>
        </form>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "rgba(255,255,255,0.25)",
            marginTop: "28px",
          }}
        >
          <Link href="/" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
            ← Volver al sitio
          </Link>
        </p>
      </div>

      {/* Keyframe para el spinner */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}