"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Artist } from "@/types/artist";
import type { Artwork, ArtworkInput } from "@/types/artwork";

type ArtworkDrawerProps = {
  open: boolean;
  artwork: Artwork | null;
  artists: Artist[];
  saving: boolean;
  deleting: boolean;
  onClose: () => void;
  onSave: (data: ArtworkInput, closeAfterSave: boolean) => Promise<void>;
  onDelete: () => Promise<void>;
};

const emptyArtwork: ArtworkInput = {
  artist_id: null,
  title: "",
  pricing_type: "fixed",
  price: null,
  description: "",
  height: null,
  width: null,
  depth: null,
  dimension_unit: "cm",
  framing: "",
  medium: "",
  release_date: "",
  edition_size: null,
  materials: "",
  hand_signed: false,
  individually_numbered: false,
  coa_included: false,
  packaging: "",
  image_url: "",
};

export default function ArtworkDrawer({
  open,
  artwork,
  artists,
  saving,
  deleting,
  onClose,
  onSave,
  onDelete,
}: ArtworkDrawerProps) {
  const [form, setForm] = useState<ArtworkInput>(emptyArtwork);

  useEffect(() => {
    if (!open) return;

    if (!artwork) {
      setForm(emptyArtwork);
      return;
    }

    setForm({
      artist_id: artwork.artist_id,
      title: artwork.title,
      pricing_type: artwork.pricing_type,
      price: artwork.price,
      description: artwork.description ?? "",
      height: artwork.height,
      width: artwork.width,
      depth: artwork.depth,
      dimension_unit: artwork.dimension_unit ?? "cm",
      framing: artwork.framing ?? "",
      medium: artwork.medium ?? "",
      release_date: artwork.release_date ?? "",
      edition_size: artwork.edition_size,
      materials: artwork.materials ?? "",
      hand_signed: artwork.hand_signed,
      individually_numbered: artwork.individually_numbered,
      coa_included: artwork.coa_included,
      packaging: artwork.packaging ?? "",
      image_url: artwork.image_url ?? "",
    });
  }, [artwork, open]);

  function updateField<K extends keyof ArtworkInput>(
    field: K,
    value: ArtworkInput[K],
  ) {
    setForm((current: ArtworkInput) => ({
      ...current,
      [field]: value,
    }));
  }

  async function save(closeAfterSave: boolean) {
    await onSave(form, closeAfterSave);
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close artwork drawer"
        onClick={onClose}
        className="absolute inset-0 bg-black/20"
      />

      <div className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-950">
              {artwork ? "Edit Artwork" : "Add Artwork"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add artwork information and catalogue details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <form
          id="artwork-form"
          onSubmit={async (event) => {
            event.preventDefault();
            await save(false);
          }}
          className="flex-1 overflow-y-auto px-6 py-6"
        >
          <div className="space-y-6">
            <div className="border-t border-gray-200 pt-6">
              <h3 className="mb-4 text-sm font-semibold text-gray-950">
                Edition & Catalogue
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm text-gray-700">
                  Release Date
                  <input
                    type="date"
                    value={form.release_date ?? ""}
                    onChange={(event) =>
                      updateField("release_date", event.target.value)
                    }
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5"
                  />
                </label>

                <label className="text-sm text-gray-700">
                  Edition Size
                  <input
                    type="number"
                    min="0"
                    value={form.edition_size ?? ""}
                    onChange={(event) =>
                      updateField(
                        "edition_size",
                        event.target.value ? Number(event.target.value) : null,
                      )
                    }
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5"
                  />
                </label>

                <label className="col-span-2 text-sm text-gray-700">
                  Materials
                  <input
                    value={form.materials ?? ""}
                    onChange={(event) =>
                      updateField("materials", event.target.value)
                    }
                    placeholder="e.g. Oil paint, linen canvas"
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5"
                  />
                </label>
              </div>

              <div className="mt-5 space-y-3">
                <label className="flex items-center gap-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.hand_signed}
                    onChange={(event) =>
                      updateField("hand_signed", event.target.checked)
                    }
                    className="h-4 w-4"
                  />
                  Hand signed
                </label>

                <label className="flex items-center gap-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.individually_numbered}
                    onChange={(event) =>
                      updateField("individually_numbered", event.target.checked)
                    }
                    className="h-4 w-4"
                  />
                  Individually numbered
                </label>

                <label className="flex items-center gap-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.coa_included}
                    onChange={(event) =>
                      updateField("coa_included", event.target.checked)
                    }
                    className="h-4 w-4"
                  />
                  Certificate of authenticity included
                </label>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="mb-4 text-sm font-semibold text-gray-950">
                Packaging & Image
              </h3>

              <div className="space-y-4">
                <label className="block text-sm text-gray-700">
                  Packaging
                  <input
                    value={form.packaging ?? ""}
                    onChange={(event) =>
                      updateField("packaging", event.target.value)
                    }
                    placeholder="e.g. Wooden crate"
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5"
                  />
                </label>

                <label className="block text-sm text-gray-700">
                  Image URL
                  <input
                    type="url"
                    value={form.image_url ?? ""}
                    onChange={(event) =>
                      updateField("image_url", event.target.value)
                    }
                    placeholder="https://..."
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5"
                  />
                </label>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-950">
                Artwork Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <label className="col-span-2 text-sm text-gray-700">
                  Title
                  <input
                    required
                    value={form.title}
                    onChange={(event) =>
                      updateField("title", event.target.value)
                    }
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-gray-400"
                  />
                </label>

                <label className="col-span-2 text-sm text-gray-700">
                  Artist
                  <select
                    value={form.artist_id ?? ""}
                    onChange={(event) =>
                      updateField(
                        "artist_id",
                        event.target.value ? Number(event.target.value) : null,
                      )
                    }
                    className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-gray-400"
                  >
                    <option value="">Unassigned</option>

                    {artists.map((artist) => (
                      <option key={artist.id} value={artist.id}>
                        {artist.first_name} {artist.last_name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm text-gray-700">
                  Pricing Type
                  <select
                    value={form.pricing_type}
                    onChange={(event) =>
                      updateField("pricing_type", event.target.value)
                    }
                    className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="contact">Price on Request</option>
                    <option value="not_for_sale">Not for Sale</option>
                  </select>
                </label>

                <label className="text-sm text-gray-700">
                  Price
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    disabled={form.pricing_type !== "fixed"}
                    value={form.price ?? ""}
                    onChange={(event) =>
                      updateField(
                        "price",
                        event.target.value ? Number(event.target.value) : null,
                      )
                    }
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 disabled:bg-gray-50"
                  />
                </label>

                <label className="col-span-2 text-sm text-gray-700">
                  Description
                  <textarea
                    rows={4}
                    value={form.description ?? ""}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    className="mt-1.5 w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-gray-400"
                  />
                </label>
              </div>
            </div>
          </div>
        </form>

        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <div>
            {artwork && (
              <button
                type="button"
                onClick={onDelete}
                disabled={saving || deleting}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving || deleting}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="artwork-form"
              disabled={saving || deleting}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={() => save(true)}
              disabled={saving || deleting}
              className="rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-medium text-white"
            >
              {saving ? "Saving..." : "Save and Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
