"""Package the actual static runtime for offline double-click play."""
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile
from hashlib import sha256
import json

ROOT = Path(__file__).resolve().parents[1]
VERSION = json.loads((ROOT / 'package.json').read_text())['version']
NAME = f'REBOOT-Neon-Balance-{VERSION}'
OUTPUT = ROOT / 'downloads' / f'{NAME}.zip'
RUNTIME = ['index.html', 'styles.css', 'sw.js', 'dist/reboot.js', 'dist/build.json',
           'manifest.webmanifest', 'favicon.svg', 'licenses/THREE-LICENSE.txt']
INSTRUCTIONS = '''REBOOT NEON BALANCE – 3D

1. Entpacke den gesamten Ordner aus dieser ZIP-Datei.
2. Öffne index.html in einem aktuellen Chrome, Edge oder Firefox.
3. Wähle Story, Daily oder Endless und betrete den Campus.

Kein Installer, keine Engine und kein Webserver nötig.
Alle benötigten Dateien liegen im Ordner. WebGL 2 und JavaScript müssen
verfügbar sein. Chrome/Edge/Firefox mit Hardwarebeschleunigung empfohlen.

Steuerung: WASD bewegen, Shift sprinten, Maus umsehen, E sprechen,
1/2/3 Entscheidungen, Space Minigame-Aktion, Tab Lab, Esc Pause.
Auf Touch-Geräten gibt es Bewegungstasten und Blicksteuerung.

Deine Daten bleiben im Browser. Lokale Dateien und die Online-Version
verwenden getrennte Speicherplätze; Browser-Einstellungen können lokale
Speicherung einschränken. Ein JSON-Export ist im Spiel möglich.

Website: https://brukevfh.github.io/REBOOT-Digital-Balance/
Three.js MIT-Lizenz: licenses/THREE-LICENSE.txt
'''

for relative in RUNTIME:
    if not (ROOT / relative).is_file():
        raise SystemExit(f'Missing runtime file: {relative}. Run npm run build first.')
OUTPUT.parent.mkdir(exist_ok=True)
with ZipFile(OUTPUT, 'w', ZIP_DEFLATED) as archive:
    for relative in RUNTIME:
        # Fixed archive timestamp makes packaging repeatable from the same files.
        from zipfile import ZipInfo
        info = ZipInfo(f'{NAME}/{relative}', (2026, 10, 7, 0, 0, 0))
        info.compress_type = ZIP_DEFLATED
        info.external_attr = 0o100644 << 16
        archive.writestr(info, (ROOT / relative).read_bytes())
    info = ZipInfo(f'{NAME}/START-HIER.txt', (2026, 10, 7, 0, 0, 0))
    info.compress_type = ZIP_DEFLATED
    info.external_attr = 0o100644 << 16
    archive.writestr(info, INSTRUCTIONS.encode('utf-8'))
with ZipFile(OUTPUT) as archive:
    assert archive.testzip() is None
    assert len(archive.namelist()) == len(RUNTIME) + 1
    assert archive.read(f'{NAME}/dist/reboot.js') == (ROOT / 'dist/reboot.js').read_bytes()
checksum = sha256(OUTPUT.read_bytes()).hexdigest()
(OUTPUT.with_suffix('.zip.sha256')).write_text(f'{checksum}  {OUTPUT.name}\n')
print(f'Packaged {OUTPUT.name}: {OUTPUT.stat().st_size:,} bytes; runtime and CRC verified')
