"use client";

import { useMemo, useState } from "react";
import { ImageIcon, Plus, Search } from "lucide-react";
import type { Artist } from "@/types/artists";
import type { Artwork, ArtworkInput } from "@/types/artworks";
import { createArtwork, updateArtwork, deleteArtwork } from "@/lib/api";
import ArtworkDrawer from "./artwork-drawer";
import ExhibitionLabel from "./exhibition-label";
import ArtworkDetailsDrawer from "./artwork-details-drawer";
import Image from "next/image";

type ArtworksClientProps = {
  initialArtworks: Artwork[];
  artists: Artist[];
};

export default function ArtworksClient({
  initialArtworks,
  artists,
}: ArtworksClientProps) {
  const [artworks, setArtworks] = useState(initialArtworks);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [detailArtwork, setDetailArtwork] = useState<Artwork | null>(null);
  const [labelArtwork, setLabelArtwork] = useState<Artwork | null>(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const filteredArtworks = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return artworks;
    }

    return artworks.filter((artwork) => {
      const artist = artists.find((artist) => artist.id === artwork.artist_id);

      const artistName = artist
        ? `${artist.first_name} ${artist.last_name}`.toLowerCase()
        : "";

      return (
        artwork.title.toLowerCase().includes(query) ||
        artwork.medium?.toLowerCase().includes(query) ||
        artistName.includes(query)
      );
    });
  }, [artworks, artists, search]);

  function getArtistName(artistId: number | null) {
    if (!artistId) {
      return "Unassigned";
    }

    const artist = artists.find((artist) => artist.id === artistId);

    if (!artist) {
      return "Unassigned";
    }

    return `${artist.first_name} ${artist.last_name}`;
  }

  async function handleSave(data: ArtworkInput, closeAfterSave: boolean) {
    try {
      setSaving(true);
      setError("");

      if (selectedArtwork) {
        const updated = await updateArtwork(selectedArtwork.id, data);

        setArtworks((current) =>
          current.map((artwork) =>
            artwork.id === updated.id ? updated : artwork,
          ),
        );

        setSelectedArtwork(updated);
      } else {
        const created = await createArtwork(data);

        setArtworks((current) => [created, ...current]);
        setSelectedArtwork(created);
      }

      if (closeAfterSave) {
        setDrawerOpen(false);
        setSelectedArtwork(null);
      }
    } catch {
      setError(
        "Unable to save artwork. Please check the information and try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedArtwork) {
      return;
    }

    const confirmed = window.confirm(`Delete "${selectedArtwork.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteArtwork(selectedArtwork.id);

      setArtworks((current) =>
        current.filter((artwork) => artwork.id !== selectedArtwork.id),
      );

      setDrawerOpen(false);
      setSelectedArtwork(null);
    } catch {
      setError("Unable to delete artwork. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleDetailDelete() {
    if (!detailArtwork) {
      return;
    }

    const confirmed = window.confirm(`Delete "${detailArtwork.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteArtwork(detailArtwork.id);

      setArtworks((current) =>
        current.filter((artwork) => artwork.id !== detailArtwork.id),
      );

      setDetailArtwork(null);
    } catch {
      setError("Unable to delete artwork. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1600px]">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium text-gray-950">Artworks</h1>

          <p className="mt-1 text-sm text-gray-500">
            Browse, organize and manage artworks in your collection.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedArtwork(null);
            setError("");
            setDrawerOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-medium text-white"
        >
          <Plus size={16} />
          Add Artwork
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search artworks"
            className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-gray-400"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Artworks */}
      {filteredArtworks.length === 0 ? (
        <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <ImageIcon size={20} className="text-gray-500" />
          </div>

          <h2 className="mt-4 text-sm font-semibold text-gray-950">
            No artworks found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add an artwork to start building your collection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {filteredArtworks.map((artwork) => (
            <div
              key={artwork.id}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => {
                  setDetailArtwork(artwork);
                  setError("");
                }}
                className="block w-full text-left"
              >
                {/* Artwork image placeholder */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                  {artwork.image_url ? (
                    <Image
                      src={artwork.image_url}
                      alt={artwork.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon
                        size={30}
                        strokeWidth={1.4}
                        className="text-gray-400"
                      />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="text-base font-medium text-gray-950">
                    {artwork.title}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {getArtistName(artwork.artist_id)}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wide text-gray-400">
                      {artwork.medium || "Artwork"}
                    </span>

                    {artwork.price != null && (
                      <span className="text-sm font-medium text-gray-950">
                        ${artwork.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Artwork details */}
      <ArtworkDetailsDrawer
        artwork={detailArtwork}
        artist={
          detailArtwork?.artist_id
            ? (artists.find(
                (artist) => artist.id === detailArtwork.artist_id,
              ) ?? null)
            : null
        }
        onClose={() => setDetailArtwork(null)}
        onEdit={() => {
          if (!detailArtwork) {
            return;
          }

          setSelectedArtwork(detailArtwork);
          setDetailArtwork(null);
          setDrawerOpen(true);
        }}
        onEditLabel={() => {
          if (!detailArtwork) {
            return;
          }

          setLabelArtwork(detailArtwork);
          setDetailArtwork(null);
        }}
        onDelete={handleDetailDelete}
      />

      {/* Add/Edit artwork */}
      <ArtworkDrawer
        key={selectedArtwork?.id ?? "new"}
        open={drawerOpen}
        artwork={selectedArtwork}
        artists={artists}
        saving={saving}
        deleting={deleting}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedArtwork(null);
          setError("");
        }}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      {/* Exhibition label */}
      {labelArtwork && (
        <ExhibitionLabel
          artwork={labelArtwork}
          artist={
            artists.find((artist) => artist.id === labelArtwork.artist_id) ??
            null
          }
          onClose={() => setLabelArtwork(null)}
        />
      )}
    </div>
  );
}
