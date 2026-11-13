import { company } from "./company";

/**
 * BOOM Foods page copy and product data. Sources: the confirmed product list in docs/project-overview.md §3
 * and the wording supplied by Sabi Programmers for Stage 6 (including the original client information
 * that household staples are supplied in bag sizes from 1kg to 100kg).
 *
 * Hard rules: NO PRICES anywhere (no fields, no wording that implies them), no checkout, payments,
 * inventory or accounts. Never add weights, grades, species, cuts, brands, storage specifications,
 * certifications, origins, contracts, supply volumes or testimonials: none are confirmed.
 */

/**
 * The single place that decides where food enquiries go. Contact page convention (Stage 5 of the plan):
 * `/contact?division=foods&product=<slug>#enquiry`. Change the path or parameter names here only.
 */
const enquiry = { path: "/contact", division: "foods", anchor: "enquiry" } as const;

/** Enquiry link for one product, identifying it by slug. Without a slug, a general Foods enquiry. */
export function foodsEnquiryHref(productSlug?: string): string {
  const params = new URLSearchParams({ division: enquiry.division });
  if (productSlug) params.set("product", productSlug);
  return `${enquiry.path}?${params.toString()}#${enquiry.anchor}`;
}

export type FoodProduct = {
  number: string;
  slug: string;
  name: string;
  group: "staple" | "protein";
  /** Only where supplied or safely generic. Staples carry no description: none has been supplied. */
  description?: string;
};

export const foodProducts: readonly FoodProduct[] = [
  { number: "01", slug: "garri", name: "Garri", group: "staple" },
  { number: "02", slug: "ekiti-garri", name: "Garri Ekiti", group: "staple" },
  { number: "03", slug: "fufu-powder", name: "Fufu Powder", group: "staple" },
  { number: "04", slug: "ofada-rice", name: "Ofada Rice", group: "staple" },
  { number: "05", slug: "igbemo-rice", name: "Igbemo Rice", group: "staple" },
  {
    number: "06",
    slug: "smoked-fish",
    name: "Smoked Fish",
    group: "protein",
    description: "A flavourful protein product for everyday cooking, supplied to households and food businesses.",
  },
  {
    number: "07",
    slug: "frozen-chicken",
    name: "Frozen Chicken",
    group: "protein",
    description: "A versatile frozen protein for household meals and commercial kitchens.",
  },
];

export const foodsContent = {
  tagline: "Good Food. Healthy Lives.",

  hero: {
    eyebrow: "BOOM Foods · Food and Agricultural Products",
    headline: ["Good Food.", "Healthy Lives."],
    copy: "Quality food and agricultural products for households, businesses, organisations and institutions.",
    /**
     * Neutral wording built only from the confirmed product list. It deliberately makes NO claim about where the
     * products come from: the flyer line "From our farms and trusted sources to your table." was never confirmed
     * (it is not known that BOOM operates farms), so it was removed before launch. Do not restore sourcing wording
     * (farms, growers, origin, "trusted sources") unless the client confirms it in writing.
     */
    statement: "Household staples, smoked fish and frozen chicken for your table.",
    primaryCta: "Enquire About Products",
    secondaryCta: "See Our Products",
    indexLabel: "Our products",
  },

  intro: {
    eyebrow: "Introduction",
    heading: "Everyday Food Products. Supplied With Care.",
    paragraphs: [
      "BOOM FOODS is the food and agricultural products division of Boom Multi Global Company Limited.",
      "Its offerings include household staples and protein products, supplied to households, businesses, organisations and institutions.",
    ],
    groups: [
      { count: "05", label: "Household staples", href: "#household-staples" },
      { count: "02", label: "Protein products", href: "#protein-products" },
    ],
  },

  staples: {
    eyebrow: "Household staples",
    heading: "Household Staples.",
    lead: "Five everyday products, each one an enquiry away.",
    packagingLabel: "Packaging",
    packaging: "Supplied in bag sizes ranging from 1kg to 100kg.",
    packagingNote: "Ask our team which sizes are available for the product you need.",
    sizeFrom: "1kg",
    sizeTo: "100kg",
    enquiryCta: "Enquire About This Product",
  },

  proteins: {
    eyebrow: "Protein products",
    heading: "Protein Products.",
    lead: "Smoked fish and frozen chicken for households and food businesses.",
    enquiryCta: "Enquire About This Product",
  },

  audiences: {
    eyebrow: "Who we serve",
    heading: "Food Supply for Households, Businesses and Institutions.",
    items: [
      { label: "Households", text: "For household food and staple product requirements." },
      { label: "Businesses", text: "For food businesses and other commercial buyers." },
      { label: "Organisations and Institutions", text: "For organisations and institutions with food supply requirements." },
    ],
  },

  supply: {
    eyebrow: "Supply and enquiries",
    heading: "Tell Us What You Need.",
    copy: "Customers can enquire about products, desired quantities and supply requirements. Bulk and general product enquiries are welcome.",
    tellUs: ["The product or products you need", "The quantity you want", "Your supply requirements"],
    tellUsLabel: "What to tell us",
    channelsLabel: "Ways to reach us",
    enquireOnline: "Enquire online",
  },

  closing: {
    eyebrow: "Get in touch",
    heading: "Let’s Talk About Your Food Supply Needs.",
    primaryCta: "Enquire About Products",
    secondaryCta: "WhatsApp Our Team",
    contactCta: "Contact Us",
    contactHref: "/contact",
  },

  contact: {
    phone: company.phone,
    whatsapp: company.whatsapp,
    email: company.email.general,
  },
} as const;

export const stapleProducts = foodProducts.filter((product) => product.group === "staple");
export const proteinProducts = foodProducts.filter((product) => product.group === "protein");
