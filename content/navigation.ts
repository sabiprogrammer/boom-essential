export type NavLinkItem = {
  label: string;
  href: string;
  /** Short descriptor from the approved brief; shown in the divisions menu. */
  description?: string;
};

export const homeLink: NavLinkItem = { label: "Home", href: "/" };
export const aboutLink: NavLinkItem = { label: "About Us", href: "/about" };
export const contactLink: NavLinkItem = { label: "Contact Us", href: "/contact" };

/** Added at the client's request (10 Nov 2026): the catalogue and the project photographs. */
export const productsLink: NavLinkItem = { label: "Products catalogue", href: "/products" };
export const projectsLink: NavLinkItem = { label: "Projects", href: "/projects" };

/** Footer-only links (client request, 10 Nov 2026). "Our team" is the leadership section of About Us. */
export const ourTeamLink: NavLinkItem = { label: "Our team", href: "/about#leadership" };
export const careersLink: NavLinkItem = { label: "Careers", href: "/careers" };

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
