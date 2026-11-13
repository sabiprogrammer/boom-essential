-- Stage 6.3, migration 5 of 6: automatic audit records.
--
-- These triggers write the status history and the activity log, so the trail exists whichever code path made the
-- change (the dashboard, a future server action, someone using the SQL editor) and cannot be forged by a client.
--
-- A history row is written ONLY when a status genuinely changes: each status trigger fires on UPDATE OF status and
-- has a WHEN (old.status IS DISTINCT FROM new.status) guard, so saving other fields, or "changing" a status to the
-- value it already has, records nothing.
--
-- The functions are SECURITY DEFINER (they write to tables the caller cannot write to) with an empty search_path and
-- fully qualified names. The actor is auth.uid(): the verified user behind the request, or NULL when there is none.
-- Activity metadata carries only statuses, the public reference and the division, never personal data.

-- A new enquiry from the website.
create or replace function private.log_enquiry_received()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := (select auth.uid());
begin
  insert into public.activity_logs (actor_id, actor_type, action, entity_type, entity_id, enquiry_id, metadata)
  values (
    v_actor,
    case when v_actor is null then 'system' else 'admin' end,
    'enquiry_received',
    'enquiry',
    new.id,
    new.id,
    pg_catalog.jsonb_build_object('reference', new.reference, 'division', new.division)
  );
  return null;
end;
$$;

-- An enquiry's status changed.
create or replace function private.log_enquiry_status_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := (select auth.uid());
begin
  insert into public.enquiry_status_history (enquiry_id, previous_status, new_status, changed_by)
  values (new.id, old.status, new.status, v_actor);

  insert into public.activity_logs (actor_id, actor_type, action, entity_type, entity_id, enquiry_id, metadata)
  values (
    v_actor,
    case when v_actor is null then 'system' else 'admin' end,
    'enquiry_status_changed',
    'enquiry',
    new.id,
    new.id,
    pg_catalog.jsonb_build_object('from_status', old.status, 'to_status', new.status, 'reference', new.reference)
  );
  return null;
end;
$$;

-- A new appointment request (or a rescheduled record).
create or replace function private.log_appointment_requested()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := (select auth.uid());
  v_reference text;
begin
  select e.reference into v_reference from public.enquiries as e where e.id = new.enquiry_id;

  insert into public.activity_logs (actor_id, actor_type, action, entity_type, entity_id, enquiry_id, metadata)
  values (
    v_actor,
    case when v_actor is null then 'system' else 'admin' end,
    'appointment_requested',
    'appointment',
    new.id,
    new.enquiry_id,
    pg_catalog.jsonb_build_object('reference', v_reference, 'to_status', new.status)
  );
  return null;
end;
$$;

-- An appointment's status changed: confirmed and cancelled get their own actions, anything else a general one.
create or replace function private.log_appointment_status_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := (select auth.uid());
  v_reference text;
begin
  select e.reference into v_reference from public.enquiries as e where e.id = new.enquiry_id;

  insert into public.appointment_status_history (appointment_id, previous_status, new_status, changed_by)
  values (new.id, old.status, new.status, v_actor);

  insert into public.activity_logs (actor_id, actor_type, action, entity_type, entity_id, enquiry_id, metadata)
  values (
    v_actor,
    case when v_actor is null then 'system' else 'admin' end,
    case new.status
      when 'confirmed' then 'appointment_confirmed'
      when 'cancelled' then 'appointment_cancelled'
      else 'appointment_status_changed'
    end,
    'appointment',
    new.id,
    new.enquiry_id,
    pg_catalog.jsonb_build_object('from_status', old.status, 'to_status', new.status, 'reference', v_reference)
  );
  return null;
end;
$$;

-- An internal note was added. The note's text is never copied into the log.
create or replace function private.log_note_added()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_reference text;
begin
  select e.reference into v_reference from public.enquiries as e where e.id = new.enquiry_id;

  insert into public.activity_logs (actor_id, actor_type, action, entity_type, entity_id, enquiry_id, metadata)
  values (
    new.admin_user_id,
    'admin',
    'note_added',
    'note',
    new.id,
    new.enquiry_id,
    pg_catalog.jsonb_build_object('reference', v_reference)
  );
  return null;
end;
$$;

revoke all on function private.log_enquiry_received() from public, anon, authenticated;
revoke all on function private.log_enquiry_status_change() from public, anon, authenticated;
revoke all on function private.log_appointment_requested() from public, anon, authenticated;
revoke all on function private.log_appointment_status_change() from public, anon, authenticated;
revoke all on function private.log_note_added() from public, anon, authenticated;

create trigger enquiries_log_received
  after insert on public.enquiries
  for each row execute function private.log_enquiry_received();

create trigger enquiries_log_status_change
  after update of status on public.enquiries
  for each row
  when (old.status is distinct from new.status)
  execute function private.log_enquiry_status_change();

create trigger appointments_log_requested
  after insert on public.appointments
  for each row execute function private.log_appointment_requested();

create trigger appointments_log_status_change
  after update of status on public.appointments
  for each row
  when (old.status is distinct from new.status)
  execute function private.log_appointment_status_change();

create trigger enquiry_notes_log_added
  after insert on public.enquiry_notes
  for each row execute function private.log_note_added();
