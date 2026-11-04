import { limits } from "@/lib/enquiry/validation";
import { textareaStyles } from "./field-styles";
import { FormField } from "./FormField";

type MessageFieldProps = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
};

/** Step 3: the required message, with a live character count (announced politely, not on every keystroke). */
export function MessageField({ value, error, onChange, onBlur }: MessageFieldProps) {
  const length = value.length;
  const over = length > limits.message.max;

  return (
    <FormField id="enquiry-message" label="Message" error={error}>
      {(control) => (
        <>
          <textarea
            {...control}
            name="message"
            rows={6}
            value={value}
            placeholder="Tell us what you need, including any relevant quantities or specifications you would like us to consider."
            onChange={(event) => onChange(event.target.value)}
            onBlur={onBlur}
            className={textareaStyles}
          />
          <p className={`mt-1.5 text-right text-sm tabular-nums ${over ? "font-semibold text-danger" : "text-ink-muted"}`}>
            {length} / {limits.message.max}
          </p>
        </>
      )}
    </FormField>
  );
}
