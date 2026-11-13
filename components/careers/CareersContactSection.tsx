import { careersContent } from "@/content/careers";
import { contactLink } from "@/content/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";

/** The one thing the Careers page says: no vacancies are listed, and how to ask. */
export function CareersContactSection() {
  const { eyebrow, heading, copy, callLabel, whatsappLabel, contactPageLabel } = careersContent.opportunities;
  const { phone, whatsapp, email } = careersContent.contact;

  return (
    <Section tone="light" space="lg" aria-labelledby="careers-opportunities-heading">
      <Container>
        <div className="reveal max-w-3xl">
          <SectionHeading id="careers-opportunities-heading" eyebrow={eyebrow} title={heading} lead={copy} />

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <ButtonLink href={phone.href} size="lg">
              <PhoneIcon className="size-5" />
              {callLabel}: {phone.display}
            </ButtonLink>
            <ButtonLink href={whatsapp.href} variant="secondary" size="lg">
              <WhatsAppIcon className="size-5" />
              {whatsappLabel}
            </ButtonLink>
            <ButtonLink href={email.href} variant="secondary" size="lg">
              <MailIcon className="size-5" />
              {email.display}
            </ButtonLink>
          </div>

          <p className="mt-8">
            <TextLink href={contactLink.href} arrow>
              {contactPageLabel}
            </TextLink>
          </p>
        </div>
      </Container>
    </Section>
  );
}
