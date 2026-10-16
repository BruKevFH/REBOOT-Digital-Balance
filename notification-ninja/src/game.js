import { BOSS_DEFINITIONS, getBoss, createBossState, restoreBossState, getBossSpeed, bossPhaseForHealth } from './boss.js';
export { BOSS_DEFINITIONS } from './boss.js';
import { THROW_RECOVERY, getThrowerLayout, getThrowerPose, isThrowReady } from './throwers.js';
import { GUIDE_IDS, normalizePlayer, validateUsername, validateNotification } from './player.js';
import { normalizeJourney, recordDailyRun, claimDailyReward as claimDaily, applyRankUnlocks } from './journey.js';
import { WEEKLY_SKINS, CAREER_MISSIONS, normalizeAdventure, getCareerMission, recordAdventureRun, claimCareerReward as claimCareer, claimWeeklyReward as claimWeekly, claimWeeklySkin as claimOutfit } from './adventure.js';
export { GUIDE_IDS, normalizePlayer, validateUsername, getPlayerProgress } from './player.js';
import { DIFFICULTIES, SKILLS, ACHIEVEMENTS, WORLDS, BACKGROUNDS, buyWorld as purchaseWorld, buyBackground as purchaseBackground, equipBackground, sanitizeProgress, buySkill as purchaseSkill, equipSuper, claimAchievement as claimReward, unlockAchievements, getDifficulty, getSpeedFactor, getOpenSpeedFactor } from './progression.js';
export { DIFFICULTIES, SKILLS, ACHIEVEMENTS, WORLDS, BACKGROUNDS } from './progression.js';
export const STORAGE_KEY = 'notification-ninja:save:v1';
export const OPEN_RULESET = 'open-v2';
export const LEVELS = [
  {id:'study',context:'study',title:'Lernen',duration:75,description:'Schulaufträge behalten. Streaks und Clips wegwischen.',goal:'Relevanz folgt deinem aktuellen Ziel.'},
  {id:'gaming',context:'gaming',title:'Gaming mit Grenze',duration:90,description:'Spielsignale dürfen jetzt wichtig sein. Deine gewählte Grenze bleibt sichtbar.',goal:'45, 60 oder 90 Sekunden: Du entscheidest am Limit.'},
  {id:'sleep',context:'sleep',title:'Schlaf & Ruhe',duration:75,stopAt:8,description:'Ruhe behalten. Reißerische Meldungen brauchen keine Antwort.',goal:'Früh Schluss machen ist eine gültige, belohnte Entscheidung.'},
  {id:'master',context:'study',title:'Context Master',duration:90,description:'Lernen → Gaming → Schlaf → Lernen. Die gleiche Nachricht kann ihre Bedeutung wechseln.',goal:'Der Kontext beim Start einer Karte zählt bis zu ihrem Ende.'}
];
export const SKINS = [
  {id:'default',name:'Ninja Mint',cost:0,color:'#75f6cd'},
  {id:'solar',name:'Solar Slice',cost:80,color:'#ffd171'},
  {id:'mint',name:'Arctic Focus',cost:180,color:'#83deff'},
  {id:'neon',name:'Violet Flow',cost:320,color:'#d8a3ff'},
  {id:'dawn',name:'Morgenwind',cost:0,color:'#f6b85c',unlock:'rank',rank:'dawn'},
  {id:'shadow',name:'Schatten-Ninja',cost:0,color:'#6570ab',unlock:'rank',rank:'shadow'},
  {id:'grandmaster',name:'Großmeister',cost:0,color:'#e9d29a',unlock:'rank',rank:'grandmaster'},
  ...WEEKLY_SKINS
];
const kinds = (study,gaming,sleep) => ({study,gaming,sleep});
export const CONTENT = [
  {id:'streak',label:'STREAK RETTEN!',shortLabel:'STREAK',visual:'phone',text:'Deine Serie wartet. Öffne den Feed!',brand:'SOCIAL',icon:'🔥',color:'#ff917d',kindByContext:kinds('distraction','distraction','distraction')},
  {id:'urgent-school',label:'SCHULE · WICHTIG',shortLabel:'AUFTRAG',visual:'assignment',text:'Der Gruppenauftrag braucht deine Rückmeldung.',brand:'SCHULE',icon:'✉',color:'#8bb9ff',kindByContext:kinds('useful','useful','distraction')},
  {id:'homework',label:'HAUSAUFGABEN',shortLabel:'LERNHEFT',visual:'notebook',text:'Eine neue Aufgabe – heute ist noch Zeit.',brand:'SCHULE',icon:'▤',color:'#8bb9ff',kindByContext:kinds('useful','distraction','distraction')},
  {id:'pencil',label:'STIFT & LINEAL',shortLabel:'STIFTE',visual:'pencil',text:'Deine Schulsachen helfen dir beim Lernen.',brand:'SCHULE',icon:'✎',color:'#e9bc65',kindByContext:kinds('useful','distraction','distraction')},
  {id:'gameclip',label:'NEUER GAME-CLIP',shortLabel:'SPIELTIPP',visual:'gameclip',text:'Ein Spieltipp für deine nächste Runde.',brand:'GAME',icon:'▶',color:'#c0a0ff',kindByContext:kinds('distraction','useful','distraction')},
  {id:'gaming-invite',label:'GAMING-EINLADUNG',shortLabel:'DEIN TEAM',visual:'controller',text:'Dein Team ist bereit für die nächste Runde.',brand:'GAME',icon:'✚',color:'#c0a0ff',kindByContext:kinds('distraction','useful','distraction')},
  {id:'loot',label:'TEAM-TROPHÄE',shortLabel:'TROPHÄE',visual:'loot',text:'Eine gemeinsam erspielte Trophäe für deine Sammlung.',brand:'GAME',icon:'★',color:'#e7b869',kindByContext:kinds('distraction','useful','distraction')},
  {id:'ad',label:'JETZT KAUFEN!',shortLabel:'WERBUNG',visual:'ad',text:'Ein angeblich einmaliges Angebot kann warten.',brand:'WERBUNG',icon:'!',color:'#efb37b',kindByContext:kinds('distraction','distraction','distraction')},
  {id:'autoplay',label:'NOCH EIN VIDEO!',shortLabel:'AUTOPLAY',visual:'video',text:'Das nächste Video startet, obwohl du etwas anderes vorhast.',brand:'FEED',icon:'▶',color:'#c4a9ce',kindByContext:kinds('distraction','distraction','distraction')},
  {id:'break',label:'KURZE PAUSE',shortLabel:'TRINKPAUSE',visual:'energy',text:'Trinken, durchatmen, eine Sache nach der anderen.',brand:'PAUSE',icon:'◌',color:'#a0ddd1',kindByContext:kinds('useful','useful','useful')},
  {id:'quiet',label:'RUHEZEIT',shortLabel:'KISSEN',visual:'pillow',text:'Die Schlafenszeit-Erinnerung darf bleiben.',brand:'RUHE',icon:'☾',color:'#9fb6da',kindByContext:kinds('distraction','distraction','useful')},
  {id:'teddy',label:'KUSCHELZEIT',shortLabel:'TEDDY',visual:'teddy',text:'Gemütlich werden und ohne Bildschirm zur Ruhe kommen.',brand:'RUHE',icon:'♥',color:'#d5ac82',kindByContext:kinds('distraction','distraction','useful')},
  {id:'moon',label:'GUTE NACHT',shortLabel:'GUTE NACHT',visual:'moon',text:'Ein ruhiges Abendritual hilft dir beim Einschlafen.',brand:'RUHE',icon:'☾',color:'#f1cc7a',kindByContext:kinds('distraction','distraction','useful')},
  {id:'scary-lure',label:'DU VERPASST ALLES!',shortLabel:'KLICK-KÖDER',visual:'phone',text:'Künstliche Dringlichkeit: Jetzt sofort klicken!',brand:'FEED',icon:'!',color:'#ffbd80',kindByContext:kinds('distraction','distraction','distraction')},
  {id:'safety',label:'ECHTE WARNUNG',shortLabel:'WARNUNG',visual:'shield',text:'Eine wichtige Sicherheitsmeldung behalten.',brand:'SICHERHEIT',icon:'△',color:'#ffc783',kindByContext:kinds('useful','useful','useful')},
  {id:'update',label:'UPDATE · MORGEN',shortLabel:'UPDATE',visual:'phone',text:'Kein Notfall. Dieses Update kann warten.',brand:'SYSTEM',icon:'↻',color:'#8ed1e0',kindByContext:kinds('distraction','distraction','distraction')},
  {id:'power-coins',label:'MÜNZE +1',shortLabel:'MÜNZE +1',visual:'coin',text:'Eine seltene Münze für deinen Fähigkeitenbaum.',brand:'BONUS',icon:'●',color:'#ffd367',powerup:'coins'},
  {id:'power-slow',label:'ZEITLUPE',shortLabel:'ZEITLUPE',visual:'clock',text:'6 Sekunden langsamere Gegenstände, normale Spielzeit.',brand:'TOOL',icon:'◷',color:'#80d4f8',powerup:'slow'},
  {id:'power-shield',label:'FOKUS-SCHILD',shortLabel:'SCHILD',visual:'shield',text:'Fängt genau einen Fehler ab.',brand:'TOOL',icon:'⬡',color:'#84f2cb',powerup:'shield'},
  {id:'power-multiplier',label:'PUNKTE ×2',shortLabel:'PUNKTE ×2',visual:'star',text:'10 Sekunden doppelte Arcade-Punkte.',brand:'TOOL',icon:'×2',color:'#ffda86',powerup:'multiplier'}
];

// Familiar objects belong to the room; shared signals still keep their contextual meaning.
const POOLS = {
  study:['homework','pencil','urgent-school','streak','gameclip','autoplay','scary-lure','break','safety'],
  gaming:['gaming-invite','loot','gameclip','ad','autoplay','streak','urgent-school','break','safety'],
  sleep:['quiet','teddy','moon','autoplay','streak','scary-lure','gameclip','break','safety']
};
const MAX_LIVES = 5;

const MAX = Number.MAX_SAFE_INTEGER;
const MODES = ['campaign','study','gaming','sleep','master','open','boss'];
const CONTEXTS = ['study','gaming','sleep'];
const PLANS = {campaign:[0,1,2,3],study:[0],gaming:[1],sleep:[2],master:[3],open:[0],boss:[0]};
const CONTENT_MAP = new Map(CONTENT.map(item=>[item.id,item]));
const SKIN_MAP = new Map(SKINS.map(item=>[item.id,item]));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const number = (value,fallback=0,min=0,max=MAX) => typeof value === 'number' && Number.isFinite(value) ? Math.max(min,Math.min(max,value)) : fallback;
const integer = (value,fallback=0,min=0,max=MAX) => Math.trunc(number(value,fallback,min,max));
const clone = value => JSON.parse(JSON.stringify(value));
const clamp = (value,min,max) => Math.max(min,Math.min(max,value));
const smoothstep = value => {const p=clamp(value,0,1);return p*p*(3-2*p);};
function restoreLaunch(value,width,height,difficulty){
  if(!isObject(value)||!Number.isInteger(value.throwerIndex)||value.throwerIndex<0||value.throwerIndex>=getThrowerLayout(width,height,difficulty).length)return null;
  if(!['fromX','fromY','laneX','windup','arc','initialVy'].every(key=>Number.isFinite(value[key])))return null;
  if(value.fromX<0||value.fromX>width||value.fromY<0||value.fromY>height||value.laneX<0||value.laneX>width||value.windup<.04||value.windup>.5||value.arc<.000001||value.arc>.6||value.initialVy>=0||value.initialVy< -100000000)return null;
  return {throwerIndex:value.throwerIndex,fromX:value.fromX,fromY:value.fromY,laneX:value.laneX,windup:value.windup,arc:value.arc,initialVy:value.initialVy};
}
const fail = reason => ({ok:false,reason});
const hash = value => {let h=2166136261;for(const char of String(value))h=Math.imul(h^char.charCodeAt(0),16777619);return (h>>>0)||1;};
const scoreKeys = () => Object.fromEntries(MODES.map(mode=>[mode,0]));
const metrics = () => ({cuts:0,usefulPassed:0,usefulMistakes:0,missedDistractions:0,shieldedMistakes:0,lifeLost:0,healthyStops:0,powerups:0,flowTriggers:0,correctDecisions:0,superUses:0,limitExtensions:0,sleepContinues:0,contextsPlayed:[],stageStats:[]});
const stageMetrics = () => ({cuts:0,usefulPassed:0,usefulMistakes:0,missedDistractions:0,shieldedMistakes:0,correctDecisions:0,score:0,earnedCoins:0});
function profile() {return {coins:0,totalRuns:0,highScores:scoreKeys(),unlockedSkins:['default'],selectedSkin:'default',achievements:[],tutorialCompleted:false,player:normalizePlayer({}),...sanitizeProgress({})};}
function emptyState(seed,skin='default') {return {
  started:false,scene:'home',mode:'campaign',boss:null,missionId:null,levelIndex:0,stageIndex:0,context:'study',isTutorial:false,
  tutorialDecisions:0,tutorialCuts:0,tutorialPassed:0,tutorialResults:null,tutorialReason:null,
  difficulty:'easy',maxLives:5,speedFactor:1,runCoins:0,coinRemainder:0,superCharge:0,selectedSuper:null,skillIds:[],reviveUsed:false,bonusCoinPending:false,backgrounds:{study:'classroom',gaming:'game-room',sleep:'bedroom'},nextLockedWorld:null,bonusPhase:null,bonusClock:0,bonusNextAt:20,bonusSequence:0,
  objects:[],score:0,scoreArcade:0,balance:50,balanceScore:100,combo:0,bestCombo:0,decisionStreak:0,bestDecisionStreak:0,comboMilestones:[],lastMistake:null,openRuleset:null,overload:0,lives:MAX_LIVES,
  elapsed:0,stageElapsed:0,duration:75,remaining:75,awaitingNext:false,paused:false,stopAvailable:false,
  extensionUsed:false,sleepContinued:false,effects:{slow:0,shield:0,multiplier:0,flow:0},metrics:metrics(),stageMetrics:stageMetrics(),
  skin,ended:false,credited:false,result:null,awardedCoins:0,rng:seed,runSerial:0,objectSequence:0,spawnCount:0,spawnTimer:.5,
  pendingContext:null,masterSwitchIndex:0,history:[]
};}
function segmentOrder(points,obj,radius) {
  let walked=0;
  for(let i=1;i<points.length;i++) {
    const a=points[i-1],b=points[i],dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy);
    if(!length)continue;
    const t=Math.max(0,Math.min(1,((obj.x-a.x)*dx+(obj.y-a.y)*dy)/(length*length)));
    if(Math.hypot(obj.x-a.x-t*dx,obj.y-a.y-t*dy)<=radius)return walked+t*length;
    walked+=length;
  }
  return Infinity;
}

/** Pure, seeded game rules. Coordinates and swipe samples use renderer CSS pixels. */
export class NinjaGame {
  constructor({storage,now=()=>Date.now(),seed='Notification Ninja',width=1000,height=750}={}) {
    this.now=typeof now==='function'?now:()=>Date.now();this.seed=hash(seed);
    this.width=number(width,1000,240,5000);this.height=number(height,750,240,5000);
    this.storageFailed=false;this.storageError=null;
    if(storage===undefined){try{storage=typeof window!=='undefined'?globalThis.localStorage:null;}catch{storage=null;this.storageFailed=true;this.storageError='unavailable';}}
    this.storage=storage;this.profile=profile();this.state=emptyState(this.seed);this._restore();
    normalizeJourney(this.profile,this._time());this.initialJourneyEvents=applyRankUnlocks(this.profile,this._time());
    const adventure=normalizeAdventure(this.profile,this._time());
    for(const id of adventure.ownedWeeklySkins)if(!this.profile.unlockedSkins.includes(id))this.profile.unlockedSkins.push(id);
  }
  _time(){try{return number(this.now(),Date.now(),0,8640000000000000);}catch{return Date.now();}}
  _random(){let x=this.state.rng;x^=x<<13;x^=x>>>17;x^=x<<5;this.state.rng=(x>>>0)||1;return this.state.rng/4294967296;}
  _record(type,data={}){this.state.history.push({type,time:this._time(),elapsed:this.state.elapsed,context:this.state.context,...clone(data)});if(this.state.history.length>200)this.state.history.shift();}
  _achievement(id){if(!this.profile.achievements.includes(id))this.profile.achievements.push(id);}
  _hasSkill(id){return this.state.skillIds.includes(id);}
  _difficulty(){return getDifficulty(this.state.difficulty);}
  _speed(){return this.state.isTutorial?1:this.state.mode==='boss'?getBossSpeed(this.state.boss):this.state.mode==='open'?getOpenSpeedFactor(this.state.difficulty,this.state.elapsed):getSpeedFactor(this.state.difficulty,this.state.elapsed);}
  _coinCap(){return Math.floor(this._difficulty().coinCap*(this._hasSkill('coin-boost')?1.25:1));}
  _coinMultiplier(){return this._difficulty().coinMultiplier*(this._hasSkill('coin-boost')?1.25:1);}
  _earnCoins(amount,events,reason,position={}){const s=this.state;if(s.isTutorial||amount<=0)return;
    const total=amount*this._coinMultiplier()*(s.bonusPhase?.id==='coin-rush'?2:1)+s.coinRemainder;
    const rounded=Math.floor(total+.000000001),cap=this._coinCap();
    const earned=Math.max(0,Math.min(rounded,cap-s.stageMetrics.earnedCoins));s.coinRemainder=Math.max(0,total-rounded);s.runCoins=Math.min(MAX,s.runCoins+earned);s.stageMetrics.earnedCoins+=earned;
    if(earned)events.push({type:'coin-earned',amount:earned,total:s.runCoins,reason,...position});}
  _bonus(dt,events){const s=this.state;if(s.isTutorial||s.pendingContext)return;s.bonusClock+=dt;
    if(s.bonusPhase){s.bonusPhase.remaining=Math.max(0,s.bonusPhase.remaining-dt);if(s.bonusPhase.remaining<=.0000001){events.push({type:'bonus-phase-end',id:s.bonusPhase.id,name:s.bonusPhase.name});s.bonusPhase=null;}}
    if(!s.bonusPhase&&s.bonusClock>=s.bonusNextAt-.0000001){const phases=[{id:'coin-rush',name:'Münzregen'},{id:'combo-party',name:'Combo-Party'},{id:'focus-wave',name:'Fokus-Welle'}],phase=phases[s.bonusSequence++%phases.length];
      s.bonusPhase={...phase,remaining:6};if(phase.id==='coin-rush')s.bonusCoinPending=true;s.bonusNextAt+=20;events.push({type:'bonus-phase-start',...phase,duration:6});}}
  _radius(){return Math.min(this.width*.16,this.width<650?50:48);}
  _playable(){return this.state.started&&!this.state.ended&&this.state.scene==='playing'&&!this.state.paused;}
  _arcade(points){if(this.state.isTutorial)return;this.state.score=Math.min(MAX,this.state.score+points);this.state.scoreArcade=this.state.score;this.state.stageMetrics.score+=points;}
  _balance(){const m=this.state.metrics,correct=m.correctDecisions,wrong=m.usefulMistakes+m.missedDistractions;
    this.state.balanceScore=correct+wrong?Math.round(100*correct/(correct+wrong)):100;
    this.state.balanceScore=Math.max(0,Math.min(100,this.state.balanceScore+m.healthyStops*5-m.limitExtensions*5-m.sleepContinues*8));}
  _resetStage(){const s=this.state,level=LEVELS[s.levelIndex];s.context=level.context;s.objects=[];s.stageElapsed=0;
    s.duration=['open','boss'].includes(s.mode)?0:s.isTutorial?60:s.levelIndex===1?s.gamingLimit:level.duration;s.remaining=s.duration;
    s.combo=0;s.decisionStreak=0;s.effects={slow:0,shield:0,multiplier:0,flow:0};s.overload=Math.max(0,s.overload-15);
    s.stopAvailable=false;s.extensionUsed=false;s.sleepContinued=false;s.pendingContext=null;s.masterSwitchIndex=0;s.spawnTimer=['open','boss'].includes(s.mode)?1.4:.5;s.spawnCount=0;s.stageMetrics=stageMetrics();s.bonusPhase=null;s.bonusCoinPending=false;s.bonusClock=0;s.bonusNextAt=20;s.bonusSequence=0;
    s.speedFactor=this._speed();if(!s.metrics.contextsPlayed.includes(s.context))s.metrics.contextsPlayed.push(s.context);}
  start({mode='campaign',bossId=null,missionId=null,gamingLimit=90,skin=this.profile.selectedSkin,tutorial=true,difficulty='easy',forceTutorial=false}={}) {
    if(!DIFFICULTIES.some(item=>item.id===difficulty))return fail('Wähle einen gültigen Schwierigkeitsgrad.');
    if(!MODES.includes(mode))return fail('Wähle einen gültigen Spielmodus.');
    if(mode==='boss'&&!getBoss(bossId))return fail('Wähle einen gültigen Autoplay-Boss.');
    if(missionId!==null&&(typeof missionId!=='string'||!/^[-a-z0-9]{1,48}$/.test(missionId)))return fail('Unbekannte Mission.');
    if(mode==='boss'&&missionId===null)missionId=CAREER_MISSIONS.find(mission=>mission.bossId===bossId)?.id||null;
    if(missionId!==null){const mission=getCareerMission(this.profile,missionId,this._time());
      if(!mission||mission.mode!==mode||mission.bossId!==(mode==='boss'?bossId:null))return fail('Diese Mission passt nicht zu diesem Spielmodus.');
      if(mission.locked)return fail(mission.worldLocked?'Schalte zuerst den Raum dieser Mission im Basar frei.':'Schaffe zuerst die verbundenen Vorgängermissionen.');}
    if(!['campaign','open','boss'].includes(mode)&&!this.profile.unlockedWorlds.includes(mode))return fail('Schalte diese Welt zuerst mit Münzen im Weltplan frei.');
    if(![45,60,90].includes(gamingLimit))return fail('Die Gaming-Grenze muss 45, 60 oder 90 Sekunden sein.');
    if(!SKIN_MAP.has(skin)||!this.profile.unlockedSkins.includes(skin))return fail('Dieser Skin ist noch nicht freigeschaltet.');
    if(['open','boss'].includes(mode))difficulty='normal';
    const serial=this.state.runSerial+1,runSeed=mode==='open'?hash(`${this.seed}:open:${difficulty}`):hash(`${this.seed}:${mode}:${gamingLimit}`);this.state=emptyState(runSeed,skin);
    const s=this.state;s.started=true;s.startedAt=this._time();s.mode=mode;s.openRuleset=mode==='open'?OPEN_RULESET:null;s.boss=mode==='boss'?createBossState(bossId):null;s.missionId=missionId;s.gamingLimit=gamingLimit;s.runSerial=serial;
    s.isTutorial=mode==='campaign'&&tutorial!==false&&(forceTutorial===true||!this.profile.tutorialCompleted);s.stageIndex=s.isTutorial?-1:0;s.levelIndex=PLANS[mode][0];
    s.difficulty=difficulty;s.maxLives=s.isTutorial?5:['open','boss'].includes(mode)?3:this._difficulty().lives;s.lives=s.maxLives;s.selectedSuper=['open','boss'].includes(mode)?null:this.profile.selectedSuper;s.skillIds=['open','boss'].includes(mode)?[]:[...this.profile.unlockedSkills];s.backgrounds=clone(this.profile.selectedBackgrounds);
    s.scene='briefing';s.awaitingNext=true;this._resetStage();if(!s.isTutorial&&this._hasSkill('guard-root'))s.effects.shield=1;this._record('start',{mode,bossId:s.boss?.id||null,missionId,gamingLimit,difficulty,tutorial:s.isTutorial});this.save();return {ok:true,state:s,events:[]};
  }
  startMission(id,options={}){const mission=getCareerMission(this.profile,id,this._time());
    if(!mission)return fail('Diese Mission gibt es nicht.');
    if(mission.locked)return fail(mission.worldLocked?'Schalte zuerst den Raum dieser Mission im Basar frei.':'Schaffe zuerst die verbundenen Vorgängermissionen.');
    return this.start({mode:mission.mode,bossId:mission.bossId,missionId:mission.id,tutorial:false,
      difficulty:options?.difficulty??'easy',gamingLimit:options?.gamingLimit??90});}
  nextLevel(){const s=this.state;if(!s.started||s.ended||!s.awaitingNext||s.scene!=='briefing')return fail('Es wartet kein neues Level.');
    s.awaitingNext=false;s.scene='playing';s.paused=false;this._record('level-started',{levelIndex:s.levelIndex,tutorial:s.isTutorial});this.save();return {ok:true,events:[{type:'level-started',levelIndex:s.levelIndex,context:s.context,isTutorial:s.isTutorial}]};}
  setPaused(value){if(typeof value!=='boolean')return fail('Ungültiger Pausenstatus.');if(!this.state.started||this.state.ended)return fail('Kein aktiver Run.');this.state.paused=value;this.save();return {ok:true,paused:value,events:[]};}
  pause(){return this.setPaused(true);}
  resume(){return this.setPaused(false);}
  resumeRun(){if(!this.state.started||this.state.ended)return fail('Kein gespeicherter Run zum Fortsetzen.');this.state.paused=false;return {ok:true,state:this.state,events:[]};}
  resize(width,height){if(!Number.isFinite(width)||!Number.isFinite(height)||width<240||height<240)return fail('Ungültige Spielfeldgröße.');
    const w=Math.min(5000,width),h=Math.min(5000,height),sx=w/this.width,sy=h/this.height;this.width=w;this.height=h;
    const actors=getThrowerLayout(w,h,this.state.difficulty);
    for(const obj of this.state.objects){obj.x*=sx;obj.y*=sy;obj.vx*=sx;obj.vy*=sy;obj.gravity*=sy;obj.radius=this._radius();
      if(obj.launch){const launch=obj.launch;launch.fromX*=sx;launch.fromY*=sy;launch.laneX*=sx;launch.initialVy*=sy;
        if(obj.age<launch.windup){const actor=actors[launch.throwerIndex],hand=getThrowerPose(actor,obj.age,launch.windup),release=getThrowerPose(actor,launch.windup,launch.windup);obj.x=hand.handX;obj.y=hand.handY;launch.fromX=release.handX;launch.fromY=release.handY;}}
      else obj.x=Math.max(obj.radius,Math.min(w-obj.radius,obj.x));}
    return {ok:true,width:w,height:h};}
  _availableThrower(){const s=this.state,actors=getThrowerLayout(this.width,this.height,s.difficulty);
    for(let offset=0;offset<actors.length;offset++){const index=(s.objectSequence+offset)%actors.length;
      if(!s.objects.some(obj=>obj.launch?.throwerIndex===index&&obj.age<obj.launch.windup+THROW_RECOVERY))return index;}
    return null;}
  _spawnContent(id,throwerIndex=null){if(this.state.objects.length>=50)return null;const content=CONTENT_MAP.get(id);if(!content)return null;
    const actors=getThrowerLayout(this.width,this.height,this.state.difficulty),actor=throwerIndex===null?null:actors[throwerIndex];
    if(throwerIndex!==null&&(!actor||this.state.objects.some(obj=>obj.launch?.throwerIndex===throwerIndex&&obj.age<obj.launch.windup+THROW_RECOVERY)))return null;
    const radius=this._radius(),inset=radius+8,laneCount=Math.min(5,Math.max(2,Math.floor((this.width-inset*2)/(radius*2+28))+1));
    const lanes=Array.from({length:laneCount},(_,i)=>inset+i*(this.width-inset*2)/(laneCount-1));
    // A lane stays reserved for the whole flight, including slow motion. No lateral
    // drift means a swipe at one object cannot accidentally meet its neighbour.
    const available=lanes.filter(x=>!this.state.objects.some(obj=>Math.abs((obj.launch?.laneX??obj.x)-x)<obj.radius+radius+24));
    if(!available.length)return null;
    const x=available[Math.floor(this._random()*available.length)],span=Math.max(120,this.height-40),flight=((this.state.isTutorial?4.6:this.state.mode==='open'?4.4:this.state.mode==='boss'?4.7:this._difficulty().flight)+this._random()*.6)/this.state.speedFactor;
    const target=-radius-2,release=actor?getThrowerPose(actor,.22,.22):null,y=release?release.handY:this.height+radius+6,distance=y-target;
    // A longer Open flight must really grant more reaction time. Excess gravity
    // would otherwise send the object over its target early and back down later.
    const gravity=['open','boss'].includes(this.state.mode)?Math.min(span*.08,distance/(flight*flight)):span*.08,vy=-(distance/flight+.5*gravity*flight);
    const obj={id:`ninja-${this.state.runSerial}-${++this.state.objectSequence}`,contentId:id,label:content.label,text:content.text,
      kind:content.powerup?'powerup':content.kindByContext[this.state.context],powerup:content.powerup||null,context:this.state.context,
      x,y,vx:0,vy,gravity,radius,age:0};
    if(actor){const speed=Math.sqrt(Math.min(this.state.speedFactor,4)),windup=.22/speed,arc=Math.min(.30/speed,flight*.28),hand=getThrowerPose(actor,0,windup);
      obj.launch={throwerIndex,fromX:release.handX,fromY:release.handY,laneX:x,windup,arc,initialVy:vy};obj.x=hand.handX;obj.y=hand.handY;}
    this.state.objects.push(obj);return obj;}
  _spawn(events){const s=this.state;if(s.mode==='boss'){this._spawnBoss(events);return;}const canEarnCoins=s.stageMetrics.earnedCoins<this._coinCap();let ids;
    if(!canEarnCoins)s.bonusCoinPending=false;
    if(s.bonusCoinPending&&!s.isTutorial)ids=['power-coins'];
    else if(s.isTutorial){const order=['streak','urgent-school','streak','urgent-school','gameclip','homework'];ids=[order[s.spawnCount%order.length]];}
    else if(s.context==='study'&&s.spawnCount<2)ids=[s.spawnCount===0?'streak':'urgent-school'];
    else {const count=this._random()<.2?2:1,regular=POOLS[s.context],powers=['power-slow','power-shield','power-multiplier',...(canEarnCoins?['power-coins']:[])];
      const distractions=regular.filter(id=>CONTENT_MAP.get(id).kindByContext[s.context]==='distraction'),pick=list=>list[Math.floor(this._random()*list.length)];
      ids=Array.from({length:count},()=>{
        if(canEarnCoins&&s.bonusPhase?.id==='coin-rush'&&this._random()<.42)return 'power-coins';
        if(this._random()<.15)return pick(powers);
        if(s.bonusPhase?.id==='focus-wave'&&this._random()<.65)return pick(distractions);
        return pick(regular);
      });}
    for(const id of ids){const throwerIndex=this._availableThrower();if(throwerIndex===null)break;const obj=this._spawnContent(id,throwerIndex);if(obj){if(id==='power-coins')s.bonusCoinPending=false;s.spawnCount++;events.push({type:'spawned',...clone(obj)});}}
    const finale=s.levelIndex===3&&s.stageElapsed>=75&&!s.pendingContext;
    s.spawnTimer+=s.isTutorial?1.8:(s.mode==='open'?1.7:this._difficulty().spawn)*(finale?.77:s.levelIndex===3?.9:s.context==='sleep'?1.08:s.context==='gaming'?.92:1)/s.speedFactor;}
  _spawnBoss(events){const s=this.state,b=s.boss,definition=getBoss(b?.id);if(!definition||b.defeated||b.pendingPhase!==null||b.cueRemaining>0)return;
    // Useful objects are part of every authored pattern: indiscriminate slicing cannot win.
    const useful=POOLS[s.context].filter(id=>CONTENT_MAP.get(id).kindByContext[s.context]==='useful'),distractions=POOLS[s.context].filter(id=>CONTENT_MAP.get(id).kindByContext[s.context]==='distraction');
    const tier=BOSS_DEFINITIONS.indexOf(definition),keep=(s.spawnCount+b.phase+tier)%3===1;
    const pool=keep?useful:distractions,id=pool[(Math.floor(s.spawnCount/3)+b.phase+tier)%pool.length],throwerIndex=this._availableThrower();
    if(throwerIndex!==null){const obj=this._spawnContent(id,throwerIndex);if(obj){s.spawnCount++;events.push({type:'spawned',...clone(obj)});}}
    s.spawnTimer+=(b.burstRemaining>0?1.05:1.65)/s.speedFactor;
  }
  _damageBoss(events,obj){const s=this.state,b=s.boss;if(!b||b.defeated||s.ended)return;b.health=Math.max(0,b.health-1);
    events.push({type:'boss-hit',id:b.id,health:b.health,maxHealth:b.maxHealth,damage:1,x:obj?.x??this.width/2,y:obj?.y??this.height/2});
    const target=bossPhaseForHealth(b);b.pendingPhase=target>b.phase?target:null;
    if(!b.health){b.defeated=true;b.phase=2;b.pendingPhase=null;b.cueRemaining=0;b.burstRemaining=0;s.context=getBoss(b.id).phases[2].context;
      if(!s.metrics.contextsPlayed.includes(s.context))s.metrics.contextsPlayed.push(s.context);
      events.push({type:'boss-defeated',id:b.id,health:0,maxHealth:b.maxHealth,phase:b.phase});this._finishRun('complete',events);}
  }
  _updateBoss(dt,events){const s=this.state,b=s.boss,definition=getBoss(b?.id);if(!definition||b.defeated)return;
    if(b.pendingPhase!==null){if(s.objects.length)return;const from=s.context;b.phase=b.pendingPhase;b.pendingPhase=null;s.context=definition.phases[b.phase].context;b.cueRemaining=0;b.burstRemaining=0;b.nextWaveAt=b.waveClock+5;s.spawnTimer=1.4;s.speedFactor=this._speed();
      if(!s.metrics.contextsPlayed.includes(s.context))s.metrics.contextsPlayed.push(s.context);
      events.push({type:'context-changed',from,to:s.context},{type:'boss-phase',id:b.id,phase:b.phase,context:s.context,name:definition.phases[b.phase].name});this._record('boss-phase',{id:b.id,phase:b.phase});return;}
    b.waveClock+=dt;
    if(b.cueRemaining>0){b.cueRemaining=Math.max(0,b.cueRemaining-dt);if(b.cueRemaining<=.0000001){b.cueRemaining=0;b.burstRemaining=3;b.waves++;b.nextWaveAt=b.waveClock+definition.waveInterval;s.spawnTimer=Math.max(.6,s.spawnTimer);events.push({type:'boss-wave',id:b.id,phase:b.phase,duration:3,wave:b.waves});}}
    else if(b.burstRemaining>0)b.burstRemaining=Math.max(0,b.burstRemaining-dt);
    else if(b.waveClock>=b.nextWaveAt-.0000001){b.cueRemaining=1.35;events.push({type:'boss-cue',id:b.id,phase:b.phase,duration:1.35,wave:b.waves+1});}
    s.speedFactor=this._speed();
  }
  _good(events,obj){const s=this.state;s.metrics.correctDecisions++;s.stageMetrics.correctDecisions++;s.decisionStreak++;s.bestDecisionStreak=Math.max(s.bestDecisionStreak,s.decisionStreak);this._balance();
    if(s.isTutorial)s.tutorialDecisions++;
    else {if(!['open','boss'].includes(s.mode)&&!this._superSlicing)s.superCharge=Math.min(100,s.superCharge+8+(this._hasSkill('focus-root')?2:0));
      if(s.metrics.correctDecisions%(this._hasSkill('coin-root')?12:14)===0)this._earnCoins(1,events,'correct-decisions');
      const points={10:250,25:750,50:2000}[s.decisionStreak];
      if(points&&!s.comboMilestones.includes(s.decisionStreak)){s.comboMilestones.push(s.decisionStreak);this._arcade(points);events.push({type:'combo-milestone',milestone:s.decisionStreak,streak:s.decisionStreak,points,context:obj?.context||s.context,x:obj?.x??this.width/2,y:obj?.y??this.height/2});}}
    if(s.decisionStreak%5===0){const duration=5+(!s.isTutorial&&this._hasSkill('flow-boost')?2:0);s.effects.flow=duration;s.metrics.flowTriggers++;events.push({type:'flow-started',duration});if(!s.isTutorial)this._achievement('flow-five');}
    if(s.mode==='boss')this._damageBoss(events,obj);}
  _mistake(obj,kind,events){const s=this.state;
    s.lastMistake={context:obj.context,contentId:obj.contentId,kind,protected:s.effects.shield>0,elapsed:s.elapsed};s.combo=0;s.decisionStreak=0;
    if(s.effects.shield){s.effects.shield=0;s.metrics.shieldedMistakes++;s.stageMetrics.shieldedMistakes++;
      events.push({type:kind==='useful'?'useful-mistake':'distraction-missed',id:obj.id,contentId:obj.contentId,kind:obj.kind,x:obj.x,y:obj.y,protected:true,points:0});return;}
    const key=kind==='useful'?'usefulMistakes':'missedDistractions';s.metrics[key]++;s.stageMetrics[key]++;
    s.balance=Math.max(0,s.balance-(kind==='useful'?12:6));s.overload=Math.min(100,s.overload+(kind==='useful'?18:12));
    s.lives=Math.max(0,s.lives-1);s.metrics.lifeLost++;if(s.overload>=100)s.overload=60;this._balance();
    events.push({type:kind==='useful'?'useful-mistake':'distraction-missed',id:obj.id,contentId:obj.contentId,kind:obj.kind,x:obj.x,y:obj.y,protected:false,points:0});
    events.push({type:'life-lost',lives:s.lives,reason:kind==='useful'?'useful-cut':'distraction-missed'});
    if(!s.lives){if(s.isTutorial){s.lives=MAX_LIVES;s.overload=0;events.push({type:'tutorial-retry'});}else if(this._hasSkill('second-chance')&&!s.reviveUsed){s.reviveUsed=true;s.lives=1;s.overload=Math.min(50,s.overload);events.push({type:'second-chance',lives:1});}else this._finishRun('lives',events);}}
  _slice(obj,events,chain=false){const s=this.state;if(!s.objects.some(item=>item.id===obj.id)||s.ended||!isThrowReady(obj))return;
    s.objects=s.objects.filter(item=>item.id!==obj.id);
    if(obj.kind==='useful'){this._mistake(obj,'useful',events);return;}
    if(obj.kind==='powerup'){s.metrics.powerups++;if(obj.powerup==='coins')this._earnCoins(1,events,'collectable',{x:obj.x,y:obj.y});else if(obj.powerup==='shield')s.effects.shield=1;else s.effects[obj.powerup]=obj.powerup==='slow'?6:10;
      events.push({type:'powerup',id:obj.id,contentId:obj.contentId,effect:obj.powerup,duration:obj.powerup==='coins'?0:obj.powerup==='shield'?1:s.effects[obj.powerup],x:obj.x,y:obj.y});return;}
    s.metrics.cuts++;s.stageMetrics.cuts++;s.combo++;s.bestCombo=Math.max(s.bestCombo,s.combo);s.balance=Math.min(100,s.balance+1);s.overload=Math.max(0,s.overload-3);
    if(s.isTutorial)s.tutorialCuts++;
    const multiplier=Math.min(4,1+Math.floor(s.combo/4))*(s.effects.multiplier>0?2:1)*(s.bonusPhase?.id==='combo-party'?2:1),points=s.isTutorial?0:100*multiplier;
    this._arcade(points);this._good(events,obj);if(s.combo%25===0)this._earnCoins(1,events,'combo',{x:obj.x,y:obj.y});events.push({type:'sliced',id:obj.id,contentId:obj.contentId,kind:obj.kind,context:obj.context,x:obj.x,y:obj.y,points,combo:s.combo,multiplier,chain});
    if(!s.isTutorial)this._achievement('first-cut');
  }
  swipe(value){if(!this._playable())return [];let points=Array.isArray(value)?value:isObject(value)?[{x:value.x1,y:value.y1},{x:value.x2,y:value.y2}]:[];
    points=points.slice(0,256);if(points.length<2||points.some(point=>!isObject(point)||!Number.isFinite(point.x)||!Number.isFinite(point.y)))return [];
    if(points.reduce((total,point,i)=>total+(i?Math.hypot(point.x-points[i-1].x,point.y-points[i-1].y):0),0)<4)return [];
    const s=this.state,events=[],wide=s.effects.flow>0?1.2:1;
    const direct=s.objects.filter(isThrowReady).map(obj=>({obj,order:segmentOrder(points,obj,obj.radius*wide)})).filter(hit=>Number.isFinite(hit.order)).sort((a,b)=>a.order-b.order);
    for(const {obj} of direct){if(s.ended)break;if(!s.objects.some(item=>item.id===obj.id))continue;this._slice(obj,events);
      if(obj.kind==='distraction'&&s.effects.flow>0){for(const nearby of [...s.objects])if(nearby.kind==='distraction'&&Math.hypot(nearby.x-obj.x,nearby.y-obj.y)<=90)this._slice(nearby,events,true);}}
    if(s.isTutorial&&s.tutorialDecisions>=6&&s.tutorialCuts>=2&&s.tutorialPassed>=2)this._endTutorial('learned',events);
    if(events.length){this._record('swipe',{hits:events.filter(event=>event.id).length});this.save();}return events;
  }
  _pass(obj,events){const s=this.state;s.objects=s.objects.filter(item=>item.id!==obj.id);
    if(obj.kind==='powerup')return;
    if(obj.kind==='distraction'){this._mistake(obj,'distraction',events);return;}
    s.metrics.usefulPassed++;s.stageMetrics.usefulPassed++;s.balance=Math.min(100,s.balance+5);s.overload=Math.max(0,s.overload-2);
    if(s.isTutorial)s.tutorialPassed++;
    const points=s.isTutorial?0:100*(s.effects.multiplier>0?2:1)*(s.bonusPhase?.id==='combo-party'?2:1);this._arcade(points);this._good(events,obj);
    events.push({type:'useful-passed',id:obj.id,contentId:obj.contentId,kind:obj.kind,context:obj.context,x:obj.x,y:obj.y,points});}
  _master(events){const s=this.state;if(s.levelIndex!==3||s.isTutorial)return;
    const sequence=['study','gaming','sleep','study'];
    if(!s.pendingContext&&s.masterSwitchIndex<3&&s.stageElapsed>=(s.masterSwitchIndex+1)*25-.0000001){s.pendingContext=sequence[s.masterSwitchIndex+1];events.push({type:'context-changing',from:s.context,to:s.pendingContext});}
    if(s.pendingContext&&!s.objects.length){const from=s.context;s.context=s.pendingContext;s.pendingContext=null;s.masterSwitchIndex++;s.spawnTimer=.35;
      if(!s.metrics.contextsPlayed.includes(s.context))s.metrics.contextsPlayed.push(s.context);events.push({type:'context-changed',from,to:s.context});this._record('context-changed',{from,to:s.context});}}
  update(value){if(!this._playable())return [];const dt=number(value,0,0,.05);if(!dt)return [];const s=this.state,events=[];
    const slow=(s.effects.slow>0||s.effects.flow>0)? .5 : 1,step=dt*slow;
    s.elapsed+=dt;s.stageElapsed=['open','boss'].includes(s.mode)?s.stageElapsed+dt:Math.min(s.duration,s.stageElapsed+dt);s.remaining=['open','boss'].includes(s.mode)?0:Math.max(0,s.duration-s.stageElapsed);s.speedFactor=this._speed();
    for(const effect of ['slow','multiplier','flow'])s.effects[effect]=Math.max(0,s.effects[effect]-dt);
    if(s.mode!=='boss'&&s.levelIndex===2&&!s.isTutorial&&s.stageElapsed>=8-.0000001)s.stopAvailable=true;
    const actors=getThrowerLayout(this.width,this.height,s.difficulty);
    for(const obj of [...s.objects]){if(s.ended)break;obj.age+=step;
      if(obj.launch){const launch=obj.launch;
        if(obj.age<launch.windup){const hand=getThrowerPose(actors[launch.throwerIndex],obj.age,launch.windup);obj.x=hand.handX;obj.y=hand.handY;}
        else{const flightAge=obj.age-launch.windup;obj.x=launch.fromX+(launch.laneX-launch.fromX)*smoothstep(flightAge/launch.arc);obj.y=launch.fromY+launch.initialVy*flightAge+.5*obj.gravity*flightAge*flightAge;obj.vy=launch.initialVy+obj.gravity*flightAge;}}
      else{obj.x+=obj.vx*step;obj.y+=obj.vy*step+.5*obj.gravity*step*step;obj.vy+=obj.gravity*step;
        if(obj.x<obj.radius){obj.x=obj.radius;obj.vx=Math.abs(obj.vx);}else if(obj.x>this.width-obj.radius){obj.x=this.width-obj.radius;obj.vx=-Math.abs(obj.vx);}}
      if(obj.y+obj.radius<0||obj.age>12)this._pass(obj,events);}
    if(s.ended)return events;
    if(s.isTutorial&&s.tutorialDecisions>=6&&s.tutorialCuts>=2&&s.tutorialPassed>=2)this._endTutorial('learned',events);
    else if(s.isTutorial&&s.remaining<=.0000001)this._endTutorial('timeout',events);
    else if(!['open','boss'].includes(s.mode)&&s.remaining<=.0000001){if(s.levelIndex===1){s.scene='limit-choice';s.stopAvailable=true;events.push({type:'limit-reached',limit:s.duration,extensionUsed:s.extensionUsed});this._record('limit-reached');this.save();}else this._endStage('time',events);}
    else {if(s.mode==='boss'){this._updateBoss(dt,events);if(!s.boss.pendingPhase&&!s.boss.cueRemaining){s.spawnTimer-=dt;if(s.spawnTimer<=0)this._spawn(events);}return events;}this._master(events);this._bonus(dt,events);if(!s.pendingContext){s.spawnTimer-=dt;if(s.spawnTimer<=0)this._spawn(events);}}
    return events;
  }
  _endTutorial(reason,events){const s=this.state;if(!s.isTutorial)return;
    s.tutorialResults={decisions:s.tutorialDecisions,cuts:s.tutorialCuts,passed:s.tutorialPassed,elapsed:s.stageElapsed,reason};s.tutorialReason=reason;
    this.profile.tutorialCompleted=true;s.isTutorial=false;s.stageIndex=0;s.levelIndex=0;s.score=s.scoreArcade=0;s.balance=50;s.balanceScore=100;s.maxLives=this._difficulty().lives;s.lives=s.maxLives;s.overload=0;s.elapsed=0;s.speedFactor=1;
    s.metrics=metrics();s.bestDecisionStreak=0;s.comboMilestones=[];s.lastMistake=null;s.scene='briefing';s.awaitingNext=true;s.paused=false;this._resetStage();if(this._hasSkill('guard-root'))s.effects.shield=1;this._record('tutorial-complete',{reason});events.push({type:'tutorial-complete',reason,levelIndex:0});this.save();}
  skipTutorial(){if(!this.state.started||this.state.ended||!this.state.isTutorial)return fail('Es ist kein Tutorial aktiv.');const events=[];this._endTutorial('skipped',events);return {ok:true,events};}
  _endStage(reason,events){const s=this.state;if(['open','boss'].includes(s.mode)||s.ended||s.scene==='briefing')return;
    const summary={levelIndex:s.levelIndex,context:LEVELS[s.levelIndex].id,elapsed:s.stageElapsed,reason,...clone(s.stageMetrics)};
    s.metrics.stageStats.push(summary);s.objects=[];s.stopAvailable=false;s.pendingContext=null;s.bonusPhase=null;
    if(!s.stageMetrics.usefulMistakes&&!s.stageMetrics.missedDistractions)this._achievement('careful-stage');
    events.push({type:'level-complete',levelIndex:s.levelIndex,reason,summary:clone(summary)});this._record('level-complete',{levelIndex:s.levelIndex,reason});
    if(s.stageIndex+1>=PLANS[s.mode].length){this._finishRun(reason==='stop'?'healthy-stop':'complete',events);return;}
    const nextWorld=LEVELS[PLANS[s.mode][s.stageIndex+1]].id;
    if(!this.profile.unlockedWorlds.includes(nextWorld)){s.nextLockedWorld=nextWorld;this._finishRun('locked',events);return;}
    s.stageIndex++;s.levelIndex=PLANS[s.mode][s.stageIndex];s.lives=Math.min(s.maxLives,s.lives+1);s.scene='briefing';s.awaitingNext=true;s.paused=false;this._resetStage();this.save();}
  requestStop(){const s=this.state;if(!s.started||s.ended||s.paused||s.isTutorial||s.mode==='boss')return fail('Hier ist gerade kein bewusster Stopp verfügbar.');
    if(!(s.levelIndex===1&&s.scene==='limit-choice'||s.levelIndex===2&&s.scene==='playing'&&s.stopAvailable))return fail('Die Stoppentscheidung wird an deiner Grenze oder in der Ruhephase verfügbar.');
    const events=[];s.metrics.healthyStops++;this._arcade(100);s.balance=Math.min(100,s.balance+10);s.overload=Math.max(0,s.overload-15);this._balance();this._achievement('healthy-stop');
    events.push({type:'healthy-stop',levelIndex:s.levelIndex,points:100});this._endStage('stop',events);return {ok:true,events};}
  continueAfterLimit(){const s=this.state;if(s.paused||s.ended||s.scene!=='limit-choice'||s.levelIndex!==1||s.extensionUsed)return fail('Eine Verlängerung ist hier nicht verfügbar.');
    s.extensionUsed=true;s.metrics.limitExtensions++;s.duration+=15;s.remaining=15;s.scene='playing';s.stopAvailable=false;s.overload=Math.min(99,s.overload+15);this._balance();this._record('limit-extended',{seconds:15,overload:15});this.save();
    return {ok:true,seconds:15,overload:15,events:[{type:'limit-continued',seconds:15,overload:15}]};}
  continueSleep(){const s=this.state;if(s.paused||s.ended||s.scene!=='playing'||s.levelIndex!==2||!s.stopAvailable||s.sleepContinued)return fail('Dieses Bonusangebot ist gerade nicht verfügbar.');
    s.sleepContinued=true;s.metrics.sleepContinues++;this._arcade(200);s.overload=Math.min(99,s.overload+15);this._balance();this._record('sleep-continued',{points:200,overload:15});this.save();return {ok:true,points:200,overload:15,events:[{type:'sleep-continued',points:200,overload:15}]};}
  _finishRun(result,events){const s=this.state;if(s.ended)return;s.ended=true;s.scene='results';s.result=result;s.finishedAt=this._time();s.objects=[];s.awaitingNext=false;s.paused=false;s.stopAvailable=false;s.bonusPhase=null;s.bonusCoinPending=false;if(s.boss){s.boss.cueRemaining=0;s.boss.burstRemaining=0;}this._balance();
    if(!s.credited&&!s.isTutorial){s.credited=true;const eligible=s.metrics.correctDecisions>=12,completed=['complete','healthy-stop','locked'].includes(result);
      const bonus=eligible&&completed?2+(s.metrics.healthyStops>0?1:0):0;const coins=Math.min(MAX,s.runCoins+bonus);s.awardedCoins=coins;this.profile.coins=Math.min(MAX,this.profile.coins+coins);this.profile.totalRuns++;
      this.profile.totalRuns=Math.min(MAX,this.profile.totalRuns);this.profile.highScores[s.mode]=Math.max(this.profile.highScores[s.mode],s.score);if((s.mode==='campaign'||s.mode==='master')&&['complete','healthy-stop'].includes(result))this._achievement('context-master');
      const stats=this.profile.stats;stats.correct=Math.min(MAX,stats.correct+s.metrics.correctDecisions);stats.coinsEarned=Math.min(MAX,stats.coinsEarned+coins);stats.superUses=Math.min(MAX,stats.superUses+s.metrics.superUses);stats.bestCombo=Math.max(stats.bestCombo,s.bestCombo);
      if(s.difficulty==='hard'&&['complete','healthy-stop'].includes(result))stats.hardClears=Math.min(MAX,stats.hardClears+1);for(const id of unlockAchievements(this.profile))events.push({type:'achievement-unlocked',id});
      events.push(...recordDailyRun(this.profile,s,this._time()),...applyRankUnlocks(this.profile,this._time()),...recordAdventureRun(this.profile,s,this._time()));}
    events.push({type:'ended',result,score:s.score,scoreArcade:s.scoreArcade,balanceScore:s.balanceScore,coins:s.awardedCoins});this._record('ended',{result});this.save();}
  setUsername(value){const result=validateUsername(value);if(!result.ok)return fail(result.reason);const player=normalizePlayer(this.profile);
    this.profile.player={...player,username:result.username,createdAt:player.username?player.createdAt:this._time()};this.save();return {ok:true,username:result.username};}
  markGuideSeen(id){if(!GUIDE_IDS.includes(id))return fail('Unbekannter Guide-Hinweis.');const player=normalizePlayer(this.profile);
    if(!player.guideSeen.includes(id)){player.guideSeen.push(id);this.profile.player=player;this.save();}return {ok:true,id};}
  addNotification(value){const result=validateNotification(value);if(!result.ok)return fail(result.reason);const player=normalizePlayer(this.profile);
    const existing=player.notifications.find(item=>item.id===result.id);if(existing)return {ok:true,notification:clone(existing)};
    const notification={id:result.id,type:result.type,ref:result.ref,createdAt:this._time(),read:false};
    player.notifications=[notification,...player.notifications].slice(0,50);this.profile.player=player;this.save();return {ok:true,notification:clone(notification)};}
  markNotificationsRead(){const player=normalizePlayer(this.profile),unread=player.notifications.filter(item=>!item.read).length;
    if(unread){for(const item of player.notifications)item.read=true;this.profile.player=player;this.save();}return {ok:true,count:unread};}
  markNotificationRead(id){if(typeof id!=='string'||!id||id.length>96)return fail('Mitteilung nicht gefunden.');
    const player=normalizePlayer(this.profile),item=player.notifications.find(entry=>entry.id===id);
    if(!item)return fail('Mitteilung nicht gefunden.');
    if(!item.read){item.read=true;this.profile.player=player;this.save();}
    return {ok:true,id};}
  _progressAllowed(){return !this.state.started||this.state.ended||this.state.paused||this.state.scene==='home';}
  buyWorld(id){if(!this._progressAllowed())return fail('Pausiere den Run oder öffne das Hauptmenü, um eine Welt freizuschalten.');const result=purchaseWorld(this.profile,id);if(result.ok)this.save();return result;}
  buyBackground(id){if(!this._progressAllowed())return fail('Pausiere den Run oder öffne das Hauptmenü, um einen Hintergrund freizuschalten.');const result=purchaseBackground(this.profile,id);if(result.ok)this.save();return result;}
  selectBackground(id){if(!this._progressAllowed())return fail('Pausiere den Run oder öffne das Hauptmenü. Der Hintergrund gilt im nächsten Run.');const result=equipBackground(this.profile,id);if(result.ok)this.save();return result;}
  buySkill(id){if(!this._progressAllowed())return fail('Pausiere den Run oder öffne das Hauptmenü. Neue Fähigkeiten gelten im nächsten Run.');const result=purchaseSkill(this.profile,id);if(result.ok)this.save();return result;}
  selectSuper(id){if(!this._progressAllowed())return fail('Pausiere den Run oder öffne das Hauptmenü. Die Superwahl gilt im nächsten Run.');const result=equipSuper(this.profile,id);if(result.ok)this.save();return result;}
  claimAchievement(id){const result=claimReward(this.profile,id);if(result.ok)this.save();return result;}
  claimDailyReward(id){const result=claimDaily(this.profile,id,this._time());if(result.ok){result.achievements=unlockAchievements(this.profile);this.save();}return result;}
  claimCareerReward(id){const result=claimCareer(this.profile,id,this._time());if(result.ok){result.achievements=unlockAchievements(this.profile);this.save();}return result;}
  claimWeeklyReward(id){const result=claimWeekly(this.profile,id,this._time());if(result.ok){result.achievements=unlockAchievements(this.profile);this.save();}return result;}
  claimWeeklySkin(){const result=claimOutfit(this.profile,this._time());if(result.ok)this.save();return result;}
  activateSuper(){const s=this.state;if(!this._playable()||s.isTutorial)return fail('Deine Superfähigkeit ist nur im laufenden Run verfügbar.');
    if(!s.selectedSuper||!s.skillIds.includes(s.selectedSuper))return fail('Schalte zuerst eine Superfähigkeit frei und rüste sie für einen neuen Run aus.');
    if(s.superCharge<100)return fail('Deine Superfähigkeit lädt sich durch richtige Entscheidungen auf.');
    const id=s.selectedSuper,events=[];s.superCharge=0;s.metrics.superUses++;const duration=id==='slow-super'?8:id==='shield-super'?1:0;
    events.push({type:'super-used',id,duration,charge:0});if(id==='slow-super')s.effects.slow=8;else if(id==='shield-super')s.effects.shield=1;
    else {this._superSlicing=true;try{for(const obj of [...s.objects])if(obj.kind==='distraction'&&isThrowReady(obj))this._slice(obj,events,true);}finally{this._superSlicing=false;}}
    this._record('super-used',{id});this.save();return {ok:true,events};}
  buySkin(id){const skin=SKIN_MAP.get(id);if(!skin)return fail('Unbekannter Skin.');if(this.profile.unlockedSkins.includes(id))return fail('Dieser Skin ist bereits freigeschaltet.');
    if(skin.unlock==='rank')return fail('Dieses Outfit verdienst du mit deinem Ninja-Rang.');
    if(skin.unlock==='weekly')return fail('Dieses besondere Outfit verdienst du mit Wochenherausforderungen.');
    if(this.profile.coins<skin.cost)return fail('Dafür fehlen Coins.');this.profile.coins-=skin.cost;this.profile.unlockedSkins.push(id);this.save();return {ok:true,id,coins:this.profile.coins};}
  selectSkin(id){if(!SKIN_MAP.has(id)||!this.profile.unlockedSkins.includes(id))return fail('Schalte diesen Skin zuerst frei.');this.profile.selectedSkin=id;this.state.skin=id;this.save();return {ok:true,id};}
  save(){if(!this.storage||typeof this.storage.setItem!=='function'){this.storageFailed=true;this.storageError='unavailable';return fail('Lokales Speichern ist nicht verfügbar. Diese Sitzung bleibt spielbar.');}
    try{this.storage.setItem(STORAGE_KEY,JSON.stringify({schemaVersion:1,width:this.width,height:this.height,profile:this.profile,state:this.state}));this.storageFailed=false;this.storageError=null;return {ok:true};}
    catch{this.storageFailed=true;this.storageError='write-failed';return fail('Speichern ist blockiert oder voll. Dein Fortschritt bleibt in dieser Sitzung erhalten.');}}
  saveRun(){return this.save();}
  _restore(){if(!this.storage)return;try{const raw=this.storage.getItem(STORAGE_KEY);if(raw===null)return;const saved=JSON.parse(raw);if(!isObject(saved)||saved.schemaVersion!==1)throw new Error('schema');
    const p=saved.profile;if(isObject(p)){this.profile.coins=integer(p.coins);this.profile.totalRuns=integer(p.totalRuns);for(const mode of MODES)this.profile.highScores[mode]=integer(p.highScores?.[mode]);
      this.profile.unlockedSkins=[...new Set(['default',...(Array.isArray(p.unlockedSkins)?p.unlockedSkins:[]).filter(id=>SKIN_MAP.has(id))])];
      this.profile.selectedSkin=this.profile.unlockedSkins.includes(p.selectedSkin)?p.selectedSkin:'default';this.profile.tutorialCompleted=p.tutorialCompleted===true;
      this.profile.achievements=[...new Set((Array.isArray(p.achievements)?p.achievements:[]).filter(id=>ACHIEVEMENTS.some(item=>item.id===id)))];Object.assign(this.profile,sanitizeProgress(p));this.profile.player=normalizePlayer(p);this.profile.journey=normalizeJourney({...this.profile,journey:p.journey},this._time());this.profile.adventure=normalizeAdventure({...this.profile,adventure:p.adventure},this._time());}
    const source=saved.state;if(!isObject(source)||!MODES.includes(source.mode)||!['home','briefing','playing','limit-choice','results'].includes(source.scene))throw new Error('state');
    const s=emptyState(integer(source.rng,this.seed,1,0xffffffff),this.profile.selectedSkin);s.mode=source.mode;s.gamingLimit=[45,60,90].includes(source.gamingLimit)?source.gamingLimit:90;
    s.boss=s.mode==='boss'?restoreBossState(source.boss):null;if(s.mode==='boss'&&!s.boss)throw new Error('boss');
    s.missionId=typeof source.missionId==='string'&&/^[-a-z0-9]{1,48}$/.test(source.missionId)?source.missionId:null;
    if(s.mode==='boss'&&s.missionId===null)s.missionId=CAREER_MISSIONS.find(mission=>mission.bossId===s.boss.id)?.id||null;
    if(s.missionId!==null){const mission=getCareerMission(this.profile,s.missionId,this._time());
      if(!mission||mission.mode!==s.mode||mission.bossId!==(s.mode==='boss'?s.boss.id:null)||mission.locked){if(s.mode==='boss')throw new Error('boss mission');s.missionId=null;}}
    s.started=source.started===true;s.isTutorial=source.isTutorial===true&&s.mode==='campaign';s.difficulty=['open','boss'].includes(s.mode)?'normal':DIFFICULTIES.some(item=>item.id===source.difficulty)?source.difficulty:'easy';s.maxLives=s.isTutorial?5:['open','boss'].includes(s.mode)?3:getDifficulty(s.difficulty).lives;
    s.openRuleset=s.mode==='open'?(source.openRuleset===OPEN_RULESET&&source.difficulty==='normal'&&source.maxLives===3?OPEN_RULESET:'legacy'):null;
    if(!Number.isInteger(source.stageIndex)||source.stageIndex<(s.isTutorial?-1:0)||source.stageIndex>=PLANS[s.mode].length)throw new Error('stage');
    s.stageIndex=source.stageIndex;
    if(s.isTutorial&&s.stageIndex!==-1)throw new Error('tutorial');s.levelIndex=s.isTutorial?0:PLANS[s.mode][s.stageIndex];if(source.levelIndex!==s.levelIndex)throw new Error('level');
    s.scene=source.scene;s.ended=source.ended===true;s.credited=source.credited===true||s.ended;s.awaitingNext=s.scene==='briefing';s.paused=source.paused===true;
    if(s.mode==='open'&&s.ended&&source.result!=='lives')throw new Error('open result');
    if(s.ended!== (s.scene==='results')||s.scene==='limit-choice'&&(s.levelIndex!==1||s.isTutorial))throw new Error('scene');
    s.context=CONTEXTS.includes(source.context)?source.context:LEVELS[s.levelIndex].context;
    if(s.mode==='boss'&&s.context!==getBoss(s.boss.id).phases[s.boss.phase].context)throw new Error('boss context');
    if(s.mode!=='boss'&&s.levelIndex!==3&&s.context!==LEVELS[s.levelIndex].context)throw new Error('context');
    s.extensionUsed=source.extensionUsed===true&&s.levelIndex===1;s.sleepContinued=source.sleepContinued===true&&s.levelIndex===2;
    s.duration=['open','boss'].includes(s.mode)?0:s.isTutorial?60:s.levelIndex===1?s.gamingLimit+(s.extensionUsed?15:0):LEVELS[s.levelIndex].duration;
    s.stageElapsed=number(source.stageElapsed,0,0,['open','boss'].includes(s.mode)?1000000:s.duration);s.remaining=['open','boss'].includes(s.mode)?0:Math.max(0,s.duration-s.stageElapsed);s.elapsed=number(source.elapsed,0,0,1000000);
    if(s.scene==='limit-choice'&&s.stageElapsed<s.duration-.001)throw new Error('limit');
    for(const key of ['score','combo','bestCombo','decisionStreak','objectSequence','runSerial','spawnCount','tutorialDecisions','tutorialCuts','tutorialPassed','awardedCoins'])s[key]=integer(source[key]);
    s.comboMilestones=[...new Set((Array.isArray(source.comboMilestones)?source.comboMilestones:[]).filter(value=>[10,25,50].includes(value)))].sort((a,b)=>a-b);
    const mistake=source.lastMistake;
    if(isObject(mistake)&&CONTEXTS.includes(mistake.context)&&['useful','distraction'].includes(mistake.kind)&&CONTENT_MAP.get(mistake.contentId)?.kindByContext?.[mistake.context]===mistake.kind)s.lastMistake={context:mistake.context,contentId:mistake.contentId,kind:mistake.kind,protected:mistake.protected===true,elapsed:number(mistake.elapsed,0,0,s.elapsed)};
    s.scoreArcade=s.score;s.balance=number(source.balance,50,0,100);s.overload=number(source.overload,0,0,100);s.lives=integer(source.lives,s.maxLives,0,s.maxLives);
    if(!s.ended&&s.lives===0)throw new Error('lives');s.stopAvailable=s.mode!=='boss'&&(s.scene==='limit-choice'||s.levelIndex===2&&s.stageElapsed>=8&&!s.ended);
    s.effects={slow:number(source.effects?.slow,0,0,8),shield:integer(source.effects?.shield,0,0,1),multiplier:number(source.effects?.multiplier,0,0,10),flow:number(source.effects?.flow,0,0,7)};
    for(const key of Object.keys(s.metrics))if(!['contextsPlayed','stageStats'].includes(key))s.metrics[key]=integer(source.metrics?.[key]);
    s.bestDecisionStreak=Math.max(s.decisionStreak,integer(source.bestDecisionStreak,0,0,s.metrics.correctDecisions));
    s.metrics.contextsPlayed=[...new Set((Array.isArray(source.metrics?.contextsPlayed)?source.metrics.contextsPlayed:[]).filter(value=>CONTEXTS.includes(value)))];
    s.metrics.stageStats=(Array.isArray(source.metrics?.stageStats)?source.metrics.stageStats:[]).slice(0,4).filter(item=>isObject(item)&&Number.isInteger(item.levelIndex)&&item.levelIndex>=0&&item.levelIndex<4).map(item=>({levelIndex:item.levelIndex,context:LEVELS[item.levelIndex].id,elapsed:number(item.elapsed,0,0,105),reason:['time','stop'].includes(item.reason)?item.reason:'time',...Object.fromEntries(Object.keys(stageMetrics()).map(key=>[key,integer(item[key])]))}));
    const completed=s.isTutorial||s.mode==='boss'?0:s.stageIndex+(s.scene==='results'&&source.result!=='lives'?1:0);
    if(s.started&&(s.metrics.stageStats.length!==completed||s.metrics.stageStats.some((item,index)=>item.levelIndex!==PLANS[s.mode][index])))throw new Error('progress');
    for(const key of Object.keys(s.stageMetrics))s.stageMetrics[key]=integer(source.stageMetrics?.[key]);
    s.runCoins=integer(source.runCoins);s.coinRemainder=number(source.coinRemainder,0,0,.999999999);s.superCharge=number(source.superCharge,0,0,100);
    s.skillIds=[...new Set((Array.isArray(source.skillIds)?source.skillIds:this.profile.unlockedSkills).filter(id=>this.profile.unlockedSkills.includes(id)))];
    s.selectedSuper=['slow-super','shield-super','sweep-super'].includes(source.selectedSuper)&&s.skillIds.includes(source.selectedSuper)?source.selectedSuper:null;s.reviveUsed=source.reviveUsed===true;
    if(['open','boss'].includes(s.mode)){s.skillIds=[];s.selectedSuper=null;s.superCharge=0;s.reviveUsed=false;s.effects.slow=Math.min(6,s.effects.slow);s.effects.flow=Math.min(5,s.effects.flow);}
    s.speedFactor=s.isTutorial?1:s.mode==='boss'?getBossSpeed(s.boss):s.mode==='open'?getOpenSpeedFactor(s.difficulty,s.elapsed):getSpeedFactor(s.difficulty,s.elapsed);
    s.bonusCoinPending=source.bonusCoinPending===true&&s.mode!=='boss'&&!s.isTutorial&&!s.ended;
    const defaults={study:'classroom',gaming:'game-room',sleep:'bedroom'};
    s.backgrounds=Object.fromEntries(CONTEXTS.map(context=>{const id=source.backgrounds?.[context],background=BACKGROUNDS.find(item=>item.id===id);return [context,background?.context===context&&this.profile.unlockedBackgrounds.includes(id)?id:defaults[context]];}));
    s.bonusClock=number(source.bonusClock,0,0,s.mode==='open'?1000000:s.duration);s.bonusNextAt=number(source.bonusNextAt,20,20,s.mode==='open'?1000020:120);s.bonusSequence=integer(source.bonusSequence,0,0,s.mode==='open'?50001:6);
    const phaseNames={'coin-rush':'Münzregen','combo-party':'Combo-Party','focus-wave':'Fokus-Welle'};
    s.bonusPhase=s.mode!=='boss'&&!s.isTutorial&&s.scene==='playing'&&isObject(source.bonusPhase)&&phaseNames[source.bonusPhase.id]?{id:source.bonusPhase.id,name:phaseNames[source.bonusPhase.id],remaining:number(source.bonusPhase.remaining,0,0,6)}:null;
    s.spawnTimer=number(source.spawnTimer,.5,0,2);s.masterSwitchIndex=integer(source.masterSwitchIndex,0,0,3);s.pendingContext=CONTEXTS.includes(source.pendingContext)&&s.levelIndex===3?source.pendingContext:null;
    if(s.levelIndex===3&&(s.context!==['study','gaming','sleep','study'][s.masterSwitchIndex]||s.stageElapsed+.0000001<s.masterSwitchIndex*25||s.pendingContext&&s.pendingContext!==['gaming','sleep','study'][s.masterSwitchIndex]))throw new Error('master context');
    if(s.mode==='boss'){
      if(s.metrics.correctDecisions!==s.boss.maxHealth-s.boss.health||s.boss.defeated&&!s.ended||s.ended&&!['lives','complete'].includes(source.result)||s.ended&&(source.result==='complete')!==s.boss.defeated||!s.ended&&s.scene==='limit-choice')throw new Error('boss result');
      s.spawnTimer=number(source.spawnTimer,1.4,0,3);
    }
    s.skin=this.profile.unlockedSkins.includes(source.skin)?source.skin:this.profile.selectedSkin;s.result=['complete','healthy-stop','lives','locked'].includes(source.result)?source.result:null;
    if(s.result==='locked'){if(!s.ended||s.mode!=='campaign'||s.stageIndex+1>=PLANS.campaign.length)throw new Error('locked world');s.nextLockedWorld=LEVELS[PLANS.campaign[s.stageIndex+1]].id;}
    s.startedAt=number(source.startedAt,this._time());if(s.ended)s.finishedAt=number(source.finishedAt,this._time());
    s.tutorialReason=['learned','timeout','skipped'].includes(source.tutorialReason)?source.tutorialReason:null;
    s.tutorialResults=isObject(source.tutorialResults)?{decisions:integer(source.tutorialResults.decisions),cuts:integer(source.tutorialResults.cuts),passed:integer(source.tutorialResults.passed),elapsed:number(source.tutorialResults.elapsed,0,0,60),reason:s.tutorialReason}:null;
    s.history=(Array.isArray(source.history)?source.history:[]).slice(-200).filter(isObject).map(item=>({type:typeof item.type==='string'?item.type.slice(0,50):'unknown',time:number(item.time),elapsed:number(item.elapsed),context:CONTEXTS.includes(item.context)?item.context:'study'}));
    const savedWidth=number(saved.width,this.width,240,5000),savedHeight=number(saved.height,this.height,240,5000),ids=new Set();
    s.objects=(Array.isArray(source.objects)?source.objects:[]).slice(-50).filter(item=>isObject(item)&&typeof item.id==='string'&&CONTENT_MAP.has(item.contentId)&&CONTEXTS.includes(item.context)&&[item.x,item.y,item.vx,item.vy,item.gravity].every(Number.isFinite)).filter(item=>{if(ids.has(item.id))return false;ids.add(item.id);return true;}).map(item=>{const content=CONTENT_MAP.get(item.contentId),launch=restoreLaunch(item.launch,savedWidth,savedHeight,s.difficulty);return {id:item.id.slice(0,100),contentId:content.id,label:content.label,text:content.text,kind:content.powerup?'powerup':content.kindByContext[item.context],powerup:content.powerup||null,context:item.context,x:number(item.x,0,-savedWidth,savedWidth*2),y:number(item.y,0,-savedHeight,savedHeight*2),vx:number(item.vx,0,-2000,2000),vy:number(item.vy,-400,launch?-100000000:-5000,launch?100000000:5000),gravity:number(item.gravity,40,0,1000),radius:number(item.radius,36,10,100),age:number(item.age,0,0,12),...(launch?{launch}:{})};});
    if(s.scene!=='playing'&&s.scene!=='limit-choice')s.objects=[];
    this.state=s;this._balance();const targetWidth=this.width,targetHeight=this.height;this.width=savedWidth;this.height=savedHeight;this.resize(targetWidth,targetHeight);
  }catch{this.state=emptyState(this.seed,this.profile.selectedSkin);this.storageFailed=true;this.storageError='unreadable';}}
  getSnapshot(){return clone({state:this.state,profile:this.profile,width:this.width,height:this.height,storageFailed:this.storageFailed});}
  exportData(){return clone({game:'Notification Ninja',version:'1.8.0',schemaVersion:1,width:this.width,height:this.height,profile:this.profile,state:this.state});}
}
export const Game = NinjaGame;
