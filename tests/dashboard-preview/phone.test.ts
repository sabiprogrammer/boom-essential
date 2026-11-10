import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isValidNigerianMobile, normaliseNigerianMobile } from "@/lib/dashboard-preview/phone";

// The numbers below are format examples only. None of them belongs to a BOOM customer.
describe("Nigerian mobile number normalisation", () => {
  const valid: [string, string, string][] = [
    ["local 11 digits", "08031234567", "2348031234567"],
    ["local with spaces", "0803 123 4567", "2348031234567"],
    ["local with dashes", "0803-123-4567", "2348031234567"],
    ["local with parentheses", "(0803) 123 4567", "2348031234567"],
    ["+234", "+2348031234567", "2348031234567"],
    ["+234 with spaces", "+234 803 123 4567", "2348031234567"],
    ["234 without plus", "2348031234567", "2348031234567"],
    ["00234 prefix", "002348031234567", "2348031234567"],
    ["+234 with a stray trunk zero", "+234 0803 123 4567", "2348031234567"],
    ["surrounding whitespace", "  0803 123 4567  ", "2348031234567"],
    ["prefix 70x", "07011234567", "2347011234567"],
    ["prefix 81x", "08111234567", "2348111234567"],
    ["prefix 90x", "09011234567", "2349011234567"],
    ["prefix 91x", "09111234567", "2349111234567"],
  ];
  for (const [label, input, expected] of valid) {
    it(`accepts ${label}`, () => {
      assert.equal(normaliseNigerianMobile(input), expected);
      assert.equal(isValidNigerianMobile(input), true);
    });
  }

  const invalid: unknown[] = [
    "",
    "   ",
    null,
    undefined,
    8031234567,
    "0803123456",
    "080312345678",
    "+2348031234",
    "+44 7911 123456",
    "+1 202 555 0100",
    "803 123 4567",
    "0603 123 4567",
    "0203 123 4567",
    "abc",
    "0803-123-45x7",
    "+234",
    "234",
    "0",
    "+2340000000000",
    "08031234567 ext 2",
  ];
  for (const input of invalid) {
    it(`rejects ${JSON.stringify(input)}`, () => {
      assert.equal(normaliseNigerianMobile(input), null);
      assert.equal(isValidNigerianMobile(input), false);
    });
  }

  it("rejects every demonstration placeholder number", () => {
    for (let n = 1; n <= 24; n += 1) {
      const placeholder = `+234 000 DEMO 00${String(n).padStart(2, "0")}`;
      assert.equal(normaliseNigerianMobile(placeholder), null, placeholder);
    }
  });
});
