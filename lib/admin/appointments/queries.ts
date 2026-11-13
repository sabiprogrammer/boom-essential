import "server-only";
import { APPOINTMENT_COLUMNS, ENQUIRY_COLUMNS } from "@/lib/admin/enquiries/columns";
import { compact, toActivityRecord, toAppointmentRecord } from "@/lib/admin/enquiries/mappers";
import type { QueryResult } from "@/lib/admin/enquiries/queries";
import { orFilterForTerm, searchTerms } from "@/lib/admin/enquiries/search-filter";
import { appointmentStatusOrder } from "@/lib/admin/shared/labels";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { toAppointmentWithEnquiry, toStatusHistoryRecord } from "./mappers";
import { appointmentPageSize } from "./query-params";
import { replacementOf } from "./transitions";
import type { AppointmentDetailData, AppointmentListQuery, AppointmentListResult, AppointmentStatusFilter } from "./types";

/**
 * Reads for the administrator's Appointments screen. Exactly like the enquiry reads: every exported function calls
 * requireAdmin() first, and the queries run with the SIGNED-IN administrator's own session, so Postgres Row Level
 * Security independently allows only an ACTIVE administrator to see appointments and their enquiries. No secret key,
 * nothing cached, and a failure comes back as { ok: false } with no database detail.
 */

export type AppointmentDetailResult = { ok: true; data: AppointmentDetailData } | { ok: true; data: null } | { ok: false };

const WITH_ENQUIRY = `${APPOINTMENT_COLUMNS}, enquiries!inner(${ENQUIRY_COLUMNS})`;

type Client = Awaited<ReturnType<typeof createSupabaseServerClient>>;

/** The search applies to the CUSTOMER (the enquiry the appointment belongs to), so a name, phone, email or reference finds it. */
function withSearch<T extends { or: (filter: string, options?: { referencedTable?: string }) => T }>(builder: T, search: string): T {
  let next = builder;
  for (const term of searchTerms(search)) next = next.or(orFilterForTerm(term), { referencedTable: "enquiries" });
  return next;
}

async function countFor(supabase: Client, search: string, status: AppointmentStatusFilter): Promise<number | null> {
  let builder = supabase.from("appointments").select("id, enquiries!inner(id)", { count: "exact", head: true });
  builder = withSearch(builder, search);
  if (status !== "all") builder = builder.eq("status", status);
  const { count, error } = await builder;
  return error || count === null ? null : count;
}

export async function getAppointmentList(query: AppointmentListQuery): Promise<QueryResult<AppointmentListResult>> {
  await requireAdmin();
  try {
    const supabase = await createSupabaseServerClient();

    const perStatus = await Promise.all(appointmentStatusOrder.map((status) => countFor(supabase, query.search, status)));
    if (perStatus.some((count) => count === null)) return { ok: false };
    const counts = { all: 0 } as Record<AppointmentStatusFilter, number>;
    appointmentStatusOrder.forEach((status, index) => {
      counts[status] = perStatus[index] as number;
      counts.all += perStatus[index] as number;
    });

    const total = query.status === "all" ? counts.all : counts[query.status];
    const pageCount = Math.max(1, Math.ceil(total / appointmentPageSize));
    const page = Math.min(query.page, pageCount);
    if (total === 0) return { ok: true, data: { rows: [], total, counts, page: 1, pageCount: 1, pageSize: appointmentPageSize } };

    let builder = supabase.from("appointments").select(WITH_ENQUIRY);
    builder = withSearch(builder, query.search);
    if (query.status !== "all") builder = builder.eq("status", query.status);

    // Open appointments are worked soonest-first; everything else (all, completed, cancelled) newest-first.
    const soonestFirst = query.status === "requested" || query.status === "confirmed";
    const ordered = soonestFirst
      ? builder.order("preferred_date", { ascending: true }).order("preferred_time", { ascending: true })
      : builder.order("created_at", { ascending: false });
    const { data, error } = await ordered.order("id", { ascending: false }).range((page - 1) * appointmentPageSize, page * appointmentPageSize - 1);
    if (error || !data) return { ok: false };

    // Which of these were rescheduled (replaced by a newer appointment)?
    const ids = data.map((row) => (row as { id?: unknown }).id).filter((id): id is string => typeof id === "string");
    const successors = ids.length
      ? await supabase.from("appointments").select("id, rescheduled_from_id").in("rescheduled_from_id", ids)
      : { data: [], error: null };
    if (successors.error) return { ok: false };
    const replacedBy = new Map<string, string>();
    for (const item of successors.data ?? []) {
      const row = item as { id?: unknown; rescheduled_from_id?: unknown };
      if (typeof row.id === "string" && typeof row.rescheduled_from_id === "string") replacedBy.set(row.rescheduled_from_id, row.id);
    }

    const rows = compact(data.map((row) => toAppointmentWithEnquiry(row, replacedBy.get((row as { id: string }).id) ?? null)));
    return { ok: true, data: { rows, total, counts, page, pageCount, pageSize: appointmentPageSize } };
  } catch {
    return { ok: false };
  }
}

/** One appointment with its enquiry and customer, the whole reschedule chain, its status history and the enquiry's activity. */
export async function getAppointmentDetail(appointmentId: string): Promise<AppointmentDetailResult> {
  const admin = await requireAdmin();
  try {
    const supabase = await createSupabaseServerClient();

    const found = await supabase.from("appointments").select(WITH_ENQUIRY).eq("id", appointmentId).maybeSingle();
    if (found.error) return { ok: false };
    const base = toAppointmentWithEnquiry(found.data, null);
    if (!base) return { ok: true, data: null };

    const [chain, history, activity] = await Promise.all([
      supabase.from("appointments").select(APPOINTMENT_COLUMNS).eq("enquiry_id", base.enquiry.id).order("created_at", { ascending: false }),
      supabase
        .from("appointment_status_history")
        .select("id, previous_status, new_status, changed_by, changed_at")
        .eq("appointment_id", appointmentId)
        .order("changed_at", { ascending: false })
        .limit(100),
      supabase
        .from("activity_logs")
        .select("id, action, actor_type, metadata, created_at")
        .eq("enquiry_id", base.enquiry.id)
        .order("created_at", { ascending: false })
        .limit(200),
    ]);
    if (chain.error || history.error || activity.error) return { ok: false };

    const chainRecords = compact((chain.data ?? []).map(toAppointmentRecord));
    return {
      ok: true,
      data: {
        ...base,
        replacedById: replacementOf(appointmentId, chainRecords),
        chain: chainRecords,
        history: compact((history.data ?? []).map((row) => toStatusHistoryRecord(row, admin.userId))),
        activity: compact((activity.data ?? []).map(toActivityRecord)),
      },
    };
  } catch {
    return { ok: false };
  }
}
