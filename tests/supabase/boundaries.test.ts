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

describe("Supabase connection boundaries (connection milestone only)", () => {
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

  it("no source file reads or names a service-role or secret key", () => {
    const folders = ["app", "components", "content", "hooks", "lib"];
    for (const file of folders.flatMap(sourceFiles)) {
      assert.doesNotMatch(code(file), /service[_-]?role|SUPABASE_SECRET|sb_secret_/i, file);
    }
  });

  it("no source file hard-codes a Supabase project address or key", () => {
    const folders = ["app", "components", "content", "hooks", "lib"];
    for (const file of folders.flatMap(sourceFiles)) {
      assert.doesNotMatch(read(file), /\.supabase\.co|sb_publishable_[A-Za-z0-9_-]{8,}|eyJ[A-Za-z0-9_-]{20,}\./, file);
    }
  });

  it("authentication is not built yet: no proxy or middleware file", () => {
    for (const name of ["proxy.ts", "middleware.ts", "src/proxy.ts", "src/middleware.ts"]) {
      assert.ok(!existsSync(join(root, name)), `${name} belongs to the authentication milestone`);
    }
  });

  it("nothing imports the Supabase clients yet (no queries, no data access)", () => {
    const folders = ["app", "components", "content", "hooks"];
    for (const file of folders.flatMap(sourceFiles)) {
      assert.doesNotMatch(read(file), /@\/lib\/supabase/, file);
    }
  });
});
