"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/** Which record's detail panel is open. The panel itself lives in the shell, so any view can open it. */
export type DetailSelection = { kind: "enquiry" | "appointment"; id: string } | null;

type DetailSelectionValue = {
  selection: DetailSelection;
  openEnquiry: (id: string) => void;
  openAppointment: (id: string) => void;
  close: () => void;
};

const DetailSelectionContext = createContext<DetailSelectionValue | null>(null);

export function DetailSelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<DetailSelection>(null);

  const openEnquiry = useCallback((id: string) => setSelection({ kind: "enquiry", id }), []);
  const openAppointment = useCallback((id: string) => setSelection({ kind: "appointment", id }), []);
  const close = useCallback(() => setSelection(null), []);

  const value = useMemo(() => ({ selection, openEnquiry, openAppointment, close }), [selection, openEnquiry, openAppointment, close]);
  return <DetailSelectionContext value={value}>{children}</DetailSelectionContext>;
}

export function useDetailSelection(): DetailSelectionValue {
  const value = useContext(DetailSelectionContext);
  if (!value) throw new Error("useDetailSelection must be used inside DetailSelectionProvider");
  return value;
}
