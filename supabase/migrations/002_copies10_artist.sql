-- Raise ownership copy cap to 10; add illustrator credit on cards.
-- Safe to re-run.

alter table public.ownership
  drop constraint if exists ownership_copies_check;

alter table public.ownership
  add constraint ownership_copies_check check (copies between 0 and 10);

alter table public.cards
  add column if not exists artist text;

create index if not exists cards_artist on public.cards (artist);
