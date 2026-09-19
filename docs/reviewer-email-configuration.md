# Reviewer email configuration

The reviewer email has two separate kinds of settings:

| Setting | Where to change it | What it controls |
| --- | --- | --- |
| `reviewEmailSender.name`, `.email`, `.replyTo` | `frontend/src/config/reviewEmailConfig.ts` | Public `From` and `Reply-To` mail headers |
| `reviewEmailDefaults` | The same file | Annual subject, deadlines, links and phase note |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | Server environment | Which SMTP server actually sends the email and how the portal authenticates |
| `NEXT_PUBLIC_SITE_URL` | Server environment | Base URL for the review link in the message |

Changing the sender settings requires a frontend restart locally or a new
deployment. They are deliberately versioned in code, not uploaded as JSON. The
SMTP login is **not** the displayed sender: your mail provider must permit the
authenticated account to send as `reviewEmailSender.email`. Otherwise it may
reject the message or replace the From address. The Reply-To addresses do not
need SMTP passwords; they only specify where responses go.

## Local Mailpit: safe test without real delivery

Start local Supabase with `npx supabase start`. Open the Mailpit inbox at
<http://127.0.0.1:54324>. This is a local web page, separate from the portal.
Its SMTP endpoint is port `54325`.

In the ignored `frontend/.env`, use:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SMTP_HOST=127.0.0.1
SMTP_PORT=54325
```

Leave `SMTP_USER` and `SMTP_PASSWORD` unset. Restart `npm run dev` after editing
the environment file. On `/admin/evaluation`, enter an address in **Empfänger
der Testmail** and click **Testmail senden**. The message appears in Mailpit,
regardless of the address entered; it does **not** reach that address's real
inbox. Inspect the From, Reply-To, subject, body and review link in Mailpit.

## Real inbox: authenticated SMTP

Get the SMTP host, port, username and password from the mail administrator or
your organization's secret manager. Do not place actual passwords in this
document, source files, PR comments or chat. For a local real-inbox test,
replace the Mailpit values in the ignored `frontend/.env` with the real values:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SMTP_HOST=<mail-provider-host>
SMTP_PORT=<mail-provider-port>
SMTP_USER=<smtp-login>
SMTP_PASSWORD=<smtp-password-or-app-password>
```

Use the port required by the provider. The portal uses implicit TLS on `465`
and STARTTLS when offered on other ports such as `587`, with normal certificate
validation. Make sure the SMTP account may send as the configured From address.
Restart the frontend, confirm you are using the intended Supabase environment,
then enter **your own real inbox address** in **Empfänger der Testmail** and
click **Testmail senden**. This sends one sample message only to that address;
it does not send to the reviewers. Check delivery, spam folder and headers.
Do not click **Produktiv an alle senden** for a test.

For a deployed portal, set the same four `SMTP_*` values and
`NEXT_PUBLIC_SITE_URL` as protected environment variables in the deployment
environment. The test deployment workflow references GitHub Actions secrets
with those names. Never commit credentials or rely on the local `.env` for a
deployment.
