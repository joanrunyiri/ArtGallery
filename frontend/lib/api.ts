import type { DashboardData } from "@/types/dashboard";
import type { Artwork } from "@/types/artworks";
import type { Artist, ArtistInput } from "@/types/artists";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getDashboard(): Promise<DashboardData> {
  return request<DashboardData>("/api/dashboard");
}
export function getArtworks(): Promise<Artwork[]> {
  return request<Artwork[]>("/api/artworks");
}

export function getArtists(): Promise<Artist[]> {
  return request<Artist[]>("/api/artists");
}

export function createArtist(data: ArtistInput): Promise<Artist> {
  return request<Artist>("/api/artists", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateArtist(
  id: number,
  data: ArtistInput
): Promise<Artist> {
  return request<Artist>(`/api/artists/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteArtist(id: number): Promise<void> {
  return request<void>(`/api/artists/${id}`, {
    method: "DELETE",
  });
}