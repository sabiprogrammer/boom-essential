import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { Surface } from "@/components/ui/button-styles";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";

function ControlsDemo({ surface }: { surface: Surface }) {
  const labelClass =
    surface === "dark" ? "text-on-dark-muted" : "text-ink-muted";

  return (
    <div className="space-y-10">
      <div>
        <p className={`mb-4 font-heading text-xs font-bold tracking-[0.14em] uppercase ${labelClass}`}>
          Primary and secondary · large
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href="/contact#appointment" surface={surface} size="lg" arrow>
            Request a Consultation
          </ButtonLink>
          <ButtonLink href="/contact" surface={surface} variant="secondary" size="lg">
            Contact Us
          </ButtonLink>
        </div>
      </div>

      <div>
        <p className={`mb-4 font-heading text-xs font-bold tracking-[0.14em] uppercase ${labelClass}`}>
          Medium · small · disabled
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button surface={surface}>Send Enquiry</Button>
          <Button surface={surface} variant="secondary">
            Cancel
          </Button>
          <Button surface={surface} size="sm">
            Small
          </Button>
          <Button surface={surface} disabled>
            Disabled
          </Button>
        </div>
      </div>

      <div>
        <p className={`mb-4 font-heading text-xs font-bold tracking-[0.14em] uppercase ${labelClass}`}>
          Text links
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <TextLink href="/about" surface={surface} arrow>
            About Us
          </TextLink>
          <TextLink href="/industrial-equipment" surface={surface}>
            Industrial Equipment
          </TextLink>
          <TextLink href="tel:+2348055544415" surface={surface}>
            +234 805 554 4415
          </TextLink>
        </div>
      </div>
    </div>
  );
}

export function ControlsSection() {
  return (
    <>
      <Section tone="light" aria-labelledby="preview-controls">
        <Container>
          <SectionHeading
            id="preview-controls"
            eyebrow="03 · Buttons and links"
            title="Square-edged, high-contrast controls"
            lead="Hover, focus (use Tab) and press each one. Navy leads on light surfaces; gold leads on navy and charcoal."
          />
          <div className="mt-12">
            <ControlsDemo surface="light" />
          </div>
        </Container>
      </Section>

      <Section tone="navy" space="sm" aria-label="Controls on a dark surface">
        <Container>
          <p className="mb-10 font-heading text-xs font-bold tracking-[0.16em] text-on-dark-muted uppercase">
            The same controls on Deep Navy
          </p>
          <ControlsDemo surface="dark" />
        </Container>
      </Section>
    </>
  );
}
