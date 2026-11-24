"""Package the complete, locally bundled arcade runtime reproducibly."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
from hashlib import sha256
import argparse
import json

ROOT=Path(__file__).resolve().parents[1]/'notification-ninja'
NAME='Notification-Ninja-3.13.0'
FILES=['index.html', 'home.html', 'styles.css', 'focus-ui.css', 'focus-home.css', 'legend-ui.css', 'worlds-v2.css', 'ux-v2.css', 'ui-navigation-v3.css', 'illustrated-adventure-v4.css', 'dojo-worlds-v5.css', 'mobile-navigation-v6.css', 'ninja-feedback-v7.css', 'ninja-mint-ui-v9.css', 'ninja-mint-home-v9.css', 'legend-home.css', 'sw.js', 'manifest.webmanifest', 'favicon.svg', 'dist/ninja.js', 'dist/home.js', 'dist/build.json', 'leaderboard-config.json', 'accounts-config.json', 'assets/dojo-study.png', 'assets/dojo-gaming.svg', 'assets/dojo-gaming.png', 'assets/dojo-sleep.png', 'assets/focus-village.png', 'assets/overworld-landscape-v4.svg', 'assets/dojo-study-v5.svg', 'assets/dojo-gaming-v5.svg', 'assets/dojo-sleep-v5.svg', 'assets/ninja-mint-logo-v9.svg', 'assets/ninja-mint-boss-v9.svg', 'assets/ninja-mint-daily-v9.svg', 'assets/ninja-mint-zen-v9.svg', 'assets/ninja-mint-weekly-v9.svg', 'assets/ninja-mint-day-v9.svg', 'assets/ninja-mint-open-v9.svg', 'assets/ninja-mint-balance-v9.svg', 'assets/dojo-study-v2.svg', 'assets/dojo-gaming-v2.svg', 'assets/dojo-sleep-v2.svg', 'branding/Notification-Ninja-Logo.png', 'assets/indie-wordmark.png', 'indie-theme.css', 'adventure-surfaces.css', 'learning-adventure.css', 'career-experience.css', 'dressing-room.css', 'experience-comfort.css', 'experience-shell.css', 'presentation-polish.css', 'intro-experience.css', 'playtime-experience.css', 'theme-boot.js', 'assets/indie-journeys.png', 'hub-adventure.css', 'portal-adventure.css', 'assets/indie-scenes.png', 'assets/indie-modes.png', 'assets/indie-worlds.png', 'assets/indie-masthead.png', 'assets/indie-masthead.svg', 'assets/fonts/nunito-latin-wght-normal.woff2', 'assets/fonts/nunito-latin-ext-wght-normal.woff2', 'assets/fonts/OFL-Nunito.txt']
INSTRUCTIONS='''NOTIFICATION NINJA — 3.13.0
DEUTSCH / ENGLISH

DEUTSCH
Gesamte ZIP entpacken und home.html oder index.html öffnen. Falls der Browser
lokale Dateien einschränkt: python3 -m http.server 8000 im entpackten Ordner,
dann http://localhost:8000/home.html öffnen. Keine Engine-Installation nötig.

Deutsch oder English auswählen. Als Gast kostenlos ohne Namen spielen.
Mit gedrückter Maustaste oder Finger durch Ablenkungen wischen; hilfreiche
Dinge durchlassen. Die Einführung erklärt den aktuellen Kontext.
Drei kurze Alltagsrunden: Lernen, Gaming, Schlafen. NIM erklärt das Training.
Die Hilfe bietet zusätzlich ein ungewertetes Tastentraining ohne Zeitdruck.
NIMs Fokuspfad enthält zwölf interaktive Alltagssituationen. Das Symbollexikon
erklärt die echten Spielregeln; die Garderobe zeigt alle zwölf Ninja-Looks,
ohne etwas zu kaufen oder auszurüsten. Der Lernstand bleibt auf diesem Gerät.
Karrierekarten zeigen drei illustrierte Welten und mobile Missionsdetails.
Der Rundenrückblick schlägt anhand echter Entscheidungen passende Übungen vor.
Handbedienung und freiwillige Vibration lassen sich lokal einstellen.
Pause und bewusstes Beenden bleiben jederzeit erreichbar.

18 Hauptmissionen (sechs pro Welt), acht zusätzliche Herausforderungen,
drei unterschiedliche Bosse, Boss Rush, Tages-Challenge und Tages-/Wochenaufgaben,
36 Erfolge, 18 Fähigkeiten mit sechs Supers im Basar und zwölf Ninja-Looks
in fünf Seltenheitsstufen. Belohnungen ausdrücklich abholen.
Die eigene animierte 20-Sekunden-Einführung erzählt aus Ninja-Sicht; sie lässt
sich überspringen und erneut ansehen. Es handelt sich nicht um eine MP4-Datei.
Aktive Spielzeit und optionale Pausenerinnerungen bleiben auf diesem Gerät;
Standard: alle 15 Minuten. Versteckte Tabs und pausierte Runden zählen nicht.
Open Run: drei Herzen, keine Zeitgrenze, langsam steigendes Tempo.
Gekaufte Fähigkeiten und Supers sind in Open Run, Bosskämpfen und Tages-Challenges deaktiviert.

Musik und Effekte separat regeln, stummschalten, ruhige Effekte und
Bildschirmwackeln einstellen. Reflexionen sind freiwillig und lokal.
Lokale Gastfortschritte bleiben auf diesem Gerät. Abmelden löscht sie nicht.
Ein bestätigtes Löschen entfernt das gewählte Profil.

Diese Offline-ZIP benötigt keine Anmeldung. Online-Konten und die neue
geprüfte gemeinsame Rangliste benötigen den separaten Node-24-Server mit
dauerhafter PostgreSQL-Datenbank oder lokaler SQLite-Datei. Der ZIP-Download aktiviert keine Serverkonten.
Das vollständige Repository enthält Backend und Startanleitung:
npm ci; npm run build:ninja; npm run serve:ninja
http://127.0.0.1:8083/

Neue Konten verlangen Ninja-Name, private E-Mail, Passwortbestätigung und
Datenschutz-Zustimmung; die Wiederherstellung verwendet einen einmaligen Code. Account-Münzen, Käufe und Ergebnisse sind serverseitig.
Gastguthaben wird nicht zu verifiziertem Kontoguthaben umgewandelt.
Ranglisteneinträge nur nach Serverprüfung und ausdrücklichem Veröffentlichen.
Ein freiwillig abgebrochener Open Run bleibt ungewertet.
Die kanonische Webadresse ist https://notification-ninja-accounts.onrender.com/.
Die Veröffentlichung dieser Version und die Einrichtung des privaten
Besitzer-Testkontos müssen separat geprüft werden; die ZIP richtet sie nicht ein.
Online: UTC-Wochenpodium mit 100/60/30 Münzen für die ersten drei berechtigten
Spieler, pro Woche einmal ausdrücklich abholbar. Admin-Testkonten sind ausgeschlossen.

ENGLISH
Extract the entire ZIP and open home.html or index.html. If local files are
restricted, serve the extracted folder with python3 -m http.server 8000 and
open http://localhost:8000/home.html. No game engine installation is needed.

Choose Deutsch or English. Play free as a guest without entering a name.
Hold the mouse button or use your finger to slice distractions. Let useful
items pass. Read each context briefing. Study, Gaming and Sleep short rounds,
18 main campaign missions, eight extra challenges, three distinct bosses, Boss Rush, the daily challenge,
daily/weekly tasks, 36 achievements, 18 skills including six Supers in the
bazaar, and twelve outfits in five rarity tiers.
An original animated 20-second introduction tells the story from the ninja's
perspective; skip or replay it freely. It is an in-engine story, not an MP4.
Active playtime and optional break reminders stay on this device; the default
interval is 15 minutes. Hidden tabs and paused rounds do not count.
NIM introduces the rules. Help also offers untimed unranked button practice.
NIM's focus path offers twelve interactive everyday situations. The symbol
codex explains the real game rules; the dressing room previews all twelve
outfits without buying or equipping them. Learning stays on this device.
Career maps show three illustrated worlds and mobile mission details.
The round review suggests practice based on real decisions. Handedness and
optional vibration can be changed in the local comfort settings.
Pause or deliberately end a round at any time. Reflections are optional.
Open Run: three hearts, no time limit, gentle continuous acceleration.
Purchased skills and Supers do not affect Open Run, boss encounters or daily challenges.

Separate music/effects volume, mute, calm effects and screen shake settings.
Guest progress stays on this device; signing out does not erase it.
Account sync and replay-verified shared rankings require the separate Node24
backend with persistent PostgreSQL or local SQLite storage. This standalone ZIP does not enable
an account server. Repository instructions: npm ci; npm run build:ninja;
npm run serve:ninja. Then http://127.0.0.1:8083/
New accounts require a name, private email, confirmed password and privacy
consent. Account recovery uses a one-time recovery key.
Guest coins are not imported as trusted account funds. Scores are published
only with explicit consent after server replay validation. Early exits are
unranked. The canonical website is https://notification-ninja-accounts.onrender.com/.
Publishing this version and provisioning the private owner test account require
separate verification; extracting the ZIP performs neither action.
Online UTC weekly podium: 100/60/30 coins for the first three eligible players,
claimed explicitly once per week. Admin test accounts are excluded.

https://notification-ninja-accounts.onrender.com/
'''
# The downloadable guest game must never inherit a newly enabled public endpoint.
# These two overlays are deliberate; every other bundled runtime file stays identical.
GUEST_ACCOUNTS={"enabled":False,"apiVersion":3,"message":"Offline guest edition: accounts are available only on the public website."}

def package_runtime(root=ROOT):
    root=Path(root).resolve()
    for name in FILES:
        if not (root/name).is_file():raise SystemExit(f'Missing runtime file: {name}')
    metadata=json.loads((root/'dist/build.json').read_text())
    if NAME != f"Notification-Ninja-{metadata.get('version')}":
        raise SystemExit('Build metadata and archive version differ; run npm run build:ninja before packaging.')
    metadata['publicAccountsConfigured']=False
    overrides={
        'accounts-config.json':(json.dumps(GUEST_ACCOUNTS,indent=2)+'\n').encode(),
        'dist/build.json':(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n').encode(),
    }
    output=root/'downloads'/f'{NAME}.zip'
    output.parent.mkdir(exist_ok=True)
    with ZipFile(output,'w',ZIP_DEFLATED) as z:
        for name in FILES+['START-HIER.txt']:
            info=ZipInfo(f'{NAME}/{name}',(2026,11,24,0,0,0));info.compress_type=ZIP_DEFLATED;info.external_attr=0o100644<<16
            payload=INSTRUCTIONS.encode() if name=='START-HIER.txt' else overrides[name] if name in overrides else (root/name).read_bytes()
            z.writestr(info,payload)
    with ZipFile(output) as z:
        assert z.testzip() is None
        for name in FILES:
            expected=overrides[name] if name in overrides else (root/name).read_bytes()
            assert z.read(f'{NAME}/{name}')==expected,f'Bundled file differs: {name}'
        accounts=json.loads(z.read(f'{NAME}/accounts-config.json'))
        assert accounts['enabled'] is False and 'endpoint' not in accounts
        assert json.loads(z.read(f'{NAME}/dist/build.json'))['publicAccountsConfigured'] is False
    digest=sha256(output.read_bytes()).hexdigest()
    output.with_suffix('.zip.sha256').write_text(f'{digest}  {output.name}\n')
    print(f'Packaged {output.name}: {output.stat().st_size:,} bytes; guest-only configuration, runtime identity and CRC verified; SHA256 {digest}')
    return output

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root',type=Path,default=ROOT,help='Runtime directory; defaults to the repository Notification Ninja folder.')
    package_runtime(parser.parse_args().root)
