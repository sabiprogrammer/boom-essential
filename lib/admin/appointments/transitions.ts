import type { AppointmentRecord, AppointmentStatus } from "@/lib/admin/enquiries/types";
import type { DisplayStatus } from "./types";

/**
 * What an administrator may do to an appointment, following the database's rules (the database enforces them too:
 * completed and cancelled are final, a confirmed appointment needs a confirmed date and time, and only one appointment
 * per enquiry is open at a time):
 *
 *   requested -> confirm | reschedule | cancel
 *   confirmed -> complete | reschedule | cancel
 *   completed, cancelled -> nothing (final)
 */
export type AppointmentAction = "confirm" | "reschedule" | "cancel" | "complete";

export function availableActions(status: AppointmentStatus): AppointmentAction[] {
  switch (status) {
    case "requested":
      return ["confirm", "reschedule", "cancel"];
    case "confirmed":
      return ["complete", "reschedule", "cancel"];
    default:
      return [];
  }
}

export function isOpen(status: AppointmentStatus): boolean {
  return status === "requested" || status === "confirmed";
}

/** A cancelled appointment that has a replacement is shown as "Rescheduled", because that is what happened to it. */
export function displayStatus(appointment: Pick<AppointmentRecord, "status">, replacedById: string | null): DisplayStatus {
  return appointment.status === "cancelled" && replacedById ? "rescheduled" : appointment.status;
}

/** The id of the appointment that replaced `appointmentId` within a chain, or null. */
export function replacementOf(appointmentId: string, chain: readonly Pick<AppointmentRecord, "id" | "rescheduledFromId">[]): string | null {
  return chain.find((item) => item.rescheduledFromId === appointmentId)?.id ?? null;
}
