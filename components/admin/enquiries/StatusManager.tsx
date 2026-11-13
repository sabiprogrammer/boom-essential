"use client";

import { useState, useTransition } from "react";
import { idleState, type ActionState } from "@/lib/admin/enquiries/action-state";
import { updateEnquiryStatusAction } from "@/lib/admin/enquiries/enquiry-actions";
import type { EnquiryStatus } from "@/lib/admin/enquiries/types";
import { enquiryStatusLabels, enquiryStatusOrder } from "@/lib/admin/shared/labels";

/**
 * Changes an enquiry's status. Each button calls a Server Action that re-checks the administrator, validates the
 * change and saves it; the database then writes the status history and activity entry itself. The buttons lock while
 * the change is saved, the outcome is announced (success or a plain error), and the shown status only changes once the
 * server has confirmed it. A change that someone else got to first is reported, never silently overwritten.
 */
export function StatusManager({ enquiryId, status }: { enquiryId: string; status: EnquiryStatus }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState>(idleState);

  function change(next: EnquiryStatus) {
    if (pending || next === status) return;
    setResult(idleState);
    startTransition(async () => {
      setResult(await updateEnquiryStatusAction(enquiryId, status, next));
    });
  }

  return (
    <div>
      <div role="group" aria-label="Enquiry status" aria-busy={pending} className="flex flex-wrap gap-2">
        {enquiryStatusOrder.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={value === status}
            disabled={pending}
            onClick={() => change(value)}
            className="inline-flex h-11 items-center rounded-md border border-line-strong bg-white px-4 font-heading text-sm font-bold text-navy transition-[background-color,border-color,color,box-shadow] hover:border-navy hover:bg-tint disabled:pointer-events-none disabled:opacity-60 aria-pressed:border-navy aria-pressed:bg-navy aria-pressed:text-white aria-pressed:shadow-raised"
          >
            {enquiryStatusLabels[value]}
          </button>
        ))}
      </div>

      <div className="mt-3 min-h-6" aria-live="polite">
        {pending ? (
          <p className="flex items-center gap-2 text-sm text-ink-muted">
            <span aria-hidden="true" className="size-4 rounded-full border-2 border-navy/30 border-t-navy motion-safe:animate-spin" />
            Saving…
          </p>
        ) : result.status === "success" ? (
          <p className="text-sm font-semibold text-green">{result.message}</p>
        ) : result.status === "error" ? (
          <p role="alert" className="text-sm font-semibold text-danger">
            {result.message}
          </p>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-ink-muted">Every change is recorded in the activity history below.</p>
    </div>
  );
}
