import type { ActionState } from "@/lib/admin/enquiries/action-state";

/** What an appointment action reports back: the usual outcome, plus field messages when the date or time was refused. */
export type AppointmentActionState = ActionState & { fieldErrors?: { date?: string; time?: string } };

/** The values each form sends. Plain strings and booleans only (they cross the browser boundary and are validated again on the server). */
export type ConfirmPayload = { appointmentId: string; date: string; time: string; venue?: string; note?: string };
export type ReschedulePayload = { appointmentId: string; expectedStatus: string; date: string; time: string; confirm: boolean; note?: string };
export type CancelPayload = { appointmentId: string; expectedStatus: string; reason?: string };
export type CompletePayload = { appointmentId: string; expectedStatus: string };
