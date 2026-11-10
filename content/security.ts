import { divisionAppointmentHref, securityAssessmentSlug } from "./enquiry-links";

/**
 * BOOM Security page copy. Every statement comes from the confirmed service list in
 * docs/project-overview.md §3 and the wording supplied by Sabi Programmers for Stage 5.
 * Never add brands, product models, specifications, camera counts, ranges or resolutions,
 * monitoring arrangements, response times, warranties, service-level agreements, certifications,
 * statistics, testimonials, customer names or completed-installation claims. None are confirmed.
 */

/** Where the assessment request goes: the Contact page appointment request with BOOM Security and the assessment pre-selected. Change it here only. */
export const securityAssessmentHref = divisionAppointmentHref("security", securityAssessmentSlug);

export type SecurityIconName =
  | "layout"
  | "access"
  | "perimeter"
  | "surveillance"
  | "supply"
  | "installation"
  | "maintenance"
  | "fencing"
  | "accessControl"
  | "monitoring"
  | "assessment"
  | "residential"
  | "commercial"
  | "institutional";

export type SecurityService = {
  number: string;
  title: string;
  description: string;
  icon: SecurityIconName;
};

export const securityContent = {
  hero: {
    eyebrow: "BOOM Security · Security and Surveillance Solutions",
    headline: ["Protect What", "Matters Most."],
    copy: "Security solutions designed to help homes, businesses and institutions improve property protection, surveillance and access management.",
    primaryCta: "Request a Security Assessment",
    secondaryCta: "Talk to Our Security Team",
    schematicNote: "Illustrative schematic. Not a BOOM installation.",
  },

  intro: {
    eyebrow: "Introduction",
    heading: "A More Thoughtful Approach to Property Security.",
    paragraphs: [
      "Residential buildings, offices, warehouses, schools, commercial facilities and other institutions all have different security requirements.",
      "BOOM SECURITY considers property layout, access points, perimeter areas and surveillance requirements when working towards suitable solutions.",
    ],
    considerationsLabel: "What we consider",
    considerations: [
      { title: "Property layout", icon: "layout" },
      { title: "Access points", icon: "access" },
      { title: "Perimeter areas", icon: "perimeter" },
      { title: "Surveillance requirements", icon: "surveillance" },
    ],
  },

  services: {
    eyebrow: "Our security services",
    heading: "Seven Services Across Surveillance, Perimeter and Access.",
    lead: "Each one starts from the property it has to protect.",
    groups: {
      surveillance: "Surveillance systems",
      perimeter: "Perimeter and entry",
      monitoring: "Monitoring and assessment",
    },
  },

  /** CCTV equipment in view. The first line repeats the confirmed wording of service 01. Types are generic; no brands, models or specifications. */
  equipment: {
    eyebrow: "CCTV equipment",
    heading: "Cameras and Recording Equipment.",
    lead: "Supply of CCTV cameras, recording equipment, storage devices and related surveillance accessories.",
    photoNote: "Product image",
    drawingsLabel: "Common CCTV equipment types",
    drawingsNote: "Illustrative drawings of common equipment types. Not BOOM products.",
    drawings: [
      { id: "dome", label: "Dome camera" },
      { id: "bullet", label: "Bullet camera" },
      { id: "recorder", label: "Recording unit and monitor" },
    ],
    cta: "See the products catalogue",
  },

  audiences: {
    eyebrow: "Who we serve",
    heading: "Different Properties. Different Security Needs.",
    lead: "Three broad kinds of customer, each with its own priorities.",
  },

  approach: {
    eyebrow: "Our approach",
    heading: "Security Solutions Begin With Understanding Your Property.",
    lead: "Five steps from the first conversation to ongoing support.",
  },

  closing: {
    eyebrow: "Get in touch",
    heading: "Let’s Discuss Your Security Requirements.",
    copy: "Tell us about your property and the security solutions you are considering. Our team is ready to understand your needs.",
    primaryCta: "Request a Security Assessment",
    secondaryCta: "WhatsApp Our Team",
  },
} as const;

/** The seven confirmed services, with the exact titles and descriptions supplied. */
export const securityServices: readonly SecurityService[] = [
  {
    number: "01",
    title: "CCTV Sales & Supply",
    description: "Supply of CCTV cameras, recording equipment, storage devices and related surveillance accessories.",
    icon: "supply",
  },
  {
    number: "02",
    title: "CCTV Installation",
    description: "Professional installation, configuration and commissioning of CCTV surveillance systems.",
    icon: "installation",
  },
  {
    number: "03",
    title: "CCTV Maintenance & Support",
    description:
      "Inspection, troubleshooting, servicing and maintenance of CCTV systems to support continuous operation.",
    icon: "maintenance",
  },
  {
    number: "04",
    title: "Security Fencing",
    description:
      "Supply and installation of security fencing solutions designed to strengthen property boundaries and improve perimeter protection.",
    icon: "fencing",
  },
  {
    number: "05",
    title: "Access Control Solutions",
    description: "Installation and configuration of access control systems for controlled entry and restricted areas.",
    icon: "accessControl",
  },
  {
    number: "06",
    title: "Remote Monitoring Solutions",
    description:
      "Setup and support for remote surveillance and monitoring systems, subject to available technology and connectivity.",
    icon: "monitoring",
  },
  {
    number: "07",
    title: "Security Assessment",
    description:
      "Assessment of property layout, access points, perimeter areas and surveillance requirements to identify suitable security solutions.",
    icon: "assessment",
  },
];

export type SecurityAudience = {
  id: "residential" | "commercial" | "institutional";
  label: string;
  /** The property types, as supplied. */
  includes: string;
  /** General, hedged note. No customer, contract or installation claims. */
  focus: string;
  icon: SecurityIconName;
};

export const securityAudiences: readonly SecurityAudience[] = [
  {
    id: "residential",
    label: "Residential",
    includes: "Homes and residential properties.",
    focus: "Gates, boundaries and entrances may be the main concern.",
    icon: "residential",
  },
  {
    id: "commercial",
    label: "Commercial",
    includes: "Offices, retail outlets, warehouses and other commercial properties.",
    focus: "Larger sites and storage areas may need wider surveillance and controlled entry.",
    icon: "commercial",
  },
  {
    id: "institutional",
    label: "Institutional",
    includes: "Schools, healthcare facilities, hotels, industrial properties and other institutions.",
    focus: "Many people and several entry points may call for access management as well as surveillance.",
    icon: "institutional",
  },
];

export type SecurityStep = { number: string; title: string; description: string };

export const securitySteps: readonly SecurityStep[] = [
  {
    number: "01",
    title: "Understand Your Requirements",
    description: "Learn about the customer’s security concerns and objectives.",
  },
  {
    number: "02",
    title: "Assess the Property",
    description: "Consider layout, access points, perimeter areas and surveillance requirements.",
  },
  {
    number: "03",
    title: "Recommend Suitable Solutions",
    description: "Work towards identifying appropriate security systems and infrastructure.",
  },
  {
    number: "04",
    title: "Installation and Configuration",
    description: "Proceed with the agreed installation and setup.",
  },
  {
    number: "05",
    title: "Maintenance and Support",
    description: "Provide relevant servicing and support.",
  },
];
