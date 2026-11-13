import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { adminAuthCopy } from "@/content/admin-auth";
import { safeAdminRedirect } from "@/lib/auth/safe-redirect";
import { LoginBrandPanel } from "@/components/admin/LoginBrandPanel";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Administrator sign in" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Reads `?next=` (request-time, so it sits in Suspense) and passes on only a safe /admin destination. */
async function LoginFormWithDestination({ searchParams }: { searchParams: SearchParams }) {
  const { next } = await searchParams;
  return <LoginForm next={safeAdminRedirect(Array.isArray(next) ? next[0] : next)} />;
}

/**
 * Administrator sign in. Public by necessity (the proxy lets it through). No sign-up, social sign-in,
 * magic link or password-reset link exists here: administrators are created by hand in Supabase.
 */
export default function AdminLoginPage({ searchParams }: { searchParams: SearchParams }) {
  const copy = adminAuthCopy.login;

  return (
    <main className="grid flex-1 lg:grid-cols-[5fr_7fr]">
      <LoginBrandPanel />
      <div className="flex items-center bg-warm-white px-gutter py-12 lg:px-16 lg:py-16">
        <div className="mx-auto w-full max-w-md">
          <p className="font-heading text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">{copy.eyebrow}</p>
          <h1 className="mt-3 text-h2 font-extrabold text-navy">{copy.heading}</h1>
          <p className="mt-3 text-body text-ink-muted">{copy.lead}</p>

          <div className="mt-8 border-t-[3px] border-gold bg-white p-6 shadow-raised sm:p-8">
            <Suspense fallback={<div className="h-80" aria-hidden="true" />}>
              <LoginFormWithDestination searchParams={searchParams} />
            </Suspense>
          </div>

          <p className="mt-8 text-sm">
            <Link href="/" className="font-semibold text-navy underline underline-offset-4 hover:text-navy-hover">
              {copy.backToSite}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
