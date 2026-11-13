import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { company } from "@/content/company";
import { formPrivacyNote, privacyContent } from "@/content/privacy";

/**
 * The Privacy Notice must say only what the implementation supports. These tests keep the notice honest: the confirmed
 * contact details are exact, nothing the company has not confirmed (a retention period, a data-sharing arrangement, a
 * privacy officer, a lawful-basis claim) can slip in, the links exist, and the claims about trackers and cookies stay
 * true of the code. They do not replace the owner's review of the wording.
 */

const root = new URL("../../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const read = (relative: string) => readFileSync(join(root, relative), "utf8");
const code = (relative: string) => read(relative).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

const allText = JSON.stringify(privacyContent.sections);

function sourceFiles(dir: string): string[] {
  return readdirSync(join(root, dir)).flatMap((name) => {
    const relative = `${dir}/${name}`;
    if (statSync(join(root, relative)).isDirectory()) return sourceFiles(relative);
    return /\.(ts|tsx)$/.test(name) ? [relative] : [];
  });
}

describe("Privacy Notice: confirmed facts", () => {
  it("uses exactly the contact details the owner confirmed", () => {
    assert.equal(company.email.general.display, "info@boomessential.com");
    assert.equal(company.email.privacy.display, "admin@boomessential.com");
    assert.equal(company.email.general.href, "mailto:info@boomessential.com");
    assert.equal(company.email.privacy.href, "mailto:admin@boomessential.com");
    assert.equal(company.phone.display, "+234 805 554 4415");
    assert.equal(company.whatsapp.display, "+234 816 650 3634");
    assert.equal(company.website, "www.boomessential.com");
    assert.equal(company.legalName, "BOOM MULTI GLOBAL COMPANY LIMITED");
  });

  it("the contact block takes every detail from company.ts, never from a typed copy", () => {
    const source = code("components/privacy/PrivacyContact.tsx");
    for (const field of ["company.email.privacy", "company.email.general", "company.phone", "company.whatsapp", "company.address"]) assert.ok(source.includes(field), field);
    assert.doesNotMatch(source, /@boomessential|\+234/, "no address or number is typed into the component");
  });

  it("no other email address appears anywhere in the notice's content or components", () => {
    const files = ["content/privacy.ts", ...sourceFiles("components/privacy")];
    for (const file of files) {
      const found = [...read(file).matchAll(/[\w.+-]+@[\w-]+\.[\w.]+/g)].map((m) => m[0]);
      assert.deepEqual(found, [], `${file} must not type an email address`);
    }
  });
});

describe("Privacy Notice: nothing unconfirmed is claimed", () => {
  it("states no retention period, no data-sharing arrangement, no privacy officer and no lawful-basis claim", () => {
    assert.doesNotMatch(allText, /\b(\d+|one|two|three|six|twelve)\s+(years?|months?)\b/i, "no retention period");
    assert.doesNotMatch(allText, /privacy officer|data protection officer|\bDPO\b|\bDPIA\b/i);
    assert.doesNotMatch(allText, /legitimate interest|lawful basis|legal basis|contractual necessity/i);
    assert.doesNotMatch(allText, /we (do not|never|don.t) sell|we will never share|we (do not|never) share your/i, "no promise about selling or sharing that the company has not made");
    assert.doesNotMatch(allText, /\bISO\b|certified|accredited|NDPC (registration|licen)/i);
    assert.doesNotMatch(allText, /within \d+ (days?|hours?)|\d+ working days|one month/i, "no response deadline");
  });

  it("names only the two service providers the implementation really uses, and only as providers acting for the company", () => {
    const providers = ["Supabase", "Vercel"];
    for (const name of providers) assert.ok(allText.includes(name), name);
    assert.doesNotMatch(allText, /Google|Facebook|Meta|Microsoft|Amazon|Cloudflare|Mailchimp|Stripe|Paystack|Flutterwave|Twilio|SendGrid/i);
  });

  it("describes the rights and the complaints route under Nigerian law, and how to make a request", () => {
    for (const phrase of ["Nigeria Data Protection Act 2023", "Nigeria Data Protection Commission", "access", "corrected", "delete", "withdraw your consent"]) {
      assert.ok(allText.includes(phrase), phrase);
    }
    assert.ok(privacyContent.sections.some((s) => s.blocks.some((b) => b.type === "contact")), "a contact block with working links");
  });

  it("covers every topic the owner asked for", () => {
    const ids: string[] = privacyContent.sections.map((s) => s.id);
    for (const id of ["what-we-collect", "why-we-use-it", "how-records-are-handled", "your-rights", "contact-us"]) assert.ok(ids.includes(id), id);
    assert.equal(new Set(ids).size, ids.length, "section ids are unique (they are anchors)");
  });
});

describe("Privacy Notice: the claims about the code stay true", () => {
  const shipped = ["app", "components", "lib", "hooks", "content"].flatMap(sourceFiles);

  it("the code sets no cookies and uses no browser storage for visitors (admin sign-in is the only cookie user)", () => {
    for (const file of shipped) {
      if (file.startsWith("lib/supabase/") || file.startsWith("lib/auth/") || file.startsWith("app/admin") || file.startsWith("components/admin")) continue;
      assert.doesNotMatch(code(file), /document\.cookie|localStorage|sessionStorage|indexedDB|cookies\(\)\.set|\.cookies\.set/, file);
    }
  });

  it("no analytics, advertising or tracking library is installed or referenced", () => {
    const packageJson = JSON.parse(read("package.json")) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
    const names = Object.keys({ ...packageJson.dependencies, ...packageJson.devDependencies });
    for (const name of names) assert.doesNotMatch(name, /analytics|gtag|gtm|pixel|hotjar|segment|mixpanel|sentry|plausible|clarity|speed-insights|recaptcha/i, name);
    for (const file of shipped) assert.doesNotMatch(code(file), /googletagmanager|google-analytics|gtag\(|fbq\(|connect\.facebook|hotjar|clarity\.ms|plausible\.io/i, file);
  });

  it("the only data the browser sends about the form goes to this site's own /api/enquiries", () => {
    const calls = shipped.flatMap((file) => [...code(file).matchAll(/\bfetch\(\s*([^,)]+)/g)].map((m) => `${file}: ${m[1].trim()}`));
    assert.deepEqual(calls, ["lib/enquiry/submit.ts: enquiryEndpoint"]);
  });
});

describe("Privacy Notice: the page and the links to it", () => {
  it("the page exists, is in the sitemap and is not marked noindex", () => {
    assert.ok(existsSync(join(root, "app/(site)/privacy/page.tsx")));
    assert.match(code("app/sitemap.ts"), /path: "\/privacy"/);
    assert.doesNotMatch(code("app/(site)/privacy/page.tsx"), /noindex|index: false/);
    assert.match(code("app/(site)/privacy/page.tsx"), /canonical: "\/privacy"/);
  });

  it("the footer links to it from the bottom bar", () => {
    const footer = code("components/layout/SiteFooter.tsx");
    assert.match(footer, /privacyLink/);
    assert.match(code("content/navigation.ts"), /privacyLink: NavLinkItem = \{ label: "Privacy Notice", href: "\/privacy" \}/);
  });

  it("the enquiry form shows the note under the submit button and its link opens in a new tab so typed entries are not lost", () => {
    const form = code("components/contact/EnquiryForm.tsx");
    assert.ok(form.indexOf("<SubmitBar") < form.indexOf("<PrivacyNote"), "the note comes directly after the submit area");
    const note = code("components/contact/PrivacyNote.tsx");
    assert.match(note, /target="_blank"/);
    assert.match(note, /rel="noopener noreferrer"/);
    assert.equal(formPrivacyNote.href, "/privacy");
    assert.match(formPrivacyNote.text, /respond to your enquiry or appointment request/);
  });
});
