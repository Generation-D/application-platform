# Reviewer email configuration

The reviewer email has two separate kinds of settings:

| Setting | Where to change it | What it controls |
| --- | --- | --- |
| `reviewEmailSender.name`, `.email`, `.replyTo` | `frontend/src/config/reviewEmailConfig.ts` | Public `From` and `Reply-To` headers; `replyTo` addresses also receive every production reviewer mail in CC |
| `reviewEmailDefaults` | The same file | Annual subject prefix, deadlines, links or text, and phase note; round number and phase name are appended automatically |
| `SMTP_HOST`, `SMTP_PORT` | Server environment | Which SMTP server sends the email |
| `EMAIL`, `EMAIL_PASSWORD` | Server environment | Existing mailbox login used for SMTP authentication; explicit `SMTP_USER`/`SMTP_PASSWORD` can override these values |
| `NEXT_PUBLIC_SITE_URL` | Server environment | Base URL for the review link in the message |

Changing the sender settings requires a frontend restart locally or a new
deployment. They are deliberately versioned in code, not uploaded as JSON. The
annual links and deadlines start blank so private addresses are not published
in the public repository; enter them in the admin form before sending or set
non-sensitive annual defaults in the configuration file. The
SMTP login is **not** necessarily the displayed sender: your mail provider must permit the
authenticated account to send as `reviewEmailSender.email`. Otherwise it may
reject the message or replace the From address. The Reply-To/CC addresses do
not need SMTP passwords; they receive replies and copies of production mails.

Each production reviewer mail must have `it@generation-d.org` and
`cmd@generation-d.org` in CC. The production button stays disabled until both
boxes are selected; the server action enforces the same rule. Both inboxes receive the exact
message and can forward it manually if needed. There is no separate overview
mail. SMTP acceptance does not guarantee final inbox delivery, and SMTP does
not itself save outgoing messages in the sender's Sent folder. If a send
partially fails, some reviewer mails may already have been accepted; check
the CC inboxes before repeating the round-send action. For a test mail, IT and
CMD can each be selected or omitted independently; the selected recipients are
also used as Reply-To. Neither box selected means no CC or Reply-To header.

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

No SMTP login is used for local Mailpit, even if `EMAIL` and `EMAIL_PASSWORD`
are present. Restart `npm run dev` after editing
the environment file. On `/admin/evaluation`, enter an address in **Empfänger
der Testmail** and click **Testmail senden**. The message appears in Mailpit,
regardless of the address entered; it does **not** reach that address's real
inbox. Inspect the From, Reply-To, subject, body and review link in Mailpit.
The three reference fields also accept plain text. A warning appears before
sending; only HTTP(S) entries become clickable links in the message.

## Real inbox: authenticated SMTP

For a Hetzner managed mailbox, Hetzner documents `mail.your-server.de` as the
outgoing server and recommends port `587` with STARTTLS. The full mailbox
address is the username. Keep the password only in the ignored `frontend/.env`
or a protected deployment environment, never in source files, PR comments or
chat. A local real-inbox test uses:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SMTP_HOST=mail.your-server.de
SMTP_PORT=587
EMAIL=<full-mailbox-address>
EMAIL_PASSWORD=<mailbox-password>
```

The portal requires STARTTLS on `587` and uses normal certificate validation.
Make sure the SMTP account may send as the configured From address.
Restart the frontend, confirm you are using the intended Supabase environment,
then enter **your own real inbox address** in **Empfänger der Testmail** and
click **Testmail senden**. This sends one sample message to that address, not
to the reviewer list. Select IT and/or CMD in the two CC boxes as desired.
Check delivery, spam folder and headers.
The portal uses the existing `EMAIL` and `EMAIL_PASSWORD`; `SMTP_USER` and
`SMTP_PASSWORD` are optional overrides. After a real-mail test, restore
`SMTP_HOST=127.0.0.1` and `SMTP_PORT=54325` for further local work so it does
not send external mail.
Do not click **Produktiv an alle senden** for a test.

For a deployed portal, set `SMTP_HOST`, `SMTP_PORT`, `EMAIL`, `EMAIL_PASSWORD` and
`NEXT_PUBLIC_SITE_URL` as protected environment variables in the deployment
environment. Never commit credentials or rely on the local `.env` for a
deployment. [Hetzner's mail setup guide](https://docs.hetzner.com/de/managed/email/set-up-email-account/setting-up-an-email-account/)
documents the server, port and login format.
