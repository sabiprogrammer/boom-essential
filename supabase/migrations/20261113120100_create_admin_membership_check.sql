-- Stage 6.6, migration 10 of 10: "am I an active administrator?", for diagnostics.
--
-- WHY: the administrator area needs TWO things to be true for a person: their account is on the application's allowlist
-- (BOOM_ADMIN_USER_IDS) AND they have an active row in private.admin_users. If only the first is true, every list is
-- silently empty (row-level security hides everything), which looks like "no data" instead of "not set up". The
-- private schema is deliberately closed to the signed-in role, so the application cannot ask the database directly.
--
-- This function answers ONE question, about the CALLER only, with a plain true or false: it takes no argument, so it
-- cannot be used to look anyone else up, and it reveals nothing about the membership table. It is SECURITY DEFINER
-- (it must read the closed schema) with an empty search_path and fully qualified names. It is executable by signed-in
-- users only; anon cannot call it. It grants no access to any data: it only reports the state RLS already enforces.

create or replace function public.am_i_active_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select private.is_active_admin()), false);
$$;

comment on function public.am_i_active_admin() is
  'True when the signed-in caller is an ACTIVE administrator. Diagnostics only; answers about the caller and nothing else.';

revoke all on function public.am_i_active_admin() from public, anon;
grant execute on function public.am_i_active_admin() to authenticated;
