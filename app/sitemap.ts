import type { MetadataRoute } from "next";
import { company } from "@/content/company";

/**
 * The public pages, for search engines. It lists only pages that exist and are meant to be found: never the
 * administration area, the API or the dashboard demonstration. No "last modified" dates are given: they would have to be
 * read from the clock, which a prerendered page may not do, and a wrong date is worse than none.
 */
const publicPaths = [
  { path: "", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/energy", priority: 0.9 },
  { path: "/security", priority: 0.9 },
  { path: "/foods", priority: 0.9 },
  { path: "/industrial-equipment", priority: 0.7 },
  { path: "/products", priority: 0.8 },
  { path: "/projects", priority: 0.7 },
  { path: "/careers", priority: 0.4 },
  { path: "/contact", priority: 0.9 },
  { path: "/privacy", priority: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.map(({ path, priority }) => ({ url: `https://${company.website}${path}`, priority }));
}
