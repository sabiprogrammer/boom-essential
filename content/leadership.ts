/**
 * A proportional (4:5) crop box in the source image's own pixels: top-left corner and width; the height
 * follows from the ratio. Cropping only. Originals are never edited, retouched or recoloured.
 */
export type PortraitCrop = { x: number; y: number; width: number };

export type Portrait = {
  src: string;
  /** Intrinsic size of the file (needed to place the crop box). */
  width: number;
  height: number;
  crop: PortraitCrop;
};

export type LeadershipMember = {
  name: string;
  position: string;
  portrait: Portrait;
  /**
   * Biography. NOT SUPPLIED: leave undefined. Never invent one. When it exists it renders beside or
   * below the name without any layout change.
   */
  bio?: string;
};

/**
 * Confirmed management team, in the client's order. Portraits are byte-identical copies of the files in
 * boom-client-assets/leadership (see docs/asset-inventory.md for the quality notes behind each crop).
 */
export const leadership: readonly LeadershipMember[] = [
  {
    name: "Olarewaju Olawale Oba",
    position: "Chief Executive Officer",
    // 413×531: low resolution, so the page never shows it larger than about 320px wide.
    portrait: {
      src: "/assets/images/leadership/01-ceo-olarewaju-olawale-oba.jpeg",
      width: 413,
      height: 531,
      crop: { x: 0, y: 0, width: 413 },
    },
  },
  {
    name: "Sijin Vijayan",
    position: "Chief Technical Adviser",
    // Casual photo with a black bar along the top edge and a video mute icon at the bottom right. The
    // crop box (x 80–980, y 40–1165) frames head and shoulders, so both fall outside it. Nothing is retouched.
    portrait: {
      src: "/assets/images/leadership/02-chief-technical-adviser-sijin-vijayan.jpeg",
      width: 1080,
      height: 1421,
      crop: { x: 80, y: 40, width: 900 },
    },
  },
  {
    name: "Ademola Olanrewaju",
    position: "Head, Global Partners & Expansion",
    portrait: {
      src: "/assets/images/leadership/03-head-global-partners-expansion-ademola-olanrewaju.jpeg",
      width: 1080,
      height: 1080,
      crop: { x: 130, y: 0, width: 864 },
    },
  },
  {
    name: "Abiola Favour",
    position: "Head of Human Resources",
    portrait: {
      src: "/assets/images/leadership/04-head-human-resources-abiola-favour.jpeg",
      width: 688,
      height: 904,
      crop: { x: 0, y: 0, width: 688 },
    },
  },
  {
    name: "Adeola Jejelowo",
    position: "Customer Experience Manager",
    portrait: {
      src: "/assets/images/leadership/05-customer-experience-manager-adeola-jejelowo.jpeg",
      width: 1080,
      height: 1044,
      crop: { x: 122, y: 0, width: 835 },
    },
  },
];
