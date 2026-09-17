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
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium text-gray-950">Artists</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage artists represented by your gallery.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedArtist(null);
            setError("");
            setDrawerOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <Plus size={16} />
          Add New Artist
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Artist list */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="relative w-full max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search artists"
              className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-gray-400"
            />
          </div>

          <p className="ml-6 hidden text-xs text-gray-400 sm:block">
            {filteredArtists.length}{" "}
            {filteredArtists.length === 1 ? "artist" : "artists"}
          </p>
        </div>

        {filteredArtists.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
            <p className="text-sm font-medium text-gray-950">
              No artists found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {search
                ? "Try another search."
                : "Add an artist to start building your roster."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="border-b border-gray-200 bg-gray-50/70">
                <tr>
                  <th className="px-6 py-3.5 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Artist
                  </th>

                  <th className="px-6 py-3.5 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Type
                  </th>

                  <th className="px-6 py-3.5 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Nationality
                  </th>

                  <th className="px-6 py-3.5 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Website
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredArtists.map((artist) => (
                  <tr
                    key={artist.id}
                    onClick={() => {
                      setSelectedArtist(artist);
                      setError("");
                      setDrawerOpen(true);
                    }}
                    className="cursor-pointer transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium uppercase text-gray-600">
                          {artist.first_name.charAt(0)}
                          {artist.last_name.charAt(0)}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-950">
                            {artist.first_name} {artist.last_name}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            Artist #{artist.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {artist.artist_type || "—"}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {artist.nationality || "—"}
                    </td>

                    <td className="max-w-[240px] truncate px-6 py-5 text-sm text-gray-500">
                      {artist.website_url || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ArtistDrawer
        key={selectedArtist?.id ?? "new"}
        open={drawerOpen}
        artist={selectedArtist}
        saving={saving}
        deleting={deleting}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedArtist(null);
          setError("");
        }}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
