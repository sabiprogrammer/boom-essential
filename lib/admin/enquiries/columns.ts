/**
 * The database columns the administrator screens read, written once so the enquiry and appointment queries cannot drift
 * apart. Nothing here is a secret and nothing here is ever written: these are SELECT lists only.
 */
export const ENQUIRY_COLUMNS =
  "id, reference, full_name, phone, phone_e164, email, organisation, location, division, requested_item, requested_service, message, status, source, created_at, updated_at";

export const APPOINTMENT_COLUMNS =
  "id, enquiry_id, rescheduled_from_id, status, preferred_date, preferred_time, timezone, confirmed_date, confirmed_time, confirmed_at, venue, scheduling_note, created_at";