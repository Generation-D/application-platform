-- One decision per (phase, applicant).
--
-- Outcomes were written read-then-insert without a constraint, so duplicates
-- could appear (finishPhaseEvaluation even had to detect conflicting ones).
-- Keep the most recent decision per pair, then enforce uniqueness so the app
-- can upsert.

with ranked as (
  select
    outcome_id,
    row_number() over (
      partition by phase_id, user_id
      order by review_date desc nulls last, outcome_id
    ) as rn
  from public.phase_outcome_table
)
delete from public.phase_outcome_table outcome
using ranked
where outcome.outcome_id = ranked.outcome_id
  and ranked.rn > 1;

alter table public.phase_outcome_table
  add constraint phase_outcome_table_phase_user_key
  unique (phase_id, user_id);
