-- Stage 6.4, migration 7 of 8: private support tables for the public submission path.
--
-- WHY A NEW MIGRATION: the six earlier migrations are applied and are not edited. The public Contact form needs three
-- small things the first schema deliberately did not have: a record of which submission produced which enquiry (so a
-- retried or double-clicked submit never creates a second enquiry), a persistent record of recent submissions per
-- client (rate limiting that survives serverless cold starts and works across instances, unlike an in-memory counter),
-- and a secret "pepper" so a stored client identifier cannot be reversed into an IP address.
--
-- Everything here lives in the PRIVATE schema, which the Supabase API does not expose: no API role has any privilege on
-- these tables (revoked below), row-level security is on with no policies, and they are reachable only through the
-- SECURITY DEFINER function created in the next migration.

-- One row per accepted submission id. A client generates a random id for each form attempt and re-sends the same id on
-- a retry; the database answers a repeat with the original enquiry instead of creating another.
create table private.enquiry_submissions (
  submission_id uuid primary key,
  enquiry_id uuid not null references public.enquiries (id) on delete restrict,
  created_at timestamptz not null default now()
);

create index enquiry_submissions_enquiry_id_idx on private.enquiry_submissions (enquiry_id);

comment on table private.enquiry_submissions is
  'Idempotency: maps a client-generated submission id to the enquiry it created. No personal data. Private schema, function access only.';

-- One row per enquiry accepted from a client. client_hash is a salted SHA-256 of the client's network address, never the
-- address itself. Rows older than seven days are removed by the submission function.
create table private.enquiry_attempts (
  id bigint generated always as identity primary key,
  client_hash text not null,
  created_at timestamptz not null default now(),
  constraint enquiry_attempts_client_hash_shape check (client_hash ~ '^[0-9a-f]{64}$')
);

create index enquiry_attempts_client_created_idx on private.enquiry_attempts (client_hash, created_at desc);
create index enquiry_attempts_created_idx on private.enquiry_attempts (created_at);

comment on table private.enquiry_attempts is
  'Rate limiting: salted hashes of client addresses, one row per accepted submission. Pruned after seven days. Private schema, function access only.';

-- A single random value, created here by the database itself (it is not in any file in the repository), mixed into every
-- client hash. Without it a stored hash of an IPv4 address could be reversed by trying all four billion addresses.
create table private.enquiry_throttle_pepper (
  singleton boolean primary key default true,
  pepper text not null,
  created_at timestamptz not null default now(),
  constraint enquiry_throttle_pepper_singleton check (singleton),
  constraint enquiry_throttle_pepper_length check (char_length(pepper) >= 64)
);

insert into private.enquiry_throttle_pepper (pepper)
values (replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''));

comment on table private.enquiry_throttle_pepper is
  'One row: the random pepper used to hash client addresses. Never exposed. Rotating it (update) only resets the rate limits.';

-- Closed to every API role, exactly like private.admin_users: privileges revoked AND row-level security with no policy.
alter table private.enquiry_submissions enable row level security;
alter table private.enquiry_attempts enable row level security;
alter table private.enquiry_throttle_pepper enable row level security;

revoke all on table private.enquiry_submissions from public, anon, authenticated, service_role;
revoke all on table private.enquiry_attempts from public, anon, authenticated, service_role;
revoke all on table private.enquiry_throttle_pepper from public, anon, authenticated, service_role;
revoke all on sequence private.enquiry_attempts_id_seq from public, anon, authenticated, service_role;
