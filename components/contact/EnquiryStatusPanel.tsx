import type { Ref } from "react";
import { Button } from "@/components/ui/Button";
import type { FormStatus } from "@/lib/enquiry/types";
import { ContactActions } from "./ContactActions";

type EnquiryStatusPanelProps = {
  status: FormStatus;
  panelRef: Ref<HTMLDivElement>;
  /** Starts a fresh, empty form after a successful submission. */
  onSendAnother: () => void;
};

/**
 * Feedback after a submit attempt. "success" is only ever passed in for a response the server confirmed (the
 * enquiry is saved and has a reference), and an appointment request says plainly that it is not a confirmed
 * booking. "error" keeps the visitor's entries and offers a retry and the direct contact options.
 */
export function EnquiryStatusPanel({ status, panelRef, onSendAnother }: EnquiryStatusPanelProps) {
  if (status.state === "idle" || status.state === "submitting") return null;

  if (status.state === "success") {
    return (
      <div ref={panelRef} tabIndex={-1} role="status" className="scroll-mt-32 border-l-4 border-green bg-leaf p-6 sm:p-8">
        <h3 className="font-heading text-h3 font-extrabold text-navy">
          {status.appointmentRequested ? "Your appointment request has been received" : "Your enquiry has been received"}
        </h3>
        <p className="mt-2 max-w-xl text-body text-charcoal">
          {status.appointmentRequested
            ? "Our team will review your request. It is not a confirmed booking until our team confirms it."
            : "Thank you. Our team will review your enquiry."}
        </p>
        <p className="mt-4 text-body text-charcoal">
          Your reference: <strong className="font-heading text-navy">{status.reference}</strong>
          <span className="block text-sm text-ink-muted">Please quote it if you contact us about this enquiry.</span>
        </p>
        <Button type="button" variant="secondary" className="mt-6" onClick={onSendAnother}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  return (
    <div ref={panelRef} tabIndex={-1} role="alert" className="scroll-mt-32 border-l-4 border-danger bg-danger-tint p-6">
      <h3 className="font-heading text-h3 font-extrabold text-danger">We could not send your enquiry</h3>
      <p className="mt-2 max-w-xl text-body text-charcoal">
        {status.message} Your details are still in the form, so you can try again, or contact us directly:
      </p>
      <ContactActions className="mt-5" />
    </div>
  );
}
