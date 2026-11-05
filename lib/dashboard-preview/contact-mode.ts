/**
 * Whether the Call and WhatsApp actions operate on real customer numbers.
 *
 * "demo": every record is fictional, so the actions are shown but only explain what will happen. They never
 * open the dialler or WhatsApp and make no network request. Set to "live" when real customer contact records
 * are connected (Stage 6); the same controls then use the links from contact-actions.ts.
 */
export type ContactActionsMode = "demo" | "live";

export const contactActionsMode: ContactActionsMode = "demo";
