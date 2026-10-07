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
  {id:'haptic',name:'Haptic Nudge',cost:6,icon:'≈',desc:'Ein kurzer Vibrationshinweis erinnert an selbst gesetzte Pausen – ohne Zwang.',perk:'Einmal pro Tag eine andere Szene wählen.'},
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

export {SOURCES, CHARACTERS, MODULES, INSIGHTS, EVENTS, STORY_BEATS, SLOT_ORDER, SLOT_LABEL};
