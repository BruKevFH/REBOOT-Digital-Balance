import {Game} from './game.js';
import {createWorld,HUBS} from './world.js';
import {CHARACTERS,MODULES,INSIGHTS,SOURCES,STORY_BEATS,SLOT_LABEL} from './content.js';

const $=id=>document.getElementById(id);
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(x,a=0,b=100)=>Math.max(a,Math.min(b,x));
const game=new Game();
let world,state='home',mini=null,previousState='explore',sound=false,audio=null,toastTimer,lastFrame=performance.now(),lastSave=0,hadPointer=false;
let completedMiniResult=null;
const versions={name:'REBOOT Neon Balance',version:'1.0.0'};

function beep(note=440,duration=.08){
  if(!sound)return;
  try{
    audio??=new(window.AudioContext||window.webkitAudioContext)();
    if(audio.state==='suspended')audio.resume();
    const osc=audio.createOscillator(),gain=audio.createGain();
    osc.type='sine';osc.frequency.value=note;gain.gain.setValueAtTime(.045,audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);
    osc.connect(gain);gain.connect(audio.destination);osc.start();osc.stop(audio.currentTime+duration);
  }catch{}
}
function toast(message){
  clearTimeout(toastTimer);$('toast-root').textContent=message;$('toast-root').classList.add('visible');
  toastTimer=setTimeout(()=>$('toast-root').classList.remove('visible'),3800);
}
function persist(){
  if(game.run&&!game.run.ended&&world)game.run.playerPosition=world.getPlayerPosition();
  game.save();
  $('save-indicator').textContent=game.storageFailed?'Speicherung blockiert':'Lokal gespeichert';
}
function setState(next){
  state=next;
  $('home').hidden=next!=='home';$('hud').hidden=next==='home';
  document.body.classList.toggle('is-playing',next!=='home');
  const active=next==='explore'||(next==='mini'&&mini?.type==='focus');
  world?.setActive(active);
  $('touch-controls').hidden=!active;
  if(!active)world?.exitPointerLock();
  $('pointer-hint').hidden=!active||matchMedia('(pointer:coarse)').matches||document.pointerLockElement===$('world');
}
function overlay(title,body,{label='REBOOT // NEON BALANCE',className='',actions=''}={}){
  $('overlay-root').innerHTML=`<div class="modal-shade"><section class="panel ${className}" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div class="eyebrow">${label}</div><h2 class="modal-title" id="dialog-title">${title}</h2>${body}${actions?`<div class="overlay-actions">${actions}</div>`:''}</section></div>`;
  $('overlay-root').querySelector('button')?.focus({preventScroll:true});
}
function clearOverlay(){$('overlay-root').replaceChildren()}
function renderHUD(){
  const run=game.run;if(!run)return;
  const labels={story:'21-DAY SEASON',daily:'DAILY CHALLENGE',endless:'ENDLESS BALANCE'};
  $('mode-label').textContent=labels[run.mode];$('day-label').textContent=`DAY ${String(run.day).padStart(2,'0')}`;
  $('chapter-label').textContent=STORY_BEATS[run.day]?.title||`${SLOT_LABEL[['morning','school','lunch','afternoon','evening','night'][run.slotIndex]]} · Own your day`;
  const names={energy:'Energy',focus:'Focus',mood:'Mood',balance:'Balance',social:'Social'};
  $('stats').innerHTML=Object.entries(names).map(([key,name])=>`<div class="metric" data-stat="${key}"><span>${name}</span><strong>${Math.round(run.stats[key])}</strong><i style="--value:${clamp(run.stats[key])}%;--accent:${key==='balance'?'#b5f96e':'#68eeef'}"></i></div>`).join('');
  const event=game.currentEvent();
  world?.setTarget(run.slotIndex,event?.speaker);
  $('objective-name').textContent=HUBS[run.slotIndex]?.name||'Campus';
  $('objective-scene').textContent=event?.title||'Dein nächster Schritt';
  $('save-indicator').textContent=game.storageFailed?'Speicherung blockiert':'Lokal gespeichert';
}
function home(){
  mini=null;world?.clearFocusTarget();clearOverlay();setState('home');
  $('continue').hidden=!game.run||game.run.ended;
  $('player-name').value=game.profile.name||'Player';
}
function showChapter(){
  const run=game.run,beat=run.mode==='story'?STORY_BEATS[run.day]:null;
  if(!beat||run.slotIndex!==0||(run.readChapters||[]).includes(run.day))return false;
  run.readChapters??=[];run.readChapters.push(run.day);persist();
  setState('chapter');
  overlay(escape(beat.title),`<p class="muted">${escape(beat.text)}</p><div class="npc-intros">${Object.entries(CHARACTERS).map(([id,c])=>`<div class="npc-intro"><span class="avatar" style="background:${c.color}">${escape(c.emoji)}</span><div><strong>${escape(c.name)}</strong><small>${escape(c.role)}</small></div></div>`).join('')}</div>`,{label:`STORY UPDATE // DAY ${run.day}`,actions:'<button class="btn primary" data-action="explore">In den Campus →</button>'});
  return true;
}
function explore(){
  clearOverlay();setState('explore');renderHUD();persist();
  if(game.storageFailed)toast('Speichern ist im Browser blockiert. Der Run bleibt für diese Sitzung spielbar.');
}
function launch(mode,resume=false){
  if(state!=='home')return;
  game.setName($('player-name').value);
  if(resume){if(!game.resume())return;}else game.start(mode);
  mini=null;world.clearFocusTarget();
  const hub=HUBS[0];world.setPlayerPosition(game.run.playerPosition||{x:hub.x,z:hub.z+3.4,yaw:0,pitch:0});
  renderHUD();beep(520,.12);
  if(game.run.pendingMini){startMini(game.run.pendingMini);return;}
  if(!showChapter())explore();
}
function impact(impact){
  const names={energy:'Energy',focus:'Focus',mood:'Mood',balance:'Balance',social:'Social',screen:'Screen',sleep:'Schlaf',chips:'Chips',xp:'XP'};
  return Object.entries(impact||{}).filter(([k,v])=>names[k]&&v).slice(0,4).map(([k,v])=>`${v>0?'+':''}${v}${k==='screen'?' Min':k==='sleep'?' h':''} ${names[k]}`).join(' · ');
}
function interact(){
  if(state==='mini'&&mini?.type==='focus'){miniAction();return;}
  if(state!=='explore')return;
  if(world.distanceToTarget()>3.1){toast('Geh zum leuchtenden Ort auf deiner Route.');return;}
  const event=game.currentEvent();if(!event)return;
  setState('dialogue');beep(330);
  const npc=CHARACTERS[event.speaker];
  overlay(escape(event.title),`<div class="speaker-line"><span class="avatar" style="background:${npc?.color||'#324'}">${escape(npc?.emoji||'R')}</span><div><strong>${escape(npc?.name||'REBOOT')}</strong><small>${escape(npc?.role||'Campus')}</small></div></div><p class="muted">${escape(event.text)}</p><div class="dialog-choices">${event.choices.map((c,i)=>`<button class="choice-card" data-choice="${i}"><span class="choice-index">0${i+1}</span><span><strong>${escape(c.label)}</strong><small>${escape(c.sub)}</small></span><em>${escape(impact(c.impact))}</em></button>`).join('')}</div>${event.insight?`<div class="insight"><span>REBOOT INSIGHT</span><p>${escape(INSIGHTS.find(i=>i.id===event.insight)?.text||'')}</p></div>`:''}`,{label:`${escape(npc?.name||'REBOOT')} // ${SLOT_LABEL[event.slot]} · DAY ${game.run.day}`,className:'dialog-panel',actions:`${game.profile.unlocked.includes('haptic')&&game.run.rerolls>0?'<button class="btn ghost" data-action="reroll">Haptic Nudge · Andere Szene</button>':''}<button class="btn ghost" data-action="explore">Zurück zum Campus · Esc</button>`});
}
function choose(index){
  if(state!=='dialogue')return;
  const buttons=$('overlay-root').querySelectorAll('[data-choice]');buttons.forEach(b=>b.disabled=true);
  const result=game.choose(index);if(!result)return;
  state='transition';beep(660);persist();
  if(result.mini)startMini(result.mini);else afterStep(result);
}
function afterStep(result){
  renderHUD();
  if(result.runEnded||game.run.ended){summary();return;}
  if(result.dayEnded){
    setState('day');
    const r=game.run;
    overlay(`Tag ${r.day-1} geschafft.`,`<p class="muted">Deine Entscheidungen wirken weiter. Morgen wartet eine neue Route durch den Campus.</p><div class="summary-grid">${['energy','focus','balance'].map(k=>`<div class="metric"><span>${escape(k.toUpperCase())}</span><strong>${Math.round(r.stats[k])}</strong></div>`).join('')}</div>`,{label:'DAY COMPLETE',actions:`<button class="btn primary" data-action="next-day">Tag ${r.day} starten →</button>`});
  }else explore();
}
function summary(){
  world.clearFocusTarget();mini=null;setState('complete');renderHUD();
  const run=game.run;
  overlay(run.mode==='story'?'Own your day.':'Run complete.',`<p class="muted">Dein Ergebnis zeigt Entscheidungen im Spielmodell, keinen Gesundheitswert. ${run.mode==='story'?'Du hast die 21-Tage-Season abgeschlossen.':''}</p><div class="summary-grid"><div class="metric"><span>BALANCE</span><strong>${Math.round(run.stats.balance)}</strong></div><div class="metric"><span>RUN XP</span><strong>${run.xp}</strong></div><div class="metric"><span>CHIPS</span><strong>${run.chips}</strong></div></div><div class="achievements">${game.profile.achievements.map(a=>`<span class="tag">${escape(a)}</span>`).join('')}</div><div class="timeline">${run.timeline.slice(-5).map(t=>`<p><strong>DAY ${t.day||t.beatDay||1}</strong> ${escape(t.event||t.title)} · ${escape(t.choice||'')}</p>`).join('')}</div>`,{label:'REBOOT // SEASON LOGGED',actions:'<button class="btn primary" data-action="home">Neuer Run</button><button class="btn ghost" data-action="export">Daten exportieren</button>'});
  persist();
}
function pause(){
  if(state==='paused'){resumePause();return;}
  if(!['explore','mini','dialogue'].includes(state))return;
  previousState=state;setState('paused');persist();
  overlay('Kurz durchatmen.',`<p class="muted">Dein Run ist pausiert. Fortschritt wird lokal auf diesem Gerät gespeichert.</p>`,{label:'PAUSED // TAKE A BREATH',actions:'<button class="btn primary" data-action="resume">Weiterspielen</button><button class="btn ghost" data-action="lab">FocusBand Lab</button><button class="btn ghost" data-action="home">Startmenü</button><button class="btn danger" data-action="end-run">Run beenden</button>'});
}
function resumePause(){
  if(previousState==='mini'&&mini){setState('mini');renderMini();return;}
  if(previousState==='dialogue'){explore();interact();return;}
  explore();
}
function lab(){
  if(!game.run){toast('Starte zuerst einen Run, um den Campus und das Lab zu entdecken.');return;}
  if(state==='mini'){toast('Schließe zuerst das Minigame ab.');return;}
  if(state==='paused'&&previousState==='mini'){toast('Setze zuerst dein Minigame fort.');return;}
  setState('lab');const available=game.profile.chips+(game.run.ended?0:game.run.chips);
  overlay('Build the prototype.',`<p class="muted">${available} Chips verfügbar. Baue dein FocusBand mit fünf Modulen aus. Die Sensoren sind Simulationen.</p><div class="module-grid">${MODULES.map(m=>`<article class="module-card ${game.profile.unlocked.includes(m.id)?'owned':''}"><span class="module-icon">${m.icon}</span><h3>${escape(m.name)}</h3><p>${escape(m.desc)}</p><small>${escape(m.perk)}</small><button class="btn ${game.profile.unlocked.includes(m.id)?'ghost':'primary'}" data-module="${m.id}" ${game.profile.unlocked.includes(m.id)?'disabled':''}>${game.profile.unlocked.includes(m.id)?'Freigeschaltet':`${m.cost} Chips · Freischalten`}</button></article>`).join('')}</div>`,{label:'MEDTECH // FOCUSBAND LAB',className:'lab-panel',actions:'<button class="btn ghost" data-action="close-lab">Zurück zum Campus</button>'});
}
function learn(){
  const from=state;previousState=from==='home'?'home':'explore';setState(from==='home'?'home':'learn');
  overlay('Dein Rhythmus. Deine Regeln.',`<div class="learning-grid">${INSIGHTS.map(i=>`<article><span class="tag">${escape(i.source)}</span><h3>${escape(i.title)}</h3><p class="muted">${escape(i.text)}</p></article>`).join('')}</div><p class="muted">REBOOT ist ein Lernmodell und kein Medizinprodukt.</p><div class="source-links">${SOURCES.map(s=>`<a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.name)} ↗</a>`).join('')}</div>`,{label:'KNOWLEDGE BASE',actions:'<button class="btn primary" data-action="close-help">Zurück</button>'});
}
function help(){
  if(state==='mini'){pause();return;}
  previousState=state==='home'?'home':'explore';setState(state==='home'?'home':'help');
  overlay('So spielst du.',`<div class="controls-list"><p><kbd>W A S D</kbd> Bewegen · <kbd>Shift</kbd> Sprinten</p><p><kbd>Maus</kbd> Umsehen · Klick ins Spiel: Maus fangen</p><p><kbd>E</kbd> Am leuchtenden Ort mit dem NPC sprechen</p><p><kbd>1 2 3</kbd> Entscheidung oder Memory-Feld wählen</p><p><kbd>Space</kbd> Aktion im Minigame</p><p><kbd>Esc</kbd> Pause · <kbd>Tab</kbd> FocusBand Lab</p></div><p class="muted">Jeder Tag hat sechs Stationen. Deine Entscheidungen verändern Energy, Focus, Mood, Balance und Beziehungen. Minigames geben XP und Chips. Auf Touch-Geräten stehen Bewegungstasten und eine Blicksteuerung bereit.</p>`,{label:'QUICK START',actions:'<button class="btn primary" data-action="close-help">Verstanden</button>'});
}
function exportData(){
  const data=game.exportData();const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download='REBOOT-Neon-Balance-Spielstand.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}

const notifications=[
  {text:'Sami: Labraum wurde auf 14:30 verschoben.',important:true},
  {text:'🔥 Deine Streak endet in neun Minuten!',important:false},
  {text:'Leon: Bin in zehn Minuten am Treffpunkt.',important:true},
  {text:'LIMITED DROP – nur heute!',important:false},
  {text:'Mia: Kannst du mir die Folie schicken?',important:true},
  {text:'12 neue Videos für dich.',important:false},
  {text:'Familie: Der Zug hat Verspätung.',important:true},
  {text:'Dein Feed vermisst dich.',important:false}
];
function startMini(type){
  mini={type,elapsed:0,round:0,score:0,resolved:false,input:0,sequence:Array.from({length:5},()=>Math.floor(Math.random()*3))};
  setState('mini');renderHUD();renderMini();
  if(type==='focus')world.spawnFocusTarget();
}
function renderMini(){
  if(!mini)return;
  const descriptions={focus:['Focus Rush','Triff die leuchtenden Ziele im 3D-Raum. Maus zielen, Space treffen.'],shield:['Notification Shield','Wichtige Nachrichten beantworten. Streaks und Promo dürfen warten.'],signal:['Signal Calibration','Kalibriere viermal, wenn der Marker im grünen Fenster liegt.'],memory:['Memory Pulse','Merke dir fünf Lichtimpulse. Wiederhole sie mit 1, 2 und 3.']};
  const [title,description]=descriptions[mini.type]||descriptions.focus;
  const body=mini.type==='focus'?`<p class="muted">${description}</p><div class="mini-counter" id="mini-counter">${mini.score} / 12</div><button class="btn primary" data-action="aim">Maus aktivieren</button>`:
    mini.type==='shield'?`<p class="muted">${description}</p><div class="notification-card" id="notification"></div><button class="btn primary" id="shield-action" data-action="mini-action">Wichtig · Antworten</button><div class="mini-counter" id="mini-counter">1 / 8</div>`:
    mini.type==='signal'?`<p class="muted">${description}</p><div class="signal-bar"><div class="signal-zone"></div><div class="signal-marker" id="signal-marker"></div></div><button class="btn primary" data-action="mini-action">CALIBRATE · Space</button><div class="mini-counter" id="mini-counter">${mini.round} / 4</div>`:
    `<p class="muted">${description}</p><div class="memory-grid">${[0,1,2].map(i=>`<button class="memory-key" data-memory="${i}" ${mini.elapsed<4?'disabled':''}><span>0${i+1}</span></button>`).join('')}</div><div class="mini-counter" id="mini-counter">${mini.elapsed<4?'Sequenz ansehen …':mini.input?`${mini.input} / 5 eingegeben`:'Jetzt du · 1 / 2 / 3'}</div>`;
  overlay(title,body,{label:'MINIGAME // EARN YOUR FOCUS',className:`minigame-panel ${mini.type==='focus'?'focus-panel':''}`});
  $('overlay-root').classList.toggle('focus-mode',mini.type==='focus');
  if(mini.type==='shield')renderNotification();
}
function renderNotification(){
  if(!mini||mini.type!=='shield')return;
  $('notification').textContent=notifications[mini.round].text;
  $('notification').classList.toggle('answered',mini.resolved);
  $('shield-action').disabled=mini.resolved;
  $('mini-counter').textContent=`${mini.round+1} / 8`;
}
function miniAction(){
  if(state!=='mini'||!mini)return;
  if(mini.type==='focus'){
    if(world.hitFocusTarget()){mini.score++;beep(780);$('mini-counter').textContent=`${mini.score} / 12`;}
  }else if(mini.type==='signal'){
    const marker=(Math.sin(mini.elapsed*2.5)+1)/2;
    mini.score+=clamp(Math.round(100-Math.abs(marker-.69)*250));mini.round++;beep(600);
    $('mini-counter').textContent=`${mini.round} / 4`;
    if(mini.round>=4)finishMini(Math.round(mini.score/4));
  }else if(mini.type==='shield'&&!mini.resolved){
    mini.resolved=true;mini.score+=notifications[mini.round].important?1:-1;beep(notifications[mini.round].important?720:200);
    $('shield-action').disabled=true;$('notification').classList.add('answered');
  }
}
function memoryInput(index){
  if(state!=='mini'||mini?.type!=='memory'||mini.elapsed<4||mini.input>=5)return;
  if(mini.sequence[mini.input]===index)mini.score++;
  mini.input++;beep(420+index*110);$('mini-counter').textContent=`${mini.input} / 5 eingegeben`;
  if(mini.input===5)finishMini(mini.score*20);
}
function finishMini(percent){
  if(!mini||state!=='mini')return;
  const type=mini.type;mini=null;world.clearFocusTarget();$('overlay-root').classList.remove('focus-mode');
  const result=game.finishMini(type,percent);if(!result){explore();return;}
  completedMiniResult=result;setState('mini-result');renderHUD();beep(940,.15);
  overlay(`${clamp(percent)}%`, `<p class="muted">${percent>=80?'Starker Fokus.':percent>=50?'Solider Run.':'Heute war es schwierig. Energy und Focus gehören zum Spielmodell.'}</p><div class="summary-grid"><div class="metric"><span>XP</span><strong>+${Math.round(clamp(percent)/10)}</strong></div><div class="metric"><span>CHIPS</span><strong>+${percent>=75?2:percent>=45?1:0}</strong></div></div>`,{label:'MINIGAME COMPLETE',actions:'<button class="btn primary" data-action="mini-next">Weiter zum Campus →</button>'});
  persist();
}
function tickMini(dt){
  if(state!=='mini'||!mini)return;
  mini.elapsed+=dt;
  if(mini.type==='focus'){
    const duration=game.profile.unlocked.includes('focus')?1.25:1;
    const round=Math.floor(mini.elapsed/duration);
    if(round>mini.round){mini.round=round;if(round>=12){finishMini(Math.round(mini.score/12*100));return;}world.spawnFocusTarget();}
  }else if(mini.type==='shield'){
    if(mini.elapsed>=(mini.round+1)*2){
      if(!mini.resolved&&!notifications[mini.round].important)mini.score++;
      mini.round++;mini.resolved=false;
      if(mini.round>=8){finishMini(clamp(Math.round(mini.score/8*100)));return;}
      $('notification').classList.remove('answered');renderNotification();
    }
  }else if(mini.type==='signal'){
    const marker=(Math.sin(mini.elapsed*2.5)+1)/2;
    $('signal-marker').style.left=`${marker*100}%`;
  }else if(mini.type==='memory'){
    const showing=mini.elapsed<4;
    const key=mini.sequence[Math.min(4,Math.floor(mini.elapsed/.8))];
    document.querySelectorAll('[data-memory]').forEach(button=>{button.disabled=showing;button.classList.toggle('lit',showing&&Number(button.dataset.memory)===key&&mini.elapsed%.8<.6)});
    if(!showing&&!mini.input)$('mini-counter').textContent='Jetzt du · 1 / 2 / 3';
  }
}
function nextDay(){
  const hub=HUBS[0];world.setPlayerPosition({x:hub.x,z:hub.z+3.4,yaw:0,pitch:0});
  if(!showChapter())explore();
}
function dispatchAction(action){
  if(action==='explore')explore();
  else if(action==='reroll'){if(game.rerollEvent()){explore();interact();toast('Haptic Nudge: andere Szene.')}}
  else if(action==='next-day')nextDay();
  else if(action==='home')home();
  else if(action==='resume')resumePause();
  else if(action==='lab')lab();
  else if(action==='close-lab'){game.run.ended?summary():explore();}
  else if(action==='close-help'){previousState==='home'?home():explore();}
  else if(action==='export')exportData();
  else if(action==='mini-action')miniAction();
  else if(action==='aim'){world.requestPointerLock();$('overlay-root').querySelector('[data-action="aim"]')?.remove();}
  else if(action==='mini-next'){if(state==='mini-result'){const result=completedMiniResult;completedMiniResult=null;afterStep(result);}}
  else if(action==='end-run'){if(game.run.pendingMini){game.finishMini(game.run.pendingMini,0);}game.finishRun(true);summary();}
}
function wire(){
  $('launch-story').onclick=()=>launch('story');$('launch-endless').onclick=()=>launch('endless');$('launch-daily').onclick=()=>launch('daily');$('continue').onclick=()=>launch(null,true);
  $('lab-button').onclick=lab;$('mini-button').onclick=()=>{if(state==='explore')toast('Minigames starten nach ausgewählten NPC-Entscheidungen. Folge deiner Route.');};
  $('pause-button').onclick=pause;$('help-button').onclick=help;$('learn-button')?.addEventListener('click',learn);
  $('sound-toggle').onclick=()=>{sound=!sound;$('sound-toggle').setAttribute('aria-pressed',String(sound));$('sound-toggle').setAttribute('aria-label',sound?'Sound an':'Sound aus');$('sound-toggle').title=sound?'Sound an':'Sound aus';$('sound-toggle').classList.toggle('is-muted',!sound);beep(660);};
  $('fullscreen-button').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{toast('Vollbild ist in diesem Browser nicht verfügbar.')}};
  $('pointer-hint').onclick=()=>world.requestPointerLock();
  $('world').addEventListener('pointerdown',()=>{if(state==='mini'&&mini?.type==='focus')miniAction()});
  $('overlay-root').addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button||button.disabled)return;
    if(button.dataset.choice!==undefined)choose(Number(button.dataset.choice));
    else if(button.dataset.module){
      button.disabled=true;
      if(game.unlockModule(button.dataset.module)){beep(830);toast('Modul freigeschaltet.');lab();persist();}
      else{button.disabled=false;toast('Noch nicht genug Chips. Sammle sie in Entscheidungen und Minigames.');}
    }else if(button.dataset.memory!==undefined)memoryInput(Number(button.dataset.memory));
    else if(button.dataset.action){
      const action=button.dataset.action;
      if(['mini-next','next-day','end-run'].includes(action))button.disabled=true;
      dispatchAction(action);
    }
  });
  window.addEventListener('keydown',event=>{
    if(event.target instanceof HTMLInputElement||event.target instanceof HTMLTextAreaElement)return;
    if(event.repeat)return;
    if(['1','2','3'].includes(event.key)){
      const index=Number(event.key)-1;if(state==='dialogue'){event.preventDefault();choose(index);}else if(state==='mini')memoryInput(index);
    }else if(event.code==='Space'&&state==='mini'){event.preventDefault();miniAction();}
    else if(event.key==='Escape'){
      if(state==='dialogue'||state==='lab'||state==='help'||state==='learn')explore();
      else pause();
    }else if(event.key==='Tab'&&state!=='home'){event.preventDefault();state==='lab'?explore():lab();}
    else if(event.key==='F5'){event.preventDefault();exportData();}
  });
  const move={forward:0,back:0,left:0,right:0};
  document.querySelectorAll('[data-move]').forEach(button=>{
    const set=value=>{move[button.dataset.move]=value;world.setMovement(move.forward-move.back,move.right-move.left)};
    button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);set(1)});
    for(const name of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(name,()=>set(0));
  });
  document.querySelector('[data-action="interact"]')?.addEventListener('click',interact);
  document.addEventListener('pointerlockchange',()=>{
    const locked=document.pointerLockElement===$('world');
    $('pointer-hint').hidden=!['explore','mini'].includes(state)||matchMedia('(pointer:coarse)').matches||locked;
    if(hadPointer&&!locked&&['explore','mini'].includes(state))pause();hadPointer=locked;
  });
  window.addEventListener('pagehide',persist);window.addEventListener('blur',()=>{if(state==='explore'||state==='mini')pause()});
}
function frame(time){
  const dt=Math.min(.05,Math.max(0,(time-lastFrame)/1000));lastFrame=time;
  world.update(dt,time/1000);tickMini(dt);
  if(game.run&&!game.run.ended&&state!=='home'){
    const p=world.getPlayerPosition(),hub=HUBS[game.run.slotIndex];
    const bearing=Math.atan2(-(hub.x-p.x),-(hub.z-p.z))-p.yaw;
    const arrows=['↑','↗','→','↘','↓','↙','←','↖'];
    const direction=arrows[((Math.round(-bearing/(Math.PI/4))%8)+8)%8];
    $('objective-distance').textContent=`${direction} ${world.distanceToTarget().toFixed(0)} m`;
    if(time-lastSave>5000){lastSave=time;persist();}
  }
  requestAnimationFrame(frame);
}
async function boot(){
  try{
    world=createWorld({canvas:$('world'),onInteract:interact,onPause:()=>{},onMove:()=>{}});
    wire();home();if(location.protocol==='file:')$('download').hidden=true;$('loading').hidden=true;requestAnimationFrame(frame);
    // Read-only diagnostics make actual rendering and saved gameplay observable.
    window.__REBOOT__=Object.freeze({getSnapshot:()=>JSON.parse(JSON.stringify({version:versions.version,state,run:game.run,profile:game.profile,position:world.getPlayerPosition(),world:world.getStats(),storageFailed:game.storageFailed,mini:mini?{type:mini.type,round:mini.round,input:mini.input}:null}))});
    if(location.protocol.startsWith('http')&&'serviceWorker'in navigator){
      let reloading=false;const hadController=Boolean(navigator.serviceWorker.controller);
      navigator.serviceWorker.addEventListener('controllerchange',()=>{if(hadController&&!reloading){reloading=true;persist();location.reload()}});
      navigator.serviceWorker.register('./sw.js').catch(()=>{});
    }
  }catch(error){
    console.error('REBOOT startup failed',error);$('loading').hidden=true;
    overlay('Dein Browser braucht WebGL 2.',`<p class="muted">Die 3D-Grafik konnte nicht gestartet werden. Öffne REBOOT in einem aktuellen Chrome, Edge oder Firefox mit aktivierter Hardwarebeschleunigung.</p><p class="muted">${escape(error.message)}</p>`,{label:'START NICHT MÖGLICH',actions:'<button class="btn primary" data-reload>Erneut versuchen</button>'});
    document.querySelector('[data-reload]')?.addEventListener('click',()=>location.reload());
  }
}
boot();
