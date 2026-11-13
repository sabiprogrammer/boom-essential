const input =
  "h-11 w-full rounded-md border border-line-strong bg-warm-white px-4 text-base text-charcoal transition-colors hover:border-navy/60 focus:border-navy focus:bg-white disabled:opacity-60 aria-[invalid=true]:border-danger";

/**
 * The date and time inputs shared by the confirm and reschedule forms. Native pickers (best on phones and for assistive
 * technology). The earliest date is today in Lagos; the server checks again, so this is only a convenience. Times are
 * Lagos time, and the form says so.
 */
export function SlotFields({
  idPrefix,
  date,
  time,
  min,
  disabled,
  errors,
  onDate,
  onTime,
}: {
  idPrefix: string;
  date: string;
  time: string;
  /** Today in Africa/Lagos, YYYY-MM-DD. */
  min: string;
  disabled: boolean;
  errors: { date?: string; time?: string };
  onDate: (value: string) => void;
  onTime: (value: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor={`${idPrefix}-date`} className="mb-1.5 block font-heading text-sm font-bold text-navy">
          Date
        </label>
        <input
          id={`${idPrefix}-date`}
          type="date"
          value={date}
          min={min}
          required
          disabled={disabled}
          aria-invalid={errors.date ? true : undefined}
          aria-describedby={errors.date ? `${idPrefix}-date-error` : undefined}
          onChange={(event) => onDate(event.target.value)}
          className={input}
        />
        {errors.date ? (
          <p id={`${idPrefix}-date-error`} className="mt-1.5 text-sm font-semibold text-danger">
            {errors.date}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor={`${idPrefix}-time`} className="mb-1.5 block font-heading text-sm font-bold text-navy">
          Time <span className="font-normal text-ink-muted">(Lagos time)</span>
        </label>
        <input
          id={`${idPrefix}-time`}
          type="time"
          value={time}
          required
          disabled={disabled}
          aria-invalid={errors.time ? true : undefined}
          aria-describedby={errors.time ? `${idPrefix}-time-error` : undefined}
          onChange={(event) => onTime(event.target.value)}
          className={input}
        />
        {errors.time ? (
          <p id={`${idPrefix}-time-error`} className="mt-1.5 text-sm font-semibold text-danger">
            {errors.time}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export const textInputClass = input;
