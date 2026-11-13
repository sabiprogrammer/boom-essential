import { adminAuthCopy } from "@/content/admin-auth";

export type LoginFieldErrors = { email?: string; password?: string };

export type LoginInput =
  | { ok: true; email: string; password: string }
  | { ok: false; email: string; fieldErrors: LoginFieldErrors };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
/** Far above any real password; it only bounds the size of what is sent to the Auth server. */
const MAX_PASSWORD_LENGTH = 1024;

/**
 * Reads and checks the sign-in form on the server (the browser's own checks are a convenience, not the
 * authority). The email is trimmed; the password is NEVER trimmed or altered. The returned `email` is safe
 * to show again after an error; the password is never returned to the browser.
 */
export function parseLoginInput(formData: FormData): LoginInput {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");
  const email = typeof rawEmail === "string" ? rawEmail.trim() : "";
  const password = typeof rawPassword === "string" ? rawPassword : "";

  const fieldErrors: LoginFieldErrors = {};
  if (email.length === 0) fieldErrors.email = adminAuthCopy.validation.emailRequired;
  else if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) fieldErrors.email = adminAuthCopy.validation.emailInvalid;

  if (password.length === 0) fieldErrors.password = adminAuthCopy.validation.passwordRequired;
  else if (password.length > MAX_PASSWORD_LENGTH) fieldErrors.password = adminAuthCopy.signInFailed;

  if (fieldErrors.email || fieldErrors.password) return { ok: false, email: email.slice(0, MAX_EMAIL_LENGTH), fieldErrors };
  return { ok: true, email, password };
}
