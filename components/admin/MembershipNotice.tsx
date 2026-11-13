import type { AdminMembership } from "@/lib/admin/membership/check-membership";

/**
 * Explains an empty workspace that is empty for a SETUP reason, not because there is nothing to show. Access to /admin
 * needs the application's allowlist AND an active administrator row in the database; if the second is missing, the
 * database hides every record. Shown only when the database says so ("inactive"); when the check could not be made
 * ("unknown") nothing is shown and nothing is assumed.
 */
export function MembershipNotice({ membership }: { membership: AdminMembership }) {
  if (membership !== "inactive") return null;

  return (
    <div role="alert" className="mb-6 border-l-4 border-gold bg-gold-tint p-5 text-base text-charcoal">
      <p className="font-heading font-extrabold text-navy">You are signed in, but not set up as an administrator in the database</p>
      <p className="mt-1.5 max-w-3xl">
        This account is allowed into the administration area, but the database does not list it as an active administrator, so it hides every record. The lists below will look empty and changes will not save. The account owner
        needs to run the one-time administrator setup for this account (supabase/bootstrap/first-admin.sql in the project).
      </p>
    </div>
  );
}
