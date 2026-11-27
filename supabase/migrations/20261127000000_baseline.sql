-- Roles (user_profiles_table.userrole): 1 = applicant, 2 = reviewer, 3 = admin.
-- Writes to profiles, applications, phases, questions, outcomes and assignments go through the service role.

create table public.user_profiles_table (
  userid uuid primary key references auth.users (id) on delete cascade,
  userrole integer not null check (userrole between 1 and 3),
  isactive boolean not null default true
);

create table public.application_table (
  applicationid uuid primary key default gen_random_uuid(),
  userid uuid not null unique references auth.users (id) on delete cascade,
  team_name text
);

create table public.phase_table (
  phaseid uuid primary key default gen_random_uuid(),
  phasename text not null unique,
  phaselabel text not null,
  phaseorder integer not null unique,
  startdate timestamptz not null,
  enddate timestamptz not null,
  sectionsenabled boolean not null,
  finished_evaluation timestamptz,
  constraint phase_table_dates_check check (enddate > startdate)
);

create table public.phase_texts (
  id bigint generated always as identity primary key,
  path text not null unique,
  html_content text not null,
  updated_at timestamptz not null default now()
);

create table public.sections_table (
  sectionid uuid primary key default gen_random_uuid(),
  sectionname text not null,
  sectiondescription text not null,
  sectionorder integer not null,
  phaseid uuid not null references public.phase_table (phaseid) on delete cascade
);

create table public.question_table (
  questionid uuid primary key default gen_random_uuid(),
  questiontype text not null check (questiontype in (
    'shortText', 'longText', 'numberPicker', 'datetimePicker', 'datePicker',
    'imageUpload', 'videoUpload', 'pdfUpload', 'multipleChoice', 'dropdown',
    'checkBox', 'conditional'
  )),
  questionorder integer not null,
  phaseid uuid not null references public.phase_table (phaseid) on delete cascade,
  mandatory boolean not null,
  questiontext text not null,
  questionnote text,
  preinformationbox text,
  postinformationbox text,
  depends_on uuid,
  sectionid uuid references public.sections_table (sectionid) on delete set null
);

create table public.short_text_question_table (
  questionid uuid primary key references public.question_table (questionid) on delete cascade,
  maxtextlength integer not null check (maxtextlength > 0),
  formattingregex text,
  formattingdescription text
);

create table public.long_text_question_table (
  questionid uuid primary key references public.question_table (questionid) on delete cascade,
  maxtextlength integer not null check (maxtextlength > 0)
);

create table public.number_picker_question_table (
  questionid uuid primary key references public.question_table (questionid) on delete cascade,
  minnumber integer not null,
  maxnumber integer not null,
  check (minnumber <= maxnumber)
);

create table public.date_picker_question_table (
  questionid uuid primary key references public.question_table (questionid) on delete cascade,
  mindate date not null,
  maxdate date not null,
  check (mindate <= maxdate)
);

create table public.datetime_picker_question_table (
  questionid uuid primary key references public.question_table (questionid) on delete cascade,
  mindatetime timestamptz not null,
  maxdatetime timestamptz not null,
  check (mindatetime <= maxdatetime)
);

create table public.image_upload_question_table (
  questionid uuid primary key references public.question_table (questionid) on delete cascade,
  maxfilesizeinmb numeric not null check (maxfilesizeinmb > 0)
);

create table public.video_upload_question_table (
  questionid uuid primary key references public.question_table (questionid) on delete cascade,
  maxfilesizeinmb numeric not null check (maxfilesizeinmb > 0)
);

create table public.pdf_upload_question_table (
  questionid uuid primary key references public.question_table (questionid) on delete cascade,
  maxfilesizeinmb numeric not null check (maxfilesizeinmb > 0)
);

create table public.checkbox_question_table (
  questionid uuid primary key references public.question_table (questionid) on delete cascade
);

create table public.multiple_choice_question_table (
  questionid uuid primary key references public.question_table (questionid) on delete cascade,
  minanswers integer not null check (minanswers >= 0),
  maxanswers integer not null,
  userinput boolean not null,
  check (minanswers <= maxanswers)
);

create table public.multiple_choice_question_choice_table (
  choiceid uuid primary key default gen_random_uuid(),
  questionid uuid not null references public.multiple_choice_question_table (questionid) on delete cascade,
  choicetext text not null
);

create table public.dropdown_question_table (
  questionid uuid primary key references public.question_table (questionid) on delete cascade,
  minanswers integer not null check (minanswers >= 0),
  maxanswers integer not null,
  userinput boolean not null,
  check (minanswers <= maxanswers)
);

create table public.dropdown_question_option_table (
  optionid uuid primary key default gen_random_uuid(),
  questionid uuid not null references public.dropdown_question_table (questionid) on delete cascade,
  optiontext text not null
);

create table public.conditional_question_table (
  questionid uuid primary key references public.question_table (questionid) on delete cascade
);

create table public.conditional_question_choice_table (
  choiceid uuid primary key default gen_random_uuid(),
  questionid uuid not null references public.conditional_question_table (questionid) on delete cascade,
  choicevalue text not null
);

alter table public.question_table
  add constraint question_table_depends_on_fkey
  foreign key (depends_on) references public.conditional_question_choice_table (choiceid) on delete cascade;

create table public.answer_table (
  answerid uuid primary key default gen_random_uuid(),
  questionid uuid not null references public.question_table (questionid) on delete cascade,
  applicationid uuid not null references public.application_table (applicationid) on delete cascade,
  created timestamptz not null default now(),
  lastupdated timestamptz not null default now(),
  constraint answer_table_question_application_key unique (questionid, applicationid)
);

create table public.short_text_answer_table (
  answerid uuid primary key references public.answer_table (answerid) on delete cascade,
  answertext text not null
);

create table public.long_text_answer_table (
  answerid uuid primary key references public.answer_table (answerid) on delete cascade,
  answertext text not null
);

create table public.number_picker_answer_table (
  answerid uuid primary key references public.answer_table (answerid) on delete cascade,
  pickednumber integer not null
);

create table public.date_picker_answer_table (
  answerid uuid primary key references public.answer_table (answerid) on delete cascade,
  pickeddate date not null
);

create table public.datetime_picker_answer_table (
  answerid uuid primary key references public.answer_table (answerid) on delete cascade,
  pickeddatetime timestamptz not null
);

create table public.image_upload_answer_table (
  answerid uuid primary key references public.answer_table (answerid) on delete cascade,
  imagename text not null
);

create table public.video_upload_answer_table (
  answerid uuid primary key references public.answer_table (answerid) on delete cascade,
  videoname text not null
);

create table public.pdf_upload_answer_table (
  answerid uuid primary key references public.answer_table (answerid) on delete cascade,
  pdfname text not null
);

create table public.checkbox_answer_table (
  answerid uuid primary key references public.answer_table (answerid) on delete cascade,
  checked boolean not null
);

create table public.multiple_choice_answer_table (
  answerid uuid primary key references public.answer_table (answerid) on delete cascade,
  selectedchoice text not null
);

create table public.dropdown_answer_table (
  answerid uuid primary key references public.answer_table (answerid) on delete cascade,
  selectedoptions text not null
);

create table public.conditional_answer_table (
  answerid uuid primary key references public.answer_table (answerid) on delete cascade,
  selectedchoice text not null
);

create table public.phase_outcome_table (
  outcome_id uuid primary key default gen_random_uuid(),
  phase_id uuid not null references public.phase_table (phaseid) on delete cascade,
  user_id uuid not null references public.user_profiles_table (userid) on delete cascade,
  outcome boolean not null,
  reviewed_by uuid references public.user_profiles_table (userid) on delete set null,
  review_date timestamptz not null default now(),
  constraint phase_outcome_table_phase_user_key unique (phase_id, user_id)
);

create table public.phase_assignment_table (
  assignment_id uuid primary key default gen_random_uuid(),
  phase_id uuid not null references public.phase_table (phaseid) on delete cascade,
  user_role_1_id uuid not null references public.user_profiles_table (userid) on delete cascade,
  user_role_2_id uuid not null references public.user_profiles_table (userid) on delete cascade,
  check (user_role_1_id <> user_role_2_id),
  unique (phase_id, user_role_1_id, user_role_2_id)
);

create index answer_table_applicationid_idx on public.answer_table (applicationid);
create index question_table_phaseid_idx on public.question_table (phaseid);
create index question_table_sectionid_idx on public.question_table (sectionid);
create index question_table_depends_on_idx on public.question_table (depends_on);
create index sections_table_phaseid_idx on public.sections_table (phaseid);
create index multiple_choice_question_choice_table_questionid_idx on public.multiple_choice_question_choice_table (questionid);
create index dropdown_question_option_table_questionid_idx on public.dropdown_question_option_table (questionid);
create index conditional_question_choice_table_questionid_idx on public.conditional_question_choice_table (questionid);
create index phase_outcome_table_user_id_idx on public.phase_outcome_table (user_id);
create index phase_outcome_table_reviewed_by_idx on public.phase_outcome_table (reviewed_by);
create index phase_assignment_table_user_role_1_id_idx on public.phase_assignment_table (user_role_1_id);
create index phase_assignment_table_user_role_2_id_idx on public.phase_assignment_table (user_role_2_id);

create schema private;
grant usage on schema private to authenticated, service_role;

-- In "private" so PostgREST does not expose them as RPC endpoints.
-- SECURITY DEFINER avoids re-entering RLS on the looked-up tables; policies call these as
-- (select private.current_user_role()) so Postgres evaluates them once per query, not per row.
create function private.current_user_role()
returns integer
language sql stable security definer
set search_path = ''
as $$
  select userrole
  from public.user_profiles_table
  where userid = auth.uid() and isactive
$$;

create function private.owns_application(application_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.application_table
    where applicationid = application_id and userid = auth.uid()
  )
$$;

create function private.owns_answer(answer_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.answer_table answer
    join public.application_table application using (applicationid)
    where answer.answerid = answer_id and application.userid = auth.uid()
  )
$$;

revoke execute on all functions in schema private from public, anon;
grant execute on function private.current_user_role() to authenticated, service_role;
grant execute on function private.owns_application(uuid) to authenticated, service_role;
grant execute on function private.owns_answer(uuid) to authenticated, service_role;

do $$
declare
  t text;
begin
  for t in
    select tablename from pg_tables where schemaname = 'public'
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end
$$;

create policy "read own profile" on public.user_profiles_table
  for select to authenticated
  using (userid = (select auth.uid()));

create policy "read own or as reviewer" on public.application_table
  for select to authenticated
  using (
    userid = (select auth.uid())
    or (select private.current_user_role()) in (2, 3)
  );
create policy "admin inserts" on public.application_table
  for insert to authenticated
  with check ((select private.current_user_role()) = 3);
create policy "admin updates" on public.application_table
  for update to authenticated
  using ((select private.current_user_role()) = 3)
  with check ((select private.current_user_role()) = 3);
create policy "admin deletes" on public.application_table
  for delete to authenticated
  using ((select private.current_user_role()) = 3);

create policy "read own or as reviewer" on public.answer_table
  for select to authenticated
  using (
    (select private.current_user_role()) in (2, 3)
    or private.owns_application(applicationid)
  );
create policy "owner or admin inserts" on public.answer_table
  for insert to authenticated
  with check ((select private.current_user_role()) = 3 or private.owns_application(applicationid));
create policy "owner or admin updates" on public.answer_table
  for update to authenticated
  using ((select private.current_user_role()) = 3 or private.owns_application(applicationid))
  with check ((select private.current_user_role()) = 3 or private.owns_application(applicationid));
create policy "owner or admin deletes" on public.answer_table
  for delete to authenticated
  using ((select private.current_user_role()) = 3 or private.owns_application(applicationid));

do $$
declare
  t text;
begin
  foreach t in array array[
    'short_text_answer_table', 'long_text_answer_table',
    'number_picker_answer_table', 'date_picker_answer_table',
    'datetime_picker_answer_table', 'image_upload_answer_table',
    'video_upload_answer_table', 'pdf_upload_answer_table',
    'checkbox_answer_table', 'multiple_choice_answer_table',
    'dropdown_answer_table', 'conditional_answer_table'
  ]
  loop
    execute format($p$
      create policy "read own or as reviewer" on public.%1$I
        for select to authenticated
        using ((select private.current_user_role()) in (2, 3) or private.owns_answer(answerid));
      create policy "owner or admin inserts" on public.%1$I
        for insert to authenticated
        with check ((select private.current_user_role()) = 3 or private.owns_answer(answerid));
      create policy "owner or admin updates" on public.%1$I
        for update to authenticated
        using ((select private.current_user_role()) = 3 or private.owns_answer(answerid))
        with check ((select private.current_user_role()) = 3 or private.owns_answer(answerid));
      create policy "owner or admin deletes" on public.%1$I
        for delete to authenticated
        using ((select private.current_user_role()) = 3 or private.owns_answer(answerid));
    $p$, t);
  end loop;
end
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'phase_table', 'sections_table', 'question_table',
    'short_text_question_table', 'long_text_question_table',
    'number_picker_question_table', 'date_picker_question_table',
    'datetime_picker_question_table', 'image_upload_question_table',
    'video_upload_question_table', 'pdf_upload_question_table',
    'checkbox_question_table', 'multiple_choice_question_table',
    'multiple_choice_question_choice_table', 'dropdown_question_table',
    'dropdown_question_option_table', 'conditional_question_table',
    'conditional_question_choice_table'
  ]
  loop
    execute format($p$
      create policy "signed-in users read" on public.%1$I
        for select to authenticated
        using (true);
      create policy "admin inserts" on public.%1$I
        for insert to authenticated
        with check ((select private.current_user_role()) = 3);
      create policy "admin updates" on public.%1$I
        for update to authenticated
        using ((select private.current_user_role()) = 3)
        with check ((select private.current_user_role()) = 3);
      create policy "admin deletes" on public.%1$I
        for delete to authenticated
        using ((select private.current_user_role()) = 3);
    $p$, t);
  end loop;
end
$$;

create policy "signed-in users read" on public.phase_texts
  for select to authenticated
  using (true);

create policy "admin or own finished" on public.phase_outcome_table
  for select to authenticated
  using (
    (select private.current_user_role()) = 3
    or (
      user_id = (select auth.uid())
      and exists (
        select 1 from public.phase_table phase
        where phase.phaseid = phase_outcome_table.phase_id
          and phase.finished_evaluation is not null
      )
    )
  );

create policy "own as reviewer or admin" on public.phase_assignment_table
  for select to authenticated
  using (
    (user_role_2_id = (select auth.uid()) and (select private.current_user_role()) = 2)
    or (select private.current_user_role()) = 3
  );

revoke truncate, references, trigger on all tables in schema public from authenticated;
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke all on sequences from anon;
alter default privileges in schema public revoke execute on functions from anon;

-- The app does not use GraphQL; without it table and column names are not discoverable there.
drop extension if exists pg_graphql;

create function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  insert into public.user_profiles_table (userid, userrole, isactive)
  values (
    new.id,
    case when new.raw_app_meta_data ->> 'provider' = 'slack_oidc' then 2 else 1 end,
    true
  );
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.fetch_applications_paginated(
  page_size integer default 10,
  page_number integer default 1
)
returns table (applicationid uuid, team_name text, email varchar(255))
language plpgsql stable security definer
set search_path = ''
as $$
begin
  if coalesce(private.current_user_role(), 0) not in (2, 3) then
    raise exception 'Access Denied';
  end if;

  return query
  select application.applicationid, application.team_name, users.email
  from public.application_table application
  join public.user_profiles_table applicant on applicant.userid = application.userid
  join auth.users users on users.id = application.userid
  where applicant.userrole = 1 and applicant.isactive
  order by application.applicationid
  limit page_size offset (page_number - 1) * page_size;
end;
$$;

create function public.count_reviewable_applications()
returns bigint
language plpgsql stable security definer
set search_path = ''
as $$
begin
  if coalesce(private.current_user_role(), 0) not in (2, 3) then
    raise exception 'Access Denied';
  end if;

  return (
    select count(*)
    from public.application_table application
    join public.user_profiles_table applicant on applicant.userid = application.userid
    where applicant.userrole = 1 and applicant.isactive
  );
end;
$$;

revoke execute on function public.fetch_applications_paginated(integer, integer) from public, anon;
revoke execute on function public.count_reviewable_applications() from public, anon;
grant execute on function public.fetch_applications_paginated(integer, integer) to authenticated, service_role;
grant execute on function public.count_reviewable_applications() to authenticated, service_role;

create function public.fetch_short_text_answer_table(question_id uuid, application_id uuid)
returns table (answerid uuid, answertext text)
language sql stable set search_path = ''
as $$
  select t.answerid, t.answertext
  from public.short_text_answer_table t
  join public.answer_table a on a.answerid = t.answerid
  where a.questionid = question_id and a.applicationid = application_id
$$;

create function public.fetch_long_text_answer_table(question_id uuid, application_id uuid)
returns table (answerid uuid, answertext text)
language sql stable set search_path = ''
as $$
  select t.answerid, t.answertext
  from public.long_text_answer_table t
  join public.answer_table a on a.answerid = t.answerid
  where a.questionid = question_id and a.applicationid = application_id
$$;

create function public.fetch_number_picker_answer_table(question_id uuid, application_id uuid)
returns table (answerid uuid, pickednumber integer)
language sql stable set search_path = ''
as $$
  select t.answerid, t.pickednumber
  from public.number_picker_answer_table t
  join public.answer_table a on a.answerid = t.answerid
  where a.questionid = question_id and a.applicationid = application_id
$$;

create function public.fetch_date_picker_answer_table(question_id uuid, application_id uuid)
returns table (answerid uuid, pickeddate date)
language sql stable set search_path = ''
as $$
  select t.answerid, t.pickeddate
  from public.date_picker_answer_table t
  join public.answer_table a on a.answerid = t.answerid
  where a.questionid = question_id and a.applicationid = application_id
$$;

create function public.fetch_datetime_picker_answer_table(question_id uuid, application_id uuid)
returns table (answerid uuid, pickeddatetime timestamptz)
language sql stable set search_path = ''
as $$
  select t.answerid, t.pickeddatetime
  from public.datetime_picker_answer_table t
  join public.answer_table a on a.answerid = t.answerid
  where a.questionid = question_id and a.applicationid = application_id
$$;

create function public.fetch_checkbox_answer_table(question_id uuid, application_id uuid)
returns table (answerid uuid, checked boolean)
language sql stable set search_path = ''
as $$
  select t.answerid, t.checked
  from public.checkbox_answer_table t
  join public.answer_table a on a.answerid = t.answerid
  where a.questionid = question_id and a.applicationid = application_id
$$;

create function public.fetch_multiple_choice_answer_table(question_id uuid, application_id uuid)
returns table (answerid uuid, selectedchoice text)
language sql stable set search_path = ''
as $$
  select t.answerid, t.selectedchoice
  from public.multiple_choice_answer_table t
  join public.answer_table a on a.answerid = t.answerid
  where a.questionid = question_id and a.applicationid = application_id
$$;

create function public.fetch_dropdown_answer_table(question_id uuid, application_id uuid)
returns table (answerid uuid, selectedoptions text)
language sql stable set search_path = ''
as $$
  select t.answerid, t.selectedoptions
  from public.dropdown_answer_table t
  join public.answer_table a on a.answerid = t.answerid
  where a.questionid = question_id and a.applicationid = application_id
$$;

create function public.fetch_conditional_answer_table(question_id uuid, application_id uuid)
returns table (answerid uuid, selectedchoice text)
language sql stable set search_path = ''
as $$
  select t.answerid, t.selectedchoice
  from public.conditional_answer_table t
  join public.answer_table a on a.answerid = t.answerid
  where a.questionid = question_id and a.applicationid = application_id
$$;

create function public.fetch_image_upload_answer_table(question_id uuid, application_id uuid)
returns table (userid uuid, answerid uuid, imagename text)
language sql stable set search_path = ''
as $$
  select app.userid, t.answerid, t.imagename
  from public.image_upload_answer_table t
  join public.answer_table a on a.answerid = t.answerid
  join public.application_table app on app.applicationid = a.applicationid
  where a.questionid = question_id and a.applicationid = application_id
$$;

create function public.fetch_video_upload_answer_table(question_id uuid, application_id uuid)
returns table (userid uuid, answerid uuid, videoname text)
language sql stable set search_path = ''
as $$
  select app.userid, t.answerid, t.videoname
  from public.video_upload_answer_table t
  join public.answer_table a on a.answerid = t.answerid
  join public.application_table app on app.applicationid = a.applicationid
  where a.questionid = question_id and a.applicationid = application_id
$$;

create function public.fetch_pdf_upload_answer_table(question_id uuid, application_id uuid)
returns table (userid uuid, answerid uuid, pdfname text)
language sql stable set search_path = ''
as $$
  select app.userid, t.answerid, t.pdfname
  from public.pdf_upload_answer_table t
  join public.answer_table a on a.answerid = t.answerid
  join public.application_table app on app.applicationid = a.applicationid
  where a.questionid = question_id and a.applicationid = application_id
$$;

insert into storage.buckets (id, name, public)
values ('evaluation-records', 'evaluation-records', false)
on conflict (id) do nothing;

create policy "users manage own objects" on storage.objects
  for all to authenticated
  using (owner = (select auth.uid()))
  with check (owner = (select auth.uid()));
