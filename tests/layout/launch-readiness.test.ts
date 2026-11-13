import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { company } from "@/content/company";
import { foodsContent } from "@/content/foods";

/**
 * Launch guards: things that must stay true on the live site. They are static checks over the source (they do not start
 * a server), written so that a future change that quietly undoes a launch decision fails a test instead of reaching customers.
 */

const root = new URL("../../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const read = (relative: string) => readFileSync(join(root, relative), "utf8");
const code = (relative: string) => read(relative).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

/** Every page.tsx under app/(site), as the public path it serves. */
function sitePages(dir = "app/(site)"): string[] {
  return readdirSync(join(root, dir)).flatMap((name) => {
    const relative = `${dir}/${name}`;
    if (statSync(join(root, relative)).isDirectory()) return sitePages(relative);
    if (name !== "page.tsx") return [];
    const route = relative.replace("app/(site)", "").replace(/\/page\.tsx$/, "");
    return [route === "" ? "/" : route];
  });
}

describe("content: nothing is claimed that the client has not confirmed", () => {
  it("the Foods hero makes no claim about where the products come from", () => {
    const statement = foodsContent.hero.statement;
    assert.doesNotMatch(statement, /farm|grow|harvest|source|origin|local|imported|organic|fresh|trusted/i);
    assert.equal(statement, "Household staples, smoked fish and frozen chicken for your table.");
  });

  it("no public page content states that BOOM operates farms or is supplied from them", () => {
    for (const file of ["content/foods.ts", "content/divisions.ts", "content/product-catalogue.ts", "content/about.ts", "content/company.ts"]) {
      assert.doesNotMatch(code(file), /from our farms|our farms|trusted sources/i, file);
    }
  });
});

describe("SEO: robots.txt and the sitemap", () => {
  it("robots.txt allows the public site and keeps crawlers out of the admin area and the API", () => {
    const source = code("app/robots.ts");
    assert.match(source, /allow: "\/"/);
    for (const hidden of ["/admin", "/api/"]) assert.ok(source.includes(`"${hidden}"`), hidden);
    assert.doesNotMatch(source, /dashboard-preview/, "the demo route no longer exists, so robots.txt no longer mentions it");
    assert.match(source, /sitemap: `https:\/\/\$\{company\.website\}\/sitemap\.xml`/);
  });

  it("the sitemap lists every public page and nothing private", () => {
    const listed = [...code("app/sitemap.ts").matchAll(/path: "([^"]*)"/g)].map((m) => m[1] || "/");
    assert.deepEqual([...listed].sort(), sitePages().sort(), "the sitemap and the pages under app/(site) must match exactly");
    for (const path of listed) assert.doesNotMatch(path, /admin|api|dashboard/);
    assert.doesNotMatch(code("app/sitemap.ts"), /new Date|Date\.now/, "no clock reads in a prerendered file");
  });

  it("the canonical host is the www address the domain redirects to", () => {
    assert.equal(company.website, "www.boomessential.com");
  });
});

describe("hardening: security headers", () => {
  const config = code("next.config.ts");
  it("every response carries the four hardening headers", () => {
    for (const header of ["X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy"]) assert.ok(config.includes(`"${header}"`), header);
    assert.match(config, /"X-Frame-Options", value: "DENY"/);
    assert.match(config, /"X-Content-Type-Options", value: "nosniff"/);
    assert.match(config, /source: "\/:path\*"/);
  });
  it("the caching and partial-prefetch settings the app depends on are untouched", () => {
    assert.match(config, /cacheComponents: true/);
    assert.match(config, /partialPrefetching: true/);
  });
});

describe("branding: favicon, app icons and the manifest all exist and are the company logo", () => {
  it("the icon files exist and are real images", () => {
    for (const file of ["app/favicon.ico", "app/icon.png", "app/apple-icon.png", "app/opengraph-image.png", "app/twitter-image.png", "public/assets/branding/logo-192.png", "public/assets/branding/logo-512.png"]) {
      assert.ok(existsSync(join(root, file)), file);
      assert.ok(statSync(join(root, file)).size > 2000, `${file} should not be empty`);
    }
    // PNG signature, and an ICO header with three images.
    assert.equal(readFileSync(join(root, "app/icon.png")).subarray(1, 4).toString(), "PNG");
    const ico = readFileSync(join(root, "app/favicon.ico"));
    assert.equal(ico.readUInt16LE(2), 1, "an icon file");
    assert.equal(ico.readUInt16LE(4), 3, "16, 32 and 48 pixel images");
  });
  it("the manifest uses the logo icons that exist", () => {
    const manifest = code("app/manifest.ts");
    for (const src of [...manifest.matchAll(/src: "([^"]+)"/g)].map((m) => m[1])) assert.ok(existsSync(join(root, "public", src)), src);
  });
  it("the master logo is still used by the site header, footer and admin bar", () => {
    for (const file of ["components/layout/SiteHeader.tsx", "components/layout/SiteFooter.tsx", "components/admin/AdminShell.tsx"]) assert.match(code(file), /LogoImage|BrandLogo/, file);
  });
});

describe("configuration: the deployed application's environment variables", () => {
  const folders = ["app", "components", "lib", "hooks", "content", "proxy.ts"];
  const walk = (entry: string): string[] =>
    entry.endsWith(".ts") ? [entry] : readdirSync(join(root, entry), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${entry}/${e.name}`) : /\.(ts|tsx)$/.test(e.name) ? [`${entry}/${e.name}`] : []));

  it("the application reads exactly these four variables, and .env.example documents each by name", () => {
    const used = new Set<string>();
    for (const file of folders.flatMap(walk)) for (const [, name] of code(file).matchAll(/process\.env\.([A-Z][A-Z0-9_]+)/g)) if (name !== "NEXT_PUBLIC_") used.add(name);
    assert.deepEqual([...used].sort(), ["BOOM_ADMIN_USER_IDS", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SECRET_KEY"]);
    const example = read(".env.example");
    for (const name of used) assert.match(example, new RegExp(`^${name}=`, "m"), name);
  });

  it("only the two public Supabase values have a NEXT_PUBLIC_ name; the secret and the administrator list never do", () => {
    const example = read(".env.example");
    assert.doesNotMatch(example, /NEXT_PUBLIC_\w*(SECRET|SERVICE|ADMIN)/i);
    assert.match(example, /^SUPABASE_SECRET_KEY=\s*$/m, "documented by name only");
  });
});
