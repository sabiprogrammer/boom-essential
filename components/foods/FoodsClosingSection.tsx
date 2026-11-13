import { foodsContent, foodsEnquiryHref } from "@/content/foods";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SmartLink } from "@/components/ui/SmartLink";
import { TextLink } from "@/components/ui/TextLink";
import { fieldStripes } from "./field-stripes";

const contactLinkStyles =
  "inline-flex items-center gap-3 font-heading text-h3 font-bold text-white underline decoration-white/40 decoration-1 underline-offset-8 transition-colors duration-200 hover:decoration-gold";

/** Closing call to action on Agricultural Green with field stripes: enquire, WhatsApp, contact and both numbers. */
export function FoodsClosingSection() {
  const { eyebrow, heading, primaryCta, secondaryCta, contactCta, contactHref } = foodsContent.closing;
  const { phone, whatsapp, email } = foodsContent.contact;

  return (
    <Section tone="green" space="lg" aria-labelledby="foods-closing-heading" className="relative isolate" style={fieldStripes(0.1)}>
      <Container>
        <div className="reveal max-w-3xl">
          <p className="mb-6 flex items-center gap-3 font-heading text-xs font-bold tracking-[0.16em] uppercase">
            <span aria-hidden="true" className="h-0.5 w-8 bg-gold" />
            {eyebrow}
          </p>
          <h2
            id="foods-closing-heading"
            className="text-[clamp(2.25rem,1.3rem+3.6vw,4.25rem)] leading-[1.06] font-extrabold text-balance text-white"
          >
            {heading}
          </h2>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <ButtonLink href={foodsEnquiryHref()} surface="dark" size="lg" arrow>
              {primaryCta}
            </ButtonLink>
            <ButtonLink href={whatsapp.href} surface="dark" variant="secondary" size="lg">
              <WhatsAppIcon className="size-5" />
              {secondaryCta}
            </ButtonLink>
          </div>
          <p className="mt-6">
            <TextLink href={contactHref} surface="dark" arrow>
              {contactCta}
            </TextLink>
          </p>
        </div>

        <dl className="reveal mt-14 grid gap-8 border-t border-white/35 pt-10 sm:grid-cols-2 lg:mt-16 lg:max-w-3xl">
          <div>
            <dt className="mb-2 font-heading text-xs font-bold tracking-[0.16em] text-white uppercase">Main phone</dt>
            <dd>
              <SmartLink href={phone.href} className={contactLinkStyles}>
                <PhoneIcon className="size-6" />
                {phone.display}
              </SmartLink>
            </dd>
          </div>
          <div>
            <dt className="mb-2 font-heading text-xs font-bold tracking-[0.16em] text-white uppercase">WhatsApp</dt>
            <dd>
              <SmartLink href={whatsapp.href} className={contactLinkStyles}>
                <WhatsAppIcon className="size-6" />
                {whatsapp.display}
              </SmartLink>
            </dd>
          </div>
          <div>
            <dt className="mb-2 font-heading text-xs font-bold tracking-[0.16em] text-white uppercase">Email</dt>
            <dd>
              <SmartLink href={email.href} className={contactLinkStyles}>
                <MailIcon className="size-6" />
                <span className="min-w-0 [overflow-wrap:anywhere]">{email.display}</span>
              </SmartLink>
            </dd>
          </div>
        </dl>
      </Container>
    </Section>
  );
}
