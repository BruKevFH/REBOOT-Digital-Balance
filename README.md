# REBOOT – Digital Balance

REBOOT ist ein deutschsprachiges Serious Game für Jugendliche von 13 bis 16 Jahren. Du triffst Entscheidungen über Schule, Gaming, Social Media, Schlaf und Freundschaften und entwickelst mit deinem Team einen fiktiven MedTech-Prototypen. Die Auswirkungen auf Energy, Focus, Mood, Balance und Social sind vereinfachte Spielmechanik, keine medizinischen Messwerte.

Die Web-App läuft vollständig im Browser. Es gibt keine Installation, kein Framework und keinen Build-Schritt.

## Spielen und lokal starten

Die vorgesehene GitHub-Pages-Adresse lautet:

**https://brukevfh.github.io/REBOOT-Digital-Balance/**

Für die lokale Entwicklung brauchst du Python 3. Starte im Repository-Root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Öffne danach `http://localhost:8000`. Ein moderner Browser mit JavaScript genügt. Der Webserver ermöglicht auch Service Worker und Offline-Cache; beim direkten Öffnen einer Datei stehen diese Funktionen nicht zur Verfügung.

## Spielinhalte

- Landingpage mit Konzept, Lernkarten und Quellen
- 21-Tage-Story, Endless Balance und dreitägige Daily Challenge
- NPCs Mia, Leon, Sami und Nora mit Beziehungen und Entscheidungen
- Vier Minigames: Focus Rush, Notification Shield, Signal Calibration und Memory Pulse
- FocusBand-Lab mit fünf freischaltbaren MedTech-Modulen
- XP, Chips, Achievements, Run-Historie und JSON-Export
- Lokale Speicherung in IndexedDB, mit localStorage als Fallback
- Service Worker für Offline-Nutzung nach dem ersten vollständigen Online-Aufruf

Beim Pausieren eines Minigames wird es beim Fortsetzen neu gestartet. Ein aktiver Run lässt sich durch Neuladen derselben `#game`-Adresse fortsetzen. Ein neuer Run über den Hub beginnt von vorn.

## Projektstruktur

```text
.
├── index.html                 # Einstiegspunkt direkt im Root
├── app.js                     # Spiel, Navigation und lokale Datenhaltung
├── styles.css                 # Responsive Darstellung
├── sw.js                      # Projektbezogener Offline-Cache
├── manifest.webmanifest       # Web-App-Metadaten
├── favicon.svg
├── 404.html                   # Fehlerseite für statisches Hosting
├── .nojekyll                  # Statische Dateien ohne Jekyll veröffentlichen
├── DEPLOY.md                  # GitHub-Pages-Anleitung
├── TEST_REPORT.txt            # Ergebnisse der aktuellen Prüfungen
└── server/
    ├── server.mjs             # Optionales Node-/SQLite-Demonstrationsbackend
    ├── start-windows.bat
    └── README_BACKEND.md
```

## GitHub Pages

Veröffentlicht wird der Branch `main` aus `/(root)`. `index.html` und alle statischen Assets liegen direkt im Root; relative Pfade und Hash-Navigation funktionieren auch unter `/REBOOT-Digital-Balance/`. Das optionale Backend wird auf GitHub Pages nicht ausgeführt. Die statische App speichert ausschließlich lokal und benötigt keine API oder Zugangsdaten.

Falls Pages noch nicht aktiviert ist: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main → Folder: /(root) → Save**. Details stehen in [DEPLOY.md](DEPLOY.md).

## Entwicklung und Prüfungen

Die JavaScript-Dateien lassen sich mit Node.js auf Syntaxfehler prüfen:

```sh
node --check app.js
node --check sw.js
node --check server/server.mjs
```

Für einen Funktionstest öffne den Hub, starte einen Story-Run, triff eine Entscheidung und lade die Seite neu. Prüfe außerdem Daily Challenge, Lab, JSON-Export und die Mobilansicht. Offline-Nutzung setzt einen erfolgreichen ersten Online-Aufruf und einen aktivierten Service Worker voraus. Die tatsächlich ausgeführten automatisierten Browsertests sind in [TEST_REPORT.txt](TEST_REPORT.txt) dokumentiert.

Bei Änderungen an gecachten Assets auch die Cache-Version in `sw.js` erhöhen. Eine neue Service-Worker-Version wird nach dem Schließen alter Tabs aktiv. Der Cache ist auf den jeweiligen Projektpfad begrenzt.

## Optionales Backend

Node.js 24 kann das zusätzliche SQLite-Backend ohne npm-Pakete starten:

```sh
node server/server.mjs
```

Es ist ein lokales Lehrveranstaltungs-Demo und wird für das Spiel nicht benötigt. Nur die vom Backend ausgelieferte Seite aktiviert dessen Telemetrie. Für Datenverzeichnis, Forschungszugriff und Reverse-Proxy-Betrieb siehe [server/README_BACKEND.md](server/README_BACKEND.md). SQLite-Dateien und lokale Umgebungsdateien werden nicht versioniert.

## Daten und fachliche Einordnung

Die statische App überträgt keine Spieldaten an einen Server. Profile, Entscheidungen und Runs bleiben im Browser des jeweiligen Geräts und können als JSON exportiert werden. Zum Löschen verwende die Website-Daten-Einstellungen deines Browsers; dabei wird der lokale Fortschritt entfernt. Der optionale lokale Server kann pseudonyme Spieldaten zusätzlich in SQLite speichern, wenn du ihn ausdrücklich verwendest.

REBOOT benötigt keine echten Gesundheitsdaten und diagnostiziert weder Schlafstörungen noch psychische Erkrankungen oder Gaming Disorder. Fachliche Quellen von WHO und CDC sind im Bereich „Wissen“ verlinkt.
