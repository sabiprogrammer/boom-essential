import type { CSSProperties } from "react";
import { company } from "@/content/company";
import { securityAssessmentHref, securityContent } from "@/content/security";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SmartLink } from "@/components/ui/SmartLink";
import { Viewfinder } from "./Viewfinder";

const contactLinkStyles =
  "inline-flex items-center gap-3 font-heading text-h3 font-bold text-white underline decoration-white/30 decoration-1 underline-offset-8 transition-colors duration-200 hover:decoration-gold";

const meshStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(rgb(255 255 255 / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.05) 1px, transparent 1px)",
  backgroundSize: "2.5rem 2.5rem",
};

/** Closing call to action on Deep Navy with a large viewfinder frame settling around the headline block. */
export function SecurityClosingSection() {
  const { eyebrow, heading, copy, primaryCta, secondaryCta } = securityContent.closing;

  return (
    <Section tone="navy" space="lg" aria-labelledby="security-closing-heading" className="relative isolate" style={meshStyle}>
      <Container>
        <div className="relative px-0 sm:px-10 sm:py-12 lg:px-16 lg:py-16">
          <div className="lock-on absolute inset-0 hidden sm:block" style={{ "--delay": "200ms" } as CSSProperties}>
            <Viewfinder cornerClassName="size-8 border-2 lg:size-10" />
          </div>

          <div className="reveal max-w-3xl">
            <p className="mb-6 flex items-center gap-3 font-heading text-xs font-bold tracking-[0.16em] uppercase">
              <span aria-hidden="true" className="h-0.5 w-8 bg-gold" />
              {eyebrow}
            </p>
            <h2
              id="security-closing-heading"
              className="text-[clamp(2.25rem,1.3rem+3.6vw,4.25rem)] leading-[1.06] font-extrabold text-balance text-white"
            >
              {heading}
            </h2>
            <p className="mt-7 max-w-xl text-lead text-on-dark-muted">{copy}</p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <ButtonLink href={securityAssessmentHref} surface="dark" size="lg" arrow>
                {primaryCta}
              </ButtonLink>
              <ButtonLink href={company.whatsapp.href} surface="dark" variant="secondary" size="lg">
                <WhatsAppIcon className="size-5" />
                {secondaryCta}
              </ButtonLink>
            </div>
          </div>

          <dl className="reveal mt-14 grid gap-8 border-t border-line-on-dark pt-10 sm:grid-cols-2 lg:mt-16 lg:max-w-3xl">
            <div>
              <dt className="mb-2 font-heading text-xs font-bold tracking-[0.16em] text-on-dark-muted uppercase">Main phone</dt>
              <dd>
                <SmartLink href={company.phone.href} className={contactLinkStyles}>
                  <PhoneIcon className="size-6 text-gold" />
                  {company.phone.display}
                </SmartLink>
              </dd>
            </div>
            <div>
              <dt className="mb-2 font-heading text-xs font-bold tracking-[0.16em] text-on-dark-muted uppercase">WhatsApp</dt>
              <dd>
                <SmartLink href={company.whatsapp.href} className={contactLinkStyles}>
                  <WhatsAppIcon className="size-6 text-gold" />
                  {company.whatsapp.display}
                </SmartLink>
              </dd>
            </div>
          </dl>
        </div>
      </Container>
    </Section>
  );
}
