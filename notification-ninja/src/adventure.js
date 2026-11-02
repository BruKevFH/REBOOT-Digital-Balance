import {BOSS_DEFINITIONS} from './boss.js';

const MAX=Number.MAX_SAFE_INTEGER;
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const count=value=>typeof value==='number'&&Number.isFinite(value)?Math.max(0,Math.min(MAX,Math.trunc(value))):0;
const add=(a,b)=>Math.min(MAX,a+b);
const fail=reason=>({ok:false,reason});
const detached=value=>JSON.parse(JSON.stringify(value));
const freeze=value=>{Object.values(value).forEach(item=>{if(item&&typeof item==='object'&&!Object.isFrozen(item))freeze(item);});return Object.freeze(value);};
const mod=(value,divisor)=>(value%divisor+divisor)%divisor;
const bossHealth=id=>BOSS_DEFINITIONS.find(boss=>boss.id===id).maxHealth;

export const AUTOPLAY_BOSSES=BOSS_DEFINITIONS;
export const WEEKLY_SKINS=freeze([
  {id:'lotus',name:'Lotuswächter',color:'#b278ae',unlock:'weekly',cost:0,description:'Lotuskrone, Blütenkragen und eine Spur aus Blütenblättern.'},
  {id:'ember',name:'Glutfuchs',color:'#ef8b5d',unlock:'weekly',cost:0,description:'Feuriger Fuchskamm, Schuppenmantel und warme Funkenspuren.'},
  {id:'tide',name:'Gezeitengeist',color:'#6ca9bc',unlock:'weekly',cost:0,description:'Wellenkrone, Muschelkragen und schimmernde Wasserwirbel.'}
]);

export const LEGACY_MISSIONS=freeze([
  {id:'study-focus',title:'Der erste Fokus',description:'Beende eine Lernzimmer-Runde mit mindestens 20 richtigen Entscheidungen und höchstens 2 Fehlern.',icon:'study',mode:'study',bossId:null,requiredWorld:'study',requires:[],position:{x:50,y:52},target:20,reward:5},
  {id:'open-trial',title:'Der ruhige Atem',description:'Überlebe 45 Sekunden im unveränderten Open Run und triff dabei mindestens 20 richtige Entscheidungen.',icon:'clock',mode:'open',bossId:null,requiredWorld:null,requires:['study-focus'],position:{x:27,y:52},target:45,reward:6},
  {id:'autoplay-scout',title:'Autoplay-Späher',description:'Besiege den Autoplay-Späher. Er wechselt zwischen Lernen, Gaming und Schlaf: Deine richtigen Entscheidungen schwächen ihn.',icon:'boss',mode:'boss',bossId:'scout',requiredWorld:null,requires:['open-trial'],position:{x:8,y:52},target:bossHealth('scout'),reward:8},
  {id:'gaming-boundary',title:'Deine Grenze zählt',description:'Beende eine Gaming-Runde bewusst an deiner Zeitgrenze, ohne Verlängerung: mindestens 8 richtige Entscheidungen und 15 Sekunden Spielzeit.',icon:'gaming',mode:'gaming',bossId:null,requiredWorld:'gaming',requires:['study-focus'],position:{x:69,y:32},target:1,reward:6},
  {id:'sleep-sanctuary',title:'Nachtruhe beschützen',description:'Nutze im Schlafzimmer bewusst den Stopp-Knopf, ohne vorher weiterzuspielen: mindestens 8 richtige Entscheidungen und 8 Sekunden Spielzeit.',icon:'sleep',mode:'sleep',bossId:null,requiredWorld:'sleep',requires:['study-focus'],position:{x:69,y:73},target:1,reward:6},
  {id:'autoplay-guardian',title:'Feed-Wächter',description:'Besiege den stärkeren Feed-Wächter. Achte bei jedem Kontextwechsel darauf, was jetzt sinnvoll ist.',icon:'boss',mode:'boss',bossId:'guardian',requiredWorld:null,requires:['gaming-boundary','sleep-sanctuary'],position:{x:89,y:52},target:bossHealth('guardian'),reward:10},
  {id:'balance-master',title:'Alle Welten im Griff',description:'Schließe Balance Master mit mindestens 20 richtigen Entscheidungen ab.',icon:'master',mode:'master',bossId:null,requiredWorld:'master',requires:['autoplay-scout'],position:{x:27,y:15},target:1,reward:8},
  {id:'autoplay-overlord',title:'Die letzte Endlosschleife',description:'Besiege den Autoplay-Meister und beende seine Endlosschleife. Nutze dein Wissen aus allen drei Alltagssituationen.',icon:'boss',mode:'boss',bossId:'overlord',requiredWorld:null,requires:['autoplay-guardian','balance-master'],position:{x:50,y:6},target:bossHealth('overlord'),reward:15}
]);
/** Versioned authored campaign; IDs are permanent save keys, titles are presentation. */
export const CAMPAIGN_VERSION=2;
const main=(id,title,description,chapter,order,duration,objective,sequence,reward=4)=>({
  id,title,description,chapter,order,duration,objective,sequence,reward,section:'main',icon:chapter,mode:chapter,bossId:null,requiredWorld:chapter,
  requires:order>1?[`${chapter}-${String(order-1).padStart(2,'0')}`]:chapter==='gaming'?['study-06']:chapter==='sleep'?['gaming-06']:[],
  position:{x:8+(order-1)*16.8,y:chapter==='study'?18:chapter==='gaming'?50:82},target:objective.target
});
export const MAIN_MISSIONS=freeze([
  main('study-01','Ein klarer Anfang','Lerne die vier ersten Signale kennen. Triff in 30 Sekunden mindestens 8 richtige Entscheidungen.','study',1,30,{metric:'correct',target:8},['streak','homework','gameclip','pencil'],3),
  main('study-02','Genau statt hektisch','Triff mindestens 10 richtige Entscheidungen und mache höchstens einen Fehler. Die Runde dauert 35 Sekunden.','study',2,35,{metric:'precision',target:10,maxErrors:1},['autoplay','urgent-school','ad','break','streak','homework']),
  main('study-03','Platz für Wichtiges','Lass mindestens 6 hilfreiche Dinge unberührt durch. Schulmaterial und echte Pausen helfen dir beim Lernen.','study',3,40,{metric:'useful',target:6},['homework','streak','pencil','autoplay','break','urgent-school']),
  main('study-04','Deine ruhige Serie','Schaffe 12 richtige Entscheidungen hintereinander. Ein Fehler unterbricht deine Serie.','study',4,40,{metric:'streak',target:12},['gameclip','pencil','scary-lure','urgent-school','autoplay','break']),
  main('study-05','Echte Warnungen zählen','Lass 3 echte Sicherheitswarnungen unberührt durch. Aufdringliche Klick-Köder können warten.','study',5,45,{metric:'signal',target:3,contentId:'safety'},['safety','scary-lure','homework','safety','autoplay','streak']),
  main('study-06','Fokusprüfung','Beende 50 Sekunden mit mindestens 16 richtigen Entscheidungen und 90 Prozent Genauigkeit. Danach öffnet sich die Gamingwelt.','study',6,50,{metric:'accuracy',target:90,minCorrect:16},['urgent-school','streak','pencil','gameclip','safety','autoplay','break','homework'],6),
  main('gaming-01','Willkommen im Team','Jetzt sind Team-Einladungen und Spieltipps sinnvoll. Triff 8 richtige Entscheidungen und bestätige am Zeitlimit deinen Stopp.','gaming',1,30,{metric:'correct',target:8},['gaming-invite','autoplay','gameclip','ad','loot','streak'],3),
  main('gaming-02','Gemeinsam statt endlos','Lass 6 hilfreiche Team- oder Pausensignale durch. Werbung und Autoplay bleiben Ablenkungen.','gaming',2,35,{metric:'useful',target:6},['gaming-invite','ad','loot','streak','gameclip','break']),
  main('gaming-03','Werbung ohne Treffer','Triff 12 richtige Entscheidungen mit höchstens einem Fehler. Behalte den Überblick zwischen Werbung und Spieltipps.','gaming',3,40,{metric:'precision',target:12,maxErrors:1},['ad','gameclip','autoplay','loot','streak','gaming-invite']),
  main('gaming-04','Team im Flow','Schaffe eine Serie von 14 richtigen Entscheidungen. Nutze die bekannte Bedeutung der Signale in deiner Gamingrunde.','gaming',4,45,{metric:'streak',target:14},['loot','streak','gaming-invite','ad','gameclip','autoplay']),
  main('gaming-05','Warnung bleibt wichtig','Lass 3 echte Sicherheitswarnungen durch und spiele bis zu deiner vereinbarten Grenze.','gaming',5,45,{metric:'signal',target:3,contentId:'safety'},['safety','ad','gameclip','safety','streak','gaming-invite']),
  main('gaming-06','Mein Limit gehört mir','Triff mindestens 16 richtige Entscheidungen und höre am 50-Sekunden-Limit auf. Keine Verlängerung. Danach öffnet sich die Schlafwelt.','gaming',6,50,{metric:'boundary',target:16,minElapsed:50},['gaming-invite','streak','loot','autoplay','break','ad','safety','gameclip'],6),
  main('sleep-01','Abendruhe','Kissen, Teddy und Mond sind jetzt hilfreich. Triff in 30 Sekunden 8 richtige Entscheidungen.','sleep',1,30,{metric:'correct',target:8},['quiet','autoplay','teddy','streak','moon','gameclip'],3),
  main('sleep-02','Ruhe darf bleiben','Lass mindestens 6 hilfreiche Ruhesignale unberührt. Nicht jede Meldung verlangt eine Antwort.','sleep',2,35,{metric:'useful',target:6},['quiet','streak','moon','autoplay','teddy','break']),
  main('sleep-03','Kein falscher Alarm','Triff 12 richtige Entscheidungen mit höchstens einem Fehler. Schulaufträge können am späten Abend bis morgen warten.','sleep',3,40,{metric:'precision',target:12,maxErrors:1},['urgent-school','quiet','gameclip','moon','autoplay','teddy']),
  main('sleep-04','Sternenserie','Schaffe 14 richtige Entscheidungen hintereinander. Bleib bei deinem Ziel, zur Ruhe zu kommen.','sleep',4,45,{metric:'streak',target:14},['streak','moon','scary-lure','quiet','autoplay','teddy']),
  main('sleep-05','Sicher durch die Nacht','Lass 3 echte Sicherheitswarnungen durch. Sie bleiben auch am Abend wichtig; Klick-Köder nicht.','sleep',5,45,{metric:'signal',target:3,contentId:'safety'},['safety','scary-lure','quiet','safety','autoplay','moon']),
  main('sleep-06','Ein gutes Ende','Triff mindestens 12 richtige Entscheidungen. Beende ab Sekunde 30 mit dem Stopp-Knopf, ohne das Bonusangebot anzunehmen.','sleep',6,50,{metric:'healthy-stop',target:12,minElapsed:30},['quiet','streak','moon','autoplay','teddy','gameclip','break','safety'],6)
]);
export const CAREER_MISSIONS=freeze([...MAIN_MISSIONS,...LEGACY_MISSIONS.map(mission=>({...mission,section:'challenge',chapter:null}))]);
const MISSION_MAP=new Map(CAREER_MISSIONS.map(mission=>[mission.id,mission]));
const BOSS_MAP=new Map(BOSS_DEFINITIONS.map(boss=>[boss.id,boss]));
const WEEK_COLUMNS=freeze([
  [
    {id:'week-decisions',title:'Hundert klare Momente',description:'Triff diese Woche insgesamt 100 richtige Entscheidungen.',metric:'correct',target:100,reward:4,icon:'focus'},
    {id:'week-swipes',title:'Ablenkungen im Griff',description:'Zerteile diese Woche insgesamt 75 Ablenkungen.',metric:'cuts',target:75,reward:4,icon:'slice'},
    {id:'week-keep',title:'Platz für Wichtiges',description:'Lass diese Woche 50 sinnvolle Dinge unberührt.',metric:'useful',target:50,reward:4,icon:'keep'}
  ],
  [
    {id:'week-streak',title:'Fokus ohne Unterbrechung',description:'Schaffe 25 richtige Entscheidungen ohne Fehler in einer Runde.',metric:'streak',target:25,reward:5,icon:'combo'},
    {id:'week-precision',title:'Dreimal mit Bedacht',description:'Beende drei Runden mit mindestens 20 richtigen Entscheidungen und höchstens 2 Fehlern.',metric:'precise',target:3,reward:5,icon:'shield'},
    {id:'week-flow',title:'Die Flow-Woche',description:'Aktiviere diese Woche insgesamt zwölfmal Focus Flow.',metric:'flow',target:12,reward:5,icon:'flow'}
  ],
  [
    {id:'week-open',title:'Eineinhalb Minuten Mut',description:'Überlebe 90 Sekunden in einem Open Run.',metric:'openSeconds',target:90,reward:6,icon:'clock'},
    {id:'week-routine',title:'Deine Ninja-Routine',description:'Beende fünf Runden mit jeweils mindestens 8 richtigen Entscheidungen.',metric:'runs',target:5,reward:6,icon:'ninja'},
    {id:'week-study',title:'Fokus für deine Ziele',description:'Triff 120 richtige Entscheidungen im Lernzimmer oder Open Run.',metric:'study',target:120,reward:6,icon:'study'}
  ]
]);
export const WEEKLY_CHALLENGES=Object.freeze(WEEK_COLUMNS.flat());
const RUN_MODES=new Set(['campaign','study','gaming','sleep','master','open','boss']);
const RESULTS=new Set(['complete','healthy-stop','locked','lives']);
const validId=value=>typeof value==='string'&&/^\d{1,16}:\d{1,16}:(?:campaign|study|gaming|sleep|master|open|boss)$/.test(value)?value:'';

/** Guests use local Mondays; accounts use fixed UTC Mondays across devices. */
export function getWeekInfo(now=Date.now(),calendar='local') {
  const utc=calendar==='utc',yearOf=date=>utc?date.getUTCFullYear():date.getFullYear(),monthOf=date=>utc?date.getUTCMonth():date.getMonth(),dayOf=date=>utc?date.getUTCDate():date.getDate();
  const atMidnight=(year,month,day)=>utc?new Date(Date.UTC(year,month,day)):new Date(year,month,day);
  let date=new Date(now instanceof Date?now.getTime():now);
  if(!Number.isFinite(date.getTime())||yearOf(date)<1970||yearOf(date)>9998)date=new Date();
  const weekday=((utc?date.getUTCDay():date.getDay())+6)%7;
  const monday=atMidnight(yearOf(date),monthOf(date),dayOf(date)-weekday);
  const next=atMidnight(yearOf(monday),monthOf(monday),dayOf(monday)+7);
  const ordinal=Math.floor(Date.UTC(yearOf(monday),monthOf(monday),dayOf(monday))/86400000);
  const thursday=new Date((ordinal+3)*86400000),year=thursday.getUTCFullYear();
  const january4=new Date(Date.UTC(year,0,4));
  const firstMonday=Math.floor(january4.getTime()/86400000)-(january4.getUTCDay()+6)%7;
  const weekNumber=1+Math.floor((ordinal-firstMonday)/7),rotation=mod(Math.floor((ordinal-4)/7),3);
  const end=atMidnight(yearOf(next),monthOf(next),dayOf(next)-1);
  const format=value=>value.toLocaleDateString('de-DE',{day:'numeric',month:'long',...(utc?{timeZone:'UTC'}:{})});
  return {week:`${year}-W${String(weekNumber).padStart(2,'0')}`,label:`${format(monday)} – ${format(end)}`,start:monday.getTime(),next:next.getTime(),daysRemaining:7-weekday,skinId:WEEKLY_SKINS[rotation].id,rotation};
}
function tasksFor(now,calendar){const {rotation}=getWeekInfo(now,calendar);return WEEK_COLUMNS.map((column,index)=>column[(rotation+index)%column.length]);}

/** Sanitizes only this feature's state; old balances, unlocks and records survive. */
export function normalizeAdventure(profile,now=Date.now()) {
  const source=object(profile?.adventure)?profile.adventure:{},completed=[];
  for(const mission of CAREER_MISSIONS)if(Array.isArray(source.completed)&&source.completed.includes(mission.id)&&mission.requires.every(id=>completed.includes(id)))completed.push(mission.id);
  const claimed=CAREER_MISSIONS.filter(mission=>completed.includes(mission.id)&&Array.isArray(source.claimed)&&source.claimed.includes(mission.id)).map(mission=>mission.id);
  const progress=Object.fromEntries(CAREER_MISSIONS.map(mission=>[mission.id,completed.includes(mission.id)?mission.target:Math.min(mission.target-1,count(source.progress?.[mission.id]))]));
  const info=getWeekInfo(now,profile?.accountCalendar),tasks=tasksFor(now,profile?.accountCalendar),oldWeek=object(source.weekly)?source.weekly:{},sameWeek=oldWeek.week===info.week;
  const weeklyProgress=Object.fromEntries(tasks.map(task=>[task.id,sameWeek?Math.min(task.target,count(oldWeek.progress?.[task.id])):0]));
  const weeklyClaimed=tasks.filter(task=>sameWeek&&weeklyProgress[task.id]>=task.target&&Array.isArray(oldWeek.claimed)&&oldWeek.claimed.includes(task.id)).map(task=>task.id);
  const ownedWeeklySkins=WEEKLY_SKINS.filter(skin=>(Array.isArray(profile?.unlockedSkins)&&profile.unlockedSkins.includes(skin.id))||(Array.isArray(source.ownedWeeklySkins)&&source.ownedWeeklySkins.includes(skin.id))).map(skin=>skin.id);
  const best=Object.fromEntries(CAREER_MISSIONS.flatMap(mission=>{
    const entry=source.best?.[mission.id];if(!object(entry))return [];
    return [[mission.id,{score:count(entry.score),correct:count(entry.correct),accuracy:Math.min(100,count(entry.accuracy)),streak:count(entry.streak),elapsed:Math.min(1000000,Math.max(0,Number(entry.elapsed)||0)),completed:entry.completed===true}]];
  }));
  const adventure={version:CAMPAIGN_VERSION,completed,claimed,progress,best,ownedWeeklySkins,
    lastRunOrdinal:Math.min(count(profile?.totalRuns),count(source.lastRunOrdinal)),
    recentRunIds:[...new Set((Array.isArray(source.recentRunIds)?source.recentRunIds:[]).map(validId).filter(Boolean))].slice(-64),
    weekly:{week:info.week,progress:weeklyProgress,claimed:weeklyClaimed,skinClaimed:sameWeek&&oldWeek.skinClaimed===true&&tasks.every(task=>weeklyProgress[task.id]>=task.target)}};
  if(object(profile))profile.adventure=adventure;
  return adventure;
}

/** Chapter progress opens the next world; earlier coin purchases remain valid. */
export function applyCampaignWorldUnlocks(profile){
  if(!object(profile))return [];
  const completed=Array.isArray(profile.adventure?.completed)?profile.adventure.completed:[],events=[];
  const worlds=Array.isArray(profile.unlockedWorlds)?profile.unlockedWorlds:['study'];
  for(const [missionId,world]of [['study-06','gaming'],['gaming-06','sleep']])if(completed.includes(missionId)&&!worlds.includes(world)){
    worlds.push(world);events.push({type:'campaign-world-unlocked',id:world});
  }
  profile.unlockedWorlds=worlds;return events;
}
export function getCampaignChapters(profile,now=Date.now()){
  const missions=getCareerMissions(profile,now);
  return ['study','gaming','sleep'].map((id,index)=>{const chapter=missions.filter(mission=>mission.chapter===id),completed=chapter.filter(mission=>mission.completed).length;
    return {id,index:index+1,title:['Lernen','Gaming','Schlafen'][index],completed,total:6,unlocked:profile?.unlockedWorlds?.includes(id)||id==='study',missions:chapter};});
}

export function getCareerMissions(profile,now=Date.now()) {
  const adventure=normalizeAdventure(profile,now);applyCampaignWorldUnlocks(profile);const worlds=Array.isArray(profile?.unlockedWorlds)?profile.unlockedWorlds:['study'];
  return CAREER_MISSIONS.map(mission=>{
    const completed=adventure.completed.includes(mission.id),claimed=adventure.claimed.includes(mission.id);
    const missingRequirements=mission.requires.filter(id=>!adventure.completed.includes(id));
    const worldLocked=Boolean(mission.requiredWorld&&mission.requiredWorld!=='study'&&!worlds.includes(mission.requiredWorld));
    const locked=missingRequirements.length>0||worldLocked;
    return {...detached(mission),current:adventure.progress[mission.id],best:adventure.best[mission.id]?detached(adventure.best[mission.id]):null,status:completed?'completed':locked?'locked':'available',completed,claimed,ready:completed&&!claimed,locked,available:!locked,missingRequirements,worldLocked};
  });
}
export function getCareerMission(profile,id,now=Date.now()){return getCareerMissions(profile,now).find(mission=>mission.id===id)||null;}

export function getWeeklyChallenges(profile,now=Date.now()) {
  const adventure=normalizeAdventure(profile,now);
  return tasksFor(now,profile?.accountCalendar).map(task=>({...task,week:adventure.weekly.week,current:adventure.weekly.progress[task.id],completed:adventure.weekly.progress[task.id]>=task.target,claimed:adventure.weekly.claimed.includes(task.id)}));
}
export function getWeeklyReward(profile,now=Date.now()) {
  const adventure=normalizeAdventure(profile,now),info=getWeekInfo(now,profile?.accountCalendar),skin=WEEKLY_SKINS.find(item=>item.id===info.skinId);
  const completed=tasksFor(now,profile?.accountCalendar).filter(task=>adventure.weekly.progress[task.id]>=task.target).length;
  const owned=adventure.ownedWeeklySkins.includes(skin.id),claimed=owned||adventure.weekly.skinClaimed;
  return {id:skin.id,skin:{...skin},week:info.week,ready:completed===3&&!claimed,claimed,completed,total:3,owned};
}

function studyDecisions(state,stats,correct) {
  if(state.mode==='open'||state.mode==='study')return correct;
  if(state.mode!=='campaign')return 0;
  const stages=Array.isArray(stats.stageStats)?stats.stageStats:[];
  const first=stages.find(stage=>object(stage)&&stage.levelIndex===0&&stage.context==='study');
  return Math.min(correct,first?count(first.correctDecisions):state.levelIndex===0?count(state.stageMetrics?.correctDecisions):0);
}
function missionResult(mission,state,correct,errors,elapsed) {
  if(state.mode!==mission.mode)return {completed:false,current:0};
  if(mission.section==='main'){
    const objective=mission.objective,accuracy=correct+errors?Math.floor(correct/(correct+errors)*100):0;
    const values={correct,precision:correct,useful:count(state.metrics?.usefulPassed),streak:count(state.bestDecisionStreak),signal:count(state.metrics?.helpfulById?.[objective.contentId]),accuracy,boundary:correct,'healthy-stop':correct};
    const current=values[objective.metric]||0,finished=['complete','healthy-stop'].includes(state.result);
    const completed=finished&&current>=objective.target&&correct>=8&&
      (objective.maxErrors===undefined||errors<=objective.maxErrors)&&correct>=(objective.minCorrect||0)&&
      (objective.metric!=='boundary'||state.result==='healthy-stop'&&count(state.metrics?.limitExtensions)===0&&!state.extensionUsed)&&
      (objective.metric!=='healthy-stop'||state.result==='healthy-stop'&&count(state.metrics?.sleepContinues)===0&&!state.sleepContinued)&&
      elapsed+.000001>=(objective.minElapsed||mission.duration-.05);
    return {completed,current};
  }
  if(mission.bossId){const boss=BOSS_MAP.get(mission.bossId);return {completed:state.result==='complete'&&state.boss?.id===boss.id&&state.boss.defeated===true&&state.boss.health===0&&correct>=boss.maxHealth,current:Math.max(0,boss.maxHealth-count(state.boss?.health))};}
  if(mission.id==='study-focus')return {completed:state.result==='complete'&&correct>=20&&errors<=2,current:Math.min(20,correct)};
  if(mission.id==='open-trial')return {completed:elapsed>=45&&correct>=20&&state.result==='lives',current:correct>=20?Math.floor(elapsed):0};
  if(mission.id==='gaming-boundary')return {completed:state.result==='healthy-stop'&&correct>=8&&elapsed>=15&&count(state.metrics?.limitExtensions)===0&&state.extensionUsed!==true,current:0};
  if(mission.id==='sleep-sanctuary')return {completed:state.result==='healthy-stop'&&correct>=8&&elapsed>=8&&count(state.metrics?.sleepContinues)===0&&state.sleepContinued!==true,current:0};
  return {completed:state.result==='complete'&&correct>=20,current:0};
}

/** Evaluate this attempt, independently of a reward already earned on an earlier run. */
export function getMissionOutcome(state){
  const mission=MISSION_MAP.get(state?.missionId);if(!mission)return null;
  const stats=object(state.metrics)?state.metrics:{},correct=count(stats.correctDecisions);
  const errors=add(add(count(stats.usefulMistakes),count(stats.missedDistractions)),count(stats.shieldedMistakes));
  const elapsed=typeof state.elapsed==='number'&&Number.isFinite(state.elapsed)?Math.max(0,state.elapsed):0;
  const result=missionResult(mission,state,correct,errors,elapsed);
  return {id:mission.id,title:mission.title,target:mission.target,current:Math.min(mission.target,count(result.current)),passed:state.ended===true&&state.credited===true&&!state.isTutorial&&correct>=8&&elapsed>=(state.result==='healthy-stop'?8:15)&&result.completed};
}

/** Call once after core run credit. Training/abandonment never advances rewards. */
export function recordAdventureRun(profile,state,now=Date.now()) {
  if(!object(profile))return [];
  const adventure=normalizeAdventure(profile,now);
  if(!object(state)||state.ended!==true||state.credited!==true||state.isTutorial===true||!RUN_MODES.has(state.mode)||!RESULTS.has(state.result))return [];
  if(state.mode==='boss'&&!BOSS_MAP.has(state.boss?.id))return [];
  const ordinal=count(profile.totalRuns),serial=count(state.runSerial),startedAt=count(state.startedAt),runId=validId(`${startedAt}:${serial}:${state.mode}`);
  if(!ordinal||!serial||!startedAt||!runId||ordinal<=adventure.lastRunOrdinal||adventure.recentRunIds.includes(runId))return [];
  adventure.lastRunOrdinal=ordinal;adventure.recentRunIds=[...adventure.recentRunIds,runId].slice(-64);
  const stats=object(state.metrics)?state.metrics:{},correct=count(stats.correctDecisions);
  const elapsed=typeof state.elapsed==='number'&&Number.isFinite(state.elapsed)?Math.max(0,state.elapsed):0;
  if(correct<8||elapsed<(state.result==='healthy-stop'?8:15))return [];
  const errors=add(add(count(stats.usefulMistakes),count(stats.missedDistractions)),count(stats.shieldedMistakes)),events=[];
  const mission=MISSION_MAP.get(state.missionId);
  if(mission&&mission.mode===state.mode){
    const best={score:count(state.score),correct,accuracy:correct+errors?Math.floor(correct/(correct+errors)*100):0,streak:count(state.bestDecisionStreak),elapsed,completed:adventure.completed.includes(mission.id)||missionResult(mission,state,correct,errors,elapsed).completed};
    const previous=adventure.best[mission.id];
    if(!previous||best.score>previous.score)adventure.best[mission.id]=best;
  }
  if(mission&&!adventure.completed.includes(mission.id)&&mission.requires.every(id=>adventure.completed.includes(id))&&(!mission.requiredWorld||mission.requiredWorld==='study'||profile.unlockedWorlds?.includes(mission.requiredWorld))){
    const result=missionResult(mission,state,correct,errors,elapsed);
    adventure.progress[mission.id]=Math.max(adventure.progress[mission.id],Math.min(mission.target-1,count(result.current)));
    if(result.completed){if(adventure.best[mission.id])adventure.best[mission.id].completed=true;adventure.completed.push(mission.id);adventure.progress[mission.id]=mission.target;events.push({type:'career-completed',id:mission.id,title:mission.title,reward:mission.reward});}
  }
  events.push(...applyCampaignWorldUnlocks(profile));
  const week=getWeekInfo(now,profile?.accountCalendar);
  // Finishing an old saved run after Monday cannot fill the new week's tasks.
  if(startedAt<week.start||startedAt>=week.next||startedAt>new Date(now).getTime())return events;
  const values={correct,cuts:count(stats.cuts),useful:count(stats.usefulPassed),streak:count(state.bestDecisionStreak),precise:Number(correct>=20&&errors<=2),flow:count(stats.flowTriggers),openSeconds:state.mode==='open'?Math.floor(elapsed):0,runs:1,study:studyDecisions(state,stats,correct)};
  for(const task of tasksFor(now,profile?.accountCalendar)){
    const previous=adventure.weekly.progress[task.id],value=values[task.metric];
    const current=Math.min(task.target,['streak','openSeconds'].includes(task.metric)?Math.max(previous,value):add(previous,value));
    adventure.weekly.progress[task.id]=current;
    if(previous<task.target&&current>=task.target)events.push({type:'weekly-completed',id:task.id,title:task.title,week:week.week,reward:task.reward});
  }
  return events;
}
function credit(profile,reward){const coins=count(profile.coins),credited=Math.min(reward,MAX-coins);profile.coins=coins+credited;if(!object(profile.stats))profile.stats={};profile.stats.coinsEarned=add(count(profile.stats.coinsEarned),credited);return credited;}
export function claimCareerReward(profile,id,now=Date.now()){
  if(!object(profile))return fail('Der Spielstand ist ungültig.');
  const mission=MISSION_MAP.get(id);if(!mission)return fail('Diese Mission gibt es nicht.');
  const adventure=normalizeAdventure(profile,now);
  if(!adventure.completed.includes(id))return fail('Schaffe zuerst diese Mission.');
  if(adventure.claimed.includes(id))return fail('Diese Missionsbelohnung hast du schon abgeholt.');
  adventure.claimed.push(id);const reward=credit(profile,mission.reward);return {ok:true,id,reward,coins:profile.coins};
}
export function claimWeeklyReward(profile,id,now=Date.now()){
  if(!object(profile))return fail('Der Spielstand ist ungültig.');
  const task=tasksFor(now,profile?.accountCalendar).find(item=>item.id===id);if(!task)return fail('Diese Wochenaufgabe ist gerade nicht verfügbar.');
  const adventure=normalizeAdventure(profile,now);
  if(adventure.weekly.progress[id]<task.target)return fail('Diese Wochenaufgabe ist noch nicht geschafft.');
  if(adventure.weekly.claimed.includes(id))return fail('Diese Wochenbelohnung hast du schon abgeholt.');
  adventure.weekly.claimed.push(id);const reward=credit(profile,task.reward);return {ok:true,id,week:adventure.weekly.week,reward,coins:profile.coins};
}
export function claimWeeklySkin(profile,now=Date.now()){
  if(!object(profile))return fail('Der Spielstand ist ungültig.');
  const reward=getWeeklyReward(profile,now);if(reward.claimed)return fail('Dieses Wochenoutfit gehört dir bereits.');
  if(!reward.ready)return fail('Schaffe zuerst alle drei Wochenaufgaben.');
  profile.adventure.weekly.skinClaimed=true;profile.adventure.ownedWeeklySkins.push(reward.id);
  profile.unlockedSkins=[...new Set(['default',...(Array.isArray(profile.unlockedSkins)?profile.unlockedSkins.filter(id=>typeof id==='string'):[]),reward.id])];
  return {ok:true,id:reward.id,skin:{...reward.skin},week:reward.week};
}
