-- "Darshan complete" tracking, saved permanently per visitor.
-- Every visitor already gets a stable Supabase auth user (anonymous sign-in,
-- see src/lib/supabase/ensure-session.ts), so rows are keyed to auth.uid().
-- Purely additive: a new table in the v2 schema; nothing existing changes.

create table if not exists v2.tirtha_completions (
  user_id      uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  tirtha_slug  text        not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, tirtha_slug)
);

alter table v2.tirtha_completions enable row level security;

drop policy if exists "completions: read own"   on v2.tirtha_completions;
drop policy if exists "completions: insert own" on v2.tirtha_completions;
drop policy if exists "completions: delete own" on v2.tirtha_completions;

create policy "completions: read own"   on v2.tirtha_completions
  for select to authenticated using (user_id = auth.uid());
create policy "completions: insert own" on v2.tirtha_completions
  for insert to authenticated with check (user_id = auth.uid());
create policy "completions: delete own" on v2.tirtha_completions
  for delete to authenticated using (user_id = auth.uid());

grant usage on schema v2 to authenticated;
grant select, insert, delete on v2.tirtha_completions to authenticated;
