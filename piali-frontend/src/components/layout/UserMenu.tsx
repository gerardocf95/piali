"use client";

import { useState } from "react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAuth } from "@/lib/hooks/useAuth";
import ReviewFormModal from "@/components/features/reviews/ReviewFormModal";

const GRADIENT_135 = "linear-gradient(135deg, #e91e8c 0%, #8b5cf6 100%)";

const itemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  padding: "10px 12px",
  fontSize: "14px",
  fontWeight: 600,
  color: "rgba(255,255,255,0.85)",
  borderRadius: "8px",
  cursor: "pointer",
  outline: "none",
  userSelect: "none",
};

const disabledItemStyle: React.CSSProperties = {
  ...itemStyle,
  color: "rgba(255,255,255,0.35)",
  cursor: "default",
};

const soonBadge: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "rgba(255,255,255,0.4)",
  background: "rgba(255,255,255,0.06)",
  borderRadius: "999px",
  padding: "2px 8px",
};

export default function UserMenu() {
  const { user, loading, logout } = useAuth();
  const [reviewOpen, setReviewOpen] = useState(false);

  // Mientras hidrata la sesión, no parpadeamos UI.
  if (loading) {
    return <div style={{ width: "40px", height: "40px" }} aria-hidden />;
  }

  // Sin sesión → botón de iniciar sesión.
  if (!user) {
    return (
      <Link
        href="/login"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "13px",
          padding: "9px 18px",
          borderRadius: "999px",
          textDecoration: "none",
        }}
      >
        Iniciar sesión
      </Link>
    );
  }

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            aria-label="Menú de usuario"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: GRADIENT_135,
                color: "#fff",
                fontWeight: 800,
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {initials || "U"}
            </span>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={10}
            style={{
              minWidth: "240px",
              background: "#13131f",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "14px",
              padding: "8px",
              zIndex: 200,
              fontFamily: "'Nunito', sans-serif",
              boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            }}
          >
            {/* Encabezado con nombre/correo */}
            <div style={{ padding: "8px 12px 12px" }}>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: "#fff" }}>
                {user.firstName} {user.lastName}
              </p>
              <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                {user.email}
              </p>
            </div>

            <DropdownMenu.Separator
              style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "4px 0" }}
            />

            {/* Agregar reseña */}
            <DropdownMenu.Item
              style={itemStyle}
              onSelect={() => setReviewOpen(true)}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span>⭐ Agregar reseña</span>
            </DropdownMenu.Item>

            {/* Viajes anteriores — próximamente */}
            <DropdownMenu.Item style={disabledItemStyle} disabled>
              <span>🧳 Viajes anteriores</span>
              <span style={soonBadge}>Pronto</span>
            </DropdownMenu.Item>

            {/* Futuros viajes — próximamente */}
            <DropdownMenu.Item style={disabledItemStyle} disabled>
              <span>📅 Futuros viajes</span>
              <span style={soonBadge}>Pronto</span>
            </DropdownMenu.Item>

            {/* Panel admin (solo admins) */}
            {user.role === "ADMIN" && (
              <DropdownMenu.Item asChild>
                <Link
                  href="/admin"
                  style={{ ...itemStyle, textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span>🛠️ Panel de administración</span>
                </Link>
              </DropdownMenu.Item>
            )}

            <DropdownMenu.Separator
              style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "4px 0" }}
            />

            {/* Cerrar sesión */}
            <DropdownMenu.Item
              style={{ ...itemStyle, color: "#fca5a5" }}
              onSelect={() => logout()}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span>↩ Cerrar sesión</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <ReviewFormModal open={reviewOpen} onOpenChange={setReviewOpen} />
    </>
  );
}
