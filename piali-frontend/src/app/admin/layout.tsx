"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const GRADIENT     = "linear-gradient(90deg, #e91e8c, #8b5cf6)";
const GRADIENT_135 = "linear-gradient(135deg, #e91e8c, #8b5cf6)";

const NAV_ITEMS = [
  { href: "/admin",                  icon: "▦",  label: "Dashboard" },
  { href: "/admin/destinations",     icon: "📍", label: "Destinos"  },
  { href: "/admin/tours",            icon: "🗺️", label: "Tours"     },
  { href: "/admin/contact-messages", icon: "✉️", label: "Mensajes"  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname   = usePathname();
  const router     = useRouter();
  const [collapsed,   setCollapsed]   = useState(false);
  const [mounted,     setMounted]     = useState(false);   // evita flash de hidratación
  const [loggingOut,  setLoggingOut]  = useState(false);

  // Leer preferencia solo en el cliente, después de montar
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebar_collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  function toggleSidebar() {
    setCollapsed((prev) => {
      localStorage.setItem("sidebar_collapsed", String(!prev));
      return !prev;
    });
  }

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  // Antes de montar usamos el ancho expandido para evitar layout shift
  const sidebarW = !mounted ? "220px" : collapsed ? "68px" : "220px";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#0a0a0f",
        fontFamily: "'Nunito', sans-serif",
        color: "#fff",
      }}
    >
      {/* ── SIDEBAR ── */}
      <aside
        style={{
          width: sidebarW,
          minHeight: "100vh",
          background: "#13131f",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          flexDirection: "column",
          transition: mounted ? "width 0.25s cubic-bezier(.4,0,.2,1)" : "none",
          overflow: "hidden",
          position: "fixed",
          top: 0, left: 0, bottom: 0,
          zIndex: 50,
        }}
      >
        {/* Logo + toggle */}
        <div
          style={{
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            padding: collapsed ? "0 16px" : "0 14px 0 18px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            flexShrink: 0,
          }}
        >
          {!collapsed && (
            <span
              style={{
                fontSize: "18px",
                fontWeight: 900,
                background: GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                whiteSpace: "nowrap",
              }}
            >
              Piali Admin
            </span>
          )}
          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              width: "30px", height: "30px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px",
              flexShrink: 0,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: "3px" }}>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 10px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  justifyContent: collapsed ? "center" : "flex-start",
                  background: isActive ? "rgba(233,30,140,0.12)" : "transparent",
                  border: isActive ? "1px solid rgba(233,30,140,0.25)" : "1px solid transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: "17px", flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && (
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? "#f472b6" : "rgba(255,255,255,0.55)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: "10px 8px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title={collapsed ? "Cerrar sesión" : undefined}
            style={{
              width: "100%",
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 10px",
              justifyContent: collapsed ? "center" : "flex-start",
              background: "transparent",
              border: "1px solid transparent",
              borderRadius: "10px",
              color: "rgba(255,255,255,0.35)",
              cursor: loggingOut ? "not-allowed" : "pointer",
              fontFamily: "'Nunito', sans-serif",
              fontSize: "13px", fontWeight: 600,
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#fca5a5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
          >
            <span style={{ fontSize: "17px" }}>⎋</span>
            {!collapsed && <span style={{ whiteSpace: "nowrap" }}>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div
        style={{
          marginLeft: sidebarW,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          transition: mounted ? "margin-left 0.25s cubic-bezier(.4,0,.2,1)" : "none",
          minHeight: "100vh",
        }}
      >
        {/* Topbar */}
        <header
          style={{
            height: "60px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", justifyContent: "flex-end",
            padding: "0 24px",
            background: "#0d0d15",
            gap: "14px",
            flexShrink: 0,
          }}
        >
          <Link href="/" style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", textDecoration: "none", fontWeight: 700 }}>
            ← Ver sitio
          </Link>
          <div
            style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: GRADIENT_135,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: 900,
            }}
          >
            A
          </div>
        </header>

        {/* Contenido */}
        <main style={{ flex: 1, padding: "28px 24px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}