-- Raise ownership copy caps to 25 (regular / Iconic A / B-stamp).
-- Safe to re-run.

alter table public.ownership
  drop constraint if exists ownership_copies_check;

alter table public.ownership
  add constraint ownership_copies_check check (copies between 0 and 25);

alter table public.ownership
  drop constraint if exists ownership_iconic_copies_check;

alter table public.ownership
  add constraint ownership_iconic_copies_check check (iconic_copies between 0 and 25);

alter table public.ownership
  drop constraint if exists ownership_bstamp_copies_check;

alter table public.ownership
  add constraint ownership_bstamp_copies_check check (bstamp_copies between 0 and 25);
