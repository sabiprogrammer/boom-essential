"use client";

import { useState } from "react";
import { isUpcoming, selectableStatuses } from "@/lib/dashboard-preview/appointments";
import { describeRelativeDay, formatLongDate, formatTime } from "@/lib/dashboard-preview/dates";
import { appointmentStatusLabels, divisionLabels } from "@/lib/dashboard-preview/labels";
import type { DemoEnquiry } from "@/lib/dashboard-preview/types";
import { CustomerContactBlock } from "./CustomerContactBlock";
import { DateTile } from "./DateTile";
import { useDemoData, useDemoToday } from "./DemoDataProvider";
import { useDetailSelection } from "./DetailSelectionProvider";
import { DemoChangeNotice } from "./DemoChangeNotice";
import { DetailItem, DetailList, DetailSection, Quote } from "./DetailSection";
import { BuildingIcon, CalendarIcon, CheckIcon, InboxIcon } from "./icons";
import { EnquiryStatusBadge } from "./StatusBadge";
import { StatusSelector } from "./StatusSelector";

/**
 * One appointment with its linked enquiry: when it is, the status controls, the details, the customer with
 * contact actions, and the enquiry behind it. Only an administrator confirms; the controls are a demonstration.
 */
export function AppointmentDetail({ enquiry }: { enquiry: DemoEnquiry }) {
  const { setAppointmentStatus } = useDemoData();
  const today = useDemoToday();
  const { openEnquiry } = useDetailSelection();
  const [changed, setChanged] = useState(false);
  const appointment = enquiry.appointment;
  if (!appointment) return null;

  const record = { enquiry, appointment };
  const upcoming = isUpcoming(record, today);
  const options = selectableStatuses(record, today).map((value) => ({ value, label: appointmentStatusLabels[value] }));

  return (
    <>
      <DetailSection title="When" icon={<CalendarIcon />}>
        <div className="flex items-center gap-4">
          <DateTile date={appointment.preferredDate} muted={!upcoming} />
          <div className="min-w-0">
            <p className="font-heading text-lead leading-tight font-extrabold text-navy">{formatLongDate(appointment.preferredDate)}</p>
            <p className="mt-0.5 text-base text-charcoal">
              {formatTime(appointment.preferredTime)} <span className="text-ink-muted">· {describeRelativeDay(appointment.preferredDate, today)}</span>
            </p>
          </div>
        </div>
      </DetailSection>

      <DetailSection title="Manage appointment" icon={<CheckIcon />}>
        <StatusSelector
          legend="Appointment status"
          options={options}
          value={appointment.status}
          onChange={(status) => {
            setAppointmentStatus(enquiry.id, status);
            setChanged(true);
          }}
        />
        <p className="mt-3 text-sm text-ink-muted">
          {upcoming
            ? "Requests stay unconfirmed until an administrator confirms them."
            : "This appointment date has passed, so it can be completed or cancelled."}
        </p>
        <div className="mt-4">
          <DemoChangeNotice changed={changed} />
        </div>
      </DetailSection>

      <DetailSection title="Appointment details" icon={<CalendarIcon />}>
        <DetailList>
          <DetailItem label="Purpose" wide>
            {appointment.purpose}
          </DetailItem>
          <DetailItem label="Preferred date">{formatLongDate(appointment.preferredDate)}</DetailItem>
          <DetailItem label="Preferred time">{formatTime(appointment.preferredTime)}</DetailItem>
          <DetailItem label="Venue" wide>
            {appointment.venue}
          </DetailItem>
          <DetailItem label="Note from the customer" wide>
            <Quote>{appointment.customerNote}</Quote>
          </DetailItem>
        </DetailList>
      </DetailSection>

      <DetailSection title="Customer" icon={<BuildingIcon />}>
        <CustomerContactBlock enquiry={enquiry} showLocation={false} />
      </DetailSection>

      <DetailSection title="Linked enquiry" icon={<InboxIcon />}>
        <DetailList>
          <DetailItem label="Reference">{enquiry.reference}</DetailItem>
          <DetailItem label="Enquiry status">
            <EnquiryStatusBadge status={enquiry.status} />
          </DetailItem>
          <DetailItem label="Division and service" wide>
            {divisionLabels[enquiry.division]}: {enquiry.service}
          </DetailItem>
          <DetailItem label="Request summary" wide>
            {enquiry.summary}
          </DetailItem>
        </DetailList>
        <button
          type="button"
          onClick={() => openEnquiry(enquiry.id)}
          className="mt-5 inline-flex h-11 items-center rounded-md border border-navy px-5 font-heading text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-white"
        >
          Open full enquiry
        </button>
      </DetailSection>
    </>
  );
}
