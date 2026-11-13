-- pgTAP: the public submission function (public.submit_enquiry) and its private support tables.
-- Run with `supabase test db` against a LOCAL database. Everything below is rolled back at the end.

begin;
create extension if not exists pgtap with schema extensions;
set local search_path to public, extensions;

select plan(69);

-- A small helper so each call reads clearly. It runs as the caller (SECURITY INVOKER), so every call below is still
-- checked against the caller's own right to execute public.submit_enquiry().
create schema tap_helpers;
grant usage on schema tap_helpers to service_role;
create function tap_helpers.submit(
  p_submission_id uuid,
  p_client_key text,
  p_message text default 'A perfectly ordinary test message.',
  p_email text default null,
  p_division text default 'general',
  p_services text[] default null,
  p_items text[] default null,
  p_date date default null,
  p_time time without time zone default null,
  p_phone text default '08031234567',
  p_phone_e164 text default null
) returns jsonb language sql as $$
  select public.submit_enquiry(
    p_submission_id, p_client_key, 'Test Person', p_phone, p_phone_e164, p_email, null, null,
    p_division, p_services, p_items, p_message, p_date, p_time
  )
$$;
grant execute on all functions in schema tap_helpers to service_role;

-- ---------------------------------------------------------------------------------------------------------------
-- Who may call it
-- ---------------------------------------------------------------------------------------------------------------

select ok(
  has_function_privilege('service_role', 'public.submit_enquiry(uuid, text, text, text, text, text, text, text, text, text[], text[], text, date, time without time zone)', 'execute'),
  'service_role can execute the submission function'
);
select ok(
  not has_function_privilege('anon', 'public.submit_enquiry(uuid, text, text, text, text, text, text, text, text, text[], text[], text, date, time without time zone)', 'execute'),
  'anon cannot execute the submission function'
);
select ok(
  not has_function_privilege('authenticated', 'public.submit_enquiry(uuid, text, text, text, text, text, text, text, text, text[], text[], text, date, time without time zone)', 'execute'),
  'a signed-in user cannot execute the submission function'
);

set local role anon;
select throws_ok(
  $$select public.submit_enquiry('dddddddd-0000-4000-8000-000000000001', 'k', 'Test Person', '08031234567', null, null, null, null, 'general', null, null, 'A perfectly ordinary test message.', null, null)$$,
  '42501', null, 'calling it as anon is refused'
);
reset role;

set local role authenticated;
select throws_ok(
  $$select public.submit_enquiry('dddddddd-0000-4000-8000-000000000001', 'k', 'Test Person', '08031234567', null, null, null, null, 'general', null, null, 'A perfectly ordinary test message.', null, null)$$,
  '42501', null, 'calling it as a signed-in user is refused'
);
reset role;

set local role service_role;
select throws_ok('select count(*) from private.enquiry_attempts', '42501', null, 'service_role cannot read the rate-limit table');
select throws_ok('select count(*) from private.enquiry_throttle_pepper', '42501', null, 'service_role cannot read the pepper');
select throws_ok('select count(*) from private.enquiry_submissions', '42501', null, 'service_role cannot read the submission map');
reset role;

select ok(
  not exists (
    select 1 from information_schema.role_table_grants
     where table_schema = 'private' and grantee in ('anon', 'authenticated', 'service_role', 'PUBLIC')
       and table_name in ('enquiry_attempts', 'enquiry_submissions', 'enquiry_throttle_pepper')
  ),
  'no API role holds any privilege on the three support tables'
);
select ok(
  (select bool_and(c.relrowsecurity) from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'private' and c.relname in ('enquiry_attempts', 'enquiry_submissions', 'enquiry_throttle_pepper')),
  'row-level security is on for all three support tables'
);
select is(
  (select count(*) from pg_policies where schemaname = 'private'), 0::bigint,
  'the support tables have no policies (closed by design)'
);
select is((select count(*) from private.enquiry_throttle_pepper), 1::bigint, 'exactly one pepper exists');

-- ---------------------------------------------------------------------------------------------------------------
-- A plain enquiry
-- ---------------------------------------------------------------------------------------------------------------

set local role service_role;
select is(
  (tap_helpers.submit(p_submission_id => 'dddddddd-0000-4000-8000-000000000010', p_client_key => 'client-a',
     p_message => 'Please send a solar quotation for our shop.', p_email => 'enq1@example.invalid', p_division => 'energy',
     p_services => array['solar-installation'], p_phone_e164 => '+2348031234567'))->>'outcome',
  'created', 'a valid enquiry is created'
);
reset role;

select ok(
  (select reference ~ '^BOOM-[0-9]{4}-[0-9]{5,}$' from public.enquiries where email = 'enq1@example.invalid'),
  'the database generated a BOOM reference'
);
select is((select status from public.enquiries where email = 'enq1@example.invalid'), 'new', 'the status is new');
select is((select source from public.enquiries where email = 'enq1@example.invalid'), 'website', 'the source is website');
select is((select requested_service from public.enquiries where email = 'enq1@example.invalid'), array['solar-installation'], 'the service is stored');
select ok((select requested_item is null from public.enquiries where email = 'enq1@example.invalid'), 'no product is stored for an energy enquiry');
select is((select phone_e164 from public.enquiries where email = 'enq1@example.invalid'), '+2348031234567', 'the normalised phone is stored');
select is(
  (select count(*) from public.appointments where enquiry_id = (select id from public.enquiries where email = 'enq1@example.invalid')),
  0::bigint, 'an enquiry without an appointment request creates no appointment'
);
select is(
  (select count(*) from public.activity_logs where action = 'enquiry_received' and actor_type = 'system'
     and enquiry_id = (select id from public.enquiries where email = 'enq1@example.invalid')),
  1::bigint, 'one system activity entry was written'
);
select is(
  (select count(*) from private.enquiry_submissions where submission_id = 'dddddddd-0000-4000-8000-000000000010'),
  1::bigint, 'the submission id is mapped to the enquiry'
);
select is(
  (select count(*) from private.enquiry_attempts), 1::bigint,
  'one rate-limit row was written'
);
select ok(
  (select client_hash ~ '^[0-9a-f]{64}$' and client_hash not like '%client-a%' from private.enquiry_attempts),
  'the client is stored only as a 64-character hash, not the raw value'
);

-- ---------------------------------------------------------------------------------------------------------------
-- An enquiry with an appointment request: both rows, the appointment never confirmed
-- ---------------------------------------------------------------------------------------------------------------

set local role service_role;
select is(
  (tap_helpers.submit(p_submission_id => 'dddddddd-0000-4000-8000-000000000020', p_client_key => 'client-b',
     p_message => 'We would like to arrange a site visit.', p_email => 'enq2@example.invalid',
     p_date => (timezone('Africa/Lagos', now()))::date + 5, p_time => '09:30'))->>'appointment',
  'true', 'the result says an appointment request was recorded'
);
reset role;

select is(
  (select count(*) from public.appointments where enquiry_id = (select id from public.enquiries where email = 'enq2@example.invalid')),
  1::bigint, 'one appointment was created'
);
select is(
  (select status from public.appointments where enquiry_id = (select id from public.enquiries where email = 'enq2@example.invalid')),
  'requested', 'the appointment starts as requested, never confirmed'
);
select ok(
  (select confirmed_date is null and confirmed_time is null and confirmed_by is null
     from public.appointments where enquiry_id = (select id from public.enquiries where email = 'enq2@example.invalid')),
  'it has no confirmed slot and no confirming administrator'
);
select is(
  (select preferred_time from public.appointments where enquiry_id = (select id from public.enquiries where email = 'enq2@example.invalid')),
  '09:30'::time, 'the preferred time is stored'
);
select is(
  (select count(*) from public.activity_logs
    where enquiry_id = (select id from public.enquiries where email = 'enq2@example.invalid')
      and action in ('enquiry_received', 'appointment_requested')),
  2::bigint, 'the enquiry and the appointment request were both logged'
);

-- ---------------------------------------------------------------------------------------------------------------
-- Atomicity: if the appointment cannot be created, no enquiry is left behind
-- ---------------------------------------------------------------------------------------------------------------

create function tap_helpers.fail_appointment() returns trigger language plpgsql as $$
begin
  raise exception 'forced appointment failure' using errcode = 'P0001';
end;
$$;
create trigger zz_force_failure before insert on public.appointments
  for each row execute function tap_helpers.fail_appointment();

select is((select count(*) from public.enquiries), 2::bigint, 'two enquiries exist before the failure test');
select is((select count(*) from private.enquiry_attempts), 2::bigint, 'two rate-limit rows exist before the failure test');

set local role service_role;
select throws_ok(
  $$select tap_helpers.submit(p_submission_id => 'dddddddd-0000-4000-8000-000000000030', p_client_key => 'client-c',
      p_message => 'This one must not survive a failure.', p_email => 'enq3@example.invalid',
      p_date => (timezone('Africa/Lagos', now()))::date + 3, p_time => '10:00')$$,
  'P0001', 'forced appointment failure', 'a failure while creating the appointment raises'
);
reset role;

select is((select count(*) from public.enquiries where email = 'enq3@example.invalid'), 0::bigint, 'no enquiry was left behind');
select is((select count(*) from public.enquiries), 2::bigint, 'the number of enquiries is unchanged');
select is((select count(*) from public.activity_logs where action = 'enquiry_received'), 2::bigint, 'no activity entry was left behind');
select is((select count(*) from private.enquiry_submissions where submission_id = 'dddddddd-0000-4000-8000-000000000030'), 0::bigint, 'the submission id was not recorded');
select is((select count(*) from private.enquiry_attempts), 2::bigint, 'the rate-limit count was not consumed');

drop trigger zz_force_failure on public.appointments;

set local role service_role;
select is(
  (tap_helpers.submit(p_submission_id => 'dddddddd-0000-4000-8000-000000000030', p_client_key => 'client-c',
     p_message => 'This one must not survive a failure.', p_email => 'enq3@example.invalid',
     p_date => (timezone('Africa/Lagos', now()))::date + 3, p_time => '10:00'))->>'outcome',
  'created', 'the same submission succeeds once the fault is gone (nothing was left half-done)'
);
reset role;
select is((select count(*) from public.appointments where enquiry_id = (select id from public.enquiries where email = 'enq3@example.invalid')), 1::bigint, 'and it has its appointment');

-- ---------------------------------------------------------------------------------------------------------------
-- Idempotency and the content-duplicate guard
-- ---------------------------------------------------------------------------------------------------------------

set local role service_role;
select is(
  (tap_helpers.submit(p_submission_id => 'dddddddd-0000-4000-8000-000000000010', p_client_key => 'client-a',
     p_message => 'Please send a solar quotation for our shop.', p_email => 'enq1@example.invalid', p_division => 'energy',
     p_services => array['solar-installation']))->>'outcome',
  'duplicate', 'repeating a submission id is recognised as a duplicate'
);
select is(
  (tap_helpers.submit(p_submission_id => 'dddddddd-0000-4000-8000-000000000010', p_client_key => 'client-a',
     p_message => 'Please send a solar quotation for our shop.', p_email => 'enq1@example.invalid', p_division => 'energy',
     p_services => array['solar-installation']))->>'reference',
  (select reference from public.enquiries where email = 'enq1@example.invalid'),
  'and it returns the original reference'
);
select is(
  (tap_helpers.submit(p_submission_id => 'dddddddd-0000-4000-8000-000000000011', p_client_key => 'client-a',
     p_message => 'Please send a solar quotation for our shop.', p_email => 'other@example.invalid', p_division => 'energy',
     p_services => array['solar-installation']))->>'outcome',
  'duplicate', 'the same phone, message and division with a new submission id is the same enquiry'
);
reset role;

select is((select count(*) from public.enquiries where message = 'Please send a solar quotation for our shop.'), 1::bigint, 'still exactly one such enquiry');
select is((select count(*) from private.enquiry_attempts), 3::bigint, 'duplicates consume no rate-limit allowance');
select is(
  (select count(*) from private.enquiry_submissions where submission_id = 'dddddddd-0000-4000-8000-000000000011'),
  1::bigint, 'the second id now points at the same enquiry, so its own retries stay consistent'
);

-- ---------------------------------------------------------------------------------------------------------------
-- Persistent rate limits
-- ---------------------------------------------------------------------------------------------------------------

set local role service_role;
select is(
  (select count(*) filter (where r ->> 'outcome' = 'created')
     from (select tap_helpers.submit(
             p_submission_id => ('eeeeeeee-0000-4000-8000-000000000' || lpad(g::text, 3, '0'))::uuid,
             p_client_key => 'client-limit', p_message => 'Rate limit test message number ' || g,
             p_email => 'rl' || g || '@example.invalid') as r
             from generate_series(1, 5) as g order by g) as calls),
  5::bigint, 'a client may send five enquiries in an hour'
);
select is(
  (tap_helpers.submit(p_submission_id => 'eeeeeeee-0000-4000-8000-000000000006', p_client_key => 'client-limit',
     p_message => 'Rate limit test message number 6', p_email => 'rl6@example.invalid'))->>'outcome',
  'rate_limited', 'the sixth in the hour is refused'
);
select is(
  (tap_helpers.submit(p_submission_id => 'eeeeeeee-0000-4000-8000-000000000007', p_client_key => 'client-other',
     p_message => 'A different visitor is not affected.', p_email => 'other2@example.invalid'))->>'outcome',
  'created', 'a different client is unaffected'
);
reset role;

select is((select count(*) from public.enquiries where email like 'rl%@example.invalid'), 5::bigint, 'the refused submission wrote nothing');
select is((select count(*) from private.enquiry_submissions where submission_id = 'eeeeeeee-0000-4000-8000-000000000006'), 0::bigint, 'and was not recorded as accepted');

-- The daily limit, with the attempts placed two hours back so only the daily window applies.
insert into private.enquiry_attempts (client_hash, created_at)
select encode(sha256(convert_to((select pepper from private.enquiry_throttle_pepper) || ':client-day', 'UTF8')), 'hex'),
       now() - interval '2 hours'
  from generate_series(1, 15);
set local role service_role;
select is(
  (tap_helpers.submit(p_submission_id => 'eeeeeeee-0000-4000-8000-000000000020', p_client_key => 'client-day',
     p_message => 'Daily limit probe message.', p_email => 'day@example.invalid'))->>'outcome',
  'rate_limited', 'a client at the daily limit is refused even when the hourly count is low'
);
reset role;

-- The overall hourly cap, with attempts from many other clients.
insert into private.enquiry_attempts (client_hash)
select md5(g::text) || md5(g::text || 'x') from generate_series(1, 300) as g;
set local role service_role;
select is(
  (tap_helpers.submit(p_submission_id => 'eeeeeeee-0000-4000-8000-000000000021', p_client_key => 'client-fresh',
     p_message => 'Overall cap probe message.', p_email => 'cap@example.invalid'))->>'outcome',
  'rate_limited', 'a brand-new client is refused while the overall hourly cap is reached'
);
reset role;
delete from private.enquiry_attempts where client_hash in (select md5(g::text) || md5(g::text || 'x') from generate_series(1, 300) as g);
set local role service_role;
select is(
  (tap_helpers.submit(p_submission_id => 'eeeeeeee-0000-4000-8000-000000000021', p_client_key => 'client-fresh',
     p_message => 'Overall cap probe message.', p_email => 'cap@example.invalid'))->>'outcome',
  'created', 'and accepted again once the cap clears'
);
reset role;

-- Old rate-limit rows are pruned by the next accepted submission.
insert into private.enquiry_attempts (client_hash, created_at) values (md5('old') || md5('oldx'), now() - interval '8 days');
set local role service_role;
select is(
  (tap_helpers.submit(p_submission_id => 'eeeeeeee-0000-4000-8000-000000000022', p_client_key => 'client-prune',
     p_message => 'Pruning probe message.', p_email => 'prune@example.invalid'))->>'outcome',
  'created', 'an enquiry is accepted'
);
reset role;
select is((select count(*) from private.enquiry_attempts where created_at < now() - interval '7 days'), 0::bigint, 'rows older than seven days were pruned');

-- ---------------------------------------------------------------------------------------------------------------
-- Invalid data is refused by the database and leaves nothing behind
-- ---------------------------------------------------------------------------------------------------------------

select is((select count(*) from public.enquiries where email like 'bad%@example.invalid'), 0::bigint, 'no invalid enquiry exists before the tests');

set local role service_role;
select throws_ok(
  $$select tap_helpers.submit(p_submission_id => 'ffffffff-0000-4000-8000-000000000001', p_client_key => 'bad', p_email => 'bad1@example.invalid',
      p_date => (timezone('Africa/Lagos', now()))::date - 1, p_time => '10:00')$$,
  '23514', null, 'a preferred date in the past is refused'
);
select throws_ok(
  $$select tap_helpers.submit(p_submission_id => 'ffffffff-0000-4000-8000-000000000002', p_client_key => 'bad', p_email => 'bad2@example.invalid',
      p_date => (timezone('Africa/Lagos', now()))::date + 400, p_time => '10:00')$$,
  '23514', null, 'a preferred date more than a year ahead is refused'
);
select throws_ok(
  $$select tap_helpers.submit(p_submission_id => 'ffffffff-0000-4000-8000-000000000003', p_client_key => 'bad', p_email => 'bad3@example.invalid',
      p_date => (timezone('Africa/Lagos', now()))::date + 2)$$,
  '23514', null, 'a date without a time is refused'
);
select throws_ok(
  $$select tap_helpers.submit(p_submission_id => 'ffffffff-0000-4000-8000-000000000004', p_client_key => 'bad', p_email => 'bad4@example.invalid',
      p_division => 'plumbing')$$,
  '23514', null, 'an unknown division is refused'
);
select throws_ok(
  $$select tap_helpers.submit(p_submission_id => 'ffffffff-0000-4000-8000-000000000005', p_client_key => 'bad', p_email => 'bad5@example.invalid',
      p_division => 'general', p_items => array['garri'])$$,
  '23514', null, 'a product on a general enquiry is refused'
);
select throws_ok(
  $$select tap_helpers.submit(p_submission_id => 'ffffffff-0000-4000-8000-000000000006', p_client_key => 'bad', p_email => 'bad6@example.invalid',
      p_message => 'short')$$,
  '23514', null, 'a message under ten characters is refused'
);
select throws_ok(
  $$select tap_helpers.submit(p_submission_id => 'ffffffff-0000-4000-8000-000000000007', p_client_key => 'bad', p_email => 'not-an-email')$$,
  '23514', null, 'a malformed email address is refused'
);
select throws_ok(
  $$select public.submit_enquiry(null, 'bad', 'Test Person', '08031234567', null, null, null, null, 'general', null, null, 'A perfectly ordinary test message.', null, null)$$,
  '22023', null, 'a missing submission id is refused'
);
reset role;

select is((select count(*) from public.enquiries where email like 'bad%@example.invalid'), 0::bigint, 'none of the refused submissions left a row');
select is((select count(*) from private.enquiry_submissions where submission_id::text like 'ffffffff-%'), 0::bigint, 'none was recorded as accepted');

-- A missing client key is tolerated (the server may not know the address): it falls into a shared bucket.
set local role service_role;
select is(
  (tap_helpers.submit(p_submission_id => 'ffffffff-0000-4000-8000-000000000010', p_client_key => null,
     p_message => 'No client key was supplied.', p_email => 'nokey@example.invalid'))->>'outcome',
  'created', 'a missing client key is accepted and rate-limited as "unknown"'
);

-- ---------------------------------------------------------------------------------------------------------------
-- What the function returns
-- ---------------------------------------------------------------------------------------------------------------

select is(
  (select array_agg(k order by k) from jsonb_object_keys(
     tap_helpers.submit(p_submission_id => 'ffffffff-0000-4000-8000-000000000011', p_client_key => 'client-shape',
       p_message => 'Checking the result shape.', p_email => 'shape@example.invalid')) as k),
  array['appointment', 'outcome', 'reference'],
  'a created result exposes only the outcome, the reference and the appointment flag'
);
reset role;

select * from finish();
rollback;
