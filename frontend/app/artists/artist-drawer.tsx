"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
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

function getInitialForm(artist: Artist | null): ArtistInput {
  if (!artist) {
    return { ...emptyArtist };
  }

  return {
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
  };
}

export default function ArtistDrawer({
  open,
  artist,
  saving,
  deleting,
  onClose,
  onSave,
  onDelete,
}: ArtistDrawerProps) {
  const [form, setForm] = useState<ArtistInput>(() => getInitialForm(artist));

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
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dimmed application */}
      <button
        type="button"
        aria-label="Close artist drawer"
        onClick={onClose}
        className="absolute inset-0 bg-black/25"
      />

      {/* Drawer */}
      <div className="relative flex h-full w-full max-w-[760px] flex-col bg-white shadow-xl">
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-5">
          <h2 className="text-xl font-medium text-gray-950">
            {artist ? "Edit artist" : "Add artist"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close artist drawer"
            className="flex h-8 w-8 items-center justify-center text-gray-500 transition hover:bg-gray-100"
          >
            <X size={17} />
          </button>
        </header>

        <form
          id="artist-form"
          onSubmit={async (event) => {
            event.preventDefault();
            await save(false);
          }}
          className="flex-1 overflow-y-auto"
        >
          {/* Top section */}
          <section className="grid grid-cols-[minmax(0,1fr)_210px] gap-8 border-b border-gray-200 px-6 py-6">
            <div>
              <h3 className="mb-5 font-serif text-base font-medium text-gray-950">
                Details
              </h3>

              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <Field
                  label="First name"
                  required
                  value={form.first_name}
                  onChange={(value) => updateField("first_name", value)}
                />

                <Field
                  label="Last name"
                  required
                  value={form.last_name}
                  onChange={(value) => updateField("last_name", value)}
                />

                <div className="col-span-1">
                  <Field
                    label="Artist type"
                    value={form.artist_type ?? ""}
                    placeholder="e.g. Art Collector"
                    onChange={(value) => updateField("artist_type", value)}
                  />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-serif text-base font-medium text-gray-950">
                  Dates & nationality
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  This information is optional.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
                  <Field
                    label="Year/Date of birth"
                    type="date"
                    value={form.birth_date ?? ""}
                    onChange={(value) => updateField("birth_date", value)}
                  />

                  <Field
                    label="Year/Date of death"
                    type="date"
                    value={form.death_date ?? ""}
                    onChange={(value) => updateField("death_date", value)}
                  />

                  <Field
                    label="Nationality"
                    value={form.nationality ?? ""}
                    placeholder="Select or enter nationality"
                    onChange={(value) => updateField("nationality", value)}
                  />
                </div>
              </div>
            </div>

            {/* Profile image */}
            <div>
              <div className="flex aspect-[4/5] w-full items-center justify-center border border-dashed border-gray-200 bg-gray-50">
                <Plus size={28} strokeWidth={1.2} className="text-gray-500" />
              </div>

              <p className="mt-3 text-center text-xs leading-5 text-gray-400">
                Add profile image of Artist
              </p>

              <label className="mt-4 block">
                <span className="sr-only">Profile image URL</span>

                <input
                  type="url"
                  value={form.profile_image_url ?? ""}
                  onChange={(event) =>
                    updateField("profile_image_url", event.target.value)
                  }
                  placeholder="Image URL"
                  className={inputClass}
                />
              </label>
            </div>
          </section>

          {/* Bibliography */}
          <section className="border-b border-gray-200 px-6 py-6">
            <h3 className="mb-5 font-serif text-base font-medium text-gray-950">
              Bibliography
            </h3>

            <div>
              <FieldLabel>Full biography</FieldLabel>

              <textarea
                rows={4}
                maxLength={3000}
                value={form.biography ?? ""}
                onChange={(event) =>
                  updateField("biography", event.target.value)
                }
                placeholder="Add full biography"
                className={`${inputClass} resize-none`}
              />

              <p className="mt-1 text-right text-[11px] text-gray-400">
                {(form.biography ?? "").length}/3000
              </p>
            </div>

            <div className="mt-4">
              <FieldLabel>Bibliography</FieldLabel>

              <textarea
                rows={3}
                maxLength={5000}
                value={form.bibliography ?? ""}
                onChange={(event) =>
                  updateField("bibliography", event.target.value)
                }
                placeholder="Add bibliography"
                className={`${inputClass} resize-none`}
              />

              <p className="mt-1 text-right text-[11px] text-gray-400">
                {(form.bibliography ?? "").length}/5000
              </p>
            </div>
          </section>

          {/* Documents and links */}
          <section className="px-6 py-6">
            <h3 className="mb-5 font-serif text-base font-medium text-gray-950">
              Documents & links
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Artist Website"
                type="url"
                value={form.website_url ?? ""}
                placeholder="https://..."
                onChange={(value) => updateField("website_url", value)}
              />

              <Field
                label="CV / Document"
                type="url"
                value={form.cv_url ?? ""}
                placeholder="Document URL"
                onChange={(value) => updateField("cv_url", value)}
              />
            </div>

            <div className="mt-5">
              <FieldLabel>Socials</FieldLabel>

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Instagram"
                  hideLabel
                  type="url"
                  value={form.instagram_url ?? ""}
                  placeholder="Instagram URL"
                  onChange={(value) => updateField("instagram_url", value)}
                />

                <Field
                  label="Facebook"
                  hideLabel
                  type="url"
                  value={form.facebook_url ?? ""}
                  placeholder="Facebook URL"
                  onChange={(value) => updateField("facebook_url", value)}
                />
              </div>
            </div>
          </section>
        </form>

        {/* Footer */}
        <footer className="flex shrink-0 items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-5">
            <button
              type="submit"
              form="artist-form"
              disabled={saving || deleting}
              className="text-xs font-medium text-gray-950 hover:text-gray-600 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              disabled={saving || deleting}
              onClick={() => save(true)}
              className="text-xs font-medium text-gray-950 hover:text-gray-600 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save and Close"}
            </button>
          </div>

          <div className="flex items-center gap-5">
            {artist && (
              <button
                type="button"
                disabled={saving || deleting}
                onClick={onDelete}
                className="text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              disabled={saving || deleting}
              className="text-xs font-medium text-gray-500 hover:text-gray-950 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-gray-700">
      {children}
    </label>
  );
}

type FieldProps = {
  label: string;
  value: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hideLabel?: boolean;
  onChange: (value: string) => void;
};

function Field({
  label,
  value,
  type = "text",
  required = false,
  placeholder,
  hideLabel = false,
  onChange,
}: FieldProps) {
  return (
    <label className="block">
      <span
        className={
          hideLabel ? "sr-only" : "block text-xs font-medium text-gray-700"
        }
      >
        {label}
      </span>

      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </label>
  );
}
