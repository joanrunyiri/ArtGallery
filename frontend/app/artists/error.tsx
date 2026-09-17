"use client";

import PageError from "@/components/ui/error-page";

export default function ArtistsError({ reset }: { reset: () => void }) {
  return (
    <PageError
      title="Unable to load artists"
      message="We couldn't load your artists right now. Please try again."
      onRetry={reset}
    />
  );
}
