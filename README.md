# application-platform

## Local Testing

### 1. Prerequisites
- Make sure you have **Docker** running on your machine.
- Select/enable the right Supabase credentials in `frontend/.env` (LocalDB/ TestDB).

### 2. Startup & Reset Supabase
To start the local database, auth, and storage services:
```bash
supabase start
```
*Note: This automatically provisions your database, applies all schema migrations (under `supabase/migrations/`), and loads seed data from `supabase/seed.sql`.*

Once started, you can check the status of your local services and get your API keys at any time by running:
```bash
supabase status
```

**💡 Quick Links:**
*   **Supabase Studio Dashboard**: [http://127.0.0.1:54323](http://127.0.0.1:54323) (visual table editor, auth logs, etc.)
*   **Mailpit Testing Server**: [http://127.0.0.1:54324](http://127.0.0.1:54324) (view local registration/confirmation emails)

If you ever want to reset your local database to a clean seed state:
```bash
supabase db reset
```
*(If you need to stop services and delete the local docker volumes entirely, run `supabase stop --no-backup` followed by `supabase start`)*

### 3. Load Phase Configurations and Texts
To populate your local database with phase questions and localized texts, run the following from the project root:
```bash
cd backend
poetry install
poetry run python backend/process_config.py --config apl_config_gend_all_phases.yml --env_file ../frontend/.env 
poetry run python backend/sync_texts.py --md_path ./texts/ --env_file ../frontend/.env
```

### 4. Startup Frontend
To launch the Next.js development server:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal.

### 5. Running End-to-End (Cypress) Tests
To run end-to-end integration tests locally:
1. Ensure the frontend server is running in a separate terminal.
2. Run the Cypress tests from the `e2e` folder:
```bash
cd e2e
npm install
# To run tests headlessly
npx cypress run
# To open the Cypress GUI Test Runner
npx cypress open
```

### 6. Linting & Formatting
```bash
# Check for ESLint issues
cd frontend
npm run lint

# Check formatting (Prettier – check only, does not modify files)
npm run format

# Auto-fix all Prettier formatting issues
npx prettier --write --ignore-path .gitignore .
```

## Remote DB Workflow

### 1. Link the Supabase CLI to your project
You will have to authenticate yourself in the browser and select the correct project.
```bash
supabase login
supabase link
```

### 2. Reset the Linked Remote DB
> [!IMPORTANT]
> **Do NOT reset the database after the start of the competition year!**
*This will not delete the database, but will only reset the schema data.*
```bash
supabase db reset --linked --no-seed
```

### 3. Load Configurations and Texts to Remote / Staging
Both the configuration seeding and text synchronization scripts run against whatever database is currently selected/active in **`frontend/.env`** (e.g. Test or Prod). 

To load configurations or sync texts to your remote environment, simply follow the exact same steps in [Load Phase Configurations and Texts](#3-load-phase-configurations-and-texts), ensuring you have enabled the correct remote credentials in your `.env` file first.




## Naming Convention

Everything in English (naming, comments, commits, ...)
- we strictly follow [PEP8](https://peps.python.org/pep-0008) naming convention for everything <https://peps.python.org/pep-0008/#prescriptive-naming-conventions>
- names end with the top-level relation, e.g.:
  - short_text_question for the short text questions database table
  - short_text_answer for the short text answers database table
  - application_table for the list of all applications
  - variable names contain the datatype if it is a "complex" data type (e.g., list, dict, ...)
- datetime format in scripts is "%Y-%m-%dT%H:%M:%S"
- date format in scripts is "%Y-%m-%d"

### "portected" keywords

| Keyword | Explanation |
| :-- | :-- |
| _question | everything related to a question (e.g., ) |
| _answer | an answer to a question for a specific application |
| _table | for tables (database) |
| _list | for lists in the code (instead of plural, easier to read) |
| _dict | for dictionaries |
| choice | multiple choice selection possibility |
| db| database |

--> short_text_question_table for the db table containing all short questions

## Python Formatting:

We use the following yapf config style:

```
[style]
based_on_style = pep8
split_before_named_assigns = False
column_limit = 120
dedent_closing_brackets = False
join_multiple_lines = True
indent_width = 4
blank_line_before_nested_class_or_def = False
```
You can apply this style globally if you save this file in ~/.config/yapf/style
For formatting with VS Code, follow this few quick steps: https://victorleungtw.medium.com/visual-studio-code-with-python-auto-formatting-8ba92b44360 


## Problem Domain

### Was muss das Tool können?

- Fragentypen
  - Freitext (kurz und lang)
- User management
  - Email verification
    - <https://supabase.com/docs/guides/functions/examples/send-emails>
  - Password reset
  - Admin / Rights Management
- Encryption
  - Frontend <> User
  - Frontend <> Backend
  - Authentication sinnvoll handlen
- Logging

### Was sind nice to haves?

- CI
- Admin Dashboard
- Fragentypen
  - Multiple choice (single und multi)
  - Conditional Fragen
  - Datepicker
  - Numberpicker
  - Textvalidation
    - Telefonnummer
    - Email
    - Zahlen
    - Regex
  - file upload
    - <https://github.com/supabase/supabase/tree/master/examples/edge-functions/supabase/functions/file-upload-storage>
- infobox
- conditional text based on date + …
- doku
- Mehrere typen an infobox (erweiterbar?)
- User management
  - @gmail und @googlemail das gleiche
- Export
- Validation mail mit allen antworten sobald bewerbung abgeschlossen ist
- Statusanzeige

### Welche Constraints haben wir?

- sehr gut wartbar / easy to use ohne IT background
- gut erweiterbar
  - Fragentypen
  - Wettbewerbsstruktur
- Datenschutzerklärung + Impressum
- Open Sourcing

### Methoden

#### Personas

Das Team SchabosWissenWerDerBaboIst möchte sich bei GenD bewerben.

Ich bin GenD IT team member und habe die ehrenvolle Aufgabe bekommen, das Bewerbungstool für dieses Jahr aufzusetzen. Ich habe keine Ahnung von Programmieren und möchte das ganze so schnell und entspannt wie möglich über die Bühne bringen.

#### Userstory

- Anmelden + Bewerbung vollständig ausfüllen
- Bewerbung nur teilweise ausfüllen, zu einem späteren zeitpunkt weiterführen
- Sind sich unsicher ob alles geklappt hat, hätten gerne eine bestätigungsmail mit ihrem content
- ich habe mein passwort vergessen und möchte es zurück setzen
Bewerbungsprozess easy aufsetzen als GenD IT Team mitglied

#### Tooling

- ein repo, darin unterteilung in Backend und Frontend
- Backend: Supabase <https://supabase.com/>
- Frontend: Nextjs
  - State Management: Redux
  - CSS: Tailwind CSS
- Server: Hetzner

#### Deployment

import.py => config.file -1-> model -2-> DB
1. JSON Syntax Check:
  1.1 Model Check
  1.2 Key Words
  1.3 Values
  1.4 Mandatory Key Words
2. All Good

Routing:

- /
- /login
- /phase-x
- /admin

## Logging

Using Pino and Logflare for logging.
Set the following Environment Variables:
- NEXT_PUBLIC_LOGFLARE_API_TOKEN
- NEXT_PUBLIC_LOGFLARE_CLIENT_TOKEN
- LOGFLARE_API_TOKEN
- LOGFLARE_SERVER_TOKEN

The code is located under /src/logger/logger.ts

How to use it:
```ts
import Logger from '@/logger/logger';

const log = new Logger("CURRENT_MODULE")
log.debug("MSG", "USER_ID");
```

## Git Hooks

1. Clone Repository
2. navigate to .git/hooks/: `cd .git/hooks/`
3. Create pre-push file: `nano pre-push`
4. Insert commands:

```
#!/bin/sh
# This hook script runs "npm run format:fix", "npm run lint", and "npm run format"
# in the /frontend directory before pushing, aborting the push if any of these commands fail.

REPO_ROOT=$(git rev-parse --show-toplevel)
FRONTEND_DIR="$REPO_ROOT/frontend"

echo "Changing to frontend directory..."
cd "$FRONTEND_DIR" || exit
echo "In frontend directory, running format:fix..."
npm run format:fix
if [ $? -ne 0 ]; then
  echo "format:fix failed, aborting push."
  exit 1
fi

echo "Running lint..."
npm run lint
if [ $? -ne 0 ]; then
  echo "Linting failed, aborting push."
  exit 1
fi

echo "Running format..."
npm run format
if [ $? -ne 0 ]; then
  echo "Formatting failed, aborting push."
  exit 1
fi

echo "All checks passed. Proceeding with push."
cd -  # Return to the original directory
exit 0
```
5. Make Hook Executable: `chmod +x pre-push`
6. Navigate back: `cd ../../`
7. Test your git Hook: `git push`


## Frontend Deployment

1. Prerequisites:
- Ubuntu Server with Docker Image and Docker Compose
- 2 URLs (one for Frontend and one for your proxy)

2. Set URLs to IP Adresses:
- Frontend URL (e.g. bewerbung.generation-d.org)
- Proxy/Nginx URL (e.g. bewerbung-proxy.generation-d.org)
- Set A -> IPv4 and AAAA -> IPv6

3. Create and copy files from repository into server:
- custom-nginx.conf
- docker-compose.yml (change the docker image name, if not prd)

4. Login into Github Container Registry:
https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry

5. Call docker compose up -d (make sure the api keys are set to the e.g. supabase instance you want to use: https://github.com/Generation-D/application-platform/settings/secrets/actions)

6. Setup Nginx
- Go to YOUR_IP:81
- Default Credentials: 
    - email: admin@example.com
    - password: changeme
- Update Credentials
- Check on a page, like https://dnschecker.org/ if your A and AAAA entries are already set for both URLs, if not wait, else proceed
- Go to Dashboard -> Proxy Hosts
- Add first Proxy Host:
  - Details:
    - Domain Names=YOUR_PROXY_DOMAIN (e.g. `bewerbung-proxy.generation-d.org`, no protocoll/port)
    - Forward Hostname/IP=`127.0.0.1`
    - Forward Port=`81`
    - Block Common Exploits: On
  - SSL:
    - Request a new SSL Certificate
    - Force SSL: On
    - HTTP/2 Support: On
    - HSTS Enabled: On
    - Agree to Terms of Service
- Add Second Proxy Host:
  - Details:
    - Domain Names=YOUR_FRONTEND_DOMAIN (e.g. `bewerbung.generation-d.org`, no protocoll/port)
    - Forward Hostname/IP=`frontend`
    - Forward Port=`3000`
    - Block Common Exploits: On
    - Websockets Support: On
  - SSL:
    - Request a new SSL Certificate
    - Force SSL: On
    - HTTP/2 Support: On
    - HSTS Enabled: On
    - Agree to Terms of Service

