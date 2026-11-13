/**
 * The Privacy Notice (/privacy). Every statement here describes what the website and its database actually do, checked
 * against the code (see docs/implementation-plan.md §6.20). Nothing is invented: there is no retention period, no
 * data-sharing arrangement, no privacy officer and no lawful-basis claim here because none has been confirmed. The
 * wording that still needs the owner's confirmation before publication is listed in the milestone report and in
 * CLAUDE.md ("Privacy notice rules"). Change a statement only when the implementation, or a confirmed company practice,
 * changes. British spelling.
 */

export type PrivacyBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: readonly string[] }
  | { type: "note"; text: string }
  /** Renders the company's contact details with working links (see components/privacy/PrivacyContact.tsx). */
  | { type: "contact" };

export type PrivacySection = {
  id: string;
  heading: string;
  blocks: readonly PrivacyBlock[];
};

export const privacyContent = {
  header: {
    eyebrow: "Legal",
    title: "Privacy Notice",
    lead: "How Boom Multi Global handles the personal information you send us through this website.",
  },
  /** Shown under the header. Update whenever the notice changes. */
  lastUpdated: "13 November 2026",
  lastUpdatedIso: "2026-11-13",
  indexLabel: "On this page",

  sections: [
    {
      id: "who-we-are",
      heading: "Who we are",
      blocks: [
        {
          type: "p",
          text: "This website, www.boomessential.com, is run by BOOM MULTI GLOBAL COMPANY LIMITED (“Boom Multi Global”, “we” or “us”), with its head office in Akure, Ondo State, Nigeria. We decide why and how the personal information described in this notice is used.",
        },
        { type: "p", text: "Our office address and contact details are at the end of this notice." },
      ],
    },
    {
      id: "what-we-collect",
      heading: "The information we collect",
      blocks: [
        { type: "p", text: "We collect personal information only when you choose to send it to us through the enquiry form on our Contact page. That information is:" },
        {
          type: "ul",
          items: [
            "your full name and your phone number (both are required);",
            "your email address, your business or organisation and your location (all optional);",
            "what your enquiry is about: the division and any services or products you tick;",
            "your message;",
            "if you ask for an appointment, the date and time you would prefer.",
          ],
        },
        {
          type: "p",
          text: "When you send the form, our systems also record a reference number for your enquiry, the date and time it was received and its current status.",
        },
        {
          type: "p",
          text: "To stop the form being flooded with repeated submissions, our systems briefly use the network (IP) address your request comes from. We do not store the address itself: it is turned into a scrambled code that cannot be turned back into the address, and these codes are kept only for a short time (about a week). Your browser also creates a random code for each submission, so that pressing Send twice cannot create two enquiries. That code contains no personal information.",
        },
        {
          type: "note",
          text: "This website does not use advertising or analytics trackers, and it does not set cookies or store anything in your browser for visitors. Nothing you type into the form is saved unless you send it.",
        },
      ],
    },
    {
      id: "why-we-use-it",
      heading: "Why we use your information",
      blocks: [
        { type: "p", text: "We use the information you send us to:" },
        {
          type: "ul",
          items: [
            "read and respond to your enquiry, including contacting you about it by phone call or WhatsApp message on the number you gave, or by email if you gave an address;",
            "arrange an appointment if you asked for one;",
            "keep a record of enquiries, so that our team can see their status, add internal notes and follow up;",
            "keep the form and our systems secure and prevent misuse.",
          ],
        },
        {
          type: "p",
          text: "The website does not send newsletters or marketing messages. Apart from the automatic limit on repeated submissions described above, no automated decisions are made about you.",
        },
      ],
    },
    {
      id: "how-records-are-handled",
      heading: "How enquiries and appointments are handled",
      blocks: [
        {
          type: "ul",
          items: [
            "When you send the form, your enquiry is saved in a secure database and the website shows you a reference number on screen. The website does not send an automatic confirmation email, so please note the reference if you want to quote it.",
            "An appointment request is not a confirmed booking. It is confirmed only when a member of our team confirms a date and time.",
            "Only authorised members of our team can see enquiries. They must sign in with an administrator account, and the database itself refuses to show records to anyone who is not an active administrator.",
            "Our team can change the status of an enquiry, add internal notes (which customers cannot see) and confirm, reschedule or cancel an appointment. These changes are recorded with the date and time and the administrator who made them.",
            "When an appointment is rescheduled or cancelled, the earlier record is kept so that there is a clear history.",
          ],
        },
        {
          type: "p",
          text: "If we contact you on WhatsApp, WhatsApp handles that conversation under its own terms and privacy notice.",
        },
      ],
    },
    {
      id: "service-providers",
      heading: "Who handles information for us",
      blocks: [
        { type: "p", text: "We use two service providers to run the website. They handle information on our behalf, to provide these services:" },
        {
          type: "ul",
          items: [
            "Supabase provides the database where enquiries and appointment records are stored, and the sign-in system for our team. Our database is hosted in Europe (Paris, France).",
            "Vercel hosts the website. Like most hosting services, it may keep standard technical server logs, such as the network address and the pages requested, as part of running the service.",
          ],
        },
        {
          type: "p",
          text: "Because these providers operate internationally, your information may be processed outside Nigeria. The website itself does not send your information to any other organisation.",
        },
      ],
    },
    {
      id: "how-long",
      heading: "How long we keep your information",
      blocks: [
        {
          type: "p",
          text: "We keep enquiry and appointment records for as long as we need them to deal with your enquiry or appointment and to keep an accurate record of our dealings with you. Records are not deleted automatically. You can ask us to delete yours (see “Your rights” below).",
        },
      ],
    },
    {
      id: "security",
      heading: "How we protect it",
      blocks: [
        {
          type: "ul",
          items: [
            "The website uses an encrypted (HTTPS) connection.",
            "Seeing enquiries needs an administrator account, and the database only shows records to active administrators.",
            "Our systems record who changes an enquiry or an appointment.",
          ],
        },
        { type: "p", text: "No online system can be guaranteed to be completely secure, but we take care to protect the information you send us." },
      ],
    },
    {
      id: "your-rights",
      heading: "Your rights",
      blocks: [
        {
          type: "p",
          text: "Under the Nigeria Data Protection Act 2023 and related rules, you have rights over your personal information. Depending on the circumstances, these include the right to:",
        },
        {
          type: "ul",
          items: [
            "be told how your information is used (this notice);",
            "ask for access to the personal information we hold about you;",
            "ask us to correct information that is wrong or incomplete;",
            "ask us to delete your information, where the law allows;",
            "ask us to restrict how we use your information, or object to its use;",
            "ask for a copy of the information you gave us in a form you can pass to another organisation;",
            "withdraw your consent, where we rely on it, without affecting what was done before;",
            "not be subject to a decision made only by automated means that significantly affects you.",
          ],
        },
        {
          type: "p",
          text: "These rights are not absolute and some apply only in certain situations. If we cannot do what you ask, we will tell you why. You also have the right to complain to the Nigeria Data Protection Commission if you believe your information has been handled unlawfully.",
        },
      ],
    },
    {
      id: "contact-us",
      heading: "How to make a request or raise a concern",
      blocks: [
        {
          type: "p",
          text: "To ask for access to your information, to have it corrected or deleted, or to raise a privacy concern, please contact us using the privacy email address below. Tell us your name, the phone number or email address you used, the reference number if you have one (for example BOOM-2026-00013) and what you would like us to do.",
        },
        {
          type: "p",
          text: "We may ask you to confirm who you are before we share or change anything, so that information is never given to the wrong person.",
        },
        { type: "contact" },
      ],
    },
    {
      id: "changes",
      heading: "Changes to this notice",
      blocks: [
        { type: "p", text: "We may update this notice from time to time. The date at the top of this page shows when it was last changed." },
      ],
    },
  ],

  contact: {
    heading: "Contact details",
    generalLabel: "General enquiries",
    privacyLabel: "Privacy and administrative matters",
    phoneLabel: "Phone",
    whatsappLabel: "WhatsApp",
    addressLabel: "Office",
  },
} as const satisfies {
  header: { eyebrow: string; title: string; lead: string };
  lastUpdated: string;
  lastUpdatedIso: string;
  indexLabel: string;
  sections: readonly PrivacySection[];
  contact: Record<string, string>;
};

/** What the form notice says, kept here so the wording and the notice itself stay in step. */
export const formPrivacyNote = {
  text: "We use the details you send only to respond to your enquiry or appointment request.",
  linkLabel: "Read our Privacy Notice",
  linkNote: "(opens in a new tab)",
  href: "/privacy",
} as const;
