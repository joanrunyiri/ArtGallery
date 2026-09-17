"use client";

import PageError from "@/components/ui/error-page";

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <PageError
      title="Unable to load dashboard"
      message="We couldn't load your dashboard data right now. Please try again."
      onRetry={reset}
    />
  );
}
