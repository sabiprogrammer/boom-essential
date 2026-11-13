import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAllowlistedAdmin, parseAdminAllowlist } from "@/lib/auth/admin-allowlist";

// Fake, well-formed UUIDs. These tests never read the real environment.
const A = "11111111-1111-4111-8111-111111111111";
const B = "22222222-2222-4222-8222-222222222222";

describe("parseAdminAllowlist", () => {
  it("accepts one UUID", () => {
    const list = parseAdminAllowlist(A);
    assert.equal(list.valid, true);
    assert.ok(isAllowlistedAdmin(list, A));
  });

  it("accepts several comma-separated UUIDs, with spaces and a trailing comma", () => {
    const list = parseAdminAllowlist(` ${A} , ${B},`);
    assert.equal(list.valid, true);
    assert.ok(isAllowlistedAdmin(list, A));
    assert.ok(isAllowlistedAdmin(list, B));
  });

  it("compares case-insensitively", () => {
    const list = parseAdminAllowlist(A.toUpperCase());
    assert.ok(isAllowlistedAdmin(list, A));
    assert.ok(isAllowlistedAdmin(parseAdminAllowlist(A), A.toUpperCase()));
  });

  it("is invalid when missing", () => {
    assert.deepEqual(parseAdminAllowlist(undefined), { valid: false, reason: "missing" });
    assert.deepEqual(parseAdminAllowlist(null), { valid: false, reason: "missing" });
  });

  it("is invalid when empty or only separators and spaces", () => {
    for (const raw of ["", "   ", ",", " , ,, "]) assert.deepEqual(parseAdminAllowlist(raw), { valid: false, reason: "empty" }, JSON.stringify(raw));
  });

  it("is wholly invalid if ANY entry is malformed, even next to a good one", () => {
    const bad = [
      "not-a-uuid",
      `${A},oops`,
      `${A};${B}`,
      A.slice(0, -1),
      `${A}0`,
      "11111111111141118111111111111111", // no hyphens
      "gggggggg-1111-4111-8111-111111111111", // not hex
      `${A} ${B}`, // missing comma
      "*",
      "admin@example.com",
    ];
    for (const raw of bad) {
      const list = parseAdminAllowlist(raw);
      assert.equal(list.valid, false, raw);
      assert.equal(isAllowlistedAdmin(list, A), false, raw);
    }
  });

  it("never allows anyone on an invalid list", () => {
    assert.equal(isAllowlistedAdmin(parseAdminAllowlist(undefined), A), false);
    assert.equal(isAllowlistedAdmin(parseAdminAllowlist(""), A), false);
  });

  it("does not allow a UUID that is not listed", () => {
    assert.equal(isAllowlistedAdmin(parseAdminAllowlist(A), B), false);
  });
});
