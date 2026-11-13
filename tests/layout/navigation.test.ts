import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = new URL("../../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const read = (relative: string) => readFileSync(join(root, relative), "utf8");
const code = (relative: string) => read(relative).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

describe("navigation is kept short (13 Nov 2026)", () => {
  it("Industrial Equipment is linked from the footer only, not the desktop header or the mobile menu", () => {
    assert.doesNotMatch(code("components/layout/DesktopNav.tsx"), /industrialLink|industrial-equipment/);
    assert.doesNotMatch(code("components/layout/MobileDrawer.tsx"), /industrialLink|industrial-equipment|Additional offering/);
    assert.match(code("components/layout/SiteFooter.tsx"), /industrialLink\.href/);
    assert.match(code("components/layout/SiteFooter.tsx"), /Additional offering/);
  });

  it("the header keeps the pages a visitor needs: Home, About Us, Our Divisions, Products, Projects, Contact Us", () => {
    const desktop = code("components/layout/DesktopNav.tsx");
    for (const link of ["homeLink", "aboutLink", "DivisionsMenu", "productsLink", "projectsLink", "contactLink"]) {
      assert.match(desktop, new RegExp(link), link);
    }
    const drawer = code("components/layout/MobileDrawer.tsx");
    for (const link of ["homeLink", "aboutLink", "divisionLinks", "productsLink", "projectsLink", "contactLink"]) {
      assert.match(drawer, new RegExp(link), link);
    }
  });

  it("Industrial Equipment is still reachable from the homepage section and the page itself is untouched", () => {
    assert.match(code("components/home/IndustrialEquipmentSection.tsx"), /href="\/industrial-equipment"/);
  });
});
