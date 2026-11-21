/**
 * Company profile statements supplied by the client in the company profile document received through Sabi
 * Programmers on 2026-11-21 (the owner confirmed they are to be published). This is the ONLY place that holds the
 * partnership, nationwide-presence, always-available and "why Boom" statements, so a correction is made once.
 *
 * Deliberately NOT used from that document (it conflicts with the confirmed facts or is an unverifiable superlative):
 * a United Arab Emirates base (the confirmed head office is in Akure), "the foremost company", and "we can provide
 * the energy needed for the entire country". Do not add them without the client confirming them again in writing.
 */

/** The closing line of the client's profile. Used in the homepage closing section. */
export const closingTagline = "Powering Nigeria. Feeding Nigeria. Securing Nigeria.";

export const companyProfile = {
  solutionPartners: {
    statement: "We are not just vendors. We are solution partners.",
    story:
      "One good thing about Boom Energy is that we allow our customers to tell us their story. We don't choose for our customers. Our customers share their thoughts, needs and expectations with us, and Boom ensures we deliver and over-deliver on those expectations.",
  },

  /** Wording kept close to the client's own: three manufacturers, in China and the United States of America. */
  partnership: {
    label: "Strategic partnership",
    text: "Boom Multi Global is in strategic partnership with three major renowned solar manufacturers in China and the United States of America.",
  },

  presence: {
    eyebrow: "Our nationwide presence",
    heading: "Everywhere You Need Us.",
    lead: "Our agents span across Nigeria. Everywhere you need our services, we are always there.",
    points: [
      "Major commercial operations across all States in Nigeria and other West Africa markets.",
      "Our website is working and our sales agents are always there to take your order.",
      "Our supply chain works 24/7.",
    ],
    agents: "Sales agents available 24/7 nationwide.",
  },

  why: {
    eyebrow: "Why Boom?",
    heading: "Five Reasons Customers Choose Boom.",
    items: [
      {
        title: "Quality and warranty",
        text: "Partnership with three world-class manufacturers.",
      },
      {
        title: "Tailored solutions",
        text: "You tell us what you want.",
      },
      {
        title: "No project too big",
        text: "From small homes to entire communities.",
      },
      {
        title: "Honest pricing",
        text: "Honest pricing and excellent service delivery.",
      },
      {
        title: "After-sales support",
        text: "Support across Nigeria after the sale.",
      },
    ],
  },
} as const;
