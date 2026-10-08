# Notification Ninja

Ein deutschsprachiges Arcade-Spiel über digitale Ablenkung: Schneide störende Benachrichtigungen mit deiner Ninja-Klinge und lass hilfreiche Signale passieren. Ob eine Nachricht sinnvoll ist, hängt von deiner aktuellen Aufgabe ab. Derselbe Gaming-Clip kann beim Lernen ablenken und während der eingeplanten Gaming-Zeit passen.

**[Im Browser spielen](https://brukevfh.github.io/REBOOT-Digital-Balance/notification-ninja/)** · **[Vollständiges Spiel herunterladen](downloads/Notification-Ninja-1.0.0.zip)**

## Spielen

Öffne das Spiel in einem aktuellen Browser mit JavaScript. Für den Download die **gesamte ZIP-Datei entpacken** und anschließend `index.html` öffnen. Alle Laufzeitdateien gehören zum Paket; eine Engine-Installation oder ein Account ist nicht erforderlich. Falls dein Browser lokale Dateien einschränkt, kannst du den entpackten Ordner über einen lokalen HTTP-Server öffnen.

Die Online-Version speichert ihre Laufzeitdateien nach dem vollständigen ersten Laden für spätere Offline-Aufrufe. Die Musik ist anfangs ausgeschaltet und lässt sich über den Sound-Schalter aktivieren. Musik und Effekte entstehen direkt im Browser, ohne externe Audiodateien.

## Dein digitaler Tag

Nach dem Tutorial durchläufst du vier Spielphasen. Die Zeitfenster bilden einen **komprimierten Tagesablauf** ab:

| Phase | Regel und Spielzeit |
| --- | --- |
| Study | Während des 75-Sekunden-Lernfensters Ablenkungen schneiden und relevante Lernsignale durchlassen |
| Gaming | Vorher ein Limit von 45, 60 oder 90 Sekunden wählen; anschließend bewusst aufhören oder weiterspielen |
| Sleep | Während des 75-Sekunden-Fensters zur Ruhe kommen; nach acht Sekunden kannst du die Phase bewusst beenden oder weiter auf Bonusjagd gehen |
| Master | 90 Sekunden mit wechselnden Kontexten und dichteren Wellen im Finale; die Bedeutung derselben Nachricht kann sich ändern |

Du startest mit **drei Leben**. Verwechslungen unterbrechen deine Combo. Fünf richtige Entscheidungen in Folge aktivieren für fünf Sekunden den **Flow-Modus**. Power-ups verleihen Zeitlupe, Schildschutz oder einen Punktemultiplikator. Hohe Punktzahlen bringen Münzen für freischaltbare Skins; Highscores, Münzen und Skins bleiben lokal gespeichert.

Alle Benachrichtigungen, Boni und Münzen sind Spielsimulationen. Es gibt keine echten Käufe oder Gewinne. Das Spiel vermittelt Aufmerksamkeitsauswahl, Kontextbewusstsein und selbst gewählte Grenzen bei digitalen Medien.

## Steuerung

- **Maus:** Taste gedrückt halten und mit der Klinge über Nachrichten ziehen.
- **Touch:** Mit einem Finger über die Spielfläche wischen.
- Hilfreiche Nachrichten unberührt passieren lassen.
- Die Pause-, Sound- und Entscheidungstasten direkt in der Oberfläche bedienen.

Ein Schnitt folgt deiner tatsächlichen Wischbewegung. Im Tutorial lernst du den Unterschied zwischen Ablenkung und hilfreichem Signal.

## Daten und Offline-Nutzung

Es gibt keinen Account, keine API-Anbindung und keine Übertragung von Spielständen oder Telemetrie. Fortschritt und Einstellungen liegen in **localStorage**. Wenn dein Browser die Speicherung blockiert, bleibt das Spiel für die laufende Sitzung spielbar. Das Löschen der Website-Daten entfernt den lokalen Fortschritt.

Online-Version, lokale HTTP-Version und direkt geöffnete Dateien können getrennte Speicherplätze verwenden. Die lokale Dateinutzung kann von den Browser-Einstellungen abhängen.

## Entwicklung

Voraussetzungen: **Node.js ab Version 20**, npm und **Python 3**. Im Repository-Root ausführen:

```sh
npm ci
npm run build:ninja
npm run test:ninja
npm run package:ninja
npm run serve
```

Danach `http://localhost:8000/notification-ninja/` öffnen. `build:ninja` erstellt das fertige JavaScript-Bundle in `notification-ninja/dist/`. `package:ninja` erzeugt das vollständige ZIP und seine SHA-256-Prüfsumme in `notification-ninja/downloads/`. Nach Änderungen neu bauen und paketieren; bei Änderungen an gecachten Dateien auch die Service-Worker-Cache-Version aktualisieren.

Die fertigen Laufzeitdateien sind versioniert. GitHub Pages veröffentlicht sie aus `main` → `/(root)`; dafür wird kein npm-Schritt auf dem Server benötigt. Die bisherigen Spiele [MIND MAZE](../mind-maze/README.md) und [REBOOT Neon Balance](../README.md) bleiben separat erhalten.

Das [Ablaufdiagramm und die Beispielplanung](PLAN.md) beschreiben Spielablauf, technische Systeme und mögliche weitere Iterationen.

## Projektstruktur

```text
notification-ninja/
├── index.html, styles.css     # Startmenü, HUD und Dialoge
├── src/game.js               # Regeln, Kontextwechsel und Spielstände
├── src/renderer.js           # Canvas-Grafik, Schnitte und Effekte
├── src/audio.js              # Lokaler WebAudio-Soundtrack
├── src/main.js               # Maus, Touch und Bildschirmablauf
├── dist/                     # Fertiges JavaScript-Bundle
├── downloads/                # Vollständiges ZIP und Prüfsumme
├── sw.js                     # Offline-Cache für diesen Spielpfad
└── PLAN.md, TEST_REPORT.md    # Ablauf, Beispielplanung und Prüfbericht
```

Build- und Paketierungswerkzeuge liegen unter `../scripts/`, die Regeltests unter `../tests/ninja.test.mjs`. Der [Prüfbericht](TEST_REPORT.md) nennt die ausgeführten Tests und ihre Grenzen.
