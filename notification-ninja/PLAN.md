# Notification Ninja: Ablauf und Weiterentwicklung

Diese Übersicht dokumentiert den Spielablauf von Version 1.5.0 und ordnet die technischen Aufgaben. Der Zeitplan am Ende ist ein **anpassbares Beispiel für Weiterentwicklung**. Seine Daten sind keine vereinbarte Projektfrist.

## Ablauf der Bildschirme

```mermaid
flowchart TD
    First[Startseite] --> Existing{Lokales Profil vorhanden?}
    Existing -->|Nein| Name[Ninja-Namen wählen: lokales Profil]
    Existing -->|Ja| Home[Dojo-Übersicht und Zimmerkarte]
    Name --> Welcome[NIM erklärt den Einstieg]
    Welcome --> Home[Dojo-Übersicht und Zimmerkarte]
    Home --> Profile[Profil: Name / Münzen / Level / XP / Export]
    Home --> Inbox[Mitteilungen: neue Freischaltungen]
    Profile --> Home
    Profile --> Logout[Abmelden: Fortschritt behalten]
    Logout --> First
    Profile --> Delete[Namen bestätigen: Ninja-Profil löschen]
    Delete --> First
    Inbox --> Home
    Home --> Setup[Offenen Raum oder Kampagne wählen]
    Home --> Basar[Ninja-Basar: Zimmer / Hintergründe / Skins]
    Home --> Tree[Wurzelbaum: aus der Mitte in drei Äste]
    Home --> Achievements[Erfolge: offene Ziele oben, Sammlung unten]
    Home --> Scores[Lokale Highscores]
    Home --> Open[Open Run: kostenlos und ohne Zeitlimit]
    Open --> Faster[Tempo steigt weiter, bis Herzen aufgebraucht]
    Faster --> OpenEnd[Open-Ergebnis: einmalig lokal sichern]
    OpenEnd --> Ranking[Optional: Ergebnis ausdrücklich veröffentlichen]
    Ranking --> Home
    OpenEnd --> Home
    Basar --> Home
    Tree --> Equip[Einen Super für neue Runs ausrüsten]
    Equip --> Home
    Achievements --> Home
    Scores --> Home
    Setup --> Snapshot[Neuer Run übernimmt Schwierigkeit und Ausstattung]
    Snapshot --> Tutorial[Training: NIM erklärt Wischen und Durchlassen]
    Tutorial --> Study[Study: 75 Sekunden]
    Study --> HasGaming{Gaming gekauft?}
    HasGaming -->|Ja| Gaming[Gaming: 45 / 60 / 90 Sekunden]
    HasGaming -->|Nein| Locked[Ergebnis vor gesperrtem Raum]
    Gaming --> Decision{Das Limit ist erreicht}
    Decision -->|Bewusst stoppen| HasSleep{Sleep gekauft?}
    Decision -->|Einmal weiterspielen| Extra[15 zusätzliche Gaming-Sekunden]
    Extra --> ExtraStop[Verlängerung endet: bewusst stoppen]
    ExtraStop --> HasSleep
    HasSleep -->|Ja| Sleep[Sleep: 75 Sekunden]
    HasSleep -->|Nein| Locked
    Sleep --> SleepChoice{Ab acht Sekunden: eigene Entscheidung}
    SleepChoice -->|Zur Ruhe kommen| HasMaster{Master gekauft?}
    SleepChoice -->|Bonusjagd| SleepBonus[Weiter spielen; Stopp bleibt verfügbar]
    SleepBonus --> HasMaster
    HasMaster -->|Ja| Master[Master: 90 Sekunden mit Kontextwechseln]
    HasMaster -->|Nein| Locked
    Master --> End[Ergebnis: Run-Münzen einmalig gutschreiben]
    Locked --> End
    Study -->|Keine Herzen mehr| End
    Gaming -->|Keine Herzen mehr| End
    Extra -->|Keine Herzen mehr| End
    Sleep -->|Keine Herzen mehr| End
    SleepBonus -->|Keine Herzen mehr| End
    End --> Achievements
    End --> Basar
    End --> Home
    End --> XP[Gesicherte Statistiken bestimmen XP und Level]
    XP --> Home
```

Das Diagramm zeigt den Einstieg, Open Run und die Kampagne. Die Startseite führt zu einem neuen oder bereits vorhandenen lokalen Ninja-Profil; Abmelden erhält den Spielstand. Umbenennen ändert nur den Namen. Zum endgültigen Löschen muss der aktuelle Name bestätigt werden; vorhandene Online-Einträge werden zuerst entfernt. Die Dojo-Übersicht bündelt Profil, Level, XP, Münzen und das nächste Ziel. Die Profil-Garderobe zeigt tatsächlich gekaufte und ausgewählte Ninja-Looks. Der eigene Ninja übernimmt im Spielfeld die Wurfanimation. Die feste Zurück-Schaltfläche stellt die vorherige Ansicht und ihre Scrollposition wieder her.

Das Spielfeld zeigt ein größeres Ninja-Team um die Mitte: ein Werfer auf Entspannt, zwei auf Normal und drei auf Profi. Jeder trägt den beim Run-Start ausgewählten Look. Gegenstände folgen beim Ausholen der tatsächlichen Handposition, lösen sich bei der Wurfbewegung und wachsen beim Anflug auf volle Größe. Die Aushol- und Anflugphase sind vor Schnitten geschützt; erst danach nimmt die Schnittprüfung den Gegenstand auf. Dadurch stimmen Animation und spielbare Flugbahn überein.

Die Ansicht-Taste auf der Startseite und in der Werkzeugleiste fordert den nativen Vollbildmodus nur nach einem Klick an. Bei fehlender oder abgelehnter Browser-API schaltet sie auf eine große Spielansicht um und benennt diese entsprechend. Das gilt auch für Safari-Konfigurationen, die Webseiten-Vollbild nicht unterstützen. Die Browserleisten können dabei sichtbar bleiben. Erneutes Tippen beendet die aktuelle Ansicht; `Esc` beendet die große Ersatzansicht und dient sonst der Spielpause.

Das Schulzimmer ist frei; Gaming-Zimmer kostet 80, Schlafzimmer 180 und Balance Master 320 Münzen, jeweils nach dem Kauf des vorherigen Raums. Vor einem noch gesperrten Raum endet der Run mit `result: locked`; die verdienten Münzen werden einmal gutgeschrieben. Erst mit allen vier Räumen führt die Kampagne durch den ganzen Tag. Einzelmodi starten den gewählten offenen Raum direkt. Ein gespeicherter Run setzt seine bestehende Ausstattung fort. Im Startmenü gibt es Entspannt mit fünf Herzen, Normal mit vier und Profi mit drei Herzen.

Der kostenlose **Open Run** verwendet durchgehend den Lernkontext und endet ausschließlich bei null Herzen. Er hat kein Zeitlimit; auch nach 90 oder 300 aktiven Sekunden steigt sein Tempo weiter. Gekaufte Fähigkeiten und Supers sind für diesen Vergleichsmodus ausgeschaltet. Fliegende Power-ups und Focus Flow bleiben verfügbar; Skins und Hintergründe sind kosmetisch. Die gemeinsame Rangliste nimmt nur ausdrücklich veröffentlichte Open-Ergebnisse an und trennt nach Schwierigkeit. Kampagne, Einzelräume und Training bleiben außerhalb der gemeinsamen Rangliste.

Der eigene Fuchs-Sensei **Meister NIM** begleitet den Anfang und erklärt neue Fähigkeiten, Supers und andere Freischaltungen. Seine Dialoge pausieren die Simulation; die Bestätigung wird lokal gespeichert. Die Glocke zeigt ungelesene Mitteilungen, das Postfach hält bis zu 50 Freischaltungen bereit. Diese Hinweise sind Teil des Spiels und verwenden keine externen Push-Nachrichten. Der Fähigkeitenbaum beginnt in der Mitte und wächst über verbundene Wurzeln in drei Richtungen. Kräftige eigene SVG-Bildabzeichen machen Fähigkeiten und 24 Erfolge erkennbar. Erworbene Fähigkeiten und geschaffte Erfolge stehen mit ihren Details unter den offenen Zielen.

Die Phase bestimmt, welche Dinge helfen und welche ablenken. Klassenzimmer, Gaming-Zimmer und Schlafzimmer haben eigene Hintergründe, passende Objekte und eigene Musik. WISCHEN-/BEHALTEN-Hinweise erscheinen nur im Training. Danach zeigen Objektnamen, Formen und das aktuelle Kontextziel die Situation; eine Antwortmarkierung entfällt. Gaming- und Schlafentscheidungen werden über sichtbare Schaltflächen getroffen. Pause unterbricht die laufende Simulation und die Musik.

Ein falscher Schnitt und eine verpasste Ablenkung kosten jeweils ein Herz, sofern kein Schild schützt. Nach 15, 30 und 60 aktiven Sekunden steigt das Tempo deutlich; normale Räume erreichen nach 90 Sekunden die feste Grenze von 1,75 / 2,25 / 2,75 gegenüber dem Starttempo. Im Open Run steigt das Tempo danach weiter. Die Leveluhr der normalen Räume läuft weiterhin unverändert. Alle 20 aktiven Bonussekunden bringt eine sechssekündige Münzregen-, Combo-Party- oder Fokus-Welle Abwechslung. Während eines Kontextwechsels wartet die Bonusuhr auf das Ende der bisherigen Flugobjekte; die normale Leveluhr läuft weiter. Richtige Entscheidungen, Bonusobjekte, Flow und Supers belohnen mit Punkten, Animationen und Klangfolgen.

## Technische Systeme

| System | Aufgabe | Prüffrage |
| --- | --- | --- |
| Engine | Objekte aus den Ninja-Händen werfen, nach dem Anflug Schnitte erfassen und das Tempo steuern | Stimmen Handposition, Flugbahn und Darstellung überein, und bleiben Ausholen und Anflug vor Schnitten geschützt? |
| Context | Objekte im aktuellen Lern-, Gaming- oder Schlafkontext bewerten | Behält ein bereits fliegendes Objekt beim Kontextwechsel seine bisherige Bewertung? |
| Balance | Herzen, Combo, Flow, Bonuswellen, Power-ups, Supers und Zeitentscheidungen berechnen | Kosten beide Fehler ein Herz, fängt ein Schild nur einen Fehler ab und pausieren alle Timer? |
| Progression | Münzen, Zimmerkarte, Hintergründe, Fähigkeiten, Erfolge, Skins und Highscores lokal verwalten | Werden Run-Münzen einmal gutgeschrieben, Raumvoraussetzungen geprüft und Erfolgsbelohnungen nur einmal abgeholt? |
| Player | Ninja-Name, aus Statistiken abgeleitete XP und Level sowie lokales Postfach | Bleiben alte Münzen und Freischaltungen beim Benennen erhalten und taucht jede Freischaltung nur einmal auf? |
| Mentor | NIM-Erklärungen mit Animation, Tastaturfokus und bestätigten Hinweisen | Stehen Spiel und Uhr während der Erklärung still und wird anschließend der richtige vorherige Zustand wiederhergestellt? |
| Leaderboard | Optional veröffentlichte Open-Ergebnisse nach Schwierigkeit vergleichen | Bleibt die deaktivierte Rangliste ehrlich leer und werden nur ausdrücklich veröffentlichte gültige Open Runs übertragen? |
| Ansicht | Browser-Vollbild oder große Spielansicht öffnen und verlassen | Meldet die Schaltfläche den tatsächlichen Modus und passt sich die Spielfläche beim Wechsel an? |

```mermaid
flowchart LR
    Input[Maus, Touch und Super-Taste] --> Engine[Engine: Bewegung und Schnittprüfung]
    Engine --> Context[Context: relevant, ablenkend oder Bonus]
    Context --> Balance[Balance: Herzen / Tempo / Flow / Supers]
    Balance --> Pending[Run-Münzen vormerken]
    Pending --> End[Run-Ende: einmalige Gutschrift]
    End --> Progression[Progression: Guthaben / Basar / Baum / Erfolge]
    End --> Player[Player: XP und Level aus gesicherten Statistiken]
    Player --> Storage
    Progression --> Notice[Neue Freischaltung: Mitteilung und NIM-Erklärung]
    Notice --> View
    Progression --> Storage[Lokaler Browserspeicher]
    Storage --> Progression
    Progression --> NewRun[Neue Runde: Ausstattung übernehmen]
    NewRun --> Balance
    Balance --> View[Oberfläche und Effekte]
    Balance --> Sound[Optionales WebAudio]
```

`game.js` verwaltet die laufende Simulation und die Abrechnung eines Runs. `progression.js` enthält Schwierigkeit, Raum- und Hintergrundkatalog, neun Fähigkeiten und 24 Erfolge sowie die Prüfungen für Käufe, Ausrüstung und Belohnungsabholung. Die drei Äste kosten je 35, 90 und 180 Münzen; eine Stufe setzt die vorige desselben Astes voraus. Ein neuer normaler Run übernimmt die freigeschalteten passiven Fähigkeiten, den ausgewählten Super und die Hintergrundauswahl je Kontext. Master nutzt beim Wechsel die Ausstattung des jeweiligen Kontexts. Einkäufe verändern diesen gespeicherten Satz im laufenden Run nicht. Open Run startet dagegen ohne gekaufte Fähigkeiten und Supers. Papiergarten kostet 160 Münzen für Study, Pixelbucht 220 für Gaming und Mondinseln 280 für Sleep; der zugehörige Raum muss vorher offen sein. Die drei Grundkulissen sind enthalten. Die drei zusätzlichen Ninja-Looks kosten 80, 180 und 320 Münzen. Hintergrundkauf und anschließendes Auswählen sind getrennte Schritte; ein Raumkauf startet keine Runde. Vorhandenes Guthaben und Freischaltungen werden erhalten.

Die Münzökonomie vergibt eine Grundmünze je 14 richtige Entscheidungen, je eingesammeltem Münzobjekt und je voller 25er-Combo. Münzgespür senkt den Entscheidungsabstand auf zwölf. Faktoren verändern den Verdienst, während ein Abschnittsbudget die Spielmünzen auf 8 / 10 / 12 begrenzt. Goldener Lauf erhöht auch dieses Budget um 25 Prozent, abgerundet. Ein normal abgeschlossener Run mit mindestens zwölf richtigen Entscheidungen erhält zwei Abschlussmünzen; ein bewusster Stopp gibt dann eine weitere. Der Abschluss vor einem gesperrten Raum zählt ebenfalls. Bei verbrauchten Herzen gibt es diesen Abschlussbonus nicht. Ein fehlerfreier einzelner Study-Run kann ohne Münzfähigkeiten höchstens 10 / 12 / 14 Münzen sichern, zuzüglich später ausdrücklich abgeholter Erfolgsbelohnungen. Der Open Run ist ein fortlaufender Abschnitt mit einem Münzbudget.

`player.js` prüft den 3–18 Zeichen langen Ninja-Namen, bekannte Erklärungsschlüssel und Mitteilungen. Es berechnet die Gesamt-XP als `5 × richtige Entscheidungen + 10 × Super-Einsätze + 25 × beendete Runs` aus den gespeicherten Statistiken. Neue Run-Werte kommen bei der einmaligen Abrechnung hinzu; das Training vergibt keine Run-XP. Die Schwelle für Level `L` beträgt `100 × (L − 1)²` Gesamt-XP. Name und Postfach ändern die Münzbilanz nicht. Das Profil bleibt in `localStorage`; ein Kontodienst für Anmeldung oder Gerätesynchronisierung gehört nicht zum Spiel.

`mentor.js` stellt die NIM-Dialoge samt Animationen und Tastaturbedienung bereit. `main.js` verbindet sie mit dem pausierten Spielzustand und merkt Bestätigungen. `art.js` liefert eigene SVG-Bilder für Fähigkeiten, Erfolge und Dojo; zur Laufzeit werden dafür keine Bilder von externen Diensten geladen.

`throwers.js` liefert dieselben Ninja-Positionen und Handbewegungen an Spielregeln und Renderer. Die Anzahl richtet sich nach der Schwierigkeit; jeder neue Gegenstand erhält seinen Werfer und die Aushol-/Anflugphase. `game.js` prüft vor einem Schnitt, ob der Anflug abgeschlossen ist. `fullscreen.js` verwaltet den nativen Vollbildmodus einschließlich WebKit-API und die große Ersatzansicht bei fehlender Unterstützung. Die Oberfläche meldet den tatsächlichen Modus, statt die Ersatzansicht als natives Vollbild auszugeben.

`local-profile.js` verwaltet den lokalen Anmeldestatus und löscht gezielt Notification-Ninja-Daten. `leaderboard.js` verbindet den Browser bei aktivierter Konfiguration mit `server/ninja-leaderboard.mjs`. Die Standardkonfiguration ist deaktiviert; es wurde kein externer Ranglistenserver bereitgestellt. [`render.yaml`](../render.yaml) bereitet einen kostenlosen Render-Dienst vor. Zur Aktivierung muss der Betreiber im eigenen Konto den Blueprint starten und anschließend die echte HTTPS-Adresse in `leaderboard-config.json` veröffentlichen. Bei diesem Free-Dienst wird die SQLite-Rangliste beim Einschlafen, Neustart oder Deployment gelöscht. Lokale Profile sind davon unabhängig. Einrichtung und Grenzen stehen in [server/README_NINJA.md](../server/README_NINJA.md).

Der Super lädt sich durch richtige Entscheidungen und kann bei 100 Prozent über Schaltfläche oder Leertaste aktiviert werden. Zeitzauber verlangsamt Objekte acht Sekunden lang, Rettungsschirm schützt vor einem Fehler und Aufräum-Wirbel entfernt ausschließlich Ablenkungen. Die Leveluhr wird durch diese Fähigkeiten nicht verlängert.

Spielregeln werden getrennt von Darstellung und Eingaben überprüft. Die Audio-Komponente erzeugt Musik und Effekte lokal und öffnet ihren AudioContext erst nach einer Nutzeraktion. Mit eingeschaltetem Ton startet die Musik beim Spielen. Study verwendet Zupfklänge mit 100 BPM, Gaming einen Marimba-Groove mit 116 BPM und Sleep eine Spieluhr mit 80 BPM. Master folgt musikalisch dem aktuellen Kontext. Die Stimmenzahl ist auf 32 begrenzt; Pause stoppt geplante Musiknoten und Stummschalten räumt alle Stimmen auf.

## Beispiel für Weiterentwicklung: vier Wochen

Die vorhandene Grundlage umfasst Spielablauf, Kontextregeln, Fortschritt, Oberfläche und lokale Paketierung. Der folgende Plan zeigt mögliche nächste Iterationen auf dieser Grundlage. Beginn und Umfang lassen sich an einen tatsächlichen Semesterplan anpassen.

| Woche | Fokus | Reviewbares Ergebnis |
| --- | --- | --- |
| 1 | Verständlichkeit und Zugänglichkeit | Feedback zu Tutorial, Symbolen, Kontrasten und Bedienung; priorisierte Verbesserungen |
| 2 | Spielbalance mit Testpersonen | Nachvollziehbare Anpassungen an Tempo, Herzen, Münzverdienst und Fähigkeiten |
| 3 | Inhalte und Gestaltung | Zusätzliche Objekte, Skins und audiovisuelle Varianten nach Tests |
| 4 | Abnahme und Präsentation | Geprüfter Browser-Build, vollständiges ZIP und dokumentierte Demonstration |

```mermaid
gantt
    title Beispielplanung für weitere Iterationen – Termine anpassbar
    dateFormat YYYY-MM-DD
    axisFormat %d.%m.
    section Woche 1
    Tutorial und Zugänglichkeit prüfen :a1, 2026-10-19, 7d
    section Woche 2
    Testpersonen und Spielbalance :a2, after a1, 7d
    section Woche 3
    Inhalte und Gestaltung verbessern :a3, after a2, 7d
    section Woche 4
    Abnahme und Präsentation :a4, after a3, 7d
```

Pro Iteration: konkrete Änderung festlegen, Regeln prüfen, Browser- und Touch-Bedienung überprüfen, neu bauen und paketieren und anschließend das Ergebnis gemeinsam bewerten. Die Zeitplanblöcke beschreiben mögliche zukünftige Arbeit; sie behaupten keine bereits durchgeführten Nutzertests.
