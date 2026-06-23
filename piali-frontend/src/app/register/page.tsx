"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";

const GRADIENT = "linear-gradient(90deg, #e91e8c, #8b5cf6)";
const GRADIENT_135 = "linear-gradient(135deg, #e91e8c 0%, #8b5cf6 100%)";

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 700,
  color: "rgba(255,255,255,0.55)",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const inputStyle: React.CSSProperties = {
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
};

export default function RegisterPage() {
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      // register() crea la cuenta, setea la cookie y deja la sesión iniciada.
      await register({ firstName, lastName, email, password });
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo completar el registro.");
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
          maxWidth: "440px",
          background: "#13131f",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "40px 36px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
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
            Crea tu cuenta de viajero
          </p>
        </div>

        <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#fff", marginBottom: "6px" }}>
          Únete a Piali
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "28px" }}>
          Regístrate para dejar reseñas y seguir tus viajes
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Nombre + Apellido */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="firstName" style={labelStyle}>
                Nombre
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="María"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "rgba(233,30,140,0.6)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="lastName" style={labelStyle}>
                Apellido
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="González"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "rgba(233,30,140,0.6)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="email" style={labelStyle}>
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maria@correo.com"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(233,30,140,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "24px" }}>
            <label htmlFor="password" style={labelStyle}>
              Contraseña
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                style={{ ...inputStyle, padding: "12px 44px 12px 14px" }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(233,30,140,0.6)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
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

          {/* Error */}
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

          {/* Submit */}
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
                Creando cuenta...
              </>
            ) : (
              "Crear cuenta →"
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
            lineHeight: 1.8,
          }}
        >
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" style={{ color: "#e91e8c", textDecoration: "none", fontWeight: 700 }}>
            Inicia sesión
          </Link>
          <br />
          <Link href="/" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
            ← Volver al sitio
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
