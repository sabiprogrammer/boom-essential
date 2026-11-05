"use client";

import type { DemoEnquiry } from "@/lib/dashboard-preview/types";
import { ContactActions } from "./ContactActions";

/** Call and WhatsApp for an enquiry's customer, with the follow-up message built from the enquiry itself. */
export function EnquiryContactActions({ enquiry, variant }: { enquiry: DemoEnquiry; variant?: "compact" | "prominent" }) {
  return (
    <ContactActions
      variant={variant}
      details={{
        name: enquiry.customer.name,
        phone: enquiry.customer.phone,
        reference: enquiry.reference,
        service: enquiry.service,
      }}
    />
  );
}
