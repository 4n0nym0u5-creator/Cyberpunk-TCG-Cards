-- Prefer USD or AUD when showing collection / card market values.
-- Source prices stay USD (TCGPlayer); AUD is display-only FX conversion.
-- Safe to re-run.

alter table public.user_settings
  add column if not exists display_currency text;

update public.user_settings
set display_currency = coalesce(display_currency, 'USD')
where display_currency is null;

alter table public.user_settings
  alter column display_currency set default 'USD';

alter table public.user_settings
  alter column display_currency set not null;

alter table public.user_settings
  drop constraint if exists user_settings_display_currency_check;

alter table public.user_settings
  add constraint user_settings_display_currency_check
  check (display_currency in ('USD', 'AUD'));
