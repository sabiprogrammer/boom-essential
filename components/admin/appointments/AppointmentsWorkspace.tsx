import Link from "next/link";
import type { AppointmentDetailResult } from "@/lib/admin/appointments/queries";
import { appointmentsHref } from "@/lib/admin/appointments/query-params";
import type { AppointmentListQuery, AppointmentListResult } from "@/lib/admin/appointments/types";
import type { QueryResult } from "@/lib/admin/enquiries/queries";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Panel } from "@/components/admin/ui/Panel";
import { ListLoadError } from "@/components/admin/enquiries/ListLoadError";
import { ListPagination } from "@/components/admin/enquiries/ListPagination";
import { AppointmentDrawerFor } from "./AppointmentDrawerFor";
import { AppointmentFilters } from "./AppointmentFilters";
import { AppointmentResults } from "./AppointmentResults";

const outlineButton =
  "inline-flex h-11 items-center rounded-sm border border-navy px-5 font-heading text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white";

/**
 * The Appointments screen with real data: filters, results (table or list), the empty, "no match" and error states,
 * pagination, and the drawer for the appointment named in the address. Rendered on the server from the address, so
 * nothing about it is cached or shared between administrators.
 */
export function AppointmentsWorkspace({
  query,
  list,
  detail,
  appointmentId,
  today,
}: {
  query: AppointmentListQuery;
  list: QueryResult<AppointmentListResult>;
  detail: AppointmentDetailResult | null;
  appointmentId: string | null;
  today: string;
}) {
  const filtering = query.search !== "" || query.status !== "all";
  const soonestFirst = query.status === "requested" || query.status === "confirmed";

  return (
    <>
      <Panel
        headingId="appointments-heading"
        title="All appointment requests"
        description={soonestFirst ? "Soonest first. Select a row to manage the appointment." : "Newest first. Select a row to manage the appointment."}
        flush
      >
        {!list.ok ? (
          <ListLoadError retryHref="/admin/appointments" what="appointments" />
        ) : (
          <>
            <AppointmentFilters query={query} counts={list.data.counts} />

            {list.data.total === 0 ? (
              filtering ? (
                <EmptyState
                  title="No appointments match"
                  action={
                    <Link href="/admin/appointments" className={outlineButton}>
                      Clear search and filters
                    </Link>
                  }
                >
                  Try a different name, phone number or reference, or change the status filter.
                </EmptyState>
              ) : (
                <EmptyState title="No appointment requests yet">
                  When a customer asks for an appointment through the Contact page, it will appear here for you to confirm, reschedule or cancel.
                </EmptyState>
              )
            ) : (
              <>
                <AppointmentResults rows={list.data.rows} query={{ ...query, page: list.data.page }} selectedId={appointmentId} />
                <ListPagination
                  hrefForPage={(n) => appointmentsHref({ ...query, page: n, appointmentId: null })}
                  noun={{ one: "appointment", many: "appointments" }}
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

      {detail ? <AppointmentDrawerFor detail={detail} query={{ ...query, page: list.ok ? list.data.page : query.page }} today={today} /> : null}
    </>
  );
}
