"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { demoReducer, initialDemoState, type DemoState } from "@/lib/dashboard-preview/demo-reducer";
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
 */
export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, initialDemoState);

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
