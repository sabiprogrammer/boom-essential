-- BOOM first-administrator bootstrap. RUN ONCE, BY HAND, after the migrations have been applied.
--
-- This is NOT a migration and is never applied automatically (it lives outside supabase/migrations/). It contains no
-- real id: you paste yours in locally, run it, and do NOT commit the edited copy.
--
-- HOW TO USE
--   1. Supabase dashboard > Authentication > Users: copy the UUID of the administrator account (the same UUID you put
--      in BOOM_ADMIN_USER_IDS). The account must already exist.
--   2. Supabase dashboard > SQL Editor: paste this file, replace the placeholder below with that UUID, and run it.
--   3. Do not save the edited file into the repository. `git diff` should show this file unchanged.
--
-- It is safe to re-run: it inserts the administrator, or re-activates and re-labels an existing row.
-- To remove access later, deactivate rather than delete:
--     update private.admin_users set is_active = false where user_id = '<uuid>';
--
-- Two independent checks protect the admin area: this database membership (enforced by RLS) AND the application's
-- BOOM_ADMIN_USER_IDS allowlist. An administrator needs BOTH, so keep the two in step.

do $bootstrap$
declare
  -- >>> REPLACE THE PLACEHOLDER ON THE NEXT LINE WITH THE ADMINISTRATOR'S UUID (keep the quotes) <<<
  v_admin_user_id uuid := '00000000-0000-0000-0000-000000000000';
begin
  if v_admin_user_id = '00000000-0000-0000-0000-000000000000'::uuid then
    raise exception 'Replace the placeholder UUID with the administrator''s Supabase Auth user id before running this script.';
  end if;

  if not exists (select 1 from auth.users as u where u.id = v_admin_user_id) then
    raise exception 'No Supabase Auth user has that id. Check Authentication > Users and try again.';
  end if;

  insert into private.admin_users (user_id, role, is_active)
  values (v_admin_user_id, 'owner', true)
  on conflict (user_id) do update
    set role = excluded.role,
        is_active = true;

  raise notice 'Administrator is now an active owner. Confirm with: select user_id, role, is_active from private.admin_users;';
end
$bootstrap$;
