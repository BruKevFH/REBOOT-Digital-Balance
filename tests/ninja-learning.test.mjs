import test from 'node:test';
import assert from 'node:assert/strict';
import {CONTENT,NinjaGame,STORAGE_KEY} from '../notification-ninja/src/game.js';
import {SENSEI_SCENARIOS,learningStorageKey,readLearningProgress,clearLearningProgress,createSenseiTrialsModel,createSenseiTrials} from '../notification-ninja/src/sensei-trials.js';
import {getCodexEntries,createNotificationCodexModel,createNotificationCodex} from '../notification-ninja/src/notification-codex.js';
import {setLanguage,getLanguage} from '../notification-ninja/src/i18n.js';

function storage(){
 const values=new Map(),writes=[],removed=[];
 return {values,writes,removed,getItem:key=>values.get(key)??null,setItem(key,value){values.set(key,value);writes.push(key);},removeItem(key){values.delete(key);removed.push(key);}};
}
const solve=(model,id)=>{assert.equal(model.select(id),true);return model.choose(model.getState().scenario.correct);};

test('twelve distinct bilingual learning decisions cover all three contexts and real game signals',()=>{
 assert.equal(SENSEI_SCENARIOS.length,12);assert.equal(new Set(SENSEI_SCENARIOS.map(s=>s.id)).size,12);
 for(const context of ['study','gaming','sleep'])assert.equal(SENSEI_SCENARIOS.filter(s=>s.context===context).length,4);
 assert.deepEqual([...new Set(SENSEI_SCENARIOS.map(s=>s.correct))].sort(),[0,1,2]);
 for(const scenario of SENSEI_SCENARIOS){
  assert(CONTENT.some(item=>item.id===scenario.contentId));assert(Object.isFrozen(scenario));
  for(const language of ['de','en']){
   const copy=scenario[language];assert.equal(copy.answers.length,3);assert.equal(new Set(copy.answers).size,3);
   for(const key of ['title','goal','story','explanation','takeaway','reconsider'])assert.equal(typeof copy[key],'string',`${scenario.id}/${language}/${key}`);
   assert(copy.explanation.length>45);assert(copy.reconsider.length>45);assert(copy.answers.every(answer=>answer.length>20));
  }
  assert.notEqual(scenario.de.title,scenario.en.title);assert(Object.isFrozen(scenario.en.answers));
 }
});

test('a wrong answer cannot complete or skip a learning moment; retry allows a considered choice',()=>{
 const store=storage(),model=createSenseiTrialsModel({storage:store}),first=model.getState().scenario;
 for(const invalid of [-1,3,NaN,1.5,'1',null])assert.deepEqual(model.choose(invalid),{ok:false});
 assert.equal(model.next(),false);assert.equal(model.finish(),false);
 const wrong=model.choose((first.correct+1)%3);assert.equal(wrong.ok,true);assert.equal(wrong.correct,false);assert.equal(wrong.earned,false);
 assert.deepEqual(model.getState().completed,[]);assert.equal(model.getState().canAdvance,false);assert.equal(store.writes.length,0);
 assert.equal(model.choose(first.correct).ok,false,'the wrong-choice explanation must be acknowledged before retrying');assert.equal(model.next(),false);
 assert.equal(model.retry(),true);assert.equal(model.getState().answered,false);assert.equal(model.getState().selectedChoice,null);
 const correct=model.choose(first.correct);assert.equal(correct.correct,true);assert.equal(correct.earned,true);assert.equal(model.getState().completeCount,1);assert.equal(model.retry(),false);
 assert.equal(model.getState().ranked,false);assert.equal(model.getState().rewards,false);assert.equal(model.next(),true);assert.notEqual(model.getState().scenarioId,first.id);
});

test('correct completion is idempotent across repeated choices, revisits and a reload',()=>{
 const store=storage(),model=createSenseiTrialsModel({storage:store}),id=SENSEI_SCENARIOS[0].id;
 assert.equal(solve(model,id).earned,true);assert.equal(model.choose(model.getState().scenario.correct).ok,false);
 assert.equal(solve(model,id).earned,false);assert.equal(store.writes.length,1);assert.equal(model.getState().completeCount,1);
 const reloaded=createSenseiTrialsModel({storage:store});assert.deepEqual(reloaded.getState().completed,[id]);assert.equal(solve(reloaded,id).earned,false);assert.equal(store.writes.length,1);
 const state=reloaded.getState();state.completed.push('forged');state.scenario.correct=99;state.scenario.de.answers[0]='changed';state.feedback.correct=false;
 assert.deepEqual(reloaded.getState().completed,[id]);assert.notEqual(reloaded.getState().scenario.correct,99);assert.equal(reloaded.getState().feedback.correct,true);
 assert.deepEqual(Object.keys(JSON.parse(store.getItem(learningStorageKey('guest')))).sort(),['completed','version'],'the journal contains no identity, answer history or game wallet');
});

test('all twelve real decisions are required for completion and navigation stays in known scenarios',()=>{
 const model=createSenseiTrialsModel({storage:storage()});assert.equal(model.select('made-up'),false);assert.equal(model.setContext('master'),false);
 assert.equal(model.setContext('gaming'),true);assert.equal(model.getState().context,'gaming');
 for(const scenario of SENSEI_SCENARIOS){assert.equal(solve(model,scenario.id).correct,true);if(model.getState().completeCount<12)assert.equal(model.finish(),false);}
 assert.equal(model.getState().completeCount,12);assert.equal(model.next(),true);assert.equal(model.getState().finished,true);assert.equal(model.choose(0).ok,false);
 assert.equal(model.select(SENSEI_SCENARIOS[0].id),true);assert.equal(model.getState().finished,false);assert.equal(model.finish(),true);
});

test('guest and two account journals stay separate; resetting one preserves real game saves and other scopes',()=>{
 const store=storage(),game=new NinjaGame({storage:store,now:()=>1700000000000});
 game.profile.coins=321;game.profile.unlockedSkins.push('solar');game.profile.selectedSkin='solar';assert.equal(game.save().ok,true);
 const originalSave=store.getItem(STORAGE_KEY),originalProfile=structuredClone(game.profile);
 store.setItem('account-session','existing synthetic session');
 const guest=createSenseiTrialsModel({storage:store,scope:'guest'}),a=createSenseiTrialsModel({storage:store,scope:'account-a'}),b=createSenseiTrialsModel({storage:store,scope:'account-b'});
 solve(guest,'study-streak');solve(a,'gaming-team');solve(b,'sleep-autoplay');
 assert.deepEqual(readLearningProgress(store,'guest').completed,['study-streak']);assert.deepEqual(readLearningProgress(store,'account-a').completed,['gaming-team']);assert.deepEqual(readLearningProgress(store,'account-b').completed,['sleep-autoplay']);
 assert.equal(a.reset(),true);assert.deepEqual(readLearningProgress(store,'account-a').completed,[]);assert.deepEqual(readLearningProgress(store,'account-b').completed,['sleep-autoplay']);assert.deepEqual(readLearningProgress(store,'guest').completed,['study-streak']);
 assert.deepEqual(store.removed,[learningStorageKey('account-a')]);assert.equal(store.getItem(STORAGE_KEY),originalSave);assert.deepEqual(game.profile,originalProfile);assert.equal(store.getItem('account-session'),'existing synthetic session');
 assert.equal(new NinjaGame({storage:store,now:()=>1700000000000}).profile.coins,321);
 assert.equal(clearLearningProgress(store,'guest'),true);assert.deepEqual(readLearningProgress(store,'account-b').completed,['sleep-autoplay']);
 assert.notEqual(learningStorageKey('account-a/b'),learningStorageKey('account-a%2Fb'));
 for(const invalid of ['',null,42,'a'.repeat(257)])assert.throws(()=>learningStorageKey(invalid),TypeError);
});

test('corrupt, oversized and forged journals are bounded and cannot inject extra progress',()=>{
 const store=storage(),key=learningStorageKey('guest');
 for(const raw of ['not json','null','[]','{"version":2,"completed":["study-streak"]}','{"version":1,"completed":"study-streak"}','x'.repeat(4097)]){
  store.values.set(key,raw);assert.deepEqual(readLearningProgress(store).completed,[]);assert.equal(readLearningProgress(store).available,true);
 }
 store.values.set(key,JSON.stringify({version:1,completed:['sleep-safety','<img onerror=evil>','study-streak','study-streak',null,42],coins:99999}));
 assert.deepEqual(readLearningProgress(store).completed,['study-streak','sleep-safety']);assert.equal(readLearningProgress(store).total,12);
 const model=createSenseiTrialsModel({storage:store});solve(model,'gaming-team');const saved=JSON.parse(store.getItem(key));assert.deepEqual(saved.completed,['study-streak','gaming-team','sleep-safety']);assert.equal('coins' in saved,false);
});

test('blocked or missing storage keeps every decision playable within its session and reports the limit',()=>{
 const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');},removeItem(){throw Error('blocked');}};
 for(const store of [undefined,null,blocked]){
  const model=createSenseiTrialsModel({storage:store});assert.equal(model.getState().available,false);
  for(const scenario of SENSEI_SCENARIOS){const answer=solve(model,scenario.id);assert.equal(answer.correct,true);assert.equal(answer.saved,false);}
  assert.equal(model.getState().completeCount,12);assert.equal(model.finish(),true);assert.equal(model.reset(),false);assert.equal(model.getState().completeCount,0);
 }
 const writeBlocked={getItem:()=>null,setItem(){throw Error('quota');},removeItem(){throw Error('blocked');}};
 const model=createSenseiTrialsModel({storage:writeBlocked});solve(model,'study-streak');assert.equal(model.getState().available,false);assert.deepEqual(model.getState().completed,['study-streak']);
});

test('codex reflects every canonical context classification and keeps bonus items separate',()=>{
 setLanguage('de');
 for(const context of ['study','gaming','sleep']){
  const entries=getCodexEntries({context});assert.equal(entries.length,CONTENT.length);
  for(const item of CONTENT){const entry=entries.find(e=>e.id===item.id);assert(entry);assert.equal(entry.kind,item.powerup?'powerup':item.kindByContext[context]);assert.deepEqual(entry.meaning,{...item.kindByContext});assert.equal(entry.label,item.label);}
  assert(getCodexEntries({context,kind:'powerup'}).every(entry=>entry.powerup));
  for(const id of ['safety','break'])assert.equal(entries.find(e=>e.id===id).kind,'useful');
 }
 const model=createNotificationCodexModel();assert.equal(model.getState().entries.find(e=>e.id==='gaming-invite').kind,'distraction');
 model.setContext('gaming');assert.equal(model.getState().entries.find(e=>e.id==='gaming-invite').kind,'useful');model.setContext('sleep');assert.equal(model.getState().entries.find(e=>e.id==='gaming-invite').kind,'distraction');
 const first=model.getState().entries[0];first.meaning.study='forged';assert.equal(CONTENT[0].kindByContext.study,'distraction');
 assert.equal(model.getState().ranked,false);assert.equal(model.getState().rewards,false);
});

test('codex search and filters compose, preserve context and bound untrusted text in both languages',()=>{
 const previous=getLanguage();
 try{
  setLanguage('de');const model=createNotificationCodexModel({context:'gaming'});
  model.setQuery('  GAMING-EINLADUNG  ');assert.deepEqual(model.getState().entries.map(e=>e.id),['gaming-invite']);model.setKind('distraction');assert.deepEqual(model.getState().entries,[]);
  model.setKind('useful');assert.deepEqual(model.getState().entries.map(e=>e.id),['gaming-invite']);assert.equal(model.setContext('invalid'),false);assert.equal(model.setKind('invalid'),false);
  model.setKind('all');model.setQuery('munze');assert(model.getState().entries.some(e=>e.id==='power-coins'),'accent-folding finds Münze');
  const hostile='<img src=x onerror="globalThis.attacked=true">';model.setQuery(hostile);assert.equal(model.getState().query,hostile);assert.deepEqual(model.getState().entries,[]);assert.equal(globalThis.attacked,undefined);
  assert.equal(model.setQuery('x'.repeat(9000)).length,160);assert.equal(model.setQuery({toString(){throw Error('must not coerce');}}),'');
  setLanguage('en');model.setQuery('warning');assert(model.getState().entries.some(e=>e.id==='safety'));assert.notEqual(model.getState().entries.find(e=>e.id==='safety').label,CONTENT.find(e=>e.id==='safety').label);
  model.reset();assert.equal(model.getState().query,'');assert.equal(model.getState().kind,'all');assert.equal(model.getState().context,'gaming');assert.equal(model.getState().entries.length,CONTENT.length);
 }finally{setLanguage(previous);}
});

function containerFixture(){
 const listeners=new Map();return {innerHTML:'',listeners,ownerDocument:{activeElement:null},addEventListener(type,fn){assert(!listeners.has(type),'show must not duplicate listener');listeners.set(type,fn);},removeEventListener(type,fn){if(listeners.get(type)===fn)listeners.delete(type);},querySelector(){return null;},querySelectorAll(){return [];},replaceChildren(){this.innerHTML='';},contains(){return true;}};
}
test('learning views unsubscribe on destroy, preserve progress on language change and escape codex search markup',()=>{
 const previous=getLanguage();setLanguage('de');
 const store=storage(),root=containerFixture(),view=createSenseiTrials({container:root,storage:store});
 try{
  view.show();view.show();assert.equal(root.listeners.size,2);assert.match(root.innerHTML,/indie-journeys\.png/);
  const correct=view.getState().scenario.correct;
  root.listeners.get('click')({target:{closest:()=>({disabled:false,dataset:{senseiChoice:String(correct)}})},preventDefault(){}});
  assert.equal(view.getState().completeCount,1);setLanguage('en');assert.match(root.innerHTML,/A thoughtful choice/);assert.equal(view.getState().completeCount,1);
  view.destroy();assert.equal(root.listeners.size,0);assert.equal(root.innerHTML,'');setLanguage('de');assert.equal(root.innerHTML,'','destroyed views do not rerender from a retained language subscriber');
  const codexRoot=containerFixture(),codex=createNotificationCodex({container:codexRoot});codex.show();codex.show();assert.equal(codexRoot.listeners.size,2);
  const query='" autofocus onfocus="globalThis.attacked=true"><img src=x onerror=evil>';
  codexRoot.listeners.get('input')({target:{matches:()=>true,value:query}});setLanguage('en');
  assert.match(codexRoot.innerHTML,/value="&quot; autofocus/);assert.doesNotMatch(codexRoot.innerHTML,/<img src=x/);assert.equal(codex.getState().query,query);assert.match(codexRoot.innerHTML,/There is no matching signal/);
  codex.destroy();assert.equal(codexRoot.listeners.size,0);setLanguage('de');assert.equal(codexRoot.innerHTML,'');
 }finally{view.destroy();setLanguage(previous);}
});
