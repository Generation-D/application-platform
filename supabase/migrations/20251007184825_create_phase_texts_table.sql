create table if not exists phase_texts (
  id bigint generated always as identity primary key,
  path text unique not null,
  html_content text not null,
  updated_at timestamptz default now()
);

alter table "public"."phase_texts" enable row level security;

create policy "Users can read phase texts"
on public.phase_texts
for select
to authenticated
using (true);
