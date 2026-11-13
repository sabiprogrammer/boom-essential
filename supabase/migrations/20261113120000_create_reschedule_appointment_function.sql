-- Stage 6.6, migration 9 of 10: rescheduling an appointment in ONE transaction.
--
-- WHY: the schema's design is that a reschedule never rewrites history. The original appointment is CANCELLED (and kept)
-- and a NEW appointment is created that points back at it (rescheduled_from_id). Only one appointment per enquiry may
-- be open (requested or confirmed) at a time, so the old one has to be cancelled BEFORE the new one can be inserted.
-- Done as two separate calls from the application, a failure between them would leave an enquiry with a cancelled
-- appointment and no replacement. A function body is atomic: either both happen or neither does.
--
-- SECURITY: this function is SECURITY INVOKER, so it runs with the CALLER's privileges. It grants nothing: every row it
-- reads or writes is still subject to Row Level Security (only an ACTIVE administrator can see or change an appointment)
-- and to the column-level grants (it uses only columns administrators may already write). For anyone else it simply
-- finds nothing and reports "not_found". The audit trail is still written by the existing triggers (appointment
-- cancelled, then appointment requested for the replacement, then confirmed when asked), with the caller as the actor.
--
-- The result is jsonb: {"outcome": "rescheduled" | "conflict" | "not_found", "appointment_id": uuid, "confirmed": bool}.
-- "conflict" means the appointment no longer has the status the administrator was looking at (someone else changed it).

create or replace function public.reschedule_appointment(
  p_appointment_id uuid,
  p_expected_status text,
  p_preferred_date date,
  p_preferred_time time without time zone,
  p_confirm boolean default false,
  p_note text default null
)
returns jsonb
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  v_today date := pg_catalog.timezone('Africa/Lagos', pg_catalog.now())::date;
  v_old public.appointments%rowtype;
  v_new_id uuid;
begin
  if p_appointment_id is null or p_preferred_date is null or p_preferred_time is null then
    raise exception 'An appointment, a new date and a new time are required.' using errcode = 'invalid_parameter_value';
  end if;
  if p_expected_status is null or p_expected_status not in ('requested', 'confirmed') then
    raise exception 'Only a requested or confirmed appointment can be rescheduled.' using errcode = 'invalid_parameter_value';
  end if;
  if p_preferred_date < v_today or p_preferred_date > v_today + 366 then
    raise exception 'The new date is outside the allowed range.' using errcode = 'check_violation';
  end if;

  -- Lock the row so two administrators cannot reschedule the same appointment at once.
  select a.* into v_old from public.appointments as a where a.id = p_appointment_id for update;
  if not found then
    return pg_catalog.jsonb_build_object('outcome', 'not_found');
  end if;
  if v_old.status is distinct from p_expected_status then
    return pg_catalog.jsonb_build_object('outcome', 'conflict');
  end if;

  -- 1. The original is cancelled, not deleted or edited: its requested date and time stay as the historical record.
  update public.appointments set status = 'cancelled' where id = v_old.id;

  -- 2. The replacement points back at it. It starts as a request for the new slot.
  insert into public.appointments (enquiry_id, preferred_date, preferred_time, venue, scheduling_note, rescheduled_from_id)
  values (v_old.enquiry_id, p_preferred_date, p_preferred_time, v_old.venue, nullif(p_note, ''), v_old.id)
  returning id into v_new_id;

  -- 3. Optionally confirm it straight away (the database stamps who confirmed it and when).
  if coalesce(p_confirm, false) then
    update public.appointments
       set status = 'confirmed', confirmed_date = p_preferred_date, confirmed_time = p_preferred_time
     where id = v_new_id;
  end if;

  return pg_catalog.jsonb_build_object('outcome', 'rescheduled', 'appointment_id', v_new_id, 'confirmed', coalesce(p_confirm, false));
end;
$$;

comment on function public.reschedule_appointment(uuid, text, date, time without time zone, boolean, text) is
  'Cancels an open appointment and creates its linked replacement atomically. SECURITY INVOKER: row-level security and column grants still decide who may do this.';

revoke all on function public.reschedule_appointment(uuid, text, date, time without time zone, boolean, text) from public, anon;
grant execute on function public.reschedule_appointment(uuid, text, date, time without time zone, boolean, text) to authenticated;
