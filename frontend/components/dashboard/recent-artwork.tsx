import { ImageIcon } from "lucide-react";
import type { Artwork } from "@/types/artworks";

type RecentArtworksProps = {
  artworks: Artwork[];
};

export default function RecentArtworks({ artworks }: RecentArtworksProps) {
  const recentArtworks = artworks.slice(0, 3);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-6">
        <h2 className="font-serif text-lg font-medium text-gray-950">
          Recent Artworks
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Recently added to your collection.
        </p>
      </div>

      {recentArtworks.length === 0 ? (
        <div className="flex min-h-52 items-center justify-center">
          <p className="text-sm text-gray-400">No artworks yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {recentArtworks.map((artwork) => (
            <div
              key={artwork.id}
              className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex h-14 w-12 shrink-0 items-center justify-center bg-gray-100">
                <ImageIcon
                  size={17}
                  strokeWidth={1.4}
                  className="text-gray-400"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-950">
                  {artwork.title}
                </p>

                <p className="mt-1 truncate text-xs text-gray-400">
                  {artwork.medium || "Medium not specified"}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-medium text-gray-900">
                  {artwork.price != null
                    ? `$${artwork.price.toLocaleString()}`
                    : "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
