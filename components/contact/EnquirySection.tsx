import { Suspense } from "react";
import { contactContent } from "@/content/contact";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactActions } from "./ContactActions";
import { EnquiryForm } from "./EnquiryForm";
import { PrefilledEnquiryForm } from "./PrefilledEnquiryForm";

/**
 * The enquiry section (id="enquiry", offset below the sticky header). The page stays fully static: the form
 * that reads the URL sits inside Suspense, and its fallback is the same form in its blank state, so the
 * fields and the #appointment anchor exist in the first HTML and layout does not jump when the URL is read.
 */
export function EnquirySection() {
  const { eyebrow, heading, lead, sideLabel } = contactContent.enquiry;

  return (
    <Section tone="light" space="lg" id="enquiry" aria-labelledby="enquiry-heading" className="scroll-mt-16">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
            <SectionHeading id="enquiry-heading" eyebrow={eyebrow} title={heading} lead={lead} />
            <div className="mt-10 border-t border-line-strong pt-6">
              <p className="font-heading text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">{sideLabel}</p>
              <ContactActions className="mt-4 lg:flex-col" />
            </div>
          </div>

          <div className="lg:col-span-8">
            <Suspense fallback={<EnquiryForm initial={{ category: "", interests: [], appointmentRequested: false, prefilled: false }} />}>
              <PrefilledEnquiryForm />
            </Suspense>
          </div>
        </div>
      </Container>
    </Section>
  );
}
