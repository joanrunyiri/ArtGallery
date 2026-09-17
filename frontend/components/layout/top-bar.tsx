import { Bell } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex h-20 items-center justify-end border-b border-gray-200 bg-white px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <Bell size={19} strokeWidth={1.7} />
        </button>

        <div className="h-6 w-px bg-gray-200" />

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-xs font-medium text-white">
            JR
          </div>
        </div>
      </div>
    </header>
  );
}