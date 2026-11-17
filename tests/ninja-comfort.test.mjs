import test from 'node:test';
import assert from 'node:assert/strict';
import {COMFORT_KEY,COMFORT_DEFAULTS,getComfort,setComfort,normalizeComfort,applyComfort,onComfortChange,createComfortFeedback,comfortPanelMarkup} from '../notification-ninja/src/comfort.js';

const storage=()=>{const values=new Map();return {values,getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};};

test('comfort is device-only, opt-in and bounded without altering guest or account saves',()=>{
 const store=storage();store.setItem('notification-ninja:save:v1','existing guest');store.setItem('account-session','existing account');
 assert.deepEqual(getComfort(store),COMFORT_DEFAULTS);
 const result=setComfort({hand:'left',haptics:true,coins:999,password:'do not save',selectedSkin:'solar'},{storage:store,document:null});
 assert.deepEqual(result,{hand:'left',haptics:true});
 assert.deepEqual(JSON.parse(store.getItem(COMFORT_KEY)),result);
 assert.equal(store.getItem('notification-ninja:save:v1'),'existing guest');assert.equal(store.getItem('account-session'),'existing account');
 setComfort({hand:'invalid',haptics:'true'},{storage:store,document:null});assert.deepEqual(getComfort(store),result);
 assert.deepEqual(normalizeComfort({hand:'right',haptics:1,privateEmail:'unused'}),COMFORT_DEFAULTS);
});

test('blocked storage retains the current device session and does not leak into another storage',()=>{
 const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}},fresh=storage(),changes=[];
 const stop=onComfortChange(value=>changes.push(value));
 setComfort({hand:'left',haptics:true},{storage:blocked,document:null});stop();
 assert.deepEqual(getComfort(blocked),{hand:'left',haptics:true});assert.deepEqual(getComfort(fresh),COMFORT_DEFAULTS);assert.equal(changes.length,1);
 const copy=getComfort(blocked);copy.hand='right';assert.equal(getComfort(blocked).hand,'left');
});

test('malformed and oversized device storage falls back safely and applying a layout writes only datasets',()=>{
 for(const raw of ['not json','null','[]','{"hand":"left","haptics":"yes"}','x'.repeat(5000)]){
  const store=storage();store.setItem(COMFORT_KEY,raw);
  const prefs=getComfort(store);assert.equal(['right','left'].includes(prefs.hand),true);assert.equal(prefs.haptics,false);
 }
 const doc={documentElement:{dataset:{}},body:{dataset:{}}};
 assert.deepEqual(applyComfort({hand:'left',haptics:true},doc),{hand:'left',haptics:true});assert.equal(doc.body.dataset.comfortHand,'left');assert.equal(doc.documentElement.dataset.comfortHand,'left');
 assert.deepEqual(applyComfort({hand:'bad'},null),COMFORT_DEFAULTS);
});

function feedbackFixture({enabled=true,supported=true,reduced=false}={}){
 let tick=0,settings={hand:'right',haptics:enabled},reduce=reduced;
 const calls=[],events=new Map(),doc={hidden:false,addEventListener:(type,listener)=>events.set(type,listener),removeEventListener:(type,listener)=>{if(events.get(type)===listener)events.delete(type);}};
 const nav=supported?{vibrate:pattern=>{calls.push(pattern);return true;}}:{};
 const feedback=createComfortFeedback({navigator:nav,document:doc,matchMedia:()=>({matches:reduce}),getSettings:()=>settings,now:()=>tick});
 return {feedback,calls,events,doc,advance:value=>tick=value,settings:value=>settings=value,reduced:value=>reduce=value};
}

test('haptics stays off without explicit consent and never reacts to noncanonical or passive events',()=>{
 const f=feedbackFixture({enabled:false});
 assert.equal(f.feedback({type:'sliced',kind:'distraction'}),false);assert.deepEqual(f.calls,[]);
 f.settings({hand:'left',haptics:true});
 for(const event of [{type:'sliced',kind:'useful'},{type:'useful-passed'},{type:'coin-earned'},{type:'life-lost',reason:'invented'},null])assert.equal(f.feedback(event),false);
 assert.deepEqual(f.calls,[]);f.feedback.destroy();
});

test('actual cut, life loss and SUPER use short patterns and rapid events are throttled',()=>{
 const f=feedbackFixture();
 assert.equal(f.feedback({type:'sliced',kind:'distraction'}),true);assert.deepEqual(f.calls[0],[9]);
 f.advance(20);assert.equal(f.feedback({type:'super-used'}),false);
 f.advance(100);assert.equal(f.feedback({type:'life-lost',reason:'useful-cut'}),true);assert.deepEqual(f.calls[1],[14,26,9]);
 f.advance(200);assert.equal(f.feedback({type:'super-used'}),true);assert.deepEqual(f.calls[2],[12,16,12]);
 assert(f.calls.every(pattern=>pattern.reduce((sum,n)=>sum+n,0)<60));f.feedback.destroy();
});

test('hidden tab, pause, calm and OS reduced motion stop feedback; destroyed controllers remove their listener',()=>{
 const f=feedbackFixture();f.feedback({type:'super-used'});f.advance(5);f.doc.hidden=true;f.events.get('visibilitychange')();assert.equal(f.calls.at(-1),0);
 assert.equal(f.feedback({type:'sliced',kind:'distraction'}),false);
 f.doc.hidden=false;f.advance(100);assert.equal(f.feedback({type:'sliced',kind:'distraction'},{calmEffects:true}),false);
 f.reduced(true);assert.equal(f.feedback({type:'super-used'}),false);f.reduced(false);
 f.advance(200);assert.equal(f.feedback({type:'super-used'}),true);f.advance(205);assert.equal(f.feedback({type:'paused'}),false);assert.equal(f.calls.at(-1),0);
 f.feedback.destroy();assert.equal(f.events.size,0);f.advance(400);assert.equal(f.feedback({type:'super-used'}),false);
 const unavailable=feedbackFixture({supported:false});assert.equal(unavailable.feedback({type:'super-used'}),false);assert.deepEqual(unavailable.calls,[]);unavailable.feedback.destroy();
});

test('a platform vibration rejection or exception cannot interrupt the game',()=>{
 for(const vibrate of [()=>false,()=>{throw Error('unsupported');}]){
  const feedback=createComfortFeedback({navigator:{vibrate},document:null,matchMedia:null,getSettings:()=>({haptics:true}),now:()=>1});
  assert.equal(feedback({type:'super-used'}),false);feedback.destroy();
 }
});

test('comfort UI exposes real hand controls and honest unsupported haptics copy in both languages',()=>{
 const de=comfortPanelMarkup({language:'de',value:{hand:'left',haptics:false},supported:false});
 assert.match(de,/data-comfort-hand="left" aria-pressed="true"/);assert.match(de,/id="comfort-haptics"[^>]+disabled/);assert.match(de,/Dieser Browser bietet keine Haptik/);
 const en=comfortPanelMarkup({language:'en',value:{hand:'right',haptics:true},supported:true});
 assert.match(en,/Right-handed/);assert.match(en,/Saved only on this device/);assert.match(en,/id="comfort-haptics"[^>]+checked/);assert.doesNotMatch(en,/data-setting-toggle|data-account|data-setting-range/,'device comfort does not accidentally enter account-setting handlers');
});
