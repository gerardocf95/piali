import apiClient from "./client";
import type { Tour } from "@/types/tour";

export async function getFeaturedTours(): Promise<Tour[]> {
  const { data } = await apiClient.get<Tour[]>("/api/v1/tours/featured");
  return data;
}

export async function getAllTours(): Promise<Tour[]> {
  const { data } = await apiClient.get<Tour[]>("/api/v1/tours");
  return data;
}

export async function getTourById(id: number): Promise<Tour> {
  const { data } = await apiClient.get<Tour>(`/api/v1/tours/${id}`);
  return data;
}