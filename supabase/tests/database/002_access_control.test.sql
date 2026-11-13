-- pgTAP: who can read and change what. Roles are switched with SET LOCAL ROLE and a fake JWT subject, which is
-- exactly what PostgREST does for a request. Run with `supabase test db` against a LOCAL database.

begin;
create extension if not exists pgtap with schema extensions;
set local search_path to public, extensions;

select plan(78);

-- Fake people: 1111 active owner, 2222 INACTIVE admin, 3333 ordinary signed-in account.
insert into auth.users (id, aud, role, email) values
  ('11111111-1111-4111-8111-111111111111', 'authenticated', 'authenticated', 'owner@example.invalid'),
  ('22222222-2222-4222-8222-222222222222', 'authenticated', 'authenticated', 'inactive@example.invalid'),
  ('33333333-3333-4333-8333-333333333333', 'authenticated', 'authenticated', 'customer@example.invalid');
insert into private.admin_users (user_id, role, is_active) values
  ('11111111-1111-4111-8111-111111111111', 'owner', true),
  ('22222222-2222-4222-8222-222222222222', 'admin', false);

-- Records created by the system (no signed-in user). The triggers add the first history and activity rows.
insert into public.enquiries (id, full_name, phone, division, requested_service, message) values
  ('aaaaaaaa-0000-4000-8000-000000000001', 'Demo Customer', '08055544415', 'energy', array['solar-installation'],
   'We would like a solar quotation for our shop.'),
  ('aaaaaaaa-0000-4000-8000-000000000002', 'Second Customer', '08055544415', 'foods', null,
   'Please send the bag sizes for your rice products.');
update public.enquiries set requested_item = array['garri'] where id = 'aaaaaaaa-0000-4000-8000-000000000002';
insert into public.appointments (id, enquiry_id, preferred_date, preferred_time)
  values ('bbbbbbbb-0000-4000-8000-000000000001', 'aaaaaaaa-0000-4000-8000-000000000001', '2026-12-01', '10:00');
update public.appointments set status = 'confirmed', confirmed_date = '2026-12-01', confirmed_time = '10:30'
  where id = 'bbbbbbbb-0000-4000-8000-000000000001';
update public.enquiries set status = 'contacted' where id = 'aaaaaaaa-0000-4000-8000-000000000001';
insert into public.enquiry_notes (enquiry_id, admin_user_id, content)
  values ('aaaaaaaa-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'Private follow-up note');

-- ---------------------------------------------------------------------------------------------------------------
-- The administrator helper, asked about each kind of caller. It is called as the table owner with that caller's JWT
-- subject set; the signed-in API role itself has no access to the private schema (row-level security still works
-- because policies reference the function directly), and the behaviour tests below prove access end to end.
-- ---------------------------------------------------------------------------------------------------------------

do $$ begin perform set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true); end $$;
select ok(private.is_active_admin(), 'an active administrator is recognised');
do $$ begin perform set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}', true); end $$;
select ok(not private.is_active_admin(), 'an inactive administrator is not recognised');
do $$ begin perform set_config('request.jwt.claims', '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated"}', true); end $$;
select ok(not private.is_active_admin(), 'a signed-in non-administrator is not recognised');
do $$ begin perform set_config('request.jwt.claims', '', true); end $$;
select ok(not private.is_active_admin(), 'a request with no signed-in user is not an administrator');

-- ---------------------------------------------------------------------------------------------------------------
-- ANON: the public. Nothing.
-- ---------------------------------------------------------------------------------------------------------------

set local role anon;

select throws_ok($$ select count(*) from public.enquiries $$, '42501', null, 'anon cannot read enquiries');
select throws_ok($$ select count(*) from public.appointments $$, '42501', null, 'anon cannot read appointments');
select throws_ok($$ select count(*) from public.enquiry_notes $$, '42501', null, 'anon cannot read internal notes');
select throws_ok($$ select count(*) from public.enquiry_status_history $$, '42501', null, 'anon cannot read enquiry status history');
select throws_ok($$ select count(*) from public.appointment_status_history $$, '42501', null, 'anon cannot read appointment status history');
select throws_ok($$ select count(*) from public.activity_logs $$, '42501', null, 'anon cannot read the activity log');
select throws_ok($$ select count(*) from private.admin_users $$, '42501', null, 'anon cannot read the private administrator table');
select throws_ok($$ select private.is_active_admin() $$, '42501', null, 'anon cannot even call the administrator helper');
select throws_ok(
  $$ insert into public.enquiries (full_name, phone, division, message)
     values ('Public Insert', '08055544415', 'general', 'Anonymous visitors must not insert directly.') $$,
  '42501', null, 'anon cannot insert an enquiry directly'
);
select throws_ok(
  $$ insert into public.appointments (enquiry_id, preferred_date, preferred_time)
     values ('aaaaaaaa-0000-4000-8000-000000000002', '2026-12-09', '09:00') $$,
  '42501', null, 'anon cannot insert an appointment directly'
);
select throws_ok(
  $$ update public.enquiries set status = 'resolved' where id = 'aaaaaaaa-0000-4000-8000-000000000001' $$,
  '42501', null, 'anon cannot update enquiries'
);
select throws_ok($$ delete from public.enquiries $$, '42501', null, 'anon cannot delete enquiries');

reset role;
do $$ begin perform set_config('request.jwt.claims', '', true); end $$;

-- ---------------------------------------------------------------------------------------------------------------
-- AUTHENTICATED, NOT AN ADMINISTRATOR (user 3333): signed in, but nothing more.
-- ---------------------------------------------------------------------------------------------------------------

set local role authenticated;
do $$ begin perform set_config('request.jwt.claims', '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated"}', true); end $$;

select is((select count(*) from public.enquiries), 0::bigint, 'non-admin sees no enquiries');
select is((select count(*) from public.appointments), 0::bigint, 'non-admin sees no appointments');
select is((select count(*) from public.enquiry_notes), 0::bigint, 'non-admin sees no internal notes');
select is((select count(*) from public.enquiry_status_history), 0::bigint, 'non-admin sees no enquiry status history');
select is((select count(*) from public.appointment_status_history), 0::bigint, 'non-admin sees no appointment status history');
select is((select count(*) from public.activity_logs), 0::bigint, 'non-admin sees no activity');
select throws_ok($$ select count(*) from private.admin_users $$, '42501', null, 'non-admin cannot read the private administrator table');
select throws_ok(
  $$ insert into private.admin_users (user_id, role) values ('33333333-3333-4333-8333-333333333333', 'owner') $$,
  '42501', null, 'a signed-in user cannot make themselves an administrator'
);
select throws_ok(
  $$ insert into public.enquiries (full_name, phone, division, message)
     values ('Non-admin Insert', '08055544415', 'general', 'A signed-in user must not insert enquiries either.') $$,
  '42501', null, 'non-admin cannot insert an enquiry'
);
select throws_ok(
  $$ insert into public.appointments (enquiry_id, preferred_date, preferred_time)
     values ('aaaaaaaa-0000-4000-8000-000000000002', '2026-12-09', '09:00') $$,
  '42501', null, 'non-admin cannot create an appointment (row-level security)'
);
select throws_ok(
  $$ insert into public.enquiry_notes (enquiry_id, content)
     values ('aaaaaaaa-0000-4000-8000-000000000001', 'A note from a non-admin') $$,
  '42501', null, 'non-admin cannot add a note (row-level security)'
);
select lives_ok(
  $$ update public.enquiries set status = 'resolved' where id = 'aaaaaaaa-0000-4000-8000-000000000001' $$,
  'a non-admin status update runs but matches no rows'
);
select throws_ok($$ delete from public.enquiries $$, '42501', null, 'non-admin cannot delete enquiries');

reset role;
do $$ begin perform set_config('request.jwt.claims', '', true); end $$;
select is(
  (select status from public.enquiries where id = 'aaaaaaaa-0000-4000-8000-000000000001'), 'contacted',
  'the non-admin update changed nothing'
);

-- ---------------------------------------------------------------------------------------------------------------
-- AUTHENTICATED, INACTIVE ADMINISTRATOR (user 2222): a deactivated account is denied like anyone else.
-- ---------------------------------------------------------------------------------------------------------------

set local role authenticated;
do $$ begin perform set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}', true); end $$;

select is((select count(*) from public.enquiries), 0::bigint, 'inactive admin sees no enquiries');
select is((select count(*) from public.appointments), 0::bigint, 'inactive admin sees no appointments');
select is((select count(*) from public.enquiry_notes), 0::bigint, 'inactive admin sees no internal notes');
select is((select count(*) from public.activity_logs), 0::bigint, 'inactive admin sees no activity');
select throws_ok(
  $$ insert into public.enquiry_notes (enquiry_id, content)
     values ('aaaaaaaa-0000-4000-8000-000000000001', 'A note from a deactivated admin') $$,
  '42501', null, 'inactive admin cannot add a note'
);

reset role;
do $$ begin perform set_config('request.jwt.claims', '', true); end $$;
update private.admin_users set is_active = true where user_id = '22222222-2222-4222-8222-222222222222';
set local role authenticated;
do $$ begin perform set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}', true); end $$;
select is((select count(*) from public.enquiries), 2::bigint, 'reactivating the membership restores access immediately');
reset role;
do $$ begin perform set_config('request.jwt.claims', '', true); end $$;
update private.admin_users set is_active = false where user_id = '22222222-2222-4222-8222-222222222222';

-- ---------------------------------------------------------------------------------------------------------------
-- AUTHENTICATED, ACTIVE ADMINISTRATOR (user 1111)
-- ---------------------------------------------------------------------------------------------------------------

set local role authenticated;
do $$ begin perform set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true); end $$;

select is((select count(*) from public.enquiries), 2::bigint, 'admin reads all enquiries');
select is((select count(*) from public.appointments), 1::bigint, 'admin reads appointments');
select is((select count(*) from public.enquiry_notes), 1::bigint, 'admin reads internal notes');
select ok((select count(*) from public.enquiry_status_history) >= 1, 'admin reads enquiry status history');
select ok((select count(*) from public.appointment_status_history) >= 1, 'admin reads appointment status history');
select ok((select count(*) from public.activity_logs) >= 3, 'admin reads the activity log');

-- Changing an enquiry's status: allowed, and recorded against this administrator.
select lives_ok(
  $$ update public.enquiries set status = 'in_progress' where id = 'aaaaaaaa-0000-4000-8000-000000000002' $$,
  'admin can change an enquiry status'
);
select is(
  (select status from public.enquiries where id = 'aaaaaaaa-0000-4000-8000-000000000002'), 'in_progress',
  'the status was updated'
);
select is(
  (select changed_by from public.enquiry_status_history
    where enquiry_id = 'aaaaaaaa-0000-4000-8000-000000000002' order by changed_at desc, id limit 1),
  '11111111-1111-4111-8111-111111111111'::uuid,
  'the status history names the administrator who changed it'
);
select throws_ok(
  $$ update public.enquiries set status = 'closed' where id = 'aaaaaaaa-0000-4000-8000-000000000002' $$,
  '23514', null, 'admin cannot set an invalid status'
);

-- The customer's own words are not editable through this role.
select throws_ok(
  $$ update public.enquiries set message = 'Edited by an admin' where id = 'aaaaaaaa-0000-4000-8000-000000000002' $$,
  '42501', null, 'admin cannot rewrite the customer message'
);
select throws_ok(
  $$ update public.enquiries set reference = 'BOOM-2026-99999' where id = 'aaaaaaaa-0000-4000-8000-000000000002' $$,
  '42501', null, 'admin cannot change a reference'
);
select throws_ok(
  $$ insert into public.enquiries (full_name, phone, division, message)
     values ('Admin Insert', '08055544415', 'general', 'Enquiries are created by the server, not by this role.') $$,
  '42501', null, 'admin cannot insert enquiries (the server does)'
);

-- Notes: added as themselves, never edited, never removed.
select lives_ok(
  $$ insert into public.enquiry_notes (enquiry_id, content)
     values ('aaaaaaaa-0000-4000-8000-000000000002', 'Called the customer; will send sizes tomorrow.') $$,
  'admin can add an internal note'
);
select is(
  (select admin_user_id from public.enquiry_notes where content like 'Called the customer%'),
  '11111111-1111-4111-8111-111111111111'::uuid,
  'the note is attributed to the signed-in administrator'
);
select throws_ok(
  $$ insert into public.enquiry_notes (enquiry_id, admin_user_id, content)
     values ('aaaaaaaa-0000-4000-8000-000000000002', '22222222-2222-4222-8222-222222222222', 'Forged author') $$,
  '42501', null, 'admin cannot name someone else as the note author'
);
select throws_ok(
  $$ update public.enquiry_notes set content = 'Edited' where content like 'Called the customer%' $$,
  '42501', null, 'notes cannot be edited'
);
select throws_ok($$ delete from public.enquiry_notes $$, '42501', null, 'notes cannot be deleted');

-- Appointments: create, confirm, cancel; the confirming administrator is stamped by the database.
select lives_ok(
  $$ insert into public.appointments (enquiry_id, preferred_date, preferred_time)
     values ('aaaaaaaa-0000-4000-8000-000000000002', '2026-12-10', '09:30') $$,
  'admin can create an appointment record'
);
select throws_ok(
  $$ insert into public.appointments (enquiry_id, preferred_date, preferred_time, status, confirmed_date, confirmed_time)
     values ('aaaaaaaa-0000-4000-8000-000000000001', '2026-12-11', '09:30', 'confirmed', '2026-12-11', '09:30') $$,
  '42501', null, 'admin cannot create an appointment already confirmed or choose its status at creation'
);
select lives_ok(
  $$ update public.appointments set status = 'confirmed', confirmed_date = '2026-12-10', confirmed_time = '10:00',
            venue = 'Customer premises', scheduling_note = 'Bring the site checklist'
     where enquiry_id = 'aaaaaaaa-0000-4000-8000-000000000002' and preferred_date = '2026-12-10' $$,
  'admin can confirm an appointment with a date and time'
);
select is(
  (select confirmed_by from public.appointments where enquiry_id = 'aaaaaaaa-0000-4000-8000-000000000002' and preferred_date = '2026-12-10'),
  '11111111-1111-4111-8111-111111111111'::uuid,
  'the database stamped who confirmed the appointment'
);
select throws_ok(
  $$ update public.appointments set preferred_date = '2026-12-30' where enquiry_id = 'aaaaaaaa-0000-4000-8000-000000000002' and preferred_date = '2026-12-10' $$,
  '42501', null, 'admin cannot rewrite what the customer asked for'
);
select throws_ok(
  $$ update public.appointments set confirmed_by = '22222222-2222-4222-8222-222222222222' where enquiry_id = 'aaaaaaaa-0000-4000-8000-000000000002' and preferred_date = '2026-12-10' $$,
  '42501', null, 'admin cannot set who confirmed an appointment'
);
select throws_ok($$ delete from public.appointments $$, '42501', null, 'appointments cannot be deleted');

-- Read-only tables and the private table.
select throws_ok(
  $$ insert into public.enquiry_status_history (enquiry_id, previous_status, new_status)
     values ('aaaaaaaa-0000-4000-8000-000000000001', 'new', 'resolved') $$,
  '42501', null, 'admin cannot write status history directly (only triggers do)'
);
select throws_ok(
  $$ insert into public.activity_logs (actor_type, action, entity_type, entity_id)
     values ('admin', 'note_added', 'note', 'aaaaaaaa-0000-4000-8000-000000000001') $$,
  '42501', null, 'admin cannot write activity entries directly'
);
select throws_ok($$ update public.activity_logs set action = 'note_added' $$, '42501', null, 'activity entries cannot be edited');
select throws_ok($$ delete from public.activity_logs $$, '42501', null, 'activity entries cannot be deleted');
select throws_ok($$ delete from public.enquiry_status_history $$, '42501', null, 'status history cannot be deleted');
select throws_ok($$ delete from public.enquiries $$, '42501', null, 'admin cannot delete enquiries');
select throws_ok($$ truncate public.enquiries cascade $$, '42501', null, 'admin cannot truncate enquiries');
select throws_ok($$ select count(*) from private.admin_users $$, '42501', null, 'even an administrator cannot read the private administrator table through the API role');
select throws_ok(
  $$ insert into private.admin_users (user_id, role) values ('33333333-3333-4333-8333-333333333333', 'owner') $$,
  '42501', null, 'an administrator cannot add other administrators through the API role'
);

reset role;
do $$ begin perform set_config('request.jwt.claims', '', true); end $$;

-- ---------------------------------------------------------------------------------------------------------------
-- SERVICE_ROLE (the future server-side handler): may submit, and nothing else.
-- ---------------------------------------------------------------------------------------------------------------

set local role service_role;

select lives_ok(
  $$ insert into public.enquiries (id, full_name, phone, division, message)
     values ('aaaaaaaa-0000-4000-8000-000000000009', 'Website Visitor', '08055544415', 'general',
             'Submitted by the server on behalf of a visitor.') $$,
  'the server role can insert an enquiry'
);
select lives_ok(
  $$ update public.enquiries set phone_e164 = '+2348055544415' where id = 'aaaaaaaa-0000-4000-8000-000000000009' $$,
  'the server role can set the normalised phone'
);
select throws_ok(
  $$ update public.enquiries set status = 'resolved' where id = 'aaaaaaaa-0000-4000-8000-000000000009' $$,
  '42501', null, 'the server role cannot change a status'
);
select throws_ok(
  $$ update public.enquiries set message = 'Changed' where id = 'aaaaaaaa-0000-4000-8000-000000000009' $$,
  '42501', null, 'the server role cannot rewrite a message'
);
select throws_ok($$ delete from public.enquiries $$, '42501', null, 'the server role cannot delete enquiries');
select throws_ok($$ select count(*) from public.enquiry_notes $$, '42501', null, 'the server role cannot read private notes');
select throws_ok($$ select count(*) from private.admin_users $$, '42501', null, 'the server role cannot read the administrator table');

reset role;
do $$ begin perform set_config('request.jwt.claims', '', true); end $$;

-- A new website enquiry is logged as a system event, not by a person.
select is(
  (select actor_type from public.activity_logs
    where action = 'enquiry_received' and entity_id = 'aaaaaaaa-0000-4000-8000-000000000009'),
  'system',
  'a submission is logged as a system event'
);

select * from finish();
rollback;
