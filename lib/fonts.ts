import { Inter, Manrope } from "next/font/google";

/*
 * Self-hosted Google fonts via next/font (no runtime request to Google).
 * Both are variable fonts. If a font cannot be fetched in development, Next falls back
 * to the system stack declared in app/tokens.css (--font-heading / --font-sans).
 */

export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});
