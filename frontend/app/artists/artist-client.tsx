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
    <div className="mx-auto max-w-[1168px]">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="page-title">Artists</h1>

          <p className="mt-1 text-sm text-[#64748B]">
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
          className="btn btn-primary"
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

      {/* Search */}
      <div className="mb-6 flex items-center justify-between">
        <div className="relative h-[41px] w-[295px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#9DA4AE]"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search artists"
            className="h-full w-full rounded-lg border border-[#E2E8F0] bg-white pl-9 pr-4 text-sm text-[#111111] outline-none placeholder:text-[#9DA4AE] focus:border-gray-400"
          />
        </div>

        <p className="text-sm text-[#64748B]">
          {filteredArtists.length}{" "}
          {filteredArtists.length === 1 ? "artist" : "artists"}
        </p>
      </div>

      {/* Artist list */}
      <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
        {filteredArtists.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
            <p className="text-sm font-medium text-[#111111]">
              No artists found
            </p>

            <p className="mt-1 text-sm text-[#64748B]">
              {search
                ? "Try another search."
                : "Add an artist to start building your roster."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] table-fixed text-left">
              <thead className="border-b border-[#E2E8F0] bg-[#F9FAFB]">
                <tr className="h-[50px]">
                  <th className="w-[34%] px-4 text-sm font-medium text-[#475569]">
                    Artist
                  </th>

                  <th className="w-[20%] px-4 text-sm font-medium text-[#475569]">
                    Type
                  </th>

                  <th className="w-[22%] px-4 text-sm font-medium text-[#475569]">
                    Nationality
                  </th>

                  <th className="w-[24%] px-4 text-sm font-medium text-[#475569]">
                    Website
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredArtists.map((artist) => (
                  <tr
                    key={artist.id}
                    onClick={() => {
                      setSelectedArtist(artist);
                      setError("");
                      setDrawerOpen(true);
                    }}
                    className="h-[64px] cursor-pointer bg-white transition hover:bg-[#F9FAFB]"
                  >
                    <td className="px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1F5F9] text-xs font-medium uppercase text-[#475569]">
                          {artist.first_name.charAt(0)}
                          {artist.last_name.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[#111111]">
                            {artist.first_name} {artist.last_name}
                          </p>

                          <p className="mt-0.5 text-xs text-[#9DA4AE]">
                            Artist #{artist.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 text-sm text-[#475569]">
                      {artist.artist_type || "—"}
                    </td>

                    <td className="px-4 text-sm text-[#475569]">
                      {artist.nationality || "—"}
                    </td>

                    <td className="truncate px-4 text-sm text-[#475569]">
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
