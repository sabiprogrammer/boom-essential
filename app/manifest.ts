import type { MetadataRoute } from "next";
import { company } from "@/content/company";

/**
 * The web app manifest: the name, colours and the company logo as the app icon (used when the site is added to a phone's
 * home screen or shown in a browser's app list). The icons are proportional crops and resizes of the client's logo, which
 * is never recoloured or altered; they live in public/assets/branding/. It declares no offline or install behaviour.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: company.legalName,
    short_name: company.shortName,
    description: "Boom Multi Global Company Limited, Akure, Ondo State, Nigeria: BOOM Energy, BOOM Security and BOOM Foods.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#092c59",
    icons: [
      { src: "/assets/branding/logo-192.png", sizes: "192x192", type: "image/png" },
      { src: "/assets/branding/logo-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
