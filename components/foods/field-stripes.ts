import type { CSSProperties } from "react";

/**
 * Diagonal field-row stripes, as in the BOOM Foods logo and the homepage Foods panel. Apply to an element
 * that already has an Agricultural Green background. `alpha` is the stripe opacity (0 to 1).
 */
export function fieldStripes(alpha = 0.12): CSSProperties {
  return {
    backgroundImage: `repeating-linear-gradient(104deg, rgb(255 255 255 / ${alpha}) 0 2px, transparent 2px 2rem)`,
  };
}
