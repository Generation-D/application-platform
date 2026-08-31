-- Reviewers may only access applications assigned to them. This migration
-- intentionally reuses the existing tables and does not add schema fields.

drop policy if exists "select_reviewer_application_table" on public.application_table;
drop policy if exists "select_reviewer_answer_table" on public.answer_table;
drop policy if exists "select_reviewer_checkbox_answer_table" on public.checkbox_answer_table;
drop policy if exists "select_reviewer_conditional_answer_table" on public.conditional_answer_table;
drop policy if exists "select_reviewer_date_picker_answer_table" on public.date_picker_answer_table;
drop policy if exists "select_reviewer_datetime_picker_answer_table" on public.datetime_picker_answer_table;
drop policy if exists "select_reviewer_dropdown_answer_table" on public.dropdown_answer_table;
drop policy if exists "select_reviewer_image_upload_answer_table" on public.image_upload_answer_table;
drop policy if exists "select_reviewer_long_text_answer_table" on public.long_text_answer_table;
drop policy if exists "select_reviewer_multiple_choice_answer_table" on public.multiple_choice_answer_table;
drop policy if exists "select_reviewer_number_picker_answer_table" on public.number_picker_answer_table;
drop policy if exists "select_reviewer_pdf_upload_answer_table" on public.pdf_upload_answer_table;
drop policy if exists "select_reviewer_short_text_answer_table" on public.short_text_answer_table;
drop policy if exists "select_reviewer_video_upload_answer_table" on public.video_upload_answer_table;

drop policy if exists "select_answer_for_viewer" on public.answer_table;
drop policy if exists "select_checkbox_answer_for_viewer" on public.checkbox_answer_table;
drop policy if exists "select_conditional_answer_for_viewer" on public.conditional_answer_table;
drop policy if exists "select_date_picker_answer_for_viewer" on public.date_picker_answer_table;
drop policy if exists "select_datetime_picker_answer_for_viewer" on public.datetime_picker_answer_table;
drop policy if exists "select_dropdown_answer_for_viewer" on public.dropdown_answer_table;
drop policy if exists "select_image_upload_answer_for_viewer" on public.image_upload_answer_table;
drop policy if exists "select_long_text_answer_for_viewer" on public.long_text_answer_table;
drop policy if exists "select_multiple_choice_answer_for_viewer" on public.multiple_choice_answer_table;
drop policy if exists "select_number_picker_answer_for_viewer" on public.number_picker_answer_table;
drop policy if exists "select_pdf_upload_answer_for_viewer" on public.pdf_upload_answer_table;
drop policy if exists "select_short_text_answer_for_viewer" on public.short_text_answer_table;
drop policy if exists "select_video_upload_answer_for_viewer" on public.video_upload_answer_table;

create policy "select_own_reviewer_assignments"
on public.phase_assignment_table
as permissive
for select
to authenticated
using (
  user_role_2_id = auth.uid()
  or exists (
    select 1
    from public.user_profiles_table
    where userid = auth.uid() and userrole = 3
  )
);

create policy "select_assigned_application_for_reviewer"
on public.application_table
as permissive
for select
to authenticated
using (
  exists (
    select 1
    from public.phase_assignment_table assignment
    where assignment.user_role_1_id = application_table.userid
      and assignment.user_role_2_id = auth.uid()
  )
);

-- An assignment for a later phase includes the material from earlier phases,
-- matching the previous PDF-based process.
create policy "select_assigned_answer_for_reviewer"
on public.answer_table
as permissive
for select
to authenticated
using (
  exists (
    select 1
    from public.application_table application
    join public.question_table question
      on question.questionid = answer_table.questionid
    join public.phase_table answer_phase
      on answer_phase.phaseid = question.phaseid
    join public.phase_assignment_table assignment
      on assignment.user_role_1_id = application.userid
      and assignment.user_role_2_id = auth.uid()
    join public.phase_table assignment_phase
      on assignment_phase.phaseid = assignment.phase_id
    where application.applicationid = answer_table.applicationid
      and answer_phase.phaseorder <= assignment_phase.phaseorder
  )
);

create policy "select_accessible_checkbox_answer"
on public.checkbox_answer_table for select to authenticated
using (exists (select 1 from public.answer_table answer where answer.answerid = checkbox_answer_table.answerid));

create policy "select_accessible_conditional_answer"
on public.conditional_answer_table for select to authenticated
using (exists (select 1 from public.answer_table answer where answer.answerid = conditional_answer_table.answerid));

create policy "select_accessible_date_picker_answer"
on public.date_picker_answer_table for select to authenticated
using (exists (select 1 from public.answer_table answer where answer.answerid = date_picker_answer_table.answerid));

create policy "select_accessible_datetime_picker_answer"
on public.datetime_picker_answer_table for select to authenticated
using (exists (select 1 from public.answer_table answer where answer.answerid = datetime_picker_answer_table.answerid));

create policy "select_accessible_dropdown_answer"
on public.dropdown_answer_table for select to authenticated
using (exists (select 1 from public.answer_table answer where answer.answerid = dropdown_answer_table.answerid));

create policy "select_accessible_image_upload_answer"
on public.image_upload_answer_table for select to authenticated
using (exists (select 1 from public.answer_table answer where answer.answerid = image_upload_answer_table.answerid));

create policy "select_accessible_long_text_answer"
on public.long_text_answer_table for select to authenticated
using (exists (select 1 from public.answer_table answer where answer.answerid = long_text_answer_table.answerid));

create policy "select_accessible_multiple_choice_answer"
on public.multiple_choice_answer_table for select to authenticated
using (exists (select 1 from public.answer_table answer where answer.answerid = multiple_choice_answer_table.answerid));

create policy "select_accessible_number_picker_answer"
on public.number_picker_answer_table for select to authenticated
using (exists (select 1 from public.answer_table answer where answer.answerid = number_picker_answer_table.answerid));

create policy "select_accessible_pdf_upload_answer"
on public.pdf_upload_answer_table for select to authenticated
using (exists (select 1 from public.answer_table answer where answer.answerid = pdf_upload_answer_table.answerid));

create policy "select_accessible_short_text_answer"
on public.short_text_answer_table for select to authenticated
using (exists (select 1 from public.answer_table answer where answer.answerid = short_text_answer_table.answerid));

create policy "select_accessible_video_upload_answer"
on public.video_upload_answer_table for select to authenticated
using (exists (select 1 from public.answer_table answer where answer.answerid = video_upload_answer_table.answerid));

-- The old policy exposed every outcome to every signed-in user.
drop policy if exists "select_policy" on public.phase_outcome_table;

create policy "select_relevant_phase_outcomes"
on public.phase_outcome_table
as permissive
for select
to authenticated
using (
  exists (
    select 1
    from public.user_profiles_table
    where userid = auth.uid() and userrole = 3
  )
  or exists (
    select 1
    from public.phase_assignment_table assignment
    where assignment.user_role_1_id = phase_outcome_table.user_id
      and assignment.user_role_2_id = auth.uid()
  )
  or (
    user_id = auth.uid()
    and exists (
      select 1
      from public.phase_table phase
      where phase.phaseid = phase_outcome_table.phase_id
        and phase.finished_evaluation is not null
    )
  )
);

-- Reviewers download uploads through a checked server action and a short-lived
-- signed URL instead of receiving blanket access to every storage object.
drop policy if exists "all_cmds_for_atleast_viewer" on storage.buckets;
drop policy if exists "all_cmds_for_atleast_viewer" on storage.objects;

create or replace function public.fetch_applications_paginated(
  page_size int default 10,
  page_number int default 1
)
returns table (
  applicationid uuid,
  team_name text,
  email varchar(255)
)
language plpgsql
security definer
set search_path = public
as $$
declare
  offset_val int := (page_number - 1) * page_size;
  current_role int;
begin
  select userrole into current_role
  from public.user_profiles_table
  where userid = auth.uid() and isactive = true;

  if current_role is null or current_role < 2 then
    raise exception 'Access Denied';
  end if;

  return query
  select
    application.applicationid,
    application.team_name,
    users.email
  from public.users users
  join public.application_table application on users.id = application.userid
  where current_role = 3
    or exists (
      select 1
      from public.phase_assignment_table assignment
      where assignment.user_role_1_id = application.userid
        and assignment.user_role_2_id = auth.uid()
    )
  order by application.applicationid
  limit page_size
  offset offset_val;
end;
$$;
