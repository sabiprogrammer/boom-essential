import Link from "next/link";
import { enquiriesHref } from "@/lib/admin/enquiries/query-params";
import type { DetailResult, QueryResult } from "@/lib/admin/enquiries/queries";
import type { EnquiryListQuery, EnquiryListResult } from "@/lib/admin/enquiries/types";
import { EmptyState } from "@/components/dashboard-preview/EmptyState";
import { Panel } from "@/components/dashboard-preview/Panel";
import { DrawerFor } from "./DrawerFor";
import { EnquiryFilters } from "./EnquiryFilters";
import { EnquiryResults } from "./EnquiryResults";
import { ListLoadError } from "./ListLoadError";
import { ListPagination } from "./ListPagination";

const outlineButton =
  "inline-flex h-11 items-center rounded-sm border border-navy px-5 font-heading text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white";

/**
 * The Enquiries screen with real data: filters, results (table or list), the empty, "no match" and error states,
 * pagination, and the drawer for the enquiry named in the address. All of it is rendered on the server from the
 * address, so nothing about it is cached or shared between administrators.
 */
export function EnquiriesWorkspace({
  query,
  list,
  detail,
  enquiryId,
}: {
  query: EnquiryListQuery;
  list: QueryResult<EnquiryListResult>;
  detail: DetailResult | null;
  enquiryId: string | null;
}) {
  const filtering = query.search !== "" || query.status !== "all" || query.division !== "all";

  return (
    <>
      <Panel headingId="enquiries-heading" title="All enquiries" description="Newest first. Select a row to open the full enquiry." flush>
        {!list.ok ? (
          <ListLoadError />
        ) : (
          <>
            <EnquiryFilters query={query} counts={list.data.counts} />

            {list.data.total === 0 ? (
              filtering ? (
                <EmptyState
                  title="No enquiries match"
                  action={
                    <Link href="/admin" className={outlineButton}>
                      Clear search and filters
                    </Link>
                  }
                >
                  Try a different name, reference or word, or change the status and division filters.
                </EmptyState>
              ) : (
                <EmptyState title="No enquiries yet">
                  Enquiries sent through the Contact page will appear here as soon as they arrive, newest first.
                </EmptyState>
              )
            ) : (
              <>
                <EnquiryResults enquiries={list.data.rows} query={{ ...query, page: list.data.page }} selectedId={enquiryId} />
                <ListPagination
                  hrefForPage={(n) => enquiriesHref({ ...query, page: n, enquiryId: null })}
                  noun={{ one: "enquiry", many: "enquiries" }}
                  page={list.data.page}
                  pageCount={list.data.pageCount}
                  pageSize={list.data.pageSize}
                  total={list.data.total}
                />
              </>
            )}
          </>
        )}
      </Panel>

      {detail ? <DrawerFor detail={detail} query={{ ...query, page: list.ok ? list.data.page : query.page }} /> : null}
    </>
  );
}
