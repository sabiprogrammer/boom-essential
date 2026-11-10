"use client";

import { describeRelativeDay, formatReceivedDateTime } from "@/lib/dashboard-preview/dates";
import { AppointmentDetail } from "./AppointmentDetail";
import { useDemoData } from "./DemoDataProvider";
import { useDetailSelection } from "./DetailSelectionProvider";
import { DetailDrawer } from "./DetailDrawer";
import { DivisionTag } from "./DivisionTag";
import { EnquiryDetail } from "./EnquiryDetail";
import { AppointmentStatusBadge, EnquiryStatusBadge } from "./StatusBadge";

/**
 * Renders the open record in the drawer. Lives in the shell so any view can open it. The record is looked up
 * by id on every render, so status changes made inside the drawer show immediately.
 */
export function DetailDrawerHost() {
  const { selection, close } = useDetailSelection();
  const { enquiries, reference } = useDemoData();

  if (!selection || !reference) return null;
  const enquiry = enquiries.find((item) => item.id === selection.id);
  if (!enquiry) return null;

  // Keyed by kind and id, so switching between an enquiry and its appointment starts a fresh panel.
  if (selection.kind === "enquiry") {
    return (
      <DetailDrawer
        key={`enquiry-${enquiry.id}`}
        eyebrow={enquiry.reference}
        title={enquiry.customer.name}
        subtitle={enquiry.customer.organisation}
        onClose={close}
        meta={
          <>
            <EnquiryStatusBadge status={enquiry.status} />
            <DivisionTag division={enquiry.division} />
            <span className="text-sm text-ink-muted">Received {formatReceivedDateTime(enquiry.receivedAt)}</span>
          </>
        }
      >
        <EnquiryDetail enquiry={enquiry} />
      </DetailDrawer>
    );
  }

  return (
    <DetailDrawer
      key={`appointment-${enquiry.id}`}
      eyebrow={
        <>
          Appointment · <span className="whitespace-nowrap">{enquiry.reference}</span>
        </>
      }
      title={enquiry.customer.name}
      subtitle={enquiry.customer.organisation}
      onClose={close}
      meta={
        enquiry.appointment ? (
          <>
            <AppointmentStatusBadge status={enquiry.appointment.status} />
            <DivisionTag division={enquiry.division} />
            <span className="text-sm text-ink-muted">{describeRelativeDay(enquiry.appointment.preferredDate, reference.today)}</span>
          </>
        ) : null
      }
    >
      <AppointmentDetail enquiry={enquiry} />
    </DetailDrawer>
  );
}
