import { company } from "@/content/company";
import { privacyContent } from "@/content/privacy";
import { SmartLink } from "@/components/ui/SmartLink";

const link = "font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:text-navy-hover";

/**
 * The company's contact details for privacy matters, with working links: the privacy email address first (that is where
 * requests about personal information go), then general enquiries, phone, WhatsApp and the office address. All values
 * come from content/company.ts, the single source of confirmed company facts.
 */
export function PrivacyContact() {
  const labels = privacyContent.contact;

  return (
    <section aria-label={labels.heading} className="border border-line-strong bg-white p-6 shadow-panel sm:p-8">
      <p className="font-heading text-xs font-bold tracking-[0.14em] text-ink-muted uppercase">{labels.heading}</p>
      <p className="mt-1 font-heading text-lead font-extrabold text-navy">{company.legalName}</p>
      <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        <div>
          <dt className="font-heading text-xs font-bold tracking-[0.06em] text-ink-muted uppercase">{labels.privacyLabel}</dt>
          <dd className="mt-1 text-base break-words">
            <SmartLink href={company.email.privacy.href} className={link}>
              {company.email.privacy.display}
            </SmartLink>
          </dd>
        </div>
        <div>
          <dt className="font-heading text-xs font-bold tracking-[0.06em] text-ink-muted uppercase">{labels.generalLabel}</dt>
          <dd className="mt-1 text-base break-words">
            <SmartLink href={company.email.general.href} className={link}>
              {company.email.general.display}
            </SmartLink>
          </dd>
        </div>
        <div>
          <dt className="font-heading text-xs font-bold tracking-[0.06em] text-ink-muted uppercase">{labels.phoneLabel}</dt>
          <dd className="mt-1 text-base">
            <SmartLink href={company.phone.href} className={link}>
              {company.phone.display}
            </SmartLink>
          </dd>
        </div>
        <div>
          <dt className="font-heading text-xs font-bold tracking-[0.06em] text-ink-muted uppercase">{labels.whatsappLabel}</dt>
          <dd className="mt-1 text-base">
            <SmartLink href={company.whatsapp.href} className={link}>
              {company.whatsapp.display}
            </SmartLink>
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-heading text-xs font-bold tracking-[0.06em] text-ink-muted uppercase">{labels.addressLabel}</dt>
          <dd className="mt-1 text-base text-charcoal">
            <address className="not-italic">
              {company.address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </dd>
        </div>
      </dl>
    </section>
  );
}
