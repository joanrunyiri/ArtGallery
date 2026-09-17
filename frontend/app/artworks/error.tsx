"use client";

import PageError from "@/components/ui/error-page";

export default function ArtworksError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <PageError
      title="Unable to load artworks"
      message="We couldn't load your artworks right now. Please try again."
      onRetry={reset}
    />
  );
}