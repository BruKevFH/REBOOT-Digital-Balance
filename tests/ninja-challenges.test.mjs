import test from 'node:test';
import assert from 'node:assert/strict';
import {NinjaGame,getDailyChallenge,STORAGE_KEY} from '../notification-ninja/src/game.js';
import {isThrowReady} from '../notification-ninja/src/throwers.js';
const storage=()=>{const entries=new Map();return{getItem:k=>entries.get(k)??null,setItem:(k,v)=>entries.set(k,v)};};
const clone=value=>JSON.parse(JSON.stringify(value));
function decisions(game){const events=[];for(const object of [...game.state.objects])if(object.kind==='distraction'&&isThrowReady(object))events.push(...game.swipe([{x:object.x,y:object.y-12},{x:object.x,y:object.y+12}]));return events;}
function play(game,predicate,max=30000){const events=[];for(let frame=0;frame<max&&!predicate();frame++){if(game.state.scene==='briefing')events.push(...game.nextLevel().events);events.push(...game.update(.05),...decisions(game));}assert.ok(predicate(),'challenge must actually reach its expected outcome');return events;}

test('Boss Rush defeats all three distinct encounters sequentially with one purse and three shared hearts',()=>{
  const game=new NinjaGame({storage:null,width:322,height:754});
  assert.equal(game.startBossRush().ok,true);assert.equal(game.state.mode,'boss-rush');assert.equal(game.state.maxLives,3);assert.equal(game.state.duration,0);
  const events=play(game,()=>game.state.ended);
  assert.deepEqual(events.filter(e=>e.type==='boss-defeated').map(e=>e.id),['scout','guardian','overlord']);
  assert.deepEqual(events.filter(e=>e.type==='boss-rush-next').map(e=>e.id),['guardian','overlord']);
  assert.deepEqual(game.state.bossRush.completed,['scout','guardian','overlord']);assert.equal(game.state.result,'complete');
  assert.equal(game.state.lives,3);assert.equal(game.profile.totalRuns,1);assert.ok(game.state.metrics.correctDecisions>=84);
  assert.equal(events.filter(e=>e.type==='ended').length,1);assert.ok(game.profile.highScores['boss-rush']>0);
  const coins=game.profile.coins;game.update(.05);assert.equal(game.profile.coins,coins);
});

test('Boss Rush resumes between encounters without repeating rewards or restoring spent hearts',()=>{
  const store=storage(),game=new NinjaGame({storage:store,width:322,height:754});
  game.startBossRush();game.state.lives=2;
  play(game,()=>game.state.bossRush.index===1);assert.equal(game.state.scene,'briefing');game.save();
  const restored=new NinjaGame({storage:store,width:322,height:754});
  assert.deepEqual(restored.state.bossRush,{index:1,completed:['scout']});assert.equal(restored.state.boss.id,'guardian');assert.equal(restored.state.lives,2);assert.equal(restored.profile.totalRuns,0);
  play(restored,()=>restored.state.ended);assert.equal(restored.state.result,'complete');assert.equal(restored.profile.totalRuns,1);
  const save=JSON.parse(store.getItem(STORAGE_KEY));save.state.bossRush.completed=['guardian','scout','overlord'];store.setItem(STORAGE_KEY,JSON.stringify(save));
  assert.equal(new NinjaGame({storage:store}).state.started,false);
});

test('the authored daily challenge uses an exact validated day and identical daily patterns across users',()=>{
  assert.equal(getDailyChallenge('2026-02-30'),null);assert.equal(getDailyChallenge('tomorrow'),null);
  const traces=[];
  for(const seed of ['user-one','user-two']){
    const game=new NinjaGame({storage:null,seed,width:322,height:754});
    assert.equal(game.startDailyChallenge({day:'2026-11-07'}).ok,true);assert.equal(game.state.mode,'daily');assert.equal(game.state.duration,60);assert.equal(game.state.maxLives,3);assert.equal(game.state.dailyChallenge.practice,true);
    const events=play(game,()=>game.state.ended);assert.equal(game.state.result,'complete');assert.ok(game.state.metrics.correctDecisions>10);assert.equal(game.profile.totalRuns,1);
    traces.push(events.filter(e=>e.type==='spawned').map(({contentId,x,y})=>({contentId,x,y})));
  }
  assert.ok(traces[0].length>10);assert.deepEqual(traces[0],traces[1]);
  assert.notEqual(getDailyChallenge('2026-11-07').context,getDailyChallenge('2026-11-08').context);
});

test('accounts need a server-issued daily day and active daily saves keep that day over midnight',()=>{
  const store=storage(),now=Date.UTC(2026,10,7,23,59),game=new NinjaGame({storage:store,now:()=>now,width:322,height:754});
  game.profile.accountCalendar='utc';assert.equal(game.startDailyChallenge().ok,false);
  assert.equal(game.start({mode:'daily',challengeDay:'2026-11-07'}).ok,true);assert.equal(game.state.dailyChallenge.practice,false);
  game.nextLevel();for(let i=0;i<50;i++){game.update(.05);decisions(game);}game.save();
  const snapshot=clone(game.state),restored=new NinjaGame({storage:store,now:()=>now+120000,width:322,height:754});
  assert.equal(restored.state.dailyChallenge.day,'2026-11-07');assert.equal(restored.state.dailyChallenge.practice,false);assert.equal(restored.state.rng,snapshot.rng);
  play(restored,()=>restored.state.ended);assert.ok(Object.values(restored.profile.journey.progress).every(value=>value===0),'yesterday challenge cannot fill next UTC day tasks');
});
