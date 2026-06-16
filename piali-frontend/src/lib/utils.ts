import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Combina clases de Tailwind de forma segura (usado en todos los componentes)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(price);
}

/** Divide texto por saltos de línea (para itinerarios). */
export function splitLines(text?: string | null): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

/**
 * Divide texto en una lista. Usa saltos de línea; si solo hay una línea,
 * separa por comas (para campos como "incluye"/"no incluye").
 */
export function splitList(text?: string | null): string[] {
  const lines = splitLines(text);
  if (lines.length <= 1 && text) {
    return text
      .split(/[,\n]/)
      .map((l) => l.trim())
      .filter(Boolean);
  }
  return lines;
}