"use client";

import { useId, useState, useTransition, type FormEvent } from "react";
import { idleState, type ActionState } from "@/lib/admin/enquiries/action-state";
import { maxNoteLength } from "@/lib/admin/enquiries/action-validation";
import { addEnquiryNoteAction } from "@/lib/admin/enquiries/enquiry-actions";

/**
 * Adds an internal note (never visible to the customer). The text stays in the box until the server confirms it was
 * saved, so a failure loses nothing; on success the box is cleared and the new note appears in the list above. The
 * author and time are set by the database, not by this form.
 */
export function AddNoteForm({ enquiryId }: { enquiryId: string }) {
  const fieldId = useId();
  const [draft, setDraft] = useState("");
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState>(idleState);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || draft.trim() === "") return;
    const formData = new FormData();
    formData.set("enquiryId", enquiryId);
    formData.set("content", draft);
    setResult(idleState);
    startTransition(async () => {
      const outcome = await addEnquiryNoteAction(idleState, formData);
      setResult(outcome);
      if (outcome.status === "success") setDraft("");
    });
  }

  return (
    <form onSubmit={submit} className="mt-5 border-t border-line pt-5" aria-busy={pending}>
      <label htmlFor={fieldId} className="mb-1.5 block font-heading text-sm font-bold text-navy">
        Add an internal note
      </label>
      <textarea
        id={fieldId}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        rows={3}
        maxLength={maxNoteLength}
        disabled={pending}
        className="w-full resize-y rounded-md border border-line-strong bg-warm-white px-4 py-3 text-base text-charcoal transition-colors placeholder:text-ink-muted hover:border-navy/60 focus:border-navy focus:bg-white disabled:opacity-60"
        placeholder="Write a note for the team. It is not visible to the customer."
      />
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="submit"
          disabled={pending || draft.trim() === ""}
          className="inline-flex h-11 items-center gap-2 rounded-md border border-navy bg-navy px-5 font-heading text-sm font-bold text-white transition-colors hover:bg-navy-hover disabled:pointer-events-none disabled:opacity-45"
        >
          {pending ? (
            <>
              <span aria-hidden="true" className="size-4 rounded-full border-2 border-white/40 border-t-white motion-safe:animate-spin" />
              Saving…
            </>
          ) : (
            "Add note"
          )}
        </button>
        <div aria-live="polite" className="text-sm">
          {result.status === "success" ? <p className="font-semibold text-green">{result.message}</p> : null}
          {result.status === "error" ? (
            <p role="alert" className="font-semibold text-danger">
              {result.message}
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
