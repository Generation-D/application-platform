begin;
select plan(45);

create function pg_temp.applicant_a() returns uuid language sql immutable as $$ select 'a0000000-0000-0000-0000-00000000000a'::uuid $$;
create function pg_temp.applicant_b() returns uuid language sql immutable as $$ select 'a0000000-0000-0000-0000-00000000000b'::uuid $$;
create function pg_temp.reviewer() returns uuid language sql immutable as $$ select 'a0000000-0000-0000-0000-000000000001'::uuid $$;
create function pg_temp.reviewer_2() returns uuid language sql immutable as $$ select 'a0000000-0000-0000-0000-000000000002'::uuid $$;
create function pg_temp.inactive_reviewer() returns uuid language sql immutable as $$ select 'a0000000-0000-0000-0000-000000000003'::uuid $$;
create function pg_temp.admin() returns uuid language sql immutable as $$ select 'a0000000-0000-0000-0000-000000000009'::uuid $$;
create function pg_temp.inactive_admin() returns uuid language sql immutable as $$ select 'a0000000-0000-0000-0000-000000000008'::uuid $$;

create function pg_temp.application_a() returns uuid language sql immutable as $$ select 'b0000000-0000-0000-0000-00000000000a'::uuid $$;
create function pg_temp.application_b() returns uuid language sql immutable as $$ select 'b0000000-0000-0000-0000-00000000000b'::uuid $$;
create function pg_temp.open_phase() returns uuid language sql immutable as $$ select 'c0000000-0000-0000-0000-000000000001'::uuid $$;
create function pg_temp.finished_phase() returns uuid language sql immutable as $$ select 'c0000000-0000-0000-0000-000000000002'::uuid $$;
create function pg_temp.question_1() returns uuid language sql immutable as $$ select 'c1000000-0000-0000-0000-000000000001'::uuid $$;
create function pg_temp.question_2() returns uuid language sql immutable as $$ select 'c1000000-0000-0000-0000-000000000002'::uuid $$;
create function pg_temp.answer_a() returns uuid language sql immutable as $$ select 'd0000000-0000-0000-0000-00000000000a'::uuid $$;
create function pg_temp.answer_b() returns uuid language sql immutable as $$ select 'd0000000-0000-0000-0000-00000000000b'::uuid $$;
create function pg_temp.new_answer_a() returns uuid language sql immutable as $$ select 'd0000000-0000-0000-0000-0000000000a2'::uuid $$;

create function pg_temp.email_signup() returns jsonb language sql immutable as $$ select '{"provider":"email"}'::jsonb $$;
create function pg_temp.slack_signup() returns jsonb language sql immutable as $$ select '{"provider":"slack_oidc"}'::jsonb $$;
create function pg_temp.one_day() returns interval language sql immutable as $$ select interval '1 day' $$;
create function pg_temp.tampered() returns text language sql immutable as $$ select 'tampered' $$;

create function pg_temp.rls_violation() returns text language sql immutable as $$ select '42501' $$;
create function pg_temp.check_violation() returns text language sql immutable as $$ select '23514' $$;
create function pg_temp.unique_violation() returns text language sql immutable as $$ select '23505' $$;
create function pg_temp.raised_exception() returns text language sql immutable as $$ select 'P0001' $$;
create function pg_temp.access_denied() returns text language sql immutable as $$ select 'Access Denied' $$;

create function pg_temp.login(uid uuid) returns void language sql as $$
  select set_config('role', 'authenticated', true),
         set_config('request.jwt.claims',
                    json_build_object('sub', uid, 'role', 'authenticated')::text,
                    true);
$$;

insert into auth.users (id, email, raw_app_meta_data) values
  (pg_temp.applicant_a(), 'applicant-a@matrix.invalid', pg_temp.email_signup()),
  (pg_temp.applicant_b(), 'applicant-b@matrix.invalid', pg_temp.email_signup()),
  (pg_temp.reviewer(), 'reviewer@matrix.invalid', pg_temp.slack_signup()),
  (pg_temp.reviewer_2(), 'reviewer-2@matrix.invalid', pg_temp.slack_signup()),
  (pg_temp.inactive_reviewer(), 'inactive-reviewer@matrix.invalid', pg_temp.slack_signup()),
  (pg_temp.admin(), 'admin@matrix.invalid', pg_temp.email_signup()),
  (pg_temp.inactive_admin(), 'inactive-admin@matrix.invalid', pg_temp.email_signup());

update public.user_profiles_table set isactive = false
where userid in (pg_temp.inactive_reviewer(), pg_temp.inactive_admin());
update public.user_profiles_table set userrole = 3
where userid in (pg_temp.admin(), pg_temp.inactive_admin());

insert into public.application_table (applicationid, userid) values
  (pg_temp.application_a(), pg_temp.applicant_a()),
  (pg_temp.application_b(), pg_temp.applicant_b());

insert into public.phase_table (phaseid, phasename, phaselabel, phaseorder, startdate, enddate, sectionsenabled, finished_evaluation) values
  (pg_temp.open_phase(), 'matrix-open', 'Open', 901, now() - pg_temp.one_day(), now() + pg_temp.one_day(), false, null),
  (pg_temp.finished_phase(), 'matrix-done', 'Done', 902, now() - 2 * pg_temp.one_day(), now() - pg_temp.one_day(), false, now());

insert into public.question_table (questionid, questiontype, questionorder, phaseid, mandatory, questiontext) values
  (pg_temp.question_1(), 'shortText', 0, pg_temp.open_phase(), false, 'Q1'),
  (pg_temp.question_2(), 'shortText', 1, pg_temp.open_phase(), false, 'Q2');

insert into public.answer_table (answerid, questionid, applicationid, created, lastupdated) values
  (pg_temp.answer_a(), pg_temp.question_1(), pg_temp.application_a(), now(), now()),
  (pg_temp.answer_b(), pg_temp.question_1(), pg_temp.application_b(), now(), now());
insert into public.short_text_answer_table (answerid, answertext) values
  (pg_temp.answer_a(), 'A'),
  (pg_temp.answer_b(), 'B');

insert into public.phase_assignment_table (phase_id, user_role_1_id, user_role_2_id) values
  (pg_temp.open_phase(), pg_temp.applicant_a(), pg_temp.reviewer()),
  (pg_temp.open_phase(), pg_temp.applicant_b(), pg_temp.reviewer_2());

insert into public.phase_outcome_table (phase_id, user_id, outcome, reviewed_by) values
  (pg_temp.open_phase(), pg_temp.applicant_a(), true, pg_temp.admin()),
  (pg_temp.finished_phase(), pg_temp.applicant_a(), true, pg_temp.admin()),
  (pg_temp.finished_phase(), pg_temp.applicant_b(), false, pg_temp.admin());

select pg_temp.login(pg_temp.applicant_a());

select is((select count(*) from public.application_table), 1::bigint, 'applicant: reads only own application');
select is((select count(*) from public.answer_table), 1::bigint, 'applicant: reads only own answers');
select is((select count(*) from public.short_text_answer_table), 1::bigint, 'applicant: reads only own typed answers');
select is((select count(*) from public.user_profiles_table), 1::bigint, 'applicant: reads only own profile');
select is((select count(*) from public.question_table where phaseid = pg_temp.open_phase()), 2::bigint, 'applicant: reads questions');

select throws_ok(
  $$ insert into public.user_profiles_table (userid, userrole, isactive) values (pg_temp.applicant_a(), 3, true) $$,
  pg_temp.rls_violation(), null, 'applicant: cannot insert a profile');
select is_empty(
  $$ update public.user_profiles_table set userrole = 3 where userid = pg_temp.applicant_a() returning 1 $$,
  'applicant: cannot change own role');
select is_empty(
  $$ delete from public.user_profiles_table where userid = pg_temp.applicant_a() returning 1 $$,
  'applicant: cannot delete own profile');
select throws_ok(
  $$ insert into public.application_table (userid) values (pg_temp.applicant_a()) $$,
  pg_temp.rls_violation(), null, 'applicant: cannot create another application');
select is_empty(
  $$ delete from public.application_table returning 1 $$,
  'applicant: cannot delete applications');

select lives_ok(
  $$ insert into public.answer_table (answerid, questionid, applicationid, created, lastupdated)
     values (pg_temp.new_answer_a(), pg_temp.question_2(), pg_temp.application_a(), now(), now()) $$,
  'applicant: can create own answer');
select lives_ok(
  $$ insert into public.short_text_answer_table (answerid, answertext) values (pg_temp.new_answer_a(), 'new') $$,
  'applicant: can create own typed answer');
select isnt_empty(
  $$ update public.short_text_answer_table set answertext = 'changed' where answerid = pg_temp.new_answer_a() returning 1 $$,
  'applicant: can update own typed answer');
select isnt_empty(
  $$ delete from public.answer_table where answerid = pg_temp.new_answer_a() returning 1 $$,
  'applicant: can delete own answer');
select throws_ok(
  $$ insert into public.answer_table (questionid, applicationid, created, lastupdated)
     values (pg_temp.question_2(), pg_temp.application_b(), now(), now()) $$,
  pg_temp.rls_violation(), null, 'applicant: cannot answer for another application');
select is_empty(
  $$ update public.short_text_answer_table set answertext = pg_temp.tampered() where answerid = pg_temp.answer_b() returning 1 $$,
  'applicant: cannot change another applicant''s answer');
select is_empty(
  $$ update public.question_table set questiontext = pg_temp.tampered() returning 1 $$,
  'applicant: cannot change questions');

select is((select count(*) from public.phase_outcome_table), 1::bigint, 'applicant: sees only own outcome of finished phases');
select is((select count(*) from public.phase_assignment_table), 0::bigint, 'applicant: sees no assignments');
select throws_ok(
  $$ select * from public.fetch_applications_paginated(10, 1) $$,
  pg_temp.raised_exception(), pg_temp.access_denied(), 'applicant: cannot list applications');
select throws_ok(
  $$ insert into storage.buckets (id, name, owner) values ('matrix-bucket', 'matrix-bucket', pg_temp.applicant_a()) $$,
  pg_temp.rls_violation(), null, 'applicant: cannot create storage buckets');
reset role;

select pg_temp.login(pg_temp.reviewer());
select is((select count(*) from public.application_table where applicationid in (pg_temp.application_a(), pg_temp.application_b())), 2::bigint, 'reviewer: reads all applications');
select is((select count(*) from public.answer_table where answerid in (pg_temp.answer_a(), pg_temp.answer_b())), 2::bigint, 'reviewer: reads all answers');
select is((select count(*) from public.short_text_answer_table where answerid in (pg_temp.answer_a(), pg_temp.answer_b())), 2::bigint, 'reviewer: reads all typed answers');
select is((select count(*) from public.phase_assignment_table), 1::bigint, 'reviewer: reads only own assignments');
select is((select count(*) from public.phase_outcome_table), 0::bigint, 'reviewer: reads no outcomes');
select is_empty(
  $$ update public.short_text_answer_table set answertext = pg_temp.tampered() returning 1 $$,
  'reviewer: cannot change answers');
select throws_ok(
  $$ insert into public.answer_table (questionid, applicationid, created, lastupdated)
     values (pg_temp.question_2(), pg_temp.application_a(), now(), now()) $$,
  pg_temp.rls_violation(), null, 'reviewer: cannot create answers');
select ok(
  (select count(*) from public.fetch_applications_paginated(100, 1) where applicationid in (pg_temp.application_a(), pg_temp.application_b())) = 2,
  'reviewer: lists applications');
select ok(public.count_reviewable_applications() >= 2, 'reviewer: counts applications');
reset role;

select pg_temp.login(pg_temp.inactive_reviewer());
select is((select count(*) from public.application_table), 0::bigint, 'inactive reviewer: reads no applications');
select is((select count(*) from public.answer_table), 0::bigint, 'inactive reviewer: reads no answers');
select throws_ok(
  $$ select * from public.fetch_applications_paginated(10, 1) $$,
  pg_temp.raised_exception(), pg_temp.access_denied(), 'inactive reviewer: cannot list applications');
reset role;

select pg_temp.login(pg_temp.admin());
select is((select count(*) from public.phase_outcome_table where user_id in (pg_temp.applicant_a(), pg_temp.applicant_b())), 3::bigint, 'admin: reads all outcomes');
select is((select count(*) from public.phase_assignment_table where phase_id = pg_temp.open_phase()), 2::bigint, 'admin: reads all assignments');
select isnt_empty(
  $$ update public.phase_table set phaselabel = 'Changed' where phaseid = pg_temp.open_phase() returning 1 $$,
  'admin: can change phases');
select isnt_empty(
  $$ update public.short_text_answer_table set answertext = 'admin' where answerid = pg_temp.answer_a() returning 1 $$,
  'admin: can change answers');
reset role;

select pg_temp.login(pg_temp.inactive_admin());
select is((select count(*) from public.phase_outcome_table), 0::bigint, 'inactive admin: reads no outcomes');
select is_empty(
  $$ update public.phase_table set phaselabel = pg_temp.tampered() returning 1 $$,
  'inactive admin: cannot change phases');
reset role;

set local role anon;
select is((select count(*) from public.application_table), 0::bigint, 'anon: reads no applications');
select is((select count(*) from public.question_table), 0::bigint, 'anon: reads no questions');
reset role;

select throws_ok(
  $$ insert into public.application_table (userid) values (pg_temp.applicant_a()) $$,
  pg_temp.unique_violation(), null, 'constraint: one application per user');
select throws_ok(
  $$ insert into public.question_table (questiontype, questionorder, phaseid, mandatory, questiontext)
     values ('nonsense', 9, pg_temp.open_phase(), false, 'Q9') $$,
  pg_temp.check_violation(), null, 'constraint: unknown question types are rejected');
select throws_ok(
  $$ insert into public.phase_table (phasename, phaselabel, phaseorder, startdate, enddate, sectionsenabled)
     values ('matrix-bad', 'Bad', 903, now(), now() - pg_temp.one_day(), false) $$,
  pg_temp.check_violation(), null, 'constraint: phases must end after they start');

select lives_ok(
  $$ delete from auth.users where id in (pg_temp.applicant_a(), pg_temp.reviewer(), pg_temp.admin()) $$,
  'deletion: users with outcomes, assignments and decisions can be deleted');

select * from finish();
rollback;
