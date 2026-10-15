# Notification Ninja 1.2.0 – Prüfbericht

Geprüft am **15. Oktober 2026** mit Chromium/Playwright, nativen Maus- und Touch-Eingaben, Node.js 24 und Python 3. Alle erforderlichen Grafik-, Spiel- und Audiodaten sind lokal enthalten.

## Ergebnisse

| Prüfung | Ergebnis |
| --- | --- |
| `npm test` | **120 bestanden**, 0 fehlgeschlagen, 0 übersprungen: 55 Ninja-Regeltests, 20 Fortschrittstests, 20 MIND-MAZE- und 25 REBOOT-Tests |
| Fähigkeiten und Fortschritt | Neun Knoten, Vorgängerbedingungen, drei Supers, zwölf einmalig abholbare Erfolgsbelohnungen, drei Schwierigkeitsgrade und alte Profile geprüft |
| Native Fortschrittsfälle | **11/11 bestanden**: erspielte Rundenmünzen bleiben bis zum Abschluss getrennt vom Wallet; Käufe, verzögerte Ausrüstung, Erfolge, 5/4/3 Herzen, beide Fehlerarten, einmalige Abrechnung bei Spielende, Migration und Pause |
| Native Spielort-/Shopfälle | **4/4 bestanden**: echte Raum-Sperren, Kaufreihenfolge 35/75/120, korrekte Münzabzüge, alle Premium-Hintergründe kaufen und ausdrücklich auswählen, Neuladen, echte Kulissen im Spiel und Kampagnenende am gesperrten Raum |
| Supers und Münzregen | Alle drei Supers mit echten Touch-Eingaben aktiviert; Ladung verbraucht, Zeitlupe/Schild/Wirbel wirksam. Der Wirbel entfernt Ablenkungen und erhält sinnvolle Objekte. Einen tatsächlich erschienenen Münzgegenstand per Touch gesammelt |
| Premium-Spielwelten | Papiergarten, Pixelbucht und Mondinseln aus über Spiel verdienten und gekauften Checkpoints mit Touch gestartet; echte Renderer-Kulisse und neutrale Objektbeschriftungen geprüft |
| Basar und Bedienung | 1280×800, 390×844, 320×568 und 844×390: Zimmerkarte, alle drei Shop-Bereiche, vier Orte, sechs Hintergründe und vier Ninja-Designs mit tatsächlich gezeichneten Vorschauen; erreichbare Tasten und kein horizontaler Überlauf |
| Training und normale Runde | WISCHEN-/BEHALTEN-Hilfen nur im Training; Training erneut startbar. Außerhalb des Trainings bleibt derselbe Gegenstand bei unterschiedlicher Bewertung pixelgleich; die richtige Aktion wird nicht vorweggenommen |
| Musik und Effekte | Tatsächliches WebAudio mit Nutzerfreigabe, klaren Kontextmelodien, Münz-/Super-/Erfolgs-Cues, Pause und Mute; maximal 32 Stimmen. Partikel, Münz- und Super-Animationen sind begrenzt und laufen aus |
| Offline und ZIP | **8/8 bestanden**: Einstieg aus Root, getrennte Worker-Scopes, eigener alter 1.1-Cache gelöscht, fremde Caches erhalten, nativer Schnitt mit Offline-Reload, echter ZIP-Download mit identischer Prüfsumme, entpacktes HTTP-Spiel und Offline-Fortsetzen |
| Reproduzierbare Paketierung | Zweimal identische ZIP-Erstellung; CRC und bytegleiche Laufzeitdateien geprüft |

## Vollständiger nativer Durchlauf

Ein durch öffentliche Spielmethoden erzeugter Vor-Spielstand enthielt Münzen aus 14 simulierten abgeschlossenen Lernrunden und bereits legal freigeschaltete Räume. Im Browser wurden anschließend mit echten Schaltflächen die Fokus-Fähigkeit, der Zeitzauber und der Papiergarten gekauft und ausgewählt. Danach liefen das wiederholbare Training und die **vollständige Kampagne mit regulär laufender Uhr und nativen Mauswischern**, ohne Sprünge in der Spielzeit oder Mutationen über Diagnosefunktionen.

Der Durchlauf endete mit vier abgeschlossenen Abschnitten, allen drei Master-Kontexten, allen drei Bonusphasen, 56 geschnittenen Ablenkungen, 69 hilfreichen Durchlässen, 40 eingesammelten Power-ups und 12 Super-Einsätzen. Ergebnis: 30.800 Punkte, Balance 100, fünf Herzen. **165 Münzen** wurden genau einmal gutgeschrieben; Wallet 555→720. Export und Neuladen bewahrten Ausrüstung, Münzen, Highscore und Rundenzähler. Keine JavaScript-Fehler oder externen Spielanfragen.

Die fokussierten Integrationsprüfungen verwenden ebenfalls über echte Spielaufrufe verdiente Checkpoints. Komponentenprüfungen von Grafik oder Audio werden als solche ausgewiesen; sie ersetzen den vollständigen nativen Durchlauf nicht. Mobile Prüfungen verwenden Chromium mit Touch-/Viewport-Emulation und sind kein Nachweis eines physischen iPhone-Safari-Tests.

## Download

`downloads/Notification-Ninja-1.2.0.zip`: **66.381 Bytes**, sieben Laufzeitdateien plus `START-HIER.txt` in einem vollständigen Spielordner.

SHA-256: `816bd4ee5ff0d6d99b4c8e6590d6c4e853ee9c3182294277226b47665d7578ae`

Der heruntergeladene Browser-Download stimmt bytegenau mit dem erzeugten Paket überein. Die älteren 1.0.0- und 1.1.0-Pakete bleiben für vorhandene Links erhalten.

## Grenzen und Artefakte

Direktes `file://`-Öffnen ist im verwalteten Cloud-Chromium gesperrt; ein erfolgreicher Doppelklick-Test wird nicht behauptet. Die Richtlinie wurde nicht umgangen. Der direkte öffentliche HTTPS-Browsertest ist hier wegen des bestehenden Proxy-CA-Vertrauens optional eingeschränkt; Zertifikatsprüfung und Browserrichtlinien bleiben aktiv. Öffentliche Dateien werden separat über HTTPS mit regulärem Systemvertrauen bytegenau geprüft.

Ausführliche Berichte und Screenshots liegen außerhalb des Checkouts unter `/workspace/ninja-checks/v12/`, Shop-/Layout-Berichte zusätzlich unter `/workspace/ninja-v12-checks/ui/`. Herkunftsnachweise für Test-Spielstände liegen unter `/workspace/ninja-checks/progression/` sowie in den Fixture-Skripten im v12-Verzeichnis. Sie sind Prüfartefakte und keine Spielabhängigkeiten. Es wurden keine Tests mit jugendlichen Testpersonen durchgeführt.
