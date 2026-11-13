import type { IllustrativeImageBase } from "./illustrative-image";
import type { SecurityAudience } from "./security";

const dir = "/assets/images/security/illustrative";

/**
 * Scene pictures for BOOM Security: a typical home, shopfront and school gate with a camera, and a monitoring desk.
 * They are illustrations of the kind of property each section is about, not photographs of BOOM's own jobs: the
 * client has not supplied those, and these should be replaced by them when it does. They are shown through
 * `IllustrativePhoto` without a label (removed at Sabi Programmers' request, 2026-11-13), are never used on `/projects`,
 * and their alt text describes only what is visible and never claims the scene as BOOM's. Provenance is recorded in
 * `docs/asset-inventory.md` §10. Web copies of the originals: resized, re-encoded, no metadata.
 */
export const securitySceneImages = {
  residential: {
    src: `${dir}/residential-dome-camera.jpg`,
    alt: "A white dome CCTV camera fixed under the eave of a house, with a paved driveway, a black metal gate and a perimeter wall behind it in the evening sun.",
    width: 1400,
    height: 788,
    position: "30% 40%",
  },
  commercial: {
    src: `${dir}/commercial-shopfront-cameras.jpg`,
    alt: "Two white bullet CCTV cameras mounted at the corners of a small shopfront with a roller shutter, on a street with low buildings and palm trees.",
    width: 1400,
    height: 788,
    position: "65% 35%",
  },
  institutional: {
    src: `${dir}/institutional-solar-camera.jpg`,
    alt: "A CCTV camera on a steel pole with a solar panel above it, beside a black gate, with a compound of low buildings and trees behind it.",
    width: 1400,
    height: 788,
    position: "65% 30%",
  },
  monitoring: {
    src: `${dir}/remote-monitoring-desk.jpg`,
    alt: "A person seen from behind at a desk, watching a wall of monitors that show camera views of a compound gate, driveway and walkways.",
    width: 1400,
    height: 788,
    position: "50% 40%",
  },
  /** Security hero. */
  hero: {
    src: `${dir}/dome-camera-entrance-wide.jpg`,
    alt: "A white dome CCTV camera fixed under the roof overhang at the entrance of a house at sunset, with a paved driveway, a dark metal gate and a boundary wall behind it.",
    width: 1400,
    height: 788,
    position: "70% 40%",
  },
  /** "Cameras and recording equipment": a dome camera in use. */
  equipmentDome: {
    src: `${dir}/dome-camera-eave-gate.jpg`,
    alt: "A white dome CCTV camera on the underside of a roof overhang, with a house, a paved yard and a black metal gate in the background at dusk.",
    width: 1400,
    height: 788,
    position: "68% 40%",
  },
  /** "Cameras and recording equipment": monitoring the camera views. */
  equipmentMonitoring: {
    src: `${dir}/monitoring-wall-operator.jpg`,
    alt: "A person seen from behind at a desk in a dim control room, facing a large wall of monitors that show many camera views.",
    width: 1400,
    height: 788,
    position: "50% 35%",
  },
  /** Products catalogue: remote monitoring. */
  remoteMonitoring: {
    src: `${dir}/monitoring-room-night.jpg`,
    alt: "A person seen from behind at a desk in a dark room, watching six monitors that show camera views of a gated property at night.",
    width: 1400,
    height: 788,
    position: "50% 40%",
  },
  /** Security assessment (service 07): a gated property and its perimeter. */
  assessment: {
    src: `${dir}/gated-home-perimeter.jpg`,
    alt: "A modern house at dusk behind a boundary wall with wall lights and a line of fence wires along the top, with a dark sliding metal gate and a concrete driveway.",
    width: 1400,
    height: 788,
    position: "50% 50%",
  },
} satisfies Record<string, IllustrativeImageBase>;

/** The picture shown with each audience row on the Security page. */
export const securityAudienceImages: Record<SecurityAudience["id"], IllustrativeImageBase> = {
  residential: securitySceneImages.residential,
  commercial: securitySceneImages.commercial,
  institutional: securitySceneImages.institutional,
};
