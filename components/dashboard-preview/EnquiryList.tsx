import { formatReceivedDate } from "@/lib/dashboard-preview/dates";
import type { DemoEnquiry } from "@/lib/dashboard-preview/types";
import { Avatar } from "./Avatar";
import { DivisionTag } from "./DivisionTag";
import { EnquiryContactActions } from "./EnquiryContactActions";
import { EnquiryStatusBadge } from "./StatusBadge";

/**
 * The enquiries as stacked rows, for narrow containers (phones, small tablets). The Call and WhatsApp
 * buttons are full-size touch targets on their own line, above the row's hit area, so they never open the drawer.
 */
export function EnquiryList({
  enquiries,
  selectedId,
  onOpen,
}: {
  enquiries: readonly DemoEnquiry[];
  selectedId: string | null;
  onOpen: (id: string) => void;
}) {
  return (
    <ul>
      {enquiries.map((enquiry) => (
        <li
          key={enquiry.id}
          className={`relative border-b border-line px-5 py-4 transition-colors last:border-b-0 hover:bg-warm-white sm:px-6 ${
            selectedId === enquiry.id ? "bg-tint shadow-[inset_3px_0_0_var(--color-navy)]" : ""
          }`}
        >
          <div className="flex items-start gap-3.5">
            <Avatar name={enquiry.customer.organisation} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onOpen(enquiry.id)}
                  className="text-left font-heading text-base leading-snug font-extrabold text-navy after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-navy focus-visible:outline-none"
                >
                  {enquiry.customer.name}
                  <span className="sr-only">, open enquiry {enquiry.reference}</span>
                </button>
                <EnquiryStatusBadge status={enquiry.status} />
              </div>
              <p className="text-sm text-ink-muted">{enquiry.customer.organisation}</p>
            </div>
          </div>

          <p className="mt-3 text-sm leading-snug font-medium text-charcoal">{enquiry.summary}</p>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-heading text-xs font-bold tracking-wide text-charcoal tabular-nums">{enquiry.reference}</span>
            <DivisionTag division={enquiry.division} />
            <span className="text-sm text-ink-muted">{formatReceivedDate(enquiry.receivedAt)}</span>
          </p>

          <div className="relative z-10 mt-4">
            <div className="grid grid-cols-2 gap-2 [&>div]:contents [&_button]:h-11 [&_button]:w-full">
              <EnquiryContactActions enquiry={enquiry} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
