-- Run once in Supabase SQL Editor. Learning completion only; no XP awards.
create table if not exists public.herops_lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id),
  constraint herops_lesson_id_format check (lesson_id ~ '^m(0[1-8])-l(0[1-3])$')
);
alter table public.herops_lesson_progress enable row level security;
revoke all on public.herops_lesson_progress from anon;
grant select, insert, delete on public.herops_lesson_progress to authenticated;
drop policy if exists "Read own HerOps progress" on public.herops_lesson_progress;
create policy "Read own HerOps progress" on public.herops_lesson_progress
for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Insert own HerOps progress" on public.herops_lesson_progress;
create policy "Insert own HerOps progress" on public.herops_lesson_progress
for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Delete own HerOps progress" on public.herops_lesson_progress;
create policy "Delete own HerOps progress" on public.herops_lesson_progress
for delete to authenticated using ((select auth.uid()) = user_id);
