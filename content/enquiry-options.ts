import { energyAssessmentSlug, securityAssessmentSlug } from "./enquiry-links";
import { foodProducts } from "./foods";
import { poundingMachineSlug } from "./industrial-equipment";

/**
 * The allowlist behind the Contact page's enquiry form and its URL prefilling. Only values listed here are
 * ever accepted from a URL or a form. Foods and Industrial Equipment slugs come from their own content
 * files, which stay the source of truth for those links. Never add prices or invented offerings.
 */

export type EnquiryCategory = "general" | "energy" | "security" | "foods" | "industrial-equipment";

export type EnquiryInterest = { slug: string; label: string };

export type EnquiryCategoryOption = {
  id: EnquiryCategory;
  label: string;
  /** One-line descriptor shown in the picker. */
  hint: string;
  /** The URL parameter that selects this category (absent for the general enquiry). */
  query?: { param: "division" | "offering"; value: string };
  /** Label of the interest group, e.g. "Which products?" */
  interestLegend?: string;
  interests: readonly EnquiryInterest[];
};

export const enquiryCategories: readonly EnquiryCategoryOption[] = [
  {
    id: "general",
    label: "General Enquiry",
    hint: "Anything else",
    interests: [],
  },
  {
    id: "energy",
    label: "BOOM Energy",
    hint: "Solar power and energy solutions",
    query: { param: "division", value: "energy" },
    interestLegend: "Which energy services interest you?",
    interests: [
      { slug: energyAssessmentSlug, label: "Energy assessment" },
      { slug: "solar-system-design", label: "Solar system design" },
      { slug: "solar-installation", label: "Solar installation" },
      { slug: "inverter-solutions", label: "Inverter solutions" },
      { slug: "battery-storage", label: "Battery storage" },
      { slug: "solar-maintenance", label: "Solar maintenance" },
      { slug: "solar-system-upgrades", label: "Solar system upgrades" },
      { slug: "residential-solar", label: "Residential solar" },
      { slug: "commercial-institutional-solar", label: "Commercial and institutional solar" },
    ],
  },
  {
    id: "security",
    label: "BOOM Security",
    hint: "Security and surveillance solutions",
    query: { param: "division", value: "security" },
    interestLegend: "Which security services interest you?",
    interests: [
      { slug: "cctv-sales-supply", label: "CCTV sales and supply" },
      { slug: "cctv-installation", label: "CCTV installation" },
      { slug: "cctv-maintenance", label: "CCTV maintenance" },
      { slug: "security-fencing", label: "Security fencing" },
      { slug: "access-control", label: "Access control" },
      { slug: "remote-monitoring", label: "Remote monitoring" },
      { slug: securityAssessmentSlug, label: "Security assessment" },
    ],
  },
  {
    id: "foods",
    label: "BOOM Foods",
    hint: "Food and agricultural products",
    query: { param: "division", value: "foods" },
    interestLegend: "Which products interest you?",
    interests: foodProducts.map((product) => ({ slug: product.slug, label: product.name })),
  },
  {
    id: "industrial-equipment",
    label: "Industrial Equipment",
    hint: "Additional offering",
    query: { param: "offering", value: "industrial-equipment" },
    interestLegend: "Which equipment interests you?",
    interests: [{ slug: poundingMachineSlug, label: "Pounding Machines" }],
  },
];

export function findCategory(id: string): EnquiryCategoryOption | undefined {
  return enquiryCategories.find((category) => category.id === id);
}

export function findInterestLabel(categoryId: string, slug: string): string | undefined {
  return findCategory(categoryId)?.interests.find((interest) => interest.slug === slug)?.label;
}

/** Link to the Contact page's enquiry form with one category selected (used by the Contact hero index). */
export function categoryEnquiryHref(id: EnquiryCategory): string {
  const category = findCategory(id);
  if (!category?.query) return "/contact#enquiry";
  const params = new URLSearchParams({ [category.query.param]: category.query.value });
  return `/contact?${params.toString()}#enquiry`;
}
