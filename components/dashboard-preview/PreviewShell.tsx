import type { ReactNode } from "react";
import { DemoBanner } from "./DemoBanner";
import { DemoReadyGate } from "./DemoReadyGate";
import { DetailDrawerHost } from "./DetailDrawerHost";
import { PreviewProviders } from "./PreviewProviders";
import { Sidebar } from "./Sidebar";
import { TabBar } from "./TabBar";
import { TopBar } from "./TopBar";

/**
 * The dashboard's own frame, separate from the public website's header and footer: sidebar on desktop, a
 * bottom tab bar below lg, a sticky top bar that keeps the demo banner always in view, the page content, and
 * the detail drawer. The skip link is the first stop in the tab order.
 */
export function PreviewShell({ children }: { children: ReactNode }) {
  return (
    <PreviewProviders>
      <a href="#dashboard-main" className="skip-link">
        Skip to dashboard content
      </a>
      <div className="flex min-w-0 flex-1 bg-warm-white">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-20 shadow-header">
            <DemoBanner />
            <TopBar />
          </div>
          <main id="dashboard-main" tabIndex={-1} className="flex-1 px-gutter pt-6 pb-28 outline-none lg:pt-8 lg:pb-12">
            <div className="mx-auto w-full max-w-[88rem]">
              <DemoReadyGate>{children}</DemoReadyGate>
            </div>
          </main>
        </div>
      </div>
      <TabBar />
      <DetailDrawerHost />
    </PreviewProviders>
  );
}
