import type { CSSProperties } from "react";
import { aboutContent } from "@/content/about";
import { company } from "@/content/company";
import { contactLink } from "@/content/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SmartLink } from "@/components/ui/SmartLink";

const contactLinkStyles =
  "inline-flex items-center gap-3 font-heading text-h3 font-bold text-white underline decoration-white/30 decoration-1 underline-offset-8 transition-colors duration-200 hover:decoration-gold";

/** Closing call to action on Deep Navy: headline on the left, actions and direct contact on the right. */
export function AboutClosingSection() {
  const { eyebrow, heading, lead } = aboutContent.closing;

  return (
    <Section tone="navy" space="lg" aria-labelledby="about-closing-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-x-16">
          <div className="reveal lg:col-span-7">
            <p className="mb-6 flex items-center gap-3 font-heading text-xs font-bold tracking-[0.16em] uppercase">
              <span aria-hidden="true" className="h-0.5 w-8 bg-gold" />
              {eyebrow}
            </p>
            <h2 id="about-closing-heading" className="text-[clamp(2.25rem,1.3rem+3.6vw,4.25rem)] leading-[1.06] font-extrabold text-balance text-white">
              {heading}
            </h2>
            <p className="mt-7 max-w-xl text-lead text-on-dark-muted">{lead}</p>
          </div>

          <div className="reveal lg:col-span-5" style={{ "--i": 1 } as CSSProperties}>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap lg:flex-col lg:items-stretch">
              <ButtonLink href="/#divisions" surface="dark" size="lg" arrow>
                Explore Our Solutions
              </ButtonLink>
              <ButtonLink href={contactLink.href} surface="dark" variant="secondary" size="lg">
                {contactLink.label}
              </ButtonLink>
              <ButtonLink href={company.whatsapp.href} surface="dark" variant="secondary" size="lg">
                <WhatsAppIcon className="size-5" />
                WhatsApp Us
              </ButtonLink>
            </div>

            <dl className="mt-10 grid gap-6 border-t border-line-on-dark pt-8">
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
        </div>
      </Container>
    </Section>
  );
}
