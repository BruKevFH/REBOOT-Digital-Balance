# Notification Ninja 1.6.0 – Prüfbericht

Geprüft am **15. Oktober 2026** mit Node.js 24, Python 3 und Chromium/Playwright. Native Spielprüfungen verwenden Maus-/Touch-Eingaben und ausschließlich lesende Laufzeitdiagnosen. Komponentenprüfungen sind gesondert ausgewiesen.

## Aktuelle Ergebnisse

| Prüfung | Ergebnis |
| --- | --- |
| Build und Tests | Aktueller Ninja-Build erfolgreich; **183 Tests bestanden**, 0 fehlgeschlagen, 0 übersprungen. REBOOT, MIND MAZE, Ninja-Regeln, Fortschritt, Profile, Sitzungen, echte Würfe und Ranglistendienst |
| HUD-Komponente | Zehn isolierte Layoutfälle: 1880×817, 1280×800, 844×390, 390×844 und 320×568 jeweils normal und im Vollbild. Große Herzen, eigene Herz-Zone, rechte Seiteninfos, keine untere Leiste, kein Dokument-Scroll |
| HUD im laufenden Spiel | **Zehn native Ansichten** über dieselben fünf Größen: fünf sichtbare große Herzen, keine Überschneidung mit Steuerung, Seiteninfos außerhalb der tatsächlichen Spielfläche, Arena bis unten. Normale Arenen 1728×723, 1128×706, 736×310, 314×734 und 244×458 Pixel. Echte Maus-/Touch-Wischer geben Punkte; falsche Schnitte ziehen sichtbar ein Herz ab. Pause friert die Zeit ein; Vollbild verlassen hält das Spiel aktiv. Keine JavaScript-Fehler |
| Super und Schlaf-Stopp | **Sechs native Aktionsfälle** über 320×568, 844×390 und 1280×800: regulär geladene Super rechts wirklich aktiviert, bewusster Schlaf-Stopp per Touch ausgeführt. Mindestens 44-Pixel-Tasten. Nach Kürzung auf „Nacht beenden“ erneut geprüft, vollständiger zugänglicher Name und Tooltip erhalten |
| Öffentlicher Ranglistenserver | Reguläres HTTPS zu `https://notification-ninja-ranking.onrender.com`: Health 200, Open-Run-Rangliste in drei Schwierigkeiten 200, genaue CORS-Freigabe für `https://brukevfh.github.io`, POST-/DELETE-Preflight 204 |
| Öffentlicher Ranglisten-Lebenszyklus | Zwei ausdrücklich benannte Testprofile, vier durch reguläre Spielmethoden erspielte und durch null Herzen beendete Open Runs. Gemeinsame Plätze, persönliche Bestleistung, getrennte Schwierigkeiten, eigene Platzierung und idempotente Veröffentlichung geprüft. Danach beide Testprofile samt Ergebnissen gelöscht und Abwesenheit auf allen drei Boards bestätigt. Tokens ausschließlich im Arbeitsspeicher, keine erfundenen dauerhaften Mitspieler |
| Offline und Download | **Acht aktuelle Prüfgruppen bestanden**: Root-Einstieg, getrennte Worker-Scopes, eigener alter 1.5-Cache gelöscht und fremde Caches erhalten, echter Schnitt und Offline-Reload, aktivierte Ranglisten-Konfiguration bytegleich im Cache, Browser-ZIP mit identischer Prüfsumme, entpacktes HTTP-Spiel und Offline-Fortsetzen. Keine JavaScript-Fehler, kein automatisches Senden von Ergebnissen |

Die Seitenleiste wird bei wenig Höhe separat scrollbar; Super und Schlaf-Stopp stehen vor den Zusatzinfos. Auf 320 Pixel Breite bleiben 244 Pixel echte Spielfläche. Verlorene Herzen bleiben als leere Symbole sichtbar; Zähler, zugänglicher Name und kurzes Trefferfeedback ergänzen die 26–30 Pixel großen Herzbilder. Die Spielregeln und Flugbahnen wurden durch das Layout nicht geändert.

Testprofile und laufende Aktions-Fixtures entstehen mit regulären Spielmethoden. Das reichere Profil stammt aus 60 abgeschlossenen Study-Runden mit regulären Käufen. Keine Diagnose-Mutatoren oder vergebenen Testmünzen im laufenden Browser. Der vollständige native Open Run wurde zuletzt in 1.5 mit 117,43 aktiven Sekunden, 65 Wischern und 135 echten Würfen geprüft; die 24 Modell-/Rendererfälle mit 613 Handkontakten ebenfalls in 1.5. Die 16 Profil-/Navigationsgruppen und Mentorprüfungen stammen aus 1.4; die endliche Vier-Raum-Kampagne wurde zuletzt in 1.2 vollständig nativ durchgespielt. Diese Durchläufe werden nicht als neue 1.6-Tests gezählt. Automatisierte Prüfungen decken ihre Regeln weiterhin ab.

## Download

`downloads/Notification-Ninja-1.6.0.zip`: **115.191 Bytes**, acht Laufzeitdateien einschließlich aktivierter `leaderboard-config.json` plus `START-HIER.txt`.

SHA-256: `940fbac6cb62ae316edcae568982ecf5faaab2d4f034991893b4834d913856e4`

Zweimal identische Paketierung, CRC, acht bytegleiche Laufzeitdateien und tatsächlicher Browserdownload geprüft. Ältere ZIPs bleiben verfügbar.

## Ranglisten-Betrieb und Grenzen

Die gemeinsame Rangliste ist jetzt mit **https://notification-ninja-ranking.onrender.com** verbunden. Sie zählt nur ausdrücklich veröffentlichte Open Runs und trennt die Schwierigkeiten. Lokale Profile brauchen weiterhin kein Passwortkonto und funktionieren ohne Server. Der öffentliche Dienst wurde über die vom Nutzer im eigenen Render-Konto gestartete Blueprint-Einrichtung bereitgestellt; die tatsächliche HTTPS-Adresse wurde anschließend im Spiel konfiguriert und geprüft.

**Render Free speichert diese Demo-Rangliste nicht dauerhaft.** Die lokale SQLite-Datei geht bei Einschlafen, Neustart oder Deployment verloren. Nach einer Pause kann der Dienst ungefähr eine Minute zum Starten brauchen; bei einer vorübergehenden Fehlermeldung warten und die Rangliste erneut öffnen. Das Spiel verwendet einen achtsekündigen Anfrage-Timeout und überträgt fehlgeschlagene Ergebnisse nicht automatisch. Lokale Münzen, XP, Freischaltungen und Rekorde bleiben erhalten. Für dauerhaft gemeinsame Scores ist dauerhafter Server-Speicher nötig. Kein kostenpflichtiger Datenträger oder Bezahlplan wurde eingerichtet.

Die API prüft Grenzen, Besitzer-Token und doppelte Run-IDs; clientseitige Ergebnisse sind nicht manipulationssicher. Profile bleiben lokal, ohne Passwortkonto oder Gerätesynchronisation. Namen und Ergebnisse werden erst nach ausdrücklichem Veröffentlichen übertragen. Der öffentliche CORS-Ursprung ist exakt `https://brukevfh.github.io`; eine auf localhost oder aus Dateien geöffnete Kopie kann mit ihrer abweichenden Herkunft nicht an diese öffentliche Rangliste senden. Für lokale API-Tests eine eigene Instanz nach [server/README_NINJA.md](../server/README_NINJA.md) verwenden.

Mobile Prüfungen verwenden Chromium mit Touch-/Viewport-Emulation, kein physisches iPhone mit Safari. Fehlende Vollbild-API wird gezielt emuliert; dann bleibt die Browserleiste möglicherweise sichtbar. Direktes `file://`-Öffnen ist im verwalteten Cloud-Chromium gesperrt, ein Doppelklick-Test wird nicht behauptet. Browserrichtlinien und TLS-Prüfungen bleiben aktiv. Öffentliche Dateien und API werden mit regulärem HTTPS-Systemvertrauen geprüft.

Berichte und Screenshots: `/workspace/ninja-checks/v16/`, insbesondere `hud-isolated.json`, `hud-game-report.json`, `hud-actions-report.json`, `render-readiness.json`, `render-lifecycle.json` und `offline.json`. Frühere Prüfungen unter `/workspace/ninja-checks/v15/` und `/workspace/ninja-checks/v14/`. Externe Prüfartefakte sind keine Spielabhängigkeiten. Keine Tests mit jugendlichen Testpersonen durchgeführt.
