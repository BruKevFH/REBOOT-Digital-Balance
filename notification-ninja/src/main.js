import {NinjaGame,LEVELS,SKINS,CONTENT} from './game.js';
import {createRenderer} from './renderer.js';
import {createAudio} from './audio.js';

const $=id=>document.getElementById(id);
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const contexts={study:{name:'STUDY MODE',time:'16:00',goal:'Du lernst für eine Prüfung. Freizeit kann warten.',pass:['Wichtige Schulinfo','Geplante Lernpause'],slice:['Video-Feed','Gaming-Einladung','Spam & Werbung']},gaming:{name:'GAMING MODE',time:'18:30',goal:'Deine Aufgaben sind erledigt. Jetzt ist Zeit für deine Freunde.',pass:['Gaming-Einladung','Video zum Lieblingsspiel','Zeitlimit-Erinnerung'],slice:['Endlos-Autoplay','Werbung & Spam']},sleep:{name:'SLEEP MODE',time:'22:30',goal:'Deine virtuelle Nacht beginnt. Sichere deinen Score und schalte ab.',pass:['Schlafenszeit','Ruhemodus'],slice:['Noch ein Video','Nur noch ein Match','Autoplay']}};
const modes={campaign:'Digitaler Tag',study:'Study Mode',gaming:'Gaming Mode',sleep:'Sleep Mode',master:'Balance Master'};
const list=value=>Array.isArray(value)?value:Object.entries(value||{}).map(([id,v])=>({id,...v}));
const skinList=()=>list(SKINS);
let game,renderer,audio,ui='home',sound=false,previousUI='home',lastCoreToken='',lastTime=performance.now(),saveClock=0,hudClock=0,swipePointer=null,lastPoint=null,trail=[],toastTimer,popTimer,contextTimer;
let sleepOfferToken=null;
const money=()=>game.profile?.coins??0;
const good=r=>r?.ok===true;
const why=r=>r?.reason||'Diese Aktion ist gerade nicht möglich.';
const running=()=>ui==='playing'&&game.state.scene==='playing'&&!game.state.paused;
const resumeAvailable=()=>['playing','briefing','limit-choice'].includes(game.state?.scene);
const levelName=()=>game.state.isTutorial?'Dein erstes Training':['Study Mode','Gaming Mode','Sleep Mode','Balance Master'][game.state.levelIndex];
function toast(text){clearTimeout(toastTimer);$('toast-root').textContent=text;$('toast-root').classList.add('visible');toastTimer=setTimeout(()=>$('toast-root').classList.remove('visible'),3600)}
function save(){game.save();$('save-indicator').textContent=game.storageFailed?'Speicherung blockiert · Sitzung spielbar':'Lokal gespeichert'}
function scene(next){ui=next;$('home').hidden=next!=='home';$('hud').hidden=next==='home';document.body.classList.toggle('is-playing',next!=='home');document.body.classList.toggle('is-paused',next!=='playing');swipePointer=null;lastPoint=null;renderer.resize();const size=renderer.getSize();game.resize(size.width,size.height)}
function dialog(title,body,actions,{label='NOTIFICATION NINJA',classes=''}={}){
  $('overlay-root').innerHTML=`<div class="modal-shade"><section class="panel ${classes}" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div class="eyebrow">${label}</div><h2 id="dialog-title">${title}</h2>${body}<div class="overlay-actions">${actions}</div></section></div>`;
  $('overlay-root').querySelector('button:not(:disabled),input')?.focus({preventScroll:true});
}
function clear(){$('overlay-root').replaceChildren()}
function button(label,action,kind='primary'){return `<button class="btn ${kind}" data-action="${action}">${label}</button>`}
function showHome(){game.pause();save();clear();scene('home');$('continue').hidden=!resumeAvailable();lastCoreToken='';$('stop-button').hidden=true;document.body.classList.remove('is-flow','is-overloaded');renderHUD()}
function examples(context){const c=contexts[context]||contexts.study;return `<div class="briefing-items"><div><span class="item-tag is-distraction">JETZT ABWEHREN</span><p>${c.slice.map(escape).join(' · ')}</p></div><div><span class="item-tag is-useful">JETZT DURCHLASSEN</span><p>${c.pass.map(escape).join(' · ')}</p></div></div>`}
function briefing(){
  const s=game.state,c=contexts[s.context]||contexts.study;scene('briefing');
  const previous=s.metrics?.stageStats?.at(-1);
  const summary=previous?`<div class="stage-summary"><span>LETZTER ABSCHNITT</span><strong>${Number(previous.score??previous.scoreArcade??0).toLocaleString('de-DE')} Punkte</strong><small>Die nächste Situation verändert, was jetzt sinnvoll ist.</small></div>`:'';
  const intro=s.isTutorial?'<p class="muted">Du bist ein Digital Ninja. Mit gedrückter Maustaste oder dem Finger durch Ablenkungen wischen. Wichtige Inhalte lässt du oben aus dem Bild fliegen. Ein einzelner Klick reicht nicht.</p><p class="control-tip">Sechs richtige Entscheidungen: mindestens zwei Treffer und zwei bewusst durchgelassene Inhalte.</p>':`<p class="muted">${escape(c.goal)}</p>${s.levelIndex===3?'<p class="control-tip">Die Situation wechselt. Vor jedem Wechsel leert sich das Feld, damit kein Objekt überraschend seine Bedeutung ändert.</p>':''}`;
  dialog(s.isTutorial?'Deine Klinge. Deine Entscheidung.':escape(levelName()),`${summary}${intro}${examples(s.context)}<div class="insight-card">${s.isTutorial?'Im Training helfen dir Beschriftungen. Später entscheidet allein die aktuelle Situation.':s.levelIndex===1?`Dein selbst gewähltes Rundenlimit: <strong>${s.gamingLimit??Number($('gaming-limit').value)} Sekunden</strong>. Danach entscheidest du, ob du aufhörst.`:s.levelIndex===2?'Aufhören zählt als Erfolg. Du kannst die Nacht bewusst abschließen oder einmal einen Bonus mit zusätzlichem Overload annehmen.':'Fünf richtige Entscheidungen in Folge aktivieren Focus Flow: Zeitlupe, breite Klinge und große Kombos.'}</div>`,button(s.isTutorial?'Training starten →':'Klinge bereit →','next')+(s.isTutorial?button('Tutorial überspringen','skip-tutorial','ghost'):''),{label:s.isTutorial?'TUTORIAL // LERNEN DURCH SPIELEN':`LEVEL ${String(s.levelIndex+1).padStart(2,'0')} // ${c.time}`});save();
}
function enterPlaying(){clear();scene('playing');game.resume();renderHUD();save()}
function sync(){
  if(ui==='home'||['help','skins','highscores','paused','sleep-choice'].includes(ui))return;
  const s=game.state,token=`${s.scene}:${s.stageIndex}:${s.isTutorial}`;
  if(token===lastCoreToken)return;lastCoreToken=token;
  if(s.scene==='briefing')briefing();
  else if(s.scene==='playing')enterPlaying();
  else if(s.scene==='limit-choice')limitChoice();
  else if(s.scene==='results')results();
}
function launch(){
  const size=renderer.getSize();game.resize(size.width,size.height);
  const r=game.start({mode:$('mode-select').value,gamingLimit:Number($('gaming-limit').value),skin:game.profile?.selectedSkin});
  if(!good(r)){toast(why(r));return;}sleepOfferToken=null;ui='briefing';lastCoreToken='';handle(r.events||[]);sync();audio.play({type:'click'});
}
function continueRun(){const r=game.resumeRun();if(!good(r)){toast(why(r));return;}ui='briefing';lastCoreToken='';sync()}
function next(){const r=game.nextLevel();if(!good(r)){toast(why(r));return;}handle(r.events||[]);ui='briefing';lastCoreToken='';sync()}
function limitChoice(){game.resume();scene('limit-choice');dialog(game.state.extensionUsed?'Die zusätzliche Runde ist vorbei.':'Dein Zeitfenster ist vorbei.',`<p class="muted">Deine Freunde möchten noch eine Runde. Du kannst dein gewähltes Ende einhalten und Balance sichern${game.state.extensionUsed?'. Eine weitere Verlängerung gibt es in diesem Run nicht.':' oder einmal verlängern.'}</p><div class="briefing-items"><div><span class="item-tag is-useful">PLAN EINHALTEN</span><p>Score sichern und bewusst zum nächsten Abschnitt wechseln.</p></div>${game.state.extensionUsed?'':'<div><span class="item-tag is-distraction">NOCH EINE RUNDE?</span><p>15 Sekunden zusätzlich · +15 Overload. Die Entscheidung verändert deine Balance-Wertung.</p></div>'}</div>`,button('Spielzeit beenden →','stop')+(!game.state.extensionUsed?button('Einmal 15 Sekunden weiterspielen','extend','ghost'):''),{label:'GAMING // DEINE GRENZE'});save()}
function sleepChoice(){if(game.state.context!=='sleep'||!game.state.stopAvailable)return;game.pause();scene('sleep-choice');dialog(game.state.sleepContinued?'Deine Nacht darf beginnen.':'Nur noch ein Bonus?',`<p class="muted">Die virtuelle Nacht kann jetzt beginnen. Deine bisherigen Punkte sind sicher.${game.state.sleepContinued?'':' Eine zusätzliche Belohnung macht Weiterspielen verlockend.'}</p><div class="insight-card">${game.state.sleepContinued?'Der einmalige Bonus ist bereits eingelöst.': 'Einmaliger Bonus: <strong>+200 Arcade-Punkte</strong>, dafür <strong>+15 Overload</strong>.'} Eine bewusste Pause zählt für deinen Balance-Score.</div>`,button('Punkte sichern & Nacht abschließen','stop')+(game.state.sleepContinued?button('Zurück zum Spielfeld','resume','ghost'):button('Bonus nehmen & weiterspielen','sleep-bonus','ghost')),{label:'SLEEP // SIMULIERTE BELOHNUNG'});save()}
function stop(){if(ui==='sleep-choice')game.resume();const r=game.requestStop();if(!good(r)){game.pause();toast(why(r));return;}handle(r.events||[]);ui='briefing';lastCoreToken='';sync()}
function extend(){const r=game.continueAfterLimit();if(!good(r)){toast(why(r));return;}handle(r.events||[]);ui='briefing';lastCoreToken='';sync();toast('15 Sekunden zusätzlich. Dein Overload ist gestiegen.')}
function sleepBonus(){game.resume();const r=game.continueSleep();if(!good(r)){game.pause();toast(why(r));return;}handle(r.events||[]);enterPlaying();lastCoreToken=`${game.state.scene}:${game.state.stageIndex}:${game.state.isTutorial}`;toast('+200 Arcade-Punkte · +15 Overload. Aufhören bleibt möglich.')}
function pause(){if(ui==='paused'){resume();return;}if(!running())return;game.pause();scene('paused');dialog('Deine Pause. Kein Countdown.',`<p class="muted">Objekte, Rundenzeit und Power-ups sind pausiert. Dein Fortschritt bleibt auf deinem Gerät.</p>`,button('Weiterspielen','resume')+button('Startmenü','home','ghost'),{label:'PAUSE // DU ENTSCHEIDEST'});save()}
function resume(){if(game.state.scene==='playing')enterPlaying();else{ui='briefing';lastCoreToken='';sync()}}
function openMenu(kind){previousUI=ui;game.pause();scene(kind)}
function closeMenu(){if(previousUI==='home')showHome();else if(game.state.scene==='playing')enterPlaying();else{ui='briefing';lastCoreToken='';sync()}}
function help(){openMenu('help');dialog('Wische mit Absicht.',`<p class="muted">Halte die linke Maustaste gedrückt oder ziehe den Finger durch eine Ablenkung. Sinnvolle Inhalte lässt du bis zum oberen Rand fliegen. Die Symbole behalten ihr Aussehen, auch wenn sich die richtige Aktion verändert.</p>${examples(game.state.context||'study')}<div class="insight-card">Goldene Power-ups: Zeitlupe, Fokus-Schild und Punkte-Multiplikator. Fünf richtige Entscheidungen aktivieren Focus Flow. Fehler kosten Herzen und erhöhen Overload; richtige Entscheidungen senken ihn wieder.</div><p class="muted"><kbd>Esc</kbd> Pause · <kbd>M</kbd> Ton · Ton ist freiwillig. Arcade-Score bewertet Geschick; Balance-Score bewertet deine Entscheidungen.</p>`,button('Verstanden','close-menu'),{label:'ANLEITUNG // NICHT ALLES DIGITALE IST SCHLECHT'})}
function skins(){if(ui!=='skins')openMenu('skins');const profile=game.profile;dialog('Deine Klinge. Dein Stil.',`<p class="muted">${money()} Münzen. Sie entstehen aus abgeschlossenen Runden; es gibt keine echten Käufe.</p><div class="skin-grid">${skinList().map(s=>{const owned=profile.unlockedSkins.includes(s.id),chosen=profile.selectedSkin===s.id;return `<article class="skin-card ${chosen?'is-selected':''}"><div class="skin-blade" style="--skin-color:${escape(s.color||s.bladeColor||'#72f9d1')}">✦</div><h3>${escape(s.name||s.label||s.id)}</h3><p class="muted">${escape(s.description||'Ein anderer Look für Klinge und Focus Flow.')}</p><button class="btn ${chosen?'ghost':'primary'}" data-skin="${escape(s.id)}" ${chosen?'disabled':''}>${chosen?'Ausgerüstet':owned?'Ausrüsten':`${s.cost} Münzen`}</button></article>`}).join('')}</div>`,button('Zurück','close-menu','ghost'),{label:'DOJO // FREISCHALTEN'})}
function highscores(){openMenu('highscores');dialog('Deine besten Runs.',`<div class="result-list">${Object.entries(modes).map(([key,label])=>`<div><span>${label}</span><strong>${Number(game.profile.highScores[key]||0).toLocaleString('de-DE')}</strong></div>`).join('')}</div><p class="muted">${game.profile.totalRuns} abgeschlossene Runden · ${money()} Münzen. Highscores werden ausschließlich auf diesem Gerät gespeichert.</p><div class="insight-card">${game.profile.achievements?.length||0} Erfolge freigeschaltet. Bewusstes Aufhören kann deine Balance verbessern, auch wenn ein längerer Run mehr Arcade-Punkte bringt.</div>`,button('Zurück','close-menu','ghost'),{label:'HIGHSCORES // DEIN REKORD'})}
function results(){
  scene('results');const s=game.state,m=s.metrics||{},correct=m.correctDecisions||0,wrong=(m.usefulMistakes||0)+(m.missedDistractions||0)+(m.shieldedMistakes||0);const ratio=correct+wrong?Math.round(correct/(correct+wrong)*100):0;
  dialog(s.lives>0?'Dein digitaler Tag. Gemeistert.':'Neue Runde. Neue Chance.',`<div class="stat-grid"><div><span>ARCADE SCORE</span><strong>${Number(s.scoreArcade??s.score).toLocaleString('de-DE')}</strong></div><div><span>BALANCE SCORE</span><strong>${Math.round(s.balanceScore??s.balance)}<small>/100</small></strong></div><div><span>RICHTIGE ENTSCHEIDUNGEN</span><strong>${ratio}%</strong></div><div><span>BESTE COMBO</span><strong>×${m.bestCombo??s.bestCombo??0}</strong></div></div><div class="reflection"><div class="eyebrow">DEIN BALANCE-FAZIT</div><p>${s.balanceScore>=75?'Du hast viele passende Signale erhalten und deine Ziele geschützt. Behalte besonders deine bewussten Zeitentscheidungen bei.':s.balanceScore>=40?'Du hast richtige Signale erkannt. Achte beim nächsten Run auf die aktuelle Situation und auf dein selbst gewähltes Ende.':'Probier einen ruhigeren Run: Erst die aktuelle Situation lesen, dann wischen. Wichtige Nachrichten durchzulassen zählt genauso wie ein guter Treffer.'}</p><p class="muted">Spielbasierte Rückmeldung, keine gesundheitliche Diagnose. ${m.flowTriggers??0}× Focus Flow · ${money()} Münzen im Dojo verfügbar.</p></div>`,button('Noch ein Run →','again')+button('Skins & Klingen','skins','ghost')+button('Spielverlauf exportieren','export','ghost')+button('Startmenü','home','ghost'),{label:'RUN COMPLETE // MASTER YOUR DIGITAL BALANCE'});save()
}
function exportData(){const url=URL.createObjectURL(new Blob([JSON.stringify(game.exportData(),null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='Notification-Ninja-Spielverlauf.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
async function toggleSound(){sound=!sound;if(sound){const r=await audio.unlock();if(r===false||r?.ok===false)sound=false;}audio.setEnabled(sound);$('sound-toggle').setAttribute('aria-pressed',String(sound));$('sound-toggle').title=sound?'Ton ausschalten':'Soundtrack einschalten';if(sound)audio.play({type:'click'})}
function renderHUD(){
  const s=game.state,c=contexts[s.context]||contexts.study;
  $('context-label').textContent=s.isTutorial?'DEIN NINJA-TRAINING':`${c.name} · ${c.time}`;$('level-label').textContent=s.isTutorial?'WISCHEN / DURCHLASSEN':`LEVEL ${String(s.levelIndex+1).padStart(2,'0')} / 04`;
  $('score-value').textContent=Number(s.score||0).toLocaleString('de-DE');$('combo-value').textContent=`×${s.combo||0}`;$('lives-value').textContent='♥'.repeat(Math.max(0,s.lives??3))+'♡'.repeat(Math.max(0,3-(s.lives??3)));$('lives-value').setAttribute('aria-label',`${s.lives??3} von 3 Herzen`);
  for(const [id,value] of [['balance-meter',s.balance??80],['overload-meter',s.overload??0],['flow-meter',Math.min(100,(s.effects?.flow||0)/5*100)]]){const v=Math.round(value);$(id).style.width=`${v}%`;$(id).setAttribute('aria-valuenow',String(v))}
  $('time-value').textContent=`${Math.max(0,Math.ceil(s.remaining||0))} s`;$('stop-button').hidden=!(s.context==='sleep'&&s.stopAvailable&&s.scene==='playing');$('stop-button').textContent='Punkte sichern & Nacht abschließen';
  document.body.classList.toggle('is-flow',ui==='playing'&&s.effects?.flow>0);document.body.classList.toggle('is-overloaded',ui==='playing'&&s.overload>=60);$('arena').dataset.context=s.context||'study';
  $('legend').textContent=s.isTutorial?`TRAINING: ${s.tutorialDecisions||0} / 6 richtig · Ablenkung wischen. Wichtige Info durchlassen.`:`${c.goal} Ablenkung? Wischen. Jetzt sinnvoll? Durchlassen.`;
  let chips=$('effect-chips');if(!chips){chips=document.createElement('div');chips.id='effect-chips';chips.className='effect-chips';$('hud').append(chips)}chips.innerHTML=[s.effects?.slow>0?'ZEITLUPE':null,s.effects?.shield>0?'SCHILD BEREIT':null,s.effects?.multiplier>0?'PUNKTE ×2':null,s.effects?.flow>0?'FOCUS FLOW':null].filter(Boolean).map(text=>`<span>${text}</span>`).join('');
}
function announce(text){let el=$('context-announcement');if(!el){el=document.createElement('div');el.id='context-announcement';el.className='context-announcement';$('arena').append(el)}el.textContent=text;el.classList.add('visible');clearTimeout(contextTimer);contextTimer=setTimeout(()=>el.classList.remove('visible'),2800)}
function handle(events,objects=new Map()){
  if(!events.length)return;
  for(const e of events){const fx={...e,object:e.object||objects.get(e.id)||game.state.objects.find(o=>o.id===e.id)};renderer.effect(fx);audio.play(e);
    if(e.type==='sliced'||e.type==='useful-passed'){const pop=$('combo-pop');pop.textContent=e.type==='useful-passed'?`SIGNAL ERHALTEN +${e.points??100}`:`+${e.points??100}${game.state.combo>=5?' · COMBO ×'+game.state.combo:''}`;pop.classList.add('visible');clearTimeout(popTimer);popTimer=setTimeout(()=>pop.classList.remove('visible'),1000)}
    if(e.type==='flow-started')announce('FOCUS FLOW // DEINE KLINGE IST WACH');
    if(e.type==='useful-mistake')toast(e.protected?'Dein Fokus-Schild fängt den Fehler ab.':'Dieses Signal war jetzt sinnvoll. Lass es beim nächsten Mal durch.');
    if(e.type==='distraction-missed')toast('Eine Ablenkung ist durchgekommen. Orientiere dich an deinem aktuellen Ziel.');
    if(e.type==='powerup')toast({slow:'Zeitlupe aktiv.',shield:'Fokus-Schild bereit.',multiplier:'Punkte-Multiplikator aktiv.'}[e.effect||e.powerup||e.power]||'Power-up aktiviert.');
    if(e.type==='context-changing')announce('SITUATION WECHSELT // FELD LEERT SICH');
    if(e.type==='context-changed')announce(`${contexts[game.state.context]?.name||'NEUE SITUATION'} // NEUES ZIEL`);
  }renderHUD();
}
function localPoint(e){const r=$('world').getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top,t:performance.now()/1000}}
function movePointer(e){if(e.pointerId!==swipePointer||!running())return;const p=localPoint(e),before=new Map(game.state.objects.map(o=>[o.id,{...o}]));if(lastPoint)handle(game.swipe([lastPoint,p]),before);lastPoint=p;trail.push(p);if(trail.length>30)trail.shift();renderer.setTrail(trail)}
function wire(){
  $('launch').onclick=launch;$('continue').onclick=continueRun;$('pause-button').onclick=pause;$('sound-toggle').onclick=toggleSound;$('help-button').onclick=help;$('skins-button').onclick=skins;$('highscores-button').onclick=highscores;$('stop-button').onclick=sleepChoice;
  $('world').addEventListener('pointerdown',e=>{if(!running()||swipePointer!==null||e.button!==0)return;e.preventDefault();swipePointer=e.pointerId;lastPoint=localPoint(e);trail=[lastPoint];$('world').setPointerCapture(e.pointerId);renderer.setTrail(trail)});
  $('world').addEventListener('pointermove',e=>{if(e.pointerId!==swipePointer)return;e.preventDefault();const samples=e.getCoalescedEvents?.();for(const p of samples?.length?samples:[e])movePointer(p)});
  $('world').addEventListener('pointerup',e=>{movePointer(e);if(e.pointerId===swipePointer){swipePointer=null;lastPoint=null}});$('world').addEventListener('pointercancel',()=>{swipePointer=null;lastPoint=null});
  $('overlay-root').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;const action=b.dataset.action;if(b.dataset.skin){const id=b.dataset.skin,owned=game.profile.unlockedSkins.includes(id);const r=owned?game.selectSkin(id):game.buySkin(id);if(!good(r))toast(why(r));else if(!owned)game.selectSkin(id);skins();save();return;}
    if(action==='next')next();else if(action==='skip-tutorial'){const r=game.skipTutorial();if(good(r)){ui='briefing';lastCoreToken='';sync()}else toast(why(r));}else if(action==='resume')resume();else if(action==='home')showHome();else if(action==='close-menu')closeMenu();else if(action==='stop')stop();else if(action==='extend')extend();else if(action==='sleep-bonus')sleepBonus();else if(action==='again')launch();else if(action==='skins')skins();else if(action==='export')exportData();
  });
  window.addEventListener('keydown',e=>{if(e.target instanceof HTMLSelectElement||e.target instanceof HTMLInputElement)return;if(e.key==='Escape'){e.preventDefault();if(ui==='paused')resume();else if(running())pause();else if(['help','skins','highscores'].includes(ui))closeMenu()}if(e.key.toLowerCase()==='m'&&!e.repeat)toggleSound()});
  window.addEventListener('blur',()=>{if(running())pause()});document.addEventListener('visibilitychange',()=>{if(document.hidden&&running())pause()});window.addEventListener('pagehide',save);
  new ResizeObserver(()=>{renderer.resize();const size=renderer.getSize();game.resize(size.width,size.height)}).observe($('arena'));
}
function frame(t){
  const dt=Math.min(.05,Math.max(0,(t-lastTime)/1000));lastTime=t;
  if(running()){const before=new Map(game.state.objects.map(o=>[o.id,{...o}]));handle(game.update(dt),before);sync();saveClock+=dt;if(saveClock>=2){saveClock=0;save()}
    const s=game.state,token=`${s.startedAt}:${s.stageIndex}`;if(s.context==='sleep'&&s.levelIndex===2&&s.stopAvailable&&sleepOfferToken!==token){sleepOfferToken=token;sleepChoice()}
  }
  sync();
  renderer.render({...game.state,skinData:skinList().find(s=>s.id===game.state.skin),scene:ui==='home'?'home':game.state.scene,paused:ui!=='playing'||game.state.paused,training:game.state.isTutorial},t/1000);audio.update({...game.state,paused:ui!=='playing'||game.state.paused},dt);
  hudClock+=dt;if(hudClock>.1){hudClock=0;renderHUD()}requestAnimationFrame(frame)
}
function boot(){
  try{renderer=createRenderer($('world'));audio=createAudio();const size=renderer.getSize();game=new NinjaGame({width:size.width,height:size.height});wire();showHome();$('loading').hidden=true;requestAnimationFrame(frame);
    window.__NOTIFICATION_NINJA__=Object.freeze({getSnapshot:()=>({version:'1.0.0',ui,state:JSON.parse(JSON.stringify(game.state)),profile:JSON.parse(JSON.stringify(game.profile)),renderer:renderer.getStats(),audio:audio.getStats(),storageFailed:game.storageFailed})});
    if(location.protocol==='file:'){$('download').hidden=true;document.querySelectorAll('.project-link').forEach(link=>link.hidden=true)}
    if(location.protocol.startsWith('http')&&'serviceWorker'in navigator){const controlled=Boolean(navigator.serviceWorker.controller);let reloading=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(controlled&&!reloading){reloading=true;save();location.reload()}});navigator.serviceWorker.register('./sw.js').catch(()=>{})}
  }catch(error){console.error('Notification Ninja startup failed',error);$('loading').hidden=true;dialog('Die Klinge konnte nicht starten.',`<p class="muted">${escape(error.message)}</p>`,button('Neu laden','reload'));$('overlay-root').querySelector('button').onclick=()=>location.reload()}
}
boot();
