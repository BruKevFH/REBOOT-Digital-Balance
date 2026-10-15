"""Package the complete, locally bundled arcade runtime reproducibly."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
from hashlib import sha256

ROOT=Path(__file__).resolve().parents[1]/'notification-ninja'
NAME='Notification-Ninja-1.6.0'
FILES=['index.html','styles.css','sw.js','manifest.webmanifest','favicon.svg','dist/ninja.js','dist/build.json','leaderboard-config.json']
INSTRUCTIONS='''NOTIFICATION NINJA – MASTER YOUR DIGITAL BALANCE

Die gesamte ZIP entpacken. Im Spielordner index.html in einem aktuellen
Chrome, Edge oder Firefox öffnen. Maus oder Touch und JavaScript erforderlich.
Alle Grafiken, Effekte, Musik und Spielregeln sind lokal enthalten.
Keine Installation und kein Passwort nötig. Das lokale Spiel braucht keine API.
Wähle zuerst einen Ninja-Namen (3–18 Zeichen). Dein Profil mit Münzen,
XP und Level bleibt auf diesem Gerät; den Namen kannst du im Profil ändern.
Die Startseite führt in dein Dojo. Abmelden erhält deinen Fortschritt.
Profil löschen verlangt deinen aktuellen Namen zur Bestätigung und löscht
Notification-Ninja-Daten. Andere Spiele bleiben erhalten. Falls du Ergebnisse
veröffentlicht hast, werden zuerst deine Online-Einträge gelöscht.
Deine Garderobe zeigt gekaufte Looks und dein echtes ausgewähltes Ninja-Bild.
Je nach Schwierigkeit werfen 1 / 2 / 3 große Ninjas in deinem ausgewählten
Look die echten Gegenstände aus ihrer Hand ins Feld. Ausholen und Anflug
sind geschützt; erst im freien Flug kannst du die Gegenstände schneiden.
Neue Runs übernehmen die Auswahl. Ein gespeicherter Run behält seinen Look.
Große Herzsymbole zeigen deine verbleibenden Chancen. Rundenuhr, Münzen,
Tempo und Super stehen kompakt rechts; das Spielfeld reicht bis nach unten.
Die Vollbild-Taste oben rechts gibt dir mehr Spielfläche. Unterstützt dein
Browser kein echtes Vollbild, öffnet sie eine große Spielansicht mit kompakter
Anzeige; die Browserleiste kann dabei sichtbar bleiben. Zum Verlassen erneut
die Taste drücken. Esc verlässt die große Spielansicht, sonst pausiert es.
Meister NIM, dein eigener Fuchs-Sensei, erklärt im Training das Wischen
und Durchlassen. Während der Erklärungen pausiert die Runde.
Neue Kräfte erklärt er beim Freischalten.
Mitteilungen sammeln deine letzten 50 Freischaltungen. Oben sind neue Ziele,
unten deine erreichten Erfolge und gekauften Kräfte. Dein Fähigkeitenbaum
wächst aus der Mitte in drei verbundenen Wurzelzweigen.
Die feste Zurück-Taste bringt dich zur vorherigen Ansicht zurück.
Die Musik startet nach deinem Klick auf Spielen. Du kannst sie ausschalten.

Mit gedrückter Maustaste oder Finger durch Ablenkungen WISCHEN.
Sinnvolle Inhalte bewusst bis zum oberen Rand durchlassen.
Die aktuelle Situation entscheidet: Gaming passt zur Gaming-Zeit,
kann aber beim Lernen oder vor dem Schlafen ablenken.
Fünf richtige Entscheidungen aktivieren Focus Flow.
Goldene Power-ups bieten Zeitlupe, Schild, Bonuspunkte und Münzen.
Esc: Pause. M oder Musik-Schalter: Musik an/aus.
Entspannt: 5 Herzen. Normal: 4. Profi: 3. Das Tempo steigt mit der Zeit.
Nach 15, 30 und 60 Sekunden wird es deutlich schneller. Normale Räume
erreichen nach 90 aktiven Sekunden ihre Tempospitze.
Ein falscher Schnitt ODER eine durchgelassene Ablenkung kostet ein Herz.
Schilde schützen vor einem Fehler. WISCHEN-/BEHALTEN-Hilfen siehst du nur
im Training. Im Spiel entscheiden Gegenstand und aktuelles Ziel.
Klassenzimmer, Gaming-Zimmer und Schlafzimmer haben eigene Hintergründe
und passende Objekte: Bücher, Controller, Kissen und vieles mehr.

Der kostenlose OPEN RUN läuft im Lernkontext ohne Zeitlimit, bis deine
Herzen aufgebraucht sind. Auch nach 90 oder 300 Sekunden steigt das Tempo
weiter. Gekaufte Fähigkeiten und Supers sind dort ausgeschaltet.
Fliegende Power-ups und Focus Flow bleiben dabei; Looks sind kosmetisch.

Sammle Rundenmünzen: eine Grundmünze je 14 richtige Entscheidungen,
je Münzobjekt und je voller 25er-Combo. Münzgespür senkt 14 auf 12.
Schwierigkeit und Boni verändern den Verdienst. Pro Abschnitt gelten
8 / 10 / 12 Spielmünzen als Grenze; Goldener Lauf erhöht diese um 25 %,
abgerundet. Ein Open Run zählt als ein fortlaufender Abschnitt.
Am Rundenende werden sie gesichert, auch wenn deine Herzen aufgebraucht sind.
Ein regulärer Abschluss ab 12 richtigen Entscheidungen gibt 2 Münzen extra,
ein bewusster Gaming-/Sleep-Stopp dann eine weitere. Bei null Herzen
gibt es diesen Abschlussbonus nicht. Ein einzelner perfekter Study-Run
kann ohne Münzfähigkeiten höchstens 10 / 12 / 14 Münzen sichern.
Neun Fähigkeiten in drei Zweigen: Fokus, Schutz, Münzen/Kombos.
Die Stufen kosten 35, 90 und 180 Münzen.
Kaufe zuerst den Vorgänger; schalte eine Super frei und rüste sie aus.
Gute Entscheidungen laden deine Super: bei 100% Taste oder Leertaste drücken.
Es gibt Zeitzauber, Rettungsschirm und Aufräum-Wirbel.
Neue Fähigkeiten und die ausgerüstete Super gelten ab der nächsten normalen
Runde; im Open Run sind sie deaktiviert. 24 Erfolge mit eigenen Bildabzeichen
bieten einmalige Münzbelohnungen zum Abholen.

Deine Zimmerkarte beginnt im kostenlosen Schulzimmer. Kaufe danach
Gaming-Zimmer (80), Schlafzimmer (180) und Balance Master (320 Münzen).
Die Kampagne endet vor gesperrten Räumen und sichert dabei deine Münzen.
Im Ninja-Basar findest du Spielorte, Hintergründe und vier Ninja-Designs.
Papiergarten (160), Pixelbucht (220) und Mondinseln (280 Münzen) erfordern
ihren Spielort. Nach dem Kaufen auswählen und eine neue Runde beginnen.
Ninja Mint ist frei; Solar Slice kostet 80, Arctic Focus 180 und
Violet Flow 320 Münzen. Vorhandenes Guthaben und Freischaltungen bleiben.
Kleidung und Wischspur ändern sich passend zu deinem Ninja-Design.
Über Training kannst du die Übungsrunde jederzeit wiederholen.
Münzregen, Combo-Party und Fokus-Welle wechseln als Bonusphasen.

Training, Open Run, Study, Gaming, Sleep und Balance Master stehen bereit.
Das Gaming-Rundenlimit wählst du selbst (45, 60 oder 90 Sekunden).
Nach Ablauf darfst du bewusst aufhören oder einmal 15 Sekunden verlängern.
In Sleep kannst du deine Punkte sichern und die virtuelle Nacht abschließen.

Fortschritt, Highscores, Münzen und Skins bleiben lokal im Browser.
XP: 5 je richtige Entscheidung, 10 je Super, 25 je beendete Runde;
gesichert am Rundenende. Training vergibt keine Run-XP.
Bei eingeschränkter Dateispeicherung bleibt die Sitzung spielbar.
Falls lokale Dateien eingeschränkt sind, den Ordner über HTTP öffnen.
Das Spiel ist eine Lernsimulation; Balance und Overload sind Spielwerte.
Ergebnisse lassen sich im Spiel als JSON exportieren.

Die gemeinsame Rangliste ist mit https://notification-ninja-ranking.onrender.com
verbunden. Nur ausdrücklich veröffentlichte Open Runs zählen, getrennt nach
Schwierigkeit. Es gibt keine erfundenen Mitspieler. Ohne Internet werden keine
Ergebnisse übertragen; das lokale Spiel funktioniert weiterhin.
Zum Veröffentlichen die GitHub-Pages-Version verwenden. Ein lokal geöffneter
Download hat eine andere Herkunft und darf deshalb nicht an die öffentliche
Rangliste senden.
Der kostenlose Render-Dienst kann nach einer Pause ungefähr eine Minute zum
Starten brauchen. Warte kurz und öffne die Rangliste bei Bedarf erneut.
Bei Render Free geht die Online-Rangliste durch Einschlafen, Neustart oder
Deployment verloren. Lokale Münzen und Profile bleiben erhalten.
Betriebsanleitung:
https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/main/server/README_NINJA.md

https://brukevfh.github.io/REBOOT-Digital-Balance/notification-ninja/
'''
for name in FILES:
    if not (ROOT/name).is_file():raise SystemExit(f'Missing runtime file: {name}')
output=ROOT/'downloads'/f'{NAME}.zip'
output.parent.mkdir(exist_ok=True)
with ZipFile(output,'w',ZIP_DEFLATED) as z:
    for name in FILES+['START-HIER.txt']:
        info=ZipInfo(f'{NAME}/{name}',(2026,10,15,0,0,0));info.compress_type=ZIP_DEFLATED;info.external_attr=0o100644<<16
        z.writestr(info,INSTRUCTIONS.encode() if name=='START-HIER.txt' else (ROOT/name).read_bytes())
with ZipFile(output) as z:
    assert z.testzip() is None
    for name in FILES:assert z.read(f'{NAME}/{name}')==(ROOT/name).read_bytes()
digest=sha256(output.read_bytes()).hexdigest()
output.with_suffix('.zip.sha256').write_text(f'{digest}  {output.name}\n')
print(f'Packaged {output.name}: {output.stat().st_size:,} bytes; runtime identity and CRC verified; SHA256 {digest}')
