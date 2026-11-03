import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const widths = [
  { token: "max-w-content", spec: "80rem · 1280px · full layouts", className: "max-w-content" },
  { token: "max-w-narrow", spec: "60rem · 960px · focused layouts", className: "max-w-narrow" },
  { token: "max-w-prose", spec: "42rem · 672px · reading measure", className: "max-w-prose" },
];

const spacing = [
  { token: "gutter", spec: "20 to 40px · page side margins", className: "w-gutter" },
  { token: "section-sm", spec: "40 to 72px · tight vertical rhythm", className: "w-section-sm" },
  { token: "section", spec: "64 to 128px · standard section padding", className: "w-section" },
  { token: "section-lg", spec: "80 to 176px · hero-scale rhythm", className: "w-section-lg" },
];

const shadows = [
  { token: "shadow-header", className: "shadow-header" },
  { token: "shadow-raised", className: "shadow-raised" },
  { token: "shadow-menu", className: "shadow-menu" },
];

const motion = [
  { token: "150ms", spec: "fast · small state changes", className: "duration-150" },
  { token: "250ms", spec: "base · default transition", className: "duration-250" },
  { token: "450ms", spec: "slow · larger movement", className: "duration-[450ms]" },
];

const sublabel = "font-heading text-xs font-bold tracking-[0.14em] text-ink-muted uppercase";

export function LayoutTokensSection() {
  return (
    <Section tone="white" aria-labelledby="preview-tokens">
      <Container>
        <SectionHeading
          id="preview-tokens"
          eyebrow="04 · Layout tokens"
          title="Widths, spacing, edges, depth and motion"
          lead="Every value comes from app/tokens.css. Resize the window to see fluid spacing respond."
        />

        <div className="mt-12 grid gap-14 lg:grid-cols-2 lg:gap-x-16">
          <div>
            <h3 className={`${sublabel} mb-5`}>Content widths</h3>
            <ul className="space-y-4">
              {widths.map((row) => (
                <li key={row.token}>
                  <div className={`h-3 w-full bg-navy ${row.className}`} />
                  <p className="mt-2 text-sm text-ink-muted">
                    <span className="font-mono text-charcoal">{row.token}</span> · {row.spec}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`${sublabel} mb-5`}>Fluid spacing</h3>
            <ul className="space-y-4">
              {spacing.map((row) => (
                <li key={row.token}>
                  <div className={`h-3 bg-gold ${row.className}`} />
                  <p className="mt-2 text-sm text-ink-muted">
                    <span className="font-mono text-charcoal">{row.token}</span> · {row.spec}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`${sublabel} mb-5`}>Radius and borders</h3>
            <div className="flex flex-wrap items-end gap-8">
              {[
                { label: "none", className: "rounded-none" },
                { label: "sm · 2px", className: "rounded-sm" },
                { label: "md · 4px", className: "rounded-md" },
                { label: "full", className: "rounded-full" },
              ].map((item) => (
                <div key={item.label} className="text-sm text-ink-muted">
                  <div className={`mb-2 size-16 border-2 border-navy bg-tint ${item.className}`} />
                  {item.label}
                </div>
              ))}
              <div className="text-sm text-ink-muted">
                <div className="mb-2 h-16 w-16 border border-line-strong bg-white" />
                hairline
              </div>
            </div>
          </div>

          <div>
            <h3 className={`${sublabel} mb-5`}>Shadows</h3>
            <div className="flex flex-wrap gap-8 bg-tint p-6">
              {shadows.map((item) => (
                <div key={item.token} className="text-sm text-ink-muted">
                  <div className={`mb-3 size-20 bg-white ${item.className}`} />
                  <span className="font-mono">{item.token}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className={`${sublabel} mb-5`}>Motion (hover or focus each bar)</h3>
            <ul className="grid gap-5 sm:grid-cols-3">
              {motion.map((item) => (
                <li key={item.token}>
                  <button
                    type="button"
                    className={`group/m block h-12 w-full bg-tint text-left transition-colors ease-(--ease-standard) hover:bg-navy focus-visible:bg-navy ${item.className}`}
                    aria-label={`Motion sample ${item.token}`}
                  >
                    <span className="block h-full w-3 bg-gold transition-[width] ease-(--ease-standard) group-hover/m:w-full group-focus-visible/m:w-full" style={{ transitionDuration: "inherit" }} />
                  </button>
                  <p className="mt-2 text-sm text-ink-muted">
                    <span className="font-mono text-charcoal">{item.token}</span> · {item.spec}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-prose text-sm text-ink-muted">
              With <span className="font-mono text-charcoal">prefers-reduced-motion</span> enabled in the operating
              system, all of these collapse to instant state changes.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
