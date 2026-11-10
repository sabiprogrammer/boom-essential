import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { divisions } from "@/content/divisions";
import { featuredSolutionGroups, featuredSolutions } from "@/content/featured-solutions";
import { foodProducts } from "@/content/foods";
import { productPhotos } from "@/content/product-photos";
import { catalogueSections } from "@/content/product-catalogue";
import { projectGallery, projectPhotos } from "@/content/project-photos";
import { industrialContent } from "@/content/industrial-equipment";
import { parseEnquiryPrefill } from "@/lib/enquiry/prefill";

const root = new URL("../../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

function sourceFiles(dir: string, found: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) sourceFiles(path, found);
    else if (/\.(ts|tsx)$/.test(name)) found.push(path);
  }
  return found;
}

describe("client correction: featured solutions are arranged by category", () => {
  it("lists Energy, then Security, then Foods, three each", () => {
    assert.deepEqual(featuredSolutionGroups.map((g) => g.division), ["energy", "security", "foods"]);
    assert.deepEqual(featuredSolutionGroups.map((g) => g.items.length), [3, 3, 3]);
    assert.equal(featuredSolutions.length, 9);
  });

  it("keeps each group together and numbers straight through (1, 4, 7)", () => {
    assert.deepEqual(featuredSolutionGroups.map((g) => g.start), [1, 4, 7]);
    const order = featuredSolutions.map((item) => item.division);
    assert.deepEqual(order, ["energy", "energy", "energy", "security", "security", "security", "foods", "foods", "foods"]);
  });

  it("calls the product Garri Ekiti, never Ekiti Garri", () => {
    assert.ok(featuredSolutions.some((item) => item.title === "Garri Ekiti"));
    assert.ok(foodProducts.some((p) => p.name === "Garri Ekiti" && p.slug === "ekiti-garri"), "slug stays stable");
    assert.ok(divisions.find((d) => d.id === "foods")?.highlights.some((h) => h.includes("Garri Ekiti")));
  });
});

describe("client correction: wording across the site source", () => {
  const files = ["app", "components", "content"].flatMap((dir) => sourceFiles(join(root, dir)));

  it("scans the whole site source (so the checks below cannot pass by finding nothing)", () => {
    assert.ok(files.length > 100, `only ${files.length} files scanned`);
    const normalised = files.map((file) => file.replaceAll("\\", "/"));
    assert.ok(normalised.some((file) => file.endsWith("content/about.ts")));
    assert.ok(normalised.some((file) => file.endsWith("components/layout/SiteFooter.tsx")));
  });

  it("never writes Ekiti garri / Ekiti Garri in site copy", () => {
    const hits = files.filter((file) => /ekiti garri/i.test(readFileSync(file, "utf8")));
    assert.deepEqual(hits, []);
  });

  it("never writes the short brand name in capitals (the legal name constant is the only exception)", () => {
    const offenders: string[] = [];
    for (const file of files) {
      readFileSync(file, "utf8").split("\n").forEach((line, index) => {
        if (/BOOM MULTI GLOBAL(?! COMPANY LIMITED)/.test(line)) offenders.push(`${file}:${index + 1}`);
      });
    }
    // The drawer header sets the two-line wordmark "BOOM / MULTI GLOBAL" as separate text nodes, so it never matches.
    assert.deepEqual(offenders, []);
  });

  it("describes the company as having its head office in Akure", () => {
    const about = readFileSync(join(root, "content/about.ts"), "utf8");
    assert.match(about, /with its head office in Akure, Ondo State/);
    assert.doesNotMatch(about, /based in Akure/);
  });
});

describe("new client photographs", () => {
  const photos = [...Object.values(projectPhotos), ...Object.values(productPhotos)];

  it("exist as files in public/", () => {
    for (const photo of photos) assert.ok(existsSync(join(root, "public", photo.src)), photo.src);
  });

  it("have alt text and captions that name no brand, place, date or price", () => {
    const forbidden = /(srne|luxsun|gospower|felicity|deye|tecno|ikeja|lagos|oduduwa|gps|₦|naira|price|\b20\d\d\b)/i;
    for (const photo of photos) {
      assert.doesNotMatch(photo.alt, forbidden, photo.src);
      assert.doesNotMatch(photo.caption, forbidden, photo.src);
      assert.ok(photo.alt.length > 30, `${photo.src} needs a real description`);
    }
  });

  it("give the Projects gallery eight installation photographs and no product shots", () => {
    assert.equal(projectGallery.length, 8);
    assert.ok(projectGallery.every((photo) => photo.src.includes("/projects/")));
  });

  it("set the Industrial hero to the client's own machine photograph", () => {
    assert.equal(industrialContent.productImage?.src, productPhotos.poundingMachinesSmall.src);
  });
});

describe("Products catalogue", () => {
  const items = catalogueSections.flatMap((section) => section.items);

  it("covers the three divisions and Industrial Equipment, in that order", () => {
    assert.deepEqual(catalogueSections.map((s) => s.id), ["energy", "security", "foods", "industrial"]);
  });

  it("lists every food product", () => {
    const foods = catalogueSections.find((s) => s.id === "foods");
    assert.equal(foods?.items.length, foodProducts.length);
  });

  it("shows no prices anywhere", () => {
    // Section copy (headings, leads) and every entry's name and description. The page header's note that prices are
    // not listed is allowed to say "prices", so only entry and section text is checked here.
    const money = /(₦|naira|\bprices?\b|\bcost\b|\bNGN\b|\d{1,3},\d{3})/i;
    for (const section of catalogueSections) {
      assert.doesNotMatch(`${section.heading} ${section.lead}`, money, section.id);
    }
    for (const item of items) {
      assert.doesNotMatch(`${item.name} ${item.description ?? ""}`, money, item.slug);
    }
  });

  it("links every entry to an enquiry the Contact page accepts", () => {
    for (const item of items) {
      const url = new URL(item.enquiryHref, "https://example.test");
      assert.equal(url.pathname, "/contact", item.slug);
      const prefill = parseEnquiryPrefill(url.searchParams);
      assert.equal(prefill.prefilled, true, `${item.slug} does not select a category`);
      const names = url.searchParams.has("product") || url.searchParams.has("service");
      if (names) assert.equal(prefill.interests.length, 1, `${item.slug} names an interest the form does not know`);
    }
  });

  it("labels every drawing as illustrative by giving each non-photograph a drawing id", () => {
    for (const item of items) {
      if (item.visual?.kind === "drawing") assert.ok(["recorder", "fence", "access", "signal"].includes(item.visual.drawing));
    }
  });

  it("says Industrial Equipment is an additional offering, not a division", () => {
    const industrial = catalogueSections.find((s) => s.id === "industrial");
    assert.match(industrial?.lead ?? "", /additional offering/);
    for (const item of industrial?.items ?? []) {
      assert.match(item.enquiryHref, /offering=industrial-equipment/);
      assert.doesNotMatch(item.enquiryHref, /division=/, "Industrial Equipment must never use division=");
    }
  });
});
