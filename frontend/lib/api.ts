import type { DashboardData } from "@/types/dashboard";
import type { Artwork } from "@/types/artwork";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getDashboard(): Promise<DashboardData> {
  return request<DashboardData>("/api/dashboard");
}
export function getArtworks(): Promise<Artwork[]> {
  return request<Artwork[]>("/api/artworks");
}