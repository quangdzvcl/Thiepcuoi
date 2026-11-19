create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 100),
  phone text not null,
  side text not null check (side in ('groom', 'bride')),
  attendance text not null check (attendance in ('yes', 'no', 'maybe')),
  guests integer not null check (guests between 0 and 10),
  wishes text not null default '' check (char_length(wishes) <= 1500)
);
alter table public.rsvps add column if not exists publish_wish boolean not null default false;
alter table public.rsvps add column if not exists wish_approved boolean not null default false;
alter table public.rsvps add column if not exists submission_id uuid;
create unique index if not exists rsvps_submission_id_key on public.rsvps(submission_id);
create index if not exists rsvps_created_at_idx on public.rsvps(created_at desc);
create index if not exists rsvps_public_wishes_idx on public.rsvps(created_at desc) where publish_wish and wish_approved;
alter table public.rsvps enable row level security;
revoke all on public.rsvps from public, anon, authenticated;
grant select, insert, update on public.rsvps to service_role;

create or replace function public.wedding_rsvp_stats()
returns jsonb language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object(
    'responses', count(*),
    'accepted', count(*) filter (where attendance = 'yes'),
    'declined', count(*) filter (where attendance = 'no'),
    'maybe', count(*) filter (where attendance = 'maybe'),
    'attendees', coalesce(sum(guests) filter (where attendance = 'yes'), 0),
    'groom_attendees', coalesce(sum(guests) filter (where attendance = 'yes' and side = 'groom'), 0),
    'bride_attendees', coalesce(sum(guests) filter (where attendance = 'yes' and side = 'bride'), 0),
    'pending_wishes', count(*) filter (where publish_wish and not wish_approved and wishes <> '')
  ) from public.rsvps;
$$;
revoke all on function public.wedding_rsvp_stats() from public, anon, authenticated;
grant execute on function public.wedding_rsvp_stats() to service_role;
