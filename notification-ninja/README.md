# Notification Ninja

Ein buntes, deutschsprachiges Arcade-Spiel über digitale Ablenkung: Wische durch störende Inhalte und lass hilfreiche Dinge passieren. Ein sonniges Klassenzimmer, ein gemütliches Gaming-Zimmer und ein Schlafzimmer bei Mondlicht begleiten deinen Tag. Bücher, Controller, Trinkflaschen, Kissen und andere gezeichnete Objekte passen zur jeweiligen Umgebung.

**[Homepage](https://brukevfh.github.io/REBOOT-Digital-Balance/notification-ninja/home.html)** · **[Im Browser spielen](https://brukevfh.github.io/REBOOT-Digital-Balance/notification-ninja/)** · **[Vollständiges Spiel 1.8.0 herunterladen](downloads/Notification-Ninja-1.8.0.zip)**

## Spielen

Die eigene [Homepage](home.html) erklärt das Spiel und führt mit „Jetzt spielen“ zu deinem Dojo. Sie ist auch im Download enthalten. Der Homepage-Link im Spiel erhält deinen Namen, dein Profil und einen pausierten Run; Abmelden ist eine getrennte Aktion.

Öffne das Spiel in einem aktuellen Browser mit JavaScript. Die Startseite führt dich in dein Dojo. Wähle beim ersten Start einen **Ninja-Namen mit 3–18 Zeichen**. Erlaubt sind Buchstaben, Zahlen, Leerzeichen, `_` und `-`. Dein lokales Spielerprofil braucht kein Passwort und keine E-Mail. Hast du dich abgemeldet, kannst du von der Startseite mit deinem gespeicherten Profil zurückkehren.

Für den Download die **gesamte ZIP-Datei entpacken** und anschließend `index.html` öffnen. Alle Laufzeitdateien gehören zum Paket; eine Engine-Installation ist nicht erforderlich. Falls dein Browser lokale Dateien einschränkt, kannst du den entpackten Ordner über einen lokalen HTTP-Server öffnen.

Die Online-Version speichert ihre Laufzeitdateien nach dem vollständigen ersten Laden für spätere Offline-Aufrufe. Nach deiner ersten Nutzeraktion startet bei eingeschaltetem Ton bereits im Hauptmenü eine **ruhige Dojo-Musik mit 72 BPM**. Über den Lautsprecher-Schalter kannst du sie jederzeit ausschalten. Musik und Effekte entstehen direkt im Browser, ohne externe Audiodateien: verspielte Zupfklänge beim Lernen, ein fröhlicher Marimba-Groove beim Gaming und eine sanfte Spieluhr vor dem Schlafen. Ein Browser kann Ton vor deiner ersten Interaktion blockieren.

## Dein Ninja-Team und die Spielansicht

Unten im Spielfeld steht dein größeres, um die Mitte angeordnetes Ninja-Team: **ein Ninja auf Entspannt, zwei auf Normal und drei auf Profi**. Alle tragen den beim Start des Runs ausgerüsteten Look. Jeder Ninja holt sichtbar aus; der Gegenstand folgt dabei tatsächlich seiner Hand, löst sich beim Wurf und wächst auf dem Weg ins Spielfeld auf seine volle Größe. Während des Ausholens und des kurzen Anflugs sind die Gegenstände vor Schnitten geschützt. Erst nach dieser Phase kannst du sie zerschneiden. So kannst du die Ninjas und ihre Würfe sehen, bevor deine Entscheidung zählt.

Die Spielfläche nutzt den Platz bis zum unteren Bildschirmrand. Eine **schmale rechte Infoleiste** bündelt Zeit, Münzen, Tempo und kompakte Statusanzeigen; für sie ist eigener Platz reserviert. Flugobjekte bleiben im Spielfeld links daneben. Auf großen Bildschirmen ist sie 112 Pixel breit, auf schmalen Mobilbildschirmen 68 Pixel, mit eigenen Zwischen- und Querformatgrößen. Die größere Super-Taste unten links zeigt zusätzlich den Namen ihrer Fähigkeit und ein deutliches Bild.

Die **Super-Taste sitzt separat unten links** und lässt sich mit dem Daumen erreichen. Bei voller Ladung pulsiert sie und zeigt **„SUPER BEREIT!“** an; zusätzlich erscheint beim Bereitwerden ein kurzer Hinweis. Während des Trainings und im Open Run wird sie ausgeblendet. Auf Geräten mit reduzierten Bewegungsanimationen bleibt der Hinweis ohne Pulsieren sichtbar.

Deine **Herzen haben oben einen eigenen Bereich**: große Symbole, ein Zähler wie `4/5` und Umrisse für bereits verlorene Herzen. Beim Herzverlust reagiert die Anzeige kurz; das letzte verbleibende Herz wird zusätzlich hervorgehoben. So erkennst du deine Chancen, ohne die Flugobjekte aus dem Blick zu verlieren.

Das Spiel öffnet **von Anfang an die große Spielansicht**. Beim ersten passenden Klick, etwa zum Spielen, fordert es zusätzlich den nativen Vollbildmodus an. Browser erlauben diesen Aufruf erst durch eine Nutzeraktion. Fehlt die passende API oder lehnt der Browser den Aufruf ab, bleibt die **Große Spielansicht** aktiv. Das gilt auch für Safari-Konfigurationen ohne Webseiten-Vollbild, etwa auf manchen iPhones. Die Ersatzansicht vergrößert die Spielfläche; die eigenen Leisten des Browsers können sichtbar bleiben. Die Ansicht-Taste auf der Startseite und in der Werkzeugleiste benennt den tatsächlich verwendeten Modus und beendet oder öffnet ihn. `Esc` verlässt die große Ersatzansicht; außerhalb dieser Ansicht dient die Taste der Spielpause.

## Dein Dojo, Profil und NIM

Die Dojo-Übersicht bündelt deinen Namen, Münzen, Level, XP-Fortschritt, Ninja-Rang und das nächste Freischaltziel. Über dein Profil kannst du den Namen ändern, Runden und Sammlungen ansehen, Fähigkeiten und Basar öffnen sowie deine Daten als JSON exportieren. In der **Ninja-Garderobe** ziehst du einen bereits gekauften oder durch einen Rang verdienten Look an. Das Profilbild zeigt deine tatsächliche Auswahl; der ausgewählte Ninja wirft die Gegenstände mit einer Wurfanimation ins Spielfeld. Ein neuer Run übernimmt den gewählten Look, ein gespeicherter Run behält seine Ausstattung.

**Abmelden** bringt dich zur Startseite und erhält deinen Fortschritt. **Profil löschen** verlangt zur Bestätigung deinen aktuellen Ninja-Namen und entfernt anschließend die lokalen Notification-Ninja-Daten. Andere Spiele im Repository bleiben erhalten. Falls du Ergebnisse veröffentlicht hast, werden zuerst deine Online-Einträge gelöscht; bei einem Verbindungsfehler bleibt dein lokales Profil erhalten und du kannst die Löschung erneut versuchen. Umbenennen löscht keinen Fortschritt. Die feste Zurück-Schaltfläche führt zur vorherigen Ansicht und ihrer Scrollposition.

Du bekommst **5 XP pro richtiger Entscheidung, 10 XP pro eingesetztem Super und 25 XP pro beendeter Runde**. Diese Werte werden am Run-Ende gesichert; das Training vergibt keine Run-XP. Level und XP entstehen aus deinen gespeicherten Spielstatistiken. Level 2 beginnt bei 100 Gesamt-XP, Level 3 bei 400, Level 4 bei 900; die weiteren Schwellen folgen `100 × (Level − 1)²`. Münzen und XP sind getrennte Werte: Einkaufen verringert dein Level nicht.

Dein Mentor **Meister NIM** ist ein eigener Fuchs-Sensei mit Schal, Ohren und Schweif. Er spricht mit dir in animierten Hinweisfenstern. Er erklärt am Anfang den Einstieg, im Training die Wischbewegung und das Durchlassen und später neue Freischaltungen und Supers. Während einer Erklärung stehen Objekte und Rundenuhr still. Bestätigte Erklärungen werden lokal gemerkt. Das Training lässt sich jederzeit wiederholen; die WISCHEN-/BEHALTEN-Hilfen erscheinen dort weiter.

Die Glocke öffnet deine **Mitteilungen**. Neue Fähigkeiten, Räume, Hintergründe, Skins, Erfolge und erreichte Level werden dort mit passenden Bildern gesammelt. Der Posteingang zeigt nur ungelesene Mitteilungen. „Ansehen“ markiert genau den gewählten Eintrag als gelesen, öffnet seine Sammlung und blendet ihn dauerhaft aus dem Posteingang aus – auch nach Zurückgehen und Neuladen. „Alle als gelesen markieren“ bleibt als Sammelaktion verfügbar. Freischaltungen und noch nicht abgeholte Münzbelohnungen bleiben erhalten. Das lokale Postfach hält bis zu 50 Mitteilungen bereit. Freischaltmitteilungen erscheinen innerhalb des Spiels und benötigen keine Browser-Push-Berechtigung.

### Ninja-Ränge und verdiente Outfits

Dein Rang wächst mit den bereits gesicherten Gesamt-XP. Er kostet keine Münzen und sinkt beim Einkaufen nicht. Bestehende Profile erhalten ihre passenden Ränge und Outfits aus ihrem bisherigen Fortschritt.

| Rang | Gesamt-XP | Neues Rang-Outfit |
| --- | --- | --- |
| Anfänger | 0 | Ninja Mint bleibt der Start-Look |
| Morgenwind | 350 | Morgenwind mit Sonnenaufgangs-Wurfeffekt |
| Schatten-Ninja | 1.500 | Schatten-Ninja mit Schatten-Wurfeffekt |
| Tempelwächter | 4.500 | Nächste Rangstufe |
| Großmeister | 10.000 | Großmeister mit goldenem Wurfeffekt |

Die drei Rang-Outfits werden **verdient und nicht gekauft**. Sie stehen nach dem Freischalten in deiner Garderobe; dein bisher ausgerüsteter Look bleibt ausgewählt, bis du ihn selbst wechselst. Outfits und Wurfeffekte verändern keine Treffer, Herzen oder Geschwindigkeit.

### Drei Tagesmissionen

Im Dojo warten jeden Tag **drei wechselnde Aufgaben** mit Belohnungen von zwei, drei und vier Münzen, zusammen höchstens **neun Münzen pro Tag**. Beispiele sind richtige Entscheidungen, sinnvolle Dinge behalten, eine fehlerfreie Serie oder eine Minute im Open Run. Alle Aufgaben sind im freien Lernzimmer oder Open Run erreichbar. Der Wechsel folgt dem lokalen Kalendertag deines Geräts; offene Tagesbelohnungen solltest du vor dem Tageswechsel abholen.

Fortschritt zählt erst, wenn eine Runde einmalig abgerechnet wurde und mindestens **acht richtige Entscheidungen und 15 aktive Sekunden** erreicht hat. Für einen bewussten Gaming-/Sleep-Stopp reichen acht aktive Sekunden. Training zählt nicht. Geschaffte, noch nicht abgeholte Aufgaben stehen zuerst; die Belohnung kommt erst durch **Münzen abholen** ins Guthaben und kann an diesem Tag nur einmal abgeholt werden. Danach rückt die Karte hinter die offenen Aufgaben.

## Karrierekarte, Autoplay-Bosse und Wochenaufgaben

Die **Karrierekarte** erreichst du direkt aus deinem Dojo. Acht verbundene Missionen führen vom Lernzimmer zu drei Autoplay-Duellen. Die Karte zeigt Voraussetzungen, Fortschritt und offene Belohnungen. Die erste Mission ist kostenlos. Spätere Missionen in Gaming, Sleep und Master setzen die entsprechenden gekauften Räume voraus. Ein erledigtes Ziel öffnet den nächsten Weg; die einmalige Münzbelohnung holst du gesondert ab. Wiederholen zahlt sie nicht erneut aus.

Die drei **Autoplay-Bosse** haben 20, 28 und 36 Trefferpunkte. Jeder richtige Schnitt und jedes bewusst durchgelassene hilfreiche Objekt verursacht einen Treffer. Optionale Power-ups ersetzen keine richtige Entscheidung. Alle Duelle beginnen mit drei Herzen und ohne gekaufte Fähigkeiten oder Supers. Angekündigte Wellen und drei Kontextphasen sorgen für Abwechslung; vor einem Wechsel verlassen die bisherigen Objekte das Feld. Schulsachen, Team-Signale und Ruheobjekte erhalten dadurch ihre zur Situation passende Bedeutung. Der Boss ist besiegt, wenn seine Trefferpunkte auf null fallen. Bei null Herzen kannst du die Mission erneut versuchen. Boss-Ergebnisse werden nicht in die Open-Run-Rangliste übertragen.

Unter **Wochenaufgaben** stehen drei wechselnde Ziele mit abholbaren vier, fünf und sechs Münzen (zusammen höchstens 15 Münzen pro Woche). Erledigst du alle drei, kannst du zusätzlich den Wochenlook abholen. Lotus, Glut und Gezeiten wechseln im Rhythmus von drei Wochen und bringen eigene Verzierungen und Wurfeffekte mit. Sie sind kosmetisch, nicht für Münzen erhältlich und bleiben nach dem Verdienen dauerhaft in deiner Garderobe. Der bisher ausgewählte Look wird nicht automatisch ersetzt. Bereits besessene Wochenlooks können bei einer späteren Wiederkehr nicht doppelt vergeben werden.

Wochen beginnen am **Montag nach dem lokalen Kalender deines Geräts**. Fortschritt zählt aus einmalig abgeschlossenen, ausreichend gespielten Runden; Training zählt nicht. Eine Runde aus der vorigen Woche kann nicht nachträglich für die neue Woche angerechnet werden. Nicht abgeholte Wochenbelohnungen gehören zur jeweiligen Woche; gesicherte Münzen und Outfits bleiben erhalten. Alle neuen Fortschritte werden im bestehenden lokalen Profil gespeichert.

## Open Run – bis zum letzten Herz

Der **Offene Modus / Open Run** ist kostenlos von Anfang an verfügbar und hat **genau einen Modus mit drei Herzen und zwei Ninjas**. Es gibt keine eigene Schwierigkeitsauswahl. Er spielt im Lernkontext: passende Schulsachen und Pausen behalten, Ablenkungen schneiden. Es gibt keinen Rundentimer und keinen Abschluss nach 90 oder 300 Sekunden. Du spielst bis deine Herzen aufgebraucht sind. Pause hält die Zeit und die Objekte an.

Der Einstieg ist langsamer: Das Tempo beginnt bei **0,82×** und die ersten Würfe haben eine berechnete Flugdauer von mehr als fünf Sekunden. Es steigt zunächst behutsam und anschließend stetig weiter, auch nach 90, 300 oder mehr aktiven Sekunden. Es gibt keine feste Tempospitze. Für vergleichbare Runs sind **gekaufte passive Fähigkeiten und ausgerüstete Supers ausgeschaltet**. Die fliegenden Power-ups und Focus Flow gehören weiterhin zum Spiel. Dein Ninja-Look und Hintergrund verändern die Optik. Münzen und XP werden beim Ende durch verbrauchte Herzen wie bei anderen Runs einmalig lokal gesichert; der offene Run zählt als ein Abschnitt mit zehn Spielmünzen Limit und dem Münzfaktor des intern verwendeten Normal-Regelsatzes.

Die gemeinsame Rangliste wertet ausschließlich aktuelle, mit null Herzen beendete Open Runs nach dem einheitlichen Regelsatz **`open-v2`** aus. Eine Übertragung erfolgt erst, wenn du dein Ergebnis ausdrücklich veröffentlichst. Alte Ergebnisse mit anderen Herz- oder Temporegeln werden damit nicht vermischt. Kampagne, Einzelräume und Training zählen nicht für diese Rangliste. Mehr zur verbundenen Online-Rangliste steht unter [Gemeinsame Rangliste](#gemeinsame-rangliste).

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

| Schwierigkeit | Ninjas | Herzen zu Beginn | Münzfaktor | Tempospitze normaler Räume | Spielmünzlimit pro Abschnitt |
| --- | --- | --- | --- | --- | --- |
| Entspannt – Voreinstellung | 1 | 5 | ×1 | ×1,75 | 8 |
| Normal | 2 | 4 | ×1,25 | ×2,25 | 10 |
| Profi | 3 | 3 | ×1,5 | ×2,75 | 12 |

Diese Schwierigkeitsgrade gelten für **Kampagne und Einzelräume**. Wähle sie im Startmenü; Open Run verwendet immer seine eigenen Drei-Herzen-Regeln. **Ein falscher Schnitt und eine durchgelassene Ablenkung kosten jeweils ein Herz.** Beide Fehler unterbrechen deine Combo und erhöhen den Overload-Wert. Ein aktiver Schild fängt genau einen Fehler ab. Hilfreiche Dinge und ausgelassene optionale Bonusobjekte kosten beim Durchlassen kein Herz.

Die Objekte werden im Verlauf schneller und erscheinen häufiger. Nach 15, 30 und 60 aktiven Sekunden sind die Temposchritte bereits deutlich; normale Räume erreichen nach 90 aktiven Spielsekunden die Tempospitze des Schwierigkeitsgrads. Diese Entwicklung läuft über die Abschnitte eines Runs hinweg. Im Open Run steigt das Tempo anschließend weiter. Bereits fliegende Objekte behalten ihre Flugbahn. Die Uhr bleibt unverändert: Zeitlupe und Flow verlangsamen die Objekte, nicht die Levelzeit. Pause hält Simulation, Effekte und Uhr an.

### Abwechslung und Boni

In jedem Level beginnt nach jeweils 20 aktiven Bonussekunden eine sechssekündige Phase. Beim Kontextwechsel wartet diese Bonusuhr, bis die bisherigen Objekte das Feld verlassen haben. Drei Phasen wechseln sich ab:

- **Münzregen:** mehr fliegende Münzen und doppelte während der Phase erspielte Münzen.
- **Combo-Party:** doppelte Arcade-Punkte.
- **Fokus-Welle:** mehr Ablenkungen zum Schneiden.

Sammle Münzen durch Wischen ein; du musst sie nicht erwischen, um deine Herzen zu behalten. Jede Phase hat eigene visuelle Hinweise.

Fünf richtige Entscheidungen in Folge aktivieren den **Flow-Modus**. Seine Grunddauer beträgt fünf Sekunden. Fliegende Power-ups verleihen sechs Sekunden Zeitlupe, einen Schild gegen den nächsten Fehler oder zehn Sekunden doppelte Arcade-Punkte. Kombos, Boni, Fähigkeiten und abgeschlossene Levels bekommen eigene Animationen und kurze Klangfolgen.

Bei **10, 25 und 50 richtigen Entscheidungen ohne Fehler** gibt es zusätzlich eine besondere Ninja-Feier, eigene Soundeffekte und eine große Punkteanzeige. Diese drei Meilensteine bringen **250 / 750 / 2.000 Arcade-Punkte**, jeweils höchstens einmal pro Run. Sie geben keine zusätzlichen Münzen. Sowohl passende Dinge durchzulassen als auch Ablenkungen zu schneiden zählt für diese Entscheidungsserie; optionale Boni ersetzen keine richtige Entscheidung. Ein Fehler unterbricht die Serie. Erreichte Meilensteine werden mit dem Run gespeichert, damit Fortsetzen dieselbe Belohnung nicht erneut auslöst.

Die Kulisse verändert sich mit der aktiven Run-Zeit: **nach 30 Sekunden ziehen Wolken auf, nach 60 erscheint ein Ninja-Tempel, nach 120 leuchten seine Lichter und nach 180 setzt Blütenwind ein**. Die Entwicklung bleibt im Hintergrund und verdeckt keine Ziele. Pause hält auch diese Entwicklung an. Bei reduzierten Bewegungsanimationen bleiben die Motive ruhiger.

Nach jeder Runde zeigt **NIM einen kurzen Lernmoment**. Wenn du einen Fehler gemacht hast, erklärt er passend zum zuletzt verfehlten Gegenstand und dessen damaligem Kontext, warum etwa Autoplay beim Lernen oder künstliche Dringlichkeit vor dem Schlafen stören kann. Ohne solchen Fehler folgt ein passender allgemeiner Tipp.

## Zimmerkarte und Ninja-Basar

Die Zimmerkarte zeigt dir freigeschaltete Räume und das nächste Ziel. Käufe kosten erspielte Münzen und setzen den vorherigen Raum voraus:

| Raum | Preis | Voraussetzung |
| --- | --- | --- |
| Schulzimmer – Study | Kostenlos | Von Anfang an verfügbar |
| Gaming-Zimmer | 80 Münzen | Schulzimmer |
| Schlafzimmer – Sleep | 180 Münzen | Gaming-Zimmer |
| Balance Master | 320 Münzen | Schlafzimmer |

Endet deine Kampagne vor einem noch gesperrten Raum, wird der bisherige Run abgeschlossen und einmalig abgerechnet. Kaufe den nächsten Raum im Basar und starte eine neue Kampagne oder wähle auf der Karte einen offenen Einzelraum. Ein Kauf schaltet einen Raum dauerhaft für dieses lokale Profil frei und startet keine Runde. Die Teilkampagne vor einem gesperrten Raum zählt nicht als vollständiger Abschluss für **Balance-Meister** oder **Profi-Ninja**.

Im **Ninja-Basar** gibt es Bereiche für Räume, Hintergründe und Skins. Die drei Grundkulissen **Sonniges Klassenzimmer**, **Gemütliche Gaming-Ecke** und **Sternen-Schlafzimmer** gehören bereits zum Spiel; mit dem passenden Raum werden sie nutzbar. Zusätzliche Hintergründe haben eigene Motive und können erst gekauft werden, wenn der passende Raum offen ist:

| Hintergrund | Motiv | Raum | Preis |
| --- | --- | --- | --- |
| Papiergarten | Papierblumen und Origami | Study | 160 Münzen |
| Pixelbucht | Insel, Palmen und Pixelwellen | Gaming | 220 Münzen |
| Mondinseln | Schwebende Wolkeninseln und Mondlicht | Sleep | 280 Münzen |

Nach dem Kauf wählst du den Hintergrund ausdrücklich für den passenden Raum aus; Kaufen und Auswählen sind zwei Schritte. Diese Auswahl wird beim nächsten neuen Run übernommen; ein gespeicherter Run behält seine bisherige Gestaltung. Master verwendet beim Kontextwechsel die jeweilige ausgewählte Kulisse. Die Hintergründe verändern die Darstellung, während die Kontextregeln des Raums gelten. Vier Klingen-Skins haben unterschiedliche Designs, Farbpaletten und Wischspuren; im Basar kannst du sie vor dem Kauf ansehen.

**Ninja Mint** ist kostenlos. Die weiteren kaufbaren Looks kosten **Solar Slice 80**, **Arctic Focus 180** und **Violet Flow 320 Münzen**. Nach dem Kauf stehen sie auch in deiner Profil-Garderobe bereit. Dazu kommen die drei durch Ninja-Ränge verdienten Outfits Morgenwind, Schatten-Ninja und Großmeister; sie haben eigene Wurfeffekte und sind nicht für Münzen erhältlich.

## Münzen, Fähigkeiten und Erfolge

Ohne Fähigkeiten verdienst du eine Münze je **14 richtige Entscheidungen**, eine Münze pro eingesammeltem Münzobjekt und eine Münze bei jeder vollen **25er-Combo**. Mit **Münzgespür** reichen zwölf richtige Entscheidungen. Schwierigkeit, Münzregen und **Goldener Lauf** verändern den Verdienst; Bruchteile werden innerhalb des Runs weitergezählt. Die während eines Abschnitts verdienten Spielmünzen sind auf 8 / 10 / 12 begrenzt. Goldener Lauf erhöht auch diese Abschnittsgrenze um 25 Prozent, abgerundet.

Ein abgeschlossener Run erhält bei mindestens zwölf richtigen Entscheidungen **zwei zusätzliche Abschlussmünzen**; ein bewusster Gaming-/Sleep-Stopp bringt dann eine weitere Münze. Der Abschluss vor einem gesperrten Raum zählt dafür ebenfalls. Bei verbrauchten Herzen gibt es diesen Abschlussbonus nicht. Ein perfekter einzelner Study-Run kann ohne Münzfähigkeiten somit höchstens **10 / 12 / 14 Münzen** auf Entspannt / Normal / Profi sichern. Erfolgsbelohnungen kommen beim ausdrücklichen Abholen hinzu. Bestehendes Guthaben und bereits gekaufte Freischaltungen bleiben trotz der neuen Preise erhalten.

Während des Runs zeigt das Spiel die vorgemerkten Münzen an. Diese werden **am Run-Ende einmalig** deinem Guthaben gutgeschrieben, auch wenn du alle Herzen verlierst. Das erneute Öffnen desselben Ergebnisses zahlt keine zweite Belohnung aus. Ein noch laufender Run kann gespeichert und fortgesetzt werden; seine vorgemerkten Münzen sind noch nicht ausgebbar.

Mit deinem Guthaben kaufst du Räume, Hintergründe, Klingen-Skins oder Knoten im Fähigkeitenbaum. Der **Wurzelbaum beginnt bei NIM in der Mitte** und breitet sich über sichtbare Verbindungen aus: Fokus nach oben, Schutz nach rechts und Münzen nach links. Jedes Upgrade hat eine eigene Illustration; beim Antippen erscheinen Wirkung, Voraussetzung und Kaufmöglichkeit. Auf kleinen Bildschirmen lässt sich die Karte seitlich verschieben und über die drei Ast-Schaltflächen gezielt ansehen.

Der Baum hat drei Äste mit je drei Stufen. Die erste Stufe kostet **35 Münzen**, die zweite **90**, die dritte **180**. Innerhalb eines Astes brauchst du jeweils die vorherige Stufe; jeder Knoten wird nur einmal gekauft. Gekaufte Knoten bleiben als kleine verbundene Markierungen sichtbar. Ihre vollständigen Karten und die Super-Auswahl stehen gesammelt unter dem Baum, damit die noch offenen Wege leichter erkennbar sind.

| Ast | Stufe 1 – 35 Münzen | Stufe 2 – 90 Münzen | Stufe 3 – 180 Münzen |
| --- | --- | --- | --- |
| Fokus | **Klarer Kopf:** +2 Superladung pro richtiger Entscheidung | **Zeitzauber:** acht Sekunden langsamere Objekte | **Flow-Meister:** Flow dauert zwei Sekunden länger |
| Verteidigung | **Gut vorbereitet:** Run mit einem Schild beginnen | **Rettungsschirm:** den nächsten Fehler abfangen | **Zweite Chance:** einmal pro Run nach dem letzten verlorenen Herz mit einem Herz weiterspielen |
| Münzen & Combo | **Münzgespür:** eine Münze je zwölf statt 14 richtige Entscheidungen | **Aufräum-Wirbel:** alle sichtbaren Ablenkungen schneiden | **Goldener Lauf:** 25 Prozent mehr Spielmünzen |

Rüste **eine** freigeschaltete Superfähigkeit aus. Jede richtige Entscheidung füllt ihre Anzeige um acht Prozentpunkte, mit **Klarer Kopf** um zehn. Ein Sweep lädt sich durch seine eigenen Treffer nicht erneut auf. Bei **100 Prozent** kannst du sie über die Super-Schaltfläche oder mit der **Leertaste** einsetzen; anschließend muss sie erneut aufgeladen werden. Der Sweep trifft ausschließlich Ablenkungen. Hilfreiche Inhalte bleiben bestehen.

Gekaufte passive Fähigkeiten und die ausgewählte Superfähigkeit werden **beim Start eines neuen normalen Runs** übernommen. Ein gespeicherter Run behält seine beim Start gewählte Ausstattung. So ändern Käufe während einer Pause nicht nachträglich die laufende Runde. Im Open Run gelten die einheitlichen Grundregeln ohne gekaufte Fähigkeiten und Supers.

Im Erfolgsmenü stehen **geschaffte Erfolge mit noch abholbaren Münzen ganz oben**, danach folgen offene Ziele und schließlich die bereits abgeholte Sammlung. Die abholbaren Belohnungen bleiben oben, bis du sie einsammelst; der Erfolgszugang im Dojo hebt ausstehende Münzen zusätzlich hervor. Alle **24 Erfolge** haben eigene Bildabzeichen und eine Fortschrittsanzeige. Du kannst ihre Münzbelohnung **jeweils einmal abholen**. Freischalten und Abholen sind getrennte Schritte. Abgeholte Belohnungen bleiben als abgeholt gespeichert und rücken nach unten.

| Erfolg | Bedingung | Münzen |
| --- | --- | --- |
| Erster Wischer | Erste Ablenkung schneiden | 3 |
| Im Flow | Zum ersten Mal Flow aktivieren | 3 |
| Mit Köpfchen | Einen Abschnitt ohne Entscheidungsfehler abschließen | 4 |
| Meine Grenze | Gaming oder Sleep bewusst per Stopp beenden | 4 |
| Balance-Meister | Kampagne oder Master abschließen | 10 |
| Zehner-Serie | Combo 10 erreichen | 3 |
| Unaufhaltsam | Combo 25 erreichen | 5 |
| Münzsammler | Insgesamt 100 Münzen verdienen; Ausgeben ist erlaubt | 5 |
| Gute Instinkte | Insgesamt 250 richtige Entscheidungen treffen | 6 |
| Profi-Ninja | Einen normalen Run auf Profi abschließen | 8 |
| Superkraft! | Ersten Super einsetzen | 4 |
| Mein eigener Weg | Erste Fähigkeit kaufen | 3 |
| Tausend klare Momente | Insgesamt 1.000 richtige Entscheidungen treffen | 10 |
| Instinkt-Legende | Insgesamt 2.500 richtige Entscheidungen treffen | 20 |
| Perfekte Welle | Combo 50 erreichen | 8 |
| Wisch-Legende | Combo 75 erreichen | 15 |
| Wieder am Start | Zehn gewertete Runden beenden | 5 |
| Ninja-Routine | 25 gewertete Runden beenden | 10 |
| Super-Profi | Insgesamt 25 Supers einsetzen | 8 |
| Super-Legende | Insgesamt 100 Supers einsetzen | 20 |
| Profi-Serie | Fünf normale Runs auf Profi abschließen | 10 |
| Profi-Legende | 20 normale Runs auf Profi abschließen | 20 |
| Goldener Vorrat | Insgesamt 500 Münzen verdienen; Ausgeben ist erlaubt | 10 |
| Goldene Legende | Insgesamt 1.500 Münzen verdienen; Ausgeben ist erlaubt | 20 |

Arcade-Punktzahl und Balance-Wertung werden getrennt angezeigt; lokale Highscores, Münzen, Erfolge, Fähigkeiten, Räume, Hintergründe und vier Klingen-Skins bleiben auf deinem Gerät.

Alle Benachrichtigungen, Boni und Münzen sind Spielsimulationen. Es gibt keine echten Käufe oder Gewinne. Das Spiel vermittelt Aufmerksamkeitsauswahl, Kontextbewusstsein und selbst gewählte Grenzen bei digitalen Medien.

## Steuerung

| Eingabe | Aktion |
| --- | --- |
| Maus mit gedrückter Taste | Durch Ablenkungen, Münzen und gewünschte Power-ups ziehen |
| Ein Finger auf der Spielfläche | Durch dieselben Objekte wischen |
| Super-Schaltfläche / Leertaste | Ausgerüstete Superfähigkeit bei voller Ladung einsetzen |
| Pause-, Sound- und Entscheidungstasten | Pause, Musik und bewusste Zeitentscheidungen bedienen |
| Vollbild-/Ansicht-Taste | Nativen Vollbildmodus oder große Spielansicht öffnen und wieder verlassen |
| `Esc` | Große Ersatzansicht verlassen; ansonsten Spielpause bedienen |
| Zurück-Schaltfläche / Browser-Zurück | Zur vorherigen Ansicht und ihrer Scrollposition zurückkehren |

Hilfreiche Dinge unberührt passieren lassen. Ein Schnitt folgt deiner tatsächlichen Wischbewegung. Im Tutorial lernst du den Unterschied zwischen Ablenkung und hilfreichem Signal.

Beim Rückweg ins Dojo oder zur Ergebnisansicht werden Kamerawackeln und temporäre Spieleffekte zurückgesetzt. Trefferfeedback bleibt auf die aktive Runde beschränkt.

## Daten und Offline-Nutzung

Dein Ninja-Profil ist ein **lokales Spielerprofil** mit Nutzername. Name, Fortschritt, bestätigte NIM-Hinweise, Mitteilungen und Einstellungen liegen in **localStorage**. Es gibt kein Passwortkonto mit Wiederherstellung oder Gerätesynchronisierung. Ein anderer Browser oder ein anderes Gerät hat einen eigenen Spielstand. Ergebnisse werden erst durch ausdrückliches Veröffentlichen an die gemeinsame Rangliste gesendet; Münzen und Profil-XP bleiben lokal. Wenn dein Browser die Speicherung blockiert, bleibt das Spiel für die laufende Sitzung spielbar; Ergebnisse werden dann nicht online veröffentlicht. Das Löschen der Website-Daten entfernt den lokalen Fortschritt.

Online-Version, lokale HTTP-Version und direkt geöffnete Dateien können getrennte Speicherplätze verwenden. Die lokale Dateinutzung kann von den Browser-Einstellungen abhängen. Ältere Spielstände behalten ihr vorhandenes Guthaben, ihre Skins, Erfolge und Freischaltungen. Fehlt ein Ninja-Name, ergänzt du ihn beim Einstieg; Level und XP werden aus den bisherigen gespeicherten Statistiken berechnet. Bereits gespeicherte ältere Runs lassen sich fortsetzen; für neue Runs gelten die Raumfreischaltungen.

Ältere vollständige Downloads bleiben verfügbar: [Version 1.7.0](downloads/Notification-Ninja-1.7.0.zip), [Version 1.6.0](downloads/Notification-Ninja-1.6.0.zip), [Version 1.5.0](downloads/Notification-Ninja-1.5.0.zip), [Version 1.4.0](downloads/Notification-Ninja-1.4.0.zip), [Version 1.3.0](downloads/Notification-Ninja-1.3.0.zip), [Version 1.2.0](downloads/Notification-Ninja-1.2.0.zip), [Version 1.1.0](downloads/Notification-Ninja-1.1.0.zip) und [Version 1.0.0](downloads/Notification-Ninja-1.0.0.zip).

## Gemeinsame Rangliste

Die öffentliche Rangliste ist für die GitHub-Pages-Spielseite freigegeben. Lokal geöffnete Downloads verwenden eine andere Browser-Herkunft und können dort keine Ergebnisse veröffentlichen; ihre lokalen Rekorde funktionieren weiterhin.

Die gemeinsame Open-Run-Rangliste ist mit **[notification-ninja-ranking.onrender.com](https://notification-ninja-ranking.onrender.com)** verbunden. `leaderboard-config.json` enthält `enabled: true` und diese HTTPS-Adresse als Endpunkt. Öffne im Dojo **Rangliste** und veröffentliche einen beendeten Open Run ausdrücklich über die dortige Schaltfläche. Es gibt eine gemeinsame Wertung für die aktuellen Drei-Herzen-Regeln. Ohne Veröffentlichung erscheint dein Ergebnis nur lokal. Ein leeres Ranking bleibt leer; es gibt keine erfundenen Mitspieler. Das Spiel und die lokalen Highscores funktionieren auch bei fehlender Verbindung.

Der Server läuft als kostenlose Render-Demo. Nach einer inaktiven Phase kann der erste Zugriff etwa eine Minute dauern; warte kurz und aktualisiere die Rangliste erneut. **Bei diesem Free-Dienst geht die SQLite-Rangliste beim Einschlafen, Neustart oder Deployment verloren**; deine lokalen Münzen und Freischaltungen bleiben erhalten. Ein neuer ausdrücklich veröffentlichter Run kann danach wieder einen Ranglisteneintrag anlegen. Dauerhafte Online-Highscores brauchen einen beständigen Server-Datenträger. Die Vorlage [`render.yaml`](../render.yaml) und [server/README_NINJA.md](../server/README_NINJA.md) dokumentieren Betrieb, erneute Einrichtung und Grenzen des Dienstes.

Verglichen werden ausschließlich **ausdrücklich veröffentlichte, durch null Herzen beendete Open Runs mit `ruleset: "open-v2"`**. Die API verwendet dafür `/v2/leaderboard` und `/v2/runs`. Frühere Server-Einträge bleiben bei einer Datenbankmigration als `legacy` erhalten und zählen nicht in der neuen Wertung. Ältere gespeicherte Runs dürfen lokal fortgesetzt werden, erhalten dadurch aber keine Zulassung zur neuen Rangliste. Die Übertragung enthält Ninja-Name, Punkte, den einheitlichen internen Schwierigkeitswert, Regelsatz, Zeit und grundlegende Run-Werte. Münzen, Profil-XP, E-Mail-Adressen und Passwörter werden nicht übertragen. Eine zufällige Gerätekennung erlaubt, eigene Einträge beim Profil-Löschen zu entfernen; Abmelden erhält diese Kennung. Das ist kein Online-Konto mit Wiederherstellung oder Synchronisierung. Die serverseitige Plausibilitätsprüfung macht die im Browser berechneten Ergebnisse nicht zu einer manipulationssicheren Turnierrangliste.

## Entwicklung

Voraussetzungen: **Node.js 24**, npm und **Python 3**. Node 24 bringt das SQLite-Modul für die Ranglistentests mit. Im Repository-Root ausführen:

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
├── home.html                 # Eigene Homepage, ohne Spielstart oder Profiländerung
├── index.html, styles.css     # Startmenü, HUD und Dialoge
├── src/game.js               # Regeln, Kontextwechsel und Spielstände
├── src/progression.js        # Schwierigkeit, Räume, Shop, Fähigkeiten und Erfolge
├── src/player.js             # Lokaler Name, abgeleitete XP, Hinweise und Mitteilungen
├── src/journey.js            # XP-Ränge, verdiente Outfits und drei Tagesmissionen
├── src/adventure.js          # Karrierekarte, Wochenaufgaben und ausdrückliche Belohnungen
├── src/boss.js               # Drei Autoplay-Bosse und ihre Wellenzustände
├── src/mentor.js             # NIM-Dialoge, Erkläranimationen und Fokussteuerung
├── src/art.js                # Eigene Upgrade-, Erfolgs- und Dojo-Illustrationen
├── src/local-profile.js      # Lokale Anmeldung und Profil-Löschung
├── src/leaderboard.js        # Optionale Ranglistenverbindung und Gerätekennung
├── src/throwers.js           # Gemeinsame Ninja-Positionen, Handbewegung und Wurfphasen
├── src/fullscreen.js         # Browser-Vollbild und große Ersatzansicht
├── src/renderer.js           # Canvas-Grafik, Schnitte und Effekte
├── src/audio.js              # Lokaler WebAudio-Soundtrack
├── src/main.js               # Maus, Touch und Bildschirmablauf
├── dist/                     # Fertiges JavaScript-Bundle
├── downloads/                # Vollständiges ZIP und Prüfsumme
├── sw.js                     # Offline-Cache für diesen Spielpfad
├── leaderboard-config.json   # HTTPS-Verbindung zur gemeinsamen Open-Run-Rangliste
└── PLAN.md, TEST_REPORT.md    # Ablauf, Beispielplanung und Prüfbericht
```

Build- und Paketierungswerkzeuge liegen unter `../scripts/`, die Regeltests unter `../tests/ninja*.test.mjs`. Der [Prüfbericht](TEST_REPORT.md) nennt die ausgeführten Tests und ihre Grenzen.
