"""Package the complete, locally bundled arcade runtime reproducibly."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
from hashlib import sha256

ROOT=Path(__file__).resolve().parents[1]/'notification-ninja'
NAME='Notification-Ninja-2.0.0'
FILES=['index.html','home.html','styles.css','sw.js','manifest.webmanifest','favicon.svg','dist/ninja.js','dist/home.js','dist/build.json','leaderboard-config.json','assets/dojo-study.png','assets/dojo-gaming.png','assets/dojo-sleep.png','assets/focus-village.png','branding/Notification-Ninja-Logo.png']
INSTRUCTIONS='''NOTIFICATION NINJA
DEUTSCH / ENGLISH

DEUTSCH

1. Die gesamte ZIP entpacken und home.html oder index.html öffnen.
2. Deutsch oder English auswählen. Die Sprache bleibt auf diesem Gerät.
3. Direkt als Gast spielen oder freiwillig einen Ninja-Namen wählen.
   Keine E-Mail, kein Passwort und keine Pflichtregistrierung.
4. Lernen, Gaming oder Schlafen auswählen. Alle drei kurzen Alltagsrunden
   sind kostenlos spielbar. Lernen und Schlafen dauern 45 Sekunden;
   beim Gaming sind auch 60 oder 90 Sekunden möglich.
5. Mit gedrückter Maustaste oder Finger durch Ablenkungen wischen.
   Hilfreiche Dinge unberührt lassen. Dein aktuelles Ziel entscheidet.
   NIM erklärt die Regeln im Training; nur dort gibt es Lösungshinweise.

Über Pause kannst du fortsetzen oder die Runde bewusst beenden.
Ergebnis und Reflexionsfrage helfen beim Übertragen in den Alltag.
Beenden und Pause machen ist ebenso erreichbar wie eine neue Runde.
In den Einstellungen: Deutsch/Englisch, ruhige Effekte und Musik an/aus.
Ruhige Effekte verringern Partikel, Kamerawackeln und Feieranimationen.
Das gewählte Tempo gilt für normale und kurze Alltagsrunden.

Dein lokales Profil speichert Münzen, XP, Skins und Freischaltungen.
Einen Gast kannst du später freiwillig benennen. Abmelden erhält Fortschritt;
Profil löschen verlangt eine Bestätigung. Es gibt keine Gerätesynchronisierung.
Sprache und ruhige Effekte sind allgemeine Einstellungen dieses Geräts.

Dein Abenteuer bleibt erhalten: Karrierekarte mit acht Missionen, drei
Autoplay-Bosse, drei Wochen- und Tagesaufgaben, Ninja-Ränge, Garderobe,
24 Erfolge, neun Fähigkeiten und eigene Hintergrundwelten. Zusätzliche
Kampagnenräume und Designs werden mit erspielten Münzen freigeschaltet.
Belohnungen ausdrücklich abholen; Ausrüstung ändert sich nicht automatisch.

Open Run: drei Herzen, langsamer Einstieg, kein Zeitlimit, steigendes Tempo.
Gekaufte Fähigkeiten und Supers sind dort ausgeschaltet. Ein bewusst
abgebrochener Run zählt nicht für die gemeinsame Rangliste. Zum freiwilligen
Veröffentlichen ist ein selbst gewählter öffentlicher Ninja-Name nötig.

Falls der Browser lokale Dateien einschränkt, den entpackten Ordner über
HTTP öffnen. Das vollständige Spiel enthält alle Grafiken, Übersetzungen
und Musik lokal. Online-Rangliste nur über die veröffentlichte Webversion;
Münzen und dein lokales Profil funktionieren ohne diese Verbindung.

ENGLISH

1. Extract the whole ZIP and open home.html or index.html.
2. Choose Deutsch or English. Your choice is remembered on this device.
3. Play as a guest, or choose a Ninja name if you want one.
   No email, password or required registration.
4. Choose Study, Gaming or Sleep. All three short everyday rounds are free.
   Study and Sleep last 45 seconds; Gaming also offers 60 or 90 seconds.
5. Hold the mouse button or use your finger to swipe through distractions.
   Leave helpful things untouched. What matters depends on your current goal.
   NIM explains the rules in training; answer hints appear only there.

Pause lets you resume or end a round deliberately. Your result and a short
reflection question connect the game with everyday life. Ending and taking
a break is as easy to find as starting another round. Settings include
language, calm effects and music. Calm effects reduce particles, screen
shake and celebration animations. Your chosen pace applies to short and
regular everyday rounds.

Your local profile keeps coins, XP, outfits and unlocks on this device.
Guests may choose a name later. Signing out keeps progress; deleting a
profile requires confirmation. There is no account sync across devices.
Language and calm effects are general preferences for this device.

Your adventure remains: eight career missions, three Autoplay bosses,
daily and weekly tasks, Ninja ranks, wardrobe, 24 achievements, nine skills
and extra backgrounds. Earn coins to unlock campaign rooms and designs.
Claim rewards explicitly; new equipment is not equipped automatically.

Open Run has three hearts, a gentle start, no timer and increasing speed.
Purchased skills and Supers are disabled. Ending early does not qualify for
the shared leaderboard. Publishing is optional and needs a chosen public
Ninja name. Local downloads cannot publish to the public service.

If local file access is restricted, serve the extracted folder over HTTP.
Graphics, both languages and music are included; no extra download is needed.
Your coins and local progress work offline. The free online ranking service
may take a moment to wake up and may lose scores after a restart.

PLAY ONLINE / ONLINE SPIELEN
https://brukevfh.github.io/REBOOT-Digital-Balance/notification-ninja/home.html
'''
for name in FILES:
    if not (ROOT/name).is_file():raise SystemExit(f'Missing runtime file: {name}')
output=ROOT/'downloads'/f'{NAME}.zip'
output.parent.mkdir(exist_ok=True)
with ZipFile(output,'w',ZIP_DEFLATED) as z:
    for name in FILES+['START-HIER.txt']:
        info=ZipInfo(f'{NAME}/{name}',(2026,10,27,0,0,0));info.compress_type=ZIP_DEFLATED;info.external_attr=0o100644<<16
        z.writestr(info,INSTRUCTIONS.encode() if name=='START-HIER.txt' else (ROOT/name).read_bytes())
with ZipFile(output) as z:
    assert z.testzip() is None
    for name in FILES:assert z.read(f'{NAME}/{name}')==(ROOT/name).read_bytes()
digest=sha256(output.read_bytes()).hexdigest()
output.with_suffix('.zip.sha256').write_text(f'{digest}  {output.name}\n')
print(f'Packaged {output.name}: {output.stat().st_size:,} bytes; runtime identity and CRC verified; SHA256 {digest}')
