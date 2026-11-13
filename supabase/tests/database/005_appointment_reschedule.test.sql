-- pgTAP: public.reschedule_appointment() and public.am_i_active_admin(). Run with `supabase test db` against a LOCAL database.
-- Roles are switched with SET LOCAL ROLE and a fake JWT subject, exactly as PostgREST does for a request.

begin;
create extension if not exists pgtap with schema extensions;
set local search_path to public, extensions;

select plan(45);

-- Fake people: 1111 active owner, 2222 INACTIVE admin, 3333 ordinary signed-in account.
insert into auth.users (id, aud, role, email) values
  ('11111111-1111-4111-8111-111111111111', 'authenticated', 'authenticated', 'owner@example.invalid'),
  ('22222222-2222-4222-8222-222222222222', 'authenticated', 'authenticated', 'inactive@example.invalid'),
  ('33333333-3333-4333-8333-333333333333', 'authenticated', 'authenticated', 'customer@example.invalid');
insert into private.admin_users (user_id, role, is_active) values
  ('11111111-1111-4111-8111-111111111111', 'owner', true),
  ('22222222-2222-4222-8222-222222222222', 'admin', false);

-- E1 has a REQUESTED appointment; E2 has a CONFIRMED one with a venue. Created by the system (no signed-in user).
insert into public.enquiries (id, full_name, phone, division, message) values
  ('cccccccc-0000-4000-8000-000000000001', 'Demo One', '08055544415', 'general', 'A perfectly ordinary test message.'),
  ('cccccccc-0000-4000-8000-000000000002', 'Demo Two', '08055544416', 'general', 'A second ordinary test message.');
insert into public.appointments (id, enquiry_id, preferred_date, preferred_time) values
  ('dddddddd-0000-4000-8000-000000000001', 'cccccccc-0000-4000-8000-000000000001', (timezone('Africa/Lagos', now()))::date + 10, '09:00'),
  ('dddddddd-0000-4000-8000-000000000002', 'cccccccc-0000-4000-8000-000000000002', (timezone('Africa/Lagos', now()))::date + 12, '15:00');
update public.appointments set status = 'confirmed', confirmed_date = preferred_date, confirmed_time = '15:30', venue = 'Customer site'
  where id = 'dddddddd-0000-4000-8000-000000000002';

-- Helper: call the function as the signed-in role with the given JWT subject (owner-side lookups happen after reset role).
create schema tap_helpers;
grant usage on schema tap_helpers to authenticated;
create function tap_helpers.resched(p_id uuid, p_expected text, p_days int, p_time time, p_confirm boolean default false, p_note text default null)
returns jsonb language sql as $$
  select public.reschedule_appointment(p_id, p_expected, (timezone('Africa/Lagos', now()))::date + p_days, p_time, p_confirm, p_note)
$$;
grant execute on all functions in schema tap_helpers to authenticated;

-- ---------------------------------------------------------------------------------------------------------------
-- Who may call what
-- ---------------------------------------------------------------------------------------------------------------

select ok(not has_function_privilege('anon', 'public.reschedule_appointment(uuid, text, date, time without time zone, boolean, text)', 'execute'), 'anon cannot execute reschedule_appointment');
select ok(has_function_privilege('authenticated', 'public.reschedule_appointment(uuid, text, date, time without time zone, boolean, text)', 'execute'), 'a signed-in role can execute reschedule_appointment');
select ok(not has_function_privilege('anon', 'public.am_i_active_admin()', 'execute'), 'anon cannot execute am_i_active_admin');
select ok(has_function_privilege('authenticated', 'public.am_i_active_admin()', 'execute'), 'a signed-in role can execute am_i_active_admin');

do $$ begin perform set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true); end $$;
set local role authenticated;
select is(public.am_i_active_admin(), true, 'an active administrator is told so');
reset role;
do $$ begin perform set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}', true); end $$;
set local role authenticated;
select is(public.am_i_active_admin(), false, 'an inactive administrator is told they are not active');
reset role;
do $$ begin perform set_config('request.jwt.claims', '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated"}', true); end $$;
set local role authenticated;
select is(public.am_i_active_admin(), false, 'a signed-in non-administrator is told they are not');
reset role;
do $$ begin perform set_config('request.jwt.claims', '', true); end $$;
set local role authenticated;
select is(public.am_i_active_admin(), false, 'a request with no verified user is not an administrator');
reset role;

set local role anon;
select throws_ok($$select public.am_i_active_admin()$$, '42501', null, 'anon cannot ask am_i_active_admin');
select throws_ok($$select public.reschedule_appointment('dddddddd-0000-4000-8000-000000000001', 'requested', (timezone('Africa/Lagos', now()))::date + 20, '10:00', false, null)$$, '42501', null, 'anon cannot reschedule');
reset role;

-- ---------------------------------------------------------------------------------------------------------------
-- A non-administrator and an inactive administrator find nothing, and change nothing
-- ---------------------------------------------------------------------------------------------------------------

do $$ begin perform set_config('request.jwt.claims', '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated"}', true); end $$;
set local role authenticated;
select is((tap_helpers.resched('dddddddd-0000-4000-8000-000000000001', 'requested', 20, '10:00')) ->> 'outcome', 'not_found', 'a signed-in non-administrator cannot see the appointment');
reset role;
do $$ begin perform set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}', true); end $$;
set local role authenticated;
select is((tap_helpers.resched('dddddddd-0000-4000-8000-000000000001', 'requested', 20, '10:00')) ->> 'outcome', 'not_found', 'an inactive administrator cannot see it either');
reset role;
select is((select status from public.appointments where id = 'dddddddd-0000-4000-8000-000000000001'), 'requested', 'and nothing was changed');

-- ---------------------------------------------------------------------------------------------------------------
-- An active administrator reschedules a REQUESTED appointment
-- ---------------------------------------------------------------------------------------------------------------

do $$ begin perform set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true); end $$;
set local role authenticated;
select is((tap_helpers.resched('dddddddd-0000-4000-8000-000000000001', 'requested', 20, '10:00', false, 'Customer asked for a later date.')) ->> 'outcome', 'rescheduled', 'an active administrator can reschedule');
reset role;

select is((select status from public.appointments where id = 'dddddddd-0000-4000-8000-000000000001'), 'cancelled', 'the original is cancelled, not deleted');
select ok(
  (select preferred_date = (timezone('Africa/Lagos', now()))::date + 10 and preferred_time = '09:00' from public.appointments where id = 'dddddddd-0000-4000-8000-000000000001'),
  'the original keeps its requested date and time'
);
select is((select count(*) from public.appointments where enquiry_id = 'cccccccc-0000-4000-8000-000000000001'), 2::bigint, 'the enquiry now has two appointment records');
select is((select status from public.appointments where rescheduled_from_id = 'dddddddd-0000-4000-8000-000000000001'), 'requested', 'the replacement starts as a request');
select is((select count(*) from public.appointments where rescheduled_from_id = 'dddddddd-0000-4000-8000-000000000001'), 1::bigint, 'it is linked to the original');
select ok((select preferred_date = (timezone('Africa/Lagos', now()))::date + 20 and preferred_time = '10:00' from public.appointments where rescheduled_from_id = 'dddddddd-0000-4000-8000-000000000001'), 'it holds the new date and time');
select is((select scheduling_note from public.appointments where rescheduled_from_id = 'dddddddd-0000-4000-8000-000000000001'), 'Customer asked for a later date.', 'it carries the note');
select is((select count(*) from public.appointments where enquiry_id = 'cccccccc-0000-4000-8000-000000000001' and status in ('requested', 'confirmed')), 1::bigint, 'exactly one appointment is open');
select is(
  (select count(*) from public.activity_logs where action = 'appointment_cancelled' and entity_id = 'dddddddd-0000-4000-8000-000000000001' and actor_type = 'admin' and actor_id = '11111111-1111-4111-8111-111111111111'),
  1::bigint, 'the cancellation is logged against the administrator'
);
select is((select count(*) from public.activity_logs a join public.appointments p on p.id = a.entity_id where a.action = 'appointment_requested' and p.rescheduled_from_id = 'dddddddd-0000-4000-8000-000000000001'), 1::bigint, 'the replacement request is logged');
select is(
  (select count(*) from public.appointment_status_history where appointment_id = 'dddddddd-0000-4000-8000-000000000001' and previous_status = 'requested' and new_status = 'cancelled' and changed_by = '11111111-1111-4111-8111-111111111111'),
  1::bigint, 'the status history records who cancelled it'
);

-- A stale request: the appointment no longer has the status the administrator was looking at.
do $$ begin perform set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true); end $$;
set local role authenticated;
select is((tap_helpers.resched('dddddddd-0000-4000-8000-000000000001', 'requested', 25, '10:00')) ->> 'outcome', 'conflict', 'a cancelled appointment cannot be rescheduled again (conflict)');
select throws_ok($$select tap_helpers.resched('dddddddd-0000-4000-8000-000000000001', 'cancelled', 25, '10:00')$$, '22023', null, 'only requested or confirmed appointments can be named as the one to reschedule');
reset role;
select is((select count(*) from public.appointments where enquiry_id = 'cccccccc-0000-4000-8000-000000000001'), 2::bigint, 'a conflict creates nothing');

-- ---------------------------------------------------------------------------------------------------------------
-- Reschedule and confirm in one step; reschedule a CONFIRMED appointment
-- ---------------------------------------------------------------------------------------------------------------

do $$ begin perform set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true); end $$;
set local role authenticated;
select is(
  (tap_helpers.resched((select id from public.appointments where rescheduled_from_id = 'dddddddd-0000-4000-8000-000000000001'), 'requested', 30, '11:00', true)) ->> 'confirmed',
  'true', 'rescheduling can confirm the new time straight away'
);
reset role;
select ok(
  (select status = 'confirmed' and confirmed_date = (timezone('Africa/Lagos', now()))::date + 30 and confirmed_time = '11:00'
     from public.appointments where rescheduled_from_id = (select id from public.appointments where rescheduled_from_id = 'dddddddd-0000-4000-8000-000000000001')),
  'the replacement is confirmed for the new slot'
);
select is(
  (select confirmed_by from public.appointments where rescheduled_from_id = (select id from public.appointments where rescheduled_from_id = 'dddddddd-0000-4000-8000-000000000001')),
  '11111111-1111-4111-8111-111111111111'::uuid, 'the database stamped who confirmed it'
);
select is(
  (select count(*) from public.appointments where enquiry_id = 'cccccccc-0000-4000-8000-000000000001'),
  3::bigint, 'the chain now holds three records, none deleted'
);
select is((select status from public.appointments where rescheduled_from_id = 'dddddddd-0000-4000-8000-000000000001'), 'cancelled', 'the intermediate request was cancelled');

do $$ begin perform set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true); end $$;
set local role authenticated;
select is((tap_helpers.resched('dddddddd-0000-4000-8000-000000000002', 'confirmed', 15, '14:00')) ->> 'outcome', 'rescheduled', 'a confirmed appointment can be rescheduled');
reset role;
select is((select status from public.appointments where id = 'dddddddd-0000-4000-8000-000000000002'), 'cancelled', 'the confirmed original is cancelled');
select is((select venue from public.appointments where rescheduled_from_id = 'dddddddd-0000-4000-8000-000000000002'), 'Customer site', 'the venue is carried over');
select is((select status from public.appointments where rescheduled_from_id = 'dddddddd-0000-4000-8000-000000000002'), 'requested', 'and the new slot needs confirming (unless asked to confirm)');

-- ---------------------------------------------------------------------------------------------------------------
-- The database refuses bad dates
-- ---------------------------------------------------------------------------------------------------------------

do $$ begin perform set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true); end $$;
set local role authenticated;
select throws_ok($$select tap_helpers.resched((select id from public.appointments where rescheduled_from_id = 'dddddddd-0000-4000-8000-000000000002'), 'requested', -1, '10:00')$$, '23514', null, 'a date in the past is refused');
select throws_ok($$select tap_helpers.resched((select id from public.appointments where rescheduled_from_id = 'dddddddd-0000-4000-8000-000000000002'), 'requested', 400, '10:00')$$, '23514', null, 'a date more than a year ahead is refused');
select throws_ok($$select public.reschedule_appointment((select id from public.appointments where rescheduled_from_id = 'dddddddd-0000-4000-8000-000000000002'), 'requested', null, '10:00', false, null)$$, '22023', null, 'a missing date is refused');
reset role;

-- ---------------------------------------------------------------------------------------------------------------
-- Atomicity: if the replacement cannot be created, the original is NOT cancelled
-- ---------------------------------------------------------------------------------------------------------------

create function tap_helpers.fail_insert() returns trigger language plpgsql as $$
begin
  raise exception 'forced failure' using errcode = 'P0001';
end;
$$;
create trigger zz_force_failure before insert on public.appointments for each row execute function tap_helpers.fail_insert();

select is((select count(*) from public.appointments), 5::bigint, 'five appointment records exist before the failure test');

do $$ begin perform set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true); end $$;
set local role authenticated;
select throws_ok(
  $$select tap_helpers.resched((select id from public.appointments where rescheduled_from_id = 'dddddddd-0000-4000-8000-000000000002'), 'requested', 40, '10:00')$$,
  'P0001', 'forced failure', 'a failure while creating the replacement raises'
);
reset role;
select is(
  (select status from public.appointments where rescheduled_from_id = 'dddddddd-0000-4000-8000-000000000002'), 'requested',
  'the open appointment was NOT cancelled (all or nothing)'
);
select is((select count(*) from public.appointments), 5::bigint, 'and no replacement was left behind');
select is(
  (select count(*) from public.activity_logs where action = 'appointment_cancelled' and entity_id = (select id from public.appointments where rescheduled_from_id = 'dddddddd-0000-4000-8000-000000000002')),
  0::bigint, 'and no cancellation was logged'
);
drop trigger zz_force_failure on public.appointments;

select * from finish();
rollback;
