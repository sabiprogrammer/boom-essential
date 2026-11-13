import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Shared by `/admin` and `/admin/login`: the administrator area is never indexed and its pages are not
 * cached by crawlers. This is a courtesy to search engines, not a security measure (the proxy and
 * `requireAdmin()` are). The public site's own metadata is untouched.
 */
export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}
