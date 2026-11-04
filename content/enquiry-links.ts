/**
 * Slugs and link builders shared by the pages that send visitors to the Contact page. The Contact page
 * (lib/enquiry/prefill.ts) reads these URLs; its allowlist lives in content/enquiry-options.ts.
 *
 * URL patterns, which all work with the same form:
 *   Foods:       /contact?division=foods&product=<slug>#enquiry                  (content/foods.ts)
 *   Industrial:  /contact?offering=industrial-equipment&product=<slug>#enquiry   (content/industrial-equipment.ts)
 *   Energy/Security assessments:  /contact?division=<id>&service=<slug>#appointment   (built here)
 * `product` and `service` are interchangeable names for the specific interest. This file stays free of other
 * content imports so any content file can use it without a cycle.
 */

export const energyAssessmentSlug = "energy-assessment";
export const securityAssessmentSlug = "security-assessment";

/**
 * Link to the Contact page's appointment request, pre-selecting a division and one of its services.
 * Used by the "Request a Solar Assessment" and "Request a Security Assessment" actions.
 */
export function divisionAppointmentHref(division: "energy" | "security", serviceSlug: string): string {
  const params = new URLSearchParams({ division, service: serviceSlug });
  return `/contact?${params.toString()}#appointment`;
}
