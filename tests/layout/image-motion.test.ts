import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = new URL("../../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const read = (relative: string) => readFileSync(join(root, relative), "utf8");
const code = (relative: string) => read(relative).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

function files(dir: string): string[] {
  return readdirSync(join(root, dir)).flatMap((name) => {
    const relative = `${dir}/${name}`;
    if (statSync(join(root, relative)).isDirectory()) return files(relative);
    return /\.(ts|tsx)$/.test(name) ? [relative] : [];
  });
}

describe("picture motion: scroll, hover and click (CSS only)", () => {
  it("the stylesheets are loaded", () => {
    const globals = read("app/globals.css");
    assert.match(globals, /@import "\.\/image-motion\.css";/);
    assert.match(globals, /@import "\.\/lightbox\.css";/);
  });

  it("every effect respects prefers-reduced-motion, and hover effects need a hover-capable device", () => {
    const css = code("app/image-motion.css");
    assert.match(css, /@media \(prefers-reduced-motion: no-preference\)/);
    assert.match(css, /@media \(hover: hover\)/);
    assert.match(css, /@supports \(animation-timeline: view\(\)\)/, "scroll reveal is progressive enhancement");
    // The animations that ARE outside the media query are static declarations only (no animation or transition).
    const outside = css.replace(/@media \(prefers-reduced-motion: no-preference\) \{[\s\S]*\n\}\n?$/, "");
    assert.doesNotMatch(outside.replace(/@keyframes[\s\S]*?\n\}\n/g, ""), /animation:|transition:/);
    assert.match(code("app/lightbox.css"), /@media \(prefers-reduced-motion: no-preference\)/);
  });

  it("scroll reveal and hover use different properties, so they compose instead of fighting", () => {
    const css = code("app/image-motion.css");
    assert.match(css, /@keyframes pic-settle \{[^}]*scale:/);
    assert.match(css, /transform: scale\(1\.06\)/);
  });

  it("the lightbox is a native, keyboard-friendly dialog that loads the large image only when opened", () => {
    const source = code("components/ui/PhotoLightbox.tsx");
    assert.match(source, /^"use client";/m);
    assert.match(source, /<dialog/);
    assert.match(source, /showModal\(\)/);
    assert.match(source, /aria-label=\{`Enlarge photograph/);
    assert.match(source, /Close enlarged photograph/);
    assert.match(source, /\{open \? \(/, "the large image is rendered only while open");
  });

  it("only the client's real photographs can be enlarged: never the generated or stock pictures", () => {
    const users = files("components").concat(files("app")).filter((file) => /PhotoLightbox/.test(code(file)) && !file.endsWith("PhotoLightbox.tsx"));
    assert.deepEqual(
      users.sort(),
      [
        "components/energy/ServicePhoto.tsx",
        "components/home/IndustrialEquipmentSection.tsx",
        "components/projects/ProjectTile.tsx",
        "components/ui/PhotoFigure.tsx",
      ],
    );
    assert.doesNotMatch(code("components/ui/IllustrativePhoto.tsx"), /PhotoLightbox/);
    for (const file of files("components/security")) assert.doesNotMatch(code(file), /PhotoLightbox/, file);
  });

  it("pictures opt in with data-pic; illustrative pictures get the scroll and hover motion, not the lightbox", () => {
    assert.match(code("components/ui/IllustrativePhoto.tsx"), /data-pic/);
    assert.match(code("components/ui/PhotoFigure.tsx"), /data-pic/);
    assert.match(code("components/projects/ProjectTile.tsx"), /data-pic/);
  });
});

describe("no 'Illustrative image' label anywhere (removed at Sabi Programmers' request, 2026-11-13)", () => {
  it("no component or content file renders the words or the label component", () => {
    for (const file of [...files("components"), ...files("content"), ...files("app")]) {
      const source = code(file);
      assert.doesNotMatch(source, /Illustrative image/i, file);
      assert.doesNotMatch(source, /IllustrativeLabel/, file);
    }
  });

  it("no 'not a BOOM installation / Not Boom projects' disclaimer is shown or read aloud anywhere (removed 2026-11-13)", () => {
    for (const file of [...files("components"), ...files("content"), ...files("app")]) {
      const text = read(file)
        .split("\n")
        .filter((line) => !/^\s*(\/\/|\*|\/\*)/.test(line)) // comments may still explain the rule
        .join("\n");
      assert.doesNotMatch(text, /not an? BOOM (installation|project|product|machine)|Not Boom projects|stock photograph, not/i, file);
    }
  });

  it("illustrative pictures still never claim to be BOOM's work in their alt text", () => {
    const source = code("content/security-scene-images.ts");
    assert.doesNotMatch(source, /alt: "[^"]*\b(our|BOOM)\b/i);
  });
});
