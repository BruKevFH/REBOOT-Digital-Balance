#!/usr/bin/env python3
"""Build editable, evidence-based Projektabgabe 3 slides and a PDF copy.

No network requests and no production mutations. Dependencies: python-pptx,
Pillow and optional LibreOffice for PDF export. All sources are local.
"""
from pathlib import Path
from shutil import copyfile, which
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from PIL import Image, ImageFont
import argparse, json, subprocess, re, html, base64
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
ASSETS=HERE/'assets'
W,H=13.333,7.5
C={'cream':'FFF4DE','paper':'FFFBEF','mint':'A3DFC0','pale':'DCE9BD','ink':'103D46','muted':'45666A','pink':'F4A4C3','gold':'F3CB79','coral':'E9A386','white':'FFFFFF','line':'87A894','dark':'123E46','blue':'C2D7EF'}
FONT='DejaVu Sans'
STATUS_DEFAULT={'date': '25. November 2026', 'test_count': 591, 'test_qualifier': 'Repository-Gesamtsuite mit echtem lokalem PostgreSQL, 25. November 2026', 'release': '3.13.1 veröffentlicht; finale CI und öffentliche Versionsprüfung bestanden', 'public_status': 'Finale CI, öffentliche Dateigleichheit und Konto-/Neustartprüfung bestanden', 'commit': 'Geprüfter Quellstand: 6878dd4bc8717d48f257d5b89c17868c355fc2bd', 'xmas': 'Kein Protokoll einer Weihnachtssession im Repository vorhanden.'}


def color(value):return RGBColor.from_string(C.get(value,value))
def rect(s,x,y,w,h,fill='paper',line='ink',radius=True,line_width=1.5):
 q=s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE if radius else MSO_SHAPE.RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
 q.fill.solid();q.fill.fore_color.rgb=color(fill)
 q.line.color.rgb=color(line);q.line.width=Pt(line_width)
 if radius:
  try:q.adjustments[0]=0.12
  except Exception:pass
 return q

def text(s,x,y,w,h,content,size=21,bold=False,fill='ink',align=PP_ALIGN.LEFT):
 q=s.shapes.add_textbox(Inches(x),Inches(y),Inches(w),Inches(h));tf=q.text_frame
 tf.clear();tf.word_wrap=True;tf.margin_left=0;tf.margin_right=0;tf.margin_top=0;tf.margin_bottom=0
 for i,line in enumerate(str(content).split('\n')):
  p=tf.paragraphs[0] if i==0 else tf.add_paragraph();p.text=line;p.alignment=align;p.space_after=Pt(0);p.line_spacing=1.05
  for run in p.runs:run.font.name=FONT;run.font.size=Pt(size);run.font.bold=bold;run.font.color.rgb=color(fill)
 return q

def line(s,x1,y1,x2,y2,fill='ink',width=1.7,dash=False):
 q=s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT,Inches(x1),Inches(y1),Inches(x2),Inches(y2));q.line.color.rgb=color(fill);q.line.width=Pt(width)
 if dash:
  from pptx.enum.dml import MSO_LINE_DASH_STYLE
  q.line.dash_style=MSO_LINE_DASH_STYLE.DASH
 return q

def arrow(s,x1,y1,x2,y2,fill='ink',width=1.7,dash=False):
 q=line(s,x1,y1,x2,y2,fill,width,dash)
 from pptx.oxml.xmlchemy import OxmlElement
 end=OxmlElement('a:tailEnd');end.set('type','triangle');end.set('w','sm');end.set('len','sm');q.line._get_or_add_ln().append(end)
 return q

def pill(s,x,y,w,label,fill='mint',size=16):
 rect(s,x,y,w,.38,fill,line=fill,radius=True,line_width=.5)
 text(s,x+.1,y+.045,w-.2,.3,label,size=size,bold=True)

def bulletbox(s,x,y,w,h,title,items,fill='paper',size=20):
 rect(s,x,y,w,h,fill)
 text(s,x+.22,y+.2,w-.44,.45,title,size=22,bold=True)
 yy=y+.85
 step=(h-.99)/len(items)
 for item in items:
  text(s,x+.24,yy,.22,.3,'•',size=size,bold=True)
  q=text(s,x+.57,yy,w-.8,.84,item,size=size)
  lines=max(1,len(item)//max(15,int(w*5.3))+1)
  yy+=step
 return q

def picture(s,path,x,y,w,h,fit='contain',crop_top=None,crop_bottom=None):
 if not path or not Path(path).is_file():
  rect(s,x,y,w,h,'pale');text(s,x+.25,y+.3,w-.5,h-.6,'Screenshot wird beim Build ergänzt',20);return None
 path=Path(path);im=Image.open(path);iw,ih=im.size
 if crop_top is not None or crop_bottom is not None:
  ct=crop_top or 0;cb=crop_bottom or 0
  pic=s.shapes.add_picture(str(path),Inches(x),Inches(y),width=Inches(w),height=Inches(h));pic.crop_top=ct;pic.crop_bottom=cb
  return pic
 if fit=='cover':
  r=max(w/iw,h/ih);nw,nh=iw*r,ih*r
  pic=s.shapes.add_picture(str(path),Inches(x),Inches(y),width=Inches(w),height=Inches(h))
  pic.crop_left=pic.crop_right=max(0,(nw-w)/(2*nw));pic.crop_top=pic.crop_bottom=max(0,(nh-h)/(2*nh));return pic
 ratio=min(w/iw,h/ih);nw,nh=iw*ratio,ih*ratio
 return s.shapes.add_picture(str(path), Inches(x+(w-nw)/2), Inches(y+(h-nh)/2), width=Inches(nw),height=Inches(nh))

def card_node(s,x,y,w,h,title,detail='',fill='mint',title_size=19):
 rect(s,x,y,w,h,fill)
 text(s,x+.14,y+.14,w-.28,.58,title,title_size,True)
 if detail:text(s,x+.14,y+.78,w-.28,h-.87,detail,18)

def entity(s,x,y,w,h,name,fields,fill='paper',font=18):
 rect(s,x,y,w,h,fill)
 rect(s,x,y,w,.44,'mint',line='ink',radius=False,line_width=.6)
 text(s,x+.12,y+.07,w-.24,.32,name,18,True)
 text(s,x+.12,y+.57,w-.24,h-.6,'\n'.join(fields),font)

def seq(s,actors,steps,y=1.7,x=.7,w=11.9,bottom=6.6):
 xs=[x+i*w/(len(actors)-1) for i in range(len(actors))]
 for a,xx in zip(actors,xs):
  rect(s,xx-.91,y,1.82,.64,'mint');text(s,xx-.86,y+.12,1.72,.4,a,18,True,align=PP_ALIGN.CENTER)
  line(s,xx,y+.65,xx,bottom,'line',1.1,True)
 yy=y+1.0
 for a,b,label,note in steps:
  aa,bb=xs[a],xs[b]
  if a==b:
   rect(s,aa-.95,yy-.03,1.9,.40,'pale',line='line');text(s,aa-.89,yy+.01,1.78,.31,label,18,align=PP_ALIGN.CENTER)
  else:
   arrow(s,aa,yy+.29,bb,yy+.29,'ink',1.8)
   tx=min(aa,bb)+.11;tw=abs(aa-bb)-.22
   text(s,tx,yy-.18,tw,.43,label,18,True)
  if note:text(s,.82,yy+.39,11.6,.35,note,17,fill='muted')
  yy+=.89


def build(args):
 ASSETS.mkdir(parents=True,exist_ok=True)
 status_file=ASSETS/'submission-status.json'
 if not status_file.exists():status_file.write_text(json.dumps(STATUS_DEFAULT,ensure_ascii=False,indent=2)+'\n')
 status={**STATUS_DEFAULT,**json.loads(status_file.read_text())}
 candidates={
  'worlds.png':[str(ROOT/'notification-ninja/assets/indie-worlds.png')],
  'hub.png':['/tmp/ninja-313-final-native/1280-en-relaxed-hub.png','/tmp/ninja-313-resumed-native/1280-de-relaxed-hub.png','/tmp/ninja-313-native-final/1280-de-relaxed-hub.png'],
 }
 for name,paths in candidates.items():
  for source in paths:
   if Path(source).is_file():copyfile(source,ASSETS/name);break
 pr=Presentation();pr.slide_width=Inches(W);pr.slide_height=Inches(H)
 pr.core_properties.title='Notification Ninja – Projektabgabe 3'
 pr.core_properties.subject='Medizinische Informatik: Soll/Ist, Software Engineering, ERD und Testnachweise'
 pr.core_properties.author='Projektgruppe PG1'
 pr.core_properties.keywords='Notification Ninja, PG1, Projektabgabe 3, UML, ERD, Tests'
 notes=[]
 def slide(title,kicker='PROJEKTABGABE 3',source='technical-documentation.md'):
  s=pr.slides.add_slide(pr.slide_layouts[6]);s.background.fill.solid();s.background.fill.fore_color.rgb=color('cream')
  rect(s,0,0,.14,H,'mint',line='mint',radius=False)
  pill(s,.6,.35,6.95,kicker,'mint',14)
  header_font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',100)
  header_size=min(31, 12.0*72*100/max(header_font.getlength(title),1))
  text(s,.6,.99,12.1,.70,title,header_size,True)
  line(s,.6,1.69,12.75,1.69,'line',1)
  idx=len(pr.slides)
  text(s,.63,7.08,11.6,.2,f'PG1 · Notification Ninja · {status["date"]} · {source}',10,fill='muted')
  text(s,12.18,7.02,.55,.3,f'{idx:02d}',14,True,align=PP_ALIGN.RIGHT)
  rect(s,.6,7.38,(W-1.2)*idx/14,.045,'mint',line='mint',radius=False,line_width=0)
  return s
 def note(s,body):
  s.notes_slide.notes_text_frame.text=body;notes.append(body)

 # 1 — Concrete title and genuine UI.
 s=slide('Ein kleiner Cut. Ein bisschen mehr Fokus.','MED. INFO · PG1','Quellen: Repository und gespeicherte Prüfberichte')
 text(s,.65,2.00,6.1,.72,'Notification Ninja',36,True)
 text(s,.68,2.93,5.55,1.02,'Ein Browser-Spiel über bewusste\nEntscheidungen im digitalen Alltag.',23)
 pill(s,.68,4.22,5.65,'Soll / Ist · Architektur · Daten · Tests','pale',16)
 text(s,.68,5.03,5.7,.9,'26W-B5-Telehealth\nProjektabgabe 3 · Kurzpräsentation',20)
 text(s,.68,6.15,5.6,.7,'Abgabe: 26. November 2026, 21:00 Uhr\nZeitzone: Europa/Wien',18,fill='muted')
 picture(s,ASSETS/'hub.png',6.65,1.96,6.03,4.96,crop_top=0,crop_bottom=.205)
 note(s,'Dauer ca. 30 Sekunden. Wir stellen den aktuellen Stand von Notification Ninja vor. Das Spiel übt den Umgang mit Ablenkungen durch kontextabhängige Entscheidungen. Die Präsentation trennt den veröffentlichten Ausgangsstand 3.12.0 vom auf main eingecheckten Basisstand 3.13.0 und der veröffentlichten Version 3.13.1. Die finale CI und öffentliche Versionsprüfung des Quellstands 6878dd4 sind bestanden. Die reale Zwei-Konten-/Neustartprüfung des unveränderten Kontenbackends bleibt dem gesondert belegten Quellstand ed1bf5a zugeordnet. PG1 ist die übermittelte Gruppenzuordnung; Namen und Aufgaben einzelner Teammitglieder wurden nicht erfunden. Alle gezeigten Spielbilder stammen aus dem tatsächlichen Projekt.')

 # 2 — Scenario and gameplay concept.
 s=slide('Ein Inhalt ist nur im passenden Moment hilfreich.','01 · PROBLEM UND KONZEPT','src/game.js · src/journey.js · src/adventure.js')
 for x,title,body,fill,crop in [(.65,'Lernen','Aufgabe schützen.\nAblenkung schneiden.','pale',(.5,0,.10,.60)),(4.85,'Gaming','Wichtiges durchlassen.\nBewusst Grenzen setzen.','blue',(0,.5,.10,.60)),(9.05,'Schlafen','Zur Ruhe kommen.\nNächtliches filtern.','pink',(0,.5,.60,.10))]:
  rect(s,x,1.98,3.62,2.91,fill)
  pic=picture(s,ASSETS/'worlds.png',x+.12,2.11,3.38,1.30)
  if pic:
   pic.crop_left,pic.crop_right,pic.crop_top,pic.crop_bottom=crop
   pic.width=Inches(3.38);pic.height=Inches(1.30);pic.left=Inches(x+.12);pic.top=Inches(2.11)
  text(s,x+.22,3.61,3.18,.45,title,23,True)
  text(s,x+.22,4.19,3.18,.60,body,18)
 rect(s,.65,5.14,12.02,.88,'mint')
 text(s,.91,5.29,11.48,.64,'Kontext lesen  →  wischen oder durchlassen  →  Feedback\nPause und bewusstes Aufhören bleiben Teil des Spiels.',20,True,align=PP_ALIGN.CENTER)
 text(s,.78,6.25,11.7,.52,'Ziel: spielerische Reflexion über digitale Balance. Eine klinische Wirkung oder therapeutische Eignung wurde nicht nachgewiesen.',18,fill='muted')
 note(s,'Dauer ca. 35 Sekunden. Unser Beispiel ist eine lernende Person, die nicht alle Benachrichtigungen gleich behandeln sollte. Derselbe Inhalt kann in einem anderen Kontext wichtig sein. Deshalb liest man zuerst das Ziel, schneidet Ablenkungen und lässt hilfreiche Hinweise durch. Die drei Räume sind Lernen, Gaming und Schlafen; Balance Master kombiniert sie. NIM begleitet die Einführung. Wir stellen keine medizinische Wirksamkeit in Aussicht. Bewusstes Beenden ist ausdrücklich ein positiver Bestandteil und kein Scheitern.')

 # 3 — Status that remains honest while release proceeds.
 s=slide('Vom geplanten Umfang zum belegten Stand.','02 · SOLL / IST','FULL_GAME_AUDIT.md · EXPANSION_3_13.md')
 rows=[
 ('Spiel und Karriere','18 Hauptmissionen + 8 Herausforderungen','Nativ vollständig durchgespielt*'),
 ('Konten und Daten','Login, Profile, Wallet, Inventar','SQLite + PostgreSQL geprüft'),
 ('Geprüfter Wettbewerb','Open Run ohne gekaufte Vorteile','Server-Replay; neuer Run automatisch'),
 ('Neue Gestaltung','DE/EN, mobil, drei Designvarianten','1.368 Seitenzustände geprüft'),
 ('Erweiterung 3.13.1','18 Fähigkeiten · 6 Supers · 36 Erfolge','591 Repositorytests bestanden'),
 ('Öffentlicher Betrieb','Neue Adresse · Konten · Neustart','Online-Neustart bestanden'),
 ]
 for i,(a,b,c) in enumerate(rows):
  yy=2.00+i*.68;rect(s,.65,yy,12.03,.65,'paper' if i%2==0 else 'pale',line='line',radius=False,line_width=.5)
  text(s,.83,yy+.06,2.60,.51,a,18,True);text(s,3.55,yy+.06,5.05,.51,b,18);text(s,8.76,yy+.06,3.73,.51,c,18)
 text(s,.78,6.30,11.8,.64,f'{status["release"]}\n*Historischer nativer Karriere-Durchlauf vom 17. November; neue Integration separat geprüft.',18,fill='muted')
 note(s,'Dauer ca. 40 Sekunden. Die Tabelle zeigt den Unterschied zwischen implementiert, tatsächlich getestet und öffentlich freigegeben. Der historische Durchlauf hat alle 26 Karriereaufgaben ohne geschenkte Fortschritte abgeschlossen. Der abschließende Seitenrundgang hat 1.368 Zustände bei zwei Breiten und zwei Sprachen bestanden. Die separate Designmatrix umfasst 132 Ansichten in drei Designs; 60 zusätzliche Abläufe prüfen aufklappbare Details. Die neue Erweiterung besitzt 18 Fähigkeiten einschließlich sechs Supers sowie 36 Erfolge. Zwei öffentliche Testkonten haben die vorbereitete Prüfung nach einem separat belegten Render-Neustart bestanden und wurden anschließend entfernt. Die abschließende CI, die öffentlichen API-/Gastprüfungen und die Bytegleichheit von neun ausgelieferten Dateien sind für 6878dd4 erfolgreich belegt. Die genaue Versions- und Freigabeinformation liegt im Erweiterungsbericht.')

 # 4 — Visible player flow.
 s=slide('Ein Einstieg, ein Hub, eine klare nächste Entscheidung.','03 · SZENARIEN UND NAVIGATION','src/home.js · src/main.js · src/accounts.js')
 card_node(s,.73,2.20,2.03,1.10,'Homepage','',fill='paper',title_size=19)
 card_node(s,3.26,1.98,2.50,1.40,'Gast starten','Fortschritt auf Gerät','pale',20)
 card_node(s,3.26,4.01,2.50,1.55,'Konto anmelden','Privates Profil,\nServerfortschritt','blue',20)
 card_node(s,6.26,2.83,2.16,1.52,'Ninja-Hub','Mission +\nSpielen','mint',20)
 card_node(s,8.95,1.98,3.58,1.40,'Spielen','Welt + Modus wählen','paper',22)
 card_node(s,8.95,4.05,3.58,1.51,'Ergebnis','Feedback; Belohnung\nausdrücklich abholen','gold',22)
 arrow(s,2.76,2.74,3.26,2.66);arrow(s,2.76,2.90,3.26,4.68);arrow(s,5.76,2.72,6.26,3.30);arrow(s,5.76,4.65,6.26,3.93);arrow(s,8.42,3.30,8.95,2.72);arrow(s,10.74,3.38,10.74,4.05)
 text(s,.78,6.12,11.9,.58,'Alternativen: überspringbares Intro, Training ohne Zeitdruck, NIMs Fokuspfad und Pausenmenü.',19,fill='muted')
 note(s,'Dauer ca. 35 Sekunden. Szenario eins: Eine neue Person probiert das Spiel als Gast und beginnt mit Einführung oder Training. Szenario zwei: Eine registrierte Person meldet sich auf einem anderen Gerät an und erhält ihren serverseitigen Fortschritt. Im Hub gibt es einen dominanten Spielen-Button. Welten und Modi sind gemeinsam erreichbar. Nach einem Lauf sieht man Ergebnis und Rückblick; einmalige Belohnungen werden bewusst abgeholt. Spielstände und Navigationszustände bleiben bei normalen Übergängen erhalten.')

 # 5 — Use case diagram, actual system roles.
 s=slide('Use Cases trennen Gast, Konto und Betreiber-Testrolle.','04 · SOFTWARE ENGINEERING','diagrams/02-use-cases.mmd · technische Dokumentation')
 rect(s,3.06,1.96,7.21,4.76,'paper')
 text(s,3.31,2.12,6.7,.4,'System: Notification Ninja',22,True,align=PP_ALIGN.CENTER)
 def actor(x,y,label):
  o=s.shapes.add_shape(MSO_SHAPE.OVAL,Inches(x+.39),Inches(y), Inches(.37), Inches(.37));o.fill.solid();o.fill.fore_color.rgb=color('mint');o.line.color.rgb=color('ink')
  line(s,x+.58,y+.37,x+.58,y+.98);line(s,x+.20,y+.57,x+.96,y+.57);line(s,x+.58,y+.98,x+.25,y+1.36);line(s,x+.58,y+.98,x+.90,y+1.36)
  text(s,x-.35,y+1.48,1.9,.65,label,18,True,align=PP_ALIGN.CENTER)
 def uc(x,y,w,label,fill='pale'):
  q=s.shapes.add_shape(MSO_SHAPE.OVAL,Inches(x),Inches(y),Inches(w),Inches(.71));q.fill.solid();q.fill.fore_color.rgb=color(fill);q.line.color.rgb=color('ink');text(s,x+.12,y+.18,w-.24,.44,label,18,align=PP_ALIGN.CENTER)
 actor(1.0,2.41,'Gast');actor(11.18,2.41,'Kontospieler');actor(1.0,4.75,'Admin-Testkonto')
 uc(3.55,2.94,2.7,'Üben und spielen');uc(6.93,2.94,2.75,'Konto verwalten','blue')
 uc(3.55,4.05,2.7,'Looks ansehen');uc(6.93,4.05,2.75,'Käufe / Fortschritt','blue')
 uc(3.55,5.17,2.7,'Testkäufe spielen','gold');uc(6.93,5.17,2.75,'Auto-Wertung','blue')
 line(s,2.05,3.12,3.55,3.30);line(s,2.05,3.35,3.55,4.40);line(s,11.37,3.13,9.68,3.30);line(s,11.37,3.40,9.68,4.41);line(s,11.37,3.61,9.68,5.52);line(s,2.05,5.77,3.55,5.52)
 text(s,3.37,6.18,6.6,.35,'Admin: kein Ranglisten- oder Podiumsrecht.',18,True,fill='muted',align=PP_ALIGN.CENTER)
 note(s,'Dauer ca. 35 Sekunden. Das Diagramm zeigt die wichtigsten Systemrollen; das sind keine erfundenen Zuständigkeiten einzelner Teammitglieder. Gäste können ohne Anmeldung üben, spielen und Looks ansehen. Kontospieler erhalten die abgesicherten Serveraktionen für Käufe, Fortschritt und Ranglisten. Das Admin-Testkonto besitzt ein serverseitiges Testbudget, verwendet aber weiterhin echte Kauf- und Missionsregeln. Es ist ausdrücklich von Wettbewerb und Wochenprämien ausgeschlossen. Die vereinfachte Folie zeigt die wichtigsten Zuordnungen; Kontospieler und Admin können ebenfalls die allgemeinen Spiel- und Übungsfunktionen verwenden. Vollständige Use-Case-Quellen liegen als Mermaid vor.')

 # 6 — Architecture, actual interfaces.
 s=slide('Gemeinsame Spielregeln, zwei Speicheradapter.','05 · IMPLEMENTIERUNG UND SCHNITTSTELLEN','server/ninja-service.mjs · ninja-game-service.mjs · Store-Adapter')
 card_node(s,.72,2.17,3.40,2.37,'Browser / Canvas','DE/EN-Oberfläche\nMaus und Touch\nLokales Gastprofil','pale',21)
 card_node(s,4.97,2.17,3.40,2.37,'Node.js 24','API v3: Auth + Replay\nGemeinsame Spielregeln\nTransaktionen','mint',21)
 card_node(s,9.20,2.17,3.40,2.37,'Dauerhafte Daten','PostgreSQL für Onlinekonten\nSQLite lokal\nMigrationen / Constraints','blue',21)
 arrow(s,4.12,3.15,4.97,3.15);arrow(s,8.37,3.15,9.20,3.15)
 text(s,4.10,3.44,.9,.72,'HTTPS\nJSON',17,True,align=PP_ALIGN.CENTER)
 rect(s,.72,4.82,11.88,1.55,'paper')
 text(s,.98,5.03,11.39,.38,'Wichtige Schnittstellen',22,True)
 text(s,.98,5.56,11.37,.57,'/auth/*  ·  /me  ·  /actions  ·  /runs/start  ·  /runs/:id/finish\n/runs/:id/publish  ·  /leaderboard?period=week',19)
 note(s,'Dauer ca. 40 Sekunden. Die Darstellung folgt dem echten Code: Ein statisches JavaScript-Frontend nutzt Canvas für das Spiel. Das Node-24-Backend bietet die API v3. Spielregeln und Kataloge werden sowohl im Browser als auch zur Serverprüfung verwendet. Der PostgreSQL-Adapter ist für dauerhafte Online-Daten vorgesehen; SQLite bleibt lokal verfügbar. Beide verwenden Migrationen und Constraints. Kontositzungen werden als opaque Bearer-Token nur im sessionStorage des Tabs gehalten. Der Server speichert Token-Hashes. Ein Gastprofil ist davon getrennt.')

 # 7 — Authentication sequence.
 s=slide('Anmeldung: Geheimnisse bleiben außerhalb des Profils.','06 · SEQUENZ: AUTHENTIFIZIERUNG','src/accounts.js · server/ninja-auth.mjs · Store-Adapter')
 seq(s,['Browser','API / Auth','Datenbank'],[
 (0,1,'POST /auth/login','Name und Passwort; Transport nur über HTTPS im Betrieb.'),
 (1,2,'Nutzer und Passwort-Hash lesen','scrypt mit individuellem Salt; keine Klartextpasswörter in der Datenbank.'),
 (1,1,'Hash prüfen','Optionaler MFA-Zwischenschritt: Challenge → TOTP / Wiederherstellungscode.'),
 (1,2,'Sitzungshash speichern','Ablaufzeit und Nutzerbezug werden serverseitig geprüft.'),
 (1,0,'Token + Profil + Revision','Browser hält das Token im sessionStorage; Logout widerruft die Sitzung.'),
 ],x=1.22,w=10.82,bottom=6.8)
 note(s,'Dauer ca. 40 Sekunden. Bei der Registrierung kommen Benutzername, private E-Mail, Passwortbestätigung und Datenschutz-Zustimmung hinzu. Die Anmeldung prüft den scrypt-Hash. Bei aktivierter Zwei-Faktor-Authentifizierung wird zunächst eine kurzlebige Challenge statt einer Sitzung ausgegeben. Erst nach erfolgreicher Prüfung entsteht die Sitzung. Auf dem Server liegt nur der Token-Hash, im Browser nur das Token im Tab-Speicher. Wiederherstellungscodes sind einmalig; Logout und Kontolöschung werden tatsächlich serverseitig ausgeführt.')

 # 8 — Transaction sequence.
 s=slide('Ein Kauf wird einmal und vollständig verbucht.','07 · SEQUENZ: WIRTSCHAFTSSYSTEM','server/ninja-game-service.mjs · ninja_ledger · ninja_actions')
 seq(s,['Basar','Service','Datenbank'],[
 (0,1,'POST /actions','Kaufart + bekannte Inhalt-ID + Idempotenzschlüssel; kein behaupteter Preis.'),
 (1,2,'Transaktion starten','Katalogpreis, Voraussetzungen, Besitz und Wallet werden geprüft.'),
 (1,2,'Wallet + Besitz + Ledger ändern','Ein zusammengehöriger Commit; Fehler führen zum Rollback.'),
 (1,2,'Antwort zum Schlüssel speichern','Wiederholung derselben Aktion zahlt nicht nochmals aus.'),
 (1,0,'Profil + aktuelle Revision','Neue Käufe gelten ab der nächsten normalen Runde; Wettbewerb bleibt fair.'),
 ],x=1.22,w=10.82,bottom=6.8)
 note(s,'Dauer ca. 40 Sekunden. Der Browser nennt die gewünschte bekannte Inhaltskennung, aber bestimmt weder Preis noch Guthaben. Der Server prüft Voraussetzungen und vorhandenen Besitz. Wallet, Inventar im validierten Profil und Ledger werden innerhalb derselben Transaktion verändert. Idempotenzschlüssel verhindern doppelte Käufe oder Belohnungen bei Wiederholung. PostgreSQL verwendet serialisierbare Transaktionen mit begrenzten Wiederholungen; SQLite hat denselben fachlichen Vertrag. Administrative Testmittel werden ebenfalls nur serverseitig aus einer vertrauenswürdigen Rolle abgeleitet.')

 # 9 — Verified score sequence.
 s=slide('Ranglisten übernehmen keine vom Client behaupteten Punkte.','08 · SEQUENZ: GEPRÜFTER OPEN RUN','server/ninja-game-service.mjs · src/game.js · API v3')
 seq(s,['Browser','API / Replay','Datenbank'],[
 (0,1,'POST /runs/start','Server erzeugt konto- und seedgebundenen Lauf mit Startsnapshot.'),
 (1,0,'Lauf-ID + Startdaten','Drei Herzen, kein Zeitlimit; keine gekauften Wettbewerbsvorteile.'),
 (0,1,'POST /runs/:id/finish','Begrenztes Eingabeprotokoll; Server simuliert dieselben Regeln erneut.'),
 (1,2,'Geprüftes Ergebnis speichern','Nur regelgerecht beendete Open Runs können gewertet werden.'),
 (0,1,'POST /runs/:id/publish','Neuer gültiger Kontorun automatisch; Gäste und Admin-Testkonten ausgeschlossen.'),
 ],x=1.22,w=10.82,bottom=6.8)
 note(s,'Dauer ca. 40 Sekunden. Der Seed und der Startzustand stammen vom Server. Der Browser protokolliert begrenzte Eingaben; die API berechnet das Ergebnis mit denselben Regeln erneut. Sie übernimmt keine frei eingesendete Punktzahl. Nur echte, durch verbrauchte Herzen beendete Open Runs sind für die Rangliste freigegeben. Bewusste Abbrüche und Gäste bleiben ungewertet. Seit 3.13.1 werden neue geeignete Kontorunden nach einem Hinweis vor dem Start automatisch eingetragen. Der Browser verwendet weiterhin den geschützten Veröffentlichungspfad. Eine kontogetrennte Warteschlange hält ausschließlich Run-IDs für Wiederholungen fest und scannt keine historischen Resultate. Diese Replay-Prüfung verhindert einfache Scorefälschung, ist aber keine vollständige Abwehr gegen automatisiertes Spielen.')

 # 10 — Core ERD.
 s=slide('ERD 1/2: Konto, Sitzung und validiertes Profil.','09 · DATENBANKDESIGN','diagrams/07-erd-konten-spiel.mmd · Store-Schemata')
 entity(s,.72,2.05,3.35,1.57,'sessions',['PK token_hash','FK user_id · expires_at'],'blue')
 entity(s,.72,4.62,3.35,1.70,'ninja_mfa_challenges',['PK challenge_hash','FK user_id · attempts'],'blue')
 entity(s,5.02,2.86,3.28,2.42,'users',['PK id','UQ username_key','UQ email','password_hash','recovery_hash'],'mint')
 entity(s,9.22,2.05,3.35,1.71,'profiles',['PK/FK user_id','data: JSON-TEXT','revision · run_sequence'],'pale')
 entity(s,9.22,4.62,3.35,1.70,'ninja_mfa',['PK/FK user_id','secret · recovery_hashes'],'pink')
 arrow(s,5.02,3.35,4.07,2.92);arrow(s,5.02,4.55,4.07,5.15);arrow(s,8.30,3.35,9.22,2.92);arrow(s,8.30,4.55,9.22,5.15)
 text(s,4.11,2.87,.77,.33,'1 : n',17,True);text(s,4.12,5.16,.77,.33,'1 : n',17,True);text(s,8.36,2.87,.8,.33,'1 : 1',17,True);text(s,8.36,5.16,.87,.34,'1:0..1',16,True)
 text(s,.80,6.52,11.7,.33,'Inventar und Fortschritt liegen im normalisierten Profil; die Wallet ist separat maßgeblich.',18,fill='muted')
 note(s,'Dauer ca. 40 Sekunden. Die zentrale Entität ist users. Ein Konto kann mehrere Sitzungen und MFA-Challenges haben; Profil und Wallet sind jeweils eins zu eins zugeordnet. MFA ist optional. Das Profil ist bewusst ein validiertes JSON-Objekt in einer TEXT-Spalte, keine frei editierbare Sammlung beliebiger Eigenschaften. Inventar und Karrierefortschritt besitzen deshalb keine künstlich erfundene relationale Inventartabelle. Passwörter und Wiederherstellungsschlüssel liegen als Hash vor; MFA-Geheimnisse sind geschützt. Detaillierte Kardinalitäten und weitere Felder stehen im vollständigen ERD.')

 # 11 — Economy / competition ERD.
 s=slide('ERD 2/2: Autoritative Wallet und eingefrorenes Podium.','10 · DATENBANKDESIGN','diagrams/08-erd-wettbewerb-migration.mmd · ninja-competition.mjs')
 entity(s,.72,2.05,3.39,1.43,'wallets',['PK/FK user_id','balance'],'gold')
 entity(s,4.97,2.05,3.39,1.43,'ninja_ledger',['PK id · FK user_id','UQ user + reference'],'paper')
 entity(s,9.22,2.05,3.39,1.43,'ninja_actions',['PK (user_id, key)','body_hash · response'],'paper')
 entity(s,.72,4.10,3.39,1.56,'ninja_runs',['PK id · FK user_id','seed · status · response'],'blue')
 entity(s,4.97,4.10,3.39,1.56,'ninja_verified_scores',['PK/FK run_id · FK user_id','score · duration · ruleset'],'blue')
 entity(s,9.22,4.10,3.39,1.56,'ninja_podium_rewards',['PK (week_start, place)','FK week_start · FK user_id'],'mint')
 arrow(s,4.11,4.89,4.97,4.89);text(s,4.13,4.47,.82,.35,'1:0..1',14,True)
 text(s,.82,6.06,11.75,.79,'Weitere Tabellen: ninja_podium_weeks, ninja_admin_accounts und Wettbewerbs-Einstellungen.\nPodium: 100 / 60 / 30 Münzen; pro Konto und UTC-Woche höchstens eine Prämie.',18,fill='muted')
 note(s,'Dauer ca. 40 Sekunden. Diese zweite Sicht ergänzt Wirtschaft und Wettbewerb. Die Wallet ist die autoritative Geldquelle; Ledgerreferenzen und Aktionsschlüssel sind eindeutig. Ein Run kann höchstens einen verifizierten Score erzeugen. Podiumsplätze werden nach dem UTC-Wochenwechsel transaktional eingefroren. Rewards referenzieren Woche und Konto. Die gespeicherte run_id im Reward ist eine historische Snapshot-Angabe und absichtlich kein Fremdschlüssel. Die vollständige Quelle enthält außerdem Wettbewerbs-Einstellungen und die getrennte Admin-Rollentabelle. Drei technische Migrationstabellen verwalten das Schema; sie sind keine fachlichen Spielobjekte.')

 # 12 — Changes and design evidence.
 s=slide('Änderungen am Konzept erhalten Daten und klare Rollen.','11 · KONZEPTÄNDERUNGEN','EXPANSION_3_13.md · src/bazaar-ui.js · src/skin-presentation.js')
 bulletbox(s,.72,2.05,5.82,3.73,'Bewusst geändert',[
 'Ranglistenserver → Konto-API mit PostgreSQL.',
 'Fähigkeiten in den Basar; 18 Techniken und sechs Supers.',
 'Zwölf Looks mit fünf Seltenheiten; neue eigene Illustrationen.'
 ],'pale',20)
 bulletbox(s,6.85,2.05,5.76,3.73,'Bewusst erhalten',[
 'Spielstände, Inhalt-IDs, Preise und alter Besitz.',
 'Gastprofil und Kontoguthaben bleiben getrennt.',
 'Serverrolle zum Testen; keine Ranglisten oder Wochenprämien.'
 ],'paper',20)
 rect(s,.72,6.04,11.89,.66,'mint')
 text(s,.96,6.19,11.4,.35,'Aktive Spielzeit + freiwillige Pausen. Keine Belohnung fürs Onlinebleiben.',18,True)
 note(s,'Dauer ca. 35 Sekunden. Im ursprünglichen Bestand war der externe Dienst lediglich ein Ranglistenserver. Das weiterentwickelte Konzept ergänzt sichere Konten und dauerhafte Daten. In der Gestaltung werden Spielwelten und Modi gemeinsam zugänglich; Fähigkeiten sind Teil des Basars. Seltenheit ist rein kosmetisch und wird nicht nur durch Farbe erklärt. Bestandsdaten werden nicht gelöscht und lokale Gastmünzen werden nicht zu verifizierten Kontomitteln. Spielzeit zählt ausschließlich aktive sichtbare Runden auf dem Gerät; Pausenerinnerungen sind freiwillig und geben keine Belohnung für längere Bindung.')

 # 13 — Test concept and actual results.
 s=slide('Testen heißt: Regeln, echte Bedienung und Persistenz.','12 · FUNKTIONALES TESTEN','FULL_GAME_AUDIT.md · EXPANSION_3_13.md · tests/ninja*.test.mjs')
 bulletbox(s,.72,2.05,5.77,3.63,'Testkonzept',[
 'Positive und negative Fälle: Login, Rollen, Käufe, doppelte Claims.',
 'Zwei Konten; Prozessneustart; bereinigte Testdaten.',
 '1.368 DE/EN-Zustände; zusätzliche Design- und Detailmatrix.'
 ],'paper',20)
 bulletbox(s,6.81,2.05,5.80,3.63,'Bereits belegte Ergebnisse',[
 f'{status["test_count"]} automatisierte Tests: 0 Fehler, 0 übersprungen.*',
 '18 Haupt- und 8 Zusatzmissionen nativ abgeschlossen (17.11.).',
 'Alle drei neuen Supers nativ geladen und aktiviert (18.11.).'
 ],'mint',20)
 text(s,.81,5.99,11.85,.87,f'*{status["test_qualifier"]}.\nAutomatisierte Funktionstests ersetzen keine Verständlichkeitsprüfung mit echten Spielenden.',18,fill='muted')
 note(s,'Dauer ca. 45 Sekunden. Das Testkonzept kombiniert Modell- und Sicherheitstests mit HTTP-Integration und echter Browserbedienung. Besonders relevant sind negative Fälle: gefälschte Rollen, doppelte Belohnungen und unzureichendes Guthaben. Zwei unabhängige Konten prüfen Trennung und Persistenz nach einem echten Prozessneustart. Historisch wurden alle 26 Karriereaufgaben nativ durchgespielt. Die neuen Supers wurden über echte Entscheidungen aufgeladen und mit ihren sichtbaren Buttons ausgelöst. Die finale automatisierte Gesamtsuite am 25. November mit echtem lokalem PostgreSQL besteht aus 591 bestandenen Repositorytests. Dazu kommen 1.368 Seitenzustände und 60 kurze Detailabläufe. Zwei native Kontorunden bestätigen automatische Veröffentlichung ohne zusätzlichen Klick; 216 isolierte HUD-Fälle prüfen lange Werte und Lesbarkeit. Die neue Browsermatrix und die bestandene öffentliche Zwei-Konten-/Neustartprüfung bleiben getrennte Nachweise. Eine Bot-Abnahme belegt Funktion, nicht die intuitive Verständlichkeit für Jugendliche.')

 # 14 — Concrete acceptance plan and missing user evidence.
 s=slide('Bis zur Abgabe: nachvollziehbar abschließen.','13 · PLAN UND OFFENE PUNKTE','Abgabeanforderung · EXPANSION_3_13.md')
 for x,num,title,body,fill in [(.72,'1','Build & Tests','591 Tests und 1.368 Seitenzustände bestanden. Finale CI grün.','mint'),(4.83,'2','Online-Nachweis','Konten, Neustart und Löschung belegt. Öffentliche Version geprüft.','blue'),(8.94,'3','Abgabepaket','Gruppennamen, Vortragende und echte Pre-Testprotokolle ergänzen.','gold')]:
  rect(s,x,2.13,3.66,3.10,fill);pill(s,x+.23,2.35,.50,num,'paper',18);text(s,x+.23,3.0,3.20,.48,title,22,True);text(s,x+.23,3.65,3.20,1.40,body,18)
 rect(s,.72,5.51,11.88,1.06,'paper')
 text(s,.98,5.69,11.33,.36,'Weihnachtssession: Echte Pre-Testprotokolle fehlen noch.',18,True)
 text(s,.98,6.12,11.31,.35,'Dieses Paket ist vorbereitet. Eine Moodle-Abgabe wurde nicht durchgeführt.',18,fill='muted')
 note(s,'Dauer ca. 35 Sekunden. Die nächsten Schritte sind klar getrennt. Build, finale CI und öffentliche Versionsprüfung sind erfolgreich abgeschlossen. Die öffentliche Zwei-Konten-/Neustartprüfung ist für ed1bf5a separat belegt; am Kontenbackend hat sich mit der abschließenden Oberflächenkorrektur nichts geändert. Für 6878dd4 bestätigen die öffentliche API-/Gastprüfung und neun SHA-256-Dateivergleiche den ausgelieferten Stand. Für die Lehrveranstaltungsabgabe müssen die tatsächlichen Gruppenmitglieder und Vortragenden ergänzt werden. Im Repository liegt kein Protokoll einer Weihnachtssession vor. Daher enthält das Paket ein Testkonzept und echte erste Ergebnisse, aber keine erfundenen Pre-Testergebnisse. Das Paket wurde nicht automatisch bei Moodle eingereicht. Abgabeschluss ist Donnerstag, der 26. November um 21 Uhr Wiener Zeit.')

 out=HERE/'slides.pptx';pr.save(out)
 # Ensure an actual editable deck, expected count, and no shapes outside slides.
 checked=Presentation(out)
 assert len(checked.slides)==14
 for i,sl in enumerate(checked.slides,1):
  for q in sl.shapes:
   assert q.left>=-Inches(.01) and q.top>=-Inches(.01),(i,q.name,'negative position')
   assert q.left+q.width<=checked.slide_width+Inches(.02),(i,q.name,'right overflow')
   assert q.top+q.height<=checked.slide_height+Inches(.02),(i,q.name,'bottom overflow')
 assert len([sl for sl in checked.slides if sl.notes_slide.notes_text_frame.text.strip()])==14
 pdf=HERE/'slides.pdf'
 if not args.skip_pdf:
  soffice=which('soffice') or which('libreoffice')
  if not soffice:raise SystemExit('PPTX created; LibreOffice is required for PDF export.')
  subprocess.run([soffice,'--headless','--convert-to','pdf','--outdir',str(HERE),str(out)],check=True,capture_output=True,text=True,timeout=180)
  assert pdf.is_file() and pdf.stat().st_size>10000
 readme='''# Projektabgabe 3 – Notification Ninja\n\n**Gruppe:** PG1 · **Lehrveranstaltung:** 26W-B5-Telehealth / Med. Info Projekt  \n**Abgabe:** Donnerstag, 26. November 2026, 21:00 Uhr (Europe/Vienna)  \n**Bearbeitungsstand:** '''+status['date']+'''\n\n## Dateien\n\n**Öffentliche Demo:** [Notification Ninja öffnen](https://notification-ninja-accounts.onrender.com/).\n\n- [slides.pptx](slides.pptx): bearbeitbare Kurzpräsentation mit 14 Folien und Sprechernotizen; etwa 8–10 Minuten.\n- [slides.pdf](slides.pdf): gleichlautende PDF zum schnellen Prüfen und Präsentieren.\n- [technical-documentation.pdf](technical-documentation.pdf): selbstständige PDF der Dokumentation mit Vektor-Diagrammanhang.
- [submission.zip](submission.zip): gesamtes Abgabepaket ohne Zugangsdaten oder interne temporäre Dateien.
- [technical-documentation.md](technical-documentation.md): technische Dokumentation mit Soll/Ist, Szenarien, Schnittstellen, ERD und Testkonzept.\n- [diagrams/](diagrams/): bearbeitbare Mermaid-Quellen; vollständige Modelle ergänzen die vereinfachten Foliengrafiken.\n- [build_submission.py](build_submission.py): lokaler Präsentationsbau mit [Build-Abhängigkeiten](requirements-build.txt).\n- [assets/submission-status.json](assets/submission-status.json): nur öffentliche Statusangaben, keine Zugangsdaten.\n\nDie Präsentation enthält tatsächliche Screenshots des lokalen Entwicklungskandidaten. Sie sind weder Design-Mock-ups noch ein öffentlicher Deploymentnachweis. Alle Diagramme und Texte sind bearbeitbar. Es wurden keine fremden geschützten Assets hinzugefügt. Die Spielgrafiken stammen aus dem Repository.\n\n## Was vor dem Einreichen ergänzt werden muss\n\n1. Tatsächliche Gruppenmitglieder, Vortragende und gegebenenfalls geforderte Hochschulvorlage ergänzen.\n2. Vorhandene **echte Protokolle der Weihnachtssession** beilegen. Im Repository sind keine entsprechenden Ergebnisse nachgewiesen; die Präsentation kennzeichnet diese Lücke ausdrücklich.\n3. Den tatsächlich erreichten Release-/Deploymentstand anhand des [Erweiterungsberichts](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/main/notification-ninja/EXPANSION_3_13.md) abgleichen. Lokale Tests dürfen nicht als öffentlicher Persistenznachweis ausgegeben werden.\n4. Folien und technische Dokumentation durchsehen und bei Moodle selbst einreichen. **Es wurde nichts bei Moodle hochgeladen.**\n\n## Nachweise und Grenzen\n\nDie historischen Karriere-/Modusläufe vom 17. November sind im [Spielaudit](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/main/notification-ninja/FULL_GAME_AUDIT.md) beschrieben. Die Erweiterung, ihre Integrationszwischenstände und abgeschlossenen Freigaben stehen im [Erweiterungsbericht](https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/main/notification-ninja/EXPANSION_3_13.md). Der Stand dieser Präsentation lautet:\n\n- '''+status['release']+'''\n- '''+str(status['test_count'])+''' bestandene automatisierte Tests, null Fehler, null übersprungen: '''+status['test_qualifier']+'''.\n- '''+status['public_status']+'''.\n- '''+status['commit']+'''.\n\nFunktionale Browserautomation ersetzt keine Tests mit echten Jugendlichen. Es wurden keine erfundenen Fragebögen, Teilnehmerzahlen, medizinischen Wirkungsnachweise oder Weihnachtssession-Ergebnisse aufgenommen. Eine physische iPhone-/Android-Abnahme und ein rechtlicher Datenschutzcheck sind gesonderte Aufgaben.\n\n## Lokal neu erzeugen\n\nBenötigt werden Python mit `python-pptx`, `Pillow` und `Markdown` sowie LibreOffice für den Folien-PDF-Export. Die Dokumentations-PDF benötigt Node.js und das bereits im Repository vorhandene Playwright mit Chromium. Aus dem Repository:\n\n```bash\npython3 -m pip install -r docs/projektabgabe-3/requirements-build.txt\npython3 docs/projektabgabe-3/build_submission.py\n```\n\nOhne LibreOffice kann die bearbeitbare Datei mit `--skip-pdf` erzeugt werden. Vorhandene Assets werden wiederverwendet; neue lokale QA-Screenshots werden, falls vorhanden, übernommen. Es erfolgen keine Netzwerkanfragen, keine Änderungen an Produktionsdaten und keine Übertragung privater Betreiberzugänge.\n\n## Sprechernotizen\n\n'''
 for i,body in enumerate(notes,1):readme+=f'### Folie {i}\n\n{body}\n\n'
 (HERE/'README.md').write_text(readme.replace('  \n', '<br>\n').rstrip()+'\n')
 if not args.skip_pdf and not args.skip_documentation:
  documentation_pdf()
  submission_zip()
 print(json.dumps({'slides':len(checked.slides),'pptx':str(out),'pdf':str(pdf) if pdf.exists() else None,'notes':14,'shapeBounds':'pass'},ensure_ascii=False))


def documentation_pdf():
 try:
  import markdown
 except ImportError:
  raise SystemExit('Install Python Markdown (e.g. python3 -m pip install Markdown) to export the technical document.')
 doc=HERE/'technical-documentation.md'
 if not doc.is_file():raise SystemExit('Technical documentation is not available yet.')
 body=markdown.markdown(doc.read_text(),extensions=['tables','fenced_code','sane_lists'])
 titles=['Systemkontext und Architektur','Use Cases','Registrierung und Anmeldung','Transaktionaler Kauf','Laufprüfung und Veröffentlichung','UTC-Wochenpodium','ERD: Konten und Spiel','ERD: Wettbewerb und Migration']
 appendix=''
 for i,p in enumerate(sorted((HERE/'diagrams').glob('*.svg'))):
  svg=p.read_text();box=re.search(r'viewBox="([^"]+)"',svg)
  vals=list(map(float,box.group(1).split())) if box else [0,0,1000,1000]
  # Preserve the editable full SVG; the PDF splits only its viewport when a
  # full model would reduce attribute/message text below readable print size.
  import math, xml.etree.ElementTree as ET
  overlap=80.0; minimum_scale=.78
  layouts={'wide':(1480.0,900.0),'portrait':(1010.0,1310.0)}
  def plan(kind):
   physical_w,physical_h=layouts[kind]
   max_w,max_h=physical_w/minimum_scale,physical_h/minimum_scale
   columns=max(1,math.ceil((vals[2]-overlap)/(max_w-overlap)))
   rows=max(1,math.ceil((vals[3]-overlap)/(max_h-overlap)))
   if p.name.startswith(('03-','04-','05-','06-')):
    kind='wide';physical_w,physical_h=layouts[kind]
    columns=1;rows=max(1,math.ceil((vals[3]-overlap)/(physical_h/minimum_scale-overlap)))
   return kind,physical_w,physical_h,columns,rows
  choices=[plan(kind) for kind in layouts]
  orientation,physical_w,physical_h,columns,rows=min(choices,key=lambda item:(item[3]*item[4],item[0]!='wide'))
  crop_w=(vals[2]+overlap*(columns-1))/columns
  crop_h=(vals[3]+overlap*(rows-1))/rows
  display_scale=min(physical_w/crop_w,physical_h/crop_h,1.5)
  assert display_scale>=minimum_scale-.015,(p.name,display_scale)
  for row in range(rows):
   for column in range(columns):
    part=row*columns+column+1;parts=columns*rows
    tree=ET.fromstring(svg)
    tree.set('viewBox',f'{vals[0]+column*(crop_w-overlap)} {vals[1]+row*(crop_h-overlap)} {crop_w} {crop_h}')
    tree.set('width',str(crop_w));tree.set('height',str(crop_h))
    cropped=ET.tostring(tree,encoding='unicode')
    detail=f' · Teil {part}/{parts}' if parts>1 else ''
    caption=('A3-Vektoransicht mit überlappenden Ausschnitten. Vollständiges SVG und bearbeitbare Mermaid-Quelle liegen im Paket.' if parts>1 else 'A3-Vektoransicht. Vollständiges SVG und bearbeitbare Mermaid-Quelle liegen im Paket.')
    appendix+=f'<section class="diagram {orientation}"><h2>Anhang {i+1}: {html.escape(titles[i])}{detail}</h2><p>{caption}</p><img style="width:{crop_w*display_scale:.2f}px;height:{crop_h*display_scale:.2f}px" src="data:image/svg+xml;base64,{base64.b64encode(cropped.encode()).decode()}" alt="{html.escape(titles[i])}{detail}"></section>'
 style="""@page {size:A4; margin:17mm 14mm 18mm;} @page large {size:A3 landscape; margin:14mm;} @page portraitDiagram {size:A3 portrait; margin:14mm;} *{box-sizing:border-box;} body{font-family:'DejaVu Sans',sans-serif;color:#103d46;font-size:10pt;line-height:1.45;} h1{font-size:23pt;line-height:1.2;border-bottom:4px solid #a3dfc0;padding-bottom:8px;} h2{font-size:16pt;line-height:1.2;margin-top:24px;break-after:avoid;} h3{font-size:12pt;break-after:avoid;} p,li{orphans:3;widows:3;} a{color:#125c63;text-decoration:none;} strong{font-weight:700;} table{border-collapse:collapse;width:100%;font-size:8.4pt;margin:15px 0;table-layout:fixed;} th,td{border:1px solid #87a894;padding:7px;vertical-align:top;overflow-wrap:anywhere;} th{background:#dce9bd;} tr{break-inside:avoid;} thead{display:table-header-group;} code{font-family:'DejaVu Sans Mono',monospace;font-size:.86em;overflow-wrap:anywhere;} pre{white-space:pre-wrap;background:#fff4de;padding:12px;border:1px solid #87a894;} blockquote{border-left:4px solid #a3dfc0;padding-left:12px;} .diagram{break-before:page;break-after:page;} .diagram h2{margin-top:0;} .diagram img{display:block;margin:6px auto;max-width:100%;} .diagram.wide{page:large;} .diagram.portrait{page:portraitDiagram;} .diagram p{font-size:9pt;color:#45666a;}"""
 content='<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Notification Ninja – Technische Dokumentation · Projektabgabe 3</title><style>'+style+'</style></head><body>'+body+appendix+'</body></html>'
 htmlfile=HERE/'technical-documentation.html';htmlfile.write_text(content)
 script="""const {chromium}=require('playwright');const{pathToFileURL}=require('node:url');const fs=require('node:fs');(async()=>{const browser=await chromium.launch({executablePath:fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined,headless:true,args:['--no-sandbox']});try{const p=await browser.newPage();await p.route(/^https?:/,r=>r.abort());const content=fs.readFileSync(process.argv[1],'utf8').replace('<head>','<head><base href="https://github.com/BruKevFH/REBOOT-Digital-Balance/blob/main/docs/projektabgabe-3/">');await p.setContent(content,{waitUntil:'load'});await p.evaluate(()=>document.fonts.ready);await p.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));await p.pdf({path:process.argv[2],printBackground:true,preferCSSPageSize:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="width:100%;font-size:8px;text-align:center;color:#45666a">Notification Ninja · PG1 · Projektabgabe 3 · <span class="pageNumber"></span> / <span class="totalPages"></span></div>'});console.log('Technical PDF: '+process.argv[2]);}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});"""
 subprocess.run(['node','-e',script,str(htmlfile),str(HERE/'technical-documentation.pdf')],cwd=ROOT,check=True,timeout=120)


def submission_zip():
 target=HERE/'submission.zip'
 allowed=[]
 for name in ['README.md','slides.pptx','slides.pdf','technical-documentation.md','technical-documentation.pdf','technical-documentation.html','build_submission.py','requirements-build.txt']:
  p=HERE/name
  if not p.is_file():raise SystemExit('Submission file missing: '+name)
  allowed.append(p)
 for folder in ['diagrams','nachweise','assets']:
  for p in sorted((HERE/folder).rglob('*')):
   if p.is_file() and p.suffix in ['.mmd','.svg','.json','.md','.png']:allowed.append(p)
 with ZipFile(target,'w',ZIP_DEFLATED) as z:
  for p in allowed:
   rel=p.relative_to(HERE).as_posix();info=ZipInfo('Notification-Ninja-Projektabgabe-3/'+rel,(2026,11,24,0,0,0));info.compress_type=ZIP_DEFLATED;info.external_attr=0o100644<<16
   z.writestr(info,p.read_bytes())
 with ZipFile(target) as z:
  assert z.testzip() is None
  assert all('..' not in Path(n).parts and not Path(n).is_absolute() for n in z.namelist())
 print(f'Submission ZIP: {len(allowed)} local files; CRC pass; no secrets copied.')

if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--skip-pdf',action='store_true');p.add_argument('--skip-documentation',action='store_true');build(p.parse_args())
