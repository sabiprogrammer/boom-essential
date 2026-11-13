import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

const URL_VAR = "NEXT_PUBLIC_SUPABASE_URL";
const KEY_VAR = "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY";

// Obviously fake values: these tests never read the real .env.local.
const FAKE_URL = "https://example-project.supabase.test";
const FAKE_KEY = "sb_publishable_fake_value_for_tests";

let saved: Record<string, string | undefined>;

beforeEach(() => {
  saved = { [URL_VAR]: process.env[URL_VAR], [KEY_VAR]: process.env[KEY_VAR] };
});

afterEach(() => {
  for (const [name, value] of Object.entries(saved)) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
});

describe("getSupabasePublicConfig", () => {
  it("returns the URL and publishable key, trimmed", () => {
    process.env[URL_VAR] = `  ${FAKE_URL}  `;
    process.env[KEY_VAR] = ` ${FAKE_KEY} `;
    assert.deepEqual(getSupabasePublicConfig(), { url: FAKE_URL, publishableKey: FAKE_KEY });
  });

  it("names the missing URL variable", () => {
    delete process.env[URL_VAR];
    process.env[KEY_VAR] = FAKE_KEY;
    assert.throws(() => getSupabasePublicConfig(), (error: Error) => {
      assert.match(error.message, new RegExp(URL_VAR));
      assert.doesNotMatch(error.message, new RegExp(KEY_VAR));
      return true;
    });
  });

  it("names the missing key variable", () => {
    process.env[URL_VAR] = FAKE_URL;
    process.env[KEY_VAR] = "   ";
    assert.throws(() => getSupabasePublicConfig(), (error: Error) => {
      assert.match(error.message, new RegExp(KEY_VAR));
      assert.doesNotMatch(error.message, new RegExp(URL_VAR));
      return true;
    });
  });

  it("names both when both are missing", () => {
    delete process.env[URL_VAR];
    delete process.env[KEY_VAR];
    assert.throws(() => getSupabasePublicConfig(), new RegExp(`${URL_VAR} and ${KEY_VAR}`));
  });

  it("rejects a URL that does not parse, without echoing the value", () => {
    process.env[URL_VAR] = "not a url";
    process.env[KEY_VAR] = FAKE_KEY;
    assert.throws(() => getSupabasePublicConfig(), (error: Error) => {
      assert.match(error.message, new RegExp(URL_VAR));
      assert.doesNotMatch(error.message, /not a url/);
      assert.doesNotMatch(error.message, new RegExp(FAKE_KEY));
      return true;
    });
  });
});
