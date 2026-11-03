export type DivisionId = "energy" | "security" | "foods";

export type Division = {
  id: DivisionId;
  number: string;
  name: string;
  /** Short name used in compact layouts. */
  shortName: string;
  /** The tagline word this division stands for (POWER. PROTECTION. PROVISION.). */
  word: string;
  descriptor: string;
  /** Homepage highlights, drawn from the confirmed service/product lists. */
  highlights: readonly string[];
  href: string;
  cta: string;
};

/** The three principal divisions. Industrial Equipment is an additional offering and is not listed here. */
export const divisions: readonly Division[] = [
  {
    id: "energy",
    number: "01",
    name: "BOOM Energy",
    shortName: "Energy",
    word: "Power",
    descriptor: "Solar Power and Energy Solutions",
    highlights: [
      "Energy assessment",
      "Solar system design and installation",
      "Inverter and battery solutions",
      "Maintenance and upgrades",
    ],
    href: "/energy",
    cta: "Explore BOOM Energy",
  },
  {
    id: "security",
    number: "02",
    name: "BOOM Security",
    shortName: "Security",
    word: "Protection",
    descriptor: "Security and Surveillance Solutions",
    highlights: [
      "CCTV supply and installation",
      "Security fencing",
      "Access control",
      "Remote monitoring",
    ],
    href: "/security",
    cta: "Explore BOOM Security",
  },
  {
    id: "foods",
    number: "03",
    name: "BOOM Foods",
    shortName: "Foods",
    word: "Provision",
    descriptor: "Food and Agricultural Products",
    highlights: [
      "Garri and Ekiti garri",
      "Fufu powder",
      "Ofada rice and Igbemo rice",
      "Smoked fish and frozen chicken",
    ],
    href: "/foods",
    cta: "Explore BOOM Foods",
  },
];
