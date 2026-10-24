-- Track Beta Event B-stamp promos as a copy count (not a boolean pocket).
alter table public.ownership
  add column if not exists bstamp_copies integer;

update public.ownership
set bstamp_copies = case when bstamp then 1 else 0 end
where bstamp_copies is null;

alter table public.ownership
  alter column bstamp_copies set default 0;

alter table public.ownership
  alter column bstamp_copies set not null;

alter table public.ownership
  drop constraint if exists ownership_bstamp_copies_check;

alter table public.ownership
  add constraint ownership_bstamp_copies_check check (bstamp_copies between 0 and 10);

alter table public.ownership
  drop column if exists bstamp;
