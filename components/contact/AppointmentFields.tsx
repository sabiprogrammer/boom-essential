import type { AppointmentPreference, FieldErrors, FieldKey } from "@/lib/enquiry/types";
import { inputStyles } from "./field-styles";
import { FormField } from "./FormField";

type AppointmentFieldsProps = {
  appointment: AppointmentPreference;
  errors: FieldErrors;
  onToggle: (requested: boolean) => void;
  onChange: (field: "preferredDate" | "preferredTime", value: string) => void;
  onBlur: (field: FieldKey) => void;
};

const notice =
  "Appointment requests are subject to confirmation by our team. Submitting a request does not constitute a confirmed booking.";

/**
 * Step 4: an optional appointment request, deliberately styled apart from the enquiry. Unchecked it is a
 * quiet dashed box; checked it becomes a navy panel with a gold edge and reveals the date and time fields.
 * The block carries id="appointment" so /contact#appointment lands here. No hours, durations, notice
 * periods or consultation methods are stated, because none have been supplied.
 */
export function AppointmentFields({ appointment, errors, onToggle, onChange, onBlur }: AppointmentFieldsProps) {
  const active = appointment.requested;

  return (
    <div
      id="appointment"
      data-surface={active ? "dark" : "light"}
      className={`scroll-mt-32 transition-colors duration-300 ${
        active ? "border-l-4 border-gold bg-navy p-6 text-white sm:p-8" : "border border-dashed border-line-strong bg-white p-6 sm:p-8"
      }`}
    >
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          id="enquiry-appointment"
          name="appointment"
          checked={active}
          onChange={(event) => onToggle(event.target.checked)}
          aria-controls="enquiry-appointment-fields"
          className={`mt-1 size-5 shrink-0 cursor-pointer ${active ? "accent-gold" : "accent-navy"}`}
        />
        <label htmlFor="enquiry-appointment" className="cursor-pointer">
          <span className={`block font-heading text-lg font-extrabold ${active ? "text-white" : "text-navy"}`}>
            I would like to request an appointment.
          </span>
          <span className={`mt-1 block text-sm ${active ? "text-on-dark-muted" : "text-ink-muted"}`}>
            Optional. Tick this to add a preferred date and time to your enquiry.
          </span>
        </label>
      </div>

      <div id="enquiry-appointment-fields" hidden={!active} className="mt-7 grid gap-x-6 gap-y-6 sm:grid-cols-2">
        {active ? (
          <>
            <FormField id="enquiry-date" label="Preferred date" surface="dark" error={errors.preferredDate}>
              {(control) => (
                <input
                  {...control}
                  name="preferredDate"
                  type="date"
                  value={appointment.preferredDate}
                  onChange={(event) => onChange("preferredDate", event.target.value)}
                  onBlur={() => onBlur("preferredDate")}
                  className={inputStyles}
                />
              )}
            </FormField>
            <FormField id="enquiry-time" label="Preferred time" surface="dark" error={errors.preferredTime}>
              {(control) => (
                <input
                  {...control}
                  name="preferredTime"
                  type="time"
                  value={appointment.preferredTime}
                  onChange={(event) => onChange("preferredTime", event.target.value)}
                  onBlur={() => onBlur("preferredTime")}
                  className={inputStyles}
                />
              )}
            </FormField>
          </>
        ) : null}
      </div>

      <p
        className={`mt-6 border-l-2 py-1 pl-4 text-sm leading-relaxed ${
          active ? "border-gold text-white" : "border-gold text-charcoal"
        }`}
      >
        {notice}
      </p>
    </div>
  );
}
