import {getLanguage,onLanguageChange} from './i18n.js';

/** Local device comfort, separate from account settings, saves, rewards and replays. */
export const COMFORT_KEY='notification-ninja:comfort:v1';
export const COMFORT_DEFAULTS=Object.freeze({hand:'right',haptics:false});
const fallback=new Map(),listeners=new Set();
const copy=value=>({...value});
function storage(){try{return globalThis.localStorage||null;}catch{return null;}}
export function normalizeComfort(value){
  return {hand:value?.hand==='left'?'left':'right',haptics:value?.haptics===true};
}
export function getComfort(store=storage()){
  if(fallback.has(store))return copy(fallback.get(store));
  try{const raw=store?.getItem(COMFORT_KEY);if(raw&&raw.length<=4096)return normalizeComfort(JSON.parse(raw));}catch{}
  return copy(COMFORT_DEFAULTS);
}
export function applyComfort(value=getComfort(),doc=globalThis.document){
  const next=normalizeComfort(value);
  if(doc?.documentElement)doc.documentElement.dataset.comfortHand=next.hand;
  if(doc?.body)doc.body.dataset.comfortHand=next.hand;
  return copy(next);
}
export function setComfort(patch,{storage:store=storage(),document:doc=globalThis.document}={}){
  const previous=getComfort(store),safe={};
  if(patch?.hand==='left'||patch?.hand==='right')safe.hand=patch.hand;
  if(typeof patch?.haptics==='boolean')safe.haptics=patch.haptics;
  const next=normalizeComfort({...previous,...safe});
  try{if(!store)throw Error('Device storage unavailable');store.setItem(COMFORT_KEY,JSON.stringify(next));fallback.delete(store);}catch{fallback.set(store,next);}
  applyComfort(next,doc);
  for(const listener of listeners){try{listener(copy(next));}catch{}}
  return copy(next);
}
export function onComfortChange(listener){if(typeof listener!=='function')return()=>{};listeners.add(listener);return()=>listeners.delete(listener);}
export function hapticsAvailable(nav=globalThis.navigator){return typeof nav?.vibrate==='function';}

const PATTERNS=Object.freeze({slice:Object.freeze([9]),mistake:Object.freeze([14,26,9]),super:Object.freeze([12,16,12])});
/** Feedback consumes canonical game events only. It cannot change a game or profile. */
export function createComfortFeedback({navigator:nav=globalThis.navigator,document:doc=globalThis.document,matchMedia:media=globalThis.matchMedia,getSettings=getComfort,now=()=>globalThis.performance?.now?.()??Date.now(),throttleMs=90}={}){
  let active=true,lastAt=-Infinity,activeUntil=-Infinity;
  const minimumGap=Number.isFinite(throttleMs)?Math.max(60,throttleMs):90;
  function stamp(){const value=Number(now());return Number.isFinite(value)?value:0;}
  function stop(){
    if(activeUntil>stamp()&&hapticsAvailable(nav)){try{nav.vibrate(0);}catch{}}
    activeUntil=-Infinity;
  }
  function quiet(){try{return typeof media==='function'&&media.call(globalThis,'(prefers-reduced-motion: reduce)').matches===true;}catch{return false;}}
  function feedback(event,{calmEffects=false}={}){
    if(!active||!event||typeof event.type!=='string')return false;
    if(['pause','paused','run-ended','level-complete','healthy-stop'].includes(event.type)){stop();return false;}
    const preferences=normalizeComfort(getSettings());
    if(!preferences.haptics||!hapticsAvailable(nav)||doc?.hidden||calmEffects||quiet()){stop();return false;}
    let pattern;
    if(event.type==='sliced'&&event.kind==='distraction')pattern=PATTERNS.slice;
    else if(event.type==='life-lost'&&['useful-cut','distraction-missed'].includes(event.reason))pattern=PATTERNS.mistake;
    else if(event.type==='super-used')pattern=PATTERNS.super;
    if(!pattern)return false;
    const time=stamp();if(time-lastAt<minimumGap)return false;
    try{if(nav.vibrate([...pattern])===false)return false;}catch{return false;}
    lastAt=time;activeUntil=time+pattern.reduce((sum,value)=>sum+value,0);return true;
  }
  const hidden=()=>{if(doc?.hidden)stop();};doc?.addEventListener?.('visibilitychange',hidden);
  function destroy(){if(!active)return;stop();active=false;doc?.removeEventListener?.('visibilitychange',hidden);}
  feedback.stop=stop;feedback.destroy=destroy;
  feedback.getState=()=>({active,supported:hapticsAvailable(nav),lastFeedbackAt:Number.isFinite(lastAt)?lastAt:null});
  return feedback;
}
export const comfortFeedback=createComfortFeedback();
onComfortChange(next=>{if(!next.haptics)comfortFeedback.stop();});

const WORDS=Object.freeze({
  de:{title:'Deine Bedienhand',description:'SUPER und die Spielanzeige passen sich deiner Hand an. Die Spielregeln bleiben gleich.',right:'Rechtshändig',left:'Linkshändig',group:'Bevorzugte Bedienhand',haptics:'Kurzes haptisches Feedback',hapticsInfo:'Freiwillige kurze Vibration bei Schnitten, Fehlern und SUPER, sofern dein Gerät sie unterstützt. Bei ruhigen Effekten bleibt sie aus.',unsupported:'Dieser Browser bietet keine Haptik an. Alle Hinweise bleiben sichtbar und hörbar.',local:'Nur auf diesem Gerät gespeichert. Diese Auswahl verändert keine Kontodaten oder Spielstände.'},
  en:{title:'Your playing hand',description:'SUPER and the run display adapt to your hand. The game rules stay the same.',right:'Right-handed',left:'Left-handed',group:'Preferred playing hand',haptics:'Brief haptic feedback',hapticsInfo:'Optional short vibrations for cuts, mistakes and SUPER, when supported by your device. Calm effects keep them off.',unsupported:'This browser does not offer haptics. All feedback remains visible and audible.',local:'Saved only on this device. This choice does not change account data or saved progress.'}
});
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function comfortPanelMarkup({value=getComfort(),supported=hapticsAvailable(),language=getLanguage()}={}){
  const words=WORDS[language==='en'?'en':'de'],prefs=normalizeComfort(value);
  return `<section class="settings-section comfort-settings" translate="no"><h3>${escape(words.title)}</h3><p>${escape(words.description)}</p><div class="comfort-hand-picker" role="group" aria-label="${escape(words.group)}"><button type="button" class="btn ghost" data-comfort-hand="right" aria-pressed="${prefs.hand==='right'}"><span aria-hidden="true">↗</span>${escape(words.right)}</button><button type="button" class="btn ghost" data-comfort-hand="left" aria-pressed="${prefs.hand==='left'}"><span aria-hidden="true">↖</span>${escape(words.left)}</button></div><label class="calm-toggle comfort-haptics" for="comfort-haptics"><input id="comfort-haptics" data-comfort-haptics type="checkbox" ${prefs.haptics?'checked':''} ${supported?'':'disabled'}><span><strong>${escape(words.haptics)}</strong><small>${escape(supported?words.hapticsInfo:words.unsupported)}</small></span></label><p class="comfort-device-note">${escape(words.local)}</p></section>`;
}
export function createComfortPanel({container,storage:store=storage(),navigator:nav=globalThis.navigator}={}){
  if(!container)throw TypeError('Comfort panel requires a container.');
  let active=false,unsubscribe=()=>{},unsubscribeLanguage=()=>{};
  function render(){
    const focused=container.ownerDocument?.activeElement,key=focused?.dataset?.comfortHand,wasHaptics=focused?.matches?.('[data-comfort-haptics]');
    container.innerHTML=comfortPanelMarkup({value:getComfort(store),supported:hapticsAvailable(nav)});
    const target=key?container.querySelector(`[data-comfort-hand="${key}"]`):wasHaptics?container.querySelector('[data-comfort-haptics]'):null;
    target?.focus({preventScroll:true});
  }
  function click(event){const button=event.target.closest?.('[data-comfort-hand]');if(!button||!container.contains(button))return;event.preventDefault();setComfort({hand:button.dataset.comfortHand},{storage:store});}
  function change(event){if(event.target.matches?.('[data-comfort-haptics]'))setComfort({haptics:event.target.checked===true},{storage:store});}
  function show(){if(!active){active=true;container.addEventListener('click',click);container.addEventListener('change',change);unsubscribe=onComfortChange(render);unsubscribeLanguage=onLanguageChange(render);}render();return controller;}
  function destroy(){if(!active)return;active=false;container.removeEventListener('click',click);container.removeEventListener('change',change);unsubscribe();unsubscribeLanguage();}
  const controller=Object.freeze({show,destroy,getState:()=>({...getComfort(store),supported:hapticsAvailable(nav),active})});return controller;
}
if(globalThis.window?.addEventListener)window.addEventListener('storage',event=>{
  if(event.key!==COMFORT_KEY&&event.key!==null)return;
  const store=storage();fallback.delete(store);const next=applyComfort(getComfort(store));
  for(const listener of listeners){try{listener(copy(next));}catch{}}
});
