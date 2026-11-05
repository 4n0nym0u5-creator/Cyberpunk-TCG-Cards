-- AU-reachable singles stock cache (PunkOuter, Obsession Gaming, Mint Collectables)
-- Additive only: creates a new table + read policies. Does not alter ownership or catalog.

create table if not exists public.seller_stock (
  card_id text not null references public.cards (id) on delete cascade,
  edition text not null check (edition in ('beta', 'retail', 'iconic')),
  seller_id text not null check (seller_id in ('punkouter', 'obsession', 'mint')),
  title text not null,
  url text not null,
  price numeric(12, 2),
  currency text not null check (currency in ('USD', 'AUD')),
  available boolean not null default false,
  fetched_at timestamptz not null default now(),
  primary key (card_id, edition, seller_id)
);

create index if not exists seller_stock_available
  on public.seller_stock (available, edition);

create index if not exists seller_stock_fetched
  on public.seller_stock (fetched_at desc);

alter table public.seller_stock enable row level security;

create policy "seller_stock_select_authenticated"
  on public.seller_stock for select
  to authenticated
  using (true);

create policy "seller_stock_select_anon"
  on public.seller_stock for select
  to anon
  using (true);
