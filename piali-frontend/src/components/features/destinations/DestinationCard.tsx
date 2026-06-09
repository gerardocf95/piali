"use client";

import Link from "next/link";
import { useState } from "react";
import type { Destination } from "@/types/destination";

const GRADIENT = "linear-gradient(90deg, #e91e8c, #8b5cf6)";

export function DestinationCard({ dest }: { dest: Destination }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/destinations/${dest.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textDecoration: "none",
        position: "relative",
        height: "180px",
        borderRadius: "12px",
        overflow: "hidden",
        display: "block",
        // El borde aparece con color al hacer hover
        outline: hovered ? "2px solid rgba(233,30,140,0.6)" : "2px solid transparent",
        transition: "outline-color 0.3s",
      }}
    >
      {/* Imagen — escala y desatura/satura según hover */}
      {dest.imageUrl ? (
        <img
          src={dest.imageUrl}
          alt={dest.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: hovered ? "grayscale(0%) brightness(1.1)" : "grayscale(60%) brightness(0.85)",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "filter 0.4s ease, transform 0.4s ease",
          }}
        />
      ) : (
        <div style={{ width: "100%", height: "100%", background: "#1a1a2e" }} />
      )}

      {/* Overlay — se aclara con un toque de color al hacer hover */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: hovered
            ? "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(139,92,246,0.15) 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)",
          transition: "background 0.4s ease",
        }}
      />

      {/* Nombre del destino */}
      <p
        style={{
          position: "absolute",
          bottom: "12px",
          left: "12px",
          fontWeight: 800,
          fontSize: "14px",
          color: "#fff",
          transition: "transform 0.3s ease",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
        }}
      >
        {dest.name}
      </p>

      {/* "Ver más" aparece al hacer hover */}
      <span
        style={{
          position: "absolute",
          bottom: "12px",
          right: "12px",
          fontSize: "11px",
          fontWeight: 800,
          background: GRADIENT,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(6px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        Ver →
      </span>
    </Link>
  );
}