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
STATUS_DEFAULT={'date': '25. November 2026', 'test_count': 591, 'test_qualifier': 'Repository-Gesamtsuite mit echtem lokalem PostgreSQL, 25. November 2026', 'release': '3.13.1 veröffentlicht; finale CI und öffentliche Versionsprüfung bestanden', 'public_status': 'Finale CI, öffentliche Dateigleichheit und Konto-/Neustartprüfung bestanden', 'commit': 'Geprüfter Quellstand: 6878dd4bc8717d48f257d5b89c17868c355fc2bd', 'xmas': 'Keine Protokolle einer Weihnachtssession vorhanden (Angabe der Projektgruppe).'}


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
  rect(s,x,y,w,h,'pale');text(s,x+.25,y+.3,w-.5,h-.6,'Fehlendes Bild: Build abbrechen',20);return None
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
  yy+=.82


def build(args):
 ASSETS.mkdir(parents=True,exist_ok=True)
 status_file=ASSETS/'submission-status.json'
 status={**STATUS_DEFAULT,**json.loads(status_file.read_text())}
 status['xmas']='Keine Protokolle einer Weihnachtssession vorhanden (Angabe der Projektgruppe).'
 status_file.write_text(json.dumps(status,ensure_ascii=False,indent=2)+'\n')
 shots=ASSETS/'screenshots'
 required=['homepage','hub','play-menu','gameplay-study','gameplay-open-run','gameplay-gaming','gameplay-sleep','career-map','bazaar-skins','bazaar-abilities','ninja-preview','registration','design-study-v5']
 for name in required:
  if not (shots/(name+'.png')).is_file():raise SystemExit('Real presentation asset missing: '+name)
 pr=Presentation();pr.slide_width=Inches(W);pr.slide_height=Inches(H)
 pr.core_properties.title='Notification Ninja – Projektabgabe 3'
 pr.core_properties.subject='Soll / Ist, Szenarien, Use Cases, Sequenzdiagramme, Konzept, Schnittstellen, ERD und funktionale Testprotokolle'
 pr.core_properties.author='Projektgruppe PG1'
 pr.core_properties.keywords='Notification Ninja, PG1, Med. Info Projekt, Projektabgabe 3, UML, ERD, Tests'
 notes=[];total=16
 def slide(title,kicker,source):
  s=pr.slides.add_slide(pr.slide_layouts[6]);s.background.fill.solid();s.background.fill.fore_color.rgb=color('cream')
  rect(s,0,0,.11,H,'mint',line='mint',radius=False)
  text(s,.53,.26,11.9,.25,kicker.upper(),12,True,fill='muted')
  header_font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',100)
  header_size=min(29,12.2*72*100/max(header_font.getlength(title),1))
  text(s,.53,.69,12.2,.60,title,header_size,True)
  line(s,.53,1.38,12.25,1.38,'line',.9)
  text(s,12.25,7.02,.53,.32,f'{len(pr.slides):02d}',14,True,align=PP_ALIGN.RIGHT)
  rect(s,.53,7.40,12.25*len(pr.slides)/total,.035,'mint',line='mint',radius=False,line_width=0)
  return s
 def note(s,body):
  s.notes_slide.notes_text_frame.text=body;notes.append(body)
 def shot(s,name,x,y,w,h,label=None):
  p=shots/(name+'.png')
  rect(s,x-.025,y-.025,w+.05,h+.05,'paper','ink',True,.8)
  picture(s,p,x,y,w,h)
  if label:text(s,x,y+h+.09,w,.32,label,12,fill='muted')
 def callout(s,x,y,w,h,title,body,fill='paper',size=17):
  rect(s,x,y,w,h,fill,'line',True,.9)
  text(s,x+.18,y+.15,w-.36,.52,title,19,True)
  text(s,x+.18,y+.74,w-.36,h-.80,body,size)
 def table(s,x,y,width,headers,rows,widths=None,rowh=.63,font=16):
  widths=widths or [width/len(headers)]*len(headers)
  yy=y
  for ri,row in enumerate([headers]+rows):
   xx=x;rh=.48 if ri==0 else rowh
   for ci,cell in enumerate(row):
    rect(s,xx,yy,widths[ci],rh,'mint' if ri==0 else ('paper' if ri%2 else 'pale'),'line',False,.6)
    text(s,xx+.12,yy+.10,widths[ci]-.24,rh-.11,cell,font if ri else font-1,ri==0)
    xx+=widths[ci]
   yy+=rh
  return yy
 def mini(s,x,y,w,title,body,fill='paper'):
  callout(s,x,y,w,1.32,title,body,fill,16)

 # 01: A real playable frame, not a mock-up.
 s=slide('Notification Ninja','Projektabgabe 3 · 26W-B5-Telehealth / Med. Info Projekt','Original-Spielbild · Screenshot-Nachweis: assets/screenshots/provenance.json')
 text(s,.6,1.82,4.5,1.1,'Dein Fokus.\nDeine Entscheidung.',27,True)
 text(s,.62,3.18,4.35,1.06,'Ein Spiel über Ablenkung\nund digitale Balance.',21)
 pill(s,.62,4.52,3.55,'PG1 · Kurzpräsentation','mint',17)
 text(s,.62,5.28,4.3,1.16,'Stand: Version 3.13.1',17,fill='muted')
 shot(s,'gameplay-open-run',5.12,1.72,7.65,4.78,'Echte Spielszene · Lern-Dojo · 25. November 2026')
 note(s,'Einstieg, etwa 25 Sekunden. Notification Ninja ist ein tatsächlich spielbarer Browser-Prototyp zum bewussten Umgang mit digitalen Ablenkungen. Das Bild zeigt eine echte lokal gespielte Runde der veröffentlichten Codeversion 3.13.1, keine nachgezeichnete Oberfläche und keine erfundenen Punktwerte. Wir zeigen zuerst das Spiel und dann genau die geforderten Inhalte der Projektabgabe 3. Gruppe PG1. Namen einzelner Gruppenmitglieder werden nicht erfunden.')

 # 02: Explain the mechanic against an actual large screenshot.
 s=slide('Nicht alles wegwischen. Das Richtige entscheiden.','Spielidee · Lernziel und Interaktion','src/game.js · src/main.js · echte Spielszene')
 shot(s,'gameplay-open-run',.6,1.72,8.0,5.0)
 callout(s,8.88,1.76,3.87,1.42,'1 · Ziel erkennen','Lernen, Gaming oder Schlaf: Der Kontext entscheidet.','pale',16)
 callout(s,8.88,3.43,3.87,1.42,'2 · Bewusst reagieren','Ablenkung schneiden. Wichtige Signale durchlassen.','mint',16)
 callout(s,8.88,5.10,3.87,1.42,'3 · Balance halten','Kombos, drei Herzen, Supers.\nFreiwillige Pausen.','paper',16)
 note(s,'Etwa 40 Sekunden. Anders als bei einem reinen Reaktionsspiel ist nicht jedes Objekt ein Ziel. Die aktuelle Situation entscheidet, welche Signale stören und welche wichtig sind. Spielende schneiden per Maus oder Finger. Richtige Entscheidungen bauen Kombos und Super-Energie auf; Fehler verbrauchen Herzen. Open Run hat drei Herzen, keinen Timer und steigende Wellen. Karriere, Training und Tagesaufgaben nutzen dieselbe Grundentscheidung. Das pädagogische Ziel ist eine spielerische Auseinandersetzung mit Aufmerksamkeit. Eine medizinische Wirksamkeit oder durchgeführte Studie wird nicht behauptet.')

 # 03: Show actual breadth with real UI, not stock artwork.
 s=slide('Ein Spielweg: ankommen, spielen, weiterentwickeln.','Ist-Stand · Reale Benutzeroberfläche','Unveränderte Screenshots · Hub / Karriere / Basar')
 for x,name,title,body in [(.61,'hub','Ninja-Hub','Profil, Fortschritt und ein klarer Spieleinstieg.'),(4.77,'career-map','Karriere','18 Hauptmissionen + 8 zusätzliche Aufgaben.'),(8.93,'bazaar-skins','Basar','Welten, Looks und freischaltbare Fähigkeiten.')]:
  shot(s,name,x,1.88,3.78,2.36)
  callout(s,x,4.53,3.78,1.65,title,body,'paper',17)
 text(s,.65,6.49,11.9,.32,'Fünf Hauptziele: Übersicht · Spielen · Karriere · Basar · Rangliste',18,True)
 note(s,'Etwa 35 Sekunden. Diese drei Bilder stammen aus der laufenden Anwendung. Der Hub bündelt den aktuellen Ninja, Level, Währung und nächste Mission. Die Karriere organisiert achtzehn Hauptmissionen und acht zusätzliche Aufgaben einschließlich der drei Bosse. Der Basar bündelt Welten, kosmetische Looks und Fähigkeiten. Modi und Welten sind unter Spielen zusammengeführt. Alle Bildinhalte wurden unverändert aus echten Browseransichten aufgenommen; gesperrte Angebote werden nicht als bereits erspielt ausgegeben.')

 # 04: Concrete intended/actual status.
 s=slide('Soll / Ist: der umgesetzte Umfang ist nachvollziehbar.','Moodle 1 · Soll / Ist Stand','technical-documentation.md § 2 · Nachweise 13 / 15 / 17 / 18')
 table(s,.6,1.82,12.1,['Bereich / Soll','Ist am 25.11.2026','Stand'],[
 ['Verständlicher Einstieg','Homepage → Registrierung / Gast → Ninja-Hub','Umgesetzt'],
 ['Dauerhafte Kontodaten','Node-API + PostgreSQL; SQLite lokal erhalten','Belegt'],
 ['Spiel und Fortschritt','3 Dojos, Balance Master, 18 + 8 Karriereaufgaben','Umgesetzt'],
 ['Wirtschaft und Wettbewerb','Serverkäufe; geprüfte Runs; automatische Rangliste','Getestet'],
 ['Bedienbarkeit DE / EN','1.368 Seitenzustände; Dark / Noir mitgeprüft','Getestet'],
 ['Menschlicher Zielgruppen-Pretest','Kein durchgeführter Zielgruppentest belegt','Offen']
 ],[3.07,7.0,2.03],.67,16)
 text(s,.68,6.57,11.7,.34,'Software und Funktionstests liegen vor. Die Wirkungsevaluation ist ein eigener Schritt.',15,fill='muted')
 note(s,'Etwa 45 Sekunden. Soll und Ist werden konkret verglichen: Einstieg, Konten, Inhalte, Wirtschaft und Bedienbarkeit sind implementiert und unterschiedlich tief getestet. Die Zahlen 18 plus 8 beschreiben den aktuellen Inhaltskatalog. Ein früher vollständiger nativer Karrieredurchlauf stammt vom 17. November und ist nicht als erneuter Komplettdurchlauf der Version 3.13.1 zu lesen. Die 1.368 Seitenzustände sind definierte automatisierte Browserprüfungen. Sie ersetzen weder echte Hardwaretests aller Geräte noch einen Zielgruppen-Pretest. Deshalb bleibt die menschliche Verständlichkeitsprüfung ausdrücklich offen.')

 # 05: Historical first art and current implementation distinguished.
 s=slide('Vom frühen Dojo-Entwurf zur spielbaren Oberfläche.','Moodle 3 · Konzept / erste Designs / erste Implementierung','Entwurf: Commit 8e4271c, 10.11.2026 · DESIGN_IMPLEMENTATION.md')
 shot(s,'design-study-v5',.61,1.86,5.12,3.1,'10.11.: früher Illustrationsentwurf · kein UI-Screenshot')
 arrow(s,5.99,3.39,6.62,3.39,'ink',2.6)
 shot(s,'homepage',6.92,1.86,5.80,3.1,'25.11.: echte Homepage der Version 3.13.1')
 mini(s,.61,5.61,3.78,'Bildsprache','Sakura, Laternen und japanische Dojos.','pale')
 mini(s,4.78,5.61,3.78,'Gestaltung','Papier, Mint, klare Konturen und große Aktionen.','mint')
 mini(s,8.94,5.61,3.78,'Implementierung','HTML / CSS / JavaScript, Canvas und Web Audio.','paper')
 note(s,'Etwa 40 Sekunden. Links ist ein tatsächlich versionierter früher Illustrationsentwurf zu sehen: dojo-study-v5.svg wurde erstmals am 10. November 2026 im Commit 8e4271c aufgenommen. Er ist ausdrücklich kein historischer Screenshot einer damaligen Benutzeroberfläche. Rechts steht die reale heutige Homepage. Die dokumentierte Indie-Oberflächenumsetzung folgte in Version 3.10.1; die Ausweitung auf die Ansichten ist in ADVENTURE_DESIGN und EXPERIENCE_RELEASE nachvollziehbar. Technisch ist es eine statische HTML-/CSS-/JavaScript-Anwendung mit Canvas und Web Audio, kein bloßer Grafikentwurf.')

 # 06: Scenarios establish intent, requirements and alternatives.
 s=slide('Drei Szenarien machen den Spielerweg prüfbar.','Moodle 2 · Szenarien und Software-Engineering-Plan','technical-documentation.md § 3 · UC01 / UC03 / UC06')
 for x,num,title,body,alt,fill in [(.61,'01','Erster Besuch','Als Gast starten, kurze Ninja-Einführung überspringen oder ansehen, erste Runde spielen.','Alternative: Registrierung mit E-Mail und Zustimmung.','pale'),(4.77,'02','Zurück ins Dojo','Anmelden, gespeichertes Profil laden, Mission fortsetzen oder Fähigkeit kaufen.','Alternative: falsches Passwort → verständlicher Fehler.','mint'),(8.93,'03','Fairer Open Run','Drei Herzen, kein Zeitlimit; nach gültigem Ende automatisch öffentlich eintragen.','Alternative: offline / Gast → keine öffentliche Wertung.','paper')]:
  rect(s,x,1.86,3.78,3.57,fill,'line')
  pill(s,x+.18,2.05,.65,num,'paper',16)
  text(s,x+.18,2.68,3.42,.47,title,21,True)
  text(s,x+.18,3.35,3.42,1.25,body,17)
  text(s,x+.18,4.69,3.42,.58,alt,14,fill='muted')
 for i,label in enumerate(['Homepage','Ninja-Hub','Runde','Ergebnis']):
  xx=.81+i*3.1;rect(s,xx,5.96,2.38,.58,'paper','ink');text(s,xx+.1,6.1,2.18,.3,label,17,True,align=PP_ALIGN.CENTER)
  if i<3:arrow(s,xx+2.44,6.25,xx+2.97,6.25,'ink',1.8)
 note(s,'Etwa 40 Sekunden. Die Szenarien sind als beobachtbare Abläufe formuliert. Beim Gaststart zählt der verständliche erste Einstieg mit einem ehrlichen Hinweis auf lokale Speicherung. Beim wiederkehrenden Konto müssen Fortschritt und Geld serverseitig konsistent bleiben. Beim Open Run folgt nach einer geeigneten regulär beendeten Kontorunde automatisch die Veröffentlichung des serverbestätigten Ergebnisses. Gast-, Trainings-, vorzeitig beendete oder Adminrunden dürfen keine reguläre Wertung erzeugen. Diese Vorbedingungen und Alternativpfade werden als funktionale Testfälle wieder aufgegriffen.')

 # 07: Editable actual UML-style use-case diagram.
 s=slide('Use Cases: klare Rollen, begrenzte Berechtigungen.','Moodle 2 · Use-Case-Diagramm','Vereinfachung · Vollmodell: diagrams/02-use-cases.svg')
 rect(s,3.40,1.79,6.50,4.86,'paper','line',False,1)
 text(s,3.66,1.94,5.98,.35,'Notification Ninja',19,True)
 def actor(x,y,label):
  q=s.shapes.add_shape(MSO_SHAPE.OVAL,Inches(x+.37),Inches(y),Inches(.34),Inches(.34));q.fill.solid();q.fill.fore_color.rgb=color('cream');q.line.color.rgb=color('ink')
  line(s,x+.54,y+.34,x+.54,y+.90);line(s,x+.16,y+.55,x+.92,y+.55);line(s,x+.54,y+.90,x+.19,y+1.27);line(s,x+.54,y+.90,x+.9,y+1.27)
  text(s,x-.26,y+1.35,1.64,.48,label,15,True,align=PP_ALIGN.CENTER)
 actor(.82,2.10,'Gast');actor(11.22,2.72,'Spielkonto');actor(.82,4.72,'Admin-Testkonto')
 # Associations stay outside the ovals and never cross another use-case label.
 for ay,by in [(2.73,2.64),(2.73,3.38)]:line(s,1.81,ay,4.15,by)
 for by in [2.64,4.12,4.86,5.60]:line(s,11.38,3.35,9.15,by)
 line(s,1.81,5.35,4.15,6.34)
 for y,label in [(2.32,'Spielen / trainieren'),(3.06,'Registrieren'),(3.80,'Anmelden / Profil'),(4.54,'Kaufen / Fortschritt'),(5.28,'Open Run werten'),(6.02,'Mit Testbudget üben')]:
  q=s.shapes.add_shape(MSO_SHAPE.OVAL,Inches(4.15),Inches(y),Inches(5.0),Inches(.64));q.fill.solid();q.fill.fore_color.rgb=color('mint');q.line.color.rgb=color('ink')
  text(s,4.36,y+.17,4.58,.35,label,17,True,align=PP_ALIGN.CENTER)
 text(s,.67,6.80,12.0,.25,'Gastdaten lokal · Kontofortschritt serverseitig · Admin-Testkonto ohne Ranglisten- und Wochenprämien',13,True)
 note(s,'Etwa 45 Sekunden. Das vereinfachte Use-Case-Diagramm zeigt Gast, reguläres Spielkonto und das besondere Admin-Testkonto. Gast und reguläres Konto können spielen und trainieren. Der Gast kann ein Konto registrieren. Ein reguläres Konto verwaltet sein Profil, kauft mit servergeprüftem Guthaben und veröffentlicht geeignete Open Runs. Das Admin-Testkonto dient dem eigenen Durchspielen mit Testbudget und ist von Wettbewerb und Wochenprämien ausgeschlossen; es ist kein Portal zur Verwaltung fremder Konten. Das vollständige Diagramm im Anhang zeigt zusätzliche Beziehungen und Alternativpfade. Eine Datenbank wird nicht als menschlicher Akteur ausgegeben.')

 # 08: Architecture and interfaces use actual implementation paths.
 s=slide('Architektur: Browser, API und Datenbank.','Moodle 3 · Technische Implementierung / Schnittstellen','server/ninja-service.mjs · src/accounts.js · src/game.js')
 for x,title,body,fill in [(.65,'Browser','HTML / CSS / JavaScript\nCanvas 2D + Web Audio\nGastprofil lokal','pale'),(4.85,'Node.js 24','Konto- und Spiel-API v3\nSeed + Eingabe-Replay\nKäufe / Belohnungen','mint'),(9.03,'Datenbank','Neon PostgreSQL online\nSQLite für lokale Nutzung\nMigrationen + Transaktionen','paper')]:
  callout(s,x,1.91,3.65,2.25,title,body,fill,17)
 arrow(s,4.39,2.91,4.77,2.91);arrow(s,8.58,2.91,8.95,2.91)
 table(s,.65,4.54,12.03,['Schnittstelle unter /api/v3','Zuständigkeit'],[
 ['POST /auth/register · /auth/login','Identität, Sitzung, optionaler zweiter Faktor'],
 ['POST /actions','Käufe und Claims atomar + wiederholungssicher'],
 ['POST /runs/start · /finish · /publish','Serveranfang, Replay-Prüfung, öffentliche Wertung']
 ],[5.55,6.48],.57,16)
 text(s,.72,6.83,11.7,.21,'Render Free + Neon Free · keine Zugangsdaten im Frontend · HTTPS / Bearer-Sitzungen',13,fill='muted')
 note(s,'Etwa 50 Sekunden. Der Browser enthält Darstellung, Eingabe und eine eigene Instanz des gemeinsamen Spielmodells. Der Node-24-Dienst führt dasselbe Modell unabhängig aus und prüft autoritativ Aktionen und Ergebnisse. Der Client sendet keinen verbindlichen Kontostand und keine verbindlichen Punktwerte. Online wird PostgreSQL über Neon verwendet, während SQLite lokal erhalten bleibt. Render Free liefert den Dienst und die statischen Dateien. Alle gezeigten API-Pfade liegen unter /api/v3; die verkürzten /finish und /publish stehen für /runs/{id}/finish und /runs/{id}/publish. Geheimnisse bleiben auf dem Server. Das Deployment ist separat durch öffentliche Versions- und Dateigleichheitsprüfungen belegt.')

 # 09: Sequence login.
 s=slide('Sequenz 1: anmelden und eigenen Spielstand laden.','Moodle 2 · Sequenzdiagramm Anmeldung','Vereinfachung · diagrams/03-registrierung-anmeldung.svg')
 seq(s,['Browser','Konto-API','Datenbank'],[
 (0,1,'POST /auth/login','Benutzername / E-Mail und Passwort über HTTPS.'),
 (1,2,'Konto und Passwort-Hash lesen','Server vergleicht den scrypt-Hash; ungültige Anmeldungen werden begrenzt.'),
 (1,2,'Sitzung speichern','In der Datenbank liegt der Tokenhash; optional ist zuvor MFA erforderlich.'),
 (1,0,'Token + eigenes Profil','Browser hält das Token im sessionStorage des Tabs.'),
 (0,1,'GET /me → gespeicherter Stand','Logout widerruft die Sitzung; fremde Profile bleiben unzugänglich.')
 ],y=1.84,x=1.61,w=10.0,bottom=6.78)
 note(s,'Etwa 40 Sekunden. Dies ist die Hauptsequenz einer gültigen Anmeldung, vereinfacht auf drei Teilnehmer. Der Server lädt die Identität, vergleicht den Passwort-Hash und erstellt bei Erfolg eine begrenzte Sitzung. Der Datenbankwert ist ein Hash des Tokens, nicht das nutzbare Token selbst. Der Browser hält das Sitzungstoken tabbezogen im sessionStorage. GET /me liefert nur den eigenen serverbestätigten Stand. Bei aktiviertem MFA liegt ein zusätzlicher Challenge-Schritt zwischen Passwortprüfung und Sitzung. Registrierung, MFA, Fehlversuche und Logout stehen vollständig im bearbeitbaren Sequenzdiagramm des Anhangs.')

 # 10: Deterministic replay, automatic publish accurately separated.
 s=slide('Sequenz 2: Open Run automatisch werten.','Moodle 2 · Sequenzdiagramm Spiel / Rangliste','Vereinfachung · diagrams/05-run-replay-rangliste.svg · Nachweis 09')
 seq(s,['Browser','Spiel-API','Datenbank'],[
 (0,1,'POST /runs/start','Server gibt Seed, Run-ID und kanonischen Anfang vor.'),
 (0,1,'POST /runs/{id}/finish','Begrenzte Eingabefolge statt behaupteter Punkte übermitteln.'),
 (1,2,'Replay-Ergebnis speichern','Eigentum, Zeitbudget, Regeln und Belohnungen prüfen.'),
 (0,1,'Automatisch: POST /publish','Nur neuer eigener geeigneter Open Run; kein weiterer Veröffentlichungsklick.'),
 (1,2,'Score veröffentlichen','Gast-, Admin-, Trainings- und vorzeitig beendete Runs werden nicht gewertet.')
 ],y=1.84,x=1.61,w=10.0,bottom=6.78)
 note(s,'Etwa 50 Sekunden. Der Server erteilt zu Beginn eine Run-ID und einen Seed. Zum Ende sendet der Browser die Eingabefolge. Der Server spielt die Runde deterministisch nach und berechnet das Ergebnis selbst, innerhalb enger Zeit- und Loggrenzen. Danach wird das Ergebnis transaktional mit dem Fortschritt gespeichert. Bei einem neuen geeigneten Open Run eines regulären Kontos ruft der Browser automatisch den bestehenden geschützten Veröffentlichungsendpunkt auf. Die Auto-Ranking-Warteschlange enthält nur kontogetrennte Run-IDs. Zwei echte lokale Kontorunden belegten Eintrag und Erhalt nach Reload ohne Veröffentlichungsklick. Das ist Schutz gegen frei erfundene Clientpunkte, jedoch kein vollständiger Beweis gegen automatisiertes korrektes Spielen.')

 # 11: Real schema, readable central extract.
 s=slide('ERD: Identität, Fortschritt und geprüfte Ergebnisse.','Moodle 4 · Datenbankdesign / ERD','Zentraler Ausschnitt · Vollständiges Schema: diagrams/07 und 08 · 14 fachliche Tabellen')
 entity(s,5.01,1.94,3.38,1.60,'users',['PK id','UNIQUE username_key / email'],font=14)
 entity(s,.67,1.94,3.38,1.60,'sessions',['PK token_hash','FK user_id → users'],font=14)
 entity(s,9.31,1.94,3.38,1.60,'profiles',['PK / FK user_id → users','data: validiertes JSON als TEXT'],font=14)
 entity(s,.67,4.49,3.38,1.60,'wallets',['PK / FK user_id → users','balance ≥ 0: autoritatives Guthaben'],font=14)
 entity(s,5.01,4.49,3.38,1.60,'ninja_runs',['PK id · FK user_id → users','Seed / Status / geprüftes Ergebnis'],font=14)
 entity(s,9.31,4.49,3.38,1.60,'ninja_verified_scores',['PK / FK run_id → ninja_runs','FK user_id → users'],font=14)
 line(s,4.08,2.74,4.98,2.74);text(s,4.09,2.32,.84,.29,'n : 1',13,True)
 line(s,8.42,2.74,9.28,2.74);text(s,8.46,2.32,.8,.29,'1 : 1',13,True)
 line(s,6.7,3.56,6.7,4.46);text(s,6.82,3.82,1.15,.27,'1 : n',13,True)
 line(s,5.0,3.30,3.7,4.46);text(s,3.82,3.82,.84,.27,'1 : 1',13,True)
 line(s,8.42,5.29,9.28,5.29);text(s,8.40,4.88,1.0,.29,'1 : 0..1',12,True)
 text(s,.71,6.38,11.96,.35,'Inventar / XP / Karriere im Profil · maßgebliches Guthaben in wallets · Fremdschlüssel mit Kontolöschung',14,True)
 text(s,.71,6.80,11.96,.25,'Ergänzend: Ledger, idempotente Aktionen, MFA und Wochenpodium. Beide Adapter erhalten Migrationen.',13,fill='muted')
 note(s,'Etwa 55 Sekunden. Dieser Ausschnitt zeigt die echten Tabellennamen, Primär- und Fremdschlüssel. Ein Nutzer hat bei atomarer Kontoerstellung genau ein Profil und eine Wallet, mehrere Sitzungen und mehrere Runs. Ein Run erzeugt höchstens einen veröffentlichten verifizierten Score. Inventar, Erfahrung und Karriere liegen im validierten Profil-JSON als TEXT, nicht in einer erfundenen relationalen Inventartabelle und nicht als native JSONB-Spalte. Die Wallet bleibt die maßgebliche Geldquelle. Jeder verifizierte Score verweist zusätzlich direkt auf den Nutzer. Das vollständige physische ERD enthält 14 fachliche Tabellen und drei Migrationstabellen sowie Ledger, idempotente Aktionen, MFA und Wochenpodium. PostgreSQL nutzt serialisierbare Transaktionen mit begrenzten Wiederholungen; SQLite BEGIN IMMEDIATE.')

 # 12: Actual design/implementation changes.
 s=slide('Änderungen am Konzept: begründet statt zufällig.','Moodle 5 · Änderungen zu Konzept / Plan / Rollen / DB','technical-documentation.md § 7 · EXPANSION_3_13.md')
 table(s,.6,1.88,12.1,['Früher / Problem','Heute / Entscheidung','Nutzen'],[
 ['Separater Ranglistenserver + SQLite','Konten-API + PostgreSQL; SQLite lokal','Dauerhafte Konten; Bestand bleibt erhalten'],
 ['Client meldet Punkte','Serveranfang + deterministisches Replay','Prüfbare Ergebnisse und Belohnungen'],
 ['Konkurrierende Welten / Modi','Gemeinsames „Spielen“, Fähigkeiten im Basar','Kürzere Navigation; klare Entscheidungen'],
 ['Veröffentlichung per Zusatzklick','Automatisch nach gültigem Open Run','Weniger Bedienaufwand bei gleicher Prüfung'],
 ['Einfache Rollen / reine Fortschrittslogik','Gast / Konto / Admin; aktive Spielzeit','Fairer Wettbewerb und freiwillige Pausen']
 ],[3.88,4.40,3.82],.79,15.6)
 text(s,.69,6.63,11.8,.34,'Bestehende Inhalts-IDs, Besitzstände und lokale Gastprofile werden erhalten.',16,True)
 note(s,'Etwa 45 Sekunden. Die Änderungen betreffen nicht nur Farben. Die Datenbankentscheidung folgt aus der flüchtigen lokalen Platte eines kostenlosen Hosts: öffentliche Konten brauchen dauerhaften Speicher. Server-Replay ersetzt das Vertrauen auf gesendete Punktzahlen. Navigation und Fähigkeiten werden zusammengeführt. Das automatische Ranking entfernt einen Bedienklick, lässt die Sicherheitsregeln aber unverändert. Die getrennte Admin-Testrolle erlaubt Durchspielen ohne Wettbewerbsvorteil. Aktive Spielzeit und freiwillige Pausen greifen digitale Balance auf; es gibt keine Belohnung fürs bloße Onlinebleiben. Bestehende Inhaltskennungen, Besitzstände und Gastprofile werden nicht pauschal gelöscht oder in verifizierte Kontomittel umgewandelt.')

 # 13: Visual break with genuine gameplay from both other worlds.
 s=slide('Drei Welten, ein Prinzip – mit eigener Atmosphäre.','Ist-Stand · Design und Spielumfang','Echte gespielte Runden · src/content.js / src/catalog.js · Kataloge im Repository')
 shot(s,'gameplay-gaming',.61,1.86,5.92,3.40,'Gaming-Dojo · reale Eingaben, unveränderte Punktwerte')
 shot(s,'gameplay-sleep',6.79,1.86,5.92,3.40,'Schlaf-Dojo · reale Eingaben, unveränderte Punktwerte')
 for x,title,body,fill in [(.61,'12 Looks','5 kosmetische Seltenheiten','pale'),(4.77,'18 Fähigkeiten','Darunter 6 aktivierbare Supers','mint'),(8.93,'36 Erfolge','Dazu Tagesaufgabe und Wochenziele','paper')]:mini(s,x,5.70,3.78,title,body,fill)
 note(s,'Etwa 30 Sekunden. Die beiden anderen echten Spielbilder zeigen den blauvioletten Cyber-Gaming-Raum und den ruhigen Mondlicht-Schlafraum. Lern-Dojo, Gaming und Schlaf besitzen eigene Inhalte und Prioritäten. Balance Master wechselt zwischen diesen Kontexten. Die Kataloge enthalten zwölf Looks in fünf kosmetischen Seltenheiten, achtzehn Fähigkeiten einschließlich sechs Supers und sechsunddreißig Erfolge. Diese Zahlen sind nachprüfbare Katalogangaben; die gezeigten Aufnahmen stammen aus regulär gespielten Gastzuständen ohne synthetische Guthaben- oder Profilfreischaltung.')

 # 14: Test concept, not just a headline number.
 s=slide('Testkonzept: Regeln, Bedienung, Persistenz.','Moodle 6 · Funktionales Testen / Konzept','technical-documentation.md § 9 · tests/ninja*.test.mjs')
 for x,title,body,fill in [(.62,'Modell + API','Positiv: Login, Run, Kauf, Claim.\nNegativ: falsche Rolle, gefälschte Werte, Doppelanfrage.','pale'),(4.78,'Echte Browserwege','Maus / Touch, Sprachwechsel, lange HUD-Werte, Missionssperren, Dark / Noir.','mint'),(8.94,'Persistente Konten','Zwei getrennte Konten, erspielte Mittel, tatsächlicher Neustart, Reload und Löschung.','paper')]:callout(s,x,1.91,3.77,2.65,title,body,fill,18)
 rect(s,.62,4.94,12.09,1.66,'paper','line')
 text(s,.85,5.14,11.6,.37,'Jeder Fall: Vorbedingung → Aktion → Soll → Ist → Nachweis',21,True)
 text(s,.85,5.80,11.6,.63,'Isolierte SQLite- und PostgreSQL-Datenbanken. Öffentliche Prüfungen separat dokumentiert.\nAutomatisierte Browserprüfungen sind keine Tests mit menschlichen Zielpersonen.',17,fill='muted')
 note(s,'Etwa 45 Sekunden. Das Konzept verbindet Regeltests, reale HTTP-Integration, Browserbedienung und Persistenz. Positive Fälle zeigen, dass erlaubte Abläufe funktionieren. Negative Fälle prüfen insbesondere unverdiente Belohnungen, manipulierte Geldwerte, doppelte Claims, konkurrierende Käufe und falsche Rollen. Kontentests trennen zwei Identitäten und speichern echte erspielte Änderungen. Ein tatsächlicher Dienstneustart prüft Dauerhaftigkeit statt nur einen Browserreload. Lokale Prozessprüfungen, Browser-Emulation und öffentliche Produktionsprüfungen sind in den Protokollen getrennt. Nach jedem kontrollierten Kontentest werden die Testdaten entfernt. Eine menschliche Usability-Studie wurde dadurch nicht durchgeführt.')

 # 15: Short actual protocols and provenance, not fictional testers.
 s=slide('Erste Ergebnisprotokolle: Soll und Ist sind belegt.','Moodle 6 · Funktionale Testresultate · 24.–25. November 2026','presentation_test_results.json · vollständige Originalnachweise im Paket')
 table(s,.6,1.85,12.1,['Testfall','Soll','Ist / Ergebnis'],[
 ['T01 · Zwei Konten','Anmeldung und getrennte Daten','Produktionsprüfung bestanden; Testkonten gelöscht'],
 ['T02 · Kauf wiederholen','Einmalige Abbuchung','35-Münzen-Fähigkeit; Wiederholung ohne Doppelkauf'],
 ['T03 · Automatisches Ranking','Ohne Veröffentlichungsklick','2 native lokale Kontoruns; nach Reload vorhanden'],
 ['T05 · Serverneustart','Konten / Käufe / Scores bleiben','Tatsächlicher Render-Neustart; beide Konten verifiziert'],
 ['T06 / 07 · UI + HUD','DE / EN, Größen, hohe Werte','1.368 Seitenzustände; 60 Details; 216 HUD-Fixtures'],
 ['T08 · Regression / Auslieferung','Reproduzierbarer korrekter Stand','591 Repositorytests; 0 Fehler; 9 Dateihashes identisch']
 ],[3.20,3.68,5.22],.65,15.5)
 note(s,'Etwa 65 Sekunden. Dies sind echte Ergebnisprotokolle, keine erfundenen Testpersonen. T01, T02 und T05 stammen aus der Produktionskontenprüfung vom 24. November. Der Render-Neustart ist durch einen Provider-Event belegt. Danach wurden beide Konten und zugehörigen Testeinträge gelöscht. Der Beleg gilt für ed1bf5a; das Kontenbackend blieb bis 6878dd4 unverändert. T03 sind zwei native lokale Kontorunden mit je drei echten Schnitten und null Veröffentlichungsklicks. T06 umfasst 1.368 automatisierte Seitenzustände bei zwei Breiten und zwei Sprachen. T07 enthält 60 native Detailzustände; die 216 separaten HUD-Darstellungsfälle mit langen Werten sind ausdrücklich synthetische Darstellungsfixtures und keine Spielrekorde. Die finale gesamte Repositorysuite mit echtem lokalem PostgreSQL hat 591 bestandene Tests, null Fehler und null übersprungene Tests. Drei finale CI-Läufe sind grün; neun öffentlich ausgelieferte Dateien wurden per SHA-256 verglichen. Die Quelldaten enthalten zu jedem Testfall Soll, Ist, Datum, Methode und Originalnachweis.')

 # 16: Clean closing slide with the actual deliverables and live demo.
 s=slide('Spielbar, dokumentiert und nachvollziehbar.','PG1 · Fazit / Demo / Transparente Grenzen','Alle Moodle-Punkte: anforderungsabgleich.md · Bearbeitungsstand 25.11.2026')
 shot(s,'hub',.61,1.84,6.48,4.05,'Echter Ninja-Hub · Version 3.13.1')
 callout(s,7.39,1.87,5.29,4.05,'Im Abgabepaket','16 Folien mit Sprechernotizen\n\nPowerPoint und PDF\n\nTechnische Dokumentation\n\nBearbeitbare UML- und ERD-Modelle\n\nEchte Spielbilder und Testprotokolle','mint',17)
 q=text(s,.65,6.19,11.9,.39,'Live-Demo: notification-ninja-accounts.onrender.com',20,True)
 for p in q.text_frame.paragraphs:
  for run in p.runs:run.hyperlink.address='https://notification-ninja-accounts.onrender.com/'
 text(s,.65,6.70,11.9,.25,'Nächster Qualitätsschritt: Verständlichkeit mit realen Zielpersonen prüfen. Keine Moodle-Einreichung erfolgt.',14,fill='muted')
 note(s,'Abschluss, etwa 30 Sekunden. Die Präsentation ordnet jeden geforderten Inhalt der Abgabe einer Folie und ausführlichen Quelle zu. Das Paket enthält bearbeitbare Folien, gleichlautende PDF, technische Dokumentation, vollständige editierbare Diagramme, echte Spielbilder und nachvollziehbare Testprotokolle. Als künftiger eigener Qualitätsschritt ist eine menschliche Verständlichkeitsprüfung sinnvoll; es werden weder bereits beteiligte Menschen noch angebliche Ergebnisse erfunden. Die Live-Demo ist verlinkt. Die Dateien sind vorbereitet, wurden aber nicht bei Moodle eingereicht.')

 out=HERE/'slides.pptx';pr.save(out)
 checked=Presentation(out)
 assert len(checked.slides)==total
 for i,sl in enumerate(checked.slides,1):
  for q in sl.shapes:
   assert q.left>=-Inches(.01) and q.top>=-Inches(.01),(i,q.name,'negative position')
   assert q.left+q.width<=checked.slide_width+Inches(.02),(i,q.name,'right overflow')
   assert q.top+q.height<=checked.slide_height+Inches(.02),(i,q.name,'bottom overflow')
 assert all(sl.notes_slide.notes_text_frame.text.strip() for sl in checked.slides)
 pdf=HERE/'slides.pdf'
 if not args.skip_pdf:
  soffice=which('soffice') or which('libreoffice')
  if not soffice:raise SystemExit('PPTX created; LibreOffice is required for PDF export.')
  subprocess.run([soffice,'--headless','--convert-to','pdf','--outdir',str(HERE),str(out)],check=True,capture_output=True,text=True,timeout=180)
  assert pdf.is_file() and pdf.stat().st_size>10000
 readme='''# Projektabgabe 3 – Notification Ninja

**Gruppe:** PG1 · **Lehrveranstaltung:** 26W-B5-Telehealth / Med. Info Projekt<br>
**Abgabe:** Donnerstag, 26. November 2026, 21:00 Uhr (Europe/Vienna)<br>
**Bearbeitungsstand:** 25. November 2026 · veröffentlichte Version 3.13.1

## Präsentieren und einreichen

- [slides.pptx](slides.pptx): 16 bearbeitbare Folien mit Sprechernotizen, etwa 10–12 Minuten.
- [slides.pdf](slides.pdf): gleichlautende Präsentation als PDF.
- [submission.zip](submission.zip): gesamtes Abgabepaket ohne Zugangsdaten.
- [technical-documentation.pdf](technical-documentation.pdf): ausführliche technische Dokumentation mit lesbarem Vektor-Diagrammanhang.
- [anforderungsabgleich.md](anforderungsabgleich.md): exakte Moodle-Anforderungen, zugehörige Folien und Originalbelege.
- [presentation_test_results.json](presentation_test_results.json): acht echte Ergebnisprotokolle mit Soll, Ist, Datum, Methode und Nachweis.
- [diagrams/](diagrams/): vollständige UML-/ERD-Modelle als SVG und bearbeitbare Mermaid-Quellen.
- [assets/screenshots/provenance.json](assets/screenshots/provenance.json): Herkunft, Dateihashes und Aufnahmemethode der tatsächlichen Spielbilder.

**Live-Demo:** [Notification Ninja öffnen](https://notification-ninja-accounts.onrender.com/).

Die Bilder zeigen unveränderte lokale Browseransichten der tatsächlich laufenden Codeversion 3.13.1. Es wurden reguläre Gastprofile verwendet, keine Spielstände oder Rekorde erfunden. Die Aufnahmen sind kein eigener Produktionsnachweis; dieser liegt getrennt in den Originalprotokollen. Der frühe Dojo-Entwurf vom 10. November ist ausdrücklich als Illustration und nicht als damaliger UI-Screenshot gekennzeichnet. Diagramme und Texte bleiben in PowerPoint bearbeitbar.

## Anforderungen der Projektabgabe 3

| Moodle-Anforderung | Folien |
|---|---|
| Soll / Ist Stand | 4 |
| Szenarien und Use-Case-Diagramm | 6–7 |
| Sequenzdiagramme | 9–10; weitere vollständige Modelle im Anhang |
| Konzept, erste Designs und erste technische Implementierung / Schnittstellen | 5 und 8 |
| Datenbankdesign / ERD | 11; vollständiges physisches Schema im Anhang |
| Änderungen zu Konzept / Plan, Implementierung, Rollen und DB | 12 |
| Funktionales Testkonzept und erste Ergebnisprotokolle | 14–15 |
| Pre-Testergebnisse aus Weihnachtssession | Separat in der technischen Dokumentation, Abschnitt 9.4, eingeordnet. |

**Keine Protokolle einer Weihnachtssession vorhanden (Angabe der Projektgruppe).** Die echten funktionalen Tests werden separat dokumentiert und nicht als Weihnachts-Pretests ausgegeben. Es gibt keine erfundenen Teilnehmer, Fragebögen, Aussagen oder Testergebnisse. Eine menschliche Verständlichkeitsprüfung ist ein eigener möglicher nächster Schritt.

## Belegter Stand und Grenzen

- 591 bestandene Tests der gesamten Repositorysuite mit echtem lokalem PostgreSQL am 25. November; null Fehler, null übersprungen.
- 1.368 definierte Seitenzustände, 60 native Detailzustände und separat 216 isolierte HUD-Darstellungsfälle.
- Zwei echte lokale Kontorunden bestätigen automatischen Open-Run-Eintrag ohne Veröffentlichungsklick und Erhalt nach Reload.
- Zwei Produktionskonten bestätigen Speicherung nach tatsächlichem Render-Neustart; anschließend wurden beide Testkonten und Einträge entfernt. Dieser Beleg gilt für `ed1bf5a`; das Kontenbackend blieb bis zum abschließenden Oberflächenstand `6878dd4` unverändert.
- Finale CI und öffentliche Identität des Quellstands `6878dd4`: drei erfolgreiche Läufe und neun SHA-256-Dateivergleiche.
- Der vollständige native Karrieredurchlauf vom 17. November ist ein historischer Nachweis; kein erneut behaupteter Komplettdurchlauf der Version 3.13.1.

Browserautomation ist keine physische Prüfung jedes Geräts und kein Test mit menschlichen Zielpersonen. Es werden keine medizinischen Wirkungsnachweise behauptet. Teammitgliedernamen wurden nicht erfunden; die bekannte Gruppenzuordnung PG1 wird verwendet.

Das Paket wurde **nicht bei Moodle hochgeladen**. Die Gruppe kann PowerPoint, PDF und das vollständige Paket vor der Abgabe durchsehen und einreichen.

## Reproduzierbarer lokaler Bau

Benötigt: Python mit `python-pptx`, `Pillow`, `Markdown`; LibreOffice; Node.js und das im Repository vorhandene Playwright mit Chromium.

```bash
python3 -m pip install -r docs/projektabgabe-3/requirements-build.txt
python3 docs/projektabgabe-3/build_submission.py
```

Die belegten Bilddateien werden wiederverwendet. Der separate [Screenshot-Aufnehmer](capture_screenshots.cjs) dokumentiert die Aufnahme echter lokaler Browseransichten; er ist für den erneuten Folienbau nicht erforderlich. Der Präsentationsbau greift nicht auf Produktionsdaten zu und kopiert keine Betreiberzugänge.

## Sprechernotizen

'''
 for i,body in enumerate(notes,1):readme+=f'### Folie {i}\n\n{body}\n\n'
 (HERE/'README.md').write_text(readme.rstrip()+'\n')
 if not args.skip_pdf and not args.skip_documentation:
  documentation_pdf()
  submission_zip()
 print(json.dumps({'slides':len(checked.slides),'pptx':str(out),'pdf':str(pdf) if pdf.exists() else None,'notes':len(notes),'shapeBounds':'pass'},ensure_ascii=False))


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
 for name in ['README.md','slides.pptx','slides.pdf','technical-documentation.md','technical-documentation.pdf','technical-documentation.html','build_submission.py','requirements-build.txt','anforderungsabgleich.md','presentation_test_results.json','capture_screenshots.cjs']:
  p=HERE/name
  if not p.is_file():raise SystemExit('Submission file missing: '+name)
  allowed.append(p)
 for folder in ['diagrams','nachweise','assets']:
  for p in sorted((HERE/folder).rglob('*')):
   if p.is_file() and p.suffix in ['.mmd','.svg','.json','.md','.png']:allowed.append(p)
 with ZipFile(target,'w',ZIP_DEFLATED) as z:
  for p in allowed:
   rel=p.relative_to(HERE).as_posix();info=ZipInfo('Notification-Ninja-Projektabgabe-3/'+rel,(2026,11,25,0,0,0));info.compress_type=ZIP_DEFLATED;info.external_attr=0o100644<<16
   z.writestr(info,p.read_bytes())
 with ZipFile(target) as z:
  assert z.testzip() is None
  assert all('..' not in Path(n).parts and not Path(n).is_absolute() for n in z.namelist())
 print(f'Submission ZIP: {len(allowed)} local files; CRC pass; no secrets copied.')

if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--skip-pdf',action='store_true');p.add_argument('--skip-documentation',action='store_true');build(p.parse_args())
