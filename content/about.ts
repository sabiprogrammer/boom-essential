import type { DivisionId } from "./divisions";

/**
 * About Us copy. Every statement comes from the client-confirmed company information supplied by
 * Sabi Programmers or from docs/project-overview.md. Do not add a founding year, history, headcount,
 * statistics, partnerships, certifications or coverage claims: none have been supplied.
 */
export const aboutContent = {
  hero: {
    eyebrow: "About BOOM MULTI GLOBAL",
    heading: "A Company Built Around Essential Needs.",
    statement:
      "BOOM MULTI GLOBAL is an indigenous Nigerian company in Akure, Ondo State, operating across energy, security and food supply.",
  },

  whoWeAre: {
    eyebrow: "Who we are",
    heading: "More Than Products. A Commitment to Solutions.",
    statement:
      "BOOM MULTI GLOBAL COMPANY LIMITED is an indigenous Nigerian company based in Akure, Ondo State, committed to powering lives, protecting assets and providing essential products for households and businesses.",
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
    lead: "BOOM MULTI GLOBAL operates through three principal business divisions.",
    /** Concise descriptions assembled only from the confirmed service and product lists. */
    descriptions: {
      energy:
        "Energy assessment, solar system design and installation, inverter and battery solutions, maintenance and upgrades.",
      security: "CCTV supply and installation, security fencing, access control and remote monitoring.",
      foods: "Garri, fufu powder, Ofada rice, Igbemo rice, smoked fish and frozen chicken.",
    } satisfies Record<DivisionId, string>,
    industrial: {
      label: "Also supplied",
      text: "Industrial food-processing equipment, particularly pounding machines. An additional offering, separate from the three divisions.",
      cta: "Industrial Equipment",
      href: "/industrial-equipment",
    },
  },

  leadership: {
    eyebrow: "Leadership and management",
    heading: "The People Behind BOOM MULTI GLOBAL.",
    lead: "The management team of BOOM MULTI GLOBAL COMPANY LIMITED.",
  },

  closing: {
    eyebrow: "Get in touch",
    heading: "Let’s Build Something Valuable Together.",
    lead: "Explore what BOOM Energy, BOOM Security and BOOM Foods can do for you, or speak to our team directly.",
  },
} as const;
