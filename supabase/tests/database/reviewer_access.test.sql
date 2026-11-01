begin;
select plan(10);

insert into auth.users (id, email, raw_app_meta_data) values
  ('d0000000-0000-0000-0000-000000000001', 'reviewer@review-test.invalid', '{"provider":"slack_oidc"}'),
  ('d0000000-0000-0000-0000-000000000002', 'applicant@review-test.invalid', '{"provider":"email"}'),
  ('d0000000-0000-0000-0000-000000000003', 'other@review-test.invalid', '{}'),
  ('d0000000-0000-0000-0000-000000000004', 'inactive@review-test.invalid', '{"provider":"slack_oidc"}');

select is((select userrole from public.user_profiles_table where userid = 'd0000000-0000-0000-0000-000000000001'), 2, 'Slack registration becomes reviewer');
select is((select userrole from public.user_profiles_table where userid = 'd0000000-0000-0000-0000-000000000002'), 1, 'Email registration becomes applicant');
select is((select userrole from public.user_profiles_table where userid = 'd0000000-0000-0000-0000-000000000003'), 1, 'Missing provider defaults to applicant');
update public.user_profiles_table set isactive = false where userid = 'd0000000-0000-0000-0000-000000000004';

insert into public.application_table (applicationid, userid) values
  ('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002'),
  ('e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003');
insert into public.phase_table (phaseid, phasename, phaselabel, phaseorder, startdate, enddate, sectionsenabled)
values ('f0000000-0000-0000-0000-000000000001', 'review-access-test', 'Test', 999, now(), now(), false);
insert into public.question_table (questionid, questiontype, questionorder, phaseid, mandatory, questiontext)
values ('f0000000-0000-0000-0000-000000000002', 'short_text', 0, 'f0000000-0000-0000-0000-000000000001', false, 'Test');
insert into public.answer_table (answerid, questionid, applicationid, created, lastupdated)
select applicationid, 'f0000000-0000-0000-0000-000000000002', applicationid, now(), now()
from public.application_table where applicationid in ('e0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000003');
insert into public.short_text_answer_table (answerid, answertext) values
  ('e0000000-0000-0000-0000-000000000002', 'First answer'),
  ('e0000000-0000-0000-0000-000000000003', 'Second answer');

set local role authenticated;
set local request.jwt.claim.sub = 'd0000000-0000-0000-0000-000000000001';
select is((select count(*) from public.application_table where applicationid in ('e0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000003')), 2::bigint, 'Reviewer reads both applications without matching');
select is((select count(*) from public.answer_table where questionid = 'f0000000-0000-0000-0000-000000000002'), 2::bigint, 'Reviewer reads both answers');
select is((select count(*) from public.short_text_answer_table where answerid in ('e0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000003')), 2::bigint, 'Typed answers inherit reviewer access');

set local request.jwt.claim.sub = 'd0000000-0000-0000-0000-000000000002';
select is((select count(*) from public.application_table where applicationid in ('e0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000003')), 1::bigint, 'Applicant reads only own application');
select is((select count(*) from public.answer_table where questionid = 'f0000000-0000-0000-0000-000000000002'), 1::bigint, 'Applicant reads only own answer');
select is((select count(*) from public.short_text_answer_table where answerid in ('e0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000003')), 1::bigint, 'Typed answers inherit applicant isolation');

set local request.jwt.claim.sub = 'd0000000-0000-0000-0000-000000000004';
select is((select count(*) from public.application_table where applicationid in ('e0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000003')), 0::bigint, 'Inactive reviewer cannot read applications');
reset role;
select * from finish();
rollback;
