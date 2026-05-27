"use client";

import Link from "next/link";

const GRADIENT = "linear-gradient(90deg, #e91e8c, #8b5cf6)";

export function MetricCard({
  icon,
  label,
  value,
  sub,
  href,
}: {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  href?: string;
}) {
  const inner = (
    <div
      style={{
        background: "#13131f",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "24px",
        height: "140px",               // altura fija → todas iguales
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        if (href) e.currentTarget.style.borderColor = "rgba(233,30,140,0.35)";
      }}
      onMouseLeave={(e) => {
        if (href) e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
      }}
    >
      {/* Fila superior: icono + enlace */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: "22px", lineHeight: 1 }}>{icon}</span>
        {href && (
          <span style={{ fontSize: "11px", color: "#e91e8c", fontWeight: 700 }}>
            Ver todos →
          </span>
        )}
      </div>

      {/* Fila inferior: valor + etiqueta */}
      <div>
        <p
          style={{
            fontSize: "32px",
            fontWeight: 900,
            background: GRADIENT,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1,
            marginBottom: "4px",
          }}
        >
          {value}
        </p>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 600, marginBottom: "2px" }}>
          {label}
        </p>
        {sub && (
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.22)" }}>{sub}</p>
        )}
      </div>
    </div>
  );

  return href ? (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      {inner}
    </Link>
  ) : (
    inner
  );
}