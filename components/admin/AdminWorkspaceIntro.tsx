import Link from "next/link";
import { adminAuthCopy } from "@/content/admin-auth";
import { Container } from "@/components/ui/Container";

/**
 * Placeholder for the administrator workspace. It states what is ready and what comes next. It shows NO
 * figures or records: nothing real is connected yet, and the dashboard preview's sample data is never shown here.
 */
export function AdminWorkspaceIntro() {
  const copy = adminAuthCopy.workspace;

  return (
    <Container size="narrow" className="py-16 lg:py-24">
      <p aria-hidden="true" className="h-[3px] w-14 bg-gold" />
      <h1 className="mt-6 text-h2 font-extrabold text-navy">{copy.heading}</h1>
      <p className="mt-4 max-w-prose text-lead text-ink-muted">{copy.body}</p>

      <p className="mt-10 border-t border-line pt-6 text-body text-ink-muted">
        {copy.previewLead}{" "}
        <Link href="/dashboard-preview" className="font-semibold text-navy underline underline-offset-4 hover:text-navy-hover">
          {copy.previewLink}
        </Link>
      </p>
    </Container>
  );
}
