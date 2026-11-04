import { Button } from "@/components/ui/Button";
import type { EnquiryType } from "@/lib/enquiry/types";

type SubmitBarProps = {
  type: EnquiryType;
  submitting: boolean;
};

/**
 * The form's submit area. A visible badge states whether this will be an enquiry or an appointment request,
 * the button label changes to match, and a spinner with a disabled state shows the in-progress submission
 * the future backend call will use.
 */
export function SubmitBar({ type, submitting }: SubmitBarProps) {
  const appointment = type === "appointment_request";

  return (
    <div className="flex flex-col gap-5 border-t-2 border-navy pt-8 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-heading text-sm font-bold text-navy">
        <span className="mr-2 text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">Type</span>
        <span className={`inline-block border px-2.5 py-1 ${appointment ? "border-navy bg-navy text-white" : "border-line-strong bg-white"}`}>
          {appointment ? "Appointment request" : "Enquiry"}
        </span>
      </p>

      <Button type="submit" size="lg" disabled={submitting} aria-busy={submitting}>
        {submitting ? (
          <>
            <span aria-hidden="true" className="size-4 rounded-full border-2 border-white/40 border-t-white motion-safe:animate-spin" />
            Submitting&hellip;
          </>
        ) : appointment ? (
          "Request Appointment"
        ) : (
          "Send Enquiry"
        )}
      </Button>
    </div>
  );
}
