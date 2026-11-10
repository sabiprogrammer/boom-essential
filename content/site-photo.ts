/**
 * An authentic photograph supplied by the client. Web copies live in `public/assets/images/` (cropped from the
 * originals in `boom-client-assets/new_from_client/`, which are never edited). `alt` describes only what is
 * visible; `caption` is a short factual line. Never add locations, client names, dates, capacities or brands
 * to either: none have been confirmed for publication.
 */
export type SitePhoto = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};
