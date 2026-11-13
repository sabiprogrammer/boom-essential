-- Stage 6.3, migration 6 of 6: row-level security, table privileges and policies.
--
-- TWO independent layers, both deliberate:
--   1. PRIVILEGES (GRANT/REVOKE): what a role may attempt at all. Everything starts from REVOKE ALL, so Supabase's
--      default grants to anon and authenticated cannot leak through; then only what is needed is granted, and for
--      updates only on named COLUMNS.
--   2. ROW LEVEL SECURITY: which rows a permitted role can see or touch. Every policy requires an ACTIVE
--      administrator (private.is_active_admin()). The anon role has no policy at all.
--
-- Who can do what:
--   anon                    nothing (no grants, no policies): no read, no insert.
--   authenticated, NOT admin  nothing useful: SELECT is granted but RLS returns zero rows; writes are refused.
--   authenticated, ACTIVE admin
--       enquiries              read; change `status` only (intake fields are the customer's words and stay as sent)
--       appointments           read; create (to schedule or reschedule); update status and scheduling fields
--       enquiry_notes          read; add (as themselves); never edit or delete
--       status history, activity_logs   read only (written by triggers)
--       nothing can be DELETED by anyone (no grants, no policies, plus delete-blocking triggers).
--   service_role (server only, bypasses RLS)  the future public-submission handler: insert enquiries and
--       appointments, set phone_e164, read. It cannot update other fields or delete.
--
-- The administrator role is checked through (select private.is_active_admin()): wrapping the call in a subselect lets
-- Postgres evaluate it once per statement instead of once per row.

-- ---------------------------------------------------------------------------------------------------------------
-- 1. Close everything first, then grant deliberately
-- ---------------------------------------------------------------------------------------------------------------

alter table public.enquiries enable row level security;
alter table public.appointments enable row level security;
alter table public.enquiry_notes enable row level security;
alter table public.enquiry_status_history enable row level security;
alter table public.appointment_status_history enable row level security;
alter table public.activity_logs enable row level security;

revoke all on table
  public.enquiries,
  public.appointments,
  public.enquiry_notes,
  public.enquiry_status_history,
  public.appointment_status_history,
  public.activity_logs
from public, anon, authenticated, service_role;

-- ---------------------------------------------------------------------------------------------------------------
-- 2. Privileges
-- ---------------------------------------------------------------------------------------------------------------

-- Administrators (signed-in users; RLS below decides whether the user really is one).
grant select on public.enquiries to authenticated;
grant update (status) on public.enquiries to authenticated;

grant select on public.appointments to authenticated;
grant insert (enquiry_id, preferred_date, preferred_time, timezone, venue, scheduling_note, rescheduled_from_id)
  on public.appointments to authenticated;
grant update (status, confirmed_date, confirmed_time, venue, scheduling_note) on public.appointments to authenticated;

grant select on public.enquiry_notes to authenticated;
grant insert (enquiry_id, content) on public.enquiry_notes to authenticated;

grant select on public.enquiry_status_history to authenticated;
grant select on public.appointment_status_history to authenticated;
grant select on public.activity_logs to authenticated;

-- The server (service_role): public submissions only. It bypasses RLS, so its privileges are the boundary.
grant select, insert on public.enquiries to service_role;
grant update (phone_e164) on public.enquiries to service_role;
grant select, insert on public.appointments to service_role;

-- ---------------------------------------------------------------------------------------------------------------
-- 3. Policies (authenticated only; there is deliberately no policy for anon)
-- ---------------------------------------------------------------------------------------------------------------

create policy "Active administrators can read enquiries"
  on public.enquiries for select to authenticated
  using ((select private.is_active_admin()));

create policy "Active administrators can update enquiry status"
  on public.enquiries for update to authenticated
  using ((select private.is_active_admin()))
  with check ((select private.is_active_admin()));

create policy "Active administrators can read appointments"
  on public.appointments for select to authenticated
  using ((select private.is_active_admin()));

create policy "Active administrators can create appointments"
  on public.appointments for insert to authenticated
  with check ((select private.is_active_admin()));

create policy "Active administrators can update appointments"
  on public.appointments for update to authenticated
  using ((select private.is_active_admin()))
  with check ((select private.is_active_admin()));

create policy "Active administrators can read internal notes"
  on public.enquiry_notes for select to authenticated
  using ((select private.is_active_admin()));

-- A note is always written as the signed-in administrator: the author column defaults to auth.uid() and cannot be
-- named by the client (no INSERT privilege on it); this check is a second guard.
create policy "Active administrators can add internal notes as themselves"
  on public.enquiry_notes for insert to authenticated
  with check ((select private.is_active_admin()) and admin_user_id = (select auth.uid()));

create policy "Active administrators can read enquiry status history"
  on public.enquiry_status_history for select to authenticated
  using ((select private.is_active_admin()));

create policy "Active administrators can read appointment status history"
  on public.appointment_status_history for select to authenticated
  using ((select private.is_active_admin()));

create policy "Active administrators can read the activity log"
  on public.activity_logs for select to authenticated
  using ((select private.is_active_admin()));

-- ---------------------------------------------------------------------------------------------------------------
-- 4. Safety net: nothing here is reachable through the sequence either
-- ---------------------------------------------------------------------------------------------------------------

revoke all on all tables in schema private from public, anon, authenticated, service_role;
revoke all on all sequences in schema private from public, anon, authenticated, service_role;
