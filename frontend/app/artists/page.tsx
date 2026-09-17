import ArtistsClient from "./artist-client";
import { getArtists } from "@/lib/api";

export default async function ArtistsPage() {
  const artists = await getArtists();

  return <ArtistsClient initialArtists={artists} />;
}