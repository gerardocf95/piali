import type { Destination } from "./destination";

export type TourType = "CULTURAL" | "AVENTURA" | "GASTRONOMICO" | "NATURALEZA" | "HISTORICO" | "OTRO";
export type DifficultyLevel = "FACIL" | "MODERADO" | "DIFICIL";
export type TransportType = "CARRO" | "AUTOBUS" | "VAN" | "AVION" | "MIXTO";

export interface Tour {
  id: number;
  destination: Destination;
  name: string;
  description: string;
  imageUrl: string;
  tourType: TourType;
  difficultyLevel: DifficultyLevel;
  pricePerPerson: number;
  childPrice: number;
  durationDays: number;
  nights: number;
  minGroupSize: number;
  maxGroupSize: number;
  departurePoint: string;
  transportType: TransportType;
  includes: string;
  notIncludes: string;
  itinerary: string;
  available: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}