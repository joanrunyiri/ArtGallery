import type { Artwork } from "@/types/artworks";

type RecentArtworksProps = {
  artworks: Artwork[];
};

export default function RecentArtworks({ artworks }: RecentArtworksProps) {
  const recentArtworks = artworks.slice(0, 3);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-950">
          Recent Artworks
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Recently added works in your collection.
        </p>
      </div>

      <div className="space-y-4">
        {recentArtworks.map((artwork) => (
          <div
            key={artwork.id}
            className="flex items-center gap-4 rounded-xl border border-gray-100 p-3"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
              Artwork
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-950">
                {artwork.title}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {artwork.medium || "Medium not specified"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-gray-950">
                {artwork.price != null
                  ? `$${artwork.price.toLocaleString()}`
                  : "—"}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {artwork.pricing_type}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
