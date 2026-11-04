/**
 * Whether enquiry submission is connected to a backend. It is NOT yet. While false, the form validates and
 * then shows a clear "development preview" notice pointing visitors to phone and WhatsApp. It never reports
 * success and nothing is stored or sent. Set to true only when the secure server-side handler exists
 * (see lib/enquiry/submit.ts).
 */
export const enquirySubmissionEnabled = false;
