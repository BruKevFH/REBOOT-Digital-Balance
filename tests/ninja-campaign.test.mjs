import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {NinjaGame,STORAGE_KEY} from '../notification-ninja/src/game.js';
import {MAIN_MISSIONS,LEGACY_MISSIONS,CAREER_MISSIONS,CAMPAIGN_VERSION,getCareerMissions,getCampaignChapters,normalizeAdventure,recordAdventureRun,getMissionOutcome} from '../notification-ninja/src/adventure.js';
import {isThrowReady} from '../notification-ninja/src/throwers.js';
class Storage{data=new Map();getItem(key){return this.data.get(key)??null;}setItem(key,value){this.data.set(key,value);}}
const now=Date.UTC(2026,9,30,12),copy=value=>structuredClone(value);
function setup(){const storage=new Storage(),clock={value:now},game=new NinjaGame({storage,seed:'all18canonical',width:1000,height:750,now:()=>clock.value});return {game,storage,clock};}
function play(game,clock){
  game.nextLevel();const events=[];
  for(let frame=0;frame<4000&&!game.state.ended;frame++){
    for(const object of [...game.state.objects])if(object.kind==='distraction'&&isThrowReady(object)&&object.y>object.radius&&object.y<game.height-object.radius)events.push(...game.swipe([{x:object.x,y:object.y-8},{x:object.x,y:object.y+8}]));
    if(game.state.scene==='limit-choice'||game.state.mode==='sleep'&&game.state.stopAvailable)events.push(...game.requestStop().events||[]);
    clock.value+=50;events.push(...game.update(.05));
  }
  assert.equal(game.state.ended,true,'mission has a finite ending');return events;
}

test('main campaign is three six-mission chapters with authored goals, short durations and permanent legacy IDs',()=>{
  assert.equal(MAIN_MISSIONS.length,18);assert.equal(CAREER_MISSIONS.length,26);assert.equal(new Set(CAREER_MISSIONS.map(m=>m.id)).size,26);
  assert.deepEqual(LEGACY_MISSIONS.map(m=>m.id),['study-focus','open-trial','autoplay-scout','gaming-boundary','sleep-sanctuary','autoplay-guardian','balance-master','autoplay-overlord']);
  for(const context of ['study','gaming','sleep']){
    const missions=MAIN_MISSIONS.filter(m=>m.chapter===context);assert.equal(missions.length,6);assert.deepEqual(missions.map(m=>m.order),[1,2,3,4,5,6]);
    assert.ok(missions.every(m=>m.duration>=30&&m.duration<=50&&m.sequence.length>=4&&m.target>0&&m.reward>0));assert.ok(new Set(missions.map(m=>m.objective.metric)).size>=5);
  }
  const {game}=setup(),chapters=getCampaignChapters(game.profile,now);assert.deepEqual(chapters.map(c=>c.unlocked),[true,false,false]);
  assert.equal(getCareerMissions(game.profile,now).find(m=>m.id==='gaming-01').missingRequirements[0],'study-06');
});

test('all eighteen genuine mouse-equivalent runs satisfy distinct goals, open worlds and preserve explicit once-only claims',()=>{
  const {game,clock,storage}=setup();
  for(const mission of MAIN_MISSIONS){
    assert.equal(game.startMission(mission.id).ok,true,`${mission.id} must be reachable`);assert.equal(game.state.duration,mission.duration);assert.equal(game.state.openRuleset,null);
    const events=play(game,clock),read=getCareerMissions(game.profile,clock.value).find(m=>m.id===mission.id);
    assert.equal(read.completed,true,`${mission.id}: ${JSON.stringify({result:game.state.result,elapsed:game.state.elapsed,metrics:game.state.metrics,streak:game.state.bestDecisionStreak})}`);
    assert.equal(read.status,'completed');assert.equal(read.ready,true);assert.ok(read.best&&read.best.score>0&&read.best.correct>=8);
    assert.equal(events.filter(e=>e.type==='career-completed'&&e.id===mission.id).length,1);
    const before=game.profile.coins;assert.equal(game.claimCareerReward(mission.id).reward,mission.reward);assert.equal(game.profile.coins,before+mission.reward);assert.equal(game.claimCareerReward(mission.id).ok,false);
    if(mission.id==='study-06')assert.ok(game.profile.unlockedWorlds.includes('gaming'));
    if(mission.id==='gaming-06')assert.ok(game.profile.unlockedWorlds.includes('sleep'));
  }
  const restored=new NinjaGame({storage,now:()=>clock.value});assert.equal(restored.profile.adventure.version,CAMPAIGN_VERSION);
  assert.equal(MAIN_MISSIONS.filter(m=>restored.profile.adventure.completed.includes(m.id)).length,18);assert.equal(restored.profile.adventure.claimed.length,18);
  assert.deepEqual(getCampaignChapters(restored.profile,clock.value).map(c=>c.completed),[6,6,6]);
  const balance=restored.profile.coins;for(const mission of MAIN_MISSIONS)assert.equal(restored.claimCareerReward(mission.id).ok,false);assert.equal(restored.profile.coins,balance);
});

test('legacy completed missions and claimed rewards migrate without requiring new campaign predecessors',()=>{
  const {game}=setup();game.profile.adventure={version:1,completed:LEGACY_MISSIONS.map(m=>m.id),claimed:LEGACY_MISSIONS.map(m=>m.id),progress:{},weekly:{}};
  game.profile.unlockedWorlds=['study','gaming','sleep','master'];game.profile.coins=117;game.profile.selectedSkin='default';
  normalizeAdventure(game.profile,now);assert.equal(game.profile.adventure.version,2);assert.deepEqual(game.profile.adventure.completed,LEGACY_MISSIONS.map(m=>m.id));assert.deepEqual(game.profile.adventure.claimed,LEGACY_MISSIONS.map(m=>m.id));
  assert.equal(game.profile.coins,117);assert.equal(game.profile.selectedSkin,'default');assert.equal(getCareerMissions(game.profile,now).find(m=>m.id==='study-01').available,true);
  for(const mission of LEGACY_MISSIONS)assert.equal(game.claimCareerReward(mission.id).ok,false);
});

test('locked missions cannot bypass chapter requirements even with paid early world access',()=>{
  const {game}=setup();game.profile.unlockedWorlds.push('gaming','sleep');const before=copy(game.state);
  assert.equal(game.startMission('gaming-01').ok,false);assert.equal(game.startMission('study-06').ok,false);assert.deepEqual(game.state,before);
  assert.equal(game.startQuickRound('gaming').ok,true);assert.equal(game.state.duration,45);
});

test('main mission paused save restores exact authored duration and signal counts',()=>{
  const {game,storage,clock}=setup();game.profile.adventure.completed=MAIN_MISSIONS.slice(0,4).map(m=>m.id);game.startMission('study-05');game.nextLevel();
  for(let frame=0;frame<80;frame++){clock.value+=50;game.update(.05);}game.state.metrics.helpfulById={safety:2};game.state.metrics.usefulPassed=2;game.pause();
  const restored=new NinjaGame({storage,now:()=>clock.value,width:1000,height:750});assert.equal(restored.state.missionId,'study-05');assert.equal(restored.state.duration,45);assert.equal(restored.state.paused,true);assert.deepEqual(restored.state.metrics.helpfulById,{safety:2});
  const raw=JSON.parse(storage.getItem(STORAGE_KEY));assert.equal(raw.profile.adventure.version,2);
});

test('wrong goals and early abandonment do not grant mission completion or free worlds',()=>{
  for(const changes of [{result:'stopped'},{result:'lives'},{elapsed:12},{metrics:{correctDecisions:7}},{metrics:{correctDecisions:20,usefulMistakes:3}}]){
    const {game}=setup();game.profile.adventure.completed=['study-01'];game.profile.totalRuns=1;
    const state={startedAt:now-40000,runSerial:1,ended:true,credited:true,isTutorial:false,mode:'study',missionId:'study-02',result:'complete',elapsed:35,metrics:{correctDecisions:20,usefulMistakes:0,missedDistractions:0},...changes};recordAdventureRun(game.profile,state,now);
    assert.equal(game.profile.adventure.completed.includes('study-02'),false);assert.deepEqual(game.profile.unlockedWorlds,['study']);
  }
});


test('mission outcome evaluates this attempt even after a previous successful completion',()=>{
  const {game,clock}=setup();game.startMission('study-01');play(game,clock);assert.equal(getMissionOutcome(game.state).passed,true);
  const best=copy(game.profile.adventure.best['study-01']);game.startMission('study-01');game.nextLevel();game.finishRound();
  assert.equal(getMissionOutcome(game.state).passed,false);assert.ok(game.profile.adventure.completed.includes('study-01'));assert.deepEqual(game.profile.adventure.best['study-01'],best);
});


test('UTC account weeks stay identical across device zones while guest Mondays keep local behavior',()=>{
  const moduleUrl=new URL('../notification-ninja/src/adventure.js',import.meta.url).href;
  const stamp=Date.UTC(2026,9,18,22,30),code=`import{getWeekInfo,getWeeklyChallenges,normalizeAdventure}from ${JSON.stringify(moduleUrl)};const now=${stamp},p={accountCalendar:'utc',totalRuns:0,unlockedWorlds:['study']};const tasks=getWeeklyChallenges(p,now);p.adventure.weekly.progress[tasks[0].id]=1;const read=getWeeklyChallenges(p,now);console.log(JSON.stringify({utc:getWeekInfo(now,'utc'),guest:getWeekInfo(now),week:p.adventure.weekly.week,tasks:read.map(t=>[t.id,t.current])}));`;
  const snapshots=['Europe/Vienna','America/Los_Angeles','Pacific/Kiritimati'].map(TZ=>{const child=spawnSync(process.execPath,['--input-type=module','-e',code],{encoding:'utf8',env:{...process.env,TZ}});assert.equal(child.status,0,child.stderr);return JSON.parse(child.stdout);});
  for(const snapshot of snapshots){assert.deepEqual(snapshot.utc,snapshots[0].utc);assert.deepEqual(snapshot.tasks,snapshots[0].tasks);assert.equal(snapshot.week,'2026-W42');assert.equal(snapshot.tasks[0][1],1);assert.equal(snapshot.utc.next-snapshot.utc.start,7*86400000);}
  assert.equal(snapshots[0].guest.week,'2026-W43');assert.equal(snapshots[1].guest.week,'2026-W42');
});

test('account calendar marker survives game save and restore; arbitrary calendar values are not imported',()=>{
  const {game,storage,clock}=setup();game.profile.accountCalendar='utc';game.save();
  const restored=new NinjaGame({storage,now:()=>clock.value});assert.equal(restored.profile.accountCalendar,'utc');assert.equal(restored.exportData().profile.accountCalendar,'utc');
  const raw=JSON.parse(storage.getItem(STORAGE_KEY));raw.profile.accountCalendar='untrusted-zone';storage.setItem(STORAGE_KEY,JSON.stringify(raw));
  assert.equal(new NinjaGame({storage,now:()=>clock.value}).profile.accountCalendar,undefined);
});
