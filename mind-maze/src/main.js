import {Game,ROOMS,TOOLS} from './game.js';
import {createWorld} from './world.js';

const $=id=>document.getElementById(id);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const glyphs={1:'◇',2:'◉',3:'△',4:'✚'};
const taskNames={plan:'Bauplan lesen',wire:'Leitungen verbinden',test:'Sicherheit prüfen',send:'Ergebnis übertragen'};
const toolIcons={scanner:'⌕',shield:'◈',planner:'≋',bypass:'⌁'};
const filterItems=[{id:'map',label:'NAV / Wartungskarte',text:'Die Karte markiert den sicheren Weg zum Energieknoten.'},{id:'streak',label:'AURA / Streak-Alarm',text:'Deine Serie endet! Öffne sofort den Feed.'},{id:'alarm',label:'SICHERHEIT / Leitungswarnung',text:'Lies die Schaltregeln, bevor du den Energieknoten einschaltest.'},{id:'sale',label:'AURA / Exklusivangebot',text:'Nur für dich: doppelte Credits, wenn du jetzt reagierst.'},{id:'team',label:'TEAM / Arbeitsauftrag',text:'Prüfe die Leitung und übertrage erst das bestätigte Ergebnis.'},{id:'feed',label:'AURA / Neues für dich',text:'12 überraschende Videos warten in deinem persönlichen Feed.'}];
let world,scene='home',previous='explore',puzzle=null,clueTime=0,intrusionAge=0,distractionPoll=0,lastFrame=performance.now(),saveTime=0,hudTime=0,toastTimer;
let sound=false,audio,pad=[],selectedTool='scanner',lastPendingId=null;
const game=new Game();
const room=()=>game.currentRoom();
const passed=result=>result===true||result?.ok===true;
const reason=result=>result?.reason||result?.message||'Das passt noch nicht. Prüfe den Hinweis im Raum.';
function beep(frequency=440,duration=.12){if(!sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();const osc=audio.createOscillator(),gain=audio.createGain();osc.frequency.value=frequency;gain.gain.setValueAtTime(.025,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);osc.connect(gain);gain.connect(audio.destination);osc.start();osc.stop(audio.currentTime+duration);}catch{}}
function toggleSound(){
  sound=!sound;$('sound-toggle').setAttribute('aria-pressed',String(sound));$('sound-toggle').title=sound?'Ton ausschalten':'Ton einschalten';
  pad.forEach(o=>{try{o.stop()}catch{}});pad=[];
  if(!sound)return;
  try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();for(const hz of [110,164.81,220]){const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=hz;g.gain.value=.009;o.connect(g);g.connect(audio.destination);o.start();pad.push(o)}}catch{}
}
function toast(message){clearTimeout(toastTimer);$('toast-root').textContent=message;$('toast-root').classList.add('visible');toastTimer=setTimeout(()=>$('toast-root').classList.remove('visible'),4200)}
function persist(){if(world&&game.state?.started&&!game.state.ended&&scene!=='home')game.setPosition(world.getPlayerPosition());game.save();$('save-indicator').textContent=game.storageFailed?'Speicherung blockiert · Sitzung spielbar':'Lokal gespeichert'}
function setScene(next){scene=next;$('home').hidden=next!=='home';$('hud').hidden=next==='home';document.body.classList.toggle('is-playing',next!=='home');world?.setActive(next==='explore');$('touch-controls').hidden=next!=='explore';$('distraction-root').hidden=!['explore','puzzle','clue'].includes(next)}
function overlay(title,body,{label='MIND MAZE // M–06',actions='',className=''}={}){$('overlay-root').innerHTML=`<div class="modal-shade"><section class="panel ${className}" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div class="eyebrow">${label}</div><h2 id="dialog-title">${title}</h2>${body}${actions?`<div class="overlay-actions">${actions}</div>`:''}</section></div>`;$('overlay-root').querySelector('button:not(:disabled),input')?.focus({preventScroll:true})}
function clearOverlay(){$('overlay-root').replaceChildren()}
function toolList(){return Array.isArray(TOOLS)?TOOLS:Object.entries(TOOLS).map(([id,value])=>({id,...value}))}
function nearest(){return world.getTargets().filter(t=>t.id!=='secret'||game.state?.secretUnlocked&&!game.state?.secretSolved).filter(t=>t.id!=='quiet'||game.state?.secretSolved).map(t=>({...t,distance:world.distanceToTarget(t.id)})).sort((a,b)=>a.distance-b.distance)[0]}
function renderHUD(){
  const s=game.state,r=room();if(!s||!r)return;
  $('room-label').textContent=r.title;$('room-number').textContent=s.roomIndex===6?'GEHEIMER RAUM':`RAUM ${String(s.roomIndex+1).padStart(2,'0')} / 06`;
  for(const key of ['focus','stress']){const value=Math.round(s[key]);$(key+'-meter').style.width=`${value}%`;$(key+'-meter').setAttribute('aria-valuenow',String(value));$(key+'-meter').title=`${key==='focus'?'Fokus':'Stress'}: ${value} / 100`}
  const observed=s.observed?.includes(s.roomIndex);
  $('objective').textContent=s.roomSolved?(s.roomIndex===6?'Stillraum entdeckt. Kehre durch das Portal zurück.':s.roomIndex===5?(s.exitRoute==='quiet'?'Der stille Ausgang ist offen. Gehe zum PAUSE-Portal.':'Der Hauptausgang ist offen. Gehe zum FOKUS-Portal.'):s.roomIndex===2&&!s.secretSolved?'Portal offen. Ein verborgener Raum wurde sichtbar.': 'Portal offen. Gehe zum nächsten Raum.'):
    !observed?'Finde den leuchtenden Datenkristall und lies den Raumhinweis.':s.roomIndex===3?`Sichere Platten: ${s.trapWitness?.join(' → ')||'A → C → D → F'}. Erreiche das Portal.`:r.objective;
  $('tools').innerHTML=toolList().map(t=>{const owned=s.tools?.[t.id];return`<button class="tool-card ${owned?.owned?'owned':''}" data-tool="${t.id}" title="${esc(t.name)}" aria-label="${esc(t.name)}: ${owned?.owned?owned.charges+' Ladungen':'gesperrt'}"><span>${toolIcons[t.id]||'◇'}</span><small>${esc(t.name||t.id)}</small><b>${owned?.owned?owned.charges:'+'}</b></button>`}).join('');
  world.setSolved(s.roomSolved);world.setExitRoute?.(s.exitRoute,s.secretSolved);world.setSecretVisible?.(s.roomIndex===2&&s.secretUnlocked&&!s.secretSolved);world.setTool('shield',s.shieldActive);persistIndicator();
}
function persistIndicator(){$('save-indicator').textContent=game.storageFailed?'Speicherung blockiert · Sitzung spielbar':'Lokal gespeichert'}
function loadCurrent(){
  const r=room();world.loadRoom(r);world.setPlayerPosition(game.state.position||{x:0,z:5.5});world.setSolved(game.state.roomSolved);world.setSecretVisible?.(game.state.roomIndex===2&&game.state.secretUnlocked&&!game.state.secretSolved);
  for(const id of ['scanner','shield','planner','bypass'])world.setTool(id,Boolean(game.state.tools?.[id]?.owned));world.setTool('shield',game.state.shieldActive);puzzle=null;renderHUD();
}
function home(){persist();clearOverlay();setScene('home');$('continue').hidden=!game.state?.started||game.state.ended;$('distraction-root').replaceChildren();if(game.state?.started)loadCurrent();else world.loadRoom(ROOMS[0]);}
function intro(){const r=room();setScene('intro');overlay(esc(r.title),`<p class="muted">${esc(r.narrative)}</p><div class="insight-card"><span>MISSION</span><p>${esc(r.objective)}</p></div>`,{label:`${game.state.roomIndex===6?'STILLRAUM':`SEKTOR ${String(game.state.roomIndex+1).padStart(2,'0')}`} // AURA IST ONLINE`,actions:'<button class="btn primary" data-action="explore">Raum erkunden →</button>'})}
function explore(){clearOverlay();setScene('explore');renderHUD();renderDistraction();persist()}
function launch(resume=false){if(scene!=='home')return;const r=resume?game.resume():game.start();if(!passed(r)&&!(r?.started&&!r?.ended)){toast(reason(r));return;}loadCurrent();beep(550);if(resume)explore();else intro()}
function clueText(r){return typeof r.clue==='string'?r.clue:r.clue?.text||r.clue?.description||r.narrative}
function observe(restart=true){
  game.observeClue();if(restart)clueTime=0;setScene('clue');const r=room(),sequence=r.clue?.sequence||r.clue?.symbols||r.puzzle?.sequence||[2,4,1,3];
  overlay(esc(r.clue?.title||'Datenkristall'),`<p class="muted">${esc(clueText(r))}</p>${r.index===0?`<div class="symbol-strip">${[1,2,3,4].map(n=>`<div class="puzzle-key" data-clue-symbol="${n}">${glyphs[n]}</div>`).join('')}</div><p class="muted" id="clue-status">Die Sequenz wird übertragen …</p>`:''}<div class="insight-card"><span>DATENFRAGMENT</span><p>${r.index===6?'Ein verborgener Ausgang beginnt mit PAUSE.':esc((game.state.fragments||[]).join(' · ')||'Löse den Raum, um ein Fragment zu bergen.')}</p></div>`,{label:'ARCHIV // HINWEIS',actions:'<button class="btn primary" data-action="explore">Hinweis schließen</button>'});
  puzzle={type:'clue',sequence};renderHUD();beep(680);persist();
}
function beginPuzzle(){
  const r=room();if(game.state.roomSolved){toast('Dieser Raum ist entschlüsselt. Das Portal ist offen.');return;}
  if(!game.state.observed?.includes(game.state.roomIndex)){toast('Lies zuerst den Datenkristall auf der anderen Seite des Raums.');return;}
  puzzle={type:r.kind||['memory','filter','circuit','bridge','schedule','final','secret'][r.index],symbols:[],selected:new Set(),switches:[false,false,false,true],order:['send','test','plan','wire']};
  setScene('puzzle');renderPuzzle();
}
function renderPuzzle(){
  const r=room(),index=r.index;let body='';
  if(index===0)body=`<p class="muted">Übertrage die vier Impulse aus dem Datenkristall in der richtigen Reihenfolge.</p><div class="symbol-strip" id="entered-symbols">${puzzle.symbols.map(n=>`<span>${glyphs[n]}</span>`).join('')||'<span>–</span>'}</div><div class="puzzle-grid">${[1,2,3,4].map(n=>`<button class="puzzle-key" data-symbol="${n}" aria-label="Symbol ${n}">${glyphs[n]}<small>${n}</small></button>`).join('')}</div><button class="btn ghost" data-action="reset-memory">Eingabe löschen</button>`;
  else if(index===1)body=`<p class="muted">Welche drei Nachrichten helfen dir beim Entkommen? Wähle sie aus; künstliche Dringlichkeit allein ist kein Grund.</p><div class="filter-list">${filterItems.map(i=>`<button class="choice-card ${puzzle.selected.has(i.id)?'is-selected':''}" data-message="${i.id}" aria-pressed="${puzzle.selected.has(i.id)}"><strong>${esc(i.label)}</strong><span>${esc(i.text)}</span><em>${puzzle.selected.has(i.id)?'✓ AUSGEWÄHLT':'AUSWÄHLEN'}</em></button>`).join('')}</div>`;
  else if(index===2)body=`<p class="muted">Schalte den Ausgang frei. Genau zwei Kanäle dürfen aktiv sein. A ist Pflicht. A braucht C. B und C vertragen sich nicht. D darf nur zusammen mit B laufen.</p><div class="circuit-board">${['A','B','C','D'].map((id,i)=>`<button class="circuit-node ${puzzle.switches[i]?'is-on':''}" data-switch="${i}" aria-pressed="${puzzle.switches[i]}"><span>${id}</span><strong>${['Versorgung','Zusatzlast','Kühlung','Nebenmodul'][i]}</strong><small>${puzzle.switches[i]?'AKTIV':'INAKTIV'}</small></button>`).join('')}</div><p class="muted">${puzzle.switches.filter(Boolean).length} / 2 Kanäle aktiv · Der Bypass bietet eine andere Lösung.</p>`;
  else if(index===3)body=`<p class="muted">Betrete die Bodenplatten A → C → D → F mit deiner Figur. Beobachte die Laser oder nutze den Scanner. Der Schild erlaubt einen geschützten Weg über mindestens drei verschiedene Platten bis F.</p><div class="symbol-strip">${['A','C','D','F'].map(k=>`<span class="${game.state.trapWitness?.includes(k)?'is-active':''}">${k}</span>`).join('')}</div><p class="muted">Aktuell: ${esc(game.state.trapWitness?.join(' → ')||'Noch keine Platte erreicht')}</p>`;
  else if(index===4)body=`<p class="muted">Ordne die Arbeitsschritte. Ein Wechsel zur nächsten Aufgabe lohnt sich erst, wenn die vorige Voraussetzung erfüllt ist.</p><div class="task-list">${puzzle.order.map((id,i)=>`<div class="timeline-task"><span class="task-number">0${i+1}</span><strong>${taskNames[id]}</strong><button class="btn ghost" data-task="${i}" data-direction="-1" aria-label="${taskNames[id]} nach oben" ${i===0?'disabled':''}>↑</button><button class="btn ghost" data-task="${i}" data-direction="1" aria-label="${taskNames[id]} nach unten" ${i===3?'disabled':''}>↓</button></div>`).join('')}</div>`;
  else if(index===5)body=`<p class="muted">Setze die gesammelten Fragmente zum zentralen Code zusammen. Der verborgene Stillraum eröffnet einen zweiten Weg.</p><div class="symbol-strip">${(game.state.fragments||[]).map(v=>`<span>${esc(v)}</span>`).join('')}</div><label class="code-label" for="escape-code">AUSGANGSCODE<input id="escape-code" type="text" maxlength="12" autocomplete="off" spellcheck="false" placeholder="Fünf Zeichen" value="${esc(puzzle.code||'')}" /></label><p class="muted">${game.state.secretSolved?'Stillraum-Archiv: PAUSE ist der alternative Code.':'Ein verborgener Raum kann einen weiteren Ausgang freilegen.'}</p>`;
  else body=`<p class="muted">Das Archiv zeigt drei Möglichkeiten. Welche Strategie senkt vermeidbare Wechselkosten?</p><div class="puzzle-grid secret-answers">${['ALLE GLEICHZEITIG','EINE SACHE','SCHNELLER KLICKEN'].map(v=>`<button class="choice-card ${puzzle.secret===v?'is-selected':''}" data-secret-answer="${v}">${v}</button>`).join('')}</div>`;
  overlay(esc(r.title),body,{label:'TERMINAL // ENTSCHLÜSSELN',className:'puzzle-panel',actions:`<button class="btn ghost" data-action="explore">Zum Raum</button>${index!==3?'<button class="btn primary" data-action="validate">Lösung prüfen →</button>':''}`});
}
function validate(){
  if(scene!=='puzzle'||!puzzle)return;const index=room().index;
  const answer=index===0?puzzle.symbols:index===1?[...puzzle.selected]:index===2?puzzle.switches:index===3?'traverse':index===4?puzzle.order:index===5?$('escape-code').value.trim().toUpperCase():puzzle.secret;
  const result=game.solve(answer,index===5&&answer==='PAUSE'?'quiet':'balanced');renderHUD();persist();
  if(!passed(result)){beep(180);toast(reason(result));return;}success();
}
function success(){
  beep(880,.25);renderHUD();persist();setScene('solved');const r=room();const insight=typeof r.insight==='string'?r.insight:r.insight?.text||r.lesson||'Fokus entsteht, wenn du relevante Signale erkennst und Aufgaben bewusst zu Ende bringst.';
  overlay('Verbindung wiederhergestellt.',`<p class="muted">${esc(r.title)} ist entschlüsselt. Das Ausgangsportal ist jetzt offen.</p><div class="insight-card"><span>WAS DU ENTDECKT HAST</span><p>${esc(insight)}</p></div>${r.index===2?'<p class="muted">In der Wand ist eine zweite Signatur aufgetaucht. Untersuche sie, bevor du weitergehst.</p>':''}`,{label:'SYSTEM // ENTSPERRT',actions:'<button class="btn primary" data-action="explore">Zum Portal →</button>'});
}
function interact(id){
  if(scene!=='explore')return;
  const target=id?world.getTargets().find(t=>t.id===id):nearest();if(!target)return;
  if(world.distanceToTarget(target.id)>2.15){toast('Gehe näher an das markierte Objekt. Ein Klick auf den Boden bewegt deine Figur.');return;}
  persist();beep(420);
  if(target.id==='clue')observe();
  else if(target.id==='console')beginPuzzle();
  else if(target.id==='secret'){const result=game.enterSecret();if(passed(result)){loadCurrent();intro()}else toast(reason(result))}
  else if(target.id==='exit'||target.id==='quiet'){
    const result=game.state.roomIndex===6?game.leaveSecret():game.state.roomIndex===5?game.finish(target.id==='quiet'?'quiet':'balanced'):game.nextRoom();
    if(!passed(result)){toast(reason(result));return;}
    if(game.state.ended)ending();else{loadCurrent();intro()}
  }
}
function tile(id){
  if(scene!=='explore'||game.state?.roomIndex!==3||game.state.roomSolved)return;
  const result=game.traverseTile(id);renderHUD();
  if(result?.hazard){beep(160);toast(result.reason||'Unsichere Platte. Folge der gespeicherten Reihenfolge.');}
  else if(result?.ok){beep(520);toast(`Platte ${id} · ${game.state.trapWitness?.join(' → ')||''}`)}
  if(result?.complete){const solved=game.solve('traverse',game.state.shieldActive?'shield':'balanced');if(passed(solved))success();}
}
function hazard(hit){if(scene!=='explore'||game.state?.roomIndex!==3||game.state.roomSolved)return;const result=game.hitHazard(typeof hit==='string'?hit:hit?.id);if(passed(result)&&!result.repeated){beep(180);toast(game.state.shieldActive?'Dein Schild fängt den Impuls ab.':'Impulsfeld berührt. Beobachte den Rhythmus oder scanne den Raum.');renderHUD()}}
function tools(id='scanner'){
  if(!game.state){toast('Betrete zuerst das Labyrinth.');return;}if(scene==='ended')return;
  selectedTool=id;setScene('tools');const s=game.state;
  overlay('Werkstatt für deinen Fokus.',`<p class="muted">${s.credits} Credits verfügbar. Gelöste Räume finanzieren Werkzeuge; es gibt keine echten Käufe.</p><div class="tool-shop">${toolList().map(t=>{const p=s.tools?.[t.id];return`<article class="tool-card tool-detail ${t.id===id?'selected':''}"><span class="tool-icon">${toolIcons[t.id]}</span><h3>${esc(t.name)}</h3><p class="muted">${esc(t.description||t.desc||t.effect||'Ein Werkzeug für alternative Lösungswege.')}</p><small>${p?.owned?`Stufe ${p.level} · ${p.charges} Ladungen`:'Noch gesperrt'}</small><div class="tool-actions"><button class="btn primary" data-buy-tool="${t.id}">${p?.owned?'Aufladen':'Freischalten'} · ${t.cost??t.buyCost??{scanner:1,shield:2,planner:3,bypass:3}[t.id]} C</button>${p?.owned?`<button class="btn ghost" data-use-tool="${t.id}" ${p.charges<1?'disabled':''}>Einsetzen</button>${p.level<(t.maxLevel??(t.id==='bypass'?1:2))?`<button class="btn ghost" data-upgrade-tool="${t.id}">Upgrade · 2 C</button>`:''}`:''}</div></article>`}).join('')}</div>`,{label:'TOOLS // DEINE STRATEGIE',className:'tools-panel',actions:'<button class="btn ghost" data-action="explore">Zurück zum Raum</button>'});persist();
}
function useTool(id){
  const result=game.useTool(id);if(!passed(result)){toast(reason(result));return;}
  world.useTool?.(id);renderHUD();beep(650);persist();
  if(game.state.roomSolved){success();return;}
  if(result.type==='clue'){observe();toast(id==='scanner'?'Scanner aktiv. Hinweise und Impulsfelder werden sichtbar.':'Der Planer zeigt die Abhängigkeiten deiner Aufgaben.');}
  else{explore();toast(id==='shield'?'Schild bereit. Erreiche F über drei verschiedene Platten.':'Werkzeug aktiviert. Prüfe das Terminal erneut.');}
}
function journal(){
  if(!game.state)return;setScene('journal');const s=game.state;
  overlay('Der Weg durch M–06.',`<div class="room-map">${ROOMS.map(r=>`<article class="map-room ${s.solved.includes(r.index)?'is-solved':''} ${s.roomIndex===r.index?'is-current':''}"><span>${r.index===6?'?':String(r.index+1).padStart(2,'0')}</span><div><strong>${r.index===6&&!s.secretUnlocked?'Verborgene Signatur':esc(r.title)}</strong><small>${s.solved.includes(r.index)?'Entschlüsselt':s.roomIndex===r.index?'Du bist hier':'Noch verschlossen'}</small></div></article>`).join('')}</div><div class="symbol-strip">${s.fragments.map(v=>`<span>${esc(v)}</span>`).join('')}</div><p class="muted">${s.metrics?.ignored??s.metrics?.distractionsIgnored??0} Störungen bewusst ignoriert. ${s.metrics?.clicked??s.metrics?.distractionsClicked??0} Lockangebote geöffnet.</p>`,{label:'JOURNAL // DEINE FRAGMENTE',actions:'<button class="btn primary" data-action="explore">Weiter erkunden</button>'});persist();
}
function help(){previous=scene==='home'?'home':'explore';setScene(scene==='home'?'home':'help');overlay('Ein Muster nach dem anderen.',`<div class="controls-list"><p><kbd>WASD / Pfeile</kbd> Figur bewegen</p><p><kbd>Klick / Tap auf Boden</kbd> Bewegungsziel setzen</p><p><kbd>E</kbd> Nahe Objekte untersuchen · Klick auf nahe Objekte</p><p><kbd>1 2 3 4</kbd> Symbole im Gedächtnisrätsel</p><p><kbd>J</kbd> Raumkarte · <kbd>T</kbd> Werkzeuge · <kbd>Esc</kbd> Pause</p></div><p class="muted">Datenkristalle geben Hinweise, Terminals prüfen deine Lösung und Portale führen weiter. Im Impulsraum betrittst du echte Bodenplatten mit deiner Figur. AURA-Nachrichten sind Spielsimulationen; künstlicher Zeitdruck verpflichtet dich zu nichts.</p><p class="muted">Fokus und Stress sind vereinfachte Spielwerte. Lerninhalte behandeln Aufmerksamkeitsauswahl, Arbeitsgedächtnis und Wechselkosten.</p>`,{label:'QUICK START',actions:'<button class="btn primary" data-action="close-help">Verstanden</button>'})}
function pause(){if(scene==='paused'){resume();return;}if(!['explore','puzzle','clue'].includes(scene))return;previous=scene;setScene('paused');persist();overlay('Die Störung darf warten.',`<p class="muted">Bewegung, Hinweisfolge und Ablenkungs-Timer sind pausiert. Dein Fortschritt bleibt gespeichert.</p>`,{label:'PAUSE // DEIN TEMPO',actions:'<button class="btn primary" data-action="resume">Weiterspielen</button><button class="btn ghost" data-action="home">Startmenü</button>'})}
function resume(){if(previous==='puzzle'&&puzzle){setScene('puzzle');renderPuzzle();}else if(previous==='clue'){observe(false);}else explore();renderDistraction()}
function ending(){
  setScene('ended');renderHUD();$('distraction-root').replaceChildren();const s=game.state,quiet=s.ending==='quiet';
  overlay(quiet?'Ein stiller Ausgang.':'Du hast deinen Fokus zurück.',`<p class="muted">${quiet?'Du hast den verborgenen Stillraum gefunden und den Ausgang außerhalb von AURAs Belohnungsschleife gewählt.':'Du hast die zentralen Systeme entschlüsselt und die Anlage durch das Hauptportal verlassen.'}</p><div class="result-grid"><div><span>FOKUS</span><strong>${Math.round(s.focus)}</strong></div><div><span>STRESS</span><strong>${Math.round(s.stress)}</strong></div><div><span>SCORE</span><strong>${s.score??0}</strong></div><div><span>GEHEIMRAUM</span><strong>${s.secretSolved?'01 / 01':'00 / 01'}</strong></div></div><div class="insight-card"><span>DEIN WEG</span><p>Du hast relevante Signale ausgewählt, Abfolgen gemerkt, Voraussetzungen geprüft und Aufgaben zu Ende gebracht. Tools sind unterschiedliche Strategien; bewusste Pausen gehören dazu.</p></div>`,{label:'ESCAPE COMPLETE // MIND MAZE',actions:'<button class="btn primary" data-action="home">Zurück zum Start</button><button class="btn ghost" data-action="export">Spielverlauf exportieren</button>'});persist();beep(990,.3)
}
function exportData(){const url=URL.createObjectURL(new Blob([JSON.stringify(game.exportData(),null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='MIND-MAZE-Spielverlauf.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function renderDistraction(){
  const p=game.state?.pendingDistraction;if(!p){$('distraction-root').replaceChildren();lastPendingId=null;return;}
  if(lastPendingId===p.id&&$('distraction-root').firstChild)return;
  lastPendingId=p.id;intrusionAge=0;
  $('distraction-root').innerHTML=`<aside class="distraction-card"><div class="intrusion-label">AURA // SPIELSIMULATION</div><h3 class="intrusion-title">${esc(p.title||'Nur noch ein Klick.')}</h3><p class="intrusion-copy">${esc(p.text||p.message||'Eine scheinbare Belohnung wartet. Ist sie für deinen Weg relevant?')}</p><div class="intrusion-timer" id="intrusion-timer">MELDUNG: 12 s</div><div class="intrusion-actions"><button class="btn danger" data-distraction="click">${esc(p.button||(p.deceptive?'Öffnen':'Signal lesen'))}</button><button class="btn ghost" data-distraction="ignore">Ignorieren</button></div></aside>`;beep(230,.1);
}
function respond(action){const id=game.state?.pendingDistraction?.id;if(!id)return;const result=game.respondDistraction(id,action);if(passed(result)){toast(result.feedback||'Meldung abgeschlossen.');renderHUD();renderDistraction();persist()}}
function dispatch(action){
  if(action==='explore')explore();else if(action==='home')home();else if(action==='resume')resume();else if(action==='validate')validate();else if(action==='reset-memory'){puzzle.symbols=[];renderPuzzle();}else if(action==='close-help'){previous==='home'?home():explore();}else if(action==='export')exportData();else if(action==='interact')interact();
}
function wire(){
  $('launch').onclick=()=>launch();$('continue').onclick=()=>launch(true);$('pause-button').onclick=pause;$('help-button').onclick=help;$('map-button').onclick=journal;$('sound-toggle').onclick=toggleSound;$('interact-button').onclick=()=>interact();
  $('tools').addEventListener('click',e=>{const b=e.target.closest('[data-tool]');if(b)tools(b.dataset.tool)});
  $('distraction-root').addEventListener('click',e=>{const b=e.target.closest('[data-distraction]');if(b)respond(b.dataset.distraction)});
  $('overlay-root').addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b||b.disabled)return;
    if(b.dataset.action)dispatch(b.dataset.action);
    else if(b.dataset.symbol){if(puzzle.symbols.length<4){puzzle.symbols.push(Number(b.dataset.symbol));beep(350+Number(b.dataset.symbol)*70);renderPuzzle()}}
    else if(b.dataset.message){puzzle.selected.has(b.dataset.message)?puzzle.selected.delete(b.dataset.message):puzzle.selected.add(b.dataset.message);renderPuzzle()}
    else if(b.dataset.switch!==undefined){const i=Number(b.dataset.switch);puzzle.switches[i]=!puzzle.switches[i];beep(450);renderPuzzle()}
    else if(b.dataset.task!==undefined){const i=Number(b.dataset.task),to=i+Number(b.dataset.direction);if(to>=0&&to<puzzle.order.length){[puzzle.order[i],puzzle.order[to]]=[puzzle.order[to],puzzle.order[i]];renderPuzzle()}}
    else if(b.dataset.secretAnswer){puzzle.secret=b.dataset.secretAnswer;renderPuzzle()}
    else if(b.dataset.buyTool){const r=game.buyTool(b.dataset.buyTool);if(!passed(r))toast(reason(r));else beep(700);renderHUD();tools(b.dataset.buyTool)}
    else if(b.dataset.upgradeTool){const r=game.upgradeTool(b.dataset.upgradeTool);if(!passed(r))toast(reason(r));else beep(740);renderHUD();tools(b.dataset.upgradeTool)}
    else if(b.dataset.useTool)useTool(b.dataset.useTool);
  });
  $('overlay-root').addEventListener('input',e=>{if(e.target.id==='escape-code'&&puzzle)puzzle.code=e.target.value});
  window.addEventListener('keydown',e=>{
    if(e.target instanceof HTMLInputElement&&e.key!=='Escape'){if(e.key==='Enter'&&scene==='puzzle'){e.preventDefault();validate()}return;}
    if(e.repeat)return;
    if(e.key==='Escape'){if(scene==='paused')resume();else if(['explore','puzzle','clue'].includes(scene))pause();else if(scene!=='home'&&scene!=='ended')explore()}
    else if(e.key.toLowerCase()==='j'&&scene==='explore'){e.preventDefault();journal()}
    else if(e.key.toLowerCase()==='t'&&scene==='explore'){e.preventDefault();tools()}
    else if(scene==='puzzle'&&room().index===0&&['1','2','3','4'].includes(e.key)){e.preventDefault();if(puzzle.symbols.length<4){puzzle.symbols.push(Number(e.key));renderPuzzle()}}
    else if(e.key==='Enter'&&scene==='puzzle'){e.preventDefault();validate()}
  });
  const movement={forward:0,back:0,left:0,right:0};document.querySelectorAll('[data-move]').forEach(b=>{const set=value=>{movement[b.dataset.move]=value;world.setMovement(movement.forward-movement.back,movement.right-movement.left)};b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);set(1)});for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,()=>set(0))});
  document.querySelector('[data-action="interact"]').onclick=()=>interact();window.addEventListener('pagehide',persist);window.addEventListener('blur',()=>{if(['explore','puzzle','clue'].includes(scene))pause()});
}
function frame(time){
  const dt=Math.min(.08,Math.max(0,(time-lastFrame)/1000));lastFrame=time;world.update(dt,time/1000);
  const active=['explore','puzzle','clue'].includes(scene);
  if(scene==='clue'&&room().index===0&&puzzle?.type==='clue'){
    clueTime+=dt;const i=Math.floor(clueTime/1.05);document.querySelectorAll('[data-clue-symbol]').forEach(n=>n.classList.toggle('is-active',i<puzzle.sequence.length&&Number(n.dataset.clueSymbol)===puzzle.sequence[i]&&clueTime%1.05<.75));
    const text=$('clue-status');if(text)text.textContent=i<puzzle.sequence.length?`IMPULS ${i+1} / ${puzzle.sequence.length}`:'Übertragung beendet. Merke dir die Reihenfolge.';
  }
  if(active&&game.state&&!game.state.ended){
    saveTime+=dt;hudTime+=dt;distractionPoll+=dt;
    if(saveTime>2){saveTime=0;persist()}
    if(scene==='explore'&&hudTime>.16){hudTime=0;const t=nearest();$('interact-button').disabled=!t||t.distance>2.15;const label=$('interact-button').querySelector('span:nth-child(2)');if(label)label.textContent=t?`${t.label||t.id} · ${t.distance.toFixed(1)} m`:'Interagieren'}
    if(game.state.pendingDistraction){renderDistraction();intrusionAge+=dt;if($('intrusion-timer'))$('intrusion-timer').textContent=`MELDUNG: ${Math.max(0,Math.ceil(12-intrusionAge))} s`;if(intrusionAge>=12)respond('ignore');}
    else if(distractionPoll>2){distractionPoll=0;game.triggerDistraction();renderDistraction()}
  }
  requestAnimationFrame(frame);
}
async function boot(){
  try{
    world=createWorld({canvas:$('world'),onInteract:interact,onHazard:hazard,onTile:tile,onMove:()=>{}});wire();home();$('loading').hidden=true;requestAnimationFrame(frame);
    if(location.protocol==='file:'){$('download').hidden=true;document.querySelector('.back-link').hidden=true;}
    window.__MIND_MAZE__=Object.freeze({getSnapshot:()=>JSON.parse(JSON.stringify({version:'1.0.0',scene,state:game.state,world:world.getStats(),position:world.getPlayerPosition(),targets:world.getTargets(),tiles:world.getTiles?.(),storageFailed:game.storageFailed,puzzle:puzzle?{type:puzzle.type,symbols:puzzle.symbols,order:puzzle.order,switches:puzzle.switches,selected:[...(puzzle.selected||[])]}:null}))});
    if(location.protocol.startsWith('http')&&'serviceWorker'in navigator){const controlled=Boolean(navigator.serviceWorker.controller);let reloading=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(controlled&&!reloading){reloading=true;persist();location.reload()}});navigator.serviceWorker.register('./sw.js').catch(()=>{})}
  }catch(error){console.error('MIND MAZE startup failed',error);$('loading').hidden=true;overlay('Die Anlage konnte nicht starten.',`<p class="muted">Öffne das Spiel in einem aktuellen Browser mit WebGL 2 und Hardwarebeschleunigung.</p><p class="muted">${esc(error.message)}</p>`,{actions:'<button class="btn primary" data-reload>Erneut starten</button>'});document.querySelector('[data-reload]').onclick=()=>location.reload()}
}
boot();
