# REBOOT — Neon Balance

Ein deutschsprachiges 3D-Abenteuer über Fokus, Gaming, Social Media und Freundschaften. Erkunde den Neon Campus aus der First-Person-Perspektive, triff deine Crew und entwickle im MedTech-Lab ein fiktives FocusBand. Deine Entscheidungen bestimmen deinen Tagesablauf und deine Balance im Spiel.

**[Direkt im Browser spielen](https://brukevfh.github.io/REBOOT-Digital-Balance/)** · **[Spiel als ZIP herunterladen](downloads/REBOOT-Neon-Balance-1.0.0.zip)**

## Spielen

Online genügt ein aktueller Chrome, Edge oder Firefox mit JavaScript und WebGL 2. Für den Download:

1. `REBOOT-Neon-Balance-1.0.0.zip` herunterladen.
2. Die **gesamte ZIP-Datei entpacken**.
3. Im entpackten Ordner **`index.html` öffnen**.

Das ZIP enthält das vollständige Browserspiel mit allen benötigten Dateien. Es lässt sich offline öffnen; Installation, Unreal Engine und ein lokaler Server sind dafür nicht erforderlich. Hardwarebeschleunigung im Browser muss verfügbar sein. `START-HIER.txt` im Download enthält die Kurzanleitung.

## Spielinhalte

- **Story:** 21 Spieltage mit sechs Stationen pro Tag und einer fortlaufenden Geschichte.
- **Daily Challenge:** ein kompakter Run über drei Spieltage.
- **Endless Mode:** ohne festes Tageslimit spielen und den Campus weiter erkunden.
- Vier NPCs: **Mia, Leon, Sami und Nora**, mit Dialogen und Beziehungen.
- Vier Minigames: **Focus Rush**, **Notification Shield**, **Signal Calibration** und **Memory Pulse**.
- Fünf freischaltbare FocusBand-Module im **MedTech-Lab**.
- XP, Chips, Achievements, Run-Historie und JSON-Export.
- Lokale Spielstände, Touch-Steuerung und ein Download für die Offline-Nutzung.

Energy, Focus, Mood, Balance und Social sind vereinfachte Spielwerte. Das FocusBand ist eine Simulation; das Spiel erhebt keine Gesundheitsdaten und stellt keine Diagnosen. Lernkarten und fachliche Quellen sind über „Wissen & Quellen“ erreichbar.

## Steuerung

| Taste / Eingabe | Aktion |
| --- | --- |
| `W A S D` | Bewegen |
| `Shift` | Sprinten |
| Maus | Umschauen; ins Spiel klicken, um die Maus zu aktivieren |
| `E` | Am markierten Ort mit einem NPC sprechen |
| `1`, `2`, `3` | Dialogentscheidung oder Memory-Feld wählen |
| `Space` | Aktion im Minigame |
| `Esc` | Pause / Dialog schließen |
| `Tab` | MedTech-Lab öffnen |
| `F5` | Spielstand als JSON exportieren |

Auf Touch-Geräten gibt es Bewegungstasten und eine Aktionstaste. Ziehen auf der Spielwelt verändert die Blickrichtung.

## Daten und Spielstände

Die 3D-Version benötigt keinen Account, keine API und keine Zugangsdaten. Sie verwendet **localStorage** und überträgt keine Spielstände oder Telemetrie. Im Spiel kann der Fortschritt als JSON exportiert werden. Das Löschen der Website-Daten im Browser entfernt den lokalen Fortschritt.

Online-Version, localhost und direkt geöffnete Dateien können getrennte Speicherplätze verwenden. Browser-Einstellungen können das Speichern lokaler Dateien einschränken. Der Online-Service-Worker speichert die Laufzeitdateien nach dem ersten Laden für spätere Offline-Aufrufe.

## Entwicklung

Voraussetzungen: **Node.js ab Version 20**, npm und **Python 3**. Die festgelegten Paketversionen stehen in `package-lock.json`.

```sh
npm ci
npm run build
npm test
npm run package
npm run serve
```

Danach `http://localhost:8000` öffnen. `npm run build` bündelt JavaScript und Three.js mit esbuild nach `dist/reboot.js`. Die fertigen Laufzeitdateien in `dist/` sind versioniert: Zum Spielen oder Veröffentlichen ist kein npm-Installationsschritt nötig, und es werden keine Bibliotheken von einem CDN geladen.

`npm run package` erstellt `downloads/REBOOT-Neon-Balance-1.0.0.zip` und die zugehörige SHA-256-Datei. Nach Änderungen am Spiel zuerst neu bauen und das ZIP erneut erstellen. Bei Änderungen an gecachten Laufzeitdateien auch die Cache-Version in `sw.js` aktualisieren.

## Projektstruktur

```text
.
├── index.html                 # Einstiegspunkt für Browser und Download
├── styles.css                 # Startmenü, HUD, Dialoge und Touch-Steuerung
├── src/
│   ├── main.js                # Spielablauf, Eingaben und Oberfläche
│   ├── world.js               # 3D-Campus, Kamera und Kollisionen
│   ├── game.js                # Spielregeln und lokale Speicherung
│   └── content.js             # Geschichte, NPCs, Module und Lerninhalte
├── dist/                      # Fertige Laufzeitdateien einschließlich Three.js
├── downloads/                 # Offline-ZIP und SHA-256-Prüfsumme
├── scripts/                   # Build und Download-Paketierung
├── tests/                     # Automatisierte Prüfungen der Spielregeln
├── licenses/                  # MIT-Lizenz von Three.js
├── sw.js                      # Offline-Cache der Online-Version
├── manifest.webmanifest
├── legacy/                    # Erhaltene frühere 2D-Web-App
├── Unreal/REBOOT3D/            # Optionaler Unreal-Engine-Quellprototyp
├── server/                    # Historisches optionales Demo-Backend
└── DEPLOY.md                  # GitHub-Pages-Veröffentlichung
```

## Veröffentlichung und weitere Prototypen

GitHub Pages ist für **`main` → `/(root)`** eingerichtet. Es veröffentlicht die bereits gebauten Dateien im Repository unter **https://brukevfh.github.io/REBOOT-Digital-Balance/**. Alle Laufzeitpfade sind relativ. Die Schritte für Aktualisierungen stehen in [DEPLOY.md](DEPLOY.md).

Die frühere Web-App bleibt unter [legacy/](legacy/index.html) erhalten. Das [Unreal-Engine-5-Quellprojekt](Unreal/REBOOT3D/README.md) ist ein zusätzlicher Prototyp; es wurde hier weder in Unreal kompiliert noch als Windows-EXE gebaut. Die [Windows-Setup-Anleitung](Unreal/REBOOT3D/SETUP_WINDOWS.md) beschreibt dessen separate Voraussetzungen. Das historische [Demo-Backend](server/README_BACKEND.md) wird von der neuen 3D-Version nicht verwendet.
