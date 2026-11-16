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
alter table public.rsvps enable row level security;
revoke all on public.rsvps from anon, authenticated;
grant insert on public.rsvps to service_role;
