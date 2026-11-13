import { PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { buildCustomerContactLinks } from "@/lib/admin/enquiries/contact-links";
import type { EnquiryRecord } from "@/lib/admin/enquiries/types";

type Variant = "compact" | "prominent";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border font-heading font-semibold whitespace-nowrap select-none transition-[background-color,border-color,color,box-shadow] duration-150 active:translate-y-px aria-disabled:pointer-events-none aria-disabled:opacity-45";

const styles: Record<Variant, { call: string; whatsapp: string; icon: string }> = {
  compact: {
    call: `${base} h-10 px-3 text-sm border-line-strong bg-white text-navy hover:border-navy hover:bg-navy hover:text-white`,
    whatsapp: `${base} h-10 px-3 text-sm border-line-strong bg-white text-green hover:border-green hover:bg-green hover:text-white`,
    icon: "size-4",
  },
  prominent: {
    call: `${base} h-12 px-5 text-base border-navy bg-navy text-white hover:border-navy-hover hover:bg-navy-hover hover:shadow-raised`,
    whatsapp: `${base} h-12 px-5 text-base border-green bg-green text-white hover:border-green-hover hover:bg-green-hover hover:shadow-raised`,
    icon: "size-5",
  },
};

const labels: Record<Variant, { call: string; whatsapp: string }> = {
  compact: { call: "Call", whatsapp: "WhatsApp" },
  prominent: { call: "Call customer", whatsapp: "Message on WhatsApp" },
};

/**
 * Call and WhatsApp for one real customer. They are plain links: `tel:` opens the dialler, and `https://wa.me/...`
 * opens WhatsApp with a professional follow-up message ready in the box, which the administrator reads and sends
 * themselves (nothing is ever sent for them). A number the system cannot use gives a disabled control, never a link.
 */
export function EnquiryContactActions({ enquiry, variant = "compact" }: { enquiry: EnquiryRecord; variant?: Variant }) {
  const style = styles[variant];
  const label = labels[variant];
  const links = buildCustomerContactLinks(enquiry);
  const who = enquiry.fullName;

  const unavailable = (text: string, className: string, Icon: typeof PhoneIcon) => (
    <span role="link" aria-disabled="true" title="No usable phone number on record" className={className}>
      <Icon className={style.icon} />
      {text}
    </span>
  );

  return (
    <div className={variant === "prominent" ? "grid gap-3 sm:grid-cols-2" : "flex items-center gap-2"}>
      {links.call ? (
        <a href={links.call} className={style.call}>
          <PhoneIcon className={style.icon} />
          {label.call}
          <span className="sr-only"> {who}</span>
        </a>
      ) : (
        unavailable(label.call, style.call, PhoneIcon)
      )}
      {links.whatsapp ? (
        <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className={style.whatsapp}>
          <WhatsAppIcon className={style.icon} />
          {label.whatsapp}
          <span className="sr-only"> {who} (opens in a new tab)</span>
        </a>
      ) : (
        unavailable(label.whatsapp, style.whatsapp, WhatsAppIcon)
      )}
    </div>
  );
}
