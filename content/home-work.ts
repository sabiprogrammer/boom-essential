import { projectPhotos } from "./project-photos";
import { projectsLink } from "./navigation";
import type { SitePhoto } from "./site-photo";

/**
 * The "Our work" band on the homepage: four of the client's own installation photographs, linking to the Projects
 * page. The wording repeats the Projects page header exactly; nothing is added (no names, places, dates, capacities
 * or counts). Photographs are the same authentic client photographs as on `/projects`.
 */
export const homeWork = {
  eyebrow: "Our work",
  heading: "Installations, in Photographs.",
  lead: "A selection of inverter and battery installations by Boom Multi Global.",
  cta: { label: "See all our projects", href: projectsLink.href },
  /** In reading order, with where the 4:5 frame should keep each picture's subject in view. */
  photos: [
    { photo: projectPhotos.controlPanel, position: "50% 40%" },
    { photo: projectPhotos.batteryRacks, position: "50% 50%" },
    { photo: projectPhotos.team, position: "30% 50%" },
    { photo: projectPhotos.inverterWall, position: "50% 40%" },
  ] satisfies { photo: SitePhoto; position: string }[],
} as const;
