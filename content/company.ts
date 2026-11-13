/**
 * Confirmed company facts (docs/project-overview.md §1). Nothing here may be invented.
 * The two email addresses were confirmed by the owner on 2026-11-13 (general enquiries, and privacy and administrative
 * matters). Social media accounts have not been supplied, so none exist here.
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
  email: {
    /** General enquiries. */
    general: { display: "info@boomessential.com", href: "mailto:info@boomessential.com" },
    /** Privacy and administrative matters: requests about personal information go here. */
    privacy: { display: "admin@boomessential.com", href: "mailto:admin@boomessential.com" },
  },
  /** Fixed (not computed): `new Date()` is not allowed during prerender with cacheComponents. */
  copyrightYear: 2026,
} as const;
