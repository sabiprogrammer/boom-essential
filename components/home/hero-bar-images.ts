import { divisionImages } from "@/content/division-images";
import type { DivisionId } from "@/content/divisions";
import { projectPhotos } from "@/content/project-photos";
import { securitySceneImages } from "@/content/security-scene-images";

/**
 * The picture inside each hero bar. Energy is one of the client's own installation photographs (so it carries no
 * label); Security and Foods are illustrative pictures and always show the "Illustrative image" label.
 * The bars are links with their own accessible name, so the pictures are decorative there.
 */
export const heroBarImages: Record<DivisionId, { src: string; position: string; illustrative: boolean }> = {
  energy: { src: projectPhotos.controlPanel.src, position: "50% 35%", illustrative: false },
  security: { src: securitySceneImages.equipmentDome.src, position: "68% 40%", illustrative: true },
  foods: { src: divisionImages.foods?.src ?? "", position: "79% 50%", illustrative: true },
};
