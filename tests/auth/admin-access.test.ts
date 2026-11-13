import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { checkAdminAccess, type ClaimsSource } from "@/lib/auth/admin-access";

const ADMIN = "11111111-1111-4111-8111-111111111111";
const OTHER = "33333333-3333-4333-8333-333333333333";

type Claims = { sub?: unknown; role?: unknown; email?: unknown; user_metadata?: unknown; app_metadata?: unknown };
type ClaimsResult = Awaited<ReturnType<ClaimsSource["getClaims"]>>;

const withClaims = (claims: Claims): ClaimsSource => ({ getClaims: async () => ({ data: { claims }, error: null }) });
const returning = (result: ClaimsResult): ClaimsSource => ({ getClaims: async () => result });
const reason = (access: Awaited<ReturnType<typeof checkAdminAccess>>) => (access.allowed ? "allowed" : access.reason);

describe("checkAdminAccess", () => {
  it("allows a verified user whose id is on the allowlist", async () => {
    const access = await checkAdminAccess(withClaims({ sub: ADMIN, role: "authenticated", email: "boss@example.com" }), ADMIN);
    assert.deepEqual(access, { allowed: true, userId: ADMIN, email: "boss@example.com" });
  });

  it("allows when the id is one of several allowlisted ids", async () => {
    const access = await checkAdminAccess(withClaims({ sub: ADMIN, role: "authenticated" }), `${OTHER}, ${ADMIN}`);
    assert.equal(access.allowed, true);
  });

  it("denies an authenticated user who is not on the allowlist", async () => {
    const access = await checkAdminAccess(withClaims({ sub: OTHER, role: "authenticated" }), ADMIN);
    assert.equal(reason(access), "not-allowlisted");
  });

  it("never treats user_metadata or app_metadata as proof of administrator status", async () => {
    const claims = {
      sub: OTHER,
      role: "authenticated",
      user_metadata: { role: "admin", is_admin: true, admin: true },
      app_metadata: { role: "admin", roles: ["admin"] },
    };
    assert.equal(reason(await checkAdminAccess(withClaims(claims), ADMIN)), "not-allowlisted");
  });

  it("denies everyone when the allowlist variable is missing", async () => {
    assert.equal(reason(await checkAdminAccess(withClaims({ sub: ADMIN, role: "authenticated" }), undefined)), "allowlist-invalid");
  });

  it("denies everyone when the allowlist is empty", async () => {
    for (const raw of ["", "  ", ","]) {
      assert.equal(reason(await checkAdminAccess(withClaims({ sub: ADMIN, role: "authenticated" }), raw)), "allowlist-invalid", JSON.stringify(raw));
    }
  });

  it("denies everyone when the allowlist has a malformed entry, even the listed administrator", async () => {
    assert.equal(reason(await checkAdminAccess(withClaims({ sub: ADMIN, role: "authenticated" }), `${ADMIN},not-a-uuid`)), "allowlist-invalid");
  });

  it("does not even call Supabase when the allowlist is unusable", async () => {
    let called = false;
    const spy: ClaimsSource = { getClaims: async () => ((called = true), { data: null, error: null }) };
    await checkAdminAccess(spy, undefined);
    assert.equal(called, false);
  });

  it("denies when there is no session (no claims)", async () => {
    assert.equal(reason(await checkAdminAccess(returning({ data: null, error: null }), ADMIN)), "unauthenticated");
  });

  it("denies when claims verification returns an error", async () => {
    assert.equal(reason(await checkAdminAccess(returning({ data: null, error: new Error("invalid JWT") }), ADMIN)), "verification-failed");
    // An error wins even if data is present: never trust a result that came with an error.
    const both = returning({ data: { claims: { sub: ADMIN, role: "authenticated" } }, error: new Error("x") });
    assert.equal(reason(await checkAdminAccess(both, ADMIN)), "verification-failed");
  });

  it("denies when getClaims throws", async () => {
    const throwing: ClaimsSource = {
      getClaims: async () => {
        throw new Error("network down");
      },
    };
    assert.equal(reason(await checkAdminAccess(throwing, ADMIN)), "verification-failed");
  });

  it("denies claims with a missing, non-string or malformed subject", async () => {
    for (const sub of [undefined, null, 42, {}, "", "not-a-uuid", `${ADMIN}x`]) {
      assert.equal(reason(await checkAdminAccess(withClaims({ sub, role: "authenticated" }), ADMIN)), "unauthenticated", String(sub));
    }
  });

  it("denies claims that are not a signed-in user's (wrong or missing role)", async () => {
    for (const role of [undefined, "anon", "service_role", "admin", 1]) {
      assert.equal(reason(await checkAdminAccess(withClaims({ sub: ADMIN, role }), ADMIN)), "unauthenticated", String(role));
    }
  });

  it("denies malformed claims objects", async () => {
    for (const claims of [null, "string", 7]) {
      const source = returning({ data: { claims } as unknown as { claims: Claims }, error: null });
      assert.equal(reason(await checkAdminAccess(source, ADMIN)), "unauthenticated", String(claims));
    }
  });
});
