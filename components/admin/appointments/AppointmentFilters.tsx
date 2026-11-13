"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { maxSearchLength } from "@/lib/admin/enquiries/query-params";
import { appointmentsHref } from "@/lib/admin/appointments/query-params";
import type { AppointmentListQuery, AppointmentStatusFilter } from "@/lib/admin/appointments/types";
import { appointmentStatusLabels, appointmentStatusOrder } from "@/lib/admin/shared/labels";
import { FilterChips } from "@/components/admin/ui/FilterChips";
import { SearchField } from "@/components/admin/ui/SearchField";

const SEARCH_DELAY_MS = 350;

/**
 * The toolbar: search (the customer's name, phone, email or reference, or anything in their message) and status chips
 * with counts that follow the search. The address is the source of truth: every change replaces it (back to page 1,
 * drawer closed), so the server fetches the matching records. Typing waits a moment before searching, and a change in
 * progress is announced and dims the toolbar.
 */
export function AppointmentFilters({ query, counts }: { query: AppointmentListQuery; counts: Record<AppointmentStatusFilter, number> }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState(query.search);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Follow the address when it changes from OUTSIDE this box (for example "Clear search and filters") without ever
  // overwriting what is being typed: a result for an older keystroke must not undo a newer one.
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

  function go(next: Partial<Pick<AppointmentListQuery, "search" | "status">>) {
    const target = appointmentsHref({ search: query.search, status: query.status, ...next, page: 1 });
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

  const statusOptions: { value: AppointmentStatusFilter; label: string; count: number }[] = [
    { value: "all", label: "All", count: counts.all },
    ...appointmentStatusOrder.map((id) => ({ value: id, label: appointmentStatusLabels[id], count: counts[id] })),
  ];

  return (
    <div className="space-y-3 border-b border-line bg-white px-5 py-4 sm:px-6" aria-busy={pending}>
      <div className={`transition-opacity ${pending ? "opacity-60" : ""}`}>
        <SearchField id="appointment-search" label="Search appointments" placeholder="Search customer name, phone, email or reference" value={search} onChange={onSearch} />
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
