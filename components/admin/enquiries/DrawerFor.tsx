import { adminDivisionLabels } from "@/lib/admin/enquiries/labels";
import { enquiriesHref } from "@/lib/admin/enquiries/query-params";
import type { DetailResult } from "@/lib/admin/enquiries/queries";
import type { EnquiryListQuery } from "@/lib/admin/enquiries/types";
import { formatReceivedDateTime } from "@/lib/admin/shared/dates";
import { EnquiryStatusBadge } from "@/components/admin/ui/StatusBadge";
import { DivisionBadge } from "./DivisionBadge";
import { EnquiryDetailContent } from "./EnquiryDetailContent";
import { EnquiryDrawer } from "./EnquiryDrawer";

/**
 * The drawer for the enquiry named in the address, in whichever state its lookup ended: found, not found (it does
 * not exist or is not visible to this administrator), or a failed read. The list behind it stays usable either way.
 */
export function DrawerFor({ detail, query }: { detail: DetailResult; query: EnquiryListQuery }) {
  const closeHref = enquiriesHref({ ...query, enquiryId: null });

  if (!detail.ok) {
    return (
      <EnquiryDrawer closeHref={closeHref} eyebrow="Enquiry" title="We could not load this enquiry">
        <div role="alert" className="border-l-4 border-danger bg-danger-tint p-5 text-base text-charcoal">
          Something went wrong while reading this enquiry, so nothing is shown. Close this panel and try again in a moment.
        </div>
      </EnquiryDrawer>
    );
  }

  if (!detail.data) {
    return (
      <EnquiryDrawer closeHref={closeHref} eyebrow="Enquiry" title="Enquiry not found">
        <div role="status" className="border-l-4 border-gold bg-white p-5 text-base text-charcoal">
          This enquiry does not exist, or you do not have access to it.
        </div>
      </EnquiryDrawer>
    );
  }

  const { enquiry } = detail.data;
  return (
    <EnquiryDrawer
      key={enquiry.id}
      closeHref={closeHref}
      eyebrow={enquiry.reference}
      title={enquiry.fullName}
      subtitle={enquiry.organisation ?? adminDivisionLabels[enquiry.division]}
      meta={
        <>
          <EnquiryStatusBadge status={enquiry.status} />
          <DivisionBadge division={enquiry.division} />
          <span className="text-sm text-ink-muted">Received {formatReceivedDateTime(enquiry.createdAt)}</span>
        </>
      }
    >
      <EnquiryDetailContent data={detail.data} />
    </EnquiryDrawer>
  );
}
