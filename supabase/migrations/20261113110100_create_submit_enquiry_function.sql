-- Stage 6.4, migration 8 of 8: the one door the public Contact form uses to write.
--
-- public.submit_enquiry() creates an enquiry and, when the visitor asked for one, its appointment request, in ONE
-- transaction: a function body is atomic, so if the appointment cannot be created the enquiry is rolled back with it
-- and no half-saved enquiry is ever left behind.
--
-- WHO MAY CALL IT: service_role only (execute is revoked from PUBLIC, anon and authenticated below). The browser never
-- calls it: it talks to the application's POST /api/enquiries, which validates everything again and calls this function
-- with a server-only key. Being SECURITY DEFINER lets it write the private support tables and the two business tables
-- without granting any API role broader table privileges, and it still sets an empty search_path and uses fully
-- qualified names. It writes only the columns listed below: id, reference, status, source and the timestamps always come
-- from the database, never from the caller (an appointment always starts as 'requested'; only an administrator can
-- confirm it).
--
-- The CHECK constraints on the tables remain the last line of defence for the data itself. This function adds:
--   * idempotency  - the same submission id returns the original enquiry instead of creating another;
--   * a content-duplicate guard - the same phone, message and division within 24 hours is the same enquiry;
--   * persistent rate limits - per client (5 an hour, 15 a day) and overall (300 an hour), counted from rows in the
--     private schema, so they work across serverless instances and cold starts. Only ACCEPTED enquiries are counted;
--   * the appointment window - today or later in Africa/Lagos, and no more than a year ahead.
--
-- The result is jsonb: {"outcome": "created" | "duplicate" | "rate_limited", "reference": "...", "appointment": bool}.
-- Rate limiting is reported as a result, not an exception, because an exception would roll back the lookup that
-- produced it. Invalid data raises an exception (a constraint violation) and nothing is written.

create or replace function public.submit_enquiry(
  p_submission_id uuid,
  p_client_key text,
  p_full_name text,
  p_phone text,
  p_phone_e164 text,
  p_email text,
  p_organisation text,
  p_location text,
  p_division text,
  p_requested_service text[],
  p_requested_item text[],
  p_message text,
  p_preferred_date date,
  p_preferred_time time without time zone
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  c_per_client_hour constant integer := 5;
  c_per_client_day constant integer := 15;
  c_overall_hour constant integer := 300;
  v_today date := pg_catalog.timezone('Africa/Lagos', pg_catalog.now())::date;
  v_pepper text;
  v_client_hash text;
  v_enquiry_id uuid;
  v_reference text;
begin
  if p_submission_id is null then
    raise exception 'A submission id is required.' using errcode = 'invalid_parameter_value';
  end if;

  -- The appointment's date and time come as a pair, and the date must be a sensible one.
  if (p_preferred_date is null) <> (p_preferred_time is null) then
    raise exception 'An appointment needs both a preferred date and a preferred time.' using errcode = 'check_violation';
  end if;
  if p_preferred_date is not null and (p_preferred_date < v_today or p_preferred_date > v_today + 366) then
    raise exception 'The preferred appointment date is outside the allowed range.' using errcode = 'check_violation';
  end if;

  -- Serialise concurrent calls that share a submission id, so a double click cannot slip two rows past the lookup.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('boom-submission:' || p_submission_id::text, 0));

  -- 1. Idempotency: a repeat of an accepted submission returns the original reference and writes nothing.
  select e.reference
    into v_reference
    from private.enquiry_submissions as s
    join public.enquiries as e on e.id = s.enquiry_id
   where s.submission_id = p_submission_id;
  if found then
    return pg_catalog.jsonb_build_object('outcome', 'duplicate', 'reference', v_reference);
  end if;

  -- The client identifier is stored only as a salted hash.
  select t.pepper into v_pepper from private.enquiry_throttle_pepper as t;
  v_client_hash := pg_catalog.encode(
    pg_catalog.sha256(
      pg_catalog.convert_to(v_pepper || ':' || coalesce(nullif(pg_catalog.left(p_client_key, 200), ''), 'unknown'), 'UTF8')
    ),
    'hex'
  );

  -- Serialise this client's calls so the count below and the insert at the end cannot race.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('boom-client:' || v_client_hash, 0));

  -- 2. The same person sending the same thing again within a day is not a new enquiry.
  select e.id, e.reference
    into v_enquiry_id, v_reference
    from public.enquiries as e
   where e.created_at > pg_catalog.now() - interval '24 hours'
     and e.phone = p_phone
     and e.message = p_message
     and e.division = p_division
   order by e.created_at desc
   limit 1;
  if found then
    insert into private.enquiry_submissions (submission_id, enquiry_id)
    values (p_submission_id, v_enquiry_id)
    on conflict (submission_id) do nothing;
    return pg_catalog.jsonb_build_object('outcome', 'duplicate', 'reference', v_reference);
  end if;

  -- 3. Persistent rate limits.
  if (select pg_catalog.count(*) from private.enquiry_attempts as a
       where a.client_hash = v_client_hash and a.created_at > pg_catalog.now() - interval '1 hour') >= c_per_client_hour
     or (select pg_catalog.count(*) from private.enquiry_attempts as a
          where a.client_hash = v_client_hash and a.created_at > pg_catalog.now() - interval '1 day') >= c_per_client_day
     or (select pg_catalog.count(*) from private.enquiry_attempts as a
          where a.created_at > pg_catalog.now() - interval '1 hour') >= c_overall_hour then
    return pg_catalog.jsonb_build_object('outcome', 'rate_limited');
  end if;

  -- 4. Write. Only these columns are ever set by the caller; the rest come from column defaults and triggers.
  insert into public.enquiries (
    full_name, phone, phone_e164, email, organisation, location, division, requested_service, requested_item, message
  )
  values (
    p_full_name, p_phone, p_phone_e164, p_email, p_organisation, p_location, p_division,
    p_requested_service, p_requested_item, p_message
  )
  returning id, reference into v_enquiry_id, v_reference;

  if p_preferred_date is not null then
    insert into public.appointments (enquiry_id, preferred_date, preferred_time)
    values (v_enquiry_id, p_preferred_date, p_preferred_time);
  end if;

  insert into private.enquiry_submissions (submission_id, enquiry_id) values (p_submission_id, v_enquiry_id);
  insert into private.enquiry_attempts (client_hash) values (v_client_hash);

  -- Housekeeping: rate-limit rows are only ever needed for a day.
  delete from private.enquiry_attempts as a where a.created_at < pg_catalog.now() - interval '7 days';

  return pg_catalog.jsonb_build_object(
    'outcome', 'created',
    'reference', v_reference,
    'appointment', p_preferred_date is not null
  );
end;
$$;

comment on function public.submit_enquiry(uuid, text, text, text, text, text, text, text, text, text[], text[], text, date, time without time zone) is
  'The public submission path: creates an enquiry (and its appointment request) atomically, with idempotency and persistent rate limits. Callable by service_role only.';

revoke all on function public.submit_enquiry(uuid, text, text, text, text, text, text, text, text, text[], text[], text, date, time without time zone)
  from public, anon, authenticated;
grant execute on function public.submit_enquiry(uuid, text, text, text, text, text, text, text, text, text[], text[], text, date, time without time zone)
  to service_role;
