export type LeadershipMember = {
  name: string;
  position: string;
};

/**
 * Confirmed management team (names and official positions only; biographies are not supplied).
 * Portraits live in boom-client-assets/leadership and are not used on the homepage
 * (see docs/asset-inventory.md for the photo-quality issues still to be resolved).
 */
export const leadership: readonly LeadershipMember[] = [
  { name: "Olarewaju Olawale Oba", position: "Chief Executive Officer" },
  { name: "Sijin Vijayan", position: "Chief Technical Adviser" },
  { name: "Ademola Olanrewaju", position: "Head, Global Partners & Expansion" },
  { name: "Abiola Favour", position: "Head of Human Resources" },
  { name: "Adeola Jejelowo", position: "Customer Experience Manager" },
];
