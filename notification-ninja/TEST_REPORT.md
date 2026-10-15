# Notification Ninja 1.1.0 – Prüfbericht

Geprüft am **15. Oktober 2026** in Chromium/Playwright mit Maus und Touch, Node.js 24 und Python 3. Das Spiel verwendet lokal gebündeltes Canvas 2D und prozedurales WebAudio.

## Ergebnisse

| Prüfung | Ergebnis |
| --- | --- |
| `npm test` | **80 bestanden**, 0 fehlgeschlagen, 0 übersprungen: 35 Ninja-, 20 MIND-MAZE- und 25 REBOOT-Tests |
| Spielbalance | Fünf Herzen, 4–4,6 Sekunden Flugzeit, größere Ziele und getrennte Bahnen; verpasste Ablenkungen kosten kein Herz; alte Drei-Herz-Spielstände bleiben gültig |
| Vollständige Kampagne | Training und alle vier Levels mit echten Mauswischern abgeschlossen; alle drei Kontexte in Master durchlaufen; Gaming und Schlaf bewusst beendet |
| UI-Integration | **10/10 Fälle bestanden**: Zeitlimit, einmalige Verlängerung, Schlaf-Bonus, Pause, Skins, Export/Reload, einmalige Münzen, alte Profile/Spielstände und blockierte oder korrupte Speicherung |
| Renderer | **35/35 native Prüfungen bestanden**, Desktop 1440×900, Smartphone 390×844 und Querformat 844×390; echte Schnitte, Hälften, Wischspur und dauerhafte Handlungshilfen |
| Zimmer und Bonuseffekte | **18/18 Prüfungen bestanden**; passende Gegenstände, echte Power-ups und Flow in allen drei Zimmern; Schlaf-Bonus animiert; beobachtete Effekte innerhalb der Grenzen |
| Oberfläche | Zusätzlich 1280×800, 390×844, 844×390 sowie schmale Ansichten geprüft; sichtbare Musiksteuerung, vollständig erreichbare Schlafentscheidung, Pause und native Touch-Wischer |
| WebAudio | Vor Nutzeraktion kein AudioContext; danach messbare Ausgabe. Lernen: Pizzicato, 100 BPM, Gaming: Marimba, 116 BPM, Schlaf: Spieluhr, 80 BPM. Alle 13 Cues, maximal 32 Stimmen, Pause/Mute/Dispose und Master-Kontexte geprüft |
| Offline und Download | **8/8 Prüfungen bestanden**: Einstieg aus Root, getrennte Worker, alte eigene Caches entfernt, fremde erhalten, Score nach Offline-Reload, echter ZIP-Download und entpackter Offline-Start |
| Paketierung | Zwei identische ZIP-Erstellungen; CRC und bytegleiche Laufzeitdateien geprüft |

Der vollständige Kampagnenlauf kam auf **63 geschnittene Ablenkungen, 67 durchgelassene hilfreiche Objekte, 19 Power-ups und 24 Flow-Aktivierungen**. Ergebnis: 32.300 Arcade-Punkte, Balance 100, fünf verbleibende Herzen und zwei bewusste Stopps. Highscore, 68 Münzen, Export und Reload wurden geprüft. Keine JavaScript-Fehler oder externen Spielanfragen. Dieser Lauf nutzte die neue Spiellogik; die zuletzt fertige Cartoon-Oberfläche wurde anschließend zusätzlich in den oben genannten nativen Layout- und Effektprüfungen geprüft.

Die fokussierten Integrationstests verwenden über echte `NinjaGame`-Aufrufe erzeugte Checkpoints; die Darstellungsprüfungen beschleunigen teilweise die Browser-Uhr. Beide ersetzen den separat ausgeführten vollständigen Kampagnenlauf mit regulär laufender Uhr und echten Eingaben nicht.

## Download

`downloads/Notification-Ninja-1.1.0.zip`: **44.641 Bytes**, sieben fertige Laufzeitdateien plus `START-HIER.txt` in einem vollständigen Spielordner.

SHA-256: `33255714300eef7ef2e494040cc421fe831bce3c64da71a1bb1531892f1e381e`

Der Browser-Download stimmt bytegenau mit dem Paket überein. Das entpackte Paket wurde über HTTP gestartet und anschließend mit Offline-Reload und Fortsetzen geprüft. Das frühere 1.0.0-Paket bleibt für bestehende Links erhalten.

## Prüfgrenzen und Nachweise

Direktes `file://`-Öffnen ist im verwalteten Cloud-Chromium gesperrt; ein erfolgreicher Doppelklick-Test wird nicht behauptet. Die Richtlinie wurde nicht umgangen. Dateispeicherung hängt vom Browser ab. Der direkte öffentliche HTTPS-Browsertest ist hier wegen des vorhandenen Proxy-CA-Vertrauens optional eingeschränkt. Zertifikatsprüfung und Browserrichtlinien bleiben aktiv; öffentliche Dateien werden separat über HTTPS mit regulärem Systemvertrauen verifiziert.

Ausführliche Berichte und Screenshots liegen außerhalb des Checkouts unter `/workspace/ninja-checks/v11/` (Kampagne, Integration, Offline, Regeltests), `/workspace/ninja-checks-v11/` (Renderer/Effekte), `/workspace/ninja-checks/cartoon-ui/` und `/workspace/ninja-checks/playful-audio-report.json`. Sie sind Prüfartefakte und keine Laufzeitabhängigkeiten. Es wurden keine Nutzertests mit Jugendlichen durchgeführt.
