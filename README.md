# application-platform

## Naming Convention

- Everything in english (naming, comments, commits, ...)
- we strictly follow [PEP8](https://peps.python.org/pep-0008) naming convention for everything <https://peps.python.org/pep-0008/#prescriptive-naming-conventions>
- names end with the top level relation, e.g.:
  - short_text_question for the short text questions database table
  - short_text_answer for the short text answers database table
  - application_table for the list of all applications
  - variable names contain the datatype if it is a "complex" data type (e.g., list, dict, ...)

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

1. Json Syntax Check:
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

## Next Steps

Marib: Erstellt Github Issues
Gereon: Baut Worker, kümmert sich um Supabase, Docker Compose
