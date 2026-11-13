import type { NoteRecord } from "@/lib/admin/enquiries/types";
import { formatReceivedDateTime } from "@/lib/dashboard-preview/dates";
import { AddNoteForm } from "./AddNoteForm";

/** Previous internal notes (newest first), then the form to add one. Internal notes are never shown to customers. */
export function NotesSection({ enquiryId, notes }: { enquiryId: string; notes: readonly NoteRecord[] }) {
  return (
    <div>
      {notes.length === 0 ? (
        <p className="text-base text-ink-muted">No internal notes yet.</p>
      ) : (
        <ol className="relative space-y-4 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-line">
          {notes.map((note) => (
            <li key={note.id} className="relative pl-6">
              <span aria-hidden="true" className="absolute top-1.5 left-0 size-[11px] rounded-full border-2 border-navy bg-white" />
              <p className="text-base leading-snug whitespace-pre-line text-charcoal">{note.content}</p>
              <p className="mt-1 text-sm text-ink-muted">
                <span className="font-heading font-semibold text-navy">{note.mine ? "You" : "An administrator"}</span>, {formatReceivedDateTime(note.createdAt)}
              </p>
            </li>
          ))}
        </ol>
      )}
      <AddNoteForm enquiryId={enquiryId} />
    </div>
  );
}
