-- Night City Brawl ownership source (BRAWL Nova Rare), alongside beta / retail.

alter table public.ownership
  add column if not exists brawl_copies integer;

update public.ownership
set brawl_copies = coalesce(brawl_copies, 0)
where brawl_copies is null;

alter table public.ownership
  alter column brawl_copies set default 0;

alter table public.ownership
  alter column brawl_copies set not null;

alter table public.ownership
  drop constraint if exists ownership_brawl_copies_check;

alter table public.ownership
  add constraint ownership_brawl_copies_check check (brawl_copies between 0 and 25);

alter table public.user_settings
  drop constraint if exists user_settings_default_copy_source_check;

alter table public.user_settings
  add constraint user_settings_default_copy_source_check
  check (default_copy_source in ('beta', 'prerelease', 'retail', 'brawl'));
