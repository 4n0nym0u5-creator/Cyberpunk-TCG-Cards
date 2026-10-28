-- Split regular ownership into Beta / Pre-release / Retail source counts.
-- Existing copies are attributed to Beta. Safe to re-run.

alter table public.ownership
  add column if not exists beta_copies integer;

alter table public.ownership
  add column if not exists prerelease_copies integer;

alter table public.ownership
  add column if not exists retail_copies integer;

update public.ownership
set
  beta_copies = coalesce(beta_copies, copies, 0),
  prerelease_copies = coalesce(prerelease_copies, 0),
  retail_copies = coalesce(retail_copies, 0)
where beta_copies is null
   or prerelease_copies is null
   or retail_copies is null;

alter table public.ownership
  alter column beta_copies set default 0;

alter table public.ownership
  alter column prerelease_copies set default 0;

alter table public.ownership
  alter column retail_copies set default 0;

alter table public.ownership
  alter column beta_copies set not null;

alter table public.ownership
  alter column prerelease_copies set not null;

alter table public.ownership
  alter column retail_copies set not null;

alter table public.ownership
  drop constraint if exists ownership_beta_copies_check;

alter table public.ownership
  add constraint ownership_beta_copies_check check (beta_copies between 0 and 25);

alter table public.ownership
  drop constraint if exists ownership_prerelease_copies_check;

alter table public.ownership
  add constraint ownership_prerelease_copies_check check (prerelease_copies between 0 and 25);

alter table public.ownership
  drop constraint if exists ownership_retail_copies_check;

alter table public.ownership
  add constraint ownership_retail_copies_check check (retail_copies between 0 and 25);

alter table public.user_settings
  add column if not exists default_copy_source text;

update public.user_settings
set default_copy_source = coalesce(default_copy_source, 'beta')
where default_copy_source is null;

alter table public.user_settings
  alter column default_copy_source set default 'beta';

alter table public.user_settings
  alter column default_copy_source set not null;

alter table public.user_settings
  drop constraint if exists user_settings_default_copy_source_check;

alter table public.user_settings
  add constraint user_settings_default_copy_source_check
  check (default_copy_source in ('beta', 'prerelease', 'retail'));
