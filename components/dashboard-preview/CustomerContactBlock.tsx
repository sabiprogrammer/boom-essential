"use client";

import { contactActionsMode } from "@/lib/dashboard-preview/contact-mode";
import type { DemoEnquiry } from "@/lib/dashboard-preview/types";
import { Avatar } from "./Avatar";
import { DetailItem, DetailList } from "./DetailSection";
import { EnquiryContactActions } from "./EnquiryContactActions";

/**
 * The customer's identity and contact details with the prominent Call and WhatsApp actions directly beneath
 * them, so reaching the customer is one tap from the place their number is shown. Used by both drawers.
 */
export function CustomerContactBlock({ enquiry, showLocation = true }: { enquiry: DemoEnquiry; showLocation?: boolean }) {
  const { customer } = enquiry;

  return (
    <div>
      <div className="flex items-center gap-4">
        <Avatar name={customer.organisation} size="lg" />
        <div className="min-w-0">
          <p className="font-heading text-lead leading-tight font-extrabold text-navy">{customer.name}</p>
          <p className="text-base text-ink-muted">{customer.organisation}</p>
        </div>
      </div>

      <div className="mt-5">
        <DetailList>
          <DetailItem label="Phone">
            {customer.phone}
            {contactActionsMode === "demo" ? (
              <span className="mt-1 block text-sm text-ink-muted">Fictional placeholder, not a real number</span>
            ) : null}
          </DetailItem>
          <DetailItem label="Email">{customer.email}</DetailItem>
          {showLocation ? (
            <DetailItem label="Location" wide>
              {customer.location}
            </DetailItem>
          ) : null}
        </DetailList>
      </div>

      <div className="mt-5 border-t border-line pt-5">
        <p className="mb-3 font-heading text-xs font-bold tracking-[0.1em] text-ink-muted uppercase">Contact the customer</p>
        <EnquiryContactActions enquiry={enquiry} variant="prominent" />
        {contactActionsMode === "demo" ? (
          <p className="mt-3 text-sm text-ink-muted">
            Demo mode: these buttons only show a notice. With real customer records they will call, or open WhatsApp with a message ready for you to send.
          </p>
        ) : null}
      </div>
    </div>
  );
}
