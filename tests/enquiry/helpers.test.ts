import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getClientKey, keyFromAddress } from "@/lib/enquiry/server/client-key";
import { toE164 } from "@/lib/enquiry/server/phone-e164";
import { isHoneypotTriggered, isSameOriginRequest } from "@/lib/enquiry/server/spam";
import { cleanMessage, cleanSingleLine } from "@/lib/enquiry/server/text";
import { newSubmissionId } from "@/lib/enquiry/submission-id";

describe("phone normalisation for storage", () => {
  it("returns only values the database accepts (+, then 8 to 15 digits, not starting with 0)", () => {
    const DB = /^\+[1-9][0-9]{7,14}$/;
    const samples = ["08031234567", "0803 123 4567", "+234 803 123 4567", "2348031234567", "002348031234567", "+44 20 7946 0958", "09012345678", "07012345678", "01 234 5678 90", "0123456789"];
    for (const typed of samples) {
      const value = toE164(typed);
      if (value !== null) assert.match(value, DB, typed);
    }
  });

  it("normalises Nigerian numbers to +234 and keeps other international numbers", () => {
    assert.equal(toE164("08031234567"), "+2348031234567");
    assert.equal(toE164("+2348031234567"), "+2348031234567");
    assert.equal(toE164("2348031234567"), "+2348031234567");
    assert.equal(toE164("+44 20 7946 0958"), "+442079460958");
  });

  it("returns null when it cannot be normalised with confidence", () => {
    assert.equal(toE164("abc"), null);
    assert.equal(toE164("12345"), null);
  });
});

describe("text cleaning", () => {
  it("single-line text loses control and invisible characters and collapses whitespace", () => {
    assert.equal(cleanSingleLine("  a\u0000b \t c\n d​ "), "ab c d");
    assert.equal(cleanSingleLine("‮evil‬"), "evil");
  });

  it("keeps zero-width joiners, which some scripts and emoji need", () => {
    assert.equal(cleanSingleLine("a‍b"), "a‍b");
  });

  it("messages keep paragraph breaks but not runs of blank lines, trailing spaces or CR", () => {
    assert.equal(cleanMessage("a  \r\nb\r\n\r\n\r\n\r\nc  "), "a\nb\n\nc");
  });
});

describe("honeypot", () => {
  it("is triggered by anything but an absent or blank value", () => {
    for (const value of [undefined, null, "", "   "]) assert.equal(isHoneypotTriggered(value), false);
    for (const value of ["http://spam.example", "x", 1, true, {}, ["a"]]) assert.equal(isHoneypotTriggered(value), true);
  });
});

describe("same-origin check", () => {
  const headers = (init: Record<string, string>) => new Headers(init);

  it("accepts a browser POST from the same host", () => {
    assert.equal(isSameOriginRequest(headers({ origin: "https://boom.example", host: "boom.example" })), true);
    assert.equal(isSameOriginRequest(headers({ origin: "https://boom.example", "x-forwarded-host": "boom.example", "sec-fetch-site": "same-origin" })), true);
    assert.equal(isSameOriginRequest(headers({ origin: "http://localhost:3000", host: "localhost:3000" })), true);
  });

  it("refuses another origin, a missing origin, a cross-site fetch and a malformed origin", () => {
    assert.equal(isSameOriginRequest(headers({ origin: "https://evil.example", host: "boom.example" })), false);
    assert.equal(isSameOriginRequest(headers({ host: "boom.example" })), false);
    assert.equal(isSameOriginRequest(headers({ origin: "https://boom.example", host: "boom.example", "sec-fetch-site": "cross-site" })), false);
    assert.equal(isSameOriginRequest(headers({ origin: "not a url", host: "boom.example" })), false);
    assert.equal(isSameOriginRequest(headers({ origin: "https://boom.example" })), false, "no host to compare with");
    assert.equal(isSameOriginRequest(headers({ origin: "https://boom.example.evil.example", host: "boom.example" })), false);
  });
});

describe("client key for rate limiting", () => {
  it("uses the platform's address headers, preferring x-real-ip, taking the first forwarded address", () => {
    assert.equal(getClientKey(new Headers({ "x-real-ip": "203.0.113.7" })), "203.0.113.7");
    assert.equal(getClientKey(new Headers({ "x-forwarded-for": "203.0.113.9, 10.0.0.1" })), "203.0.113.9");
    assert.equal(getClientKey(new Headers({ "x-real-ip": "203.0.113.7", "x-forwarded-for": "198.51.100.1" })), "203.0.113.7");
  });

  it("falls back to a shared 'unknown' bucket for no address or junk", () => {
    assert.equal(getClientKey(new Headers()), "unknown");
    assert.equal(getClientKey(new Headers({ "x-real-ip": "not-an-ip" })), "unknown");
    assert.equal(getClientKey(new Headers({ "x-real-ip": "1.2.3.4.5" })), "unknown");
    assert.equal(getClientKey(new Headers({ "x-forwarded-for": "'; drop table x;--" })), "unknown");
  });

  it("groups an IPv6 visitor by its /64, so changing the low bits does not dodge the limit", () => {
    const a = keyFromAddress("2001:db8:abcd:12::1");
    const b = keyFromAddress("2001:db8:abcd:12:ffff:ffff:ffff:ffff");
    assert.equal(a, b);
    assert.equal(a, "v6:2001:db8:abcd:12");
    assert.notEqual(keyFromAddress("2001:db8:abcd:13::1"), a);
    assert.equal(keyFromAddress("::1"), "v6:0:0:0:0");
    assert.equal(keyFromAddress("2001:0DB8:0000:0000:0000:0000:0000:0001"), "v6:2001:db8:0:0");
  });

  it("treats an IPv4-mapped IPv6 address as its IPv4 address", () => {
    assert.equal(keyFromAddress("::ffff:203.0.113.7"), "203.0.113.7");
  });
});

describe("submission id", () => {
  it("is a random version-4 UUID, different each time", () => {
    const a = newSubmissionId();
    const b = newSubmissionId();
    assert.match(a, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    assert.notEqual(a, b);
  });
});
