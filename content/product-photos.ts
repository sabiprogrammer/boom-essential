import type { SitePhoto } from "./site-photo";

const dir = "/assets/images/products";

/**
 * Client-supplied product photographs (received 10 Nov 2026, publication approved by Sabi Programmers).
 * The machine photos are crops of flyers: the flyer banner and the PRICE panels are cropped out. Prices must
 * never appear on the site. The camera is a product image on a white background, not a photograph of an
 * installation, and is labelled as a product image where it is shown.
 */
export const productPhotos = {
  ptzCamera: {
    src: `${dir}/solar-powered-ptz-camera.jpg`,
    alt: "A black solar-powered CCTV camera with a solar panel on top, three camera lenses with lights across the middle and a rotating camera head below.",
    caption: "Solar-powered CCTV camera.",
    width: 850,
    height: 1000,
  },
  streetLights: {
    src: `${dir}/solar-street-lights.jpg`,
    alt: "Several all-in-one solar street lights standing among stacked crates and boxes.",
    caption: "All-in-one solar street lights.",
    width: 872,
    height: 1080,
  },
  poundingMachine: {
    src: `${dir}/pounding-machine-engine-frame.jpg`,
    alt: "A pounding machine on a grey metal frame, with a round metal lid on top, a small petrol engine below it and a wheel at one end.",
    caption: "Pounding machine.",
    width: 576,
    height: 707,
  },
  poundingMachinesSmall: {
    src: `${dir}/pounding-machines-small.jpg`,
    alt: "Two smaller pounding machines side by side on a tiled floor: one in a maroon casing and one in a blue casing with a steel pot on top.",
    caption: "Smaller pounding machines.",
    width: 719,
    height: 548,
  },
} satisfies Record<string, SitePhoto>;
