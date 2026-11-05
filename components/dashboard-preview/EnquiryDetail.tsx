"use client";

import { useState } from "react";
import { formatLongDate, formatReceivedDateTime, formatTime } from "@/lib/dashboard-preview/dates";
import { divisionLabels, enquiryStatusLabels, enquiryStatusOrder } from "@/lib/dashboard-preview/labels";
import type { DemoEnquiry } from "@/lib/dashboard-preview/types";
import { CustomerContactBlock } from "./CustomerContactBlock";
import { DateTile } from "./DateTile";
import { useDemoData } from "./DemoDataProvider";
import { useDetailSelection } from "./DetailSelectionProvider";
import { DemoChangeNotice } from "./DemoChangeNotice";
import { DetailItem, DetailList, DetailSection, Quote } from "./DetailSection";
import { BuildingIcon, CalendarIcon, CheckIcon, InboxIcon, NoteIcon } from "./icons";
import { InternalNotes } from "./InternalNotes";
import { AppointmentStatusBadge } from "./StatusBadge";
import { StatusSelector } from "./StatusSelector";

const statusOptions = enquiryStatusOrder.map((value) => ({ value, label: enquiryStatusLabels[value] }));

/**
 * Everything about one enquiry as distinct sections: status (the main action), the customer with contact
 * actions, the enquiry itself, any appointment request, and internal notes.
 */
export function EnquiryDetail({ enquiry }: { enquiry: DemoEnquiry }) {
  const { setEnquiryStatus } = useDemoData();
  const { openAppointment } = useDetailSelection();
  const [changed, setChanged] = useState(false);
  const { appointment } = enquiry;

  return (
    <>
      <DetailSection title="Manage status" icon={<CheckIcon />}>
        <StatusSelector
          legend="Enquiry status"
          options={statusOptions}
          value={enquiry.status}
          onChange={(status) => {
            setEnquiryStatus(enquiry.id, status);
            setChanged(true);
          }}
        />
        <div className="mt-4">
          <DemoChangeNotice changed={changed} />
        </div>
      </DetailSection>

      <DetailSection title="Customer" icon={<BuildingIcon />}>
        <CustomerContactBlock enquiry={enquiry} />
      </DetailSection>

      <DetailSection title="Enquiry" icon={<InboxIcon />}>
        <DetailList>
          <DetailItem label="Reference">{enquiry.reference}</DetailItem>
          <DetailItem label="Division">{divisionLabels[enquiry.division]}</DetailItem>
          <DetailItem label="Service or product requested">{enquiry.service}</DetailItem>
          <DetailItem label="Submitted">{formatReceivedDateTime(enquiry.receivedAt)}</DetailItem>
          <DetailItem label="Message" wide>
            <Quote>{enquiry.message}</Quote>
          </DetailItem>
        </DetailList>
      </DetailSection>

      <DetailSection title="Appointment request" icon={<CalendarIcon />}>
        {appointment ? (
          <>
            <div className="flex items-start gap-4">
              <DateTile date={appointment.preferredDate} />
              <div className="min-w-0">
                <p className="font-heading text-base leading-snug font-extrabold text-navy">{appointment.purpose}</p>
                <p className="mt-0.5 text-base text-charcoal">
                  {formatLongDate(appointment.preferredDate)}, {formatTime(appointment.preferredTime)}
                </p>
                <p className="mt-2">
                  <AppointmentStatusBadge status={appointment.status} />
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openAppointment(enquiry.id)}
              className="mt-5 inline-flex h-11 items-center rounded-md border border-navy px-5 font-heading text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-white"
            >
              Open appointment details
            </button>
          </>
        ) : (
          <p className="text-base text-ink-muted">The customer did not ask for an appointment.</p>
        )}
      </DetailSection>

      <DetailSection title="Internal notes" icon={<NoteIcon />}>
        <InternalNotes enquiryId={enquiry.id} notes={enquiry.notes} />
      </DetailSection>
    </>
  );
}
