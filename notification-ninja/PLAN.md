# Notification Ninja: Ablauf und Weiterentwicklung

Diese Übersicht dokumentiert den Spielablauf und ordnet die technischen Aufgaben. Der Zeitplan am Ende ist ein **anpassbares Beispiel für Weiterentwicklung**. Seine Daten sind keine vereinbarte Projektfrist.

## Ablauf der Bildschirme

```mermaid
flowchart TD
    Home[Startmenü] --> Limit[Modus und Gaming-Limit: 45 / 60 / 90 Sekunden]
    Limit --> Tutorial[Tutorial: Schneiden und Signale unterscheiden]
    Home --> Skins[Skins und lokale Münzen]
    Home --> Scores[Lokale Highscores]
    Skins --> Home
    Scores --> Home
    Tutorial --> Study[Study: 75 Sekunden]
    Study --> Gaming[Gaming: vorher gewähltes Zeitfenster]
    Gaming --> Decision{Das Limit ist erreicht}
    Decision -->|Bewusst stoppen| Sleep[Sleep: 75 Sekunden]
    Decision -->|Weiterspielen| Extra[Zusätzliche Gaming-Zeit]
    Extra --> ExtraStop[Verlängerung endet: Score sichern]
    ExtraStop --> Sleep
    Sleep --> SleepChoice{Ab acht Sekunden: eigene Entscheidung}
    SleepChoice -->|Zur Ruhe kommen| Master[Master: 90 Sekunden]
    SleepChoice -->|Bonusjagd| SleepBonus[Weiter spielen bis zum Ende der Phase]
    SleepBonus --> Master
    Master --> Context{Kontext wechselt}
    Context -->|Study / Gaming / Sleep| Master
    Master --> End[Ergebnis: Score und Münzen]
    Study -->|Keine Leben mehr| End
    Gaming -->|Keine Leben mehr| End
    Extra -->|Keine Leben mehr| End
    Sleep -->|Keine Leben mehr| End
    SleepBonus -->|Keine Leben mehr| End
    End --> Home
```

Die Phase bestimmt, welche Nachrichten helfen und welche ablenken. Gaming- und Schlafentscheidungen werden über sichtbare Schaltflächen getroffen. Pause unterbricht die laufende Simulation; Musik wird dabei ebenfalls angehalten.

## Vier technische Systeme

| System | Aufgabe | Prüffrage |
| --- | --- | --- |
| Engine | Nachrichten bewegen, Wischsegmente erfassen und Treffer bestimmen | Schneidet die tatsächliche Bewegung die Nachricht, auch bei schnellen Wischbewegungen? |
| Context | Nachrichten im aktuellen Lern-, Gaming- oder Schlafkontext bewerten | Ändert sich die Bewertung derselben Nachricht beim Kontextwechsel? |
| Balance | Leben, Combo, Flow, Power-ups und Zeitentscheidungen berechnen | Bleiben Effekte zeitlich begrenzt und Entscheidungen wirksam? |
| Progression | Score, Münzen, Skins und Highscores lokal verwalten | Werden Belohnungen korrekt vergeben und nach erneutem Öffnen wiederhergestellt? |

```mermaid
flowchart LR
    Input[Maus und Touch] --> Engine[Engine: Bewegung und Schnittprüfung]
    Engine --> Context[Context: relevant oder ablenkend]
    Context --> Balance[Balance: Leben / Combo / Flow / Power-ups]
    Balance --> Progression[Progression: Score / Münzen / Skins]
    Balance --> View[Oberfläche und Effekte]
    Balance --> Sound[Optionales WebAudio]
    Progression --> Storage[Lokaler Browserspeicher]
    Storage --> Progression
```

Spielregeln werden getrennt von Darstellung und Eingaben überprüft. Die Audio-Komponente erzeugt Musik und Effekte lokal, bleibt standardmäßig aus und öffnet ihren AudioContext erst nach einer Nutzeraktion. Ihre Stimmenzahl ist begrenzt; Pause stoppt geplante Musiknoten.

## Beispiel für Weiterentwicklung: vier Wochen

Die vorhandene Grundlage umfasst Spielablauf, Kontextregeln, Fortschritt, Oberfläche und lokale Paketierung. Der folgende Plan zeigt mögliche nächste Iterationen auf dieser Grundlage. Beginn und Umfang lassen sich an einen tatsächlichen Semesterplan anpassen.

| Woche | Fokus | Reviewbares Ergebnis |
| --- | --- | --- |
| 1 | Verständlichkeit und Zugänglichkeit | Feedback zu Tutorial, Symbolen, Kontrasten und Bedienung; priorisierte Verbesserungen |
| 2 | Spielbalance mit Testpersonen | Nachvollziehbare Anpassungen an Spawnrate, Leben, Combo und Zeitfenstern |
| 3 | Inhalte und Gestaltung | Zusätzliche Nachrichten, Skins und audiovisuelle Varianten nach Tests |
| 4 | Abnahme und Präsentation | Geprüfter Browser-Build, vollständiges ZIP und dokumentierte Demonstration |

```mermaid
gantt
    title Beispielplanung für weitere Iterationen – Termine anpassbar
    dateFormat YYYY-MM-DD
    axisFormat %d.%m.
    section Woche 1
    Tutorial und Zugänglichkeit prüfen :a1, 2026-10-12, 7d
    section Woche 2
    Testpersonen und Spielbalance :a2, after a1, 7d
    section Woche 3
    Inhalte und Gestaltung verbessern :a3, after a2, 7d
    section Woche 4
    Abnahme und Präsentation :a4, after a3, 7d
```

Pro Iteration: konkrete Änderung festlegen, Regeln prüfen, Browser- und Touch-Bedienung überprüfen, neu bauen und paketieren und anschließend das Ergebnis gemeinsam bewerten. Die Zeitplanblöcke beschreiben mögliche zukünftige Arbeit; sie behaupten keine bereits durchgeführten Nutzertests.
