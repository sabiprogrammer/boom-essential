/**
 * What every ILLUSTRATIVE picture carries, whether it is a licensed stock photograph or another illustration. It is
 * never a photograph of BOOM work, so it always shows the "Illustrative image" label (see `IllustrativePhoto`). Never
 * use one on the Projects page, as project evidence, or with alt text or a caption that claims it is BOOM's.
 */
export type IllustrativeImageBase = {
  src: string;
  /** Describes only what is visible. Stock photographs also say so and that they are not a BOOM installation. */
  alt: string;
  /** Short line shown under the picture where there is room for one. */
  caption: string;
  width: number;
  height: number;
  /** CSS object-position, to keep the subject in view when the frame crops the picture. */
  position?: string;
};

/** A licensed stock photograph. `source` records where it came from, for the licence record in `docs/asset-inventory.md`. */
export type IllustrativeImage = IllustrativeImageBase & {
  source: { photographer: string; site: "Unsplash" | "Pexels"; page: string; licence: string };
};
