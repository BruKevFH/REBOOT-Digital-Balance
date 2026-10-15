# Notification Ninja 1.5.0 – Prüfbericht

Geprüft am **15. Oktober 2026** mit Node.js 24, Python 3 und Chromium/Playwright. Native Spielprüfungen verwenden Maus-/Touch-Eingaben und ausschließlich lesende Laufzeitdiagnosen. Komponentenprüfungen werden gesondert ausgewiesen.

## Aktuelle Ergebnisse

| Prüfung | Ergebnis |
| --- | --- |
| Installation und Build | Vorhandene Frozen-Installation mit unverändertem Lockfile, neuer Ninja-Build und reproduzierbare ZIP-Erstellung erfolgreich; Node 24 für SQLite erforderlich |
| `npm test` | **183 bestanden**, 0 fehlgeschlagen, 0 übersprungen; REBOOT, MIND MAZE, Ninja-Regeln, Fortschritt, Profile, Sitzungen und Ranglistendienst |
| Echte Würfe | Zehn neue Integrationstests: 1/2/3 zentrierte Werfer, tatsächliche Handkoordinaten, geschütztes Ausholen/Anflug, Flow-/Super-Sicherheit, faire Zielbahnen, abwechselnde Werfer, Pause/Zeitlupe, Bildratenunabhängigkeit, Resize/Reload, alte Spielstände und extreme Open-Geschwindigkeit |
| Gemeinsame Geometrie | Zwölf Bildschirm-/Schwierigkeitskombinationen: zentrierte Verteilung, größere Figuren, kontinuierlicher Übergang zwischen Hand und Flugbahn |
| Renderer im Browser | **24 Komponenten-/Modellprüfungen** über 1280×800, 390×844, 320×568 und 844×390: 613 Handpositionsprüfungen und 5.914 Prüfungen freigegebener Flugobjekte. Keine dekorativen Objektkopien, keine Aktionshinweise vor Freigabe, angehaltene Pose bei Pause, keine Browserfehler |
| Vollbild-Komponente | Vier Bildschirmgrößen: native API, fehlende API, abgelehnte API, große Ersatzansicht, Escape, Zustandsanzeige und Aufräumen. 44-Pixel-Schalter und sichtbare wichtige Spielanzeigen geprüft |
| Vollbild im laufenden Spiel | **4/4 native Spielprüfungen bestanden**: echtes Desktop-Vollbild, drei emulierte Browser ohne API, echte Maus-/Touch-Schnitte nach dem Wurf, endliche Koordinaten, ausgerüsteter Solar-Skin, erreichbare Pause-/Ansichtstasten, weiterlaufendes Spiel nach Verlassen. Arena-Höhen 569→616, 549→614, 273→338 und 241→250 Pixel; keine Browserfehler |
| Nativer Open Run | **117,43 aktive Sekunden**, 65 echte Mauswischer und 135 reale Würfe. Bis 96,05 Sekunden mit vier Herzen gespielt, danach ohne Eingaben erst bei null Herzen beendet. Zwei Solar-Ninjas durchgehend geprüft; Tempo bei 15/30/60/90 Sekunden ungefähr 1,30 / 1,59 / 2,04 / 2,26×, Anzeige `∞`, einmalige Münzabrechnung nach Reload erhalten, keine Browserfehler |
| Ranglisten-Neustarttest | Ein vorhandenes Testproblem mit dem Node-HTTP-Verbindungspool beim Neustart auf demselben Port behoben: ausschließlich dieser Test schließt seine Verbindungen ausdrücklich. Echte Reset-/Wiederveröffentlichungs-/Löschprüfungen unverändert; 100 isolierte Wiederholungen erfolgreich |
| Offline und Download | **8/8 aktuelle Prüfgruppen bestanden**: Root-Einstieg, getrennte Worker-Scopes, eigener alter 1.4-Cache gelöscht und fremde Caches erhalten, echter Schnitt und Offline-Reload, Browser-ZIP mit identischer Prüfsumme, entpacktes HTTP-Spiel und Offline-Fortsetzen, keine JavaScript-Fehler |

Die Tests verwenden regulär erspielte Profile. Das reichere Browserprofil stammt aus 60 abgeschlossenen Study-Runden mit anschließenden regulären Käufen; keine Diagnose-Mutatoren oder vergebenen Testmünzen im laufenden Browser. Die bestehende endliche Vier-Raum-Kampagne wurde zuletzt in Version 1.2 vollständig nativ durchgespielt; automatisierte Tests prüfen ihre Regeln weiterhin. Die 16 Profil-/Navigationsgruppen, Mentorprüfungen und sieben Browserprüfungen mit lokalem Ranglistendienst wurden zuletzt in 1.4 ausgeführt und werden nicht als neue 1.5-Durchläufe gezählt.

## Download

`downloads/Notification-Ninja-1.5.0.zip`: **115.523 Bytes**, acht Laufzeitdateien einschließlich deaktivierter `leaderboard-config.json` plus `START-HIER.txt`.

SHA-256: `be05a316f2070b46e4b9135756208d3758be8b2749b673a8fe704bbffa34ba7f`

Zweimal identische Paketierung, CRC, acht bytegleiche Laufzeitdateien und tatsächlicher Browserdownload geprüft. Ältere ZIPs bleiben verfügbar.

## Ranglisten-Betrieb und Grenzen


**Es wurde kein öffentlicher Ranglistenserver angelegt.** Die produktive Konfiguration ist ausdrücklich deaktiviert; GitHub Pages kann die zusätzliche API nicht ausführen. Das Spiel zeigt „Online-Rangliste noch nicht verbunden“. Die Tests der gemeinsamen Rangliste verwendeten einen lokal gestarteten echten Node-/SQLite-Dienst mit getrennten Browserprofilen.

Eine kostenlose Render-Demo ist als `render.yaml`, Dockerfile und konkrete Anleitung in [server/README_NINJA.md](../server/README_NINJA.md) vorbereitet. Dafür muss der Nutzer den Dienst in seinem eigenen Hosting-Konto aktivieren und dessen echte HTTPS-Adresse verbinden. Laut am Prüftag über reguläres TLS gelesener offizieller Render-Dokumentation verliert ein kostenloser Web-Service seine lokale SQLite-Datei beim Einschlafen, Neustart oder Deployment. Deshalb ist dies eine Demo, keine Zusage dauerhaft gespeicherter Highscores. Für dauerhafte Ranglisten ist dauerhafter Server-Speicher nötig. Der Docker-Betrieb ist vorbereitet; ein Docker-Image-Build oder öffentliches Backend-Deployment wird nicht behauptet.

Die API prüft Grenzen, Besitzer-Token und doppelte Run-IDs; clientseitige Ergebnisse sind nicht manipulationssicher. Profile bleiben lokal, ohne Passwortkonto oder Gerätesynchronisation. Daten werden erst nach ausdrücklichem Veröffentlichen übertragen.

Mobile Prüfungen verwenden Chromium mit Touch-/Viewport-Emulation, kein physisches iPhone mit Safari. Direktes `file://`-Öffnen ist im verwalteten Cloud-Chromium gesperrt; kein Doppelklick-Test wird behauptet. Browserrichtlinien und TLS-Prüfungen bleiben aktiv. Öffentliche Spiel-/Paketdateien werden separat mit regulärem HTTPS-Systemvertrauen geprüft.

Berichte und Screenshots: `/workspace/ninja-checks/v15/`, insbesondere `renderer-report.json`, `renderer-model-report.json`, `fullscreen-report.json`, `fullscreen-game-report.json`, `open-native.json` und `offline.json`. Frühere Prüfungen unter `/workspace/ninja-checks/v14/`. Dies sind externe Prüfartefakte, keine Spielabhängigkeiten. Keine Tests mit jugendlichen Testpersonen durchgeführt.
