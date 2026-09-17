"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Artwork } from "@/types/artworks";
import type { Artist } from "@/types/artists";

type ExhibitionLabelProps = {
  artwork: Artwork;
  artist: Artist | null;
  onClose: () => void;
};

export default function ExhibitionLabel({
  artwork,
  artist,
  onClose,
}: ExhibitionLabelProps) {
  const [showArtist, setShowArtist] = useState(true);
  const [showMedium, setShowMedium] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [style, setStyle] = useState<"classic" | "minimal">("classic");

  const dimensions = [artwork.height, artwork.width, artwork.depth]
    .filter((value) => value != null)
    .join(" × ");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
      <button
        type="button"
        aria-label="Close exhibition label"
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      <div className="relative grid max-h-[90vh] w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-[300px_1fr]">
        <div className="overflow-y-auto border-r border-gray-200 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-semibold text-gray-950">
              Exhibition Label
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-gray-900">
              Label Style
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStyle("classic")}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  style === "classic"
                    ? "border-gray-950 bg-gray-950 text-white"
                    : "border-gray-200"
                }`}
              >
                Classic
              </button>

              <button
                type="button"
                onClick={() => setStyle("minimal")}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  style === "minimal"
                    ? "border-gray-950 bg-gray-950 text-white"
                    : "border-gray-200"
                }`}
              >
                Minimal
              </button>
            </div>
          </div>

          <div className="mt-7 space-y-4">
            <p className="text-sm font-medium text-gray-900">
              Information
            </p>

            {[
              ["Artist", showArtist, setShowArtist],
              ["Medium", showMedium, setShowMedium],
              ["Dimensions", showDimensions, setShowDimensions],
              ["Price", showPrice, setShowPrice],
            ].map(([label, checked, setter]) => (
              <label
                key={label as string}
                className="flex items-center justify-between text-sm text-gray-700"
              >
                {label as string}

                <input
                  type="checkbox"
                  checked={checked as boolean}
                  onChange={(event) =>
                    (
                      setter as React.Dispatch<
                        React.SetStateAction<boolean>
                      >
                    )(event.target.checked)
                  }
                  className="h-4 w-4"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="flex min-h-[500px] items-center justify-center bg-gray-100 p-8">
          <div
            className={`w-full max-w-md bg-white ${
              style === "classic"
                ? "border border-gray-300 p-10"
                : "p-10 shadow-sm"
            }`}
          >
            {showArtist && artist && (
              <p className="mb-3 text-sm text-gray-600">
                {artist.first_name} {artist.last_name}
              </p>
            )}

            <h3
              className={
                style === "classic"
                  ? "text-2xl font-medium italic text-gray-950"
                  : "text-xl font-semibold text-gray-950"
              }
            >
              {artwork.title}
            </h3>

            {artwork.release_date && (
              <p className="mt-1 text-sm text-gray-500">
                {new Date(artwork.release_date).getFullYear()}
              </p>
            )}

            <div className="mt-6 space-y-1 text-sm text-gray-600">
              {showMedium && artwork.medium && (
                <p>{artwork.medium}</p>
              )}

              {showDimensions && dimensions && (
                <p>
                  {dimensions} {artwork.dimension_unit ?? ""}
                </p>
              )}

              {showPrice &&
                artwork.pricing_type === "fixed" &&
                artwork.price != null && (
                  <p className="pt-3 font-medium text-gray-950">
                    ${artwork.price.toLocaleString()}
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}