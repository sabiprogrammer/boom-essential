import { NextResponse, type NextRequest } from "next/server";
import type { CookieMethodsServer } from "@supabase/ssr";
import { checkAdminAccess, type ClaimsSource } from "./admin-access";
import { adminHomePath, adminLoginPath, isAdminLoginPath, isProtectedAdminPath } from "./admin-paths";
import { safeAdminRedirect } from "./safe-redirect";

type PendingCookie = Parameters<NonNullable<CookieMethodsServer["setAll"]>>[0][number];

export type AdminProxyDependencies = {
  /** Builds the Supabase client for one request from the given cookie adapter. */
  createClient(cookies: CookieMethodsServer): { auth: ClaimsSource };
  /** The raw `BOOM_ADMIN_USER_IDS` value, read at request time. */
  getAllowlist(): string | undefined;
};

/** Admin pages are private and must stay out of search results and shared caches. */
function harden(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

function loginRedirect(request: NextRequest): NextResponse {
  const { pathname, search } = request.nextUrl;
  // Built from scratch (not cloned) so nothing from the request, such as a trailing slash, leaks into it.
  const url = new URL(adminLoginPath, request.url);
  // Remember where the person was going, but only when it is a safe, specific /admin destination.
  const destination = safeAdminRedirect(`${pathname}${search}`);
  if (destination !== adminHomePath) url.searchParams.set("next", destination);
  return NextResponse.redirect(url);
}

/**
 * The `/admin` proxy. Two jobs, both only for the administrator area:
 *
 * 1. SESSION REFRESH. Supabase access tokens are short-lived. `getClaims()` refreshes an expired token, and
 *    the refreshed cookies are written to BOTH the request (so the Server Components rendered for this very
 *    request see the new token and do not try to refresh it again; refresh tokens are single-use) and the
 *    response (so the browser keeps them). They are also copied onto a redirect.
 * 2. A FIRST GATE. A visitor who is not a verified, allowlisted administrator is redirected to the sign-in page.
 *
 * It is NOT the only security boundary: the admin layout, every admin page, Server Action and Route Handler
 * call `requireAdmin()` themselves, because a proxy can be skipped by a mistake in a matcher.
 *
 * The sign-in page is deliberately public and untouched (no Supabase call). Other public routes never reach
 * this function (see the matcher in `proxy.ts`). Any failure denies.
 */
export function createAdminProxy({ createClient, getAllowlist }: AdminProxyDependencies) {
  return async function adminProxy(request: NextRequest): Promise<NextResponse> {
    const { pathname } = request.nextUrl;

    if (isAdminLoginPath(pathname)) return harden(NextResponse.next());
    if (!isProtectedAdminPath(pathname)) return harden(NextResponse.next());

    const pendingCookies: PendingCookie[] = [];
    const pendingHeaders: Record<string, string> = {};

    let allowed = false;
    try {
      const client = createClient({
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet, headers) => {
          for (const cookie of cookiesToSet) request.cookies.set(cookie.name, cookie.value);
          pendingCookies.push(...cookiesToSet);
          Object.assign(pendingHeaders, headers);
        },
      });
      allowed = (await checkAdminAccess(client.auth, getAllowlist())).allowed;
    } catch {
      allowed = false;
    }

    const response = allowed ? NextResponse.next({ request }) : loginRedirect(request);
    for (const { name, value, options } of pendingCookies) response.cookies.set(name, value, options);
    for (const [name, value] of Object.entries(pendingHeaders)) response.headers.set(name, value);
    return harden(response);
  };
}
