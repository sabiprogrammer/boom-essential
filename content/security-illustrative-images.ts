import type { IllustrativeImage } from "./illustrative-image";

const dir = "/assets/images/security/illustrative";

/**
 * Stock photographs for BOOM Security (approved by Sabi Programmers 2026-11-10, Route C in
 * `docs/security-imagery-brief.md`). Both are cropped web copies with no metadata. They stand in for authentic
 * photographs of BOOM's own security work, which the client has not supplied: replace them when it does.
 */
export const securityIllustrativeImages = {
  perimeterFence: {
    src: `${dir}/perimeter-fence-illustrative.jpg`,
    alt: "Coils of razor wire on angled posts above a black welded-mesh fence panel, against a clear blue sky.",
    width: 1600,
    height: 1067,
    position: "50% 62%",
    source: {
      photographer: "Ben Marler",
      site: "Unsplash",
      page: "https://unsplash.com/photos/razor-wire-sits-atop-a-tall-protective-fence-wW5vKD8MJGA",
      licence: "Unsplash License",
    },
  },
  accessControl: {
    src: `${dir}/access-control-terminal-illustrative.jpg`,
    alt: "A wall-mounted keypad and fingerprint terminal with a lit screen beside a glass door, with a blurred office behind it.",
    width: 1600,
    height: 917,
    position: "32% 50%",
    source: {
      photographer: "panumas nikhomkhai",
      site: "Pexels",
      page: "https://www.pexels.com/photo/modern-fingerprint-access-control-system-37538043/",
      licence: "Pexels License",
    },
  },
} satisfies Record<string, IllustrativeImage>;
