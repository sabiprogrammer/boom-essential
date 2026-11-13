import { company } from "./company";
import { productPhotos } from "./product-photos";

/**
 * Industrial Equipment page copy. Industrial Equipment is an ADDITIONAL OFFERING of Boom Multi Global,
 * never a fourth principal division. Sources: the confirmed documentation (docs/project-overview.md)
 * and the original client information supplied by Sabi Programmers: pounding machines, in different
 * sizes, for the restaurant business.
 *
 * Hard rules: never add machine specifications, sizes, capacities, power ratings, dimensions, materials,
 * brands, prices, warranties, certifications or customer segments beyond the restaurant business
 * (no factories or general food-processing companies) without client confirmation. No cart or checkout.
 * Never describe pounding machines as being for "food-processing businesses".
 */

/**
 * The single place that decides where equipment enquiries go. Contact page convention:
 * `/contact?offering=industrial-equipment&product=<slug>#enquiry`. Change the path, parameter names or
 * anchor here only.
 */
const enquiry = { path: "/contact", offering: "industrial-equipment", anchor: "enquiry" } as const;

export const poundingMachineSlug = "pounding-machine";

/** Enquiry link for an Industrial Equipment product. Defaults to pounding machines, the only product. */
export function industrialEnquiryHref(productSlug: string = poundingMachineSlug): string {
  const params = new URLSearchParams({ offering: enquiry.offering, product: productSlug });
  return `${enquiry.path}?${params.toString()}#${enquiry.anchor}`;
}

/** An authentic photograph of a BOOM machine. Never a generated or stock image. */
export type ProductImage = { src: string; alt: string; width: number; height: number };

export const industrialContent = {
  /**
   * The client's own photograph of the smaller pounding machines (supplied 10 Nov 2026; the flyer banner and price
   * are cropped out). The hero shows it. There is no drawing fallback: the client asked for photographs, not drawings.
   */
  productImage: productPhotos.poundingMachinesSmall as ProductImage,

  hero: {
    eyebrow: "Additional offering · Industrial Equipment",
    headline: ["Equipment for the", "Restaurant Business."],
    copy: "We supply pounding machines in different sizes for people in the restaurant business.",
    primaryCta: "Enquire About Pounding Machines",
    secondaryCta: "WhatsApp Our Team",
  },

  position: {
    label: "Where this fits",
    text: "Boom Multi Global has three principal business divisions. Industrial Equipment is an additional offering alongside them, not a fourth division.",
    divisionsLabel: "Principal divisions",
    additionalLabel: "Additional offering",
    additionalName: "Industrial Equipment",
    hereLabel: "You are here",
  },

  intro: {
    eyebrow: "The product",
    heading: "Pounding Machines for Restaurant Businesses.",
    paragraphs: [
      "Boom Multi Global provides pounding machines in different sizes for restaurant businesses.",
      "If you run a restaurant, our team can talk you through the available options.",
    ],
    sheetLabel: "At a glance",
    sheet: [
      { term: "Product", detail: "Pounding machines" },
      { term: "Available", detail: "In different sizes" },
      { term: "Supplied for", detail: "The restaurant business" },
      { term: "Details", detail: "Discussed directly with our team" },
    ],
  },

  options: {
    eyebrow: "Available options",
    heading: "Different Sizes. Options to Discuss.",
    copy: "Pounding machines are available in different sizes. No sizes or specifications are listed here: the right option depends on your restaurant’s requirements, so the best place to start is a conversation with our team.",
    smaller: "Smaller",
    larger: "Larger",
    cta: "Enquire About Pounding Machines",
  },

  audience: {
    eyebrow: "Who it serves",
    heading: "Supplied for the Restaurant Business.",
    items: [
      {
        label: "Restaurants",
        text: "Pounding machines supplied for restaurants.",
        icon: "restaurant",
      },
      {
        label: "Restaurant owners and operators",
        text: "For the people who own and run restaurant businesses.",
        icon: "operator",
      },
    ],
  },

  journey: {
    eyebrow: "Suggested enquiry journey",
    heading: "A Simple Way to Start.",
    lead: "A suggested way to enquire, not a fixed process.",
    steps: [
      { number: "01", title: "Tell Us What You Need", description: "Customers explain their restaurant equipment requirements." },
      { number: "02", title: "Discuss Available Options", description: "The customer discusses suitable machine sizes with the team." },
      { number: "03", title: "Make an Enquiry", description: "The customer contacts BOOM to obtain further product information." },
    ],
  },

  closing: {
    eyebrow: "Get in touch",
    heading: "Let’s Discuss Your Equipment Requirements.",
    copy: "Contact our team to enquire about available pounding machine sizes and options for your restaurant.",
    primaryCta: "Enquire About Pounding Machines",
    secondaryCta: "WhatsApp Our Team",
  },

  contact: {
    phone: company.phone,
    whatsapp: company.whatsapp,
    email: company.email.general,
  },
} as const;
