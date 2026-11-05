"use client";

import { PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { buildContactActions, type ContactDetails } from "@/lib/dashboard-preview/contact-actions";
import { contactActionsMode } from "@/lib/dashboard-preview/contact-mode";
import { useNotice } from "./NoticeProvider";

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
 * Call and WhatsApp for one customer. The same control serves the enquiry table, the lists and both drawers.
 *
 * Demo mode (lib/dashboard-preview/contact-mode.ts): both are buttons that only explain what will happen in
 * a notification. They never open the dialler or WhatsApp and make no request.
 * Live mode: they are real links built by buildContactActions(): `tel:` and `https://wa.me/...` with a
 * prefilled message the administrator must still send themselves. A missing or invalid number gives a
 * disabled control, never a link.
 */
export function ContactActions({ details, variant = "compact" }: { details: ContactDetails; variant?: Variant }) {
  const notice = useNotice();
  const style = styles[variant];
  const label = labels[variant];
  const who = details.name;

  if (contactActionsMode === "demo") {
    const links = buildContactActions(details);
    return (
      <div className={variant === "prominent" ? "grid gap-3 sm:grid-cols-2" : "flex items-center gap-2"}>
        <button
          type="button"
          className={style.call}
          onClick={() =>
            notice.show({
              title: "Calling is not active in the demo",
              body: `No call was started. Real calling will be available once actual customer contact records are connected, and "Call" will then dial ${who} directly.`,
            })
          }
        >
          <PhoneIcon className={style.icon} />
          {label.call}
          <span className="sr-only"> ({who}, demo)</span>
        </button>
        <button
          type="button"
          className={style.whatsapp}
          onClick={() =>
            notice.show({
              title: "WhatsApp is not active in the demo",
              body: "WhatsApp was not opened. Once real customer contact records are connected, this opens a chat with the message below ready for you to read and send yourself.",
              quote: links.message,
            })
          }
        >
          <WhatsAppIcon className={style.icon} />
          {label.whatsapp}
          <span className="sr-only"> ({who}, demo)</span>
        </button>
      </div>
    );
  }

  const links = buildContactActions(details);
  const disabled = (text: string, cls: string, Icon: typeof PhoneIcon) => (
    <span role="link" aria-disabled="true" title="No valid phone number on record" className={cls}>
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
        disabled(label.call, style.call, PhoneIcon)
      )}
      {links.whatsapp ? (
        <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className={style.whatsapp}>
          <WhatsAppIcon className={style.icon} />
          {label.whatsapp}
          <span className="sr-only"> {who} (opens in a new tab)</span>
        </a>
      ) : (
        disabled(label.whatsapp, style.whatsapp, WhatsAppIcon)
      )}
    </div>
  );
}
