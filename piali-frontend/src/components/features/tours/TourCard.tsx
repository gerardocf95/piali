import Link from "next/link";
import type { Tour } from "@/types/tour";
import { formatPrice } from "@/lib/utils";

const TOUR_TYPE_LABEL: Record<string, string> = {
  CULTURAL: "Cultural", AVENTURA: "Aventura", GASTRONOMICO: "Gastronómico",
  NATURALEZA: "Naturaleza", HISTORICO: "Histórico",
};

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <div className="bg-surface rounded-xl overflow-hidden border border-white/[0.07] flex flex-col">
      {/* Imagen */}
      <div className="h-44 relative overflow-hidden bg-white/5">
        {tour.imageUrl && (
          <img src={tour.imageUrl} alt={tour.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        )}
        {/* Badge precio */}
        <span className="absolute top-3 left-3 text-[11px] font-extrabold text-white px-3 py-1 rounded-full"
          style={{ background: "linear-gradient(90deg,#e91e8c,#8b5cf6)" }}>
          {formatPrice(tour.pricePerPerson)}
        </span>
        {/* Destino */}
        <span className="absolute bottom-3 left-3 text-xs text-white/75">
          📍 {tour.destination.state}
        </span>
      </div>

      {/* Cuerpo */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-extrabold text-sm mb-2">{tour.name}</h3>
        <p className="text-xs text-white/45 mb-3 line-clamp-2 leading-relaxed">{tour.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.07] text-white/55 border border-white/10">
            {TOUR_TYPE_LABEL[tour.tourType]}
          </span>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.07] text-white/55 border border-white/10">
            {tour.difficultyLevel}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto flex justify-between items-center">
          <span className="text-[11px] text-white/40">⏱ {tour.durationDays} día{tour.durationDays > 1 ? "s" : ""}</span>
          <Link href={`/tours/${tour.id}`} className="text-[11px] font-bold text-pink hover:opacity-80 transition-opacity">
            Ver Detalles →
          </Link>
        </div>
      </div>
    </div>
  );
}