import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import FaviconHead from "@/components/favicon-head";
import { PostHogProvider } from "@/components/posthog-provider";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Gelasio (variable) — used only for NoPoint headlines on the marketing page
// and the seed-2026 deck. `display: 'block'` + `preload: true` prevents the
// FOUT swap: the browser holds text invisible (typically ~50ms with the font
// preloaded from the same origin) instead of flashing the fallback first.
// `adjustFontFallback: 'Times New Roman'` size-matches the fallback so there
// is zero layout shift in the rare case the block timeout is exceeded.
const gelasio = localFont({
  src: [
    {
      path: "./fonts/Gelasio-VariableFont_wght.ttf",
      style: "normal",
      weight: "400 700",
    },
    {
      path: "./fonts/Gelasio-Italic-VariableFont_wght.ttf",
      style: "italic",
      weight: "400 700",
    },
  ],
  variable: "--font-gelasio",
  display: "block",
  preload: true,
  adjustFontFallback: "Times New Roman",
  fallback: ["Times New Roman", "Times", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "🛝 NoPoint — Open-source pitch decks as code",
  description: "🛝 NoPoint — the open-source core for pitch decks as code: programmable slides, investor portals, and exportable presentation runtimes. Self-host it, or run the managed cloud.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "🛝 NoPoint — Open-source pitch decks as code",
    description: "Open source: build slide decks as code, present them live, and export to PNG, PDF, or PPTX. Self-host the core, or run the managed cloud.",
    url: SITE_URL,
    siteName: "🛝 NoPoint",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${gelasio.variable} h-full antialiased`}
    >
      <head>
        <FaviconHead />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-950 text-white overflow-x-hidden">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
