import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const scale = [
  { token: "display", spec: "Manrope 800 · 44–84px · -0.028em", className: "font-heading text-display font-extrabold text-navy", sample: "Power. Protection. Provision." },
  { token: "h1", spec: "Manrope 700 · 36–56px", className: "font-heading text-h1 font-bold text-navy", sample: "BOOM Energy: Solar Power and Energy Solutions" },
  { token: "h2", spec: "Manrope 700 · 30–40px", className: "font-heading text-h2 font-bold text-navy", sample: "BOOM Security: Security and Surveillance" },
  { token: "h3", spec: "Manrope 700 · 22–26px", className: "font-heading text-h3 font-bold text-navy", sample: "BOOM Foods: Food and Agricultural Products" },
  { token: "lead", spec: "Inter 400 · 18–21px", className: "text-lead text-ink-muted", sample: "Introductory paragraph set larger than body copy, in muted ink." },
  { token: "body", spec: "Inter 400 · 17px · line-height 1.65", className: "text-body text-charcoal", sample: "Body copy is set at 17px with generous leading for easy reading on phones and desktops. Measure is held to about 65 characters." },
  { token: "small", spec: "Inter 400 · 15px", className: "text-sm text-ink-muted", sample: "Supporting detail, captions and form hints. Never smaller than 14px." },
  { token: "label", spec: "Manrope 700 · 14px · +0.16em · uppercase", className: "font-heading text-xs font-bold tracking-[0.16em] text-navy uppercase", sample: "Additional offering" },
];

export function TypographySection() {
  return (
    <Section tone="light" aria-labelledby="preview-type">
      <Container>
        <SectionHeading
          id="preview-type"
          eyebrow="02 · Typography"
          title="Manrope for voice, Inter for reading"
          lead="Fluid sizes scale between phone and desktop. Headings are tight and confident; body text is open and comfortable."
        />

        <dl className="mt-12 border-t-2 border-navy">
          {scale.map((row) => (
            <div key={row.token} className="grid gap-3 border-b border-line py-7 lg:grid-cols-[14rem_1fr] lg:gap-10">
              <dt className="font-heading text-xs font-bold tracking-[0.14em] text-ink-muted uppercase">
                text-{row.token}
                <span className="mt-1 block font-sans text-sm font-normal tracking-normal text-ink-muted normal-case">{row.spec}</span>
              </dt>
              <dd className={row.className}>{row.sample}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
