# MIND MAZE – Prüfbericht

Geprüft am 8. Oktober 2026 mit Node.js 24, Python 3.12 und Chromium 151 / Playwright. Die Browserprüfungen verwenden tatsächlich gerenderte Three.js-WebGL-2-Szenen und native Tastatur-, Maus- und Touch-Eingaben.

## Ergebnisse

- **45 Regeltests bestanden:** 20 für MIND MAZE und 25 für das bestehende REBOOT. Keine ausgelassenen Tests. MIND MAZE prüft unter anderem alle 16 Schaltkombinationen, beide Enden, physische Brückenzeugen, Ressourcen, adaptive Störungen und Speicherfehler.
- **Vollständiger Durchlauf über die Oberfläche bestanden:** neuer Spielstart, sechs Haupträume, Stillraum, Rückkehr zum Energieknoten, tatsächliche Bodenplatten A → C → D → F und Hauptausgang. Keine gesetzten Fortschritts-Fixtures oder verändernden Debug-Schnittstellen in diesem Durchlauf. Sieben gelöste Räume, null Rätsel-Fehlversuche, eine echte Fallenberührung; 19 Meldungen erkannt/ignoriert.
- **12 zusätzliche Browserfälle bestanden:** falsche/richtige Rätselantworten, unveränderte Eingabe während Pause, Reload ohne doppelte Belohnung, Werkzeugkauf und Upgrade, Bypass und Planer als alternative Lösungen, Geheimraum, vollständiger stiller Ausgang, Spielverlaufs-Export, pausierter Störungstimer, verweigerter und beschädigter lokaler Speicher. Diese isolierten Fälle verwenden gültige, von der echten Spiellogik erzeugte Speicherstände und bedienen danach die Oberfläche.
- **Welt separat geprüft:** alle sieben Räume gerendert; WASD, Hinderniskollision, Klicknavigation um Hindernisse, nahe E-Interaktion, vollständige Plattenfolge ohne wiederholte Stand-Auslösung sowie beide ausgewählten Portale per Klicknavigation. Der jeweils andere Endausgang bleibt verschlossen.
- **Desktop und Touch geprüft:** 1440 × 900, 390 × 844 und 844 × 390. Start, Fortsetzen und Download erreichbar; kein horizontaler Überlauf. Echte CDP-Touch-Eingaben bewegen die Figur und öffnen den Kristallhinweis.
- **Offline und Unterpfade geprüft:** Start unter `/REBOOT-Digital-Balance/mind-maze/`, Offline-Reload mit erhaltener Position, separate Service-Worker-Caches für REBOOT/MIND MAZE; fremde Caches bleiben erhalten. Das entpackte ZIP startet über HTTP und funktioniert nach aktiviertem Cache offline.
- **Download geprüft:** Browser lädt den korrekten Dateinamen und exakt das ZIP des aktuellen Builds. Acht Laufzeitdateien entsprechen bytegenau dem Website-Build, ZIP-CRC korrekt, wiederholte Paketierung ergibt identische Bytes. JavaScript und Three.js sind lokal gebündelt; die Browserfälle hatten keine JavaScript-Fehler oder fehlgeschlagenen Asset-Anfragen.

## Reproduzieren

Im Repository-Root `npm ci`, `npm test`, `npm run build:maze`, `npm run package:maze` und `npm run serve` ausführen. Die gebündelten Dateien sind auch ohne erneuten Build spielbar. Eine neue Paketierung aktualisiert die SHA-256-Datei neben dem ZIP.

Die ausführlichen Browser-Harnesses und Screenshots dieses Cloud-Laufs liegen außerhalb des Checkouts unter `/workspace/maze-checks/` und `/workspace/mind-maze-checks/world/`. Sie sind lokale Prüfnachweise, keine benötigten Spielbestandteile.

## Grenzen der Prüfung

Direkte `file://`-Navigation ist im verwalteten Chromium dieser Cloud durch `ERR_BLOCKED_BY_ADMINISTRATOR` blockiert; ein Doppelklick-Start wurde hier deshalb nicht geprüft. Die vollständige entpackte Laufzeit wurde über HTTP und mit Offline-Reload geprüft. Lokale Dateispeicherung kann vom jeweiligen Browser eingeschränkt werden.

Ein direkter öffentlicher HTTPS-Aufruf durch Chromium ist in dieser Umgebung wegen des bekannten Plattform-Proxy-Zertifikatsvertrauens nicht Teil dieser Prüfung. Zertifikatsprüfung und Browserrichtlinien wurden nicht verändert. Öffentlich ausgelieferte Dateien werden nach dem Deployment über HTTPS mit dem Systemvertrauensspeicher gegen die lokalen Dateien geprüft.

MIND MAZE ist ein Three.js-Browserspiel. Ein natives Unreal-/Windows-Executable sowie physische Windows-Hardware und andere Browser wurden in diesem Lauf nicht geprüft.
