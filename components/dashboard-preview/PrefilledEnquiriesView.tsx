"use client";

import { useSearchParams } from "next/navigation";
import { isDivisionId, isEnquiryStatus } from "@/lib/dashboard-preview/labels";
import { EnquiriesView } from "./EnquiriesView";

/**
 * Reads an optional ?status= or ?division= from the URL (the Overview statistics link here) and starts the
 * list filtered accordingly. Values are checked against the known lists, so anything else shows everything.
 * Keyed by the filters, so following a different statistic link while on this screen applies the new filter.
 */
export function PrefilledEnquiriesView() {
  const params = useSearchParams();
  const status = params.get("status");
  const division = params.get("division");
  const initial = {
    status: isEnquiryStatus(status) ? status : ("all" as const),
    division: isDivisionId(division) ? division : ("all" as const),
  };

  return <EnquiriesView key={`${initial.status}|${initial.division}`} initial={initial} />;
}
