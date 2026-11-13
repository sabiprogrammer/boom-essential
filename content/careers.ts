import { company } from "./company";

/**
 * Careers page copy. A deliberately minimal page: the client has not supplied vacancies, roles, requirements
 * or an application process, so none are stated. It only says that no vacancies are listed and points to the
 * confirmed phone, WhatsApp and general enquiries email. Replace once the client supplies wording.
 */
export const careersContent = {
  header: {
    eyebrow: "Careers",
    title: "Work With Us.",
    lead: "Interested in working with Boom Multi Global? Speak to our team.",
  },

  opportunities: {
    eyebrow: "Opportunities",
    heading: "Ask About Opportunities.",
    copy: "No vacancies are listed on this page at the moment. If you would like to ask about opportunities at Boom Multi Global, call or WhatsApp our team.",
    callLabel: "Call our team",
    whatsappLabel: "WhatsApp Our Team",
    contactPageLabel: "Visit our Contact page",
  },

  contact: {
    phone: company.phone,
    whatsapp: company.whatsapp,
    email: company.email.general,
  },
} as const;
