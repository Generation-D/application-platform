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
The seeded roles and names are:

| Login | Name | Role |
| --- | --- | --- |
| `admin@test.com` | Mara Fischer | Admin |
| `viewer@test.com` | Anna Weber | Reviewer |
| `user1@test.com` | Lea Bergmann | Applicant |
| `user2@test.com` | David Richter | Applicant |
| `user3@test.com` | Aylin Demir | Applicant |
| `user4@test.com` | Jonas Keller | Reviewer |
| `user5@test.com` | Sophie Nguyen | Reviewer |
| `user6@test.com` | Lukas Hoffmann | Reviewer |
| `user7@test.com` | Miriam Schneider | Reviewer |

The admin landing page `/admin` is for access/role management; matching,
reviewer mail and phase decisions are on `/admin/evaluation`.

- [ ] `/admin` shows these names and roles, with no unexpected `Unknown` roles.
- [ ] Search for `Sophie` and `user5@test.com`; both find the same account.
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

These five accounts must be active Reviewers. The file supports two reviewers
per startup for the three seeded applicants. `new=nein` means experienced.

### Invalid input

- [ ] Uploading an empty CSV produces a clear validation error.
- [ ] A CSV without one of `name,email,new,max` is rejected.
- [ ] An unknown email is rejected because it has no active reviewer account.
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
- [ ] The review overview only lists applications assigned to this reviewer.
- [ ] An applicant that has no assignment cannot be opened by changing the URL.
- [ ] Uploaded application files are accessible for an assigned application.
- [ ] Uploaded files from an unassigned application are not accessible.

The CSV includes five Reviewer accounts, so sign in as at least two of them and
verify they cannot see each other's unassigned applications.

## 8. Email template

- [ ] After saving a matching, `Testmail senden` and
      `Produktiv an alle senden` become enabled.
- [ ] Subject, deadlines, links, and the phase note are prefilled.
- [ ] Changing a field affects the current form without changing the versioned
      defaults in `reviewEmailConfig.ts`.
- [ ] The automated email test escapes HTML in startup names.
- [ ] The automated email test rejects non-HTTP links.
- [ ] The page shows `no-reply@generation-d.org` and Reply-To addresses
      `it@generation-d.org` and `cmd@generation-d.org`.
- [ ] Enter an email address in `Empfänger der Testmail`; the test button is
      disabled without one and sends only to the address entered.

For a safe local delivery test, use these settings in the ignored `frontend/.env`
and restart the frontend:

```dotenv
SMTP_HOST=127.0.0.1
SMTP_PORT=54325
```

Leave `SMTP_USER` and `SMTP_PASSWORD` unset for local Mailpit. Send a test mail
to any syntactically valid address, then inspect it at
<http://127.0.0.1:54324>. Mailpit catches it locally; it does **not** deliver
to a real inbox. Check the From and Reply-To headers there.

Verified through the portal button on 2026-09-19: the page reported
`Testmail wurde an mailpit-ui-test@example.invalid gesendet.`, and Mailpit
received the message with the configured sender and both Reply-To addresses.

To receive it in a real inbox, replace the local SMTP host and port with your
organization's SMTP server (usually port `465` or `587`), set `SMTP_USER` and
`SMTP_PASSWORD` in the ignored `frontend/.env`, restart the frontend, and enter
your own inbox address in `Empfänger der Testmail`. The server must authorize
`no-reply@generation-d.org` as sender. First check the subject has `[TEST]`;
do not click `Produktiv an alle senden` for this test. Never commit SMTP secrets.

## 9. Decisions and completion

### Validation

- [ ] Attempting to finish the phase before all decisions exist reports how
      many decisions are missing.
- [ ] Adding an unknown or ineligible email to the bulk list is rejected without
      changing existing decisions.

### Bulk decision path

Use `~/Downloads/approved-applicants.txt`, containing:

```text
user1@test.com
user3@test.com
```

- [ ] Confirming `Liste auf alle anwenden` marks those two applicants as
      `Bestanden`.
- [ ] Every other eligible applicant is marked `Nicht bestanden`.
- [ ] The success message reports the correct passed and failed counts.
- [ ] Refreshing the page preserves all decisions.

### Individual decision path

- [ ] Change one decision with its dropdown.
- [ ] A success message names the affected startup.
- [ ] Refreshing the page preserves the changed decision.

### Final completion

- [ ] Click `Phase verbindlich abschließen` and confirm the dialog.
- [ ] The phase selector marks the phase as `abgeschlossen`.
- [ ] A completion timestamp is shown.
- [ ] Decision controls are disabled after completion.
- [ ] Applicants see the outcome intended for them.

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
