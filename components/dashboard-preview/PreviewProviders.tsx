"use client";

import type { ReactNode } from "react";
import { DemoDataProvider } from "./DemoDataProvider";
import { DetailSelectionProvider } from "./DetailSelectionProvider";
import { NoticeProvider } from "./NoticeProvider";

/** The client state the dashboard preview shares across its views. All of it is in memory only. */
export function PreviewProviders({ children }: { children: ReactNode }) {
  return (
    <DemoDataProvider>
      <DetailSelectionProvider>
        <NoticeProvider>{children}</NoticeProvider>
      </DetailSelectionProvider>
    </DemoDataProvider>
  );
}
