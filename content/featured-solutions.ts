import type { DivisionId } from "./divisions";

export type FeaturedSolution = {
  title: string;
  division: DivisionId;
  href: string;
};

export type FeaturedSolutionGroup = {
  division: DivisionId;
  label: string;
  /** Number of the group's first item, so the numbering runs on across groups (1, 4, 7). */
  start: number;
  items: readonly FeaturedSolution[];
};

/**
 * Selected services and products, named exactly as in the approved documentation
 * (docs/project-overview.md §3). Arranged by category (division) at the client's request (10 Nov 2026):
 * Energy, then Security, then Foods. The product is named "Garri Ekiti", as the client writes it.
 * No descriptions, specifications or prices: none have been supplied.
 */
export const featuredSolutions: readonly FeaturedSolution[] = [
  { title: "Energy assessment and power audits", division: "energy", href: "/energy" },
  { title: "Solar system design", division: "energy", href: "/energy" },
  { title: "Battery storage", division: "energy", href: "/energy" },
  { title: "CCTV installation", division: "security", href: "/security" },
  { title: "Access control solutions", division: "security", href: "/security" },
  { title: "Remote monitoring solutions", division: "security", href: "/security" },
  { title: "Ofada rice", division: "foods", href: "/foods" },
  { title: "Garri Ekiti", division: "foods", href: "/foods" },
  { title: "Smoked fish", division: "foods", href: "/foods" },
];

export const divisionLabels: Record<DivisionId, string> = {
  energy: "BOOM Energy",
  security: "BOOM Security",
  foods: "BOOM Foods",
};

const divisionOrder: readonly DivisionId[] = ["energy", "security", "foods"];

/** The same items, grouped by category in the order above (numbering stays continuous across groups). */
export const featuredSolutionGroups: readonly FeaturedSolutionGroup[] = divisionOrder.map((division) => ({
  division,
  label: divisionLabels[division],
  start: featuredSolutions.findIndex((item) => item.division === division) + 1,
  items: featuredSolutions.filter((item) => item.division === division),
}));
