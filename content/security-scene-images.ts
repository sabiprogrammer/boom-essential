import type { IllustrativeImageBase } from "./illustrative-image";
import type { SecurityAudience } from "./security";

const dir = "/assets/images/security/illustrative";

const caption = "Illustrative image.";

/**
 * Scene pictures for BOOM Security: a typical home, shopfront and school gate with a camera, and a monitoring desk.
 * They are illustrations of the kind of property each section is about, not photographs of BOOM's own jobs: the
 * client has not supplied those, and these should be replaced by them when it does. They always show the
 * "Illustrative image" label (through `IllustrativePhoto`), are never used on `/projects`, and their alt text and
 * captions describe only what is visible and never claim the scene as BOOM's. Provenance is recorded in
 * `docs/asset-inventory.md` §10. Web copies of the originals: resized, re-encoded, no metadata.
 */
export const securitySceneImages = {
  residential: {
    src: `${dir}/residential-dome-camera.jpg`,
    alt: "A white dome CCTV camera fixed under the eave of a house, with a paved driveway, a black metal gate and a perimeter wall behind it in the evening sun.",
    caption,
    width: 1400,
    height: 788,
    position: "30% 40%",
  },
  commercial: {
    src: `${dir}/commercial-shopfront-cameras.jpg`,
    alt: "Two white bullet CCTV cameras mounted at the corners of a small shopfront with a roller shutter, on a street with low buildings and palm trees.",
    caption,
    width: 1400,
    height: 788,
    position: "65% 35%",
  },
  institutional: {
    src: `${dir}/institutional-solar-camera.jpg`,
    alt: "A CCTV camera on a steel pole with a solar panel above it, beside a black gate, with a compound of low buildings and trees behind it.",
    caption,
    width: 1400,
    height: 788,
    position: "65% 30%",
  },
  monitoring: {
    src: `${dir}/remote-monitoring-desk.jpg`,
    alt: "A person seen from behind at a desk, watching a wall of monitors that show camera views of a compound gate, driveway and walkways.",
    caption,
    width: 1400,
    height: 788,
    position: "50% 40%",
  },
} satisfies Record<string, IllustrativeImageBase>;

/** The picture shown with each audience row on the Security page. */
export const securityAudienceImages: Record<SecurityAudience["id"], IllustrativeImageBase> = {
  residential: securitySceneImages.residential,
  commercial: securitySceneImages.commercial,
  institutional: securitySceneImages.institutional,
};
