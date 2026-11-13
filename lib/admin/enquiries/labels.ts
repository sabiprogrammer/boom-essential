import { findInterestLabel } from "@/content/enquiry-options";
import type { AdminDivision, EnquiryRecord } from "./types";

/** Display names. Public-facing names stay exactly as in the brand: BOOM ENERGY, never "BOOM SOLAR". */
export const adminDivisionOrder: readonly AdminDivision[] = ["general", "energy", "security", "foods", "industrial-equipment"];

export const adminDivisionLabels: Record<AdminDivision, string> = {
  general: "General enquiry",
  energy: "BOOM ENERGY",
  security: "BOOM SECURITY",
  foods: "BOOM FOODS",
  "industrial-equipment": "Industrial Equipment",
};

export function isAdminDivision(value: unknown): value is AdminDivision {
  return typeof value === "string" && (adminDivisionOrder as readonly string[]).includes(value);
}

/** "solar-system-design" -> "Solar system design", for a slug the current allowlist no longer knows. */
function humanise(slug: string): string {
  const text = slug.replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** The services or products the customer chose, as the labels the Contact form showed them. */
export function requestedLabels(enquiry: Pick<EnquiryRecord, "division" | "requestedService" | "requestedItem">): string[] {
  const slugs = enquiry.division === "energy" || enquiry.division === "security" ? enquiry.requestedService : enquiry.requestedItem;
  return slugs.map((slug) => findInterestLabel(enquiry.division, slug) ?? humanise(slug));
}

/** One line for lists and the contact message: what was asked about, or "General enquiry". */
export function describeRequest(enquiry: Pick<EnquiryRecord, "division" | "requestedService" | "requestedItem">): string {
  const labels = requestedLabels(enquiry);
  if (labels.length === 0) return enquiry.division === "general" ? "General enquiry" : adminDivisionLabels[enquiry.division];
  if (labels.length <= 2) return labels.join(", ");
  return `${labels[0]}, ${labels[1]} and ${labels.length - 2} more`;
}
