"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

type PageErrorProps = {
  title?: string;
  message?: string;
  onRetry: () => void;
};

export default function PageError({
  title = "Something went wrong",
  message = "We couldn't load this page. Please try again.",
  onRetry,
}: PageErrorProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <AlertCircle
            size={20}
            strokeWidth={1.5}
            className="text-gray-500"
          />
        </div>

        <h2 className="mt-5 font-serif text-xl font-medium text-gray-950">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <RefreshCw size={15} />
          Try again
        </button>
      </div>
    </div>
  );
}