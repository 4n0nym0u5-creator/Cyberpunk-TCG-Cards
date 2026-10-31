-- Pre-release kit WTNC 2026 stamps (10 supplemental Legends + Gorilla Arms showcase).
alter table public.cards
  add column if not exists has_prstamp boolean not null default false;

alter table public.ownership
  add column if not exists prstamp_copies integer;

update public.ownership
set prstamp_copies = coalesce(prstamp_copies, 0)
where prstamp_copies is null;

alter table public.ownership
  alter column prstamp_copies set default 0;

alter table public.ownership
  alter column prstamp_copies set not null;

alter table public.ownership
  drop constraint if exists ownership_prstamp_copies_check;

alter table public.ownership
  add constraint ownership_prstamp_copies_check check (prstamp_copies between 0 and 25);
