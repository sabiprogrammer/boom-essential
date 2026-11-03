export type NavLinkItem = {
  label: string;
  href: string;
  /** Short descriptor from the approved brief; shown in the divisions menu. */
  description?: string;
};

export const homeLink: NavLinkItem = { label: "Home", href: "/" };
export const aboutLink: NavLinkItem = { label: "About Us", href: "/about" };
export const contactLink: NavLinkItem = { label: "Contact Us", href: "/contact" };

/** The three principal divisions. Industrial Equipment is deliberately NOT in this list. */
export const divisionsLabel = "Our Divisions";
export const divisionLinks: readonly NavLinkItem[] = [
  { label: "BOOM Energy", href: "/energy", description: "Solar Power and Energy Solutions" },
  { label: "BOOM Security", href: "/security", description: "Security and Surveillance Solutions" },
  { label: "BOOM Foods", href: "/foods", description: "Food and Agricultural Products" },
];

/** Additional offering, not a fourth division. Always presented separately from the divisions. */
export const industrialLink: NavLinkItem = {
  label: "Industrial Equipment",
  href: "/industrial-equipment",
};

/** The appointment form is planned for the Contact page; the anchor is a proposed convention. */
export const consultation = {
  label: "Request a Consultation",
  href: "/contact#appointment",
} as const;
