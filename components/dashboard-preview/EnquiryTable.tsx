import { formatReceivedDate } from "@/lib/dashboard-preview/dates";
import type { DemoEnquiry } from "@/lib/dashboard-preview/types";
import { Avatar } from "./Avatar";
import { DivisionTag } from "./DivisionTag";
import { EnquiryContactActions } from "./EnquiryContactActions";
import { EnquiryStatusBadge } from "./StatusBadge";

const head = "px-4 py-3 text-left font-heading text-xs font-bold tracking-[0.1em] text-ink-muted uppercase first:pl-6 last:pr-6";
const cell = "px-4 py-4 align-middle first:pl-6 last:pr-6";

/**
 * The enquiries as a table, for wide containers. Each row has one real button (the customer name) whose hit
 * area is stretched over the row, so the whole row opens the drawer without a click handler on a table row.
 * The Actions cell sits above that hit area (relative z-10), so Call and WhatsApp never open the drawer.
 */
export function EnquiryTable({
  enquiries,
  selectedId,
  onOpen,
}: {
  enquiries: readonly DemoEnquiry[];
  selectedId: string | null;
  onOpen: (id: string) => void;
}) {
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
                  <Avatar name={enquiry.customer.organisation} />
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => onOpen(enquiry.id)}
                      className="text-left font-heading text-base leading-snug font-extrabold whitespace-nowrap text-navy after:absolute after:inset-0 after:content-[''] group-hover:underline focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-navy focus-visible:outline-none"
                    >
                      {enquiry.customer.name}
                      <span className="sr-only">, open enquiry {enquiry.reference}</span>
                    </button>
                    <p className="text-sm leading-snug text-ink-muted">{enquiry.customer.organisation}</p>
                  </div>
                </div>
              </td>
              <td className={`${cell} w-[34%] min-w-52`}>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-heading text-xs font-bold tracking-wide text-charcoal tabular-nums">{enquiry.reference}</span>
                  <DivisionTag division={enquiry.division} />
                </p>
                <p className="mt-1.5 text-sm leading-snug font-medium text-charcoal">{enquiry.summary}</p>
              </td>
              <td className={cell}>
                <EnquiryStatusBadge status={enquiry.status} />
                <p className="mt-1.5 text-sm whitespace-nowrap text-ink-muted">
                  <span className="sr-only">Received </span>
                  {formatReceivedDate(enquiry.receivedAt)}
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
