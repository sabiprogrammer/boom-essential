/**
 * Turns the administrator's search box into a safe PostgREST filter. The search text is typed by a person and
 * goes into a filter STRING (the `or=(...)` syntax), where a comma, bracket, colon, quote or wildcard would change
 * what the filter means. So the text is reduced to plain words first: only letters, digits and the few characters
 * that occur in names, emails and phone numbers survive, everything else becomes a space, and no character with a
 * meaning in the filter language (or in a LIKE pattern) can get through. Pure; the database call is elsewhere.
 */

const MAX_TERMS = 5;
const MAX_TERM_LENGTH = 40;

/** Letters, digits, and  @ . + -  ' (emails, phone numbers, names such as O'Brien). Underscore is a LIKE wildcard, so it is dropped. */
const UNSAFE = /[^\p{L}\p{N}@.+'-]+/gu;

export function searchTerms(input: string): string[] {
  return input
    .replace(UNSAFE, " ")
    .split(" ")
    .map((term) => term.slice(0, MAX_TERM_LENGTH))
    .filter((term) => term.length > 0 && /[\p{L}\p{N}]/u.test(term))
    .slice(0, MAX_TERMS);
}

/** The columns a search looks in: who, how to reach them, the reference, where, and what they wrote. */
export const searchColumns = ["full_name", "organisation", "email", "phone", "phone_e164", "reference", "location", "message"] as const;

/**
 * One `or=` expression for ONE term: the term may appear in any column. Several terms are combined with AND by
 * applying one `.or()` per term, so "ada akure" finds enquiries that mention both words, wherever they appear.
 */
export function orFilterForTerm(term: string): string {
  return searchColumns.map((column) => `${column}.ilike."*${term}*"`).join(",");
}
