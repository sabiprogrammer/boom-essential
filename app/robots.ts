import type { MetadataRoute } from "next";
import { company } from "@/content/company";

/**
 * robots.txt. Search engines may crawl the public site. They are asked to stay out of the administration area, the API
 * and the dashboard demonstration. That is a courtesy, not a security measure: those pages are also marked noindex, and
 * the administration area is protected by authentication on the server.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/dashboard-preview"] }],
    sitemap: `https://${company.website}/sitemap.xml`,
  };
}
