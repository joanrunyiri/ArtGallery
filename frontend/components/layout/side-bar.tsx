"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Image, Users } from "lucide-react";
import NextImage from "next/image";
import type { LucideIcon } from "lucide-react";

type NavigationItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
};


const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },

  {
    name: "Artworks",
    href: "/artworks",
    icon: Image,
  },

  {
    name: "Artists",
    href: "/artists",
    icon: Users,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-20 items-center px-6">
        <NextImage
          src="/logo.svg"
          alt="Art Circles"
          width={120}
          height={32}
          className="w-[120px] h-auto"
        />
      </div>

      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            if (item.disabled) {
              return (
                <div
                  key={item.name}
                  className="flex cursor-default items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400"
                >
                  <Icon size={18} strokeWidth={1.7} />
                  <span>{item.name}</span>
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-gray-100 font-medium text-gray-950"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                }`}
              >
                <Icon size={18} strokeWidth={1.7} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
