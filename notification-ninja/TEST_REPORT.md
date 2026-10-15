# Notification Ninja 1.4.0 – Prüfbericht

Geprüft am **15. Oktober 2026** mit Node.js 24, Python 3 und Chromium/Playwright. Native Browserprüfungen verwenden echte Maus-/Touch-Eingaben und ausschließlich lesende Laufzeitdiagnosen.

## Aktuelle Ergebnisse

| Prüfung | Ergebnis |
| --- | --- |
| Frozen Installation und Build | `npm --cache /workspace/.npm-cache ci --no-audit --no-fund`, aktueller Ninja-Build und reproduzierbare ZIP-Erstellung erfolgreich; Node 24 ist für die SQLite-Ranglistentests erforderlich |
| `npm test` | **173 bestanden**, 0 fehlgeschlagen, 0 übersprungen; REBOOT, MIND MAZE, Ninja-Regeln, Fortschritt, Profile, lokale Sitzungen und Ranglistendienst |
| Open Run | Sieben neue Regelprüfungen: kostenloser unbefristeter Modus, keine Enden bei 75/90/300 Sekunden, weiter steigendes Tempo, Ende nur durch verlorene Herzen, genau einmalige Abrechnung, faires Standard-Loadout, langfristiger Save/Reload und alte Highscores |
| Nativer Open Run | **114,88 aktive Sekunden**, 64 echte Mauswischer, 115 Wurfanimationen. Bei 15/30/60/90 Sekunden Tempo ungefähr **1,30 / 1,59 / 2,04 / 2,25×**, danach weiterer Anstieg. Nach 96 Sekunden weiterhin spielbar und HUD `∞`; erst später ohne weitere Eingriffe durch verlorene Herzen beendet. Zehn Münzen einmalig gesichert, Reload unverändert, keine JavaScript-Fehler |
| Tempo und Ökonomie | Aktive Frame-Simulationen prüfen Rampen, neue statt nachträglich geänderter Flugbahnen und sichere schmale Bahnen. Perfekte Study-Runden: 10/12/14 Münzen. Erstes 35-Münzen-Upgrade nach drei normalen Runden; kurze Schlaf-Bonus-Schleifen/untätige frühe Niederlagen liefern kein Gratisgeld. Vorhandene Münzen und gekaufte Inhalte bleiben erhalten |
| Lokales Profil und Navigation | **16 native Prüfgruppen über 1280×800, 390×844, 320×568, 844×390**: Startseite, Name, tatsächliches Skin-Porträt, Garderobenwechsel, Umbenennen, Browser-/UI-Zurück mit Scrollwiederherstellung, 24 Trophäen, verschachtelte Mitteilungen, Abmelden/Neuladen, Wiedereinstieg, sichere Löschung und pausierte Runs |
| Sichere Löschung | Falscher Bestätigungsname und Abbrechen erhalten alle Daten. Richtiger Name entfernt das Ninja-Profil; ein neues Profil beginnt leer. Kontroll-Speicherstände von REBOOT und MIND MAZE bleiben unverändert. Bei einem vorhandenen Online-Eintrag wird zuerst dessen bestätigte Löschung angefragt |
| Vier Bildschirmgrößen | Zusätzliche native UI-Prüfung: öffentliche Startseite, oben sichtbare 44-Pixel-Zurück-Taste auch nach mehr als 1.000 Pixeln Scrollen, vorherige Ansicht, neue Raumvorschau, Open Run mit `∞`, Ranglistenstatus und Löschdialog. Keine horizontalen Seiten-/Panelüberläufe oder Browserfehler |
| Spieler-Ninja | Vier unterscheidbare Outfits und sichere animierte Profilbilder; der tatsächlich ausgewählte Skin ist im Spiel sichtbar. Echte Spawn-Ereignisse erzeugen Windup/Wurf/Funken. 100-Spawn-Stresstest begrenzt dekorative Würfe auf acht; Animationen laufen aus. Kleine 320-Pixel-Ansicht kontrolliert |
| Meister NIM | Eigenständiger Fuchs-Sensei mit Augen-, Sprech-, Wink- und Papierzeichen-Animationen. Neun native Mentor-Prüfgruppen erneut bestanden; reduzierte Bewegung deaktiviert die Charakteranimationen. Warteschlange, Bestätigungen und Spielpause bleiben erhalten |
| Bilder und Erfolge | 24 tatsächlich erreichbare Erfolge, neun Fähigkeiten; kräftige eigene Bildmotive. 51 SVG-Varianten auf gültiges XML und sichere Inhalte geprüft, 33 Fähigkeits-/Erfolgsillustrationen unterscheidbar |
| Ranglisten-API | Zwölf Tests: zwei Spieler, nur Open Run mit `result:lives`, getrennte Schwierigkeiten, beste Punktzahl, doppelte Runs, eigene Löschung, SQLite-Neustart, genaue CORS-Ursprünge, ungültige Scores, offline/blockierte Speicherung, parallele Initialisierung und Wiederherstellung nach verlorener Demo-Datenbank |
| Rangliste im echten Browser | **Sieben zusätzliche Prüfungen bestanden**: über reguläre Spielmethoden erzeugten Open Run per sichtbarer Taste veröffentlichen, zweiter unabhängiger Browser sieht ihn, zweiter Score korrekt sortiert, keine doppelte Zeile, Schwierigkeiten getrennt, Study-Ergebnis nicht veröffentlichbar, Profillöschung entfernt den eigenen Online-Eintrag. Lokaler echter API-Dienst, keine erfundenen Mitspieler, keine Browserfehler |
| Offline und Download | **8/8 bestanden**: Root-Einstieg, getrennte Worker-Scopes, eigener alter Cache gelöscht, fremde Caches erhalten, echter Schnitt und Offline-Reload, Browser-ZIP mit identischer Prüfsumme, entpacktes HTTP-Spiel und Offline-Fortsetzen, keine JavaScript-Fehler. Ranglistenkonfiguration ebenfalls offline gecacht |

Test-Spielstände wurden mit öffentlichen Spielmethoden erspielt. Das reichere Navigationsprofil stammt aus 60 abgeschlossenen Study-Runden, anschließend regulären Käufen; es gibt keine Diagnose-Mutatoren oder vergebenen Testmünzen im laufenden Browser. Komponenten-, Checkpoint- und vollständige native Durchläufe werden getrennt ausgewiesen. Die vollständige endliche Vier-Raum-Kampagne wurde zuletzt in Version 1.2 nativ durchgespielt; für 1.4 konzentriert sich die native Spielprüfung auf den neuen Open Run und die geänderten Oberflächen. Automatisierte Tests decken weiterhin die endlichen Spielregeln ab.

## Download

`downloads/Notification-Ninja-1.4.0.zip`: **110.468 Bytes**, acht Laufzeitdateien einschließlich deaktivierter `leaderboard-config.json` plus `START-HIER.txt`.

SHA-256: `c6c48618a4931a42296be927055c961ad487ab77fa410e18b2600b1e1872539e`

Zweimal identische Paketierung, CRC, acht bytegleiche Laufzeitdateien und tatsächlicher Browserdownload geprüft. Ältere ZIPs bleiben verfügbar.

## Ranglisten-Betrieb und Grenzen

**Es wurde kein öffentlicher Ranglistenserver angelegt.** Die produktive Konfiguration ist ausdrücklich deaktiviert; GitHub Pages kann die zusätzliche API nicht ausführen. Das Spiel zeigt „Online-Rangliste noch nicht verbunden“. Die Tests der gemeinsamen Rangliste verwendeten einen lokal gestarteten echten Node-/SQLite-Dienst mit getrennten Browserprofilen.

Eine kostenlose Render-Demo ist als `render.yaml`, Dockerfile und konkrete Anleitung in [server/README_NINJA.md](../server/README_NINJA.md) vorbereitet. Dafür muss der Nutzer den Dienst in seinem eigenen Hosting-Konto aktivieren und dessen echte HTTPS-Adresse verbinden. Laut am Prüftag über reguläres TLS gelesener offizieller Render-Dokumentation verliert ein kostenloser Web-Service seine lokale SQLite-Datei beim Einschlafen, Neustart oder Deployment. Deshalb ist dies eine Demo, keine Zusage dauerhaft gespeicherter Highscores. Für dauerhafte Ranglisten ist dauerhafter Server-Speicher nötig. Der Docker-Betrieb ist vorbereitet; ein Docker-Image-Build oder öffentliches Backend-Deployment wird nicht behauptet.

Die API prüft Grenzen, Besitzer-Token und doppelte Run-IDs; clientseitige Ergebnisse sind nicht manipulationssicher. Profile bleiben lokal, ohne Passwortkonto oder Gerätesynchronisation. Daten werden erst nach ausdrücklichem Veröffentlichen übertragen.

Mobile Prüfungen verwenden Chromium mit Touch-/Viewport-Emulation, kein physisches iPhone mit Safari. Direktes `file://`-Öffnen ist im verwalteten Cloud-Chromium gesperrt; kein Doppelklick-Test wird behauptet. Browserrichtlinien und TLS-Prüfungen bleiben aktiv. Öffentliche Spiel-/Paketdateien werden separat mit regulärem HTTPS-Systemvertrauen geprüft.

Berichte und Screenshots: `/workspace/ninja-checks/v14/`, insbesondere `open-native.json`, `profile-nav.json`, `rank-ui.json`, `offline.json`, `ui/native.json`, `mentor/` und die Renderer-Berichte. Dies sind externe Prüfartefakte, keine Spielabhängigkeiten. Es wurden keine Tests mit jugendlichen Testpersonen durchgeführt.
