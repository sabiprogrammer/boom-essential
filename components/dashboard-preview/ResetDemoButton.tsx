"use client";

import { useDemoData } from "./DemoDataProvider";
import { useDetailSelection } from "./DetailSelectionProvider";
import { ResetIcon } from "./icons";

/**
 * Restores the original sample data and closes any open panel. A quiet ghost button: it is a demo utility,
 * not a primary action. Local to this browser tab; nothing is sent.
 */
export function ResetDemoButton() {
  const { resetDemo } = useDemoData();
  const { close } = useDetailSelection();

  return (
    <button
      type="button"
      onClick={() => {
        close();
        resetDemo();
      }}
      title="Restore the original sample data"
      className="group inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-md px-2.5 font-heading text-sm font-semibold text-ink-muted transition-colors hover:bg-tint hover:text-navy sm:px-3.5"
    >
      <ResetIcon className="size-[1.125rem] transition-transform duration-300 group-hover:-rotate-90" />
      <span className="hidden sm:inline">Reset demo data</span>
      <span className="sr-only sm:hidden">Reset demo data</span>
    </button>
  );
}
