/** True when `pathname` is the link's page or one of its sub-pages ("/" matches only itself). */
export function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  const target = href.split("#")[0] || "/";
  if (target === "/") return pathname === "/";
  return pathname === target || pathname.startsWith(`${target}/`);
}
