# Notification Ninja – vollständige Spiel- und Seitenabnahme

Prüfdatum der historischen Spielabnahme: **17. November 2026**. Ausgangspunkt ist die veröffentlichte Version **3.12.0** auf `main`. Gespeicherte Ergebnisse wurden am **24. November 2026** abgeglichen und der Abschluss der Zusatzmissionen nachgetragen. Dieser Bericht trennt tatsächlich abgeschlossene Prüfungen, gefundene Produktfehler und noch ausstehende Abschlussnachweise. Die nachfolgende Erweiterung 3.13.0 und ihre eigene Abnahme stehen im [Erweiterungsbericht](EXPANSION_3_13.md).

## Was „durchgespielt“ hier bedeutet

Der Karriere-Durchlauf begann mit einem frischen Gastprofil. Ein automatisierter Spieler benutzte native Mausbewegungen und Schnitte im echten Chromium-Browser; auf 360 Pixeln wurden native Touchgesten eingesetzt. Die Diagnoseansicht wurde ausschließlich gelesen, um sichtbare Objekte und Ergebnisse zu prüfen. Es wurden keine Münzen, freigeschalteten Welten, Missionsabschlüsse oder Siegzustände in den Spielstand geschrieben. Der Spieltakt wurde für diese Browserläufe nicht beschleunigt.

Die Automation kennt die Bedeutung der geworfenen Inhalte. Sie ist damit ein reproduzierbarer Funktionstest und kein Nachweis dafür, wie leicht Jugendliche die Regeln ohne Vorwissen verstehen. Ein behauptetes fehlerfreies menschliches Spielerlebnis lässt sich daraus nicht ableiten.

Die unabhängige Backend-Abnahme verwendet dagegen die öffentliche HTTP-API und servergeprüfte Eingabeprotokolle mit einer ausdrücklich synthetischen Testuhr. Sie prüft Authentifizierung, Wirtschaft und Persistenz; sie wird nicht als zusätzlicher nativer Browser-Durchlauf gezählt.

## Vollständig abgeschlossene Hauptkarriere

**Tutorial und alle 18 Hauptmissionen bestanden auf 1280 × 900 Pixeln.** Die sechs Tutorialentscheidungen enthielten vier echte Schnitte und zwei bewusst durchgelassene hilfreiche Inhalte. Danach wurden alle Missionen über ihre tatsächlich freigegebenen Startbuttons begonnen und ihre Erstabschlussbelohnungen ausdrücklich abgeholt.

| Kapitel | Tatsächlich abgeschlossene Missionen | Richtige Entscheidungen | Fehler | Kontostand des Gastprofils nach dem Kapitel |
|---|---|---:|---:|---:|
| Lernen | `study-01`, `study-02`, `study-03`, `study-04`, `study-05`, `study-06` | 162 | 3 | 64 Münzen |
| Gaming | `gaming-01`, `gaming-02`, `gaming-03`, `gaming-04`, `gaming-05`, `gaming-06` | 180 | 0 | 135 Münzen |
| Schlafen | `sleep-01`, `sleep-02`, `sleep-03`, `sleep-04`, `sleep-05`, `sleep-06` | 142 | 0 | 199 Münzen |

Die tatsächlichen Ergebnisse ergeben insgesamt **484 richtige Entscheidungen**, **18 abgeschlossene gewertete Runden** und **199 erspielte Münzen**, einschließlich der ausdrücklich abgeholten Missionsbelohnungen. Gaming und Schlafen wurden durch Kapitelabschlüsse freigeschaltet. Es wurden keine Räume zum Test freigeschrieben.

Nach jedem der drei Kapitel wurde die Seite neu geladen und geprüft, dass Abschlüsse, abgeholte Belohnungen, Guthaben und Weltzugänge erhalten bleiben. Die letzte Schlafmission wurde über das vorgesehene bewusste Beenden nach 30 aktiven Sekunden abgeschlossen. Ein erneutes Abholen der Erstabschlussbelohnungen wurde nicht ermöglicht.

Der Durchlauf begann auf 3.12.0. Zwischen Kapitel-Neuladungen konnten bereits die unabhängig korrigierten UI-Dateien geladen werden; Spielphysik, Missionsbedingungen und Wirtschaft blieben dabei unverändert. Für jede Mission wurden Ergebnis und Screenshot aufgezeichnet.

## Alle acht Zusatzherausforderungen abgeschlossen

Vom tatsächlich erspielten Hauptkarriere-Spielstand aus wurden auch **alle acht Zusatzherausforderungen mit nativen Mauseingaben** abgeschlossen und ihre Erstabschlussbelohnungen abgeholt: Der erste Fokus, die Open-Run-Prüfung, Chaos-Sensei, Deine Grenze zählt, Nachtruhe beschützen, Glitch-Shogun, Alle Welten im Griff und Albtraum-Oni. Alle drei Einzelbosse durchliefen jeweils drei beobachtete Phasen.

Die Aufzeichnungen enthalten zusammen **308 richtige Entscheidungen**. Die Open-Run-Prüfung endete mit drei echten Herzverlusten; dies erfüllte ihre Abschlussbedingung. In Balance Master wurde zusätzlich ein Fehler von einem tatsächlich gesammelten Schild abgefangen. Nach Abschluss waren alle **26 Karriereaufgaben abgeschlossen und ihre Belohnungen abgeholt**; das Gastguthaben betrug 56 Münzen.

Die drei sichtbaren Tagesziele zahlten ausdrücklich einmalig 2, 3 und 4 Münzen aus: 328 → 337. Erneutes Abholen erhöhte den Wert nicht. Balance Master wurde anschließend für den echten Preis von 320 Münzen freigeschaltet: 337 → 17. Der Spielstand wurde nicht zur Finanzierung verändert.

Dies war ein fortgesetzter Durchlauf mit erhaltenen Zwischenständen. Nach der bereits abgeschlossenen ersten Zusatzmission blockierte NIMs Erklärung den Claim-Klick des Prüfscripts. Später traf ein nicht eindeutiger Prüfselektor den Weltkauf. Die Prüfroutine wurde korrigiert und an den gespeicherten Ergebnissen fortgesetzt. Die abschließende Datei meldet keine JavaScript- oder Prüffehler; die beiden vorherigen Berichte bleiben als Fehlernachweise erhalten. Daraus wird kein durchgehend fehlerfreier erster Automationslauf abgeleitet.

## Tatsächliche Touch-Durchläufe der weiteren Modi

Alle nachfolgenden Browserläufe verwendeten eine Breite von **360 Pixeln** und echte native Touchsequenzen. Pausieren hielt jeweils die aktive Spielzeit an.

| Modus | Nachgewiesener Ablauf und Ergebnis |
|---|---|
| Boss Rush | Alle drei Bosse mit je drei Phasen besiegt: Chaos-Sensei, Glitch-Shogun und Albtraum-Oni. Alle neun Phasen sowie Warnungen und offene Angriffsfenster beobachtet. 98 richtige Entscheidungen, 59 Schnitte, ein verbleibendes gemeinsames Herz, 21.700 Punkte. 218,09 aktive Spielsekunden; 235,47 Sekunden reale Laufzeit einschließlich Bedienung und Pause. |
| Tages-Challenge als Gast | Die ausdrücklich als lokale Tagesübung bezeichnete Runde vollständig über 60 aktive Sekunden gespielt. 34 richtige Entscheidungen, 13 Schnitte, neun tatsächlich gesammelte Power-ups, kein Fehler, drei Herzen und 10.300 Punkte. Dies ist kein Nachweis einer öffentlichen gewerteten Tagesplatzierung. |
| Open Run | Mehr als 90 aktive Sekunden durch echte Entscheidungen überlebt. Danach absichtlich nicht mehr geschnitten, bis drei echte Herzverluste den Lauf beendeten. Kein Countdown oder zeitbedingter Abschluss. Ergebnis: 42 richtige Entscheidungen, 24 Schnitte, 12.000 Punkte, null verbleibende Herzen; Abschluss nach 110,86 aktiven Sekunden. |
| Wischtraining | Erneut über die sichtbaren Einstellungen gestartet und nach sechs Entscheidungen mit vier Schnitten und zwei hilfreichen Durchlässen als gelernt abgeschlossen. Guthaben und gewertete Rundenzahl blieben exakt beim vorherigen Wert von zehn Münzen und einer Runde. |

Der erste Mehrmodi-Prüflauf enthielt nach dem bereits erfolgreichen Boss Rush einen mehrdeutigen Home-Selektor. Ein zunächst zu vorsichtiger Touch-Bot schloss in der Tagesübung tatsächlich schneidbare Ziele aus. Beide Prüfroutinen wurden korrigiert, die echten erfolgreichen Ergebnisse anschließend erneut beziehungsweise getrennt aufgezeichnet. Diese Fehler der Prüfroutine wurden nicht als Produktfehler oder erfolgreiche vollständige Erstläufe ausgegeben.

## Gefundene und im Korrekturstand behobene Produktfehler

| Befund | Auslöser und vorheriges Verhalten | Korrektur |
|---|---|---|
| Unsichtbare Verlassen-Bestätigung | Die Bestätigung existierte im DOM, ihre einzigen Styles lagen aber in einem nicht geladenen älteren Stylesheet. Der native „Im Spiel bleiben“-Button war hinter dem Pausenmenü nicht erreichbar. | Eigene begrenzte Styles im aktuell geladenen Indie-Stylesheet zeigen den Dialog über den Menüs, mit erreichbaren Buttons und bei kleinen Höhen scrollbar. Das alte globale Stylesheet wurde nicht nachgeladen. |
| Escape ließ die Runde hinter der Bestätigung weiterlaufen | Pause → Spiel verlassen → Escape ließ die Bestätigung stehen, während der globale Tastaturhandler die Runde fortsetzte. | Escape wird vom Bestätigungsdialog verarbeitet, schließt ihn als „bleiben“ und stellt den Fokus wieder her. Aus der Pause bleibt die Uhr angehalten. |
| Verlassen aus den Einstellungen umging die Bestätigung | Pause → Einstellungen → Spiel verlassen betrachtete die Einstellungen nicht als laufende Runde. | Der tatsächliche Spielzustand `started && !ended` entscheidet über die Bestätigung, unabhängig vom aktuell geöffneten Menü. |
| Falscher Übungskontext und zusätzliche History-Einträge | Gaming-Lexikon → Gaming-Übung → Browser zurück → vorwärts öffnete Lernen und erhöhte die Navigationstiefe. Antworten und Rückkehrziel gingen verloren. | Übungskontext, begrenzte tatsächliche Antworten und Rückkehrziel werden im Navigationszustand erhalten. Richtige Werte und Feedback werden aus den kanonischen Regeln neu berechnet; Wiederherstellung erzeugt keinen zusätzlichen Eintrag. |
| Jeder normale Klick schrieb die Design-Auswahl erneut | Der Theme-Handler fand beim Aufsteigen im DOM das Zustandsattribut von `<html>`. Zusätzlich erhielt das Dokument eine falsche `aria-pressed`-Semantik. | Auswahl und Markierung sind auf echte Theme-Buttons begrenzt. Normale Navigation schreibt keine Theme-Einstellung; die drei echten Design-Auswahlen funktionieren weiterhin. |
| Tagesmünzen waren nicht erreichbar | Die drei Tagesaufgaben lagen in einem ausgeblendeten historischen Hub-Bereich. Erspielte Belohnungen hatten keinen sichtbaren Abholweg. | Die drei Tagesziele sind auf der bereits vorhandenen Seite **Spielen → Wochenziele** sichtbar. Bestehende Gast- und serverseitige Claim-Aktionen bleiben maßgeblich; keine neue Währung oder zusätzliche Hauptnavigation. UTC-/Gerätekalender wird erklärt. |
| Boss-Energie wurde mit einer festen Zahl richtiger Entscheidungen verwechselt | Die Einführung versprach 20/28/36 richtige Entscheidungen, obwohl die Verteidigung zunächst geöffnet werden muss. Der tatsächliche Boss Rush benötigte 98 richtige Entscheidungen für 84 Energiepunkte. | Einführung nennt Boss-Energie und erklärt Fokus-, Glitch- beziehungsweise Ruhe-Symbole sowie das Angriffsfenster. Ein Kontextwechsel wird als neues Ziel und nicht als neue Runde bezeichnet. |
| Einzelne englische Ansichten enthielten noch deutsche Texte | Erstmalige Profilhilfe, gefilterte leere Rangliste, mehrere MFA-Unterseiten und aufgeklappter Datenschutzbereich der Homepage. | Fehlende Übersetzungen ergänzt; die dynamische Zahl verbleibender MFA-Wiederherstellungscodes besitzt eine passende Übersetzungsregel. |

Die native Prüfung der Navigations- und Dialogkorrekturen ist vom breit angelegten Seitenrundgang getrennt. Der abschließende Prüfstand beider Läufe wird unten festgehalten.

## Umfang der einzelnen Seitenprüfung

Das wiederholbare Seitenskript besucht Ansichten und Unterzustände über echte Navigation und Bedienelemente. Es prüft Deutsch und Englisch, Smartphonebreite 360 und Desktopbreite 1280. Die bisherige englische Ausgangsmatrix enthielt 269 tatsächlich besuchte Zustände; sie fand keine überlaufenden Seiten, zu kleinen Bedienelemente, fehlenden Bilder oder doppelten IDs. Die dort gefundenen fehlenden Übersetzungen wurden zur Korrektur verwendet, nicht als bestandene Endabnahme gezählt.

Die erweiterte Abschlussmatrix umfasst zusätzlich die öffentliche Homepage, aufgeklappten Datenschutz, den direkten Projekt-Anker, alle drei tatsächlichen Homepage-Designwechsel, die sichtbaren Tagesziele und eine gesondert gekennzeichnete Kompatibilitätsansicht für alte Hintergründe.

| Bereich | Zu prüfende Seiten und Unterzustände |
|---|---|
| Einstieg | Homepage, Projekt/Datenschutz, Einstieg als Gast, Anmeldung, Registrierung, Wiederherstellung und verständliche ungültige Eingaben. |
| Hauptnavigation | Übersicht, zusammengefasste Modi/Welten, Karriere, Basar und Rangliste. |
| Welten und Karriere | Alle vier Weltdetails und Schwierigkeitsauswahlen; alle 26 Missionsinspektoren einschließlich gesperrter Voraussetzungen; mobile Details schließen per Button und Escape. |
| Sammlung | Profil und Verwaltungsbereich, Namensänderung, Löschbestätigung, alle neun Fähigkeitsdetails und drei Äste, alle 24 Erfolgskarten, Mitteilungen und persönliche Bestleistungen. |
| Basar | Beide aktuellen Shop-Reiter und alle Filter; alle zwölf Ninja-Looks in drei Kulissen; Angebotsrückkehr; alte gekaufte Hintergründe als bezeichnete Migrationsfixture. |
| Lernbereiche | Zwölf NIM-Situationen jeweils mit Frage, Fehlversuch und richtiger Antwort; Abschluss und Resetbestätigung; drei Lexikonkontexte und vier Filter sowie leere Suche; alle 27 Tastenübungsfragen, ihr Feedback und die drei Abschlüsse. |
| Ziele | Wochenaufgaben, Wochen-Outfit und die jetzt erreichbaren drei Tagesziele; verfügbare, offene und abgeholte Zustände, tatsächlich verdiente Abholung und Erhalt nach Neuladen. |
| Einstellungen | Sprache, drei Designs, Bedienhand, Audio, ruhige Effekte, Kamerawackeln, Hilfe und Trainingswege. |
| Konten | Anmeldung/Registrierung/Recovery, einmaliger Wiederherstellungsschlüssel, Profil, Umbenennen/Löschen, MFA-Einrichtung samt QR, Notfallcodes, zweiter Anmeldefaktor und Deaktivierung sowie Verbindungsfehler. Echte Testkonten werden anschließend gelöscht; sensible Codes werden in Screenshots maskiert. |
| Aktive Runde | Einführung, Wischen/Durchlassen, Pause/Fortsetzen, Ergebnis, Rundenrückblick und dessen kontextbezogene Lernwege sowie Verlassen-Bestätigung aus Pause und Einstellungen. |

„Jede Seite“ bezeichnet diese konkrete Inventarliste und ihre prüfbaren Unterzustände. Es ist kein Versprechen, sämtliche denkbaren Kombinationen aus Browser, Gerät, Netzwerkstörung und Benutzereingabe abgedeckt zu haben.

## Unabhängige Konto-, Wirtschafts- und Persistenzprüfung

**SQLite und PostgreSQL bestanden jeweils die vollständige lokale HTTP-Abnahme mit zwei getrennten Konten.** Beide Adapter wurden über echte getrennte Serverprozesse gestartet und neu gestartet. Die Datenbanken waren ausschließlich isolierte Testdatenbanken.

- Registrierung prüfte Name, E-Mail, Passwortbestätigung und Datenschutz-Zustimmung. Identität und private Daten der beiden Konten blieben getrennt.
- Alle 18 Hauptmissionen wurden serverseitig begonnen, ihre tatsächlichen Eingabeprotokolle erneut simuliert und ihre Belohnungen einmalig abgeholt. Das Guthaben wurde nicht direkt gesetzt.
- Ein Outfit wurde aus erspieltem Guthaben mit drei gleichzeitigen identischen Kaufanfragen genau einmal gekauft und danach ausgerüstet. Manipulierte Walletwerte, negative Preise und unverdiente Claims wurden abgewiesen.
- Zwei geprüfte Open Runs wurden ausdrücklich veröffentlicht. Erneute Veröffentlichung erzeugte keine Duplikate; öffentliche Ergebnisse enthielten keine E-Mail oder interne Konto-ID.
- Nach echtem Prozessneustart bestanden beide Konten, Fortschritt, Guthaben, Inventar, Rangliste und verschlüsselte MFA-Daten weiterhin. MFA-Challenge, Authenticator-Code und einmalige Recovery-Codes wurden geprüft. Passwortwiederherstellung widerrief alte Sitzungen; Logout widerrief die betreffende Sitzung.
- Nach dem Löschen der Testkonten enthielten **alle zehn verknüpften Kontentabellen null Datensätze**, einschließlich Wallets, Sessions, Ledger, Runs, Scores und MFA-Daten.

Das wiederholbare Audit akzeptiert ausschließlich Loopback-Testdatenbanken, erzeugt eindeutige PostgreSQL-Schemas und entfernt seine Ressourcen auch auf Fehlerpfaden. Host-Overrides in PostgreSQL-URLs werden abgefangen. Es erstellt keine kostenpflichtigen Ressourcen und schreibt keine Produktionsdaten.

## Bisheriger automatisierter Prüfstand

Der damalige vollständige Lauf mit echtem lokalen PostgreSQL endete mit **498 bestandenen Tests, null Fehlern und null übersprungenen Tests**. Darunter sind zwei neue Prüfungen für MFA und einmalige Recovery-Codes über tatsächliche Prozessneustarts in SQLite und PostgreSQL sowie zwei zusätzliche Prüfungen für sichere Wiederherstellung des Übungsverlaufs.

Dieser Teststand ist historisch und bezieht sich auf den Korrekturkandidaten der Spielabnahme. Die größere nachfolgende Erweiterung besitzt einen eigenen [Freigabestand](EXPANSION_3_13.md), einschließlich neuer Tests, Paketidentität und öffentlicher Nachprüfung.

## Wiederholbare Prüfroutinen

Voraussetzung ist die lokale Node-24-Anwendung. Browserprüfungen verwenden `NINJA_BASE_URL`, beispielsweise `http://127.0.0.1:8198/notification-ninja/`; sie lehnen öffentliche Ziele ab. Auf Wunsch lässt sich über `NINJA_TEST_OUTPUT` ein separates Ergebnisverzeichnis wählen.

- [Hauptkarriere mit frischem Gast und nativen Eingaben](../scripts/check_ninja_campaign_playthrough.cjs)
- [Acht Zusatzherausforderungen vom erspielten Zwischenstand](../scripts/check_ninja_extra_playthrough.cjs)
- [Boss Rush, Tagesübung, Open Run und Wischtraining](../scripts/check_ninja_modes_playthrough.cjs)
- [Einzelne Seiten und Unterzustände in DE/EN](../scripts/check_ninja_all_pages.cjs)
- [Browser-History, Designauswahl und Verlassen-Dialog](../scripts/check_ninja_crossflows.cjs)
- [Konto/Wirtschaft über HTTP und Prozessneustarts](../scripts/check_ninja_account_audit.mjs)

Die langfristigen Prozessprüfungen liegen zusätzlich in [ninja-account-restart.test.mjs](../tests/ninja-account-restart.test.mjs); die Wiederherstellung der ungewerteten Übung in [ninja-practice-settings.test.mjs](../tests/ninja-practice-settings.test.mjs).

## Historischer Prüfstand und nachfolgende Freigabe

Die folgenden Nachweise werden zeitlich getrennt geführt. Neue 3.13.0-Prüfungen ersetzen keine fehlenden historischen Ergebnisse und werden im Erweiterungsbericht festgehalten.

| Nachweis | Aktueller Stand dieses Berichts |
|---|---|
| Acht Zusatzherausforderungen einschließlich der drei einzelnen Bosskämpfe | Abgeschlossen und Belohnungen abgeholt; gespeicherte Teilberichte und letzter erfolgreicher Bericht abgeglichen. Siehe den eigenen Abschnitt oben. |
| Erweiterte Seitenmatrix auf 360/1280 in DE/EN | Für den erweiterten Kandidaten erneut erforderlich. Die gespeicherte Zwischenmatrix fand noch fehlende englische Texte und gilt deshalb nicht als bestandene Endabnahme. |
| Crossflow-Regressionsprüfung | Die gespeicherte Prüfung des integrierten Erweiterungskandidaten bestand auf 360 und 1280 Pixeln: Designwahl, Übungs-History und Verlassen-Dialog. Eigene neue Prüfung nach endgültigem Build siehe Erweiterungsbericht. |
| Finale Release-Dateien | Build, reproduzierbares ZIP und Prüfsumme 3.13.0 werden ausschließlich im Erweiterungsbericht als abgeschlossen eingetragen. |
| Git und Öffentlichkeit | Commit, Push, unabhängige CI und öffentliche Gastprüfung der Erweiterung stehen im Erweiterungsbericht. |

## Grenzen der Abnahme

Der direkte Zugriff auf das bereits konfigurierte Produktions-Account-Backend ist in dieser Cloud-Umgebung weiterhin mit **CONNECT 403** blockiert. Die lokalen SQLite-/PostgreSQL-Prüfungen beweisen daher keinen neuen Neustart oder Account-Lifecycle auf dem öffentlichen Render-/Neon-System. Die historische Online-Abnahme vom 7. November 2026 bleibt getrennt dokumentiert; siehe [historischer Status](ULTIMATE_STATUS.md) und [Cloud-Einrichtung](../server/NINJA_ULTIMATE_CLOUD_SETUP.md). Bestehende Produktionsdaten und die alte Cloud-Umgebung wurden nicht gelöscht.

Emulierter Touch ist kein Test auf einem physischen iPhone oder Android-Gerät. Reales Audio, Gerätehaptik, reale Bildrate, vollständige Browserkompatibilität und Verständlichkeit mit der Zielgruppe bleiben gesonderte praktische Abnahmen. Ein erfolgreicher automatisierter Durchlauf ist weder eine Rechtsprüfung noch eine Garantie, dass niemand einen weiteren Fehler oder Kritikpunkt findet.
