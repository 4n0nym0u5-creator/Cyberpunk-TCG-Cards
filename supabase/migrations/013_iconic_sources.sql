-- Split Iconic ownership into Beta Iconic (Aβ) / Retail Iconic (AR).
-- Existing iconic_copies are attributed to beta_iconic_copies. Safe to re-run.

alter table public.ownership
  add column if not exists beta_iconic_copies integer;

alter table public.ownership
  add column if not exists retail_iconic_copies integer;

update public.ownership
set
  beta_iconic_copies = coalesce(beta_iconic_copies, iconic_copies, 0),
  retail_iconic_copies = coalesce(retail_iconic_copies, 0)
where beta_iconic_copies is null
   or retail_iconic_copies is null;

-- Keep iconic_copies = Aβ + AR only where the sum drifted (usually none after backfill).
update public.ownership
set iconic_copies = coalesce(beta_iconic_copies, 0) + coalesce(retail_iconic_copies, 0)
where iconic_copies is distinct from
  (coalesce(beta_iconic_copies, 0) + coalesce(retail_iconic_copies, 0));

alter table public.ownership
  alter column beta_iconic_copies set default 0;

alter table public.ownership
  alter column retail_iconic_copies set default 0;

alter table public.ownership
  alter column beta_iconic_copies set not null;

alter table public.ownership
  alter column retail_iconic_copies set not null;

alter table public.ownership
  drop constraint if exists ownership_beta_iconic_copies_check;

alter table public.ownership
  add constraint ownership_beta_iconic_copies_check
  check (beta_iconic_copies between 0 and 25);

alter table public.ownership
  drop constraint if exists ownership_retail_iconic_copies_check;

alter table public.ownership
  add constraint ownership_retail_iconic_copies_check
  check (retail_iconic_copies between 0 and 25);

-- seller_stock: replace legacy 'iconic' with beta_iconic / retail_iconic
alter table public.seller_stock
  drop constraint if exists seller_stock_edition_check;

update public.seller_stock
set edition = 'beta_iconic'
where edition = 'iconic';

alter table public.seller_stock
  add constraint seller_stock_edition_check
  check (edition in ('beta', 'retail', 'beta_iconic', 'retail_iconic'));
