/**
 * A licensed stock photograph used as an ILLUSTRATION. It is never a photograph of BOOM work, so it always
 * shows the "Illustrative image" label and its alt text says it is a stock photograph and not a BOOM installation.
 * Never use one on the Projects page, as project evidence, or with a caption that claims it is BOOM's.
 * `source` records where it came from, for the licence record in `docs/asset-inventory.md`.
 */
export type IllustrativeImage = {
  src: string;
  /** Describes only what is visible, and says it is a stock photograph and not a BOOM installation. */
  alt: string;
  /** Short line shown under the picture where there is room for one. */
  caption: string;
  width: number;
  height: number;
  /** CSS object-position, to keep the subject in view when the frame crops the picture. */
  position?: string;
  source: { photographer: string; site: "Unsplash" | "Pexels"; page: string; licence: string };
};
