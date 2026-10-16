import test from 'node:test';
import assert from 'node:assert/strict';
import { NinjaGame, STORAGE_KEY } from '../notification-ninja/src/game.js';
import { getOpenSpeedFactor } from '../notification-ninja/src/progression.js';
import { THROW_RECOVERY, getThrowerCount, getThrowerLayout, getThrowerPose, getThrowScale, isThrowReady } from '../notification-ninja/src/throwers.js';

class Storage {
  constructor(){this.data=new Map();}
  getItem(key){return this.data.get(key)??null;}
  setItem(key,value){this.data.set(key,String(value));}
}
function setup(difficulty='easy',options={}){
  const storage=new Storage(),game=new NinjaGame({storage,seed:'real-glove-origin',width:1000,height:700,...options});
  assert.equal(game.start({mode:'study',difficulty,tutorial:false}).ok,true);game.nextLevel();game.state.spawnTimer=100;
  return {game,storage};
}
const near=(actual,expected,message='coordinates match')=>assert.ok(Math.abs(actual-expected)<.0000001,`${message}: ${actual} vs ${expected}`);
const swipe=(game,item)=>game.swipe([{x:item.x-20,y:item.y},{x:item.x+20,y:item.y}]);
function advance(game,seconds){for(let left=seconds;left>.00000001;left-=.01)game.update(Math.min(.01,left));}
function emit(game){const events=[];game._spawn(events);return events.filter(event=>event.type==='spawned');}

// These integration checks use the real spawn/update/collision path. A glove prop
// alone cannot pass: the playable object must occupy its moving hand coordinates.
test('natural waves originate at the visible glove on one, two or three centered throwers',()=>{
  for(const [difficulty,count] of [['easy',1],['normal',2],['hard',3]]){
    const {game}=setup(difficulty),actors=getThrowerLayout(game.width,game.height,difficulty);
    assert.equal(getThrowerCount(difficulty),count);assert.equal(actors.length,count);
    near(actors.reduce((sum,actor)=>sum+actor.x,0)/count,game.width/2,'squad stays centered');
    assert.ok(actors.every(actor=>actor.height>=180),'desktop ninjas are visibly large');
    const [event]=emit(game),item=game.state.objects.find(object=>object.id===event.id);
    assert.ok(item.launch);assert.equal(item.launch.throwerIndex,0);
    const hand=getThrowerPose(actors[0],0,item.launch.windup);
    near(item.x,hand.handX);near(item.y,hand.handY);assert.equal(getThrowScale(item),.3);
    advance(game,item.launch.windup*.65);
    const movingHand=getThrowerPose(actors[0],item.age,item.launch.windup);
    near(item.x,movingHand.handX);near(item.y,movingHand.handY);
    const release=getThrowerPose(actors[0],item.launch.windup,item.launch.windup);
    near(item.launch.fromX,release.handX);near(item.launch.fromY,release.handY);
  }
});

test('held and approaching notifications cannot cost hearts, award coins or be sliced before their lane is ready',()=>{
  for(const contentId of ['streak','homework','power-coins']){
    const {game}=setup(),item=game._spawnContent(contentId,0),before={lives:game.state.lives,score:game.state.score,coins:game.state.runCoins};
    assert.deepEqual(swipe(game,item),[]);
    advance(game,item.launch.windup+item.launch.arc*.6);
    assert.equal(isThrowReady(item),false);assert.deepEqual(swipe(game,item),[]);
    assert.deepEqual({lives:game.state.lives,score:game.state.score,coins:game.state.runCoins},before);
    advance(game,item.launch.arc*.5);
    assert.equal(isThrowReady(item),true);near(item.x,item.launch.laneX);near(getThrowScale(item),1);
    const events=swipe(game,item);assert.equal(game.state.objects.includes(item),false);
    if(contentId==='homework'){assert.equal(game.state.lives,before.lives-1);assert.ok(events.some(event=>event.type==='useful-mistake'));}
    else if(contentId==='power-coins'){assert.equal(game.state.runCoins,1);assert.ok(events.some(event=>event.type==='powerup'));}
    else{assert.ok(game.state.score>before.score);assert.ok(events.some(event=>event.type==='sliced'));}
  }
});

test('Flow chains and sweep supers leave objects in the ninjas hands untouched',()=>{
  const {game}=setup();game.profile.coins=1000;game.pause();
  assert.equal(game.buySkill('coin-root').ok,true);assert.equal(game.buySkill('sweep-super').ok,true);assert.equal(game.selectSuper('sweep-super').ok,true);
  game.start({mode:'study',difficulty:'easy',tutorial:false});game.nextLevel();game.state.spawnTimer=100;
  const held=game._spawnContent('streak',0),ready=game._spawnContent('streak');Object.assign(ready,{x:held.x,y:held.y,radius:8});
  game.state.effects.flow=3;const events=swipe(game,ready);
  assert.equal(events.filter(event=>event.type==='sliced').length,1);assert.ok(game.state.objects.includes(held));
  game.state.superCharge=100;const activation=game.activateSuper();assert.equal(activation.ok,true);
  assert.equal(activation.events.some(event=>event.type==='sliced'),false);assert.ok(game.state.objects.includes(held));
  game.state.effects.flow=0;advance(game,held.launch.windup+held.launch.arc+.01);game.state.superCharge=100;
  assert.ok(game.activateSuper().events.some(event=>event.type==='sliced'&&event.id===held.id));
});

test('all actors take turns and a busy squad cannot start overlapping windups',()=>{
  for(const [difficulty,count] of [['easy',1],['normal',2],['hard',3]]){
    const {game}=setup(difficulty,{width:1200,height:800});
    const launched=[];for(let wave=0;wave<count;wave++)launched.push(...emit(game));
    assert.equal(launched.length,count);
    assert.deepEqual(launched.map(item=>item.launch.throwerIndex),Array.from({length:count},(_,index)=>index));
    const ids=game.state.objects.map(item=>item.id);assert.deepEqual(emit(game),[]);assert.deepEqual(game.state.objects.map(item=>item.id),ids);
    advance(game,Math.max(...game.state.objects.map(item=>item.launch.windup))+THROW_RECOVERY+.01);
    const following=emit(game);assert.ok(following.length>0);assert.equal(following[0].launch.throwerIndex,0);
  }
});

test('objects reserve distinct destination lanes during windup and become separate full size targets',()=>{
  for(const width of [320,390,1000,1920]){
    const {game}=setup('hard',{width,height:700});
    for(let actor=0;actor<3;actor++)game._spawnContent(actor===1?'homework':'streak',actor);
    assert.ok(game.state.objects.length>=2);
    for(const a of game.state.objects)for(const b of game.state.objects)if(a!==b)assert.ok(Math.abs(a.launch.laneX-b.launch.laneX)>=a.radius+b.radius+24);
    assert.equal(game._spawnContent('streak',0),null,'an occupied hand cannot start another throw');
    advance(game,.6);
    for(const item of game.state.objects){assert.equal(isThrowReady(item),true);near(item.x,item.launch.laneX);near(getThrowScale(item),1);}
    for(const a of game.state.objects)for(const b of game.state.objects)if(a!==b)assert.ok(Math.abs(a.x-b.x)>=a.radius+b.radius+24);
  }
});

test('hand windups and released flight freeze in pause and share the same slow motion clock',()=>{
  const {game}=setup('normal'),item=game._spawnContent('streak',0);advance(game,.08);
  game.pause();const frozen=game.getSnapshot();for(let frame=0;frame<30;frame++)game.update(.05);assert.deepEqual(game.getSnapshot(),frozen);
  game.resume();game.state.effects.slow=3;const age=item.age,elapsed=game.state.elapsed;game.update(.04);
  near(item.age-age,.02);near(game.state.elapsed-elapsed,.04);
  const actor=getThrowerLayout(game.width,game.height,'normal')[0],pose=getThrowerPose(actor,item.age,item.launch.windup);
  near(item.x,pose.handX);near(item.y,pose.handY);
  advance(game,1.2);const flightAge=item.age-item.launch.windup;
  assert.ok(flightAge>item.launch.arc);near(item.x,item.launch.laneX);
  near(item.y,item.launch.fromY+item.launch.initialVy*flightAge+.5*item.gravity*flightAge*flightAge);
  near(item.vy,item.launch.initialVy+item.gravity*flightAge);
});

test('analytical throws are independent of frame subdivision and retain the actual release point',()=>{
  const {game:first}=setup('hard'),{game:second}=setup('hard');
  const a=first._spawnContent('streak',1),b=second._spawnContent('streak',1);
  for(let frame=0;frame<14;frame++)first.update(.05);for(let frame=0;frame<70;frame++)second.update(.01);
  for(const key of ['age','x','y','vy'])near(a[key],b[key],key);
  assert.deepEqual(a.launch,b.launch);assert.ok(a.y<a.launch.fromY);
});

test('resizing and restoring midwindup or midflight retain hand contact and continuous future trajectories',()=>{
  for(const age of [.1,.8]){
    const {game,storage}=setup('hard',{width:800,height:600}),item=game._spawnContent('homework',1);advance(game,age);
    const before=structuredClone(item);game.resize(390,844);
    if(age<item.launch.windup){const actor=getThrowerLayout(390,844,'hard')[1],pose=getThrowerPose(actor,item.age,item.launch.windup),release=getThrowerPose(actor,item.launch.windup,item.launch.windup);
      near(item.x,pose.handX);near(item.y,pose.handY);near(item.launch.fromX,release.handX);near(item.launch.fromY,release.handY);
    }else{near(item.x,before.x*390/800);near(item.y,before.y*844/600);near(item.launch.fromX,before.launch.fromX*390/800);near(item.launch.fromY,before.launch.fromY*844/600);}
    near(item.launch.laneX,before.launch.laneX*390/800);near(item.launch.initialVy,before.launch.initialVy*844/600);
    game.pause();const restored=new NinjaGame({storage,width:390,height:844});
    assert.equal(restored.storageFailed,false);assert.deepEqual(restored.state.objects,game.state.objects);
    game.resume();restored.resume();
    for(let frame=0;frame<20;frame++){game.update(.05);restored.update(.05);}
    assert.deepEqual(restored.state.objects,game.state.objects);
  }
});

test('legacy raw trajectories remain usable and untrusted launch metadata is discarded on restore',()=>{
  const {game,storage}=setup(),raw=game._spawnContent('streak');
  assert.equal(raw.launch,undefined);assert.ok(raw.y>game.height);const before=structuredClone(raw);game.update(.05);
  near(raw.x,before.x+before.vx*.05);near(raw.y,before.y+before.vy*.05+.5*before.gravity*.05*.05);
  game.pause();const valid=JSON.parse(storage.getItem(STORAGE_KEY));
  for(const launch of [{throwerIndex:3,fromX:50,fromY:100,laneX:200,windup:.22,arc:.3,initialVy:-300},{throwerIndex:0,fromX:'unsafe',fromY:100,laneX:200,windup:.22,arc:.3,initialVy:-300},{throwerIndex:0,fromX:50,fromY:100,laneX:200,windup:.22,arc:0,initialVy:-300}]){
    const malformed=structuredClone(valid);malformed.state.objects[0].launch=launch;storage.setItem(STORAGE_KEY,JSON.stringify(malformed));
    const restored=new NinjaGame({storage,width:1000,height:700});assert.equal(restored.storageFailed,false);assert.equal(restored.state.objects[0].launch,undefined);
  }
});

test('very late open runs keep a playable interval after the throw reaches its lane',()=>{
  const {game}=setup('hard');game.start({mode:'open',difficulty:'hard'});game.nextLevel();game.state.spawnTimer=100;
  game.state.elapsed=1000000;game.state.stageElapsed=1000000;game.state.speedFactor=getOpenSpeedFactor('hard',game.state.elapsed);
  const item=game._spawnContent('streak',0);assert.ok(item.launch.arc<=.15);
  advance(game,item.launch.windup+item.launch.arc+.01);assert.ok(game.state.objects.includes(item));assert.equal(isThrowReady(item),true);
  assert.ok(swipe(game,item).some(event=>event.type==='sliced'));assert.equal(game.state.lives,3);
});

test('the gentle Open start grants a real five-second reaction window after its first hand throw',()=>{
  for(const [width,height] of [[390,540],[1000,700]]){
    const {game}=setup('normal',{width,height});game.start({mode:'open'});game.nextLevel();
    while(!game.state.objects.length)game.update(.05);
    const item=game.state.objects[0],started=game.state.elapsed;game.state.spawnTimer=100;
    assert.equal(item.contentId,'streak');assert.equal(isThrowReady(item),false);
    while(game.state.elapsed-started<5-.0000001)game.update(.05);
    assert.ok(game.state.objects.includes(item),'a slow-flight parameter must not cause an earlier gravity overshoot');
    assert.equal(isThrowReady(item),true);assert.equal(game.state.lives,3);assert.ok(item.y+item.radius>=0);
    while(game.state.objects.includes(item))game.update(.05);
    assert.ok(game.state.elapsed-started<6.5);assert.equal(game.state.lives,2,'only the eventual missed distraction costs a heart');
  }
});

test('an old third Open thrower cannot restore invalid hand indices into the unified squad',()=>{
  const {game,storage}=setup('hard');game._spawnContent('streak',2);game.pause();
  const saved=JSON.parse(storage.getItem(STORAGE_KEY));Object.assign(saved.state,{mode:'open',difficulty:'hard',stageIndex:0,levelIndex:0,duration:0,remaining:0});
  delete saved.state.openRuleset;storage.setItem(STORAGE_KEY,JSON.stringify(saved));
  const restored=new NinjaGame({storage,width:1000,height:700});assert.equal(restored.storageFailed,false);
  assert.equal(restored.state.openRuleset,'legacy');assert.equal(restored.state.objects[0].launch,undefined);
  assert.equal(restored.resume().ok,true);assert.doesNotThrow(()=>restored.update(.05));assert.doesNotThrow(()=>restored.resize(390,650));
});
