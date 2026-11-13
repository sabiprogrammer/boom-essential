import type { LoginFieldErrors } from "./login-input";

/** What the sign-in Server Action hands back to the form. It never contains the password. */
export type SignInState = {
  /** A message for the whole form (a failed sign-in). */
  error?: string;
  fieldErrors?: LoginFieldErrors;
  /** The email to put back in the field after an error. */
  email?: string;
};
