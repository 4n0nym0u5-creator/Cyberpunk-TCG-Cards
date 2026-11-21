-- Allow Night City Brawl (NCB) as a catalog set_code alongside MS01 / showcase.

alter table public.cards drop constraint if exists cards_set_code_check;
alter table public.cards
  add constraint cards_set_code_check
  check (set_code in ('MS01', 'showcase', 'NCB'));
