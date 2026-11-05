import { divisionLabels, enquiryStatusLabels } from "./labels";
import type { DemoEnquiry, DivisionId, EnquiryStatus } from "./types";

export type StatusFilter = EnquiryStatus | "all";
export type DivisionFilter = DivisionId | "all";

export type EnquiryFilters = {
  search: string;
  status: StatusFilter;
  division: DivisionFilter;
};

/** Everything a search can match, lower-cased once per enquiry. */
function searchText(enquiry: DemoEnquiry): string {
  return [
    enquiry.customer.name,
    enquiry.customer.organisation,
    enquiry.customer.email,
    enquiry.customer.location,
    enquiry.reference,
    enquiry.service,
    enquiry.summary,
    enquiry.message,
    divisionLabels[enquiry.division],
    enquiryStatusLabels[enquiry.status],
  ]
    .join(" ")
    .toLowerCase();
}

function matchesSearch(enquiry: DemoEnquiry, search: string): boolean {
  const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const text = searchText(enquiry);
  return terms.every((term) => text.includes(term));
}

export function filterEnquiries(enquiries: readonly DemoEnquiry[], filters: EnquiryFilters): DemoEnquiry[] {
  return enquiries.filter(
    (enquiry) =>
      (filters.status === "all" || enquiry.status === filters.status) &&
      (filters.division === "all" || enquiry.division === filters.division) &&
      matchesSearch(enquiry, filters.search),
  );
}

/** Counts per status for the current search and division, so each filter chip shows what it would return. */
export function statusCounts(
  enquiries: readonly DemoEnquiry[],
  filters: Pick<EnquiryFilters, "search" | "division">,
): Record<StatusFilter, number> {
  const base = filterEnquiries(enquiries, { ...filters, status: "all" });
  return {
    all: base.length,
    new: base.filter((e) => e.status === "new").length,
    in_progress: base.filter((e) => e.status === "in_progress").length,
    contacted: base.filter((e) => e.status === "contacted").length,
    resolved: base.filter((e) => e.status === "resolved").length,
  };
}

export function pageCount(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}
