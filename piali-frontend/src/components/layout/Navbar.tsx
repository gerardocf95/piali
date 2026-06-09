"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

const GRADIENT = "linear-gradient(90deg, #e91e8c, #8b5cf6)";

const NAV_LINKS = [
  { label: "Destinos",    href: "/#destinos"    },
  { label: "Tours",       href: "/#tours"       },
  { label: "Reseñas",     href: "/#resenas"     },
  { label: "Contáctanos", href: "/#contacto"    },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    // Solo aplica scroll suave si estamos en la página principal
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 40px",
        height: "64px",
        background: scrolled
          ? "rgba(10,10,15,0.92)"
          : "rgba(10,10,15,0.6)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid transparent",
        transition: "background 0.3s, border-color 0.3s",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center" }}>
        <Image
          src="/logo.png"
          alt="Piali"
          width={60}
          height={50}
          priority
        />
      </Link>

      {/* Links centrales */}
      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.6)",
              textDecoration: "none",
              transition: "color 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Botón CTA */}
      <a
        href="/#contacto"
        onClick={(e) => handleNavClick(e, "/#contacto")}
        style={{
          background: GRADIENT,
          color: "#fff",
          fontWeight: 800,
          fontSize: "13px",
          padding: "10px 24px",
          borderRadius: "999px",
          textDecoration: "none",
          cursor: "pointer",
          transition: "opacity 0.2s",
          display: "inline-block",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Solicitar viaje
      </a>
    </nav>
  );
}