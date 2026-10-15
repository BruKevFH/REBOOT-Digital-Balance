"""Package the complete, locally bundled arcade runtime reproducibly."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
from hashlib import sha256

ROOT=Path(__file__).resolve().parents[1]/'notification-ninja'
NAME='Notification-Ninja-1.3.0'
FILES=['index.html','styles.css','sw.js','manifest.webmanifest','favicon.svg','dist/ninja.js','dist/build.json']
INSTRUCTIONS='''NOTIFICATION NINJA – MASTER YOUR DIGITAL BALANCE

Die gesamte ZIP entpacken. Im Spielordner index.html in einem aktuellen
Chrome, Edge oder Firefox öffnen. Maus oder Touch und JavaScript erforderlich.
Alle Grafiken, Effekte, Musik und Spielregeln sind lokal enthalten.
Keine Installation, kein Passwort, keine Internet-API nötig.
Wähle zuerst einen Ninja-Namen (3–18 Zeichen). Dein Profil mit Münzen,
XP und Level bleibt auf diesem Gerät; den Namen kannst du im Profil ändern.
NIM erklärt dir im Training das Wischen und Durchlassen. Während der
Erklärungen pausiert die Runde. Neue Kräfte erklärt er beim Freischalten.
Mitteilungen sammeln deine letzten 50 Freischaltungen. Oben sind neue Ziele,
unten deine erreichten Erfolge und gekauften Kräfte. Dein Fähigkeitenbaum
wächst aus der Mitte in drei verbundenen Wurzelzweigen.
Die Musik startet nach deinem Klick auf Spielen. Du kannst sie ausschalten.

Mit gedrückter Maustaste oder Finger durch Ablenkungen WISCHEN.
Sinnvolle Inhalte bewusst bis zum oberen Rand durchlassen.
Die aktuelle Situation entscheidet: Gaming passt zur Gaming-Zeit,
kann aber beim Lernen oder vor dem Schlafen ablenken.
Fünf richtige Entscheidungen aktivieren Focus Flow.
Goldene Power-ups bieten Zeitlupe, Schild, Bonuspunkte und Münzen.
Esc: Pause. M oder Musik-Schalter: Musik an/aus.
Entspannt: 5 Herzen. Normal: 4. Profi: 3. Das Tempo steigt mit der Zeit.
Ein falscher Schnitt ODER eine durchgelassene Ablenkung kostet ein Herz.
Schilde schützen vor einem Fehler. WISCHEN-/BEHALTEN-Hilfen siehst du nur
im Training. Im Spiel entscheiden Gegenstand und aktuelles Ziel.
Klassenzimmer, Gaming-Zimmer und Schlafzimmer haben eigene Hintergründe
und passende Objekte: Bücher, Controller, Kissen und vieles mehr.

Sammle Rundenmünzen durch gute Entscheidungen, Kombos und Münzobjekte.
Am Rundenende werden sie gesichert, auch wenn deine Herzen aufgebraucht sind.
Neun Fähigkeiten in drei Zweigen: Fokus, Schutz, Münzen/Kombos.
Kaufe zuerst den Vorgänger; schalte eine Super frei und rüste sie aus.
Gute Entscheidungen laden deine Super: bei 100% Taste oder Leertaste drücken.
Es gibt Zeitzauber, Rettungsschirm und Aufräum-Wirbel.
Neue Fähigkeiten und die ausgerüstete Super gelten ab der nächsten Runde.
Zwölf Erfolge bieten einmalige Münzbelohnungen zum Abholen.

Deine Zimmerkarte beginnt im kostenlosen Schulzimmer. Kaufe danach
Gaming-Zimmer (35), Schlafzimmer (75) und Balance Master (120 Münzen).
Die Kampagne endet vor gesperrten Räumen und sichert dabei deine Münzen.
Im Ninja-Basar findest du Spielorte, Hintergründe und vier Ninja-Designs.
Papiergarten (60), Pixelbucht (85) und Mondinseln (110 Münzen) erfordern
ihren Spielort. Nach dem Kaufen auswählen und eine neue Runde beginnen.
Kleidung und Wischspur ändern sich passend zu deinem Ninja-Design.
Über Training kannst du die Übungsrunde jederzeit wiederholen.
Münzregen, Combo-Party und Fokus-Welle wechseln als Bonusphasen.

Tutorial, Study, Gaming, Sleep und Balance Master stehen bereit.
Das Gaming-Rundenlimit wählst du selbst (45, 60 oder 90 Sekunden).
Nach Ablauf darfst du bewusst aufhören oder einmal 15 Sekunden verlängern.
In Sleep kannst du deine Punkte sichern und die virtuelle Nacht abschließen.

Fortschritt, Highscores, Münzen und Skins bleiben lokal im Browser.
Bei eingeschränkter Dateispeicherung bleibt die Sitzung spielbar.
Falls lokale Dateien eingeschränkt sind, den Ordner über HTTP öffnen.
Das Spiel ist eine Lernsimulation; Balance und Overload sind Spielwerte.
Ergebnisse lassen sich im Spiel als JSON exportieren.

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
