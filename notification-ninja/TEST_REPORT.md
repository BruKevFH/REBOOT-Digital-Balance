# Notification Ninja – Prüfbericht

Geprüft am **8. Oktober 2026** in Chromium/Playwright mit echten Maus- und Touch-Eingaben, Node.js 24 und Python 3. Die Laufzeit verwendet Canvas 2D und WebAudio; alle erforderlichen Dateien sind lokal gebündelt.

## Ergebnisse

| Prüfung | Ergebnis |
| --- | --- |
| `npm test` | **75 bestanden**, 0 fehlgeschlagen, 0 übersprungen: 30 Ninja-, 20 MIND-MAZE- und 25 REBOOT-Tests |
| Finale Erstellung | `npm run build:ninja` erfolgreich; fertiges Bundle und Build-Metadaten vorhanden |
| Vollständiger Kampagnendurchlauf | Tutorial und alle vier Levels über native Mauswischer abgeschlossen; hilfreiche Inhalte durchgelassen, Gaming- und Schlafentscheidung bewusst beendet |
| Entscheidungen und Speicherung | Acht Browserfälle bestanden: Zeitlimit, einmalige Verlängerung, Schlaf-Bonus, frühes Aufhören, Highscores, Skin-Kauf, Export/Reload und eingeschränkte Speicherung |
| Darstellung und Eingaben | 26 Renderer-Prüfungen bestanden; Desktop 1440×900, Smartphone 390×844 und Querformat 844×390; echte Schnitte, auseinanderfliegende Hälften, Funken und Wischspur |
| Kontextabhängige Inhalte | Fünf Inhalte mit wechselnder Bewertung behalten Farbe und Symbol; Flow, Durchlassen und Power-ups in den jeweiligen Kontexten geprüft |
| Bildschirmablauf | Startmenü, Pause, Skins und Schlafentscheidungen auf Desktop, Hoch- und Querformat erreichbar; echte Touch-Wischer, kein horizontaler Überlauf |
| WebAudio | Vor Freigabe kein AudioContext; nach Nutzeraktion messbare Ausgabe, alle Musikstile und neun Effekt-Cues; maximal 32 Stimmen, Pause und Stummschaltung geprüft |
| Master-Finale | Alter Kartenbestand wird vor dem Kontextwechsel geleert; danach 17 beobachtete Wellen mit durchschnittlich **0,7781 Sekunden** Abstand; unverändertes 90-Sekunden-Limit |
| Offline und Download | Acht Prüfungen bestanden: Einstieg über Root-Link, getrennte Worker-Scopes, fremde Caches erhalten, alter eigener Cache entfernt, Offline-Reload mit Score, ZIP-Download, entpackter Offline-Start, keine JavaScript-Fehler |
| Reproduzierbare ZIP | Zweimal identische SHA-256-Prüfsumme; CRC und bytegleiche Laufzeitdateien geprüft |

Der vollständige native Kampagnenlauf erreichte 141 geschnittene Ablenkungen, 84 durchgelassene sinnvolle Inhalte, 21 Power-ups und zwei bewusste Stopps. Dabei traten keine JavaScript-Fehler oder externen Spielanfragen auf. Zwei Fehlentscheidungen wurden von einem Schild abgefangen.

Dieser vollständige Lauf erfolgte vor der letzten Erhöhung der Master-Spawnrate. Die Änderung wurde anschließend durch zwei zusätzliche Regeltests und einen gezielten nativen Browserlauf der letzten 15 Sekunden geprüft. Dessen Checkpoint entstand durch echte `NinjaGame.start/update/swipe/pause/save`-Aufrufe, ohne erfundene Spielstandfelder. Danach liefen ausschließlich reale Browserwischer; der Abschnitt endete mit drei Herzen und ohne Browser- oder Request-Fehler. Checkpoint-Prüfungen ersetzen den separat ausgeführten vollständigen Kampagnenlauf nicht.

## Download-Identität

`downloads/Notification-Ninja-1.0.0.zip` enthält sieben fertige Laufzeitdateien plus `START-HIER.txt` in einem vollständigen Spielordner. Größe: **43.750 Bytes**.

```text
SHA-256: 0a5cdd96e151584d928db373c18c41b4ac36507c4feab6c62992093d372c35e4
```

Die im Browser heruntergeladene Datei entspricht bytegenau dem erzeugten Paket. Das entpackte Paket wurde über HTTP und anschließend per Offline-Reload gespielt.

## Prüfgrenzen und Nachweise

Direktes `file://`-Öffnen ist im verwalteten Cloud-Chromium durch `ERR_BLOCKED_BY_ADMINISTRATOR` gesperrt. Ein erfolgreicher Doppelklick-Test wird deshalb nicht behauptet. Die Richtlinie wurde nicht umgangen. Lokale Dateien können auch auf Nutzergeräten abhängig von Browserregeln getrennte oder eingeschränkte Speicherung erhalten.

Der direkte öffentliche HTTPS-Browsertest ist in dieser Cloud wegen des vorhandenen Proxy-CA-Vertrauens optional eingeschränkt. Zertifikatsprüfung und Browserrichtlinien bleiben aktiv. Lokale Browserfunktion und öffentliche Auslieferung werden getrennt geprüft; die öffentliche Datei-Verifikation verwendet den regulären Systemvertrauensspeicher.

Die ausführlichen Browserberichte, Testprogramme und Screenshots dieses Laufs liegen außerhalb des Repositories unter `/workspace/ninja-checks/`, insbesondere `full-run.json`, `integration-results.json`, `renderer-native-report.json`, `renderer-context-report.json`, `master-finale-results.json`, `audio-report.json`, `offline.json` und `ui/`. Sie sind Prüfartefakte und keine Laufzeitabhängigkeiten. Es wurden keine Nutzertests mit Jugendlichen durchgeführt.
