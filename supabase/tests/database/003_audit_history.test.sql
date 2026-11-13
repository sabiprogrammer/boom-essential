-- pgTAP: status history, activity log and their immutability. Run with `supabase test db` against a LOCAL database.

begin;
create extension if not exists pgtap with schema extensions;
set local search_path to public, extensions;

select plan(41);

insert into auth.users (id, aud, role, email) values
  ('11111111-1111-4111-8111-111111111111', 'authenticated', 'authenticated', 'owner@example.invalid');
insert into private.admin_users (user_id, role, is_active) values
  ('11111111-1111-4111-8111-111111111111', 'owner', true);

-- A new enquiry from the website (no signed-in user).
insert into public.enquiries (id, full_name, phone, division, requested_service, message)
values ('aaaaaaaa-0000-4000-8000-000000000001', 'Demo Customer', '08055544415', 'energy', array['solar-installation'],
        'We would like a solar quotation for our shop.');

-- ---------------------------------------------------------------------------------------------------------------
-- A new enquiry is logged once, as a system event, and starts with no status history
-- ---------------------------------------------------------------------------------------------------------------

select is(
  (select count(*) from public.activity_logs where entity_id = 'aaaaaaaa-0000-4000-8000-000000000001' and action = 'enquiry_received'),
  1::bigint, 'receiving an enquiry writes one activity entry'
);
select is(
  (select actor_type from public.activity_logs where entity_id = 'aaaaaaaa-0000-4000-8000-000000000001' and action = 'enquiry_received'),
  'system', 'the entry is a system event'
);
select ok(
  (select actor_id is null from public.activity_logs where entity_id = 'aaaaaaaa-0000-4000-8000-000000000001' and action = 'enquiry_received'),
  'the entry has no administrator actor'
);
select is(
  (select metadata ->> 'division' from public.activity_logs where entity_id = 'aaaaaaaa-0000-4000-8000-000000000001' and action = 'enquiry_received'),
  'energy', 'the entry records the division'
);
select ok(
  (select metadata ->> 'reference' ~ '^BOOM-' from public.activity_logs where entity_id = 'aaaaaaaa-0000-4000-8000-000000000001' and action = 'enquiry_received'),
  'the entry records the public reference, not personal data'
);
select is(
  (select count(*) from public.enquiry_status_history where enquiry_id = 'aaaaaaaa-0000-4000-8000-000000000001'),
  0::bigint, 'creating an enquiry is not a status change'
);

-- ---------------------------------------------------------------------------------------------------------------
-- Ordinary updates create no false status-change records
-- ---------------------------------------------------------------------------------------------------------------

update public.enquiries set phone_e164 = '+2348055544415' where id = 'aaaaaaaa-0000-4000-8000-000000000001';
select is(
  (select count(*) from public.enquiry_status_history where enquiry_id = 'aaaaaaaa-0000-4000-8000-000000000001'),
  0::bigint, 'updating another field writes no status history'
);
update public.enquiries set status = 'new' where id = 'aaaaaaaa-0000-4000-8000-000000000001';
select is(
  (select count(*) from public.enquiry_status_history where enquiry_id = 'aaaaaaaa-0000-4000-8000-000000000001'),
  0::bigint, 'setting a status to the value it already has writes no history'
);
select is(
  (select count(*) from public.activity_logs where entity_id = 'aaaaaaaa-0000-4000-8000-000000000001' and action = 'enquiry_status_changed'),
  0::bigint, 'and no activity entry either'
);

-- ---------------------------------------------------------------------------------------------------------------
-- A real status change, made by a signed-in administrator
-- ---------------------------------------------------------------------------------------------------------------

set local role authenticated;
do $$ begin perform set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true); end $$;
update public.enquiries set status = 'in_progress' where id = 'aaaaaaaa-0000-4000-8000-000000000001';
reset role;
do $$ begin perform set_config('request.jwt.claims', '', true); end $$;

select is(
  (select count(*) from public.enquiry_status_history where enquiry_id = 'aaaaaaaa-0000-4000-8000-000000000001'),
  1::bigint, 'a real change writes exactly one history row'
);
select is(
  (select previous_status || ' > ' || new_status from public.enquiry_status_history where enquiry_id = 'aaaaaaaa-0000-4000-8000-000000000001'),
  'new > in_progress', 'the history records the previous and the new status'
);
select is(
  (select changed_by from public.enquiry_status_history where enquiry_id = 'aaaaaaaa-0000-4000-8000-000000000001'),
  '11111111-1111-4111-8111-111111111111'::uuid, 'the history records the administrator responsible'
);
select ok(
  (select changed_at is not null from public.enquiry_status_history where enquiry_id = 'aaaaaaaa-0000-4000-8000-000000000001'),
  'the history records when'
);
select is(
  (select actor_id from public.activity_logs where entity_id = 'aaaaaaaa-0000-4000-8000-000000000001' and action = 'enquiry_status_changed'),
  '11111111-1111-4111-8111-111111111111'::uuid, 'the activity entry names the administrator'
);
select is(
  (select metadata ->> 'from_status' || ' > ' || (metadata ->> 'to_status') from public.activity_logs
    where entity_id = 'aaaaaaaa-0000-4000-8000-000000000001' and action = 'enquiry_status_changed'),
  'new > in_progress', 'the activity entry carries both statuses'
);

-- A second change with no signed-in user (for example a server process) leaves the actor empty.
update public.enquiries set status = 'contacted' where id = 'aaaaaaaa-0000-4000-8000-000000000001';
select is(
  (select count(*) from public.enquiry_status_history where enquiry_id = 'aaaaaaaa-0000-4000-8000-000000000001'),
  2::bigint, 'a second change adds a second row'
);
select ok(
  (select changed_by is null from public.enquiry_status_history
    where enquiry_id = 'aaaaaaaa-0000-4000-8000-000000000001' and new_status = 'contacted'),
  'with no signed-in user the actor is recorded as empty, not invented'
);

-- A rejected status leaves no trace.
select throws_ok(
  $$ update public.enquiries set status = 'closed' where id = 'aaaaaaaa-0000-4000-8000-000000000001' $$,
  '23514', null, 'an invalid status is rejected'
);
select is(
  (select count(*) from public.enquiry_status_history where enquiry_id = 'aaaaaaaa-0000-4000-8000-000000000001'),
  2::bigint, 'a rejected change writes no history'
);

-- ---------------------------------------------------------------------------------------------------------------
-- Appointments
-- ---------------------------------------------------------------------------------------------------------------

insert into public.appointments (id, enquiry_id, preferred_date, preferred_time)
values ('bbbbbbbb-0000-4000-8000-000000000001', 'aaaaaaaa-0000-4000-8000-000000000001', '2026-12-01', '10:00');

select is(
  (select count(*) from public.activity_logs where entity_id = 'bbbbbbbb-0000-4000-8000-000000000001' and action = 'appointment_requested'),
  1::bigint, 'an appointment request is logged'
);
select is(
  (select count(*) from public.appointment_status_history where appointment_id = 'bbbbbbbb-0000-4000-8000-000000000001'),
  0::bigint, 'requesting is not a status change'
);

update public.appointments set venue = 'Customer premises' where id = 'bbbbbbbb-0000-4000-8000-000000000001';
select is(
  (select count(*) from public.appointment_status_history where appointment_id = 'bbbbbbbb-0000-4000-8000-000000000001'),
  0::bigint, 'updating scheduling details is not a status change'
);

set local role authenticated;
do $$ begin perform set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true); end $$;
update public.appointments set status = 'confirmed', confirmed_date = '2026-12-01', confirmed_time = '10:30'
  where id = 'bbbbbbbb-0000-4000-8000-000000000001';
reset role;
do $$ begin perform set_config('request.jwt.claims', '', true); end $$;

select is(
  (select previous_status || ' > ' || new_status from public.appointment_status_history where appointment_id = 'bbbbbbbb-0000-4000-8000-000000000001'),
  'requested > confirmed', 'confirming writes a history row with both statuses'
);
select is(
  (select changed_by from public.appointment_status_history where appointment_id = 'bbbbbbbb-0000-4000-8000-000000000001'),
  '11111111-1111-4111-8111-111111111111'::uuid, 'the history names the administrator'
);
select is(
  (select count(*) from public.activity_logs where entity_id = 'bbbbbbbb-0000-4000-8000-000000000001' and action = 'appointment_confirmed'),
  1::bigint, 'confirming writes an appointment_confirmed activity entry'
);
select is(
  (select confirmed_by from public.appointments where id = 'bbbbbbbb-0000-4000-8000-000000000001'),
  '11111111-1111-4111-8111-111111111111'::uuid, 'the confirming administrator is stamped'
);
select ok(
  (select confirmed_at is not null from public.appointments where id = 'bbbbbbbb-0000-4000-8000-000000000001'),
  'and so is the confirmation time'
);

update public.appointments set status = 'cancelled' where id = 'bbbbbbbb-0000-4000-8000-000000000001';
select is(
  (select count(*) from public.activity_logs where entity_id = 'bbbbbbbb-0000-4000-8000-000000000001' and action = 'appointment_cancelled'),
  1::bigint, 'cancelling writes an appointment_cancelled activity entry'
);
select is(
  (select count(*) from public.appointment_status_history where appointment_id = 'bbbbbbbb-0000-4000-8000-000000000001'),
  2::bigint, 'both changes are in the appointment history'
);
select ok(
  (select confirmed_date is not null from public.appointments where id = 'bbbbbbbb-0000-4000-8000-000000000001'),
  'cancelling keeps the confirmed slot on record'
);

-- ---------------------------------------------------------------------------------------------------------------
-- Notes: logged without their text
-- ---------------------------------------------------------------------------------------------------------------

insert into public.enquiry_notes (id, enquiry_id, admin_user_id, content)
values ('cccccccc-0000-4000-8000-000000000001', 'aaaaaaaa-0000-4000-8000-000000000001',
        '11111111-1111-4111-8111-111111111111', 'Customer asked about financing: SECRET-NOTE-TEXT');

select is(
  (select count(*) from public.activity_logs where entity_id = 'cccccccc-0000-4000-8000-000000000001' and action = 'note_added'),
  1::bigint, 'adding a note writes one activity entry'
);
select ok(
  (select metadata::text not like '%SECRET-NOTE-TEXT%' and metadata::text not like '%financing%'
     from public.activity_logs where entity_id = 'cccccccc-0000-4000-8000-000000000001'),
  'the note text is never copied into the activity log'
);
select is(
  (select actor_id from public.activity_logs where entity_id = 'cccccccc-0000-4000-8000-000000000001'),
  '11111111-1111-4111-8111-111111111111'::uuid, 'the entry names the note author'
);

-- ---------------------------------------------------------------------------------------------------------------
-- The log is append-only: nobody, not even the table owner, can rewrite or erase it
-- ---------------------------------------------------------------------------------------------------------------

select throws_ok(
  $$ update public.enquiry_status_history set new_status = 'resolved' $$,
  '23001', null, 'enquiry status history cannot be edited'
);
select throws_ok(
  $$ delete from public.enquiry_status_history $$,
  '23001', null, 'enquiry status history cannot be deleted'
);
select throws_ok(
  $$ update public.appointment_status_history set new_status = 'completed' $$,
  '23001', null, 'appointment status history cannot be edited'
);
select throws_ok(
  $$ delete from public.appointment_status_history $$,
  '23001', null, 'appointment status history cannot be deleted'
);
select throws_ok(
  $$ update public.activity_logs set action = 'note_added' $$,
  '23001', null, 'activity entries cannot be edited'
);
select throws_ok(
  $$ delete from public.activity_logs $$,
  '23001', null, 'activity entries cannot be deleted'
);
select throws_ok(
  $$ update public.enquiry_notes set content = 'edited' $$,
  '23001', null, 'notes cannot be edited, even by the owner'
);
select throws_ok(
  $$ delete from public.enquiry_notes $$,
  '23001', null, 'notes cannot be deleted, even by the owner'
);

select * from finish();
rollback;
