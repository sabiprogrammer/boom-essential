import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const checks = [
  { area: "Dropdown (desktop, 1024px+)", how: "Hover “Our Divisions”; click to pin it open; click elsewhere to close. With the keyboard: Tab to the button, Enter/Space toggles, ArrowDown opens and moves into the list, Arrow keys/Home/End move, Escape closes and returns focus." },
  { area: "Industrial Equipment", how: "Sits after a divider, separate from the three divisions, in the header, the mobile menu (under “Additional offering”) and the footer." },
  { area: "Sticky header", how: "Scroll down: the header tightens, the logo shrinks and a soft shadow appears." },
  { area: "Mobile menu (under 1024px)", how: "Open with Menu. Focus stays inside; Escape, the close button, the backdrop or choosing a link all close it. The page behind does not scroll." },
  { area: "WhatsApp action", how: "Bottom-right. A circle on phones, a labelled pill from 768px. It fades out when the footer comes into view." },
  { area: "Skip link", how: "Press Tab once on a fresh page load: “Skip to main content” appears." },
  { area: "Links", how: "Navigation links point to the planned routes (/about, /energy …). Those pages are built in later stages and currently show the branded 404 page." },
];

export function TestingGuideSection() {
  return (
    <Section tone="light" aria-labelledby="preview-testing">
      <Container>
        <SectionHeading
          id="preview-testing"
          eyebrow="05 · Navigation, footer and responsiveness"
          title="What to inspect"
          lead="The header and footer on this page are the real components. Test them at phone, tablet and desktop widths."
        />
        <dl className="mt-12 border-t-2 border-navy">
          {checks.map((item) => (
            <div key={item.area} className="grid gap-2 border-b border-line py-6 lg:grid-cols-[18rem_1fr] lg:gap-10">
              <dt className="font-heading text-base font-bold text-navy">{item.area}</dt>
              <dd className="text-body text-ink-muted">{item.how}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
