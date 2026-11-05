-- Allow iconic (A) edition rows in seller_stock

alter table public.seller_stock
  drop constraint if exists seller_stock_edition_check;

alter table public.seller_stock
  add constraint seller_stock_edition_check
  check (edition in ('beta', 'retail', 'iconic'));
