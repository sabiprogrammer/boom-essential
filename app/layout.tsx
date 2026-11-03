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
    "BOOM MULTI GLOBAL COMPANY LIMITED, Akure, Ondo State, Nigeria: BOOM Energy, BOOM Security and BOOM Foods. Power. Protection. Provision.",
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
