# Gemeinsame Rangliste für Notification Ninja

Das Spiel und alle lokalen Profile funktionieren weiterhin auf GitHub Pages. Eine gemeinsame Rangliste braucht zusätzlich diesen kleinen Node-Server; für dauerhafte Ergebnisse muss seine SQLite-Datei einen Neustart überleben. GitHub Pages führt keine Serverprogramme aus. Seit Version 1.6 ist `notification-ninja/leaderboard-config.json` mit **https://notification-ninja-ranking.onrender.com** verbunden. Version 1.7 verwendet eine gemeinsame Wertung mit drei Herzen und dem Regelsatz **`open-v2`**. Ergebnisse werden ausschließlich nach ausdrücklichem Veröffentlichen übertragen. Es gibt keine erfundenen Mitspieler.

## Lokal mit mehreren Browsern testen

Node.js 24 mit `node:sqlite` wird benötigt; zusätzliche npm-Pakete sind nicht nötig. Im Repository-Root:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

In einem zweiten Terminal:

```bash
ALLOWED_ORIGINS=http://127.0.0.1:8000 PORT=8082 node server/ninja-leaderboard.mjs
```

Für diesen lokalen Test `notification-ninja/leaderboard-config.json` so setzen:

```json
{"enabled": true, "endpoint": "http://127.0.0.1:8082"}
```

Dann `http://127.0.0.1:8000/notification-ninja/` in zwei getrennten Browser-Profilen öffnen, verschiedene Ninja-Namen anlegen und jeweils einen echten Open Run spielen. Ein Ergebnis wird erst durch den ausdrücklichen Veröffentlichen-Knopf übertragen. Die Rangliste zeigt den besten veröffentlichten aktuellen Drei-Herzen-Run jedes Spielers. Eine Auswahl zwischen drei Schwierigkeiten entfällt. Ein leeres Ranking bleibt leer. Die lokale Testadresse anschließend wieder aus der öffentlichen Konfiguration entfernen.

## Öffentlich betreiben

Benötigt werden ein Node-24-Host oder Docker-Host und eine eigene HTTPS-Adresse, beispielsweise `https://ninja-api.example.org`. Die Adresse ist ein Platzhalter. Der verbundene Dienst **https://notification-ninja-ranking.onrender.com** läuft als kostenlose Render-Demo ohne beständigen Datenträger. Dauerhafte Online-Highscores benötigen einen solchen Datenträger. Die folgende Anleitung erklärt den Aufbau und die Einrichtung weiterer Instanzen; aktuelle ausgeführte Prüfungen stehen im [Prüfbericht](../notification-ninja/TEST_REPORT.md).

### Kostenlose Demo über Render

Die Datei [`render.yaml`](../render.yaml) legt ausdrücklich einen **Free-Web-Service ohne kostenpflichtigen Datenträger** an. Die API und SQLite passen in diesen Dienst. Render liefert dessen öffentliche `https://…onrender.com`-Adresse über seinen TLS-Proxy aus; für diese Vorlage prüft der Node-Prozess keine Proxy-Header und vertraut ihnen auch nicht. Der Browser akzeptiert als öffentlichen Endpunkt nur HTTPS.

**Die kostenlose Demo speichert die Rangliste nicht dauerhaft.** Laut [Render-Dokumentation zum Free-Tarif](https://render.com/docs/free), geprüft am 15. Oktober 2026: Der Dienst schläft nach 15 Minuten ohne Zugriffe ein, startet beim nächsten Zugriff in ungefähr einer Minute und verliert seine lokale SQLite-Datei bei Einschlafen, Neustart oder neuem Deployment. Das betrifft die gemeinsame Rangliste; Münzen und Fortschritt auf den Spielergeräten bleiben erhalten. Free stellt 750 Instanzstunden pro Workspace und Kalendermonat bereit; weitere Kontingente gelten. Kostenloses Render Postgres läuft nach 30 Tagen ab und ist deshalb hier keine dauerhafte Alternative. Es wird kein kostenpflichtiger Datenträger, kein Bezahlplan und kein kostenpflichtiges Zusatzprodukt in der Vorlage eingerichtet. Bei ausgeschöpften kostenlosen Kontingenten oder zusätzlichen Anbieteranforderungen gelten die dann angezeigten Render-Bedingungen; keine Bezahloption aktivieren, wenn der Betrieb kostenlos bleiben soll.

Einmalige Einrichtung im eigenen Render-Konto:

1. Im [Render-Dashboard](https://dashboard.render.com/) **New → Blueprint** wählen und dieses GitHub-Repository verbinden. Als Branch `main` und als Blueprint-Datei `render.yaml` verwenden. Vor dem Erstellen prüfen, dass beim einzigen Web-Service **Free** steht und kein Datenträger oder weiteres Produkt aufgeführt ist. Alternativ **New → Web Service**, Repository auswählen, Runtime **Docker**, Dockerfile `./server/Dockerfile.ninja`, Docker Context `.`, Region Frankfurt und Instance Type **Free** wählen und die Variablen aus `render.yaml` übernehmen.
2. Das Deployment abwarten. Die angezeigte `https://…onrender.com`-Adresse kopieren; `/health` muss `ok: true`, `service: "notification-ninja-leaderboard"`, `apiVersion: 2` und `ruleset: "open-v2"` liefern. Für den ersten Aufruf nach einer Pause ungefähr eine Minute warten und bei Bedarf erneut laden.
3. In `notification-ninja/leaderboard-config.json` `{"enabled":true,"endpoint":"https://DEINE-ADRESSE.onrender.com"}` eintragen, wobei die Adresse durch die echte Service-Adresse ersetzt wird, und auf `main` veröffentlichen. Dieser Platzhalter darf nicht unverändert gespeichert werden. Anschließend in zwei Browsern echte Runs ausdrücklich veröffentlichen und die gemeinsamen Plätze prüfen.

Der Server erkennt nach einem Datenverlust ungültig gewordene Gerätekennungen. Beim nächsten ausdrücklich veröffentlichten Run wird eine neue Ranglisten-Identität angelegt; ein verschwundener Online-Eintrag blockiert auch die lokale Profil-Löschung nicht. Die alte Rangliste lässt sich nach einem Free-Neustart nicht wiederherstellen. Für dauerhafte Highscores bleibt ein Host mit beständigem `DATA_DIR` erforderlich.

Blueprint-Felder und Docker-Pfade sind in den offiziellen [Blueprint-Spezifikationen](https://render.com/docs/blueprint-spec) und [Docker-Anleitungen](https://render.com/docs/docker) dokumentiert. Das Übernehmen der Dateien in eine weitere Instanz meldet dich nicht automatisch bei Render an und startet dort keinen Dienst ohne die Einrichtung im eigenen Konto.

Variablen:

| Variable | Bedeutung |
| --- | --- |
| `HOST` | Standard `127.0.0.1`; Container verwendet `0.0.0.0`. |
| `PORT` | Standard `8082`. |
| `DATA_DIR` | Dauerhafter Ordner für `ninja-leaderboard.sqlite`; Standard `server/`. |
| `ALLOWED_ORIGINS` | Exakte, durch Kommas getrennte Ursprünge, z. B. `https://brukevfh.github.io`. Keine Pfade, Platzhalter oder abschließenden Schrägstriche. Öffentliche Bindung verlangt diese Angabe. |
| `REQUIRE_HTTPS` | `1` verlangt HTTPS über den unten beschriebenen Proxy. |
| `TRUST_PROXY` | `1` nur bei einem kontrollierten TLS-Reverse-Proxy setzen. |

Docker aus dem Repository-Root bauen und nur am lokalen Host-Port veröffentlichen:

```bash
docker build -f server/Dockerfile.ninja -t notification-ninja-leaderboard .
docker run --name ninja-ranking --restart unless-stopped \
  -p 127.0.0.1:8082:8082 \
  --mount type=volume,source=ninja-ranking-data,target=/data \
  -e ALLOWED_ORIGINS=https://brukevfh.github.io \
  -e REQUIRE_HTTPS=1 -e TRUST_PROXY=1 \
  notification-ninja-leaderboard
```

Der Reverse-Proxy muss TLS terminieren und `X-Forwarded-Proto` selbst mit `https` überschreiben. Der API-Port bleibt ausschließlich für diesen Proxy erreichbar. Beispiel für Caddy auf demselben Host:

```caddyfile
ninja-api.example.org {
    reverse_proxy 127.0.0.1:8082 {
        header_up X-Forwarded-Proto https
    }
}
```

Nach erfolgreichem HTTPS-Start in `notification-ninja/leaderboard-config.json` `enabled` auf `true` und `endpoint` auf die echte HTTPS-Adresse setzen, dann GitHub Pages neu veröffentlichen. Keine Zugangsschlüssel gehören in diese öffentliche Datei. `GET /health` liefert den Dienststatus. SQLite-Daten und Sicherungen bleiben außerhalb von Git; der Docker-Datenträger muss einen Neustart oder ein neues Deployment überleben.

## Daten, Anmeldung und Löschen

Diese Rangliste verwendet eine zufällige Gerätekennung mit geheimem Token. Der Server speichert nur einen SHA-256-Hash des Tokens. Der Token bleibt im Browser und wird nur an den konfigurierten Ranglisten-Server im Authorization-Header gesendet. Er gehört weder in eine URL noch in Protokolle oder Screenshots.

Veröffentlicht werden Ninja-Name, Punkte, Modus, der einheitliche interne Schwierigkeitswert, Regelsatz und der Zeitpunkt der Übermittlung. Zusätzlich werden Run-ID, aktive Dauer und Zahl richtiger Entscheidungen zur Plausibilitätsprüfung gespeichert. Münzen, Profil-XP, Rang-Outfits, Tagesmissionen, Bewegungsdaten, Passwörter und E-Mail-Adressen werden nicht übertragen. Ninja-Namen sind frei wählbar und nicht weltweit reserviert. Das ist eine gerätebezogene Ranglisten-Anmeldung, kein Passwortkonto mit Wiederherstellung oder Gerätesynchronisation. Browserdaten löschen oder ein anderes Gerät erzeugt eine neue Identität; vor dem Löschen der Browserdaten zuerst die Online-Einträge über „Profil löschen“ entfernen.

Abmelden lässt den lokalen Token bestehen, damit veröffentlichte Einträge später weiterhin gelöscht werden können. Beim Profil-Löschen entfernt `DELETE /v1/player` nach Tokenprüfung die Online-Identität und alle ihre Runs. Schlägt die Verbindung fehl, muss die Oberfläche die Löschung erneut anbieten und die Zugangsdaten behalten. Bei blockiertem Browser-Speicher wird keine Ranglisten-Veröffentlichung gestartet. Ein Wechsel des Server-Endpunkts löscht bestehende Einträge beim alten Server nicht automatisch.

## API und Grenzen

| Methode | Pfad | Funktion |
| --- | --- | --- |
| `GET` | `/health` | Dienststatus mit `apiVersion: 2` und `ruleset: "open-v2"`. |
| `POST` | `/v1/players` | Mit `{username}` eine zufällige Identität erstellen. |
| `GET` | `/v2/leaderboard?mode=open&difficulty=normal&ruleset=open-v2&limit=25` | Beste aktuelle Runs, höchstens 50 Plätze; optional eigener Platz mit Bearer-Token. |
| `POST` | `/v2/runs` | Mit Bearer-Token `{username,runId,mode,difficulty,ruleset,result,score,duration,decisions}` veröffentlichen. |
| `DELETE` | `/v1/player` | Eigene Identität und zugehörige Runs löschen. |

Bearer-Format: `playerId.token`. Eine Run-ID hat 8–96 Zeichen aus Buchstaben, Ziffern, `_` und `-`. Derselbe Run kann erneut gesendet werden, ohne doppelt gezählt zu werden; ein geänderter Run mit derselben ID wird abgewiesen. Erlaubt sind ausschließlich `mode: "open"`, `difficulty: "normal"`, `ruleset: "open-v2"`, `result: "lives"` (Run durch verbrauchte Herzen beendet), 5–86.400 Sekunden aktive Spielzeit, 0–20.000.000 Punkte und begrenzte Entscheidungszahlen. `normal` ist hier der interne Wert des einzigen Open-Modus; das Spiel startet ihn stets mit drei Herzen und langsamem Einstieg. Der Offene Modus endet im Spiel ausschließlich bei null Herzen. Die obere API-Grenze für extrem lange Runs ist eine technische Anfrageprüfung, kein Timer im Spiel. Normale Level, freiwillig abgebrochene Runs und Training zählen nicht für die gemeinsame Rangliste. Im Offenen Modus sind kaufbare Fähigkeiten und Supers deaktiviert; Skins bleiben sichtbar und kosmetisch. Anfragen sind größenbegrenzt und werden pro Verbindungsadresse sowie Spieler gedrosselt. Nur konfigurierte Browser-Ursprünge erhalten CORS-Zugriff. Ein Reverse-Proxy teilt seine Verbindungsadresse; dessen weitere Rate-Limits müssen zum erwarteten Besucheraufkommen passen.

### Migration von den früheren drei Schwierigkeiten

Beim Öffnen einer vorhandenen SQLite-Datei ergänzt der Server die Spalte `ruleset`, falls sie fehlt. Bereits gespeicherte Runs erhalten den Wert `legacy`; Identitäten, Token-Hashes und Ergebnisse bleiben erhalten. Die neue Rangliste filtert ausschließlich `open-v2`, sodass verschiedene Herzanzahlen und Tempokurven nicht miteinander verglichen werden. Neue Übermittlungen mit fehlendem Regelsatz, `legacy`, `easy` oder `hard` werden abgelehnt. Die bisherigen Pfade `/v1/leaderboard` und `/v1/runs` sind kompatible Aliase derselben neuen Prüfung; sie bieten keinen Zugang zur alten Wertung. Identitätsanlage und Löschung bleiben unter `/v1/players` und `/v1/player`.

Aktuelle Browser erkennen eine Antwort mit falschem oder fehlendem Regelsatz und zeigen an, dass die Rangliste aktualisiert wird. Ein alter gespeicherter Run lässt sich lokal fortsetzen, wird aber nicht nachträglich zu `open-v2` umetikettiert. Auf dem kostenlosen Render-Dienst bleibt auch die migrierte Datei flüchtig; diese Migration ersetzt keinen dauerhaften Datenträger.

Diese Prüfungen erkennen grob unplausible Eingaben. Der Browser berechnet weiterhin die Punkte; das System ist keine manipulationssichere Turnierrangliste. CORS ersetzt keine serverseitige Spielsimulation oder einen professionellen Schutz gegen absichtliche Fälschungen. Namen werden als Text dargestellt und dürfen keine HTML-Tags enthalten. Bei öffentlichem Betrieb sollten Betreiber Namen moderieren und die eigenen Hosting- und Datenschutzangaben ergänzen.

Prüfen:

```bash
node --test tests/ninja-leaderboard.test.mjs
```

Die Tests verwenden echte lokale HTTP-Server mit SQLite und zwei getrennten Client-Speichern. Sie prüfen gemeinsame Plätze, den einheitlichen Drei-Herzen-Regelsatz, Trennung und Erhalt früherer Ergebnisse bei der Migration, beste Runs, doppelte Übermittlung, Tokenprüfung, Kontolöschung, Neustartbeständigkeit mit beständiger lokaler Datei, CORS, unplausible Werte, deaktivierten Betrieb und Speicher-/Netzwerkfehler. Es wird dabei kein öffentlicher Dienst kontaktiert.
