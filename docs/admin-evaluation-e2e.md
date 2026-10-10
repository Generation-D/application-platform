# End-to-End-Test des Admin-Bewertungsablaufs

Dieser Test nutzt **nur die lokale Supabase-Datenbank**. Die vorbereitete,
von Git ignorierte CSV enthält genau eine private Zustelladresse. Die Testmail
prüft die Vorlage; erst der produktive Versand an diese Ein-Personen-CSV prüft auch
die CC-Kopien an IT und CMD. **Nicht** mit einer echten Bewerterliste testen.

## Vor dem Start

1. Im Repository-Root `npx supabase status` prüfen. Der lokale API-Endpunkt
   muss `http://127.0.0.1:54321` sein. **Kein** `db reset`, `db push`,
   `--linked` oder `--db-url` für diesen Test nötig.
2. In der ignorierten Datei `frontend/.env` kontrollieren:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   SMTP_HOST=127.0.0.1
   SMTP_PORT=54325
   ```

3. Im Verzeichnis `frontend` das Portal mit `npm run dev` starten, falls es
   nicht bereits läuft. Unter <http://localhost:3000/admin/evaluation> als
   lokaler Admin anmelden. Mailpit ist unter <http://127.0.0.1:54324>.
4. Wenn keine Phasen angezeigt werden, die lokalen Konfigurationsimporte aus
   [der ausführlichen Testliste](admin-evaluation-local-test.md) ausführen.
   Bestehende lokale Matchings vor dem Überschreiben prüfen.

## 1. Matching und Vorlage lokal prüfen

1. `phase-1` auswählen und die nur in diesem Checkout vorbereitete Datei
   `frontend/.local-test/reviewers-single-recipient.csv` hochladen. In einem
   anderen Checkout die Datei lokal mit `name,email,new,max` und genau einer
   Zeile für die eigene Testadresse erstellen; keine privaten Adressen committen.
2. **Bewerter pro Startup = 1** setzen, dann „Matching prüfen“. Erwartung:
   Jede teilnahmeberechtigte Bewerbung hat genau eine Zuweisung an die
   Testadresse. Die CSV-Adresse ist nur die Zustelladresse, kein
   Portal-Login.
3. „Matching verbindlich speichern“ und nach einem Reload prüfen, ob es
   erhalten bleibt. Das ersetzt ein eventuell bereits vorhandenes **lokales**
   Matching dieser Phase.
4. Fristen eintragen. Der Betreff kommt aus `reviewEmailConfig.ts` und die
   konkrete Runde wird automatisch ergänzt, z. B. `[Generation-D]
   Bewertungsrunde 1. Kurzbewerbung`. Die drei Felder
   für Bestätigung, Anleitung und Bewertungsformular akzeptieren entweder
   HTTP(S)-Links oder Freitext. Bei Freitext erscheint eine Warnung; in der
   Mail wird er nicht anklickbar. Für einen lokalen Linktest muss
   `NEXT_PUBLIC_SITE_URL=http://localhost:3000` bleiben.
5. Als Testempfänger dieselbe private Adresse eintragen und „Testmail senden“.
   Erwartung in Mailpit: genau eine neue Nachricht mit Absender
   `no-reply@generation-d.org` und der privaten Testadresse als Empfänger,
   `Reply-To: it@generation-d.org` und `Cc: it@generation-d.org`,
   `[TEST]` im Betreff und anklickbare Teamlinks, ohne darunter wiederholte
   rohe URLs oder einen Link zu allen Bewerbungen. Der Text nennt
   „Bewertungsrunde 1. Kurzbewerbung“ und endet mit
   „Euer CMD & IT Team“.
6. Mit dem lokalen Reviewer-Konto im Portal anmelden und die Links aus der
   Mail öffnen. Die private Zustelladresse muss dafür **nicht** als Login
   existieren. Nach Rückkehr als Admin den produktiven Versand bestätigen.
   Erwartung: **genau eine** weitere Mail in Mailpit, an die private
   Testadresse und mit `Cc: it@generation-d.org, cmd@generation-d.org`.
   Es gibt keine separate Übersichtsmail.
7. Die Phase für den optionalen Echtmail-Test **noch nicht abschließen**.
   Danach im Admin-Bereich Entscheidungen setzen, Phase abschließen und mit
   einem lokalen Bewerber-Konto das Ergebnis prüfen. Die ausführlichen
   negativen Rollen- und Validierungsfälle stehen in
   [der Testliste](admin-evaluation-local-test.md).

Mailpit stellt nichts an echte Postfächer zu. Die in der lokalen Mail
enthaltenen `localhost`-Links funktionieren nur auf dem Rechner, auf dem das
Portal läuft.

Am 10.10.2026 wurde der verwendete SMTP-Versandcode separat gegen Mailpit
geprüft: `From: no-reply@generation-d.org`, die private Testadresse in `To`
und beide internen Adressen in `Cc` waren im empfangenen Mailpit-Eintrag
vorhanden. Das ist ein Header-/Transporttest, noch kein abgeschlossener
Browser-Durchlauf des gesamten Workflows.

## 2. Eine echte E-Mail empfangen

Für diesen Schritt ist die lokale SMTP-Konfiguration noch unvollständig. Zugangsdaten gehören
**nur** in die ignorierte `frontend/.env` bzw. in geschützte
Deployment-Variablen, niemals in Git oder einen PR-Kommentar. Benötigt werden
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER` und `SMTP_PASSWORD` für einen Account,
der als `no-reply@generation-d.org` senden darf. Die Werte und die Einrichtung
sind in [der SMTP-Anleitung](reviewer-email-configuration.md) beschrieben.
Die vorhandenen Variablen `EMAIL` und `EMAIL_PASSWORD` verwendet der
Portalversand derzeit nicht; `SMTP_HOST`/`SMTP_PORT` zeigen noch auf Mailpit.

Nach Umstellung auf echten SMTP und Neustart des Portals nur die Testmail an
die private Testadresse schicken. Erwartung: eine
Nachricht an die private Testadresse und eine Kopie an
`it@generation-d.org`; **CMD erhält keine Testmail und steht auch nicht im
Reply-To der Testmail**. Eingang, Spam-Ordner,
Absender, Reply-To und Teamlinks prüfen. Den produktiven Rundversand für
diesen Echtmail-Test nicht verwenden: Dort stünden IT **und** CMD in CC.
Danach `SMTP_HOST`/`SMTP_PORT` wieder auf Mailpit stellen und das Portal neu
starten, damit weitere lokale Tests nicht versehentlich echte Mails
verschicken. Ein SMTP-Erfolg bestätigt die Annahme durch den Server, nicht
die endgültige Zustellung an jedes Postfach.
