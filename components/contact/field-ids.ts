import type { FieldKey } from "@/lib/enquiry/types";

/** The element each field's error links to (and receives focus), so the error summary can jump to it. */
export const fieldIds: Record<FieldKey, string> = {
  fullName: "enquiry-full-name",
  phone: "enquiry-phone",
  email: "enquiry-email",
  organisation: "enquiry-organisation",
  location: "enquiry-location",
  category: "enquiry-category-general",
  message: "enquiry-message",
  preferredDate: "enquiry-date",
  preferredTime: "enquiry-time",
};
