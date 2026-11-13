import { formPrivacyNote } from "@/content/privacy";

/**
 * A short privacy statement directly under the form's submit button, so it is read at the moment of sending. The link
 * opens the full Privacy Notice in a NEW TAB: the form keeps everything in memory only, so leaving the page would lose what
 * the visitor has typed. The wording is in content/privacy.ts, beside the notice it summarises.
 */
export function PrivacyNote() {
  return (
    <p className="text-sm leading-relaxed text-ink-muted">
      {formPrivacyNote.text}{" "}
      <a
        href={formPrivacyNote.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:text-navy-hover"
      >
        {formPrivacyNote.linkLabel}
        <span className="sr-only"> {formPrivacyNote.linkNote}</span>
      </a>
      .
    </p>
  );
}
