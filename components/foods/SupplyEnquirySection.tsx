import type { CSSProperties } from "react";
import { foodsContent, foodsEnquiryHref } from "@/content/foods";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon, MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SmartLink } from "@/components/ui/SmartLink";

const rowStyles =
  "group/channel flex items-center justify-between gap-6 border-b border-line-strong py-6 transition-colors duration-300 hover:border-green sm:py-7";

/**
 * Supply and enquiries on a soft green surface: what to tell the team beside three ways to reach it
 * (the enquiry route, WhatsApp, phone). Enquiry only: no prices, checkout, payments or accounts.
 */
export function SupplyEnquirySection() {
  const { eyebrow, heading, copy, tellUs, tellUsLabel, channelsLabel, enquireOnline } = foodsContent.supply;
  const { phone, whatsapp, email } = foodsContent.contact;

  return (
    <Section tone="leaf" space="lg" id="enquiry" aria-labelledby="foods-supply-heading">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-20">
          <div className="reveal lg:col-span-6">
            <p className="mb-5 flex items-center gap-3 font-heading text-xs font-bold tracking-[0.16em] text-green uppercase">
              <span aria-hidden="true" className="h-0.5 w-8 bg-gold" />
              {eyebrow}
            </p>
            <h2 id="foods-supply-heading" className="text-h1 font-extrabold text-navy">
              {heading}
            </h2>
            <p className="mt-6 max-w-lg text-lead text-charcoal">{copy}</p>

            <h3 className="mt-12 font-heading text-xs font-bold tracking-[0.16em] text-green uppercase">{tellUsLabel}</h3>
            <ol className="mt-4 border-t-2 border-green">
              {tellUs.map((item, index) => (
                <li key={item} className="flex items-baseline gap-5 border-b border-line-strong py-4">
                  <span aria-hidden="true" className="font-heading text-sm font-bold tracking-[0.16em] text-green">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-heading text-lg font-bold text-navy">{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="reveal lg:col-span-6 lg:pt-4" style={{ "--i": 1 } as CSSProperties}>
            <h3 className="font-heading text-xs font-bold tracking-[0.16em] text-green uppercase">{channelsLabel}</h3>
            <ul className="mt-4 border-t-2 border-green">
              <li>
                <SmartLink href={foodsEnquiryHref()} className={rowStyles}>
                  <span>
                    <span className="block font-heading text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">Website</span>
                    <span className="mt-1 block font-heading text-h3 font-extrabold text-navy">{enquireOnline}</span>
                  </span>
                  <ArrowRightIcon className="size-6 shrink-0 text-green transition-transform duration-300 group-hover/channel:translate-x-1" />
                </SmartLink>
              </li>
              <li>
                <SmartLink href={whatsapp.href} className={rowStyles}>
                  <span>
                    <span className="block font-heading text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">WhatsApp</span>
                    <span className="mt-1 block font-heading text-h3 font-extrabold text-navy">{whatsapp.display}</span>
                  </span>
                  <WhatsAppIcon className="size-7 shrink-0 text-green" />
                </SmartLink>
              </li>
              <li>
                <SmartLink href={phone.href} className={rowStyles}>
                  <span>
                    <span className="block font-heading text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">Main phone</span>
                    <span className="mt-1 block font-heading text-h3 font-extrabold text-navy">{phone.display}</span>
                  </span>
                  <PhoneIcon className="size-7 shrink-0 text-green" />
                </SmartLink>
              </li>
              <li>
                <SmartLink href={email.href} className={rowStyles}>
                  <span className="min-w-0">
                    <span className="block font-heading text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">Email</span>
                    <span className="mt-1 block font-heading text-h3 font-extrabold text-navy [overflow-wrap:anywhere]">{email.display}</span>
                  </span>
                  <MailIcon className="size-7 shrink-0 text-green" />
                </SmartLink>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
