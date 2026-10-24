-- Beta Event kit B-stamp promos (Mantis Blades + 10 Legends)
alter table public.cards
  add column if not exists has_bstamp boolean not null default false;

alter table public.ownership
  add column if not exists bstamp boolean not null default false;
