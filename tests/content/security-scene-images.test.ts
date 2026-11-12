import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { productPhotos } from "@/content/product-photos";
import { projectGallery, projectPhotos } from "@/content/project-photos";
import { securityAudiences } from "@/content/security";
import { securityAudienceImages, securitySceneImages } from "@/content/security-scene-images";

const root = new URL("../../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const images = Object.values(securitySceneImages);

describe("scene pictures used as illustrations (Security)", () => {
  it("exist as real JPEG files (not another format with a .jpg name) in public/", () => {
    for (const image of images) {
      const file = join(root, "public", image.src);
      assert.ok(existsSync(file), image.src);
      const bytes = readFileSync(file);
      assert.deepEqual([...bytes.subarray(0, 3)], [0xff, 0xd8, 0xff], `${image.src} is not a JPEG`);
    }
  });

  it("describe only what is visible: no provenance wording and no claim that the scene is BOOM's", () => {
    for (const image of images) {
      assert.doesNotMatch(image.alt, /\b(AI|generated|stock|rendered)\b/i, image.src);
      assert.doesNotMatch(`${image.alt} ${image.caption}`, /\b(our|BOOM)\b/i, image.src);
      assert.ok(image.alt.length > 40, image.src);
      assert.equal(image.caption, "Illustrative image.");
    }
  });

  it("have file names that do not give away how they were made", () => {
    for (const image of images) assert.doesNotMatch(image.src, /(^|[-_/])ai([-_.]|$)|generated/i, image.src);
  });

  it("name no brand, place, date or price", () => {
    const forbidden = /(dahua|hikvision|zkteco|srne|luxsun|felicity|ikeja|lagos|akure|nigeria|₦|price|\b20\d\d\b)/i;
    for (const image of images) {
      assert.doesNotMatch(image.alt, forbidden, image.src);
      assert.doesNotMatch(image.caption, forbidden, image.src);
    }
  });

  it("show one picture per audience, each different", () => {
    assert.deepEqual(Object.keys(securityAudienceImages).sort(), securityAudiences.map((a) => a.id).sort());
    const sources = Object.values(securityAudienceImages).map((image) => image.src);
    assert.equal(new Set(sources).size, sources.length);
  });

  it("are not the client's own photographs and are never imported by the Projects page", () => {
    const own = [...projectGallery, ...Object.values(projectPhotos), ...Object.values(productPhotos)].map((photo) => photo.src);
    for (const image of images) assert.ok(!own.includes(image.src), image.src);

    const dir = join(root, "components", "projects");
    for (const name of readdirSync(dir)) {
      assert.doesNotMatch(readFileSync(join(dir, name), "utf8"), /security-scene-images|IllustrativePhoto/, name);
    }
    assert.doesNotMatch(readFileSync(join(root, "content", "project-photos.ts"), "utf8"), /security-scene-images/);
  });
});
