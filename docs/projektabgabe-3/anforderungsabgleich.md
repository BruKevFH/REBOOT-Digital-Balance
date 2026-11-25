# Projektabgabe 3 – Anforderungsabgleich

**Projekt:** Notification Ninja · **Gruppe:** PG1 · **Stand:** 25. November 2026<br>
**Abgabe:** Donnerstag, 26. November 2026, 21:00 Uhr (Europe/Vienna)

Die folgende Zuordnung folgt der übermittelten Moodle-Aufgabenstellung. Die Zuordnung bezieht sich auf die fertige Kurzpräsentation mit 16 Folien; die technischen Details und die vollständigen Modelle stehen zusätzlich im Dokumentationsanhang.

| Moodle-Anforderung | Inhalt der Kurzpräsentation | Beleg / Ergänzung |
|---|---|---|
| **Soll / Ist Stand** | Gegenüberstellung des beabsichtigten Spielumfangs und des tatsächlich umgesetzten/geprüften Stands: Spiel und Karriere, Konten/Fortschritt, Wettbewerb, Gestaltung und öffentlicher Betrieb. | Version 3.13.1; `technical-documentation.md`, Abschnitt 2; Nachweise 03, 13, 15, 17 und 18. |
| **Pläne etc. laut Software Engineering: Szenarien** | Drei konkrete Abläufe: als Gast eine Lernrunde beginnen; als Kontospieler fortsetzen, eine Fähigkeit kaufen und einen gültigen Open Run automatisch eintragen lassen. | Dokumentierte Szenarien S1–S6 und nachvollziehbarer Navigationsablauf. Keine nachträglich erfundenen ursprünglichen Projektfristen. |
| **Use-Case-Diagramme** | Systemgrenze und die Rollen Gast, Kontospieler und Admin-Testkonto; Spielen/Üben, Konto verwalten, Kaufen/Fortschritt und automatische Wertung. | Bearbeitbare Quelle und vollständiges Diagramm: `diagrams/02-use-cases.mmd` / `.svg`. Admin-Testkonten sind von Rangliste und Wochenpodium ausgeschlossen. |
| **Sequenzdiagramme** | Anmeldung; transaktionaler Kauf; Start, Replayprüfung und automatische Veröffentlichung eines geeigneten neuen Open Runs. | Quellen 03–05 unter `diagrams/`; UTC-Wochenpodium als zusätzliche Sequenz 06 im Anhang. |
| **Konzept: erste Designs** | Früherer Illustrationsentwurf wird ausdrücklich als Entwurf bezeichnet und mit einer echten aktuellen Spielaufnahme verglichen. Die gemeinsame Bildsprache und die drei Alltagskontexte werden erklärt. | Nachweisbarer früher Entwurf: `notification-ninja/assets/dojo-study-v5.svg`, erstmals im Commit `8e4271c` vom 10.11.2026. Aktuelle Original-Screenshots sind getrennt gekennzeichnet. |
| **Konzept: erste technische Implementierung / Schnittstellen** | Browser mit Canvas und lokalem Gastprofil; Node.js-API v3; gemeinsame Spielregeln; PostgreSQL für Konten und SQLite lokal. Beispiele: `/auth/*`, `/me`, `/actions`, `/runs/*`, `/leaderboard`. | Architekturdiagramm 01, technische Dokumentation Abschnitt 5 und vorhandene Implementierung. |
| **Datenbankdesign (ERD)** | Lesbare ERD-Ansichten für Konten/Sitzungen/Profil und für Wallet/Ledger/Run/Rangliste/Wochenpodium. Primär- und Fremdschlüssel sowie Kardinalitäten werden erläutert. | Vollständige ERDs 07 und 08. Das Profil ist validierter JSON-Inhalt in einer TEXT-Spalte; die autoritative Wallet liegt separat. |
| **Mögliche Änderungen an Konzept / Plan: Implementierung, Rollen, DB usw.** | Vom reinen Ranglistenserver zur Konto-API mit dauerhafter PostgreSQL-Speicherung; Fähigkeiten in den Basar; vertrauenswürdige Admin-Testrolle; automatische Wertung neuer geeigneter Kontorunden. Erhalt von Gastständen und alten Inhaltskennungen. | Quellcode und Versionsnachweise. Eine geänderte technische Architektur ist belegt; frei erfundene Teamzuständigkeiten oder ursprüngliche Zeitpläne werden nicht ergänzt. |
| **Funktionales Testen: Konzept** | Positive/negative Fälle, Kontentrennung, Wiederholung von Käufen, manipulierte Eingaben, echter Serverneustart, Browser-/Sprach-/Darstellungsprüfungen und anschließende Testdatenlöschung. | Teststrategie und Grenzen in `technical-documentation.md`, Abschnitt 9; reproduzierbare Skripte im Repository. |
| **Funktionales Testen: erste Ergebnisprotokolle** | Konkrete Tabelle mit Testfall, Soll, beobachtetem Ist, Ergebnis und Quelle. Ergebnisse werden nach Methode getrennt: lokale Modell-/HTTP-Tests, native Browserbedienung und öffentlicher Betrieb. | Ergebnisübersicht unten und maschinenlesbare `presentation_test_results.json`; vorhandene bereinigte Originalnachweise 02, 09, 13, 15–18. |
| **Pre-Testergebnisse aus Weihnachtssession** | **„Keine Protokolle einer Weihnachtssession vorhanden (Angabe der Projektgruppe).“** Es werden weder Teilnehmer noch Aussagen oder Ergebnisse erfunden. Die vorhandenen funktionalen Testprotokolle werden als tatsächlich vorliegende Ergebnisse gezeigt. | Explizite Klarstellung der Projektgruppe vom 25.11.2026. Dieser geforderte Ergebnisanteil kann ohne vorhandene Protokolle nicht als geliefert behauptet werden; es wird nicht zum Nachreichen nicht existierender Unterlagen aufgefordert. |

## Konkrete funktionale Ergebnisprotokolle

Die Einträge beschreiben bereits ausgeführte Prüfungen. „Bestanden“ gilt jeweils für die angegebene Methode und den konkreten Stand, nicht pauschal für alle Geräte oder alle denkbaren Eingaben.

| Testfall | Soll | Beobachtetes Ist | Ergebnis | Quelle |
|---|---|---|---|---|
| T01 – Zwei Konten registrieren und anmelden | Getrennte Identitäten erhalten ihren eigenen Fortschritt; Anmeldung funktioniert. | Zwei temporäre Produktionskonten erfolgreich registriert und angemeldet; Profile und Mittel unabhängig gespeichert. | Bestanden, 24.11.2026 | Nachweis 13; [öffentlicher Abnahmelauf](https://github.com/BruKevFH/REBOOT-Digital-Balance/actions/runs/45445114118). |
| T02 – Fähigkeit kaufen und Anfrage wiederholen | Serverseitiger Preis wird genau einmal belastet; Besitz bleibt korrekt. | Kauf der 35-Münzen-Fähigkeit mit erspielten Mitteln und idempotenten Wiederholungen erfolgreich geprüft. | Bestanden, 24.11.2026 | Nachweis 13; lokale Adapterprüfung zusätzlich in 02. |
| T03 – Open Run automatisch eintragen | Ein neuer geeigneter Kontorun erscheint nach Serverprüfung ohne zusätzlichen Veröffentlichungsklick. | Zwei native lokale Kontorunden: je drei tatsächliche Schnitte, regulärer Herzverlust, automatische Veröffentlichung mit **0** Veröffentlichungsklicks, Reload erhalten; beide Konten danach gelöscht. | Bestanden, 24.11.2026 | Nachweis 09; 360 px/Deutsch und 1280 px/Englisch. Kein als öffentlich ausgegebenes natives Spiel. |
| T04 – Falsche Geldwerte, Preise und Belohnungen | Manipulierte Clientwerte und unverdiente Ansprüche verändern keine autoritative Wallet. | Negative Integrationsfälle und gleichzeitig wiederholte Kaufanfragen in SQLite und PostgreSQL erfolgreich geprüft. | Bestanden, 24.11.2026 | Nachweis 02. Echte Prozesse; synthetische Uhr für Modell-Replays ausdrücklich dokumentiert. |
| T05 – Server neu starten | Profile, Käufe, Wallet, Inventar und veröffentlichte Rangliste bleiben erhalten. | Kontrollierter Render-Neustart separat bestätigt; beide Produktionskonten und Ergebnisse danach wiedergefunden. Anschließend beide Testkonten, Sitzungen und öffentliche Testeinträge entfernt. | Bestanden, 24.11.2026 | Nachweis 13; Providerereignis `server_restarted`, danach erfolgreiche Verifikation und Bereinigung. |
| T06 – Seiten, Sprachen und Größen | Keine festgestellten Überläufe, fehlenden Übersetzungen, Bildfehler oder zu kleinen Bedienflächen im definierten Prüfumfang. | **1.368** Zustände bestanden: je 342 bei 360/1280 px und DE/EN; vier temporäre MFA-/Konten-Testkonten entfernt. | Bestanden, 25.11.2026 | Nachweis 15. Browseremulation ersetzt keine Prüfung auf jedem physischen Gerät. |
| T07 – Aufgeklappte Texte und lange HUD-Werte | Details bleiben zugänglich; hohe Zahlen und Missionsziele sind lesbar. | **60** native Detailzustände ohne Befund; Missionszielkontrast mindestens **5,84:1**. Separat **216** reine HUD-Darstellungsfälle bestanden; kein erfundener Spielpunktestand. | Bestanden, 24./25.11.2026 | Nachweise 10 und 16. |
| T08 – Automatisierte Regression und Auslieferung | Bestehende Verträge und der öffentlich ausgelieferte Quellstand stimmen. | **591 Repositorytests** bestanden, 0 Fehler, 0 übersprungen; Haupt-CI, Asseterzeugung und öffentliche API-/Gastprüfung erfolgreich. Neun kanonische Dateien per SHA-256 abgeglichen. | Bestanden, 25.11.2026 | Nachweise 17 und 18. Die 591 Tests umfassen auch andere Spiele im Repository. |

## Sachlich wichtiger Hinweis für Vortrag und Bilder

- Neue Screenshots werden als **Originalaufnahmen aus dem Spiel, Version 3.13.1** beschriftet. Eine reine Illustrationsdatei wird nicht als Gameplay-Screenshot ausgegeben.
- Frühere Entwurfsdaten sind anhand der Git-Historie nachvollziehbar: Lern-Dojo-SVG am 10.11.2026 (`8e4271c`), Mint-Logo am 12.11.2026 (`945554b`), Indie-Illustrationsatlas am 16.11.2026 (`73cf7f7`). Daraus folgt kein belegter früherer menschlicher Pretest.
- Die **132 lokalen integrierten Gastansichten** sind von der öffentlichen Gastprüfung getrennt. Es werden nicht fälschlich 132 öffentliche Gastansichten behauptet.
- Die aktuelle Veröffentlichung ist für den Quellstand `6878dd4bc8717d48f257d5b89c17868c355fc2bd` belegt. Der öffentliche Zwei-Konten-/Neustarttest gilt für `ed1bf5a`; das Kontenbackend blieb bei der abschließenden Darstellungs- und Sprachkorrektur unverändert.
- Das ERD darf keine frei erfundene relationale Inventartabelle zeigen. Inventar und Karriere befinden sich im validierten Profil; die Wallet ist die maßgebliche Geldquelle. `ninja_podium_rewards.run_id` ist ein historischer Snapshot und absichtlich kein Fremdschlüssel.
- Gast und Kontospieler sind Nutzungsrollen. Die Admin-Testrolle ist eine vertrauenswürdige Serverrolle, kein frei wählbarer Registrierungswert. Namen oder Zuständigkeiten einzelner Gruppenmitglieder werden nicht erfunden.

## Tatsächliche Folienfolge der Kurzpräsentation

1. Notification Ninja: Titel, echte Spielszene und Abgabeinformationen.
2. Spielidee und Interaktion in einer tatsächlichen Spielsituation.
3. Reale UI-Ansichten: Hub, Karriere und Basar.
4. Soll-/Ist-Stand mit knappen Statusangaben.
5. Früher Illustrationsentwurf und aktuelle Homepage; erste technische Umsetzung.
6. Drei Szenarien und der Weg von Homepage bis Ergebnis.
7. Use-Case-Diagramm mit Systemgrenze und Rollen.
8. Architektur und konkrete API-Schnittstellen.
9. Sequenzdiagramm Anmeldung.
10. Sequenzdiagramm geprüfter Open Run und automatische Wertung.
11. Zentrales ERD mit echten Tabellen, PK/FK und Kardinalitäten.
12. Änderungen an Konzept, Implementierung, Rollen und Datenbank.
13. Echte Gaming-/Schlaf-Spielbilder und heutiger Inhaltsumfang.
14. Funktionales Testkonzept.
15. Echte erste Ergebnisprotokolle mit Soll und Ist.
16. Abgabestand, Live-Demo und ausdrückliche Weihnachtsklarstellung.

Die vollständigen Sequenzen für Kauf und Wochenpodium sowie beide vollständigen ERD-Ansichten liegen zusätzlich als bearbeitbare Quellen, SVG und im Dokumentations-PDF bei. Sprechernotizen erläutern jede Folie; die Vortragsdauer beträgt etwa 10–12 Minuten.
