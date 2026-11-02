# Kontextmatrix

Maßgeblich ist `src/game.js:CONTENT`: stabile ID, Label, Darstellung, Erklärung und Bewertung pro Kontext. Die tatsächlichen Raumpools verwenden passende Teilmengen. Vor der Runde nennt NIM das Ziel und Beispiele; Kontextwechsel im Master werden angekündigt und warten bis das Spielfeld leer ist. Optionale Bonusobjekte kosten beim Durchlassen kein Herz.

| Objekt | Lernen | Gaming | Schlafen | Begründung |
|---|---|---|---|---|
| STREAK (`streak`) | Wegwischen | Wegwischen | Wegwischen | Deine Serie wartet. Öffne den Feed! |
| AUFTRAG (`urgent-school`) | Durchlassen | Durchlassen | Wegwischen | Der Gruppenauftrag braucht deine Rückmeldung. |
| LERNHEFT (`homework`) | Durchlassen | Wegwischen | Wegwischen | Eine neue Aufgabe – heute ist noch Zeit. |
| STIFTE (`pencil`) | Durchlassen | Wegwischen | Wegwischen | Deine Schulsachen helfen dir beim Lernen. |
| SPIELTIPP (`gameclip`) | Wegwischen | Durchlassen | Wegwischen | Ein Spieltipp für deine nächste Runde. |
| DEIN TEAM (`gaming-invite`) | Wegwischen | Durchlassen | Wegwischen | Dein Team ist bereit für die nächste Runde. |
| TROPHÄE (`loot`) | Wegwischen | Durchlassen | Wegwischen | Eine gemeinsam erspielte Trophäe für deine Sammlung. |
| WERBUNG (`ad`) | Wegwischen | Wegwischen | Wegwischen | Ein angeblich einmaliges Angebot kann warten. |
| AUTOPLAY (`autoplay`) | Wegwischen | Wegwischen | Wegwischen | Das nächste Video startet, obwohl du etwas anderes vorhast. |
| TRINKPAUSE (`break`) | Durchlassen | Durchlassen | Durchlassen | Trinken, durchatmen, eine Sache nach der anderen. |
| KISSEN (`quiet`) | Wegwischen | Wegwischen | Durchlassen | Die Schlafenszeit-Erinnerung darf bleiben. |
| TEDDY (`teddy`) | Wegwischen | Wegwischen | Durchlassen | Gemütlich werden und ohne Bildschirm zur Ruhe kommen. |
| GUTE NACHT (`moon`) | Wegwischen | Wegwischen | Durchlassen | Ein ruhiges Abendritual hilft dir beim Einschlafen. |
| KLICK-KÖDER (`scary-lure`) | Wegwischen | Wegwischen | Wegwischen | Künstliche Dringlichkeit: Jetzt sofort klicken! |
| WARNUNG (`safety`) | Durchlassen | Durchlassen | Durchlassen | Eine wichtige Sicherheitsmeldung behalten. |
| UPDATE (`update`) | Wegwischen | Wegwischen | Wegwischen | Kein Notfall. Dieses Update kann warten. |
| MÜNZE +1 (`power-coins`) | Optionales Bonusobjekt | Optionales Bonusobjekt | Optionales Bonusobjekt | Eine seltene Münze für deinen Fähigkeitenbaum. |
| ZEITLUPE (`power-slow`) | Optionales Bonusobjekt | Optionales Bonusobjekt | Optionales Bonusobjekt | 6 Sekunden langsamere Gegenstände, normale Spielzeit. |
| SCHILD (`power-shield`) | Optionales Bonusobjekt | Optionales Bonusobjekt | Optionales Bonusobjekt | Fängt genau einen Fehler ab. |
| PUNKTE ×2 (`power-multiplier`) | Optionales Bonusobjekt | Optionales Bonusobjekt | Optionales Bonusobjekt | 10 Sekunden doppelte Arcade-Punkte. |
