-- Expand seller_stock editions for B-stamp, WTNC W-stamp, and Kickstarter promos

alter table public.seller_stock
  drop constraint if exists seller_stock_edition_check;

alter table public.seller_stock
  add constraint seller_stock_edition_check
  check (
    edition in (
      'beta',
      'retail',
      'beta_iconic',
      'retail_iconic',
      'bstamp',
      'prstamp',
      'ks_promo'
    )
  );
