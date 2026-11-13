import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = new URL("../../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const read = (relative: string) => readFileSync(join(root, relative), "utf8");
/** Code without comments, so a comment that says "never read the service-role key" is not mistaken for reading it. */
const code = (relative: string) => read(relative).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

function sourceFiles(dir: string): string[] {
  return readdirSync(join(root, dir)).flatMap((name) => {
    const relative = `${dir}/${name}`;
    if (statSync(join(root, relative)).isDirectory()) return sourceFiles(relative);
    return /\.(ts|tsx|mjs|js)$/.test(name) ? [relative] : [];
  });
}

describe("Supabase connection boundaries", () => {
  it("the server client is server-only and builds a fresh client per call", () => {
    const source = read("lib/supabase/server.ts");
    assert.match(source, /^import "server-only";/m);
    assert.match(source, /await cookies\(\)/);
    assert.match(source, /export async function createSupabaseServerClient/);
    assert.doesNotMatch(source, /^(const|let|var) \w+ = createServerClient/m, "no module-level client");
  });

  it("the browser client uses no server-only API", () => {
    const source = code("lib/supabase/client.ts");
    assert.doesNotMatch(source, /server-only|next\/headers|\.\/server|createServerClient/);
  });

  // The ONE place the secret key is read (approved 2026-11-13 for the public enquiry submission).
  const SECRET_CLIENT = "lib/supabase/secret-client.ts";

  it("no source file except the secret-key client reads or names a service-role or secret key", () => {
    const folders = ["app", "components", "content", "hooks", "lib"];
    for (const file of folders.flatMap(sourceFiles)) {
      if (file === SECRET_CLIENT) continue;
      assert.doesNotMatch(code(file), /service[_-]?role|SUPABASE_SECRET|sb_secret_/i, file);
    }
  });

  it("the secret-key client is server-only, reads only SUPABASE_SECRET_KEY, builds a fresh client per call and keeps no session", () => {
    const source = read(SECRET_CLIENT);
    assert.match(source, /^import "server-only";/m);
    assert.match(code(SECRET_CLIENT), /process\.env\.SUPABASE_SECRET_KEY\?\.trim\(\)/);
    assert.doesNotMatch(code(SECRET_CLIENT), /NEXT_PUBLIC_[A-Z_]*(SECRET|SERVICE)/);
    assert.doesNotMatch(source, /^(const|let|var) \w+ = createClient/m, "no module-level client");
    assert.match(source, /persistSession: false/);
    assert.match(source, /export function createSupabaseSecretClient/);
  });

  it("only the enquiry server code imports the secret-key client", () => {
    const folders = ["app", "components", "content", "hooks", "lib", "proxy.ts"];
    const files = folders.flatMap((entry) => (entry.endsWith(".ts") ? [entry] : sourceFiles(entry)));
    const importers = files.filter((file) => /secret-client/.test(code(file)) && file !== SECRET_CLIENT);
    assert.deepEqual(importers, ["lib/enquiry/server/submit-to-database.ts"]);
  });

  it("no secret key variable has a NEXT_PUBLIC_ name anywhere, including the example environment file", () => {
    assert.doesNotMatch(read(".env.example"), /NEXT_PUBLIC_\w*(SECRET|SERVICE)/i);
    assert.match(read(".env.example"), /^SUPABASE_SECRET_KEY=\s*$/m, "documented by name only, with no value");
  });

  it("no source file hard-codes a Supabase project address or key", () => {
    const folders = ["app", "components", "content", "hooks", "lib"];
    for (const file of folders.flatMap(sourceFiles)) {
      assert.doesNotMatch(read(file), /\.supabase\.co|sb_publishable_[A-Za-z0-9_-]{8,}|eyJ[A-Za-z0-9_-]{20,}\./, file);
    }
  });

  it("the Next.js 16 proxy.ts exists and the deprecated middleware.ts does not", () => {
    assert.ok(existsSync(join(root, "proxy.ts")));
    for (const name of ["middleware.ts", "src/middleware.ts", "src/proxy.ts"]) assert.ok(!existsSync(join(root, name)), name);
  });

  it("pages, components, content and hooks never import the Supabase clients directly (they go through lib/auth)", () => {
    const folders = ["app", "components", "content", "hooks"];
    for (const file of folders.flatMap(sourceFiles)) {
      assert.doesNotMatch(read(file), /@\/lib\/supabase/, file);
    }
  });

  it("database calls exist only in the listed files: the public submit_enquiry function, the administrator's enquiry and appointment reads and writes, and the membership check; no storage call exists", () => {
    const folders = ["app", "components", "content", "hooks", "lib"];
    const ALLOWED = "lib/enquiry/server/submit-to-database.ts";
    // Administrator reads and writes (Stages 6.5 and 6.6): user-session queries (RLS applies), each guarded by requireAdmin().
    const ADMIN_TABLE_ACCESS = [
      "lib/admin/enquiries/queries.ts",
      "lib/admin/enquiries/enquiry-actions.ts",
      "lib/admin/appointments/queries.ts",
      "lib/admin/appointments/appointment-actions.ts",
    ];
    // The only other functions the administrator's own session may call. Both run as the CALLER (reschedule_appointment is
    // SECURITY INVOKER; am_i_active_admin answers only about the caller), so Row Level Security still decides everything.
    const ADMIN_RPC: Record<string, string[]> = {
      "lib/admin/appointments/appointment-actions.ts": ["reschedule_appointment"],
      "lib/admin/membership/check-membership.ts": ["am_i_active_admin"],
    };
    for (const file of folders.flatMap(sourceFiles)) {
      const source = code(file);
      assert.doesNotMatch(source, /\.storage\(\s*["'`]|\.storage\./, file);
      if (!ADMIN_TABLE_ACCESS.includes(file)) assert.doesNotMatch(source, /\.from\(\s*["'`]/, file);
      if (file === ALLOWED) continue;
      if (ADMIN_RPC[file]) {
        const calls = [...source.matchAll(/\.rpc\(\s*["'`]([^"'`]+)["'`]/g)].map((match) => match[1]);
        assert.deepEqual(calls, ADMIN_RPC[file], file);
        continue;
      }
      assert.doesNotMatch(source, /\.rpc\(\s*["'`]/, file);
    }
    const rpcCalls = [...code(ALLOWED).matchAll(/\.rpc\(\s*["'`]([^"'`]+)["'`]/g)].map((match) => match[1]);
    assert.deepEqual(rpcCalls, ["submit_enquiry"]);
    assert.doesNotMatch(code("proxy.ts"), /\.(from|rpc|storage)\(\s*["'`]/);
  });

  it("the enquiry database call passes no id, reference, status, source or timestamp", () => {
    const source = code("lib/enquiry/server/submit-to-database.ts");
    const args = /\.rpc\("submit_enquiry", \{([\s\S]*?)\}\)/.exec(source)?.[1] ?? "";
    const names = [...args.matchAll(/^\s*(p_\w+):/gm)].map((match) => match[1]);
    assert.ok(names.length >= 12);
    for (const name of names) assert.doesNotMatch(name, /status|source|reference|created|updated|^p_id$/, name);
  });
});
