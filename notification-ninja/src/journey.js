import {getPlayerProgress} from './player.js';

/** Authored ranks use existing derived XP; cosmetics never change run rules. */
export const NINJA_RANKS=Object.freeze([
  {id:'beginner',name:'Anfänger',xp:0,skin:null,throwStyle:'classic'},
  {id:'dawn',name:'Morgenwind',xp:350,skin:'dawn',throwStyle:'sunrise'},
  {id:'shadow',name:'Schatten-Ninja',xp:1500,skin:'shadow',throwStyle:'shadow'},
  {id:'sentinel',name:'Tempelwächter',xp:4500,skin:null,throwStyle:'shadow'},
  {id:'grandmaster',name:'Großmeister',xp:10000,skin:'grandmaster',throwStyle:'golden'}
].map(rank=>Object.freeze(rank)));

// Every set is possible in the free starting room/Open Run. Its claims total 9 coins.
const TASK_COLUMNS=Object.freeze([
  Object.freeze([
    {id:'clear-decisions',title:'Klarer Kopf',description:'Triff heute 30 richtige Entscheidungen.',metric:'correct',target:30,reward:2,icon:'focus'},
    {id:'let-it-pass',title:'Bewusst behalten',description:'Lass heute 12 sinnvolle Dinge unberührt.',metric:'useful',target:12,reward:2,icon:'keep'},
    {id:'clean-swipes',title:'Saubere Schnitte',description:'Zerteile heute 20 Ablenkungen.',metric:'cuts',target:20,reward:2,icon:'slice'}
  ].map(task=>Object.freeze(task))),
  Object.freeze([
    {id:'steady-combo',title:'Ruhige Hand',description:'Schaffe 15 richtige Entscheidungen ohne Fehler in einer Runde.',metric:'streak',target:15,reward:3,icon:'combo'},
    {id:'precise-run',title:'Mit Bedacht',description:'Beende eine Runde mit 20 richtigen Entscheidungen und höchstens 2 Fehlern.',metric:'precise',target:1,reward:3,icon:'shield'},
    {id:'find-flow',title:'Finde deinen Flow',description:'Aktiviere heute viermal Focus Flow.',metric:'flow',target:4,reward:3,icon:'flow'}
  ].map(task=>Object.freeze(task))),
  Object.freeze([
    {id:'open-minute',title:'Eine Minute Fokus',description:'Überlebe 60 Sekunden in einem Open Run.',metric:'openSeconds',target:60,reward:4,icon:'clock'},
    {id:'daily-routine',title:'Ninja-Routine',description:'Beende drei Runden mit jeweils mindestens 8 richtigen Entscheidungen.',metric:'runs',target:3,reward:4,icon:'ninja'},
    {id:'study-focus',title:'Lernzimmer-Profi',description:'Triff heute 40 richtige Entscheidungen im Lernzimmer oder Open Run.',metric:'study',target:40,reward:4,icon:'study'}
  ].map(task=>Object.freeze(task)))
]);
export const DAILY_CHALLENGES=Object.freeze(TASK_COLUMNS.flat());
const MAX=Number.MAX_SAFE_INTEGER;
const MODES=new Set(['campaign','study','gaming','sleep','master','open','boss']);
const RESULTS=new Set(['complete','healthy-stop','locked','lives']);
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const count=value=>typeof value==='number'&&Number.isFinite(value)?Math.max(0,Math.min(MAX,Math.trunc(value))):0;
const failure=reason=>({ok:false,reason});
const add=(a,b)=>Math.min(MAX,a+b);

function calendar(now=Date.now()) {
  let date=new Date(now instanceof Date?now.getTime():now);
  if(!Number.isFinite(date.getTime())||date.getFullYear()<1970||date.getFullYear()>9999)date=new Date();
  const year=date.getFullYear(),month=date.getMonth(),day=date.getDate();
  return {day:`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`,ordinal:Math.floor(Date.UTC(year,month,day)/86400000)};
}
function tasksFor(now) {
  const {ordinal}=calendar(now);
  return TASK_COLUMNS.map((column,index)=>column[(ordinal+index)%column.length]);
}
function validRunId(value) {
  return typeof value==='string'&&/^\d{1,16}:\d{1,16}:(?:campaign|study|gaming|sleep|master|open|boss)$/.test(value)?value:'';
}
function studyDecisions(state,stats,correct) {
  if(state.mode==='open'||state.mode==='study')return correct;
  if(state.mode!=='campaign')return 0;
  const stages=Array.isArray(stats.stageStats)?stats.stageStats.slice(0,4):[];
  const completed=stages.find(stage=>object(stage)&&stage.levelIndex===0&&stage.context==='study');
  const current=!completed&&state.levelIndex===0?count(state.stageMetrics?.correctDecisions):0;
  return Math.min(correct,add(count(completed?.correctDecisions),current));
}

/** Only known journey keys/IDs survive; unrelated old progress is untouched. */
export function normalizeJourney(profile,now=Date.now()) {
  const source=object(profile?.journey)?profile.journey:{};
  const {day}=calendar(now),sameDay=source.day===day,tasks=tasksFor(now);
  const {xp}=getPlayerProgress(profile);
  const progress=Object.fromEntries(tasks.map(task=>[task.id,sameDay?Math.min(task.target,count(source.progress?.[task.id])):0]));
  const claimed=sameDay&&Array.isArray(source.claimed)
    ?tasks.filter(task=>source.claimed.includes(task.id)&&progress[task.id]>=task.target).map(task=>task.id):[];
  const journey={version:1,day,progress,claimed,
    seenRanks:NINJA_RANKS.filter(rank=>rank.id!=='beginner'&&rank.xp<=xp&&Array.isArray(source.seenRanks)&&source.seenRanks.includes(rank.id)).map(rank=>rank.id),
    lastRunOrdinal:Math.min(count(profile?.totalRuns),count(source.lastRunOrdinal)),lastRunId:validRunId(source.lastRunId)};
  if(object(profile))profile.journey=journey;
  return journey;
}

/** No editable rank/XP counter is stored; old XP advances ranks immediately. */
export function getRank(profile) {
  const {xp}=getPlayerProgress(profile);
  let index=0;
  for(let i=1;i<NINJA_RANKS.length;i++)if(xp>=NINJA_RANKS[i].xp)index=i;
  const current=NINJA_RANKS[index],next=NINJA_RANKS[index+1]||null;
  return {...current,index,xp,nextRank:next?{...next}:null,
    progress:next?Math.max(0,Math.min(1,(xp-current.xp)/(next.xp-current.xp))):1,
    needed:next?Math.max(0,next.xp-xp):0};
}

/** Descriptors are detached from the save and safe for presentation. */
export function getDailyChallenges(profile,now=Date.now()) {
  const journey=normalizeJourney(profile,now);
  return tasksFor(now).map(task=>({...task,day:journey.day,current:journey.progress[task.id],
    completed:journey.progress[task.id]>=task.target,claimed:journey.claimed.includes(task.id)}));
}

/** Call after the core credits a finished run and increments totalRuns, once. */
export function recordDailyRun(profile,state,now=Date.now()) {
  if(!object(profile))return [];
  const journey=normalizeJourney(profile,now);
  if(!object(state)||state.ended!==true||state.credited!==true||state.isTutorial===true||
    !MODES.has(state.mode)||!RESULTS.has(state.result))return [];
  const ordinal=count(profile.totalRuns),serial=count(state.runSerial),startedAt=count(state.startedAt);
  const runId=`${startedAt}:${serial}:${state.mode}`;
  if(!ordinal||!serial||ordinal<=journey.lastRunOrdinal||runId===journey.lastRunId)return [];
  // Remember poor credited attempts too, so midnight cannot replay them.
  journey.lastRunOrdinal=ordinal;journey.lastRunId=runId;
  const stats=object(state.metrics)?state.metrics:{};
  const correct=count(stats.correctDecisions),elapsed=typeof state.elapsed==='number'&&Number.isFinite(state.elapsed)?Math.max(0,state.elapsed):0;
  if(correct<8||elapsed<(state.result==='healthy-stop'?8:15))return [];
  const errors=add(count(stats.usefulMistakes),count(stats.missedDistractions));
  const values={correct,cuts:count(stats.cuts),useful:count(stats.usefulPassed),
    streak:count(state.bestDecisionStreak),precise:Number(correct>=20&&errors<=2),flow:count(stats.flowTriggers),
    openSeconds:state.mode==='open'?Math.floor(elapsed):0,runs:1,
    study:studyDecisions(state,stats,correct)};
  const events=[];
  for(const task of tasksFor(now)) {
    const previous=journey.progress[task.id],value=values[task.metric];
    const current=Math.min(task.target,['streak','openSeconds'].includes(task.metric)?Math.max(previous,value):add(previous,value));
    journey.progress[task.id]=current;
    if(previous<task.target&&current>=task.target)events.push({type:'daily-completed',id:task.id,day:journey.day,title:task.title,reward:task.reward});
  }
  return events;
}

/** Explicit, once-per-day wallet credit; completion never adds coins by itself. */
export function claimDailyReward(profile,id,now=Date.now()) {
  if(!object(profile))return failure('Der Spielstand ist ungültig.');
  const task=tasksFor(now).find(item=>item.id===id);
  if(!task)return failure('Diese Tagesaufgabe ist heute nicht verfügbar.');
  const journey=normalizeJourney(profile,now);
  if(journey.claimed.includes(id))return failure('Diese Tagesbelohnung hast du schon abgeholt.');
  if(journey.progress[id]<task.target)return failure('Diese Tagesaufgabe ist noch nicht geschafft.');
  const coins=count(profile.coins),reward=Math.min(task.reward,MAX-coins);
  journey.claimed.push(id);profile.coins=coins+reward;
  if(!object(profile.stats))profile.stats={};
  profile.stats.coinsEarned=add(count(profile.stats.coinsEarned),reward);
  return {ok:true,id,day:journey.day,reward,coins:profile.coins};
}

/** Rank outfits stay owned and never replace the equipped skin. */
export function applyRankUnlocks(profile,now=Date.now()) {
  if(!object(profile))return [];
  const journey=normalizeJourney(profile,now),{xp}=getPlayerProgress(profile),events=[];
  const owned=[...new Set(['default',...(Array.isArray(profile.unlockedSkins)?profile.unlockedSkins.filter(id=>typeof id==='string'):[])])];
  for(const rank of NINJA_RANKS) {
    if(rank.id==='beginner'||rank.xp>xp)continue;
    if(rank.skin&&!owned.includes(rank.skin))owned.push(rank.skin);
    if(!journey.seenRanks.includes(rank.id)) {
      journey.seenRanks.push(rank.id);
      events.push({type:'rank-unlocked',id:rank.id,name:rank.name,xp:rank.xp,skin:rank.skin,throwStyle:rank.throwStyle});
    }
  }
  profile.unlockedSkins=owned;
  return events;
}
