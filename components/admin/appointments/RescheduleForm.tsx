"use client";

import { useId, useState, useTransition, type FormEvent } from "react";
import { rescheduleAppointmentAction } from "@/lib/admin/appointments/appointment-actions";
import type { AppointmentActionState } from "@/lib/admin/appointments/action-state";
import { maxNoteLength } from "@/lib/admin/appointments/action-validation";
import type { AppointmentRecord } from "@/lib/admin/enquiries/types";
import { SlotFields } from "./SlotFields";

/**
 * Moves an open appointment to a new date and time. The original is NOT edited: it is cancelled and kept, and a new,
 * linked appointment is created for the new slot (both together, in one database transaction). The administrator can
 * confirm the new slot straight away, which is the default when the original was already confirmed.
 */
export function RescheduleForm({
  appointment,
  today,
  onResult,
  onCancel,
}: {
  appointment: AppointmentRecord;
  today: string;
  onResult: (result: AppointmentActionState) => void;
  onCancel: () => void;
}) {
  const id = useId();
  const [date, setDate] = useState("");
  const [time, setTime] = useState(appointment.confirmedTime ?? appointment.preferredTime);
  const [confirm, setConfirm] = useState(appointment.status === "confirmed");
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ date?: string; time?: string }>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setErrors({});
    startTransition(async () => {
      const result = await rescheduleAppointmentAction({ appointmentId: appointment.id, expectedStatus: appointment.status, date, time, confirm, note });
      if (result.status === "error" && result.fieldErrors) setErrors(result.fieldErrors);
      onResult(result);
    });
  }

  return (
    <form onSubmit={submit} aria-busy={pending} className="mt-4 space-y-4 border-t border-line pt-4">
      <p className="text-sm text-ink-muted">
        The current appointment is kept in the history as cancelled, and a new one is created for the date and time you choose below.
      </p>
      <SlotFields idPrefix={id} date={date} time={time} min={today} disabled={pending} errors={errors} onDate={setDate} onTime={setTime} />
      <div>
        <label htmlFor={`${id}-note`} className="mb-1.5 block font-heading text-sm font-bold text-navy">
          Note about the change <span className="font-normal text-ink-muted">(optional, for the team)</span>
        </label>
        <textarea
          id={`${id}-note`}
          value={note}
          rows={2}
          maxLength={maxNoteLength}
          disabled={pending}
          onChange={(event) => setNote(event.target.value)}
          className="w-full resize-y rounded-md border border-line-strong bg-warm-white px-4 py-3 text-base text-charcoal hover:border-navy/60 focus:border-navy focus:bg-white disabled:opacity-60"
        />
      </div>
      <label className="flex items-start gap-3 text-base text-charcoal">
        <input type="checkbox" checked={confirm} disabled={pending} onChange={(event) => setConfirm(event.target.checked)} className="mt-1 size-5 accent-navy" />
        <span>
          Confirm the new time now
          <span className="block text-sm text-ink-muted">Leave this unticked to keep the new time as a request until you confirm it.</span>
        </span>
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center gap-2 rounded-md border border-navy bg-navy px-5 font-heading text-sm font-bold text-white transition-colors hover:bg-navy-hover disabled:pointer-events-none disabled:opacity-60"
        >
          {pending ? "Rescheduling…" : "Reschedule appointment"}
        </button>
        <button type="button" onClick={onCancel} disabled={pending} className="inline-flex h-11 items-center rounded-md px-3 font-heading text-sm font-semibold text-ink-muted hover:text-navy disabled:opacity-60">
          Back
        </button>
      </div>
    </form>
  );
}
