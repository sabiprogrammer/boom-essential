"use client";

import { useId, useState, useTransition, type FormEvent } from "react";
import { confirmAppointmentAction } from "@/lib/admin/appointments/appointment-actions";
import type { AppointmentActionState } from "@/lib/admin/appointments/action-state";
import { maxNoteLength, maxVenueLength } from "@/lib/admin/appointments/action-validation";
import type { AppointmentRecord } from "@/lib/admin/enquiries/types";
import { SlotFields, textInputClass } from "./SlotFields";

/**
 * Confirms a REQUESTED appointment for a date and time chosen by the administrator (starting from what the customer asked
 * for, or today if that has passed). The site never confirms anything by itself: only this form does, and the database
 * stamps who confirmed it and when. Nothing the administrator typed is lost if saving fails.
 */
export function ConfirmForm({
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
  const [date, setDate] = useState(appointment.preferredDate >= today ? appointment.preferredDate : today);
  const [time, setTime] = useState(appointment.preferredTime);
  const [venue, setVenue] = useState(appointment.venue ?? "");
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ date?: string; time?: string }>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setErrors({});
    startTransition(async () => {
      const result = await confirmAppointmentAction({ appointmentId: appointment.id, date, time, venue, note });
      if (result.status === "error" && result.fieldErrors) setErrors(result.fieldErrors);
      onResult(result);
    });
  }

  return (
    <form onSubmit={submit} aria-busy={pending} className="mt-4 space-y-4 border-t border-line pt-4">
      <p className="text-sm text-ink-muted">Choose the date and time you are confirming with the customer. It starts from the time they asked for.</p>
      <SlotFields idPrefix={id} date={date} time={time} min={today} disabled={pending} errors={errors} onDate={setDate} onTime={setTime} />
      <div>
        <label htmlFor={`${id}-venue`} className="mb-1.5 block font-heading text-sm font-bold text-navy">
          Venue <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <input id={`${id}-venue`} type="text" value={venue} maxLength={maxVenueLength} disabled={pending} onChange={(event) => setVenue(event.target.value)} className={textInputClass} />
      </div>
      <div>
        <label htmlFor={`${id}-note`} className="mb-1.5 block font-heading text-sm font-bold text-navy">
          Scheduling note <span className="font-normal text-ink-muted">(optional, for the team)</span>
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
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center gap-2 rounded-md border border-green bg-green px-5 font-heading text-sm font-bold text-white transition-colors hover:bg-green-hover disabled:pointer-events-none disabled:opacity-60"
        >
          {pending ? "Confirming…" : "Confirm appointment"}
        </button>
        <button type="button" onClick={onCancel} disabled={pending} className="inline-flex h-11 items-center rounded-md px-3 font-heading text-sm font-semibold text-ink-muted hover:text-navy disabled:opacity-60">
          Back
        </button>
      </div>
    </form>
  );
}
