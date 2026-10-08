"""Ship the compiled, self-contained MIND MAZE game, never its source project."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
from hashlib import sha256

ROOT = Path(__file__).resolve().parents[1] / 'mind-maze'
NAME = 'MIND-MAZE-1.0.0'
FILES = ['index.html', 'styles.css', 'sw.js', 'manifest.webmanifest', 'favicon.svg',
         'dist/maze.js', 'dist/build.json', 'licenses/THREE-LICENSE.txt']
INSTRUCTIONS = '''MIND MAZE – ESCAPE THE DISTRACTION

Entpacke den gesamten Ordner. Öffne index.html in Chrome, Edge oder Firefox.
Das vollständige 3D-Spiel ist enthalten. Keine Engine-Installation nötig.
JavaScript und WebGL 2 müssen verfügbar sein. Hardwarebeschleunigung empfohlen.

WASD / Pfeiltasten: bewegen. E: am nächsten Objekt interagieren.
Ein Klick auf den Boden setzt ein Bewegungsziel. Klick auf nahe Objekte: Aktion.
Esc: Pause. J: Raumkarte und Journal. T: Werkzeuge. Auf Touch: Bewegungstasten.

Lies Hinweise an den leuchtenden Datenkristallen, löse die Raumrätsel und
erreiche das Ausgangsportal. Der Scanner hilft beim Erkennen von Störungen.
Kaufe Werkzeuge mit Rätsel-Credits. Nach dem Energieknoten gibt es einen
versteckten Stillraum und einen zweiten Fluchtweg.

Alle Nachrichten des Störsystems sind Teil des Spiels. Es gibt keine echten
Gewinne oder Käufe. Fokus und Stress sind Spielwerte, keine Gesundheitsmessung.
Der Spielstand bleibt lokal im Browser. Im Endbildschirm kannst du ihn als
JSON exportieren. Speicherung kann bei lokalen Dateien vom Browser begrenzt
werden; das Spiel bleibt ohne Speicherung für diese Sitzung spielbar.

Website: https://brukevfh.github.io/REBOOT-Digital-Balance/mind-maze/
Three.js MIT-Lizenz: licenses/THREE-LICENSE.txt
'''
for relative in FILES:
    if not (ROOT / relative).is_file():
        raise SystemExit(f'Missing runtime file: {relative}; run npm run build:maze')
OUTPUT = ROOT / 'downloads' / f'{NAME}.zip'
OUTPUT.parent.mkdir(exist_ok=True)
with ZipFile(OUTPUT, 'w', ZIP_DEFLATED) as archive:
    for relative in FILES + ['START-HIER.txt']:
        info = ZipInfo(f'{NAME}/{relative}', (2026, 10, 8, 0, 0, 0))
        info.compress_type = ZIP_DEFLATED
        info.external_attr = 0o100644 << 16
        archive.writestr(info, INSTRUCTIONS.encode('utf-8') if relative == 'START-HIER.txt' else (ROOT / relative).read_bytes())
with ZipFile(OUTPUT) as archive:
    assert archive.testzip() is None
    assert len(archive.namelist()) == len(FILES) + 1
    for relative in FILES:
        assert archive.read(f'{NAME}/{relative}') == (ROOT / relative).read_bytes()
digest = sha256(OUTPUT.read_bytes()).hexdigest()
OUTPUT.with_suffix('.zip.sha256').write_text(f'{digest}  {OUTPUT.name}\n')
print(f'Packaged {OUTPUT.name}: {OUTPUT.stat().st_size:,} bytes; all runtime files and CRC verified; SHA256 {digest}')
