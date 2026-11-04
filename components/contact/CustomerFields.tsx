import type { CustomerDetails, FieldErrors, FieldKey } from "@/lib/enquiry/types";
import { limits } from "@/lib/enquiry/validation";
import { inputStyles } from "./field-styles";
import { FormField } from "./FormField";

type CustomerFieldsProps = {
  customer: CustomerDetails;
  errors: FieldErrors;
  onChange: (field: keyof CustomerDetails, value: string) => void;
  onBlur: (field: FieldKey) => void;
};

/** Step 1: who is enquiring. Only the name and a phone number are required. */
export function CustomerFields({ customer, errors, onChange, onBlur }: CustomerFieldsProps) {
  return (
    <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
      <FormField id="enquiry-full-name" label="Full name" error={errors.fullName}>
        {(control) => (
          <input
            {...control}
            name="fullName"
            type="text"
            autoComplete="name"
            maxLength={limits.name.max + 20}
            value={customer.fullName}
            onChange={(event) => onChange("fullName", event.target.value)}
            onBlur={() => onBlur("fullName")}
            className={inputStyles}
          />
        )}
      </FormField>

      <FormField id="enquiry-phone" label="Phone number" error={errors.phone}>
        {(control) => (
          <input
            {...control}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={customer.phone}
            onChange={(event) => onChange("phone", event.target.value)}
            onBlur={() => onBlur("phone")}
            className={inputStyles}
          />
        )}
      </FormField>

      <FormField id="enquiry-email" label="Email address" optional error={errors.email}>
        {(control) => (
          <input
            {...control}
            name="email"
            type="email"
            autoComplete="email"
            value={customer.email}
            onChange={(event) => onChange("email", event.target.value)}
            onBlur={() => onBlur("email")}
            className={inputStyles}
          />
        )}
      </FormField>

      <FormField id="enquiry-organisation" label="Business or organisation" optional error={errors.organisation}>
        {(control) => (
          <input
            {...control}
            name="organisation"
            type="text"
            autoComplete="organization"
            value={customer.organisation}
            onChange={(event) => onChange("organisation", event.target.value)}
            onBlur={() => onBlur("organisation")}
            className={inputStyles}
          />
        )}
      </FormField>

      <FormField id="enquiry-location" label="Location" optional hint="Town or city" error={errors.location} className="sm:col-span-2">
        {(control) => (
          <input
            {...control}
            name="location"
            type="text"
            autoComplete="off"
            value={customer.location}
            onChange={(event) => onChange("location", event.target.value)}
            onBlur={() => onBlur("location")}
            className={inputStyles}
          />
        )}
      </FormField>
    </div>
  );
}
