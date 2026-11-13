"use client";

import { useId, useState, useTransition, type FormEvent } from "react";
import { cancelAppointmentAction } from "@/lib/admin/appointments/appointment-actions";
import type { AppointmentActionState } from "@/lib/admin/appointments/action-state";
import { maxReasonLength } from "@/lib/admin/appointments/action-validation";
import type { AppointmentRecord } from "@/lib/admin/enquiries/types";

/**
 * Cancels an open appointment. It is a deliberate second step (the button that opens this form only reveals it), the
 * button is worded as the consequence, and the record is kept: a cancelled appointment stays in the history, final. The
 * optional reason is stored with the appointment's scheduling note, and the database logs who cancelled it and when.
 */
export function CancelForm({
  appointment,
  onResult,
  onCancel,
}: {
  appointment: AppointmentRecord;
  onResult: (result: AppointmentActionState) => void;
  onCancel: () => void;
}) {
  const id = useId();
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    startTransition(async () => {
      onResult(await cancelAppointmentAction({ appointmentId: appointment.id, expectedStatus: appointment.status, reason }));
    });
  }

  return (
    <form onSubmit={submit} aria-busy={pending} className="mt-4 space-y-4 border-t border-line pt-4">
      <p role="alert" className="border-l-4 border-danger bg-danger-tint p-3 text-sm text-charcoal">
        Cancelling is final: a cancelled appointment cannot be reopened. To change the time instead, use Reschedule.
      </p>
      <div>
        <label htmlFor={`${id}-reason`} className="mb-1.5 block font-heading text-sm font-bold text-navy">
          Reason <span className="font-normal text-ink-muted">(optional, for the team)</span>
        </label>
        <textarea
          id={`${id}-reason`}
          value={reason}
          rows={2}
          maxLength={maxReasonLength}
          disabled={pending}
          onChange={(event) => setReason(event.target.value)}
          className="w-full resize-y rounded-md border border-line-strong bg-warm-white px-4 py-3 text-base text-charcoal hover:border-navy/60 focus:border-navy focus:bg-white disabled:opacity-60"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center gap-2 rounded-md border border-danger bg-danger px-5 font-heading text-sm font-bold text-white transition-colors hover:opacity-90 disabled:pointer-events-none disabled:opacity-60"
        >
          {pending ? "Cancelling…" : "Yes, cancel this appointment"}
        </button>
        <button type="button" onClick={onCancel} disabled={pending} className="inline-flex h-11 items-center rounded-md px-3 font-heading text-sm font-semibold text-ink-muted hover:text-navy disabled:opacity-60">
          Keep the appointment
        </button>
      </div>
    </form>
  );
}
