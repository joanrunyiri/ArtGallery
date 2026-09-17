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

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
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

  const artistName = artist
    ? `${artist.first_name} ${artist.last_name}`
    : "Unassigned artist";

  const dimensions = [artwork.height, artwork.width, artwork.depth]
    .filter((value) => value !== null)
    .join(" × ");

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Darkened main page */}
      <button
        type="button"
        aria-label="Close exhibition label"
        onClick={onClose}
        className="absolute inset-0 bg-black/25"
      />

      {/* Exhibition label workspace */}
      <div className="relative flex h-full w-full max-w-[1100px] flex-col bg-white shadow-xl">
        {/* Header */}
        <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-gray-200 px-8">
          <div>
            <h2 className="text-base font-medium text-gray-950">
              Manage exhibition label
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {artwork.title}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close exhibition label"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </header>

        {/* Workspace */}
        <div className="grid min-h-0 flex-1 grid-cols-[320px_1fr]">
          {/* Settings */}
          <aside className="overflow-y-auto border-r border-gray-200 bg-white px-7 py-8">
            <section>
              <h3 className="text-sm font-medium text-gray-950">
                Label style
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Choose how the exhibition label is presented.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStyle("classic")}
                  className={`border px-4 py-3 text-sm transition ${
                    style === "classic"
                      ? "border-gray-950 bg-gray-950 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  Classic
                </button>

                <button
                  type="button"
                  onClick={() => setStyle("minimal")}
                  className={`border px-4 py-3 text-sm transition ${
                    style === "minimal"
                      ? "border-gray-950 bg-gray-950 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  Minimal
                </button>
              </div>
            </section>

            <div className="my-8 h-px bg-gray-200" />

            <section>
              <h3 className="text-sm font-medium text-gray-950">
                Information
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Choose which artwork details appear on the label.
              </p>

              <div className="mt-5">
                <Toggle
                  label="Artist"
                  checked={showArtist}
                  onChange={setShowArtist}
                />

                <Toggle
                  label="Medium"
                  checked={showMedium}
                  onChange={setShowMedium}
                />

                <Toggle
                  label="Dimensions"
                  checked={showDimensions}
                  onChange={setShowDimensions}
                />

                <Toggle
                  label="Price"
                  checked={showPrice}
                  onChange={setShowPrice}
                />
              </div>
            </section>
          </aside>

          {/* Preview area */}
          <main className="flex min-w-0 items-center justify-center overflow-auto bg-[#f5f5f3] p-12">
            <div className="w-full max-w-[560px]">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.1em] text-gray-500">
                Preview
              </p>

              <div
                className={`min-h-[360px] bg-white ${
                  style === "classic"
                    ? "border border-gray-300 px-12 py-11"
                    : "px-12 py-11 shadow-sm"
                }`}
              >
                {showArtist && (
                  <p
                    className={
                      style === "classic"
                        ? "text-sm text-gray-600"
                        : "text-xs font-medium uppercase tracking-[0.1em] text-gray-500"
                    }
                  >
                    {artistName}
                  </p>
                )}

                <h3
                  className={
                    style === "classic"
                      ? "mt-4 font-serif text-3xl italic leading-tight text-gray-950"
                      : "mt-4 text-2xl font-medium leading-tight text-gray-950"
                  }
                >
                  {artwork.title}
                </h3>

                {artwork.release_date && (
                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(artwork.release_date).getFullYear()}
                  </p>
                )}

                <div className="mt-8 space-y-2 text-sm leading-6 text-gray-600">
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
                    artwork.price !== null && (
                      <p className="pt-4 font-medium text-gray-950">
                        ${artwork.price.toLocaleString()}
                      </p>
                    )}
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="flex h-[72px] shrink-0 items-center justify-end gap-3 border-t border-gray-200 bg-white px-8">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Done
          </button>
        </footer>
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between border-b border-gray-100 py-4 last:border-b-0">
      <span className="text-sm text-gray-700">{label}</span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-gray-950"
      />
    </label>
  );
}