-- BRAWL CHAMP (all NCB cards) + BRAWL JUDGE (Maman Brigitte) stamp ownership lanes.

alter table public.ownership
  add column if not exists brawl_champ_copies integer;

alter table public.ownership
  add column if not exists brawl_judge_copies integer;

update public.ownership
set
  brawl_champ_copies = coalesce(brawl_champ_copies, 0),
  brawl_judge_copies = coalesce(brawl_judge_copies, 0)
where brawl_champ_copies is null
   or brawl_judge_copies is null;

alter table public.ownership
  alter column brawl_champ_copies set default 0;

alter table public.ownership
  alter column brawl_judge_copies set default 0;

alter table public.ownership
  alter column brawl_champ_copies set not null;

alter table public.ownership
  alter column brawl_judge_copies set not null;

alter table public.ownership
  drop constraint if exists ownership_brawl_champ_copies_check;

alter table public.ownership
  add constraint ownership_brawl_champ_copies_check
  check (brawl_champ_copies between 0 and 25);

alter table public.ownership
  drop constraint if exists ownership_brawl_judge_copies_check;

alter table public.ownership
  add constraint ownership_brawl_judge_copies_check
  check (brawl_judge_copies between 0 and 25);
