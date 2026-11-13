import type { NextConfig } from "next";

/**
 * Response headers for every page. They harden the browser's behaviour and change nothing visible:
 *  - nosniff: the browser must trust the declared content type, never guess one;
 *  - frame protection: the site (and above all the administration area) cannot be shown inside another website's frame;
 *  - referrer policy: other sites receive only the origin, never the full address (which can carry a search or an id);
 *  - permissions policy: the site never asks for the camera, microphone, location or payment, so they are switched off.
 * HTTPS itself (and HSTS) is enforced by the hosting platform. A Content-Security-Policy is deliberately NOT set here: a
 * policy strict enough to matter needs per-request nonces for Next.js's inline scripts, which is a separate, tested piece
 * of work rather than something to switch on blind before launch.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
