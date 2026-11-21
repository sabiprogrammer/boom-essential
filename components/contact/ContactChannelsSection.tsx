import type { CSSProperties, ReactNode } from "react";
import { company } from "@/content/company";
import { contactContent } from "@/content/contact";
import { Container } from "@/components/ui/Container";
import { MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartLink } from "@/components/ui/SmartLink";

const linkStyles =
  "inline-block font-heading text-h3 font-extrabold text-navy underline decoration-navy/30 decoration-1 underline-offset-8 transition-colors duration-200 hover:decoration-gold";

function Channel({ icon, label, note, index, wide = false, children }: { icon: ReactNode; label: string; note: string; index: number; wide?: boolean; children: ReactNode }) {
  return (
    <li
      className={`reveal border-t-2 border-navy py-8 lg:py-10 ${wide ? "lg:col-span-3 lg:mt-0" : index === 0 ? "lg:pr-10" : "lg:border-l lg:border-l-line-strong lg:px-10"}`}
      style={{ "--i": index } as CSSProperties}
    >
      <span className="grid size-14 place-items-center border-2 border-navy text-navy">{icon}</span>
      <h3 className="mt-6 text-h2 font-extrabold text-navy uppercase">{label}</h3>
      <p className="mt-1 font-heading text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">{note}</p>
      <div className="mt-6">{children}</div>
    </li>
  );
}

/**
 * The confirmed contact channels (office, phone and WhatsApp, with the general enquiries email as a full-width row below). The office
 * has no map, link or opening hours, and no social account is shown: none has been supplied.
 */
export function ContactChannelsSection() {
  const { eyebrow, heading, visit, call, whatsapp, email, agents } = contactContent.channels;

  return (
    <Section tone="white" space="lg" aria-labelledby="contact-channels-heading">
      <Container>
        <div className="reveal">
          <SectionHeading id="contact-channels-heading" eyebrow={eyebrow} title={heading} />
        </div>

        <ul className="mt-14 grid lg:mt-20 lg:grid-cols-3">
          <Channel index={0} icon={<MapPinIcon className="size-7" />} label={visit.label} note={visit.note}>
            <address className="text-lead leading-relaxed text-charcoal not-italic">
              {company.address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </Channel>

          <Channel index={1} icon={<PhoneIcon className="size-7" />} label={call.label} note={call.note}>
            <SmartLink href={company.phone.href} className={linkStyles}>
              {company.phone.display}
            </SmartLink>
          </Channel>

          <Channel index={2} icon={<WhatsAppIcon className="size-7" />} label={whatsapp.label} note={whatsapp.note}>
            <SmartLink href={company.whatsapp.href} className={linkStyles}>
              {company.whatsapp.display}
            </SmartLink>
          </Channel>

          <Channel index={3} wide icon={<MailIcon className="size-7" />} label={email.label} note={email.note}>
            <SmartLink href={company.email.general.href} className={`${linkStyles} [overflow-wrap:anywhere]`}>
              {company.email.general.display}
            </SmartLink>
          </Channel>
        </ul>

        <p className="reveal mt-10 text-lead text-charcoal">{agents}</p>

        <p className="reveal mt-12 border-t border-line-strong pt-6 font-heading text-sm font-bold text-ink-muted">
          {contactContent.company.legalName} <span aria-hidden="true">&middot;</span> {contactContent.company.website}
        </p>
      </Container>
    </Section>
  );
}
