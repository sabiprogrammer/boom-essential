"use client";

import { useMemo, useState } from "react";
import {
  filterEnquiries,
  pageCount as countPages,
  statusCounts,
  type DivisionFilter,
  type StatusFilter,
} from "@/lib/dashboard-preview/filter-enquiries";
import type { DemoEnquiry } from "@/lib/dashboard-preview/types";

export const enquiryPageSize = 8;

/**
 * Search, status and division filters plus pagination for the Enquiries list. Everything is client state:
 * changing a filter returns to page 1, and the page number is kept inside the available range when the
 * underlying records change (for example after "Reset demo data").
 */
export function useEnquiryListState(
  enquiries: readonly DemoEnquiry[],
  initial: { status: StatusFilter; division: DivisionFilter },
) {
  const [search, setSearchValue] = useState("");
  const [status, setStatusValue] = useState<StatusFilter>(initial.status);
  const [division, setDivisionValue] = useState<DivisionFilter>(initial.division);
  const [requestedPage, setPage] = useState(1);

  const filtered = useMemo(() => filterEnquiries(enquiries, { search, status, division }), [enquiries, search, status, division]);
  const counts = useMemo(() => statusCounts(enquiries, { search, division }), [enquiries, search, division]);

  const pages = countPages(filtered.length, enquiryPageSize);
  const page = Math.min(requestedPage, pages);
  const visible = filtered.slice((page - 1) * enquiryPageSize, page * enquiryPageSize);
  const filtering = search.trim() !== "" || status !== "all" || division !== "all";

  return {
    search,
    status,
    division,
    page,
    pages,
    total: filtered.length,
    visible,
    counts,
    filtering,
    setSearch: (value: string) => {
      setSearchValue(value);
      setPage(1);
    },
    setStatus: (value: StatusFilter) => {
      setStatusValue(value);
      setPage(1);
    },
    setDivision: (value: DivisionFilter) => {
      setDivisionValue(value);
      setPage(1);
    },
    setPage,
    clearFilters: () => {
      setSearchValue("");
      setStatusValue("all");
      setDivisionValue("all");
      setPage(1);
    },
  };
}
