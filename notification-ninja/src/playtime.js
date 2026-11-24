import {getLanguage,onLanguageChange} from './i18n.js';

/** Device-only active playtime. It never changes a game, profile, reward or account. */
export const PLAYTIME_KEY='notification-ninja:playtime:v1:';
export const PLAYTIME_INTERVALS=Object.freeze([10,15,20,30]);
export const PLAYTIME_DEFAULTS=Object.freeze({reminders:true,intervalMinutes:15});
const MAX_MS=100*366*24*60*60*1000;
const MAX_RECORD_LENGTH=4096;
const clone=value=>JSON.parse(JSON.stringify(value));
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const finiteMs=value=>typeof value==='number'&&Number.isFinite(value)?Math.min(MAX_MS,Math.max(0,value)):0;
function deviceStorage(){try{return globalThis.localStorage||null;}catch{return null;}}
function localDay(value){
  const date=new Date(value);
  if(!Number.isFinite(date.getTime()))return null;
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function playtimeKey(scope='guest'){
  if(typeof scope!=='string'||!scope.trim()||scope.length>200||/[\u0000-\u001f]/u.test(scope))throw new TypeError('Use a bounded guest or account scope.');
  return PLAYTIME_KEY+encodeURIComponent(scope);
}
/** Call after destroying the selected profile's tracker, so it cannot save again. */
export function clearPlaytime(storage=deviceStorage(),scope='guest'){
  try{if(typeof storage?.removeItem!=='function')return false;const key=playtimeKey(scope);storage.removeItem(key);return storage.getItem(key)===null;}catch{return false;}
}
export function normalizePlaytimeSettings(value){
  return {reminders:typeof value?.reminders==='boolean'?value.reminders:PLAYTIME_DEFAULTS.reminders,intervalMinutes:PLAYTIME_INTERVALS.includes(value?.intervalMinutes)?value.intervalMinutes:PLAYTIME_DEFAULTS.intervalMinutes};
}
function normalizedRecord(value,day){
  if(!value||value.version!==1)return {version:1,totalMs:0,day,todayMs:0,settings:{...PLAYTIME_DEFAULTS}};
  const totalMs=finiteMs(value.totalMs),todayMs=value.day===day?Math.min(totalMs,finiteMs(value.todayMs)):0;
  return {version:1,totalMs,day,todayMs,settings:normalizePlaytimeSettings(value.settings)};
}

/**
 * Call tick(game.state, gameDelta) once per actual simulation frame. A background,
 * paused, ended or non-playing frame never earns time. Long wall-clock gaps are
 * refused; there is no offline catch-up. Session time starts anew for this tracker.
 */
export function createPlaytimeTracker({storage=deviceStorage(),scope='guest',now=()=>Date.now(),document:doc=globalThis.document,onReminder,persistEverySeconds=5}={}){
  const key=playtimeKey(scope),listeners=new Set();
  const persistEvery=Math.max(1000,Math.min(30000,Number.isFinite(persistEverySeconds)?persistEverySeconds*1000:5000));
  const today=()=>localDay(now())||localDay(Date.now());
  let available=Boolean(storage),record=normalizedRecord(null,today()),sessionMs=0,sinceSaveMs=0,dirty=false,destroyed=false,pending=null,delivered=false;
  let nextReminderMs=record.settings.intervalMinutes*60000,lastDisplayedSecond=-1;
  try{
    const raw=storage?.getItem(key);
    if(raw&&raw.length<=MAX_RECORD_LENGTH)record=normalizedRecord(JSON.parse(raw),today());
  }catch{available=false;}
  nextReminderMs=record.settings.intervalMinutes*60000;
  function ensureDay(){const day=today();if(day!==record.day){record.day=day;record.todayMs=0;dirty=true;}}
  function getSettings(){return {...record.settings};}
  function getSummary(){
    ensureDay();
    return {version:1,scope,totalSeconds:Math.floor(record.totalMs/1000),todaySeconds:Math.floor(record.todayMs/1000),sessionSeconds:Math.floor(sessionMs/1000),day:record.day,available,pendingSave:dirty,reminderPending:Boolean(pending),destroyed};
  }
  function notify(type){const event={type,summary:getSummary(),settings:getSettings()};for(const listener of listeners){try{listener(clone(event));}catch{}}}
  function flush(){
    if(destroyed||!dirty)return available;
    ensureDay();
    try{
      if(!storage)throw new Error('Device storage is unavailable.');
      storage.setItem(key,JSON.stringify({...record,totalMs:Math.round(record.totalMs),todayMs:Math.round(record.todayMs)}));
      available=true;dirty=false;sinceSaveMs=0;
    }catch{available=false;}
    return available;
  }
  function tick(state,dt,{hidden=doc?.hidden===true}={}){
    if(destroyed||hidden||!state||state.started!==true||state.scene!=='playing'||state.paused===true||state.ended===true||typeof dt!=='number'||!Number.isFinite(dt)||dt<=0||dt>.25)return false;
    ensureDay();
    const ms=dt*1000;
    record.totalMs=Math.min(MAX_MS,record.totalMs+ms);record.todayMs=Math.min(MAX_MS,record.todayMs+ms);sessionMs=Math.min(MAX_MS,sessionMs+ms);sinceSaveMs+=ms;dirty=true;
    if(sinceSaveMs>=persistEvery)flush();
    if(record.settings.reminders&&!pending&&sessionMs+.00001>=nextReminderMs){
      pending={version:1,sessionSeconds:Math.floor(sessionMs/1000),intervalMinutes:record.settings.intervalMinutes};delivered=false;
      nextReminderMs=sessionMs+record.settings.intervalMinutes*60000;
      if(typeof onReminder==='function'){
        delivered=true;try{onReminder({...pending});}catch{delivered=false;}
      }
      notify('reminder');
    }
    const second=Math.floor(sessionMs/1000);if(second!==lastDisplayedSecond){lastDisplayedSecond=second;notify('tick');}
    return true;
  }
  function updateSettings(patch={}){
    if(destroyed)return getSettings();
    const safe={};if(typeof patch.reminders==='boolean')safe.reminders=patch.reminders;if(PLAYTIME_INTERVALS.includes(patch.intervalMinutes))safe.intervalMinutes=patch.intervalMinutes;
    const next=normalizePlaytimeSettings({...record.settings,...safe});
    if(next.reminders===record.settings.reminders&&next.intervalMinutes===record.settings.intervalMinutes)return getSettings();
    record.settings=next;pending=null;delivered=false;nextReminderMs=sessionMs+next.intervalMinutes*60000;dirty=true;flush();notify('settings');return getSettings();
  }
  function consumeReminder(){if(!pending||delivered)return null;delivered=true;return {...pending};}
  function dismissReminder(){pending=null;delivered=false;nextReminderMs=sessionMs+record.settings.intervalMinutes*60000;if(!destroyed)notify('reminder-dismissed');}
  function resetSession(){if(destroyed)return;sessionMs=0;lastDisplayedSecond=-1;pending=null;delivered=false;nextReminderMs=record.settings.intervalMinutes*60000;notify('session');}
  function subscribe(listener){if(typeof listener!=='function'||destroyed)return()=>{};listeners.add(listener);return()=>listeners.delete(listener);}
  const visibility=()=>{if(doc?.hidden)flush();};
  const view=doc?.defaultView||globalThis.window;
  doc?.addEventListener?.('visibilitychange',visibility);view?.addEventListener?.('pagehide',flush);
  function destroy(){if(destroyed)return;flush();destroyed=true;listeners.clear();doc?.removeEventListener?.('visibilitychange',visibility);view?.removeEventListener?.('pagehide',flush);}
  return Object.freeze({tick,getSummary,getSettings,updateSettings,consumeReminder,dismissReminder,resetSession,flush,subscribe,destroy});
}

const WORDS=Object.freeze({
  de:{title:'Deine Zeit im Dojo',intro:'Seit Aktivierung dieses Zählers: Nur aktive Runden zählen. Menüs, Pausen und verborgene Tabs zählen nicht.',total:'Insgesamt',today:'Heute',session:'Diese Sitzung',played:'aktiv gespielt',device:'Nur auf diesem Gerät · für dieses Profil',unavailable:'Speicherung nicht verfügbar. Neue Spielzeit wird gerade nur in dieser offenen Sitzung gezählt.',toggle:'Sanfte Pausenerinnerung',toggleInfo:'Eine kleine Erinnerung nach aktiver Spielzeit. Du entscheidest selbst, ob du pausierst.',interval:'Erinnerungsabstand',minutes:'Minuten',local:'Dieser Zähler wird nicht mit anderen Geräten synchronisiert und verändert keine Belohnungen.',replay:'Ninja-Intro noch einmal ansehen',reminderTitle:'Ein Moment für dich?',reminderCopy:'Du hast in dieser Sitzung {minutes} Minuten aktiv gespielt. Eine kurze Pause kann guttun. Du entscheidest.',pause:'Pause machen',later:'Später erinnern',badge:'Aktive Spielzeit auf diesem Gerät'},
  en:{title:'Your time in the dojo',intro:'Since this counter was enabled: only active rounds count. Menus, pauses and hidden tabs do not.',total:'Total',today:'Today',session:'This session',played:'actively played',device:'Only on this device · for this profile',unavailable:'Storage is unavailable. New playtime is currently counted only in this open session.',toggle:'Gentle break reminder',toggleInfo:'A small reminder after active playtime. You decide whether to pause.',interval:'Reminder interval',minutes:'minutes',local:'This counter is not synced with other devices and does not change rewards.',replay:'Watch the ninja intro again',reminderTitle:'A moment for yourself?',reminderCopy:'You have actively played for {minutes} minutes in this session. A short break may feel good. You decide.',pause:'Take a break',later:'Remind me later',badge:'Active playtime on this device'}
});
const words=language=>WORDS[language==='en'?'en':'de'];
export function formatPlaytime(seconds,{language=getLanguage(),compact=false}={}){
  const safe=typeof seconds==='number'&&Number.isFinite(seconds)?Math.max(0,Math.floor(seconds)):0;
  const hours=Math.floor(safe/3600),minutes=Math.floor((safe%3600)/60),remaining=safe%60;
  if(compact)return hours?`${hours}:${String(minutes).padStart(2,'0')}:${String(remaining).padStart(2,'0')}`:`${minutes}:${String(remaining).padStart(2,'0')}`;
  return hours?`${hours} h ${minutes} min`:minutes?`${minutes} min ${remaining} s`:`${remaining} s`;
}
export function renderPlaytimeBadge(summary={}, {language=getLanguage()}={}){
  const copy=words(language),value=formatPlaytime(summary.totalSeconds,{language,compact:true});
  return `<span class="playtime-badge" translate="no" lang="${language==='en'?'en':'de'}" aria-label="${escape(copy.badge+': '+value)}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg><strong data-playtime-total>${value}</strong><small>${copy.played}</small></span>`;
}
export function renderPlaytimeSettings({summary={},settings=PLAYTIME_DEFAULTS,language=getLanguage(),replay=true}={}){
  const copy=words(language),safe=normalizePlaytimeSettings(settings);
  return `<section class="settings-section playtime-settings" translate="no" lang="${language==='en'?'en':'de'}"><span class="eyebrow">${copy.device}</span><h3>${copy.title}</h3><p>${copy.intro}</p><dl class="playtime-statistics">${[['total',summary.totalSeconds],['today',summary.todaySeconds],['session',summary.sessionSeconds]].map(([key,value])=>`<div><dt>${copy[key]}</dt><dd data-playtime-value="${key}">${formatPlaytime(value,{language})}</dd></div>`).join('')}</dl><label class="calm-toggle playtime-toggle"><input type="checkbox" data-playtime-reminders ${safe.reminders?'checked':''}><span><strong>${copy.toggle}</strong><small>${copy.toggleInfo}</small></span></label><label class="playtime-interval">${copy.interval}<select data-playtime-interval ${safe.reminders?'':'disabled'}>${PLAYTIME_INTERVALS.map(value=>`<option value="${value}" ${safe.intervalMinutes===value?'selected':''}>${value} ${copy.minutes}</option>`).join('')}</select></label><p class="playtime-local-note">${copy.local}</p><p class="playtime-storage-note" role="status" ${summary.available===false?'':'hidden'}>${copy.unavailable}</p>${replay?`<button type="button" class="btn ghost" data-playtime-action="replay-intro">${copy.replay} <svg class="playtime-replay-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z"/><path d="m10 8 6 4-6 4Z"/></svg></button>`:''}</section>`;
}
export function renderPlaytimeReminder(reminder={}, {language=getLanguage()}={}){
  const copy=words(language),minutes=Math.max(1,Math.floor((Number(reminder.sessionSeconds)||0)/60));
  return `<aside class="playtime-reminder" role="status" aria-live="polite" aria-atomic="true" translate="no" lang="${language==='en'?'en':'de'}"><span class="playtime-reminder-emblem" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg></span><div><span class="eyebrow">${copy.title}</span><p>${copy.reminderCopy.replace('{minutes}',String(minutes))}</p><div class="playtime-reminder-actions"><button type="button" class="btn primary" data-playtime-action="pause">${copy.pause}</button><button type="button" class="btn ghost" data-playtime-action="later">${copy.later}</button></div></div></aside>`;
}

/** Optional root-scoped settings controller. It never sends account settings. */
export function createPlaytimePanel({container,tracker,onReplayIntro}={}){
  if(!container||!tracker?.getSummary)throw new TypeError('A playtime panel needs a container and tracker.');
  let active=false,unsubscribe=()=>{},stopLanguage=()=>{};
  function render(){
    const focused=container.ownerDocument?.activeElement,wasToggle=focused?.hasAttribute?.('data-playtime-reminders'),wasInterval=focused?.hasAttribute?.('data-playtime-interval');
    container.innerHTML=renderPlaytimeSettings({summary:tracker.getSummary(),settings:tracker.getSettings(),replay:typeof onReplayIntro==='function'});
    (wasToggle?container.querySelector('[data-playtime-reminders]'):wasInterval?container.querySelector('[data-playtime-interval]'):null)?.focus({preventScroll:true});
  }
  function update(event){
    if(!active)return;
    if(event.type==='settings'){render();return;}
    const summary=event.summary;
    for(const [key,value]of [['total',summary.totalSeconds],['today',summary.todaySeconds],['session',summary.sessionSeconds]]){const el=container.querySelector(`[data-playtime-value="${key}"]`);if(el)el.textContent=formatPlaytime(value);}
    const storageNote=container.querySelector('.playtime-storage-note');if(storageNote)storageNote.hidden=summary.available!==false;
  }
  function change(event){if(event.target.hasAttribute?.('data-playtime-reminders'))tracker.updateSettings({reminders:event.target.checked===true});else if(event.target.hasAttribute?.('data-playtime-interval'))tracker.updateSettings({intervalMinutes:Number(event.target.value)});}
  function click(event){if(event.target.closest?.('[data-playtime-action="replay-intro"]')){event.preventDefault();onReplayIntro?.();}}
  function show(){if(!active){active=true;container.addEventListener('change',change);container.addEventListener('click',click);unsubscribe=tracker.subscribe(update);stopLanguage=onLanguageChange(render);}render();return controller;}
  function destroy(){if(!active)return;active=false;container.removeEventListener('change',change);container.removeEventListener('click',click);unsubscribe();stopLanguage();}
  const controller=Object.freeze({show,destroy});return controller;
}

/** A nonmodal reminder. It only pauses the actual game after the explicit button. */
export function createPlaytimeReminder({container,tracker,onPause=()=>{}}={}){
  if(!container||!tracker?.consumeReminder)throw new TypeError('A playtime reminder needs a container and tracker.');
  let active=false,reminder=null,stopLanguage=()=>{},stopTracker=()=>{};
  function render(){if(active&&reminder)container.innerHTML=renderPlaytimeReminder(reminder);}
  function hide(){if(!active)return;active=false;reminder=null;container.removeEventListener('click',click);stopLanguage();stopTracker();tracker.dismissReminder();container.replaceChildren();}
  function click(event){const action=event.target.closest?.('[data-playtime-action]')?.dataset.playtimeAction;if(!['pause','later'].includes(action))return;event.preventDefault();hide();if(action==='pause')onPause();}
  function show(value=tracker.consumeReminder()){if(!value)return false;reminder={...value};if(!active){active=true;container.addEventListener('click',click);stopLanguage=onLanguageChange(render);stopTracker=tracker.subscribe(event=>{if(event.type==='settings')hide();});}render();return true;}
  return Object.freeze({show,hide,destroy:hide,getState:()=>({active,reminder:reminder?{...reminder}:null})});
}
