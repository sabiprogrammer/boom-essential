-- pgTAP: structure, constraints, generated references, foreign keys and immutability.
-- Run with the Supabase CLI against a LOCAL database: `supabase test db` (needs Docker). Each file runs in a
-- transaction and rolls back, so it leaves nothing behind. All ids below are obviously fake.

begin;
create extension if not exists pgtap with schema extensions;
set local search_path to public, extensions;

select plan(65);

-- Fake people. Active owner, inactive admin, ordinary account.
insert into auth.users (id, aud, role, email) values
  ('11111111-1111-4111-8111-111111111111', 'authenticated', 'authenticated', 'owner@example.invalid'),
  ('22222222-2222-4222-8222-222222222222', 'authenticated', 'authenticated', 'inactive@example.invalid'),
  ('33333333-3333-4333-8333-333333333333', 'authenticated', 'authenticated', 'customer@example.invalid');
insert into private.admin_users (user_id, role, is_active) values
  ('11111111-1111-4111-8111-111111111111', 'owner', true),
  ('22222222-2222-4222-8222-222222222222', 'admin', false);

-- ---------------------------------------------------------------------------------------------------------------
-- Structure and row-level security
-- ---------------------------------------------------------------------------------------------------------------

select ok(to_regclass('public.enquiries') is not null, 'enquiries exists');
select ok(to_regclass('public.appointments') is not null, 'appointments exists');
select ok(to_regclass('public.enquiry_notes') is not null, 'enquiry_notes exists');
select ok(to_regclass('public.enquiry_status_history') is not null, 'enquiry_status_history exists');
select ok(to_regclass('public.appointment_status_history') is not null, 'appointment_status_history exists');
select ok(to_regclass('public.activity_logs') is not null, 'activity_logs exists');
select ok(to_regclass('private.admin_users') is not null, 'private.admin_users exists');

select ok((select relrowsecurity from pg_class where oid = 'public.enquiries'::regclass), 'RLS is on: enquiries');
select ok((select relrowsecurity from pg_class where oid = 'public.appointments'::regclass), 'RLS is on: appointments');
select ok((select relrowsecurity from pg_class where oid = 'public.enquiry_notes'::regclass), 'RLS is on: enquiry_notes');
select ok((select relrowsecurity from pg_class where oid = 'public.enquiry_status_history'::regclass), 'RLS is on: enquiry_status_history');
select ok((select relrowsecurity from pg_class where oid = 'public.appointment_status_history'::regclass), 'RLS is on: appointment_status_history');
select ok((select relrowsecurity from pg_class where oid = 'public.activity_logs'::regclass), 'RLS is on: activity_logs');
select ok((select relrowsecurity from pg_class where oid = 'private.admin_users'::regclass), 'RLS is on: private.admin_users');

select ok(
  not exists (select 1 from information_schema.columns where table_schema in ('public', 'private') and column_name ilike '%price%'),
  'no price column exists anywhere'
);

-- ---------------------------------------------------------------------------------------------------------------
-- Enquiries: valid rows, generated reference, defaults
-- ---------------------------------------------------------------------------------------------------------------

select lives_ok(
  $$ insert into public.enquiries (id, full_name, phone, division, requested_service, message)
     values ('aaaaaaaa-0000-4000-8000-000000000001', 'Demo Customer', '0805 554 4415', 'energy',
             array['solar-installation', 'battery-storage'], 'We would like a solar quotation for our shop.') $$,
  'a valid energy enquiry with several services is accepted'
);

select ok(
  (select reference ~ '^BOOM-[0-9]{4}-[0-9]{5,}$' from public.enquiries where id = 'aaaaaaaa-0000-4000-8000-000000000001'),
  'the database generated a BOOM-YYYY-NNNNN reference'
);
select is(
  (select status from public.enquiries where id = 'aaaaaaaa-0000-4000-8000-000000000001'), 'new',
  'status defaults to new'
);
select is(
  (select source from public.enquiries where id = 'aaaaaaaa-0000-4000-8000-000000000001'), 'website',
  'source defaults to website'
);
select ok(
  (select phone_e164 is null from public.enquiries where id = 'aaaaaaaa-0000-4000-8000-000000000001'),
  'phone_e164 stays NULL until the server normalises it'
);

select lives_ok(
  $$ insert into public.enquiries (id, full_name, phone, phone_e164, email, organisation, location, division, requested_item, message)
     values ('aaaaaaaa-0000-4000-8000-000000000002', 'Second Customer', '+234 805 554 4415', '+2348055544415',
             'second@example.invalid', 'Demo Restaurant', 'Akure', 'foods', array['ofada-rice'],
             'Please send the bag sizes you supply for Ofada rice.') $$,
  'a valid foods enquiry with product slugs, E.164 phone and optional fields is accepted'
);
select isnt(
  (select reference from public.enquiries where id = 'aaaaaaaa-0000-4000-8000-000000000001'),
  (select reference from public.enquiries where id = 'aaaaaaaa-0000-4000-8000-000000000002'),
  'each enquiry gets its own reference'
);

select lives_ok(
  $$ insert into public.enquiries (full_name, phone, division, requested_item, message)
     values ('Machine Buyer', '08055544415', 'industrial-equipment', array['pounding-machine'], 'Which pounding machine sizes can you supply?') $$,
  'an industrial-equipment enquiry for a product is accepted'
);
select lives_ok(
  $$ insert into public.enquiries (full_name, phone, division, requested_service, message)
     values ('Camera Buyer', '08055544415', 'security', array['cctv-installation'], 'We need CCTV installed at our school gate.') $$,
  'a security enquiry for a service is accepted'
);
select lives_ok(
  $$ insert into public.enquiries (full_name, phone, division, message)
     values ('General Visitor', '08055544415', 'general', 'I would like to know more about Boom Multi Global.') $$,
  'a general enquiry with no interests is accepted'
);

-- ---------------------------------------------------------------------------------------------------------------
-- Enquiries: rejected values
-- ---------------------------------------------------------------------------------------------------------------

select throws_ok(
  $$ insert into public.enquiries (full_name, phone, division, message, status)
     values ('Bad Status', '08055544415', 'general', 'This status is not allowed at all.', 'closed') $$,
  '23514', null, 'an invalid enquiry status is rejected'
);
select throws_ok(
  $$ insert into public.enquiries (full_name, phone, division, message)
     values ('Bad Division', '08055544415', 'solar', 'This division does not exist in the form.') $$,
  '23514', null, 'an unknown division is rejected'
);
select throws_ok(
  $$ insert into public.enquiries (full_name, phone, division, message, source)
     values ('Bad Source', '08055544415', 'general', 'This source is not an allowed channel.', 'telepathy') $$,
  '23514', null, 'an unknown source is rejected'
);
select throws_ok(
  $$ insert into public.enquiries (full_name, phone, division, message)
     values ('X', '08055544415', 'general', 'The name above is far too short.') $$,
  '23514', null, 'a one-character name is rejected'
);
select throws_ok(
  $$ insert into public.enquiries (full_name, phone, division, message)
     values ('Short Message', '08055544415', 'general', 'Too short') $$,
  '23514', null, 'a message under 10 characters is rejected'
);
select throws_ok(
  $$ insert into public.enquiries (full_name, phone, email, division, message)
     values ('Bad Email', '08055544415', 'not-an-email', 'general', 'The email address above is invalid.') $$,
  '23514', null, 'a malformed email is rejected'
);
select throws_ok(
  $$ insert into public.enquiries (full_name, phone, phone_e164, division, message)
     values ('Bad E164', '08055544415', '08055544415', 'general', 'The normalised phone is not in E.164 form.') $$,
  '23514', null, 'phone_e164 must be in +E.164 form'
);
select throws_ok(
  $$ insert into public.enquiries (full_name, phone, division, requested_service, message)
     values ('Wrong Kind', '08055544415', 'foods', array['solar-installation'], 'Foods enquiries carry products, not services.') $$,
  '23514', null, 'a foods enquiry cannot carry requested_service'
);
select throws_ok(
  $$ insert into public.enquiries (full_name, phone, division, requested_item, message)
     values ('Wrong Kind', '08055544415', 'energy', array['garri'], 'Energy enquiries carry services, not products.') $$,
  '23514', null, 'an energy enquiry cannot carry requested_item'
);
select throws_ok(
  $$ insert into public.enquiries (full_name, phone, division, requested_item, message)
     values ('General With Item', '08055544415', 'general', array['garri'], 'General enquiries carry no interests at all.') $$,
  '23514', null, 'a general enquiry cannot carry interests'
);
select throws_ok(
  $$ insert into public.enquiries (full_name, phone, division, requested_service, message)
     values ('Bad Slug', '08055544415', 'energy', array['Not A Slug!'], 'The interest above is not a valid slug.') $$,
  '23514', null, 'a malformed interest slug is rejected'
);
select throws_ok(
  $$ insert into public.enquiries (full_name, phone, division, requested_service, message)
     values ('Empty Array', '08055544415', 'energy', array[]::text[], 'An empty interest list should be null instead.') $$,
  '23514', null, 'an empty interest array is rejected (use NULL)'
);

-- ---------------------------------------------------------------------------------------------------------------
-- References: unique, well-formed, immutable
-- ---------------------------------------------------------------------------------------------------------------

select throws_ok(
  format(
    $f$ insert into public.enquiries (reference, full_name, phone, division, message)
        values (%L, 'Duplicate Ref', '08055544415', 'general', 'This reference already belongs to another enquiry.') $f$,
    (select reference from public.enquiries where id = 'aaaaaaaa-0000-4000-8000-000000000001')
  ),
  '23505', null, 'a duplicate enquiry reference is rejected'
);
select throws_ok(
  $$ insert into public.enquiries (reference, full_name, phone, division, message)
     values ('REF-1', 'Bad Ref', '08055544415', 'general', 'This reference does not follow the BOOM format.') $$,
  '23514', null, 'a reference outside the BOOM-YYYY-NNNNN format is rejected'
);
select throws_ok(
  $$ update public.enquiries set reference = 'BOOM-2026-99999' where id = 'aaaaaaaa-0000-4000-8000-000000000001' $$,
  '23001', null, 'a reference cannot be changed after creation'
);
select throws_ok(
  $$ update public.enquiries set created_at = now() - interval '1 day' where id = 'aaaaaaaa-0000-4000-8000-000000000001' $$,
  '23001', null, 'the creation time cannot be changed'
);

-- ---------------------------------------------------------------------------------------------------------------
-- updated_at moves only when something really changes
-- ---------------------------------------------------------------------------------------------------------------

insert into public.enquiries (id, full_name, phone, division, message, created_at, updated_at)
values ('aaaaaaaa-0000-4000-8000-000000000003', 'Old Enquiry', '08055544415', 'general',
        'An enquiry created long ago for the timestamp test.', '2026-01-01 08:00:00+00', '2026-01-01 08:00:00+00');

update public.enquiries set status = 'new' where id = 'aaaaaaaa-0000-4000-8000-000000000003';
select is(
  (select updated_at from public.enquiries where id = 'aaaaaaaa-0000-4000-8000-000000000003'),
  '2026-01-01 08:00:00+00'::timestamptz,
  'a no-op update leaves updated_at alone'
);
update public.enquiries set status = 'contacted' where id = 'aaaaaaaa-0000-4000-8000-000000000003';
select ok(
  (select updated_at > '2026-01-01 08:00:00+00'::timestamptz from public.enquiries where id = 'aaaaaaaa-0000-4000-8000-000000000003'),
  'a real change moves updated_at'
);

-- ---------------------------------------------------------------------------------------------------------------
-- Appointments: constraints, foreign key, one open at a time, rescheduling keeps history
-- ---------------------------------------------------------------------------------------------------------------

select throws_ok(
  $$ insert into public.appointments (enquiry_id, preferred_date, preferred_time)
     values ('aaaaaaaa-0000-4000-8000-0000000000ff', '2026-12-01', '10:00') $$,
  '23503', null, 'an appointment for a non-existent enquiry is rejected (foreign key)'
);

select lives_ok(
  $$ insert into public.appointments (id, enquiry_id, preferred_date, preferred_time)
     values ('bbbbbbbb-0000-4000-8000-000000000001', 'aaaaaaaa-0000-4000-8000-000000000001', '2026-12-01', '10:00') $$,
  'a valid appointment request is accepted'
);
select is(
  (select status from public.appointments where id = 'bbbbbbbb-0000-4000-8000-000000000001'), 'requested',
  'an appointment starts as requested: the website never confirms'
);
select is(
  (select timezone from public.appointments where id = 'bbbbbbbb-0000-4000-8000-000000000001'), 'Africa/Lagos',
  'the timezone defaults to Africa/Lagos'
);

select throws_ok(
  $$ insert into public.appointments (enquiry_id, preferred_date, preferred_time, status)
     values ('aaaaaaaa-0000-4000-8000-000000000002', '2026-12-02', '11:00', 'postponed') $$,
  '23514', null, 'an invalid appointment status is rejected'
);
select throws_ok(
  $$ insert into public.appointments (enquiry_id, preferred_date, preferred_time, status)
     values ('aaaaaaaa-0000-4000-8000-000000000002', '2026-12-02', '11:00', 'confirmed') $$,
  '23514', null, 'a confirmed appointment must carry a confirmed date and time'
);
select throws_ok(
  $$ insert into public.appointments (enquiry_id, preferred_date, preferred_time, confirmed_date, confirmed_time)
     values ('aaaaaaaa-0000-4000-8000-000000000002', '2026-12-02', '11:00', '2026-12-02', null) $$,
  '23514', null, 'a confirmed date without a confirmed time is rejected'
);
select throws_ok(
  $$ insert into public.appointments (enquiry_id, preferred_date, preferred_time)
     values ('aaaaaaaa-0000-4000-8000-000000000001', '2026-12-05', '09:00') $$,
  '23505', null, 'only one open appointment per enquiry is allowed'
);

-- Reschedule: cancel the open one, then create a new record that points back to it. Nothing is overwritten.
update public.appointments set status = 'cancelled' where id = 'bbbbbbbb-0000-4000-8000-000000000001';
select lives_ok(
  $$ insert into public.appointments (id, enquiry_id, preferred_date, preferred_time, rescheduled_from_id)
     values ('bbbbbbbb-0000-4000-8000-000000000002', 'aaaaaaaa-0000-4000-8000-000000000001', '2026-12-08', '14:00',
             'bbbbbbbb-0000-4000-8000-000000000001') $$,
  'after cancelling, a rescheduled appointment can be created for the same enquiry'
);
select is(
  (select count(*) from public.appointments where enquiry_id = 'aaaaaaaa-0000-4000-8000-000000000001'), 2::bigint,
  'the enquiry keeps both appointment records'
);
select is(
  (select preferred_date from public.appointments where id = 'bbbbbbbb-0000-4000-8000-000000000001'), '2026-12-01'::date,
  'the earlier appointment keeps its original details'
);
select throws_ok(
  $$ update public.appointments set preferred_date = '2026-12-20' where id = 'bbbbbbbb-0000-4000-8000-000000000002' $$,
  '23001', null, 'the requested date of an appointment cannot be edited (reschedule creates a new record)'
);
select throws_ok(
  $$ update public.appointments set status = 'confirmed', confirmed_date = '2026-12-08', confirmed_time = '14:00'
     where id = 'bbbbbbbb-0000-4000-8000-000000000001' $$,
  '23001', null, 'a cancelled appointment cannot be revived'
);

-- ---------------------------------------------------------------------------------------------------------------
-- Notes, history and activity: constraints and foreign keys
-- ---------------------------------------------------------------------------------------------------------------

select throws_ok(
  $$ insert into public.enquiry_notes (enquiry_id, admin_user_id, content)
     values ('aaaaaaaa-0000-4000-8000-0000000000ff', '11111111-1111-4111-8111-111111111111', 'Orphan note') $$,
  '23503', null, 'a note for a non-existent enquiry is rejected (foreign key)'
);
select throws_ok(
  $$ insert into public.enquiry_notes (enquiry_id, admin_user_id, content)
     values ('aaaaaaaa-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', '') $$,
  '23514', null, 'an empty note is rejected'
);
select throws_ok(
  $$ insert into public.enquiry_status_history (enquiry_id, previous_status, new_status)
     values ('aaaaaaaa-0000-4000-8000-000000000001', 'new', 'closed') $$,
  '23514', null, 'an invalid status in the history is rejected'
);
select throws_ok(
  $$ insert into public.enquiry_status_history (enquiry_id, previous_status, new_status)
     values ('aaaaaaaa-0000-4000-8000-000000000001', 'new', 'new') $$,
  '23514', null, 'a history row must describe an actual change'
);
select throws_ok(
  $$ insert into public.activity_logs (actor_type, action, entity_type, entity_id, metadata)
     values ('system', 'enquiry_received', 'enquiry', 'aaaaaaaa-0000-4000-8000-000000000001', '{"email": "someone@example.invalid"}') $$,
  '23514', null, 'activity metadata cannot hold personal data (only whitelisted keys)'
);
select throws_ok(
  $$ insert into public.activity_logs (actor_type, action, entity_type, entity_id)
     values ('system', 'password_reset', 'enquiry', 'aaaaaaaa-0000-4000-8000-000000000001') $$,
  '23514', null, 'an unknown activity action is rejected'
);
select throws_ok(
  $$ insert into private.admin_users (user_id, role) values ('33333333-3333-4333-8333-333333333333', 'superuser') $$,
  '23514', null, 'an unknown administrator role is rejected'
);

-- ---------------------------------------------------------------------------------------------------------------
-- Deletion is blocked, even for the table owner
-- ---------------------------------------------------------------------------------------------------------------

select throws_ok(
  $$ delete from public.enquiries where id = 'aaaaaaaa-0000-4000-8000-000000000003' $$,
  '23001', null, 'an enquiry cannot be deleted'
);
select throws_ok(
  $$ delete from public.appointments where id = 'bbbbbbbb-0000-4000-8000-000000000002' $$,
  '23001', null, 'an appointment cannot be deleted'
);

select * from finish();
rollback;
