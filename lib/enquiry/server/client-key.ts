import { isIP } from "node:net";

/**
 * A stable identifier for "the same visitor" used only for rate limiting: the client's network address as the
 * hosting platform reports it. The database hashes it with a private pepper before storing anything.
 *
 * IPv6 visitors usually control a whole /64, so only the first four groups are kept (otherwise changing the
 * low bits would dodge the limit). An IPv4-mapped IPv6 address counts as its IPv4 address. Anything that is not
 * an IP address, or no address at all, becomes "unknown", which shares one bucket (safe: it only makes the limit
 * stricter for requests with no usable address).
 *
 * On Vercel the platform sets x-real-ip and x-forwarded-for itself; a client-supplied value cannot override them.
 */
export function getClientKey(headers: Headers): string {
  const raw = (headers.get("x-real-ip") ?? headers.get("x-forwarded-for")?.split(",")[0] ?? "").trim();
  return keyFromAddress(raw);
}

export function keyFromAddress(address: string): string {
  const family = isIP(address);
  if (family === 4) return address;
  if (family === 6) return ipv6Key(address);
  return "unknown";
}

function ipv6Key(address: string): string {
  const mapped = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(address);
  if (mapped && isIP(mapped[1]) === 4) return mapped[1];

  // Expand "::" and an embedded IPv4 tail into eight 16-bit groups, then keep the first four.
  let text = address.toLowerCase().split("%")[0];
  const tail = /(\d{1,3}(?:\.\d{1,3}){3})$/.exec(text);
  if (tail) {
    const [a, b, c, d] = tail[1].split(".").map(Number);
    text = text.slice(0, -tail[1].length) + `${((a << 8) | b).toString(16)}:${((c << 8) | d).toString(16)}`;
  }
  const [head, rest] = text.split("::");
  const headGroups = head ? head.split(":") : [];
  const restGroups = rest === undefined ? [] : rest ? rest.split(":") : [];
  const fill = rest === undefined ? 0 : 8 - headGroups.length - restGroups.length;
  const groups = [...headGroups, ...Array<string>(Math.max(fill, 0)).fill("0"), ...restGroups];
  return `v6:${groups.slice(0, 4).map((group) => group.replace(/^0+(?=.)/, "")).join(":")}`;
}
