-- Track Iconic A alts as a copy count (not a boolean flag).
alter table public.ownership
  add column if not exists iconic_copies integer;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'ownership'
      and column_name = 'iconic'
  ) then
    update public.ownership
    set iconic_copies = case when iconic then 1 else 0 end
    where iconic_copies is null;
  else
    update public.ownership
    set iconic_copies = 0
    where iconic_copies is null;
  end if;
end $$;

alter table public.ownership
  alter column iconic_copies set default 0;

alter table public.ownership
  alter column iconic_copies set not null;

alter table public.ownership
  drop constraint if exists ownership_iconic_copies_check;

alter table public.ownership
  add constraint ownership_iconic_copies_check check (iconic_copies between 0 and 10);

alter table public.ownership
  drop column if exists iconic;
