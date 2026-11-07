# Notification Ninja Ultimate – Render + Neon online schalten

**Status:** Die Anwendung enthält bereits eine PostgreSQL-fähige Konto-API. Die öffentliche GitHub-Pages-Konfiguration bleibt bis zum echten Live-Test absichtlich deaktiviert. Dieser Ablauf verändert **nicht** die ältere Rangliste und löscht keine Konten.

## 0. Zugangsdaten schützen

Wenn Render- oder Neon-API-Schlüssel in einem Chat oder anderen Text gepostet wurden, **sofort im jeweiligen Dashboard widerrufen/rotieren**. Danach ausschließlich die neuen Werte in den sicheren Einstellungen des Anbieters verwenden. Niemals in GitHub-Dateien, Tickets, Screenshots oder Browser-JavaScript speichern.

**Wichtig:** `RENDER_API_KEY` und `NEON_API_KEY` sind Verwaltungs-API-Schlüssel. Die Browseranwendung benötigt **keinen** davon. Das Render-Backend benötigt stattdessen eine geheime `DATABASE_URL` mit einer gültigen PostgreSQL-Verbindungsadresse aus Neon.

## 1. Neon vorbereiten

1. Im Neon-Dashboard ein PostgreSQL-Projekt und einen passenden Free-Tarif auswählen oder ein bestehendes Projekt weiterverwenden.
2. Die tatsächliche **PostgreSQL connection string** aus Neon kopieren (nicht den Neon-API-Schlüssel). Die Adresse beginnt typischerweise mit `postgresql://`; Benutzer, Passwort und Host sind geheim.
3. Vor einer produktiven Migration einen geeigneten Wiederherstellungspunkt/Backup einrichten. Bestehende SQLite-Konten werden **nicht** automatisch nach Neon übertragen.

## 2. Separaten Render-Accountdienst bereitstellen

1. In Render das bestehende GitHub-Repository `BruKevFH/REBOOT-Digital-Balance` und die vorhandene `render.yaml` verwenden.
2. Den bereits definierten separaten Webdienst **`notification-ninja-accounts`** auswählen. Den historischen Dienst `notification-ninja-ranking` nicht löschen oder überschreiben.
3. Prüfen, ob der tatsächliche Tarif **free** ist. Keine kostenpflichtige Disk hinzufügen.
4. Beim Accountdienst in **Environment** die geheime Variable `DATABASE_URL` auf die Neon-Verbindungsadresse setzen. Niemals die Provider-API-Schlüssel dort als Datenbankadresse einsetzen.
5. Bereits im Blueprint vorgesehene Werte: `NODE_ENV=production`, `TRUST_PROXY=1`, `REQUIRE_HTTPS=1`, `ALLOWED_ORIGINS=https://brukevfh.github.io`, `HOST=0.0.0.0`, `PORT=8083`.
6. Deploy starten und **die tatsächlich zugewiesene HTTPS-Adresse** des neuen Accountdiensts kopieren. Automatische Account-Deployments sind im Blueprint zunächst aus.

## 3. Read-only Live-Preflight ausführen

Lokal mit Node.js >=24 im Repository:

```sh
npm ci
npm run verify:ninja:deployment -- https://DEIN-TATSAECHLICHER-ACCOUNTDIENST.onrender.com
```

Den Platzhalter durch die **wirklich angezeigte** Render-Adresse ersetzen, nicht unverändert eingeben.

Die Prüfung führt ausschließlich lesende Anfragen aus und verifiziert:
- `/api/v3/health`: v3, PostgreSQL, persistenter Speicher und passendes Open-Run-Regelwerk
- GitHub-Pages-CORS
- Vom Backend gemeldete Account-Konfiguration
- Echte v3-Ranglisten-API (ohne Einträge zu erfinden)
- CORS-Preflight für die Registrierung

Bei einem Fehler ist die öffentliche Freischaltung **nicht zulässig**. **Ein grüner Preflight ist notwendig, aber allein noch kein vollständiger Persistenz- oder Gameplay-Test.** Der Check erstellt keine Testaccounts und verändert keine Daten.

## 4. Persistenz und zwei Benutzer wirklich testen

Auf der eigenen HTTPS-Adresse des **Accountdienstes** (`/notification-ninja/home.html`) zwei eindeutig bezeichnete temporäre Konten anlegen:

1. Beide anmelden; Profil, Münzen, XP, Inventar und Spielstand über Neuladen prüfen.
2. Unterschiedliche Open Runs absolvieren und ausdrücklich veröffentlichen. Von einem zweiten Gerät/privaten Browser aus die gemeinsame v3-Rangliste kontrollieren.
3. Render-Dienst neu starten. Beide Konten neu anmelden und kontrollieren, dass die Spielstände und Ranglisteneinträge aus Neon erhalten geblieben sind.
4. Konten und eventuelle Testeinträge ordentlich löschen; darauf achten, dass die gelöschten Spieler aus der Rangliste verschwinden.

Erst danach die öffentliche Freischaltung vornehmen.

## 5. GitHub Pages einschalten

Datei `notification-ninja/accounts-config.json` ändern. **Nur** die verifizierte Adresse des **Accountdienstes** einsetzen:

```json
{
  "enabled": true,
  "apiVersion": 3,
  "endpoint": "https://DEIN-TATSAECHLICHER-ACCOUNTDIENST.onrender.com/api/v3"
}
```

Die Adresse ist öffentlich und enthält **keine** Zugangsdaten. Vorher `enabled:false` beibehalten.

```sh
npm run build:ninja
npm run test:ninja
git add notification-ninja/accounts-config.json
git commit -m "Enable verified Notification Ninja accounts"
git push origin main
```

Danach GitHub Actions/Pages-Deployment abwarten und die Anmeldung von `https://brukevfh.github.io/REBOOT-Digital-Balance/notification-ninja/home.html` gegen Render + Neon nochmals prüfen.

## 6. Was noch offen bleibt

- Kein Render- oder Neon-Projekt wird durch diese Anleitung automatisch erstellt.
- Keine produktive Cloud-Verbindung gilt ohne reale HTTP- und Persistenztests als nachgewiesen.
- **Neon-API-Key allein reicht nicht:** Für die laufende Anwendung ist die **Neon-PostgreSQL-`DATABASE_URL`** erforderlich.
- Im Free-Tarif können Render-Kaltstarts, Pausen oder Kontingentgrenzen auftreten.
- Vor einer öffentlichen Registrierung müssen korrekte Betreiber-, Kontakt- und Datenschutzinformationen hinterlegt sein.
