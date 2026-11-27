# Notification Ninja 3.13.3: Homepage ohne Server-Wartebildschirm

Stand: 27. November 2026. Veröffentlichung noch ausstehend; nach erfolgreicher Abnahme werden die tatsächliche Adresse und Deployment-Nachweise ergänzt.

## Verhalten

Der neue Render-Static-Site-Build legt die Homepage als `index.html` und das Spiel als `play.html` ab. Der Node-Kontodienst bleibt getrennt mit derselben dauerhaften Neon-PostgreSQL-Datenbank bestehen. Homepage und Gastspiel warten weder auf einen Healthcheck noch auf eine Kontowiederherstellung. Die Render-Free-Aufwachseite des Node-Diensts kann vor dessen HTML technisch nicht vom Spiel ersetzt werden; deshalb erhält die statische Website eine eigene Adresse.

Ein gespeichertes Konto wird im Hintergrund wiederhergestellt. Navigation und laufende Gastspiele werden dadurch nicht nachträglich ersetzt. Anmeldung und Registrierung prüfen die API-Bereitschaft mit begrenzten GET-Versuchen; schreibende Anfragen werden niemals automatisch wiederholt. Eingabewerte bleiben bei Verbindungsfehlern erhalten; Zurück und Escape können die Verbindungsphase abbrechen.

Die alte GitHub-Pages-Adresse und bisherige Backend-Lesezeichen bleiben verwendbar. Freiwillige Gastübertragung prüft Quelle, Ziel, Popup, Einmalcode und Ablaufzeit. Sie überträgt keine Kontotoken und löscht den bisherigen Gastspielstand nicht. Lokale Vorschau und Offline-ZIP behalten ihre bisherigen Dateipfade.

## Gestaltung und Suche

Die bisherigen Kontrastkorrekturen für Dark und Noir bleiben enthalten. Verbindungshinweise verwenden die vorhandenen Themenfarben. Das statische Verzeichnis enthält nur freigegebene Laufzeitdateien, den geprüften Download sowie Metadaten. Canonical, zweisprachige Homepage-Titel/-Beschreibungen, Open Graph, robots.txt und Sitemap bereiten die neue Homepage für Suchmaschinen vor. Aufnahme und Platzierung in Suchergebnissen sind damit nicht garantiert und erfolgen nicht sofort.

## Lokale Prüfung

- 638 Repositorytests bestanden, 0 Fehler und 0 übersprungene Tests; tatsächliches lokales PostgreSQL, außerdem SQLite und Transaktions-/Neustartprüfungen.
- 31 gezielte Tests für statischen Build, Pfade, sichere Gastübertragung und asynchronen Kontostart bestanden.
- Echter Chromium-Service-Worker: vollständiger Cache, Homepage-, Index-, Home- und Play-Navigation plus Reload bei abgeschaltetem Netzwerk, 0 JavaScriptfehler.
- 18 native Browserfälle: 320/768/1440 Pixel × Deutsch/Englisch × Netzabbruch/JSON-503/Render-HTML-503. Keine fehlenden Laufzeitdateien oder JavaScriptfehler; Homepage und Gaststart ohne API-Aufruf. Für Bereitschaftsfehler wurden die Warteintervalle im Test beschleunigt, nicht der Produktcode.
- 10 native Kontofensterprüfungen für Verbindungsstatus, erhaltene Felder, Abbruch, Escape, Wiederholen und Abmelden der Listener.
- Tatsächlich gespielte isolierte Runde und anschließende Gastübertragung über getrennte Ursprünge: Einwilligung, Sicherung am Ziel, Quellspielstand und Erhalt nach Reload geprüft.
- Öffentliche Deployment-Prüfung ausstehend.

## Betrieb und Grenzen

Es wird kein kostenpflichtiger Serverplan eingerichtet. Der statische Build verwendet Render ohne Node-Compute; die vorhandene API bleibt auf Free. Accounts benötigen weiterhin die API und können bei deren Kaltstart warten. Browserbreiten sind Emulationen, keine Abnahme sämtlicher physischer Geräte. Die öffentliche Zwei-Konten-/Neustartprüfung vom 24. November bleibt der historische Persistenznachweis; Backend-Anwendungs- und Datenbankschema werden in dieser Version nicht geändert.
