# Notification Ninja 3.13.1

Stand: 25. November 2026. Quellstand [6878dd4bc8717d48f257d5b89c17868c355fc2bd](https://github.com/BruKevFH/REBOOT-Digital-Balance/commit/6878dd4bc8717d48f257d5b89c17868c355fc2bd). Ergänzung zum [3.13-Erweiterungsbericht](EXPANSION_3_13.md).

Neue servergeprüfte Open Runs angemeldeter regulärer Spieler werden nach dem letzten Herz automatisch eingetragen. Der Hinweis steht vor dem Start und in den Datenschutzhinweisen. Eine kontogetrennte Warteschlange speichert ausschließlich Run-IDs im lokalen Browser und wiederholt die geschützte Serveranfrage nach Anmeldung, Verbindung oder erneutem Versuch. Vorhandene historische Ergebnisse werden nicht gesammelt veröffentlicht. Gäste, Admins, vorzeitige Stopps und Ergebnisse ohne gültige Punkte sind ausgeschlossen. Punkte, Belohnungen und Rangfolge berechnet weiterhin der Server.

Punkte und Serien erhalten eigene ausreichend breite Anzeigen. Die tatsächliche Schriftbreite bestimmt die Schriftgröße; lange Zahlen werden sprachabhängig verkürzt, ihr exakter Wert bleibt als Tooltip und Screenreadertext erhalten. Abschneidende Auslassungspunkte entfallen. Das Tempo verwendet jetzt ebenfalls die gewählte Sprache.

Die erste Ansicht enthält weniger Erklärtext: Dojo-Hintergründe und Spielregeln lassen sich öffnen, der Rundenrückblick liegt unter „Rückblick & Lerntipp“, Fähigkeitseffekte erscheinen bei der ausgewählten Technik. Missionsziele, Status, Kaufvoraussetzungen und zentrale Spielaktionen bleiben sichtbar.

**591 Repositorytests bestanden**, null Fehler und null übersprungen, mit echtem lokalem PostgreSQL. Zusätzlich bestanden **1.368 Seitenzustände**, **60 kompakte und aufgeklappte UI-Zustände** sowie **132 integrierte Gastzustände**. Ein gesonderter HUD-Stresstest prüfte 216 Fälle einschließlich hoher Punkte/Serien, DE/EN und aller Designs. Die abschließende Seitenmatrix enthält keine gefundenen Übersetzungs-, Layout-, JavaScript- oder Bedienflächenfehler.

Zwei echte lokale Kontorunden im Browser, 360 Pixel/Deutsch und 1280 Pixel/Englisch, bestätigten jeweils drei tatsächliche Schnitte, regulären Herzverlust, Serverprüfung, automatischen Eintrag **ohne Veröffentlichungsklick** und Erhalt nach Reload. Beide Testkonten und ihre Einträge wurden entfernt. Gefundene englische Resttexte in Prüfstatus, Erfolgs-Popups, Missionsbestwerten, Rückblicken und UTC-Wochenaufgaben sind korrigiert. Freiwillige Erklärungen und fehlgeschlagene Missionen wurden ausdrücklich mitgeprüft.

Die [öffentliche Zwei-Konten-Abnahme vom 24. November](https://github.com/BruKevFH/REBOOT-Digital-Balance/actions/runs/45445114118) bestand auf dem unveränderten Kontenbackend des vorherigen Quellstands `ed1bf5a`: Profile, Käufe und öffentliche Rangliste überstanden einen tatsächlichen, separat bei Render bestätigten Neustart. Beide Produktions-Testkonten samt Sitzungen und Einträgen wurden anschließend gelöscht. Dies war ein HTTP-/Replaytest; der native automatische Browserablauf ist der getrennte lokale Nachweis oben.

Render Free bestätigt das Deployment des aktuellen vollständigen Commits. Der [Build- und Downloadlauf](https://github.com/BruKevFH/REBOOT-Digital-Balance/actions/runs/45517079333) und die [öffentliche API-/Gastabnahme](https://github.com/BruKevFH/REBOOT-Digital-Balance/actions/runs/45517079859) sind bestanden; letztere bestätigt neun identische Laufzeitdateien und die öffentlichen Gastansichten. Auch die [Gesamtprüfung](https://github.com/BruKevFH/REBOOT-Digital-Balance/actions/runs/45517079240) ist vollständig bestanden.

[Alle Abschlussnachweise und Grenzen](EXPANSION_3_13.md#abschlussnachweise). Das Offlinepaket enthält 69 Einträge und bleibt eine Gastversion; SHA-256: `fc661360bb1354f0c270941c4dcdc1af8daf94b534f30d7b7380ca17056c7b4f`.

Die kontrollierte Online-Abnahme startet ausschließlich ausdrücklich per Workflow oder Commitmarker `[live acceptance]`. Sie erzeugt zwei temporäre Testkonten, verlangt einen getrennt belegten Betreiber-Neustart und löscht die Testkonten wieder. Betreiberzugänge gehören nicht in CI-Artefakte oder das Repository.
