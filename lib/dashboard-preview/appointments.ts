import type { AppointmentRecord, AppointmentStatus, DemoEnquiry } from "./types";

/** Every enquiry that carries an appointment request, paired with it. */
export function appointmentRecords(enquiries: readonly DemoEnquiry[]): AppointmentRecord[] {
  return enquiries.flatMap((enquiry) => (enquiry.appointment ? [{ enquiry, appointment: enquiry.appointment }] : []));
}

/**
 * Upcoming means scheduled for today or later (a visit later today stays in the agenda until the day ends, as
 * in any diary); anything on an earlier day is past. `today` is the Lagos calendar day from the demo reference.
 */
export function isUpcoming(record: AppointmentRecord, today: string): boolean {
  return record.appointment.preferredDate >= today;
}

function byDateTime(a: AppointmentRecord, b: AppointmentRecord): number {
  return (
    a.appointment.preferredDate.localeCompare(b.appointment.preferredDate) ||
    a.appointment.preferredTime.localeCompare(b.appointment.preferredTime)
  );
}

/** Soonest first. */
export function upcomingAppointments(records: readonly AppointmentRecord[], today: string): AppointmentRecord[] {
  return records.filter((record) => isUpcoming(record, today)).sort(byDateTime);
}

/** Most recent first. */
export function pastAppointments(records: readonly AppointmentRecord[], today: string): AppointmentRecord[] {
  return records.filter((record) => !isUpcoming(record, today)).sort((a, b) => byDateTime(b, a));
}

/** Groups already-sorted records by calendar day, keeping their order. */
export function groupByDate(records: readonly AppointmentRecord[]): { date: string; records: AppointmentRecord[] }[] {
  const groups: { date: string; records: AppointmentRecord[] }[] = [];
  for (const record of records) {
    const last = groups[groups.length - 1];
    if (last && last.date === record.appointment.preferredDate) last.records.push(record);
    else groups.push({ date: record.appointment.preferredDate, records: [record] });
  }
  return groups;
}

/**
 * The statuses an administrator may move an appointment to. A future appointment can be requested, confirmed
 * or cancelled; a past one can only be completed or cancelled. The current status is always included.
 */
export function selectableStatuses(record: AppointmentRecord, today: string): AppointmentStatus[] {
  const options: AppointmentStatus[] = isUpcoming(record, today) ? ["requested", "confirmed", "cancelled"] : ["completed", "cancelled"];
  return options.includes(record.appointment.status) ? options : [record.appointment.status, ...options];
}
