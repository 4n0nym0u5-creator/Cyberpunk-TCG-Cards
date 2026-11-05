-- Allow iconic edition rows in seller_stock (superseded by 013 for Aβ/AR split).
-- Kept for DBs that already applied 012 before 013.

alter table public.seller_stock
  drop constraint if exists seller_stock_edition_check;

alter table public.seller_stock
  add constraint seller_stock_edition_check
  check (edition in ('beta', 'retail', 'iconic', 'beta_iconic', 'retail_iconic'));
