-- One answer row per (question, application).
--
-- saveAnswer() used to read-then-insert without a constraint, so concurrent
-- saves could create duplicate rows; every later save then failed on
-- `.single()`. Keep the most recently updated duplicate (typed answer rows of
-- the others are removed by ON DELETE CASCADE), then enforce uniqueness so
-- saveAnswer() can fall back to updating on a unique violation.

with ranked as (
  select
    answerid,
    row_number() over (
      partition by questionid, applicationid
      order by lastupdated desc nulls last, created desc nulls last, answerid
    ) as rn
  from public.answer_table
)
delete from public.answer_table answer
using ranked
where answer.answerid = ranked.answerid
  and ranked.rn > 1;

alter table public.answer_table
  add constraint answer_table_question_application_key
  unique (questionid, applicationid);
