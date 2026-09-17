"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Artist, ArtistInput } from "@/types/artists";

type ArtistDrawerProps = {
  open: boolean;
  artist: Artist | null;
  saving: boolean;
  deleting: boolean;
  onClose: () => void;
  onSave: (data: ArtistInput, closeAfterSave: boolean) => Promise<void>;
  onDelete: () => Promise<void>;
};

const emptyArtist: ArtistInput = {
  first_name: "",
  last_name: "",
  artist_type: "",
  birth_date: "",
  death_date: "",
  nationality: "",
  biography: "",
  bibliography: "",
  website_url: "",
  cv_url: "",
  instagram_url: "",
  facebook_url: "",
  profile_image_url: "",
};

export default function ArtistDrawer({
  open,
  artist,
  saving,
  deleting,
  onClose,
  onSave,
  onDelete,
}: ArtistDrawerProps) {
  const [form, setForm] = useState<ArtistInput>(emptyArtist);

  useEffect(() => {
    if (artist) {
      setForm({
        first_name: artist.first_name,
        last_name: artist.last_name,
        artist_type: artist.artist_type ?? "",
        birth_date: artist.birth_date ?? "",
        death_date: artist.death_date ?? "",
        nationality: artist.nationality ?? "",
        biography: artist.biography ?? "",
        bibliography: artist.bibliography ?? "",
        website_url: artist.website_url ?? "",
        cv_url: artist.cv_url ?? "",
        instagram_url: artist.instagram_url ?? "",
        facebook_url: artist.facebook_url ?? "",
        profile_image_url: artist.profile_image_url ?? "",
      });
    } else {
      setForm(emptyArtist);
    }
  }, [artist, open]);

  if (!open) {
    return null;
  }

  function updateField(field: keyof ArtistInput, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function save(closeAfterSave: boolean) {
    await onSave(form, closeAfterSave);
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close artist drawer"
        onClick={onClose}
        className="absolute inset-0 bg-black/20"
      />

      <div className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-950">
              {artist ? "Edit Artist" : "Add New Artist"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {artist
                ? "Update the artist information."
                : "Add an artist to your gallery."}
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
          id="artist-form"
          onSubmit={async (event) => {
            event.preventDefault();
            await save(false);
          }}
          className="flex-1 overflow-y-auto px-6 py-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="First Name"
              required
              value={form.first_name}
              onChange={(value) => updateField("first_name", value)}
            />

            <Field
              label="Last Name"
              required
              value={form.last_name}
              onChange={(value) => updateField("last_name", value)}
            />

            <Field
              label="Artist Type"
              value={form.artist_type ?? ""}
              onChange={(value) => updateField("artist_type", value)}
            />

            <Field
              label="Nationality"
              value={form.nationality ?? ""}
              onChange={(value) => updateField("nationality", value)}
            />

            <Field
              label="Birth Date"
              type="date"
              value={form.birth_date ?? ""}
              onChange={(value) => updateField("birth_date", value)}
            />

            <Field
              label="Death Date"
              type="date"
              value={form.death_date ?? ""}
              onChange={(value) => updateField("death_date", value)}
            />
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Biography
            </label>

            <textarea
              rows={5}
              maxLength={3000}
              value={form.biography ?? ""}
              onChange={(event) => updateField("biography", event.target.value)}
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {(form.biography ?? "").length}/3000
            </p>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Bibliography
            </label>

            <textarea
              rows={4}
              maxLength={5000}
              value={form.bibliography ?? ""}
              onChange={(event) =>
                updateField("bibliography", event.target.value)
              }
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {(form.bibliography ?? "").length}/5000
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <Field
              label="Website"
              type="url"
              value={form.website_url ?? ""}
              onChange={(value) => updateField("website_url", value)}
            />

            <Field
              label="CV / Document URL"
              type="url"
              value={form.cv_url ?? ""}
              onChange={(value) => updateField("cv_url", value)}
            />

            <Field
              label="Instagram"
              type="url"
              value={form.instagram_url ?? ""}
              onChange={(value) => updateField("instagram_url", value)}
            />

            <Field
              label="Facebook"
              type="url"
              value={form.facebook_url ?? ""}
              onChange={(value) => updateField("facebook_url", value)}
            />

            <div className="col-span-2">
              <Field
                label="Profile Image URL"
                type="url"
                value={form.profile_image_url ?? ""}
                onChange={(value) => updateField("profile_image_url", value)}
              />
            </div>
          </div>
        </form>

        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
          <div>
            {artist && (
              <button
                type="button"
                disabled={saving || deleting}
                onClick={onDelete}
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
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="artist-form"
              disabled={saving || deleting}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-900 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              disabled={saving || deleting}
              onClick={() => save(true)}
              className="rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save and Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  type?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

function Field({
  label,
  value,
  type = "text",
  required = false,
  onChange,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </span>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
      />
    </label>
  );
}
