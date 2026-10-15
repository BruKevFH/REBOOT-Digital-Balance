# Notification Ninja

Ein buntes, deutschsprachiges Arcade-Spiel über digitale Ablenkung: Wische durch störende Inhalte und lass hilfreiche Dinge passieren. Ein sonniges Klassenzimmer, ein gemütliches Gaming-Zimmer und ein Schlafzimmer bei Mondlicht begleiten deinen Tag. Bücher, Controller, Trinkflaschen, Kissen und andere gezeichnete Objekte passen zur jeweiligen Umgebung.

**[Im Browser spielen](https://brukevfh.github.io/REBOOT-Digital-Balance/notification-ninja/)** · **[Vollständiges Spiel 1.2.0 herunterladen](downloads/Notification-Ninja-1.2.0.zip)**

## Spielen

Öffne das Spiel in einem aktuellen Browser mit JavaScript. Für den Download die **gesamte ZIP-Datei entpacken** und anschließend `index.html` öffnen. Alle Laufzeitdateien gehören zum Paket; eine Engine-Installation oder ein Account ist nicht erforderlich. Falls dein Browser lokale Dateien einschränkt, kannst du den entpackten Ordner über einen lokalen HTTP-Server öffnen.

Die Online-Version speichert ihre Laufzeitdateien nach dem vollständigen ersten Laden für spätere Offline-Aufrufe. Die Musik startet nach deinem Klick auf **Spielen**, sofern Ton eingeschaltet ist. Über den Lautsprecher-Schalter kannst du sie jederzeit ausschalten. Musik und Effekte entstehen direkt im Browser, ohne externe Audiodateien: verspielte Zupfklänge beim Lernen, ein fröhlicher Marimba-Groove beim Gaming und eine sanfte Spieluhr vor dem Schlafen.

## Dein digitaler Tag

Nach dem Tutorial spielst du zuerst im kostenlosen Klassenzimmer. Verdiene Münzen und kaufe die nächsten Räume auf der Zimmerkarte. Die Kampagne führt durch alle bisher freigeschalteten Räume; danach sicherst du deine Münzen und kannst den nächsten Raum kaufen. Sobald alle vier Räume offen sind, kannst du den gesamten digitalen Tag durchspielen. Freigeschaltete Räume lassen sich auch einzeln starten. Die Zeitfenster bilden einen **komprimierten Tagesablauf** ab:

| Phase | Regel und Spielzeit |
| --- | --- |
| Study | Im sonnigen Klassenzimmer 75 Sekunden lang Ablenkungen schneiden und Dinge fürs Lernen durchlassen |
| Gaming | Im gemütlichen Gaming-Zimmer ein Limit von 45, 60 oder 90 Sekunden einhalten; anschließend bewusst aufhören oder einmal um 15 Sekunden verlängern |
| Sleep | Im Schlafzimmer bei Mondlicht zur Ruhe kommen; nach acht Sekunden kannst du das 75-Sekunden-Fenster bewusst beenden oder weiter auf Bonusjagd gehen |
| Master | 90 Sekunden mit wechselnden Zimmern und Kontexten; achte auf die neuen Hinweise beim Wechsel |

**WISCHEN** und **BEHALTEN** erscheinen ausschließlich im Training. Im normalen Spiel bleiben die Namen und Formen der Gegenstände sowie das aktuelle Kontextziel sichtbar. Du entscheidest selbst, was gerade hilft und was ablenkt. Ein Gaming-Clip kann beim Lernen ablenken und während der eingeplanten Gaming-Zeit passen. Beim Kontextwechsel behalten bereits fliegende Objekte ihre bisherige Bedeutung.

### Schwierigkeit und steigendes Tempo

| Schwierigkeit | Herzen zu Beginn | Münzfaktor | Maximales Tempo gegenüber dem Start |
| --- | --- | --- | --- |
| Entspannt – Voreinstellung | 5 | ×1 | ×1,35 |
| Normal | 4 | ×1,25 | ×1,65 |
| Profi | 3 | ×1,5 | ×1,95 |

Wähle den Schwierigkeitsgrad im Startmenü. **Ein falscher Schnitt und eine durchgelassene Ablenkung kosten jeweils ein Herz.** Beide Fehler unterbrechen deine Combo und erhöhen den Overload-Wert. Ein aktiver Schild fängt genau einen Fehler ab. Hilfreiche Dinge und ausgelassene optionale Bonusobjekte kosten beim Durchlassen kein Herz.

Die Objekte werden im Verlauf schneller und erscheinen häufiger. Nach 120 aktiven Spielsekunden ist die Tempostufe des Schwierigkeitsgrads erreicht; diese Entwicklung läuft über die Abschnitte eines Runs hinweg. Bereits fliegende Objekte behalten ihre Flugbahn. Die Uhr bleibt unverändert: Zeitlupe und Flow verlangsamen die Objekte, nicht die Levelzeit. Pause hält Simulation, Effekte und Uhr an.

### Abwechslung und Boni

In jedem Level beginnt nach jeweils 20 aktiven Bonussekunden eine sechssekündige Phase. Beim Kontextwechsel wartet diese Bonusuhr, bis die bisherigen Objekte das Feld verlassen haben. Drei Phasen wechseln sich ab:

- **Münzregen:** mehr fliegende Münzen und doppelte während der Phase erspielte Münzen.
- **Combo-Party:** doppelte Arcade-Punkte.
- **Fokus-Welle:** mehr Ablenkungen zum Schneiden.

Sammle Münzen durch Wischen ein; du musst sie nicht erwischen, um deine Herzen zu behalten. Jede Phase hat eigene visuelle Hinweise.

Fünf richtige Entscheidungen in Folge aktivieren den **Flow-Modus**. Seine Grunddauer beträgt fünf Sekunden. Fliegende Power-ups verleihen sechs Sekunden Zeitlupe, einen Schild gegen den nächsten Fehler oder zehn Sekunden doppelte Arcade-Punkte. Kombos, Boni, Fähigkeiten und abgeschlossene Levels bekommen eigene Animationen und kurze Klangfolgen.

## Zimmerkarte und Ninja-Basar

Die Zimmerkarte zeigt dir freigeschaltete Räume und das nächste Ziel. Käufe kosten erspielte Münzen und setzen den vorherigen Raum voraus:

| Raum | Preis | Voraussetzung |
| --- | --- | --- |
| Schulzimmer – Study | Kostenlos | Von Anfang an verfügbar |
| Gaming-Zimmer | 35 Münzen | Schulzimmer |
| Schlafzimmer – Sleep | 75 Münzen | Gaming-Zimmer |
| Balance Master | 120 Münzen | Schlafzimmer |

Endet deine Kampagne vor einem noch gesperrten Raum, wird der bisherige Run abgeschlossen und einmalig abgerechnet. Kaufe den nächsten Raum im Basar und starte eine neue Kampagne oder wähle auf der Karte einen offenen Einzelraum. Ein Kauf schaltet einen Raum dauerhaft für dieses lokale Profil frei und startet keine Runde. Die Teilkampagne vor einem gesperrten Raum zählt nicht als vollständiger Abschluss für **Balance-Meister** oder **Profi-Ninja**.

Im **Ninja-Basar** gibt es Bereiche für Räume, Hintergründe und Skins. Die drei Grundkulissen **Sonniges Klassenzimmer**, **Gemütliche Gaming-Ecke** und **Sternen-Schlafzimmer** gehören bereits zum Spiel; mit dem passenden Raum werden sie nutzbar. Zusätzliche Hintergründe haben eigene Motive und können erst gekauft werden, wenn der passende Raum offen ist:

| Hintergrund | Motiv | Raum | Preis |
| --- | --- | --- | --- |
| Papiergarten | Papierblumen und Origami | Study | 60 Münzen |
| Pixelbucht | Insel, Palmen und Pixelwellen | Gaming | 85 Münzen |
| Mondinseln | Schwebende Wolkeninseln und Mondlicht | Sleep | 110 Münzen |

Nach dem Kauf wählst du den Hintergrund ausdrücklich für den passenden Raum aus; Kaufen und Auswählen sind zwei Schritte. Diese Auswahl wird beim nächsten neuen Run übernommen; ein gespeicherter Run behält seine bisherige Gestaltung. Master verwendet beim Kontextwechsel die jeweilige ausgewählte Kulisse. Die Hintergründe verändern die Darstellung, während die Kontextregeln des Raums gelten. Vier Klingen-Skins haben unterschiedliche Designs, Farbpaletten und Wischspuren; im Basar kannst du sie vor dem Kauf ansehen.

## Münzen, Fähigkeiten und Erfolge

Ohne Fähigkeiten verdienst du eine Münze je fünf richtige Entscheidungen, drei Münzen pro eingesammeltem Münzobjekt und zwei Münzen bei jeder vollen Zehner-Combo. Schwierigkeit und Fähigkeiten verändern den Verdienst. Bruchteile aus Münzfaktoren werden innerhalb des Runs weitergezählt. Am Ende kommen Punkte- und Stopp-Boni hinzu.

Während des Runs zeigt das Spiel die vorgemerkten Münzen an. Diese werden **am Run-Ende einmalig** deinem Guthaben gutgeschrieben, auch wenn du alle Herzen verlierst. Das erneute Öffnen desselben Ergebnisses zahlt keine zweite Belohnung aus. Ein noch laufender Run kann gespeichert und fortgesetzt werden; seine vorgemerkten Münzen sind noch nicht ausgebbar.

Mit deinem Guthaben kaufst du Räume, Hintergründe, Klingen-Skins oder Knoten im Fähigkeitenbaum. Der Baum hat drei Äste mit je drei Stufen. Die erste Stufe kostet **12 Münzen**, die zweite **25**, die dritte **45**. Innerhalb eines Astes brauchst du jeweils die vorherige Stufe; jeder Knoten wird nur einmal gekauft.

| Ast | Stufe 1 – 12 Münzen | Stufe 2 – 25 Münzen | Stufe 3 – 45 Münzen |
| --- | --- | --- | --- |
| Fokus | **Klarer Kopf:** +2 Superladung pro richtiger Entscheidung | **Zeitzauber:** acht Sekunden langsamere Objekte | **Flow-Meister:** Flow dauert zwei Sekunden länger |
| Verteidigung | **Gut vorbereitet:** Run mit einem Schild beginnen | **Rettungsschirm:** den nächsten Fehler abfangen | **Zweite Chance:** einmal pro Run nach dem letzten verlorenen Herz mit einem Herz weiterspielen |
| Münzen & Combo | **Münzgespür:** eine Münze je vier statt fünf richtige Entscheidungen | **Aufräum-Wirbel:** alle sichtbaren Ablenkungen schneiden | **Goldener Lauf:** 25 Prozent mehr Spielmünzen |

Rüste **eine** freigeschaltete Superfähigkeit aus. Jede richtige Entscheidung füllt ihre Anzeige um acht Prozentpunkte, mit **Klarer Kopf** um zehn. Ein Sweep lädt sich durch seine eigenen Treffer nicht erneut auf. Bei **100 Prozent** kannst du sie über die Super-Schaltfläche oder mit der **Leertaste** einsetzen; anschließend muss sie erneut aufgeladen werden. Der Sweep trifft ausschließlich Ablenkungen. Hilfreiche Inhalte bleiben bestehen.

Gekaufte passive Fähigkeiten und die ausgewählte Superfähigkeit werden **beim Start eines neuen Runs** übernommen. Ein gespeicherter Run behält seine beim Start gewählte Ausstattung. So ändern Käufe während einer Pause nicht nachträglich die laufende Runde.

Im Erfolgsmenü kannst du erreichte Erfolge ansehen und ihre Münzbelohnung **jeweils einmal abholen**. Freischalten und Abholen sind getrennte Schritte. Abgeholte Belohnungen bleiben als abgeholt gespeichert.

| Erfolg | Bedingung | Münzen |
| --- | --- | --- |
| Erster Wischer | Erste Ablenkung schneiden | 3 |
| Im Flow | Zum ersten Mal Flow aktivieren | 5 |
| Mit Köpfchen | Einen Abschnitt ohne Entscheidungsfehler abschließen | 8 |
| Meine Grenze | Gaming oder Sleep bewusst per Stopp beenden | 8 |
| Balance-Meister | Kampagne oder Master abschließen | 15 |
| Zehner-Serie | Combo 10 erreichen | 8 |
| Unaufhaltsam | Combo 25 erreichen | 15 |
| Münzsammler | Insgesamt 100 Münzen verdienen; Ausgeben ist erlaubt | 12 |
| Gute Instinkte | Insgesamt 250 richtige Entscheidungen treffen | 20 |
| Profi-Ninja | Einen Run auf Profi abschließen | 25 |
| Superkraft! | Ersten Super einsetzen | 8 |
| Mein eigener Weg | Erste Fähigkeit kaufen | 6 |

Arcade-Punktzahl und Balance-Wertung werden getrennt angezeigt; lokale Highscores, Münzen, Erfolge, Fähigkeiten, Räume, Hintergründe und vier Klingen-Skins bleiben auf deinem Gerät.

Alle Benachrichtigungen, Boni und Münzen sind Spielsimulationen. Es gibt keine echten Käufe oder Gewinne. Das Spiel vermittelt Aufmerksamkeitsauswahl, Kontextbewusstsein und selbst gewählte Grenzen bei digitalen Medien.

## Steuerung

| Eingabe | Aktion |
| --- | --- |
| Maus mit gedrückter Taste | Durch Ablenkungen, Münzen und gewünschte Power-ups ziehen |
| Ein Finger auf der Spielfläche | Durch dieselben Objekte wischen |
| Super-Schaltfläche / Leertaste | Ausgerüstete Superfähigkeit bei voller Ladung einsetzen |
| Pause-, Sound- und Entscheidungstasten | Pause, Musik und bewusste Zeitentscheidungen bedienen |

Hilfreiche Dinge unberührt passieren lassen. Ein Schnitt folgt deiner tatsächlichen Wischbewegung. Im Tutorial lernst du den Unterschied zwischen Ablenkung und hilfreichem Signal.

## Daten und Offline-Nutzung

Es gibt keinen Account, keine API-Anbindung und keine Übertragung von Spielständen oder Telemetrie. Fortschritt und Einstellungen liegen in **localStorage**. Wenn dein Browser die Speicherung blockiert, bleibt das Spiel für die laufende Sitzung spielbar. Das Löschen der Website-Daten entfernt den lokalen Fortschritt.

Online-Version, lokale HTTP-Version und direkt geöffnete Dateien können getrennte Speicherplätze verwenden. Die lokale Dateinutzung kann von den Browser-Einstellungen abhängen. Ältere Profile behalten ihr vorhandenes Guthaben, ihre Skins und Erfolge; Fähigkeiten, Räume und Hintergründe ergänzen diesen Fortschritt. Bereits gespeicherte ältere Runs lassen sich fortsetzen; für neue Runs gelten die Raumfreischaltungen.

Ältere vollständige Downloads bleiben verfügbar: [Version 1.1.0](downloads/Notification-Ninja-1.1.0.zip) und [Version 1.0.0](downloads/Notification-Ninja-1.0.0.zip).

## Entwicklung

Voraussetzungen: **Node.js ab Version 20**, npm und **Python 3**. Im Repository-Root ausführen:

```sh
npm ci
npm run build:ninja
npm run test:ninja
npm run package:ninja
npm run serve
```

Danach `http://localhost:8000/notification-ninja/` öffnen. `build:ninja` erstellt das fertige JavaScript-Bundle in `notification-ninja/dist/`. `package:ninja` erzeugt das vollständige ZIP und seine SHA-256-Prüfsumme in `notification-ninja/downloads/`. Nach Änderungen neu bauen und paketieren; bei Änderungen an gecachten Dateien auch die Service-Worker-Cache-Version aktualisieren.

Die fertigen Laufzeitdateien sind versioniert. GitHub Pages veröffentlicht sie aus `main` → `/(root)`; dafür wird kein npm-Schritt auf dem Server benötigt. Die bisherigen Spiele [MIND MAZE](../mind-maze/README.md) und [REBOOT Neon Balance](../README.md) bleiben separat erhalten.

Das [Ablaufdiagramm und die Beispielplanung](PLAN.md) beschreiben Spielablauf, technische Systeme und mögliche weitere Iterationen.

## Projektstruktur

```text
notification-ninja/
├── index.html, styles.css     # Startmenü, HUD und Dialoge
├── src/game.js               # Regeln, Kontextwechsel und Spielstände
├── src/progression.js        # Schwierigkeit, Räume, Shop, Fähigkeiten und Erfolge
├── src/renderer.js           # Canvas-Grafik, Schnitte und Effekte
├── src/audio.js              # Lokaler WebAudio-Soundtrack
├── src/main.js               # Maus, Touch und Bildschirmablauf
├── dist/                     # Fertiges JavaScript-Bundle
├── downloads/                # Vollständiges ZIP und Prüfsumme
├── sw.js                     # Offline-Cache für diesen Spielpfad
└── PLAN.md, TEST_REPORT.md    # Ablauf, Beispielplanung und Prüfbericht
```

Build- und Paketierungswerkzeuge liegen unter `../scripts/`, die Regeltests unter `../tests/ninja.test.mjs`. Der [Prüfbericht](TEST_REPORT.md) nennt die ausgeführten Tests und ihre Grenzen.
