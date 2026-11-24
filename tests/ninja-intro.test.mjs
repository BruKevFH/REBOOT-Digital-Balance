import test from 'node:test';
import assert from 'node:assert/strict';
import {CONTENT} from '../notification-ninja/src/game.js';
import {INTRO_STEPS,INTRO_DURATION,INTRO_STORAGE_PREFIX,createNinjaIntroModel,readNinjaIntro,shouldShowNinjaIntro,markNinjaIntroSeen,resetNinjaIntro} from '../notification-ninja/src/ninja-intro.js';

const store=()=>{const data=new Map();return {data,getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,String(value)),removeItem:key=>data.delete(key)};};

test('the bilingual ninja story lasts twenty seconds and teaches canonical helpful and distracting signals',()=>{
  assert.equal(INTRO_STEPS.length,4);assert.equal(INTRO_DURATION,20);
  assert.deepEqual(INTRO_STEPS.map(step=>step.context),['study','study','gaming','sleep']);
  for(const step of INTRO_STEPS){
    assert(Object.isFrozen(step));assert(Object.isFrozen(step.de));assert(Object.isFrozen(step.signals));
    for(const language of ['de','en'])for(const field of ['title','line','rule','chapter','keep','slice'])assert(step[language][field].length>5);
    assert.notEqual(step.de.line,step.en.line);
    assert.equal(CONTENT.find(item=>item.id===step.signals[0]).kindByContext[step.context],'useful');
    assert.equal(CONTENT.find(item=>item.id===step.signals[1]).kindByContext[step.context],'distraction');
  }
});

test('a presentation advances all four scenes and finishes once, without any scored run state',()=>{
  const model=createNinjaIntroModel();assert.equal(model.getState().playing,false);model.play();
  const visited=new Set();
  for(let index=0;index<401;index++){visited.add(model.getState().step);model.advance(.05);}
  assert.deepEqual([...visited],[0,1,2,3]);const finished=model.getState();
  assert.equal(finished.elapsed,20);assert.equal(finished.finished,true);assert.equal(finished.playing,false);assert.equal(finished.progress,1);
  model.advance(.05);assert.deepEqual(model.getState(),finished);assert.equal(model.play(),false);
  assert.equal('coins' in finished,false);assert.equal('score' in finished,false);assert.equal('profile' in finished,false);
  model.restart();assert.equal(model.getState().elapsed,0);assert.equal(model.getState().playing,true);
});

test('pause, hidden documents and malformed frame deltas cannot consume the introduction',()=>{
  const model=createNinjaIntroModel();model.play();model.advance(.05);const before=model.getState();
  for(const dt of [NaN,Infinity,-5,'1',null])model.advance(dt);
  model.advance(.05,{hidden:true});assert.deepEqual(model.getState(),before);
  model.pause();const paused=model.getState();for(let i=0;i<100;i++)model.advance(.05);assert.deepEqual(model.getState(),paused);
  model.play();model.advance(500);assert(Math.abs(model.getState().elapsed-before.elapsed-.1)<1e-8,'A background/slow-frame jump is bounded');
  assert.equal(model.seekStep(7),false);assert.equal(model.seekStep(1.5),false);assert.equal(model.seekStep(-1),false);
});

test('reduced motion is a manual four-scene story and a live preference change stops motion',()=>{
  const quiet=createNinjaIntroModel({reducedMotion:true});assert.equal(quiet.play(),false);
  for(let i=0;i<50;i++)quiet.advance(.1);assert.equal(quiet.getState().elapsed,0);
  for(let index=1;index<4;index++){quiet.next();assert.equal(quiet.getState().step,index);assert.equal(quiet.getState().finished,false);}
  quiet.next();assert.equal(quiet.getState().finished,true);
  const moving=createNinjaIntroModel();moving.play();moving.seekStep(2);moving.advance(.05);const elapsed=moving.getState().elapsed;
  moving.setReducedMotion(true);moving.advance(.1);assert.equal(moving.getState().elapsed,elapsed);assert.equal(moving.getState().playing,false);
  moving.setReducedMotion(false);assert.equal(moving.getState().playing,false,'Disabling reduced motion does not silently resume animation');assert.equal(moving.play(),true);
});

test('intro acknowledgments stay separate for guests and accounts and never alter existing gameplay saves',()=>{
  const storage=store();storage.setItem('notification-ninja:save:v1','original guest progress');storage.setItem('notification-ninja:account:alpha','original account progress');
  for(const scope of ['guest','account-alpha','account-beta'])assert.equal(shouldShowNinjaIntro(storage,scope),true);
  assert.equal(markNinjaIntroSeen(storage,'account-alpha'),true);assert.equal(shouldShowNinjaIntro(storage,'account-alpha'),false);
  assert.equal(shouldShowNinjaIntro(storage,'guest'),true);assert.equal(shouldShowNinjaIntro(storage,'account-beta'),true);
  markNinjaIntroSeen(storage,'guest');resetNinjaIntro(storage,'account-alpha');assert.equal(shouldShowNinjaIntro(storage,'account-alpha'),true);assert.equal(shouldShowNinjaIntro(storage,'guest'),false);
  assert.equal(storage.getItem('notification-ninja:save:v1'),'original guest progress');assert.equal(storage.getItem('notification-ninja:account:alpha'),'original account progress');
  assert.deepEqual(JSON.parse(storage.getItem(INTRO_STORAGE_PREFIX+'guest')),{version:1,seen:true});
});

test('corrupt or blocked preference storage never prevents viewing or skipping the story',()=>{
  for(const value of ['broken',JSON.stringify({version:2,seen:true}),JSON.stringify({version:1,seen:'true'}),'x'.repeat(2048)]){
    const storage=store();storage.setItem(INTRO_STORAGE_PREFIX+'guest',value);assert.equal(shouldShowNinjaIntro(storage),true);
  }
  const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');},removeItem(){throw Error('blocked');}};
  assert.deepEqual(readNinjaIntro(blocked),{seen:false,available:false});assert.equal(markNinjaIntroSeen(blocked),false);
  assert.deepEqual(readNinjaIntro(blocked),{seen:true,available:false},'A blocked write still suppresses repeat intros in the open session');
  assert.equal(resetNinjaIntro(blocked),false);assert.equal(shouldShowNinjaIntro(blocked),true);
});
