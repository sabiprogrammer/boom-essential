import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseLoginInput } from "@/lib/auth/login-input";
import { signInAdmin, type SignInSource } from "@/lib/auth/sign-in";

const ADMIN = "11111111-1111-4111-8111-111111111111";
const OTHER = "33333333-3333-4333-8333-333333333333";
const credentials = { email: "someone@example.com", password: "fake-password-for-tests" };

type Script = {
  signInError?: unknown;
  signInThrows?: boolean;
  claims?: { sub?: unknown; role?: unknown } | null;
  signOutThrows?: boolean;
};

function fakeAuth(script: Script) {
  const log: string[] = [];
  const auth: SignInSource = {
    signInWithPassword: async () => {
      log.push("signIn");
      if (script.signInThrows) throw new Error("boom");
      return { error: script.signInError ?? null };
    },
    getClaims: async () => {
      log.push("getClaims");
      return { data: script.claims ? { claims: script.claims } : null, error: null };
    },
    signOut: async () => {
      log.push("signOut");
      if (script.signOutThrows) throw new Error("boom");
      return { error: null };
    },
  };
  return { auth, log };
}

describe("signInAdmin", () => {
  it("succeeds for an allowlisted administrator, after verifying the claims, and keeps the session", async () => {
    const { auth, log } = fakeAuth({ claims: { sub: ADMIN, role: "authenticated" } });
    assert.deepEqual(await signInAdmin(auth, credentials, ADMIN), { ok: true });
    assert.deepEqual(log, ["signIn", "getClaims"]);
  });

  it("fails and ENDS THE SESSION for a valid account that is not an administrator", async () => {
    const { auth, log } = fakeAuth({ claims: { sub: OTHER, role: "authenticated" } });
    assert.deepEqual(await signInAdmin(auth, credentials, ADMIN), { ok: false });
    assert.deepEqual(log, ["signIn", "getClaims", "signOut"]);
  });

  it("fails and signs out when the allowlist is missing or invalid", async () => {
    for (const allowlist of [undefined, "", "nope"]) {
      const { auth, log } = fakeAuth({ claims: { sub: ADMIN, role: "authenticated" } });
      assert.deepEqual(await signInAdmin(auth, credentials, allowlist), { ok: false });
      assert.equal(log.at(-1), "signOut", String(allowlist));
    }
  });

  it("fails without signing out when the password is wrong (nothing was created)", async () => {
    const { auth, log } = fakeAuth({ signInError: { message: "Invalid login credentials" } });
    assert.deepEqual(await signInAdmin(auth, credentials, ADMIN), { ok: false });
    assert.deepEqual(log, ["signIn"]);
  });

  it("gives the same bare result for a wrong password and for a non-administrator (no way to tell accounts apart)", async () => {
    const wrongPassword = await signInAdmin(fakeAuth({ signInError: { message: "x" } }).auth, credentials, ADMIN);
    const notAdmin = await signInAdmin(fakeAuth({ claims: { sub: OTHER, role: "authenticated" } }).auth, credentials, ADMIN);
    assert.deepEqual(wrongPassword, notAdmin);
    assert.deepEqual(Object.keys(wrongPassword), ["ok"]);
  });

  it("fails closed, and tries to sign out, if anything throws", async () => {
    const { auth, log } = fakeAuth({ signInThrows: true });
    assert.deepEqual(await signInAdmin(auth, credentials, ADMIN), { ok: false });
    assert.equal(log.at(-1), "signOut");
  });

  it("still reports failure if signing out itself throws", async () => {
    const { auth } = fakeAuth({ claims: { sub: OTHER, role: "authenticated" }, signOutThrows: true });
    assert.deepEqual(await signInAdmin(auth, credentials, ADMIN), { ok: false });
  });

  it("denies when the verified claims are missing", async () => {
    const { auth } = fakeAuth({ claims: null });
    assert.deepEqual(await signInAdmin(auth, credentials, ADMIN), { ok: false });
  });
});

describe("parseLoginInput", () => {
  const form = (entries: Record<string, string | File>) => {
    const data = new FormData();
    for (const [key, value] of Object.entries(entries)) data.set(key, value);
    return data;
  };

  it("accepts an email and password, trims the email and never alters the password", () => {
    const result = parseLoginInput(form({ email: "  Boss@Example.com ", password: "  spaces and CASE kept  " }));
    assert.deepEqual(result, { ok: true, email: "Boss@Example.com", password: "  spaces and CASE kept  " });
  });

  it("reports missing fields and keeps the email for display", () => {
    const result = parseLoginInput(form({ email: "boss@example.com", password: "" }));
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.ok(result.fieldErrors.password);
      assert.equal(result.fieldErrors.email, undefined);
      assert.equal(result.email, "boss@example.com");
    }
  });

  it("rejects malformed and oversized emails", () => {
    for (const email of ["", "   ", "plain", "a@b", "a b@c.com", "@x.com", `${"a".repeat(250)}@x.com`]) {
      const result = parseLoginInput(form({ email, password: "x" }));
      assert.equal(result.ok, false, email);
    }
  });

  it("treats a missing or non-text field as empty", () => {
    assert.equal(parseLoginInput(new FormData()).ok, false);
    const file = new File(["x"], "x.txt");
    assert.equal(parseLoginInput(form({ email: file, password: file })).ok, false);
  });

  it("never returns the password on a failure", () => {
    const result = parseLoginInput(form({ email: "bad", password: "secret-value" }));
    assert.equal(result.ok, false);
    assert.doesNotMatch(JSON.stringify(result), /secret-value/);
  });

  it("bounds the password length", () => {
    assert.equal(parseLoginInput(form({ email: "a@b.co", password: "x".repeat(1025) })).ok, false);
    assert.equal(parseLoginInput(form({ email: "a@b.co", password: "x".repeat(1024) })).ok, true);
  });
});
