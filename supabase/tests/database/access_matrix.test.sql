-- Access rules per role. Each block logs in as one user (role + JWT sub) and
-- checks what that user can read and write through RLS.
begin;
select plan(45);

-- ---------------------------------------------------------------- fixtures
create function pg_temp.login(uid uuid) returns void language sql as $$
  select set_config('role', 'authenticated', true),
         set_config('request.jwt.claims',
                    json_build_object('sub', uid, 'role', 'authenticated')::text,
                    true);
$$;

insert into auth.users (id, email, raw_app_meta_data) values
  ('a0000000-0000-0000-0000-00000000000a', 'applicant-a@matrix.invalid', '{"provider":"email"}'),
  ('a0000000-0000-0000-0000-00000000000b', 'applicant-b@matrix.invalid', '{"provider":"email"}'),
  ('a0000000-0000-0000-0000-000000000001', 'reviewer@matrix.invalid', '{"provider":"slack_oidc"}'),
  ('a0000000-0000-0000-0000-000000000002', 'reviewer-2@matrix.invalid', '{"provider":"slack_oidc"}'),
  ('a0000000-0000-0000-0000-000000000003', 'inactive-reviewer@matrix.invalid', '{"provider":"slack_oidc"}'),
  ('a0000000-0000-0000-0000-000000000009', 'admin@matrix.invalid', '{"provider":"email"}'),
  ('a0000000-0000-0000-0000-000000000008', 'inactive-admin@matrix.invalid', '{"provider":"email"}');

update public.user_profiles_table set isactive = false
where userid in ('a0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000008');
update public.user_profiles_table set userrole = 3
where userid in ('a0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000008');

insert into public.application_table (applicationid, userid) values
  ('b0000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-00000000000a'),
  ('b0000000-0000-0000-0000-00000000000b', 'a0000000-0000-0000-0000-00000000000b');

insert into public.phase_table (phaseid, phasename, phaselabel, phaseorder, startdate, enddate, sectionsenabled, finished_evaluation) values
  ('c0000000-0000-0000-0000-000000000001', 'matrix-open', 'Open', 901, now() - interval '1 day', now() + interval '1 day', false, null),
  ('c0000000-0000-0000-0000-000000000002', 'matrix-done', 'Done', 902, now() - interval '2 day', now() - interval '1 day', false, now());

insert into public.question_table (questionid, questiontype, questionorder, phaseid, mandatory, questiontext) values
  ('c1000000-0000-0000-0000-000000000001', 'shortText', 0, 'c0000000-0000-0000-0000-000000000001', false, 'Q1'),
  ('c1000000-0000-0000-0000-000000000002', 'shortText', 1, 'c0000000-0000-0000-0000-000000000001', false, 'Q2');

insert into public.answer_table (answerid, questionid, applicationid, created, lastupdated) values
  ('d0000000-0000-0000-0000-00000000000a', 'c1000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000a', now(), now()),
  ('d0000000-0000-0000-0000-00000000000b', 'c1000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000b', now(), now());
insert into public.short_text_answer_table (answerid, answertext) values
  ('d0000000-0000-0000-0000-00000000000a', 'A'),
  ('d0000000-0000-0000-0000-00000000000b', 'B');

insert into public.phase_assignment_table (phase_id, user_role_1_id, user_role_2_id) values
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-000000000001'),
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-00000000000b', 'a0000000-0000-0000-0000-000000000002');

insert into public.phase_outcome_table (phase_id, user_id, outcome, reviewed_by) values
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-00000000000a', true, 'a0000000-0000-0000-0000-000000000009'),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-00000000000a', true, 'a0000000-0000-0000-0000-000000000009'),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-00000000000b', false, 'a0000000-0000-0000-0000-000000000009');

-- ------------------------------------------------------------ applicant A
select pg_temp.login('a0000000-0000-0000-0000-00000000000a');

select is((select count(*) from public.application_table), 1::bigint, 'applicant: reads only own application');
select is((select count(*) from public.answer_table), 1::bigint, 'applicant: reads only own answers');
select is((select count(*) from public.short_text_answer_table), 1::bigint, 'applicant: reads only own typed answers');
select is((select count(*) from public.user_profiles_table), 1::bigint, 'applicant: reads only own profile');
select is((select count(*) from public.question_table where phaseid = 'c0000000-0000-0000-0000-000000000001'), 2::bigint, 'applicant: reads questions');

select throws_ok(
  $$ insert into public.user_profiles_table (userid, userrole, isactive) values ('a0000000-0000-0000-0000-00000000000a', 3, true) $$,
  '42501', null, 'applicant: cannot insert a profile');
select is_empty(
  $$ update public.user_profiles_table set userrole = 3 where userid = 'a0000000-0000-0000-0000-00000000000a' returning 1 $$,
  'applicant: cannot change own role');
select is_empty(
  $$ delete from public.user_profiles_table where userid = 'a0000000-0000-0000-0000-00000000000a' returning 1 $$,
  'applicant: cannot delete own profile');
select throws_ok(
  $$ insert into public.application_table (userid) values ('a0000000-0000-0000-0000-00000000000a') $$,
  '42501', null, 'applicant: cannot create another application');
select is_empty(
  $$ delete from public.application_table returning 1 $$,
  'applicant: cannot delete applications');

select lives_ok(
  $$ insert into public.answer_table (answerid, questionid, applicationid, created, lastupdated)
     values ('d0000000-0000-0000-0000-0000000000a2', 'c1000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-00000000000a', now(), now()) $$,
  'applicant: can create own answer');
select lives_ok(
  $$ insert into public.short_text_answer_table (answerid, answertext) values ('d0000000-0000-0000-0000-0000000000a2', 'new') $$,
  'applicant: can create own typed answer');
select isnt_empty(
  $$ update public.short_text_answer_table set answertext = 'changed' where answerid = 'd0000000-0000-0000-0000-0000000000a2' returning 1 $$,
  'applicant: can update own typed answer');
select isnt_empty(
  $$ delete from public.answer_table where answerid = 'd0000000-0000-0000-0000-0000000000a2' returning 1 $$,
  'applicant: can delete own answer');
select throws_ok(
  $$ insert into public.answer_table (questionid, applicationid, created, lastupdated)
     values ('c1000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-00000000000b', now(), now()) $$,
  '42501', null, 'applicant: cannot answer for another application');
select is_empty(
  $$ update public.short_text_answer_table set answertext = 'x' where answerid = 'd0000000-0000-0000-0000-00000000000b' returning 1 $$,
  'applicant: cannot change another applicant''s answer');
select is_empty(
  $$ update public.question_table set questiontext = 'x' returning 1 $$,
  'applicant: cannot change questions');

select is((select count(*) from public.phase_outcome_table), 1::bigint, 'applicant: sees only own outcome of finished phases');
select is((select count(*) from public.phase_assignment_table), 0::bigint, 'applicant: sees no assignments');
select throws_ok($$ select * from public.fetch_applications_paginated(10, 1) $$, 'P0001', 'Access Denied', 'applicant: cannot list applications');
select throws_ok(
  $$ insert into storage.buckets (id, name, owner) values ('matrix-bucket', 'matrix-bucket', 'a0000000-0000-0000-0000-00000000000a') $$,
  '42501', null, 'applicant: cannot create storage buckets');
reset role;

-- --------------------------------------------------------------- reviewer
select pg_temp.login('a0000000-0000-0000-0000-000000000001');
select is((select count(*) from public.application_table where applicationid::text like 'b0000000%'), 2::bigint, 'reviewer: reads all applications');
select is((select count(*) from public.answer_table where answerid::text like 'd0000000%'), 2::bigint, 'reviewer: reads all answers');
select is((select count(*) from public.short_text_answer_table where answerid::text like 'd0000000%'), 2::bigint, 'reviewer: reads all typed answers');
select is((select count(*) from public.phase_assignment_table), 1::bigint, 'reviewer: reads only own assignments');
select is((select count(*) from public.phase_outcome_table), 0::bigint, 'reviewer: reads no outcomes');
select is_empty(
  $$ update public.short_text_answer_table set answertext = 'x' returning 1 $$,
  'reviewer: cannot change answers');
select throws_ok(
  $$ insert into public.answer_table (questionid, applicationid, created, lastupdated)
     values ('c1000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-00000000000a', now(), now()) $$,
  '42501', null, 'reviewer: cannot create answers');
select ok((select count(*) from public.fetch_applications_paginated(100, 1) where applicationid::text like 'b0000000%') = 2, 'reviewer: lists applications');
select ok(public.count_reviewable_applications() >= 2, 'reviewer: counts applications');
reset role;

-- ------------------------------------------------------ inactive reviewer
select pg_temp.login('a0000000-0000-0000-0000-000000000003');
select is((select count(*) from public.application_table), 0::bigint, 'inactive reviewer: reads no applications');
select is((select count(*) from public.answer_table), 0::bigint, 'inactive reviewer: reads no answers');
select throws_ok($$ select * from public.fetch_applications_paginated(10, 1) $$, 'P0001', 'Access Denied', 'inactive reviewer: cannot list applications');
reset role;

-- ------------------------------------------------------------------ admin
select pg_temp.login('a0000000-0000-0000-0000-000000000009');
select is((select count(*) from public.phase_outcome_table where user_id::text like 'a0000000%'), 3::bigint, 'admin: reads all outcomes');
select is((select count(*) from public.phase_assignment_table where user_role_2_id::text like 'a0000000%'), 2::bigint, 'admin: reads all assignments');
select isnt_empty(
  $$ update public.phase_table set phaselabel = 'Changed' where phaseid = 'c0000000-0000-0000-0000-000000000001' returning 1 $$,
  'admin: can change phases');
select isnt_empty(
  $$ update public.short_text_answer_table set answertext = 'admin' where answerid = 'd0000000-0000-0000-0000-00000000000a' returning 1 $$,
  'admin: can change answers');
reset role;

-- ---------------------------------------------- inactive admin (stricter)
select pg_temp.login('a0000000-0000-0000-0000-000000000008');
select is((select count(*) from public.phase_outcome_table), 0::bigint, 'inactive admin: reads no outcomes');
select is_empty(
  $$ update public.phase_table set phaselabel = 'x' returning 1 $$,
  'inactive admin: cannot change phases');
reset role;

-- ------------------------------------------------------------------- anon
set local role anon;
select is((select count(*) from public.application_table), 0::bigint, 'anon: reads no applications');
select is((select count(*) from public.question_table), 0::bigint, 'anon: reads no questions');
reset role;

-- ----------------------------------------------------- schema constraints
select throws_ok(
  $$ insert into public.application_table (userid) values ('a0000000-0000-0000-0000-00000000000a') $$,
  '23505', null, 'constraint: one application per user');
select throws_ok(
  $$ insert into public.question_table (questiontype, questionorder, phaseid, mandatory, questiontext)
     values ('nonsense', 9, 'c0000000-0000-0000-0000-000000000001', false, 'x') $$,
  '23514', null, 'constraint: unknown question types are rejected');
select throws_ok(
  $$ insert into public.phase_table (phasename, phaselabel, phaseorder, startdate, enddate, sectionsenabled)
     values ('matrix-bad', 'Bad', 903, now(), now() - interval '1 day', false) $$,
  '23514', null, 'constraint: phases must end after they start');

-- ------------------------------------------------------- account deletion
select lives_ok(
  $$ delete from auth.users where id in ('a0000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000009') $$,
  'deletion: users with outcomes, assignments and decisions can be deleted');

select * from finish();
rollback;
