import type { TourType, DifficultyLevel, TransportType } from "@/types/tour";
import type { MexicanState } from "@/types/destination";

// Gradiente de marca (usado en toda la app)
export const GRADIENT = "linear-gradient(90deg, #e91e8c, #8b5cf6)";
export const GRADIENT_135 = "linear-gradient(135deg, #e91e8c, #8b5cf6)";

// Paleta base (reflejo de las variables de globals.css para uso en estilos inline)
export const COLORS = {
  bg: "#0a0a0f",
  surface: "#13131f",
  surface2: "#0d0d15",
  pink: "#e91e8c",
  purple: "#8b5cf6",
  border: "rgba(255,255,255,0.07)",
};

export const TOUR_TYPE_LABEL: Record<TourType, string> = {
  CULTURAL: "Cultural",
  AVENTURA: "Aventura",
  GASTRONOMICO: "Gastronómico",
  NATURALEZA: "Naturaleza",
  HISTORICO: "Histórico",
  OTRO: "Otro",
};

export const DIFFICULTY_LABEL: Record<DifficultyLevel, string> = {
  FACIL: "Fácil",
  MODERADO: "Moderado",
  DIFICIL: "Difícil",
};

export const TRANSPORT_LABEL: Record<TransportType, string> = {
  CARRO: "Automóvil",
  AUTOBUS: "Autobús",
  VAN: "Van",
  AVION: "Avión",
  MIXTO: "Mixto",
};

export const STATE_LABEL: Record<MexicanState, string> = {
  AGUASCALIENTES: "Aguascalientes",
  BAJA_CALIFORNIA: "Baja California",
  BAJA_CALIFORNIA_SUR: "Baja California Sur",
  CAMPECHE: "Campeche",
  CHIAPAS: "Chiapas",
  CHIHUAHUA: "Chihuahua",
  CDMX: "Ciudad de México",
  COAHUILA: "Coahuila",
  COLIMA: "Colima",
  DURANGO: "Durango",
  GUANAJUATO: "Guanajuato",
  GUERRERO: "Guerrero",
  HIDALGO: "Hidalgo",
  JALISCO: "Jalisco",
  ESTADO_DE_MEXICO: "Estado de México",
  MICHOACAN: "Michoacán",
  MORELOS: "Morelos",
  NAYARIT: "Nayarit",
  NUEVO_LEON: "Nuevo León",
  OAXACA: "Oaxaca",
  PUEBLA: "Puebla",
  QUERETARO: "Querétaro",
  QUINTANA_ROO: "Quintana Roo",
  SAN_LUIS_POTOSI: "San Luis Potosí",
  SINALOA: "Sinaloa",
  SONORA: "Sonora",
  TABASCO: "Tabasco",
  TAMAULIPAS: "Tamaulipas",
  TLAXCALA: "Tlaxcala",
  VERACRUZ: "Veracruz",
  YUCATAN: "Yucatán",
  ZACATECAS: "Zacatecas",
};

export function stateLabel(state: MexicanState | string): string {
  return STATE_LABEL[state as MexicanState] ?? state;
}

export function tourTypeLabel(type: TourType | string): string {
  return TOUR_TYPE_LABEL[type as TourType] ?? type;
}

// ── Contacto ────────────────────────────────────────────────────────────────
// ⚠️ Reemplazar por el número real de Piali (formato internacional, sin "+", sin espacios).
// Ej.: México 55 1234 5678 → "525512345678"
export const WHATSAPP_NUMBER = "529212680369";

/** Construye un enlace de WhatsApp con mensaje pre-armado. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ⚠️ Reemplazar por el correo real de contacto de Piali.
export const CONTACT_EMAIL = "gerardocf.ipn@gmail.com";

/** Construye un enlace mailto con asunto y cuerpo pre-armados. */
export function mailtoLink(subject: string, body: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
