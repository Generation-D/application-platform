create table if not exists phase_texts (
  id bigint generated always as identity primary key,
  path text unique not null,
  html_content text not null,
  updated_at timestamptz default now()
);
