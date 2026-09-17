"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import type { Artist, ArtistInput } from "@/types/artists";

import ArtistDrawer from "./artist-drawer";
import { createArtist, deleteArtist, updateArtist } from "@/lib/api";

type ArtistsClientProps = {
  initialArtists: Artist[];
};

export default function ArtistsClient({ initialArtists }: ArtistsClientProps) {
  const [artists, setArtists] = useState(initialArtists);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const filteredArtists = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return artists;
    }

    return artists.filter((artist) => {
      const fullName = `${artist.first_name} ${artist.last_name}`.toLowerCase();

      return (
        fullName.includes(query) ||
        artist.nationality?.toLowerCase().includes(query) ||
        artist.artist_type?.toLowerCase().includes(query)
      );
    });
  }, [artists, search]);

  async function handleSave(data: ArtistInput, closeAfterSave: boolean) {
    try {
      setSaving(true);
      setError("");

      if (selectedArtist) {
        const updated = await updateArtist(selectedArtist.id, data);

        setArtists((current) =>
          current.map((artist) =>
            artist.id === updated.id ? updated : artist,
          ),
        );

        setSelectedArtist(updated);
      } else {
        const created = await createArtist(data);

        setArtists((current) => [created, ...current]);
        setSelectedArtist(created);
      }

      if (closeAfterSave) {
        setDrawerOpen(false);
        setSelectedArtist(null);
      }
    } catch {
      setError(
        "Unable to save artist. Please check the information and try again.",
      );
    } finally {
      setSaving(false);
    }
  }
  async function handleDelete() {
    if (!selectedArtist) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${selectedArtist.first_name} ${selectedArtist.last_name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteArtist(selectedArtist.id);

      setArtists((current) =>
        current.filter((artist) => artist.id !== selectedArtist.id),
      );

      setDrawerOpen(false);
      setSelectedArtist(null);
    } catch {
      setError("Unable to delete artist. Please try again.");
    } finally {
      setDeleting(false);
    }
  }
  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-950">
            Artists
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage artists represented by your gallery.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-medium text-white"
          onClick={() => {
            setSelectedArtist(null);
            setDrawerOpen(true);
          }}
        >
          <Plus size={16} />
          Add New Artist
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-4">
          <div className="relative max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search artists"
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none"
            />
          </div>
        </div>
        
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500">
                Artist
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500">
                Type
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500">
                Nationality
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500">
                Website
              </th>
            </tr>
          </thead>
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <tbody className="divide-y divide-gray-100">
            {filteredArtists.map((artist) => (
              <tr
                key={artist.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSelectedArtist(artist);
                  setDrawerOpen(true);
                }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                      {artist.first_name.charAt(0)}
                      {artist.last_name.charAt(0)}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-950">
                        {artist.first_name} {artist.last_name}
                      </p>

                      <p className="text-xs text-gray-400">
                        Artist #{artist.id}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {artist.artist_type || "—"}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {artist.nationality || "—"}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {artist.website_url || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
      <ArtistDrawer
        open={drawerOpen}
        artist={selectedArtist}
        saving={saving}
        deleting={deleting}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedArtist(null);
        }}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
