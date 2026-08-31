# Admin evaluation workflow: local test checklist

This checklist covers the admin workflow under `/admin/evaluation`. It uses only
the local Supabase Docker stack and the accounts from `supabase/seed.sql`.

## 1. Safety preflight

- [ ] Docker is running.
- [ ] The current branch is `codex/admin-evaluation-workflow`.
- [ ] The active URL in `frontend/.env` is exactly:

  ```dotenv
  NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
  ```

- [ ] No command in this checklist contains `--linked`, `--db-url`, or
      `db push`.
- [ ] Another local Supabase project is not occupying ports `54321` through
      `54324`. If necessary, stop that project without `--no-backup` first.

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

Use the local-only Admin, Reviewer, and Applicant accounts defined in
`supabase/seed.sql`. Read the current values from that file so this checklist
does not duplicate credentials that may change.

## 5. Access control

- [ ] While logged out, opening `/admin/evaluation` redirects to `/login`.
- [ ] An applicant cannot open the admin workflow.
- [ ] The seeded Admin can open the workflow from the admin dashboard.
- [ ] The phase selector contains `1. Kurzbewerbung` and
      `2. Read-Deck`.

Use `phase-1` for the remaining tests. Later phases only contain applicants who
passed the preceding phase.

## 6. Matching validation

Create `reviewers.csv`:

```csv
name,email,new,max
Test Reviewer,<seeded-reviewer-email>,nein,10
```

### Invalid input

- [ ] Uploading an empty CSV produces a clear validation error.
- [ ] A CSV without one of `name,email,new,max` is rejected.
- [ ] An unknown email is rejected because it has no active reviewer account.
- [ ] A value other than `ja`, `nein`, `yes`, or `no` in `new` is rejected.
- [ ] Capacity below the number of required assignments is rejected.
- [ ] A matching without enough experienced reviewer capacity is rejected.

### Successful preview and persistence

- [ ] Upload `reviewers.csv`.
- [ ] Set `Bewerter pro Startup` to `1`.
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

To test a genuine split, temporarily promote another seeded user to Reviewer in
the local admin dashboard, use both reviewers with one assignment per startup,
and verify each reviewer separately. Reset the local database afterwards.

## 8. Email template

- [ ] After saving a matching, `Testmail senden` and
      `Produktiv an alle senden` become enabled.
- [ ] Subject, deadlines, links, and the phase note are prefilled.
- [ ] Changing a field affects the current form without changing the versioned
      defaults in `reviewEmailConfig.ts`.
- [ ] The automated email test escapes HTML in startup names.
- [ ] The automated email test rejects non-HTTP links.

Do not click either send button unless `SMTP_HOST` and `SMTP_PORT` intentionally
point to a local mail catcher. Merely running local Supabase does not guarantee
that the frontend SMTP variables are local.

## 9. Decisions and completion

### Validation

- [ ] Attempting to finish the phase before all decisions exist reports how
      many decisions are missing.
- [ ] Adding an unknown or ineligible email to the bulk list is rejected without
      changing existing decisions.

### Bulk decision path

Enter, for example:

```text
<seeded-applicant-email-1>
<seeded-applicant-email-2>
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
