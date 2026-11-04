import { enquiryCategories, findCategory } from "@/content/enquiry-options";
import type { EnquiryInitial } from "./types";

type ParamReader = { get(name: string): string | null };

/** Lower-cased, trimmed and length-capped, so arbitrary input can never be a long or odd lookup key. */
function clean(value: string | null): string {
  return (value ?? "").trim().toLowerCase().slice(0, 64);
}

/**
 * Reads the Contact page's query string into a safe initial form state. Only allowlisted values are ever
 * returned; everything else (missing, unknown, mismatched or oversized) is ignored.
 *
 *  - Category: `offering=` first (the specific additional offering), then `division=`. Both are looked up by
 *    comparing against the allowlist, never used as object keys.
 *  - Interest: `product=` or `service=` (interchangeable). Accepted only if it belongs to the chosen category.
 *  - Appointment: set by the `#appointment` anchor (handled by the caller), not by the query string.
 */
export function parseEnquiryPrefill(params: ParamReader): Pick<EnquiryInitial, "category" | "interests" | "prefilled"> {
  const offering = clean(params.get("offering"));
  const division = clean(params.get("division"));

  const category =
    enquiryCategories.find((c) => c.query?.param === "offering" && c.query.value === offering) ??
    enquiryCategories.find((c) => c.query?.param === "division" && c.query.value === division);

  if (!category) return { category: "", interests: [], prefilled: false };

  const requested = clean(params.get("product")) || clean(params.get("service"));
  const match = requested ? findCategory(category.id)?.interests.find((interest) => interest.slug === requested) : undefined;

  return { category: category.id, interests: match ? [match.slug] : [], prefilled: true };
}
