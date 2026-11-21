import type { DivisionId } from "./divisions";

/**
 * About Us copy. Every statement comes from the client-confirmed company information supplied by
 * Sabi Programmers or from docs/project-overview.md. Do not add a founding year, history, headcount,
 * statistics, certifications or other coverage claims beyond those in content/company-profile.ts (the client's
 * company profile of 2026-11-21, which holds the partnership and nationwide-presence statements).
 */
export const aboutContent = {
  hero: {
    eyebrow: "About Boom Multi Global",
    heading: "A Company Built Around Essential Needs.",
    statement:
      "Boom Multi Global is an indigenous Nigerian company with its head office in Akure, Ondo State, operating across energy, security and food supply.",
  },

  whoWeAre: {
    eyebrow: "Who we are",
    heading: "More Than Products. A Commitment to Solutions.",
    statement:
      "Boom Multi Global Company Limited is an indigenous Nigerian company with its head office in Akure, Ondo State, committed to powering lives, protecting assets and providing essential products for households and businesses.",
    /** The client's own wording: see content/company-profile.ts. */
    solutionPartners:
      "We are not just vendors. We are solution partners. Our customers share their thoughts, needs and expectations with us, and we deliver, and over-deliver, on those expectations.",
    divisionsIntro: "The company operates through three principal business divisions:",
    belief:
      "The company believes that good service begins with listening to customers, understanding their needs and working towards solutions that meet their expectations.",
  },

  values: {
    eyebrow: "Our core values",
    heading: "What Guides Us.",
  },

  divisions: {
    eyebrow: "Our business divisions",
    heading: "Three Areas of Focus. One Company.",
    lead: "Boom Multi Global operates through three principal business divisions.",
    /** Concise descriptions assembled only from the confirmed service and product lists. */
    descriptions: {
      energy:
        "Energy assessment, solar system design and installation, inverter and battery solutions, maintenance and upgrades.",
      security: "CCTV supply and installation, security fencing, access control and remote monitoring.",
      foods: "Garri, fufu powder, Ofada rice, Igbemo rice, smoked fish and frozen chicken.",
    } satisfies Record<DivisionId, string>,
    industrial: {
      label: "Also supplied",
      text: "Pounding machines in different sizes for the restaurant business. An additional offering, separate from the three divisions.",
      cta: "Industrial Equipment",
      href: "/industrial-equipment",
    },
  },

  leadership: {
    eyebrow: "Leadership and management",
    heading: "The People Behind Boom Multi Global.",
    lead: "The Management Team.",
  },

  closing: {
    eyebrow: "Get in touch",
    heading: "Let’s Build Something Valuable Together.",
    lead: "Explore what BOOM Energy, BOOM Security and BOOM Foods can do for you, or speak to our team directly.",
  },
} as const;
