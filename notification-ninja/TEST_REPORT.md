# Notification Ninja 1.7.2 – Prüfbericht

Geprüft am **16. Oktober 2026** mit Node.js24, Python3 und Chromium/Playwright. Der Homepage-Entwurf wurde mit den vollständigen 1.7-Spielsystemen zusammengeführt. Native Browserprüfungen verwenden tatsächliche Maus-/Touch-Eingaben und ausschließlich lesende Laufzeitdiagnosen.

## Aktuelle Ergebnisse

| Prüfung | Ergebnis |
| --- | --- |
| Build und Tests | **214 Tests bestanden**, 0 fehlgeschlagen, 0 übersprungen. Alle zuvor entfernten 1.7-Regelprüfungen wiederhergestellt; zwei gezielte neue Inbox-Prüfungen. Aktuelles Bundle erfolgreich gebaut |
| Einzelne Mitteilung | `markNotificationRead(id)` prüft kanonische vorhandene IDs, markiert ausschließlich den gewählten Eintrag und speichert einmal. Wiederholung idempotent, ungültige/gefälschte IDs ohne Mutation. Münzen, offene Erfolgsbelohnungen, Freischaltungen und Run bleiben erhalten |
| Inbox im Browser | Desktop1280×800 und Handy390×844: „Ansehen“ öffnet die passende Sammlung, entfernt genau eine Nachricht und senkt den Zähler um eins. Andere Einträge bleiben ungelesen. Zurückgehen und Reload bestätigen dauerhafte Änderung; Sammelaktion funktioniert weiterhin, leere Inbox zeigt Bestätigung |
| Homepage im Browser | Fünf Größen:1880×817,1280×800,844×390,390×844,320×568. Eigene Seite ohne Spielengine, große mindestens44px hohe Spiel-Schaltfläche, keine horizontalen Überläufe. Tatsächlicher Weg Homepage→Spiel→Homepage geprüft |
| Profil und pausierter Run | Homepage-Link meldet nicht ab. Native Prüfung erhält Name, ausgewähltes Outfit, Münzen, abgeholte Belohnungen und gesehene Mitteilungen. Tatsächlicher Run mit Fehlentscheidung bleibt mit Punktestand/Run-ID pausiert und nach Rückkehr fortsetzbar |
| Größere Anzeige | Fünf Größen jeweils normal und Vollbild: Seitenleiste112/100/68/84px, große Herzen ohne Steuerungsüberschneidung. Arenen1768×747,1168×730,760×328,322×754,252×478px. Echte Maus-/Touch-Schnitte geben Punkte, falsche Schnitte ziehen Herzen ab; Pause und Vollbild-Ausgang funktionieren |
| Größere Super | Drei Größen: tatsächliche Aktivierung mit gespeicherter regulär geladener Super; Bereitschaftshinweis, sichtbarer Fähigkeitsname und34–40px Bild vollständig innerhalb der90/80/72px Taste. Rechte Infos und Spielfeld bleiben getrennt |
| Ruhiger Dojo | Vier Komponentenfälle mit echten Core-Fehlern:80 Pause-,80 Home- und80 Ergebnisframes ohne Kameraabweichung. Alle temporären Effekte beim Verlassen der Runde gelöscht. Zusätzlich nativer Fehlerschnitt→Dojo mit24 stabilen Frames und unveränderten Header-Koordinaten. Trefferwackeln bleibt während aktiver Runden erhalten |
| Erhaltene Grafikfunktionen | Zwölf Rang-/Viewportfälle,60 Weltenstufen und36 Combo-Meilensteine, reduzierte Bewegung. Zwölf Core-/Rendererfälle mit613 Handpositions- und5.914 freigegebenen Flugobjektprüfungen. Rang-Outfits, 10/25/50-Feiern und dynamische Kulissen bleiben erhalten |
| Tatsächliche Ranglistenoberfläche | Zwei unabhängige Browser mit neuer gebündelter1.7.2-Spielversion und lokalem echtem Node-/SQLite-Dienst: regulär erspielte neue Drei-Herz-Runs ausdrücklich veröffentlicht, gemeinsame v2-Liste/Bestwert/Reihenfolge geprüft, eigene Online-Identitäten über Profil-Löschen entfernt. Keine öffentlichen Testdaten übertragen, keine Tokens ausgegeben |
| Offline und Download | **Elf Prüfgruppen bestanden**: erstmaliger Homepage-Besuch füllt Cache, getrennte Offline-Routen für Homepage/Spiel einschließlich Query-URLs, Homepage→Spiel→Homepage ohne Netz, Root-/Ninja-Worker koexistieren, fremder Cache erhalten, alter eigener1.7.1-Cache gelöscht, echte Punkte nach Offline-Reload erhalten, bytegleicher Browserdownload, entpacktes Spiel über HTTP und offline. Keine JavaScript-Fehler |
| CI-Workerprüfung | Tatsächlicher Worker-Installations-/Offline-Routinglauf in Node-vm: vollständige vorhandene Cache-Dateien, gebündelter Einstieg, Homepage und Spiel liefern unterschiedliche Offline-Dokumente, unbekannte Navigation wird nicht als Spiel ausgegeben. CI führt bestehende Ninja-Tests und Build auf Node24 aus |

Die Profile und aktiven Spiel-Fixtures stammen aus regulären Spielmethoden. Keine Diagnose-Mutatoren oder vergebenen Testmünzen im laufenden Browser. Bereits vorher funktionierende Ränge, Tagesmissionen, Open-Regelsatz, Menü-Musik und NIM-Lernmomente wurden nach unbeabsichtigten Rückschritten im Homepage-Entwurf wiederhergestellt. Vorhandene Dokumente/Tests wurden deshalb vollständig zusammengeführt, nicht durch reduzierte Prüfungen ersetzt.

## Download

`downloads/Notification-Ninja-1.7.2.zip`: **135.053 Bytes**, neun Laufzeitdateien einschließlich `home.html`, gebündeltem Spiel und aktiver Ranglisten-Konfiguration plus `START-HIER.txt`.

SHA-256: `87d5569f0352f201b9b06cffa239c5c5f28d0acab7f34ae8b8a787d23fbc3ec6`

Zweimal identische Paketierung, CRC, neun bytegleiche Laufzeitdateien und tatsächlicher Browserdownload geprüft. Ältere ZIPs bleiben erhalten; die Homepage ist nun auch im aktuellen Download enthalten.

## Betrieb und Grenzen

Homepage: `notification-ninja/home.html`; direkter Spieleinstieg weiterhin `notification-ninja/index.html` beziehungsweise der Verzeichnispfad. Das REBOOT-Spiel im Projektroot und MIND MAZE bleiben erhalten. Homepage und Spiel teilen sich denselben lokalen Profil-Speicher, die Homepage selbst liest oder verändert ihn nicht. Ansehen markiert eine Mitteilung als gelesen; es löscht weder eine Freischaltung noch eine noch nicht abgeholte Münzbelohnung.

Die Rangliste verwendet weiterhin **https://notification-ninja-ranking.onrender.com** und zählt nur ausdrücklich veröffentlichte `open-v2`-Runs mit drei Herzen. Die öffentliche API-v2 wurde zuletzt mit der Veröffentlichung1.7 einschließlich21 Lifecycle-Checks geprüft; die neue Browserprüfung1.7.2 verwendet einen lokalen echten API-Dienst. Keine erneute öffentliche Veröffentlichung von Testspielern für dieses reine Frontend-Update erforderlich.

Render Free hat flüchtige SQLite-Daten: Einschlafen, Neustart oder Deployment kann Online-Ergebnisse löschen. Nach einer Pause kann der Dienst ungefähr eine Minute zum Starten brauchen; das Frontend hat acht Sekunden Anfrage-Timeout. Bei Bedarf warten und erneut öffnen. Lokale Münzen, XP und Käufe bleiben erhalten. Für dauerhafte Scores ist dauerhafter Server-Speicher nötig; kein Bezahlplan eingerichtet.

CORS erlaubt für die öffentliche Rangliste exakt `https://brukevfh.github.io`. Lokale Downloads/file/localhost können dort nicht veröffentlichen; das lokale Spiel funktioniert dennoch offline. Anfragen sind freiwillig; Regeln und Plausibilitätsgrenzen sind kein manipulationssicherer Anticheat.

Mobile Prüfungen sind Chromium-Touch-/Viewport-Emulation, kein physisches Safari-Gerät. Echtes Vollbild benötigt eine Nutzergeste und kann fehlen; dann bleibt die große Ansicht nutzbar. Browserrichtlinien und TLS-Prüfung bleiben aktiv. Direktes `file://`-Öffnen ist im verwalteten Cloud-Chromium gesperrt; kein Doppelklick-Test wird behauptet.

Der lange native Open Run mit171,96 aktiven Sekunden und allen10/25/50-Effekten wurde zuletzt in1.7 geprüft, die vollständige endliche Kampagne zuletzt in1.2 und die großen Profil-/Mentorprüfungen in1.4. Diese Durchläufe werden nicht als neue1.7.2-Prüfungen gezählt. Aktuelle Unit- und gezielte UI-Prüfungen decken die betroffenen Funktionen ab.

Externe Artefakte: `/workspace/ninja-checks/v172/`, insbesondere `tests.txt`, `qa18-navigation-report.json`, `hud18-game-report.json`, `qa18-super-report.json`, `qa18-ranking-report.json` und `offline.json`; Kamera-/Rendererprüfung unter `/workspace/ninja-checks/v18/renderer-camera-report.json`. Keine Spielabhängigkeiten, keine Tests mit jugendlichen Testpersonen durchgeführt.
