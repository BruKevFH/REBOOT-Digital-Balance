# Notification Ninja 3.1.0 – Entwicklungs- und Abnahmestand

Stand: **07.11.2026**. Dieser Bericht unterscheidet lokale Nachweise von einer öffentlichen Bereitstellung. Die alte Cloud-Umgebung wurde weder gelöscht noch verändert.

## Tatsächliche Ausgangsbasis

Der vorhandene Checkout war sauber und stand auf `9738b6b58cf4f3688edf5e1bc65066de741d2db3`; `git ls-remote origin refs/heads/main` meldete denselben Commit. Im Repository war bereits Release **3.0.1** dokumentiert. Eine nur in der ausgefallenen Umgebung gespeicherte zusätzliche Portalversion wurde hier nicht nachgewiesen oder als übernommen ausgegeben. Es wurden keine `AGENTS.md` im zugänglichen Checkout gefunden. Cloud-Runtime- und Setup-Skills wurden gelesen.

## Implementiert

- Echter PostgreSQL-Adapter mit geprüftem TLS, versionierten atomaren Migrationen, SERIALIZABLE-Transaktionen, begrenzten Konfliktwiederholungen, konsistenten Sperren und Idempotenz. Lokales SQLite bleibt unterstützt; bestehende Konten und Spielstände werden erhalten.
- Registrierung mit Ninja-Name, privater E-Mail, Passwortbestätigung und Datenschutz-Zustimmung. Bestehende Konten bleiben per Namen anmeldbar; neue Konten zusätzlich per E-Mail. Sichere Passwort-/Token-Hashes, Logout, Wiederherstellungscode, bestätigte Kontolöschung. Kein E-Mail-Versand und keine E-Mail-Inhaberschaftsbestätigung.
- Profile, Fortschritt, XP, Münzen, Inventar, Käufe, Belohnungen und ausdrücklich veröffentlichte Open-Run-Ergebnisse verwenden dieselbe serverseitige Geschäftslogik für PostgreSQL und SQLite.
- Öffentliches Portal mit Anmeldung/Registrierung und getrenntem Gaststart. Ninja-Hub mit ausgerüstetem Ninja, Name, Level, XP, Münzen, nächster Mission und einem zentralen Spielen-Button. Navigation zu Dojo, Karriere, Modi, Basar und Rangliste; optionale Kurzrunden sind eingeklappt.
- Drei eigene Bossmechaniken: Chaos-Sensei/Fokus, Glitch-Shogun/Musterdoppelgänger, Albtraum-Oni/Ruhefenster. Mehrere angekündigte Phasen; permanente IDs und alte Saves bleiben kompatibel.
- Eigenständiger Boss Rush mit drei aufeinanderfolgenden Kämpfen, gemeinsamen Herzen und einmaliger Abrechnung. Deterministische Tagesrunde mit serverseitigem UTC-Tag für Konten; Gäste spielen ausdrücklich eine lokale Übung. Gestern gestartete Saves erzeugen keine heutigen Aufgabenbelohnungen.
- Eigenes blau-violettes Cyber-Dojo als selbst verfasste SVG-Grafik. Die bisherigen Lern-/Schlaf-Illustrationen, animierte Werfer, Schnittspuren, Musik/Effekte und Einstellungen bleiben erhalten. Keine fremden geschützten Assets hinzugefügt.
- Bestehende 18 Hauptmissionen, acht Zusatzherausforderungen, 24 Erfolge, Skins, drei Herzen und unbegrenzter Open Run bleiben erhalten. Basarfilter für Besitz/neue Angebote ergänzt. Deutsche/englische Portal- und Modustexte ergänzt.
- Separater Render-Free-Accountdienst in `render.yaml`, mit externer `DATABASE_URL` und ausgeschalteten automatischen Deployments. Historischer Ranglistenservice bleibt unverändert erhalten. Kein kostenpflichtiger Speicher oder Tarif angelegt.

## Ausgeführte Prüfungen

| Prüfung | Ergebnis |
|---|---|
| Ausgangsbasis `npm test` | 384 bestanden |
| Abschließend `TEST_DATABASE_URL=… npm test` gegen PostgreSQL 17 | **404 bestanden, 0 Fehler, 0 übersprungen** |
| Zwei getrennte HTTP-Konten, jeweils SQLite und PostgreSQL | Anmeldung, erspielter Fortschritt, Replay-Prüfung, doppelte Abschlussanfragen, öffentliche Rangliste und Anwendungsneustart bestanden; danach Konten gelöscht |
| PostgreSQL-Integration | Schema-Upgrades, Rollback, Constraints, parallele Käufe, Idempotenz, Sitzungslimit, einmalige Wiederherstellung und TLS-Vorgaben bestanden |
| Spielregeln | Tatsächlich durchgespielter Boss Rush, Schwachstellen/Phasen, Daily-Muster, Serverkalender, Mitternacht und Save-Wiederaufnahme bestanden |
| Docker-Image `server/Dockerfile.ninja-app` | Erfolgreich gebaut, TLS-Prüfung bei Installation aktiv |
| Echter Container-Lebenszyklus mit SQLite-Volume | Zwei Konten angelegt, Container entfernt/neu erstellt, Sitzungen/Profile erhalten, erneut angemeldet, beide Konten gelöscht; nur eigene Testcontainer/-volumes entfernt |
| `npm run build:ninja` | Beide Bundles für 3.1.0 gebaut |
| `npm run package:ninja`, zweimal | Identische ZIP-/SHA-256-Ausgabe; Laufzeitidentität und CRC geprüft |

| Finale Browser-Spielabnahme | 360/390/768/1280/1920 px bestanden; fünf Runden mit echten Maus-/Touch-Eingaben, Einstellungen/Übung/Rückkehr, keine JS-Fehler, keine fehlenden Übersetzungen oder zu kleinen geprüften Bedienelemente |
| Finaler Portal-/Hub-Browsertest | 360/768/1280 px bestanden: Passwort-/Zustimmungssperren, echte Registrierung mit anschließender Kontolöschung, Hub-Name, Basarfilter, Gästeprofil-Erhalt, tatsächlicher Daily-/Boss-Rush-Start und englisches Portal |
| Mobile Sichtprüfung | Hub, Registrierung und neues Cyber-Dojo in Chromium visuell geprüft; SVG über HTTP geladen, kein horizontaler Seitenüberlauf |

Die Tests liefen mit Node24.22.1, PostgreSQL17, Chromium156.0.8078.79 und Playwright1.62.1. Mobilprüfungen verwenden emulierte Bildschirmgrößen/Touch, keine physischen Geräte. CI erhält einen echten PostgreSQL-Service und Browserprüfungen, damit Datenbanktests dort nicht still übersprungen werden. GitHub-CI-Erfolg nach dem Push ist separat zu prüfen.

## Externe Blocker und nächste Schritte

`RENDER_API_KEY`, `NEON_API_KEY` und eine produktive `DATABASE_URL` sind in der aktuellen Maschine nicht vorhanden; auch die Cloud-Metadaten melden keine Secret-Bindungen. Es wurden keine Werte ausgegeben oder im Repository gespeichert. Secret-Anforderungen für die beiden Verwaltungs-APIs wurden im Umgebungsentwurf gespeichert.

Die erzwungene Netzwerkpolicy hatte keine Freigabe für `api.render.com`, `console.neon.tech`, `notification-ninja-ranking.onrender.com` oder `brukevfh.github.io`. Die tatsächlichen Anfragen scheiterten mit **CONNECT 403**. Deshalb konnte der aktuelle Inhalt/Betriebszustand des entfernten Ranglistenservers und der öffentlichen Seite **nicht geprüft** werden. Der letzte dokumentierte alte Ranglistenserver ist kein nachgewiesenes Account-Backend.

Die erforderlichen Domainfreigaben und Secret-Anforderungen sind im Umgebungsentwurf hinterlegt. Schlüssel ausschließlich sicher in den Umgebungseinstellungen eingeben. Das Speichern des Entwurfs ist weder eine Anwendung auf die laufende Maschine noch eine Veröffentlichung der Cloud-Umgebung.

Sobald Zugriffe verfügbar sind: vorhandene Anbieterressourcen prüfen, ausschließlich Free-Tarife verwenden, getrennten Accountdienst mit Neon verbinden, zwei Testkonten über echtes HTTPS vollständig prüfen, den tatsächlichen Render-Dienst neu starten, Persistenz belegen und Testdaten löschen. Erst danach die öffentliche Account-Konfiguration einschalten. Vollständige Schritte: [Backendbetrieb](../server/README_NINJA_APP.md).

**`accounts-config.json` bleibt `enabled:false`. Eine funktionierende öffentliche Account-Anbindung oder eine erfolgreiche Render-/Neon-Bereitstellung wird nicht behauptet.** Lokale Tests belegen keine Free-Tarifberechtigung, öffentliche HTTPS-Konfiguration, Neon-Ressource oder Wiederherstellung einer nicht zugänglichen alten Umgebung. Vorhandene SQLite-Konten wurden nicht automatisch zu Neon importiert.
