# Admin-Testkonto und Open-Run-Wochenpodium

Die öffentliche Rangliste enthält ausschließlich ausdrücklich veröffentlichte,
servergeprüfte Open Runs regulärer Konten. Admin-Testkonten sind serverseitig
aus Rangliste und Wettbewerbsbelohnungen ausgeschlossen.

## Wochenpodium

Eine Wettbewerbswoche läuft von Montag 00:00 UTC bis zum nächsten Montag.
Ein Ergebnis muss in dieser Woche beendet und veröffentlicht werden. Später
veröffentlichte Ergebnisse bleiben in der Gesamtrangliste, verändern aber keine
abgeschlossene Wettbewerbswoche. Pro Konto zählt die beste Leistung.

Bei gleicher Punktzahl entscheidet die längere Laufzeit, danach die frühere
Veröffentlichung und schließlich die stabile Lauf-ID. Die drei Plätze vergeben
100, 60 und 30 Münzen. Die Abholung erfolgt ausdrücklich über `podium.claim`
mit der Montagskennung `YYYY-MM-DD` und einem Idempotenzschlüssel. Neue oder
wiederholte Schlüssel können eine bereits abgeholte Wochenbelohnung nicht
erneut auszahlen.

Die erste Anfrage nach dem Wochenwechsel friert das Podium transaktional ein.
Ein eigener kostenpflichtiger Scheduler ist nicht erforderlich. Die neue
Funktion beginnt mit der Woche ihrer Datenbankmigration; alte Ranglistenwerte
werden erhalten, lösen jedoch keine rückwirkenden Münzgeschenke aus. Das
Löschen eines Siegerkontos lässt keinen anderen Spieler nachträglich nachrücken.

`GET /api/v3/leaderboard?period=week` verwendet die vollständigen serverseitigen
Ergebnisse; die Wochenwertung wird nicht aus den geladenen globalen Top 100
gefiltert. Unterstützt werden `all`, `today` und `week`.

## Privates Admin-Testkonto

Die Rolle liegt in der separaten Tabelle `ninja_admin_accounts`. Registrierung,
Profil-JSON und lokale Spielstände können sie nicht setzen. Das Admin-Testkonto
hat einen serverseitig aufgefüllten Testbeutel mit einer Milliarde Münzen; die
Oberfläche zeigt unbegrenztes Testbudget. Jeder Kauf verwendet weiterhin die
echten Preise, Besitzprüfungen und Ledgertransaktionen. Spielfortschritt und
Missionen werden nicht pauschal freigeschaltet.

Für die einmalige Einrichtung auf dem bestehenden Server können private
Umgebungsvariablen gesetzt werden:

- `NINJA_ADMIN_BOOTSTRAP_USERNAME`
- `NINJA_ADMIN_BOOTSTRAP_PASSWORD`: zufälliges Passwort mit 20–128 Zeichen
- `NINJA_ADMIN_BOOTSTRAP_RECOVERY_KEY`: privat erzeugtes und sicher aufbewahrtes
  `NNR-` plus 43 Base64url-Zeichen. Ohne diese optionale Variable wird ein Code
  erzeugt, der beim Serverstart absichtlich nicht ausgegeben wird; für eine
  wiederherstellbare Einrichtung muss der Betreiber einen eigenen Code setzen.

Der Startpfad ruft `await bootstrapNinjaAdminFromEnv({store,auth,game})` vor dem
Annehmen von Anfragen auf. Name, Passwort und Wiederherstellungscode werden
privat im Render-Dashboard gesetzt; der bestehende kostenlose Dienst und die
bestehende Datenbank bleiben bestehen. Nach dem ersten erfolgreichen Deployment
und einer erfolgreichen Admin-Anmeldung werden alle drei Bootstrap-Variablen
wieder entfernt. Zugangsdaten bleiben ausschließlich im privaten Passwortmanager.
Ein bestehendes Admin-Testkonto bleibt unverändert; ein
gleichnamiges normales Konto wird niemals übernommen oder dessen Passwort
zurückgesetzt. Passwörter und Wiederherstellungscodes werden ausschließlich
gehasht gespeichert und dürfen nicht protokolliert oder eingecheckt werden.
Identität, Rolle und Testbudget werden in derselben Transaktion erstellt. Auch
gleichzeitige Starts erzeugen nur ein Konto und verändern dessen Zugangsdaten
nicht. Die Einrichtung erstellt keine aktive Sitzung.

Alternativ richtet der Betreiber lokal ein neues Konto ein:

```bash
node scripts/provision_ninja_admin.mjs --username NinjaTeamAdmin \
  --database-path /private/path/ninja.sqlite \
  --output /private/path/ninja-admin-access.json
```

Für PostgreSQL muss der Betreiber `DATABASE_URL` privat bereitstellen und
zusätzlich `--postgres` angeben. Die Zugangsdaten-Datei wird mit Modus 0600 und
ausschließlich außerhalb des Checkouts neu angelegt. Sie wird nicht überschrieben.
Die Datei wird vor der Kontotransaktion dauerhaft geschrieben. Falls eine
Datenbankanfrage anschließend fehlschlägt, bleibt sie zur sicheren Überprüfung
erhalten, weil ein Verbindungsabbruch nach einem Commit möglich ist.
Die reguläre MFA-Einrichtung und einmalige Wiederherstellungscodes bleiben auch
für das Admin-Testkonto verfügbar.
