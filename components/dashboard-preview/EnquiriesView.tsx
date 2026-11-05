"use client";

import { useEnquiryListState, enquiryPageSize } from "@/hooks/useEnquiryListState";
import type { DivisionFilter, StatusFilter } from "@/lib/dashboard-preview/filter-enquiries";
import { useDemoData } from "./DemoDataProvider";
import { EmptyState } from "./EmptyState";
import { EnquiryFilters } from "./EnquiryFilters";
import { EnquiryResults } from "./EnquiryResults";
import { Pagination } from "./Pagination";
import { Panel } from "./Panel";

/** The Enquiries screen: filters, results (table or list), empty state and pagination. */
export function EnquiriesView({ initial }: { initial: { status: StatusFilter; division: DivisionFilter } }) {
  const { enquiries } = useDemoData();
  const list = useEnquiryListState(enquiries, initial);

  return (
    <Panel headingId="enquiries-heading" title="All enquiries" description="Newest first. Select a row to open the full enquiry." flush>
      <EnquiryFilters
        search={list.search}
        status={list.status}
        division={list.division}
        counts={list.counts}
        onSearch={list.setSearch}
        onStatus={list.setStatus}
        onDivision={list.setDivision}
      />

      {list.total === 0 ? (
        <EmptyState
          title="No enquiries match"
          action={
            list.filtering ? (
              <button
                type="button"
                onClick={list.clearFilters}
                className="inline-flex h-11 items-center rounded-sm border border-navy px-5 font-heading text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
              >
                Clear search and filters
              </button>
            ) : undefined
          }
        >
          Try a different name, reference or word, or change the status and division filters.
        </EmptyState>
      ) : (
        <>
          <EnquiryResults enquiries={list.visible} />
          <Pagination
            page={list.page}
            pageCount={list.pages}
            pageSize={enquiryPageSize}
            total={list.total}
            noun={list.total === 1 ? "enquiry" : "enquiries"}
            onPageChange={list.setPage}
          />
        </>
      )}
    </Panel>
  );
}
