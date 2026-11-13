import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAdminLoginPath, isProtectedAdminPath } from "@/lib/auth/admin-paths";
import { safeAdminRedirect } from "@/lib/auth/safe-redirect";

describe("safeAdminRedirect", () => {
  it("keeps internal /admin destinations, with their query", () => {
    assert.equal(safeAdminRedirect("/admin"), "/admin");
    assert.equal(safeAdminRedirect("/admin/enquiries"), "/admin/enquiries");
    assert.equal(safeAdminRedirect("/admin/enquiries?status=new&page=2"), "/admin/enquiries?status=new&page=2");
    assert.equal(safeAdminRedirect("  /admin/appointments  "), "/admin/appointments");
  });

  it("falls back to /admin for anything that is not a string or is empty", () => {
    for (const input of [undefined, null, 42, {}, [], ["/admin/x"], "", "   "]) assert.equal(safeAdminRedirect(input), "/admin", String(input));
  });

  it("rejects other sites and protocol-relative URLs", () => {
    const hostile = [
      "https://evil.example/admin",
      "http://evil.example",
      "//evil.example/admin",
      "///evil.example",
      "/\\evil.example",
      "\\\\evil.example",
      "javascript:alert(1)",
      "data:text/html,x",
      "evil.example",
      "admin",
    ];
    for (const input of hostile) assert.equal(safeAdminRedirect(input), "/admin", input);
  });

  it("rejects paths outside /admin, including look-alikes and dot-segment escapes", () => {
    const outside = [
      "/",
      "/about",
      "/dashboard-preview",
      "/administrator",
      "/admin-panel",
      "/adminx/login",
      "/admin/../about",
      "/admin/./../../etc/passwd",
      "/admin%2f..%2fabout",
      "/api/admin",
    ];
    for (const input of outside) assert.equal(safeAdminRedirect(input), "/admin", input);
  });

  it("rejects control characters, backslashes and absurd lengths", () => {
    for (const input of ["/admin\n/x", "/admin\r\nLocation: https://evil", "/admin\t", "/admin/\u0000", "/admin\\x", `/admin/${"a".repeat(600)}`]) {
      assert.equal(safeAdminRedirect(input), "/admin", JSON.stringify(input));
    }
  });

  it("never redirects back to the sign-in page (no loop)", () => {
    for (const input of ["/admin/login", "/admin/login?next=/admin", "/ADMIN/LOGIN", "/admin/login/"]) assert.equal(safeAdminRedirect(input), "/admin", input);
  });

  it("does not carry the hash, and uses the supplied fallback when given", () => {
    assert.equal(safeAdminRedirect("/admin/x#frag"), "/admin/x");
    assert.equal(safeAdminRedirect("https://evil.example", "/admin/enquiries"), "/admin/enquiries");
  });
});

describe("admin path classification", () => {
  it("treats /admin and its descendants as protected, whatever the case or trailing slash", () => {
    for (const path of ["/admin", "/admin/", "/ADMIN", "/Admin/", "/admin/enquiries", "/admin/enquiries/123", "/admin/a/b/c", "/admin/loginx", "/admin/login/extra"]) {
      assert.equal(isProtectedAdminPath(path), true, path);
    }
  });

  it("keeps the sign-in page public, whatever the case or trailing slash", () => {
    for (const path of ["/admin/login", "/admin/login/", "/ADMIN/LOGIN", "/Admin/Login/"]) {
      assert.equal(isAdminLoginPath(path), true, path);
      assert.equal(isProtectedAdminPath(path), false, path);
    }
  });

  it("does not claim unrelated public routes", () => {
    for (const path of ["/", "/about", "/contact", "/dashboard-preview", "/dashboard-preview/enquiries", "/administrator", "/admin-panel", "/api/admin"]) {
      assert.equal(isProtectedAdminPath(path), false, path);
      assert.equal(isAdminLoginPath(path), false, path);
    }
  });
});
