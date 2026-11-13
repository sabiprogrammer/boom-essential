-- Stage 6.3, migration 4 of 6: private notes, status history and the activity log.
--
-- All four tables are administrator-only and APPEND-ONLY: once a row is written it can be neither changed nor
-- removed (triggers below, on top of having no UPDATE or DELETE grant). The history and activity rows are written by
-- database triggers (migration 5), never by clients, so they cannot be forged or skipped by application code.
--
-- Administrator ids here are plain uuids with no foreign key to auth.users: an audit trail must outlive the account
-- of the person who wrote it.

-- ---------------------------------------------------------------------------------------------------------------
-- Internal notes (private administrative records)
-- ---------------------------------------------------------------------------------------------------------------

create table public.enquiry_notes (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries (id) on delete restrict,
  -- Filled in by the database from the caller's verified session; a client cannot name another author.
  admin_user_id uuid not null default auth.uid(),
  content text not null,
  created_at timestamptz not null default now(),

  constraint enquiry_notes_content_length check (char_length(content) between 1 and 4000)
);

comment on table public.enquiry_notes is
  'Internal follow-up notes. Private to administrators; never reachable by the public or by non-admin accounts. Append-only.';

create index enquiry_notes_enquiry_idx on public.enquiry_notes (enquiry_id, created_at);

-- ---------------------------------------------------------------------------------------------------------------
-- Status history
-- ---------------------------------------------------------------------------------------------------------------

create table public.enquiry_status_history (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries (id) on delete restrict,
  previous_status text not null,
  new_status text not null,
  -- The administrator responsible; NULL when no signed-in user was involved (for example a server process).
  changed_by uuid,
  changed_at timestamptz not null default now(),

  constraint enquiry_status_history_previous_allowed check (
    previous_status in ('new', 'in_progress', 'contacted', 'resolved')
  ),
  constraint enquiry_status_history_new_allowed check (
    new_status in ('new', 'in_progress', 'contacted', 'resolved')
  ),
  constraint enquiry_status_history_is_a_change check (previous_status <> new_status)
);

create index enquiry_status_history_enquiry_idx on public.enquiry_status_history (enquiry_id, changed_at);

create table public.appointment_status_history (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments (id) on delete restrict,
  previous_status text not null,
  new_status text not null,
  changed_by uuid,
  changed_at timestamptz not null default now(),

  constraint appointment_status_history_previous_allowed check (
    previous_status in ('requested', 'confirmed', 'completed', 'cancelled')
  ),
  constraint appointment_status_history_new_allowed check (
    new_status in ('requested', 'confirmed', 'completed', 'cancelled')
  ),
  constraint appointment_status_history_is_a_change check (previous_status <> new_status)
);

create index appointment_status_history_appointment_idx
  on public.appointment_status_history (appointment_id, changed_at);

-- ---------------------------------------------------------------------------------------------------------------
-- Activity log (the dashboard's activity feed)
-- ---------------------------------------------------------------------------------------------------------------

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  -- Who did it: the administrator's id, or NULL for the system (for example a new website enquiry).
  actor_id uuid,
  actor_type text not null,
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  -- The enquiry this belongs to, so the feed can be filtered and joined without guessing from entity_id.
  enquiry_id uuid references public.enquiries (id) on delete restrict,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),

  constraint activity_logs_actor_type_allowed check (actor_type in ('admin', 'system')),
  constraint activity_logs_action_allowed check (
    action in (
      'enquiry_received',
      'enquiry_status_changed',
      'appointment_requested',
      'appointment_status_changed',
      'appointment_confirmed',
      'appointment_cancelled',
      'note_added'
    )
  ),
  constraint activity_logs_entity_type_allowed check (entity_type in ('enquiry', 'appointment', 'note')),
  -- Metadata may hold ONLY these short, non-personal keys: statuses, the public reference and the division. Names,
  -- phone numbers, emails, messages and note text cannot be stored here, even by mistake.
  constraint activity_logs_metadata_restricted check (
    jsonb_typeof(metadata) = 'object'
    and (metadata - array['from_status', 'to_status', 'reference', 'division']) = '{}'::jsonb
    and pg_column_size(metadata) <= 512
  )
);

comment on table public.activity_logs is
  'Important administrative events for the dashboard feed. Append-only, administrators only, metadata restricted to non-personal keys.';

create index activity_logs_created_at_idx on public.activity_logs (created_at desc);
create index activity_logs_enquiry_idx on public.activity_logs (enquiry_id, created_at desc);

-- ---------------------------------------------------------------------------------------------------------------
-- Append-only protection
-- ---------------------------------------------------------------------------------------------------------------

create trigger enquiry_notes_forbid_change
  before update or delete on public.enquiry_notes
  for each row execute function private.forbid_change();

create trigger enquiry_status_history_forbid_change
  before update or delete on public.enquiry_status_history
  for each row execute function private.forbid_change();

create trigger appointment_status_history_forbid_change
  before update or delete on public.appointment_status_history
  for each row execute function private.forbid_change();

create trigger activity_logs_forbid_change
  before update or delete on public.activity_logs
  for each row execute function private.forbid_change();
