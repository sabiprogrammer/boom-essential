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
    heading: "Your secure workspace is ready",
    body: "Administrator sign-in is working and this area is protected. Live enquiry and appointment records will be connected in the next milestone, so there is nothing to manage here yet.",
    previewLead: "Want to see how the finished dashboard will look?",
    previewLink: "Open the dashboard preview (sample data only)",
  },
} as const;
