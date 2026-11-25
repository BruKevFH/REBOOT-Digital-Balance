# Projektabgabe 3 – Notification Ninja

**Gruppe:** PG1 · **Lehrveranstaltung:** 26W-B5-Telehealth / Med. Info Projekt<br>
**Abgabe:** Donnerstag, 26. November 2026, 21:00 Uhr (Europe/Vienna)<br>
**Bearbeitungsstand:** 25. November 2026 · veröffentlichte Version 3.13.1

## Präsentieren und einreichen

- [slides.pptx](slides.pptx): 16 bearbeitbare Folien mit Sprechernotizen, etwa 10–12 Minuten.
- [slides.pdf](slides.pdf): gleichlautende Präsentation als PDF.
- [submission.zip](submission.zip): gesamtes Abgabepaket ohne Zugangsdaten.
- [technical-documentation.pdf](technical-documentation.pdf): ausführliche technische Dokumentation mit lesbarem Vektor-Diagrammanhang.
- [anforderungsabgleich.md](anforderungsabgleich.md): exakte Moodle-Anforderungen, zugehörige Folien und Originalbelege.
- [presentation_test_results.json](presentation_test_results.json): acht echte Ergebnisprotokolle mit Soll, Ist, Datum, Methode und Nachweis.
- [diagrams/](diagrams/): vollständige UML-/ERD-Modelle als SVG und bearbeitbare Mermaid-Quellen.
- [assets/screenshots/provenance.json](assets/screenshots/provenance.json): Herkunft, Dateihashes und Aufnahmemethode der tatsächlichen Spielbilder.

**Live-Demo:** [Notification Ninja öffnen](https://notification-ninja-accounts.onrender.com/).

Die Bilder zeigen unveränderte lokale Browseransichten der tatsächlich laufenden Codeversion 3.13.1. Es wurden reguläre Gastprofile verwendet, keine Spielstände oder Rekorde erfunden. Die Aufnahmen sind kein eigener Produktionsnachweis; dieser liegt getrennt in den Originalprotokollen. Der frühe Dojo-Entwurf vom 10. November ist ausdrücklich als Illustration und nicht als damaliger UI-Screenshot gekennzeichnet. Diagramme und Texte bleiben in PowerPoint bearbeitbar.

## Anforderungen der Projektabgabe 3

| Moodle-Anforderung | Folien |
|---|---|
| Soll / Ist Stand | 4 |
| Szenarien und Use-Case-Diagramm | 6–7 |
| Sequenzdiagramme | 9–10; weitere vollständige Modelle im Anhang |
| Konzept, erste Designs und erste technische Implementierung / Schnittstellen | 5 und 8 |
| Datenbankdesign / ERD | 11; vollständiges physisches Schema im Anhang |
| Änderungen zu Konzept / Plan, Implementierung, Rollen und DB | 12 |
| Funktionales Testkonzept und erste Ergebnisprotokolle | 14–15 |
| Pre-Testergebnisse aus Weihnachtssession | Separat in der technischen Dokumentation, Abschnitt 9.4, eingeordnet. |

**Keine Protokolle einer Weihnachtssession vorhanden (Angabe der Projektgruppe).** Die echten funktionalen Tests werden separat dokumentiert und nicht als Weihnachts-Pretests ausgegeben. Es gibt keine erfundenen Teilnehmer, Fragebögen, Aussagen oder Testergebnisse. Eine menschliche Verständlichkeitsprüfung ist ein eigener möglicher nächster Schritt.

## Belegter Stand und Grenzen

- 591 bestandene Tests der gesamten Repositorysuite mit echtem lokalem PostgreSQL am 25. November; null Fehler, null übersprungen.
- 1.368 definierte Seitenzustände, 60 native Detailzustände und separat 216 isolierte HUD-Darstellungsfälle.
- Zwei echte lokale Kontorunden bestätigen automatischen Open-Run-Eintrag ohne Veröffentlichungsklick und Erhalt nach Reload.
- Zwei Produktionskonten bestätigen Speicherung nach tatsächlichem Render-Neustart; anschließend wurden beide Testkonten und Einträge entfernt. Dieser Beleg gilt für `ed1bf5a`; das Kontenbackend blieb bis zum abschließenden Oberflächenstand `6878dd4` unverändert.
- Finale CI und öffentliche Identität des Quellstands `6878dd4`: drei erfolgreiche Läufe und neun SHA-256-Dateivergleiche.
- Der vollständige native Karrieredurchlauf vom 17. November ist ein historischer Nachweis; kein erneut behaupteter Komplettdurchlauf der Version 3.13.1.

Browserautomation ist keine physische Prüfung jedes Geräts und kein Test mit menschlichen Zielpersonen. Es werden keine medizinischen Wirkungsnachweise behauptet. Teammitgliedernamen wurden nicht erfunden; die bekannte Gruppenzuordnung PG1 wird verwendet.

Das Paket wurde **nicht bei Moodle hochgeladen**. Die Gruppe kann PowerPoint, PDF und das vollständige Paket vor der Abgabe durchsehen und einreichen.

## Reproduzierbarer lokaler Bau

Benötigt: Python mit `python-pptx`, `Pillow`, `Markdown`; LibreOffice; Node.js und das im Repository vorhandene Playwright mit Chromium.

```bash
python3 -m pip install -r docs/projektabgabe-3/requirements-build.txt
python3 docs/projektabgabe-3/build_submission.py
```

Die belegten Bilddateien werden wiederverwendet. Der separate [Screenshot-Aufnehmer](capture_screenshots.cjs) dokumentiert die Aufnahme echter lokaler Browseransichten; er ist für den erneuten Folienbau nicht erforderlich. Der Präsentationsbau greift nicht auf Produktionsdaten zu und kopiert keine Betreiberzugänge.

## Sprechernotizen

### Folie 1

Einstieg, etwa 25 Sekunden. Notification Ninja ist ein tatsächlich spielbarer Browser-Prototyp zum bewussten Umgang mit digitalen Ablenkungen. Das Bild zeigt eine echte lokal gespielte Runde der veröffentlichten Codeversion 3.13.1, keine nachgezeichnete Oberfläche und keine erfundenen Punktwerte. Wir zeigen zuerst das Spiel und dann genau die geforderten Inhalte der Projektabgabe 3. Gruppe PG1. Namen einzelner Gruppenmitglieder werden nicht erfunden.

### Folie 2

Etwa 40 Sekunden. Anders als bei einem reinen Reaktionsspiel ist nicht jedes Objekt ein Ziel. Die aktuelle Situation entscheidet, welche Signale stören und welche wichtig sind. Spielende schneiden per Maus oder Finger. Richtige Entscheidungen bauen Kombos und Super-Energie auf; Fehler verbrauchen Herzen. Open Run hat drei Herzen, keinen Timer und steigende Wellen. Karriere, Training und Tagesaufgaben nutzen dieselbe Grundentscheidung. Das pädagogische Ziel ist eine spielerische Auseinandersetzung mit Aufmerksamkeit. Eine medizinische Wirksamkeit oder durchgeführte Studie wird nicht behauptet.

### Folie 3

Etwa 35 Sekunden. Diese drei Bilder stammen aus der laufenden Anwendung. Der Hub bündelt den aktuellen Ninja, Level, Währung und nächste Mission. Die Karriere organisiert achtzehn Hauptmissionen und acht zusätzliche Aufgaben einschließlich der drei Bosse. Der Basar bündelt Welten, kosmetische Looks und Fähigkeiten. Modi und Welten sind unter Spielen zusammengeführt. Alle Bildinhalte wurden unverändert aus echten Browseransichten aufgenommen; gesperrte Angebote werden nicht als bereits erspielt ausgegeben.

### Folie 4

Etwa 45 Sekunden. Soll und Ist werden konkret verglichen: Einstieg, Konten, Inhalte, Wirtschaft und Bedienbarkeit sind implementiert und unterschiedlich tief getestet. Die Zahlen 18 plus 8 beschreiben den aktuellen Inhaltskatalog. Ein früher vollständiger nativer Karrieredurchlauf stammt vom 17. November und ist nicht als erneuter Komplettdurchlauf der Version 3.13.1 zu lesen. Die 1.368 Seitenzustände sind definierte automatisierte Browserprüfungen. Sie ersetzen weder echte Hardwaretests aller Geräte noch einen Zielgruppen-Pretest. Deshalb bleibt die menschliche Verständlichkeitsprüfung ausdrücklich offen.

### Folie 5

Etwa 40 Sekunden. Links ist ein tatsächlich versionierter früher Illustrationsentwurf zu sehen: dojo-study-v5.svg wurde erstmals am 10. November 2026 im Commit 8e4271c aufgenommen. Er ist ausdrücklich kein historischer Screenshot einer damaligen Benutzeroberfläche. Rechts steht die reale heutige Homepage. Die dokumentierte Indie-Oberflächenumsetzung folgte in Version 3.10.1; die Ausweitung auf die Ansichten ist in ADVENTURE_DESIGN und EXPERIENCE_RELEASE nachvollziehbar. Technisch ist es eine statische HTML-/CSS-/JavaScript-Anwendung mit Canvas und Web Audio, kein bloßer Grafikentwurf.

### Folie 6

Etwa 40 Sekunden. Die Szenarien sind als beobachtbare Abläufe formuliert. Beim Gaststart zählt der verständliche erste Einstieg mit einem ehrlichen Hinweis auf lokale Speicherung. Beim wiederkehrenden Konto müssen Fortschritt und Geld serverseitig konsistent bleiben. Beim Open Run folgt nach einer geeigneten regulär beendeten Kontorunde automatisch die Veröffentlichung des serverbestätigten Ergebnisses. Gast-, Trainings-, vorzeitig beendete oder Adminrunden dürfen keine reguläre Wertung erzeugen. Diese Vorbedingungen und Alternativpfade werden als funktionale Testfälle wieder aufgegriffen.

### Folie 7

Etwa 45 Sekunden. Das vereinfachte Use-Case-Diagramm zeigt Gast, reguläres Spielkonto und das besondere Admin-Testkonto. Gast und reguläres Konto können spielen und trainieren. Der Gast kann ein Konto registrieren. Ein reguläres Konto verwaltet sein Profil, kauft mit servergeprüftem Guthaben und veröffentlicht geeignete Open Runs. Das Admin-Testkonto dient dem eigenen Durchspielen mit Testbudget und ist von Wettbewerb und Wochenprämien ausgeschlossen; es ist kein Portal zur Verwaltung fremder Konten. Das vollständige Diagramm im Anhang zeigt zusätzliche Beziehungen und Alternativpfade. Eine Datenbank wird nicht als menschlicher Akteur ausgegeben.

### Folie 8

Etwa 50 Sekunden. Der Browser enthält Darstellung, Eingabe und eine eigene Instanz des gemeinsamen Spielmodells. Der Node-24-Dienst führt dasselbe Modell unabhängig aus und prüft autoritativ Aktionen und Ergebnisse. Der Client sendet keinen verbindlichen Kontostand und keine verbindlichen Punktwerte. Online wird PostgreSQL über Neon verwendet, während SQLite lokal erhalten bleibt. Render Free liefert den Dienst und die statischen Dateien. Alle gezeigten API-Pfade liegen unter /api/v3; die verkürzten /finish und /publish stehen für /runs/{id}/finish und /runs/{id}/publish. Geheimnisse bleiben auf dem Server. Das Deployment ist separat durch öffentliche Versions- und Dateigleichheitsprüfungen belegt.

### Folie 9

Etwa 40 Sekunden. Dies ist die Hauptsequenz einer gültigen Anmeldung, vereinfacht auf drei Teilnehmer. Der Server lädt die Identität, vergleicht den Passwort-Hash und erstellt bei Erfolg eine begrenzte Sitzung. Der Datenbankwert ist ein Hash des Tokens, nicht das nutzbare Token selbst. Der Browser hält das Sitzungstoken tabbezogen im sessionStorage. GET /me liefert nur den eigenen serverbestätigten Stand. Bei aktiviertem MFA liegt ein zusätzlicher Challenge-Schritt zwischen Passwortprüfung und Sitzung. Registrierung, MFA, Fehlversuche und Logout stehen vollständig im bearbeitbaren Sequenzdiagramm des Anhangs.

### Folie 10

Etwa 50 Sekunden. Der Server erteilt zu Beginn eine Run-ID und einen Seed. Zum Ende sendet der Browser die Eingabefolge. Der Server spielt die Runde deterministisch nach und berechnet das Ergebnis selbst, innerhalb enger Zeit- und Loggrenzen. Danach wird das Ergebnis transaktional mit dem Fortschritt gespeichert. Bei einem neuen geeigneten Open Run eines regulären Kontos ruft der Browser automatisch den bestehenden geschützten Veröffentlichungsendpunkt auf. Die Auto-Ranking-Warteschlange enthält nur kontogetrennte Run-IDs. Zwei echte lokale Kontorunden belegten Eintrag und Erhalt nach Reload ohne Veröffentlichungsklick. Das ist Schutz gegen frei erfundene Clientpunkte, jedoch kein vollständiger Beweis gegen automatisiertes korrektes Spielen.

### Folie 11

Etwa 55 Sekunden. Dieser Ausschnitt zeigt die echten Tabellennamen, Primär- und Fremdschlüssel. Ein Nutzer hat bei atomarer Kontoerstellung genau ein Profil und eine Wallet, mehrere Sitzungen und mehrere Runs. Ein Run erzeugt höchstens einen veröffentlichten verifizierten Score. Inventar, Erfahrung und Karriere liegen im validierten Profil-JSON als TEXT, nicht in einer erfundenen relationalen Inventartabelle und nicht als native JSONB-Spalte. Die Wallet bleibt die maßgebliche Geldquelle. Jeder verifizierte Score verweist zusätzlich direkt auf den Nutzer. Das vollständige physische ERD enthält 14 fachliche Tabellen und drei Migrationstabellen sowie Ledger, idempotente Aktionen, MFA und Wochenpodium. PostgreSQL nutzt serialisierbare Transaktionen mit begrenzten Wiederholungen; SQLite BEGIN IMMEDIATE.

### Folie 12

Etwa 45 Sekunden. Die Änderungen betreffen nicht nur Farben. Die Datenbankentscheidung folgt aus der flüchtigen lokalen Platte eines kostenlosen Hosts: öffentliche Konten brauchen dauerhaften Speicher. Server-Replay ersetzt das Vertrauen auf gesendete Punktzahlen. Navigation und Fähigkeiten werden zusammengeführt. Das automatische Ranking entfernt einen Bedienklick, lässt die Sicherheitsregeln aber unverändert. Die getrennte Admin-Testrolle erlaubt Durchspielen ohne Wettbewerbsvorteil. Aktive Spielzeit und freiwillige Pausen greifen digitale Balance auf; es gibt keine Belohnung fürs bloße Onlinebleiben. Bestehende Inhaltskennungen, Besitzstände und Gastprofile werden nicht pauschal gelöscht oder in verifizierte Kontomittel umgewandelt.

### Folie 13

Etwa 30 Sekunden. Die beiden anderen echten Spielbilder zeigen den blauvioletten Cyber-Gaming-Raum und den ruhigen Mondlicht-Schlafraum. Lern-Dojo, Gaming und Schlaf besitzen eigene Inhalte und Prioritäten. Balance Master wechselt zwischen diesen Kontexten. Die Kataloge enthalten zwölf Looks in fünf kosmetischen Seltenheiten, achtzehn Fähigkeiten einschließlich sechs Supers und sechsunddreißig Erfolge. Diese Zahlen sind nachprüfbare Katalogangaben; die gezeigten Aufnahmen stammen aus regulär gespielten Gastzuständen ohne synthetische Guthaben- oder Profilfreischaltung.

### Folie 14

Etwa 45 Sekunden. Das Konzept verbindet Regeltests, reale HTTP-Integration, Browserbedienung und Persistenz. Positive Fälle zeigen, dass erlaubte Abläufe funktionieren. Negative Fälle prüfen insbesondere unverdiente Belohnungen, manipulierte Geldwerte, doppelte Claims, konkurrierende Käufe und falsche Rollen. Kontentests trennen zwei Identitäten und speichern echte erspielte Änderungen. Ein tatsächlicher Dienstneustart prüft Dauerhaftigkeit statt nur einen Browserreload. Lokale Prozessprüfungen, Browser-Emulation und öffentliche Produktionsprüfungen sind in den Protokollen getrennt. Nach jedem kontrollierten Kontentest werden die Testdaten entfernt. Eine menschliche Usability-Studie wurde dadurch nicht durchgeführt.

### Folie 15

Etwa 65 Sekunden. Dies sind echte Ergebnisprotokolle, keine erfundenen Testpersonen. T01, T02 und T05 stammen aus der Produktionskontenprüfung vom 24. November. Der Render-Neustart ist durch einen Provider-Event belegt. Danach wurden beide Konten und zugehörigen Testeinträge gelöscht. Der Beleg gilt für ed1bf5a; das Kontenbackend blieb bis 6878dd4 unverändert. T03 sind zwei native lokale Kontorunden mit je drei echten Schnitten und null Veröffentlichungsklicks. T06 umfasst 1.368 automatisierte Seitenzustände bei zwei Breiten und zwei Sprachen. T07 enthält 60 native Detailzustände; die 216 separaten HUD-Darstellungsfälle mit langen Werten sind ausdrücklich synthetische Darstellungsfixtures und keine Spielrekorde. Die finale gesamte Repositorysuite mit echtem lokalem PostgreSQL hat 591 bestandene Tests, null Fehler und null übersprungene Tests. Drei finale CI-Läufe sind grün; neun öffentlich ausgelieferte Dateien wurden per SHA-256 verglichen. Die Quelldaten enthalten zu jedem Testfall Soll, Ist, Datum, Methode und Originalnachweis.

### Folie 16

Abschluss, etwa 30 Sekunden. Die Präsentation ordnet jeden geforderten Inhalt der Abgabe einer Folie und ausführlichen Quelle zu. Das Paket enthält bearbeitbare Folien, gleichlautende PDF, technische Dokumentation, vollständige editierbare Diagramme, echte Spielbilder und nachvollziehbare Testprotokolle. Als künftiger eigener Qualitätsschritt ist eine menschliche Verständlichkeitsprüfung sinnvoll; es werden weder bereits beteiligte Menschen noch angebliche Ergebnisse erfunden. Die Live-Demo ist verlinkt. Die Dateien sind vorbereitet, wurden aber nicht bei Moodle eingereicht.
