"use client";

import { useMemo, useState } from "react";
import { ImageIcon, Plus } from "lucide-react";
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
    <div className="mx-auto max-w-[1156px]">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="page-title">Artworks</h1>
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
          className="flex h-12 w-[155px] items-center justify-center gap-1.5 rounded-md bg-gray-950 px-3 py-2.5 text-sm font-medium text-white"
        >
          <Plus size={16} />
          Add Artwork
        </button>
      </div>

      {/* Search and filter */}
      <div className="mb-8 flex items-center gap-3">
        <div className="relative h-[41px] w-[295px]">
          <Image
            src="/icons/search.svg"
            alt=""
            width={14}
            height={14}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search artworks"
            className="h-full w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-400"
          />
        </div>

        <button
          type="button"
          className="flex h-[41px] w-[115px] items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-sm font-medium text-gray-700"
        >
          <Image
            src="/icons/filter-icon.svg"
            alt=""
            width={14}
            height={14}
            style={{ width: 14, height: "auto" }}
          />{" "}
          <span className="whitespace-nowrap">Sort & Filter</span>
        </button>
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {" "}
          {filteredArtworks.map((artwork) => (
            <div key={artwork.id} className="group w-[270px]">
              <button
                type="button"
                onClick={() => {
                  setDetailArtwork(artwork);
                  setError("");
                }}
                className="block w-full text-left"
              >
                {/* Artwork image placeholder */}
                <div
                  className="relative overflow-hidden rounded-md bg-gray-100"
                  style={{ width: 270, height: 279 }}
                >
                  {" "}
                  {artwork.image_url ? (
                    <Image
                      src={artwork.image_url}
                      alt={artwork.title}
                      fill
                      sizes="270px"
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

                <div className="mt-4">
                  <h2 className="font-[var(--font-playfair)] text-[18px] font-medium leading-none tracking-[-0.01em] text-gray-950">
                    {artwork.title}
                  </h2>

                  <p className="mt-2 text-base font-medium leading-[22px] text-gray-500">
                    {getArtistName(artwork.artist_id)}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    {/* <span className="text-xs uppercase tracking-wide text-gray-400">
                      {artwork.medium || "Artwork"}
                    </span> */}

                    {artwork.price != null && (
                      <span className="text-[18px] font-bold leading-none tracking-[-0.02em] text-gray-950">
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
