-- Stage 6.3, migration 1 of 6: the private schema, the administrator membership table and the shared helpers.
--
-- WHY A PRIVATE SCHEMA: Supabase's API (PostgREST) only exposes the schemas listed in its settings, `public` by
-- default. Everything here lives in `private`, which is not exposed, so none of it can be reached through the API.
-- The table is ALSO closed at the privilege level and by row-level security, so it stays closed even if the schema
-- were ever exposed by mistake.
--
-- This file contains no credentials and no real user id. The first administrator is added by hand with
-- supabase/bootstrap/first-admin.sql after the migrations are applied.

create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon, authenticated;

-- Supabase grants new tables, sequences and functions in `public` to anon and authenticated by default. This project
-- is deliberately closed instead: every later grant is explicit. (Applies to objects created from now on by the
-- migration role; each table migration also revokes explicitly, so it does not depend on this alone.)
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
alter default privileges in schema public revoke execute on functions from anon, authenticated;

-- ---------------------------------------------------------------------------------------------------------------
-- Administrators
-- ---------------------------------------------------------------------------------------------------------------

create table private.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'admin' check (role in ('owner', 'admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table private.admin_users is
  'BOOM administrators (maps Supabase Auth users to access). Never exposed through the API. Membership here, not user_metadata, is what grants database access. The application-level BOOM_ADMIN_USER_IDS allowlist stays in place as a second, independent check.';

alter table private.admin_users enable row level security;
-- No policies: with RLS on and no policy, every non-owner role sees nothing. Privileges are also revoked outright.
revoke all on table private.admin_users from public, anon, authenticated, service_role;

-- ---------------------------------------------------------------------------------------------------------------
-- Is the caller an active administrator?
-- ---------------------------------------------------------------------------------------------------------------

-- SECURITY DEFINER because the caller cannot read private.admin_users. It answers one yes/no question about
-- auth.uid() (the verified `sub` of the caller's JWT, never user-editable metadata) and exposes nothing else.
-- An explicit empty search_path plus fully qualified names stops anyone shadowing a table or function.
create or replace function private.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (
      select true
      from private.admin_users as admin
      where admin.user_id = (select auth.uid())
        and admin.is_active
      limit 1
    ),
    false
  );
$$;

comment on function private.is_active_admin() is
  'True when auth.uid() belongs to an active row in private.admin_users. Used by every row-level security policy.';

revoke all on function private.is_active_admin() from public, anon;
grant execute on function private.is_active_admin() to authenticated;

-- ---------------------------------------------------------------------------------------------------------------
-- Shared trigger helpers (not callable by API roles; triggers do not need the caller to hold EXECUTE)
-- ---------------------------------------------------------------------------------------------------------------

-- Keeps updated_at honest: it moves only when something other than updated_at really changed.
create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (pg_catalog.to_jsonb(new) - 'updated_at') is distinct from (pg_catalog.to_jsonb(old) - 'updated_at') then
    new.updated_at := pg_catalog.now();
  else
    new.updated_at := old.updated_at;
  end if;
  return new;
end;
$$;

-- Business records are never deleted by accident or by a compromised key. This blocks DELETE for every role,
-- including the table owner and service_role. A reviewed retention process (an agreed, audited migration that
-- disables this trigger for a defined purpose) is the only way to remove personal data.
create or replace function private.forbid_delete()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'Deleting % records is not permitted: business records are retained.', tg_table_name
    using errcode = 'restrict_violation';
end;
$$;

-- Notes, status history and the activity log are append-only: a row, once written, is never altered or removed.
create or replace function private.forbid_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception '% is append-only: rows cannot be changed or removed.', tg_table_name
    using errcode = 'restrict_violation';
end;
$$;

revoke all on function private.set_updated_at() from public, anon, authenticated;
revoke all on function private.forbid_delete() from public, anon, authenticated;
revoke all on function private.forbid_change() from public, anon, authenticated;

create trigger admin_users_set_updated_at
  before update on private.admin_users
  for each row execute function private.set_updated_at();
