/**
 * Confirmed company facts (docs/project-overview.md §1). Nothing here may be invented.
 * Email address and social media accounts have not been supplied, so none exist here.
 */
export const company = {
  legalName: "BOOM MULTI GLOBAL COMPANY LIMITED",
  shortName: "Boom Multi Global",
  tagline: "POWER. PROTECTION. PROVISION.",
  taglineWords: ["Power.", "Protection.", "Provision."],
  website: "www.boomessential.com",
  address: {
    lines: [
      "Petrocam Filling Station",
      "Federal Housing Estate, Shagari",
      "Akure, Ondo State, Nigeria",
    ],
  },
  phone: {
    display: "+234 805 554 4415",
    href: "tel:+2348055544415",
  },
  whatsapp: {
    display: "+234 816 650 3634",
    href: "https://wa.me/2348166503634",
  },
  /** Fixed (not computed): `new Date()` is not allowed during prerender with cacheComponents. */
  copyrightYear: 2026,
} as const;
