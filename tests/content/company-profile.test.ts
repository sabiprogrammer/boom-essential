import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { aboutContent } from "@/content/about";
import { closingTagline, companyProfile } from "@/content/company-profile";
import { energyContent } from "@/content/energy";

const root = new URL("../../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const read = (relative: string) => readFileSync(join(root, relative), "utf8");

function sourceFiles(dir: string, found: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) sourceFiles(path, found);
    else if (/\.(ts|tsx)$/.test(name)) found.push(path);
  }
  return found;
}

describe("client company profile (2026-11-21)", () => {
  it("states exactly five reasons under 'Why Boom?'", () => {
    assert.equal(companyProfile.why.items.length, 5);
    assert.match(companyProfile.why.eyebrow, /Why Boom/);
  });

  it("states the partnership as three manufacturers in China and the United States of America, naming no brand", () => {
    const { text } = companyProfile.partnership;
    assert.match(text, /three major renowned solar manufacturers in China and the United States of America/);
  });

  it("closes with the client's three-part line", () => {
    assert.equal(closingTagline, "Powering Nigeria. Feeding Nigeria. Securing Nigeria.");
  });

  it("states the nationwide presence and the 24/7 sales agents", () => {
    assert.match(companyProfile.presence.agents, /24\/7 nationwide/);
    assert.ok(companyProfile.presence.points.some((p) => /all States in Nigeria and other West Africa markets/.test(p)));
  });

  it("keeps the head office in Akure: no United Arab Emirates base, no 'foremost', no 'entire country' claim", () => {
    const files = ["app", "components", "content"].flatMap((dir) => sourceFiles(join(root, dir)));
    // The comment in company-profile.ts lists what is deliberately NOT used, so it is excluded.
    const offenders = files.filter((file) => {
      if (file.replaceAll("\\", "/").endsWith("content/company-profile.ts")) return false;
      return /United Arab Emirates|\bUAE\b|foremost|entire country/i.test(readFileSync(file, "utf8"));
    });
    assert.deepEqual(offenders, []);
  });

  it("puts 1.2KVA as the only capacity figure on the Energy page", () => {
    const text = JSON.stringify(energyContent.capacity);
    assert.match(text, /1\.2KVA/);
    assert.deepEqual(text.match(/\d+(\.\d+)?\s?(KVA|kW|kWh|MW)/gi), ["1.2KVA"]);
  });

  it("no longer describes the pounding machines as food-processing equipment on About", () => {
    assert.doesNotMatch(aboutContent.divisions.industrial.text, /food-processing/i);
    assert.match(aboutContent.divisions.industrial.text, /restaurant business/);
  });

  it("is shown on the pages: Why Boom on Home and About, presence on About, capacity on Energy", () => {
    assert.match(read("app/(site)/page.tsx"), /<WhyBoomSection/);
    assert.match(read("app/(site)/about/page.tsx"), /<WhyBoomSection/);
    assert.match(read("app/(site)/about/page.tsx"), /<PresenceSection/);
    assert.match(read("app/(site)/energy/page.tsx"), /<CapacitySection/);
    assert.match(read("components/home/ClosingContactSection.tsx"), /closingTagline/);
  });
});
