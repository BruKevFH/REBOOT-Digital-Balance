import {getLanguage,onLanguageChange,tr} from './i18n.js';
import {getPreferences,onPreferencesChange} from './preferences.js';
import {CONTENT} from './game.js';
import {playerPortrait} from './renderer.js';
import {ninjaPortrait} from './mentor.js';

export const INTRO_STORAGE_PREFIX='notification-ninja:intro:v1:';
const freeze=value=>{if(value&&typeof value==='object'){for(const part of Object.values(value))freeze(part);Object.freeze(value);}return value;};
export const INTRO_STEPS=freeze([
  {id:'arrival',context:'study',duration:4,signals:['homework','autoplay'],de:{chapter:'01 · Willkommen im Dojo',title:'Ich bin dein Ninja.',line:'Jeden Tag fliegen Nachrichten durch mein Dojo. Gemeinsam wählen wir, was gerade zählt.',rule:'Dein Ziel entscheidet.',keep:'Das hilft mir',slice:'Das kann warten'},en:{chapter:'01 · Welcome to the dojo',title:'I am your ninja.',line:'Messages fly through my dojo every day. Together, we choose what matters right now.',rule:'Your goal decides.',keep:'This helps me',slice:'This can wait'}},
  {id:'focus',context:'study',duration:5,signals:['homework','autoplay'],de:{chapter:'02 · Mein Fokus',title:'Ein Wisch für das Wichtige.',line:'Beim Lernen schneide ich Ablenkungen weg. Was mir bei der Aufgabe hilft, lasse ich unberührt durch.',rule:'Ablenkung: wischen. Hilfreich: durchlassen.',keep:'Hilfreiches durchlassen',slice:'Ablenkung wegwischen'},en:{chapter:'02 · My focus',title:'A swipe for what matters.',line:'When studying, I slice away distractions. I let the things that help my task pass untouched.',rule:'Distraction: swipe. Helpful: let through.',keep:'Let helpful things through',slice:'Swipe distractions away'}},
  {id:'play',context:'gaming',duration:5,signals:['gaming-invite','streak'],de:{chapter:'03 · Meine Spielzeit',title:'Gleiches Signal. Neues Ziel.',line:'Beim Gaming helfen mir Teamnachrichten. Endlose Feeds können warten. Gute Entscheidungen laden meine freigeschaltete Super.',rule:'Lies die Situation. Dann entscheide.',keep:'Mein Team unterstützt mich',slice:'Der Feed kann warten'},en:{chapter:'03 · My playtime',title:'Same signal. A new goal.',line:'When gaming, team messages help me. Endless feeds can wait. Good decisions charge the Super I have unlocked.',rule:'Read the situation. Then decide.',keep:'My team supports me',slice:'The feed can wait'}},
  {id:'rest',context:'sleep',duration:6,signals:['quiet','gameclip'],de:{chapter:'04 · Meine Balance',title:'Auch Aufhören ist ein Ninja-Move.',line:'Abends schütze ich meine Ruhe. Im Open Run spiele ich mit drei Herzen ohne Zeitlimit. Eine Pause darf ich jederzeit wählen.',rule:'Dein Tempo. Deine Entscheidung.',keep:'Ruhe behalten',slice:'Morgen ist auch ein Tag'},en:{chapter:'04 · My balance',title:'Stopping is a ninja move too.',line:'In the evening, I protect my rest. Open Run gives me three hearts and no time limit. I can choose a break at any time.',rule:'Your pace. Your choice.',keep:'Keep the calm',slice:'Tomorrow is another day'}}
]);
export const INTRO_DURATION=INTRO_STEPS.reduce((sum,step)=>sum+step.duration,0);
const CONTENT_BY_ID=new Map(CONTENT.map(item=>[item.id,item]));
const memory=new Map();
const storageDefault=()=>{try{return globalThis.localStorage||null;}catch{return null;}};
const key=scope=>INTRO_STORAGE_PREFIX+encodeURIComponent(typeof scope==='string'&&scope.length>0&&scope.length<=160?scope:'guest');
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function remembered(storage,scope){return memory.get(storage)?.has(key(scope))===true;}
function remember(storage,scope){let entries=memory.get(storage);if(!entries){entries=new Set();memory.set(storage,entries);}entries.add(key(scope));if(entries.size>64)entries.delete(entries.values().next().value);}

export function readNinjaIntro(storage=storageDefault(),scope='guest'){
  let seen=remembered(storage,scope),available=Boolean(storage);
  try{const raw=storage?.getItem(key(scope));if(raw&&raw.length<=256){const value=JSON.parse(raw);seen=seen||value?.version===1&&value?.seen===true;}}catch{available=false;}
  return {seen,available};
}
export function shouldShowNinjaIntro(storage=storageDefault(),scope='guest'){return !readNinjaIntro(storage,scope).seen;}
export function resetNinjaIntro(storage=storageDefault(),scope='guest'){
  memory.get(storage)?.delete(key(scope));
  try{if(!storage?.removeItem)return false;storage.removeItem(key(scope));return true;}catch{return false;}
}
export function markNinjaIntroSeen(storage=storageDefault(),scope='guest'){
  remember(storage,scope);
  try{if(!storage?.setItem)return false;storage.setItem(key(scope),JSON.stringify({version:1,seen:true}));return true;}catch{return false;}
}

/** A presentation clock. It neither simulates a run nor reads or writes a player profile. */
export function createNinjaIntroModel({reducedMotion=false}={}){
  let elapsed=0,playing=false,finished=false,calm=reducedMotion===true;
  const starts=INTRO_STEPS.map((_,index)=>INTRO_STEPS.slice(0,index).reduce((sum,step)=>sum+step.duration,0));
  const state=()=>{const index=finished?INTRO_STEPS.length-1:Math.max(0,starts.findLastIndex(start=>elapsed>=start));return {elapsed,duration:INTRO_DURATION,playing,finished,reducedMotion:calm,step:index,context:INTRO_STEPS[index].context,stepElapsed:Math.min(INTRO_STEPS[index].duration,Math.max(0,elapsed-starts[index])),progress:Math.min(1,elapsed/INTRO_DURATION)};};
  function play(){if(finished||calm)return false;playing=true;return true;}
  function pause(){playing=false;}
  function advance(dt,{hidden=false}={}){if(!playing||finished||hidden||typeof dt!=='number'||!Number.isFinite(dt)||dt<=0)return state();elapsed=Math.min(INTRO_DURATION,elapsed+Math.min(.1,dt));if(elapsed>=INTRO_DURATION){finished=true;playing=false;}return state();}
  function seekStep(index){if(!Number.isInteger(index)||index<0||index>=INTRO_STEPS.length)return false;elapsed=starts[index];finished=false;return true;}
  function next(){const current=state();if(current.step<INTRO_STEPS.length-1)return seekStep(current.step+1);elapsed=INTRO_DURATION;finished=true;playing=false;return true;}
  function restart(){elapsed=0;finished=false;playing=!calm;return state();}
  function setReducedMotion(value){calm=value===true;if(calm)playing=false;return state();}
  return Object.freeze({getState:state,play,pause,advance,seekStep,next,restart,setReducedMotion});
}

const COPY={
  de:{label:'Dein erstes Ninja-Abenteuer',brand:'DEIN DOJO. DEIN WEG.',skip:'Intro überspringen',voice:'Erzählstimme einschalten',voiceOff:'Erzählstimme ausschalten',voiceUnavailable:'Stimme nicht verfügbar',voiceMuted:'Ton ist stummgeschaltet',pause:'Intro pausieren',resume:'Intro fortsetzen',next:'Nächste Szene',start:'Mein Dojo betreten',replay:'Von vorn ansehen',caption:'Ein Ninja erzählt',motion:'Ruhige Erzählung · mit Weiter blättern',chapter:'Szene',training:'Danach übst du selbst – ohne Zeitdruck.',canvas:'Eine eigene Ninja-Kurzgeschichte: Ablenkungen schneiden, hilfreiche Dinge durchlassen und bewusst eine Pause wählen.',local:'Deine Auswahl bleibt auf diesem Gerät.',unavailable:'Die Auswahl gilt für diese Sitzung; dauerhafte Speicherung ist nicht verfügbar.'},
  en:{label:'Your first ninja adventure',brand:'YOUR DOJO. YOUR PATH.',skip:'Skip intro',voice:'Turn narration on',voiceOff:'Turn narration off',voiceUnavailable:'Voice unavailable',voiceMuted:'Sound is muted',pause:'Pause intro',resume:'Resume intro',next:'Next scene',start:'Enter my dojo',replay:'Watch from the start',caption:'A ninja tells their story',motion:'Calm story · use Next to continue',chapter:'Scene',training:'Then you practise for yourself, without time pressure.',canvas:'An original ninja short story: slice distractions, let helpful things through and choose a break deliberately.',local:'Your choice stays on this device.',unavailable:'The choice applies to this session; persistent storage is unavailable.'}
};
const REGION={study:'768 0 768 512',gaming:'0 0 768 512',sleep:'0 512 768 512'};
const room=context=>`<svg class="ninja-intro-room" viewBox="${REGION[context]||REGION.study}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><image href="./assets/indie-worlds.png" width="1536" height="1024"/></svg>`;

/** A skippable, original in-engine cinematic. Optional narration requires an explicit user click. */
export function createNinjaIntro({container,storage=storageDefault(),scope='guest',skinId='default',audioPrefs=getPreferences,onDone=()=>{},onStateChange=()=>{},language}={}){
  if(!container?.ownerDocument)throw new TypeError('Ninja intro requires a DOM container.');
  const root=container,doc=root.ownerDocument,view=doc.defaultView||globalThis;
  const motion=view.matchMedia?.('(prefers-reduced-motion: reduce)');
  const preferences=()=>{try{return typeof audioPrefs==='function'?audioPrefs():audioPrefs||{};}catch{return {muted:true};}};
  const reduced=motion?.matches===true||preferences().calmEffects===true;
  let model=createNinjaIntroModel({reducedMotion:reduced}),active=false,disposed=false,raf=null,lastStamp=null,lastPaint=-Infinity,lastStep=-1;
  let canvas=null,context=null,width=0,height=0,dpr=1,resizeObserver=null,unsubscribe=null,unsubscribePrefs=null,previousFocus=null;
  let voiceOn=false,utterance=null,wasPlaying=false,renderedFrames=0,storageAvailable=readNinjaIntro(storage,scope).available;
  const getLang=()=>language==='de'||language==='en'?language:getLanguage();
  const words=()=>COPY[getLang()==='en'?'en':'de'];
  const voiceAvailable=()=>Boolean(view.speechSynthesis?.speak&&typeof view.SpeechSynthesisUtterance==='function'&&view.speechSynthesis.getVoices?.().some(voice=>voice.lang?.toLowerCase().startsWith(getLang())));
  const getState=()=>({...model.getState(),active,disposed,language:getLang(),voiceOn,voiceAvailable:voiceAvailable(),storageAvailable,hidden:doc.hidden===true,renderedFrames,rafPending:raf!==null,rendererReady:Boolean(context),kind:'original-canvas-cinematic',ranked:false,rewards:false});
  function report(){onStateChange(getState());}
  function stopVoice(){if(utterance){utterance.onend=null;utterance.onerror=null;try{view.speechSynthesis?.cancel();}catch{}utterance=null;}}
  function narrate(){
    stopVoice();const prefs=preferences();if(!active||!voiceOn||doc.hidden||prefs.muted||!voiceAvailable())return;
    const text=INTRO_STEPS[model.getState().step][getLang()==='en'?'en':'de'];
    utterance=new view.SpeechSynthesisUtterance(text.title+' '+text.line);utterance.lang=getLang()==='en'?'en-GB':'de-DE';utterance.rate=.95;utterance.volume=typeof prefs.effectsVolume==='number'?Math.max(0,Math.min(1,prefs.effectsVolume)):.5;
    const own=utterance;own.onend=()=>{if(utterance===own)utterance=null;};own.onerror=own.onend;view.speechSynthesis.speak(own);
  }
  function updateControls(){
    if(!active)return;const text=words(),state=model.getState();
    const voice=root.querySelector('[data-intro-action=voice]');if(voice){voice.disabled=!voiceAvailable()||preferences().muted===true;voice.setAttribute('aria-pressed',String(voiceOn));voice.setAttribute('aria-label',preferences().muted?text.voiceMuted:!voiceAvailable()?text.voiceUnavailable:voiceOn?text.voiceOff:text.voice);voice.querySelector('span:last-child').textContent=preferences().muted?text.voiceMuted:!voiceAvailable()?text.voiceUnavailable:voiceOn?text.voiceOff:text.voice;}
    const toggle=root.querySelector('[data-intro-action=toggle]');if(toggle){toggle.hidden=state.reducedMotion;toggle.setAttribute('aria-label',state.playing?text.pause:text.resume);toggle.textContent=state.playing?'Ⅱ':'▶';}
    const next=root.querySelector('[data-intro-action=next]');if(next)next.textContent=state.step===INTRO_STEPS.length-1?text.start+' →':text.next+' →';
    const bar=root.querySelector('[data-intro-progress]');if(bar){bar.style.width=`${state.progress*100}%`;bar.parentElement.setAttribute('aria-valuenow',String(Math.round(state.progress*100)));}
    for(const button of root.querySelectorAll('[data-intro-step]')){const index=Number(button.dataset.introStep);button.setAttribute('aria-current',index===state.step?'step':'false');button.setAttribute('aria-label',`${text.chapter} ${index+1}: ${INTRO_STEPS[index][getLang()==='en'?'en':'de'].title}`);}
  }
  function updateScene({speak=true}={}){
    if(!active)return;const state=model.getState(),step=INTRO_STEPS[state.step],text=step[getLang()==='en'?'en':'de'];lastStep=state.step;
    const shell=root.querySelector('.ninja-intro');shell.lang=getLang();shell.dataset.context=step.context;shell.dataset.step=step.id;
    root.querySelector('[data-intro-room]').innerHTML=room(step.context);
    for(const [name,value]of [['chapter',text.chapter],['title',text.title],['line',text.line],['rule',text.rule],['keep',text.keep],['slice',text.slice]])root.querySelector(`[data-intro-${name}]`).textContent=value;
    updateControls();paint();if(speak)narrate();report();
  }
  function drawCard(item,x,y,size,{distraction=false,split=0,opacity=1}={}){
    const c=context;if(!c||!item)return;
    c.save();c.globalAlpha=Math.max(0,Math.min(1,opacity));c.translate(x,y);c.rotate(distraction?-.07:.055);
    function half(offset,clipping){c.save();c.translate(offset,Math.abs(offset)*.45);c.rotate(offset*.002);if(clipping){c.beginPath();c.rect(clipping==='left'?-size/2:0,-size,size/2,size*2);c.clip();}c.shadowColor='#041c4480';c.shadowBlur=12;c.shadowOffsetY=5;c.fillStyle=distraction?'#ffe5bd':'#fff5d6';c.strokeStyle='#123e43';c.lineWidth=3;c.beginPath();c.roundRect(-size/2,-size*.45,size,size*.9,12);c.fill();c.shadowBlur=0;c.shadowOffsetY=0;c.stroke();c.fillStyle=distraction?'#e77566':'#46a68e';c.beginPath();c.roundRect(-size/2+5,-size*.45+5,size-10,9,4);c.fill();c.textAlign='center';c.font=`${Math.round(size*.3)}px "Nunito", sans-serif`;c.fillText(item.icon||'✦',0,0);c.font=`900 ${Math.max(10,Math.round(size*.105))}px "Nunito", sans-serif`;c.fillStyle='#123e43';const label=tr(item.label||'');const lines=label.length>18?label.split(/\s+/):[label];if(lines.length>1){const middle=Math.ceil(lines.length/2);c.fillText(lines.slice(0,middle).join(' '),0,size*.18,size*.88);c.fillText(lines.slice(middle).join(' '),0,size*.31,size*.88);}else c.fillText(label,0,size*.27,size*.88);c.restore();}
    if(split>0){half(-split,'left');half(split,'right');}else half(0,null);c.restore();
  }
  function glove(x,y,rotation,scale,{sword=false,open=false}={}){
    const c=context;c.save();c.translate(x,y);c.rotate(rotation);c.scale(scale,scale);c.lineJoin='round';c.lineCap='round';c.strokeStyle='#092e39';c.lineWidth=4;
    c.fillStyle='#0b685c';c.beginPath();c.moveTo(-33,80);c.lineTo(-35,9);c.quadraticCurveTo(-22,-22,9,-15);c.lineTo(33,20);c.lineTo(39,80);c.closePath();c.fill();c.stroke();c.fillStyle='#21c89d';c.beginPath();c.moveTo(-31,27);c.quadraticCurveTo(0,44,33,25);c.lineTo(36,48);c.quadraticCurveTo(2,62,-32,48);c.closePath();c.fill();c.stroke();c.strokeStyle='#a2ecd4';c.lineWidth=3;c.beginPath();c.moveTo(-27,33);c.quadraticCurveTo(2,45,26,33);c.stroke();
    c.fillStyle='#164b4c';c.strokeStyle='#092e39';c.lineWidth=3;c.beginPath();c.roundRect(-31,-28,60,61,18);c.fill();c.stroke();c.strokeStyle='#4b9e86';for(let i=0;i<3;i++){c.beginPath();c.moveTo(-17+i*13,-16);c.lineTo(-17+i*13,4);c.stroke();}
    c.fillStyle='#f0cb72';c.beginPath();c.moveTo(-3,37);c.lineTo(5,44);c.lineTo(-2,54);c.lineTo(-10,46);c.closePath();c.fill();
    if(sword){c.save();c.translate(0,-8);c.rotate(-.42);c.fillStyle='#382f44';c.beginPath();c.roundRect(-7,-15,14,45,4);c.fill();c.stroke();c.strokeStyle='#e7c06b';c.lineWidth=4;for(let i=0;i<4;i++){c.beginPath();c.moveTo(-5,-8+i*9);c.lineTo(5,-3+i*9);c.stroke();}c.fillStyle='#e8be66';c.beginPath();c.roundRect(-22,-24,44,10,5);c.fill();c.stroke();c.fillStyle='#fff4cf';c.beginPath();c.moveTo(-6,-25);c.lineTo(-6,-151);c.lineTo(10,-174);c.lineTo(8,-25);c.closePath();c.fill();c.strokeStyle='#9dded5';c.lineWidth=2;c.beginPath();c.moveTo(3,-31);c.lineTo(4,-150);c.stroke();c.restore();}
    if(open){c.strokeStyle='#103e41';c.lineWidth=8;for(let i=0;i<3;i++){c.beginPath();c.moveTo(-18+i*15,-6);c.lineTo(-20+i*15,-48+i*3);c.stroke();c.strokeStyle='#3a947b';c.lineWidth=4;c.stroke();c.strokeStyle='#103e41';c.lineWidth=8;}}
    c.restore();
  }
  function paint(){
    if(!active||!context||!width||!height)return;if(root.isConnected===false){destroy();return;}
    const c=context,state=model.getState(),step=INTRO_STEPS[state.step],quiet=state.reducedMotion,time=quiet?1.45:state.elapsed;
    c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,width,height);
    const vignette=c.createLinearGradient(0,0,0,height);vignette.addColorStop(0,'#092c3e11');vignette.addColorStop(.6,'#0a263300');vignette.addColorStop(1,'#051e38aa');c.fillStyle=vignette;c.fillRect(0,0,width,height);
    const cycle=(time%2.8)/2.8,arc=Math.sin(cycle*Math.PI),size=Math.min(116,Math.max(76,width*.18));
    const useful=CONTENT_BY_ID.get(step.signals[0]),distraction=CONTENT_BY_ID.get(step.signals[1]);
    const usefulX=width*(.66+Math.sin(time*.5)*.025),usefulY=height*(.88-cycle*.92);
    const cutAt=.55,cut=Math.max(0,(cycle-cutAt)/.45),badX=width*.34,badY=height*(.77-arc*.41);
    drawCard(useful,usefulX,usefulY,size,{opacity:Math.min(1,cycle*8,Math.max(0,(1-cycle)*6))});
    drawCard(distraction,badX,badY,size,{distraction:true,split:quiet?0:cut*size*.8,opacity:cut>.65?1-(cut-.65)/.35:Math.min(1,cycle*7)});
    if(cycle>.55&&cycle<.8){const fade=1-(cycle-.55)/.25;c.save();c.globalAlpha=fade;c.lineCap='round';c.strokeStyle='#76ffe0';c.lineWidth=10;c.shadowColor='#94ffcf';c.shadowBlur=18;c.beginPath();c.moveTo(badX-size*.7,badY+size*.55);c.quadraticCurveTo(badX,badY-size*.15,badX+size*.95,badY-size*.6);c.stroke();c.strokeStyle='#fffbe9';c.lineWidth=4;c.shadowBlur=0;c.stroke();c.fillStyle='#ffda79';for(let i=0;i<7;i++){const angle=i*2.399,timeOut=cut*60;c.beginPath();c.arc(badX+Math.cos(angle)*timeOut,badY+Math.sin(angle)*timeOut,3+Math.sin(i)*1.5,0,Math.PI*2);c.fill();}c.restore();}
    if(cycle>.72){c.save();c.globalAlpha=(cycle-.72)/.28;c.strokeStyle='#b5ffcc';c.lineWidth=5;c.lineCap='round';c.beginPath();c.moveTo(usefulX-11,usefulY-8);c.lineTo(usefulX-3,usefulY);c.lineTo(usefulX+15,usefulY-19);c.stroke();c.restore();}
    for(let i=0;i<8;i++){const drift=quiet?.4:(time*.065+i*.157)%1;c.save();c.translate(width*((i*.139+drift*.14)%1),height*drift);c.rotate(i+time*.23);c.fillStyle=i%2?'#ffc8dbba':'#ffe7d2c4';c.beginPath();c.ellipse(0,0,5,2.4,.5,0,Math.PI*2);c.fill();c.restore();}
    const handScale=Math.min(1.18,Math.max(.64,width/650)),bob=quiet?0:Math.sin(time*1.8)*3;
    glove(width*.12,height*.92+bob,-.13-(cycle>.52&&cycle<.75?Math.sin((cycle-.52)/.23*Math.PI)*.28:0),handScale,{sword:true});
    glove(width*.9,height*.96-bob,.18+Math.sin(time*.7)*.025,handScale,{open:true});
    renderedFrames++;
  }
  function resize(){
    if(!active||!canvas)return;const bounds=canvas.getBoundingClientRect();width=Math.max(1,bounds.width);height=Math.max(1,bounds.height);dpr=Math.min(2,Math.max(1,view.devicePixelRatio||1));canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);paint();
  }
  function schedule(){if(active&&!disposed&&!doc.hidden&&model.getState().playing&&raf===null)raf=view.requestAnimationFrame(tick);}
  function stopFrames(){if(raf!==null)view.cancelAnimationFrame(raf);raf=null;lastStamp=null;}
  function tick(stamp){raf=null;if(!active||disposed||doc.hidden)return;const dt=lastStamp===null?0:Math.max(0,(stamp-lastStamp)/1000);lastStamp=stamp;const before=model.getState().step,state=model.advance(dt);
    if(state.finished){finish('complete');return;}if(before!==state.step||lastStep!==state.step)updateScene();else if(stamp-lastPaint>=1000/30-.1){paint();updateControls();lastPaint=stamp;}schedule();
  }
  function pause(){model.pause();stopFrames();stopVoice();updateControls();report();}
  function resume(){if(!active||doc.hidden)return false;const ok=model.play();if(ok){narrate();schedule();}updateControls();report();return ok;}
  function next(){if(!active)return;model.next();if(model.getState().finished){finish('complete');return;}lastStamp=null;updateScene();schedule();}
  function replay(){if(!active)return show({force:true});model.restart();lastStamp=null;updateScene();schedule();return true;}
  function toggleVoice(){if(!active||!voiceAvailable()||preferences().muted)return false;voiceOn=!voiceOn;if(voiceOn)narrate();else stopVoice();updateControls();report();return voiceOn;}
  function finish(reason){if(!active)return;const state=getState();storageAvailable=markNinjaIntroSeen(storage,scope);destroy();onDone({...state,reason,seenSaved:storageAvailable,completed:reason==='complete',shown:true});}
  function click(event){const button=event.target.closest?.('[data-intro-action],[data-intro-step]');if(!active||!button||!root.contains(button)||button.disabled)return;event.preventDefault();event.stopPropagation();if(button.hasAttribute('data-intro-step')){model.seekStep(Number(button.dataset.introStep));lastStamp=null;updateScene();schedule();return;}const action=button.dataset.introAction;if(action==='skip'||action==='enter')finish(action);else if(action==='next')next();else if(action==='replay')replay();else if(action==='voice')toggleVoice();else if(action==='toggle')model.getState().playing?pause():resume();}
  function keydown(event){if(!active||event.defaultPrevented)return;if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();finish('skip');return;}if(event.key==='Tab'){const items=[...root.querySelectorAll('button:not(:disabled):not([hidden])')].filter(item=>item.getClientRects().length),first=items[0],last=items.at(-1);if(event.shiftKey&&(doc.activeElement===first||!root.contains(doc.activeElement))){event.preventDefault();last?.focus();}else if(!event.shiftKey&&(doc.activeElement===last||!root.contains(doc.activeElement))){event.preventDefault();first?.focus();}}}
  function visibility(){if(doc.hidden){wasPlaying=model.getState().playing;model.pause();stopFrames();stopVoice();}else{if(wasPlaying){model.play();schedule();narrate();}wasPlaying=false;paint();}updateControls();report();}
  function languageChanged(){if(!active)return;const focused=doc.activeElement?.getAttribute('data-intro-action');renderUI();if(focused)root.querySelector(`[data-intro-action="${focused}"]`)?.focus({preventScroll:true});updateScene();}
  function motionChanged(){if(!active)return;const quiet=motion?.matches===true||preferences().calmEffects===true;if(quiet!==model.getState().reducedMotion){model.setReducedMotion(quiet);stopFrames();renderUI();report();}updateControls();}
  function preferencesChanged(){if(!active)return;if(preferences().muted)stopVoice();motionChanged();updateControls();}
  function voicesChanged(){updateControls();}
  function renderUI(){
    const text=words(),state=model.getState();
    root.innerHTML=`<section class="ninja-intro" translate="no" lang="${getLang()}" role="dialog" aria-modal="true" aria-labelledby="ninja-intro-title"><header class="ninja-intro-top"><span class="ninja-intro-brand">✦ ${text.brand}</span><button type="button" class="btn ghost" data-intro-action="skip">${text.skip} <span aria-hidden="true">→</span></button></header><div class="ninja-intro-layout"><div class="ninja-intro-stage" aria-label="${escape(text.canvas)}"><div class="ninja-intro-scenery" data-intro-room></div><canvas class="ninja-intro-canvas" aria-hidden="true"></canvas><div class="ninja-intro-cinema-bars" aria-hidden="true"></div><div class="ninja-intro-stage-title"><span data-intro-chapter></span><strong data-intro-rule></strong></div><div class="ninja-intro-signal-legend"><span class="is-keep">✓ <span data-intro-keep></span></span><span class="is-slice">✂ <span data-intro-slice></span></span></div><span class="ninja-intro-camera-label" aria-hidden="true">${getLang()==='en'?'NINJA VIEW':'NINJA-PERSPEKTIVE'}</span></div><div class="ninja-intro-story"><div class="ninja-intro-narrator"><span class="ninja-intro-player" aria-hidden="true">${playerPortrait(skinId)}</span><div><span class="eyebrow">${text.caption}</span><h2 id="ninja-intro-title" data-intro-title></h2></div></div><p class="ninja-intro-caption" data-intro-line aria-live="polite" aria-atomic="true"></p><div class="ninja-intro-sensei"><span aria-hidden="true">${ninjaPortrait()}</span><p>${text.training}</p></div><nav class="ninja-intro-chapters" aria-label="${text.chapter}">${INTRO_STEPS.map((step,index)=>`<button type="button" data-intro-step="${index}" aria-label="${escape(text.chapter+' '+(index+1)+': '+step[getLang()==='en'?'en':'de'].title)}">0${index+1}</button>`).join('')}</nav><div class="ninja-intro-progress" role="progressbar" aria-label="${escape(text.label)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(state.progress*100)}"><span data-intro-progress></span></div><p class="ninja-intro-motion-note">${state.reducedMotion?text.motion:text.local}</p></div></div><footer class="ninja-intro-controls"><div class="ninja-intro-playback"><button type="button" class="btn ghost ninja-intro-pause" data-intro-action="toggle" aria-label="${state.playing?text.pause:text.resume}" ${state.reducedMotion?'hidden':''}>${state.playing?'Ⅱ':'▶'}</button><button type="button" class="btn ghost ninja-intro-voice" data-intro-action="voice" aria-pressed="false"><span aria-hidden="true">♪</span><span>${text.voice}</span></button><button type="button" class="btn ghost ninja-intro-replay" data-intro-action="replay" aria-label="${text.replay}">↻</button></div><button type="button" class="btn primary ninja-intro-next" data-intro-action="next">${text.next} →</button></footer></section>`;
    canvas=root.querySelector('canvas');try{context=canvas.getContext('2d');}catch{context=null;}resizeObserver?.disconnect();resizeObserver?.observe(canvas);resize();updateScene({speak:false});
  }
  function show({force=false}={}){
    if(disposed)return false;if(active)return true;if(!force&&!shouldShowNinjaIntro(storage,scope))return false;
    active=true;previousFocus=doc.activeElement;root.addEventListener('click',click);root.addEventListener('keydown',keydown,true);doc.addEventListener('visibilitychange',visibility);view.addEventListener('resize',resize);view.speechSynthesis?.addEventListener?.('voiceschanged',voicesChanged);
    if(view.ResizeObserver)resizeObserver=new view.ResizeObserver(resize);motion?.addEventListener?.('change',motionChanged);unsubscribe=onLanguageChange(languageChanged);unsubscribePrefs=onPreferencesChange(preferencesChanged);model=createNinjaIntroModel({reducedMotion:reduced});model.play();renderUI();root.querySelector('[data-intro-action=skip]')?.focus({preventScroll:true});schedule();report();return true;
  }
  function destroy(){
    if(disposed)return;active=false;disposed=true;model.pause();stopFrames();stopVoice();resizeObserver?.disconnect();resizeObserver=null;unsubscribe?.();unsubscribePrefs?.();motion?.removeEventListener?.('change',motionChanged);root.removeEventListener('click',click);root.removeEventListener('keydown',keydown,true);doc.removeEventListener('visibilitychange',visibility);view.removeEventListener('resize',resize);view.speechSynthesis?.removeEventListener?.('voiceschanged',voicesChanged);root.replaceChildren();canvas=null;context=null;if(previousFocus?.isConnected&&previousFocus.getClientRects?.().length)previousFocus.focus({preventScroll:true});
  }
  return Object.freeze({show,destroy,getState,replay,pause,resume,toggleVoice});
}
