import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { divisionImages } from "@/content/division-images";

const root = new URL("../../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const images = Object.values(divisionImages);

describe("homepage division pictures", () => {
  it("exist as files in public/", () => {
    assert.equal(images.length, 3);
    for (const image of images) assert.ok(existsSync(join(root, "public", image.src)), image.src);
  });

  it("show no visible label and carry no \"illustrative\" flag (removed at Sabi Programmers' request, 2026-11-13)", () => {
    for (const image of images) assert.ok(!("illustrative" in image), image.src);
    assert.ok(!existsSync(join(root, "components", "home", "IllustrativeLabel.tsx")));
  });

  it("have alt text that describes only what is visible: no provenance wording, no claim that it is BOOM's", () => {
    for (const image of images) {
      assert.doesNotMatch(image.alt, /\b(AI|generated|stock|rendered|illustration)\b/i, image.src);
      assert.doesNotMatch(image.alt, /\b(our|BOOM)\b/i, image.src);
      assert.ok(image.alt.length > 40, image.src);
    }
  });

  it("have file names that do not give away how they were made", () => {
    for (const image of images) assert.doesNotMatch(image.src, /(^|[-_/])ai([-_.]|$)|generated/i, image.src);
  });
});
