import { solarAssessmentHref } from "./energy";

/**
 * Projects page copy. The gallery is the client-supplied installation photographs in `project-photos.ts`.
 * Do not add project names, client names, locations, dates, capacities or completed-project counts: none have
 * been confirmed for publication. Only energy installation photographs exist so far; security and foods
 * projects are listed here only once the client supplies photographs of them.
 */
export const projectsContent = {
  header: {
    eyebrow: "Projects",
    title: "Our Projects.",
    lead: "A selection of inverter and battery installations by Boom Multi Global.",
  },

  gallery: {
    eyebrow: "BOOM Energy",
    heading: "Inverters and Battery Storage, Installed.",
    lead: "Photographs from our installations.",
    label: "Photographs of installations",
  },

  closing: {
    eyebrow: "Plan your system",
    heading: "Let’s Plan Your Energy System.",
    copy: "Tell us about your electricity requirements and let our team understand what you need.",
    primary: { label: "Request a Solar Assessment", href: solarAssessmentHref },
  },
} as const;
