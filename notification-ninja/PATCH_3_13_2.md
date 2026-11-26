# Notification Ninja 3.13.2 – Geräte, Lesbarkeit und Übergänge

Stand: 26. November 2026. Diese Überarbeitung erhält Konten, Gastprofile, Preise, Inhaltskennungen und Freischaltungen. Die bestehenden fünf Skin-Seltenheiten, zwölf Ninja-Looks, 18 Fähigkeiten mit sechs Supers, 36 Erfolge, Spielzeit-Erinnerungen und Wochenprämien werden weiterverwendet.

## Konkret korrigiert

- **Kleine Displays:** Lange Seitentitel passen bei 320 Pixeln. Zurück, Sprachwahl, Konto und Einstellungen überdecken sich auch auf Englisch nicht. „Leaderboard“ erhält genügend Platz, ohne die Navigationsschrift zu verkleinern. Die vorhandenen zugänglichen Namen und mindestens 44 Pixel großen Bedienflächen bleiben erhalten.
- **Dark und Noir:** Missionen, Statusangaben, Hilfe-Beispiele, Tastenkürzel, Ranglisten, Podium, Erfolge, Profilfelder und Datenschutzlinks bekommen zum jeweiligen Kartenhintergrund passende Textfarben. Dunkle Missionskarten verwenden konsequent helle Beschriftungen; verbleibende Papierflächen behalten dunkle Tinte.
- **Gestaltung:** Der Dorfhintergrund ist außerhalb der Karten deutlicher sichtbar. Die gemeinsame Wortmarke und die vorhandenen illustrierten Dojos bleiben erhalten. Der Basar verwendet weiterhin dieselbe Gaming-Kulisse wie die Spielwelten.
- **Deutsch/Englisch:** Kapitelnummern, Bonusmissionszähler, MFA-Eingaben, Notfallcode-Hinweise und Fehlermeldungen werden vollständig übersetzt. Die Diagnose erkennt auch deutsche Teiltexte in bereits teilweise übersetzten Sätzen. Die Hilfe verweist auf die tatsächlich angebotenen Welten, Looks und Fähigkeiten.
- **Ninja-Intro:** Ein echter bildschirmfüllender Dialogschutz verhindert Klicks und Fokus in der Navigation dahinter. Schließen stellt Fokus, Scrollposition und zuvor bestehende Sperren wieder her. Optionale Erzählstimme darf einen Satz vor dem nächsten automatischen Szenenwechsel beenden; ohne Sprache bleibt die Animation 20 Sekunden lang und jederzeit überspringbar.
- **Spielzeit:** Ältere Tabs schreiben neue Zeit als Differenz auf den aktuellen Speicherstand. Sie überschreiben keine inzwischen gespeicherte Spielzeit oder fremde Erinnerungseinstellung. Gezählt werden weiterhin ausschließlich sichtbare aktive Runden auf diesem Gerät.
- **Kontofenster und Zurück:** Das Schließen eines Kontofensters hinterlässt keinen doppelten Spieleintrag. Escape, Schließen, Browser-Zurück/-Vorwärts und der Wechsel zum Ninja-Profil behalten den tatsächlichen Rückweg und den Fokus.
- **Offline-Einstieg:** Die kanonische Wurzeladresse öffnet offline dieselbe Homepage wie online. Alte Unterverzeichnisse und das entpackte Gastspiel behalten ihren bisherigen Index-Einstieg.
- **Öffentliche Prüfung:** Der Workflow zur öffentlichen API-/Gastprüfung berücksichtigt künftig auch Änderungen an Oberfläche, Übersetzungen und Service Worker.

## Nachweise und Grenzen

Die Prüfungen verwenden Desktop-, Tablet- und Smartphone-Breiten, Deutsch/Englisch sowie Dark/Noir und Querformat:

| Prüfung | Belegter Umfang |
|---|---|
| Gesamtes Repository mit echtem lokalem PostgreSQL | 604 Tests, null Fehler, null übersprungen. |
| Breite Seitenmatrix | 1.848 Zustände auf 320/768/1440 Pixeln, DE/EN. Die letzten 42 Sprachmeldungen stammten von einem einzigen Speicherstatus; nach dessen Korrektur wurden 45 englische Kontounterzustände einschließlich MFA und Offlinezustand erfolgreich erneut geprüft. |
| Textkontrast und Layout | 304 Zustände mit 3.13.2, 19 Ansichten, vier Formate, DE/EN und Dark/Noir: keine geprüften Textkontrast-, Überbreiten- oder JavaScriptbefunde; Minimum auf den berechenbaren Flächen 4,561:1. |
| Homepage | 16 Kombinationen mit echten Sprach-/Designklicks und abgewarteten Übergängen bestanden; Mindestkontrast 6,078:1 auf den geprüften Flächen. |
| Navigation | Native Crossflows und frische direkte Auth-URLs auf 320/768/1440 Pixeln bestanden; zusätzlich ein echtes lokales Konto mit Konto→Ninja-Profil→Zurück geprüft und wieder gelöscht. |
| Spielzeit | Zwei native Tabs erzeugten nacheinander etwa 3,3 → 6,6 → 9,5 Sekunden gespeicherte aktive Zeit, ohne Rückschritt. |

Zusätzlich bestanden 198 kompakte Ansichten einschließlich gezielter Textkontrastfälle auf 320/768/1440 Pixeln, DE/EN und allen drei Designs. Die Introprüfung deckt 16 Kombinationen aus vier Formaten, DE/EN und Bewegung/reduzierter Bewegung ab; die vier Desktopkombinationen wurden nach dem letzten Escape-Prioritätsfix erfolgreich erneut geprüft. Fehlgeschlagene Zwischenläufe – darunter eine überholte Buildkennung und ein nach Erweiterung noch auf 90 gesetzter Prüfzähler – bleiben erhalten und werden nicht als bestandene Endabnahme ausgegeben.

Wiederholbar: `npm test`, `node tests/ninja-i18n-browser.cjs`, `node scripts/check_ninja_all_pages.cjs`, `node scripts/check_ninja_crossflows.cjs` und `node scripts/check_ninja_compact.cjs`. Kontenprüfungen ausschließlich gegen eine isolierte lokale Testinstanz ausführen.

**Öffentlich freigegeben:** [Quellstand `c5afd9c`](https://github.com/BruKevFH/REBOOT-Digital-Balance/commit/c5afd9c57d0e3b4ee76bcaf1783c3345a41320f2) läuft auf dem bestehenden Render-Free-Dienst, Deployment `dep-dc42ufnf3r2c73a4v6og`, Status `live`. Die öffentliche API-/Gastprüfung bestätigt denselben Quellstand, die dauerhafte PostgreSQL-Anbindung und die Identität der ausgelieferten Dateien.

- [Gesamte unabhängige Prüfung](https://github.com/BruKevFH/REBOOT-Digital-Balance/actions/runs/45826170249) bestanden.
- [Build und reproduzierbarer Download](https://github.com/BruKevFH/REBOOT-Digital-Balance/actions/runs/45826170225) bestanden.
- [Öffentliche API-/Gastabnahme](https://github.com/BruKevFH/REBOOT-Digital-Balance/actions/runs/45826170109) bestanden.
- [Maschinenlesbare Abschlussdaten](QA_3_13_2.json), ohne Zugangsdaten.

Offline-Download: [Notification-Ninja-3.13.2.zip](downloads/Notification-Ninja-3.13.2.zip), 69 Einträge, CRC und Laufzeitidentität geprüft. SHA-256: `d866a954c315372b3ac29e6896860d4f1f77f07357bdae6e239a24184be1cd1c`.

Die alte GitHub-Pages-Adresse wird als anderer Browserursprung behandelt. Ein vorhandenes Gastprofil kann dort ausdrücklich über „Gastspielstand mitnehmen“ importiert werden; ein angemeldetes Konto lädt seinen unveränderten Fortschritt vom Server.

Die Browserprüfungen verwenden emulierte Geräteformate; sie ersetzen keine Prüfung auf jedem physischen Gerät. Textkontraste auf berechenbaren Kartenflächen werden getrennt von illustrierten Bildhintergründen bewertet. Ein isolierter Sprachtest belegt das Verhalten bei einer noch laufenden Äußerung, nicht die Verfügbarkeit oder Qualität jeder Betriebssystemstimme.

Der tatsächliche Produktionsneustart mit zwei Konten vom 24. November bleibt ein gesonderter historischer Nachweis des unveränderten Backends. Diese Oberflächenkorrektur behauptet keinen neuen öffentlichen Konten-/Neustartlauf.
