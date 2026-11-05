"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { appointmentRecords, upcomingAppointments } from "@/lib/dashboard-preview/appointments";
import { AppointmentItem } from "./AppointmentItem";
import { useDemoData } from "./DemoDataProvider";
import { useDetailSelection } from "./DetailSelectionProvider";
import { EmptyState } from "./EmptyState";
import { Panel } from "./Panel";

const shown = 5;

/** The next appointments that are still live (requested or confirmed), soonest first, each led by a calendar tile. */
export function UpcomingAppointmentsPanel() {
  const { enquiries } = useDemoData();
  const { selection, openAppointment } = useDetailSelection();
  const selectedId = selection?.kind === "appointment" ? selection.id : null;
  const records = upcomingAppointments(appointmentRecords(enquiries)).filter((r) => r.appointment.status !== "cancelled");

  return (
    <Panel
      headingId="upcoming-appointments-heading"
      title="Upcoming appointments"
      description="Requests are never confirmed automatically. Only an administrator confirms."
      flush
      action={
        <Link
          href="/dashboard-preview/appointments"
          className="group inline-flex min-h-10 items-center gap-2 font-heading text-sm font-bold text-navy hover:underline"
        >
          All appointments
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      }
    >
      {records.length === 0 ? (
        <EmptyState title="No upcoming appointments">Appointment requests that need attention will appear here.</EmptyState>
      ) : (
        <ul>
          {records.slice(0, shown).map((record) => (
            <AppointmentItem key={record.enquiry.id} record={record} showDate selected={selectedId === record.enquiry.id} onOpen={openAppointment} />
          ))}
        </ul>
      )}
    </Panel>
  );
}
