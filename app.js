(() => {
'use strict';

const APP_VERSION = '2.0.1';
const app = document.getElementById('app');

const clamp = (n,min=0,max=100)=>Math.max(min,Math.min(max,n));
const rand = (arr)=>arr[Math.floor(Math.random()*arr.length)];
const uid = ()=>crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const sleep = ms=>new Promise(r=>setTimeout(r,ms));
const esc = s=>String(s ?? '').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));

const SOURCES = [
  {name:'WHO/Europe – Teens, screens and mental health', url:'https://www.who.int/europe/news/item/25-09-2024-teens--screens-and-mental-health', note:'HBSC-Daten zu Social Media, Gaming und Wohlbefinden bei Jugendlichen.'},
  {name:'CDC – Sleep for high school students', url:'https://www.cdc.gov/yrbs/youth-health-in-focus/sleep.html', note:'Jugendliche brauchen typischerweise etwa 8–10 Stunden Schlaf; Schlaf unterstützt Aufmerksamkeit und Lernen.'},
  {name:'WHO – Mental health of adolescents', url:'https://www.who.int/news-room/fact-sheets/detail/adolescent-mental-health', note:'Schlaf, Bewegung, Coping und unterstützende soziale Umgebungen sind wichtige Schutzfaktoren.'},
  {name:'WHO – Digital environments and mental health', url:'https://www.who.int/teams/mental-health-and-substance-use/promotion-prevention/digital-environments-and-mental-health/', note:'Digitale Umgebungen können sowohl Chancen als auch Risiken für psychisches Wohlbefinden schaffen.'}
];

const CHARACTERS = {
  mia:{name:'Mia',role:'Content & Social',emoji:'M',color:'linear-gradient(135deg,#ff6ea9,#9b7bff)',intro:'Mia kennt jeden Trend, liebt kurze Videos – und merkt selbst manchmal nicht, wie spät es geworden ist.'},
  leon:{name:'Leon',role:'Gaming Squad',emoji:'L',color:'linear-gradient(135deg,#57e8ff,#4177ff)',intro:'Leon ist dein Ranked-Partner. Er ist loyal, aber „eine Runde noch“ ist sein Standardsatz.'},
  sami:{name:'Sami',role:'MedTech Lab',emoji:'S',color:'linear-gradient(135deg,#9dff8b,#35d7a5)',intro:'Sami baut mit dir einen Sensor-Prototypen und interessiert sich für Daten, Elektronik und Datenschutz.'},
  nora:{name:'Nora',role:'Sport & Schule',emoji:'N',color:'linear-gradient(135deg,#ffd36b,#ff8c66)',intro:'Nora trainiert mit dir und erinnert dich daran, dass Leistung nicht nur online stattfindet.'}
};

const MODULES = [
  {id:'pulse',name:'Pulse Sensor',cost:4,icon:'♥',desc:'Lernt, wie optische Pulssensoren Messwerte erzeugen können. Im Spiel nur Simulation, keine Diagnose.',perk:'Nach Minigames +2 Energy.'},
  {id:'light',name:'Light Sense',cost:5,icon:'☀',desc:'Ein Umgebungslicht-Sensor hilft dem Prototyp, späte Bildschirm-Sessions zu erkennen.',perk:'Night-Screen-Penalty um 10 % reduziert.'},
  {id:'haptic',name:'Haptic Nudge',cost:6,icon:'≈',desc:'Ein kurzer Vibrationshinweis erinnert an selbst gesetzte Pausen – ohne Zwang.',perk:'Einmal pro Tag riskante Entscheidung neu wählen.'},
  {id:'focus',name:'Focus Filter',cost:8,icon:'◎',desc:'Ein Software-Modul bündelt Benachrichtigungen statt sie ständig einzublenden.',perk:'Weniger Ablenkungen in Focus Rush.'},
  {id:'privacy',name:'Privacy Core',cost:10,icon:'◈',desc:'Datenminimierung: so wenig personenbezogene Daten wie möglich, lokal und pseudonymisiert.',perk:'+5 Balance beim Tagesabschluss.'}
];

const INSIGHTS = [
  {id:'sleep',title:'Schlaf ist kein „verlorener“ Spielraum',text:'Für Jugendliche werden typischerweise etwa 8–10 Stunden Schlaf pro Nacht empfohlen. Ausreichender Schlaf unterstützt Aufmerksamkeit, Lernen und Wohlbefinden.',source:'CDC'},
  {id:'social',title:'Social Media ist nicht automatisch schlecht',text:'Digitale Kontakte können verbinden und unterstützen. Problematisch wird es eher, wenn Nutzung schwer kontrollierbar wird und andere Bereiche verdrängt.',source:'WHO Europe'},
  {id:'gaming',title:'Gaming kann Teil einer guten Balance sein',text:'Das Spiel bewertet Gaming nicht als „schlecht“. Entscheidend ist, ob Schlaf, Schule, Bewegung, Beziehungen oder Wohlbefinden dauerhaft darunter leiden.',source:'WHO Europe'},
  {id:'notifications',title:'Aufmerksamkeit ist begrenzt',text:'Unterbrechungen kosten Zeit und können Aufgaben schwieriger machen. Bündeln oder stumm schalten kann helfen, wenn du konzentriert arbeiten willst.',source:'Game model'},
  {id:'habits',title:'Kleine Experimente statt Verbote',text:'REBOOT setzt auf selbst gewählte Muster: zum Beispiel 30 Minuten ohne Feed vor dem Schlafen oder eine feste Endzeit für Ranked.',source:'Game design'},
  {id:'privacy',title:'MedTech braucht Datenschutz',text:'Gesundheitsnahe Sensordaten sind sensibel. Gute Systeme minimieren Daten, erklären ihren Zweck und schützen Übertragung und Speicherung.',source:'MedTech learning goal'},
  {id:'support',title:'Nicht alles muss allein gelöst werden',text:'Wenn digitale Nutzung, Schlaf oder psychisches Wohlbefinden dauerhaft Probleme machen, kann es sinnvoll sein, mit einer vertrauten Person oder professioneller Unterstützung zu sprechen.',source:'WHO'}
];

const EVENTS = [
  {id:'morning-scroll',slot:'morning',title:'06:47 – Noch fünf Minuten?',speaker:'mia',text:'Der Wecker ist aus. Dein Handy liegt schon in der Hand und LOOP zeigt „12 neue Clips“. In 38 Minuten musst du los.',choices:[
    {label:'Feed öffnen',sub:'Nur kurz schauen …',impact:{energy:-5,focus:-5,balance:-6,mood:+2,screen:+18},tag:'risky'},
    {label:'Handy weg, aufstehen',sub:'Dusche, Frühstück, Musik.',impact:{energy:+3,focus:+4,balance:+5},tag:'smart'},
    {label:'7-Minuten-Timer setzen',sub:'Kontrollierter Kompromiss.',impact:{focus:+1,balance:+2,mood:+1,screen:+7}}
  ]},
  {id:'class-ping',slot:'school',title:'Notification Storm',speaker:'sami',text:'Im Unterricht erklärt ihr Signalrauschen bei Sensoren. Gleichzeitig vibriert das Handy dreimal hintereinander.',choices:[
    {label:'Alles sofort checken',sub:'Du willst nichts verpassen.',impact:{focus:-8,balance:-4,social:+2,screen:+10},tag:'risky'},
    {label:'Focus Mode bis zur Pause',sub:'Benachrichtigungen gesammelt später.',impact:{focus:+7,balance:+5},tag:'smart'},
    {label:'Nur wichtige Kontakte erlauben',sub:'Mittelweg.',impact:{focus:+3,balance:+3,social:+1}}
  ],mini:'shield',insight:'notifications'},
  {id:'ranked-invite',slot:'evening',title:'„Eine Runde noch?“',speaker:'leon',text:'Ihr habt gerade zwei Matches gewonnen. Morgen ist Abgabe, aber Leon schickt: „Wir sind heiß. ONE MORE?“',choices:[
    {label:'ONE MORE',sub:'Ranked Momentum mitnehmen.',impact:{mood:+6,social:+5,energy:-7,focus:-4,balance:-5,screen:+35,sleep:-.5},tag:'one-more'},
    {label:'Jetzt Schluss',sub:'Run beenden, morgen wieder.',impact:{balance:+7,energy:+4,social:-1},tag:'smart'},
    {label:'Ein Match – Timer läuft',sub:'Klares Ende nach einer Runde.',impact:{mood:+3,social:+3,balance:+1,energy:-2,screen:+18,sleep:-.2}}
  ],insight:'gaming'},
  {id:'loop-bed',slot:'night',title:'23:08 – LOOP zieht',speaker:'mia',text:'Du wolltest um 23:00 schlafen. Ein Clip führt zum nächsten, der Algorithmus hat längst verstanden, was dich hält.',choices:[
    {label:'Weiter swipen',sub:'Du willst das nächste Video noch sehen.',impact:{mood:+2,energy:-10,focus:-8,balance:-9,screen:+48,sleep:-1.0},tag:'risky'},
    {label:'Handy laden – außerhalb Reichweite',sub:'Licht aus.',impact:{energy:+6,balance:+8},tag:'smart'},
    {label:'Night Mode + 10 Minuten',sub:'Selbst gesetzter Cut.',impact:{energy:-2,balance:+1,screen:+10,sleep:-.2}}
  ],insight:'sleep'},
  {id:'lab-noise',slot:'afternoon',title:'MedTech Lab – Signalrauschen',speaker:'sami',text:'Euer optischer Sensorsimulator liefert unruhige Werte. Sami meint: „Vielleicht Hardware? Vielleicht Bewegung? Lass uns systematisch testen.“',choices:[
    {label:'Kalibrieren & dokumentieren',sub:'Messfehler suchen statt raten.',impact:{focus:+5,balance:+2,chips:+2,xp:+8},tag:'smart'},
    {label:'Werte einfach glätten',sub:'Sieht schöner aus, Ursache unbekannt.',impact:{focus:-2,chips:+1,xp:+3},tag:'risky'},
    {label:'Referenzmessung durchführen',sub:'Vergleich unter gleichen Bedingungen.',impact:{focus:+4,chips:+2,xp:+7}}
  ],mini:'signal',insight:'privacy'},
  {id:'lunch-table',slot:'lunch',title:'Mittagspause – Tisch oder Feed?',speaker:'nora',text:'Nora und Sami sitzen bereits draußen. Gleichzeitig hat dein Post überraschend viele Kommentare.',choices:[
    {label:'Bei den anderen hinsetzen',sub:'Handy bleibt in der Tasche.',impact:{social:+7,mood:+5,balance:+5},tag:'smart'},
    {label:'Kommentare beantworten',sub:'Der Post läuft gerade.',impact:{social:+2,mood:+2,balance:-3,screen:+20}},
    {label:'10 Minuten antworten, dann raus',sub:'Beides kombinieren.',impact:{social:+4,balance:+2,screen:+10}}
  ]},
  {id:'exam-study',slot:'afternoon',title:'Mathetest morgen',speaker:'nora',text:'Du willst lernen, aber dein Desktop öffnet beim Start automatisch Discord, Launcher und fünf Tabs.',choices:[
    {label:'25-Minuten-Fokus-Sprint',sub:'Danach 5 Minuten Pause.',impact:{focus:+8,balance:+6,xp:+5},tag:'smart'},
    {label:'Nebenbei Stream laufen lassen',sub:'Fühlt sich weniger langweilig an.',impact:{focus:-5,mood:+2,screen:+30}},
    {label:'Erst eine Stunde zocken',sub:'„Danach bin ich motivierter.“',impact:{mood:+4,focus:-7,energy:-3,balance:-5,screen:+60},tag:'risky'}
  ],mini:'focus'},
  {id:'group-chat-drama',slot:'evening',title:'Gruppenchat eskaliert',speaker:'mia',text:'Im Klassenchat wird über jemanden gelästert. Du bekommst im Sekundentakt neue Nachrichten.',choices:[
    {label:'Mitmachen',sub:'Ein Meme ist schnell geschickt.',impact:{social:+1,mood:-3,balance:-6},tag:'risky'},
    {label:'Chat stumm & raus aus der Situation',sub:'Kein weiteres Öl ins Feuer.',impact:{balance:+5,focus:+2},tag:'smart'},
    {label:'Mia privat schreiben',sub:'„Lass uns das nicht größer machen.“',impact:{social:+6,mood:+2,balance:+4,rel:{mia:+5}}}
  ]},
  {id:'training-choice',slot:'afternoon',title:'Training oder Couch?',speaker:'nora',text:'Du bist müde nach der Schule. Nora fragt, ob du mit zum Training kommst. Dein Squad startet gleichzeitig ein Event.',choices:[
    {label:'Training',sub:'Bewegung + Leute sehen.',impact:{energy:+3,mood:+7,social:+5,balance:+7,rel:{nora:+4}},tag:'smart'},
    {label:'Gaming Event',sub:'Limitierte Rewards.',impact:{mood:+5,social:+3,energy:-4,balance:-4,screen:+75,rel:{leon:+3}}},
    {label:'30 Min spielen, dann Training',sub:'Knapp, aber machbar.',impact:{mood:+4,social:+5,balance:+2,screen:+30}}
  ]},
  {id:'late-message',slot:'night',title:'00:14 – „Bist du noch wach?“',speaker:'mia',text:'Mia schreibt, dass sie wegen einer Präsentation total gestresst ist.',choices:[
    {label:'Kurz antworten & morgen reden',sub:'Unterstützen, aber Schlaf schützen.',impact:{social:+5,mood:+2,balance:+4,rel:{mia:+5}},tag:'smart'},
    {label:'Bis 02:00 chatten',sub:'Du willst für sie da sein.',impact:{social:+8,energy:-12,focus:-10,sleep:-1.7,rel:{mia:+8}}},
    {label:'Nicht reagieren',sub:'Du schläfst weiter.',impact:{energy:+4,rel:{mia:-3}}}
  ],insight:'support'},
  {id:'presentation',slot:'school',title:'Präsentation: Sensor & Datenschutz',speaker:'sami',text:'Eure Klasse soll entscheiden, welche Daten ein Wearable wirklich speichern muss.',choices:[
    {label:'Nur notwendige Messwerte',sub:'Zweckbindung + Datenminimierung.',impact:{focus:+4,balance:+5,chips:+2,xp:+8},tag:'smart'},
    {label:'Alles speichern – vielleicht später nützlich',sub:'Mehr Daten, mehr Möglichkeiten.',impact:{balance:-5,chips:+1},tag:'risky'},
    {label:'Pseudonyme IDs + klare Löschfunktion',sub:'Technik + Privatsphäre kombinieren.',impact:{balance:+7,chips:+3,xp:+10},tag:'smart'}
  ],insight:'privacy'},
  {id:'weekend-binge',slot:'evening',title:'Samstag – kein Wecker',speaker:'leon',text:'Morgen frei. Leon schlägt eine lange Gaming-Nacht vor.',choices:[
    {label:'Bis offen Ende',sub:'Kein Wecker, kein Problem?',impact:{mood:+8,social:+7,energy:-11,balance:-8,screen:+150,sleep:-2.2,rel:{leon:+6}},tag:'risky'},
    {label:'Bis Mitternacht',sub:'Länger spielen, trotzdem Cut.',impact:{mood:+6,social:+6,energy:-4,balance:+2,screen:+80,rel:{leon:+4}}},
    {label:'Heute kurz, morgen gemeinsam',sub:'Rhythmus halten.',impact:{social:+3,balance:+7,energy:+4},tag:'smart'}
  ],insight:'sleep'},
  {id:'comparison-feed',slot:'evening',title:'Perfekte Leben im Feed',speaker:'mia',text:'Nach 25 Minuten Feed fühlt es sich an, als wären alle produktiver, fitter und erfolgreicher als du.',choices:[
    {label:'Weiter vergleichen',sub:'Vielleicht motiviert es ja.',impact:{mood:-8,balance:-5,screen:+30},tag:'risky'},
    {label:'Feed schließen & Freund anschreiben',sub:'Realität statt Highlight-Reel.',impact:{mood:+4,social:+5,balance:+5},tag:'smart'},
    {label:'Account-Mix aufräumen',sub:'Mute/Unfollow, was dir nicht gut tut.',impact:{mood:+5,balance:+7,xp:+4}}
  ]},
  {id:'deadline',slot:'night',title:'Abgabe um 08:00',speaker:'sami',text:'Euer Code läuft, aber das UI hat noch Fehler. Es ist 23:40.',choices:[
    {label:'All-nighter',sub:'Alles heute perfekt machen.',impact:{focus:-12,energy:-16,balance:-10,sleep:-3,xp:+8},tag:'risky'},
    {label:'Kernfunktion testen, dann schlafen',sub:'MVP sichern.',impact:{focus:+5,balance:+7,energy:+4,xp:+7},tag:'smart'},
    {label:'Aufgaben teilen & Cut um 00:15',sub:'Teamwork.',impact:{social:+5,balance:+5,energy:-2,rel:{sami:+5},xp:+8}}
  ],insight:'sleep'},
  {id:'fomo',slot:'lunch',title:'FOMO',speaker:'mia',text:'Alle reden über einen Stream von gestern Nacht. Du warst früh schlafen und kennst den Clip nicht.',choices:[
    {label:'„Zeigt mir den Clip“',sub:'30 Sekunden später weißt du Bescheid.',impact:{social:+3,balance:+4}},
    {label:'Heute Nacht alles nachholen',sub:'Bloß nichts verpassen.',impact:{balance:-6,screen:+90,sleep:-1},tag:'risky'},
    {label:'Egal – anderes Thema',sub:'Nicht jeder Trend muss deiner sein.',impact:{balance:+6,mood:+2},tag:'smart'}
  ]},
  {id:'ai-health-tip',slot:'school',title:'AI Health Tip im Feed',speaker:'sami',text:'Ein Clip behauptet: „Mit diesem Sensor-Hack brauchst du nur 5 Stunden Schlaf.“ Tausende Likes.',choices:[
    {label:'Quelle prüfen',sub:'Wer sagt das? Gibt es Evidenz?',impact:{focus:+6,balance:+5,xp:+8},tag:'smart'},
    {label:'Speichern und ausprobieren',sub:'Viele Likes können nicht irren.',impact:{energy:-6,balance:-6},tag:'risky'},
    {label:'Sami fragen und seriöse Quelle suchen',sub:'Gemeinsam verifizieren.',impact:{focus:+5,social:+3,rel:{sami:+4},xp:+7}}
  ],mini:'memory',insight:'sleep'},
  {id:'music-walk',slot:'afternoon',title:'20 Minuten frei',speaker:'nora',text:'Zwischen Schule und Lab hast du 20 Minuten. Kein Pflichttermin.',choices:[
    {label:'Spazieren + Musik',sub:'Kurz raus.',impact:{energy:+5,mood:+6,balance:+5},tag:'smart'},
    {label:'Shorts scrollen',sub:'Zeit füllen.',impact:{mood:+1,focus:-3,screen:+20}},
    {label:'Powernap 15 Minuten',sub:'Timer stellen.',impact:{energy:+6,focus:+3}}
  ]},
  {id:'squad-conflict',slot:'evening',title:'Squad braucht dich',speaker:'leon',text:'Leon ist genervt: „Immer gehst du früh. Wir brauchen dich für das Turnier.“',choices:[
    {label:'Grenze erklären',sub:'„Unter der Woche bis 22:30, am Wochenende länger.“',impact:{balance:+7,social:+3,rel:{leon:+3}},tag:'smart'},
    {label:'Nachgeben',sub:'Heute Ausnahme – wieder.',impact:{social:+5,energy:-6,balance:-6,sleep:-.7,rel:{leon:+5}},tag:'risky'},
    {label:'Turniertermin gemeinsam planen',sub:'Zeitfenster suchen.',impact:{social:+6,balance:+6,rel:{leon:+6}}}
  ]},
  {id:'phone-free-meal',slot:'lunch',title:'Phone Stack',speaker:'nora',text:'Nora legt ihr Handy in die Tischmitte: „Wer zuerst schaut, holt Wasser für alle.“',choices:[
    {label:'Mitmachen',sub:'15 Minuten ohne Feed.',impact:{social:+6,mood:+4,balance:+6,rel:{nora:+4}},tag:'smart'},
    {label:'Handy behalten',sub:'Du wartest auf eine Nachricht.',impact:{balance:-1}},
    {label:'Eigene Regel: Nur Anrufe',sub:'Erreichbar, aber nicht scrollen.',impact:{social:+4,balance:+4}}
  ]},
  {id:'blue-light-myth',slot:'night',title:'Night Mode = alles egal?',speaker:'sami',text:'Der Bildschirm ist warm gefärbt. Heißt das, du kannst jetzt unbegrenzt weiter scrollen?',choices:[
    {label:'Nein – Nutzungsdauer zählt trotzdem',sub:'Night Mode ersetzt keine Grenze.',impact:{balance:+7,focus:+2},tag:'smart'},
    {label:'Ja, dann bis 02:00',sub:'Warm = schlaffreundlich?',impact:{energy:-12,focus:-9,balance:-8,screen:+90,sleep:-1.5},tag:'risky'},
    {label:'Noch 10 Minuten mit Timer',sub:'Dann Gerät weg.',impact:{balance:+2,screen:+10}}
  ],insight:'sleep'},
  {id:'project-demo',slot:'school',title:'Live-Demo im Unterricht',speaker:'sami',text:'Euer FocusBand-Prototyp soll eine simulierte Unterbrechungsbelastung visualisieren. Die Klasse schaut zu.',choices:[
    {label:'Focus Rush demonstrieren',sub:'Messmodell erklären + Grenzen nennen.',impact:{focus:+5,xp:+10,chips:+2,rel:{sami:+4}},tag:'smart'},
    {label:'Nur schöne Werte zeigen',sub:'Schwächen lieber nicht erwähnen.',impact:{xp:+4,balance:-3}},
    {label:'Klasse selbst testen lassen',sub:'Interaktiv + Vergleich.',impact:{social:+5,xp:+9,chips:+2}}
  ],mini:'focus'},
  {id:'doomscroll',slot:'night',title:'Noch eine schlechte Nachricht',speaker:'mia',text:'Du wolltest nur kurz Nachrichten checken. Jetzt liest du seit 35 Minuten immer weiter.',choices:[
    {label:'Weiter',sub:'Du willst verstehen, was passiert.',impact:{mood:-7,energy:-7,focus:-5,screen:+35,balance:-6},tag:'risky'},
    {label:'Stopp + morgen seriös nachlesen',sub:'Informationszeit festlegen.',impact:{mood:+2,balance:+6},tag:'smart'},
    {label:'Mia eine Sprachnachricht schicken',sub:'Gedanken teilen, dann offline.',impact:{social:+4,mood:+3,balance:+3,rel:{mia:+3}}}
  ]},
  {id:'sleep-catchup',slot:'morning',title:'Sonntag ausschlafen?',speaker:'nora',text:'Nach einer kurzen Nacht könntest du bis Mittag schlafen. Dein Rhythmus ist ohnehin schon verschoben.',choices:[
    {label:'Bis 12:30 schlafen',sub:'Sehr langer Ausgleich.',impact:{energy:+10,balance:-2}},
    {label:'Etwas länger, dann Tageslicht',sub:'Moderater Ausgleich + Routine.',impact:{energy:+7,mood:+4,balance:+5},tag:'smart'},
    {label:'Sofort aufstehen trotz 4h Schlaf',sub:'Rhythmus um jeden Preis.',impact:{energy:-5,focus:-5}}
  ]},
  {id:'privacy-share',slot:'afternoon',title:'Sensor-Daten teilen?',speaker:'sami',text:'Für die Klassenstatistik reichen Durchschnittswerte. Jemand schlägt vor, alle Rohdaten mit Namen hochzuladen.',choices:[
    {label:'Pseudonymisieren + nur nötige Werte',sub:'Datensparsamkeit.',impact:{balance:+7,xp:+8,chips:+2},tag:'smart'},
    {label:'Alles mit Namen speichern',sub:'Einfacher auszuwerten.',impact:{balance:-8},tag:'risky'},
    {label:'Nur lokale Auswertung',sub:'Keine zentrale Speicherung nötig.',impact:{balance:+6,xp:+6}}
  ],insight:'privacy'},
  {id:'perfect-streak',slot:'evening',title:'Streak bei 199 Tagen',speaker:'mia',text:'Du willst schlafen, aber eine App erinnert: „199-day streak – don’t lose it!“',choices:[
    {label:'Streak retten',sub:'Nur kurz öffnen.',impact:{screen:+15,balance:-3,sleep:-.2}},
    {label:'Streak ist kein Vertrag',sub:'Schlafen.',impact:{balance:+8,energy:+4},tag:'smart'},
    {label:'Reminder deaktivieren',sub:'App darf dich nicht kommandieren.',impact:{balance:+9,xp:+4},tag:'smart'}
  ]},
  {id:'alarm-across-room',slot:'morning',title:'Der Wecker liegt diesmal weiter weg',speaker:'nora',text:'Du musst tatsächlich aufstehen, um ihn auszuschalten. Das Handy wäre jetzt aber schon in der Hand.',choices:[
    {label:'Direkt Fenster auf & Wasser',sub:'Erst wach werden, dann online.',impact:{energy:+4,focus:+3,balance:+4},tag:'smart'},
    {label:'Zurück ins Bett mit Feed',sub:'Nur bis der zweite Wecker geht.',impact:{energy:-4,focus:-4,balance:-4,screen:+15}},
    {label:'Musik an, Handy weglegen',sub:'Digital, aber zielgerichtet.',impact:{mood:+3,energy:+2,balance:+3}}
  ]},
  {id:'morning-streak',slot:'morning',title:'07:03 – Daily Reward wartet',speaker:'leon',text:'Ein Game erinnert dich an den täglichen Login-Bonus. Du hast eigentlich keine Zeit.',choices:[
    {label:'Reward holen',sub:'30 Sekunden können 8 Minuten werden.',impact:{screen:+8,focus:-2,balance:-2}},
    {label:'Heute auslassen',sub:'Reward ist optional.',impact:{balance:+5,focus:+2},tag:'smart'},
    {label:'Später bewusst einplanen',sub:'Nicht jetzt, aber nicht verboten.',impact:{balance:+4}}
  ]},
  {id:'class-laptop-tabs',slot:'school',title:'17 Tabs offen',speaker:'sami',text:'Ihr programmiert eine kleine Sensor-Auswertung. Nebenbei laufen Chat, Musikvideo, Shop und News.',choices:[
    {label:'Alles offen lassen',sub:'Multitasking fühlt sich schnell an.',impact:{focus:-7,balance:-3}},
    {label:'Nur IDE + Doku',sub:'Andere Tabs für später parken.',impact:{focus:+8,balance:+5,xp:+4},tag:'smart'},
    {label:'Musik behalten, Rest zu',sub:'Dein persönlicher Mittelweg.',impact:{focus:+3,mood:+2,balance:+2}}
  ],mini:'focus'},
  {id:'teacher-phone-box',slot:'school',title:'Phone Box im Unterricht',speaker:'nora',text:'Die Lehrkraft schlägt für 45 Minuten eine freiwillige Handybox vor. Einige finden es lächerlich.',choices:[
    {label:'Mitmachen',sub:'Ein Experiment, kein Dauerverbot.',impact:{focus:+6,balance:+5}},
    {label:'Handy auf lautlos in Tasche',sub:'Selbst kontrollieren.',impact:{focus:+3,balance:+3}},
    {label:'Unter dem Tisch checken',sub:'Niemand merkt es.',impact:{focus:-6,balance:-4,screen:+12},tag:'risky'}
  ]},
  {id:'lunch-photo',slot:'lunch',title:'Erst Foto, dann Essen?',speaker:'mia',text:'Mia möchte das Essen perfekt fotografieren. Alle warten schon.',choices:[
    {label:'Ein Foto, dann Handy weg',sub:'Moment festhalten, nicht verlieren.',impact:{social:+3,balance:+4}},
    {label:'10 Minuten Content drehen',sub:'Vielleicht geht es viral.',impact:{social:+1,balance:-3,screen:+12}},
    {label:'Heute ohne Post',sub:'Einfach essen und reden.',impact:{mood:+4,social:+5,balance:+5},tag:'smart'}
  ]},
  {id:'lunch-rumor',slot:'lunch',title:'Screenshot ohne Kontext',speaker:'mia',text:'Im Chat kursiert ein Screenshot, der jemanden schlecht aussehen lässt. Niemand kennt die ganze Unterhaltung.',choices:[
    {label:'Weiterleiten',sub:'Alle reden darüber.',impact:{social:-2,mood:-2,balance:-6},tag:'risky'},
    {label:'Nicht verbreiten',sub:'Kontext fehlt.',impact:{balance:+6,focus:+2},tag:'smart'},
    {label:'Nachfragen, bevor du urteilst',sub:'Direkte Kommunikation.',impact:{social:+4,balance:+5}}
  ]},
  {id:'lab-battery',slot:'afternoon',title:'FocusBand: Akku oder Feature?',speaker:'sami',text:'Der Prototyp hält nur zwei Stunden. Mehr Sensor-Sampling liefert mehr Daten, frisst aber Akku.',choices:[
    {label:'Sampling sinnvoll reduzieren',sub:'Technik nach Zweck auslegen.',impact:{focus:+5,chips:+2,xp:+7,balance:+3},tag:'smart'},
    {label:'Maximal messen',sub:'Mehr Daten sind immer besser?',impact:{chips:+1,balance:-3}},
    {label:'Messmodus nur bei Bedarf',sub:'Event-basiertes Konzept.',impact:{focus:+4,chips:+3,xp:+8}}
  ],mini:'signal'},
  {id:'homework-call',slot:'afternoon',title:'Study Call?',speaker:'mia',text:'Mia fragt, ob ihr gemeinsam per Call lernen wollt. Bei euch beiden endet das manchmal in Memes.',choices:[
    {label:'25 Min Call, Kamera aus, Ziel festlegen',sub:'Sozial + strukturiert.',impact:{focus:+5,social:+5,balance:+4,rel:{mia:+3}}},
    {label:'Offener Call ohne Plan',sub:'Kann produktiv werden.',impact:{focus:-3,social:+4,screen:+35}},
    {label:'Alleine konzentrieren, später chatten',sub:'Heute brauchst du Ruhe.',impact:{focus:+7,balance:+4}}
  ]},
  {id:'stream-premiere',slot:'evening',title:'Premiere um 22:30',speaker:'leon',text:'Dein Lieblingsstreamer startet genau dann, wenn du eigentlich runterfahren wolltest.',choices:[
    {label:'Live bis Ende',sub:'Live ist eben nur einmal live.',impact:{mood:+5,energy:-8,focus:-5,balance:-5,screen:+80,sleep:-1}},
    {label:'Highlights morgen',sub:'On-demand statt Schlaf verschieben.',impact:{balance:+7,energy:+4},tag:'smart'},
    {label:'20 Minuten live, dann Cut',sub:'Timer sichtbar stellen.',impact:{mood:+3,balance:+2,screen:+20,sleep:-.2}}
  ]},
  {id:'discord-study',slot:'evening',title:'Discord neben dem Lernen',speaker:'sami',text:'Du bist im Voice-Channel, obwohl du an einer Auswertung arbeitest. Jede Minute passiert etwas.',choices:[
    {label:'Deafen bis Aufgabe fertig',sub:'Später wieder rein.',impact:{focus:+7,balance:+5}},
    {label:'Weiter nebenbei zuhören',sub:'Du willst nichts verpassen.',impact:{focus:-6,social:+2,screen:+30}},
    {label:'Gemeinsamen Fokus-Channel starten',sub:'Alle arbeiten 30 Minuten still.',impact:{focus:+5,social:+5,balance:+5,rel:{leon:+2,sami:+2}}}
  ]},
  {id:'night-autoplay',slot:'night',title:'Autoplay startet Folge 4',speaker:'mia',text:'Der Cliffhanger sitzt. Die nächste Folge startet in 5 Sekunden automatisch.',choices:[
    {label:'Weiter schauen',sub:'Die Folge geht nur 42 Minuten.',impact:{mood:+4,energy:-8,focus:-6,balance:-5,screen:+42,sleep:-.7},tag:'one-more'},
    {label:'Autoplay stoppen',sub:'Cliffhanger bleibt bis morgen.',impact:{balance:+7,energy:+4},tag:'smart'},
    {label:'Nur die ersten 5 Minuten',sub:'Riskanter Deal.',impact:{screen:+18,energy:-3,balance:-1}}
  ]},
  {id:'night-phone-charge',slot:'night',title:'Wo lädt dein Handy?',speaker:'nora',text:'Das Ladekabel liegt direkt am Bett. Jede Vibration ist erreichbar.',choices:[
    {label:'Am Schreibtisch laden',sub:'Noch da, aber nicht direkt greifbar.',impact:{balance:+7,energy:+4},tag:'smart'},
    {label:'Neben dem Kopfkissen',sub:'Praktisch für den Morgen.',impact:{balance:-4,screen:+20,focus:-2}},
    {label:'Nicht stören bis 06:45',sub:'Technische Grenze setzen.',impact:{balance:+6,focus:+3}}
  ]}
];

const STORY_BEATS = {
  1:{title:'Chapter 1 · Boot Sequence',text:'Du startest in eine neue Projektwoche. In MedTech baut eure Gruppe einen Wearable-Prototypen namens FocusBand. Gleichzeitig laufen Schule, Freunde, Gaming und Social Media weiter.'},
  4:{title:'Chapter 2 · Signal vs. Noise',text:'Die ersten Daten sehen gut aus – aber dein eigener Fokus wird schlechter. War die Woche einfach stressig, oder hat dein digitaler Rhythmus damit zu tun?'},
  8:{title:'Chapter 3 · Ranked Pressure',text:'Ein Online-Turnier, ein Test und eine Lab-Abgabe landen in derselben Woche. Jetzt zeigt sich, ob dein System wirklich trägt.'},
  12:{title:'Chapter 4 · Human Factors',text:'Nicht nur Sensoren haben Fehlerquellen. Auch Menschen werden müde, abgelenkt und gestresst. Ihr sollt genau das in eurer Demo sichtbar machen.'},
  16:{title:'Chapter 5 · Public Demo',text:'Die Schulleitung lädt euch ein, den Prototyp vor einer anderen Klasse zu präsentieren. Eure Entscheidungen und Daten werden Teil der Story.'},
  21:{title:'Finale · Own Your Day',text:'Finaltag: Präsentation, Squad-Finale und Freundeskreis treffen aufeinander. Es gibt keine perfekte Balance – aber es gibt bewusstere Entscheidungen.'}
};

const SLOT_ORDER = ['morning','school','lunch','afternoon','evening','night'];
const SLOT_LABEL = {morning:'Morgen',school:'Schule',lunch:'Mittag',afternoon:'Nachmittag',evening:'Abend',night:'Nacht'};

const DB = {
  db:null,
  async open(){
    if(!('indexedDB' in window)) return null;
    return new Promise((resolve,reject)=>{
      const req=indexedDB.open('reboot-db',2);
      req.onupgradeneeded=()=>{
        const db=req.result;
        if(!db.objectStoreNames.contains('profiles')) db.createObjectStore('profiles',{keyPath:'id'});
        if(!db.objectStoreNames.contains('runs')) db.createObjectStore('runs',{keyPath:'id'});
        if(!db.objectStoreNames.contains('events')) { const s=db.createObjectStore('events',{keyPath:'id'}); s.createIndex('runId','runId'); }
        if(!db.objectStoreNames.contains('meta')) db.createObjectStore('meta',{keyPath:'key'});
      };
      req.onsuccess=()=>{DB.db=req.result;resolve(DB.db)}; req.onerror=()=>reject(req.error);
    });
  },
  async put(store,value){ if(!DB.db){localStorage.setItem(`reboot:${store}:${value.id||value.key}`,JSON.stringify(value));return;} return new Promise((res,rej)=>{const tx=DB.db.transaction(store,'readwrite');tx.objectStore(store).put(value);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error);}); },
  async get(store,key){ if(!DB.db){const x=localStorage.getItem(`reboot:${store}:${key}`);return x?JSON.parse(x):null;} return new Promise((res,rej)=>{const q=DB.db.transaction(store).objectStore(store).get(key);q.onsuccess=()=>res(q.result||null);q.onerror=()=>rej(q.error);}); },
  async all(store){ if(!DB.db){return Object.keys(localStorage).filter(k=>k.startsWith(`reboot:${store}:`)).map(k=>JSON.parse(localStorage.getItem(k)));} return new Promise((res,rej)=>{const q=DB.db.transaction(store).objectStore(store).getAll();q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error);}); }
};

let profile = null;
let run = null;
let toastTimer = null;
let miniSession = null;

function freshProfile(name='Player'){
  return {id:'local-player',name:name.trim().slice(0,20)||'Player',createdAt:new Date().toISOString(),level:1,xp:0,chips:0,unlocked:[],achievements:[],bestBalance:0,totalRuns:0,totalDays:0,settings:{sound:true,reducedMotion:false}};
}
function freshRun(mode='story'){
  return {id:uid(),mode,startedAt:new Date().toISOString(),day:1,slotIndex:0,stats:{energy:78,focus:76,mood:72,balance:60,social:62},sleepHours:8,screenMinutes:0,nightScreen:0,xp:0,chips:0,relationships:{mia:50,leon:50,sami:50,nora:50},timeline:[],seen:[],miniScores:[],completedQuests:[],rerolls:1,ended:false};
}

async function remotePost(path,payload){
  // Optional same-origin telemetry. Static deployments work without a backend.
  // In production, only send on HTTPS; localhost is allowed for development.
  const local=['localhost','127.0.0.1'].includes(location.hostname);
  if(location.protocol!=='https:' && !local) return false;
  try{
    const base=document.querySelector('meta[name="reboot-api-base"]')?.content;
    if(!base) return false;
    const endpoint=new URL(path,new URL(base,location.href));
    if(endpoint.origin!==location.origin) return false;
    const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),keepalive:true});
    return res.ok;
  }catch(_){ return false; }
}
async function logEvent(type,data={}){
  if(!run) return;
  const record={id:uid(),runId:run.id,ts:new Date().toISOString(),day:run.day,type,data};
  await DB.put('events',record);
  // Pseudonymous gameplay telemetry only; no real health data.
  remotePost('events',{...record,mode:run.mode});
}
async function saveAll(){
  if(profile) await DB.put('profiles',profile);
  if(run) await DB.put('runs',run);
}

function statValue(k){return Math.round(run?.stats?.[k]??0)}
function addImpact(impact={}){
  if(!run) return;
  ['energy','focus','mood','balance','social'].forEach(k=>{if(impact[k])run.stats[k]=clamp(run.stats[k]+impact[k]);});
  if(impact.screen){run.screenMinutes+=impact.screen;if(run.slotIndex>=4)run.nightScreen+=impact.screen;}
  if(impact.sleep) run.sleepHours=clamp(run.sleepHours+impact.sleep,3,10.5);
  if(impact.xp) run.xp+=impact.xp;
  if(impact.chips) run.chips+=impact.chips;
  if(impact.rel) Object.entries(impact.rel).forEach(([k,v])=>run.relationships[k]=clamp((run.relationships[k]||50)+v));
}

function levelFromXp(xp){return 1+Math.floor(xp/120)}
function toast(msg){
  document.querySelector('.toast')?.remove(); clearTimeout(toastTimer);
  const d=document.createElement('div'); d.className='toast'; d.textContent=msg; document.body.appendChild(d); toastTimer=setTimeout(()=>d.remove(),3200);
}
function go(hash){location.hash=hash;}
function route(){return location.hash.replace('#','')||'home'}

function nav(){
  return `<header class="nav"><div class="wrap nav-inner"><div class="brand" data-route="home" style="cursor:pointer"><span class="brand-mark">R</span> REBOOT</div><div class="nav-actions"><button class="btn ghost" data-route="about">Warum?</button><button class="btn ghost" data-route="learn">Wissen</button><button class="btn primary" data-route="menu">Spielen</button></div></div></header>`;
}

function renderHome(){
  app.innerHTML=`<div class="app-shell">${nav()}
  <main>
    <section class="hero"><div class="wrap hero-grid"><div>
      <span class="eyebrow">⚡ Serious Game · Digital Balance · 13–16</span>
      <h1>Dein Screen.<br><span class="gradient">Dein Tag.</span><br>Deine Moves.</h1>
      <p>REBOOT ist kein Anti-Handy-Spiel. Du navigierst Schule, Social Media, Gaming, Freunde, Schlaf und ein MedTech-Projekt. Jede Entscheidung verändert deinen Run – manchmal sofort, manchmal erst Stunden später.</p>
      <div class="hero-cta"><button class="btn primary large" data-route="menu">▶ Season starten</button><button class="btn ghost large" data-route="about">Konzept ansehen</button></div>
      <p class="micro">21 virtuelle Tage · Story + Endless · 4 Minigames · lokale Speicherung · keine Diagnose</p>
    </div><div class="phone"><div class="phone-screen"><div class="mock-top"><div class="mock-time"><span>22:41</span><span>DAY 08</span></div></div>
      <div class="mock-card hot"><span class="pill">ONE MORE?</span><h3>Ranked Night</h3><p>Leon: „Wir sind 1 Win vor Promotion. Morgen Test. Was machst du?“</p><div class="stats-row"><div class="mini-stat"><b>61</b>ENERGY</div><div class="mini-stat"><b>54</b>FOCUS</div><div class="mini-stat"><b>79</b>MOOD</div><div class="mini-stat"><b>58</b>BALANCE</div></div></div>
      <div class="fake-notification"><div class="avatar">L</div><div><b>Leon</b><div class="micro">ONE MORE 🔥</div></div></div><div class="fake-notification"><div class="avatar" style="background:linear-gradient(135deg,#9dff8b,#35d7a5)">S</div><div><b>Sami · MedTech Lab</b><div class="micro">Sensor demo morgen 08:20</div></div></div>
      <div class="mock-card"><span class="pill">FOCUSBAND</span><h3>3 / 5 Module gebaut</h3><p class="micro">Signal Calibration · Privacy Core locked</p></div>
    </div></div></div></section>

    <section class="section"><div class="wrap"><span class="eyebrow">NICHT NUR QUIZ</span><h2>Du lernst, weil sich das Spiel verändert.</h2><p class="section-lead">Wenn du spät weiterzockst, bekommst du nicht einfach eine Warnbox. Dein nächster Focus-Rush wird schwieriger. Wenn du Notifications bündelst, werden Ablenkungen seltener. Das Lernziel steckt in der Mechanik.</p>
      <div class="grid3">
        <div class="card"><div class="icon">🎮</div><h3>Gaming ohne Moralkeule</h3><p>Gaming kann Spaß, soziale Kontakte und Erholung bringen. Entscheidend ist, wie es mit Schlaf, Schule, Bewegung und Beziehungen zusammenspielt.</p></div>
        <div class="card"><div class="icon">🧠</div><h3>Aufmerksamkeit erleben</h3><p>Reaktions-, Memory- und Notification-Minispiele reagieren auf deinen virtuellen Schlaf- und Fokuszustand.</p></div>
        <div class="card"><div class="icon">🩺</div><h3>MedTech Story</h3><p>Im Schul-Lab entwickelst du ein simuliertes FocusBand. Sensorik, Signalqualität, Human Factors und Datenschutz werden Teil der Story.</p></div>
        <div class="card"><div class="icon">👥</div><h3>Menschen statt Menüs</h3><p>Mia, Leon, Sami und Nora reagieren auf dich. Beziehungen öffnen andere Dialoge und Lösungswege.</p></div>
        <div class="card"><div class="icon">🏆</div><h3>Replay & Progression</h3><p>21-Tage-Season, Daily Challenge, Endless Mode, Achievements, XP und freischaltbare Prototyp-Module.</p></div>
        <div class="card"><div class="icon">🔐</div><h3>Privacy by Design</h3><p>Spielstände werden lokal in IndexedDB gespeichert. Keine echten Gesundheitsdaten, kein Tracking durch REBOOT.</p></div>
      </div>
    </div></section>

    <section class="section"><div class="wrap"><span class="eyebrow">WARUM DAS THEMA?</span><h2>Digital ist nicht das Problem. Unbewusst kann es eines werden.</h2><div class="facts">
      <div class="fact"><strong>8–10 h</strong><p>Schlaf pro Nacht werden für Jugendliche im Alter von 13–18 Jahren typischerweise empfohlen.</p></div>
      <div class="fact"><strong>11 %</strong><p>der Jugendlichen in einer großen WHO-Europe-HBSC-Auswertung zeigten Anzeichen problematischer Social-Media-Nutzung.</p></div>
      <div class="fact"><strong>34 %</strong><p>der Jugendlichen in derselben Erhebung gaben an, täglich digitale Spiele zu spielen. Gaming selbst ist damit nicht automatisch problematisch.</p></div>
    </div><p class="micro" style="margin-top:16px">Quellen und Kontext findest du im Bereich „Wissen“. Zahlen sind Lernkontext, keine individuelle Diagnose.</p></div></section>

    <section class="section"><div class="wrap card" style="text-align:center;padding:40px"><span class="eyebrow">READY?</span><h2 style="margin-top:16px">Kannst du deinen Tag steuern, ohne alles Digitale abzuschalten?</h2><p class="section-lead" style="margin:auto">Es gibt keine perfekte Woche. Probier Muster aus, sieh die Konsequenzen und spiel deinen nächsten Run anders.</p><div class="hero-cta" style="justify-content:center"><button class="btn primary large" data-route="menu">Season spielen</button><button class="btn ghost large" data-route="learn">Lerninhalte ansehen</button></div></div></section>
  </main><footer class="footer"><div class="wrap">REBOOT v${APP_VERSION} · Educational serious game · keine medizinische Diagnose.</div></footer></div>`;
}

function renderAbout(){
  app.innerHTML=`<div>${nav()}<section class="section"><div class="wrap"><span class="eyebrow">KONZEPT</span><h2>Warum REBOOT existiert</h2><p class="section-lead">Jugendliche sollen nicht lernen „Handy schlecht“. Sie sollen erkennen, wann digitale Gewohnheiten Schlaf, Wohlbefinden und Aufmerksamkeit beeinflussen – und selbst mit gesünderen Mustern experimentieren.</p>
  <div class="grid3">
  <div class="card"><h3>1 · Erkennen</h3><p>Das Spiel macht Muster sichtbar: späte Sessions, Notification-Stress, FOMO, Vergleich, Schulstress und Teamdruck.</p></div>
  <div class="card"><h3>2 · Erleben</h3><p>Virtuelle Müdigkeit und Fokus verändern die Minigames. Dadurch wird Konsequenz spielbar statt nur erklärt.</p></div>
  <div class="card"><h3>3 · Experimentieren</h3><p>Du kannst Grenzen, Timer, Focus Mode, andere Abendroutinen oder bewusst geplante Gaming-Zeiten ausprobieren.</p></div>
  </div>
  <div class="card" style="margin-top:20px"><h3>Story: Schule × IT × Medizintechnik</h3><p>Du bist Teil eines Schulprojekts und entwickelst mit Sami einen simulierten Wearable-Prototypen. Dabei lernst du neben Digital Balance auch Grundlagen zu Sensorik, Messfehlern, Datenminimierung und Human Factors. Das Wearable ist ausdrücklich kein echtes Medizinprodukt und stellt keine Diagnosen.</p></div>
  <div class="card" style="margin-top:20px"><h3>Für Präsentation und Unterricht</h3><p>REBOOT speichert Spielentscheidungen lokal, sodass Runs verglichen werden können. Über „Run exportieren“ kann ein pseudonymisiertes JSON-Protokoll für Auswertung und Testdokumentation erzeugt werden. Es werden keine echten Gesundheitsdaten benötigt.</p></div>
  </div></section></div>`;
}

function renderLearn(){
  app.innerHTML=`<div>${nav()}<section class="section"><div class="wrap"><span class="eyebrow">KNOWLEDGE BASE</span><h2>Kurz, korrekt, situationsbezogen.</h2><p class="section-lead">Die Lernkarten im Spiel sind bewusst kompakt. Sie sollen Entscheidungen einordnen, nicht Angst machen.</p>
  <div class="grid3">${INSIGHTS.map(i=>`<div class="card"><span class="pill">${esc(i.source)}</span><h3>${esc(i.title)}</h3><p>${esc(i.text)}</p></div>`).join('')}</div>
  <h2 style="margin-top:62px;font-size:2.4rem">Quellen</h2><div class="grid3">${SOURCES.map(s=>`<div class="card"><h3>${esc(s.name)}</h3><p>${esc(s.note)}</p><a class="btn ghost" style="display:inline-block;margin-top:14px;text-decoration:none" href="${s.url}" target="_blank" rel="noopener">Quelle öffnen ↗</a></div>`).join('')}</div>
  <div class="card" style="margin-top:20px"><h3>Wichtig</h3><p>REBOOT simuliert Zusammenhänge für Lernzwecke. Einzelne Menschen reagieren unterschiedlich. Das Spiel diagnostiziert weder Schlafstörungen noch psychische Erkrankungen noch „Gaming-Sucht“.</p></div>
  </div></section></div>`;
}

async function renderMenu(){
  if(!profile){profile=await DB.get('profiles','local-player') || freshProfile('Player'); await DB.put('profiles',profile);}
  const runs=(await DB.all('runs')).filter(r=>r.ended).sort((a,b)=>String(b.endedAt).localeCompare(String(a.endedAt))).slice(0,4);
  app.innerHTML=`<div class="game-shell"><div class="game-topbar"><div class="wrap"><div class="game-brand">REBOOT // HUB</div><button class="btn ghost" data-route="home">← Website</button></div></div><div class="center-screen"><div class="menu-card">
  <span class="eyebrow">LEVEL ${levelFromXp(profile.xp)} · ${profile.xp} XP · ${profile.chips} CHIPS</span><h1>Welcome, ${esc(profile.name)}.</h1><p class="section-lead">Wähle deinen Run. Fortschritt, Module und Achievements bleiben lokal auf diesem Gerät gespeichert.</p>
  <div class="profile-row" style="margin-top:18px"><input id="playerName" maxlength="20" value="${esc(profile.name)}" aria-label="Spielername"><button class="btn ghost" id="saveName">Name speichern</button><button class="btn ghost" id="exportData">Daten exportieren</button></div>
  <div class="mode-grid">
    <div class="mode"><span class="pill">MAIN</span><h3>21-Day Season</h3><p>Story-Kampagne mit Schule, Freunden, Gaming, Social Media und MedTech-Projekt. Entscheidungen wirken langfristig.</p><button class="btn primary" data-mode="story">Season starten</button></div>
    <div class="mode"><span class="pill">ENDLESS</span><h3>Endless Balance</h3><p>Prozedurale Tage ohne finales Ende. Wie lange hältst du einen starken Run, ohne in Extreme zu kippen?</p><button class="btn purple" data-mode="endless">Endless starten</button></div>
    <div class="mode"><span class="pill">DAILY</span><h3>Daily Challenge</h3><p>Kompakter 3-Tage-Run mit erhöhter Schwierigkeit und Fokus auf Score.</p><button class="btn" data-mode="daily">Daily starten</button></div>
    <div class="mode"><span class="pill">LOADOUT</span><h3>FocusBand Lab</h3><p>Baue Module aus deinen gesammelten Chips und schalte kleine Gameplay-Perks frei.</p><button class="btn" data-route="lab">Lab öffnen</button></div>
  </div>
  ${runs.length?`<h3 style="margin-top:28px">Letzte Runs</h3><div class="timeline">${runs.map(r=>`<div class="timeline-item"><b>${esc(r.mode)} · Day ${r.day}</b> — Balance ${Math.round(r.stats.balance)} · Focus ${Math.round(r.stats.focus)} · ${new Date(r.endedAt).toLocaleDateString('de-AT')}</div>`).join('')}</div>`:''}
  </div></div></div>`;
  document.getElementById('saveName').onclick=async()=>{profile.name=document.getElementById('playerName').value.trim()||'Player';await DB.put('profiles',profile);toast('Name gespeichert');renderMenu();};
  document.getElementById('exportData').onclick=exportAll;
  document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>startRun(b.dataset.mode));
}

async function startRun(mode){
  document.querySelectorAll('[data-mode]').forEach(b=>b.disabled=true);
  cancelMini();
  run=freshRun(mode); if(mode==='daily'){run.stats={energy:70,focus:70,mood:70,balance:55,social:60};} await saveAll(); await logEvent('run_start',{mode}); go('game');
}

function gameTopbar(){
  const s=run.stats;
  const chip=(name,k)=>`<div class="hud-chip"><small>${name}</small><b>${Math.round(s[k])}</b><div class="bar"><i style="width:${clamp(s[k])}%"></i></div></div>`;
  return `<div class="game-topbar"><div class="wrap"><div class="game-brand">REBOOT <span class="micro">// ${run.mode.toUpperCase()} · DAY ${run.day}</span></div><div class="hud">${chip('Energy','energy')}${chip('Focus','focus')}${chip('Mood','mood')}${chip('Balance','balance')}</div><button class="btn ghost" id="pauseBtn">☰</button></div></div>`;
}
function sidebar(){
  return `<aside class="sidebar">
    <div class="side-card"><h4>People</h4><div class="npc-list">${Object.entries(CHARACTERS).map(([id,c])=>`<div class="npc"><div class="avatar" style="background:${c.color}">${c.emoji}</div><div class="npc-info"><b>${c.name}</b><small>${c.role}</small><div class="rel"><i style="width:${run.relationships[id]}%"></i></div></div></div>`).join('')}</div></div>
    <div class="side-card"><h4>FocusBand</h4><div class="chip-row">${MODULES.map(m=>`<span class="chip ${profile.unlocked.includes(m.id)?'unlocked':''}">${m.icon} ${m.name}</span>`).join('')}</div><div class="micro" style="margin-top:10px">Run chips: ${run.chips} · Account: ${profile.chips}</div></div>
    <div class="side-card"><h4>Today</h4><div class="quest ${run.completedQuests.includes('focus')?'done':''}"><b>🎯 Focus >= 60</b><span>${statValue('focus')} / 60</span></div><div class="quest ${run.screenMinutes<180?'':'done'}"><b>📱 Observe screen time</b><span>${run.screenMinutes} virtual min</span></div><div class="quest"><b>😴 Sleep plan</b><span>${run.sleepHours.toFixed(1)} h target</span></div></div>
    <div class="side-card"><h4>Run</h4><div class="micro">XP ${run.xp} · Chips ${run.chips}<br>Screen ${run.screenMinutes} min<br>Night screen ${run.nightScreen} min</div><button class="btn ghost" style="width:100%;margin-top:10px" id="exportRun">Run exportieren</button></div>
  </aside>`;
}

function pickEvent(){
  const slot=SLOT_ORDER[run.slotIndex];
  let pool=EVENTS.filter(e=>e.slot===slot && !run.seen.includes(e.id));
  if(pool.length===0) pool=EVENTS.filter(e=>e.slot===slot);
  const ev=rand(pool);
  run.seen.push(ev.id); if(run.seen.length>40) run.seen.shift();
  return ev;
}

async function renderGame(){
  if(!run){const saved=(await DB.all('runs')).filter(r=>!r.ended).sort((a,b)=>String(b.startedAt).localeCompare(String(a.startedAt)))[0]; if(saved)run=saved; else return go('menu');}
  const maxDay=run.mode==='story'?21:run.mode==='daily'?3:Infinity;
  if(run.day>maxDay) return endRun();
  if(run.slotIndex===0 && STORY_BEATS[run.day] && run.mode==='story' && !run.timeline.some(x=>x.beatDay===run.day)) return renderBeat(STORY_BEATS[run.day]);
  const ev=pickEvent();
  app.innerHTML=`<div class="game-shell">${gameTopbar()}<main class="game-main"><div class="wrap game-grid"><section class="game-panel"><div class="scene-head"><div><div class="scene-kicker">DAY ${run.day} · ${SLOT_LABEL[ev.slot]}</div><h1 class="scene-title">${esc(ev.title)}</h1><div class="scene-sub">${run.mode==='endless'?'Endless run':'Your choices shape the next hours.'}</div></div><span class="pill">${String(run.sleepHours.toFixed(1))}h sleep plan</span></div><div class="scene-body">
  <div class="story-card"><div class="speaker"><div class="avatar" style="background:${CHARACTERS[ev.speaker]?.color||'#334'}">${CHARACTERS[ev.speaker]?.emoji||'R'}</div><div><b>${CHARACTERS[ev.speaker]?.name||'REBOOT'}</b><span>${CHARACTERS[ev.speaker]?.role||'System'}</span></div></div><p>${esc(ev.text)}</p></div>
  <div class="choices">${ev.choices.map((c,i)=>`<button class="choice ${c.tag||''}" data-choice="${i}"><b>${esc(c.label)}</b><span>${esc(c.sub)}</span><div class="impact">${impactHint(c.impact)}</div></button>`).join('')}</div>
  ${ev.insight?`<div class="insight"><b>REBOOT Insight</b><p>${esc(INSIGHTS.find(x=>x.id===ev.insight)?.text||'')}</p></div>`:''}
  </div></section>${sidebar()}</div></main></div>`;
  document.getElementById('pauseBtn').onclick=renderPause;
  document.getElementById('exportRun').onclick=exportRun;
  document.querySelectorAll('[data-choice]').forEach(btn=>btn.onclick=()=>choose(ev,Number(btn.dataset.choice)));
}

function impactHint(i={}){
  const out=[]; const map={energy:'Energy',focus:'Focus',mood:'Mood',balance:'Balance',social:'Social',screen:'Screen',sleep:'Sleep',chips:'Chips',xp:'XP'};
  Object.entries(i).forEach(([k,v])=>{if(k==='rel')return;if(!v)return;out.push(`${v>0?'+':''}${v}${k==='screen'?'m':k==='sleep'?'h':''} ${map[k]||k}`)});
  return out.join(' · ') || 'Story choice';
}

async function choose(ev,index){
  document.querySelectorAll('[data-choice]').forEach(b=>b.disabled=true);
  const c=ev.choices[index]; addImpact(c.impact); run.timeline.push({day:run.day,slot:ev.slot,event:ev.title,choice:c.label});
  await logEvent('choice',{eventId:ev.id,choice:c.label,impact:c.impact,stats:{...run.stats}});
  if(c.tag==='one-more') toast('ONE MORE: kurzfristig gut, später spürbar.');
  await saveAll();
  if(ev.mini){ await startMini(ev.mini); return; }
  advanceSlot();
}

async function renderBeat(beat){
  run.timeline.push({beatDay:run.day,event:beat.title,choice:'chapter'});await saveAll();
  app.innerHTML=`<div class="game-shell">${gameTopbar()}<div class="center-screen"><div class="menu-card"><span class="eyebrow">STORY UPDATE</span><h1>${esc(beat.title)}</h1><p class="section-lead">${esc(beat.text)}</p><div class="grid3" style="margin-top:24px">${Object.entries(CHARACTERS).map(([id,c])=>`<div class="card"><div class="avatar" style="background:${c.color}">${c.emoji}</div><h3>${c.name}</h3><p>${c.intro}</p></div>`).join('')}</div><button class="btn primary large" id="continueBeat" style="margin-top:22px">Weiter →</button></div></div></div>`;
  document.getElementById('continueBeat').onclick=event=>{event.currentTarget.disabled=true;renderGame()};
}

async function advanceSlot(){
  run.slotIndex++;
  if(run.slotIndex>=SLOT_ORDER.length){await closeDay();return;}
  await saveAll(); renderGame();
}

async function closeDay(){
  // Day consequences: sleep and late screen affect next morning gameplay stats.
  const sleepDelta=run.sleepHours-8;
  if(sleepDelta<0){run.stats.energy=clamp(run.stats.energy+sleepDelta*7);run.stats.focus=clamp(run.stats.focus+sleepDelta*5);}
  else {run.stats.energy=clamp(run.stats.energy+Math.min(6,sleepDelta*2));}
  if(run.nightScreen>60) run.stats.focus=clamp(run.stats.focus-3);
  if(profile.unlocked.includes('privacy')) run.stats.balance=clamp(run.stats.balance+5);
  run.day++; run.slotIndex=0; run.sleepHours=8; run.nightScreen=0; run.rerolls=profile.unlocked.includes('haptic')?1:0;
  profile.totalDays++; await saveAll();
  const ended = (run.mode==='story'&&run.day>21)||(run.mode==='daily'&&run.day>3);
  if(ended) return endRun();
  app.innerHTML=`<div class="game-shell">${gameTopbar()}<div class="center-screen"><div class="menu-card"><span class="eyebrow">DAY COMPLETE</span><h1>Day ${run.day-1} logged.</h1><div class="summary-grid"><div class="summary-box"><strong>${statValue('energy')}</strong><span>ENERGY</span></div><div class="summary-box"><strong>${statValue('focus')}</strong><span>FOCUS</span></div><div class="summary-box"><strong>${statValue('mood')}</strong><span>MOOD</span></div><div class="summary-box"><strong>${statValue('balance')}</strong><span>BALANCE</span></div></div><p class="section-lead" style="margin-top:20px">Kein Wert muss 100 sein. Gute Balance heißt nicht maximale Leistung in jeder Kategorie – sondern bewusst mit Trade-offs umgehen.</p><button class="btn primary large" id="nextDay">Day ${run.day} starten</button></div></div></div>`;
  document.getElementById('nextDay').onclick=event=>{event.currentTarget.disabled=true;renderGame()};
}

function renderPause(){
  app.innerHTML=`<div class="game-shell">${gameTopbar()}<div class="center-screen"><div class="menu-card"><span class="eyebrow">PAUSED</span><h1>Run pausiert</h1><p class="section-lead">Dein Spielstand ist lokal gespeichert.</p><div class="mode-grid"><button class="btn primary large" id="resume">Weiterspielen</button><button class="btn ghost large" id="labFromPause">FocusBand Lab</button><button class="btn ghost large" id="exportPause">Run exportieren</button><button class="btn danger large" id="quitRun">Run beenden</button></div></div></div></div>`;
  document.getElementById('resume').onclick=renderGame;document.getElementById('labFromPause').onclick=()=>go('lab');document.getElementById('exportPause').onclick=exportRun;document.getElementById('quitRun').onclick=async()=>{if(confirm('Run wirklich beenden?'))endRun(true)};
}

async function startMini(type){
  cancelMini();
  miniSession={type,finished:false,timers:new Set()};
  await saveAll();
  if(type==='focus') return miniFocus();
  if(type==='memory') return miniMemory();
  if(type==='shield') return miniShield();
  if(type==='signal') return miniSignal();
  advanceSlot();
}

function cancelMini(){
  if(!miniSession) return;
  for(const timer of miniSession.timers){clearTimeout(timer);clearInterval(timer)}
  miniSession=null;
}
function miniTimeout(callback,delay){
  const session=miniSession;
  const timer=setTimeout(()=>{
    session.timers.delete(timer);
    if(miniSession===session)callback();
  },delay);
  session.timers.add(timer);
  return timer;
}
function miniInterval(callback,delay){
  const session=miniSession;
  const timer=setInterval(()=>{if(miniSession===session)callback()},delay);
  session.timers.add(timer);
  return timer;
}

function miniFrame(title,desc,body){
  app.innerHTML=`<div class="game-shell">${gameTopbar()}<main class="game-main"><div class="wrap"><section class="game-panel minigame"><div class="mini-head"><div><div class="scene-kicker">MINIGAME</div><h2>${title}</h2><div class="scene-sub">${desc}</div></div><div id="miniScore" class="pill">0</div></div>${body}</section></div></main></div>`;
  document.getElementById('pauseBtn').onclick=()=>{
    const type=miniSession.type;
    cancelMini();
    renderPause();
    document.getElementById('resume').onclick=()=>startMini(type);
  };
}

function miniDifficulty(){
  const focus=run.stats.focus, energy=run.stats.energy;
  return clamp(1 + (100-focus)/80 + (100-energy)/120,1,2.2);
}

async function finishMini(type,score,max=100){
  if(!miniSession||miniSession.finished) return;
  miniSession.finished=true;
  document.querySelectorAll('.arena button').forEach(b=>b.disabled=true);
  for(const timer of miniSession.timers){clearTimeout(timer);clearInterval(timer)}
  miniSession.timers.clear();
  const pct=clamp(Math.round(score/max*100));
  run.miniScores.push({day:run.day,type,score:pct});
  run.xp+=Math.round(pct/10); run.chips += pct>=75?2:pct>=45?1:0;
  run.stats.focus=clamp(run.stats.focus+(pct>=70?3:pct<35?-3:0));
  if(profile.unlocked.includes('pulse')) run.stats.energy=clamp(run.stats.energy+2);
  await logEvent('minigame',{type,score:pct}); await saveAll();
  app.innerHTML=`<div class="game-shell">${gameTopbar()}<div class="center-screen"><div class="menu-card"><span class="eyebrow">MINIGAME COMPLETE</span><h1>${pct}%</h1><p class="section-lead">${pct>=80?'Starker Run.':pct>=50?'Solide – trotz Ablenkung.':'Schwierig heute. Schau auf Energy und Focus; das ist Teil des Modells.'}</p><div class="summary-grid"><div class="summary-box"><strong>+${Math.round(pct/10)}</strong><span>XP</span></div><div class="summary-box"><strong>+${pct>=75?2:pct>=45?1:0}</strong><span>CHIPS</span></div><div class="summary-box"><strong>${statValue('focus')}</strong><span>FOCUS</span></div><div class="summary-box"><strong>${statValue('energy')}</strong><span>ENERGY</span></div></div><button class="btn primary large" id="miniNext" style="margin-top:20px">Weiter</button></div></div></div>`;
  document.getElementById('miniNext').onclick=event=>{event.currentTarget.disabled=true;cancelMini();advanceSlot()};
}

function miniFocus(){
  miniFrame('Focus Rush','Triff die leuchtenden Targets. Notifications sind nur Ablenkung.',`<div class="arena" id="arena"></div><p class="micro">Je niedriger Energy/Focus, desto kürzer bleibt ein Target sichtbar.</p>`);
  const arena=document.getElementById('arena'),scoreEl=document.getElementById('miniScore'); let score=0,miss=0,total=0; const diff=miniDifficulty(); let alive=true;
  const spawn=()=>{if(!alive)return;if(total>=18){alive=false;return miniTimeout(()=>finishMini('focus',score,18),400)};total++;
    const b=document.createElement('button');b.className='target';b.style.left=`${10+Math.random()*80}%`;b.style.top=`${12+Math.random()*76}%`;arena.appendChild(b);let hit=false;b.onclick=()=>{if(hit)return;hit=true;score++;scoreEl.textContent=`${score} / 18`;b.remove();};
    if(Math.random()<0.55){const n=document.createElement('div');n.className='distractor';n.style.left=`${5+Math.random()*66}%`;n.style.top=`${5+Math.random()*78}%`;n.textContent=rand(['NEW MESSAGE','🔥 STREAK','ONE MORE?','12 new clips','Ranked invite']);arena.appendChild(n);miniTimeout(()=>n.remove(),650);}
    miniTimeout(()=>{if(!hit){miss++;b.remove()} spawn();},Math.max(340,850/diff));
  };spawn();
}

function miniMemory(){
  const seq=[...Array(5)].map(()=>Math.floor(Math.random()*16)); miniFrame('Memory Pulse','Merke dir die aufleuchtenden Felder.',`<div class="arena"><div class="memory-grid" id="memgrid">${[...Array(16)].map((_,i)=>`<button class="memory-cell" data-i="${i}"></button>`).join('')}</div></div>`);
  const cells=[...document.querySelectorAll('.memory-cell')];let input=[];cells.forEach(c=>c.disabled=true);
  (async()=>{for(const idx of seq){cells[idx].classList.add('lit');await new Promise(r=>miniTimeout(r,Math.max(280,520/miniDifficulty())));cells[idx].classList.remove('lit');await new Promise(r=>miniTimeout(r,130))}cells.forEach(c=>c.disabled=false);})();
  cells.forEach(c=>c.onclick=()=>{input.push(Number(c.dataset.i));c.classList.add('lit');miniTimeout(()=>c.classList.remove('lit'),160);document.getElementById('miniScore').textContent=`${input.length} / ${seq.length}`;if(input.length===seq.length){cells.forEach(cell=>cell.disabled=true);const correct=input.reduce((n,x,i)=>n+(x===seq[i]?1:0),0);miniTimeout(()=>finishMini('memory',correct,seq.length),250);}});
}

function miniShield(){
  miniFrame('Notification Shield','Tippe nur auf wichtige Nachrichten. Ignoriere Clickbait und Streaks.',`<div class="arena" id="shieldArena"></div><p class="micro">Wichtig: Schul-Lab, Familie, echte Verabredung. Unwichtig: Streaks, Promo, algorithmische Pushes.</p>`);
  const arena=document.getElementById('shieldArena');let score=0,total=0,done=0;const items=[['Sami: Labraum wurde auf 14:30 verschoben',1],['🔥 Deine Streak endet in 9 Minuten',0],['Leon: Bin in 10 Min am Treffpunkt',1],['LIMITED DROP – nur heute!',0],['Mia: Kannst du mir die Folie schicken?',1],['12 neue Videos für dich',0],['Familie: Zug hat Verspätung',1],['Du wurdest in einem Clip markiert',0]];
  items.sort(()=>Math.random()-.5).forEach((it,i)=>miniTimeout(()=>{const n=document.createElement('button');n.className='notif';n.style.left=`${5+Math.random()*55}%`;n.style.top=`${8+Math.random()*70}%`;n.textContent=it[0];arena.appendChild(n);let resolved=false;n.onclick=()=>{if(resolved)return;resolved=true;done++;score+=it[1]?1:-1;n.classList.add(it[1]?'good':'');n.remove();document.getElementById('miniScore').textContent=`${Math.max(0,score)} pts`;if(done===items.length)finishMini('shield',Math.max(0,score),4)};miniTimeout(()=>{if(!resolved){resolved=true;done++; if(!it[1])score+=1; n.remove(); if(done===items.length)finishMini('shield',Math.max(0,score),4)}},1800/miniDifficulty());},i*520));
}

function miniSignal(){
  miniFrame('Signal Calibration','Drücke CALIBRATE, wenn der Marker im grünen Referenzfenster liegt.',`<div class="arena"><div class="signal-track"><div class="signal-zone"></div><div class="signal-dot" id="signalDot"></div></div><div style="text-align:center;margin-top:24px"><button class="btn primary large" id="calibrate">CALIBRATE</button></div><p class="micro">Messwerte brauchen Kontext, Referenzen und reproduzierbare Bedingungen.</p></div>`);
  const dot=document.getElementById('signalDot');let x=0,dir=1,attempts=0,score=0;const timer=miniInterval(()=>{x+=dir*(1.2*miniDifficulty());if(x>=100){x=100;dir=-1}if(x<=0){x=0;dir=1}dot.style.left=x+'%';},16);
  document.getElementById('calibrate').onclick=()=>{attempts++;const dist=Math.abs(x-69);score+=Math.max(0,25-dist*2);document.getElementById('miniScore').textContent=`${Math.round(score)} pts`;if(attempts>=4){clearInterval(timer);finishMini('signal',score,100)}};
}

async function endRun(manual=false){
  if(!run)return go('menu');run.ended=true;run.endedAt=new Date().toISOString();
  const bonus=Math.round((run.stats.balance+run.stats.focus+run.stats.mood)/6); profile.xp+=run.xp+bonus;profile.chips+=run.chips;profile.totalRuns++;profile.bestBalance=Math.max(profile.bestBalance,Math.round(run.stats.balance));
  unlockAchievements();await saveAll();await logEvent('run_end',{manual,stats:run.stats,xp:run.xp,chips:run.chips});
  remotePost('runs',{id:run.id,mode:run.mode,startedAt:run.startedAt,endedAt:run.endedAt,day:run.day,stats:run.stats,screenMinutes:run.screenMinutes,xp:run.xp,chips:run.chips});
  const r=run;run=null;
  app.innerHTML=`<div class="game-shell"><div class="center-screen"><div class="menu-card"><span class="eyebrow">RUN COMPLETE</span><h1>${manual?'Run beendet':'Season complete.'}</h1><p class="section-lead">Dein Ergebnis ist kein Gesundheitswert. Es zeigt nur, welche Trade-offs dein Spielstil im REBOOT-Modell erzeugt hat.</p><div class="summary-grid"><div class="summary-box"><strong>${Math.round(r.stats.balance)}</strong><span>BALANCE</span></div><div class="summary-box"><strong>${Math.round(r.stats.focus)}</strong><span>FOCUS</span></div><div class="summary-box"><strong>${r.screenMinutes}</strong><span>SCREEN MIN</span></div><div class="summary-box"><strong>${r.xp+bonus}</strong><span>XP EARNED</span></div></div>
  <h3 style="margin-top:24px">Deine Story</h3><div class="timeline">${r.timeline.slice(-8).map(t=>`<div class="timeline-item"><b>Day ${t.day||t.beatDay}</b> ${esc(t.event)} — ${esc(t.choice)}</div>`).join('')}</div>
  <div class="hero-cta"><button class="btn primary" id="backHub">Zum Hub</button><button class="btn ghost" id="exportEnded">Run exportieren</button><button class="btn purple" id="replay">Neuer Run</button></div></div></div></div>`;
  document.getElementById('backHub').onclick=()=>go('menu');document.getElementById('replay').onclick=()=>go('menu');document.getElementById('exportEnded').onclick=()=>downloadJSON(`reboot-run-${r.id}.json`,r);
}

function unlockAchievements(){
  const rules=[['first-run','First Reboot',profile.totalRuns>=1],['balanced','Balanced',run.stats.balance>=75],['lab-rat','Signal Hunter',run.miniScores.some(x=>x.type==='signal'&&x.score>=80)],['focus','Locked In',run.miniScores.some(x=>x.type==='focus'&&x.score>=80)],['social','Real Ones',Object.values(run.relationships).some(v=>v>=75)],['night-owl','Night Owl',run.nightScreen>=90]];
  rules.forEach(([id,name,ok])=>{if(ok&&!profile.achievements.includes(id)){profile.achievements.push(id);toast(`Achievement: ${name}`)}});
}

async function renderLab(){
  if(!profile)profile=await DB.get('profiles','local-player')||freshProfile();
  app.innerHTML=`<div class="game-shell"><div class="game-topbar"><div class="wrap"><div class="game-brand">FOCUSBAND // LAB</div><button class="btn ghost" id="labBack">← Zurück</button></div></div><div class="center-screen"><div class="menu-card"><span class="eyebrow">${profile.chips} CHIPS AVAILABLE</span><h1>Build the prototype.</h1><p class="section-lead">Jedes Modul erklärt einen kleinen MedTech-Aspekt und gibt einen leichten Gameplay-Perk. Kein Modul ist ein echtes Medizinprodukt.</p><div class="grid3">${MODULES.map(m=>`<div class="card"><div class="icon">${m.icon}</div><h3>${m.name}</h3><p>${m.desc}</p><p style="margin-top:10px;color:#9dff8b"><b>Perk:</b> ${m.perk}</p><button class="btn ${profile.unlocked.includes(m.id)?'ghost':'primary'}" style="margin-top:14px;width:100%" data-module="${m.id}" ${profile.unlocked.includes(m.id)?'disabled':''}>${profile.unlocked.includes(m.id)?'UNLOCKED':`Unlock · ${m.cost} chips`}</button></div>`).join('')}</div></div></div></div>`;
  document.getElementById('labBack').onclick=()=>go(run?'game':'menu');
  document.querySelectorAll('[data-module]').forEach(b=>b.onclick=async()=>{const m=MODULES.find(x=>x.id===b.dataset.module);if(profile.chips<m.cost)return toast('Nicht genug Chips. Spiele Minigames.');profile.chips-=m.cost;profile.unlocked.push(m.id);await DB.put('profiles',profile);toast(`${m.name} freigeschaltet`);renderLab();});
}

function exportRun(){if(run)downloadJSON(`reboot-run-${run.id}.json`,run)}
async function exportAll(){const data={version:APP_VERSION,profile, runs:await DB.all('runs'),events:await DB.all('events')};downloadJSON('reboot-local-data.json',data)}
function downloadJSON(name,obj){const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}

async function handleRoute(){
  cancelMini();
  const r=route();
  if(r==='home')renderHome();else if(r==='about')renderAbout();else if(r==='learn')renderLearn();else if(r==='menu')await renderMenu();else if(r==='game')await renderGame();else if(r==='lab')await renderLab();else renderHome();
  window.scrollTo(0,0);
}

document.addEventListener('click',event=>{
  const target=event.target.closest('[data-route]');
  if(target)go(target.dataset.route);
});
window.addEventListener('hashchange',handleRoute);
(async()=>{
  try{await DB.open()}catch(e){console.warn('IndexedDB unavailable, using localStorage fallback',e)}
  profile=await DB.get('profiles','local-player');
  if(!profile){profile=freshProfile('Player');await DB.put('profiles',profile)}
  if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(()=>{});
  handleRoute();
})();

})();
