import { company } from "@/content/company";
import {
  aboutLink,
  careersLink,
  consultation,
  contactLink,
  divisionLinks,
  divisionsLabel,
  homeLink,
  industrialLink,
  ourTeamLink,
  privacyLink,
  productsLink,
  projectsLink,
} from "@/content/navigation";
import { Container } from "@/components/ui/Container";
import { MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { SmartLink } from "@/components/ui/SmartLink";
import { LogoImage } from "./LogoImage";

const linkTone =
  "py-1.5 text-base text-white underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 hover:decoration-gold";
const linkClass = `inline-block ${linkTone}`;
const contactLinkClass = `flex items-start gap-3 ${linkTone}`;

/** Quick links, in order. Careers and Our team were added at the client's request (10 Nov 2026). */
const quickLinks = [homeLink, aboutLink, ourTeamLink, productsLink, projectsLink, careersLink, contactLink, consultation];

const headingClass = "mb-4 font-heading text-xs font-bold tracking-[0.16em] text-on-dark-muted uppercase";

/** Global footer on Charcoal Navy. Server component; no client JavaScript. */
export function SiteFooter() {
  return (
    <footer id="site-footer" data-surface="dark" className="bg-charcoal text-white">
      <Container className="py-section-sm">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand + tagline */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-5">
              <div className="shrink-0 bg-white p-1.5">
                <LogoImage sizes="96px" alt="Boom Multi Global logo" className="size-20" />
              </div>
              <p className="font-heading text-sm leading-tight font-extrabold tracking-[0.14em]">
                BOOM
                <span className="block font-bold tracking-[0.2em] text-on-dark-muted">MULTI GLOBAL</span>
              </p>
            </div>
            <p className="mt-8 font-heading text-h3 leading-tight font-extrabold tracking-tight">
              <span className="block h-0.5 w-12 bg-gold" aria-hidden="true" />
              <span className="sr-only">{company.tagline}</span>
              <span aria-hidden="true" className="mt-5 block uppercase">
                {company.taglineWords.map((word) => (
                  <span key={word} className="block">
                    {word}
                  </span>
                ))}
              </span>
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-2 lg:col-span-5">
            <div>
              <h2 className={headingClass}>Quick links</h2>
              <ul>
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <SmartLink href={link.href} className={linkClass}>
                      {link.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className={headingClass}>{divisionsLabel}</h2>
              <ul>
                {divisionLinks.map((link) => (
                  <li key={link.href}>
                    <SmartLink href={link.href} className={linkClass}>
                      {link.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-line-on-dark pt-5">
                <h2 className={headingClass}>Additional offering</h2>
                <SmartLink href={industrialLink.href} className={linkClass}>
                  {industrialLink.label}
                </SmartLink>
              </div>
            </div>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h2 className={headingClass}>Contact</h2>
            <address className="space-y-4 text-base not-italic">
              <p className="flex gap-3">
                <MapPinIcon className="mt-1 size-5 shrink-0 text-gold" />
                <span>
                  {company.address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </p>
              <p>
                <SmartLink href={company.phone.href} className={contactLinkClass}>
                  <PhoneIcon className="mt-0.5 size-5 shrink-0 text-gold" />
                  {company.phone.display}
                </SmartLink>
              </p>
              <p>
                <SmartLink href={company.whatsapp.href} className={contactLinkClass}>
                  <WhatsAppIcon className="mt-0.5 size-5 shrink-0 text-gold" />
                  <span>
                    <span className="block text-sm text-on-dark-muted">WhatsApp</span>
                    {company.whatsapp.display}
                  </span>
                </SmartLink>
              </p>
            </address>
          </div>
        </div>
      </Container>

      <div className="border-t border-line-on-dark">
        <Container className="flex flex-col gap-2 py-6 text-sm text-on-dark-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {company.copyrightYear} {company.legalName}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <SmartLink href={privacyLink.href} className="py-1.5 text-white underline decoration-gold decoration-1 underline-offset-4 transition-colors hover:text-gold">
              {privacyLink.label}
            </SmartLink>
            <span>{company.website}</span>
          </p>
        </Container>
      </div>
    </footer>
  );
}
