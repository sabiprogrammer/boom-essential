/**
 * Copy for the administrator sign-in and the placeholder workspace. Nothing here may suggest that an email
 * address exists or not: every sign-in failure shows the same message.
 */
export const adminAuthCopy = {
  login: {
    eyebrow: "Administration",
    heading: "Administrator sign in",
    lead: "For authorised Boom Multi Global staff only.",
    emailLabel: "Email address",
    passwordLabel: "Password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    submit: "Sign in",
    submitting: "Signing in…",
    backToSite: "Back to the website",
  },
  validation: {
    emailRequired: "Enter your email address.",
    emailInvalid: "Enter a valid email address.",
    passwordRequired: "Enter your password.",
  },
  /** The same words for a wrong password, an unknown email and a valid account without administrator access. */
  signInFailed: "We couldn't sign you in. Check your details, and make sure this is an administrator account.",
  workspace: {
    title: "Administration",
    signedInAs: "Signed in as",
    signOut: "Sign out",
    heading: "Enquiries",
    body: "Customer enquiries from the website, newest first. Search, filter, open an enquiry to contact the customer, change its status and keep internal notes.",
  },
} as const;
