import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PreviewShell } from "@/components/dashboard-preview/PreviewShell";

/**
 * Admin dashboard PREVIEW: a frontend-only demonstration with fictional data, deliberately reachable without
 * a login so the client can review it. noindex keeps it out of search results; it is NOT a security measure
 * (and nothing private is here). The real, protected dashboard will live at /admin in a later stage.
 */
export const metadata: Metadata = {
  title: "Dashboard preview (demo)",
  description: "A demonstration of the BOOM MULTI GLOBAL administration dashboard using sample data only.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function DashboardPreviewLayout({ children }: { children: ReactNode }) {
  return <PreviewShell>{children}</PreviewShell>;
}
