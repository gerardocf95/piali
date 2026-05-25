import apiClient from "./client";
import type { Destination } from "@/types/destination";

export async function getDestinations(): Promise<Destination[]> {
  const { data } = await apiClient.get<Destination[]>("/api/v1/destinations");
  return data;
}