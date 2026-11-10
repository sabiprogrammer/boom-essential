import { company } from "@/content/company";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";

type EnquiryBandProps = {
  id: string;
  eyebrow: string;
  heading: string;
  copy: string;
  primary: { label: string; href: string };
  /** Hide the WhatsApp action when the primary action already is a contact action. */
  showWhatsApp?: boolean;
};

/** A closing call to action on Deep Navy for the plain content pages: one primary action and WhatsApp. */
export function EnquiryBand({ id, eyebrow, heading, copy, primary, showWhatsApp = true }: EnquiryBandProps) {
  return (
    <Section tone="navy" space="lg" aria-labelledby={id}>
      <Container>
        <div className="reveal max-w-3xl">
          <p className="mb-6 flex items-center gap-3 font-heading text-xs font-bold tracking-[0.16em] uppercase">
            <span aria-hidden="true" className="h-0.5 w-8 bg-gold" />
            {eyebrow}
          </p>
          <h2
            id={id}
            className="text-[clamp(2rem,1.2rem+3vw,3.5rem)] leading-[1.08] font-extrabold text-balance text-white"
          >
            {heading}
          </h2>
          <p className="mt-6 max-w-xl text-lead text-on-dark-muted">{copy}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <ButtonLink href={primary.href} surface="dark" size="lg" arrow>
              {primary.label}
            </ButtonLink>
            {showWhatsApp ? (
              <ButtonLink href={company.whatsapp.href} surface="dark" variant="secondary" size="lg">
                <WhatsAppIcon className="size-5" />
                WhatsApp Our Team
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}
