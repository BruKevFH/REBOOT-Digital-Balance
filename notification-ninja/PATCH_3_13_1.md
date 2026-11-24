# Notification Ninja 3.13.1

Stand: 24. November 2026. Ergänzung zum [3.13-Erweiterungsbericht](EXPANSION_3_13.md).

Neue servergeprüfte Open Runs angemeldeter regulärer Spieler werden nach dem letzten Herz automatisch eingetragen. Der Hinweis steht vor dem Start und in den Datenschutzhinweisen. Eine kontogetrennte Warteschlange speichert ausschließlich Run-IDs im lokalen Browser und wiederholt die geschützte Serveranfrage nach Anmeldung, Verbindung oder erneutem Versuch. Vorhandene historische Ergebnisse werden nicht gesammelt veröffentlicht. Gäste, Admins, vorzeitige Stopps und Ergebnisse ohne gültige Punkte sind ausgeschlossen. Punkte, Belohnungen und Rangfolge berechnet weiterhin der Server.

Punkte und Serien erhalten eigene ausreichend breite Anzeigen. Die tatsächliche Schriftbreite bestimmt die Schriftgröße; lange Zahlen werden sprachabhängig verkürzt, ihr exakter Wert bleibt als Tooltip und Screenreadertext erhalten. Abschneidende Auslassungspunkte entfallen. Das Tempo verwendet jetzt ebenfalls die gewählte Sprache.

Die erste Ansicht enthält weniger Erklärtext: Dojo-Hintergründe und Spielregeln lassen sich öffnen, der Rundenrückblick liegt unter „Rückblick & Lerntipp“, Fähigkeitseffekte erscheinen bei der ausgewählten Technik. Missionsziele, Status, Kaufvoraussetzungen und zentrale Spielaktionen bleiben sichtbar.

591 Repositorytests mit echtem lokalem PostgreSQL waren vor der abschließenden Veröffentlichungsprüfung bestanden (0 Fehler, 0 übersprungen). Zusätzlich bestanden zwei echte Kontorunden im Browser, 360 Pixel/Deutsch und 1280 Pixel/Englisch: je drei tatsächliche Schnitte, regulärer Herzverlust, Serverprüfung, automatischer Eintrag ohne Veröffentlichungsklick und Erhalt nach Reload. Beide Testkonten und ihre Einträge wurden entfernt. Dabei gefundene englische Prüfstatus- und Erfolgstexte wurden korrigiert. Die öffentliche CI und Online-Neustartabnahme werden nach Abschluss separat dokumentiert.

Die kontrollierte Online-Abnahme startet ausschließlich ausdrücklich per Workflow oder Commitmarker `[live acceptance]`. Sie erzeugt zwei temporäre Testkonten, verlangt einen getrennt belegten Betreiber-Neustart und löscht die Testkonten wieder. Betreiberzugänge gehören nicht in CI-Artefakte oder das Repository.
