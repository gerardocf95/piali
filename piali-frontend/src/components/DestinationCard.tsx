import { Destination } from "@/types/destination";
import Link from "next/link";
import Image from "next/image";

interface Props {
  destination: Destination;
}

export default function DestinationCard({ destination }: Props) {
  const { id, name, state, distanceKmFromCDMX, description, imageUrl, basePrice } = destination;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">

      {/* Imagen */}
      <div className="relative w-full h-40">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />
        {/* Badge estado */}
        <span className="absolute top-2 left-2 bg-black/50 text-white text-xs font-medium px-3 py-1 rounded-lg">
          {state.replace("_", " ")}
        </span>
        {/* Badge distancia */}
        <span className="absolute top-2 right-2 bg-white/90 text-zinc-600 text-xs px-3 py-1 rounded-lg">
          {distanceKmFromCDMX} km
        </span>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="font-medium text-base text-zinc-900 dark:text-zinc-100 mb-1">
          {name}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3 line-clamp-2">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3">
          <div>
            <p className="text-xs text-zinc-400">desde</p>
            <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
              ${basePrice.toLocaleString("es-MX")}
            </p>
          </div>
          <Link
            href={`/destinations/${id}`}
            className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
          >
            Ver más
          </Link>
        </div>
      </div>
    </div>
  );
}