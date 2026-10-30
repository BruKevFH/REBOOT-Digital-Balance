import test from 'node:test';
import assert from 'node:assert/strict';
import {NinjaGame,STORAGE_KEY} from '../notification-ninja/src/game.js';
import {normalizePlayer,getPlayerProgress,GUIDE_IDS} from '../notification-ninja/src/player.js';
import {setSignedIn,isSignedIn,deleteLocalProfile} from '../notification-ninja/src/local-profile.js';
import {isThrowReady} from '../notification-ninja/src/throwers.js';

class Storage {data=new Map();getItem(key){return this.data.get(key)??null;}setItem(key,value){this.data.set(key,String(value));}removeItem(key){this.data.delete(key);}}
const copy=value=>JSON.parse(JSON.stringify(value));
function create(extra={}){const storage=new Storage(),clock={now:new Date(2026,9,27,12).getTime()},game=new NinjaGame({storage,width:322,height:754,seed:'pdf-balance',now:()=>clock.now,...extra});return {game,storage,clock};}
function step(game,clock,{correct=true}={}){const events=[];if(correct)for(const object of [...game.state.objects])if(object.kind==='distraction'&&isThrowReady(object))events.push(...game.swipe([{x:object.x,y:object.y-10},{x:object.x,y:object.y+10}]));clock.now+=50;events.push(...game.update(.05));return events;}
function until(game,clock,check,options={}){const events=[];for(let i=0;i<16000&&!check();i++)events.push(...step(game,clock,options));assert.ok(check(),'actual simulation reaches condition');return events;}
function enableBoss(game){game.profile.unlockedWorlds=['study','gaming','sleep','master'];game.profile.adventure.completed=['study-focus','open-trial'];}

test('guest enters without any personal input and keeps a playable persistent local profile',()=>{
  const {game,storage}=create();assert.deepEqual(game.enterGuest(),{ok:true,guest:true,username:'Ninja'});assert.equal(game.profile.player.guest,true);assert.equal(game.profile.player.createdAt>0,true);
  assert.equal(game.startQuickRound('study').ok,true);game.nextLevel();game.pause();const restored=new NinjaGame({storage});assert.equal(restored.profile.player.username,'Ninja');assert.equal(restored.profile.player.guest,true);assert.equal(restored.state.quickRound,true);assert.equal(restored.state.duration,45);assert.equal(restored.state.paused,true);
});

test('guest entry never overwrites an existing named player, wallet, outfit or active run',()=>{
  const {game}=create();game.setUsername('Ninja Lea');game.profile.coins=127;game.profile.unlockedSkins.push('solar');game.selectSkin('solar');game.start({mode:'study'});game.nextLevel();game.pause();const before=game.getSnapshot();
  assert.deepEqual(game.enterGuest(),{ok:true,guest:false,username:'Ninja Lea'});assert.deepEqual(game.getSnapshot(),before);assert.equal(game.profile.player.guest,undefined);
});

test('guest identity cannot be forged on named players and choosing a name preserves all guest progress',()=>{
  assert.equal(normalizePlayer({player:{username:'Lea',guest:true}}).guest,undefined);assert.equal(normalizePlayer({player:{username:'Ninja',guest:true}}).guest,true);
  const {game}=create();game.enterGuest();game.profile.coins=37;game.profile.stats.correct=19;const createdAt=game.profile.player.createdAt;
  assert.equal(game.setUsername('x').ok,false);assert.equal(game.profile.player.guest,true);assert.equal(game.setUsername('Mira Focus').ok,true);assert.equal(game.profile.player.guest,undefined);assert.equal(game.profile.player.createdAt,createdAt);assert.equal(game.profile.coins,37);assert.equal(game.profile.stats.correct,19);
});

test('guest remains usable with blocked storage and local signout/deletion retain their limited scope',()=>{
  const blocked={getItem:()=>null,setItem:()=>{throw new Error('blocked');}},game=new NinjaGame({storage:blocked});assert.equal(game.enterGuest().ok,true);assert.equal(game.profile.player.guest,true);assert.equal(game.storageFailed,true);assert.equal(game.startQuickRound('sleep').ok,true);
  const {game:local,storage}=create();local.enterGuest();setSignedIn(storage,true);assert.equal(isSignedIn(storage,true),true);setSignedIn(storage,false);assert.equal(isSignedIn(storage,true),false);assert.equal(JSON.parse(storage.getItem(STORAGE_KEY)).profile.player.guest,true);storage.setItem('foreign','keep');assert.equal(deleteLocalProfile(storage).ok,true);assert.equal(storage.getItem('foreign'),'keep');assert.equal(new NinjaGame({storage}).profile.player.username,'');
});

test('all three short everyday situations are free while purchased campaign rooms stay locked',()=>{
  for(const context of ['study','gaming','sleep']){const {game}=create();game.enterGuest();assert.equal(game.startQuickRound(context).ok,true);assert.equal(game.state.mode,context);assert.equal(game.state.quickRound,true);assert.equal(game.state.duration,45);assert.equal(game.state.missionId,null);assert.equal(game.state.isTutorial,false);assert.equal(game.state.difficulty,'easy');assert.equal(game.state.maxLives,5);assert.deepEqual(game.profile.unlockedWorlds,['study']);assert.equal(game.profile.coins,0);}
  const {game}=create();assert.equal(game.start({mode:'gaming'}).ok,false);assert.equal(game.start({mode:'sleep'}).ok,false);assert.equal(game.startMission('gaming-boundary').ok,false);
});

test('invalid quick settings are atomic and cannot bypass career or boss conditions',()=>{
  const {game,storage}=create();game.startQuickRound('study');game.nextLevel();game.pause();const before=game.getSnapshot(),save=storage.getItem(STORAGE_KEY);
  for(const call of [()=>game.startQuickRound('open'),()=>game.startQuickRound('boss'),()=>game.startQuickRound('master'),()=>game.startQuickRound('study',{difficulty:'fastest'}),()=>game.startQuickRound('gaming',{gamingLimit:10}),()=>game.start({mode:'open',quickRound:true}),()=>game.start({mode:'study',quickRound:'yes'}),()=>game.start({mode:'study',quickRound:true,missionId:'study-focus'})]){assert.equal(call().ok,false);assert.deepEqual(game.getSnapshot(),before);assert.equal(storage.getItem(STORAGE_KEY),save);}
});

test('quick difficulty and gaming limit are explicit and retain the original lives and ninja difficulty rules',()=>{
  for(const [difficulty,lives,limit] of [['easy',5,45],['normal',4,60],['hard',3,90]]){const {game}=create();assert.equal(game.startQuickRound('gaming',{difficulty,gamingLimit:limit}).ok,true);assert.equal(game.state.duration,limit);assert.equal(game.state.maxLives,lives);assert.equal(game.state.difficulty,difficulty);}
});

test('short rounds genuinely complete without personal data and do not unlock paid rooms',()=>{
  for(const context of ['study','gaming','sleep']){const {game,clock,storage}=create();game.enterGuest();game.startQuickRound(context);game.nextLevel();until(game,clock,()=>game.state.ended||game.state.scene==='limit-choice');if(game.state.scene==='limit-choice')assert.equal(game.requestStop().ok,true);
    assert.equal(game.state.ended,true);assert.ok(['complete','healthy-stop'].includes(game.state.result));assert.ok(game.state.metrics.correctDecisions>0);assert.equal(game.profile.totalRuns,1);assert.deepEqual(game.profile.unlockedWorlds,['study']);const restored=new NinjaGame({storage});assert.equal(restored.storageFailed,false);assert.equal(restored.state.quickRound,true);assert.equal(restored.state.duration,45);assert.equal(restored.profile.player.guest,true);assert.equal(restored.profile.totalRuns,1);
  }
});

test('quick easy mode limits simultaneous objects and gives an unhurried initial real flight',()=>{
  for(const [difficulty,cap] of [['easy',2],['normal',3],['hard',4]]){const {game,clock}=create();game.startQuickRound('study',{difficulty});game.nextLevel();let maximum=0,flight=null;
    for(let i=0;i<500&&!game.state.ended;i++){step(game,clock,{correct:false});maximum=Math.max(maximum,game.state.objects.length);assert.ok(game.state.objects.length<=cap);const first=game.state.objects[0];if(first?.launch&&!flight){const launch=first.launch,distance=launch.fromY+first.radius+2,gravity=first.gravity;flight=(-launch.initialVy-Math.sqrt(launch.initialVy**2-2*gravity*distance))/gravity;}}
    assert.ok(maximum>0);assert.ok(flight>=3.9,'real initial trajectory leaves reaction time');
  }
});

test('pause freezes a quick round completely and its precise timer and target survive reload',()=>{
  const {game,clock,storage}=create();game.startQuickRound('gaming',{difficulty:'normal',gamingLimit:60});game.nextLevel();until(game,clock,()=>game.state.elapsed>=4);game.pause();const before=copy(game.state);for(let i=0;i<80;i++)assert.deepEqual(game.update(.05),[]);assert.deepEqual(game.state,before);
  const restored=new NinjaGame({storage,width:322,height:754});assert.equal(restored.state.quickRound,true);assert.equal(restored.state.duration,60);assert.equal(restored.state.elapsed,before.elapsed);assert.equal(restored.state.remaining,before.remaining);assert.equal(restored.state.paused,true);restored.resume();restored.update(.05);assert.ok(restored.state.elapsed>before.elapsed);
});

test('a stopped round secures real earned coins exactly once without granting a completion reward',()=>{
  const {game,clock,storage}=create();game.start({mode:'study'});game.nextLevel();until(game,clock,()=>game.state.metrics.correctDecisions>=14);game.pause();const coins=game.state.runCoins,correct=game.state.metrics.correctDecisions;assert.ok(coins>=1);const result=game.finishRound();assert.equal(result.ok,true);assert.equal(result.events.filter(e=>e.type==='ended').length,1);assert.equal(game.state.result,'stopped');assert.equal(game.state.awardedCoins,coins);assert.equal(game.profile.coins,coins);assert.equal(game.profile.totalRuns,1);assert.equal(game.profile.stats.correct,correct);assert.equal(game.profile.achievements.includes('healthy-stop'),false);const before=game.getSnapshot();assert.equal(game.finishRound().ok,false);assert.deepEqual(game.getSnapshot(),before);
  const restored=new NinjaGame({storage});assert.equal(restored.state.result,'stopped');assert.equal(restored.state.ended,true);assert.equal(restored.profile.coins,coins);assert.equal(restored.profile.totalRuns,1);assert.equal(restored.finishRound().ok,false);assert.deepEqual(restored.update(.05),[]);
});

test('repeated empty and very short stops cannot farm coins, XP or completed run counters',()=>{
  const {game,clock}=create();game.enterGuest();for(let run=0;run<20;run++){game.startQuickRound(['study','gaming','sleep'][run%3]);if(run%2){game.nextLevel();for(let i=0;i<20;i++)step(game,clock);}assert.equal(game.finishRound().ok,true);assert.equal(game.state.result,'stopped');}
  assert.equal(game.profile.coins,0);assert.equal(game.profile.totalRuns,0);assert.equal(game.profile.stats.correct,0);assert.equal(getPlayerProgress(game.profile).xp,0);assert.deepEqual(game.profile.adventure.completed,[]);
});

test('stopping Open Run is unranked and stopping a boss cannot become a career victory after reload',()=>{
  for(const mode of ['open','boss']){const {game,clock,storage}=create();if(mode==='boss')enableBoss(game);assert.equal(game.start(mode==='open'?{mode:'open'}:{mode:'boss',bossId:'scout'}).ok,true);game.nextLevel();until(game,clock,()=>game.state.elapsed>=8);game.pause();assert.equal(game.finishRound().ok,true);assert.equal(game.state.result,'stopped');assert.equal(game.state.openRuleset,null);if(mode==='boss')assert.equal(game.state.boss.defeated,false);
    const restored=new NinjaGame({storage});assert.equal(restored.storageFailed,false);assert.equal(restored.state.mode,mode);assert.equal(restored.state.result,'stopped');assert.equal(restored.state.openRuleset,null);assert.equal(restored.profile.totalRuns,0);assert.ok(!restored.profile.adventure.completed.includes('autoplay-scout'));
  }
});

test('quick-round save validation does not allow a short round to masquerade as Open or a mission',()=>{
  for(const mutate of [save=>{save.state.mode='open';save.state.levelIndex=0;},save=>{save.state.missionId='study-focus';},save=>{save.state.mode='master';save.state.levelIndex=3;}]){const {game,storage}=create();game.profile.coins=93;game.startQuickRound('study');game.nextLevel();game.pause();const saved=JSON.parse(storage.getItem(STORAGE_KEY));mutate(saved);storage.setItem(STORAGE_KEY,JSON.stringify(saved));const restored=new NinjaGame({storage});assert.equal(restored.state.started,false);assert.equal(restored.profile.coins,93);assert.equal(restored.storageError,'unreadable');}
});

test('new calm and reflection guide acknowledgements are known and persist without personal identifiers',()=>{
  const {game,storage}=create();game.enterGuest();for(const id of ['quick-round','calm-view','reflection']){assert.ok(GUIDE_IDS.includes(id));assert.equal(game.markGuideSeen(id).ok,true);}const restored=new NinjaGame({storage});assert.deepEqual(restored.profile.player.guideSeen,['quick-round','calm-view','reflection']);assert.equal(restored.profile.player.guest,true);assert.equal('email'in restored.profile.player,false);
});
