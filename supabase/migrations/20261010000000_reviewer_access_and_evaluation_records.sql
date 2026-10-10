-- Matching and mail logs are private Storage objects. No application table or
-- column is added. Only server actions with the service role can read them.
insert into storage.buckets (id, name, public)
values ('evaluation-records', 'evaluation-records', false)
on conflict (id) do nothing;

drop policy if exists "select_assigned_application_for_reviewer" on public.application_table;
drop policy if exists "select_assigned_answer_for_reviewer" on public.answer_table;

create policy "select_active_reviewer_application"
on public.application_table for select to authenticated
using (exists (
  select 1 from public.user_profiles_table profile
  where profile.userid = auth.uid() and profile.userrole = 2 and profile.isactive
));

create policy "select_active_reviewer_answer"
on public.answer_table for select to authenticated
using (exists (
  select 1 from public.user_profiles_table profile
  where profile.userid = auth.uid() and profile.userrole = 2 and profile.isactive
));

drop policy if exists "select_relevant_phase_outcomes" on public.phase_outcome_table;
create policy "select_relevant_phase_outcomes"
on public.phase_outcome_table for select to authenticated
using (
  exists (
    select 1 from public.user_profiles_table profile
    where profile.userid = auth.uid() and profile.userrole = 3 and profile.isactive
  )
  or (
    user_id = auth.uid()
    and exists (
      select 1 from public.phase_table phase
      where phase.phaseid = phase_outcome_table.phase_id
        and phase.finished_evaluation is not null
    )
  )
);

create or replace function public.fetch_applications_paginated(
  page_size int default 10,
  page_number int default 1
)
returns table (applicationid uuid, team_name text, email varchar(255))
language plpgsql security definer set search_path = public
as $$
declare
  offset_val int := (page_number - 1) * page_size;
  profile_role int;
begin
  select userrole into profile_role
  from public.user_profiles_table
  where userid = auth.uid() and isactive = true;

  if profile_role is null or profile_role not in (2, 3) then
    raise exception 'Access Denied';
  end if;

  return query
  select application.applicationid, application.team_name, users.email
  from public.users users
  join public.application_table application on users.id = application.userid
  join public.user_profiles_table applicant on applicant.userid = application.userid
  where applicant.userrole = 1 and applicant.isactive = true
  order by application.applicationid
  limit page_size offset offset_val;
end;
$$;

create or replace function public.count_reviewable_applications()
returns bigint
language plpgsql security definer set search_path = public
as $$
declare
  profile_role int;
  application_count bigint;
begin
  select userrole into profile_role
  from public.user_profiles_table
  where userid = auth.uid() and isactive = true;

  if profile_role is null or profile_role not in (2, 3) then
    raise exception 'Access Denied';
  end if;

  select count(*) into application_count
  from public.application_table application
  join public.user_profiles_table applicant on applicant.userid = application.userid
  where applicant.userrole = 1 and applicant.isactive = true;
  return application_count;
end;
$$;

-- A Slack login does not grant access to every application automatically.
-- Admins activate and promote trusted judges to Reviewer (role 2).
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.user_profiles_table (userid, userrole, isactive)
  values (new.id, 1, true);
  return new;
end;
$$;
