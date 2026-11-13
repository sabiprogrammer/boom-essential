import type { EnquiryRecord } from "@/lib/admin/enquiries/types";
import { Avatar } from "@/components/admin/ui/Avatar";
import { DetailItem, DetailList } from "@/components/admin/ui/DetailSection";
import { EnquiryContactActions } from "./EnquiryContactActions";

/**
 * The customer's identity and contact details with the prominent Call and WhatsApp actions directly beneath them,
 * so reaching the customer is one tap from the place their number is shown.
 */
export function CustomerSection({ enquiry }: { enquiry: EnquiryRecord }) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <Avatar name={enquiry.organisation ?? enquiry.fullName} size="lg" />
        <div className="min-w-0">
          <p className="font-heading text-lead leading-tight font-extrabold text-navy">{enquiry.fullName}</p>
          <p className="text-base text-ink-muted">{enquiry.organisation ?? "No organisation given"}</p>
        </div>
      </div>

      <div className="mt-5">
        <DetailList>
          <DetailItem label="Phone">{enquiry.phone}</DetailItem>
          <DetailItem label="Email">{enquiry.email ?? "Not given"}</DetailItem>
          <DetailItem label="Location" wide>
            {enquiry.location ?? "Not given"}
          </DetailItem>
        </DetailList>
      </div>

      <div className="mt-5 border-t border-line pt-5">
        <p className="mb-3 font-heading text-xs font-bold tracking-[0.1em] text-ink-muted uppercase">Contact the customer</p>
        <EnquiryContactActions enquiry={enquiry} variant="prominent" />
        <p className="mt-3 text-sm text-ink-muted">Calling opens your phone. WhatsApp opens a chat with a follow-up message ready for you to read and send yourself.</p>
      </div>
    </div>
  );
}
