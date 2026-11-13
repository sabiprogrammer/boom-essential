"use client";

import { useActionState, useEffect, useRef } from "react";
import { adminAuthCopy } from "@/content/admin-auth";
import { signInAction } from "@/lib/auth/sign-in-action";
import type { SignInState } from "@/lib/auth/sign-in-state";
import { FormField } from "@/components/contact/FormField";
import { inputStyles } from "@/components/contact/field-styles";
import { Button } from "@/components/ui/Button";
import { PasswordField } from "./PasswordField";

const initialState: SignInState = {};

/**
 * The administrator sign-in form. Posts to the `signInAction` Server Action (no client-side token handling,
 * no browser storage). `next` has already been restricted to a safe `/admin` path by the page, and the action
 * restricts it again. Errors are announced (`role="alert"`) and focus moves to the field that needs attention.
 * There is deliberately no sign-up, password-reset or social sign-in here.
 */
export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(signInAction, initialState);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const copy = adminAuthCopy.login;

  // Move focus to the first thing to fix after a response. A rejected sign-in clears the password, so go there.
  useEffect(() => {
    if (state.fieldErrors?.email) emailRef.current?.focus();
    else if (state.fieldErrors?.password || state.error) passwordRef.current?.focus();
  }, [state]);

  return (
    <>
      <form action={formAction} noValidate className="space-y-6" aria-busy={pending}>
        <input type="hidden" name="next" value={next} />

        {state.error ? (
          <div role="alert" className="rounded-sm border border-danger bg-danger-tint px-4 py-3 text-sm font-semibold text-danger">
            {state.error}
          </div>
        ) : null}

        <FormField id="admin-email" label={copy.emailLabel} error={state.fieldErrors?.email}>
          {(control) => (
            <input
              {...control}
              ref={emailRef}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              required
              defaultValue={state.email}
              className={inputStyles}
            />
          )}
        </FormField>

        <FormField id="admin-password" label={copy.passwordLabel} error={state.fieldErrors?.password}>
          {(control) => <PasswordField {...control} name="password" inputRef={passwordRef} />}
        </FormField>

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? copy.submitting : copy.submit}
        </Button>
      </form>

      {/* Outside the form so it takes no part in its spacing; announces the pending state to screen readers. */}
      <p className="sr-only" role="status" aria-live="polite">
        {pending ? copy.submitting : ""}
      </p>
    </>
  );
}
