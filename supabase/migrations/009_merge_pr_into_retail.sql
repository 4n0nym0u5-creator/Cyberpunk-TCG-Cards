-- Fold Pre-release kit (PR) regular counts into Retail (R).
-- Kit booster printings are not unique; WTNC Nova Rare stays on prstamp_copies (W).
-- Safe to re-run.

update public.ownership
set
  retail_copies = least(
    25,
    coalesce(retail_copies, 0) + coalesce(prerelease_copies, 0)
  ),
  copies = least(
    25,
    coalesce(beta_copies, 0)
      + least(25, coalesce(retail_copies, 0) + coalesce(prerelease_copies, 0))
  ),
  prerelease_copies = 0
where coalesce(prerelease_copies, 0) > 0;

update public.user_settings
set default_copy_source = 'retail'
where default_copy_source = 'prerelease';

alter table public.user_settings
  drop constraint if exists user_settings_default_copy_source_check;

alter table public.user_settings
  add constraint user_settings_default_copy_source_check
  check (default_copy_source in ('beta', 'retail'));
