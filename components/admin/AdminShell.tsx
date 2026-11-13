import type { ReactNode } from "react";
import { adminAuthCopy } from "@/content/admin-auth";
import { signOutAction } from "@/lib/auth/sign-out-action";
import { LogoImage } from "@/components/layout/LogoImage";
import { Button } from "@/components/ui/Button";
import { AdminNav } from "./AdminNav";

type AdminShellProps = {
  /** The verified administrator's email, shown only as a label. It is never used to decide access. */
  email?: string;
  children: ReactNode;
};

/**
 * Frame for the protected administrator area: a top bar with the brand, who is signed in, and the working
 * "Sign out" control (a form that posts to the `signOutAction` Server Action, so it works without JavaScript).
 * It renders only inside the layout's `requireAdmin()` check.
 */
export function AdminShell({ email, children }: AdminShellProps) {
  const copy = adminAuthCopy.workspace;

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-warm-white">
      <header className="border-b-[3px] border-gold bg-navy text-white">
        <div className="mx-auto flex w-full max-w-content flex-wrap items-center justify-between gap-x-6 gap-y-3 px-gutter py-3">
          <div className="flex items-center gap-3">
            <span className="block bg-white p-1">
              <LogoImage alt="" sizes="48px" className="size-10" />
            </span>
            <p className="font-heading text-sm leading-tight font-extrabold tracking-[0.14em]">
              BOOM
              <span className="block font-bold tracking-[0.2em] text-on-dark-muted">{copy.title.toUpperCase()}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            {email ? (
              <p className="max-w-[16rem] truncate text-sm text-on-dark-muted">
                {copy.signedInAs} <span className="font-semibold text-white">{email}</span>
              </p>
            ) : null}
            <form action={signOutAction}>
              <Button type="submit" variant="secondary" surface="dark" size="sm">
                {copy.signOut}
              </Button>
            </form>
          </div>
        </div>
        <AdminNav />
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
