"use client";

import { useId, useState } from "react";
import type { DemoNote } from "@/lib/dashboard-preview/types";
import { useDemoData } from "./DemoDataProvider";

/**
 * Internal notes for one enquiry, never shown to customers. Adding one here is a demonstration: it lives in
 * memory for this visit only and is labelled as such.
 */
export function InternalNotes({ enquiryId, notes }: { enquiryId: string; notes: readonly DemoNote[] }) {
  const { addNote } = useDemoData();
  const [draft, setDraft] = useState("");
  const fieldId = useId();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.trim() === "") return;
    addNote(enquiryId, draft);
    setDraft("");
  }

  return (
    <div>
      {notes.length === 0 ? (
        <p className="text-base text-ink-muted">No internal notes yet.</p>
      ) : (
        <ol className="relative space-y-4 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-line">
          {notes.map((item) => (
            <li key={item.id} className="relative pl-6">
              <span aria-hidden="true" className="absolute top-1.5 left-0 size-[11px] rounded-full border-2 border-navy bg-white" />
              <p className="text-base leading-snug whitespace-pre-line text-charcoal">{item.text}</p>
              <p className="mt-1 text-sm text-ink-muted">
                <span className="font-heading font-semibold text-navy">{item.author}</span>, {item.at}
              </p>
            </li>
          ))}
        </ol>
      )}

      <form onSubmit={submit} className="mt-5 border-t border-line pt-5">
        <label htmlFor={fieldId} className="mb-1.5 block font-heading text-sm font-bold text-navy">
          Add an internal note (demo)
        </label>
        <textarea
          id={fieldId}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          className="w-full resize-y rounded-md border border-line-strong bg-warm-white px-4 py-3 text-base text-charcoal transition-colors placeholder:text-ink-muted hover:border-navy/60 focus:border-navy focus:bg-white"
          placeholder="Write a note for the team. It is not visible to the customer."
        />
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            type="submit"
            disabled={draft.trim() === ""}
            className="inline-flex h-11 items-center rounded-md border border-navy bg-navy px-5 font-heading text-sm font-bold text-white transition-colors hover:bg-navy-hover disabled:pointer-events-none disabled:opacity-45"
          >
            Add note (demo only)
          </button>
          <p className="text-sm text-ink-muted">Held in this browser tab only. Not saved to a server.</p>
        </div>
      </form>
    </div>
  );
}
