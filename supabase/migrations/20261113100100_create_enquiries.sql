-- Stage 6.3, migration 2 of 6: customer enquiries.
--
-- Mirrors the Contact form (content/enquiry-options.ts, lib/enquiry/): the same five categories, the same interest
-- slugs, the same length limits. The browser's checks are a convenience; THESE constraints are the last line of
-- defence, so the database refuses bad data even if a bug or a compromised key bypasses the application.
--
-- Mapping from the form:
--   category   -> division   ('general', 'energy', 'security', 'foods', 'industrial-equipment')
--   interests  -> requested_service  for energy and security (service slugs)
--                 requested_item     for foods and industrial-equipment (product slugs)
--   general enquiries have neither.
-- Both are text[] because the form lets a visitor choose several interests. Slugs are checked for shape only; the
-- server validates them against the allowlist in content/enquiry-options.ts (that list changes with the content,
-- and a database constraint would have to change with it).
--
-- There is NO price column anywhere, by design (food prices must never be stored or shown).

-- A BOOM-prefixed reference such as BOOM-2026-00042: the Lagos calendar year, then a global running number.
-- One sequence guarantees uniqueness without any race; gaps after a rolled-back insert are harmless.
create sequence private.enquiry_reference_seq as bigint start with 1 minvalue 1 cache 1;
revoke all on sequence private.enquiry_reference_seq from public, anon, authenticated;

create or replace function private.next_enquiry_reference()
returns text
language sql
volatile
security definer
set search_path = ''
as $$
  select 'BOOM-'
    || pg_catalog.to_char(pg_catalog.timezone('Africa/Lagos', pg_catalog.now()), 'YYYY')
    || '-'
    || pg_catalog.lpad(pg_catalog.nextval('private.enquiry_reference_seq')::text, 5, '0');
$$;

revoke all on function private.next_enquiry_reference() from public, anon, authenticated;

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null,
  full_name text not null,
  phone text not null,
  phone_e164 text,
  email text,
  organisation text,
  location text,
  division text not null,
  requested_item text[],
  requested_service text[],
  message text not null,
  status text not null default 'new',
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint enquiries_reference_key unique (reference),
  constraint enquiries_reference_format check (reference ~ '^BOOM-[0-9]{4}-[0-9]{5,}$'),
  constraint enquiries_full_name_length check (char_length(full_name) between 2 and 100),
  constraint enquiries_phone_length check (char_length(phone) between 7 and 40),
  -- Set by the server once the number is normalised; NULL until then. International E.164 form only.
  constraint enquiries_phone_e164_format check (phone_e164 is null or phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  constraint enquiries_email_format check (
    email is null or (char_length(email) <= 254 and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$')
  ),
  constraint enquiries_organisation_length check (organisation is null or char_length(organisation) between 1 and 120),
  constraint enquiries_location_length check (location is null or char_length(location) between 1 and 120),
  constraint enquiries_division_allowed check (
    division in ('general', 'energy', 'security', 'foods', 'industrial-equipment')
  ),
  constraint enquiries_requested_item_shape check (
    requested_item is null
    or (
      cardinality(requested_item) between 1 and 20
      and array_to_string(requested_item, ',') ~ '^[a-z0-9-]+(,[a-z0-9-]+)*$'
      and char_length(array_to_string(requested_item, ',')) <= 600
    )
  ),
  constraint enquiries_requested_service_shape check (
    requested_service is null
    or (
      cardinality(requested_service) between 1 and 20
      and array_to_string(requested_service, ',') ~ '^[a-z0-9-]+(,[a-z0-9-]+)*$'
      and char_length(array_to_string(requested_service, ',')) <= 600
    )
  ),
  -- Services belong to energy and security, products to foods and industrial equipment, general has neither.
  constraint enquiries_interest_matches_division check (
    case division
      when 'general' then requested_item is null and requested_service is null
      when 'energy' then requested_item is null
      when 'security' then requested_item is null
      when 'foods' then requested_service is null
      when 'industrial-equipment' then requested_service is null
    end
  ),
  constraint enquiries_message_length check (char_length(message) between 10 and 2000),
  constraint enquiries_status_allowed check (status in ('new', 'in_progress', 'contacted', 'resolved')),
  constraint enquiries_source_allowed check (source in ('website', 'phone', 'whatsapp', 'admin'))
);

comment on table public.enquiries is
  'Customer enquiries from the Contact form. Written by the server only; read and status-managed by active administrators only (RLS). Never deleted.';
comment on column public.enquiries.reference is 'BOOM-YYYY-NNNNN, generated by the database; immutable.';
comment on column public.enquiries.phone is 'Exactly as the customer typed it (trimmed).';
comment on column public.enquiries.phone_e164 is 'Normalised +234... style number, set by the server; NULL until normalised.';

-- A reference is generated unless the (privileged) writer supplies one, which keeps imports and tests possible; it must
-- still match the format and be unique. It cannot be changed afterwards.
create or replace function private.enquiries_before_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.reference is null then
    new.reference := private.next_enquiry_reference();
  end if;
  return new;
end;
$$;

create or replace function private.enquiries_forbid_identity_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id is distinct from old.id
     or new.reference is distinct from old.reference
     or new.created_at is distinct from old.created_at then
    raise exception 'An enquiry''s id, reference and creation time cannot be changed.'
      using errcode = 'restrict_violation';
  end if;
  return new;
end;
$$;

revoke all on function private.enquiries_before_insert() from public, anon, authenticated;
revoke all on function private.enquiries_forbid_identity_change() from public, anon, authenticated;

-- Trigger order is alphabetical by name: identity guard, then updated_at.
create trigger enquiries_a_before_insert
  before insert on public.enquiries
  for each row execute function private.enquiries_before_insert();

create trigger enquiries_a_forbid_identity_change
  before update on public.enquiries
  for each row execute function private.enquiries_forbid_identity_change();

create trigger enquiries_b_set_updated_at
  before update on public.enquiries
  for each row execute function private.set_updated_at();

create trigger enquiries_forbid_delete
  before delete on public.enquiries
  for each row execute function private.forbid_delete();

-- Indexes for the dashboard's filters and ordering (status, division, newest first, find by phone).
create index enquiries_status_idx on public.enquiries (status);
create index enquiries_division_idx on public.enquiries (division);
create index enquiries_created_at_idx on public.enquiries (created_at desc);
create index enquiries_phone_e164_idx on public.enquiries (phone_e164) where phone_e164 is not null;
