import "server-only";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { APPOINTMENT_COLUMNS, ENQUIRY_COLUMNS } from "./columns";
import { compact, toActivityRecord, toAppointmentRecord, toEnquiryRecord, toNoteRecord } from "./mappers";
import { enquiryPageSize } from "./query-params";
import { orFilterForTerm, searchTerms } from "./search-filter";
import { enquiryStatusOrder } from "@/lib/dashboard-preview/labels";
import type { EnquiryDetailData, EnquiryListQuery, EnquiryListResult, StatusFilter } from "./types";

/**
 * Reads for the administrator's Enquiries screen. Two independent layers protect them:
 *   1. every exported function calls requireAdmin() first (verified session AND the BOOM_ADMIN_USER_IDS allowlist);
 *   2. the queries run with the SIGNED-IN administrator's own session (publishable key plus their access token), so
 *      Postgres applies Row Level Security: only an ACTIVE row in private.admin_users can read these tables at all.
 * No secret key is involved anywhere here, and nothing is cached (the data is private and per request).
 *
 * Failures never throw to the page: they come back as { ok: false } and the screen shows a plain error state. Nothing
 * from a database error is logged or shown (messages can quote the row).
 */

export type QueryResult<T> = { ok: true; data: T } | { ok: false };
export type DetailResult = { ok: true; data: EnquiryDetailData } | { ok: true; data: null } | { ok: false };

type Client = Awaited<ReturnType<typeof createSupabaseServerClient>>;

/** The search and division filters, shared by the list and by the per-status counts so the chips always agree with the list. */
function withBaseFilters<T extends { eq: (column: string, value: string) => T; or: (filter: string) => T }>(builder: T, query: EnquiryListQuery): T {
  let next = builder;
  if (query.division !== "all") next = next.eq("division", query.division);
  for (const term of searchTerms(query.search)) next = next.or(orFilterForTerm(term));
  return next;
}

async function countFor(supabase: Client, query: EnquiryListQuery, status: EnquiryListQuery["status"]): Promise<number | null> {
  let builder = supabase.from("enquiries").select("id", { count: "exact", head: true });
  builder = withBaseFilters(builder, query);
  if (status !== "all") builder = builder.eq("status", status);
  const { count, error } = await builder;
  return error || count === null ? null : count;
}

export async function getEnquiryList(query: EnquiryListQuery): Promise<QueryResult<EnquiryListResult>> {
  await requireAdmin();
  try {
    const supabase = await createSupabaseServerClient();

    const statusCounts = await Promise.all(enquiryStatusOrder.map((status) => countFor(supabase, query, status)));
    if (statusCounts.some((count) => count === null)) return { ok: false };
    const counts = { all: 0 } as Record<StatusFilter, number>;
    enquiryStatusOrder.forEach((status, index) => {
      counts[status] = statusCounts[index] as number;
      counts.all += statusCounts[index] as number;
    });

    const total = query.status === "all" ? counts.all : counts[query.status];
    const pageCount = Math.max(1, Math.ceil(total / enquiryPageSize));
    const page = Math.min(query.page, pageCount);

    if (total === 0) return { ok: true, data: { rows: [], total, counts, page: 1, pageCount: 1, pageSize: enquiryPageSize } };

    let builder = supabase.from("enquiries").select(ENQUIRY_COLUMNS);
    builder = withBaseFilters(builder, query);
    if (query.status !== "all") builder = builder.eq("status", query.status);
    const { data, error } = await builder
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .range((page - 1) * enquiryPageSize, page * enquiryPageSize - 1);
    if (error || !data) return { ok: false };

    return { ok: true, data: { rows: compact(data.map(toEnquiryRecord)), total, counts, page, pageCount, pageSize: enquiryPageSize } };
  } catch {
    return { ok: false };
  }
}

/** One enquiry with its appointment requests, internal notes and audit trail. `data: null` means it does not exist (or is not visible). */
export async function getEnquiryDetail(enquiryId: string): Promise<DetailResult> {
  const admin = await requireAdmin();
  try {
    const supabase = await createSupabaseServerClient();

    const found = await supabase.from("enquiries").select(ENQUIRY_COLUMNS).eq("id", enquiryId).maybeSingle();
    if (found.error) return { ok: false };
    const enquiry = toEnquiryRecord(found.data);
    if (!enquiry) return { ok: true, data: null };

    const [appointments, notes, activity] = await Promise.all([
      supabase
        .from("appointments")
        .select(APPOINTMENT_COLUMNS)
        .eq("enquiry_id", enquiryId)
        .order("created_at", { ascending: false }),
      supabase
        .from("enquiry_notes")
        .select("id, content, admin_user_id, created_at")
        .eq("enquiry_id", enquiryId)
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("activity_logs")
        .select("id, action, actor_type, metadata, created_at")
        .eq("enquiry_id", enquiryId)
        .order("created_at", { ascending: false })
        .limit(200),
    ]);
    if (appointments.error || notes.error || activity.error) return { ok: false };

    return {
      ok: true,
      data: {
        enquiry,
        appointments: compact((appointments.data ?? []).map(toAppointmentRecord)),
        notes: compact((notes.data ?? []).map((row) => toNoteRecord(row, admin.userId))),
        activity: compact((activity.data ?? []).map(toActivityRecord)),
      },
    };
  } catch {
    return { ok: false };
  }
}
