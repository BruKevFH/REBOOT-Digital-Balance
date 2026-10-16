import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {CAREER_MISSIONS,AUTOPLAY_BOSSES,WEEKLY_SKINS,WEEKLY_CHALLENGES,getWeekInfo,normalizeAdventure,getCareerMissions,getCareerMission,recordAdventureRun,claimCareerReward,getWeeklyChallenges,getWeeklyReward,claimWeeklyReward,claimWeeklySkin} from '../notification-ninja/src/adventure.js';

const copy=value=>JSON.parse(JSON.stringify(value));
const when=(offset=0)=>new Date(2026,9,16+offset,12).getTime();
const profile=(extra={})=>({coins:70,totalRuns:0,stats:{coinsEarned:0},unlockedSkins:['default','solar'],selectedSkin:'solar',unlockedWorlds:['study'],...extra});
function finish(p,extra={},now=when()){
  p.totalRuns++;
  const state={ended:true,credited:true,isTutorial:false,mode:'open',result:'lives',elapsed:120,runSerial:p.totalRuns,startedAt:now-180000+p.totalRuns,
    bestDecisionStreak:50,metrics:{correctDecisions:60,cuts:40,usefulPassed:20,flowTriggers:12,usefulMistakes:0,missedDistractions:0,shieldedMistakes:0,limitExtensions:0,sleepContinues:0},...extra};
  state.metrics={correctDecisions:60,cuts:40,usefulPassed:20,flowTriggers:12,usefulMistakes:0,missedDistractions:0,shieldedMistakes:0,limitExtensions:0,sleepContinues:0,...extra.metrics};
  return {state,events:recordAdventureRun(p,state,now)};
}
function finishMission(p,id,extra={},now=when()){
  const mission=CAREER_MISSIONS.find(item=>item.id===id);
  return finish(p,{missionId:id,mode:mission.mode,result:mission.mode==='open'?'lives':['gaming','sleep'].includes(mission.mode)?'healthy-stop':'complete',...(mission.bossId?{boss:{id:mission.bossId,health:0,defeated:true}}:{}),...extra},now);
}
function allCareer(p,now=when()){
  for(const mission of CAREER_MISSIONS)finishMission(p,mission.id,{},now);
}

test('career is an authored connected eight-node map with three real boss targets',()=>{
  assert.equal(CAREER_MISSIONS.length,8);
  assert.deepEqual(AUTOPLAY_BOSSES.map(boss=>[boss.id,boss.maxHealth]),[['scout',20],['guardian',28],['overlord',36]]);
  const known=new Set();
  for(const mission of CAREER_MISSIONS){
    assert.ok(mission.requires.every(id=>known.has(id)));
    assert.ok(mission.position.x>=0&&mission.position.x<=100&&mission.position.y>=0&&mission.position.y<=100);
    assert.ok(mission.reward>0&&mission.description&&mission.icon);
    if(mission.bossId)assert.equal(mission.target,AUTOPLAY_BOSSES.find(boss=>boss.id===mission.bossId).maxHealth);
    known.add(mission.id);
  }
  assert.equal(CAREER_MISSIONS.filter(mission=>!mission.requires.length).length,1);
  assert.equal(getCareerMissions(profile(),when()).filter(mission=>mission.available).length,1);
});

test('migration preserves old wallet, purchases, records and equipped skin',()=>{
  const p=profile({highScores:{open:12345},claimedAchievements:['first-cut']}),before=copy(p);
  normalizeAdventure(p,when());
  const {adventure,...previous}=p;
  assert.deepEqual(previous,before);
  assert.equal(adventure.version,1);
  assert.deepEqual(adventure.completed,[]);
  assert.deepEqual(adventure.claimed,[]);
  assert.equal(adventure.weekly.week,'2026-W42');
  assert.doesNotThrow(()=>normalizeAdventure(null,NaN));
  assert.doesNotThrow(()=>getCareerMissions(undefined,when()));
});

test('normalization keeps only known reachable mission IDs, completed claims and bounded values',()=>{
  const p=profile({totalRuns:3,adventure:{completed:['autoplay-overlord','unknown','study-focus','study-focus'],claimed:['study-focus','open-trial','unknown'],progress:{'open-trial':1e100,unknown:99},ownedWeeklySkins:['lotus','unknown','lotus'],lastRunOrdinal:99,recentRunIds:['x','1:1:open','1:1:open'],weekly:{week:'2026-W42',progress:{unknown:99},claimed:['unknown'],skinClaimed:true}}});
  const result=normalizeAdventure(p,when());
  assert.deepEqual(result.completed,['study-focus']);
  assert.deepEqual(result.claimed,['study-focus']);
  assert.equal(result.progress['open-trial'],44);
  assert.equal(Object.hasOwn(result.progress,'unknown'),false);
  assert.equal(result.lastRunOrdinal,3);
  assert.deepEqual(result.recentRunIds,['1:1:open']);
  assert.deepEqual(result.ownedWeeklySkins,['lotus']);
  assert.deepEqual(result.weekly.claimed,[]);
  assert.equal(result.weekly.skinClaimed,false);
});

test('normal play and training cannot accidentally complete selected career missions',()=>{
  const p=profile();
  finish(p,{mode:'study',result:'complete'});
  finishMission(p,'study-focus',{isTutorial:true});
  finishMission(p,'study-focus',{ended:false});
  finishMission(p,'study-focus',{credited:false});
  finishMission(p,'study-focus',{result:'quit'});
  assert.deepEqual(p.adventure.completed,[]);
  assert.equal(getCareerMission(p,'unknown',when()),null);
  assert.equal(claimCareerReward(p,'unknown',when()).ok,false);
});

test('career requires correct context, a completed round and precision rather than accumulated mistakes',()=>{
  const p=profile();
  for(const changes of [{mode:'open',result:'lives'},{result:'lives'},{metrics:{correctDecisions:19}},{metrics:{usefulMistakes:2,missedDistractions:1}},{metrics:{shieldedMistakes:3}}]){
    finishMission(p,'study-focus',changes);
    assert.equal(getCareerMission(p,'study-focus',when()).completed,false);
  }
  const {events}=finishMission(p,'study-focus',{metrics:{correctDecisions:20,usefulMistakes:1,missedDistractions:1}});
  assert.equal(events.filter(event=>event.type==='career-completed').length,1);
  assert.equal(getCareerMission(p,'study-focus',when()).ready,true);
  assert.equal(getCareerMission(p,'open-trial',when()).available,true);
  assert.equal(p.coins,70);
  assert.equal(claimCareerReward(p,'study-focus',when()).reward,5);
  assert.equal(p.coins,75);
  assert.equal(p.stats.coinsEarned,5);
  assert.equal(claimCareerReward(p,'study-focus',when()).ok,false);
});

test('career Open trial is the same three-heart ruleset and needs both survival and decisions',()=>{
  const p=profile();finishMission(p,'study-focus');
  for(const changes of [{elapsed:44.9},{metrics:{correctDecisions:19}},{mode:'study',result:'complete'}])finishMission(p,'open-trial',changes);
  assert.equal(getCareerMission(p,'open-trial',when()).completed,false);
  const run=finishMission(p,'open-trial',{elapsed:45,metrics:{correctDecisions:20},openRuleset:'open-v2',maxLives:3,lives:0});
  assert.equal(getCareerMission(p,'open-trial',when()).completed,true);
  assert.equal(run.state.openRuleset,'open-v2');
  assert.equal(run.state.maxLives,3);
  assert.equal(run.state.lives,0);
});

test('uncompleted prerequisites and unpurchased worlds cannot be bypassed by a forged missionId',()=>{
  const p=profile();finishMission(p,'autoplay-overlord');finishMission(p,'gaming-boundary');
  assert.deepEqual(p.adventure.completed,[]);
  finishMission(p,'study-focus');
  const gaming=getCareerMission(p,'gaming-boundary',when());
  assert.equal(gaming.worldLocked,true);assert.equal(gaming.available,false);
  finishMission(p,'gaming-boundary');
  assert.equal(getCareerMission(p,'gaming-boundary',when()).completed,false);
  p.unlockedWorlds.push('gaming');
  finishMission(p,'gaming-boundary');
  assert.equal(getCareerMission(p,'gaming-boundary',when()).completed,true);
  assert.equal(p.coins,70);
});

test('healthy boundaries reject immediate stopping, extensions and sleep continuation',()=>{
  const p=profile({unlockedWorlds:['study','gaming','sleep']});finishMission(p,'study-focus');
  for(const changes of [{elapsed:14},{metrics:{correctDecisions:7}},{metrics:{limitExtensions:1}},{extensionUsed:true},{result:'complete'}])finishMission(p,'gaming-boundary',changes);
  assert.equal(getCareerMission(p,'gaming-boundary',when()).completed,false);
  finishMission(p,'gaming-boundary',{elapsed:15,metrics:{correctDecisions:8}});
  assert.equal(getCareerMission(p,'gaming-boundary',when()).completed,true);
  for(const changes of [{elapsed:7},{metrics:{correctDecisions:7}},{metrics:{sleepContinues:1}},{sleepContinued:true}])finishMission(p,'sleep-sanctuary',changes);
  assert.equal(getCareerMission(p,'sleep-sanctuary',when()).completed,false);
  finishMission(p,'sleep-sanctuary',{elapsed:8,metrics:{correctDecisions:8}});
  assert.equal(getCareerMission(p,'sleep-sanctuary',when()).completed,true);
  assert.equal(getCareerMission(p,'autoplay-guardian',when()).available,true);
});

test('boss completion needs its matching defeated boss, zero health and all required decisions',()=>{
  const p=profile();finishMission(p,'study-focus');finishMission(p,'open-trial');
  for(const changes of [{boss:{id:'guardian',health:0,defeated:true}},{boss:{id:'scout',health:1,defeated:true}},{boss:{id:'scout',health:0,defeated:false}},{metrics:{correctDecisions:19}},{result:'lives'}])finishMission(p,'autoplay-scout',changes);
  assert.equal(getCareerMission(p,'autoplay-scout',when()).completed,false);
  finishMission(p,'autoplay-scout',{metrics:{correctDecisions:20}});
  assert.equal(getCareerMission(p,'autoplay-scout',when()).completed,true);
  assert.equal(getCareerMission(p,'balance-master',when()).worldLocked,true);
});

test('entire career is reachable, rewards stay explicit and replay never repays',()=>{
  const p=profile({unlockedWorlds:['study','gaming','sleep','master']});allCareer(p);
  assert.ok(getCareerMissions(p,when()).every(mission=>mission.completed&&mission.ready&&!mission.claimed));
  assert.equal(p.coins,70);
  for(const mission of CAREER_MISSIONS)assert.equal(claimCareerReward(p,mission.id,when()).ok,true);
  const balance=70+CAREER_MISSIONS.reduce((sum,mission)=>sum+mission.reward,0);
  assert.equal(p.coins,balance);
  const after=copy(p);
  allCareer(p);
  assert.equal(p.coins,balance);
  assert.ok(getCareerMissions(p,when()).every(mission=>mission.claimed&&!mission.ready));
  const reloaded=copy(after);
  for(const mission of CAREER_MISSIONS)assert.equal(claimCareerReward(reloaded,mission.id,when()).ok,false);
  assert.equal(reloaded.coins,balance);
});

test('weekly sets rotate every Monday, have three free-room tasks and fifteen explicit coins',()=>{
  const seen=[];
  for(let offset=0;offset<21;offset+=7){
    const p=profile(),tasks=getWeeklyChallenges(p,when(offset)),reward=getWeeklyReward(p,when(offset));
    assert.equal(tasks.length,3);
    assert.deepEqual(tasks.map(task=>task.reward),[4,5,6]);
    assert.ok(tasks.every(task=>task.target>0&&!task.completed&&!task.claimed));
    assert.equal(reward.ready,false);
    seen.push(reward.id);
  }
  assert.equal(new Set(seen).size,3);
  assert.equal(WEEKLY_CHALLENGES.length,9);
  assert.deepEqual(WEEKLY_SKINS.map(skin=>skin.id),['lotus','ember','tide']);
  assert.equal(getWeekInfo(new Date(2026,9,12,0)).week,getWeekInfo(new Date(2026,9,18,23,59)).week);
  assert.notEqual(getWeekInfo(new Date(2026,9,18,23,59)).week,getWeekInfo(new Date(2026,9,19,0)).week);
});

test('ISO week years remain correct around New Year',()=>{
  for(const [date,week] of [[new Date(2025,11,29,12),'2026-W01'],[new Date(2026,0,1,12),'2026-W01'],[new Date(2026,11,31,12),'2026-W53'],[new Date(2027,0,3,12),'2026-W53'],[new Date(2027,0,4,12),'2027-W01']])assert.equal(getWeekInfo(date).week,week);
});

test('weekly uses local Monday, including a daylight-saving week, instead of UTC midnight',()=>{
  const moduleUrl=new URL('../notification-ninja/src/adventure.js',import.meta.url).href;
  const code=`import {getWeekInfo} from ${JSON.stringify(moduleUrl)};console.log(JSON.stringify([getWeekInfo(Date.UTC(2026,9,18,21,59)),getWeekInfo(Date.UTC(2026,9,18,22,1)),getWeekInfo(Date.UTC(2026,9,24,12))]));`;
  const child=spawnSync(process.execPath,['--input-type=module','-e',code],{env:{...process.env,TZ:'Europe/Vienna'},encoding:'utf8'});
  assert.equal(child.status,0,child.stderr);
  const [sunday,monday,dst]=JSON.parse(child.stdout);
  assert.equal(sunday.week,'2026-W42');assert.equal(monday.week,'2026-W43');
  assert.equal(dst.next-dst.start,169*3600000);
});

test('weekly progress and outfit complete through real credited runs without automatic wallet or equip changes',()=>{
  for(let offset=0;offset<21;offset+=7){
    const now=when(offset),p=profile(),events=[];
    for(let index=0;index<5;index++)events.push(...finish(p,{},now).events);
    const tasks=getWeeklyChallenges(p,now),reward=getWeeklyReward(p,now);
    assert.ok(tasks.every(task=>task.completed&&!task.claimed&&task.current===task.target));
    assert.equal(events.filter(event=>event.type==='weekly-completed').length,3);
    assert.equal(p.coins,70);assert.equal(p.selectedSkin,'solar');assert.equal(reward.ready,true);
    assert.equal(claimWeeklySkin(p,now).ok,true);
    assert.equal(p.coins,70);assert.equal(p.selectedSkin,'solar');assert.ok(p.unlockedSkins.includes(reward.id));
    assert.equal(getWeeklyReward(p,now).claimed,true);
    assert.equal(claimWeeklySkin(p,now).ok,false);
    for(const task of tasks)assert.equal(claimWeeklyReward(p,task.id,now).ok,true);
    assert.equal(p.coins,85);assert.equal(p.stats.coinsEarned,15);
    const reload=copy(p);
    assert.equal(claimWeeklySkin(reload,now).ok,false);
    for(const task of tasks)assert.equal(claimWeeklyReward(reload,task.id,now).ok,false);
    assert.equal(reload.coins,85);
  }
});

test('replaying the same credited state cannot advance weekly progress even with a forged new ordinal',()=>{
  const p=profile(),first=finish(p),second=finish(p),before=copy(p.adventure.weekly.progress);
  assert.deepEqual(recordAdventureRun(p,second.state,when()),[]);
  p.totalRuns++;
  assert.deepEqual(recordAdventureRun(p,first.state,when()),[]);
  assert.deepEqual(p.adventure.weekly.progress,before);
  const reloaded=copy(p);
  assert.deepEqual(recordAdventureRun(reloaded,copy(first.state),when()),[]);
  assert.deepEqual(reloaded.adventure.weekly.progress,before);
});

test('empty, training, abandoned and very short rounds do not farm weekly counters',()=>{
  for(const changes of [{isTutorial:true},{ended:false},{credited:false},{mode:'unknown'},{result:'quit'},{elapsed:0},{elapsed:14.99},{metrics:{correctDecisions:7}}]){
    const p=profile();finish(p,changes);
    assert.ok(getWeeklyChallenges(p,when()).every(task=>task.current===0));
    assert.equal(p.coins,70);
  }
});

test('Monday resets only weekly progress, preserving career, outfits and anti-replay identity',()=>{
  const p=profile(),oldNow=new Date(2026,9,18,12).getTime(),newNow=new Date(2026,9,19,12).getTime();
  finishMission(p,'study-focus',{},oldNow);
  let previous;
  for(let index=0;index<5;index++)previous=finish(p,{},oldNow).state;
  const skin=getWeeklyReward(p,oldNow).id;
  claimWeeklySkin(p,oldNow);
  const oldTasks=getWeeklyChallenges(p,oldNow);
  oldTasks.forEach(task=>claimWeeklyReward(p,task.id,oldNow));
  const coins=p.coins;
  assert.ok(getWeeklyChallenges(p,newNow).every(task=>task.current===0&&!task.claimed));
  assert.ok(p.adventure.completed.includes('study-focus'));assert.ok(p.unlockedSkins.includes(skin));
  p.totalRuns++;
  assert.deepEqual(recordAdventureRun(p,previous,newNow),[]);
  assert.ok(getWeeklyChallenges(p,newNow).every(task=>task.current===0));
  // A genuinely different old saved run also cannot fill this week's tasks.
  finish(p,{startedAt:oldNow-100000,runSerial:99},newNow);
  assert.ok(getWeeklyChallenges(p,newNow).every(task=>task.current===0));
  assert.equal(p.coins,coins);
  finish(p,{},newNow);
  assert.ok(getWeeklyChallenges(p,newNow).some(task=>task.current>0));
});

test('repeated season skin stays owned and selected skin and reward claims remain independent',()=>{
  const p=profile();for(let i=0;i<5;i++)finish(p);
  const first=getWeeklyReward(p,when());claimWeeklySkin(p,when());
  const later=when(21);for(let i=0;i<5;i++)finish(p,{},later);
  const repeated=getWeeklyReward(p,later);
  assert.equal(repeated.id,first.id);assert.equal(repeated.owned,true);assert.equal(repeated.claimed,true);assert.equal(repeated.ready,false);
  assert.equal(claimWeeklySkin(p,later).ok,false);
  assert.equal(p.unlockedSkins.filter(id=>id===first.id).length,1);
  assert.equal(p.selectedSkin,'solar');
  assert.ok(getWeeklyChallenges(p,later).every(task=>task.completed&&!task.claimed));
});

test('read models are detached and unknown or unearned claims never change wallet',()=>{
  const p=profile(),tasks=getWeeklyChallenges(p,when()),missions=getCareerMissions(p,when()),reward=getWeeklyReward(p,when());
  const before=copy(p);
  tasks[0].current=999;missions[0].position.x=999;missions[1].requires.push('unknown');reward.skin.name='changed';
  assert.deepEqual(p,before);
  assert.equal(claimCareerReward(p,'study-focus',when()).ok,false);
  assert.equal(claimWeeklyReward(p,tasks[0].id,when()).ok,false);
  assert.equal(claimWeeklyReward(p,'unknown',when()).ok,false);
  assert.equal(claimWeeklySkin(p,when()).ok,false);
  assert.equal(p.coins,70);
  assert.deepEqual(p.unlockedSkins,['default','solar']);
});

test('career and weekly wallet grants saturate instead of overflowing safe counters',()=>{
  const p=profile({coins:Number.MAX_SAFE_INTEGER-1,stats:{coinsEarned:Number.MAX_SAFE_INTEGER-1}});
  finishMission(p,'study-focus');
  assert.equal(claimCareerReward(p,'study-focus',when()).reward,1);
  assert.equal(p.coins,Number.MAX_SAFE_INTEGER);assert.equal(p.stats.coinsEarned,Number.MAX_SAFE_INTEGER);
  for(let i=0;i<5;i++)finish(p);
  const completed=getWeeklyChallenges(p,when()).find(task=>task.completed);
  assert.equal(claimWeeklyReward(p,completed.id,when()).reward,0);
  assert.equal(p.coins,Number.MAX_SAFE_INTEGER);
});
