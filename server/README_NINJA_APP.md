# Notification Ninja: Account-Dienst v3


**Neu:** [Sichere Render/Neon-Einrichtung und Live-Verifizierung](NINJA_ULTIMATE_CLOUD_SETUP.md). Vor dem Umschalten von `accounts-config.json` den reinen Lese-Check `npm run verify:ninja:deployment -- https://DEIN-RENDER-ACCOUNTDIENST.onrender.com` ausführen und anschließend die dort beschriebenen echten Zwei-Konten-/Neustart-Tests durchführen.

Der Dienst unterstützt **PostgreSQL für öffentliches Hosting** und weiterhin **SQLite lokal**. Der historische Ranglistenserver und vorhandene Gastspielstände bleiben erhalten. Gastguthaben wird nicht als verifiziertes Kontoguthaben importiert.

**Live-Status vom 07.11.2026:** Die öffentliche Account-Konfiguration bleibt deaktiviert. In dieser Umgebung fehlen `RENDER_API_KEY` und `NEON_API_KEY`; die Netzwerkpolicy verweigerte Render, Neon und die Homepage mit CONNECT 403. Das beweist keinen Ausfall des entfernten Servers. Es wurden keine kostenpflichtigen Ressourcen bestellt. Lokale Tests ersetzen keine öffentliche Abnahme.

## Lokal mit SQLite

Node.js >=24 und Python 3:

```sh
npm ci
npm run build:ninja
npm test
DATA_DIR=./server/data npm run serve:ninja
```

Frontend: `http://127.0.0.1:8083/notification-ninja/home.html`, Health: `/api/v3/health`. Dieselbe Datenbank nach Neustart weiterverwenden. Schemaänderungen erhalten vorhandene Konten. Produktion mit SQLite verlangt weiterhin einen tatsächlich dauerhaften Datenordner und `DURABLE_STORAGE=1`.

## PostgreSQL / Neon

`DATABASE_URL` ausschließlich als geheime Laufzeitvariable injizieren und danach `npm run serve:ninja` starten. Niemals die Verbindungsadresse ins Repository, öffentliche Frontend oder Logs schreiben. Ist die Variable gesetzt, nutzt der Dienst PostgreSQL; sonst SQLite.

Entfernte PostgreSQL-Verbindungen prüfen TLS-Zertifikat und Hostname; URL-Parameter dürfen diese Prüfung nicht abschalten. Nur für lokale Loopback-Testdatenbanken ist unverschlüsselter Betrieb vorgesehen. Migrationen laufen atomar unter einer PostgreSQL-Advisory-Sperre. SERIALIZABLE-Transaktionen mit begrenzten Wiederholungen, Profil-/Wallet-Sperren, Constraints und Idempotenzschlüssel schützen Käufe und Belohnungen. Spielmodell und Replay-Prüfung sind für beide Datenbanken identisch.

Es gibt **keinen automatischen Import fremder oder historischer SQLite-Dateien nach Neon**. Für Bestandskonten wäre zuerst ein konsistentes Backup und ein separat geprüfter Import nötig. Lokale SQLite-Daten werden nicht gelöscht.

## Render Free + Neon Free

`render.yaml` behält `notification-ninja-ranking` und ergänzt einen **separaten** `notification-ninja-accounts` mit `plan: free`. Automatische Account-Deployments sind ausgeschaltet; es wird kein kostenpflichtiger Datenträger angefordert.

1. Ein Neon-Projekt im **Free-Plan** auswählen/erstellen; vor Bestätigung den Plan prüfen. Keine automatische Bezahlumstellung aktivieren. Region möglichst nahe Render Frankfurt.
2. Die PostgreSQL-Verbindungsadresse sicher als Render-Variable `DATABASE_URL` setzen. Verwaltungs-API-Schlüssel gehören nicht in die Spielanwendung.
3. Den separaten Free-Dienst aus `server/Dockerfile.ninja-app` bereitstellen: `NODE_ENV=production`, `HOST=0.0.0.0`, `PORT=8083`, `TRUST_PROXY=1`, `REQUIRE_HTTPS=1`, `ALLOWED_ORIGINS=https://brukevfh.github.io`. Bei PostgreSQL sind weder SQLite-Mount noch `DURABLE_STORAGE=1` erforderlich.
4. Der kontrollierte TLS-Proxy muss `X-Forwarded-Proto` selbst setzen und die tatsächliche Client-IP an `X-Forwarded-For` anhängen/überschreiben. Direkter Backendzugriff bleibt gesperrt.
5. Über echtes HTTPS zwei getrennte Testkonten prüfen: Registrierung, Login, Profile, erspielte Belohnungen, Inventar/Käufe, ausdrücklich veröffentlichte Open Runs und exaktes CORS. Render-Dienst neu starten; Daten aus Neon erneut prüfen. Danach beide Testkonten löschen und verschwundene Ranglisteneinträge nachweisen.
6. **Erst danach** `notification-ninja/accounts-config.json` mit tatsächlich geprüfter HTTPS-Adresse und `enabled:true` veröffentlichen. Weder Platzhalter noch alten Ranglistenendpunkt als Account-Backend einsetzen.

Free-Server können schlafen und Kaltstarts benötigen; Kontingente sind begrenzt. Ob der Anbieter-Account kostenlose Ressourcen erlaubt, muss mit echten Zugangsdaten geprüft werden. Ohne diese wird keine erfolgreiche Bereitstellung behauptet.

## Konten und Datenschutz

Neue öffentliche Registrierungen verlangen Ninja-Name, E-Mail, Passwort, Passwortbestätigung und ausdrückliche Datenschutz-Zustimmung. Bestehende Konten bleiben per Namen anmeldbar. Neue Konten erlauben zusätzlich E-Mail-Login. Gesalzenes scrypt schützt Passwörter; zufällige Bearer-Tokens werden nur gehasht gespeichert. E-Mail und Zustimmung erscheinen nicht in Ranglisten.

**Kein E-Mail-Versand, keine Prüfung der E-Mail-Inhaberschaft und kein E-Mail-Passwortreset sind eingerichtet.** Wiederherstellung nutzt den einmaligen Code; dieser wird nur bei Erstellung/Rotation angezeigt und gehasht gespeichert. Reset widerruft Sitzungen. Kontolöschung verlangt das Passwort und entfernt Profil, Wallet, Logs, Runs, Sitzungen und Ranglisteneinträge kaskadierend. Ein öffentlicher Betreiber muss tatsächliche Verantwortliche und Datenschutzinformationen vor Aktivierung hinterlegen.

## API und Sicherheit

Alle Routen unter `/api/v3`:

| Methode | Pfad | Funktion |
|---|---|---|
| GET | `/health` | Bereitschaft |
| POST | `/auth/register`, `/auth/login`, `/auth/reset` | Konto, Sitzung, Wiederherstellung |
| POST | `/auth/logout` | Sitzung widerrufen |
| GET | `/me` | Autoritatives Profil |
| PATCH | `/profile` | Eigenen Namen ändern |
| DELETE | `/account` | Bestätigte Kontolöschung |
| POST | `/actions` | Idempotente Käufe, Ausrüstung, Claims, Einstellungen |
| POST | `/runs/start` | Servergebundenen Run starten |
| POST | `/runs/:id/finish` | Eingaben nachspielen und gutschreiben |
| POST | `/runs/:id/publish` | Open Run ausdrücklich veröffentlichen |
| GET | `/leaderboard` | Bestes veröffentlichtes Ergebnis je Konto |

Keine Tokens in URLs, kein Auth-Cookie als implizite Berechtigung. JSON-, Größen-, Raten-, Origin- und Replay-Grenzen bleiben aktiv. Der Server bestimmt Preise, Startprofil, Seed und Belohnungen. Client-Scores und lokale Walletstände werden nicht übernommen. Replay-Prüfung ist kein vollständiger Schutz gegen Bots.

## Reproduzierbare Abnahme

```sh
npm test
# TEST_DATABASE_URL nur auf eine eigene isolierte Testdatenbank setzen.
node --test tests/ninja-postgres*.test.mjs tests/ninja-http-persistence.test.mjs
npm run build:ninja
npm run test:ninja:browser
```

Ohne `TEST_DATABASE_URL` werden PostgreSQL-Integrationstests ausdrücklich übersprungen. Die Tests erstellen und entfernen eigene zufällige Schemata. `tests/ninja-http-persistence.test.mjs` registriert zwei Konten über HTTP, spielt echte Open Runs nach, prüft Idempotenz/Veröffentlichung, startet den Anwendungsserver mit derselben DB neu und löscht beide Konten. Das beweist lokale Anwendungsneustarts, keinen nicht ausgeführten Render-Neustart.

Vor Produktivmigrationen ein konsistentes Backup bzw. geeigneten Neon-Wiederherstellungspunkt anlegen. Geheimnisse und personenbezogene Daten gehören nicht in Testberichte.
