import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {NINJA_RANKS,DAILY_CHALLENGES,normalizeJourney,getRank,getDailyChallenges,recordDailyRun,claimDailyReward,applyRankUnlocks} from '../notification-ninja/src/journey.js';

const copy=value=>JSON.parse(JSON.stringify(value));
const day=(offset=0)=>new Date(2026,9,16+offset,12).getTime();
const profile=(extra={})=>({coins:71,totalRuns:0,stats:{correct:0,superUses:0,coinsEarned:0},unlockedSkins:['default','solar'],selectedSkin:'solar',...extra});
function finish(p,extra={},now=day()) {
  p.totalRuns++;
  const state={ended:true,credited:true,isTutorial:false,mode:'open',result:'lives',runSerial:p.totalRuns,
    startedAt:now+p.totalRuns*90000,finishedAt:now+p.totalRuns*90000+80000,elapsed:80,bestDecisionStreak:50,
    metrics:{correctDecisions:40,cuts:25,usefulPassed:15,flowTriggers:8,usefulMistakes:0,missedDistractions:0},...extra};
  state.metrics={correctDecisions:40,cuts:25,usefulPassed:15,flowTriggers:8,usefulMistakes:0,missedDistractions:0,...extra.metrics};
  return {state,events:recordDailyRun(p,state,now)};
}
function dateWith(id) {
  for(let offset=0;offset<3;offset++)if(getDailyChallenges({},day(offset)).some(task=>task.id===id))return day(offset);
  throw new Error(`Missing authored task ${id}`);
}

test('daily sets contain exactly three reachable rotating tasks and at most nine claimable coins',()=>{
  const previous=[];
  for(let offset=0;offset<12;offset++) {
    const tasks=getDailyChallenges({},day(offset));
    assert.equal(tasks.length,3);
    assert.equal(new Set(tasks.map(task=>task.id)).size,3);
    assert.deepEqual(tasks.map(task=>task.reward),[2,3,4]);
    assert.equal(tasks.reduce((sum,task)=>sum+task.reward,0),9);
    assert.ok(tasks.every(task=>task.current===0&&!task.completed&&!task.claimed&&task.title&&task.description&&task.icon));
    if(previous.length)assert.ok(tasks.every((task,index)=>task.id!==previous[index]));
    previous.splice(0,3,...tasks.map(task=>task.id));
  }
  assert.equal(DAILY_CHALLENGES.length,9);
  assert.equal(new Set(DAILY_CHALLENGES.map(task=>task.id)).size,9);
});

test('journey migration leaves every old wallet, record and purchased unlock intact',()=>{
  const p=profile({highScores:{open:4321},unlockedWorlds:['study','gaming'],claimedAchievements:['first-cut']});
  const before=copy(p),normalized=normalizeJourney(p,day());
  const {journey,...old}=p;
  assert.deepEqual(old,before);
  assert.equal(normalized,journey);
  assert.equal(journey.version,1);
  assert.equal(journey.day,'2026-10-16');
  assert.equal(journey.lastRunOrdinal,0);
  assert.deepEqual(journey.claimed,[]);
  assert.deepEqual(journey.seenRanks,[]);
  assert.doesNotThrow(()=>normalizeJourney(null,NaN));
  assert.equal(normalizeJourney(undefined,day()).day,'2026-10-16');
});

test('normalization bounds counters, rejects unknown keys and future-rank acknowledgements',()=>{
  const p=profile({totalRuns:4});
  const tasks=getDailyChallenges(p,day());
  p.journey={day:'2026-10-16',version:999,evil:true,
    progress:{[tasks[0].id]:1e100,[tasks[1].id]:-4,[tasks[2].id]:'50',unknown:100},
    claimed:[tasks[0].id,tasks[0].id,tasks[1].id,'unknown'],seenRanks:['unknown','grandmaster','shadow'],
    lastRunOrdinal:1e100,lastRunId:'<script>bad</script>'};
  const normalized=normalizeJourney(p,day());
  assert.deepEqual(Object.keys(normalized).sort(),['version','day','progress','claimed','seenRanks','lastRunOrdinal','lastRunId'].sort());
  assert.deepEqual(normalized.progress,{[tasks[0].id]:tasks[0].target,[tasks[1].id]:0,[tasks[2].id]:0});
  assert.deepEqual(normalized.claimed,[tasks[0].id]);
  assert.deepEqual(normalized.seenRanks,[]);
  assert.equal(normalized.lastRunOrdinal,4);
  assert.equal(normalized.lastRunId,'');
});

test('qualified real run progress is capped and coins remain unclaimed until explicit collection',()=>{
  for(let offset=0;offset<3;offset++) {
    const now=day(offset),p=profile();
    const events=[];
    for(let index=0;index<3;index++)events.push(...finish(p,{},now).events);
    const tasks=getDailyChallenges(p,now);
    assert.ok(tasks.every(task=>task.completed&&!task.claimed&&task.current===task.target));
    assert.equal(events.length,3);
    assert.ok(events.every(event=>event.type==='daily-completed'&&event.day===tasks[0].day));
    assert.equal(p.coins,71);
    for(const task of tasks)assert.equal(claimDailyReward(p,task.id,now).ok,true);
    assert.equal(p.coins,80);
    assert.equal(p.stats.coinsEarned,9);
    assert.ok(getDailyChallenges(p,now).every(task=>task.claimed));
  }
});

test('run identity and credit ordinal prevent duplicate progress, including after reload',()=>{
  const p=profile(),first=finish(p),before=copy(p);
  assert.deepEqual(recordDailyRun(p,first.state,day()),[]);
  assert.deepEqual(p,before);
  const reloaded=copy(p);
  assert.deepEqual(recordDailyRun(reloaded,copy(first.state),day()),[]);
  assert.deepEqual(reloaded,before);
  // Incrementing a counter alone cannot replay the immediately previous run.
  reloaded.totalRuns++;
  const progress=copy(reloaded.journey.progress);
  assert.deepEqual(recordDailyRun(reloaded,first.state,day()),[]);
  assert.deepEqual(reloaded.journey.progress,progress);
});

test('training, unfinished and uncredited sessions never count towards daily rewards',()=>{
  for(const changes of [{isTutorial:true},{ended:false},{credited:false},{mode:'unknown'},{result:'quit'}]) {
    const p=profile();
    assert.deepEqual(finish(p,changes).events,[]);
    assert.ok(getDailyChallenges(p,day()).every(task=>task.current===0));
    assert.equal(p.journey.lastRunOrdinal,0);
  }
});

test('empty, very short and low-performance runs cannot farm daily progress',()=>{
  for(const changes of [{elapsed:0},{elapsed:14.9},{metrics:{correctDecisions:0}},{metrics:{correctDecisions:7}}]) {
    const p=profile();
    finish(p,changes);
    assert.ok(getDailyChallenges(p,day()).every(task=>task.current===0));
    assert.equal(p.journey.lastRunOrdinal,1);
    assert.equal(p.coins,71);
  }
  const p=profile();
  finish(p,{result:'healthy-stop',elapsed:8,metrics:{correctDecisions:8,cuts:6,usefulPassed:2,flowTriggers:1}});
  assert.ok(getDailyChallenges(p,day()).some(task=>task.current>0));
});

test('new local day resets tasks/claims without replaying yesterday or removing ranks',()=>{
  const p=profile({stats:{correct:400,coinsEarned:0}});
  applyRankUnlocks(p,day());
  const first=finish(p),rankOutfits=[...p.unlockedSkins],seen=[...p.journey.seenRanks];
  const finished=getDailyChallenges(p,day()).find(task=>task.completed);
  assert.ok(finished);
  claimDailyReward(p,finished.id,day());
  const balance=p.coins;
  const today=getDailyChallenges(p,day(1));
  assert.ok(today.every(task=>task.current===0&&!task.claimed&&!task.completed));
  assert.deepEqual(p.unlockedSkins,rankOutfits);
  assert.deepEqual(p.journey.seenRanks,seen);
  assert.deepEqual(recordDailyRun(p,first.state,day(1)),[]);
  assert.ok(getDailyChallenges(p,day(1)).every(task=>task.current===0));
  assert.equal(claimDailyReward(p,finished.id,day(1)).ok,false);
  assert.equal(p.coins,balance);
  finish(p,{},day(1));
  assert.ok(getDailyChallenges(p,day(1)).some(task=>task.current>0));
});

test('claiming is idempotent through reload and rejects unfinished or foreign tasks',()=>{
  const p=profile(),initial=getDailyChallenges(p,day());
  const before=copy(p);
  assert.equal(claimDailyReward(p,initial[0].id,day()).ok,false);
  assert.equal(claimDailyReward(p,'unknown',day()).ok,false);
  assert.deepEqual(p,before);
  finish(p);
  const task=getDailyChallenges(p,day()).find(item=>item.completed);
  assert.equal(claimDailyReward(p,task.id,day()).ok,true);
  const reloaded=copy(p),wallet=reloaded.coins,earned=reloaded.stats.coinsEarned;
  assert.equal(claimDailyReward(reloaded,task.id,day()).ok,false);
  assert.equal(reloaded.coins,wallet);
  assert.equal(reloaded.stats.coinsEarned,earned);
  assert.equal(claimDailyReward(null,task.id,day()).ok,false);
});

test('daily task metrics distinguish precision, correct streaks and Open Run survival',()=>{
  {
    const now=dateWith('precise-run'),p=profile();
    finish(p,{metrics:{correctDecisions:30,usefulMistakes:2,missedDistractions:1}},now);
    assert.equal(getDailyChallenges(p,now).find(task=>task.id==='precise-run').current,0);
    finish(p,{metrics:{correctDecisions:20,usefulMistakes:1,missedDistractions:1}},now);
    assert.equal(getDailyChallenges(p,now).find(task=>task.id==='precise-run').current,1);
  }
  {
    const now=dateWith('steady-combo'),p=profile();
    finish(p,{bestDecisionStreak:9,bestCombo:50},now);
    assert.equal(getDailyChallenges(p,now).find(task=>task.id==='steady-combo').current,9);
    finish(p,{bestDecisionStreak:14},now);
    assert.equal(getDailyChallenges(p,now).find(task=>task.id==='steady-combo').current,14);
    finish(p,{bestDecisionStreak:15},now);
    assert.equal(getDailyChallenges(p,now).find(task=>task.id==='steady-combo').completed,true);
  }
  {
    const now=dateWith('open-minute'),p=profile();
    finish(p,{mode:'study',elapsed:75},now);
    assert.equal(getDailyChallenges(p,now).find(task=>task.id==='open-minute').current,0);
    finish(p,{elapsed:50},now);finish(p,{elapsed:40},now);
    assert.equal(getDailyChallenges(p,now).find(task=>task.id==='open-minute').current,50);
    finish(p,{elapsed:60},now);
    assert.equal(getDailyChallenges(p,now).find(task=>task.id==='open-minute').completed,true);
  }
});

test('daily dates use the player local calendar across midnight rather than UTC',()=>{
  const moduleUrl=new URL('../notification-ninja/src/journey.js',import.meta.url).href;
  const code=`import {getDailyChallenges} from ${JSON.stringify(moduleUrl)}; console.log(JSON.stringify([getDailyChallenges({},Date.UTC(2026,9,15,10,59))[0].day,getDailyChallenges({},Date.UTC(2026,9,15,11,1))[0].day]));`;
  const result=spawnSync(process.execPath,['--input-type=module','-e',code],{env:{...process.env,TZ:'Pacific/Auckland'},encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  assert.deepEqual(JSON.parse(result.stdout),['2026-10-15','2026-10-16']);
});

test('learning-room task includes campaign study decisions without counting later rooms twice',()=>{
  const now=dateWith('study-focus'),p=profile();
  finish(p,{mode:'campaign',levelIndex:1,metrics:{correctDecisions:50,stageStats:[{levelIndex:0,context:'study',correctDecisions:20},{levelIndex:1,context:'gaming',correctDecisions:30}]}},now);
  assert.equal(getDailyChallenges(p,now).find(task=>task.id==='study-focus').current,20);
  finish(p,{mode:'campaign',levelIndex:0,stageMetrics:{correctDecisions:8},metrics:{correctDecisions:8}},now);
  assert.equal(getDailyChallenges(p,now).find(task=>task.id==='study-focus').current,28);
  finish(p,{mode:'campaign',levelIndex:0,stageMetrics:{correctDecisions:8},metrics:{correctDecisions:8,stageStats:[{levelIndex:0,context:'study',correctDecisions:8}]}},now);
  assert.equal(getDailyChallenges(p,now).find(task=>task.id==='study-focus').current,36);
  finish(p,{mode:'gaming'},now);
  assert.equal(getDailyChallenges(p,now).find(task=>task.id==='study-focus').current,36);
});

test('rank thresholds derive only from existing XP and return usable next-rank progress',()=>{
  assert.deepEqual(NINJA_RANKS.map(rank=>[rank.id,rank.xp]),[['beginner',0],['dawn',350],['shadow',1500],['sentinel',4500],['grandmaster',10000]]);
  assert.equal(getRank({}).id,'beginner');
  assert.equal(getRank({journey:{xp:999999,rank:'grandmaster'}}).id,'beginner');
  for(let index=1;index<NINJA_RANKS.length;index++) {
    const rank=NINJA_RANKS[index];
    assert.equal(getRank(profile({stats:{correct:rank.xp/5-1}})).id,NINJA_RANKS[index-1].id);
    const current=getRank(profile({stats:{correct:rank.xp/5}}));
    assert.equal(current.id,rank.id);
    assert.equal(current.xp,rank.xp);
    assert.equal(current.progress,index===NINJA_RANKS.length-1?1:0);
    assert.equal(current.nextRank?.id||null,NINJA_RANKS[index+1]?.id||null);
  }
  assert.equal(getRank(profile({stats:{correct:100,superUses:5},totalRuns:2})).xp,600);
  assert.equal(getRank(profile({stats:{correct:Infinity,superUses:'50'},totalRuns:-1})).id,'beginner');
});

test('rank outfits unlock permanently once, preserve purchases and do not change the active outfit',()=>{
  const p=profile({stats:{correct:2000,superUses:0,coinsEarned:6}}),wallet=p.coins;
  const events=applyRankUnlocks(p,day());
  assert.deepEqual(events.map(event=>event.id),['dawn','shadow','sentinel','grandmaster']);
  assert.ok(events.every(event=>event.type==='rank-unlocked'));
  assert.deepEqual(p.unlockedSkins,['default','solar','dawn','shadow','grandmaster']);
  assert.equal(p.selectedSkin,'solar');
  assert.equal(p.coins,wallet);
  assert.equal(p.stats.coinsEarned,6);
  assert.deepEqual(applyRankUnlocks(p,day()),[]);
  const reloaded=copy(p);
  assert.deepEqual(applyRankUnlocks(reloaded,day(1)),[]);
  assert.deepEqual(reloaded.unlockedSkins,p.unlockedSkins);
  reloaded.stats.correct=0;
  applyRankUnlocks(reloaded,day(1));
  assert.ok(reloaded.unlockedSkins.includes('grandmaster'));
});

test('rank milestones are separately acknowledged and daily descriptors expose no mutable save references',()=>{
  const p=profile({stats:{correct:70}});
  assert.deepEqual(applyRankUnlocks(p,day()).map(event=>event.id),['dawn']);
  p.stats.correct=300;
  assert.deepEqual(applyRankUnlocks(p,day()).map(event=>event.id),['shadow']);
  const tasks=getDailyChallenges(p,day()),snapshot=copy(p.journey);
  tasks[0].current=999;tasks[0].claimed=true;tasks[0].title='changed';
  assert.deepEqual(p.journey,snapshot);
  const rank=getRank(p);
  rank.nextRank.name='changed';
  assert.equal(getRank(p).nextRank.name,'Tempelwächter');
});

test('wallet and lifetime earned counters saturate instead of overflowing',()=>{
  const p=profile({coins:Number.MAX_SAFE_INTEGER-1,stats:{coinsEarned:Number.MAX_SAFE_INTEGER-1}});
  finish(p);
  const task=getDailyChallenges(p,day()).find(item=>item.completed);
  const result=claimDailyReward(p,task.id,day());
  assert.equal(result.ok,true);
  assert.equal(result.reward,1);
  assert.equal(p.coins,Number.MAX_SAFE_INTEGER);
  assert.equal(p.stats.coinsEarned,Number.MAX_SAFE_INTEGER);
});
