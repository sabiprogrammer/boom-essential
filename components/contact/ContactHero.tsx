import type { CSSProperties } from "react";
import { company } from "@/content/company";
import { contactContent } from "@/content/contact";
import { categoryEnquiryHref, enquiryCategories } from "@/content/enquiry-options";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SmartLink } from "@/components/ui/SmartLink";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

const divisionCategories = enquiryCategories.filter((category) => category.query?.param === "division");
const additionalCategories = enquiryCategories.filter((category) => category.query?.param === "offering");

/**
 * Contact hero on Deep Navy. Headline and actions on the left; on the right a ruled index of what the team
 * can help with. Each row is a link that opens the enquiry form below with that category already chosen.
 */
export function ContactHero() {
  const { eyebrow, heading, copy, primaryCta, secondaryCta, indexLabel, divisionsLabel, additionalLabel } = contactContent.hero;

  return (
    <section
      data-surface="dark"
      aria-labelledby="contact-heading"
      className="relative isolate overflow-hidden bg-navy py-16 text-white sm:py-20 lg:py-24"
    >
      <span aria-hidden="true" className="absolute top-0 left-0 h-1.5 w-24 bg-gold" />

      <Container>
        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="rise flex items-center gap-3 font-heading text-xs font-bold tracking-[0.18em] uppercase" style={delay(0)}>
              <span aria-hidden="true" className="h-0.5 w-10 shrink-0 bg-gold" />
              {eyebrow}
            </p>
            <h1
              id="contact-heading"
              className="rise mt-7 text-[clamp(2.5rem,1rem+5vw,5rem)] leading-[1.04] font-extrabold text-balance text-white"
              style={delay(120)}
            >
              {heading}
            </h1>
            <p className="rise mt-8 max-w-xl text-lead text-on-dark-muted" style={delay(260)}>
              {copy}
            </p>
            <div className="rise mt-10 flex flex-col gap-4 sm:flex-row" style={delay(400)}>
              <ButtonLink href="#enquiry" surface="dark" size="lg" arrow>
                {primaryCta}
              </ButtonLink>
              <ButtonLink href={company.whatsapp.href} surface="dark" variant="secondary" size="lg">
                {secondaryCta}
              </ButtonLink>
            </div>
          </div>

          <div className="rise lg:col-span-5" style={delay(300)}>
            <p className="font-heading text-xs font-bold tracking-[0.16em] text-on-dark-muted uppercase">{indexLabel}</p>

            <p className="mt-5 font-heading text-xs font-bold tracking-[0.16em] text-gold uppercase">{divisionsLabel}</p>
            <ol className="mt-2 border-t-2 border-gold">
              {divisionCategories.map((category, index) => (
                <li key={category.id} className="border-b border-line-on-dark">
                  <SmartLink
                    href={categoryEnquiryHref(category.id)}
                    className="group/row flex items-center gap-5 py-4 transition-colors duration-200 hover:bg-white/5"
                  >
                    <span aria-hidden="true" className="w-6 font-heading text-sm font-bold tracking-[0.16em] text-gold tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <span className="block font-heading text-lg font-extrabold text-white">{category.label}</span>
                      <span className="block text-sm text-on-dark-muted">{category.hint}</span>
                    </span>
                    <ArrowRightIcon className="size-5 text-gold transition-transform duration-300 group-hover/row:translate-x-1" />
                  </SmartLink>
                </li>
              ))}
            </ol>

            <p className="mt-6 font-heading text-xs font-bold tracking-[0.16em] text-gold uppercase">{additionalLabel}</p>
            <ul className="mt-2 border-t border-dashed border-white/50">
              {additionalCategories.map((category) => (
                <li key={category.id} className="border-b border-dashed border-white/50">
                  <SmartLink
                    href={categoryEnquiryHref(category.id)}
                    className="group/row flex items-center gap-5 py-4 transition-colors duration-200 hover:bg-white/5"
                  >
                    <span className="flex-1">
                      <span className="block font-heading text-lg font-extrabold text-white">{category.label}</span>
                    </span>
                    <ArrowRightIcon className="size-5 text-gold transition-transform duration-300 group-hover/row:translate-x-1" />
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
