# Optionales FH-Backend

Das neue 3D-Spiel funktioniert vollständig statisch, auch auf GitHub Pages. Spielstände bleiben lokal im Browser; es werden keine API-Aufrufe gesendet. Dieses optionale Backend stammt aus der bisherigen 2D-App und ergänzt SQLite, Event-Historisierung, eine REST-API und Security Headers. Es kann die 3D-Dateien ausliefern, deren Spielregeln sind jedoch nicht an seine Telemetrie angebunden. Es benötigt einen eigenen Node-Host und läuft nicht auf GitHub Pages.

## Lokal starten

Voraussetzung: Node.js 24 mit eingebautem `node:sqlite`. Keine npm-Pakete nötig. Im Repository-Root:

```bash
node server/server.mjs
```

Öffne http://127.0.0.1:8080. Das Backend bindet standardmäßig nur an Loopback. Das Meta-Element für die optionale Telemetrie wird vom neuen 3D-Client nicht verwendet. Die Dateien im Repository bleiben statisch und unverändert.

`PORT` ändert den Port, `HOST` die Bind-Adresse. SQLite liegt standardmäßig in `server/reboot.sqlite`; mit `DATA_DIR` lässt sich ein anderer Datenordner verwenden. Datenbankdateien dürfen nicht ins Repository eingecheckt werden. Der Server liefert ausschließlich die öffentlichen App-Dateien aus.

Für einen isolierten Test ohne Datenbankdateien im Checkout:

```bash
test_data_dir="$(mktemp -d)"
DATA_DIR="$test_data_dir" PORT=8081 node server/server.mjs
```

In einem zweiten Terminal prüft `curl -fsS http://127.0.0.1:8081/api/health` die API. Server danach mit `Ctrl+C` stoppen und den temporären Datenordner bei Bedarf entfernen. `node --check server/server.mjs` prüft die Syntax ohne Serverstart.

## Research und HTTPS

Ohne `RESEARCH_KEY` ist `GET /api/research/summary` deaktiviert. Für eine Auswertung muss ein starkes Geheimnis sicher als Umgebungsvariable injiziert werden; der Client übermittelt es im Header `X-Research-Key`. Niemals Schlüssel in Dateien, URLs oder Git speichern.

Für HTTPS-Betrieb ist ein vertrauenswürdiger Reverse Proxy erforderlich:

- `REQUIRE_HTTPS=1` und `TRUST_PROXY=1` setzen.
- Der Proxy muss TLS terminieren und `X-Forwarded-Proto` selbst auf `https` setzen; Client-Werte muss er überschreiben.
- Den Backend-Port nur für diesen Proxy erreichbar machen, beispielsweise durch die standardmäßige Loopback-Bindung.

Bei aktivierter HTTPS-Pflicht weist das Backend fehlende oder andere Protokollangaben mit HTTP 426 ab. `TRUST_PROXY=1` ist eine ausdrückliche Betreiberkonfiguration, keine automatische Prüfung des Proxys. Die Schreib-API ist für eine lokale FH-Demonstration vorgesehen; ein öffentliches Forschungsdeployment benötigt zusätzlich ein passendes Zugriffs- und Datenschutzkonzept.
