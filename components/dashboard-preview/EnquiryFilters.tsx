"use client";

import type { DivisionFilter, StatusFilter } from "@/lib/dashboard-preview/filter-enquiries";
import { divisionLabels, divisionOrder, enquiryStatusLabels, enquiryStatusOrder } from "@/lib/dashboard-preview/labels";
import { FilterChips } from "./FilterChips";
import { SearchField } from "./SearchField";
import { SelectField } from "./SelectField";

const divisionOptions: { value: DivisionFilter; label: string }[] = [
  { value: "all", label: "All divisions" },
  ...divisionOrder.map((id) => ({ value: id, label: divisionLabels[id] })),
];

/**
 * The Enquiries toolbar in one compact band: search and division on the first line, status chips (with live
 * counts that follow the other filters) on the second.
 */
export function EnquiryFilters({
  search,
  status,
  division,
  counts,
  onSearch,
  onStatus,
  onDivision,
}: {
  search: string;
  status: StatusFilter;
  division: DivisionFilter;
  counts: Record<StatusFilter, number>;
  onSearch: (value: string) => void;
  onStatus: (value: StatusFilter) => void;
  onDivision: (value: DivisionFilter) => void;
}) {
  const statusOptions: { value: StatusFilter; label: string; count: number }[] = [
    { value: "all", label: "All", count: counts.all },
    ...enquiryStatusOrder.map((id) => ({ value: id, label: enquiryStatusLabels[id], count: counts[id] })),
  ];

  return (
    <div className="space-y-3 border-b border-line bg-white px-5 py-4 sm:px-6">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_16rem]">
        <SearchField
          id="enquiry-search"
          label="Search enquiries"
          placeholder="Search enquiries"
          value={search}
          onChange={onSearch}
        />
        <SelectField id="enquiry-division" label="Division" value={division} options={divisionOptions} onChange={onDivision} />
      </div>
      <FilterChips label="Filter by status" options={statusOptions} value={status} onChange={onStatus} />
    </div>
  );
}
