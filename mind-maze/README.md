# MIND MAZE – Escape the Distraction

Ein deutschsprachiges 3D-Puzzle-Abenteuer: Du bist in einer digitalen Anlage gefangen, entschlüsselst ihre Räume und suchst einen Ausgang. Das Störsystem **AURA** lockt mit Nachrichten, scheinbaren Belohnungen und künstlichem Zeitdruck. Du entscheidest, welches Signal zu deiner Aufgabe gehört.

**[Im Browser spielen](https://brukevfh.github.io/REBOOT-Digital-Balance/mind-maze/)** · **[Vollständiges Spiel als ZIP herunterladen](downloads/MIND-MAZE-1.0.0.zip)**

## Spielen

Benötigt wird ein aktueller Chrome, Edge oder Firefox mit JavaScript und **WebGL 2** sowie verfügbarer Hardwarebeschleunigung. Die 3D-Welt, Oberflächen und Bibliotheken sind im Spiel enthalten; es lädt keine Laufzeitbibliotheken von einem CDN.

Für den Download:

1. `MIND-MAZE-1.0.0.zip` herunterladen.
2. Die **gesamte ZIP-Datei entpacken**.
3. Im entpackten Ordner `index.html` öffnen. `START-HIER.txt` enthält die Kurzanleitung.

Das ZIP enthält das vollständige Browserspiel. Eine Engine-Installation ist zum Spielen nicht nötig. Falls dein Browser lokale Dateien einschränkt, lässt sich der entpackte Ordner über einen lokalen HTTP-Server öffnen. Die Online-Version speichert ihre Laufzeitdateien per Service Worker: Nach dem vollständigen ersten Laden sind spätere Aufrufe auch offline möglich.

Dies ist ein **Three.js-Browserspiel** und kein Unreal-Engine-Projekt oder natives Windows-Programm.

## Räume und Spielmechaniken

Sechs Haupträume stellen unterschiedliche Aufgaben:

| Raum | Aufgabe |
| --- | --- |
| Echo-Schleuse | Eine Lichtfolge merken und wiedergeben |
| Signalarchiv | Relevante Nachrichten von Lockangeboten unterscheiden |
| Energieknoten | Eine Schaltung nach mehreren Bedingungen lösen |
| Impulsbrücke | Eine Spur lesen, Bodenplatten tatsächlich betreten und Fallen vermeiden |
| Taktlabor | Aufgaben nach ihren Abhängigkeiten ordnen |
| Ausgangskern | Hinweise zusammensetzen und den geöffneten Ausgang erreichen |

Nach dem Energieknoten kannst du einen **versteckten Stillraum** entdecken. Er ermöglicht einen zweiten Fluchtweg. Die benötigten Ausgangswörter findest du in den Raumhinweisen und deinem Journal.

AURA passt die Art und Häufigkeit seiner Meldungen an deine Reaktionen sowie die Spielwerte Fokus und Stress an. Neben Täuschungen gibt es nützliche Wartungs- und Pausensignale. Alle Meldungen und Countdown-Anzeigen gehören zur Simulation; es gibt keine echten Gewinne, Käufe oder verpflichtenden Zeitlimits.

Gelöste Räume geben Credits für Werkzeuge, Ladungen und Upgrades:

| Werkzeug | Nutzen |
| --- | --- |
| Fokus-Scanner | Zeigt Raumhinweise und hilft beim Erkennen von Impulsfeldern; verbessert Fokus und Stress |
| Impulsschild | Schützt beim Brückendurchgang und erlaubt eine alternative Strecke; das Upgrade fängt zusätzlich einen Täuschungsklick ab |
| Ein-Aufgaben-Planer | Zeigt die Abhängigkeiten im Taktlabor; die zweite Stufe ermöglicht eine alternative Lösung |
| Analoger Bypass | Öffnet den Energieknoten über einen alternativen Lösungsweg |

Die Lerninhalte behandeln Aufmerksamkeit, Arbeitsgedächtnis, Wechselkosten beim Multitasking und bewusste Pausen. Fokus und Stress sind vereinfachte Spielwerte, keine Gesundheitsmessungen.

## Steuerung

| Eingabe | Aktion |
| --- | --- |
| `W A S D` oder Pfeiltasten | Figur bewegen |
| Klick oder Tap auf den Boden | Bewegungsziel setzen |
| `E` oder Klick auf ein nahes Objekt | Hinweis lesen, Terminal bedienen oder Portal betreten |
| `1`, `2`, `3`, `4` | Symbole im Gedächtnisrätsel auswählen |
| `Enter` | Rätsellösung prüfen |
| `Esc` | Pause / zurück zum Spiel |
| `J` | Raumkarte und Journal öffnen |
| `T` | Werkzeuge öffnen |

Auf Touch-Geräten erscheinen Bewegungstasten und eine Aktionstaste. Datenkristalle liefern Hinweise, Terminals prüfen Lösungen, Portale führen weiter. Ein geöffnetes Portal musst du mit deiner Figur erreichen.

## Spielstände und Offline-Nutzung

Fortschritt und Position werden lokal in **localStorage** gespeichert. Es gibt keinen Account, keine API-Anbindung und keine Übertragung von Spielständen oder Telemetrie. Im Abschlussbildschirm lässt sich der Spielverlauf als JSON exportieren.

Online-Version, lokale HTTP-Version und direkt geöffnete Dateien können getrennte Speicherplätze verwenden. Das Löschen der Website-Daten entfernt den lokalen Fortschritt. Wenn ein Browser die Speicherung blockiert, bleibt das Spiel in der laufenden Sitzung spielbar.

## Entwicklung

Voraussetzungen: **Node.js ab Version 20**, npm und **Python 3**. Befehle im Repository-Root ausführen:

```sh
npm ci
npm run build:maze
npm run test:maze
npm run package:maze
npm run serve
```

Danach `http://localhost:8000/mind-maze/` öffnen. `build:maze` bündelt den Quellcode einschließlich Three.js nach `mind-maze/dist/maze.js`. `package:maze` erstellt das vollständige ZIP und seine SHA-256-Prüfsumme in `mind-maze/downloads/`. Nach Änderungen neu bauen und paketieren; bei Änderungen an gecachten Dateien auch die Cache-Version in `mind-maze/sw.js` aktualisieren.

`npm test` prüft die Spielregeln von MIND MAZE und REBOOT Neon Balance. Die bisherigen Befehle `npm run build` und `npm run package` gehören weiterhin zu Neon Balance. Die gebauten Laufzeitdateien sind versioniert, sodass GitHub Pages keinen Installations- oder Build-Schritt benötigt.

## Projektstruktur

```text
mind-maze/
├── index.html                 # Einstiegspunkt
├── styles.css                 # Menü, HUD, Rätsel und Touch-Steuerung
├── src/
│   ├── game.js                # Räume, Spielregeln und Speicherung
│   ├── world.js               # 3D-Anlage, Bewegung und Kollisionen
│   └── main.js                # Ablauf, Eingaben und Oberfläche
├── dist/                      # Fertiges Spiel einschließlich Three.js
├── downloads/                 # Vollständiges ZIP und SHA-256-Prüfsumme
├── licenses/                  # MIT-Lizenz von Three.js
├── sw.js                      # Offline-Cache
├── manifest.webmanifest
└── favicon.svg
scripts/build_maze.mjs          # Build im Repository-Root
scripts/package_maze.py         # ZIP-Paketierung im Repository-Root
tests/maze.test.mjs             # Prüfungen der Spielregeln
```

GitHub Pages veröffentlicht den `main`-Branch aus `/(root)`. MIND MAZE liegt dabei unter `/REBOOT-Digital-Balance/mind-maze/`; seine Laufzeitpfade sind relativ. Das bisherige [REBOOT Neon Balance](../README.md) bleibt separat spielbar.
