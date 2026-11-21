import { company } from "@/content/company";
import { closingTagline } from "@/content/company-profile";
import { consultation } from "@/content/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SmartLink } from "@/components/ui/SmartLink";
import { TextLink } from "@/components/ui/TextLink";
import { SwooshMark } from "./SwooshMark";

/** Closing call to action on Deep Navy. The swoosh motif returns here to close the page. */
export function ClosingContactSection() {
  return (
    <Section tone="navy" space="lg" aria-labelledby="closing-heading" className="relative isolate overflow-hidden">
      <SwooshMark className="pointer-events-none absolute right-0 bottom-0 -z-10 hidden w-[44%] text-gold lg:block" />

      <Container>
        <div className="reveal max-w-3xl">
          <p className="mb-6 flex items-center gap-3 font-heading text-xs font-bold tracking-[0.16em] uppercase">
            <span aria-hidden="true" className="h-0.5 w-8 bg-gold" />
            Get in touch
          </p>
          <h2 id="closing-heading" className="text-h1 font-extrabold text-white sm:text-display">
            Let&rsquo;s Talk About What You Need.
          </h2>
          <p className="mt-7 max-w-xl text-lead text-on-dark-muted">
            Tell us about your energy, security, food or equipment requirements.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <ButtonLink href={consultation.href} surface="dark" size="lg" arrow>
              {consultation.label}
            </ButtonLink>
            <ButtonLink href={company.whatsapp.href} surface="dark" variant="secondary" size="lg">
              <WhatsAppIcon className="size-5" />
              WhatsApp Us
            </ButtonLink>
          </div>
          <p className="mt-10 font-heading text-sm font-bold tracking-[0.14em] text-gold uppercase">{closingTagline}</p>
          <p className="mt-6">
            <TextLink href="/contact" surface="dark" arrow>
              Contact Us
            </TextLink>
          </p>
        </div>

        <dl className="reveal mt-16 grid gap-8 border-t border-line-on-dark pt-10 sm:grid-cols-2 lg:mt-20 lg:max-w-3xl">
          <div>
            <dt className="mb-2 font-heading text-xs font-bold tracking-[0.16em] text-on-dark-muted uppercase">Main phone</dt>
            <dd>
              <SmartLink
                href={company.phone.href}
                className="inline-flex items-center gap-3 font-heading text-h3 font-bold text-white underline decoration-white/30 decoration-1 underline-offset-8 transition-colors duration-200 hover:decoration-gold"
              >
                <PhoneIcon className="size-6 text-gold" />
                {company.phone.display}
              </SmartLink>
            </dd>
          </div>
          <div>
            <dt className="mb-2 font-heading text-xs font-bold tracking-[0.16em] text-on-dark-muted uppercase">WhatsApp</dt>
            <dd>
              <SmartLink
                href={company.whatsapp.href}
                className="inline-flex items-center gap-3 font-heading text-h3 font-bold text-white underline decoration-white/30 decoration-1 underline-offset-8 transition-colors duration-200 hover:decoration-gold"
              >
                <WhatsAppIcon className="size-6 text-gold" />
                {company.whatsapp.display}
              </SmartLink>
            </dd>
          </div>
          <div>
            <dt className="mb-2 font-heading text-xs font-bold tracking-[0.16em] text-on-dark-muted uppercase">Email</dt>
            <dd>
              <SmartLink href={company.email.general.href} className="inline-flex items-center gap-3 font-heading text-h3 font-bold text-white underline decoration-white/30 decoration-1 underline-offset-8 transition-colors duration-200 hover:decoration-gold">
                <MailIcon className="size-6 text-gold" />
                <span className="min-w-0 [overflow-wrap:anywhere]">{company.email.general.display}</span>
              </SmartLink>
            </dd>
          </div>
        </dl>
      </Container>
    </Section>
  );
}
