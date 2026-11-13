import Link from "next/link";
import { describeRequest } from "@/lib/admin/enquiries/labels";
import { enquiriesHref } from "@/lib/admin/enquiries/query-params";
import type { EnquiryListQuery, EnquiryRecord } from "@/lib/admin/enquiries/types";
import { formatReceivedDate } from "@/lib/admin/shared/dates";
import { Avatar } from "@/components/admin/ui/Avatar";
import { EnquiryStatusBadge } from "@/components/admin/ui/StatusBadge";
import { DivisionBadge } from "./DivisionBadge";
import { EnquiryContactActions } from "./EnquiryContactActions";

/**
 * The enquiries as stacked rows, for narrow containers (phones, small tablets). The Call and WhatsApp buttons are
 * full-size touch targets on their own line, above the row's hit area, so they never open the enquiry.
 */
export function EnquiryList({ enquiries, query, selectedId }: { enquiries: readonly EnquiryRecord[]; query: EnquiryListQuery; selectedId: string | null }) {
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
            <Avatar name={enquiry.organisation ?? enquiry.fullName} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={enquiriesHref({ ...query, enquiryId: enquiry.id })}
                  prefetch={false}
                  scroll={false}
                  className="text-left font-heading text-base leading-snug font-extrabold text-navy after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-navy focus-visible:outline-none"
                >
                  {enquiry.fullName}
                  <span className="sr-only">, open enquiry {enquiry.reference}</span>
                </Link>
                <EnquiryStatusBadge status={enquiry.status} />
              </div>
              <p className="text-sm text-ink-muted">{enquiry.organisation ?? "No organisation given"}</p>
            </div>
          </div>

          <p className="mt-3 text-sm leading-snug font-medium text-charcoal">{describeRequest(enquiry)}</p>
          <p className="mt-0.5 line-clamp-2 text-sm text-ink-muted">{enquiry.message}</p>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-heading text-xs font-bold tracking-wide text-charcoal tabular-nums">{enquiry.reference}</span>
            <DivisionBadge division={enquiry.division} />
            <span className="text-sm text-ink-muted">{formatReceivedDate(enquiry.createdAt)}</span>
          </p>

          <div className="relative z-10 mt-4">
            <div className="grid grid-cols-2 gap-2 [&>div]:contents [&_a]:h-11 [&_a]:w-full [&_span[role=link]]:h-11 [&_span[role=link]]:w-full">
              <EnquiryContactActions enquiry={enquiry} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
