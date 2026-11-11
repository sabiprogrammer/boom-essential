import type { SitePhoto } from "./site-photo";

const dir = "/assets/images/projects";

/**
 * Client-supplied photographs of Boom Multi Global inverter and battery installations (received 10 Nov 2026,
 * publication approved by Sabi Programmers). Each web copy is a crop of the original: the GPS address stamp,
 * phone watermarks, a logo overlay and phone screenshot chrome were cropped out. No locations, client names,
 * dates or capacities are given.
 */
export const projectPhotos = {
  controlPanel: {
    src: `${dir}/inverter-battery-and-control-panel.jpg`,
    alt: "A wall-mounted inverter and control panel above four floor-standing battery units, in a bright room with a marble floor.",
    caption: "Inverter, control panel and battery units.",
    width: 810,
    height: 921,
  },
  batteryRacks: {
    src: `${dir}/battery-storage-racks.jpg`,
    alt: "Three tall racks of rack-mounted battery modules joined by orange and red cables.",
    caption: "Rack-mounted battery storage.",
    width: 1080,
    height: 1080,
  },
  team: {
    src: `${dir}/inverter-battery-installation-team.jpg`,
    alt: "Five men standing beside five wall-mounted inverters and a row of floor-standing battery cabinets in a room with a barred window.",
    caption: "Wall-mounted inverters above a row of battery cabinets.",
    width: 1080,
    height: 810,
  },
  inverterRoom: {
    src: `${dir}/inverter-and-battery-room.jpg`,
    alt: "A long room with six wall-mounted inverters on one wall and rows of battery units along the floor.",
    caption: "A room of inverters and battery units.",
    width: 795,
    height: 1080,
  },
  inverterWall: {
    src: `${dir}/inverter-wall-installation.jpg`,
    alt: "Three wall-mounted inverters with protection boxes beneath them, fixed to a wall along a metal cable tray.",
    caption: "Three wall-mounted inverters with protection boxes.",
    width: 810,
    height: 850,
  },
  rackWithInverter: {
    src: `${dir}/battery-rack-with-inverter.jpg`,
    alt: "Two columns of rack-mounted battery modules with orange connectors, beside a wall-mounted inverter and a control box, in a dimly lit room.",
    caption: "Battery racks beside an inverter and control box.",
    width: 810,
    height: 770,
  },
  inverterUnits: {
    src: `${dir}/inverters-and-battery-units.jpg`,
    alt: "Three wall-mounted inverters above a row of protection boxes, with floor-standing battery units below them.",
    caption: "Wall-mounted inverters with floor-standing batteries.",
    width: 810,
    height: 1080,
  },
  wallPair: {
    src: `${dir}/wall-inverter-and-battery.jpg`,
    alt: "A wall-mounted inverter above a wall-mounted battery, with a charge controller and a distribution box beside them.",
    caption: "A wall-mounted inverter and battery.",
    width: 484,
    height: 644,
  },
} satisfies Record<string, SitePhoto>;

/**
 * The Projects page gallery, in reading order. The order matches the grid in `components/projects/gallery-layout.ts`:
 * the wide landscape photograph leads (it is the wide feature tile), then the best-lit shots, with the lowest-resolution
 * photograph last in the narrowest tile.
 */
export const projectGallery: readonly SitePhoto[] = [
  projectPhotos.team,
  projectPhotos.controlPanel,
  projectPhotos.batteryRacks,
  projectPhotos.inverterWall,
  projectPhotos.inverterRoom,
  projectPhotos.rackWithInverter,
  projectPhotos.inverterUnits,
  projectPhotos.wallPair,
];
