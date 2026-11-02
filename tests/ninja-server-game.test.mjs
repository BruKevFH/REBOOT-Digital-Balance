import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {Worker} from 'node:worker_threads';
import {fileURLToPath} from 'node:url';
import {createNinjaStore} from '../server/ninja-store.mjs';
import {createNinjaAuth} from '../server/ninja-auth.mjs';
import {createNinjaGameService,GAME_SERVICE_CONFIG} from '../server/ninja-game-service.mjs';
import {NinjaGame,OPEN_RULESET} from '../notification-ninja/src/game.js';
import {isThrowReady} from '../notification-ninja/src/throwers.js';
import {MAIN_MISSIONS} from '../notification-ninja/src/adventure.js';

const clone=value=>JSON.parse(JSON.stringify(value));
const password='a strong Ninja password 2026';
async function fixture(t,{disk=false,...config}={}){
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'ninja-v3-game-')),databasePath=disk?path.join(directory,'accounts.sqlite'):':memory:';
  const clock={now:Date.UTC(2026,9,30,12)},store=createNinjaStore({databasePath,now:()=>clock.now}),auth=createNinjaAuth(store,{now:()=>clock.now});
  const service=createNinjaGameService(store,{now:()=>clock.now,...config}),account=await auth.register({username:'Ninja Mira',password});
  t.after(()=>{store.close();fs.rmSync(directory,{recursive:true,force:true});});
  return {directory,databasePath,clock,store,auth,service,account,userId:account.user.id};
}
function start(f,body={}){return f.service.startRun(f.userId,{kind:'quick',context:'study',viewport:{width:800,height:700},...body});}
/** Real seeded simulation and public swipe calls. No client scores/profile writes are submitted. */
function trace(f,issued,{correctUntil=Infinity,stopAt=null,healthyStopAt=null,quickStop=false,collectPowerups=false}={}){
  let logicalTime=issued.startedAt;
  const game=new NinjaGame({storage:null,now:()=>logicalTime,seed:issued.seed,width:issued.initial.width,height:issued.initial.height});
  game.profile=clone(issued.initial.profile);game.state=clone(issued.initial.state);
  const commands=[];
  const call=(method,...args)=>{commands.push([method,clone(args)]);return game[method](...args);};
  call('nextLevel');
  if(quickStop)call('finishRound');
  for(let tick=0;tick<16000&&!game.state.ended;tick++){
    if(game.state.scene==='briefing'){call('nextLevel');continue;}
    if(game.state.scene==='limit-choice'){call('requestStop');continue;}
    if(stopAt!==null&&game.state.elapsed>=stopAt){call('finishRound');break;}
    if(healthyStopAt!==null&&game.state.elapsed>=healthyStopAt&&game.state.stopAvailable){call('requestStop');break;}
    if(game.state.elapsed<correctUntil)for(const item of [...game.state.objects]){
      if(game.state.ended)break;
      if((item.kind==='distraction'||collectPowerups&&item.kind==='powerup')&&isThrowReady(item))call('swipe',[{x:item.x,y:item.y-12},{x:item.x,y:item.y+12}]);
    }
    if(game.state.ended)break;
    logicalTime+=50;f.clock.now+=50;call('update',.05);
  }
  assert.equal(game.state.ended,true,'the actual public simulation reaches a result');
  return {game,commands};
}
const code=(expected)=>error=>error?.code===expected;

test('real seeded short round is replayed; derived score, progress, coins and notifications match gameplay',async t=>{
  const f=await fixture(t),issued=start(f),played=trace(f,issued);
  assert.equal(issued.initial.state.scene,'briefing');assert.equal(issued.initial.state.maxLives,5);assert.equal(issued.initial.profile.coins,0);
  const finished=f.service.finishRun(f.userId,issued.runId,{commands:played.commands});
  assert.equal(finished.run.verified,true);assert.equal(finished.run.score,played.game.state.score);assert.equal(finished.run.duration,played.game.state.elapsed);
  assert.equal(finished.run.awardedCoins,played.game.state.awardedCoins);assert.equal(finished.profile.coins,played.game.profile.coins);
  assert.equal(finished.profile.totalRuns,1);assert.equal(finished.profile.stats.correct,played.game.profile.stats.correct);
  assert.ok(finished.profile.achievements.includes('first-cut'));assert.ok(finished.profile.player.notifications.some(item=>item.id==='achievement:first-cut'));
  assert.equal(f.store.db.prepare('SELECT COUNT(*) AS n FROM ninja_ledger WHERE user_id=?').get(f.userId).n,1);
  assert.equal(f.service.leaderboard().entries.length,0,'finite runs never enter Open leaderboard');
});

test('idempotent finish credits once; conflicting replay and fabricated score fields are rejected',async t=>{
  const f=await fixture(t),issued=start(f),played=trace(f,issued),first=f.service.finishRun(f.userId,issued.runId,{commands:played.commands});
  const repeat=f.service.finishRun(f.userId,issued.runId,{commands:clone(played.commands)});
  assert.equal(repeat.replayed,true);assert.equal(repeat.profile.coins,first.profile.coins);assert.equal(repeat.revision,first.revision);
  assert.throws(()=>f.service.finishRun(f.userId,issued.runId,{commands:[...played.commands,['resize',[700,600]]]}),code('RUN_FINISH_CONFLICT'));
  assert.throws(()=>f.service.finishRun(f.userId,issued.runId,{commands:played.commands,score:9999999}),code('INVALID_REQUEST'));
  assert.equal(f.store.db.prepare('SELECT COUNT(*) AS n FROM ninja_ledger').get().n,1);
});

test('unknown commands, invalid steps, nonfinite coordinates and oversized logs cannot alter wallet',async t=>{
  const f=await fixture(t,{maxCommands:4}),issued=start(f),invalid=[
    [['_finishRun',['complete',[]]]],[['update',[.051]]],[['update',[Infinity]]],[['swipe',[[{x:NaN,y:10},{x:20,y:20}]]]],
    [['swipe',[Array.from({length:257},()=>({x:1,y:2}))]]],[['resize',[239,700]]],[['setPaused',['false']]],
    [['nextLevel',[]],['finishRound',[]],['update',[.01]]]
  ];
  for(const commands of invalid)assert.throws(()=>f.service.finishRun(f.userId,issued.runId,{commands}),code('INVALID_REQUEST'));
  assert.throws(()=>f.service.finishRun(f.userId,issued.runId,{commands:Array.from({length:5},()=>['update',[.01]])}),code('RUN_LOG_TOO_LARGE'));
  assert.equal(f.service.getState(f.userId).profile.coins,0);assert.equal(f.store.db.prepare('SELECT COUNT(*) AS n FROM ninja_ledger').get().n,0);
});

test('incomplete runs, impossible elapsed time, stolen IDs, expired and superseded runs are refused',async t=>{
  const f=await fixture(t),issued=start(f);
  assert.throws(()=>f.service.finishRun(f.userId,issued.runId,{commands:[['nextLevel',[]],['update',[.05]]]}),code('RUN_NOT_FINISHED'));
  const other=await f.auth.register({username:'Ninja Noah',password});
  assert.throws(()=>f.service.finishRun(other.user.id,issued.runId,{commands:[['finishRound',[]]]}),code('RUN_NOT_FOUND'));
  assert.throws(()=>f.service.publishRun(other.user.id,issued.runId),code('RUN_NOT_FOUND'));
  const played=trace(f,issued);f.clock.now=issued.startedAt;
  assert.throws(()=>f.service.finishRun(f.userId,issued.runId,{commands:played.commands}),code('IMPOSSIBLE_DURATION'));
  const next=start(f);assert.throws(()=>f.service.finishRun(f.userId,issued.runId,{commands:played.commands}),code('RUN_SUPERSEDED'));
  f.clock.now=next.expiresAt+1;assert.throws(()=>f.service.finishRun(f.userId,next.runId,{commands:[['finishRound',[]]]}),code('RUN_EXPIRED'));
  assert.equal(f.service.getState(f.userId).profile.coins,0);
});

test('server chooses independent random seed and unique sequence; invalid start does not cancel a good run',async t=>{
  const f=await fixture(t),first=start(f);
  for(const body of [{kind:'quick',context:'master'},{kind:'mission',missionId:'autoplay-overlord'},{kind:'normal',mode:'boss'},{kind:'normal',mode:'gaming'},{kind:'quick',context:'study',difficulty:'impossible'},{kind:'quick',context:'study',gamingLimit:4},{kind:'quick',context:'study',seed:'chosen'}])assert.throws(()=>start(f,body));
  assert.equal(f.store.db.prepare('SELECT status FROM ninja_runs WHERE id=?').get(first.runId).status,'active');
  const second=start(f);assert.notEqual(first.seed,second.seed);assert.notEqual(first.runId,second.runId);assert.equal(second.initial.state.runSerial,first.initial.state.runSerial+1);
  assert.equal(f.store.db.prepare("SELECT COUNT(*) AS n FROM ninja_runs WHERE user_id=? AND status='active'").get(f.userId).n,1);
});

test('explicit account training starts the actual tutorial and an early exit grants no reward',async t=>{
  const f=await fixture(t),issued=start(f,{kind:'normal',mode:'campaign',forceTutorial:true});
  assert.equal(issued.initial.state.isTutorial,true);assert.equal(issued.initial.state.maxLives,5);
  const played=trace(f,issued,{quickStop:true}),finished=f.service.finishRun(f.userId,issued.runId,{commands:played.commands});
  assert.equal(finished.profile.coins,0);assert.equal(finished.profile.totalRuns,0);assert.equal(finished.profile.tutorialCompleted,false);
});

test('all eighteen main missions genuinely replay in order and unlock chapters without purchasing worlds',async t=>{
  const f=await fixture(t);
  assert.equal(MAIN_MISSIONS.length,18);
  for(const mission of MAIN_MISSIONS){
    const issued=start(f,{kind:'mission',missionId:mission.id,context:undefined});
    assert.equal(issued.initial.state.missionId,mission.id);assert.equal(issued.initial.state.duration,mission.duration);
    const played=trace(f,issued,{healthyStopAt:mission.objective.metric==='healthy-stop'?mission.objective.minElapsed:null});
    const finished=f.service.finishRun(f.userId,issued.runId,{commands:played.commands});
    assert.ok(finished.profile.adventure.completed.includes(mission.id),`${mission.id} completed by replay`);
    assert.ok(finished.profile.adventure.best[mission.id].completed,`${mission.id} best result persisted`);
    assert.equal(finished.profile.adventure.claimed.includes(mission.id),false,'mission reward stays explicit');
    const claimed=f.service.action(f.userId,{type:'career.claim',id:mission.id,idempotencyKey:`campaign-claim-${mission.id}`});
    assert.equal(claimed.profile.coins,finished.profile.coins+mission.reward);
  }
  const final=f.service.getState(f.userId);assert.equal(final.profile.adventure.completed.filter(id=>MAIN_MISSIONS.some(m=>m.id===id)).length,18);
  assert.ok(final.profile.unlockedWorlds.includes('gaming'));assert.ok(final.profile.unlockedWorlds.includes('sleep'));
  assert.equal(f.store.db.prepare("SELECT COUNT(*) AS n FROM ninja_ledger WHERE kind='world.buy'").get().n,0);
});

test('atomic purchases use server prices/prerequisites, once per key and preserve wallet constraints',async t=>{
  const f=await fixture(t);f.store.db.prepare('UPDATE wallets SET balance=120 WHERE user_id=?').run(f.userId);
  const request={type:'skin.buy',id:'solar',idempotencyKey:'buy-solar-unique'};
  const bought=f.service.action(f.userId,request);assert.equal(bought.profile.coins,40);assert.ok(bought.profile.unlockedSkins.includes('solar'));
  const duplicate=f.service.action(f.userId,request);assert.equal(duplicate.replayed,true);assert.equal(duplicate.profile.coins,40);assert.equal(duplicate.revision,bought.revision);
  assert.throws(()=>f.service.action(f.userId,{...request,id:'mint'}),code('IDEMPOTENCY_CONFLICT'));
  assert.throws(()=>f.service.action(f.userId,{...request,idempotencyKey:'buy-solar-again'}),code('ACTION_REJECTED'));
  assert.throws(()=>f.service.action(f.userId,{type:'skin.buy',id:'mint',payload:{cost:0},idempotencyKey:'buy-mint-forged'}),code('ACTION_REJECTED'));
  assert.throws(()=>f.service.action(f.userId,{type:'skill.buy',id:'slow-super',idempotencyKey:'skill-no-parent'}),code('ACTION_REJECTED'));
  const equipped=f.service.action(f.userId,{type:'skin.equip',id:'solar',idempotencyKey:'equip-solar-now'});assert.equal(equipped.profile.selectedSkin,'solar');assert.equal(equipped.profile.coins,40);
  assert.equal(f.store.db.prepare('SELECT COUNT(*) AS n FROM ninja_ledger WHERE delta<0').get().n,1);
  assert.throws(()=>f.store.db.prepare('UPDATE wallets SET balance=-1 WHERE user_id=?').run(f.userId),/CHECK/);
  assert.throws(()=>f.service.action(f.userId,{type:'toString',idempotencyKey:'unknown-action-key'}),code('INVALID_REQUEST'));
});

test('a failed profile write rolls back wallet debit, ownership, ledger and retry marker together',async t=>{
  const f=await fixture(t);f.store.db.prepare('UPDATE wallets SET balance=100 WHERE user_id=?').run(f.userId);
  const request={type:'skin.buy',id:'solar',idempotencyKey:'atomic-rollback-buy'},original=f.store.putProfile;
  f.store.putProfile=()=>{throw new Error('simulated disk write failure');};
  try{assert.throws(()=>f.service.action(f.userId,request),/simulated disk write failure/);}finally{f.store.putProfile=original;}
  assert.equal(f.store.getProfile(f.userId).profile.coins,100);assert.deepEqual(f.store.getProfile(f.userId).profile.unlockedSkins,['default']);
  assert.equal(f.store.db.prepare('SELECT COUNT(*) AS n FROM ninja_ledger').get().n,0);assert.equal(f.store.db.prepare('SELECT COUNT(*) AS n FROM ninja_actions').get().n,0);
  const retry=f.service.action(f.userId,request);assert.equal(retry.profile.coins,20);assert.ok(retry.profile.unlockedSkins.includes('solar'));
});

test('unearned claims cannot mint coins; legitimate reward claimed once even using a fresh key',async t=>{
  const f=await fixture(t);
  assert.throws(()=>f.service.action(f.userId,{type:'achievement.claim',id:'first-cut',idempotencyKey:'claim-unearned-one'}),code('ACTION_REJECTED'));
  const issued=start(f),played=trace(f,issued),finished=f.service.finishRun(f.userId,issued.runId,{commands:played.commands});
  const request={type:'achievement.claim',id:'first-cut',idempotencyKey:'claim-first-cut-one'};
  const claimed=f.service.action(f.userId,request);assert.equal(claimed.profile.coins,finished.profile.coins+3);assert.ok(claimed.profile.claimedAchievements.includes('first-cut'));
  assert.equal(f.service.action(f.userId,request).profile.coins,claimed.profile.coins);
  assert.throws(()=>f.service.action(f.userId,{...request,idempotencyKey:'claim-first-cut-new'}),code('ACTION_REJECTED'));
  assert.equal(f.service.getState(f.userId).profile.coins,claimed.profile.coins);
});

test('a run merges into latest profile without erasing purchases, claim, settings or equipped appearance',async t=>{
  const f=await fixture(t);f.store.db.prepare('UPDATE wallets SET balance=200 WHERE user_id=?').run(f.userId);
  const issued=start(f),played=trace(f,issued);
  f.service.action(f.userId,{type:'skin.buy',id:'solar',idempotencyKey:'paused-buy-solar'});
  f.service.action(f.userId,{type:'skin.equip',id:'solar',idempotencyKey:'paused-equip-solar'});
  f.service.action(f.userId,{type:'skill.buy',id:'focus-root',idempotencyKey:'paused-buy-focus'});
  f.service.action(f.userId,{type:'settings.update',payload:{language:'en',musicVolume:.2},idempotencyKey:'paused-settings'});
  f.auth.rename(f.userId,'Mira Renamed');
  const finished=f.service.finishRun(f.userId,issued.runId,{commands:played.commands});
  assert.equal(finished.profile.coins,85+played.game.state.awardedCoins);assert.equal(finished.profile.selectedSkin,'solar');assert.equal(finished.profile.settings.language,'en');assert.equal(finished.profile.settings.musicVolume,.2);
  assert.ok(finished.profile.unlockedSkills.includes('focus-root'));assert.equal(finished.profile.player.username,'Mira Renamed');assert.equal(finished.profile.stats.correct,played.game.profile.stats.correct);
  assert.equal(issued.initial.state.skin,'default');assert.deepEqual(issued.initial.state.skillIds,[],'in-flight loadout remains frozen');
});

test('notification view only marks its own notification, keeping other notices and unclaimed rewards',async t=>{
  const f=await fixture(t),issued=start(f),played=trace(f,issued),finished=f.service.finishRun(f.userId,issued.runId,{commands:played.commands});
  const target=finished.profile.player.notifications.find(item=>item.id==='achievement:first-cut');assert.ok(target);
  const before=finished.profile.coins,result=f.service.action(f.userId,{type:'notification.read',id:target.id,idempotencyKey:'read-first-notice'});
  assert.equal(result.profile.player.notifications.find(item=>item.id===target.id).read,true);
  assert.equal(result.profile.claimedAchievements.includes('first-cut'),false);assert.equal(result.profile.coins,before);
  assert.ok(result.profile.player.notifications.filter(item=>item.id!==target.id).every(item=>item.read===false));
});

test('safe one-time guest upgrade imports only preferences/tutorial; arbitrary local economy is ignored',async t=>{
  const f=await fixture(t);
  const imported=f.service.action(f.userId,{type:'guest.import',payload:{tutorialCompleted:true,settings:{language:'en',screenShake:false},coins:999999,totalRuns:50,unlockedSkins:['neon'],stats:{correct:9999}},idempotencyKey:'guest-import-first'});
  assert.equal(imported.profile.tutorialCompleted,true);assert.equal(imported.profile.coins,0);assert.equal(imported.profile.totalRuns,0);assert.deepEqual(imported.profile.unlockedSkins,['default']);assert.equal(imported.profile.stats.correct,0);assert.equal(imported.profile.settings.language,'en');assert.equal(imported.action.ignoredProgress,true);
  const repeated=f.service.action(f.userId,{type:'guest.import',payload:{tutorialCompleted:false,settings:{language:'de'},coins:999},idempotencyKey:'guest-import-second'});
  assert.equal(repeated.action.alreadyImported,true);assert.equal(repeated.profile.settings.language,'en');assert.equal(repeated.profile.coins,0);
  assert.throws(()=>f.service.action(f.userId,{type:'settings.update',payload:{coins:999},idempotencyKey:'settings-cannot-coins'}),code('INVALID_REQUEST'));
  assert.throws(()=>f.service.action(f.userId,{type:'settings.update',payload:{musicVolume:2},idempotencyKey:'settings-volume-bound'}),code('INVALID_REQUEST'));
});

test('Open uses frozen fair rules; actual lives-end needs explicit publication and only best score per player appears',async t=>{
  const f=await fixture(t);
  const issue=start(f,{kind:'normal',mode:'open',difficulty:'hard'});assert.equal(issue.ruleset,OPEN_RULESET);assert.equal(issue.initial.state.maxLives,3);assert.equal(issue.initial.state.difficulty,'normal');assert.deepEqual(issue.initial.state.skillIds,[]);assert.equal(issue.initial.state.selectedSuper,null);
  const played=trace(f,issue,{correctUntil:45}),finished=f.service.finishRun(f.userId,issue.runId,{commands:played.commands});
  assert.equal(finished.run.result,'lives');assert.ok(finished.run.decisions>0);assert.equal(f.service.leaderboard().entries.length,0);
  const published=f.service.publishRun(f.userId,issue.runId);assert.equal(published.run.published,true);assert.equal(published.leaderboard.entries.length,1);assert.equal(published.leaderboard.own.rank,1);
  const repeated=f.service.publishRun(f.userId,issue.runId);assert.equal(repeated.leaderboard.total,1);assert.equal(f.service.finishRun(f.userId,issue.runId,{commands:played.commands}).run.published,true);
  const next=start(f,{kind:'normal',mode:'open'}),worse=trace(f,next,{correctUntil:8});f.service.finishRun(f.userId,next.runId,{commands:worse.commands});f.service.publishRun(f.userId,next.runId);
  const board=f.service.leaderboard(f.userId);assert.equal(board.total,1);assert.equal(board.entries[0].score,finished.run.score);assert.equal(board.entries[0].mine,true);assert.equal('userId'in board.entries[0],false);assert.equal('runId'in board.entries[0],false);
});

test('manual exit and empty runs remain unranked and cannot farm progression',async t=>{
  const f=await fixture(t);
  for(let i=0;i<4;i++){
    const issued=start(f,{kind:'normal',mode:'open'}),played=trace(f,issued,{quickStop:true}),finished=f.service.finishRun(f.userId,issued.runId,{commands:played.commands});
    assert.equal(finished.run.result,'stopped');assert.equal(finished.run.ruleset,null);assert.equal(finished.profile.coins,0);assert.equal(finished.profile.totalRuns,0);
    assert.throws(()=>f.service.publishRun(f.userId,issued.runId),code('RUN_NOT_RANKED'));
  }
  assert.equal(f.service.leaderboard().total,0);
});

test('separate players share one verified leaderboard, own rank and public rename; deletion removes all owned rows',async t=>{
  const f=await fixture(t),first=start(f,{kind:'normal',mode:'open'}),p1=trace(f,first,{correctUntil:12});f.service.finishRun(f.userId,first.runId,{commands:p1.commands});f.service.publishRun(f.userId,first.runId);
  const second=await f.auth.register({username:'Ninja Noah',password}),two={...f,userId:second.user.id};
  const issue2=start(two,{kind:'normal',mode:'open'}),p2=trace(two,issue2,{correctUntil:55});f.service.finishRun(two.userId,issue2.runId,{commands:p2.commands});f.service.publishRun(two.userId,issue2.runId);
  const board=f.service.leaderboard(f.userId);assert.equal(board.total,2);assert.equal(board.entries[0].username,'Ninja Noah');assert.equal(board.own.rank,2);assert.equal(board.entries[1].mine,true);
  f.auth.rename(two.userId,'Noah Shadow');assert.equal(f.service.leaderboard().entries[0].username,'Noah Shadow');
  await f.auth.deleteAccount(two.userId,{password});assert.equal(f.service.leaderboard().total,1);assert.equal(f.store.db.prepare('SELECT COUNT(*) AS n FROM ninja_runs WHERE user_id=?').get(two.userId).n,0);assert.equal(f.store.db.prepare('SELECT COUNT(*) AS n FROM ninja_ledger WHERE user_id=?').get(two.userId).n,0);
});

test('wallet, run replay idempotency, claims and published score persist across independent service restart',async t=>{
  const f=await fixture(t,{disk:true}),issued=start(f,{kind:'normal',mode:'open'}),played=trace(f,issued,{correctUntil:45}),finished=f.service.finishRun(f.userId,issued.runId,{commands:played.commands});
  f.service.publishRun(f.userId,issued.runId);const claim=f.service.action(f.userId,{type:'achievement.claim',id:'first-cut',idempotencyKey:'persistent-cut-claim'});
  const secondStore=createNinjaStore({databasePath:f.databasePath,now:()=>f.clock.now});t.after(()=>secondStore.close());const secondService=createNinjaGameService(secondStore,{now:()=>f.clock.now}),secondAuth=createNinjaAuth(secondStore,{now:()=>f.clock.now});
  assert.equal(secondAuth.authenticate(f.account.token).id,f.userId);assert.equal((await secondAuth.login({username:'Ninja Mira',password})).profile.coins,claim.profile.coins);
  assert.equal(secondService.leaderboard().entries[0].score,finished.run.score);const duplicate=secondService.finishRun(f.userId,issued.runId,{commands:played.commands});assert.equal(duplicate.replayed,true);assert.equal(duplicate.profile.coins,claim.profile.coins);assert.ok(duplicate.profile.claimedAchievements.includes('first-cut'));
  assert.equal(secondService.action(f.userId,{type:'achievement.claim',id:'first-cut',idempotencyKey:'persistent-cut-claim'}).replayed,true);
});

const root=fileURLToPath(new URL('../',import.meta.url));
async function concurrentActions(databasePath,userId,requests,{now=Date.UTC(2026,9,30,13),operation='action'}={}){
  const barrier=new SharedArrayBuffer(4),array=new Int32Array(barrier),workers=[];
  const ready=[],done=[];
  for(const request of requests){
    const worker=new Worker(`const {workerData,parentPort}=require('node:worker_threads');
      (async()=>{let store;try{
        const {createNinjaStore}=await import(workerData.storeURL),{createNinjaGameService}=await import(workerData.gameURL);
        store=createNinjaStore({databasePath:workerData.databasePath,now:()=>workerData.now});const service=createNinjaGameService(store,{now:()=>workerData.now});
        parentPort.postMessage({ready:true});Atomics.wait(new Int32Array(workerData.barrier),0,0);
        const result=workerData.operation==='finish'?service.finishRun(workerData.userId,workerData.request.runId,{commands:workerData.request.commands}):service.action(workerData.userId,workerData.request);parentPort.postMessage({ok:true,coins:result.profile.coins,replayed:result.replayed===true});
      }catch(error){parentPort.postMessage({ok:false,code:error.code,message:error.message});}finally{store?.close();}})();`,{eval:true,workerData:{databasePath,userId,request,barrier,now,operation,storeURL:new URL(`file://${root}server/ninja-store.mjs`).href,gameURL:new URL(`file://${root}server/ninja-game-service.mjs`).href}});
    workers.push(worker);
    ready.push(new Promise((resolve,reject)=>{worker.on('message',msg=>{if(msg.ready)resolve();else if(msg.ok===false)reject(new Error(msg.message));});worker.on('error',reject);}));
    done.push(new Promise((resolve,reject)=>{worker.on('message',msg=>{if(!msg.ready)resolve(msg);});worker.on('error',reject);worker.on('exit',exit=>{if(exit!==0)reject(new Error(`Worker exited ${exit}`));});}));
  }
  try{await Promise.all(ready);Atomics.store(array,0,1);Atomics.notify(array,0,requests.length);return await Promise.all(done);}
  finally{await Promise.all(workers.map(worker=>worker.terminate()));}
}

test('genuinely concurrent independent SQLite clients cannot overspend a shared account wallet',async t=>{
  const f=await fixture(t,{disk:true});f.store.db.prepare('UPDATE wallets SET balance=100 WHERE user_id=?').run(f.userId);
  const results=await concurrentActions(f.databasePath,f.userId,[{type:'skin.buy',id:'solar',idempotencyKey:'concurrent-solar-key'},{type:'skill.buy',id:'focus-root',idempotencyKey:'concurrent-focus-key'}]);
  assert.equal(results.filter(row=>row.ok).length,1);assert.equal(results.filter(row=>!row.ok&&row.code==='ACTION_REJECTED').length,1);
  const state=f.service.getState(f.userId);assert.ok([20,65].includes(state.profile.coins));assert.equal(f.store.db.prepare('SELECT COUNT(*) AS n FROM ninja_ledger WHERE delta<0').get().n,1);
});

test('genuinely concurrent duplicate claim with different retry keys credits only once',async t=>{
  const f=await fixture(t,{disk:true}),issued=start(f),played=trace(f,issued),finished=f.service.finishRun(f.userId,issued.runId,{commands:played.commands});
  const results=await concurrentActions(f.databasePath,f.userId,[{type:'achievement.claim',id:'first-cut',idempotencyKey:'concurrent-claim-one'},{type:'achievement.claim',id:'first-cut',idempotencyKey:'concurrent-claim-two'}]);
  assert.equal(results.filter(row=>row.ok).length,1);assert.equal(f.service.getState(f.userId).profile.coins,finished.profile.coins+3);
  assert.equal(f.store.db.prepare("SELECT COUNT(*) AS n FROM ninja_ledger WHERE kind='achievement.claim'").get().n,1);
});

test('genuinely concurrent identical run finishes replay safely and credit the account only once',async t=>{
  const f=await fixture(t,{disk:true}),issued=start(f),played=trace(f,issued),request={runId:issued.runId,commands:played.commands};
  const results=await concurrentActions(f.databasePath,f.userId,[request,clone(request)],{now:f.clock.now,operation:'finish'});
  assert.equal(results.filter(row=>row.ok).length,2);assert.equal(results.filter(row=>row.replayed).length,1);
  assert.equal(f.service.getState(f.userId).profile.coins,played.game.state.awardedCoins);assert.equal(f.service.getState(f.userId).profile.totalRuns,1);
  assert.equal(f.store.db.prepare("SELECT COUNT(*) AS n FROM ninja_ledger WHERE kind='run.reward'").get().n,1);
});

test('account challenges consistently use UTC even in a different server/browser timezone',async t=>{
  const previous=process.env.TZ;process.env.TZ='Pacific/Honolulu';
  try{
    const f=await fixture(t);f.clock.now=Date.UTC(2026,9,26,0,30);
    const state=f.service.getState(f.userId);assert.equal(state.calendar,'utc');assert.equal(state.serverNow,f.clock.now);assert.equal(state.profile.accountCalendar,'utc');assert.equal(state.profile.journey.day,'2026-10-26');assert.equal(state.profile.adventure.weekly.week,'2026-W44');
    const issued=start(f);assert.equal(issued.initial.profile.accountCalendar,'utc');assert.equal(issued.initial.profile.journey.day,'2026-10-26');
  }finally{if(previous===undefined)delete process.env.TZ;else process.env.TZ=previous;}
});

test('configured safeguards are bounded and invalid service configuration is rejected',async t=>{
  const f=await fixture(t);assert.equal(GAME_SERVICE_CONFIG.ruleset,'open-v2');
  for(const config of [{maxCommands:0},{maxLogBytes:1},{runTTL:-1},{wallClockTolerance:999999}])assert.throws(()=>createNinjaGameService(f.store,config),TypeError);
  assert.throws(()=>f.service.leaderboard(null,{ruleset:'old'}),code('INVALID_REQUEST'));assert.throws(()=>f.service.leaderboard(null,{limit:101}),code('INVALID_REQUEST'));
});
