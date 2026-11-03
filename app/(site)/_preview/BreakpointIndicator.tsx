/** Shows which Tailwind breakpoint is currently active (pure CSS, no JavaScript). */
export function BreakpointIndicator() {
  return (
    <p className="inline-flex items-center gap-3 border border-line-strong bg-white px-4 py-2 font-heading text-sm font-semibold text-navy">
      <span className="text-ink-muted">Active breakpoint</span>
      <span className="xs:hidden">base · under 480px</span>
      <span className="hidden xs:inline sm:hidden">xs · 480px+</span>
      <span className="hidden sm:inline md:hidden">sm · 640px+</span>
      <span className="hidden md:inline lg:hidden">md · 768px+ (tablet; menu drawer)</span>
      <span className="hidden lg:inline xl:hidden">lg · 1024px+ (desktop navigation)</span>
      <span className="hidden xl:inline 2xl:hidden">xl · 1280px+</span>
      <span className="hidden 2xl:inline">2xl · 1536px+</span>
    </p>
  );
}
