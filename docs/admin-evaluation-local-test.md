# Bewertungsprozess lokal testen

Dieser Test nutzt **nur die lokale Supabase-Instanz**. Kein `db push`,
`--linked` oder `--db-url`. Die vorhandenen lokalen Daten bleiben erhalten,
solange du keinen Reset ausführst. Echte E-Mails sind für den Test nicht nötig;
Mailpit fängt sie lokal ab.

## Start und Kontrolle

1. Im Repository-Root `npx supabase start` und `npx supabase status` ausführen.
   Die API muss unter `http://127.0.0.1:54321` erreichbar sein.
2. In der ignorierten `frontend/.env` prüfen:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   SMTP_HOST=127.0.0.1
   SMTP_PORT=54325
   ```

3. Im Verzeichnis `frontend` bei Bedarf `npm install` und `npm run dev`
   ausführen. Das Portal ist unter <http://localhost:3000>, Supabase Studio
   unter <http://127.0.0.1:54323> und Mailpit unter
   <http://127.0.0.1:54324> erreichbar.
4. Nur falls Phasen fehlen, im Verzeichnis `frontend` ausführen:

   ```bash
   npm run process:config -- ../apl_configs/apl_config_gend_all_phases.yml
   npm run sync:texts -- ../texts
   ```

   Die Testkonten stehen in `supabase/seed.sql`. Admin: `admin@test.com`,
   Bewerbungen: `user1@test.com` (GreenHarbor), `user2@test.com` (SolarNest),
   `user3@test.com` (CareBridge). Das Seed-Passwort steht ebenfalls dort.

## Checkliste

### 1. Nutzer und Zugriffe

- [ ] Als Admin zeigt `/admin` E-Mail, ID, Rolle und Aktivstatus, aber keine
      Namensspalte. Suche nach E-Mail und nach der vollständigen ID.
- [ ] Ein Doppelklick auf die ID markiert sie vollständig; Kopieren liefert
      den kompletten Wert.
- [ ] Rollen- und Aktivschalter bleiben nach einem Reload gespeichert. Der
      eigene Admin-Zugang kann nicht deaktiviert oder herabgestuft werden.
- [ ] Ohne Login führt `/admin/evaluation` zur Anmeldung; Bewerber können
      diesen Bereich nicht öffnen.
- [ ] Ein aktiver Bewerter sieht alle Bewerbungen und deren Uploads, ein
      Bewerber oder inaktiver Bewerter nicht. Ein neues Slack-Konto braucht
      dafür zunächst die aktive Bewerterrolle.

### 2. Matching

Für `1. Kurzbewerbung` eine CSV mit den Spalten `name,email,new,max` nutzen.
`new=nein` bedeutet erfahren. Die Adresse ist nur die **Zustelladresse**;
der Portal-Login darf eine andere Adresse haben.

```csv
name,email,new,max
Anna Weber,viewer@test.com,nein,3
Jonas Keller,user4@test.com,ja,2
Sophie Nguyen,user5@test.com,nein,2
Lukas Hoffmann,user6@test.com,ja,2
Miriam Schneider,user7@test.com,nein,2
```

- [ ] Leere CSV, fehlende Spalten, ungültiges `new`, zu wenig Kapazität oder
      zu wenig erfahrene Bewerter ergeben eine verständliche Fehlermeldung.
- [ ] Mit zwei Bewertern pro Startup erzeugt „Matching prüfen“ sechs
      Zuweisungen für drei Startups. Jedes Startup erhält mindestens einen
      erfahrenen Bewerter. Erneutes Prüfen ergibt dasselbe Matching.
- [ ] „Matching verbindlich speichern“ verlangt eine Bestätigung; nach einem
      Reload ist das Matching noch sichtbar. Ein neues Matching ersetzt das
      bisherige nur nach Bestätigung.

### 3. E-Mail-Versand

- [ ] Betreff und Mail nennen die Rundennummer und „Kurzbewerbung“. Jedes
      zugewiesene Team hat genau einen anklickbaren Bewerbungslink.
- [ ] Die Felder „Bestätigung (Link)“, „Anleitung (Link)“ und
      „Bewertungsformular (Link)“ akzeptieren auch Freitext; dann erscheint
      eine Warnung und der Text wird nicht als Link gerendert.
- [ ] Eine Testmail an eine eigene Adresse erscheint in Mailpit mit `[TEST]`
      im Betreff. IT und CMD können dabei unabhängig in CC gewählt werden.
- [ ] Für den Rundversand sind **beide** CC-Häkchen Pflicht. Mit einer CSV,
      die nur deine Testadresse enthält, entsteht genau eine Bewerter-Mail;
      IT und CMD erhalten je eine Kopie. Nicht mit einer echten Bewerterliste
      testen.

Mailpit stellt nicht an echte Postfächer zu. Für einen echten Test oder die
SMTP-Zugangsdaten siehe [E-Mail-Konfiguration](reviewer-email-configuration.md).
Das private Supabase-Storage-Objekt enthält nur das Matching, keine Mailkopien.

### 4. Entscheidungen und Abschluss

Der folgende Test verändert nur die lokale Runde. Ist sie bereits
abgeschlossen, diesen Abschnitt nicht erneut ausführen; ein Reset würde alle
lokalen Testdaten löschen.

- [ ] Bei einer offenen Runde mit noch fehlenden Entscheidungen verhindert
      „Ergebnisse veröffentlichen“ den Abschluss und nennt die Anzahl.
- [ ] `user1@test.com` zusammen mit `nicht-vorhanden@example.invalid` in die
      Liste der bestandenen Adressen einfügen. „Liste auf alle anwenden“ muss
      die unbekannte Adresse ablehnen, ohne eine Entscheidung zu ändern.
- [ ] Danach **nur** diese beiden Adressen einfügen und anwenden:

  ```text
  user1@test.com
  user3@test.com
  ```

- [ ] Ergebnis: GreenHarbor und CareBridge „Bestanden“, SolarNest „Nicht
      bestanden“; Meldung `2 bestanden, 1 nicht bestanden`. Reload und
      Supabase Studio zeigen dieselben Werte.
- [ ] SolarNest einzeln auf „Bestanden“ und wieder auf „Nicht bestanden“
      setzen. Beide Änderungen bleiben nach einem Reload erhalten.
- [ ] Erst jetzt „Ergebnisse veröffentlichen“ bestätigen. Danach ist
      `phase_table.finished_evaluation` für `phase-1` gesetzt, die Runde
      abgeschlossen und die Entscheidung nicht mehr editierbar.
- [ ] Ein gescheitertes oder wirkungsloses Abschluss-Update darf keinen
      Erfolg melden. Für `phase-2` sind nun nur GreenHarbor und CareBridge
      teilnahmeberechtigt.

Diese Leseabfrage zeigt die Entscheidungen in Supabase Studio:

```sql
select u.email, o.outcome, o.review_date, p.finished_evaluation
from public.phase_outcome_table o
join public.phase_table p on p.phaseid = o.phase_id
join auth.users u on u.id = o.user_id
where p.phasename = 'phase-1'
order by u.email;
```

Die Portaltexte folgen der **aktuell datierten Runde**. Da die Termine der
lokalen Testkonfiguration für 2026 bereits abgelaufen sind, sehen bestandene
Teams nach Abschluss von Runde 1 den Bewertungstext von Runde 2. Nicht
bestandene Teams sehen den Ablehnungstext von Runde 1. Der direkte Wechsel
von `evaluating.md` zu `passed.md`/`failed.md` lässt sich für Runde 2 prüfen,
wenn deren Entscheidungen veröffentlicht werden.

## Automatische Prüfungen

Im Verzeichnis `frontend`: `npm run test:scripts`, `npm run lint`,
`npm run format`, `npx tsc --noEmit` und `npm run build`. Die Tests prüfen
Matching, E-Mail-Vorlage, Konfigurationsimport und die Textauswahl nach dem
Phasenabschluss. Der [Matching-Vergleich](reviewer-matching-parity.md)
dokumentiert zusätzlich die Übereinstimmung mit dem früheren Skript.

Ein kompletter Neuanfang ist nur mit `npx supabase db reset --local` möglich;
das löscht die bisherigen **lokalen** Testdaten. Anschließend Phase und Texte
wie oben neu importieren.
