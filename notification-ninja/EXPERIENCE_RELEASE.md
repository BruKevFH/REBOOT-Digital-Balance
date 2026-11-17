# Notification Ninja 3.12.0 – Erlebnis und Gestaltung

Stand der Implementierung: 17. November 2026. Diese Erweiterung setzt den [ausführlichen Erlebnis-Masterprompt](ULTIMATE_EXPERIENCE_MASTERPROMPT.md) auf dem vorhandenen Spiel um. Der Prompt beschreibt die gewünschte Qualität; dieser Bericht dokumentiert die tatsächlich hinzugefügten Funktionen und die Grenzen der Abnahme. Er ersetzt keine historische Backend-Abnahme.

## Gestaltungsziel und erhaltene Struktur

Cremefarbenes Papier, dunkle Konturen, Mint, Gold, Sakura und eigene japanisch inspirierte Illustrationen verbinden die neuen Ansichten mit dem bestehenden Spielen-Bereich. Die vier Modusbanner und vier Weltkarten bleiben gemeinsam unter **Spielen**. Die Hauptnavigation behält ihre fünf Ziele Übersicht, Spielen, Karriere, Basar und Rangliste. Der Hub behält seinen zentralen Spielen-Button; die neuen Lernwege erscheinen darunter als Nebenangebote.

Die neue lokale Grafik `assets/indie-journeys.png` enthält vier Landschaften: ein sonniges Lern-Tal, eine blau-violette Cyber-Landschaft, einen mondhellen Ruhegarten und NIMs Trainingsgarten. Karten, Missionspunkte, Texte, Fortschritte und Aktionen werden getrennt aus echten Daten gerendert. Die Illustration enthält keine vermeintlich bedienbaren Menüs. [Asset-Herkunft](assets/INDIE_ART.md).

## Was neu implementiert ist

| Bereich | Tatsächliches Verhalten | Zugang und Datenquelle |
|---|---|---|
| NIMs Fokuspfad | Zwölf deutsche und englische Alltagssituationen, je vier für Lernen, Gaming und Ruhe; drei Antwortmöglichkeiten, begründetes Feedback, erneuter Versuch und ein kleiner Alltagstipp. Richtige Antworten werden einmalig im Lernjournal vermerkt. | NIMs Dojo im Hub, ergänzend aus dem Tastentraining; eigene feste Szenarien in `src/sensei-trials.js`. |
| Symbollexikon | Suche, Situationswechsel und Filter für hilfreiche Hinweise, Ablenkungen und Bonusobjekte. Jede Karte zeigt, wie dasselbe Signal in den drei Situationen eingeordnet wird. Die passende ungewertete Übung kann direkt geöffnet werden. | NIMs Dojo und Tastentraining; übernimmt den tatsächlichen `CONTENT`-Katalog und dessen `kindByContext` aus dem Spiel. |
| Karriere-Reise | Neue illustrierte Landschaften und Kapitel-/Nächste-Mission-Verknüpfungen. Unter 900 CSS-Pixeln öffnet der gewählte Missionspunkt ein modales Detailblatt mit der echten vorhandenen Missionsansicht. Größere Ansichten behalten den seitlichen Inspektor. | Bestehende Karriere; unveränderte Missions-IDs, Voraussetzungen und Belohnungsverträge. |
| Ninja-Garderobe | Alle zwölf vorhandenen Looks können in drei Dojo-Kulissen angesehen werden. Der echte Renderer zeigt die Animation und den tatsächlichen Besitz-/Ausrüstungszustand sowie die Freischaltbedingung. „Zum Angebot“ führt zum passenden bestehenden Basarartikel. | „Look anprobieren“ im Skin-Angebot; schreibgeschützte Kopie des aktuellen Profils und kanonischer `SKINS`-Katalog. |
| NIMs Rundenrückblick | Zeigt richtige Entscheidungen, geschnittene hilfreiche Hinweise, verpasste Ablenkungen und getrennt die vom Schild abgefangenen Fehler. Ein gültig protokollierter letzter Fehler erhält die passende Erklärung. Übung und Lexikon öffnen den zugehörigen Kontext. | Ergebnisansicht; tatsächliche Rundenmetriken und validierter letzter Fehler aus dem Spielzustand. |
| Bedienkomfort | Rechts-/Linkshändigkeit passt SUPER und die zugehörige HUD-Anordnung an. Kurzes haptisches Feedback ist freiwillig und standardmäßig ausgeschaltet. Nicht unterstützte Browser zeigen das ausdrücklich an. | Einstellungen; eigener gerätebezogener Komfortspeicher. |

Der Fokuspfad behandelt unter anderem künstliche Dringlichkeit, bewusst gewählte Spielgrenzen, Teamnachrichten, Pausen, Autoplay und Ruhezeiten. Wichtige Schulhinweise und echte Sicherheitswarnungen bleiben hilfreich. Gaming wird nicht pauschal als schlecht dargestellt. Eine falsche Antwort darf ohne Strafe erneut versucht werden.

## Speicherung, Wirtschaft und Datenschutz

Das Lernjournal ist **nur lokal auf diesem Gerät** gespeichert. Gast und jedes Konto haben getrennte Speicherbereiche; bei Konten wird die interne Konto-ID verwendet. Gespeichert werden die bekannten abgeschlossenen Szenario-IDs in einem versionierten, begrenzten Datensatz. Ein Browserwechsel oder ein anderes Gerät synchronisiert diesen Lernstand nicht. Das Zurücksetzen betrifft ausschließlich den aktuell geöffneten Lernbereich. Die vorhandene Profil-/Kontolöschung entfernt den dazugehörigen lokalen Lernbereich.

Bei blockiertem Speicher wird keine erfolgreiche dauerhafte Speicherung behauptet. Die offene Lernsession bleibt benutzbar und zeigt einen Hinweis. Nach einem Neuladen sind nur tatsächlich gespeicherte Einträge wieder vorhanden. Beschädigte oder übergroße Journalwerte werden auf gültige Vorgaben zurückgeführt.

Fokuspfad, Lexikon, Garderoben-Vorschau und Rückblick vergeben keine Münzen, XP, Erfolge oder Ranglistenwerte. Die Vorschau kauft und rüstet nichts aus. Bestehende Käufe, Belohnungen, Missionen, Besitzstände, Wallet und Replay-Prüfung bleiben in ihren bisherigen Spiel-/Serververträgen. Die persönlichen Komfortwerte verwenden einen eigenen Geräteschlüssel und werden nicht als Kontoeinstellung übertragen. Es werden keine neuen Analyse-, Werbe- oder Trackingdienste eingebunden.

## Bedienung und Lebensdauer

Die neuen Oberflächen besitzen eigene deutsche und englische Texte und reagieren auf den Sprachwechsel. Fokuspfad-Antworten sind zusätzlich über 1, 2 und 3 erreichbar. Suche und Filter des Lexikons sind echte HTML-Bedienelemente; Suchtext wird begrenzt und bei der Ausgabe maskiert.

Das mobile Missionsblatt verwendet einen nativen Dialog. Schließen, Escape und ein Klick außerhalb des Blatts führen zurück zur Karte; der zuvor ausgewählte Missionspunkt erhält den Fokus zurück. Die echte Missionsansicht wird verschoben statt dupliziert. Der Wechsel zur breiten Ansicht stellt den seitlichen Inspektor wieder her.

Die Garderobe besitzt eine eigene Vorschau-Lebensdauer. Sie stoppt Animationen beim Verlassen, bei verdecktem Tab und während eines darüberliegenden Kontofensters. Reduzierte Bewegung beziehungsweise ruhige Effekte zeigen einen ruhigen Zustand. Haptik bleibt bei ruhigen Effekten, reduzierter Bewegung und verborgenem Dokument aus; kurze Rückmeldungen werden begrenzt. Die zugrunde liegenden Spielregeln ändern sich durch die Bedienhand nicht.

## Erhaltene Funktionen

Die bestehenden 18 Hauptmissionen und acht Zusatzherausforderungen, drei Bosse, Boss Rush, tägliche Herausforderung, Training, Open Run mit drei Herzen, zwölf Looks, 24 Erfolge, neun Fähigkeiten, Basar und deutsch-englische Spieloberfläche bleiben bestehen. Bestehende Speicher- und Missions-IDs werden nicht durch einen neuen Spielstand ersetzt. Die neuen Funktionen erweitern die Navigation und Darstellung dieser Inhalte; sie behaupten keine zusätzlichen Missionen oder neuen servergeprüften Lernbelohnungen.

Auch PostgreSQL und lokales SQLite, sichere Accountaktionen, Wiederherstellung und optionale Zwei-Faktor-Anmeldung bleiben erhalten. Diese Veröffentlichung richtet keinen neuen kostenpflichtigen Dienst ein und verändert keine alte Cloud-Umgebung.

## Lokale Abnahme am 17. November 2026

- `TEST_DATABASE_URL=… npm test`: **494 Tests bestanden, keine Fehler und keine übersprungenen Tests**. Die PostgreSQL-Fälle liefen mit einem eigens gestarteten lokalen PostgreSQL-17-Container; die Tests erzeugen isolierte Schemas und löschen sie anschließend. SQLite, servergeprüfte Wirtschaft, konkurrierende Käufe und bestehende Spielregeln sind eingeschlossen.
- Die nach der Browserprüfung ergänzten Übersetzungskorrekturen bestanden zusätzlich den gezielten Lauf von `ninja-i18n.test.mjs` und `ninja-dressing-room.test.mjs`: **19 Tests**. Enthalten sind alle zwölf kanonischen Outfitnamen, die beiden Meisterschaftsbeschreibungen sowie übersetzte Missionsvoraussetzungen mit einem oder mehreren Titeln.
- Portal-, bestehende Design- und Gameplay-Prüfung bestanden auf **360, 768, 941 und 1280 CSS-Pixeln**. Die Portalprüfung verwendet getrennte lokale Testkonten und echte MFA-Einrichtung, Anmeldung, Wiederherstellung und Deaktivierung; die Testkonten werden entfernt. Die Designprüfung umfasst 16 Ansichten je Breite in DE/EN; die Gameplay-Prüfung echte Eingaben und Runden statt direkter Testsetter.
- Die ergänzende Erlebnisprüfung kontrolliert richtige/falsche Lernantworten, alle zwölf Fälle, Neuladen, kanonische Lexikonfilter, maskierte Suche, Übungsrückkehr zum richtigen Kontext, zwölf schreibgeschützte Looks, Freischaltbedingungen, echte Angebotsnavigation, Missionssperren, mobile Dialogbedienung, Fokus sowie Komfort und Rundenfeedback. Diese Abläufe bestanden auf **360/768/941/1280 Pixeln in DE/EN**. Auf 360 Pixeln bestand zusätzlich der vollständige Ablauf mit echter Touchentscheidung, Pause, Rundenabschluss, nachgezählten Feedbackwerten, passender Übung und Browser-Zurück zur Ergebnisansicht. Die neuen Tests wurden nach gefundenen Integrations-/Übersetzungsfehlern gezielt wiederholt; die bestehende Eingabeprüfung blieb zusätzlich aktiv.
- Zusätzliche echte Browserprüfungen bestanden: SUPER nach erreichter Ladung bei gespiegelter Bedienung, angehaltener Spieltakt in Pause, ruhige interaktive Vorschau ohne Animationsschleife, getrennte Lernjournale und blockierte Schreibzugriffe mit ehrlichem Sitzungshinweis. Ein real aktivierter Service Worker **3.12.0** lieferte bei abgeschalteter Verbindung die neuen Landschaften, Fokuspfad samt gespeichertem Lernstand nach Neuladen, Lexikon und schreibgeschützte Garderobe aus.
- `npm run build:ninja` bestanden und bei erneutem Build bytegleich für beide Bundles und Metadaten; `git diff --check` sauber. Das Downloadpaket wird vollständig mit den Laufzeitdateien abgeglichen, prüft CRC und enthält eine bewusst deaktivierte Kontokonfiguration. Zwei unabhängige Paketläufe erzeugten dieselben **24.128.951 Bytes** mit SHA-256 `f2ca94fe3e805ae0c009d4db0e9df02c5195396608cba6227f691b1dd13fc1af`.

Die wiederholbaren Prüfskripte liegen unter `scripts/check_ninja_{portal,indie,browser,experience}.cjs`. Browserkontrollen prüfen tatsächlich anklickbare Flächen mit mindestens 44 CSS-Pixeln und horizontales Überlaufen. Die Garderobenprüfung kontrolliert zusätzlich das Stoppen der Vorschau bei einem darüberliegenden Kontofenster und beim Verlassen der Ansicht.

## Veröffentlichung

Commit, Push, neue GitHub-Actions-Abnahme und öffentliche Gastprüfung sind zum Zeitpunkt dieses lokalen Berichts noch offen. Hier werden nach dem tatsächlichen Abschluss die überprüften Verweise ergänzt.

## Externe Grenzen und historische Online-Abnahme

Die öffentliche Konfiguration verweist bereits auf `https://notification-ninja-accounts.onrender.com/api/v3`. Die historische Abnahme vom **7. November 2026** dokumentiert einen erfolgreichen Live-Preflight und einen vom Betreiber bestätigten Neustart-/Persistenztest; siehe [historischer Status](ULTIMATE_STATUS.md) und [Cloud-Einrichtung](../server/NINJA_ULTIMATE_CLOUD_SETUP.md).

In der aktuellen Cloud-Umgebung verhindert **CONNECT 403** den erneuten direkten Zugriff auf diesen Produktionsdienst. Damit kann dieses Release hier keinen neuen öffentlichen Account-, Datenbank- oder Neustartnachweis behaupten. Lokale Account-/Persistenztests und öffentliche Gasttests sind davon getrennte Nachweise. Die vorhandene öffentliche Konfiguration wird deshalb nicht ungefragt zurückgesetzt. Die alte Ranglisteninstanz ist weiterhin ein historischer separater Dienst und wird nicht mit dem v3-Kontobackend gleichgesetzt.

Browserprüfungen mit emulierter Touchbedienung ersetzen keinen Test auf einem physischen Smartphone. Klang, Haptik, Bildrate und Verständlichkeit mit der Zielgruppe benötigen ergänzende reale Gerätetests. „Perfekt“ ist ein Gestaltungsziel, keine messbare Zertifizierung dieses Builds.
