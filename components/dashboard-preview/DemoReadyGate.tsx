"use client";

import type { ReactNode } from "react";
import { useDemoReady } from "./DemoDataProvider";

/**
 * Shows the page content only once the sample data exists. The data is dated relative to the browser's Lagos
 * date, so it cannot be built on the server; until the page has hydrated this quiet placeholder stands in. It
 * is what the server renders, which keeps the first client render identical to it (no hydration mismatch).
 */
export function DemoReadyGate({ children }: { children: ReactNode }) {
  const ready = useDemoReady();
  if (ready) return children;

  return (
    <div role="status" aria-busy="true" className="min-h-[32rem] space-y-4" data-testid="demo-pending">
      <span className="sr-only">Preparing the sample data</span>
      <div aria-hidden="true" className="h-28 rounded-md border border-line bg-white shadow-panel" />
      <div aria-hidden="true" className="h-80 rounded-md border border-line bg-white shadow-panel" />
    </div>
  );
}
