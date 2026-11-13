/**
 * Cleaning of visitor-supplied text before it is validated and stored. Pure functions.
 *
 * What is removed: control characters (a stray NUL or escape code has no place in an enquiry and can confuse
 * downstream tools), and the invisible characters that can disguise text or reorder it on screen (zero-width
 * space, word joiner, byte-order mark, and the bidirectional overrides and isolates). Zero-width joiners and
 * non-joiners are kept because some scripts and emoji need them. Text is put in Unicode NFC form so the same
 * name typed on different keyboards compares equal.
 *
 * Nothing here escapes HTML: the data is stored as plain text and must always be rendered as text (React does
 * this by default). Escaping at storage time would corrupt legitimate names and messages.
 */

// C0 controls except tab (U+0009), line feed (U+000A) and carriage return (U+000D); DEL; C1 controls.
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;
const INVISIBLE = /[​⁠﻿‪-‮⁦-⁩]/g;

function strip(value: string): string {
  return value.normalize("NFC").replace(CONTROL, "").replace(INVISIBLE, "");
}

/** For names, phone numbers, email, organisation and location: one line, single spaces, no edge whitespace. */
export function cleanSingleLine(value: string): string {
  return strip(value).replace(/\s+/g, " ").trim();
}

/** For the message: keeps paragraph breaks, limits runs of blank lines, trims each line's end and the whole text. */
export function cleanMessage(value: string): string {
  return strip(value)
    .replace(/\r\n?/g, "\n")
    .replace(/[^\S\n]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
