import type { Metadata, Viewport } from "next";
import { company } from "@/content/company";
import { inter, manrope } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${company.website}`),
  title: {
    default: `${company.legalName} — ${company.tagline}`,
    template: `%s | ${company.shortName}`,
  },
  description:
    "Boom Multi Global Company Limited, Akure, Ondo State, Nigeria: BOOM Energy, BOOM Security and BOOM Foods. Power. Protection. Provision.",
  applicationName: company.shortName,
  // The company logo is the site's icon everywhere it can be: the browser tab and bookmarks (app/favicon.ico, app/icon.png),
  // iPhone home screens (app/apple-icon.png), the web app manifest (app/manifest.ts) and the preview shown when a link is
  // shared (app/opengraph-image.png, app/twitter-image.png). Next.js adds the matching tags from those files.
  openGraph: { type: "website", siteName: company.legalName, locale: "en_NG" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#092c59",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={`${manrope.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
