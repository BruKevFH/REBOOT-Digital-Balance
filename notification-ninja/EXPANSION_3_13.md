# Notification Ninja 3.13.0 – Erweiterung und Freigabestand

Stand: **24. November 2026**. Dieser Bericht beschreibt den lokalen Entwicklungskandidaten **3.13.0**. Die veröffentlichte Ausgangsversion bleibt **3.12.0**; Deployment, unabhängige CI und öffentliche Abnahme des neuen Kandidaten sind noch ausstehend. Der Kandidat enthält derzeit nicht eingecheckte Änderungen. Ein neuer Commit und dessen vollständige Kennung werden nach der Integration eingetragen.

Die [Spiel- und Seitenabnahme vom 17. November](FULL_GAME_AUDIT.md) bleibt als eigener historischer Nachweis erhalten; ihr Zusatzmissionsabschluss wurde anhand der gespeicherten Ergebnisse nachgetragen. Ihre tatsächlich ausgeführten nativen Karriere-/Modusläufe, SQLite-/PostgreSQL-Prozessprüfungen und damals 498 bestandenen Tests werden nicht als neue 3.13.0-Abnahme ausgegeben. Die bisherigen Erlebnisfunktionen dokumentiert der [3.12.0-Releasebericht](EXPERIENCE_RELEASE.md).

## Spiel und Präsentation

Welten, Gaming-Ansichten und Basar erhalten eine überarbeitete Darstellung innerhalb der bestehenden Hauptnavigation. Fähigkeiten liegen unter **Basar → Fähigkeiten** neben Spielwelten und Ninja-Looks. Die frühere radiale Darstellung mit neun Knoten wird durch die Angebote des erweiterten Katalogs ersetzt. Historisch gekaufte Kulissen bleiben im Spielstand erhalten; sie werden nicht als neue Archivnavigation angeboten.

| Katalog | Umfang des Kandidaten | Maßgebliche Quelle |
|---|---:|---|
| Fähigkeiten einschließlich Supers | 18, sechs je Ast | [progression.js](src/progression.js) |
| Aktive Supers | 6 | [progression.js](src/progression.js) |
| Erfolge | 36 | [progression.js](src/progression.js) |
| Ninja-Looks | 12 | [skin-catalog.js](src/skin-catalog.js) |
| Kosmetische Seltenheiten | 5 | [skin-presentation.js](src/skin-presentation.js) |
| Hauptmissionen / zusätzliche Herausforderungen | 18 / 8 | [adventure.js](src/adventure.js) |

Die Seltenheiten heißen **Gewöhnlich, Ungewöhnlich, Selten, Episch und Legendär**. Bezeichnung und eigenes Symbol ergänzen die Farbe. Seltenheit verändert weder Besitzbedingungen noch Spielvorteile. Kaufbare Looks kosten weiterhin 80/180/320 Münzen; Rang-, Wochen- und Entscheidungs-Looks bleiben erspielbar. Die beiden Entscheidungs-Looks werden bei insgesamt 60 beziehungsweise 180 richtigen Entscheidungen freigeschaltet.

## Fähigkeiten und Erfolge

Die ursprünglichen neun Identitäten, Preise und Vorgänger bleiben erhalten. Jeder der drei Äste besitzt nun sechs aufeinander aufbauende Stufen für **35 / 90 / 180 / 240 / 360 / 480 Münzen**, insgesamt 1.385 Münzen je Ast. Käufe prüfen Geld und Vorgänger. Neue Kräfte gelten ab der nächsten normalen Runde; Open Run, Bosskämpfe, Boss Rush und Tages-Challenges bleiben ohne gekaufte Vorteile.

| Ast | Ursprüngliche Stufen | Neue Stufen und Wirkung |
|---|---|---|
| Fokus | Klarer Kopf → Zeitzauber → Flow-Meister | Klarer Strom: hilfreiches Durchlassen gibt drei zusätzliche Ladepunkte. Zen-Zeit: sechs Sekunden Zeitlupe und Focus Flow. Fokus-Vorrat: 20 Prozent Ladung zum Start einer normalen Runde. |
| Schutz | Gut vorbereitet → Rettungsschirm → Zweite Chance | Sanfte Klinge: hilfreiche Schnittzonen sind 20 Prozent kleiner. Lotus-Wache: drei einzeln verbrauchte Schildladungen. Etappenschild: ein Schild beim Start einer neuen normalen Etappe. |
| Münzen | Münzgespür → Aufräum-Wirbel → Goldener Lauf | Doppelter Fund: zwei Grundmünzen je Münzbonus. Sternensturm: zwölf Sekunden doppelte Arcade-Punkte ohne Verdoppelung der Münzen. Goldene Geduld: Münzobjekte fliegen 25 Prozent langsamer. |

Zeitlupe verändert die Rundenuhr nicht. Die vorhandenen Münzfaktoren und Abschnittsgrenzen bleiben maßgeblich; Doppelter Fund umgeht die Grenze nicht. Schildladungen schützen jeweils genau einen Fehler. Supers müssen freigeschaltet, für den Lauf ausgewählt und durch richtige Entscheidungen geladen werden.

Zwölf neue Erfolge ergänzen die bisherigen 24: Hauptmissionen bei 1/6/12/18 Abschlüssen, ein beziehungsweise drei unterschiedliche Karriere-Bosse, sechs beziehungsweise zwölf Fähigkeiten, alle sechs Supers, sechs Looks, alle vier Welten und sämtliche 26 Karriereaufgaben. Sammlungswerte werden aus bekannten Inhalten und gültigen Voraussetzungen abgeleitet. Erfundenen IDs oder verwaisten Abschlüssen wird kein Fortschritt zugerechnet. Münzen werden ausdrücklich und einmalig abgeholt; eine Migration zahlt sie nicht automatisch aus.

## Eigenes Ninja-Intro

Das Intro ist eine eigens implementierte **Canvas-/SVG-Animation aus der Perspektive des Ninja**, keine MP4-Datei und kein externes Video. Vier vertonte beziehungsweise lesbare Szenen erklären Zielwechsel, Schneiden, Durchlassen und bewusstes Aufhören. Die reguläre Animationsdauer beträgt **20 Sekunden**: 4 + 5 + 5 + 6 Sekunden. Optionale Browser-Sprachausgabe kann je Gerät anders klingen oder fehlen; die Texte bleiben sichtbar.

Überspringen, Pause/Fortsetzen, Szenenauswahl und Wiederholung sind vorhanden. Bei reduzierter Bewegung erfolgt der Szenenwechsel ausdrücklich mit „Weiter“. Verborgene Tabs treiben die Präsentationsuhr nicht voran. Die Gesehen-Markierung bleibt je Profil auf diesem Gerät; ein erneutes Ansehen ist in den Einstellungen möglich. Das Intro verändert weder Spielstand noch Belohnungen und ersetzt das anschließende Training nicht.

## Aktive Spielzeit und Pausenerinnerungen

Der neue Zähler beginnt bei Aktivierung; vergangene Spielzeit wird nicht geschätzt. Er zählt nur sichtbare aktive Runden. Menüs, Briefings, Pausen, Ergebnisse und verborgene Tabs zählen nicht. Lange Unterbrechungen werden nicht nachträglich als Spielzeit verbucht.

Gesamt-, Tages- und Sitzungszeit sind getrennt sichtbar. Speicherung und Erinnerungswahl bleiben **auf dem jeweiligen Gerät**, getrennt für Gast und einzelne Kontoprofile. Sie sind keine serverseitige Kontostatistik und verändern keine Belohnung. Bei blockiertem Speicher wird auf die begrenzte Sitzungsspeicherung hingewiesen.

Standard: Erinnerung **aktiv nach 15 Minuten aktiver Sitzungszeit**. Alternativen sind 10, 20 und 30 Minuten oder Abschalten. Die Erinnerung bietet „Pause machen“ und „Später erinnern“; sie erzwingt keine Spielbeendigung.

## UTC-Wochenpodium und privates Admin-Testkonto

Die Wettbewerbswoche reicht von Montag 00:00 UTC bis zum folgenden Montag. Berücksichtigt werden echte servergeprüfte Open Runs regulärer Konten, die in derselben Woche beendet und ausdrücklich veröffentlicht wurden. Pro Konto zählt die beste Leistung; die drei Plätze gehören unterschiedlichen Konten. Die Wochenansicht basiert auf den vollständigen serverseitigen Ergebnissen und nicht auf einer im Browser gefilterten globalen Top 100.

Nach dem Wochenwechsel wird die Platzierung beim nächsten relevanten Serveraufruf transaktional eingefroren. Bei Punktgleichheit folgen längere Laufzeit, frühere Veröffentlichung und stabile Lauf-ID. Platz eins bis drei erhalten **100 / 60 / 30 Münzen** nach ausdrücklicher Abholung. Wiederholte oder parallele Anfragen zahlen dieselbe Prämie nicht erneut aus. Das Löschen eines Siegerkontos löst kein Nachrücken aus. Die Funktion beginnt mit der Woche ihrer Datenbankmigration und vergibt keine rückwirkenden Geschenke für alte Ranglistenwerte.

Das private Admin-Testkonto besitzt eine serverseitige Rolle und ein wieder aufgefülltes Testbudget. Käufe verwenden weiter echte Preise und Besitzprüfungen; Missionen werden nicht pauschal freigeschaltet. Admin-Testkonten sind serverseitig aus öffentlichen Ranglisten und Wettbewerbsprämien ausgeschlossen. Lokale Profilfelder oder Registrierungsanfragen können die Rolle nicht setzen.

Die unterstützte Einrichtung erfolgt nach [Admin-Testkonto und Wochenpodium](../server/NINJA_ADMIN_AND_PODIUM.md). Betreiberzugang, Passwort und Wiederherstellungscode gehören ausschließlich in private Betreiberkonfiguration beziehungsweise eine neu erstellte Datei außerhalb des Checkouts mit Modus 0600. Die öffentliche Einrichtung ist **noch ausstehend**; dieser Bericht enthält keine Zugangsdaten und behauptet keine erfolgreiche Produktionsanmeldung.

## Adresse und Gastprofil-Übernahme

Die kanonische Adresse des Kandidaten ist **https://notification-ninja-accounts.onrender.com/**. Homepage, Spiel und `/api/v3` sollen durch den bestehenden kostenlosen Dienst mit der bestehenden Datenbank ausgeliefert werden. Ein neuer kostenpflichtiger Dienst ist dafür nicht vorgesehen. Das öffentliche Deployment und die Prüfung der sauberen Wurzeladresse stehen noch aus.

Die alte GitHub-Pages-Adresse bleibt ein anderer Ursprung mit eigenem localStorage. Ein Browser verschiebt diesen Speicher nicht automatisch. Der Kandidat bietet dort daher **„Gastspielstand mitnehmen“** an:

1. Der Spieler startet die Übernahme ausdrücklich an der alten Adresse.
2. Ein Fenster an der neuen Adresse zeigt das angebotene Gastprofil und verlangt die ausdrückliche Bestätigung des Imports.
3. Erst nach erfolgreicher Speicherung bestätigt das neue Fenster den Abschluss. Der ursprüngliche Spielstand bleibt an der alten Adresse erhalten; blockierte Fenster, Abbruch oder Ablauf werden angezeigt.

Der Nachrichtenkanal prüft die beiden exakten Ursprünge, das tatsächlich geöffnete Fenster, eine neue Zufallskennung und eine Gültigkeit von zwei Minuten. Nutzdaten sind begrenzt und werden mit den Spielregeln normalisiert. In der URL steht nur die kurzlebige Kennung; Profil und Zugangsdaten werden nicht in URL oder Query übertragen.

Übertragen wird ausschließlich das validierte lokale Gastprofil. Kontotokens, Passwörter, laufende Runden, lokale Spielzeitzähler und sonstige Geräteeinstellungen sind nicht Teil dieses Profils. Kontofortschritt bleibt auf dem Server und ist nach erneutem Anmelden verfügbar. Lokale Gastmünzen werden durch diesen Vorgang nicht zu verifiziertem Kontoguthaben. Ein angemeldetes Konto kann nicht durch den Gastimport überschrieben werden.

## Bereits ausgeführte lokale Integrationsprüfungen

Die gespeicherten Integrationsberichte vom 18. November enthalten bereits die neuen Funktionen, melden jedoch noch die alte Buildkennung **3.12.0**. Sie belegen diese Zwischenstände und ersetzen die Abschlussprüfung des endgültigen 3.13.0-Builds nicht.

- Die vollständige automatisierte Suite mit echtem lokalem PostgreSQL bestand **572 Tests, null Fehler, null übersprungen**. Das ist ein Zwischenstand vor abschließendem Versionswechsel und Paketbau.
- Die fünf Browserprüfungen für Grundspiel, Indie-Seiten, Kontoportal, Navigationsabläufe und Erlebnisfunktionen bestanden auf **360 und 1280 Pixeln**. Dazu gehören echte Schnitte, Anmeldung/MFA, Übungs-History, Pausen-/Verlassen-Dialoge und DE/EN-Lernbereiche. Die gesonderte breite Seitenmatrix fand noch englische Resttexte; sie wurde nicht als erfolgreich abgeschlossen gezählt. Die Offline-Abnahme stand noch aus.
- Ein isoliertes lokales Admin-Testkonto kaufte über die tatsächlichen Serveraktionen alle **18 Fähigkeiten**. Anschließend wurden die drei neuen Supers durch native Spielentscheidungen geladen und über ihren echten Button aktiviert: Zen-Zeit mit sechs Sekunden Verlangsamung, Lotus-Wache mit drei Schildladungen und Sternensturm mit zwölf Sekunden Punktefaktor. Der letzte Lauf meldet keine JavaScript- oder Prüfprobleme. Vorherige Selektor-/Wartefehler der Prüfroutine bleiben getrennte fehlgeschlagene Läufe.
- Die isolierte Garderobenprüfung besuchte **zwölf Kombinationen** aus 360/1280 Pixeln, DE/EN und Entspannt/Dunkel/Noir mit allen zwölf Looks. Keine Seitenüberläufe, zu kleinen sichtbaren Bedienelemente oder Profiländerungen wurden gemeldet. Die neun neuen Fähigkeitsbilder wurden zusätzlich in einer Übersicht visuell geprüft; die bisherigen neun SVG-Ausgaben bleiben bytegleich.
- Die isolierte Introprüfung bestand auf **360, 390, 768 und 1280 Pixeln sowie 844 × 390 im Querformat**. Sie prüfte Pause, vier Szenen, Wiederholung, Escape und Aufräumen. Der automatische Lauf erreichte 20 Animationssekunden in 20,31 realen Sekunden. Reduzierte Bewegung bestand mit manuellen Szenenwechseln.
- Die Spielzeit-/Erinnerungskomponente bestand ebenfalls zwölf Sprach-/Design-/Breitenkombinationen. Dies ist ausdrücklich eine Komponentenprüfung; eine künstlich vorgerückte Testuhr ist kein Nachweis von 15 tatsächlich gespielten Minuten.

Die wiederholbaren Browserprüfungen liegen unter [Erweiterung](../scripts/check_ninja_313.cjs), [Seitensammlung](../scripts/check_ninja_all_pages.cjs), [Navigation](../scripts/check_ninja_crossflows.cjs) und [Konten/Wirtschaft](../scripts/check_ninja_account_audit.mjs). Die abschließenden Ergebnisse werden nach ihrem tatsächlichen Abschluss in der folgenden Tabelle ergänzt.

## Nachweise und noch ausstehende Freigaben

| Nachweis | Stand |
|---|---|
| Historische Spiel-/Seitenabnahme vom 17. November | [Eigener Bericht](FULL_GAME_AUDIT.md); alle 18 Haupt- und acht Zusatzmissionen tatsächlich abgeschlossen. Damaliger automatisierter Stand: 498 bestanden. |
| Lokaler automatisierter Zwischenstand mit PostgreSQL | 572 Tests bestanden, null Fehler und null übersprungen; Zwischenstand vor endgültigem Build. |
| Finale Gesamtsuite nach Integration | **AUSSTEHEND** – Ergebnis, Anzahl und Datum ergänzen. |
| Neue Browserabnahme der Erweiterung, DE/EN und mobil/Desktop | **AUSSTEHEND** – tatsächlich geprüfte Ansichten, Breiten und Befunde ergänzen. |
| Release-Build, Service Worker, ZIP und Prüfsumme 3.13.0 | **AUSSTEHEND** – erzeugte Artefakte und Identität ergänzen. |
| Commit und Push des Kandidaten | **AUSSTEHEND** – vollständige Commit-Kennung ergänzen. |
| Unabhängige CI nach Push | **AUSSTEHEND** – Lauf und Ergebnis verlinken. |
| Deployment des bestehenden Render-Dienstes und kanonische Wurzeladresse | **AUSSTEHEND** – tatsächliche Versionsidentität und öffentliche Prüfung ergänzen. |
| Privates Admin-Testkonto im öffentlichen Dienst | **AUSSTEHEND** – nur erfolgreiche Einrichtung und Ausschlussprüfung dokumentieren, keine Zugangsdaten. |
| Öffentliche Konto-/Persistenzprüfung des neuen Kandidaten | **AUSSTEHEND** – lokale Tests und historische Online-Belege ersetzen diesen Nachweis nicht. |

Die historische Freischaltung der v3-Konten vom 7. November und der im Audit vom 17. November dokumentierte CONNECT-403-Fehler bleiben getrennte Belege. Dieser Bericht behauptet keine aktuelle erfolgreiche Produktionsanmeldung, kein abgeschlossenes Deployment und keinen öffentlichen Neustarttest.

Emulierter Touch ersetzt keine Prüfung auf einem physischen iPhone oder Android-Gerät. Reale Sprachausgabe, Haptik, Bildrate und Verständlichkeit mit Jugendlichen benötigen eigene praktische Abnahmen.
