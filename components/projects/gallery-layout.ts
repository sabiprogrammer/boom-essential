import type { SitePhoto } from "@/content/site-photo";

/**
 * The Projects gallery grid, from lg up: a 12-column grid read left to right, row by row. Each row names how many
 * columns every tile spans (they add up to 12) and which tile "anchors" the row: the anchor has a fixed aspect
 * ratio, and the other tiles in the row stretch to the same height, so every row has a clean top and bottom edge.
 * Below lg the grid collapses (one column, then two); see `ProjectTile`.
 */
export type TileSpan = 3 | 4 | 5 | 6 | 8 | 12;

export type GalleryRow = {
  spans: readonly TileSpan[];
  /** Index (within the row) of the tile whose aspect ratio sets the row height. */
  anchor: number;
  /** CSS aspect-ratio of the anchor tile. The others are cropped to fit the height it sets. */
  aspect: string;
};

/**
 * Rows in order: a wide feature with one taller neighbour, three even squares, then a wide, a medium and a narrow
 * tile. The widths are chosen so the photographs' own proportions need little cropping.
 */
export const galleryRows: readonly GalleryRow[] = [
  { spans: [8, 4], anchor: 0, aspect: "4 / 3" },
  { spans: [4, 4, 4], anchor: 0, aspect: "1 / 1" },
  { spans: [5, 4, 3], anchor: 0, aspect: "5 / 4" },
];

/** Any photographs beyond the rows above go in further rows of three even squares. */
const overflowRow: GalleryRow = { spans: [4, 4, 4], anchor: 0, aspect: "1 / 1" };

export type GalleryTile = {
  photo: SitePhoto;
  /** Position in the gallery, from 0. The tile's number is index + 1. */
  index: number;
  span: TileSpan;
  anchor: boolean;
  /** Aspect ratio of the row this tile is in (the anchor's own). */
  rowAspect: string;
};

/** Deals the photographs, in order, into the rows. Pure: the same photographs always make the same layout. */
export function arrangeGallery(photos: readonly SitePhoto[]): GalleryTile[] {
  const tiles: GalleryTile[] = [];
  let row = 0;
  let placed = 0;

  while (placed < photos.length) {
    const spec = galleryRows[row] ?? overflowRow;
    for (let slot = 0; slot < spec.spans.length && placed < photos.length; slot += 1) {
      tiles.push({
        photo: photos[placed],
        index: placed,
        span: spec.spans[slot],
        anchor: slot === spec.anchor,
        rowAspect: spec.aspect,
      });
      placed += 1;
    }
    row += 1;
  }

  return tiles;
}
