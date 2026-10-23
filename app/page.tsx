import type { Metadata, Viewport } from "next";
import { League_Spartan, Plus_Jakarta_Sans, Tangerine } from "next/font/google";
import "./landing.css";
import { LandingPage } from "@/components/landing/landing-page";
import { landingMeta } from "@/lib/landing/meta";

// CSS variable names must match FONT_MAP in scripts/sync-lovable.mjs.
const spartan = League_Spartan({ subsets: ["latin"], weight: ["700", "800", "900"], variable: "--font-spartan", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-pjs", display: "swap" });
const tangerine = Tangerine({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-tangerine", display: "swap" });

export const metadata: Metadata = {
  title: landingMeta.title,
  description: landingMeta.description,
  openGraph: { title: landingMeta.ogTitle, description: landingMeta.ogDescription, type: "website" },
  twitter: { card: "summary_large_image" },
  icons: { icon: [{ url: "/favicon.png", type: "image/png" }], apple: "/apple-touch-icon.png" },
  manifest: "/manifest.webmanifest",
  appleWebApp: { title: "Punta Biker" },
};

export const viewport: Viewport = { themeColor: "#163E44" };

export default function Home() {
  return (
    <div className={`${spartan.variable} ${jakarta.variable} ${tangerine.variable}`}>
      <LandingPage />
    </div>
  );
}
