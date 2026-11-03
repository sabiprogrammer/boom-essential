import type { DivisionId } from "./divisions";

/** Percentages of the visual panel to trim from each edge (removes artefacts baked into a source image). */
export type ImageTrim = { top?: number; right?: number; bottom?: number; left?: number };

export type DivisionImage = {
  src: string;
  /** Honest description of what the picture shows; illustrative images must not claim to be Boom's work. */
  alt: string;
  /** Intrinsic size of the file, needed to keep the aspect ratio for "band" images. */
  width: number;
  height: number;
  /** True for AI-generated or stock imagery: shows the "Illustrative image" label. Never omit for those. */
  illustrative: boolean;
  /**
   * "cover" fills the panel and crops (use `position` to choose what stays in view).
   * "band" shows the whole picture at its own aspect ratio, for panoramic files that cannot be cropped
   * to the panel without losing subjects; the generated field fills the rest of the panel.
   */
  fit: "cover" | "band";
  /** CSS object-position for "cover" images. */
  position?: string;
  trim?: ImageTrim;
};

/**
 * TEMPORARY illustrative images for the homepage division visuals (see `docs/asset-inventory.md`, §6).
 * All three are AI-generated. None shows a real BOOM installation, product, employee or project.
 * Replace each entry with an authentic client photograph (and `illustrative: false`) when supplied.
 * Never use these for leadership profiles, product specifications or project evidence.
 */
export const divisionImages: Partial<Record<DivisionId, DivisionImage>> = {
  energy: {
    src: "/assets/images/homepage/illustrative/01-boom-energy-solar-roof-illustrative.jpg",
    alt: "Illustration of solar panels on a house roof at sunset, with a wall-mounted inverter and a battery unit beside the porch. AI-generated, not a photograph of a BOOM installation.",
    width: 1672,
    height: 941,
    illustrative: true,
    fit: "cover",
    position: "72% 50%",
  },
  security: {
    src: "/assets/images/homepage/illustrative/02-boom-security-cctv-perimeter-illustrative.jpg",
    alt: "Illustration of a CCTV camera mounted on a house wall, with an electric perimeter fence and a metal gate behind it. AI-generated, not a photograph of a BOOM installation.",
    width: 844,
    height: 464,
    illustrative: true,
    fit: "cover",
    position: "82% 50%",
    // The source file has a sliver of a neighbouring panel along its left edge.
    trim: { left: 3 },
  },
  foods: {
    src: "/assets/images/homepage/illustrative/03-boom-foods-nigerian-staple-foods-illustrative.jpg",
    alt: "Illustration of Nigerian staple foods on sacking: smoked fish, a basket of yellow garri, bowls of rice and fufu powder, and cassava roots. AI-generated, not a photograph of BOOM products.",
    width: 1672,
    height: 467,
    illustrative: true,
    fit: "band",
    // The source file has a white strip along its top edge.
    trim: { top: 3 },
  },
};
