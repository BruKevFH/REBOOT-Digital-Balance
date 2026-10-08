"""Package the complete, locally bundled arcade runtime reproducibly."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
from hashlib import sha256

ROOT=Path(__file__).resolve().parents[1]/'notification-ninja'
NAME='Notification-Ninja-1.0.0'
FILES=['index.html','styles.css','sw.js','manifest.webmanifest','favicon.svg','dist/ninja.js','dist/build.json']
INSTRUCTIONS='''NOTIFICATION NINJA – MASTER YOUR DIGITAL BALANCE

Die gesamte ZIP entpacken. Im Spielordner index.html in einem aktuellen
Chrome, Edge oder Firefox öffnen. Maus oder Touch und JavaScript erforderlich.
Alle Grafiken, Effekte, Musik und Spielregeln sind lokal enthalten.
Keine Installation, kein Account, keine Internet-API nötig.

Mit gedrückter Maustaste oder Finger durch Ablenkungen WISCHEN.
Sinnvolle Inhalte bewusst bis zum oberen Rand durchlassen.
Die aktuelle Situation entscheidet: Gaming passt zur Gaming-Zeit,
kann aber beim Lernen oder vor dem Schlafen ablenken.
Fünf richtige Entscheidungen aktivieren Focus Flow für fünf Sekunden.
Goldene Power-ups bieten Zeitlupe, Schild und Bonusmultiplikator.
Esc: Pause. Ton kann über das Lautsprecher-Symbol aktiviert werden.

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
        info=ZipInfo(f'{NAME}/{name}',(2026,10,8,0,0,0));info.compress_type=ZIP_DEFLATED;info.external_attr=0o100644<<16
        z.writestr(info,INSTRUCTIONS.encode() if name=='START-HIER.txt' else (ROOT/name).read_bytes())
with ZipFile(output) as z:
    assert z.testzip() is None
    for name in FILES:assert z.read(f'{NAME}/{name}')==(ROOT/name).read_bytes()
digest=sha256(output.read_bytes()).hexdigest()
output.with_suffix('.zip.sha256').write_text(f'{digest}  {output.name}\n')
print(f'Packaged {output.name}: {output.stat().st_size:,} bytes; runtime identity and CRC verified; SHA256 {digest}')
