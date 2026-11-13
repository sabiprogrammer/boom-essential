import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth/require-admin";
import { AdminWorkspaceIntro } from "@/components/admin/AdminWorkspaceIntro";

/** The page verifies the administrator itself as well; it does not rely on the layout having done so. */
async function AdminHome() {
  await requireAdmin();
  return <AdminWorkspaceIntro />;
}

export default function AdminHomePage() {
  return (
    <Suspense fallback={null}>
      <AdminHome />
    </Suspense>
  );
}
