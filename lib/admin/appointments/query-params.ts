import { appointmentStatusOrder } from "@/lib/dashboard-preview/labels";
import { isUuid, maxSearchLength, type RawSearchParams } from "@/lib/admin/enquiries/query-params";
import { cleanSingleLine } from "@/lib/enquiry/server/text";
import type { AppointmentListQuery, AppointmentStatusFilter } from "./types";

/** Everything the Appointments screen keeps in its address, so a view can be bookmarked, shared and refreshed. */
export const appointmentPageSize = 10;
const maxPage = 100_000;

export type AppointmentsUrlState = AppointmentListQuery & {
  /** The appointment open in the drawer, or null. */
  appointmentId: string | null;
};

const first = (value: string | string[] | undefined): string => (Array.isArray(value) ? (value[0] ?? "") : (value ?? ""));

function isAppointmentStatus(value: string): value is Exclude<AppointmentStatusFilter, "all"> {
  return (appointmentStatusOrder as readonly string[]).includes(value);
}

/** URL values are untrusted: anything unknown falls back to the default, nothing throws. */
export function parseAppointmentsUrl(raw: RawSearchParams): AppointmentsUrlState {
  const status = first(raw.status);
  const page = Number.parseInt(first(raw.page), 10);
  const appointment = first(raw.appointment).trim();
  return {
    search: cleanSingleLine(first(raw.q)).slice(0, maxSearchLength),
    status: isAppointmentStatus(status) ? status : "all",
    page: Number.isInteger(page) && page >= 1 ? Math.min(page, maxPage) : 1,
    appointmentId: isUuid(appointment) ? appointment.toLowerCase() : null,
  };
}

/** The /admin/appointments address for a view. Default values are left out. */
export function appointmentsHref(state: { search?: string; status?: AppointmentStatusFilter; page?: number; appointmentId?: string | null }): string {
  const params = new URLSearchParams();
  if (state.search) params.set("q", state.search);
  if (state.status && state.status !== "all") params.set("status", state.status);
  if (state.page && state.page > 1) params.set("page", String(state.page));
  if (state.appointmentId) params.set("appointment", state.appointmentId);
  const query = params.toString();
  return query ? `/admin/appointments?${query}` : "/admin/appointments";
}
