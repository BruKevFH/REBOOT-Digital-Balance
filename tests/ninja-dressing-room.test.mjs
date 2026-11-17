import test from 'node:test';
import assert from 'node:assert/strict';
import {SKINS} from '../notification-ninja/src/game.js';
import {createDressingModel,createPreviewAnimator} from '../notification-ninja/src/dressing-room.js';
import {tr,setLanguage,getMissingTranslations} from '../notification-ninja/src/i18n.js';

const deepFreeze=value=>{if(value&&typeof value==='object'){for(const part of Object.values(value))deepFreeze(part);Object.freeze(value);}return value;};

test('all twelve preview names and unlock descriptions support English and restore their German source',()=>{
 try{
  setLanguage('en');
  for(const skin of SKINS){assert.ok(tr(skin.name));if(skin.description)assert.notEqual(tr(skin.description),skin.description);}
  assert.equal(tr(SKINS.find(skin=>skin.id==='focus-fox').name),'Focus Fox');
  assert.equal(tr(SKINS.find(skin=>skin.id==='night-guardian').name),'Night Guardian');
  assert.deepEqual(getMissingTranslations(),[]);
 }finally{setLanguage('de');}
 for(const skin of SKINS)assert.equal(tr(skin.name),skin.name);
});

function scheduler(){
 let id=0,now=0;const queued=new Map(),cancelled=[];
 return {requestFrame:callback=>{queued.set(++id,callback);return id;},cancelFrame:value=>{cancelled.push(value);queued.delete(value);},now:()=>now,
  advance(stamp){now=stamp;const work=[...queued.values()];queued.clear();for(const callback of work)callback(stamp);},queued,cancelled};
}

test('trying every canonical outfit never changes a frozen profile or grants an unowned look',()=>{
 const profile=deepFreeze({coins:137,selectedSkin:'default',unlockedSkins:['default','mint'],stats:{correct:61,superUses:2},totalRuns:3});
 const before=JSON.stringify(profile),model=createDressingModel(profile,'solar');
 assert.equal(model.getState().skinId,'solar');assert.equal(model.getState().owned,false);assert.equal(model.getState().equipped,false);
 for(const skin of SKINS){assert.equal(model.select(skin.id),true);const state=model.getState();assert.equal(state.skinId,skin.id);assert.equal(state.owned,['default','mint'].includes(skin.id));assert.equal(state.equipped,skin.id==='default');}
 assert.equal(model.getState().total,12);
 assert.equal(JSON.stringify(profile),before);
 assert.equal(model.select('<script>'),false);assert.equal(model.setContext('server-admin'),false);
 assert.equal(model.getState().skinId,SKINS.at(-1).id);
});

test('preview identity and next/previous controls stay canonical and wrap all twelve looks',()=>{
 const model=createDressingModel({selectedSkin:'mint',unlockedSkins:['default','mint']},'unknown');
 assert.equal(model.getState().skinId,'mint');
 model.select('default');model.step(-1);assert.equal(model.getState().skinId,SKINS.at(-1).id);model.step(1);assert.equal(model.getState().skinId,'default');
 assert.equal(model.step(8),false);
 for(const context of ['study','gaming','sleep']){assert.equal(model.setContext(context),true);assert.equal(model.getState().context,context);}
 const detached=model.getState();detached.skin.name='invented';assert.equal(model.getState().skin.name,SKINS[0].name);
});

test('preview requirements are derived from real cumulative progress without treating it as ownership',()=>{
 const model=createDressingModel({stats:{correct:180,superUses:3},totalRuns:4,unlockedSkins:['default']},'night-guardian');
 assert.equal(model.getState().correct,180);assert.equal(model.getState().owned,false,'Only actual inventory establishes ownership');
 assert.equal(model.getState().xp,1030);
 model.select('dawn');assert.equal(model.getState().rank.xp,350);assert.equal(model.getState().rank.id,'dawn');
 const malformed=createDressingModel({selectedSkin:'solar',stats:{correct:NaN,superUses:-9},unlockedSkins:['bogus']});
 assert.equal(malformed.getState().skinId,'default');assert.equal(malformed.getState().correct,0);assert.equal(malformed.getState().xp,0);
});

test('preview scheduling caps frames to thirty per second and cancels every frame on destroy',()=>{
 const clock=scheduler(),times=[];const loop=createPreviewAnimator({render:time=>times.push(time),...clock});
 loop.refresh();loop.setEnabled(true);
 for(let time=0;time<=1000;time+=10)clock.advance(time);
 assert(times.length<=32,'A fast display must not start a sixty/hundred fps preview');
 assert(times.length>=29,'The animation still advances smoothly near thirty fps');
 assert.equal(clock.queued.size,1);
 const count=loop.getState().renderedFrames;loop.destroy();assert.equal(clock.queued.size,0);assert.equal(loop.getState().disposed,true);
 clock.advance(2000);loop.refresh();loop.setEnabled(true);assert.equal(loop.getState().renderedFrames,count);assert.equal(times.length,count);assert.equal(clock.queued.size,0);
});

test('hidden/calm suspension stops frames and does not fast-forward preview time on resume',()=>{
 const clock=scheduler(),times=[];const loop=createPreviewAnimator({render:time=>times.push(time),...clock});
 loop.setEnabled(true);clock.advance(0);clock.advance(40);clock.advance(80);
 loop.setEnabled(false);const before=loop.getState();assert.equal(clock.queued.size,0);
 clock.advance(30000);assert.equal(loop.getState().renderedFrames,before.renderedFrames);
 loop.setEnabled(true);clock.advance(30000);assert.equal(times.at(-1),before.elapsed,'Invisible time does not become an animation leap');
 clock.advance(30040);assert(times.at(-1)>before.elapsed&&times.at(-1)<before.elapsed+.1);
 loop.setEnabled(false);const calmCount=loop.getState().renderedFrames;loop.refresh();assert.equal(loop.getState().renderedFrames,calmCount+1,'One intentional static redraw is available without a loop');assert.equal(clock.queued.size,0);loop.destroy();
});

test('a preview can destroy itself during rendering without scheduling a hidden successor',()=>{
 const clock=scheduler();let loop;loop=createPreviewAnimator({render:()=>loop.destroy(),...clock});
 loop.setEnabled(true);clock.advance(0);assert.equal(clock.queued.size,0);assert.equal(loop.getState().disposed,true);assert.equal(loop.getState().animationRunning,false);
});
