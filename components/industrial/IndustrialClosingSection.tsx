import { industrialContent, industrialEnquiryHref } from "@/content/industrial-equipment";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SmartLink } from "@/components/ui/SmartLink";

const contactLinkStyles =
  "inline-flex items-center gap-3 font-heading text-h3 font-bold text-white underline decoration-white/30 decoration-1 underline-offset-8 transition-colors duration-200 hover:decoration-gold";

/** Closing call to action on Deep Navy. */
export function IndustrialClosingSection() {
  const { eyebrow, heading, copy, primaryCta, secondaryCta } = industrialContent.closing;
  const { phone, whatsapp, email } = industrialContent.contact;

  return (
    <Section tone="navy" space="lg" aria-labelledby="industrial-closing-heading">
      <Container>
        <div className="reveal max-w-3xl">
          <p className="mb-6 flex items-center gap-3 font-heading text-xs font-bold tracking-[0.16em] uppercase">
            <span aria-hidden="true" className="h-0.5 w-8 bg-gold" />
            {eyebrow}
          </p>
          <h2
            id="industrial-closing-heading"
            className="text-[clamp(2.25rem,1.3rem+3.6vw,4.25rem)] leading-[1.06] font-extrabold text-balance text-white"
          >
            {heading}
          </h2>
          <p className="mt-7 max-w-xl text-lead text-on-dark-muted">{copy}</p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <ButtonLink href={industrialEnquiryHref()} surface="dark" size="lg" arrow>
              {primaryCta}
            </ButtonLink>
            <ButtonLink href={whatsapp.href} surface="dark" variant="secondary" size="lg">
              <WhatsAppIcon className="size-5" />
              {secondaryCta}
            </ButtonLink>
          </div>
        </div>

        <dl className="reveal mt-14 grid gap-8 border-t border-line-on-dark pt-10 sm:grid-cols-2 lg:mt-16 lg:max-w-3xl">
          <div>
            <dt className="mb-2 font-heading text-xs font-bold tracking-[0.16em] text-on-dark-muted uppercase">Main phone</dt>
            <dd>
              <SmartLink href={phone.href} className={contactLinkStyles}>
                <PhoneIcon className="size-6 text-gold" />
                {phone.display}
              </SmartLink>
            </dd>
          </div>
          <div>
            <dt className="mb-2 font-heading text-xs font-bold tracking-[0.16em] text-on-dark-muted uppercase">WhatsApp</dt>
            <dd>
              <SmartLink href={whatsapp.href} className={contactLinkStyles}>
                <WhatsAppIcon className="size-6 text-gold" />
                {whatsapp.display}
              </SmartLink>
            </dd>
          </div>
          <div>
            <dt className="mb-2 font-heading text-xs font-bold tracking-[0.16em] text-on-dark-muted uppercase">Email</dt>
            <dd>
              <SmartLink href={email.href} className={contactLinkStyles}>
                <MailIcon className="size-6 text-gold" />
                <span className="min-w-0 [overflow-wrap:anywhere]">{email.display}</span>
              </SmartLink>
            </dd>
          </div>
        </dl>
      </Container>

    </Section>
  );
}
