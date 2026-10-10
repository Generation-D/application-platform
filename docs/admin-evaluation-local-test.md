# Admin evaluation workflow: local test checklist

This checklist covers the admin workflow under `/admin/evaluation`. It uses only
the local Supabase Docker stack and the accounts from `supabase/seed.sql`.

## 1. Safety preflight

- [ ] Docker is running.
- [ ] The current branch is `codex/admin-evaluation-workflow`.
- [ ] The active URL in `frontend/.env` is exactly:

  ```dotenv
  NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
  NEXT_PUBLIC_SITE_URL=http://localhost:3000
  ```

- [ ] No command in this checklist contains `--linked`, `--db-url`, or
      `db push`.
- [ ] Another local Supabase project is not occupying ports `54321` through
      `54325`. If necessary, stop that project without `--no-backup` first.

## 2. Create the local test state

From the repository root:

```bash
npx supabase start
npx supabase db reset --local
npx supabase status
```

The reset applies the migrations and creates the seeded users and applications.
It does not create phases. Import them from the versioned YAML configuration:

```bash
cd frontend
npm install
npm run process:config -- ../apl_configs/apl_config_gend_all_phases.yml
npm run sync:texts -- ../texts
```

- [ ] Both import commands finish without an error.
- [ ] `phase_table` contains `phase-1` and `phase-2` in local Supabase Studio.
- [ ] Opening `/admin/evaluation` no longer displays
      `Es wurden keine Phasen gefunden`.

Start the frontend:

```bash
npm run dev
```

Open <http://localhost:3000>.

## 3. Automated checks

Run these from `frontend`:

```bash
npm run test:scripts
npm run lint
npx tsc --noEmit
npm run build
```

- [ ] All script tests pass.
- [ ] ESLint reports no errors.
- [ ] TypeScript reports no errors.
- [ ] The production build succeeds and lists `/admin/evaluation`.

## 4. Test accounts

Use the local-only accounts defined in `supabase/seed.sql`. Read the current
passwords from that file so this checklist does not duplicate credentials.
The seeded accounts and roles are:

| Login | Role |
| --- | --- |
| `admin@test.com` | Admin |
| `viewer@test.com` | Reviewer |
| `user1@test.com` | Applicant |
| `user2@test.com` | Applicant |
| `user3@test.com` | Applicant |
| `user4@test.com` | Reviewer |
| `user5@test.com` | Reviewer |
| `user6@test.com` | Reviewer |
| `user7@test.com` | Reviewer |

The admin landing page `/admin` is for access/role management; matching,
reviewer mail and phase decisions are on `/admin/evaluation`.

- [ ] `/admin` shows E-Mail, role and active status, but no name column or
      unexpected `Unknown` roles.
- [ ] Search for `user5@test.com` and the same user's Supabase Auth ID; both
      find the account.
- [ ] Deactivate and reactivate a reviewer; the status persists after refresh.
- [ ] Change a reviewer's role and change it back; both persist after refresh.
- [ ] The current admin cannot deactivate or demote their own account.

## 5. Access control

- [ ] While logged out, opening `/admin/evaluation` redirects to `/login`.
- [ ] An applicant cannot open the admin workflow.
- [ ] The seeded Admin can open the workflow from the admin dashboard.
- [ ] The phase selector contains `1. Kurzbewerbung` and
      `2. Read-Deck`.

Use `phase-1` for the remaining tests. Later phases only contain applicants who
passed the preceding phase.

## 6. Matching validation

Use `~/Downloads/reviewers.csv` (five named reviewers). The file has this
format:

```csv
name,email,new,max
Anna Weber,viewer@test.com,nein,3
Jonas Keller,user4@test.com,ja,2
Sophie Nguyen,user5@test.com,nein,2
Lukas Hoffmann,user6@test.com,ja,2
Miriam Schneider,user7@test.com,nein,2
```

These addresses are mail delivery addresses; no matching portal accounts are
required. The file supports two reviewers per startup for the three seeded
applicants. `new=nein` means experienced.

### Invalid input

- [ ] Uploading an empty CSV produces a clear validation error.
- [ ] A CSV without one of `name,email,new,max` is rejected.
- [ ] An external or private email can be used without a matching portal account.
- [ ] A value other than `ja`, `nein`, `yes`, or `no` in `new` is rejected.
- [ ] Capacity below the number of required assignments is rejected.
- [ ] A matching without enough experienced reviewer capacity is rejected.

### Successful preview and persistence

- [ ] Upload `reviewers.csv`.
- [ ] Set `Bewerter pro Startup` to `2`.
- [ ] Click `Matching prüfen`.
- [ ] The number of preview rows equals the number of eligible startups.
- [ ] Every row contains the expected reviewer and experience flag.
- [ ] Running the preview again produces the same assignments.
- [ ] Click `Matching verbindlich speichern` and confirm the dialog.
- [ ] A success message reports the saved assignment count.
- [ ] Refreshing the page still shows `Gespeichertes Matching`.
- [ ] Saving a new matching asks before replacing the existing assignments.

## 7. Reviewer access and RLS

- [ ] Log out and sign in as the seeded Reviewer.
- [ ] The review overview lists all applications for an active Reviewer.
- [ ] The overview shows rows as well as the correct count (an RPC error must not appear as an empty list).
- [ ] A direct link opens the matching application and its phases in read-only mode, even after the application deadline.
- [ ] An active Reviewer can open an application even if its delivery address is not in the CSV.
- [ ] Uploaded application files are accessible to an active Reviewer.
- [ ] An inactive Reviewer and an Applicant cannot view others' applications or uploads.

Promote a trusted Slack or email-login account to active Reviewer in the admin
user management, then test with that account. A new Slack login alone must not
grant Reviewer access.

## 8. Email template

Sender editing, Mailpit and real SMTP setup are documented in
[reviewer-email-configuration.md](reviewer-email-configuration.md).

- [ ] After saving a matching, `Testmail senden` and
      `Produktiv an alle senden` become enabled.
- [ ] The subject comes from versioned configuration and automatically includes the round number and phase name. The phase note is prefilled; deadlines must be entered before sending.
- [ ] Confirmation, instructions and rating fields accept HTTP(S) links or plain text. Plain text shows a warning and is not rendered as a link.
- [ ] Changing a field affects the current form without changing the versioned
      defaults in `reviewEmailConfig.ts`.
- [ ] The automated email test escapes HTML in application labels.
- [ ] Each assigned team has one explicit `Bewerbung öffnen` link, without a second raw URL or a link to all applications.
- [ ] The mail body names the numbered round and ends with `Euer CMD & IT Team`.
- [ ] The automated email test rejects non-HTTP application links and safely renders free-text references.
- [ ] The page shows `no-reply@generation-d.org` and Reply-To addresses
      `it@generation-d.org` and `cmd@generation-d.org`.
- [ ] Enter an email address in `Empfänger der Testmail`; the test button is
      disabled without one. IT and CMD can each be selected for the test CC.
- [ ] Every production reviewer email has `it@generation-d.org` and
      `cmd@generation-d.org` in CC. The production button is disabled if either
      checkbox is off, and the server action rejects an incomplete selection.
- [ ] User management has no name column; email addresses identify accounts.

For a safe local delivery test, use these settings in the ignored `frontend/.env`
and restart the frontend:

```dotenv
SMTP_HOST=127.0.0.1
SMTP_PORT=54325
```

Local Mailpit does not use mailbox authentication, even when `EMAIL` and
`EMAIL_PASSWORD` are set. Send a test mail
to any syntactically valid address, then inspect it at
<http://127.0.0.1:54324>. Mailpit catches it locally; it does **not** deliver
to a real inbox. Check the From and Reply-To headers there.

An earlier portal-button check on 2026-09-19 used the previous mail headers.
For the current behavior, test IT-only, CMD-only, both and neither; Mailpit
must show exactly the selected CC and Reply-To addresses.

To receive it in a real inbox through Hetzner Managed Mail, use
`SMTP_HOST=mail.your-server.de` and `SMTP_PORT=587` with the existing `EMAIL`
and `EMAIL_PASSWORD` in the ignored `frontend/.env`, restart the frontend, and enter
your own inbox address in `Empfänger der Testmail`. The server must authorize
`no-reply@generation-d.org` as sender. First check the subject has `[TEST]`;
do not click `Produktiv an alle senden` for this test. Never commit SMTP secrets.

## 9. Decisions and completion

Use the local Supabase project only. At preparation time, `phase-1`
(`Kurzbewerbung`) is open and all three seeded startups have a saved
`Nicht bestanden` decision. Do **not** reset the local database just to run
this section. Log in as `admin@test.com`, open
<http://localhost:3000/admin/evaluation>, and select `1. Kurzbewerbung`.
The accounts and password are defined in `supabase/seed.sql`.

### Validation before changing decisions

- [ ] Confirm that GreenHarbor (`user1@test.com`), SolarNest
      (`user2@test.com`) and CareBridge (`user3@test.com`) are listed.
- [ ] Paste `user1@test.com` and `nicht-vorhanden@example.invalid` into the
      bulk field, then confirm `Liste auf alle anwenden`. The unknown address
      must produce an error; after refresh, all three decisions must remain
      unchanged. This test must not partially save the valid address.

### Bulk decision path

Replace the bulk field with the contents of
[`docs/test-data/approved-applicants-part-3.txt`](test-data/approved-applicants-part-3.txt):

```text
user1@test.com
user3@test.com
```

- [ ] Confirm `Liste auf alle anwenden`. The success message says
      `2 bestanden, 1 nicht bestanden`.
- [ ] GreenHarbor and CareBridge now show `Bestanden`; SolarNest shows
      `Nicht bestanden`.
- [ ] Refresh the page. All three decisions persist.
- [ ] In local Supabase Studio, verify `phase_outcome_table` has exactly one
      outcome per applicant for `phase-1`: two `true`, one `false`.

In Supabase Studio (<http://127.0.0.1:54323>), the following read-only SQL
shows the saved decisions without needing to copy UUIDs:

```sql
select u.email, o.outcome, o.review_date
from public.phase_outcome_table as o
join public.phase_table as p on p.phaseid = o.phase_id
join auth.users as u on u.id = o.user_id
where p.phasename = 'phase-1'
order by u.email;
```

### Individual decision path

- [ ] Set SolarNest to `Bestanden`. A success message names SolarNest.
- [ ] Refresh: all three now show `Bestanden`.
- [ ] Set SolarNest back to `Nicht bestanden` and refresh. This leaves the
      intended final result at two passed and one failed.

### Final completion

Only perform this step when you want to finish the local test phase: the portal
has no undo button for a completed phase. Before completion, confirm the two
passed / one failed result in the UI and in local Supabase Studio.

- [ ] Click `Ergebnisse veröffentlichen` and confirm the dialog.
- [ ] The phase selector marks `Kurzbewerbung` as `abgeschlossen` and a
      completion timestamp appears.
- [ ] Decision controls are disabled; a new save attempt is rejected.
- [ ] In local Supabase Studio, `phase_table.finished_evaluation` is non-null
      for `phase-1` and still null for `phase-2`.
- [ ] Log in as `user1@test.com` and `user3@test.com`: neither is blocked from
      the next-phase overview. As `user2@test.com`, the next phase says
      `Vorherige Phase leider nicht bestanden!`. Since the configured 2026
      application dates have passed, the next phase is read-only even for
      passed applicants.
- [ ] On returning as Admin, `phase-2` has exactly GreenHarbor and CareBridge
      as eligible startups.

The missing-decision guard (`Für ... Startups fehlt noch eine Entscheidung`)
cannot be exercised with the current local state because all three decisions
already exist. Test it on a fresh *local* reset before applying a bulk list;
do not remove existing outcomes merely for this check. The reset procedure is
in section 10 below.

The portal's overview text follows the current competition phase. Closing
`phase-1` during its normal timetable changes `phase-1/evaluating.md` to
`phase-1/passed.md` or `phase-1/failed.md`. In this historical local fixture,
the configured `phase-2` deadline has already passed: successful first-round
applicants therefore see the *second* round's evaluation text until that round
is completed. To verify the direct evaluating-to-passed/failed text switch in
this fixture, complete `phase-2` after setting its eligible decisions.

## 10. Clean rerun

To discard the local test results and repeat from a clean state:

```bash
cd ..
npx supabase db reset --local
cd frontend
npm run process:config -- ../apl_configs/apl_config_gend_all_phases.yml
npm run sync:texts -- ../texts
```

Never add `--linked` while following this checklist.
