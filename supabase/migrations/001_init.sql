-- Night City Binder — schema + RLS

create extension if not exists "pgcrypto";

-- Shared card catalog
create table public.cards (
  id text primary key,
  number text not null,
  name text not null,
  type text not null check (type in ('Legend', 'Unit', 'Gear', 'Program')),
  eurodollars integer,
  rarity text not null,
  zone text,
  zone_slot integer,
  sheet integer,
  face text check (face is null or face in ('F', 'B')),
  row_pos integer check (row_pos is null or row_pos between 1 and 3),
  band text check (band is null or band in ('red', 'yellow', 'green', 'blue')),
  has_iconic boolean not null default false,
  set_code text not null check (set_code in ('MS01', 'showcase')),
  notes text,
  sort_order integer not null default 0
);

create index cards_set_sort on public.cards (set_code, sort_order);
create index cards_sheet on public.cards (sheet, face, row_pos);

-- Shared USD market prices
create table public.card_prices (
  card_id text not null references public.cards (id) on delete cascade,
  variant text not null check (variant in ('base', 'iconic')),
  usd numeric(12, 2) not null default 0,
  updated_at timestamptz not null default now(),
  primary key (card_id, variant)
);

-- Per-user ownership (cross-device sync)
create table public.ownership (
  user_id uuid not null references auth.users (id) on delete cascade,
  card_id text not null references public.cards (id) on delete cascade,
  copies integer not null default 0 check (copies between 0 and 3),
  iconic boolean not null default false,
  price_override_usd numeric(12, 2),
  updated_at timestamptz not null default now(),
  primary key (user_id, card_id)
);

create index ownership_user on public.ownership (user_id);

-- Per-user settings
create table public.user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  completion_mode text not null default 'ms01'
    check (completion_mode in ('ms01', 'everything_beta')),
  value_count_copies boolean not null default false,
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.cards enable row level security;
alter table public.card_prices enable row level security;
alter table public.ownership enable row level security;
alter table public.user_settings enable row level security;

-- Catalog readable by anyone authenticated
create policy "cards_select_authenticated"
  on public.cards for select
  to authenticated
  using (true);

create policy "prices_select_authenticated"
  on public.card_prices for select
  to authenticated
  using (true);

-- Ownership: owner only
create policy "ownership_select_own"
  on public.ownership for select
  to authenticated
  using (auth.uid() = user_id);

create policy "ownership_insert_own"
  on public.ownership for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "ownership_update_own"
  on public.ownership for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "ownership_delete_own"
  on public.ownership for delete
  to authenticated
  using (auth.uid() = user_id);

-- Settings: owner only
create policy "settings_select_own"
  on public.user_settings for select
  to authenticated
  using (auth.uid() = user_id);

create policy "settings_insert_own"
  on public.user_settings for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "settings_update_own"
  on public.user_settings for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Touch updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger ownership_updated_at
  before update on public.ownership
  for each row execute function public.set_updated_at();

create trigger settings_updated_at
  before update on public.user_settings
  for each row execute function public.set_updated_at();
