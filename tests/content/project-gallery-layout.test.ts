import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { arrangeGallery, galleryRows } from "@/components/projects/gallery-layout";
import { projectGallery } from "@/content/project-photos";
import type { SitePhoto } from "@/content/site-photo";

const fake = (n: number): SitePhoto[] =>
  Array.from({ length: n }, (_, i) => ({ src: `/p${i}.jpg`, alt: "a", caption: "c", width: 100, height: 100 }));

describe("Projects gallery grid", () => {
  it("every designed row fills exactly twelve columns", () => {
    for (const row of galleryRows) {
      assert.equal(row.spans.reduce((a, b) => a + b, 0), 12);
      assert.ok(row.anchor >= 0 && row.anchor < row.spans.length);
      assert.match(row.aspect, /^\d+ \/ \d+$/);
    }
  });

  it("places every photograph exactly once, in order", () => {
    const tiles = arrangeGallery(projectGallery);
    assert.equal(tiles.length, projectGallery.length);
    assert.deepEqual(tiles.map((t) => t.index), projectGallery.map((_, i) => i));
    assert.deepEqual(tiles.map((t) => t.photo.src), projectGallery.map((p) => p.src));
  });

  it("gives each row one anchor and keeps rows to twelve columns for the real gallery", () => {
    const tiles = arrangeGallery(projectGallery);
    let cursor = 0;
    for (const row of galleryRows) {
      const rowTiles = tiles.slice(cursor, cursor + row.spans.length);
      assert.equal(rowTiles.filter((t) => t.anchor).length, 1);
      assert.equal(rowTiles.reduce((a, t) => a + t.span, 0), 12);
      assert.ok(rowTiles.every((t) => t.rowAspect === row.aspect));
      cursor += row.spans.length;
    }
  });

  it("makes the wide feature tile the first photograph", () => {
    const [first, second] = arrangeGallery(projectGallery);
    assert.equal(first.span, 8);
    assert.equal(first.anchor, true);
    assert.equal(second.span, 4);
    assert.equal(second.anchor, false);
  });

  it("copes with more photographs than rows (extra rows of three squares) and with fewer", () => {
    const many = arrangeGallery(fake(13));
    assert.equal(many.length, 13);
    assert.deepEqual(many.slice(8, 11).map((t) => t.span), [4, 4, 4]);
    assert.equal(many[8].anchor, true);
    assert.equal(many[8].rowAspect, "1 / 1");
    assert.equal(arrangeGallery(fake(1)).length, 1);
    assert.equal(arrangeGallery([]).length, 0);
  });
});
