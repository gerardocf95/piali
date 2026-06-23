import type { User } from "./auth";
import type { Destination } from "./destination";

// Lo que el cliente envía al crear una reseña.
// El autor lo deriva el backend del usuario autenticado, no se manda aquí.
// El destino se manda solo como id.
export interface ReviewPayload {
  message: string;
  destinationId: number;
  stars: number;
}

// Lo que el backend devuelve: author y destination ya vienen "limpios" como DTOs.
export interface Review {
  id: number;
  author: Pick<User, "id" | "firstName" | "lastName" | "role">;
  message: string;
  destination: Destination;
  stars: number;
  createdAt: string;
  updatedAt: string;
}
