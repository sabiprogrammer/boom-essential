"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { useDemoReference } from "@/hooks/useDemoReference";
import { createInitialDemoState, demoReducer, type DemoState } from "@/lib/dashboard-preview/demo-reducer";
import type { DemoReference } from "@/lib/dashboard-preview/reference";
import type { AppointmentStatus, EnquiryStatus } from "@/lib/dashboard-preview/types";

type DemoData = DemoState & {
  setEnquiryStatus: (id: string, status: EnquiryStatus) => void;
  setAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  addNote: (id: string, text: string) => void;
  resetDemo: () => void;
};

const DemoDataContext = createContext<DemoData | null>(null);

/**
 * Holds the demonstration records in memory so a change made in one view (a status, a note) shows up in every
 * other view. Nothing is persisted: no network, no storage. A refresh restores the original sample data.
 *
 * The sample data is built relative to the browser's Lagos date, which is only known once the page has
 * hydrated. Until then the store is empty (the reference is null) and the page content shows a placeholder
 * (DemoReadyGate), so the server and the first client render always agree.
 */
export function DemoDataProvider({ children }: { children: ReactNode }) {
  const reference: DemoReference | null = useDemoReference();
  const [state, dispatch] = useReducer(demoReducer, null, createInitialDemoState);

  // The reference arrives after hydration. Adopting it while rendering (React re-renders straight away, before
  // anything is painted) rebuilds the sample data once without remounting the dashboard.
  if (state.reference?.today !== reference?.today) dispatch({ type: "adopt-reference", reference });

  const value = useMemo<DemoData>(
    () => ({
      ...state,
      setEnquiryStatus: (id, status) => dispatch({ type: "set-enquiry-status", id, status }),
      setAppointmentStatus: (id, status) => dispatch({ type: "set-appointment-status", id, status }),
      addNote: (id, text) => dispatch({ type: "add-note", id, text }),
      resetDemo: () => dispatch({ type: "reset" }),
    }),
    [state],
  );

  return <DemoDataContext value={value}>{children}</DemoDataContext>;
}

export function useDemoData(): DemoData {
  const value = useContext(DemoDataContext);
  if (!value) throw new Error("useDemoData must be used inside DemoDataProvider");
  return value;
}

/** True once the browser has chosen the reference date and the sample data exists. */
export function useDemoReady(): boolean {
  return useDemoData().reference !== null;
}

/** The Lagos calendar day the demonstration treats as today. Only call it where the data exists (under `DemoReadyGate`). */
export function useDemoToday(): string {
  const { reference } = useDemoData();
  if (!reference) throw new Error("useDemoToday was called before the demo date was chosen; render it under DemoReadyGate");
  return reference.today;
}
