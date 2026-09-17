import ArtworksClient from "./artworks-client";
import { getArtists, getArtworks } from "@/lib/api";

export default async function Artworks() {
  const [artworks, artists] = await Promise.all([
    getArtworks(),
    getArtists(),
  ]);

  return (
    <ArtworksClient
      initialArtworks={artworks}
      artists={artists}
    />
  );
}