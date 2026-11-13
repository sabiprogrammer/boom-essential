import { divisionImages } from "@/content/division-images";
import type { DivisionId } from "@/content/divisions";
import { projectPhotos } from "@/content/project-photos";
import { securitySceneImages } from "@/content/security-scene-images";

/**
 * The picture inside each hero bar. Energy is one of the client's own installation photographs; Security and Foods are
 * illustrative pictures (never to be described as BOOM's work). The bars are links with their own accessible name, so the
 * pictures are decorative there.
 *
 * `sizes` is the width the picture is actually DRAWN at, not the bar's width: `object-cover` scales the whole picture up
 * until it fills the bar's height, so a wide picture in a narrow bar is drawn several times wider than the bar. Asking
 * for the bar's width would fetch a tiny file and stretch it (blurry).
 */
export const heroBarImages: Record<DivisionId, { src: string; position: string; sizes: string }> = {
  energy: { src: projectPhotos.controlPanel.src, position: "50% 35%", sizes: "(min-width: 1024px) 30vw, 60vw" },
  security: { src: securitySceneImages.equipmentDome.src, position: "68% 40%", sizes: "(min-width: 1024px) 45vw, 100vw" },
  foods: { src: divisionImages.foods?.src ?? "", position: "79% 50%", sizes: "(min-width: 1024px) 140vw, 280vw" },
};
