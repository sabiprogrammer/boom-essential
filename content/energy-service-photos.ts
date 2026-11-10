import { projectPhotos } from "./project-photos";
import type { SitePhoto } from "./site-photo";

/**
 * Which client photograph illustrates which Energy service (keyed by the service number in `energy.ts`). Only
 * services a photograph genuinely shows are listed: there is no photograph of solar panels, so installation is
 * shown by a complete inverter-and-battery system, and the remaining services keep their drawings and icons.
 */
export const energyServicePhotos: Readonly<Record<string, SitePhoto>> = {
  "03": projectPhotos.controlPanel,
  "04": projectPhotos.inverterWall,
  "05": projectPhotos.batteryRacks,
};
