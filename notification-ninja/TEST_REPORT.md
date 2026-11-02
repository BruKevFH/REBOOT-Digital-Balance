# Technische Abnahme: Notification Ninja 3.0.0

Stand: **02.11.2026**. Geprüft wurde die bestehende, weiterentwickelte Anwendung mit Node24, esbuild und SQLite sowie **Chromium151.0.7922.173 / Playwright1.62.1** unter Linux. Es wurden keine öffentlichen Testkonten oder erfundenen Ranglistenwerte angelegt. Mobilprüfungen verwenden emulierten Touch, kein physisches iPhone.

## Ausgeführte Prüfungen

| Prüfung | Tatsächliches Ergebnis |
|---|---|
| `npm --cache /workspace/.npm-cache ci --ignore-scripts --no-audit --no-fund` | Installation aus aktualisiertem Lockfile erfolgreich |
| `npm test` | **377 bestanden**, 0 Fehler, 0 übersprungen; einschließlich bestehender separater Spiele |
| `npm run test:ninja` | **332 bestanden**, 0 Fehler, 0 übersprungen |
| `node --test tests/ninja-i18n.test.mjs` nach Wörterbuchbereinigung | 11 bestanden; letzte Bereinigung entfernt nur fünf redundante frühere Schlüssel |
| `npm run build:ninja` | Beide lokalen Bundles erfolgreich, nach Bereinigung ohne Buildwarnungen |
| Worker-/Bundleprüfung aus dem CI-Workflow | Syntax, vollständiger Cache und getrennte Homepage-/Spiel-Navigation tatsächlich ausgeführt und bestanden |
| `NINJA_BASE_URL=http://127.0.0.1:8133/notification-ninja/ npm run test:ninja:browser` | Alle fünf Breiten bestanden; echte Eingaben, Einstellungen, Navigation, Übung und stabile Rückkehr ins Dojo |
| `npm run package:ninja`, zweimal | Reproduzierbarer ZIP, CRC und Identität aller 16 Laufzeitdateien geprüft |
| Docker-Build `server/Dockerfile.ninja-app` | Erfolgreich; finaler Build mit aktuellem Bundle ebenfalls erfolgreich |
| Echter Docker-Lebenszyklus | Nichtroot-Container, Konto/Umbenennung, Container entfernen und neu mit demselben Volume erstellen: Profil, Revision und Sitzung erhalten; Passwortlöschung widerruft Zugriff |

Der Docker-Lauf verwendet lokalen Loopback mit kontrolliertem Proxy-Header. Er behauptet keine öffentliche TLS-Bereitstellung. Nur die selbst angelegten Testcontainer und Volumes wurden anschließend entfernt.

### Inhaltlich kritische automatisierte Tests

- **Auth und Store:** zufällig gesalzene scrypt-Hashes, keine Klartext-Geheimnisse, Unicode-/Großschreibungs-Kollisionen, parallele Registrierung, neutrale Fehler, Ablauf/Logout/Sitzungsgrenze, rotierter Wiederherstellungscode, konkurrierender Reset, eigene Umbenennung und bestätigte kaskadierende Löschung.
- **HTTP:** Zugriffsschutz, fremde Run-IDs, bewusst ignorierte Auth-Cookies, exaktes CORS/Preflight, Ratenlimits samt Erholung eines vollen Speichers, JSON- und Streaminggrößen, kontrollierter Proxy, neutrale Logs, statische Pfad-/Dotfile-/Symlink-Sperren.
- **Ökonomie:** Serverpreise und Voraussetzungen, zu wenig Guthaben, doppelte/gleichzeitige Käufe und Claims, nichtnegatives Wallet, Rollback, doppelte gleichzeitige Run-Abschlüsse mit genau einer Gutschrift. Ein Run überschreibt keine während der Pause getätigten Käufe oder Claims.
- **Replay:** servergestarteter Seed/Startzustand, echtes Nachspielen von Eingaben, Methoden-/Zeit-/Koordinaten-/Umfangsgrenzen, fremde/abgelaufene/ersetzte Runs, gefälschte Punktfelder, unmögliche aktive Zeit und nachträglich geänderte Abschlüsse abgewiesen. Erst ausdrückliches Veröffentlichen eines passenden Herzverlust-Open-Runs erzeugt einen Ranglisteneintrag.
- **Kampagne:** alle 18 Hauptmissionen durch tatsächliche Simulation und öffentliche Swipe-Methoden abgeschlossen, Erstbelohnungen ausdrücklich einmal abgeholt, beide Kapitelwechsel kostenlos freigeschaltet. Acht alte Missionen, Bestleistungen und Claims bleiben bei Schema1→2 erhalten.
- **Client:** Gast-/Konto-Speicher getrennt, keine Passwörter oder v3-Tokens im localStorage, Sitzungsablauf, kontoübergreifende verzögerte Antworten, aus der Reihenfolge eintreffende Revisionen, verlorene Kaufantwort mit identischem Wiederholungsschlüssel, Pendingtrace nach 401 erhalten, Logobergrenze ohne erfundenes Prüfresultat.
- **Bestehende Spielregeln:** Punkte/Kombos/einmalige Objektwertung, Herzverlust, Schild, unbegrenzter Open-Verlauf, drei Herzen und ausgeschaltete Kaufvorteile, Wurfhand/Resize/Save, 24 Erfolge, seltene Münzen, tägliche/wöchentliche Aufgaben, drei Bosse und Altspeicher.
- **Kalender:** Konten verwenden UTC; Wien, Los Angeles, Auckland, Honolulu und Kiritimati wurden in passenden Teilprüfungen nahe Tages-/Wochenwechsel verglichen. Bestehende Gäste behalten lokale Perioden.

## Tatsächliche Browserabläufe

| Ablauf | Ausgeführter Nachweis |
|---|---|
| Homepage → Gast → Tutorial → erste Mission | Vollständiger360px-Touchablauf: NIM-Training durch6richtige Entscheidungen gelernt (4Schnitte/2Durchlässe,14,366s), ohne Überspringen, Münzen oder Run-Gutschrift. Danach erste30s-Mission mit14richtigen Entscheidungen abgeschlossen und ins stabile Dojo zurück. Kein JS-Fehler oder POST. Hinweise nur im Training. |
| Alle drei Kontexte | Namensloser Start, echte Touchschnitte in Lernen/Gaming/Schlafen bei360px, Maus bei1280/1920px |
| Kurze vollständige Runde | Lernrunde mit realen Eingaben bis zum Ende, tatsächlicher Herzverlust bei falschem Schnitt, Pause friert alle Felder; Ergebnisse und freiwillige Reflexion |
| Kampagne → Claim → nächste Mission | Erste30s-Mission per tatsächlicher Maus:19 richtige Entscheidungen, kein Herzverlust, servergeprüft;3Münzen ausdrücklich einmal abgeholt, nächste Mission gestartet. Dieser UI-Nachweis stammt vom30.10.; die endgültigen Simulationstests aller18Missionen wurden erneut ausgeführt. |
| Registrierung/Anmeldung/Profil | Echte API-Registrierung, einmaliger Code, Umbenennung, Logout/Login und bestätigte Löschung bei360/390/768/1280/1920px |
| Kauf/Ausrüstung/neue Runde | Private Testwallet mit120Testmünzen, ausdrücklich keine behauptete Spielbelohnung:80Münzen nach Vorschau/Bestätigung abgebucht,40übrig, noch alterSkin; Solar ausdrücklich ausgerüstet, Reload erhält ihn, tatsächliche Open-Werfer tragen Solar |
| Open → Prüfung → Veröffentlichung | Zwei tatsächlich per Eingaben gespielte Runs enden mit null Herzen:15,5826s/200Punkte und34,3619s/800Punkte; Server-Replay bestätigt. Beide ausdrücklich veröffentlicht; getrennte Browser sehen dieselbe absteigend sortierte gemeinsame Liste. Weitere eigene frühere private Testspieler bleiben dabei korrekt sichtbar. |
| Netzwerkunterbrechung | Finish blockiert → keine geprüften/spendbaren Coins vorgetäuscht → Retry nach Wiederverbindung bestätigt Ergebnis; zweiter Browser lädt bestätigten Kontostand |
| Konto aktualisieren | Neuer Knopf holt echtes `/me`; blockierte Verbindung zeigt Unterbrechung/letzten bestätigten Stand, erneutes Verbinden erfolgreich; Englisch bleibt nach Logout/Login erhalten |
| Auth-Navigation | Login→Registrierung→Browser-Zurück; Wiederherstellung→Reload; Wiederherstellung→Login→Zurück; Schließen setzt Rückroute; direkter Registrierungslink bleibt nach Reload |
| Einstellungen/Übung/Dojo | Getrennte Lautstärken, Mute, Sprache und Shake gespeichert; neun Übungsentscheidungen plus Fehlerfeedback, kein Profilgewinn; mehrere echte Runden hintereinander, Rückkehr mit Kameraoffset0/0 |
| Offline | Erster Homepagebesuch cached beide Bundles samt Bildern; englische Homepage offline neu geladen, Gast-Gaming per Touch, Score/Run nach Reload korrekt, Fortsetzen und Rückweg zur getrennten deutschen Homepage |

Die spielerische Kernprüfung umfasst zusätzlich390×844,844×390 und1280×800. Der wiederholbare finale Browserlauf verwendet **360×844,390×844,768×900,1280×900,1920×900**. Sichtbare Kernziele sind dort mindestens44CSS-Pixel groß; keine horizontalen Überläufe, JavaScript-Ausnahmen oder fehlenden englischen Texte in den geprüften Ansichten. Accountdialoge halten den Tastaturfokus und stellen ihn beim Schließen wieder her.

## Nachweise und Wiederholung

Ein datensparsamer [zusammengefasster Browser-/Containerbericht](../docs/verification/ninja-v3/report.json) liegt im Repository. Beispielbilder: [Dojo1280](../docs/verification/ninja-v3/dojo-1280.png), [Tastenübung360](../docs/verification/ninja-v3/practice-360.png), [echter Missionserfolg](../docs/verification/ninja-v3/mission-success-1280.png). Passwort, Sessiontoken und Wiederherstellungscode sind darin nicht enthalten.

Der wiederholbare Lauf liegt in `scripts/check_ninja_browser.cjs`; lokale Ergebnisse und Screenshots entstehen unter `test-results/ninja-browser` und werden nicht als Nutzerdaten eingecheckt. Die übrigen neuen Tests liegen unter `tests/ninja-*.test.mjs`. Der GitHub-Workflow führt die Node-Tests, Build, Paketierung und die tatsächliche Worker-Routenprüfung aus.

## Paket

`Notification-Ninja-3.0.0.zip`: **9.608.705Bytes**,16identische Laufzeitdateien plus `START-HIER.txt`.

SHA256: `3dc282d3ee9312bb7e4c79e4eef00f8239bbfa3a6ce9f8072bc2823d9d0ffeee`.

Das ZIP enthält das vollständige Gastspiel, keine Serverdatenbank oder echten Zugangsdaten. Accounts und neue geprüfte Rangliste benötigen den getrennten Node-Dienst. Eine native Windows-/Unreal-Ausgabe wird nicht behauptet.

## Behobene konkrete Fehler

- Neuere Profile konnten durch verspätete Antworten älterer Sitzungen oder Revisionen überschrieben werden: jetzt Konto-/Sitzungs- und Revisionsprüfung.
- Kaufbestätigung konnte nach verlorener Antwort einen neuen Schlüssel erhalten: derselbe Vorgang wird mit gleichem Idempotenzschlüssel wiederholt.
- Voller Ratenlimit-Speicher erholte sich nach Ablauf nicht: Bereinigung auch an der Kapazitätsgrenze geprüft.
- Neue Sitzungen konnten bei identischen Zeitstempeln verdrängt werden: eindeutige Einfügereihenfolge verwendet.
- Neue Schlafmission erhielt zu früh das alte8s-Stoppangebot; Gamingeinführung zeigte falsche Missionsdauer: an verfasste Missionsziele angepasst.
- Account-Tages-/Wochenwechsel waren je Browserzeitzone verschieden: neue Konten verwenden UTC, Gäste bleiben unverändert.
- Kauf rüstete Skins sofort aus: Ausrüsten ist jetzt ausdrücklich separat.
- Login-/Registrierungs-/Recovery-Unteransichten verloren beim Neuladen die Route: Hashverlauf und Rückweg tatsächlich geprüft.
- Mute-/Musiktaste und neue Einstellungen waren uneinheitlich: gemeinsamer Zustand; kleine mobile Ziele und fehlende englische Status-/Zeittexte korrigiert.
- Der erneute Download aus einer entpackten HTTP-Version verwies auf ein nicht enthaltenes verschachteltes ZIP: beide Downloadlinks verweisen jetzt auf das öffentliche Originalarchiv.
- Die neue Konfigurationsroute hatte in der Worker-Überarbeitung einen ungültigen URL-Aufruf: vor Veröffentlichung behoben, automatisierte Worker- und echte Offlineprüfung bestanden.

## Verbleibende Grenzen und Deployment

**Lokal bestätigt:** vollständiger integrierter Dienst und Gastspiel, Dateipersistenz und Docker-Volumepersistenz. **Extern fehlt:** ein tatsächlich eingerichteter HTTPS-Host mit beständigem Mount, danach dessen echte `/api/v3`-Adresse in `accounts-config.json` und eine öffentliche Zwei-Konten-/Neustartprüfung. Die frühere Render-Free-v2-Demo ist weder ein dauerhaftes Accountbackend noch eine Replay-geprüfte Rangliste. Kein Bezahlprodukt wurde gebucht. [Exakte Schritte](../server/README_NINJA_APP.md).

Das statische Runtime-Paket ist für die bestehende GitHub-Pages-Seite vorbereitet; die Abschlussmeldung nennt den tatsächlichen Veröffentlichungsnachweis. Eine lokale Vorschau oder ein Docker-Test allein wird nicht als öffentliches Hosting ausgegeben.

Nicht durchgeführt: physisches Safari-/iPhone-Spiel, Jugendliche als Testpersonen, festgelegte reale30FPS-Messung, professionelle Sicherheits-/Rechtszertifizierung. Direktes `file://` ist im verwalteten Browser eingeschränkt; der entpackte Download wurde über HTTP geprüft. Technische Replaygrenzen (40.000Befehle/2MiB) begrenzen die Ranglistenprüfung eines sehr langen Runs, nicht dessen Spielzeit. Kein Schutz gegen alle Bots behauptet.

Frühere, unveränderte Fähigkeiten-, Effekt- und Mock-up-Prüfungen bleiben als Historie im Git-Verlauf nachvollziehbar; sie werden hier nicht als neue physische Tests ausgegeben.
