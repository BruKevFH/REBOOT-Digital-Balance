import test from 'node:test';
import assert from 'node:assert/strict';
import {NinjaGame,SKINS,STORAGE_KEY} from '../notification-ninja/src/game.js';
import {BOSS_DEFINITIONS,getBoss,createBossState,restoreBossState,getBossSpeed} from '../notification-ninja/src/boss.js';
import {isThrowReady} from '../notification-ninja/src/throwers.js';

const clone=value=>JSON.parse(JSON.stringify(value));
const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};};
function create(id='scout',extra={}){
  const store=extra.storage||storage(),game=new NinjaGame({seed:'autoplay-test',width:322,height:754,storage:store,...extra});
  game.profile.adventure={completed:['study-focus','open-trial','autoplay-scout','gaming-boundary','sleep-sanctuary','autoplay-guardian','balance-master'],claimed:[],progress:{}};
  game.profile.unlockedWorlds=['study','gaming','sleep','master'];
  assert.equal(game.start({mode:'boss',bossId:id,missionId:`autoplay-${id}`,tutorial:false}).ok,true);
  assert.equal(game.nextLevel().ok,true);
  return {game,store};
}
function decide(game){const events=[];for(const object of [...game.state.objects])if(object.kind==='distraction'&&isThrowReady(object))events.push(...game.swipe([{x:object.x,y:object.y-12},{x:object.x,y:object.y+12}]));return events;}
function frame(game){return [...game.update(.05),...decide(game)];}
function until(game,predicate,max=16000){const events=[];for(let i=0;i<max&&!predicate();i++)events.push(...frame(game));assert.ok(predicate(),'authored encounter must reach the requested state');return events;}

test('three authored Autoplay bosses have fixed targets and their own gentle speed independent of Open',()=>{
  assert.deepEqual(BOSS_DEFINITIONS.map(boss=>[boss.id,boss.maxHealth,boss.requiredCorrect]),[['scout',20,20],['guardian',28,28],['overlord',36,36]]);
  for(const boss of BOSS_DEFINITIONS){assert.equal(boss.phases.length,3);assert.deepEqual(boss.phases.map(phase=>phase.context),['study','gaming','sleep']);assert.ok(boss.name&&boss.description);assert.ok(Object.isFrozen(boss));}
  assert.equal(getBoss('forged'),null);assert.equal(createBossState('forged'),null);
  for(const boss of BOSS_DEFINITIONS){const state=createBossState(boss.id);assert.ok(getBossSpeed(state)>=.92&&getBossSpeed(state)<=1.08);assert.ok(getBossSpeed({...state,phase:2,burstRemaining:3})<1.5);}
});

test('every boss can be won with genuine contextual cuts and useful passes on a phone, with no timed stop',()=>{
  for(const boss of BOSS_DEFINITIONS){
    const {game,store}=create(boss.id),events=until(game,()=>game.state.ended),s=game.state;
    assert.equal(s.mode,'boss');assert.equal(s.maxLives,3);assert.equal(s.lives,3);assert.equal(s.duration,0);assert.equal(s.remaining,0);assert.equal(s.openRuleset,null);
    assert.equal(s.boss.health,0);assert.equal(s.boss.defeated,true);assert.equal(s.result,'complete');assert.equal(s.metrics.correctDecisions,boss.maxHealth);assert.ok(s.metrics.cuts>0&&s.metrics.usefulPassed>0);
    assert.deepEqual(s.metrics.contextsPlayed,['study','gaming','sleep']);assert.deepEqual(events.filter(event=>event.type==='boss-phase').map(event=>event.phase),[1,2]);
    assert.equal(events.filter(event=>event.type==='boss-hit').length,boss.maxHealth);assert.equal(events.filter(event=>event.type==='boss-defeated').length,1);assert.equal(events.filter(event=>event.type==='ended').length,1);
    assert.equal(s.metrics.lifeLost,0);assert.ok(s.elapsed>25&&s.elapsed<300);assert.equal(game.requestStop().ok,false);assert.equal(game.profile.totalRuns,1);
    const money=game.profile.coins,stats=clone(game.profile.stats);game.save();const restored=new NinjaGame({storage:store});
    assert.equal(restored.state.mode,'boss');assert.equal(restored.state.result,'complete');assert.equal(restored.state.boss.defeated,true);assert.equal(restored.profile.coins,money);assert.deepEqual(restored.profile.stats,stats);
    assert.deepEqual(restored.update(.05),[]);assert.equal(restored.profile.totalRuns,1);assert.equal(restored.profile.coins,money);
  }
});

test('Autoplay announces an accelerated wave more than one active second before any burst and pauses honestly',()=>{
  const {game,store}=create();const events=until(game,()=>game.state.boss.cueRemaining>0);
  const cue=events.find(event=>event.type==='boss-cue');assert.ok(cue);assert.equal(cue.duration,1.35);assert.equal(game.state.boss.burstRemaining,0);assert.equal(game.state.boss.waves,0);
  game.pause();const paused=clone(game.state);for(let index=0;index<80;index++)assert.deepEqual(game.update(.05),[]);assert.deepEqual(game.state,paused);
  const resumed=new NinjaGame({storage:store,width:322,height:754});assert.equal(resumed.state.mode,'boss');assert.equal(resumed.state.paused,true);assert.deepEqual(resumed.state.boss,game.state.boss);resumed.resume();
  let elapsed=0,wave=null;while(!wave&&elapsed<2){const next=frame(resumed);elapsed+=.05;wave=next.find(event=>event.type==='boss-wave');}
  assert.ok(wave);assert.ok(elapsed>=1.3);assert.equal(wave.duration,3);assert.equal(wave.wave,1);assert.equal(resumed.state.boss.waves,1);
});

test('boss phase changes drain old objects and keep their original meaning until the room switches',()=>{
  const {game}=create(),events=until(game,()=>game.state.boss.pendingPhase!==null);
  assert.equal(game.state.boss.phase,0);assert.equal(game.state.context,'study');assert.ok(game.state.objects.length>0);
  const count=game.state.spawnCount,heldContext=game.state.objects.map(object=>object.context);
  assert.ok(heldContext.every(context=>context==='study'));game.pause();const frozen=clone(game.state);frame(game);assert.deepEqual(game.state,frozen);game.resume();
  const rest=until(game,()=>game.state.boss.phase===1);assert.equal(game.state.spawnCount,count);assert.equal(game.state.context,'gaming');assert.equal(game.state.objects.length,0);assert.ok([...events,...rest].some(event=>event.type==='boss-phase'&&event.context==='gaming'));
});

test('wrong slices and missed distractions each cost one of exactly three boss hearts and never damage the boss',()=>{
  for(const kind of ['useful','distraction']){
    const {game,store}=create(),events=[];
    for(let index=0;index<3;index++){
      // Spawn the real contextual object, then exercise public collision/physics instead of calling private scoring hooks.
      game.state.objects=[];game.state.spawnTimer=100;
      const object=game._spawnContent(kind==='useful'?'homework':'autoplay');
      if(kind==='useful')events.push(...game.swipe([{x:object.x,y:object.y-15},{x:object.x,y:object.y+15}]));
      else for(let frameIndex=0;frameIndex<200&&!game.state.ended&&game.state.objects.includes(object);frameIndex++)events.push(...game.update(.05));
      assert.equal(game.state.lives,2-index);assert.equal(game.state.boss.health,20);
    }
    assert.equal(game.state.result,'lives');assert.equal(game.state.boss.defeated,false);assert.equal(game.state.awardedCoins,0);assert.equal(events.filter(event=>event.type==='life-lost').length,3);
    const restored=new NinjaGame({storage:store});assert.equal(restored.state.mode,'boss');assert.equal(restored.state.result,'lives');assert.equal(restored.profile.totalRuns,1);
  }
});

test('saved boss damage, phase, and active throws survive slow motion, resize and deliberate resume without new credit',()=>{
  const {game,store}=create('guardian');until(game,()=>game.state.metrics.correctDecisions>=4&&game.state.objects.length>0);game.state.effects.slow=6;game.pause();game.resize(640,480);game.save();
  const before=clone(game.state),restored=new NinjaGame({storage:store,width:640,height:480});
  assert.equal(restored.state.mode,'boss');assert.equal(restored.state.missionId,'autoplay-guardian');assert.deepEqual(restored.state.boss,before.boss);assert.equal(restored.state.paused,true);assert.equal(restored.state.metrics.correctDecisions,before.metrics.correctDecisions);assert.equal(restored.profile.totalRuns,0);assert.equal(restored.profile.coins,0);
  const held=clone(restored.state);restored.update(.05);assert.deepEqual(restored.state,held);restored.resume();frame(restored);assert.ok(restored.state.effects.slow<6&&restored.state.effects.slow>5);assert.equal(restored.profile.totalRuns,0);
});

test('forged boss metadata, damage counters and phantom victories cannot restore an active or credited encounter',()=>{
  for(const edit of [save=>save.state.boss.id='fake',save=>save.state.boss.maxHealth=1,save=>save.state.boss.health=0,save=>save.state.boss.health=19,save=>save.state.boss.phase=2,save=>save.state.boss.cueRemaining=99,save=>save.state.boss.nextWaveAt=-1,save=>{save.state.ended=true;save.state.scene='results';save.state.result='complete';}]){
    const {game,store}=create();game.save();const save=JSON.parse(store.getItem(STORAGE_KEY));edit(save);store.setItem(STORAGE_KEY,JSON.stringify(save));const restored=new NinjaGame({storage:store});assert.equal(restored.state.started,false);assert.equal(restored.profile.coins,0);assert.equal(restored.profile.totalRuns,0);
  }
  assert.equal(restoreBossState({...createBossState('scout'),pendingPhase:2}),null);
});

test('weekly outfits cannot be bought for zero coins and invalid boss starts leave a live run intact',()=>{
  const {game}=create();const before=clone(game.state);assert.equal(game.start({mode:'boss',bossId:'fake'}).ok,false);assert.deepEqual(game.state,before);
  for(const id of ['lotus','ember','tide']){assert.equal(SKINS.find(skin=>skin.id===id).unlock,'weekly');assert.equal(game.buySkin(id).ok,false);assert.ok(!game.profile.unlockedSkins.includes(id));}
  assert.equal(game.profile.coins,0);
});

test('boss hearts and damage rules do not change when a veteran owns every paid ability',()=>{
  const game=new NinjaGame({storage:null,width:322,height:754});
  game.profile.adventure={completed:['study-focus','open-trial'],claimed:[],progress:{}};
  game.profile.unlockedSkills=['focus-root','slow-super','flow-boost','guard-root','shield-super','second-chance','coin-root','sweep-super','coin-boost'];
  game.profile.selectedSuper='sweep-super';
  assert.equal(game.start({mode:'boss',bossId:'scout',missionId:'autoplay-scout',difficulty:'easy'}).ok,true);
  assert.equal(game.state.difficulty,'normal');assert.equal(game.state.maxLives,3);assert.deepEqual(game.state.skillIds,[]);assert.equal(game.state.selectedSuper,null);assert.equal(game.state.effects.shield,0);
  game.nextLevel();assert.equal(game.activateSuper().ok,false);assert.equal(game.requestStop().ok,false);
  assert.equal(game.state.boss.health,20);assert.equal(game.state.metrics.correctDecisions,0);assert.equal(game.state.runCoins,0);
});
