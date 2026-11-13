import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = new URL("../../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const read = (relative: string) => readFileSync(join(root, relative), "utf8");
const code = (relative: string) => read(relative).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

describe("transparent header that turns white on scroll", () => {
  it("the stylesheet is loaded and keeps white as the default, so an unmarked page is never unreadable", () => {
    assert.match(read("app/globals.css"), /@import "\.\/header\.css";/);
    const css = read("app/header.css");
    assert.match(css, /\.site-header \{\s*background-color: var\(--color-white\);/);
    // The transparent state needs a dark (or explicitly light-marked) FIRST section and an unscrolled page.
    assert.match(css, /:not\(\[data-scrolled="true"\]\)/);
    assert.match(css, /section:is\(\[data-surface="dark"\], \[data-header-top="light"\]\):first-of-type/);
  });

  it("the layout never shifts when the header changes state: the overlap does not depend on scrolling", () => {
    const css = read("app/header.css");
    const overlap = css.match(/\.site-header:has\([^{]*\) \{\s*margin-bottom:[^}]*\}/);
    assert.ok(overlap, "negative margin rule exists");
    assert.doesNotMatch(overlap[0], /data-scrolled/);
    assert.match(css, /height: var\(--header-height\);/, "the hero reserves the header's height");
  });

  it("the header carries the class the stylesheet targets and no hard-coded white background", () => {
    const header = code("components/layout/SiteHeader.tsx");
    assert.match(header, /site-header/);
    assert.match(header, /data-scrolled=\{scrolled\}/);
    // A bare `bg-white` class would beat the transparent state ("hover:bg-white/10" on the menu button is fine).
    assert.doesNotMatch(header, /[\s"]bg-white[\s"]/);
  });

  it("text and controls switch colour only over a dark hero, through the header-clear-dark variant", () => {
    for (const file of ["components/layout/BrandLogo.tsx", "components/layout/nav-styles.ts", "components/layout/SiteHeader.tsx"]) {
      assert.match(code(file), /header-clear-dark:/, file);
    }
    // Hover must stay readable on navy: never navy-on-navy.
    assert.match(code("components/layout/nav-styles.ts"), /header-clear-dark:hover:text-gold/);
  });

  it("every page that opens with a hero marks that hero, so the header knows what is behind it", () => {
    const dark = [
      "components/home/HeroSection.tsx",
      "components/about/AboutHero.tsx",
      "components/energy/EnergyHero.tsx",
      "components/security/SecurityHero.tsx",
      "components/industrial/IndustrialHero.tsx",
      "components/contact/ContactHero.tsx",
      "components/sections/PageHeader.tsx",
    ];
    for (const file of dark) assert.match(code(file), /data-surface="dark"/, file);
    assert.match(code("components/foods/FoodsHero.tsx"), /data-header-top="light"/);
  });

  it("the Foods hero's green panel starts below the header, so navigation is never on green", () => {
    assert.match(code("components/foods/FoodsHero.tsx"), /lg:top-\(--header-height\)/);
  });

  it("the full-bleed Energy hero photograph darkens its top edge for the white navigation", () => {
    assert.match(code("components/energy/EnergyHero.tsx"), /from-navy\/70 to-transparent/);
  });

  it("the mobile drawer is its own dark panel, independent of the header colour", () => {
    assert.match(code("components/layout/MobileDrawer.tsx"), /data-surface="dark"/);
  });
});
