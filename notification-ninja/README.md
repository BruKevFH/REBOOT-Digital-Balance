# Notification Ninja

**Entwicklungsstand 3.1.0:** PostgreSQL neben lokalem SQLite, neues Kontoportal und Hub, Boss Rush und serverseitige UTC-Tages-Challenge. Die öffentliche Kontenanbindung bleibt deaktiviert, bis Render/Neon tatsächlich geprüft sind. Siehe [Abnahmestand und Blocker](ULTIMATE_STATUS.md).

Ein eigenständiges Browser-Wischspiel auf **Deutsch und Englisch** für Jugendliche ab etwa 13 Jahren. Ablenkungen schneiden, hilfreiche Inhalte durchlassen: Das aktuelle Ziel entscheidet. Lernen, Gaming und Schlafen haben eigene illustrierte Dojos und unterschiedliche Regeln. Die finale Wortmarke hat keinen zusätzlichen Slogan.

[Homepage](home.html) · [Anforderungen PDF](REQUIREMENTS.md) · [Vollständige Anforderungsmatrix](REQUIREMENTS_FULL.md) · [Prüfbericht](TEST_REPORT.md) · [English](README.en.md)

## Lokal starten, einschließlich Accounts und Datenbank

Voraussetzungen: Node.js **24**, npm; Python 3 nur zum Erstellen des Download-ZIPs.

```bash
npm ci
npm run build:ninja
npm run serve:ninja
```

Im Browser **http://127.0.0.1:8083/notification-ninja/home.html** öffnen. Dieser eine Prozess liefert Frontend und API aus und erstellt automatisch `server/data/ninja.sqlite`. Es ist kein separater Datenbankprozess und kein externer Zugangsschlüssel nötig. Server beenden und erneut starten erhält Konten, Sitzungen, Wallet, Besitz, Missionen und veröffentlichte Ergebnisse, solange derselbe Datenordner besteht.

Alternativ nur den Gastmodus als statische Seite starten: `npm run serve`, dann `http://127.0.0.1:8000/notification-ninja/home.html`. Die statische Konfiguration aktiviert keine Online-Konten. Ein Browserdownload enthält das vollständige Gastspiel; ein reines GitHub-Pages-Hosting kann das Backend nicht ausführen.

## Spielen und Fortschritt

- **Gast:** Keine Registrierung und keine Namenspflicht. Drei kostenlose kurze Alltagsrunden; lokales Profil und Offlinebetrieb. Vorhandene Namen, Münzen, Fähigkeiten, Erfolge und Looks bleiben erhalten.
- **Konto:** Freiwillig mit Ninja-Name, privater E-Mail, Passwortbestätigung und Datenschutz-Zustimmung. Die E-Mail wird nicht öffentlich angezeigt und aktuell nicht per E-Mail bestätigt. Den einmal angezeigten Wiederherstellungscode sicher aufbewahren; ohne Passwort und Code kann das Konto nicht wiederhergestellt werden. Synchronisierter Kontofortschritt ist vom ursprünglichen Gastprofil getrennt.
- **NIM:** Erklärt das Wischen, Durchlassen, Fehler, Pause und neue Freischaltungen. Trainingshinweise zeigen die passende Aktion; normale Runden verraten sie nicht. Die Hilfe bietet außerdem ein **ungewertetes Tastentraining** ohne Wischpräzision und Zeitdruck.
- **Kampagne:** 18 Hauptmissionen, sechs je Welt, mit verschiedenen Zielen, kurzen Einführungen, Voraussetzungen, Bestleistungen und ausdrücklichen Belohnungen. Kapitel öffnen neue Welten. Acht frühere Herausforderungen und drei Autoplay-Bosse bleiben als Zusatz erhalten. Bereits gekaufte Räume bleiben nutzbar.
- **Open Run:** Ein Modus, drei Herzen, zwei werfende Ninjas, kein Countdown. Sanfter Einstieg, kontinuierlich steigendes Tempo. Gekaufte Fähigkeiten und Supers sind deaktiviert; Skins sind kosmetisch. Frühes Beenden bleibt ungewertet.
- **Sammlung:** 24 Erfolge, neun Fähigkeiten im Wurzelbaum, Basar, sichtbare Outfits, fünf Ninja-Ränge und drei wechselnde Tages-/Wochenaufgaben. Kaufen, Abholen und Ausrüsten sind eigene Aktionen; Freischalten rüstet nichts ungefragt aus. „Ansehen“ entfernt die einzelne ungelesene Nachricht, lässt ihre Münzbelohnung aber abholbar.
- **Ergebnis:** Echte Punkte, richtige Entscheidungen und Fehler sowie eine kurze freiwillige Reflexion. Reflexionsantworten werden nicht an die API übertragen. Neustart und Pause machen sind beide erreichbar.

Normale Runden: ein Ninja auf Entspannt, zwei auf Normal, drei auf Profi. Der ausgerüstete Ninja wirft sichtbar aus seiner Hand. Falscher Schnitt und durchgelassene Ablenkung kosten je ein Herz, sofern kein vorher aktivierter Schild den Fehler abfängt. Bewertung erfolgt pro Objekt einmal.

Maus: gedrückt über ein Objekt ziehen. Touch: Fingerwischbewegung im Spielfeld. Leertaste aktiviert die freigeschaltete Super; Pause, Fortsetzen und Beenden sind sichtbar. Vollbild wird nur nach geeigneter Nutzeraktion angefragt. Bei Browserablehnung bleibt die große Spielansicht erhalten; echtes iPhone-Vollbild hängt von Safari ab.

## Balance-Tabelle

Maßgeblich sind die gemeinsamen Kataloge `progression.js`, `adventure.js` und `journey.js`; die Zahlen unten dokumentieren die gewählten Vorgaben. Kein Echtgeld, keine Lootboxen.

| Quelle / Kauf | Münzen | Art / Grenze |
|---|---:|---|
| Gute Entscheidungen | 1 je 14; mit Münzgespür je 12 | Wiederholbarer Grundverdienst vor Schwierigkeits-/Bonusfaktoren |
| Münzobjekt / volle 25er-Schnittcombo | jeweils 1 | Innerhalb derselben Abschnittsgrenze |
| Abschnittsbeutel | 8 / 10 / 12 | Grenze Entspannt / Normal / Profi; Goldener Lauf erhöht sie um 25 %, abgerundet |
| Qualifizierter Abschluss | 2; bewusster Stopp zusätzlich 1 | Ab mindestens 12 richtigen Entscheidungen; kein Bonus für Herzverlust/sofortigen Abbruch |
| Hauptmission | 3 / 4 / 6 | Einmalige ausdrücklich abzuholende Erstabschlussbelohnung je Mission; Wiederholung behält begrenzte Rundenmünzen |
| Erfolg | 3–20 | 24 verschiedene einmalige Belohnungen, ausdrücklich abholen |
| Tages-/Wochenaufgaben | 2/3/4 täglich; 4/5/6 wöchentlich | Je Periodenaufgabe einmal; kein Anwesenheitsbonus |
| Fähigkeit pro Aststufe | 35 / 90 / 180 | Jeweils Vorgänger nötig, einmaliger Besitz |
| Kaufbare Skins | 80 / 180 / 320 | Kosmetik; Rang-/Wochenlooks werden erspielt |
| Früher Raumzugang | 80 / 180 / 320 | Gaming / Schlafen / Master; Gaming und Schlafen alternativ durch Kapitelabschluss kostenlos |
| Zusätzliche Kulissen | 160 / 220 / 280 | Passender Raum nötig, Kauf und Auswahl getrennt |

Runmünzen werden erst am Ende einmalig gesichert; bei Accounts erst nach erfolgreicher Serverprüfung. Erstabschluss- und Erfolgsbelohnungen werden getrennt abgeholt. Servertransaktionen und Idempotenz verhindern doppelte Auszahlung, auch bei parallelen Tabs.

## Einstellungen und Gestaltung

Creme, Mint, Koralle, Gold und Lavendel, dunkle Konturen und drei eigens illustrierte Räume orientieren sich an den Mock-ups. Das Logo liegt als [PNG](branding/Notification-Ninja-Logo.png) und [PDF](branding/Notification-Ninja-Logo.pdf) vor. Menüs, Regeln, NIM, Canvasbeschriftungen und Ergebnis sind umschaltbar DE/EN; Benutzernamen werden nicht übersetzt.

Musik und Effekte sind separat regelbar, zusätzlich gibt es Stummschaltung, ruhige Effekte und eine unabhängige Einstellung für Bildschirmwackeln. Gewählte Standardwerte: Musik 40 %, Effekte 50 %, Ton aktiv, Wackeln aktiv; die Betriebssystemeinstellung für reduzierte Bewegung wird berücksichtigt. Ton startet erst nach der Browserfreigabe durch eine Nutzeraktion.

## Daten, Migration und Sicherheit

Gastspielstände bleiben unter `notification-ninja:save:v1` im localStorage. Neue Kapitel werden versioniert ergänzt; alte Missions-IDs, gekaufte Inhalte und bereits abgeholte Belohnungen bleiben erhalten. Geräteeinstellungen besitzen einen eigenen normalisierten Schlüssel. Beschädigte Daten fallen auf validierte Vorgaben zurück; blockierter Speicher wird nicht als erfolgreiche dauerhafte Speicherung ausgegeben.

Konten verwenden PostgreSQL über `DATABASE_URL` oder lokal weiterhin eine separate SQLite-Datei. Beide Adapter bieten Transaktionen, Fremdschlüssel, Constraints und Migrationen. Passwort-Hashes: scrypt mit zufälligem Salt, N=32768, r=8, p=1. Sitzungstokens und Wiederherstellungscodes haben 256 Bit Zufall; auf dem Server liegen nur ihre Hashes. Neue v3-Accounttokens werden im Browser nur in **sessionStorage** gehalten, niemals Passwörter gespeichert. Die historische v2-Gerätekennung kann unter `notification-ninja:leaderboard:v1` im localStorage erhalten bleiben, damit frühere eigene Demo-Einträge noch gelöscht werden können; sie ist kein v3-Kontotoken. Abmelden widerruft die Sitzung und kehrt zur Homepage zurück; bestätigte Kontolöschung verlangt das Passwort und entfernt verknüpfte Daten. Der Gastspielstand wird dabei nicht zum letzten Konto umgeschrieben.

Server-Wallet und Ledger sind maßgeblich. Käufe, Belohnungen und Gutschriften erfolgen transaktional mit Idempotenzschlüsseln. Ein Gastkonto darf sichere Einführungseinstellungen übernehmen, aber keine beliebigen lokalen Münzen, XP oder Freischaltungen zu verifiziertem Kontoguthaben machen. Das ursprüngliche Gastprofil bleibt getrennt erhalten. Neue Account-Tages- und Wochenaufgaben verwenden geräteübergreifend UTC (Tag um 00:00, Woche am Montag); Gäste behalten ihren lokalen Kalender. Netzwerkfehler werden mit Status und Wiederholen-Möglichkeit angezeigt; unbestätigte Kontorunden ergeben kein sofort ausgebbares Guthaben.

Gespeichert werden Pseudonym, Passwort-/Wiederherstellungshash, Sitzungshash, Fortschritt, Walletaktionen und servergestartete Laufmetadaten samt Startsnapshot, Protokollhash und geprüftem Ergebnis. Das Eingabeprotokoll wird zur Prüfung übertragen und im Tab zwischengespeichert, auf dem Server aber nicht als rohe Koordinatenfolge dauerhaft abgelegt. Es gibt keine Werbung, Diagnoseprofile oder Analyse persönlicher Reflexionsantworten. Öffentlich erscheinen nur ausdrücklich freigegebene Ranglistenwerte. Das ist keine rechtliche Zertifizierung; Betreiber müssen eigene Hosting- und Datenschutzhinweise ergänzen.

## Rangliste und Grenzen

Die **neue API v3** startet einen konto- und seedgebundenen Lauf und simuliert das begrenzte Eingabeprotokoll mit denselben Spielregeln erneut. Sie übernimmt keine vom Browser behauptete Punktzahl. Nur tatsächlich durch verbrauchte Herzen beendete, geprüfte Open-Runs mit `open-v2` können ausdrücklich veröffentlicht werden. Wiederholte Übermittlung erzeugt keinen doppelten Eintrag. Pro Konto wird die beste veröffentlichte Leistung verglichen.

Replay-Prüfung erschwert einfache Scorefälschung, ist aber kein Schutz gegen jedes automatisierte Spiel. Das Prüfprotokoll ist technisch auf 40.000 Befehle und 2 MiB begrenzt; ein darüber hinausgehender Run bleibt spielbar, wird aber als ungewertete Übung geführt. Eine Rangliste ohne Einträge bleibt leer. Gast-/Übungsruns und kontrollierte Abbrüche werden nicht als geprüft veröffentlicht.

**Öffentliches dauerhaftes Account-Hosting ist noch nicht verbunden.** Die bisherige Render-Free-Rangliste ist eine getrennte historische v2-Demo ohne dauerhaften Datenträger und ohne diese vollständige Laufprüfung. Sie wird nicht zu verifizierten Kontodaten erklärt. Für v3 fehlen extern ein eigener HTTPS-Dienst mit dauerhaft eingebundenem Datenordner und anschließend dessen echte Adresse in `accounts-config.json`. Es wurden weder Bezahlprodukte gebucht noch Zugangsdaten erfunden. [Genaue Einrichtung](../server/README_NINJA_APP.md).

## Konfiguration

`.env.example` zeigt gewählte Vorgaben ohne Secrets. Optional nach `.env` kopieren; `serve:ninja` lädt sie automatisch.

| Variable | Lokal / Bedeutung |
|---|---|
| `HOST` | `127.0.0.1`; öffentliche Bindung braucht explizite Origins |
| `PORT` | `8083` |
| `DATA_DIR` | `./server/data`, dauerhaft wiederverwenden und sichern |
| `ALLOWED_ORIGINS` | Zusätzliche exakte Ursprünge, kommagetrennt; HTTP nur localhost |
| `NODE_ENV` | `production` erzwingt sicheren Betrieb |
| `DURABLE_STORAGE` | Produktion: `1` nur bei tatsächlich persistentem Mount |
| `TRUST_PROXY` | Produktion: `1` nur hinter kontrolliertem TLS-Reverse-Proxy |
| `REQUIRE_HTTPS` | `1` verlangt vom kontrollierten Proxy gesetztes HTTPS-Signal |

Keine Secrets gehören in die öffentliche Accounts-Konfiguration. Die Browser-API nutzt Bearer-Header und keine impliziten Auth-Cookies. CORS, Raten- und Größenlimits ergänzen die Authentifizierung; sie ersetzen sie nicht.

## Prüfen und paketieren

```bash
npm run test:ninja
npm test
npm run build:ninja
npm run package:ninja
```

Optionaler wiederholbarer Chromium-Abnahmelauf (lokalen Dienst zuerst starten):

```bash
npm run test:ninja:browser
```

Er prüft fünf Breiten, Einstellungen, Navigation, Tastentraining, echte Touch-/Mausschnitte, Pause und ruhiges Dojo und legt Screenshots/JSON unter `test-results/ninja-browser` ab. Falls Chromium fehlt: `npx playwright install chromium`; alternativ `NINJA_CHROMIUM` auf einen installierten Browser setzen. `NINJA_BASE_URL` erlaubt einen anderen lokalen Testport.

Das ZIP enthält alle benötigten Bilder, beide Sprachen, Homepage, Bundle und einen eigenen Offline-Cache. Es enthält keine Kontodatenbank oder echten Zugangsdaten. [Tatsächlich ausgeführte Tests, Bildschirmgrößen und offene Nachweise](TEST_REPORT.md). Emulierte Touchbedienung ist kein physischer iPhone-Test; Verständlichkeit mit Jugendlichen und die Zielbildrate auf einem festzulegenden realen Gerät müssen gesondert erhoben werden.

## Aufbau

`src/game.js` simuliert Regeln; `progression.js`, `adventure.js`, `journey.js` halten zentrale Kataloge. `renderer.js` zeichnet, `audio.js` erzeugt Musik, `i18n.js` übersetzt die Darstellung. `accounts.js` spricht die API, `verified-run.js` protokolliert Runs, `account-ui.js` zeigt Formulare. `practice.js` ist die getrennte ungewertete Tastenübung. `server/ninja-service.mjs` liefert HTTP und statische Dateien; `ninja-auth.mjs` authentifiziert, `ninja-store.mjs` verwaltet SQLite, `ninja-postgres-store.mjs` PostgreSQL und `ninja-game-service.mjs` validiert Fortschritt und Läufe.

Projektteam laut Auftrag: Matteo Müller – Frontend; Kevin Brugger – Backend; beide programmieren. Daraus folgt keine Behauptung über die Urheberschaft einzelner Codezeilen.


### Gastprofil-Löschung bei Ausfall der alten Rangliste

Bei einem Gastprofil mit historischem v2-Ranglisteneintrag wird zuerst dessen Online-Löschung versucht. Ist der alte Dienst nicht erreichbar, bleibt das Gastprofil zunächst unangetastet. Danach kann der Spieler ausdrücklich eine **nur lokale** Löschung bestätigen. In diesem Fall können alte veröffentlichte Ranglisteneinträge weiterhin online bestehen; die alte Löschberechtigung bleibt zur späteren Wiederholung auf diesem Gerät gespeichert. Diese lokale Ausnahme betrifft **nicht** die separate serverseitige v3-Kontolöschung.

Die öffentliche Homepage beschreibt 18 Hauptmissionen plus acht Zusatzherausforderungen; vorhandene Spielstände und Missions-IDs bleiben unverändert. Nach Änderungen an `src/` müssen `npm run build:ninja` und `npm run package:ninja` ausgeführt und die erzeugten Release-Dateien vor einer Pages-Veröffentlichung mit eingecheckt werden.


### Version 3.1.0 – Release-Ablauf

Build- und Service-Worker-Version sind **3.1.0**, damit vorhandene Offline-Installationen die aktualisierten Dateien beim nächsten regulären Update laden. In `notification-ninja/index.html` führen beide Downloadlinks zur ZIP-Datei `downloads/Notification-Ninja-3.1.0.zip`. Das Paket wird reproduzierbar durch `npm run package:ninja` erzeugt; ein ZIP ist keine Quelle für serverseitige Konten. Der alte Download 3.0.0 bleibt als historisches Archiv erhalten.

```bash
npm ci
npm run build:ninja
npm run test:ninja
npm run package:ninja
```
