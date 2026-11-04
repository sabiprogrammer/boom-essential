import { company } from "@/content/company";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";

type ContactActionsProps = {
  surface?: "light" | "dark";
  className?: string;
};

/** The two direct contact options (call and WhatsApp), used wherever the form cannot yet take an enquiry. */
export function ContactActions({ surface = "light", className = "" }: ContactActionsProps) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      <ButtonLink href={company.phone.href} surface={surface}>
        <PhoneIcon className="size-5" />
        Call {company.phone.display}
      </ButtonLink>
      <ButtonLink href={company.whatsapp.href} surface={surface} variant="secondary">
        <WhatsAppIcon className="size-5" />
        WhatsApp {company.whatsapp.display}
      </ButtonLink>
    </div>
  );
}
