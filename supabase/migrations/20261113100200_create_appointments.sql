-- Stage 6.3, migration 3 of 6: appointment requests and their scheduling.
--
-- An enquiry may have MANY appointment records over time. What the customer asked for (preferred date and time) is
-- fixed once written; rescheduling means cancelling the old record and creating a new one that points back to it
-- (rescheduled_from_id), so earlier information is never overwritten or lost. At most one record per enquiry can be
-- open (requested or confirmed) at a time.
--
-- An appointment is NEVER confirmed by the website: it starts as 'requested' and only an administrator can move it
-- to 'confirmed', which also requires a confirmed date and time (enforced below).

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries (id) on delete restrict,
  preferred_date date not null,
  preferred_time time without time zone not null,
  timezone text not null default 'Africa/Lagos',
  status text not null default 'requested',
  confirmed_date date,
  confirmed_time time without time zone,
  -- Internal scheduling information (administrators only, like every table in this schema).
  venue text,
  scheduling_note text,
  confirmed_by uuid,
  confirmed_at timestamptz,
  rescheduled_from_id uuid references public.appointments (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint appointments_timezone_length check (char_length(timezone) between 3 and 64),
  constraint appointments_status_allowed check (status in ('requested', 'confirmed', 'completed', 'cancelled')),
  -- The confirmed date and time come as a pair.
  constraint appointments_confirmed_pair check ((confirmed_date is null) = (confirmed_time is null)),
  -- Confirmed and completed appointments have a confirmed slot; a still-requested one has none.
  constraint appointments_confirmed_slot check (
    case status
      when 'confirmed' then confirmed_date is not null
      when 'completed' then confirmed_date is not null
      when 'requested' then confirmed_date is null
      else true
    end
  ),
  constraint appointments_venue_length check (venue is null or char_length(venue) between 1 and 200),
  constraint appointments_scheduling_note_length check (
    scheduling_note is null or char_length(scheduling_note) between 1 and 1000
  ),
  constraint appointments_not_self_reschedule check (rescheduled_from_id is distinct from id)
);

comment on table public.appointments is
  'Appointment requests. Never auto-confirmed. Preferred date/time are immutable; reschedule by creating a new record. Never deleted.';

-- At most one open appointment per enquiry. To reschedule: cancel the open one, then create the new one.
create unique index appointments_one_open_per_enquiry
  on public.appointments (enquiry_id)
  where status in ('requested', 'confirmed');

create index appointments_enquiry_id_idx on public.appointments (enquiry_id);
create index appointments_status_date_idx on public.appointments (status, preferred_date);
create index appointments_confirmed_date_idx on public.appointments (confirmed_date) where confirmed_date is not null;

-- Rules applied before every update.
create or replace function private.appointments_before_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- What the customer asked for is a historical fact.
  if new.id is distinct from old.id
     or new.enquiry_id is distinct from old.enquiry_id
     or new.preferred_date is distinct from old.preferred_date
     or new.preferred_time is distinct from old.preferred_time
     or new.timezone is distinct from old.timezone
     or new.rescheduled_from_id is distinct from old.rescheduled_from_id
     or new.created_at is distinct from old.created_at then
    raise exception 'The requested appointment details are fixed. Create a new appointment to reschedule.'
      using errcode = 'restrict_violation';
  end if;

  -- Completed and cancelled are final.
  if old.status in ('completed', 'cancelled') and new.status is distinct from old.status then
    raise exception 'A % appointment cannot change status. Create a new appointment instead.', old.status
      using errcode = 'restrict_violation';
  end if;

  -- Who confirmed it, and when, is stamped by the database, never taken from the client.
  if new.status = 'confirmed' and old.status is distinct from 'confirmed' then
    new.confirmed_by := (select auth.uid());
    new.confirmed_at := pg_catalog.now();
  else
    new.confirmed_by := old.confirmed_by;
    new.confirmed_at := old.confirmed_at;
  end if;

  return new;
end;
$$;

revoke all on function private.appointments_before_update() from public, anon, authenticated;

-- Trigger order is alphabetical by name: the rules, then updated_at.
create trigger appointments_a_before_update
  before update on public.appointments
  for each row execute function private.appointments_before_update();

create trigger appointments_b_set_updated_at
  before update on public.appointments
  for each row execute function private.set_updated_at();

create trigger appointments_forbid_delete
  before delete on public.appointments
  for each row execute function private.forbid_delete();
