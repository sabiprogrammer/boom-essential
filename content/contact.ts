import { company } from "./company";

/**
 * Contact page copy. Only confirmed facts are used: the legal name, office address, main phone, WhatsApp
 * number and website. There is deliberately NO business email, NO opening hours, NO social links, NO map or
 * coordinates, and NO response-time promise, because none has been supplied or confirmed.
 */
export const contactContent = {
  hero: {
    eyebrow: "Get in touch",
    heading: "Let’s Talk About What You Need.",
    copy: "Whether you need energy solutions, security systems, food products or industrial equipment, our team is ready to understand your requirements.",
    primaryCta: "Send an Enquiry",
    secondaryCta: "WhatsApp Our Team",
    indexLabel: "What can we help with?",
    divisionsLabel: "Principal divisions",
    additionalLabel: "Additional offering",
  },

  channels: {
    eyebrow: "Contact information",
    heading: "Ways to Reach Us.",
    visit: {
      label: "Visit us",
      note: "Our office",
    },
    call: {
      label: "Call us",
      note: "Main phone",
    },
    whatsapp: {
      label: "WhatsApp",
      note: "Message our team",
    },
  },

  enquiry: {
    eyebrow: "Enquiry form",
    heading: "Send Us an Enquiry.",
    lead: "One form for every part of Boom Multi Global. Tell us what you need and, if you like, request an appointment.",
    sideLabel: "Prefer to talk?",
  },

  company: {
    legalName: company.legalName,
    website: company.website,
  },
} as const;
