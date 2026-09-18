"use client";

import { useState } from "react";
import { ImageIcon, X } from "lucide-react";
import type { Artist } from "@/types/artists";
import type { Artwork, ArtworkInput } from "@/types/artworks";

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

function getInitialForm(artwork: Artwork | null): ArtworkInput {
  if (!artwork) {
    return { ...emptyArtwork };
  }

  return {
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
  };
}

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
  const [form, setForm] = useState<ArtworkInput>(() => getInitialForm(artwork));

  function updateField<K extends keyof ArtworkInput>(
    field: K,
    value: ArtworkInput[K],
  ) {
    setForm((current) => ({
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
      {/* Dimmed Artworks page */}
      <button
        type="button"
        aria-label="Close artwork drawer"
        onClick={onClose}
        className="absolute inset-0 bg-black/25"
      />

      {/* Drawer */}
      <div className="relative flex h-full w-full max-w-[620px] flex-col bg-white shadow-xl">
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between border-b border-gray-200 px-8 py-6">
          <div>
            <h2 className="text-lg font-medium text-gray-950">
              {artwork ? "Edit artwork" : "Add artwork"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {artwork
                ? "Update artwork and catalogue information."
                : "Add a new artwork to your collection."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close artwork drawer"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </header>

        <form
          id="artwork-form"
          onSubmit={async (event) => {
            event.preventDefault();
            await save(false);
          }}
          className="flex-1 overflow-y-auto"
        >
          {/* Image */}
          <FormSection
            title="Artwork image"
            description="Add an image reference for this artwork."
          >
            <div className="flex gap-5">
              <div className="flex h-32 w-28 shrink-0 items-center justify-center border border-gray-200 bg-gray-50">
                <ImageIcon
                  size={26}
                  strokeWidth={1.4}
                  className="text-gray-400"
                />
              </div>

              <div className="flex-1">
                <FieldLabel>Image URL</FieldLabel>

                <input
                  type="url"
                  value={form.image_url ?? ""}
                  onChange={(event) =>
                    updateField("image_url", event.target.value)
                  }
                  placeholder="https://..."
                  className={inputClass}
                />

                <p className="mt-2 text-xs leading-5 text-gray-400">
                  For this demo, artwork images are referenced by URL rather
                  than uploaded to external storage.
                </p>
              </div>
            </div>
          </FormSection>

          {/* Artwork information */}
          <FormSection
            title="Artwork details"
            description="Core catalogue information for the artwork."
          >
            <div className="space-y-5">
              <div>
                <FieldLabel>Title</FieldLabel>

                <input
                  required
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Artwork title"
                  className={inputClass}
                />
              </div>

              <div>
                <FieldLabel>Artist</FieldLabel>

                <select
                  value={form.artist_id ?? ""}
                  onChange={(event) =>
                    updateField(
                      "artist_id",
                      event.target.value ? Number(event.target.value) : null,
                    )
                  }
                  className={inputClass}
                >
                  <option value="">Unassigned</option>

                  {artists.map((artist) => (
                    <option key={artist.id} value={artist.id}>
                      {artist.first_name} {artist.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel>Description</FieldLabel>

                <textarea
                  rows={4}
                  value={form.description ?? ""}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Describe the artwork"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Medium</FieldLabel>

                  <input
                    value={form.medium ?? ""}
                    onChange={(event) =>
                      updateField("medium", event.target.value)
                    }
                    placeholder="e.g. Oil on canvas"
                    className={inputClass}
                  />
                </div>

                <div>
                  <FieldLabel>Framing</FieldLabel>

                  <input
                    value={form.framing ?? ""}
                    onChange={(event) =>
                      updateField("framing", event.target.value)
                    }
                    placeholder="e.g. Unframed"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </FormSection>

          {/* Pricing */}
          <FormSection
            title="Pricing"
            description="Set the artwork's availability and price."
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Pricing type</FieldLabel>

                <select
                  value={form.pricing_type}
                  onChange={(event) =>
                    updateField("pricing_type", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="fixed">Fixed price</option>
                  <option value="contact">Price on request</option>
                  <option value="not_for_sale">Not for sale</option>
                </select>
              </div>

              <div>
                <FieldLabel>Price</FieldLabel>

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
                  placeholder="0.00"
                  className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400`}
                />
              </div>
            </div>
          </FormSection>

          {/* Dimensions */}
          <FormSection
            title="Dimensions"
            description="Record the physical dimensions of the artwork."
          >
            <div className="grid grid-cols-4 gap-3">
              <div>
                <FieldLabel>Height</FieldLabel>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.height ?? ""}
                  onChange={(event) =>
                    updateField(
                      "height",
                      event.target.value ? Number(event.target.value) : null,
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <FieldLabel>Width</FieldLabel>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.width ?? ""}
                  onChange={(event) =>
                    updateField(
                      "width",
                      event.target.value ? Number(event.target.value) : null,
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <FieldLabel>Depth</FieldLabel>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.depth ?? ""}
                  onChange={(event) =>
                    updateField(
                      "depth",
                      event.target.value ? Number(event.target.value) : null,
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <FieldLabel>Unit</FieldLabel>

                <select
                  value={form.dimension_unit ?? "cm"}
                  onChange={(event) =>
                    updateField("dimension_unit", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                  <option value="mm">mm</option>
                </select>
              </div>
            </div>
          </FormSection>

          {/* Edition */}
          <FormSection
            title="Edition & catalogue"
            description="Add edition and authentication information."
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Release date</FieldLabel>

                <input
                  type="date"
                  value={form.release_date ?? ""}
                  onChange={(event) =>
                    updateField("release_date", event.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <FieldLabel>Edition size</FieldLabel>

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
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-5">
              <FieldLabel>Materials</FieldLabel>

              <input
                value={form.materials ?? ""}
                onChange={(event) =>
                  updateField("materials", event.target.value)
                }
                placeholder="e.g. Oil paint, linen canvas"
                className={inputClass}
              />
            </div>

            <div className="mt-6 divide-y divide-gray-100 border-y border-gray-100">
              <CheckField
                label="Hand signed"
                checked={form.hand_signed}
                onChange={(checked) => updateField("hand_signed", checked)}
              />

              <CheckField
                label="Individually numbered"
                checked={form.individually_numbered}
                onChange={(checked) =>
                  updateField("individually_numbered", checked)
                }
              />

              <CheckField
                label="Certificate of authenticity included"
                checked={form.coa_included}
                onChange={(checked) => updateField("coa_included", checked)}
              />
            </div>
          </FormSection>

          {/* Packaging */}
          <FormSection
            title="Packaging"
            description="Record how the artwork will be packaged."
            last
          >
            <FieldLabel>Packaging</FieldLabel>

            <input
              value={form.packaging ?? ""}
              onChange={(event) => updateField("packaging", event.target.value)}
              placeholder="e.g. Wooden crate"
              className={inputClass}
            />
          </FormSection>
        </form>

        {/* Footer */}
        <footer className="flex shrink-0 items-center justify-between border-t border-gray-200 bg-white px-8 py-4">
          <div>
            {artwork && (
              <button
                type="button"
                onClick={onDelete}
                disabled={saving || deleting}
                className="px-2 py-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete artwork"}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving || deleting}
              className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="artwork-form"
              disabled={saving || deleting}
              className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={() => save(true)}
              disabled={saving || deleting}
              className="rounded-md bg-gray-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save and close"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

const inputClass = "form-input w-full";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {children}
    </label>
  );
}

function FormSection({
  title,
  description,
  children,
  last = false,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section className={`px-8 py-7 ${last ? "" : "border-b border-gray-200"}`}>
      <div className="mb-5">
        <h3 className="text-sm font-medium text-gray-950">{title}</h3>

        {description && (
          <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
        )}
      </div>

      {children}
    </section>
  );
}

function CheckField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-4">
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
