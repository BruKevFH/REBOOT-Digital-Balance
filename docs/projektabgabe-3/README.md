# Projektabgabe 3 – Notification Ninja

**Gruppe:** PG1 · **Lehrveranstaltung:** 26W-B5-Telehealth / Med. Info Projekt<br>
**Abgabe:** Donnerstag, 26. November 2026, 21:00 Uhr (Europe/Vienna)<br>
**Bearbeitungsstand:** 25. November 2026

## Dateien

**Öffentliche Demo:** [Notification Ninja öffnen](https://notification-ninja-accounts.onrender.com/).

- [slides.pptx](slides.pptx): bearbeitbare Kurzpräsentation mit 14 Folien und Sprechernotizen; etwa 8–10 Minuten.
- [slides.pdf](slides.pdf): gleichlautende PDF zum schnellen Prüfen und Präsentieren.
- [technical-documentation.pdf](technical-documentation.pdf): selbstständige PDF der Dokumentation mit Vektor-Diagrammanhang.
- [submission.zip](submission.zip): gesamtes Abgabepaket ohne Zugangsdaten oder interne temporäre Dateien.
- [technical-documentation.md](technical-documentation.md): technische Dokumentation mit Soll/Ist, Szenarien, Schnittstellen, ERD und Testkonzept.
- [diagrams/](diagrams/): bearbeitbare Mermaid-Quellen; vollständige Modelle ergänzen die vereinfachten Foliengrafiken.
- [build_submission.py](build_submission.py): lokaler Präsentationsbau mit [Build-Abhängigkeiten](requirements-build.txt).
- [assets/submission-status.json](assets/submission-status.json): nur öffentliche Statusangaben, keine Zugangsdaten.

Die Präsentation enthält tatsächliche Screenshots des lokalen Entwicklungskandidaten. Sie sind weder Design-Mock-ups noch ein öffentlicher Deploymentnachweis. Alle Diagramme und Texte sind bearbeitbar. Es wurden keine fremden geschützten Assets hinzugefügt. Die Spielgrafiken stammen aus dem Repository.

## Was vor dem Einreichen ergänzt werden muss

1. Tatsächliche Gruppenmitglieder, Vortragende und gegebenenfalls geforderte Hochschulvorlage ergänzen.
2. Vorhandene **echte Protokolle der Weihnachtssession** beilegen. Im Repository sind keine entsprechenden Ergebnisse nachgewiesen; die Präsentation kennzeichnet diese Lücke ausdrücklich.
3. Den tatsächlich erreichten Release-/Deploymentstand anhand des [Erweiterungsberichts](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/main/notification-ninja/EXPANSION_3_13.md) abgleichen. Lokale Tests dürfen nicht als öffentlicher Persistenznachweis ausgegeben werden.
4. Folien und technische Dokumentation durchsehen und bei Moodle selbst einreichen. **Es wurde nichts bei Moodle hochgeladen.**

## Nachweise und Grenzen

Die historischen Karriere-/Modusläufe vom 17. November sind im [Spielaudit](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/main/notification-ninja/FULL_GAME_AUDIT.md) beschrieben. Die Erweiterung, ihre Integrationszwischenstände und abgeschlossenen Freigaben stehen im [Erweiterungsbericht](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/main/notification-ninja/EXPANSION_3_13.md). Der Stand dieser Präsentation lautet:

- 3.13.1 veröffentlicht; finale CI und öffentliche Versionsprüfung bestanden
- 591 bestandene automatisierte Tests, null Fehler, null übersprungen: Repository-Gesamtsuite mit echtem lokalem PostgreSQL, 25. November 2026.
- Finale CI, öffentliche Dateigleichheit und Konto-/Neustartprüfung bestanden.
- Geprüfter Quellstand: 6878dd4bc8717d48f257d5b89c17868c355fc2bd.

Funktionale Browserautomation ersetzt keine Tests mit echten Jugendlichen. Es wurden keine erfundenen Fragebögen, Teilnehmerzahlen, medizinischen Wirkungsnachweise oder Weihnachtssession-Ergebnisse aufgenommen. Eine physische iPhone-/Android-Abnahme und ein rechtlicher Datenschutzcheck sind gesonderte Aufgaben.

## Lokal neu erzeugen

Benötigt werden Python mit `python-pptx`, `Pillow` und `Markdown` sowie LibreOffice für den Folien-PDF-Export. Die Dokumentations-PDF benötigt Node.js und das bereits im Repository vorhandene Playwright mit Chromium. Aus dem Repository:

```bash
python3 -m pip install -r docs/projektabgabe-3/requirements-build.txt
python3 docs/projektabgabe-3/build_submission.py
```

Ohne LibreOffice kann die bearbeitbare Datei mit `--skip-pdf` erzeugt werden. Vorhandene Assets werden wiederverwendet; neue lokale QA-Screenshots werden, falls vorhanden, übernommen. Es erfolgen keine Netzwerkanfragen, keine Änderungen an Produktionsdaten und keine Übertragung privater Betreiberzugänge.

## Sprechernotizen

### Folie 1

Dauer ca. 30 Sekunden. Wir stellen den aktuellen Stand von Notification Ninja vor. Das Spiel übt den Umgang mit Ablenkungen durch kontextabhängige Entscheidungen. Die Präsentation trennt den veröffentlichten Ausgangsstand 3.12.0 vom auf main eingecheckten Basisstand 3.13.0 und der veröffentlichten Version 3.13.1. Die finale CI und öffentliche Versionsprüfung des Quellstands 6878dd4 sind bestanden. Die reale Zwei-Konten-/Neustartprüfung des unveränderten Kontenbackends bleibt dem gesondert belegten Quellstand ed1bf5a zugeordnet. PG1 ist die übermittelte Gruppenzuordnung; Namen und Aufgaben einzelner Teammitglieder wurden nicht erfunden. Alle gezeigten Spielbilder stammen aus dem tatsächlichen Projekt.

### Folie 2

Dauer ca. 35 Sekunden. Unser Beispiel ist eine lernende Person, die nicht alle Benachrichtigungen gleich behandeln sollte. Derselbe Inhalt kann in einem anderen Kontext wichtig sein. Deshalb liest man zuerst das Ziel, schneidet Ablenkungen und lässt hilfreiche Hinweise durch. Die drei Räume sind Lernen, Gaming und Schlafen; Balance Master kombiniert sie. NIM begleitet die Einführung. Wir stellen keine medizinische Wirksamkeit in Aussicht. Bewusstes Beenden ist ausdrücklich ein positiver Bestandteil und kein Scheitern.

### Folie 3

Dauer ca. 40 Sekunden. Die Tabelle zeigt den Unterschied zwischen implementiert, tatsächlich getestet und öffentlich freigegeben. Der historische Durchlauf hat alle 26 Karriereaufgaben ohne geschenkte Fortschritte abgeschlossen. Der abschließende Seitenrundgang hat 1.368 Zustände bei zwei Breiten und zwei Sprachen bestanden. Die separate Designmatrix umfasst 132 Ansichten in drei Designs; 60 zusätzliche Abläufe prüfen aufklappbare Details. Die neue Erweiterung besitzt 18 Fähigkeiten einschließlich sechs Supers sowie 36 Erfolge. Zwei öffentliche Testkonten haben die vorbereitete Prüfung nach einem separat belegten Render-Neustart bestanden und wurden anschließend entfernt. Die abschließende CI, die öffentlichen API-/Gastprüfungen und die Bytegleichheit von neun ausgelieferten Dateien sind für 6878dd4 erfolgreich belegt. Die genaue Versions- und Freigabeinformation liegt im Erweiterungsbericht.

### Folie 4

Dauer ca. 35 Sekunden. Szenario eins: Eine neue Person probiert das Spiel als Gast und beginnt mit Einführung oder Training. Szenario zwei: Eine registrierte Person meldet sich auf einem anderen Gerät an und erhält ihren serverseitigen Fortschritt. Im Hub gibt es einen dominanten Spielen-Button. Welten und Modi sind gemeinsam erreichbar. Nach einem Lauf sieht man Ergebnis und Rückblick; einmalige Belohnungen werden bewusst abgeholt. Spielstände und Navigationszustände bleiben bei normalen Übergängen erhalten.

### Folie 5

Dauer ca. 35 Sekunden. Das Diagramm zeigt die wichtigsten Systemrollen; das sind keine erfundenen Zuständigkeiten einzelner Teammitglieder. Gäste können ohne Anmeldung üben, spielen und Looks ansehen. Kontospieler erhalten die abgesicherten Serveraktionen für Käufe, Fortschritt und Ranglisten. Das Admin-Testkonto besitzt ein serverseitiges Testbudget, verwendet aber weiterhin echte Kauf- und Missionsregeln. Es ist ausdrücklich von Wettbewerb und Wochenprämien ausgeschlossen. Die vereinfachte Folie zeigt die wichtigsten Zuordnungen; Kontospieler und Admin können ebenfalls die allgemeinen Spiel- und Übungsfunktionen verwenden. Vollständige Use-Case-Quellen liegen als Mermaid vor.

### Folie 6

Dauer ca. 40 Sekunden. Die Darstellung folgt dem echten Code: Ein statisches JavaScript-Frontend nutzt Canvas für das Spiel. Das Node-24-Backend bietet die API v3. Spielregeln und Kataloge werden sowohl im Browser als auch zur Serverprüfung verwendet. Der PostgreSQL-Adapter ist für dauerhafte Online-Daten vorgesehen; SQLite bleibt lokal verfügbar. Beide verwenden Migrationen und Constraints. Kontositzungen werden als opaque Bearer-Token nur im sessionStorage des Tabs gehalten. Der Server speichert Token-Hashes. Ein Gastprofil ist davon getrennt.

### Folie 7

Dauer ca. 40 Sekunden. Bei der Registrierung kommen Benutzername, private E-Mail, Passwortbestätigung und Datenschutz-Zustimmung hinzu. Die Anmeldung prüft den scrypt-Hash. Bei aktivierter Zwei-Faktor-Authentifizierung wird zunächst eine kurzlebige Challenge statt einer Sitzung ausgegeben. Erst nach erfolgreicher Prüfung entsteht die Sitzung. Auf dem Server liegt nur der Token-Hash, im Browser nur das Token im Tab-Speicher. Wiederherstellungscodes sind einmalig; Logout und Kontolöschung werden tatsächlich serverseitig ausgeführt.

### Folie 8

Dauer ca. 40 Sekunden. Der Browser nennt die gewünschte bekannte Inhaltskennung, aber bestimmt weder Preis noch Guthaben. Der Server prüft Voraussetzungen und vorhandenen Besitz. Wallet, Inventar im validierten Profil und Ledger werden innerhalb derselben Transaktion verändert. Idempotenzschlüssel verhindern doppelte Käufe oder Belohnungen bei Wiederholung. PostgreSQL verwendet serialisierbare Transaktionen mit begrenzten Wiederholungen; SQLite hat denselben fachlichen Vertrag. Administrative Testmittel werden ebenfalls nur serverseitig aus einer vertrauenswürdigen Rolle abgeleitet.

### Folie 9

Dauer ca. 40 Sekunden. Der Seed und der Startzustand stammen vom Server. Der Browser protokolliert begrenzte Eingaben; die API berechnet das Ergebnis mit denselben Regeln erneut. Sie übernimmt keine frei eingesendete Punktzahl. Nur echte, durch verbrauchte Herzen beendete Open Runs sind für die Rangliste freigegeben. Bewusste Abbrüche und Gäste bleiben ungewertet. Seit 3.13.1 werden neue geeignete Kontorunden nach einem Hinweis vor dem Start automatisch eingetragen. Der Browser verwendet weiterhin den geschützten Veröffentlichungspfad. Eine kontogetrennte Warteschlange hält ausschließlich Run-IDs für Wiederholungen fest und scannt keine historischen Resultate. Diese Replay-Prüfung verhindert einfache Scorefälschung, ist aber keine vollständige Abwehr gegen automatisiertes Spielen.

### Folie 10

Dauer ca. 40 Sekunden. Die zentrale Entität ist users. Ein Konto kann mehrere Sitzungen und MFA-Challenges haben; Profil und Wallet sind jeweils eins zu eins zugeordnet. MFA ist optional. Das Profil ist bewusst ein validiertes JSON-Objekt in einer TEXT-Spalte, keine frei editierbare Sammlung beliebiger Eigenschaften. Inventar und Karrierefortschritt besitzen deshalb keine künstlich erfundene relationale Inventartabelle. Passwörter und Wiederherstellungsschlüssel liegen als Hash vor; MFA-Geheimnisse sind geschützt. Detaillierte Kardinalitäten und weitere Felder stehen im vollständigen ERD.

### Folie 11

Dauer ca. 40 Sekunden. Diese zweite Sicht ergänzt Wirtschaft und Wettbewerb. Die Wallet ist die autoritative Geldquelle; Ledgerreferenzen und Aktionsschlüssel sind eindeutig. Ein Run kann höchstens einen verifizierten Score erzeugen. Podiumsplätze werden nach dem UTC-Wochenwechsel transaktional eingefroren. Rewards referenzieren Woche und Konto. Die gespeicherte run_id im Reward ist eine historische Snapshot-Angabe und absichtlich kein Fremdschlüssel. Die vollständige Quelle enthält außerdem Wettbewerbs-Einstellungen und die getrennte Admin-Rollentabelle. Drei technische Migrationstabellen verwalten das Schema; sie sind keine fachlichen Spielobjekte.

### Folie 12

Dauer ca. 35 Sekunden. Im ursprünglichen Bestand war der externe Dienst lediglich ein Ranglistenserver. Das weiterentwickelte Konzept ergänzt sichere Konten und dauerhafte Daten. In der Gestaltung werden Spielwelten und Modi gemeinsam zugänglich; Fähigkeiten sind Teil des Basars. Seltenheit ist rein kosmetisch und wird nicht nur durch Farbe erklärt. Bestandsdaten werden nicht gelöscht und lokale Gastmünzen werden nicht zu verifizierten Kontomitteln. Spielzeit zählt ausschließlich aktive sichtbare Runden auf dem Gerät; Pausenerinnerungen sind freiwillig und geben keine Belohnung für längere Bindung.

### Folie 13

Dauer ca. 45 Sekunden. Das Testkonzept kombiniert Modell- und Sicherheitstests mit HTTP-Integration und echter Browserbedienung. Besonders relevant sind negative Fälle: gefälschte Rollen, doppelte Belohnungen und unzureichendes Guthaben. Zwei unabhängige Konten prüfen Trennung und Persistenz nach einem echten Prozessneustart. Historisch wurden alle 26 Karriereaufgaben nativ durchgespielt. Die neuen Supers wurden über echte Entscheidungen aufgeladen und mit ihren sichtbaren Buttons ausgelöst. Die finale automatisierte Gesamtsuite am 25. November mit echtem lokalem PostgreSQL besteht aus 591 bestandenen Repositorytests. Dazu kommen 1.368 Seitenzustände und 60 kurze Detailabläufe. Zwei native Kontorunden bestätigen automatische Veröffentlichung ohne zusätzlichen Klick; 216 isolierte HUD-Fälle prüfen lange Werte und Lesbarkeit. Die neue Browsermatrix und die bestandene öffentliche Zwei-Konten-/Neustartprüfung bleiben getrennte Nachweise. Eine Bot-Abnahme belegt Funktion, nicht die intuitive Verständlichkeit für Jugendliche.

### Folie 14

Dauer ca. 35 Sekunden. Die nächsten Schritte sind klar getrennt. Build, finale CI und öffentliche Versionsprüfung sind erfolgreich abgeschlossen. Die öffentliche Zwei-Konten-/Neustartprüfung ist für ed1bf5a separat belegt; am Kontenbackend hat sich mit der abschließenden Oberflächenkorrektur nichts geändert. Für 6878dd4 bestätigen die öffentliche API-/Gastprüfung und neun SHA-256-Dateivergleiche den ausgelieferten Stand. Für die Lehrveranstaltungsabgabe müssen die tatsächlichen Gruppenmitglieder und Vortragenden ergänzt werden. Im Repository liegt kein Protokoll einer Weihnachtssession vor. Daher enthält das Paket ein Testkonzept und echte erste Ergebnisse, aber keine erfundenen Pre-Testergebnisse. Das Paket wurde nicht automatisch bei Moodle eingereicht. Abgabeschluss ist Donnerstag, der 26. November um 21 Uhr Wiener Zeit.
