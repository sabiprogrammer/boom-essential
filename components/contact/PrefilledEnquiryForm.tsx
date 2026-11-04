"use client";

import { useSearchParams } from "next/navigation";
import { useAppointmentIntent } from "@/hooks/useAppointmentIntent";
import { parseEnquiryPrefill } from "@/lib/enquiry/prefill";
import { EnquiryForm } from "./EnquiryForm";

/**
 * Reads the URL and renders the enquiry form in the matching initial state. Query values are validated
 * against the allowlist in lib/enquiry/prefill.ts, so unknown or malformed values simply give a blank form.
 *
 * Category and product come from the query string, and the form is keyed by them: arriving through a
 * different enquiry link while already on this page resets it to the new selection. The appointment request
 * is separate: it follows the visitor's intent (see hooks/useAppointmentIntent.ts), so a "Request a
 * Consultation" click ticks it, on arrival or later, without resetting anything the visitor has typed.
 */
export function PrefilledEnquiryForm() {
  const searchParams = useSearchParams();
  const appointment = useAppointmentIntent();

  const prefill = parseEnquiryPrefill(searchParams);
  const key = `${prefill.category}|${prefill.interests.join(",")}`;

  return (
    <EnquiryForm
      key={key}
      initial={{ ...prefill, appointmentRequested: appointment.requested }}
      appointmentRequests={appointment.requests}
      appointmentResets={appointment.resets}
    />
  );
}
