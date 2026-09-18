"use client";

import { ImageIcon, X } from "lucide-react";
import type { Artist } from "@/types/artists";
import type { Artwork } from "@/types/artworks";

type ArtworkDetailsDrawerProps = {
  artwork: Artwork | null;
  artist: Artist | null;
  onClose: () => void;
  onEdit: () => void;
  onEditLabel: () => void;
  onDelete: () => void;
};

export default function ArtworkDetailsDrawer({
  artwork,
  artist,
  onClose,
  onEdit,
  onEditLabel,
  onDelete,
}: ArtworkDetailsDrawerProps) {
  if (!artwork) return null;

  const artistName = artist
    ? `${artist.first_name} ${artist.last_name}`
    : "Unassigned artist";

  const dimensions = [artwork.height, artwork.width, artwork.depth]
    .filter((value) => value !== null)
    .join(" × ");

  const formattedDimensions = dimensions
    ? `${dimensions} ${artwork.dimension_unit ?? ""}`.trim()
    : "—";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Main page overlay */}
      <button
        type="button"
        aria-label="Close artwork details"
        onClick={onClose}
        className="absolute inset-0 bg-black/25"
      />

      {/* Drawer */}
      <aside className="relative flex h-full w-full max-w-[520px] flex-col bg-white shadow-xl">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-200 px-7 py-5">
          <h2 className="text-base font-medium text-gray-950">
            Artwork details
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close artwork details"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Artwork summary */}
          <section className="px-7 py-7">
            <div className="flex gap-5">
              <div className="flex h-32 w-28 shrink-0 items-center justify-center overflow-hidden bg-gray-100">
                <ImageIcon
                  size={24}
                  strokeWidth={1.4}
                  className="text-gray-400"
                />
              </div>

              <div className="min-w-0 pt-1">
                <h3 className="text-lg font-medium text-gray-950">
                  {artwork.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">{artistName}</p>

                {artwork.medium && (
                  <p className="mt-4 text-sm text-gray-700">{artwork.medium}</p>
                )}

                <p className="mt-1 text-sm text-gray-500">
                  {formattedDimensions}
                </p>

                <p className="mt-4 text-sm font-medium text-gray-950">
                  {formatPrice(artwork)}
                </p>
              </div>
            </div>
          </section>

          <Divider />

          {/* Exhibition label */}
          <section className="px-7 py-7">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-950">
                Exhibition label
              </h3>

              <button
                type="button"
                onClick={onEditLabel}
                className="btn btn-primary"
              >
                Edit
              </button>
            </div>

            <div className="border border-gray-300 px-6 py-5">
              <p className="text-xs text-gray-500">{artistName}</p>

              <p className="mt-2 font-serif text-lg italic text-gray-950">
                {artwork.title}
              </p>

              <div className="mt-4 space-y-1 text-xs leading-5 text-gray-500">
                {artwork.medium && <p>{artwork.medium}</p>}

                {dimensions && <p>{formattedDimensions}</p>}

                {artwork.pricing_type === "fixed" && artwork.price !== null && (
                  <p className="pt-2 text-gray-800">
                    ${artwork.price.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </section>

          <Divider />

          {/* Artwork details */}
          <section className="px-7 py-7">
            <h3 className="mb-5 text-sm font-medium text-gray-950">
              Artwork details
            </h3>

            <div>
              <DetailRow label="Dimensions" value={formattedDimensions} />

              <DetailRow label="Framing" value={artwork.framing} />

              <DetailRow label="Medium" value={artwork.medium} />

              <DetailRow
                label="Edition size"
                value={
                  artwork.edition_size !== null
                    ? String(artwork.edition_size)
                    : null
                }
              />

              <DetailRow
                label="Hand signed"
                value={artwork.hand_signed ? "Yes" : "No"}
              />

              <DetailRow
                label="Individually numbered"
                value={artwork.individually_numbered ? "Yes" : "No"}
              />

              <DetailRow
                label="Certificate of authenticity"
                value={artwork.coa_included ? "Included" : "Not included"}
              />

              <DetailRow label="Release date" value={artwork.release_date} />
            </div>
          </section>

          <Divider />

          {/* Packaging */}
          <section className="px-7 py-7">
            <h3 className="mb-3 text-sm font-medium text-gray-950">
              Packaging
            </h3>

            <p className="text-sm leading-6 text-gray-600">
              {artwork.packaging || "No packaging information"}
            </p>
          </section>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between border-t border-gray-200 bg-white px-7 py-4">
          <button type="button" onClick={onDelete} className="btn btn-danger">
            Delete
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="rounded-md bg-gray-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Edit artwork
          </button>
        </footer>
      </aside>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="grid grid-cols-[170px_1fr] gap-4 border-b border-gray-100 py-3 last:border-b-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-900">{value || "—"}</span>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-gray-200" />;
}

function formatPrice(artwork: Artwork) {
  if (artwork.pricing_type === "fixed" && artwork.price !== null) {
    return `$${artwork.price.toLocaleString()}`;
  }

  if (artwork.pricing_type === "contact") {
    return "Price on request";
  }

  return "Not for sale";
}
