import Link from "next/link";
import { describeRequest } from "@/lib/admin/enquiries/labels";
import { enquiriesHref } from "@/lib/admin/enquiries/query-params";
import type { EnquiryListQuery, EnquiryRecord } from "@/lib/admin/enquiries/types";
import { formatReceivedDate } from "@/lib/admin/shared/dates";
import { Avatar } from "@/components/admin/ui/Avatar";
import { EnquiryStatusBadge } from "@/components/admin/ui/StatusBadge";
import { DivisionBadge } from "./DivisionBadge";
import { EnquiryContactActions } from "./EnquiryContactActions";

const head = "px-4 py-3 text-left font-heading text-xs font-bold tracking-[0.1em] text-ink-muted uppercase first:pl-6 last:pr-6";
const cell = "px-4 py-4 align-middle first:pl-6 last:pr-6";

/**
 * The enquiries as a table, for wide containers. Each row has one real link (the customer name) whose hit area is
 * stretched over the row, so the whole row opens the enquiry drawer (the address gains ?enquiry=<id>, so it can be
 * refreshed and shared). The Actions cell sits above that hit area (relative z-10), so Call and WhatsApp never open it.
 */
export function EnquiryTable({ enquiries, query, selectedId }: { enquiries: readonly EnquiryRecord[]; query: EnquiryListQuery; selectedId: string | null }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <caption className="sr-only">Customer enquiries, newest first</caption>
        <thead>
          <tr className="border-b border-line bg-warm-white/80">
            <th scope="col" className={head}>Customer</th>
            <th scope="col" className={head}>Enquiry</th>
            <th scope="col" className={head}>Status / received</th>
            <th scope="col" className={head}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map((enquiry) => (
            <tr
              key={enquiry.id}
              className={`group relative border-b border-line transition-[background-color,box-shadow] duration-150 last:border-b-0 hover:bg-warm-white hover:shadow-[inset_3px_0_0_var(--color-gold)] ${
                selectedId === enquiry.id ? "bg-tint shadow-[inset_3px_0_0_var(--color-navy)]" : ""
              }`}
            >
              <td className={cell}>
                <div className="flex items-center gap-3.5">
                  <Avatar name={enquiry.organisation ?? enquiry.fullName} />
                  <div className="min-w-0">
                    <Link
                      href={enquiriesHref({ ...query, enquiryId: enquiry.id })}
                      prefetch={false}
                      scroll={false}
                      className="text-left font-heading text-base leading-snug font-extrabold whitespace-nowrap text-navy after:absolute after:inset-0 after:content-[''] group-hover:underline focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-navy focus-visible:outline-none"
                    >
                      {enquiry.fullName}
                      <span className="sr-only">, open enquiry {enquiry.reference}</span>
                    </Link>
                    <p className="text-sm leading-snug text-ink-muted">{enquiry.organisation ?? "No organisation given"}</p>
                  </div>
                </div>
              </td>
              <td className={`${cell} w-[34%] min-w-52`}>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-heading text-xs font-bold tracking-wide text-charcoal tabular-nums">{enquiry.reference}</span>
                  <DivisionBadge division={enquiry.division} />
                </p>
                <p className="mt-1.5 text-sm leading-snug font-medium text-charcoal">{describeRequest(enquiry)}</p>
                <p className="mt-0.5 line-clamp-1 text-sm text-ink-muted">{enquiry.message}</p>
              </td>
              <td className={cell}>
                <EnquiryStatusBadge status={enquiry.status} />
                <p className="mt-1.5 text-sm whitespace-nowrap text-ink-muted">
                  <span className="sr-only">Received </span>
                  {formatReceivedDate(enquiry.createdAt)}
                </p>
              </td>
              <td className={cell}>
                <div className="relative z-10 w-fit">
                  <EnquiryContactActions enquiry={enquiry} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
