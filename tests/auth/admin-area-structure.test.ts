import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
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

describe("administrator area: structure that the security model depends on", () => {
  it("the protected layout and the admin page each call requireAdmin() themselves (not only the proxy)", () => {
    assert.match(code("app/admin/(protected)/layout.tsx"), /await requireAdmin\(\)/);
    assert.match(code("app/admin/(protected)/page.tsx"), /await requireAdmin\(\)/);
  });

  it("the sign-in page sits outside the protected layout, so it cannot redirect to itself", () => {
    assert.ok(existsSync(join(root, "app/admin/login/page.tsx")));
    assert.ok(!existsSync(join(root, "app/admin/(protected)/login")));
    assert.doesNotMatch(code("app/admin/login/page.tsx"), /requireAdmin/);
  });

  it("every admin page and layout carries noindex/nofollow (via app/admin/layout.tsx), and the public layout is untouched", () => {
    const robots = code("app/admin/layout.tsx");
    assert.match(robots, /index: false/);
    assert.match(robots, /follow: false/);
    assert.doesNotMatch(code("app/layout.tsx"), /robots/);
  });

  it("requireAdmin is server-only and redirects to the sign-in page", () => {
    const source = read("lib/auth/require-admin.ts");
    assert.match(source, /^import "server-only";/m);
    assert.match(source, /redirect\(adminLoginPath\)/);
    assert.match(source, /export async function requireAdmin/);
    assert.match(source, /export const getAdminAccess/);
  });

  it("the administrator allowlist variable is server-only: never NEXT_PUBLIC_, never read in client code", () => {
    for (const file of [...files("app"), ...files("components"), ...files("content"), ...files("hooks"), ...files("lib")]) {
      assert.doesNotMatch(code(file), /NEXT_PUBLIC_BOOM|NEXT_PUBLIC_ADMIN/, file);
    }
    for (const file of [...files("components"), ...files("hooks")]) {
      assert.doesNotMatch(code(file), /BOOM_ADMIN_USER_IDS/, `${file} is client-reachable and must not read the allowlist`);
    }
    assert.doesNotMatch(read(".env.example"), /NEXT_PUBLIC_BOOM|NEXT_PUBLIC_ADMIN/);
  });

  it("authorisation never reads user-editable metadata", () => {
    for (const file of files("lib/auth")) assert.doesNotMatch(code(file), /user_metadata|app_metadata|raw_user_meta/, file);
  });

  it("there is no public registration: no sign-up call, page, route or Server Action anywhere", () => {
    const everything = [...files("app"), ...files("components"), ...files("hooks"), ...files("lib"), "proxy.ts"];
    for (const file of everything) {
      const source = code(file);
      assert.doesNotMatch(source, /\.signUp\(|signInWithOtp|signInWithOAuth|resetPasswordForEmail|updateUser\(|inviteUserByEmail/, file);
    }
    for (const dir of ["app/admin", "app/admin/login", "app/admin/(protected)"]) {
      for (const name of readdirSync(join(root, dir))) assert.doesNotMatch(name, /sign-?up|regist|forgot|reset/i, `${dir}/${name}`);
    }
    // And the visible words are absent from the sign-in screen's copy and components.
    const visible = [code("content/admin-auth.ts"), ...files("components/admin").map(code), code("app/admin/login/page.tsx")].join("\n");
    assert.doesNotMatch(visible, /create (an )?account|sign ?up|register|forgot (your )?password|magic link|continue with (google|facebook)/i);
  });

  it("sign-out ends the Supabase session and then redirects to the sign-in page", () => {
    const source = code("lib/auth/sign-out-action.ts");
    assert.match(source, /^"use server";/m);
    assert.match(source, /auth\.signOut\(\)/);
    assert.match(source, /redirect\(adminLoginPath\)/);
    assert.ok(source.indexOf("signOut()") < source.indexOf("redirect(adminLoginPath)"), "sign out before redirecting");
  });

  it("the admin shell's sign-out control is a form posting to the sign-out action", () => {
    const shell = code("components/admin/AdminShell.tsx");
    assert.match(shell, /<form action=\{signOutAction\}>/);
    assert.match(shell, /type="submit"/);
  });

  it("the sign-in action restricts the destination and verifies the allowlist before redirecting", () => {
    const source = code("lib/auth/sign-in-action.ts");
    assert.match(source, /^"use server";/m);
    assert.match(source, /safeAdminRedirect\(formData\.get\("next"\)\)/);
    assert.match(source, /BOOM_ADMIN_USER_IDS/);
    assert.ok(source.indexOf("signInAdmin(") < source.indexOf("redirect("), "verify before redirecting");
  });

  it("nothing in the auth code logs credentials, tokens or errors", () => {
    for (const file of [...files("lib/auth"), ...files("components/admin"), "proxy.ts", "lib/supabase/proxy-client.ts"]) {
      assert.doesNotMatch(code(file), /console\.(log|info|warn|error|debug)/, file);
    }
  });

  it("the public dashboard demonstration is gone, and nothing in the application refers to it", () => {
    assert.ok(!existsSync(join(root, "app/dashboard-preview")), "the /dashboard-preview route must not exist");
    for (const gone of ["components/dashboard-preview", "lib/dashboard-preview", "content/dashboard-preview.ts", "tests/dashboard-preview", "hooks/useDemoReference.ts"]) {
      assert.ok(!existsSync(join(root, gone)), `${gone} must not exist`);
    }
    const everything = [...files("app"), ...files("components"), ...files("lib"), ...files("hooks"), ...files("content"), "proxy.ts"];
    for (const file of everything) {
      assert.doesNotMatch(code(file), /dashboard-preview|DemoReady|DemoDataProvider|createDemoEnquiries|demo-enquiries|useDemo/, file);
    }
  });

  it("the administrator screens take their shared building blocks from components/admin/ui and lib/admin/shared only", () => {
    const allowed = new Set([
      "@/components/admin/ui/Avatar", "@/components/admin/ui/DateTile", "@/components/admin/ui/DetailDrawer", "@/components/admin/ui/DetailSection",
      "@/components/admin/ui/EmptyState", "@/components/admin/ui/FilterChips", "@/components/admin/ui/Panel", "@/components/admin/ui/SearchField",
      "@/components/admin/ui/SelectField", "@/components/admin/ui/StatusBadge", "@/components/admin/ui/icons",
      "@/lib/admin/shared/types", "@/lib/admin/shared/labels", "@/lib/admin/shared/dates", "@/lib/admin/shared/phone", "@/lib/admin/shared/contact-actions",
    ]);
    for (const file of [...files("app/admin"), ...files("components/admin"), ...files("lib/auth"), ...files("lib/admin"), "lib/enquiry/server/phone-e164.ts"]) {
      for (const [, specifier] of code(file).matchAll(/from "(@\/(?:components\/admin\/ui|lib\/admin\/shared)\/[^"]+)"/g)) {
        assert.ok(allowed.has(specifier), `${file} imports ${specifier}, which is not an approved shared module`);
      }
    }
    // The workspace copy states no figures.
    assert.doesNotMatch(code("content/admin-auth.ts"), /\d/, "the workspace copy states no figures");
  });

  it("every enquiry read and Server Action re-verifies the administrator itself", () => {
    const exportsOf = (source: string) => [...source.matchAll(/export (?:async )?function (\w+)\(([\s\S]*?)\n\}\n/g)];
    const guarded: Record<string, number> = {
      "lib/admin/enquiries/queries.ts": 2,
      "lib/admin/enquiries/enquiry-actions.ts": 2,
      "lib/admin/appointments/queries.ts": 2,
      "lib/admin/appointments/appointment-actions.ts": 4,
    };
    for (const [file, expected] of Object.entries(guarded)) {
      const functions = exportsOf(code(file));
      assert.equal(functions.length, expected, `${file} should export exactly ${expected} functions`);
      for (const [, name, body] of functions) assert.match(body, /await requireAdmin\(\)/, `${name} must call requireAdmin() first`);
    }
    for (const file of ["lib/admin/enquiries/enquiry-actions.ts", "lib/admin/appointments/appointment-actions.ts"]) {
      assert.match(code(file), /^"use server";/m, file);
    }
    assert.match(code("lib/admin/membership/check-membership.ts"), /await requireAdmin\(\)/);
    for (const page of ["app/admin/(protected)/page.tsx", "app/admin/(protected)/appointments/page.tsx"]) {
      assert.match(code(page), /await requireAdmin\(\)/, page);
    }
  });

  it("the admin data code uses the signed-in administrator's own session: never the secret key, never a delete", () => {
    const rpcAllowed = new Set(["lib/admin/appointments/appointment-actions.ts", "lib/admin/membership/check-membership.ts"]);
    for (const file of files("lib/admin")) {
      const source = code(file);
      assert.doesNotMatch(source, /secret-client|createSupabaseSecretClient|SUPABASE_SECRET|service[_-]?role/i, file);
      assert.doesNotMatch(source, /\.delete\(|\.upsert\(|\.storage\b/, file);
      if (!rpcAllowed.has(file)) assert.doesNotMatch(source, /\.rpc\(/, file);
    }
    for (const file of [
      "lib/admin/enquiries/queries.ts",
      "lib/admin/enquiries/enquiry-actions.ts",
      "lib/admin/appointments/queries.ts",
      "lib/admin/appointments/appointment-actions.ts",
      "lib/admin/membership/check-membership.ts",
    ]) {
      assert.match(code(file), /createSupabaseServerClient\(\)/, file);
    }
  });

  it("appointment writes touch only the columns administrators may write, never a preferred date or time, and rescheduling goes through the one database function", () => {
    const actions = code("lib/admin/appointments/appointment-actions.ts");
    // Columns used as keys when building an update (the grants allow: status, confirmed_date, confirmed_time, venue, scheduling_note).
    const written = new Set([...actions.matchAll(/\b(?:patch\.(\w+) =|(\w+): (?:"|input\.))/g)].map((m) => m[1] ?? m[2]));
    for (const column of ["confirmed_by", "confirmed_at", "preferred_date", "preferred_time", "timezone", "enquiry_id", "rescheduled_from_id", "created_at", "updated_at"]) {
      assert.ok(!written.has(column), `${column} must never be written by the application`);
    }
    assert.doesNotMatch(actions, /\.insert\(/, "an appointment is never inserted from the application: the reschedule function does it");
    assert.deepEqual([...actions.matchAll(/\.rpc\("(\w+)"/g)].map((m) => m[1]), ["reschedule_appointment"]);
    assert.deepEqual([...new Set([...actions.matchAll(/\.from\("(\w+)"\)/g)].map((m) => m[1]))], ["appointments"]);
    // Every status change is guarded by the status the administrator was looking at.
    assert.match(actions, /\.update\(patch\)\.eq\("id", id\)\.eq\("status", expected\)/);
    // The only statuses ever written.
    assert.deepEqual([...actions.matchAll(/status: "(\w+)"/g)].map((m) => m[1]).filter((s) => !["error", "success"].includes(s)).sort(), ["cancelled", "completed", "confirmed"]);
    assert.match(actions, /patch: Record<string, string> = \{ status: "cancelled" \}/);
  });

  it("the admin writes touch only the status of an enquiry and the enquiry and content of a note", () => {
    const actions = code("lib/admin/enquiries/enquiry-actions.ts");
    assert.deepEqual([...actions.matchAll(/\.update\(\{([^}]*)\}\)/g)].map((m) => m[1].trim()), ["status: input.next"]);
    assert.deepEqual([...actions.matchAll(/\.insert\(\{([^}]*)\}\)/g)].map((m) => m[1].trim()), ["enquiry_id: input.enquiryId, content: input.content"]);
    assert.deepEqual([...actions.matchAll(/\.from\("(\w+)"\)/g)].map((m) => m[1]).sort(), ["enquiries", "enquiries", "enquiry_notes"]);
  });

  it("only administrator code reads enquiries and notes with the user session; the queries are read-only", () => {
    const queries = code("lib/admin/enquiries/queries.ts");
    assert.doesNotMatch(queries, /\.(insert|update|delete|upsert)\(/);
    assert.deepEqual([...new Set([...queries.matchAll(/\.from\("(\w+)"\)/g)].map((m) => m[1]))].sort(), ["activity_logs", "appointments", "enquiries", "enquiry_notes"]);
  });

  it("the sign-in page is not forced dynamic by anything outside Suspense (cookies are only read in the gated components)", () => {
    assert.doesNotMatch(code("app/admin/login/page.tsx"), /cookies\(\)|headers\(\)/);
  });
});
