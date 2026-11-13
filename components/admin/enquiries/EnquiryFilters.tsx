"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminDivisionLabels, adminDivisionOrder } from "@/lib/admin/enquiries/labels";
import { enquiriesHref, maxSearchLength } from "@/lib/admin/enquiries/query-params";
import type { DivisionFilter, EnquiryListQuery, StatusFilter } from "@/lib/admin/enquiries/types";
import { enquiryStatusLabels, enquiryStatusOrder } from "@/lib/dashboard-preview/labels";
import { FilterChips } from "@/components/dashboard-preview/FilterChips";
import { SearchField } from "@/components/dashboard-preview/SearchField";
import { SelectField } from "@/components/dashboard-preview/SelectField";

const SEARCH_DELAY_MS = 350;

const divisionOptions: { value: DivisionFilter; label: string }[] = [
  { value: "all", label: "All divisions" },
  ...adminDivisionOrder.map((id) => ({ value: id, label: adminDivisionLabels[id] })),
];

/**
 * The toolbar: search and division on one line, status chips (with counts that follow the other filters) on the
 * next. The address is the source of truth: every change replaces it (back to page 1, drawer closed), which makes the
 * server fetch the matching records. Typing waits a moment before searching, and a change in progress is announced
 * and dims the toolbar, so the screen never looks frozen.
 */
export function EnquiryFilters({ query, counts }: { query: EnquiryListQuery; counts: Record<StatusFilter, number> }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState(query.search);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Follow the address when it changes from OUTSIDE this box (for example "Clear search and filters"), but never
  // overwrite what is being typed: a result for an older keystroke must not undo a newer one.
  const [seenSearch, setSeenSearch] = useState(query.search);
  const [pushedSearch, setPushedSearch] = useState(query.search);
  if (query.search !== seenSearch) {
    setSeenSearch(query.search);
    if (query.search !== pushedSearch) {
      setSearch(query.search);
      setPushedSearch(query.search);
    }
  }

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function go(next: Partial<Pick<EnquiryListQuery, "search" | "status" | "division">>) {
    const target = enquiriesHref({ search: query.search, status: query.status, division: query.division, ...next, page: 1 });
    startTransition(() => router.replace(target, { scroll: false }));
  }

  function onSearch(value: string) {
    const limited = value.slice(0, maxSearchLength);
    setSearch(limited);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setPushedSearch(limited.trim());
      go({ search: limited.trim() });
    }, limited === "" ? 0 : SEARCH_DELAY_MS);
  }

  const statusOptions: { value: StatusFilter; label: string; count: number }[] = [
    { value: "all", label: "All", count: counts.all },
    ...enquiryStatusOrder.map((id) => ({ value: id, label: enquiryStatusLabels[id], count: counts[id] })),
  ];

  return (
    <div className="space-y-3 border-b border-line bg-white px-5 py-4 sm:px-6" aria-busy={pending}>
      <div className={`grid gap-3 transition-opacity md:grid-cols-[minmax(0,1fr)_16rem] ${pending ? "opacity-60" : ""}`}>
        <SearchField id="enquiry-search" label="Search enquiries" placeholder="Search name, phone, email, reference or message" value={search} onChange={onSearch} />
        <SelectField id="enquiry-division" label="Division" value={query.division} options={divisionOptions} onChange={(division) => go({ division })} />
      </div>
      <div className={`transition-opacity ${pending ? "opacity-60" : ""}`}>
        <FilterChips label="Filter by status" options={statusOptions} value={query.status} onChange={(status) => go({ status })} />
      </div>
      <p role="status" className="sr-only">
        {pending ? "Updating the list" : ""}
      </p>
    </div>
  );
}
