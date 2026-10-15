# Notification Ninja 1.3.0 – Prüfbericht

Geprüft am **15. Oktober 2026** mit Node.js 24, Python 3 und Chromium/Playwright. Browserprüfungen nutzen native Mausbewegungen und Touch-Eingaben; die Diagnosefunktion ist ausschließlich lesend.

## Aktuelle Ergebnisse

| Prüfung | Ergebnis |
| --- | --- |
| `npm test` | **138 bestanden**, 0 fehlgeschlagen oder übersprungen: 55 Ninja-Regeln, 20 Fortschrittstests, 18 Profiltests, 20 MIND-MAZE- und 25 REBOOT-Tests |
| Profil und Migration | Pflichtname mit 3–18 Zeichen, Unicode-Normalisierung, ungültige Eingaben, atomare Umbenennung, alte Münzen/Freischaltungen, XP-Schwellen, gespeicherte Guide-Bestätigungen und begrenzte Mitteilungen geprüft |
| NIM-Komponente | **9 Prüfgruppen bestanden**: Dialogwarteschlange, genau einmalige Bestätigung, Escape, Tab-Fokus, Fokuswiederherstellung, sichere Textausgabe, Aufräumen und vier Bildschirmgrößen |
| Native Profil-/Trainingsintegration | **32 Prüfgruppen bestanden**, 24 bestätigte NIM-Dialoge: Anmeldung, Umbenennen/Neuladen, echtes Maus-/Touch-Training, stillstehende Uhr und Objektpositionen während Erklärungen sowie Sammlungsreihenfolge |
| Supers und erste Erklärungen | **3 Prüfgruppen bestanden**: echte Käufe für 12 + 25 Münzen, spezifische Fähigkeits-/Erfolgs-Erklärungen, gespeicherte Mitteilungen und Guide-Bestätigungen; im Browser eine Super mit guten Entscheidungen geladen und tatsächlich aktiviert |
| Zusätzlicher Freischaltungsablauf | **10 Prüfungen bestanden**: vorhandenes Guthaben erhalten, Vorgängerbedingung, korrekter Kaufabzug, Bild/Erklärung, Mitteilungszähler, Lesen/Neuladen, bestätigter Hinweis erscheint nicht erneut, eigene Fähigkeiten und erreichte Erfolge unten, einmalige Belohnung |
| Nativer Rundenabschluss und Levelaufstieg | Ein regulär weitergespielter Checkpoint aus einer echten simulierten Study-Runde sicherte Münzen und XP einmalig. Levelaufstieg, Mitteilung und NIM-Bestätigung blieben nach Neuladen erhalten |
| Übersicht und Fähigkeitenbaum | **1280×800, 390×844, 320×568, 844×390**: Anmeldung, Profil, Übersicht, Mitteilungen, Erfolge, Zweigwahl und Details erreichbar; alle neun verbundenen Knoten ohne Überlappungen, abgeschnittene Knotentexte oder horizontalen Seitenüberlauf |
| Eigene Sammlung | Zusätzliche Prüfung derselben vier Größen mit erspieltem Profil: kompakte eigene Knoten, lesbare Sammlung unter dem Baum, ungelesene Mitteilung und Markieren als gelesen |
| Illustrationen | Eigene SVG-Bilder für alle neun Fähigkeiten und zwölf Erfolge; weitere Raum-/Kulissen-/Outfit-/Münz-/Levelbilder. 39 Varianten auf gültiges XML und sichere Inhalte geprüft, visuelle Vorschau kontrolliert |
| Offline und Download | **8/8 bestanden**: Einstieg über Root, getrennte Worker-Scopes, alter eigener Cache gelöscht, fremde Caches erhalten, echter Schnitt mit Offline-Reload, echter ZIP-Download mit identischer Prüfsumme, entpacktes HTTP-Spiel und Offline-Fortsetzen, keine JavaScript-Fehler |
| Build und Paketierung | Aktuelles Bundle erfolgreich erzeugt; zweimal identische ZIP-Erstellung, CRC und bytegleiche Laufzeitdateien geprüft |

Die Browser-Spielstände für Kaufprüfungen wurden durch öffentliche Spielmethoden mit abgeschlossenen Runden und regulären Käufen erzeugt. Es wurden keine Münzen über die Diagnosefunktion vergeben. Komponentenprüfungen und fortgesetzte Checkpoints werden als solche ausgewiesen.

## Weiter geltende Gameplay-Nachweise aus 1.2

Die vorherige Version bestand zusätzlich elf native Fortschrittsfälle, vier Spielort-/Shopfälle, alle drei echten Touch-Supers, Münzaufnahme und Premium-Kulissen. Ein vollständiger nativer Kampagnendurchlauf mit regulär laufender Uhr und zuvor legal erspielten Freischaltungen schloss alle vier Abschnitte ab: 56 geschnittene Ablenkungen, 69 hilfreiche Durchlässe, 40 Power-ups, zwölf Super-Einsätze und alle drei Bonusphasen. Ergebnis: 30.800 Punkte, Balance 100, fünf Herzen; 165 Münzen wurden genau einmal gebucht, Wallet 555→720. Diese vollständige Vier-Raum-Kampagne wurde für 1.3 nicht erneut durchgeführt; die aktuelle Prüfung konzentriert sich auf Profile, NIM, Darstellung, Freischaltungen, Rundenabschluss und Offline-Verhalten. Die bisherigen Spielregeln bleiben durch die automatisierten Tests abgedeckt.

## Download

`downloads/Notification-Ninja-1.3.0.zip`: **89.532 Bytes**, sieben Laufzeitdateien und `START-HIER.txt` in einem vollständigen Spielordner.

SHA-256: `cb7f20d05750ddcf59ae916c7c8f4136945a74a367cb27a158b794ad07c5f587`

Der echte Browser-Download stimmt bytegenau mit dem erzeugten Paket überein. Die Downloads 1.0.0, 1.1.0 und 1.2.0 bleiben für vorhandene Links erhalten.

## Grenzen und Artefakte

Mobile Prüfungen verwenden Chromium mit Touch-/Viewport-Emulation und sind kein Test auf einem physischen iPhone mit Safari. Direktes `file://`-Öffnen ist im verwalteten Cloud-Chromium gesperrt; ein Doppelklick-Test wird nicht behauptet. Browserrichtlinien und Zertifikatsprüfungen bleiben aktiv. Öffentliche Dateien werden separat über HTTPS mit regulärem Systemvertrauen geprüft.

Aktuelle Berichte und Screenshots liegen unter `/workspace/ninja-checks/v13/` sowie `/workspace/ninja-checks/profile-mentor/`, frühere Kampagnen-/Gameplay-Nachweise unter `/workspace/ninja-checks/v12/`. Dies sind externe Prüfartefakte, keine Spielabhängigkeiten. Es wurden keine Tests mit jugendlichen Testpersonen durchgeführt. Das Profil ist lokal und hat keine geräteübergreifende Anmeldung.
