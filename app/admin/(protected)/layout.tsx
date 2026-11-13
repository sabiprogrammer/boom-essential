import type { ReactNode } from "react";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth/require-admin";
import { AdminShell } from "@/components/admin/AdminShell";

/**
 * Everything under /admin except /admin/login. It verifies the administrator ITSELF, independently of the
 * proxy. The check sits in a component inside <Suspense> because reading the session is request-time (a
 * layout that awaited it at the top level would block the whole segment). Pages inside must still call
 * `requireAdmin()` too: layouts are not re-run when you navigate between their pages.
 */
async function AdminGate({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();
  return <AdminShell email={admin.email}>{children}</AdminShell>;
}

export default function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="flex-1 bg-warm-white" aria-hidden="true" />}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}
