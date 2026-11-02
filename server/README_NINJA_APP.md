# Notification Ninja: integrierter Dienst v3

Dieser Dienst ergänzt die bestehende App, ohne die historische `ninja-leaderboard.mjs`-Demo oder deren Daten zu ersetzen. Er ist lokal vollständig startbar; ein dauerhaftes öffentliches Account-Hosting wurde noch nicht eingerichtet.

## Lokal

Node 24 benötigt keine zusätzlichen Serverpakete:

```bash
npm ci
npm run build:ninja
npm run serve:ninja
```

Frontend: http://127.0.0.1:8083/notification-ninja/home.html
API: http://127.0.0.1:8083/api/v3/health
DB: `server/data/ninja.sqlite` wird automatisch erstellt. Dieselbe `DATA_DIR` nach Neustart weiterverwenden. Tests nutzen eigene temporäre Datenbanken und greifen nicht auf echte Nutzerkonten zu.

Account-Anmeldung: Pseudonym, Passwort (10–128 Zeichen), einmaliger Wiederherstellungscode; kein SMTP und keine E-Mail. Der Code wird nur bei Erstellung/Ersetzung angezeigt und auf dem Server gehasht. Sessiondauer standardmäßig zwölf Stunden, maximal fünf Sitzungen. Reset widerruft frühere Sitzungen und rotiert den Wiederherstellungscode. Logout widerruft das aktuelle Token; Löschen braucht Passwortbestätigung und kaskadiert zu Profil, Wallet, Logs und Rangliste.

## Öffentlicher Betrieb: exakt fehlende Einrichtung

GitHub Pages führt keine Node-Prozesse aus. Die bestehende Render-Free-Demo hat flüchtigen Speicher und erfüllt die dauerhafte Kontenspeicherung nicht. Es wurde kein kostenpflichtiger Datenträger aktiviert. Für den neuen Dienst fehlen:

1. Ein tatsächlich verfügbarer Node24-/Docker-Host mit einem **dauerhaften Mount**, dessen Datei auch Neustart und Deployment überlebt. Nicht `/tmp`, nicht das flüchtige Containerdateisystem. Lokale Tests beweisen nur lokale Persistenz, keine Eigenschaften eines noch nicht bereitgestellten Hosts.
2. Eine eigene HTTPS-Adresse und ein kontrollierter TLS-Reverse-Proxy. Der Backendport ist ausschließlich für diesen Proxy zugänglich. Der Proxy überschreibt `X-Forwarded-Proto` mit `https` und setzt/ergänzt `X-Forwarded-For` mit der tatsächlichen Client-IP. Der Dienst verwendet bei explizitem TRUST_PROXY ausschließlich die letzte validierte Adresse. Niemals ungeprüfte Client-Header unverändert durchreichen; direkter Backendzugriff bleibt gesperrt.
3. Dienst mit `DATA_DIR=/data`, `NODE_ENV=production`, `DURABLE_STORAGE=1`, `TRUST_PROXY=1`, `HOST=0.0.0.0`, `PORT=8083` und `ALLOWED_ORIGINS=https://brukevfh.github.io` starten. `DURABLE_STORAGE=1` ist die Betreiberbestätigung des vorhandenen Mounts, keine automatische Bereitstellung. Produktion verweigert Start ohne DATA_DIR/Bestätigung und bei `/tmp`.
4. `GET https://ECHTER-HOST/api/v3/health` prüfen. Danach in `notification-ninja/accounts-config.json` `enabled:true`, `apiVersion:3`, `endpoint:"https://ECHTER-HOST/api/v3"` eintragen und veröffentlichen. `ECHTER-HOST` ist nur erklärender Platzhalter und darf nicht unverändert gespeichert werden.
5. Auf der tatsächlichen HTTPS-Seite zwei Testkonten registrieren, jeweils echte Open-Runs ausdrücklich veröffentlichen, gemeinsame Plätze prüfen, Dienst neu starten und Persistenz bestätigen. Ohne diesen Nachweis bleibt Onlinebetrieb ungeprüft.

Der integrierte Dienst selbst liefert `/notification-ninja/accounts-config.json` dynamisch mit aktiviertem gleichursprünglichem Endpunkt. Der statische Gastdownload und GitHub Pages bleiben standardmäßig deaktiviert. Geheimnisse gehören nie in diese Konfigurationsdatei.

### Docker

Nach dem lokalen Build aus dem Repository-Root:

```bash
docker build -f server/Dockerfile.ninja-app -t notification-ninja-app .
docker run --name notification-ninja-app --restart unless-stopped \
  -p 127.0.0.1:8083:8083 \
  --mount type=volume,source=notification-ninja-data,target=/data \
  -e DURABLE_STORAGE=1 -e TRUST_PROXY=1 \
  -e ALLOWED_ORIGINS=https://brukevfh.github.io \
  notification-ninja-app
```

Der native Dienst kann ohne Docker mit denselben Variablen betrieben werden. Das hier beschriebene Image wurde nur dann als gebaut/geprüft gemeldet, wenn der Prüfbericht das ausdrücklich nennt. Bei Bind-Mounts muss der `node`-Benutzer Schreibrechte besitzen. Datenbank-Datei und WAL/SHM nicht in Git oder im öffentlich ausgelieferten Ordner ablegen.

Beispiel Caddy hinter eigenem Hostnamen:

```caddyfile
ninja.example.org {
    reverse_proxy 127.0.0.1:8083 {
        header_up X-Forwarded-Proto https
    }
}
```

`ninja.example.org` ist ein Platzhalter. Die Vorlage bestellt keinen Domainnamen oder Hostingtarif.

## API

Alle Kontomutationen verwenden `Authorization: Bearer <opaqueToken>`. Keine Tokens in URLs, keine impliziten Auth-Cookies. `Content-Type: application/json` für JSON-Bodies. Auth-/Action-Bodies höchstens 32 KiB, Replaylogs höchstens 2 MiB. Exakte Origin-Freigaben, Ratenlimits, Parameterprüfung und neutrale Fehler ergänzen den Zugriffsschutz.

| Methode | `/api/v3`-Pfad | Funktion |
|---|---|---|
| GET | `/health` | Bereitschaft und Speicher-Konfiguration |
| POST | `/auth/register`, `/auth/login`, `/auth/reset` | Konto/Sitzung/Wiederherstellung |
| POST | `/auth/logout` | Sitzung widerrufen |
| GET | `/me` | Eigenes autoritatives Profil |
| PATCH | `/profile` | Eigenen Pseudonym ändern |
| DELETE | `/account` | Eigenes Konto mit Passwortbestätigung löschen |
| POST | `/actions` | Wallet-/Ausrüstungs-/Belohnungsaktionen mit Idempotenzschlüssel |
| POST | `/runs/start` | Konto- und seedgebundenen Run starten |
| POST | `/runs/:id/finish` | Begrenztes Eingabeprotokoll serverseitig erneut simulieren |
| POST | `/runs/:id/publish` | Zulässigen Run ausdrücklich veröffentlichen |
| GET | `/leaderboard` | Beste geprüfte veröffentlichte Open-Runs |

Server startet selbst seedgebundene Modelle. Empfangene Punktzahlen oder lokale Walletstände werden nicht als Wahrheit übernommen. Zeit, Koordinaten, Methoden, Ownership und Umfang von Replaylogs werden begrenzt; derselbe Abschluss wird einmal gutgeschrieben. Ein Replay ist kein vollständiger Schutz gegen Bots. Offline-Gastruns werden nicht rückwirkend als verifiziert markiert. Ein während einer Accountpause getätigter Kauf wird beim Abschluss nicht von einem älteren Snapshot überschrieben.

## Persistenz, Sicherung und Migration

SQLite aktiviert Foreign Keys, WAL, FULL-Synchronisierung und Busy-Timeout. Zu Runs bleiben Startsnapshot, Metadaten, Hash des zur Prüfung übertragenen Protokolls und das geprüfte Ergebnis gespeichert; die rohe Koordinatenfolge wird serverseitig nur zur Replay-Prüfung verarbeitet. Auth- und Gameplay-Migrationstabellen versionieren Schemaänderungen. Wallet-Constraint verhindert negatives Guthaben, Fremdschlüssel sorgen für Kontolöschung. Konfigurationen bleiben im zentralen Spielkatalog statt Kopien widersprüchlicher Preise.

Vor einem Produktivupdate ein konsistentes SQLite-Backup erstellen (SQLite-Backup-API/`.backup` oder Dienst stoppen und vollständige Datei sichern); eine einzelne offene WAL-Datenbankdatei blind zu kopieren kann unvollständig sein. Backup und DB nicht öffentlich ablegen. Bestehende inkompatible Tabellen werden nicht gelöscht. Die bisherige v2-Demo wird nicht als v3-Accountdatenbank importiert. Lokale Gastmünzen und Freischaltungen bleiben separat unverified; nur sichere Einführungsdaten können einmalig übernommen werden.

Tests: `node --test tests/ninja-auth.test.mjs tests/ninja-service.test.mjs tests/ninja-server-game.test.mjs`. Details und echte Ergebnisse stehen in [TEST_REPORT](../notification-ninja/TEST_REPORT.md).
