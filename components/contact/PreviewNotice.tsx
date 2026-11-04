import { ContactActions } from "./ContactActions";

/**
 * Always-visible notice while the enquiry backend is not connected (`enquirySubmissionEnabled` is false in
 * lib/enquiry/config.ts). It tells visitors plainly that the form does not send anything yet and offers phone
 * and WhatsApp instead. Remove it by connecting the backend and flipping that flag.
 */
export function PreviewNotice() {
  return (
    <aside aria-labelledby="enquiry-preview-title" className="border-l-4 border-gold bg-navy p-5 text-white sm:p-6" data-surface="dark">
      <p id="enquiry-preview-title" className="font-heading text-xs font-bold tracking-[0.16em] text-gold uppercase">
        Development preview
      </p>
      <p className="mt-2 max-w-xl text-body text-white">
        This form is not connected yet, so enquiries are not being sent or saved. To reach our team now, please call or message us on WhatsApp.
      </p>
      <ContactActions surface="dark" className="mt-5" />
    </aside>
  );
}
