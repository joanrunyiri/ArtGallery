import type { Metadata } from "next";
import { Figtree, Playfair_Display } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/app-shell";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Art Gallery",
  description: "One stop solution for all artists",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${playfair.variable} h-full antialiased`}
    ><body className={`${figtree.variable} ${playfair.variable} antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
