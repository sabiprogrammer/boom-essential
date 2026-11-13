import { cleanSingleLine } from "@/lib/enquiry/server/text";
import { enquiryStatusOrder } from "@/lib/dashboard-preview/labels";
import { isAdminDivision } from "./labels";
import type { DivisionFilter, EnquiryListQuery, EnquiryStatus, StatusFilter } from "./types";

/** Everything the Enquiries screen keeps in its URL, so a view can be bookmarked, shared with a colleague and refreshed. */
export const enquiryPageSize = 10;
export const maxSearchLength = 80;
const maxPage = 100_000;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type RawSearchParams = Record<string, string | string[] | undefined>;

export type EnquiriesUrlState = EnquiryListQuery & {
  /** The enquiry open in the drawer, or null. */
  enquiryId: string | null;
};

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export function isEnquiryStatus(value: unknown): value is EnquiryStatus {
  return typeof value === "string" && (enquiryStatusOrder as readonly string[]).includes(value);
}

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value);
}

/** URL values are untrusted: anything unknown falls back to the default, nothing throws. */
export function parseEnquiriesUrl(raw: RawSearchParams): EnquiriesUrlState {
  const status = first(raw.status);
  const division = first(raw.division);
  const page = Number.parseInt(first(raw.page), 10);
  const enquiry = first(raw.enquiry).trim();

  return {
    search: cleanSingleLine(first(raw.q)).slice(0, maxSearchLength),
    status: isEnquiryStatus(status) ? status : "all",
    division: isAdminDivision(division) ? division : "all",
    page: Number.isInteger(page) && page >= 1 ? Math.min(page, maxPage) : 1,
    enquiryId: isUuid(enquiry) ? enquiry.toLowerCase() : null,
  };
}

/** The /admin address for a view. Default values are left out, so the plain list is just "/admin". */
export function enquiriesHref(state: {
  search?: string;
  status?: StatusFilter;
  division?: DivisionFilter;
  page?: number;
  enquiryId?: string | null;
}): string {
  const params = new URLSearchParams();
  if (state.search) params.set("q", state.search);
  if (state.status && state.status !== "all") params.set("status", state.status);
  if (state.division && state.division !== "all") params.set("division", state.division);
  if (state.page && state.page > 1) params.set("page", String(state.page));
  if (state.enquiryId) params.set("enquiry", state.enquiryId);
  const query = params.toString();
  return query ? `/admin?${query}` : "/admin";
}
