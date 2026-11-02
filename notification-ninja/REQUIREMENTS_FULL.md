# Anforderungsmatrix: vollständiger Ausbau

Grundlage: Nutzerauftrag mit 39 Abschnitten, am 30.10.2026 erneut unverändert übermittelt. Bestandsaufnahme: bestehende Canvas-/Web-Audio-App, Vanilla-JavaScript, esbuild, Node 24, bisher SQLite-Rangliste v2 ohne Passwortkonten und ohne vollständige Replay-Prüfung. Gastspiel, Bildwelten, zwei Sprachen, 24 Erfolge, neun Fähigkeiten, acht Karrieremissionen und drei Bosse sind vorhanden. Die Baseline wurde lokal mit 276 Tests und Chromium geprüft; das ist noch kein Nachweis für die neuen Funktionen. Vorhandene Spielstände bleiben erhalten.

Statuskürzel: **G** implementiert und geprüft; **U** implementiert, neue Prüfung offen; **T** teilweise; **F** fehlt; **E** externe Einrichtung fehlt. Die Spalte „Stand zu Beginn“ hält die Bestandsaufnahme fest; der Abschlussstand folgt unten mit Quell- und Prüfverweisen. Die PDF-Matrix [REQUIREMENTS.md](REQUIREMENTS.md) bleibt zusätzlich bestehen.

| Abschnitt / Anforderung | Stand zu Beginn des Ausbaus | Notwendige Änderung | Prüfmethode |
|---|---|---|---|
| 1 Bestandsaufnahme/Matrix | G | Neue Nachweise fortlaufend dokumentieren | Repository, bestehende Tests, diese Matrix |
| 2 Einziger Titel/Team/Zielgruppe | G/T | Projektinfo ergänzen; keine Heilversprechen | Sichtbare Texte/Metadaten DE/EN |
| 3 Wischspiel/Objektkategorien | G | Bestehende zentrale Regeln erhalten | ninja.test, reale Maus-/Touchschnitte |
| 4 Drei Kontexte/Regelmatrix | G/T | Kontextmatrix dokumentieren | Regeltests und Raumgrafiken |
| 5 Zusammenhängende Navigation | T | Hashrouten, aktive Navigation und Fokus | Direktlink, Reload, Browser Zurück |
| 6 Öffentliche Homepage | G/U | Account-Einstieg integrieren | Responsive Screenshot und echte Links |
| 7 Accounts/Gast/Wiederherstellung | F/G Gast | scrypt, Sessions, Wiederherstellungscode, Accountoberfläche | Auth-/HTTP-/Browserintegration, kein Passwort im Browserspeicher |
| 8 Dojo | G/T | Kontostatus und Sync integrieren | Account-/Gast-Browserabläufe |
| 9 Kampagne mindestens 18 Missionen | T acht alte | 18 Hauptmissionen und Migration, Kapitel-Freischaltung | Missionsbedingungen/Altspielstand/Browserkarte |
| 10 Open Run | G/T | Server-Saat und Replay; unveränderte Drei-Herzen-Regeln | Open-Parität, Ablauf bis Herzverlust |
| 11 Einmalige Bewertung/Herzverlust | G | Erhalten | Regel-/Kombotests |
| 12 Flow/Overload/Super | G/U | Neue Einstellungen integrieren | Gameplay, Effekte, Sounds |
| 13 Spielansicht/Bedienung | G/U | Neue Ansichten responsiv integrieren | 360/390/768/1280 und großer Bildschirm |
| 14 Vollbild/Laden | G/U | Erhalten | Nutzeraktion, Ablehnung, Ladefehler |
| 15 NIM/erste Freischaltungen | G/U | Neue Funktionen erklären | Einmalige Hinweise und ruhiger Modus |
| 16 Tutorial | G/T | Zusätzlich ungewertetes Tastentraining | Tutorial- und Übungsablauf |
| 17 Ergebnis/Reflexion | G/T | Validierungs-/Publikationsstatus hinzufügen | Echte Zahlen, freiwillige Reflexion, Pause/Ausstieg |
| 18 Münzsystem | T lokal | Autoritative Wallet, Ledger, atomare Gutschriften | Doppelte/gleichzeitige Aktionen, Neustart |
| 19 Basar | T lokal | Kaufbestätigung und Serverprüfung | Mangelguthaben, Doppelkauf, Ausrüstung |
| 20 Skins | G/T | Serverbesitz/Kosmetik in Open | Kauf, Neustart, sichtbare Würfe |
| 21 24 Erfolge | G/T | Serverclaims und keine Doppelbelohnung | 24 Definitionen und Abholung |
| 22 Benachrichtigungen | G/T | Serverlesestatus; Belohnung separat | Ansehen entfernt ungelesen, Claim bleibt |
| 23 Gemeinsame Rangliste | T/E alte Demo | Neue Replay-validierte und ausdrücklich veröffentlichte Runs | Zwei Accounts, Neustart, falsche Logs, keine erfundenen Zeilen |
| 24 Profil | T lokal | Echter Accountstatus, Passwort-Löschung, Logout | Login/Logout/Reset/Delete und Gasttrennung |
| 25 Einstellungen | T | Separate Lautstärken, Mute, Shake, Übung | Audio-Graph, Speicher-Normalisierung, Tastatur |
| 26 Design/Logo | G/U | Neue Formulare im Papier-Dojo-Stil | Screenshotvergleich und DE/EN |
| 27 Responsive/Zugänglichkeit | T | Neue Formulare/Fokustrap/Choice-Übung | Vier Größen, Fokus, Touchziele, Kontrast |
| 28 Performance/Stabilität | G/U | Neue Endpunkte und Recorder begrenzen | Mehrere Runden, keine Doppel-RAF, Fehlerkonsole |
| 29 Backend/DB/Architektur | T | Node24/SQLite integrierter Dienst und Migrationen | Reale DB, Constraints, Transaktionen |
| 30 Sicherheit/Datenschutz | T | Hashes, Sessiontrennung, Rate/CORS/CSRF/Größenlimits | Negative HTTP-/Zugriffstests, keine Geheimnisse im Bundle |
| 31 Sync/Migration | T | Servermaßgeblichkeit; sichere Gastübernahme | Altsave, zwei Tabs, Konflikt-/Retry-/Neustarttest |
| 32 Fehlerfälle | T | Timeout/Sessionablauf/Offline/Pending/Retry | Erzwungene Netzwerk-/Speicher-/Eingabefehler |
| 33 Hosting | T/E | Lokal integrierter dauerhafter Dienst; HTTPS-Host mit Datenträger fehlt extern | Lokaler Neustart; reale externe Prüfung erst nach Einrichtung |
| 34 Bekannte Korrekturen | T | 35 Einzelkorrekturen gegen Integration prüfen | Zuordnung zum Prüfbericht |
| 35 Tests/Abnahme | T | Neue kritische Integrations-/Browsertests | Nur ausgeführte Tests als bestanden melden |
| 36 Umsetzungsschritte | G laufend | Lokal ausführbare Anforderungen vollständig integrieren | Quellcode und Abschlussprüfung |
| 37 Frühere Ideen | G | Keine Rückkehr zu anderem Spiel/Marke | Sichtbare App prüfen |
| 38 Definition of Done | T | Alle lokalen Pflichtwege funktionsfähig | End-to-End A bis I |
| 39 Abschlussbericht | F | Start, env, Daten, Migration, Tests, Grenzen, Deployment dokumentieren | README, TEST_REPORT, diese Matrix |

## Abschlussstand der lokalen Umsetzung

Stand der technischen Abnahme: 02.11.2026. **G** heißt ausgeführte technische Prüfung im verfügbaren Cloud-System. Es ersetzt weder einen physischen Safari-Test noch Verständlichkeitstests mit Jugendlichen. Öffentliche dauerhafte Konten sind ausdrücklich **E**, bis ein echter Host verbunden und dort geprüft ist.

| Abschnitte | Abschlussstand | Implementierung / konkreter Nachweis |
|---|---|---|
| 1–2 Bestandsaufnahme, Name, Zielgruppe | G | Diese Ausgangs-/Abschlussmatrix; README, sichtbare Titel, finale Wortmarke, Projektinfo. Keine Diagnose-/Heilversprechen. |
| 3–4 Kontext, Wischen, Welten | G | [Kontextmatrix](CONTEXT_MATRIX.md), `src/game.js:CONTENT`, drei Originalillustrationen; bestehende Bewertungs-/Wurf-/Herztests und echte Maus-/Touch-Eingaben. |
| 5–6 Navigation, Homepage | G | `src/main.js` Hashrouten und Verlauf, `home.html`, `src/home.js`; Direktaufrufe/Reload/Zurück und aktive Spielweltennavigation in Chromium. |
| 7–8 Anmeldung, Gast, Dojo | G lokal / E öffentlich | `accounts.js`, `account-ui.js`, `ninja-auth.mjs`, `ninja-store.mjs`; echte Registrierung/Code/Login/Reset/Logout/Löschung, fünf Fenstergrößen. Statischer Gast ohne Name. |
| 9 Kampagne | G | `adventure.js`, `game.js`, `en-campaign.js`; 18 Hauptmissionen in drei Kapiteln plus acht erhaltene Herausforderungen, echte Simulation aller Missionen und erste UI-Mission mit Serverprüfung/Claim/nächster Mission. |
| 10–11 Open und Bewertung | G | Einheitlich drei Herzen, kein Countdownende, unveränderte Open-v2-Regeln; echte Simulation, Herzverlust, Pause, kontrollierter ungewerteter Abbruch. |
| 12–15 Flow, Spielansicht, Laden, NIM | G / U physischer Vollbildnachweis | Echte Würfe/Supers/10-25-50-Effekte, große Herzen und Seitenleiste; NIM pausiert. Vollbild braucht Browserfreigabe; iPhone-Safari nicht physisch geprüft. |
| 16 Tutorial und alternative Übung | G | Wiederholbares Wischtraining; `practice.js` mit neun Kontextentscheidungen, großen zwei Tasten und Tastatur, ohne Zeitdruck/Belohnung. |
| 17 Ergebnis/Reflexion | G | Tatsächliche Kennzahlen, freiwillige lokale Auswahl, gleichwertiger Neustart/Ausstieg; Account-Prüfstatus und Wiederholen/als Übung abschließen. |
| 18–20 Wallet, Basar, Skins | G lokal | Serverpreise, SQL-Ledger, Constraints und Transaktionen; gleichzeitige Käufe/Claims/Run-Abschlüsse; Vorschau und Kaufbestätigung, Ausrüsten separat. |
| 21–22 Erfolge und Inbox | G | 24 Definitionen erhalten; serverseitige einmalige Claims, einzelne Lesemeldung unabhängig von Belohnung; abholbare Belohnungen zuerst. |
| 23 Gemeinsame Rangliste | G lokal / E öffentlich | Serverstart mit Seed, Eingabelog-Replay, explizites Veröffentlichen; zwei Konten und echte SQLite-/HTTP-Neustarts. Keine alten Demozeilen als geprüft ausgegeben. |
| 24–25 Profil/Einstellungen | G | Bestätigte Passwortlöschung, Trennung Gast/Konto, Sitzungswiderruf; separate Lautstärken, Mute, Sprache, ruhige Effekte, unabhängiges Wackeln, Hilfe und Tastentraining. |
| 26–27 Gestaltung/Zugänglichkeit | G technisch / U Nutzungsprüfung | DE/EN, fünf Viewports, mindestens 44px Kernziele, Dialogfokus und Wiederherstellung, Text+Symbole; Verständlichkeit/Zielgruppenfeedback offen. |
| 28 Leistung/Stabilität | G funktional / U physische FPS | Begrenzte Bilder-/Effekt-/Loggröße, ein RAF/Pointersatz, Pause/Dojo stabil, keine beobachteten JS-Ausnahmen im geprüften Ablauf. Ziel-FPS auf realem Gerät nicht belegt. |
| 29–30 Backend/Sicherheit | G technisch | Getrennte Store/Auth/Game/HTTP-Module, scrypt und Tokenhashes, parametrisierte SQLs, FK/CHECK/WAL/Migrationen, CORS/Größen-/Ratenlimits, Bearer-only, neutrale Logs; keine Sicherheitszertifizierung. |
| 31 Migration/Sync | G lokal | Alte IDs/Claims/Guthaben erhalten, Konto-Wallet maßgeblich, safe Gastübernahme einmalig ohne Import fremder Coins; Serverneustart und verzögerte kontoübergreifende Antworten geprüft. |
| 32 Sonderfälle | G | Geblocktes Finish → sichtbarer Pendingzustand → Retry; abgelaufene Sitzung/Run, beschädigter Save, blockierter Speicher, doppelte Aktionen, unbekannte IDs und offline Gast. |
| 33 Hosting | E dauerhafter öffentlicher Dienst | [Exakt fehlende Schritte](../server/README_NINJA_APP.md): HTTPS-Host mit persistentem Mount, reale API-Adresse konfigurieren, zwei Konten und Neustart öffentlich prüfen. Kein kostenpflichtiger Dienst gebucht. |
| 34 Bekannte Korrekturen | G technisch / U echte Geräte | Zuordnung unten; konkrete Browser-/Unitnachweise im [Prüfbericht](TEST_REPORT.md). |
| 35–36 Tests/Etappen | G technisch / U menschliche Abnahme | Bestehende Tests erhalten, neue Integrationstests und echte Browserabläufe; keine Anzahl als alleiniger Qualitätsbeleg. |
| 37 Frühere Ideen | G | Keine Wiedereinführung fremder Spielmarken in die Ninja-App; andere Repositoryprojekte bleiben technisch getrennt. |
| 38 Definition of Done | G lokal / E online / U Zielgruppe | Lokal ausführbare Kernanforderungen implementiert; Hosting- und physische/humane Nachweise bleiben ausdrücklich offen. |
| 39 Abschlussbericht | G | [README](README.md), [Backendstart/Umgebung](../server/README_NINJA_APP.md), [Prüfbericht](TEST_REPORT.md), diese Matrix und Abschlussmeldung. |

### Zuordnung der 35 bekannten Korrekturen aus Abschnitt 34

| Nummern | Funktion / Prüfung |
|---|---|
| 1–3 | Einziger Titel, finales Logo, eigene Homepage; DE/EN-Metadaten und sichtbare Seiten geprüft. |
| 4–5 | Echte optionale Konten lokal; Gastspiel ohne Pflichtregistrierung. |
| 6–8 | Kapitel-Freischaltungen, aktiver Spielweltenlink, 18 Hauptmissionen; Migrations-/Missions-/UI-Tests. |
| 9–12 | Open ohne Countdown, drei Herzen, steigendes Tempo, Ende durch Herzen; reine Simulations- und Ablaufprüfungen. |
| 13–15 | Ein/zwei/drei große Werfer, ausgewählter Look, Gegenstand tatsächlich an der Hand; gemeinsame Posen-/Wurfprüfungen. |
| 16–20 | Große Herzen, keine breite Bodenleiste, lesbare rechte Infos, auffällige Super, Vollbild nach Nutzeraktion; responsive Spielgeometrie. |
| 21–23 | Dojo stabil, einzelne „Ansehen“-Meldung verschwindet, ungeclaimte Coins zuerst; Renderer-/Inbox-/Rewardprüfungen. |
| 24–28 | Bestätigte reale Serverkäufe, 24 Erfolge, NIM, echte Ergebnisse/Reflexion; neue geprüfte Rangliste lokal dauerhaft, öffentlich noch E. |
| 29–32 | Logout, Passwortbestätigung vor Kontolöschung, Ladeansicht, fünf Fensterbreiten; Auth-/Browserprüfungen. |
| 33–35 | Tatsächliche Maus-/Touchbedienung, Pflichtaktionen funktionsfähig, Test-/Hostinggrenzen offen benannt. |

### Nachtrag: gezielte Fehlerkorrekturen nach Version 3.0

- **Homepage / Kampagne:** Veraltete Angabe „acht Missionen“ ersetzt durch 18 Hauptmissionen und acht separate Herausforderungen; Deutsch und Englisch erhalten dieselbe Aussage. Regressionstest: `tests/ninja-guest-deletion.test.mjs`.
- **Löschen des alten Gastprofils:** Der normale Weg bleibt fail-closed, solange eine frühere v2-Ranglistenlöschung nicht bestätigt werden kann. Nach dem Fehler kann der Nutzer ausdrücklich eine **nur lokale** Löschung wählen; die möglicherweise noch öffentliche v2-Publikation und der verbleibende Löschzugang werden klar benannt. Der v3-Kontolöschpfad bleibt unverändert. Regressionstests: `tests/ninja-guest-deletion.test.mjs`.
- **Release 3.0.1:** Quellstand, gebaute Bundles, Versionsmetadaten, Cache-Update und ZIP mit SHA-256 in `main` zusammengeführt; GitHub-Pages-Deployment erfolgreich. Die zuletzt im Release-Workflow ausgeführte Ninja-Suite bestand mit 339/339 Tests. Nachweise im [Prüfbericht](TEST_REPORT.md).

- **Noch extern offen:** Öffentlicher HTTPS-Host mit persistentem Storage für v3-Konten und die verifizierte Rangliste; physische Safari-/Geräte- und Zielgruppenabnahme; unabhängiger HTTP-/Bytegleichheitsvergleich der öffentlich ausgelieferten 3.0.1-Dateien.
