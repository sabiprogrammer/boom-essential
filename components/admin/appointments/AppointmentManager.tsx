"use client";

import { useState, useTransition } from "react";
import { completeAppointmentAction } from "@/lib/admin/appointments/appointment-actions";
import type { AppointmentActionState } from "@/lib/admin/appointments/action-state";
import { availableActions, type AppointmentAction } from "@/lib/admin/appointments/transitions";
import type { AppointmentRecord } from "@/lib/admin/enquiries/types";
import { CancelForm } from "./CancelForm";
import { ConfirmForm } from "./ConfirmForm";
import { RescheduleForm } from "./RescheduleForm";

const buttonBase =
  "inline-flex h-11 items-center rounded-md border px-4 font-heading text-sm font-bold transition-[background-color,border-color,color,box-shadow] disabled:pointer-events-none disabled:opacity-60";
const styles: Record<AppointmentAction, string> = {
  confirm: `${buttonBase} border-green bg-green text-white hover:bg-green-hover`,
  complete: `${buttonBase} border-green bg-green text-white hover:bg-green-hover`,
  reschedule: `${buttonBase} border-navy bg-white text-navy hover:bg-navy hover:text-white aria-pressed:bg-navy aria-pressed:text-white`,
  cancel: `${buttonBase} border-line-strong bg-white text-danger hover:border-danger hover:bg-danger-tint aria-pressed:border-danger aria-pressed:bg-danger-tint`,
};
const labels: Record<AppointmentAction, string> = {
  confirm: "Confirm…",
  complete: "Mark as completed",
  reschedule: "Reschedule…",
  cancel: "Cancel…",
};

/**
 * The actions the rules allow for this appointment's current status (and none for a final one). Choosing an action with
 * a form opens it below; "Mark as completed" is one step. Every action saves through a Server Action that re-checks the
 * administrator, validates again and applies the change only if the appointment still has the status shown here. The
 * outcome, success or a plain error, is announced under the buttons. What is shown only changes once the server confirms.
 */
export function AppointmentManager({ appointment, today }: { appointment: AppointmentRecord; today: string }) {
  const actions = availableActions(appointment.status);
  const [panel, setPanel] = useState<Exclude<AppointmentAction, "complete"> | null>(null);
  const [result, setResult] = useState<AppointmentActionState>({ status: "idle" });
  const [completing, startCompleting] = useTransition();

  function handle(next: AppointmentActionState) {
    setResult(next);
    if (next.status === "success") setPanel(null);
  }

  function complete() {
    if (completing) return;
    setResult({ status: "idle" });
    startCompleting(async () => {
      handle(await completeAppointmentAction({ appointmentId: appointment.id, expectedStatus: appointment.status }));
    });
  }

  if (actions.length === 0) {
    return (
      <div>
        <p className="text-base text-charcoal">
          This appointment is {appointment.status === "completed" ? "completed" : "cancelled"}, so it is final and cannot be changed.
        </p>
        <Outcome result={result} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Appointment actions">
        {actions.map((action) =>
          action === "complete" ? (
            <button key={action} type="button" onClick={complete} disabled={completing} className={styles[action]}>
              {completing ? "Saving…" : labels[action]}
            </button>
          ) : (
            <button
              key={action}
              type="button"
              aria-pressed={panel === action}
              disabled={completing}
              onClick={() => {
                setResult({ status: "idle" });
                setPanel(panel === action ? null : action);
              }}
              className={styles[action]}
            >
              {labels[action]}
            </button>
          ),
        )}
      </div>

      <Outcome result={result} />

      {panel === "confirm" ? <ConfirmForm key="confirm" appointment={appointment} today={today} onResult={handle} onCancel={() => setPanel(null)} /> : null}
      {panel === "reschedule" ? <RescheduleForm key="reschedule" appointment={appointment} today={today} onResult={handle} onCancel={() => setPanel(null)} /> : null}
      {panel === "cancel" ? <CancelForm key="cancel" appointment={appointment} onResult={handle} onCancel={() => setPanel(null)} /> : null}

      <p className="mt-4 text-sm text-ink-muted">Every change is recorded in the history below, with who made it and when.</p>
    </div>
  );
}

function Outcome({ result }: { result: AppointmentActionState }) {
  return (
    <div className="mt-3 min-h-6" aria-live="polite">
      {result.status === "success" ? <p className="text-sm font-semibold text-green">{result.message}</p> : null}
      {result.status === "error" ? (
        <p role="alert" className="text-sm font-semibold text-danger">
          {result.message}
        </p>
      ) : null}
    </div>
  );
}
