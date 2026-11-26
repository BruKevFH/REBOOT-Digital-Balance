import test from 'node:test';
import assert from 'node:assert/strict';
import {createPlaytimeTracker,playtimeKey,clearPlaytime,PLAYTIME_DEFAULTS,formatPlaytime,renderPlaytimeBadge,renderPlaytimeSettings,renderPlaytimeReminder} from '../notification-ninja/src/playtime.js';

const playing=Object.freeze({started:true,scene:'playing',paused:false,ended:false,coins:17});
function store(){const values=new Map(),writes=[];return {values,writes,getItem:key=>values.get(key)??null,setItem:(key,value)=>{writes.push({key,value});values.set(key,String(value));},removeItem:key=>values.delete(key)};}
function run(tracker,seconds,state=playing){for(let i=0;i<Math.round(seconds*4);i++)assert.equal(tracker.tick(state,.25,{hidden:false}),true);}

test('playtime counts only foreground active simulation frames and never changes the game',()=>{
  const storage=store(),tracker=createPlaytimeTracker({storage,document:null});
  for(const state of [{...playing,started:false},{...playing,scene:'briefing'},{...playing,paused:true},{...playing,ended:true},null])assert.equal(tracker.tick(state,.05),false);
  assert.equal(tracker.tick(playing,.05,{hidden:true}),false);
  for(const dt of [0,-.1,.251,1,Infinity,NaN,'0.1',null])assert.equal(tracker.tick(playing,dt,{hidden:false}),false);
  for(let i=0;i<60;i++)tracker.tick(playing,.01667,{hidden:false});
  assert.equal(tracker.getSummary().totalSeconds,1);assert.equal(tracker.getSummary().sessionSeconds,1);
  assert.deepEqual(playing,{started:true,scene:'playing',paused:false,ended:false,coins:17});tracker.destroy();
});

test('lifetime and current day survive reload while a new visit starts a fresh session',()=>{
  const storage=store();storage.setItem('notification-ninja:save:v1','original-guest-profile');
  let clock=new Date(2026,10,17,12).getTime();
  const first=createPlaytimeTracker({storage,scope:'account-a',now:()=>clock,document:null});run(first,6);first.destroy();
  const second=createPlaytimeTracker({storage,scope:'account-a',now:()=>clock,document:null});
  assert.equal(second.getSummary().totalSeconds,6);assert.equal(second.getSummary().todaySeconds,6);assert.equal(second.getSummary().sessionSeconds,0);
  clock+=86400000;assert.equal(second.getSummary().todaySeconds,0);assert.equal(second.getSummary().totalSeconds,6);
  run(second,3);second.flush();assert.equal(second.getSummary().totalSeconds,9);assert.equal(second.getSummary().todaySeconds,3);assert.equal(second.getSummary().sessionSeconds,3);
  assert.equal(storage.getItem('notification-ninja:save:v1'),'original-guest-profile');
  const saved=JSON.parse(storage.getItem(playtimeKey('account-a')));assert.deepEqual(Object.keys(saved).sort(),['day','settings','todayMs','totalMs','version']);second.destroy();
});

test('guest and individual account time stay isolated and bounded scopes cannot collide',()=>{
  const storage=store();
  for(const [scope,seconds]of [['guest',3],['account-a',7],['account-b',11]]){const tracker=createPlaytimeTracker({storage,scope,document:null});run(tracker,seconds);tracker.destroy();}
  for(const [scope,seconds]of [['guest',3],['account-a',7],['account-b',11]]){const tracker=createPlaytimeTracker({storage,scope,document:null});assert.equal(tracker.getSummary().totalSeconds,seconds);tracker.destroy();}
  assert.notEqual(playtimeKey('account:a'),playtimeKey('account/a'));
  for(const scope of [null,'',' '.repeat(3),'a'.repeat(201),'bad\nname'])assert.throws(()=>playtimeKey(scope),/scope/);
});

test('deleting one profile time removes only its own scope and reports blocked deletion honestly',()=>{
  const storage=store();storage.setItem('game-profile','preserved');
  for(const scope of ['guest','account-a','account-b']){const tracker=createPlaytimeTracker({storage,scope,document:null});run(tracker,2);tracker.destroy();}
  assert.equal(clearPlaytime(storage,'account-a'),true);assert.equal(storage.getItem(playtimeKey('account-a')),null);
  assert(storage.getItem(playtimeKey('guest')));assert(storage.getItem(playtimeKey('account-b')));assert.equal(storage.getItem('game-profile'),'preserved');
  assert.equal(clearPlaytime({removeItem(){throw Error('blocked');}},'guest'),false);
});

test('playtime persists periodically rather than writing every animation frame',()=>{
  const storage=store(),tracker=createPlaytimeTracker({storage,document:null});
  for(let i=0;i<2000;i++)tracker.tick(playing,.05,{hidden:false});
  assert.equal(tracker.getSummary().totalSeconds,100);assert.equal(storage.writes.length,20);
  const before=storage.writes.length;tracker.getSummary();tracker.getSettings();assert.equal(storage.writes.length,before);tracker.destroy();
});

test('a reminder waits for actual active minutes, delivers once, and never pauses a run itself',()=>{
  const tracker=createPlaytimeTracker({storage:store(),document:null});tracker.updateSettings({intervalMinutes:10});
  run(tracker,599.75);assert.equal(tracker.consumeReminder(),null);
  tracker.tick(playing,.25,{hidden:false});const reminder=tracker.consumeReminder();assert.deepEqual(reminder,{version:1,sessionSeconds:600,intervalMinutes:10});assert.equal(tracker.consumeReminder(),null);
  run(tracker,900);assert.equal(tracker.consumeReminder(),null,'An open reminder never stacks a second banner');
  tracker.dismissReminder();run(tracker,599.75);assert.equal(tracker.consumeReminder(),null);tracker.tick(playing,.25,{hidden:false});assert.equal(tracker.consumeReminder().sessionSeconds,2100);
  assert.equal(playing.paused,false);tracker.destroy();
});

test('reminder callbacks and polling do not double-deliver, and opt-out clears a pending reminder',()=>{
  const reminders=[],tracker=createPlaytimeTracker({storage:store(),document:null,onReminder:value=>reminders.push(value)});
  run(tracker,899.75);assert.equal(reminders.length,0);tracker.tick(playing,.25,{hidden:false});assert.equal(reminders.length,1);assert.equal(tracker.consumeReminder(),null);
  tracker.updateSettings({reminders:false});assert.equal(tracker.getSummary().reminderPending,false);run(tracker,1800);assert.equal(reminders.length,1);
  tracker.updateSettings({reminders:true,intervalMinutes:20});run(tracker,1199.75);assert.equal(reminders.length,1);tracker.tick(playing,.25,{hidden:false});assert.equal(reminders.length,2);
  tracker.resetSession();assert.equal(tracker.getSummary().sessionSeconds,0);assert.equal(tracker.getSummary().totalSeconds,3900);assert.equal(tracker.getSummary().reminderPending,false);tracker.destroy();
});

test('settings retain only supported local values and survive without touching a player save',()=>{
  const storage=store();storage.setItem('account-profile','unchanged');
  const tracker=createPlaytimeTracker({storage,document:null});
  tracker.updateSettings({reminders:false,intervalMinutes:30,password:'not-saved',coins:999});tracker.updateSettings({reminders:'yes',intervalMinutes:13});
  assert.deepEqual(tracker.getSettings(),{reminders:false,intervalMinutes:30});tracker.destroy();
  const reloaded=createPlaytimeTracker({storage,document:null});assert.deepEqual(reloaded.getSettings(),{reminders:false,intervalMinutes:30});assert.equal(storage.getItem('account-profile'),'unchanged');
  assert.equal(storage.getItem(playtimeKey()).includes('not-saved'),false);reloaded.destroy();
});

test('malformed and oversized records are ignored, and a blocked write is honestly session-only',()=>{
  for(const raw of ['bad JSON','x'.repeat(4097),JSON.stringify({version:2,totalMs:999999}),JSON.stringify({version:1,totalMs:-100,todayMs:NaN,settings:{intervalMinutes:99}})]){
    const storage=store();storage.setItem(playtimeKey(),raw);const tracker=createPlaytimeTracker({storage,document:null});assert.equal(tracker.getSummary().totalSeconds,0);assert.deepEqual(tracker.getSettings(),PLAYTIME_DEFAULTS);tracker.destroy();
  }
  const blocked={getItem:()=>null,setItem:()=>{throw new Error('quota');}};
  const tracker=createPlaytimeTracker({storage:blocked,document:null});run(tracker,6);assert.equal(tracker.getSummary().totalSeconds,6);assert.equal(tracker.getSummary().available,false);assert.equal(tracker.flush(),false);
  assert.doesNotThrow(()=>tracker.destroy());assert.equal(createPlaytimeTracker({storage:blocked,document:null}).getSummary().totalSeconds,0);
});

test('visibility and pagehide flush pending time, while destroy removes handlers and stops counting',()=>{
  const storage=store(),events=new Map(),windowEvents=new Map();
  const doc={hidden:false,addEventListener:(name,fn)=>events.set(name,fn),removeEventListener:(name,fn)=>{if(events.get(name)===fn)events.delete(name);},defaultView:{addEventListener:(name,fn)=>windowEvents.set(name,fn),removeEventListener:(name,fn)=>{if(windowEvents.get(name)===fn)windowEvents.delete(name);}}};
  const tracker=createPlaytimeTracker({storage,document:doc});run(tracker,1);assert.equal(storage.writes.length,0);doc.hidden=true;events.get('visibilitychange')();assert.equal(storage.writes.length,1);assert.equal(tracker.tick(playing,.25),false);
  doc.hidden=false;run(tracker,1);windowEvents.get('pagehide')();assert.equal(storage.writes.length,2);tracker.destroy();assert.equal(events.size,0);assert.equal(windowEvents.size,0);assert.equal(tracker.tick(playing,.25),false);assert.equal(tracker.getSummary().totalSeconds,2);
});

test('bilingual time surfaces are bounded, nonmodal and do not offer game rewards',()=>{
  assert.equal(formatPlaytime(3665,{compact:true}),'1:01:05');assert.equal(formatPlaytime(65,{compact:true}),'1:05');assert.equal(formatPlaytime(Infinity),'0 s');
  for(const language of ['de','en']){
    const settings=renderPlaytimeSettings({summary:{totalSeconds:70,todaySeconds:20,sessionSeconds:5,available:false},language});assert.match(settings,/translate="no"/);assert.match(settings,/data-playtime-reminders/);assert.match(settings,/data-playtime-interval/);assert.match(settings,language==='de'?/Deine Zeit im Dojo/:/Your time in the dojo/);
    const reminder=renderPlaytimeReminder({sessionSeconds:900},{language});assert.match(reminder,/role="status"/);assert.doesNotMatch(reminder,/aria-modal/);assert.match(reminder,/data-playtime-action="pause"/);assert.match(reminder,/data-playtime-action="later"/);
    const badge=renderPlaytimeBadge({totalSeconds:'<script>'},{language});assert.match(badge,/>0:00</);assert.doesNotMatch(badge,/<script>/);
  }
});

test('sequential play in two open tabs merges new time instead of overwriting the other tab',()=>{
  const storage=store(),a=createPlaytimeTracker({storage,document:null});run(a,3);a.flush();
  const b=createPlaytimeTracker({storage,document:null});run(b,2);b.flush();assert.equal(b.getSummary().totalSeconds,5);
  run(a,2);a.flush();assert.equal(a.getSummary().totalSeconds,7,'An older tab adds only its two new seconds to the latest five');
  run(b,1);b.destroy();a.destroy();const restored=createPlaytimeTracker({storage,document:null});
  assert.equal(restored.getSummary().totalSeconds,8);assert.equal(restored.getSummary().todaySeconds,8);restored.destroy();
});

test('time-only writes preserve another tab settings and explicit setting patches do not reset unrelated choices',()=>{
  const storage=store(),a=createPlaytimeTracker({storage,document:null}),b=createPlaytimeTracker({storage,document:null});
  b.updateSettings({reminders:false,intervalMinutes:30});run(a,2);a.flush();
  assert.deepEqual(a.getSettings(),{reminders:false,intervalMinutes:30});
  const old=createPlaytimeTracker({storage,document:null});b.updateSettings({reminders:true});old.updateSettings({intervalMinutes:10});
  assert.deepEqual(old.getSettings(),{reminders:true,intervalMinutes:10});
  for(const tracker of [a,b,old])tracker.destroy();
});

test('cross-tab playtime merges keep yesterday pending time out of the current day',()=>{
  const storage=store();let stamp=new Date(2026,10,25,23,59).getTime();
  const a=createPlaytimeTracker({storage,now:()=>stamp,document:null});run(a,3);
  stamp+=120000;const b=createPlaytimeTracker({storage,now:()=>stamp,document:null});run(b,2);b.flush();
  run(a,2);a.flush();assert.equal(a.getSummary().totalSeconds,7);assert.equal(a.getSummary().todaySeconds,4);
  a.destroy();b.destroy();
});

test('storage events refresh counters and reminder settings while retaining only this tab pending time',()=>{
  const storage=store(),handlers=new Map(),doc={defaultView:{addEventListener:(name,fn)=>handlers.set(name,fn),removeEventListener:(name,fn)=>handlers.get(name)===fn&&handlers.delete(name)}};
  const a=createPlaytimeTracker({storage,document:doc}),b=createPlaytimeTracker({storage,document:null});run(a,1);run(b,2);b.flush();
  const events=[];a.subscribe(event=>events.push(event));handlers.get('storage')({key:playtimeKey(),storageArea:storage});
  assert.equal(a.getSummary().totalSeconds,3);assert.equal(a.getSummary().sessionSeconds,1);
  b.updateSettings({reminders:false,intervalMinutes:20});handlers.get('storage')({key:playtimeKey(),storageArea:storage});
  assert.deepEqual(a.getSettings(),{reminders:false,intervalMinutes:20});assert.equal(events.at(-1).type,'settings');
  a.flush();assert.equal(a.getSummary().totalSeconds,3);a.destroy();b.destroy();assert.equal(handlers.size,0);
});
