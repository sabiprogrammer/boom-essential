import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { NextRequest } from "next/server";
import type { CookieMethodsServer } from "@supabase/ssr";
import type { ClaimsSource } from "@/lib/auth/admin-access";
import { createAdminProxy } from "@/lib/auth/admin-proxy";
import { config, proxy } from "@/proxy";

const ADMIN = "11111111-1111-4111-8111-111111111111";
const OTHER = "33333333-3333-4333-8333-333333333333";

type Behaviour = {
  claims?: { sub?: unknown; role?: unknown } | null;
  /** Simulates Supabase refreshing an expired token during getClaims(). */
  refreshTo?: { name: string; value: string };
  throwOnCreate?: boolean;
};

/** Builds a proxy around a fake Supabase client and records how it was used. */
function build(behaviour: Behaviour, ...allowlistOverride: [string | undefined] | []) {
  // Passing `undefined` explicitly means "variable missing"; passing nothing means "the administrator is listed".
  const allowlist = allowlistOverride.length ? allowlistOverride[0] : ADMIN;
  const calls = { created: 0 };
  const handler = createAdminProxy({
    getAllowlist: () => allowlist,
    createClient: (cookies: CookieMethodsServer) => {
      calls.created += 1;
      if (behaviour.throwOnCreate) throw new Error("not configured");
      const auth: ClaimsSource = {
        getClaims: async () => {
          if (behaviour.refreshTo) {
            await cookies.setAll?.(
              [{ ...behaviour.refreshTo, options: { path: "/", httpOnly: true, sameSite: "lax", maxAge: 3600 } }],
              { "Cache-Control": "private, no-cache, no-store, must-revalidate, max-age=0" },
            );
          }
          return { data: behaviour.claims ? { claims: behaviour.claims } : null, error: null };
        },
      };
      return { auth };
    },
  });
  return { handler, calls };
}

const get = (path: string) => new NextRequest(`http://localhost:3000${path}`);
const isNext = (response: Response) => response.headers.get("x-middleware-next") === "1";
const location = (response: Response) => new URL(response.headers.get("location") ?? "http://none");

describe("proxy matcher and export", () => {
  it("exports a proxy function and matches only the administrator area", () => {
    assert.equal(typeof proxy, "function");
    assert.deepEqual(config.matcher, ["/admin", "/admin/:path*"]);
  });
});

describe("admin proxy: protected routes", () => {
  it("redirects a visitor with no session from /admin to the sign-in page", async () => {
    const { handler } = build({ claims: null });
    const response = await handler(get("/admin"));
    assert.equal(response.status, 307);
    assert.equal(location(response).pathname, "/admin/login");
    assert.equal(location(response).search, "");
  });

  it("remembers a safe destination when the visitor was heading deeper into /admin", async () => {
    const { handler } = build({ claims: null });
    const response = await handler(get("/admin/enquiries?status=new"));
    assert.equal(response.status, 307);
    assert.equal(location(response).pathname, "/admin/login");
    assert.equal(location(response).searchParams.get("next"), "/admin/enquiries?status=new");
  });

  it("protects every descendant, whatever the case or trailing slash", async () => {
    for (const path of ["/admin/", "/ADMIN", "/admin/a/b/c", "/admin/anything-new"]) {
      const { handler } = build({ claims: null });
      const response = await handler(get(path));
      assert.equal(response.status, 307, path);
      assert.equal(location(response).pathname, "/admin/login", path);
    }
  });

  it("lets a verified, allowlisted administrator through", async () => {
    const { handler } = build({ claims: { sub: ADMIN, role: "authenticated" } });
    const response = await handler(get("/admin"));
    assert.equal(response.status, 200);
    assert.ok(isNext(response));
  });

  it("does NOT let an authenticated user who is not allowlisted through", async () => {
    const { handler } = build({ claims: { sub: OTHER, role: "authenticated" } });
    const response = await handler(get("/admin/enquiries"));
    assert.equal(response.status, 307);
    assert.equal(location(response).pathname, "/admin/login");
    assert.ok(!isNext(response));
  });

  it("denies everyone when the allowlist is missing, empty or malformed", async () => {
    for (const allowlist of [undefined, "", "not-a-uuid", `${ADMIN},oops`]) {
      const { handler } = build({ claims: { sub: ADMIN, role: "authenticated" } }, allowlist);
      const response = await handler(get("/admin"));
      assert.equal(response.status, 307, String(allowlist));
      assert.ok(!isNext(response), String(allowlist));
    }
  });

  it("fails closed when the Supabase client cannot even be created", async () => {
    const { handler } = build({ throwOnCreate: true });
    const response = await handler(get("/admin"));
    assert.equal(response.status, 307);
    assert.equal(location(response).pathname, "/admin/login");
  });

  it("never redirects to anything but the local sign-in page, even for hostile paths", async () => {
    const { handler } = build({ claims: null });
    for (const path of ["/admin//evil.example", "/admin/%2f%2fevil.example", "/admin/..%2f..%2f"]) {
      const response = await handler(get(path));
      assert.equal(location(response).origin, "http://localhost:3000", path);
      assert.equal(location(response).pathname, "/admin/login", path);
    }
  });
});

describe("admin proxy: public routes are left alone", () => {
  it("passes /admin/login through without any Supabase call", async () => {
    for (const path of ["/admin/login", "/admin/login/", "/ADMIN/LOGIN", "/admin/login?next=/admin/enquiries"]) {
      const { handler, calls } = build({ claims: null });
      const response = await handler(get(path));
      assert.equal(response.status, 200, path);
      assert.ok(isNext(response), path);
      assert.equal(calls.created, 0, path);
    }
  });

  it("makes no Supabase call for unrelated public routes (defence in depth: the matcher already excludes them)", async () => {
    for (const path of ["/", "/about", "/contact", "/dashboard-preview", "/dashboard-preview/enquiries", "/administrator"]) {
      const { handler, calls } = build({ claims: null });
      const response = await handler(get(path));
      assert.ok(isNext(response), path);
      assert.equal(calls.created, 0, path);
    }
  });
});

describe("admin proxy: session refresh", () => {
  const refreshed = { name: "sb-test-auth-token", value: "refreshed-value" };

  it("keeps refreshed cookies on the response and forwards them on the request for the page being rendered", async () => {
    const { handler } = build({ claims: { sub: ADMIN, role: "authenticated" }, refreshTo: refreshed });
    const request = get("/admin");
    const response = await handler(request);
    assert.equal(response.cookies.get(refreshed.name)?.value, refreshed.value);
    assert.equal(request.cookies.get(refreshed.name)?.value, refreshed.value);
    assert.match(response.headers.get("cache-control") ?? "", /no-store/);
  });

  it("keeps refreshed cookies on a redirect too, so a sign-out or expiry is not undone", async () => {
    const { handler } = build({ claims: { sub: OTHER, role: "authenticated" }, refreshTo: refreshed });
    const response = await handler(get("/admin"));
    assert.equal(response.status, 307);
    assert.equal(response.cookies.get(refreshed.name)?.value, refreshed.value);
  });

  it("marks admin responses private, uncacheable and noindex", async () => {
    const { handler } = build({ claims: null });
    for (const path of ["/admin", "/admin/login"]) {
      const response = await handler(get(path));
      assert.equal(response.headers.get("cache-control"), "private, no-store", path);
      assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow", path);
    }
  });
});
