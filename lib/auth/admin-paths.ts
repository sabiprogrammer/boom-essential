/** Where the administrator area lives. One place, so the proxy, the guards and the redirects cannot disagree. */
export const adminHomePath = "/admin";
export const adminLoginPath = "/admin/login";

/** Lower-cased, without trailing slashes: the comparison must not be defeated by `/ADMIN/` or `/admin/login/`. */
function normalise(pathname: string): string {
  const lower = pathname.toLowerCase();
  return lower.length > 1 ? lower.replace(/\/+$/, "") : lower;
}

/** The sign-in page. It is public, otherwise nobody could ever sign in. */
export function isAdminLoginPath(pathname: string): boolean {
  return normalise(pathname) === adminLoginPath;
}

/** `/admin` and everything beneath it except the sign-in page. */
export function isProtectedAdminPath(pathname: string): boolean {
  const path = normalise(pathname);
  if (path === adminLoginPath) return false;
  return path === adminHomePath || path.startsWith(`${adminHomePath}/`);
}
