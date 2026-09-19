# Reviewer matching parity with the former step 3

The portal's `assignReviewers` uses the same two-pass procedure as
`bewertungsprozess/application_process/step_3_assign_judges.py`:

1. Give every team the currently least-loaded experienced reviewer with free
   capacity.
2. Fill the remaining slots with currently least-loaded eligible reviewers.

Both preserve the input team order and the reviewer CSV order for load ties.
The portal also validates impossible capacity configurations before starting.

## Direct comparison

On 2026-09-19, the former script and the portal implementation were run with
the former repository's checked-in fixtures:

- `application_process/tests/assets/test_step_3_application_data_startups.csv`
  (1,000 teams)
- `application_process/tests/assets/test_step_3_judges_data.csv`
  (200 reviewers)
- Two reviewers per team (the former script's default)

The Python output `matched_teams.csv` was compared team by team and in slot
order against the TypeScript result from the **same ordered inputs**:

| Check | Result |
| --- | ---: |
| Teams | 1,000 |
| Reviewers | 200 |
| Assignments from each implementation | 2,000 |
| Exact ordered reviewer pairs | 1,000 / 1,000 |

The first comparison exposed a difference: the portal had sorted teams by ID
and resolved equal reviewer loads by email, while Python used input order. That
difference was corrected before the result above. The automated regression
test in `frontend/scripts/reviewer-matching.test.ts` now checks this tie rule,
the required experienced reviewer and insufficient-capacity rejection.

This establishes parity for the matching algorithm given identical ordered
inputs. It does not claim that a database query and an independently prepared
legacy CSV always supply teams in the same order, nor that the surrounding
email and phase workflows are byte-for-byte identical.
