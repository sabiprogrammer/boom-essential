import { company } from "./company";
import { divisionAppointmentHref, energyAssessmentSlug } from "./enquiry-links";

/**
 * BOOM Energy page copy. Every statement comes from the confirmed service list in
 * docs/project-overview.md §3 and the wording supplied by Sabi Programmers for Stage 4.
 * Never add system performance, capacity or size figures, warranties, manufacturer partnerships,
 * certifications, completed-project claims, statistics, testimonials, response times or durations.
 * The public name is BOOM ENERGY; "BOOM SOLAR" is never used.
 */

/** Where the assessment request goes: the Contact page appointment request with BOOM Energy and the assessment pre-selected. Change it here only. */
export const solarAssessmentHref = divisionAppointmentHref("energy", energyAssessmentSlug);

export type EnergyIconName =
  | "audit"
  | "design"
  | "installation"
  | "inverter"
  | "battery"
  | "maintenance"
  | "upgrades"
  | "residential"
  | "commercial"
  | "institutional";

export type EnergyService = {
  number: string;
  title: string;
  description: string;
  icon: EnergyIconName;
};

export const energyContent = {
  hero: {
    eyebrow: "BOOM Energy · Solar Power & Energy Solutions",
    headline: ["Reliable Power.", "A Brighter Tomorrow."],
    copy: "We provide solar power and energy solutions designed around the electricity needs of homes, businesses and institutions.",
    primaryCta: "Request a Solar Assessment",
    secondaryCta: "Talk to Our Energy Team",
  },

  intro: {
    eyebrow: "Introduction",
    heading: "Energy Solutions That Start With Understanding Your Needs.",
    paragraphs: [
      "Every property has different electricity requirements. The appliances in use, the hours power is needed and the nature of the building all shape what a system should do.",
      "BOOM ENERGY provides assessment, design, installation and maintenance services based on each customer’s energy needs.",
    ],
    path: ["Assessment", "Design", "Installation", "Maintenance"],
  },

  services: {
    eyebrow: "Our services",
    heading: "Nine Services, From the First Audit to Ongoing Support.",
    lead: "Each one is shaped around what the customer actually needs.",
    groups: {
      understand: "Assess and design",
      system: "Install and store",
      sustain: "Maintain and grow",
      propertyType: "By property type",
    },
  },

  audiences: {
    eyebrow: "Who we serve",
    heading: "Three Kinds of Property. Three Different Energy Needs.",
    lead: "Energy requirements differ from one kind of property to the next, which is why every solution starts with an assessment.",
  },

  approach: {
    eyebrow: "Our approach",
    heading: "The Right Solar Solution Begins With the Right Assessment.",
    lead: "Five steps from the first conversation to ongoing support.",
  },

  closing: {
    eyebrow: "Get in touch",
    heading: "Let’s Find the Right Energy Solution for You.",
    copy: "Tell us about your electricity requirements and let our team understand what you need.",
    primaryCta: "Request a Solar Assessment",
    secondaryCta: "WhatsApp Our Team",
  },

  contact: {
    phone: company.phone,
    whatsapp: company.whatsapp,
  },
} as const;

/** The nine confirmed services, with the exact titles and descriptions supplied. */
export const energyServices: readonly EnergyService[] = [
  {
    number: "01",
    title: "Energy Assessment and Power Audit",
    description: "Assessment of electricity consumption, appliance loads and power requirements.",
    icon: "audit",
  },
  {
    number: "02",
    title: "Solar System Design",
    description: "Design and specification of solar systems based on customer requirements and property type.",
    icon: "design",
  },
  {
    number: "03",
    title: "Solar Installation",
    description: "Installation and commissioning of solar power systems.",
    icon: "installation",
  },
  {
    number: "04",
    title: "Inverter Solutions",
    description: "Supply, installation, configuration and servicing of inverter systems.",
    icon: "inverter",
  },
  {
    number: "05",
    title: "Battery Storage Solutions",
    description: "Battery systems for energy storage, backup power and improved system performance.",
    icon: "battery",
  },
  {
    number: "06",
    title: "Solar System Maintenance",
    description: "Routine inspection, servicing, troubleshooting and maintenance.",
    icon: "maintenance",
  },
  {
    number: "07",
    title: "Solar System Upgrades",
    description:
      "Expansion and improvement of existing systems through additional panels, batteries, inverters and related components.",
    icon: "upgrades",
  },
  {
    number: "08",
    title: "Residential Solar Solutions",
    description: "Solutions for homes, apartments and residential properties.",
    icon: "residential",
  },
  {
    number: "09",
    title: "Commercial and Institutional Solar Solutions",
    description:
      "Solutions for offices, shops, schools, hospitals, hotels, factories, farms and other institutional facilities.",
    icon: "commercial",
  },
];

export type EnergyAudience = {
  id: "residential" | "commercial" | "institutional";
  label: string;
  /** The property types, as supplied. */
  includes: string;
  /** General, non-numerical explanation of how needs differ. Phrased with "may": no capacity or sizing claims. */
  needs: string;
  icon: EnergyIconName;
};

export const energyAudiences: readonly EnergyAudience[] = [
  {
    id: "residential",
    label: "Residential",
    includes: "Homes, apartments and residential properties.",
    needs:
      "Household demand follows the appliances in use and when the household is at home, so a system is shaped around that daily pattern.",
    icon: "residential",
  },
  {
    id: "commercial",
    label: "Commercial",
    includes: "Offices, shops, hotels, supermarkets and other business facilities.",
    needs:
      "Businesses often depend on power throughout their working hours. Lighting, cooling, refrigeration and equipment may all need to keep running.",
    icon: "commercial",
  },
  {
    id: "institutional",
    label: "Institutional",
    includes: "Schools, hospitals, factories, farms and other institutional properties.",
    needs:
      "These properties may rely on power for essential equipment and larger or more varied loads, so careful assessment matters even more.",
    icon: "institutional",
  },
];

export type EnergyStep = { number: string; title: string; description: string };

export const energySteps: readonly EnergyStep[] = [
  { number: "01", title: "Consultation", description: "Understand the customer’s electricity needs." },
  { number: "02", title: "Assessment", description: "Evaluate power requirements and appliance loads." },
  { number: "03", title: "System Design", description: "Develop a suitable system proposal." },
  { number: "04", title: "Installation", description: "Proceed with the approved installation and commissioning." },
  { number: "05", title: "Support", description: "Provide relevant maintenance and servicing." },
];
