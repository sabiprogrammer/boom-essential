import type { DivisionId } from "./divisions";

/** Percentages of the visual panel to trim from each edge (removes artefacts baked into a source image). */
export type ImageTrim = { top?: number; right?: number; bottom?: number; left?: number };

export type DivisionImage = {
  src: string;
  /** Describes only what is visible. It never states how the picture was made and never claims it is Boom's work. */
  alt: string;
  /** Intrinsic size of the file, needed to keep the aspect ratio for "band" images. */
  width: number;
  height: number;
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
 * All three are illustrations (see `docs/asset-inventory.md` §4a). None shows a real BOOM installation, product, employee or project.
 * Replace each entry with an authentic client photograph when supplied.
 * Never use these for leadership profiles, product specifications or project evidence.
 */
export const divisionImages: Partial<Record<DivisionId, DivisionImage>> = {
  energy: {
    src: "/assets/images/homepage/illustrative/01-boom-energy-solar-roof-illustrative.jpg",
    alt: "Solar panels on a house roof at sunset, with a wall-mounted inverter and a battery unit beside the porch.",
    width: 1672,
    height: 941,
    fit: "cover",
    position: "72% 50%",
  },
  security: {
    src: "/assets/images/homepage/illustrative/02-boom-security-cctv-perimeter-illustrative.jpg",
    alt: "A CCTV camera mounted on a house wall, with an electric perimeter fence and a metal gate behind it.",
    width: 844,
    height: 464,
    fit: "cover",
    position: "82% 50%",
    // The source file has a sliver of a neighbouring panel along its left edge.
    trim: { left: 3 },
  },
  foods: {
    src: "/assets/images/homepage/illustrative/03-boom-foods-nigerian-staple-foods-illustrative.jpg",
    alt: "Nigerian staple foods on sacking: smoked fish, a basket of yellow garri, bowls of rice and fufu powder, and cassava roots.",
    width: 1672,
    height: 467,
    fit: "band",
    // The source file has a white strip along its top edge.
    trim: { top: 3 },
  },
};
