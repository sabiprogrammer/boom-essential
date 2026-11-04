import type { Ref } from "react";
import type { EnquiryType, FormStatus } from "@/lib/enquiry/types";
import { ContactActions } from "./ContactActions";

type EnquiryStatusPanelProps = {
  status: FormStatus;
  type: EnquiryType;
  panelRef: Ref<HTMLDivElement>;
};

/**
 * Feedback after a submit attempt. "preview" is the only outcome reachable today and states honestly that
 * nothing was sent. "success" and "error" are built for the backend stage: success must only ever be shown
 * for a confirmed server response, and an appointment request must say it is not yet confirmed.
 */
export function EnquiryStatusPanel({ status, type, panelRef }: EnquiryStatusPanelProps) {
  if (status.state === "idle" || status.state === "submitting") return null;

  if (status.state === "success") {
    return (
      <div ref={panelRef} tabIndex={-1} role="status" className="scroll-mt-32 border-l-4 border-green bg-leaf p-6">
        <h3 className="font-heading text-h3 font-extrabold text-navy">
          {type === "appointment_request" ? "Your appointment request has been received" : "Your enquiry has been received"}
        </h3>
        <p className="mt-2 max-w-xl text-body text-charcoal">
          {type === "appointment_request"
            ? "Our team will review your request. It is not a confirmed booking until our team confirms it."
            : "Thank you. Our team will review your enquiry."}
        </p>
      </div>
    );
  }

  if (status.state === "error") {
    return (
      <div ref={panelRef} tabIndex={-1} role="alert" className="scroll-mt-32 border-l-4 border-danger bg-danger-tint p-6">
        <h3 className="font-heading text-h3 font-extrabold text-danger">We could not send your enquiry</h3>
        <p className="mt-2 max-w-xl text-body text-charcoal">{status.message} Please contact us directly instead.</p>
        <ContactActions className="mt-5" />
      </div>
    );
  }

  return (
    <div ref={panelRef} tabIndex={-1} role="status" className="scroll-mt-32 border-l-4 border-gold bg-white p-6 shadow-raised">
      <h3 className="font-heading text-h3 font-extrabold text-navy">Your details look complete, but this form is still a preview.</h3>
      <p className="mt-2 max-w-xl text-body text-charcoal">
        Your {type === "appointment_request" ? "appointment request" : "enquiry"} has <strong>not</strong> been sent and nothing has been saved. Please contact our team directly:
      </p>
      <ContactActions className="mt-5" />
    </div>
  );
}
