# Notification Ninja 1.7.0 – Prüfbericht

Geprüft am **16. Oktober 2026** mit Node.js 24, Python 3 und Chromium/Playwright. PR #1 wurde übernommen und um Ränge, Tagesmissionen, Menü-Musik, Lernmomente sowie Combo-/Welteneffekte ergänzt. Native Spielprüfungen verwenden reale Maus-/Touch-Eingaben und ausschließlich lesende Laufzeitdiagnosen; Komponentenprüfungen sind gesondert ausgewiesen.

## Aktuelle Ergebnisse

| Prüfung | Ergebnis |
| --- | --- |
| Build und Tests | Aktueller Ninja-Build erfolgreich; **212 Tests bestanden**, 0 fehlgeschlagen, 0 übersprungen. Regeln, Fortschritt, Profile, Sitzungen, echte Würfe, Journey und Ranglisten-API |
| Langsamer Open Run | Genau drei Herzen, ein Standard-Regelsatz `open-v2`, interner Schlüssel `normal`. Anfangstempo 0,82×, erste Welle nach 1,4 s. Physische Flugtests in zwei Größen bestätigen über fünf Sekunden anfängliche Reaktionszeit. Weiter steigendes Tempo ohne Timerende, keine gekauften Passiven oder Supers |
| HUD im laufenden Spiel | Fünf Größen jeweils automatisch große/native Ansicht und anschließend Fensteransicht: 1880×817, 1280×800, 844×390, 390×844, 320×568. Arenen 1792×747, 1192×730, 780×328, 338×754, 268×478 Pixel. Auch ohne Vollbild dieselbe nutzbare Arena. Große Herzen, keine Überschneidung, echte Maus-/Touch-Schnitte und Herzabzug, Pause und sicheres Verlassen. Keine JavaScript-Fehler |
| Mobile Menübedienung | Beim Test gefundene Scrollsperre der voreingestellten großen Ansicht behoben. Hauptmenü nutzt wieder den Dokumentfluss; Tagesmissionen und Open-Run-Taste bleiben nach Scrollen erreichbar. Handyfälle und echte Belohnungsabholung erneut bestanden |
| Super | Eigene Bodentaste links. Drei native Größen prüfen Hinweis „SUPER BEREIT!“, fertigkeitsspezifisches 30-Pixel-SVG innerhalb der 58/62/74-Pixel-Taste und tatsächliche Aktivierung. Im Open Run und ohne ausgerüstete Super wird der Dock verborgen. Sechs zusätzliche Quellmodul-Prüfungen von Super und Schlaf-Stopp bestanden |
| Nativer langer Open Run | **171,96 aktive Sekunden**, 43 echte Wischer, Start mit drei Herzen bei etwa 0,8202×. Bis 132 Sekunden gespielt, danach ohne Schnitte durch drei verpasste Ablenkungen beendet. Tatsächliche Combo-Effekte bei 10/25/50, beste Entscheidungsserie 56; dynamische Kulisse ab 120 s. Münzen und Run-Abrechnung nach Reload erhalten, keine JavaScript-Fehler |
| Combo und dynamische Welt | Zwölf Kombinationen aus vier Größen und drei Rang-Skins; 60 Weltenstufen- und 36 Meilensteinprüfungen. Eigene Schriftrollen, Ninja-Gesten und Auren. Wolken/Tempel/Fensterlicht/Blüten nach 30/60/120/180 s. Exakte Handkontakte bleiben erhalten; Stress mit 500 Ereignissen begrenzt Effekte auf drei und Partikel auf 260. Reduzierte Bewegung zeigt statische Hinweise |
| Echte Würfe | Zwölf aktuelle Modell-/Rendererfälle: 613 exakte Handpositions- und 5.914 freigegebene Flugobjektprüfungen, 1/2/3-Ninja-Truppen und eingefrorene Pose bei Pause |
| Ränge und Tagesmissionen | 16 Modulprüfungen plus Core-Integration: fünf XP-Ränge, drei dauerhafte kosmetische Geschenke ohne automatischen Outfitwechsel, drei täglich wechselnde Aufgaben, höchstens neun ausdrücklich abzuholende Münzen. Datumwechsel, Reload, doppelte Gutschrift, Training und null Leistung geprüft. Vorhandene Münzen und Käufe erhalten |
| Belohnungen im Browser | Handy und Desktop: drei regulär abgeschlossene Study-Runden erfüllen heutige Aufgaben; echte Münzabholung, erneute Abholung gesperrt, Save/Reload. Abholbare Erfolgsbelohnungen stehen vor gesperrten Zielen und wandern nach Abholung unten in die Sammlung |
| Rang-Outfit im Browser | Das erspielte Morgenwind-Outfit tatsächlich in der Garderobe gewählt: unverändertes Guthaben, passendes Profilporträt, zwei werfende Morgenwind-Ninjas, `sunrise-fan`-Wurfstil, echter Touch-Schnitt und Auswahl nach Reload erhalten |
| Musik und NIM | Entspannte 72-BPM-Dojo-Musik nach tatsächlicher Eingabe im Hauptmenü. Zusätzlich WebAudio-Komponente mit messbarem Output, Mute/Pause/Hidden/Dispose und 32-Stimmen-Limit geprüft. Eigene Fanfaren für 10/25/50. Nativer Rundentest zeigt NIM-Lernmoment passend zur tatsächlich gespeicherten Lernzeit-Ablenkung |
| Ranglisten-API | 15 Tests: gemeinsamer Drei-Herz-Regelsatz, neue `/v2`-Run-/Listen-Endpunkte, zwei Spieler, Bestleistung, Idempotenz, eigene Löschung, CORS, Neustart, Free-Datenverlust und echte SQLite-Altschema-Migration. Bestehende Zeilen bleiben erhalten, erhalten `legacy` und erscheinen nicht in der neuen Wertung |
| Offline und Download | Acht aktuelle Gruppen bestanden: Root-/Ninja-Worker getrennt, eigener alter 1.6-Cache gelöscht, fremde Caches erhalten, echter Schnitt und Punkte offline gespeichert, bytegleicher Browserdownload, entpacktes HTTP-Spiel und Offline-Fortsetzen. Keine JavaScript-Fehler oder automatischen Score-Übertragungen |

Die Testprofile wurden über reguläre Spielmethoden erspielt. Das reichere Profil stammt aus 60 abgeschlossenen Study-Runden mit regulären Käufen; neue Browser-Fixtures ergänzen echte vollständige Runden und explizite Guide-Bestätigungen. Es gibt keine Diagnose-Mutatoren oder vergebenen Testmünzen im laufenden Browser.

## Download

`downloads/Notification-Ninja-1.7.0.zip`: **128.056 Bytes**, acht Laufzeitdateien plus `START-HIER.txt`.

SHA-256: `1e8a05033a81312605a22961822a2ff3696181a59b5ed3f69674ecd9dd1029d7`

Zweimal identische Paketierung, CRC, acht bytegleiche Laufzeitdateien und tatsächlicher Browserdownload geprüft. Ältere ZIPs bleiben verfügbar.

## Betrieb und Grenzen

Die gemeinsame Rangliste verwendet **https://notification-ninja-ranking.onrender.com**. Nur neue, ausdrücklich veröffentlichte `open-v2`-Runs zählen; alte Ergebnisse werden erhalten und aus der neuen Wertung ausgeschlossen. Bereits laufende alte Open-Runs bleiben fortsetzbar und heißen intern `legacy`; sie können nicht in die neue Rangliste gelangen. Lokale Rekorde und vorhandene Fortschritte bleiben erhalten. Eine Ranglisten-Übertragung ist freiwillig, kein Passwortkonto und keine Gerätesynchronisation.

**Render Free speichert die Demo-Rangliste nicht dauerhaft.** SQLite kann bei Einschlafen, Neustart oder Deployment verloren gehen. Der Start nach einer Pause kann ungefähr eine Minute dauern; das Frontend bricht eine einzelne Anfrage nach acht Sekunden ab. Bei vorübergehender Fehlermeldung warten und erneut öffnen. Kein automatisches Nachsenden fehlgeschlagener Ergebnisse. Für dauerhafte Scores ist dauerhafter Server-Speicher nötig. Kein Bezahlplan oder kostenpflichtiger Datenträger eingerichtet.

Die öffentliche API erlaubt als Browser-Herkunft exakt `https://brukevfh.github.io`. Lokale Downloads und localhost können dort wegen ihrer anderen Herkunft nicht veröffentlichen; für lokale Entwicklung eine eigene API verwenden. Das lokale Spiel funktioniert weiterhin offline. Die API prüft Plausibilität, Besitzer-Token und Run-IDs; clientseitige Ergebnisse sind nicht manipulationssicher. Lokale Datumseinstellungen bestimmen Tagesmissionen, ohne Anspruch auf eine manipulationssichere Spielökonomie.

Echtes Browser-Vollbild braucht eine Nutzeraktion. Beim Öffnen ist deshalb bereits die große Ansicht aktiv; passende Klicks fordern natives Vollbild an. Fehlt die API oder lehnt der Browser ab, bleibt die größere Ansicht mit möglicher Browserleiste nutzbar. Mobile Prüfungen sind Chromium-Touch-/Viewport-Emulation, kein physisches iPhone mit Safari. Browserrichtlinien und TLS-Prüfungen bleiben aktiv; direktes `file://`-Öffnen wurde im verwalteten Cloud-Chromium nicht getestet. Öffentliche HTTPS-Prüfungen verwenden reguläres Systemvertrauen.

Die vollständige endliche Vier-Raum-Kampagne wurde zuletzt in 1.2 nativ durchgespielt; die großen Profil-/Mentorprüfungen stammen aus 1.4. Sie werden nicht als neue 1.7-Durchläufe gezählt. Die automatisierten Spielregeln und aktuellen Super-/Schlaf-Stopp-Aktionen werden weiter geprüft.

Externe Berichte/Screenshots: `/workspace/ninja-checks/v17/`, insbesondere `qa17-hud-report.json`, `qa17-super-report.json`, `open-native.json`, `journey-ui-report.json`, `qa17-rank-wardrobe-report.json`, `qa17-menu-lesson-report.json`, `arcade-renderer-report.json`, `renderer-model-report.json`, `audio-report.json` und `offline.json`. Keine Spielabhängigkeiten; keine Tests mit jugendlichen Testpersonen durchgeführt.
