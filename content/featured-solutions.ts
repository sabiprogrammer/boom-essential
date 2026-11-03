import type { DivisionId } from "./divisions";

export type FeaturedSolution = {
  title: string;
  division: DivisionId;
  href: string;
};

/**
 * Selected services and products, named exactly as in the approved documentation
 * (docs/project-overview.md §3). Interleaved across divisions on purpose.
 * No descriptions, specifications or prices: none have been supplied.
 */
export const featuredSolutions: readonly FeaturedSolution[] = [
  { title: "Energy assessment and power audits", division: "energy", href: "/energy" },
  { title: "CCTV installation", division: "security", href: "/security" },
  { title: "Ofada rice", division: "foods", href: "/foods" },
  { title: "Solar system design", division: "energy", href: "/energy" },
  { title: "Access control solutions", division: "security", href: "/security" },
  { title: "Ekiti Garri", division: "foods", href: "/foods" },
  { title: "Battery storage", division: "energy", href: "/energy" },
  { title: "Remote monitoring solutions", division: "security", href: "/security" },
  { title: "Smoked fish", division: "foods", href: "/foods" },
];

export const divisionLabels: Record<DivisionId, string> = {
  energy: "BOOM Energy",
  security: "BOOM Security",
  foods: "BOOM Foods",
};
