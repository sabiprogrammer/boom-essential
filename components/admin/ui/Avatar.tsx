/** Initials of the first two words of a name (an organisation, here), in a quiet monogram. Decorative. */
export function Avatar({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  const initials = name
    .replace(/[^\p{L}\s]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-md bg-tint font-heading font-extrabold tracking-wide text-navy ${
        size === "lg" ? "size-14 text-lead" : "size-10 text-sm"
      }`}
    >
      {initials}
    </span>
  );
}
