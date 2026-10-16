# Notification Ninja 1.8.1 – eigenständiger Spieleinstieg

Geprüft am **16. Oktober 2026**. Die Verweise auf andere Spiele wurden aus dem Dojo-Footer und der Homepage entfernt, ebenso zugehörige ungenutzte CSS-Selektoren und der alte Datei-Handler. Hosting-Adresse und lokale Spielstände bleiben erhalten. Der neue Download enthält ausschließlich den bereinigten aktuellen Spieleinstieg.

- **253 Tests bestanden**, keine Fehler oder übersprungenen Tests; produktives Bundle erfolgreich gebaut.
- Tatsächliche Worker-Installation und getrennte Homepage-/Spiel-Offline-Routen geprüft.
- Desktop 1280×800 und Touch-Viewport 390×844: Homepage → Spiel → neues Profil → Dojo → Homepage → Spiel. Keine sichtbaren fremden Spielnamen oder Verweise aus dem Ninja-Pfad. Profil und Fortschritt erhalten; keine JavaScript-Fehler.
- ZIP: **155.069 Bytes**, CRC und aktuelle HTML-/Bundle-Dateien geprüft. SHA-256: `166a861b6013b584cb0e6df33853fe34f2ce68f843938e42817a77f3b0fa1c41`. Download: `downloads/Notification-Ninja-1.8.1.zip`.

Aktuelle Nachweise: `/workspace/ninja-checks/v181/tests.txt` und `standalone-report.json`. Die folgenden umfangreichen Funktionsprüfungen gehören zum unveränderten Regelstand 1.8.0 und werden nicht als neue Browserdurchläufe gezählt.

---

# Notification Ninja 1.8.0 – Prüfbericht

Geprüft am **16. Oktober 2026** mit Node.js 24, Python 3 und Chromium/Playwright. Die neue Version ergänzt Karriere, Boss-Duelle und Wochenaufgaben. Die bestehenden Spiele im Projektroot und unter `mind-maze/` bleiben unverändert.

## Automatisierte Prüfungen

**253 Tests bestanden, 0 fehlgeschlagen, 0 übersprungen.** Die 214 bisherigen Prüfungen bleiben erhalten. Hinzu kommen 20 Adventure-, neun Boss- und zehn integrierte Spielprüfungen. Der produktive JavaScript-Build und die tatsächliche Service-Worker-Installation samt getrennten Offline-Routen für Homepage und Spiel bestehen ebenfalls.

| Prüfung | Nachweis |
| --- | --- |
| Karriere | Acht verbundene Missionen, genau ein freier Startknoten, Voraussetzungen und gekaufte Räume. Ungültige, gesperrte oder unpassende Missionen ersetzen keinen laufenden Run. Echte Study-, Open-, Gaming- und Boss-Runden öffnen Pfade; Münzen ausschließlich durch einmalige ausdrückliche Abholung |
| Drei Bosse | Alle drei Duelle auf einer 322px breiten Arena mit echten Schnitten und hilfreichen Durchläufen gewonnen: 20/28/36 Treffer, drei Herzen, drei Kontexte, alte Objekte vor Kontextwechsel abgewartet. Angekündigte Welle mindestens 1,3 aktive Sekunden vor dem Beginn; Pause friert sie ein. Fehler beschädigen keine Boss-Energie und ziehen Herzen ab |
| Boss-Speicherstand | Schaden, Phase, Mission, Pause, Zeitlupe und Würfe über Größenwechsel/Neuladen erhalten. Gefälschte Bosse, Trefferzähler und Phantom-Siege werden abgewiesen, ohne das gespeicherte Guthaben zu löschen. Ergebnis und Run-Vergütung werden nicht doppelt abgerechnet |
| Wochenaufgaben | Drei rotierende Ziele mit höchstens 15 ausdrücklich abgeholten Münzen. Nur qualifizierende abgeschlossene Runden zählen. Wiederholung derselben Run-ID, Training, reine Sofortabbrüche und Runden aus der Vorwoche bringen keinen neuen Fortschritt |
| Wochenkalender | Lokaler Montag, ISO-Jahreswechsel und Sommerzeit geprüft; zusätzlich alle 30 Adventure-/Integrationstests unter `TZ=Europe/Vienna`. Wechsel leert nur die jeweilige Wochenaufgabe, erhält Münzen, Karriere und verdiente Outfits |
| Wochen-Outfits | Lotuswächter, Glutfuchs und Gezeitengeist sind nur nach drei abgeschlossenen Wochenzielen abholbar. Keine Null-Münzen-Käufe, keine automatische Ausrüstung und keine doppelte Vergabe. Einmal verdient bleiben sie im Profil; ein späterer Wochenwechsel entfernt sie nicht |
| Open-Regeln | Vergleich gegen die veröffentlichte 1.7.2: vier Arena-Größen bis zum tatsächlichen Drei-Herzen-Ende nach rund 245 Sekunden. RNG, Objekte, Tempo, Punkte, Entscheidungen und Herzen unverändert. Open-Karrieremission endet weiterhin ausschließlich bei null Herzen und verwendet `open-v2` |
| Alte Profile | Zwölf genuine 1.7.2-Spielstände: aktive und beendete Kampagne/Study/Gaming/Sleep/Master/Open-Runs erhalten Name, Münzen, abgeholte Erfolge, serialisierte Runde und Ergebnis. Neues Fortschrittsfeld ist additiv |

## Browserprüfungen

Die neuen Bildschirmabläufe wurden bei **320×568, 390×844, 844×390 und 1280×800** geprüft. Fixture-Spielstände entstehen durch reguläre Spielmethoden; der Browser bietet ausschließlich lesende Diagnosen.

- Neue Homepage → Namenswahl → Dojo → Karrierekarte und Wochenaufgaben. Acht anwählbare Missionsknoten, erkennbare Sperren, passende Voraussetzungen und deaktivierte noch offene Belohnungen. Reale Maus-/Touch-Schnitte geben Punkte, falsche Schnitte ziehen Herzen ab. Pause friert die Simulation ein, im Dojo bleibt die Kamera ruhig.
- Wochenkarten: drei tatsächliche Abhol-Schaltflächen sichern zusammen 15 Münzen einmalig und rücken nach unten. Outfit freischalten erhält die bisherige Auswahl; Profil-Auswahl und neues Ninja-Design funktionieren auch nach Neuladen und im nächsten echten Run. Gesperrte Raum-Missionen führen zum Basar.
- Boss-Karriere: Start über die tatsächliche Karte, richtiger Schnitt schwächt den Boss, falscher Schnitt kostet ein Herz. Wellenwarnung bleibt während der Pause stehen. Echter letzter Treffer öffnet das Ergebnis; acht Missionsmünzen einmalig abholbar. Boss-Ergebnis kann nicht für Open Run veröffentlicht werden.
- Schlafmission: echte gespeicherte Runde mit sieben richtigen Entscheidungen läuft nach acht Sekunden weiter; Stopp bleibt bis zur achten Entscheidung gesperrt. Danach bewusster Stopp ohne Bonus und Mission erfüllt. Erster Outfit-Dialog passt auf 320px/Querformat; Fortsetzen mindestens 44px. Die Gaming-Mission übernimmt die gewählten 45 Sekunden und Profi mit drei Herzen und drei Ninjas.
- Rangliste: zwei unabhängige Browser veröffentlichen ausdrücklich genuine neue Open-Ergebnisse an einen lokalen echten Node-/SQLite-Dienst. Gemeinsame v2-Liste und Reihenfolge stimmen; Profil-Löschung entfernt die eigenen Einträge. Keine Testspieler an den öffentlichen Dienst übertragen.
- Grafik: vier Arena-Größen plus reduzierte Bewegung. Drei eigene Papierdrachen-Phasen, Wellenwarnung, Trefferreaktionen sowie unterschiedliche Outfits, Handverzierungen und Wischspuren. Neue Boss-Effekte werden bei Pause und beim Verlassen der Runde entfernt. Audio behält Freigabe, Stummschaltung und Stimmenlimit.
- Offline: elf Prüfgruppen bestehen, einschließlich Homepage-Erstbesuch, getrennten Homepage-/Spiel-Routen mit Query-URLs, Offline-Wechsel, getrennten Root-/Ninja-Worker-Scopes, Erhalt fremder Caches, Entfernung des eigenen alten Caches, echten gespeicherten Punkten sowie tatsächlichem Browserdownload und entpacktem Spiel über HTTP/offline.

Vorherige gezielte 1.7.2-Prüfungen für einzelne Mitteilungen, Super-Taste und native Vollbild-Umschaltung bleiben unter dem damaligen Prüfstand dokumentiert. Sie werden nicht als neue 1.8.0-Durchläufe gezählt. Die aktuelle Prüfung erhält alle zugrunde liegenden Regeln und umfasst die betroffenen neuen Ansichten.

## Download

`downloads/Notification-Ninja-1.8.0.zip`: **155.223 Bytes**, neun bytegleiche Laufzeitdateien einschließlich Homepage und gebündeltem Spiel plus `START-HIER.txt`.

SHA-256: `3e2d3429896dae6af3a12d256c9dab14da6511e75b05178035ea2ecebbe83b22`

Deterministische Paketierung, CRC und Identität aller neun Dateien geprüft. Vorherige Downloads bleiben erhalten. Homepage- und Spielverweise zeigen auf den neuen Download.

## Betrieb und Grenzen

Homepage: `notification-ninja/home.html`; direkter Einstieg: `notification-ninja/index.html`. Der Build liegt im Repository; GitHub Pages veröffentlicht `main` / Root. Die öffentliche Auslieferung wird nach dem Push anhand der Dateien und des Build-Manifests geprüft. Der Umgebungsentwurf und die GitHub-Pages-Veröffentlichung sind getrennte Vorgänge.

Die Rangliste verwendet weiterhin **https://notification-ninja-ranking.onrender.com** und zählt ausschließlich ausdrücklich veröffentlichte `open-v2`-Runs. Karriere-Bosse ändern diesen Regelsatz nicht. Render Free verwendet flüchtigen Speicher und kann Scores bei Neustart oder Einschlafen verlieren; das lokale Profil bleibt erhalten. CORS erlaubt die Pages-Herkunft, lokale Downloads können nicht an diese öffentliche Liste senden. Die lokalen Spielstände und Gerätezeit sind kein manipulationssicheres Online-Konto und kein Anticheat.

Mobile Prüfungen verwenden Chromium-Touch-/Viewport-Emulation, kein physisches Safari-Gerät. Echtes Vollbild braucht eine Nutzergeste; andernfalls bleibt die große Ansicht aktiv. `file://` ist im verwalteten Cloud-Browser gesperrt und wurde nicht umgangen. Das entpackte ZIP wurde über HTTP und offline geprüft. TLS-Prüfung und Browserrichtlinien bleiben aktiv.

Externe Nachweise: `/workspace/ninja-checks/v180/` mit `tests.txt`, `regression-probe-report.json`, `navigation-report.json`, `rewards-report.json`, `boss-report.json`, `ranking-report.json`, `vienna-calendar.txt` und `offline.json`. Zusätzliche Grafik-/Audio-Prüfung unter `/workspace/ninja-checks/v19/boss-visual-report.json`. Diese Dateien sind Prüfartefakte, keine Spielabhängigkeiten. Keine Tests mit jugendlichen Testpersonen durchgeführt.
