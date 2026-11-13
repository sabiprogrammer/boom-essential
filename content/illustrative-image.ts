/**
 * What every ILLUSTRATIVE picture (a licensed stock photograph or a generated scene picture) carries. It is never a
 * photograph of BOOM work: never use one on the Projects page or as project evidence, and never write alt text that
 * claims it is BOOM's. It shows no visible label or disclaimer (removed at Sabi Programmers' request, 2026-11-13).
 */
export type IllustrativeImageBase = {
  src: string;
  /** Describes only what is visible. */
  alt: string;
  width: number;
  height: number;
  /** CSS object-position, to keep the subject in view when the frame crops the picture. */
  position?: string;
};

/** A licensed stock photograph. `source` records where it came from, for the licence record in `docs/asset-inventory.md`. */
export type IllustrativeImage = IllustrativeImageBase & {
  source: { photographer: string; site: "Unsplash" | "Pexels"; page: string; licence: string };
};
