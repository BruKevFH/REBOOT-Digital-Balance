# Projektabgabe 3 – Notification Ninja

**Gruppe:** PG1 · **Stand:** 25. November 2026 · **Abgabe:** 26. November 2026, 21:00 Uhr (Europe/Vienna)

Repository: [BruKevFH/REBOOT-Digital-Balance](https://github.com/BruKevFH/REBOOT-Digital-Balance), Branch `main`. Der finale **3.13.1-Korrekturstand** ([`6878dd4`](https://github.com/BruKevFH/REBOOT-Digital-Balance/commit/6878dd4bc8717d48f257d5b89c17868c355fc2bd)) baut auf dem bereits öffentlich geprüften **3.13.1-Stand** ([`ed1bf5a`](https://github.com/BruKevFH/REBOOT-Digital-Balance/commit/ed1bf5a00b5fdd93f39446e0a7adadf08852bf3c)) und dem **3.13.0-Basisstand** ([`f2fadcd`](https://github.com/BruKevFH/REBOOT-Digital-Balance/commit/f2fadcd28a08e0eaef0a5d5019cdb66a7ad5936e)) auf. Die frühere Ausgangsversion war 3.12.0. Am 25. November bestehen 591 Repositorytests, 1.368 frisch geprüfte Seitenzustände und 60 zusätzliche Detailabläufe ohne Fehler. Die unabhängige Haupt-CI, die Asseterzeugung und die öffentliche Gast-/API-/Versionsprüfung sind für 6878dd4 erfolgreich abgeschlossen. Neun kanonisch ausgelieferte Dateien stimmen per SHA-256 mit dem geprüften Checkout überein. Zusätzlich sind für ed1bf5a zwei Produktionskonten nach einem separat belegten Render-Neustart erhalten geblieben und anschließend vollständig entfernt worden. Das Kontenbackend blieb beim abschließenden Darstellungs-/Übersetzungs-/Prüfskript-Update unverändert. Der zunächst fehlgeschlagene allgemeine CI-Zwischenstand und der erfolgreiche abschließende Korrekturlauf werden getrennt dokumentiert.

**Öffentliche Demo:** [Notification Ninja öffnen](https://notification-ninja-accounts.onrender.com/) · **API:** `https://notification-ninja-accounts.onrender.com/api/v3`

## 1. Projektidee, Ziel und Abgrenzung

Notification Ninja ist ein Browserlernspiel zur digitalen Balance. Der Spieler schneidet ablenkende Benachrichtigungen weg und lässt hilfreiche Signale durch. Was hilfreich ist, hängt vom aktuellen Ziel ab: Lernen, Gaming oder Schlafen. Ein sichtbarer Zielwechsel verlangt eine neue Entscheidung. Das Spiel verbindet diese kontextabhängigen Entscheidungen mit einer Karriere, Bossen, kosmetischen Ninja-Looks und einem Basar.

Das Lernziel ist, Aufmerksamkeit, persönliche Grenzen und bewusste Pausen spielerisch zu reflektieren. Das System verarbeitet simulierte Benachrichtigungen innerhalb des Spiels. Es liest keine echten Smartphone-Benachrichtigungen aus, misst keine sonstige Gerätenutzung und bietet keine klinische Diagnostik oder Behandlung. Ein medizinischer Nutzen oder ein nachgewiesener Lerneffekt wird durch die vorhandenen Funktionstests nicht belegt.

**Zielgruppe:** Jugendliche und andere Interessierte an digitaler Balance; eine verbindlich festgelegte Altersgruppe und eine wissenschaftliche Evaluation liegen in den geprüften Projektdateien nicht vor. **Plattform:** moderner Browser auf Desktop, Tablet oder Smartphone, mit Maus beziehungsweise Touch. Deutsch und Englisch sowie die Designs Relaxed, Dark und Noir sind vorgesehen. Ein Gastspiel muss auch ohne freiwilliges Onlinekonto möglich bleiben.

## 2. Soll-/Ist-Vergleich

Der Sollstand wurde aus den vorliegenden Entwicklungsaufträgen abgeleitet. „Implementiert“ meint den vorhandenen Quellcode; die konkreten Abnahmen und ihre Grenzen stehen in Abschnitt 9. Diese Tabelle ersetzt keine nachträglich erfundene frühere Projektplanung.

| ID | Soll | Ist am Dokumentationsstand | Offene Abnahme / nächster Schritt |
|---|---|---|---|
| R01 | Klarer Weg Homepage → Einstieg → Ninja-Hub | Öffentliche Homepage, Gast-, Registrierungs- und Loginwege; Hub mit Ninja, XP, Münzen und nächster Mission. Neue 132-Zustände-Matrix bestanden. | 1.368 Seitenzustände sowie finale unabhängige CI und öffentliche Versionsabnahme bestanden. |
| R02 | Wenige verständliche Hauptziele | Übersicht, Spielen mit Modi/Welten, Karriere, Basar und Rangliste. Fähigkeiten sind im neuen Basar enthalten; neue Oberflächenmatrix bestanden. | 1.368 Seitenzustände plus 60 aufklappbare Detailabläufe bestanden. |
| R03 | Konten und dauerhafter Fortschritt | Node-v3-API, optionales MFA, PostgreSQL-Adapter; SQLite bleibt lokal nutzbar. | Öffentliche Zwei-Konten-/Neustartprüfung für ed1bf5a bestanden; aktueller unveränderter API-Stand unter 6878dd4 öffentlich verifiziert. |
| R04 | Sicherer Umgang mit Geld und Besitz | Serverseitige Preise, Voraussetzungen, Wallet, Ledger und idempotente Aktionen; aktuelle Zwei-Konten-/Neustartabnahme in beiden Adaptern bestanden. | Öffentlicher Kauf mit verdienten Mitteln und Wiederholungsprüfung bestanden; Freigabestand konkret zuordnen. |
| R05 | Vier optisch passende Spielwelten | Lernen, Gaming, Schlafen und Balance Master; Basar verwendet dieselbe kanonische Weltkunst; neue Ansichten in DE/EN, drei Designs und zwei Breiten geprüft. | Zusätzliche reale Geräte und subjektive Bild-/Lichtwirkung evaluieren. |
| R06 | Sichtbare Würfe und präzise Entscheidungen | Canvas-Ninjas, Flugbahnen, Wischkollisionen, Spuren, Partikel und Kombos. | Reale Geräte, Bildrate und subjektives Spielgefühl weiter evaluieren. |
| R07 | Open Run mit drei Herzen ohne Zeitlimit | Langsamer Einstieg, steigende Wellen; gekaufte Kräfte deaktiviert. Neue geeignete Kontorunden werden nach Server-Replay automatisch eingetragen. | Öffentliche geprüfte Wertung und Neustartpersistenz bestanden; automatische native Clientbedienung separat lokal belegt. |
| R08 | 18 Hauptmissionen und acht Zusatzaufgaben | 26 Aufgaben einschließlich drei Bossen mit unterschiedlichen Mechaniken vorhanden. | Historisch alle 26 nativ abgeschlossen; finale Missionsdetails und Sperrgründe in der Seitenprüfung bestanden. |
| R09 | Weitere eigenständige Modi | Boss Rush, serverdatierte Tages-Challenge und wertungsfreies Training. | Tageswechsel/Regeln automatisiert geprüft; echte nächste Tages-/Wochenwechsel im öffentlichen Betrieb beobachten. |
| R10 | Individualisierung und Fortschritt | 12 Looks, fünf kosmetische Seltenheiten, 18 Fähigkeiten, sechs Supers und 36 Erfolge implementiert. | Kataloge, echte Kaufwege und Darstellungen geprüft; subjektive Wirkung mit Zielgruppe evaluieren. |
| R11 | Bewusster Umgang mit Spielzeit | Aktive lokale Gesamt-, Tages- und Sitzungszeit; freiwillige Erinnerungen nach 10/15/20/30 aktiven Minuten. | Zählt keine frühere oder fremde Gerätenutzung; keine geräteübergreifende Statistik. |
| R12 | Verständlicher erster Einstieg | Eigene 20-Sekunden-Canvas-Erzählung aus Ninja-Perspektive, überspringbar und bei reduzierter Bewegung manuell. | Kein MP4-Video; Stimme abhängig vom Browser. Verständlichkeit mit Zielgruppe testen. |
| R13 | Wöchentliche Top-3-Belohnungen | UTC-Abschluss und einmaliger Claim über 100/60/30 Münzen implementiert. | Funktion bereitgestellt; echte erste abgeschlossene Produktionswoche noch abzuwarten. Keine rückwirkenden Altprämien. |
| R14 | Privater Betreiberzugang zum Testen | Serverrolle und wieder aufgefülltes Testbudget; Ausschluss aus öffentlicher Wertung. | Privater Bootstrap vor dem Serverstart eingerichtet; interaktive Produktionsanmeldung dieses Betreiberkontos nicht geprüft. Keine Zugangsdaten in Abgabe. |
| R15 | Adresse ohne Repositorynamen | Bestehender Kontodienst kann Homepage und Spiel direkt an `/` ausliefern. Gasttransfer zwischen den Ursprüngen implementiert. | Kanonische Wurzeladresse im öffentlichen Gastlauf bestanden; Gastimport separat mit isoliertem Ursprungsrouting geprüft. |
| R16 | Qualität auf allen vorgesehenen Geräten | Reproduzierbare automatisierte Tests, native Browserläufe und DE/EN-Seitenmatrix vorhanden. | Keine Garantie für jeden Browser oder jedes reale Gerät; Zielgruppen-Pretest ausstehend. |

## 3. Szenarien und Use Cases

### S1 – Ohne Konto anfangen

Eine neue Spielerin öffnet die Homepage und wählt den Gastzugang. Ein kurzes Intro erklärt die Ninja-Perspektive; sie kann es jederzeit überspringen. Im Training lernt sie Schneiden und Durchlassen. Danach führt der Hub zur nächsten Mission. Der Gastfortschritt bleibt im Browser auf diesem Gerät. Das Löschen des Browserspeichers oder ein anderer Ursprung stellt diesen lokalen Spielstand nicht automatisch wieder her.

### S2 – Konto verwenden und fortsetzen

Ein Spieler registriert sich mit Namen, E-Mail, Passwortbestätigung und ausdrücklicher Datenschutz-Zustimmung. Er bewahrt den einmalig angezeigten Wiederherstellungscode auf. Nach späterer Anmeldung lädt der Browser den serverseitigen Fortschritt. Ein zweites Konto erhält einen eigenen Kontostand und eigene Daten. Ein Gastguthaben wird beim Wechsel nicht zu geprüftem Kontoguthaben. Bei aktiviertem MFA genügt das Passwort allein nicht für die Anmeldung.

### S3 – Eine Fähigkeit im Basar kaufen

Der Spieler wählt „Basar → Fähigkeiten“. Nach dem Antippen einer Technik nennt die Karte deren Wirkung; Preis und fehlende Vorgänger bleiben schon zuvor sichtbar. Nach Bestätigung prüft der Server Sitzung, Katalogeintrag, Voraussetzungen, Besitz und Geld. Bei Erfolg werden Besitz, Geldbewegung und Wiederholungskennung gemeinsam gespeichert. Ein Doppelklick oder eine wiederholte Anfrage bezahlt denselben Kauf nicht zweimal. Bei fehlendem Geld bleibt der Zustand unverändert.

### S4 – Einen fairen Open Run automatisch eintragen

Vor dem Start sieht der angemeldete Spieler den Hinweis auf die automatische Rangliste unter seinem Ninja-Namen. Der Server gibt Seed und Anfangszustand des Open Runs vor. Der Browser protokolliert begrenzte Modellbefehle, während der Spieler tatsächlich wischt. Nach drei verlorenen Herzen beendet sich die Runde. Der Server spielt das Protokoll mit denselben Regeln nach und berechnet das Ergebnis selbst. Für einen neuen geeigneten Kontorun ruft der Browser danach automatisch den weiterhin geschützten Veröffentlichungspfad auf. Eine kontogetrennte Warteschlange speichert ausschließlich Run-IDs lokal und wiederholt ausstehende Anfragen nach Anmeldung, wiederhergestellter Verbindung oder erneutem Versuch. Der Server prüft weiterhin Besitzer, Regelwerk, gültiges Ende, positive Punkte und Rolle. Historische Resultate werden nicht gesammelt nachveröffentlicht; Gäste, vorzeitig beendete Runden und Admin-Testläufe bleiben ungewertet.

### S5 – Gesperrte Zusatzmission verstehen

Die Spielerin öffnet eine gesperrte Mission. Die Detailansicht nennt die erforderliche Spielwelt und die zuerst abzuschließenden Aufgaben. Der Start bleibt gesperrt, bis die kanonischen Bedingungen erfüllt sind. Der Hinweis soll eine konkrete nächste Handlung ermöglichen, statt nur „gesperrt“ anzuzeigen.

### S6 – Spielzeit bewusst begrenzen

Ein Spieler aktiviert eine Erinnerung nach 15 aktiven Minuten. Menüzeit, Pausen und verborgene Tabs erhöhen den Zähler nicht. Die Erinnerung bietet eine freiwillige Pause oder späteres Erinnern. Sie beendet die Runde nicht zwangsweise und vergibt keine Belohnung für längeres Spielen. In den Einstellungen kann die Erinnerung angepasst oder abgeschaltet werden.

| Use Case | Akteur | Vorbedingung | Erfolgreiches Ergebnis | Wichtiger Alternativpfad |
|---|---|---|---|---|
| UC01 Gastspiel starten | Gast | Browser unterstützt Anwendung | Lokales Profil und nutzbarer Hub | Blockierter Speicher: ehrlicher Hinweis auf begrenzte Speicherung. |
| UC02 Registrieren | Gast | Freier Name/E-Mail, gültige Eingaben | Konto, Profil, Wallet und Sitzung atomar erstellt | Ungültige Zustimmung/Bestätigung oder doppelte Identität abgewiesen. |
| UC03 Anmelden/Abmelden | Spieler | Bestehendes Konto | Gültige Sitzung bzw. Widerruf | Falsche Zugangsdaten; abgelaufene Sitzung; optionaler MFA-Schritt. |
| UC04 Mission spielen | Gast/Spieler | Welt und Missionsvorgänger vorhanden | Ergebnis und verdienter Fortschritt | Fehlende Voraussetzung erklärt; Verlassen ausdrücklich bestätigen. |
| UC05 Kaufen/Claimen | Spieler | Sitzung und erfüllte Bedingungen | Einmalige atomare Zustandsänderung | Gleichzeitige/erneute Anfrage ohne Doppelgutschrift. |
| UC06 Run automatisch eintragen | Spieler; Browser führt Folgeaktion aus | Neuer eigener geprüfter geeigneter Open Run; Hinweis vor Start | Ein öffentlicher serverbestätigter Eintrag | Verbindungsausfall: Run-ID bleibt vorgemerkt; Fälschung, vorzeitiges Ende oder Adminrolle abgewiesen. |
| UC07 Wochenprämie | Spieler | Eingefrorene eigene Top-3-Platzierung | Einmalig 100/60/30 Münzen | Bereits abgeholt, falsche Woche oder keine Platzierung. |
| UC08 Profil/Konto verwalten | Spieler | Authentifiziert; sensible Aktion bestätigt | Eigene Daten ändern oder Konto löschen | Fremde IDs oder fehlende Passwortbestätigung abgewiesen. |
| UC09 Admin-Testkonto einrichten | Betreiber | Privater Betreiberzugang | Eigene serverseitige Testrolle und Budget | Gleichnamiges normales Konto wird nicht übernommen. |

**Use-Case-Diagramm:** [Ansicht als SVG](diagrams/02-use-cases.svg) · [bearbeitbare Mermaid-Quelle](diagrams/02-use-cases.mmd). Es verwendet UML-Akteure, ovale Use Cases, Systemgrenze sowie `include`/`extend`, dargestellt mit Mermaids Flowchart-Notation. Eine automatische Wartungsaufgabe oder die Datenbank wird nicht als menschlicher Akteur ausgegeben. Das Admin-Testkonto ist kein allgemeines Verwaltungsportal für fremde Konten.

## 4. Konzept, erste Designs und aktueller Entwurf

Die visuelle Grundlage ist ein japanisch inspiriertes Indie-Dojo: cremefarbene Papierflächen, Mint, Koralle, Gold und Lavendel, dunkle Konturen, Sakura, Laternen und eigens verwendete Spielgrafiken. Die Homepage führt verständlich ins Spiel; dieselbe Bildsprache soll Hub, Karriere, Basar und Modi verbinden. Die vorliegenden Referenzbilder und die frühen veröffentlichten Seiten sind Entwurfsstände, keine automatische Garantie einer pixelgenauen Übereinstimmung auf jedem Seitenverhältnis.

Die vorhandenen Entwurfsetappen sind nachvollziehbar abgelegt: [Designvorgabe/Masterprompt](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/6878dd4bc8717d48f257d5b89c17868c355fc2bd/notification-ninja/DESIGN_MASTERPROMPT.md), [erste dokumentierte Umsetzung der Indie-Referenz in 3.10.1](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/6878dd4bc8717d48f257d5b89c17868c355fc2bd/notification-ninja/DESIGN_IMPLEMENTATION.md), [Ausweitung auf die übrigen Ansichten in 3.11](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/6878dd4bc8717d48f257d5b89c17868c355fc2bd/notification-ninja/ADVENTURE_DESIGN.md) und [Erlebnis-/Karriereausbau in 3.12](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/6878dd4bc8717d48f257d5b89c17868c355fc2bd/notification-ninja/EXPERIENCE_RELEASE.md). Die [Art-Dokumentation](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/6878dd4bc8717d48f257d5b89c17868c355fc2bd/notification-ninja/assets/INDIE_ART.md) ordnet die lokalen Banner-, Welt-, Szenen- und Landschaftsatlanten zu. Damit werden frühe Entwurfsentscheidungen und spätere technische Umsetzung getrennt sichtbar; die Abgabe erfindet keine zusätzlichen Interviews oder Papierprototypen.

Der aktuelle Entwurf bündelt „Modi“ und „Welten“ unter „Spielen“. Die drei thematischen Dojos besitzen eigene Farb- und Lichtstimmungen; Balance Master kombiniert die Entscheidungskontexte. Der Basar enthält Welten, Looks und Fähigkeiten. Seltenheit wird mit Text und Symbol zusätzlich zur Farbe erklärt und verändert keine Ranglistenregel. Gesperrte Missionen haben lesbare Voraussetzungen. NIM bietet kurze, überspringbare Erklärungen.

Animation und Klang dienen Rückmeldung und Atmosphäre. Reduzierte Bewegung, stumme Wiedergabe, getrennte Lautstärken und ausreichende Lesbarkeit bleiben Bedienanforderungen. Touchziele, kleine Höhen und breite Displays müssen mitgeprüft werden. Die Designprüfung erfolgt daher anhand tatsächlicher Seitenzustände und Screenshots, nicht nur anhand eines einzelnen Mock-ups.

## 5. Technische Architektur und Schnittstellen

**Systemdiagramm:** [Ansicht als SVG](diagrams/01-systemkontext.svg) · [bearbeitbare Mermaid-Quelle](diagrams/01-systemkontext.mmd). Browser und Server besitzen getrennte Instanzen des gemeinsamen Spielmodells; der Server ruft kein Spielobjekt im Browser auf.

Der Client ist eine statische HTML-/CSS-/JavaScript-Anwendung mit Canvas 2D und Web Audio. `src/main.js` koordiniert Ansichten, Navigation und Spielzustand. Das kanonische Spielmodell liegt in `src/game.js`; Fortschritt, Missionen und Kataloge sind getrennte Module. Der Build bündelt die Einstiegsmodule mit esbuild. Ein Service Worker unterstützt das Offline-Gastspiel. Ein Downloadpaket enthält kein dauerhaftes Accountbackend.

`src/accounts.js` kapselt die v3-HTTP-Aufrufe. Sitzungstokens bleiben im `sessionStorage` des Tabs. Die kontogetrennte Auto-Ranking-Warteschlange in `src/auto-ranking.js` speichert dagegen ausschließlich Run-Kennungen im `localStorage`, keine Tokens oder Punkte. Sie kann über eine erneute Anmeldung hinweg ausstehende Veröffentlichungen nachholen. Ein kontogebundener Cache ersetzt nicht den maßgeblichen Serverzustand. Das Gastprofil bleibt getrennt im lokalen Browserspeicher. Die neue Spielzeitstatistik ist gerätebezogen und hat keine eigene Datenbanktabelle.

Der Node.js-24-Server liefert statische Dateien und `/api/v3`. Authentifizierung, MFA und fachliche Spielaktionen sind getrennt. Der Game-Service berechnet Käufe und Ergebnisse; er verwendet dasselbe Spielmodell wie der Client für das deterministische Replay. Ein transaktionaler Adapter bindet wahlweise PostgreSQL oder SQLite an. Für öffentliche Konten ist dauerhafter externer Speicher erforderlich; eine temporäre SQLite-Datei auf einem kostenlosen Render-Dateisystem genügt dafür nicht.

| Schnittstelle | Methode/Pfad | Inhalt und Zuständigkeit |
|---|---|---|
| Konfiguration | `GET /accounts-config.json` | Öffentliche v3-Endpunktinformation; keine Zugangsdaten. |
| Gesundheit | `GET /api/v3/health` | API-/Regelwerkstatus, PostgreSQL-/Dauerhaftigkeitsmerkmal; optional getestete Quellrevision. |
| Konto | `POST /auth/register`, `/auth/login`, `/auth/reset` | Registrierung, Passwortanmeldung und Wiederherstellung unter `/api/v3`. |
| MFA-Anmeldung | `POST /auth/mfa/verify` | Kurzlebige Challenge plus TOTP oder einmaliger Notfallcode. |
| Sitzung/Profil | `GET /me`, `POST /auth/logout`, `PATCH /profile`, `DELETE /account` | Eigenen Zustand lesen, Sitzung widerrufen, umbenennen, bestätigte Kontolöschung. |
| MFA-Verwaltung | `GET /mfa/status`; `POST /mfa/setup`, `/mfa/confirm`, `/mfa/disable` | Optionalen zweiten Faktor einrichten und verwalten. |
| Wirtschaft | `POST /actions` | Bekannter Aktionstyp, stabile Inhalts-ID und `idempotencyKey`; kein vorgegebener Preis/Kontostand. |
| Runde | `POST /runs/start`, `/runs/{id}/finish` | Serveranfang und begrenztes Befehlsprotokoll; Ergebnis aus Replay. |
| Veröffentlichung | `POST /runs/{id}/publish` | Browser ruft nach neuem geeignetem Ergebnis automatisch auf; Server prüft unverändert Eigentum und Wertbarkeit. |
| Rangliste | `GET /leaderboard?ruleset=open-v2&period=all\|today\|week` | Bester geprüfter Run je regulärem Konto im serverseitigen UTC-Zeitraum. |

Alle API-Pfade der Tabelle außer der Konfigurationsdatei liegen unter `/api/v3`. Authentifizierte Aufrufe verwenden `Authorization: Bearer …`, keine Kontositzung aus Cookies. JSON-Größe, erlaubte Befehle, CORS-Ursprünge und Zugriffsraten werden begrenzt. Fremde vom Client gelieferte Nutzer-IDs erteilen keine Berechtigung. Ein Browser kann nach wie vor automatisiert korrekt spielen; Replay verhindert das bloße Einreichen erfundener Punktwerte, ist aber kein vollständiger Botnachweis.

### Sequenzdiagramme

1. Registrierung, Anmeldung, optionales MFA und Logout: [SVG](diagrams/03-registrierung-anmeldung.svg) · [Quelle](diagrams/03-registrierung-anmeldung.mmd).
2. Transaktionaler Basarkauf mit Wiederholungskennung: [SVG](diagrams/04-kauf.svg) · [Quelle](diagrams/04-kauf.mmd).
3. Serveranfang, Replay und automatische Veröffentlichung neuer geeigneter Kontorunden: [SVG](diagrams/05-run-replay-rangliste.svg) · [Quelle](diagrams/05-run-replay-rangliste.mmd).
4. UTC-Wochenabschluss und einmalige Podiumsabholung: [SVG](diagrams/06-wochenpodium.svg) · [Quelle](diagrams/06-wochenpodium.mmd).

## 6. Datenbankdesign (ERD)

Das physische Schema enthält **14 fachliche Tabellen und drei Migrationstabellen**. Zwei zusammengehörige ERD-Ansichten erhalten die Lesbarkeit: Konten und Spiel ([SVG](diagrams/07-erd-konten-spiel.svg), [Quelle](diagrams/07-erd-konten-spiel.mmd)) sowie Wettbewerb und Migration ([SVG](diagrams/08-erd-wettbewerb-migration.svg), [Quelle](diagrams/08-erd-wettbewerb-migration.mmd)). Die Namen entsprechen dem Quellcode, nicht einem angenommenen idealisierten Modell. Die detaillierten SVGs lassen sich für die Attribut- und Constraintprüfung ohne Qualitätsverlust vergrößern; die Präsentation zeigt vereinfachte Ansichten.

| Tabelle | Schlüssel / Beziehung | Zweck und Schutz |
|---|---|---|
| `users` | `id`; eindeutiger `username_key` und optionale eindeutige E-Mail | Identität, Passwort- und Recovery-Hash, Einwilligungszeit. Neue öffentliche Registrierungen brauchen E-Mail und Zustimmung; kompatible Altkonten und interner Bootstrap können abweichen. |
| `sessions` | `token_hash`; FK `user_id` | Zeitlich begrenzte Sitzungen; Server speichert Tokenhash. PostgreSQL besitzt zusätzlich `session_order`, SQLite verwendet seine Zeilenordnung. |
| `profiles` | PK/FK `user_id` | Validiertes JSON-Profil, monotone Revision und Run-Sequenz. Enthält Inventar, XP, Karriere und Einstellungen statt separater Tabellen je Katalogtyp. |
| `wallets` | PK/FK `user_id` | Maßgebliches nicht negatives ganzzahliges Guthaben; ein Profil-JSON kann diesen Wert nicht überschreiben. |
| `ninja_mfa` | PK/FK `user_id` | Verschlüsseltes TOTP-Geheimnis, Status, zuletzt verbrauchter Zeitschritt, Hashliste der MFA-Notfallcodes. |
| `ninja_mfa_challenges` | `challenge_hash`; FK `user_id` | Kurzlebige zweite Anmeldestufe mit begrenzten Fehlversuchen. |
| `ninja_ledger` | `id`; FK `user_id`; UNIQUE `(user_id, reference)` | Nachvollziehbare Geldänderung einschließlich Saldo nach der Buchung. |
| `ninja_actions` | PK `(user_id, key)` | Body-Hash und Antwort bereits verarbeiteter Aktionen; gleiche Kennung mit anderem Inhalt wird abgelehnt. |
| `ninja_runs` | `id`; FK `user_id`; höchstens ein aktiver Run je Nutzer | Seed, kanonischer Anfang, Ablauf, Revision, Status und bestätigtes Ergebnis. |
| `ninja_verified_scores` | PK/FK `run_id`; FK `user_id` | Öffentlich veröffentlichte geprüfte Open-Run-Daten. Nicht jeder Run wird veröffentlicht. |
| `ninja_admin_accounts` | PK/FK `user_id` | Vertrauenswürdige optionale Testrolle außerhalb des bearbeitbaren Profils. |
| `ninja_competition_settings` | `name` | Featurebeginn für Podium; vorhandene alte Ergebnisse erzeugen keine rückwirkenden Prämien. |
| `ninja_podium_weeks` | `week_start` | Eingefrorener Wochenabschluss und Anzahl berechtigter Einträge. |
| `ninja_podium_rewards` | PK `(week_start, place)`; UNIQUE `(week_start, user_id)`; FKs auf Woche und Nutzer | Einmaliger Platz-/Münzanspruch samt Claim-Zeitpunkt und Ergebnissnapshot. `run_id` ist hier bewusst **kein** Fremdschlüssel. |

`ninja_auth_migrations`, `ninja_game_migrations` und `ninja_feature_migrations` protokollieren angewandte Versionsschritte. Sie haben keine künstlich eingezeichnete Beziehung zu einem Nutzer.

Die ERD-Typen zeigen die PostgreSQL-Variante. SQLite verwendet entsprechende `INTEGER`-/`REAL`-Typen und eigene Autoincrement-/Zeilenmechanik. Das Profil ist in beiden Adaptern **TEXT mit JSON-Gültigkeitsprüfung**, keine native JSONB-Spalte; PostgreSQL prüft dafür per JSONB-Auswertung. Fachliche Integer bleiben innerhalb des sicheren JavaScript-Bereichs. Fremdschlüssel verhindern verwaiste Datensätze und entfernen nutzerbezogene Kinddaten bei bestätigter Löschung. Die genau-eins-Beziehungen für Profil und Wallet entstehen zusätzlich durch die atomare Kontoerstellung.

**Transaktionskonzept:** SQLite nutzt `BEGIN IMMEDIATE`, aktivierte Fremdschlüssel, WAL und vollständige Synchronisierung. PostgreSQL nutzt `SERIALIZABLE`; Serialisierungsfehler und Deadlocks werden begrenzt wiederholt. DDL-Migrationen laufen atomar und werden beim PostgreSQL-Start durch einen Advisory Lock koordiniert. Wallet, Ledger, Profilrevision und Aktionsantwort müssen zusammen festgeschrieben werden. Eine fehlgeschlagene Buchung darf keinen Teilzustand hinterlassen.

**Wettbewerb:** Eine Woche beginnt montags 00:00 UTC. Der nächste relevante Serveraufruf schließt offene vergangene Wochen transaktional ab; ein eigener kostenpflichtiger Scheduler ist nicht notwendig. Pro regulärem Konto zählt das beste passende Ergebnis. Bei Gleichstand folgen längere Laufzeit, frühere Veröffentlichung und stabile Run-ID. Die Plätze 1–3 erhalten ausdrücklich abholbare 100/60/30 Münzen. Ein gelöschtes Siegerkonto bewirkt kein Nachrücken. Der Ergebnissnapshot wird nicht als neue veränderbare Rangliste behandelt.

## 7. Änderungen gegenüber dem früheren Konzept

| Früherer Ansatz / Problem | Aktueller Entwurf | Konsequenz |
|---|---|---|
| Ursprünglich lokales Spiel mit separatem v2-Ranglistenserver | Vollständige v3-Konten und serverseitiges Spielservice neben erhaltenem Altserver | Historische v2-Daten sind keine automatisch verifizierten v3-Konten. |
| SQLite als öffentliche Persistenz auf flüchtigem Host | PostgreSQL für dauerhafte öffentliche Daten, SQLite für lokale Nutzung | Externer Dauerhaftigkeitsnachweis und Migrationen erforderlich. |
| Client meldet vermeintliche Ergebnisse | Server-Seed und deterministisches Eingabe-Replay | Punkte werden berechnet; Logumfang und Zeitbudget begrenzt. |
| Konkurrierende Modus-/Welt-Einstiege | Gemeinsame Spielenseite und fünf Hauptziele | Weniger Startentscheidungen, verständliche Rückkehrpfade. |
| Neun Knoten im bisherigen Fähigkeitenbaum | 18 Fähigkeiten im Basar, sechs Supers, Vorgängerketten | Alte IDs und Preise erhalten; neue UI und sechs Stufen je Ast. |
| 24 Erfolge und einfache Outfitdarstellung | 36 Erfolge und fünf kosmetische Seltenheiten für zwölf Looks | Neue Sammlungsziele; kein Stärkevorteil durch Seltenheit. |
| Alte Kulissen als sichtbares Archiv | Archivnavigation entfällt, historischer Besitz bleibt gespeichert | Datenbewahrung ohne zusätzliche überholte Spielnavigation. |
| Gerätebezogenes Gastspiel an alter URL | Neue Hostwurzel mit ausdrücklich bestätigtem Gasttransfer | Ursprünge haben getrennten Speicher; keine lautlose Verlustumleitung. |
| Reine Punkte-/Fortschrittsorientierung | Ninja-Intro, lokale aktive Spielzeit, freiwillige Pausenerinnerung | Ergänzt das Thema digitale Balance; keine Belohnung fürs Dauerspielen. |
| Veröffentlichung mit zusätzlichem Klick | Automatischer Eintrag neuer geeigneter Kontorunden nach Serverprüfung | Transparenter Hinweis vor dem Start; kontogetrennte Run-ID-Warteschlange statt ungeprüfter Clientpunkte. |
| Dauerhaft sichtbare Erklärtexte und abgeschnittene Zähler | Aufklappbare Erklärungen, passende Schriftbreite und exakte zugängliche Werte | Zentrale Ziele und Aktionen bleiben sichtbar; Details sind gezielt erreichbar. |
| Noch kein vertrauenswürdiger Testzugang | Private Serverrolle mit wieder aufgefülltem Budget | Tester kann Käufe prüfen; keine Teilnahme an Wettbewerb/Prämien. |

Bekannte Quellmodule wurden anhand des tatsächlich vorhandenen Checkouts geprüft. Eine möglicherweise nur in einer ausgefallenen alten Umgebung gespeicherte Portalversion wird nicht als übernommen behauptet. Die alte Umgebung und bestehende Spielstände dürfen erhalten bleiben.

## 8. Rollen, Datenschutz und Betrieb

**Gast:** lokales Spielen und lokale Sammlung; keine verifizierte öffentliche Wertung. **Angemeldeter Spieler:** eigener synchronisierter Fortschritt und eigene Aktionen; neue geeignete Open Runs werden nach vorherigem Hinweis automatisch eingetragen. **Betreiber:** kontrolliert Infrastruktur und private Konfiguration; kann ein Admin-Testkonto einrichten. **Admin-Testkonto:** normale Spiellogik und echte Kaufvoraussetzungen mit Testbudget; kein automatisches Durchspielen, keine öffentlichen Ranglisten oder Wettbewerbsprämien. Eine Rollenzuweisung per Registrierungsformular oder lokalem JSON ist nicht erlaubt.

Passwörter werden mit scrypt und zufälligem Salt gehasht. Hochentropische Sitzungstokens und Kontowiederherstellungscodes liegen serverseitig nur gehasht vor. TOTP-Geheimnisse sind mit AES-256-GCM verschlüsselt; dafür muss der Betreiber den bestehenden MFA-Schlüssel sicher erhalten. Passwortwiederherstellung widerruft bisherige Sitzungen. Logout widerruft die betreffende Sitzung; das bestätigte Kontolöschen entfernt verknüpfte Daten. Öffentliche Ranglisten zeigen keine E-Mail oder internen Kontokennungen.

Das Replay prüft Regelkonformität und das erlaubte Zeitbudget. Programmgesteuerte Eingaben können ebenfalls regelkonform sein; eine zuverlässige Bot-Erkennung wird durch diese Architektur und die vorhandenen Tests nicht belegt.

Die E-Mail wird aktuell nicht per Bestätigungsnachricht verifiziert; Passwortwiederherstellung erfolgt über den zuvor ausgegebenen Code und gegebenenfalls MFA. Es gibt keinen behaupteten E-Mail-Versanddienst. Datenschutztext und Zustimmung sind implementierte Produktmechanismen, ersetzen jedoch keine rechtliche Prüfung.

Vorgesehen bleiben der bestehende **Render-Free-Dienst** und **Neon Free PostgreSQL**. Es werden keine kostenpflichtigen Ressourcen vorausgesetzt. Ein kostenloser Server kann beim ersten Zugriff verzögert antworten; Fehlermeldung und Gastzugang müssen damit umgehen. Öffentliche Deploymentidentität wird über die getestete Quellrevision nachgewiesen, nicht allein über einen erreichbaren Port.

## 9. Funktionales Testkonzept und erste Ergebnisprotokolle

### 9.1 Testebenen und Abnahmekriterien

1. **Modell-/Komponententests:** Spielregeln, Missionsfreigaben, Trefferzonen, Supers, Kataloge, Intro und Spielzeitzähler. Sie verwenden deterministische Seeds und gezielte Grenzfälle.
2. **API-/Datenbankintegration:** reale HTTP-Anfragen gegen isolierte SQLite-/PostgreSQL-Datenbanken; zwei Konten, parallele Käufe/Claims, fremde IDs, manipulierte Werte und echte Serverprozess-Neustarts.
3. **Native Browserfunktion:** Playwright bedient sichtbare Buttons und native Maus-/Touchgesten. Die Diagnoseansicht wird nur gelesen. Nativ gespielte Läufe und Tests mit synthetischer Testuhr werden getrennt gekennzeichnet.
4. **Visuelle/Bedienmatrix:** DE/EN, 360 und 1280 Pixel sowie ergänzende Tablet-, Breitbild- und Querformatgrößen, Relaxed/Dark/Noir, Fokus, Überlauf, Touchziele, Bildfehler und Übersetzungen.
5. **Öffentlicher Betrieb:** Versionsidentität, dauerhafter PostgreSQL-Status, CORS und öffentliche Gastansichten nach Deployment. Lokale Tests ersetzen keine aktuelle Produktionsprüfung.
6. **Zielgruppen-Pretest:** Beobachtete Verständlichkeit, Bedienbarkeit und Reflexion mit Menschen; noch gesondert zu erheben.

**Abnahmekriterien:** Keine bekannte kontenübergreifende Datenfreigabe; keine negative/fremdbestimmte Wallet; wiederholte Aktion ohne doppelte Belohnung; Daten nach Prozessneustart erhalten; keine Veröffentlichung ungeprüfter Clientpunkte; Navigation/Dialogsperren und sichtbare Regeln verständlich. Die finale Prüfsuite darf nicht durch übersprungene PostgreSQL-Tests scheinbar grün werden.

### 9.2 Protokollierte Ergebnisse

| Protokoll | Datum / Ausgangsstand | Durchführung und tatsächliches Ergebnis | Aussagegrenze |
|---|---|---|---|
| P01 Hauptkarriere | 17.11.2026; Ausgangsversion 3.12 | Frischer Gast, native Maus auf 1280×900: Tutorial und alle 18 Hauptmissionen; 484 richtige Entscheidungen, drei Fehler in `study-06`, 199 erspielte Münzen nach Kapitel 3. Drei Kapitel-Neuladungen erhalten Fortschritt. | Reproduzierbarer Funktionslauf; Bot kennt Bedeutungen, kein Verständlichkeitsbeleg. |
| P02 Zusatzkarriere | Fortsetzung derselben Abnahme; am 24.11. abgeglichen | Alle acht Zusatzherausforderungen und drei Einzelbosse abgeschlossen; 308 richtige Entscheidungen in erhaltenen Teilberichten. Alle 26 Karriereaufgaben und Claims abschließend vorhanden. | Fortgesetzter Lauf mit gespeicherten Zwischenständen, nicht fehlerfreier erster Prüflauf. |
| P03 Touch-Modi | 17.11.2026; 360 Pixel | Boss Rush mit drei Bossen/neun Phasen, 98 richtige Entscheidungen; Tagesübung 60 aktive Sekunden, 34 richtig/kein Fehler; Open Run nach über 90 aktiven Sekunden bewusst bis drei echte Herzverluste fortgeführt; Wischtraining ohne zusätzliche Münzen. | Emulierter Touch, keine physischen Mobilgeräte; Gast-Tagesübung nicht öffentlich gewertet. |
| P04 Zwei-Konten/Persistenz | Historische lokale Abnahme 17.11. | Je SQLite und PostgreSQL reale getrennte Serverprozesse: Registrierung, 18 servergeprüfte Missionen, paralleler Kauf, Rangliste, MFA, Wiederherstellung und Neustart. Danach Testkonten gelöscht, zehn damalige verknüpfte Kontentabellen leer. | Isolierte lokale Datenbanken; kein neuer öffentlicher Render-Neustartbeleg. |
| P05 Gesamtsuite | Historischer Korrekturstand 17.11. | 498 bestanden, null Fehler, null übersprungen. | Historischer Stand; nicht als finale 3.13-Abnahme ausgegeben. |
| P06 Erweiterte Gesamtsuite | 18.11.2026; integrierter Zwischenstand | Gespeichertes Protokoll: 572 bestanden, null Fehler, null übersprungen, mit echtem lokalem PostgreSQL. | Historischer Zwischenstand vor dem Versionswechsel; aktuelle Gesamtsuite siehe P09. |
| P07 Neue Supers | 18.11.; lokaler integrierter Kandidat mit alter Diagnose-Versionskennung | Ein erster isolierter Browser-Prüfversuch bestätigte tatsächlich alle 18 Serverkäufe, bevor später ein Fehler im Prüfskript auftrat. Der abschließende erfolgreiche Versuch verwendete den bereits vorhandenen Besitz und lud die neuen Supers mit tatsächlichen Entscheidungen auf und aktivierte sie über die sichtbaren Buttons: Zen-Zeit mit Zeitlupe/Flow, Lotus mit drei Schilden, Sternensturm mit Multiplikator. Besitz nach Reload erhalten. | Lokales Testkonto; keine behauptete Produktionsanmeldung. |
| P08 Darstellungsbausteine | 18.11.; Komponentennachweise | Zwölf Looks in DE/EN und drei Designs bei 360/1280; Intro durchlief vier Szenen und 20 aktive Sekunden; Spielzeitkomponenten prüfen aktive Zeit, Pause, Erinnerung und Speicherfehler. | Ergänzt, ersetzt aber nicht die laufende vollständige End-to-End-Matrix. |
| P09 Repository-Gesamtsuite des Basisreleases | 24.11.2026; gebauter 3.13.0-Kandidat | `npm test`: **574 Tests bestanden, null Fehler, null übersprungen**, mit echtem lokalem PostgreSQL. | Repositoryweite Anzahl einschließlich der anderen Spiele; keine erfundene Ninja-only-Teilanzahl und kein Produktionsnachweis. |
| P10 Aktuelle Konto-/Neustartabnahme | 24.11.2026; Bericht ausdrücklich Version 3.13.0 | SQLite und PostgreSQL jeweils mit zwei getrennten Konten: 18 servergeprüfte Missionen, erspieltes Guthaben, gleichzeitiger idempotenter Kauf, Inventar/Ausrüstung, Rangliste, MFA, echter Prozessneustart und Wiederherstellung; anschließend zehn geprüfte verknüpfte Tabellen leer und isoliertes PostgreSQL-Schema entfernt. | Lokale HTTP-Integration mit ausdrücklich synthetischer Replay-Testuhr, kein nativer oder öffentlicher Spielnachweis. |
| P11 Aktuelle neue Oberflächen | 24.11.2026; gebauter 3.13.0-Kandidat | **132 tatsächlich geprüfte Zustände**, je 66 bei 360 und 1280 Pixeln, einschließlich DE/EN und Relaxed/Dark/Noir; keine protokollierten JS-, Console- oder CSP-Fehler. Mobile reguläre 20-Sekunden-Introfolge abgeschlossen, Desktop-Überspringen geprüft; echte aktive Runde zählt Zeit, Pause zählt nicht. | Geprüfte Zustandsliste ist festgelegt; keine Behauptung aller denkbaren Browser-/Gerätekombinationen oder einer 15-minütigen nativen Dauersitzung. |
| P12 Aktueller Offline-Gastweg | 24.11.2026; 3.13.0, 360 Pixel | Aktueller Service-Worker-Cache, Landschaftskunst, Lernfortschritt nach Offline-Reload, Lexikon und wertungsfreie Vorschau bestanden. | Offline-Gastspiel; keine Offline-Kontosynchronisierung. |
| P13 Gasttransfer | 24.11.2026; 3.13.0 | Reales Browser-Popup und `postMessage` zwischen den exakt geprüften Ursprüngen, Antworten ausschließlich vom isolierten lokalen Server: eine echte erspielte Quellrunde, ausdrückliche Zielbestätigung, Import nach Reload erhalten, Quelle unverändert und vorhandenes Ziel gesichert. | Origin-Routing im lokalen Browserprüflauf; kein Nachweis eines bereits erfolgreichen öffentlichen Hostumzugs. |
| P14 Gesamtsuite 3.13.1 | 24.11.2026; gebauter Patchkandidat | `npm test`: **591 Repositorytests bestanden, null Fehler, null übersprungen**, mit echtem lokalem PostgreSQL. Darunter gezielte Tests zu automatischer Veröffentlichung, Benutzerwechsel, Verbindungsfehlern und Zahlenformatierung. | Versionsgebundene lokale Prüfung; ersetzt keine unabhängige CI oder Produktionsabnahme. |
| P15 Automatischer Ranglisteneintrag | 24.11.2026; 3.13.1 | Zwei tatsächlich gespielte Kontorunden: 360 Pixel/Deutsch und 1280 Pixel/Englisch; jeweils drei native Schnitte, regulärer Herzverlust, positive serverbestätigte Punkte und automatischer Eintrag **ohne Veröffentlichungsklick**. Einträge nach Reload erhalten; beide Konten und ihre Einträge danach gelöscht. | Lokaler Browser- und API-Nachweis mit realer Zeit; kein öffentlicher Produktionsneustartbeleg. |
| P16 Lange Zähler und HUD-Lesbarkeit | 24.11.2026; 3.13.1 | 216 Darstellungsfälle: sechs Ansichtsgrößen × DE/EN × drei Designs × drei Punktestände × zwei Serienwerte. Originales HUD-Markup, Styles, geladene Schrift und reale Anpassungsfunktion: kein Abschneiden, kein horizontaler Überlauf, exakte Titel/ARIA-Werte und geprüfte Text-/Symbolkontraste. | Ausdrücklich isoliertes Darstellungsfixture ohne Spielzustand oder Punktevergabe; keine 216 tatsächlich gespielten Läufe. |
| P17 Öffentliche Konten und echter Neustart | 24.11.2026; 3.13.1, Quellstand ed1bf5a | Zwei temporäre Produktionskonten registriert/angemeldet, echte Zeit für servergeprüfte Runden abgewartet, verdiente Belohnungen und 35-Münzen-Fähigkeitskauf geprüft. Render-Neustart als neues Providerereignis um 17:12:29 UTC belegt. Vollständige Profile, Revisionen und veröffentlichte Scores danach erhalten; E-Mail-Login/Logout geprüft. Beide Konten, Sitzungen und öffentlichen Testeinträge danach entfernt. | Tatsächlicher HTTP-Produktionslauf mit realer Zeit, keine native Browserbedienung; kein Test einer Betreiber-Anmeldung oder MFA im Produktionssystem. [Beleg 13](nachweise/13-production-accounts-restart-2026-11-24.json). |
| P18 Öffentlicher Gastzugang und Versionsidentität | 24.11.2026; derselbe Quellstand | Kanonische Homepage und Spielwurzel im Browser bei 360/1280 Pixeln, DE/EN und drei Designs geprüft. Schreibgeschützte API-Prüfung bestätigt konkrete Quellkennung, PostgreSQL/dauerhaften Speicher, Rangliste, Kontokonfiguration und CORS. | Browserphase gestattet nur GET/HEAD/OPTIONS und erzeugt keine Produktionskonten; die Schreib-/Neustartprüfung steht getrennt in P17. [Beleg 14](nachweise/14-public-api-guest-2026-11-24.json). |
| P19 Allgemeine unabhängige CI | Zwischenstand ed1bf5a | Asseterzeugung, öffentliche Gast-/API-Abnahme und kontrollierte Online-Kontenabnahme bestanden. Der allgemeine Workflow „Notification Ninja checks“ war dagegen fehlgeschlagen. | Historischer Zwischenstand. Der abschließende Korrekturlauf für 6878dd4 ist erfolgreich; siehe P23 und Beleg 18. |
| P20 Finale Repository-Gesamtsuite | 25.11.2026; Korrekturstand 6878dd4 | 591 Tests bestanden, null Fehler und null übersprungen; echtes lokales PostgreSQL. | Repository-Gesamtsumme einschließlich anderer Spiele; kein Ersatz für öffentliche Tests. [Beleg 17](nachweise/17-final-repository-tests-2026-11-25.json). |
| P21 Vollständiger frischer Seitenrundgang | 25.11.2026; derselbe Korrekturstand | Vier unabhängig ausgeführte Breiten-/Sprachläufe: je 342 Zustände bei 360/1280 Pixeln und DE/EN, zusammen 1.368. Kein Überlauf, fehlendes Bild, kleines Ziel, doppeltes Element-ID, Übersetzungsfund oder JS-Fehler. Echte Konto-/MFA-, Kauf- und Löschwege; vier temporäre Konten bereinigt. | Native vollständige Karriere bleibt der eigene historische Nachweis. Geprüfte Artefakte stimmen per SHA-256 mit dem finalen Commit überein. [Beleg 15](nachweise/15-final-all-pages-2026-11-25.json). |
| P22 Aufklappbare Details und Missionsziele | 25.11.2026; derselbe Korrekturstand | 60 kurze native UI-Abläufe: fünf Ansichten × zwei Breiten × zwei Sprachen × drei Designs. Dojo-Erklärung, Regeln, Rundenrückblick, Fähigkeitseffekt und Missionsziel geprüft; Mindestkontrast des Zieltextes 5,84:1. | Bewusst kurze ungewertete Abläufe, keine 60 vollständigen Missionen. [Beleg 16](nachweise/16-compact-ui-2026-11-25.json). |
| P23 Abschließende unabhängige CI und Veröffentlichung | 25.11.2026; Quellstand 6878dd4 | Die Workflows „Notification Ninja checks“, Asseterzeugung sowie öffentliche Gast-/API-Prüfung sind erfolgreich. Die kanonischen HTML-/JS-/CSS-/Metadaten-Dateien stimmen in neun SHA-256-Vergleichen mit dem Checkout überein. Auch neun Dateien des GitHub-Pages-Spiegels einschließlich ZIP und Prüfsumme sind bytegleich. | Der kontrollierte Zwei-Konten-Test wurde beim gewöhnlichen Korrektur-Push ausdrücklich nicht erneut gestartet; sein früherer tatsächlicher Produktionsnachweis bleibt P17. [Beleg 18](nachweise/18-final-ci-public-identity-2026-11-25.json). |



Belege und genauere Fehlergeschichte stehen im [historischen Spielbericht](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/main/notification-ninja/FULL_GAME_AUDIT.md) und im [aktuellen Erweiterungs-/Freigabebericht](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/main/notification-ninja/EXPANSION_3_13.md) sowie im [Patchbericht 3.13.1](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/main/notification-ninja/PATCH_3_13_1.md). [Bereinigte portable Ergebnisdateien](nachweise/README.md) bewahren überprüfbare Testzahlen, Methoden, Einzelmissionen und SHA-256-Fingerprints der ausgewerteten Originalberichte. Die Abgabe enthält keine Konto-Recoverycodes oder Betreiber-Secrets.

### 9.3 Gefundene Fehler, Korrektur und Nachprüfung

| ID | Befund | Umsetzung / zugehörige Prüfung |
|---|---|---|
| F01 | Verlassen-Bestätigung lag hinter dem Pausenmenü; Escape konnte die Runde dahinter fortsetzen. | Geladene Dialogstyles und konsumiertes Escape; native Crossflow-Regressionsprüfung. |
| F02 | Gaming-Übung kehrte nach Browser-Zurück/Vorwärts als Lernübung zurück und verlor Antworten. | Kontext, begrenzte Antwortgeschichte und Rückkehrziel wiederherstellen; Modell- und Browserprüfung. |
| F03 | Jeder normale Klick schrieb die Theme-Auswahl erneut und setzte falsche ARIA-Semantik. | Handler und Markierung auf echte Theme-Buttons begrenzt; Navigation und tatsächlicher Wechsel getrennt geprüft. |
| F04 | Erspielte Tagesmünzen waren nur in einem versteckten alten Hub vorhanden. | Sichtbare Tagesziele im bestehenden Wochenzielbereich; 2/3/4 Münzen einmalig abgeholt, Wiederholung ohne Gutschrift. |
| F05 | Boss-Einführung versprach eine feste Zahl richtiger Entscheidungen trotz Verteidigungsphasen. | Anzeige als Boss-Energie; Fokus-/Glitch-/Ruhemechanik und Angriffsfenster konkret erklärt. |
| F06 | Einzelne englische Texte und MFA-/Ranglistenunterzustände blieben deutsch. | Fehlende Kopien und dynamische Übersetzungsregeln ergänzt; verbleibende neue Funde werden vor Freigabe in der DE/EN-Matrix nachgeprüft. |
| F07 | Neue Basarüberschrift war in einer tatsächlichen Ansicht auf hellem Untergrund schlecht lesbar. | Dunkle Schrift auf eigener Papierfläche; frischer mobiler Screenshot bestätigt die Korrektur. |

Ein Fehler im Prüfszenario, etwa ein mehrdeutiger Klickselektor, ist gesondert von einem Produktfehler zu dokumentieren. Ein erfolgreich fortgesetzter Durchlauf darf einen vorherigen fehlgeschlagenen Prüfversuch nicht rückwirkend verdecken.

### 9.4 Weihnachtssession und menschlicher Pretest

**Es liegt im zugänglichen Projektbestand kein belegtes menschliches Pretest-Protokoll einer Weihnachtssession vor.** Zum Dokumentationsdatum 25. November 2026 wird weder behauptet, dass eine zukünftige Weihnachtssession bereits stattfand, noch werden Teilnehmer, Aussagen oder Erfolgsquoten erfunden. Falls die Aufgabenstellung eine bereits anders bezeichnete Sitzung meint, muss deren tatsächliches Protokoll ergänzt werden. Dieser Anforderungspunkt ist bis dahin ausdrücklich **offen**.

Vorbereiteter Pretest: fünf bis acht freiwillige Personen aus der vorgesehenen Zielgruppe führen nach kurzem neutralem Einstieg folgende Aufgaben aus: (1) ohne Hilfe als Gast starten, (2) den Unterschied Schneiden/Durchlassen erklären, (3) nach einem Zielwechsel zwei Signale begründen, (4) eine gesperrte Mission und deren Voraussetzung finden, (5) einen Look und eine Fähigkeit im Basar unterscheiden, (6) Spielzeit/Pausenwahl finden und (7) ohne Datenverlust beenden und fortsetzen. Persönliche Einwilligung und eine an die reale Altersgruppe angepasste Durchführung sind vor der Sitzung zu klären.

Je Aufgabe werden Abschluss ohne Hilfe, Hilfehinweise, Fehlversuche, beobachtete Verständnishürden, Zeit und kurze subjektive Rückmeldung protokolliert. Verwendet werden pseudonyme Testkennungen, Gerätekategorie, Buildkennung und Datum; keine Passwörter, privaten E-Mails oder vollständigen Bildschirmaufnahmen sensibler Kontoseiten. Die kleine Stichprobe erlaubt qualitative Verbesserungen, keine statistische Wirksamkeitsaussage.

| Testkennung | Build / Gerät / Datum | Aufgabe | Erwartet | Tatsächlich beobachtet | Ergebnis / Maßnahme |
|---|---|---|---|---|---|
| Noch nicht vergeben | Noch zu erheben | Gaststart und Intro | Einstieg ohne Betreuung möglich | **Nicht durchgeführt** | Nach Sitzung ergänzen. |
| Noch nicht vergeben | Noch zu erheben | Zielwechsel verstehen | Entscheidung anhand des neuen Ziels begründen | **Nicht durchgeführt** | Nach Sitzung ergänzen. |
| Noch nicht vergeben | Noch zu erheben | Gesperrte Mission | Konkrete Voraussetzung benennen | **Nicht durchgeführt** | Nach Sitzung ergänzen. |
| Noch nicht vergeben | Noch zu erheben | Basar und Seltenheit | Kosmetik und Fähigkeit unterscheiden | **Nicht durchgeführt** | Nach Sitzung ergänzen. |
| Noch nicht vergeben | Noch zu erheben | Pause / Fortsetzen | Wahl und Speichergrenze verstehen | **Nicht durchgeführt** | Nach Sitzung ergänzen. |

## 10. Nächste Schritte bis zur Abgabe

1. Die bestandene 591-Test-Gesamtsuite sowie die getrennten lokalen und öffentlichen Zwei-Konten-/Neustartabnahmen als dokumentierten Stand bewahren; bei neuen Implementierungsänderungen die betroffenen Prüfungen erneut ausführen.
2. Die bestandenen 1.368 Seitenzustände, 60 Detailabläufe sowie die getrennten 132 Design-/216 HUD-Fälle, Transfer- und Offline-Nachweise mit dem finalen Quellstand und Paket abgleichen.
3. Den erfolgreichen allgemeinen CI-Lauf und die öffentliche Versions-/Dateiprüfung für 6878dd4 archivieren. Der separate öffentliche Konto-/Neustartnachweis für ed1bf5a bleibt ausdrücklich seiner Quellkennung zugeordnet.
4. Die belegten Endzahlen, Quellkennungen und öffentlichen Belege beim Vortragen verwenden; bei späteren Änderungen neue betroffene Prüfungen ausführen.
5. Diagramme und Kurzpräsentation prüfen; Teammitglieder, reale Aufgabenverteilung und gegebenenfalls das vorhandene Weihnachtssession-Protokoll ergänzen. Abgabe durch die Gruppe bis **26.11.2026, 21:00 Uhr** durchführen. Diese Dokumentation behauptet keine Moodle-Einreichung.

## 11. Quellen und Zuordnung zur Aufgabenstellung

| Geforderter Inhalt | Stelle dieser Unterlage / maßgeblicher Quellcode |
|---|---|
| Soll/Ist und Pläne | Abschnitte 2 und 10; [Erweiterungsstatus](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/main/notification-ninja/EXPANSION_3_13.md). |
| Szenarien und Use-Case-Diagramm | Abschnitt 3; [Use Cases](diagrams/02-use-cases.mmd). |
| Sequenzdiagramme | Abschnitt 5; Diagramme 03–06. |
| Konzept, erste Designs, Implementierung/Schnittstellen | Abschnitte 1, 4 und 5; [Client](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/6878dd4bc8717d48f257d5b89c17868c355fc2bd/notification-ninja/src/main.js), [Konto-Client](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/6878dd4bc8717d48f257d5b89c17868c355fc2bd/notification-ninja/src/accounts.js), [API](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/6878dd4bc8717d48f257d5b89c17868c355fc2bd/server/ninja-service.mjs). |
| Datenbankdesign / ERD | Abschnitt 6; Diagramme 07–08; [SQLite](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/6878dd4bc8717d48f257d5b89c17868c355fc2bd/server/ninja-store.mjs), [PostgreSQL](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/6878dd4bc8717d48f257d5b89c17868c355fc2bd/server/ninja-postgres-store.mjs), [Wettbewerbsschema](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/6878dd4bc8717d48f257d5b89c17868c355fc2bd/server/ninja-competition.mjs), [Spielservice](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/6878dd4bc8717d48f257d5b89c17868c355fc2bd/server/ninja-game-service.mjs). |
| Konzeptänderungen, Rollen, DB | Abschnitte 7 und 8; [Admin-/Podiumsbetrieb](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/6878dd4bc8717d48f257d5b89c17868c355fc2bd/server/NINJA_ADMIN_AND_PODIUM.md). |
| Funktionales Testkonzept und erste Protokolle | Abschnitt 9; [historischer Bericht](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/main/notification-ninja/FULL_GAME_AUDIT.md), [Konten-/Neustart-Audit](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/6878dd4bc8717d48f257d5b89c17868c355fc2bd/scripts/check_ninja_account_audit.mjs), [Seitenprüfung](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/6878dd4bc8717d48f257d5b89c17868c355fc2bd/scripts/check_ninja_all_pages.cjs), [3.13-Integration](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/6878dd4bc8717d48f257d5b89c17868c355fc2bd/scripts/check_ninja_313.cjs). |
| Pretestergebnisse Weihnachtssession | Abschnitt 9.4: keine belegten Ergebnisse vorhanden; offener Punkt und vorbereitete Erhebung. |
