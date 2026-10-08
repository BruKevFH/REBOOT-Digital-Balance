export const STORAGE_KEY = 'notification-ninja:save:v1';
export const LEVELS = [
  {id:'study',context:'study',title:'Lernen',duration:75,description:'Schulaufträge behalten. Streaks und Clips wegwischen.',goal:'Relevanz folgt deinem aktuellen Ziel.'},
  {id:'gaming',context:'gaming',title:'Gaming mit Grenze',duration:90,description:'Spielsignale dürfen jetzt wichtig sein. Deine gewählte Grenze bleibt sichtbar.',goal:'45, 60 oder 90 Sekunden: Du entscheidest am Limit.'},
  {id:'sleep',context:'sleep',title:'Schlaf & Ruhe',duration:75,stopAt:8,description:'Ruhe behalten. Reißerische Meldungen brauchen keine Antwort.',goal:'Früh Schluss machen ist eine gültige, belohnte Entscheidung.'},
  {id:'master',context:'study',title:'Context Master',duration:90,description:'Lernen → Gaming → Schlaf → Lernen. Die gleiche Nachricht kann ihre Bedeutung wechseln.',goal:'Der Kontext beim Start einer Karte zählt bis zu ihrem Ende.'}
];
export const SKINS = [
  {id:'default',name:'Ninja Mint',cost:0,color:'#75f6cd'},
  {id:'solar',name:'Solar Slice',cost:20,color:'#ffd171'},
  {id:'mint',name:'Arctic Focus',cost:45,color:'#83deff'},
  {id:'neon',name:'Violet Flow',cost:80,color:'#d8a3ff'}
];
const kinds = (study,gaming,sleep) => ({study,gaming,sleep});
export const CONTENT = [
  {id:'streak',label:'STREAK RETTEN!',text:'Deine Serie wartet. Öffne den Feed!',brand:'SOCIAL',icon:'🔥',color:'#ff917d',kindByContext:kinds('distraction','distraction','distraction')},
  {id:'urgent-school',label:'SCHULE · WICHTIG',text:'Der Gruppenauftrag braucht deine Rückmeldung.',brand:'SCHULE',icon:'✉',color:'#8bb9ff',kindByContext:kinds('useful','useful','distraction')},
  {id:'homework',label:'HAUSAUFGABEN',text:'Eine neue Aufgabe – heute ist noch Zeit.',brand:'SCHULE',icon:'▤',color:'#8bb9ff',kindByContext:kinds('useful','distraction','distraction')},
  {id:'gameclip',label:'NEUER GAME-CLIP',text:'Ein Spieltipp für deine nächste Runde.',brand:'GAME',icon:'▶',color:'#c0a0ff',kindByContext:kinds('distraction','useful','distraction')},
  {id:'gaming-invite',label:'GAMING-EINLADUNG',text:'Dein Team ist bereit für die nächste Runde.',brand:'GAME',icon:'✚',color:'#c0a0ff',kindByContext:kinds('distraction','useful','distraction')},
  {id:'break',label:'KURZE PAUSE',text:'Trinken, durchatmen, eine Sache nach der anderen.',brand:'PAUSE',icon:'◌',color:'#a0ddd1',kindByContext:kinds('useful','useful','useful')},
  {id:'quiet',label:'RUHEZEIT',text:'Die Schlafenszeit-Erinnerung darf bleiben.',brand:'RUHE',icon:'☾',color:'#9fb6da',kindByContext:kinds('distraction','distraction','useful')},
  {id:'scary-lure',label:'DU VERPASST ALLES!',text:'Künstliche Dringlichkeit: Jetzt sofort klicken!',brand:'FEED',icon:'!',color:'#ffbd80',kindByContext:kinds('distraction','distraction','distraction')},
  {id:'safety',label:'ECHTE WARNUNG',text:'Eine wichtige Sicherheitsmeldung behalten.',brand:'SICHERHEIT',icon:'△',color:'#ffc783',kindByContext:kinds('useful','useful','useful')},
  {id:'update',label:'UPDATE · MORGEN',text:'Kein Notfall. Dieses Update kann warten.',brand:'SYSTEM',icon:'↻',color:'#8ed1e0',kindByContext:kinds('distraction','distraction','distraction')},
  {id:'power-slow',label:'ZEITLUPE',text:'6 Sekunden langsamere Karten, normale Spielzeit.',brand:'TOOL',icon:'◷',color:'#80d4f8',powerup:'slow'},
  {id:'power-shield',label:'FOKUS-SCHILD',text:'Fängt genau einen Fehler ab.',brand:'TOOL',icon:'⬡',color:'#84f2cb',powerup:'shield'},
  {id:'power-multiplier',label:'PUNKTE ×2',text:'10 Sekunden doppelte Arcade-Punkte.',brand:'TOOL',icon:'×2',color:'#ffda86',powerup:'multiplier'}
];

const MAX = Number.MAX_SAFE_INTEGER;
const MODES = ['campaign','study','gaming','sleep','master'];
const CONTEXTS = ['study','gaming','sleep'];
const PLANS = {campaign:[0,1,2,3],study:[0],gaming:[1],sleep:[2],master:[3]};
const CONTENT_MAP = new Map(CONTENT.map(item=>[item.id,item]));
const SKIN_MAP = new Map(SKINS.map(item=>[item.id,item]));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const number = (value,fallback=0,min=0,max=MAX) => typeof value === 'number' && Number.isFinite(value) ? Math.max(min,Math.min(max,value)) : fallback;
const integer = (value,fallback=0,min=0,max=MAX) => Math.trunc(number(value,fallback,min,max));
const clone = value => JSON.parse(JSON.stringify(value));
const fail = reason => ({ok:false,reason});
const hash = value => {let h=2166136261;for(const char of String(value))h=Math.imul(h^char.charCodeAt(0),16777619);return (h>>>0)||1;};
const scoreKeys = () => Object.fromEntries(MODES.map(mode=>[mode,0]));
const metrics = () => ({cuts:0,usefulPassed:0,usefulMistakes:0,missedDistractions:0,shieldedMistakes:0,lifeLost:0,healthyStops:0,powerups:0,flowTriggers:0,correctDecisions:0,limitExtensions:0,sleepContinues:0,contextsPlayed:[],stageStats:[]});
const stageMetrics = () => ({cuts:0,usefulPassed:0,usefulMistakes:0,missedDistractions:0,shieldedMistakes:0,correctDecisions:0,score:0});
function profile() {return {coins:0,totalRuns:0,highScores:scoreKeys(),unlockedSkins:['default'],selectedSkin:'default',achievements:[],tutorialCompleted:false};}
function emptyState(seed,skin='default') {return {
  started:false,scene:'home',mode:'campaign',levelIndex:0,stageIndex:0,context:'study',isTutorial:false,
  tutorialDecisions:0,tutorialCuts:0,tutorialPassed:0,tutorialResults:null,tutorialReason:null,
  objects:[],score:0,scoreArcade:0,balance:50,balanceScore:100,combo:0,bestCombo:0,decisionStreak:0,overload:0,lives:3,
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
  }
  _time(){try{return number(this.now(),Date.now(),0,8640000000000000);}catch{return Date.now();}}
  _random(){let x=this.state.rng;x^=x<<13;x^=x>>>17;x^=x<<5;this.state.rng=(x>>>0)||1;return this.state.rng/4294967296;}
  _record(type,data={}){this.state.history.push({type,time:this._time(),elapsed:this.state.elapsed,context:this.state.context,...clone(data)});if(this.state.history.length>200)this.state.history.shift();}
  _achievement(id){if(!this.profile.achievements.includes(id))this.profile.achievements.push(id);}
  _radius(){return Math.min(this.width*.16,this.width<650?44:36);}
  _playable(){return this.state.started&&!this.state.ended&&this.state.scene==='playing'&&!this.state.paused;}
  _arcade(points){if(this.state.isTutorial)return;this.state.score=Math.min(MAX,this.state.score+points);this.state.scoreArcade=this.state.score;this.state.stageMetrics.score+=points;}
  _balance(){const m=this.state.metrics,correct=m.correctDecisions,wrong=m.usefulMistakes+m.missedDistractions;
    this.state.balanceScore=correct+wrong?Math.round(100*correct/(correct+wrong)):100;
    this.state.balanceScore=Math.max(0,Math.min(100,this.state.balanceScore+m.healthyStops*5-m.limitExtensions*5-m.sleepContinues*8));}
  _resetStage(){const s=this.state,level=LEVELS[s.levelIndex];s.context=level.context;s.objects=[];s.stageElapsed=0;
    s.duration=s.isTutorial?60:s.levelIndex===1?s.gamingLimit:level.duration;s.remaining=s.duration;
    s.combo=0;s.decisionStreak=0;s.effects={slow:0,shield:0,multiplier:0,flow:0};s.overload=Math.max(0,s.overload-15);
    s.stopAvailable=false;s.extensionUsed=false;s.sleepContinued=false;s.pendingContext=null;s.masterSwitchIndex=0;s.spawnTimer=.5;s.spawnCount=0;s.stageMetrics=stageMetrics();
    if(!s.metrics.contextsPlayed.includes(s.context))s.metrics.contextsPlayed.push(s.context);}
  start({mode='campaign',gamingLimit=90,skin=this.profile.selectedSkin,tutorial=true}={}) {
    if(!MODES.includes(mode))return fail('Wähle einen gültigen Spielmodus.');
    if(![45,60,90].includes(gamingLimit))return fail('Die Gaming-Grenze muss 45, 60 oder 90 Sekunden sein.');
    if(!SKIN_MAP.has(skin)||!this.profile.unlockedSkins.includes(skin))return fail('Dieser Skin ist noch nicht freigeschaltet.');
    const serial=this.state.runSerial+1;this.state=emptyState(hash(`${this.seed}:${mode}:${gamingLimit}`),skin);
    const s=this.state;s.started=true;s.startedAt=this._time();s.mode=mode;s.gamingLimit=gamingLimit;s.runSerial=serial;
    s.isTutorial=mode==='campaign'&&tutorial!==false&&!this.profile.tutorialCompleted;s.stageIndex=s.isTutorial?-1:0;s.levelIndex=PLANS[mode][0];
    s.scene='briefing';s.awaitingNext=true;this._resetStage();this._record('start',{mode,gamingLimit,tutorial:s.isTutorial});this.save();return {ok:true,state:s,events:[]};
  }
  nextLevel(){const s=this.state;if(!s.started||s.ended||!s.awaitingNext||s.scene!=='briefing')return fail('Es wartet kein neues Level.');
    s.awaitingNext=false;s.scene='playing';s.paused=false;this._record('level-started',{levelIndex:s.levelIndex,tutorial:s.isTutorial});this.save();return {ok:true,events:[{type:'level-started',levelIndex:s.levelIndex,context:s.context,isTutorial:s.isTutorial}]};}
  setPaused(value){if(typeof value!=='boolean')return fail('Ungültiger Pausenstatus.');if(!this.state.started||this.state.ended)return fail('Kein aktiver Run.');this.state.paused=value;this.save();return {ok:true,paused:value,events:[]};}
  pause(){return this.setPaused(true);}
  resume(){return this.setPaused(false);}
  resumeRun(){if(!this.state.started||this.state.ended)return fail('Kein gespeicherter Run zum Fortsetzen.');this.state.paused=false;return {ok:true,state:this.state,events:[]};}
  resize(width,height){if(!Number.isFinite(width)||!Number.isFinite(height)||width<240||height<240)return fail('Ungültige Spielfeldgröße.');
    const w=Math.min(5000,width),h=Math.min(5000,height),sx=w/this.width,sy=h/this.height;this.width=w;this.height=h;
    for(const obj of this.state.objects){obj.x*=sx;obj.y*=sy;obj.vx*=sx;obj.vy*=sy;obj.gravity*=sy;obj.radius=this._radius();obj.x=Math.max(obj.radius,Math.min(w-obj.radius,obj.x));}
    return {ok:true,width:w,height:h};}
  _spawnContent(id){if(this.state.objects.length>=50)return null;const content=CONTENT_MAP.get(id);if(!content)return null;
    const radius=this._radius(),span=Math.max(120,this.height-40),gravity=span*.08,flight=2.6+this._random()*.45;
    const y=this.height+radius+6,target=-radius-2,distance=y-target,vy=-(distance/flight+.5*gravity*flight);
    const obj={id:`ninja-${this.state.runSerial}-${++this.state.objectSequence}`,contentId:id,label:content.label,text:content.text,
      kind:content.powerup?'powerup':content.kindByContext[this.state.context],powerup:content.powerup||null,context:this.state.context,
      x:radius+(this.width-radius*2)*(.12+this._random()*.76),y,vx:(this._random()-.5)*Math.min(this.width*.14,120),vy,gravity,radius,age:0};
    this.state.objects.push(obj);return obj;}
  _spawn(events){const s=this.state;let ids;
    if(s.isTutorial){const order=['streak','urgent-school','streak','urgent-school','gameclip','homework'];ids=[order[s.spawnCount%order.length]];}
    else if(s.context==='study'&&s.spawnCount<2)ids=[s.spawnCount===0?'streak':'urgent-school'];
    else {const batch=this._random(),count=s.effects.flow>0&&batch<.04?5:batch<.04?3:batch<.24?2:1;
      const regular=CONTENT.filter(item=>!item.powerup);ids=Array.from({length:count},()=>this._random()<.09?['power-slow','power-shield','power-multiplier'][Math.floor(this._random()*3)]:regular[Math.floor(this._random()*regular.length)].id);}
    for(const id of ids){const obj=this._spawnContent(id);if(obj){s.spawnCount++;events.push({type:'spawned',...clone(obj)});}}
    const finale=s.levelIndex===3&&s.stageElapsed>=75&&!s.pendingContext;
    s.spawnTimer+=s.isTutorial?1.3:finale?.78:s.context==='sleep'?1.2:1.05;}
  _good(events){const s=this.state;s.metrics.correctDecisions++;s.stageMetrics.correctDecisions++;s.decisionStreak++;this._balance();
    if(s.isTutorial)s.tutorialDecisions++;
    if(s.decisionStreak%5===0){s.effects.flow=5;s.metrics.flowTriggers++;events.push({type:'flow-started',duration:5});if(!s.isTutorial)this._achievement('flow-five');}}
  _mistake(obj,kind,events){const s=this.state;
    if(s.effects.shield){s.effects.shield=0;s.metrics.shieldedMistakes++;s.stageMetrics.shieldedMistakes++;
      events.push({type:kind==='useful'?'useful-mistake':'distraction-missed',id:obj.id,contentId:obj.contentId,kind:obj.kind,x:obj.x,y:obj.y,protected:true,points:0});return;}
    const key=kind==='useful'?'usefulMistakes':'missedDistractions';s.metrics[key]++;s.stageMetrics[key]++;
    s.combo=0;s.decisionStreak=0;s.balance=Math.max(0,s.balance-(kind==='useful'?12:6));s.overload=Math.min(100,s.overload+(kind==='useful'?18:12));
    s.lives=Math.max(0,s.lives-1);s.metrics.lifeLost++;if(s.overload>=100)s.overload=60;this._balance();
    events.push({type:kind==='useful'?'useful-mistake':'distraction-missed',id:obj.id,contentId:obj.contentId,kind:obj.kind,x:obj.x,y:obj.y,protected:false,points:0});
    events.push({type:'life-lost',lives:s.lives,reason:kind==='useful'?'useful-cut':'distraction-passed'});
    if(!s.lives){if(s.isTutorial){s.lives=3;s.overload=0;events.push({type:'tutorial-retry'});}else this._finishRun('lives',events);}}
  _slice(obj,events,chain=false){const s=this.state;if(!s.objects.some(item=>item.id===obj.id)||s.ended)return;
    s.objects=s.objects.filter(item=>item.id!==obj.id);
    if(obj.kind==='useful'){this._mistake(obj,'useful',events);return;}
    if(obj.kind==='powerup'){s.metrics.powerups++;if(obj.powerup==='shield')s.effects.shield=1;else s.effects[obj.powerup]=obj.powerup==='slow'?6:10;
      events.push({type:'powerup',id:obj.id,contentId:obj.contentId,effect:obj.powerup,duration:obj.powerup==='shield'?1:s.effects[obj.powerup],x:obj.x,y:obj.y});return;}
    s.metrics.cuts++;s.stageMetrics.cuts++;s.combo++;s.bestCombo=Math.max(s.bestCombo,s.combo);s.balance=Math.min(100,s.balance+1);s.overload=Math.max(0,s.overload-3);
    if(s.isTutorial)s.tutorialCuts++;
    const multiplier=Math.min(4,1+Math.floor(s.combo/4))*(s.effects.multiplier>0?2:1),points=s.isTutorial?0:100*multiplier;
    this._arcade(points);this._good(events);events.push({type:'sliced',id:obj.id,contentId:obj.contentId,kind:obj.kind,context:obj.context,x:obj.x,y:obj.y,points,combo:s.combo,multiplier,chain});
    if(!s.isTutorial)this._achievement('first-cut');
  }
  swipe(value){if(!this._playable())return [];let points=Array.isArray(value)?value:isObject(value)?[{x:value.x1,y:value.y1},{x:value.x2,y:value.y2}]:[];
    points=points.slice(0,256);if(points.length<2||points.some(point=>!isObject(point)||!Number.isFinite(point.x)||!Number.isFinite(point.y)))return [];
    if(points.reduce((total,point,i)=>total+(i?Math.hypot(point.x-points[i-1].x,point.y-points[i-1].y):0),0)<4)return [];
    const s=this.state,events=[],wide=s.effects.flow>0?1.2:1;
    const direct=s.objects.map(obj=>({obj,order:segmentOrder(points,obj,obj.radius*wide)})).filter(hit=>Number.isFinite(hit.order)).sort((a,b)=>a.order-b.order);
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
    const points=s.isTutorial?0:100*(s.effects.multiplier>0?2:1);this._arcade(points);this._good(events);
    events.push({type:'useful-passed',id:obj.id,contentId:obj.contentId,kind:obj.kind,context:obj.context,x:obj.x,y:obj.y,points});}
  _master(events){const s=this.state;if(s.levelIndex!==3||s.isTutorial)return;
    const sequence=['study','gaming','sleep','study'];
    if(!s.pendingContext&&s.masterSwitchIndex<3&&s.stageElapsed>=(s.masterSwitchIndex+1)*25-.0000001){s.pendingContext=sequence[s.masterSwitchIndex+1];events.push({type:'context-changing',from:s.context,to:s.pendingContext});}
    if(s.pendingContext&&!s.objects.length){const from=s.context;s.context=s.pendingContext;s.pendingContext=null;s.masterSwitchIndex++;s.spawnTimer=.35;
      if(!s.metrics.contextsPlayed.includes(s.context))s.metrics.contextsPlayed.push(s.context);events.push({type:'context-changed',from,to:s.context});this._record('context-changed',{from,to:s.context});}}
  update(value){if(!this._playable())return [];const dt=number(value,0,0,.05);if(!dt)return [];const s=this.state,events=[];
    const slow=(s.effects.slow>0||s.effects.flow>0)? .5 : 1,step=dt*slow;
    s.elapsed+=dt;s.stageElapsed=Math.min(s.duration,s.stageElapsed+dt);s.remaining=Math.max(0,s.duration-s.stageElapsed);
    for(const effect of ['slow','multiplier','flow'])s.effects[effect]=Math.max(0,s.effects[effect]-dt);
    if(s.levelIndex===2&&!s.isTutorial&&s.stageElapsed>=8-.0000001)s.stopAvailable=true;
    for(const obj of [...s.objects]){if(s.ended)break;obj.age+=step;obj.x+=obj.vx*step;obj.y+=obj.vy*step+.5*obj.gravity*step*step;obj.vy+=obj.gravity*step;
      if(obj.x<obj.radius){obj.x=obj.radius;obj.vx=Math.abs(obj.vx);}else if(obj.x>this.width-obj.radius){obj.x=this.width-obj.radius;obj.vx=-Math.abs(obj.vx);}
      if(obj.y+obj.radius<0||obj.age>12)this._pass(obj,events);}
    if(s.ended)return events;
    if(s.isTutorial&&s.tutorialDecisions>=6&&s.tutorialCuts>=2&&s.tutorialPassed>=2)this._endTutorial('learned',events);
    else if(s.isTutorial&&s.remaining<=.0000001)this._endTutorial('timeout',events);
    else if(s.remaining<=.0000001){if(s.levelIndex===1){s.scene='limit-choice';s.stopAvailable=true;events.push({type:'limit-reached',limit:s.duration,extensionUsed:s.extensionUsed});this._record('limit-reached');this.save();}else this._endStage('time',events);}
    else {this._master(events);if(!s.pendingContext){s.spawnTimer-=dt;if(s.spawnTimer<=0)this._spawn(events);}}
    return events;
  }
  _endTutorial(reason,events){const s=this.state;if(!s.isTutorial)return;
    s.tutorialResults={decisions:s.tutorialDecisions,cuts:s.tutorialCuts,passed:s.tutorialPassed,elapsed:s.stageElapsed,reason};s.tutorialReason=reason;
    this.profile.tutorialCompleted=true;s.isTutorial=false;s.stageIndex=0;s.levelIndex=0;s.score=s.scoreArcade=0;s.balance=50;s.balanceScore=100;s.lives=3;s.overload=0;s.elapsed=0;
    s.metrics=metrics();s.scene='briefing';s.awaitingNext=true;s.paused=false;this._resetStage();this._record('tutorial-complete',{reason});events.push({type:'tutorial-complete',reason,levelIndex:0});this.save();}
  skipTutorial(){if(!this.state.started||this.state.ended||!this.state.isTutorial)return fail('Es ist kein Tutorial aktiv.');const events=[];this._endTutorial('skipped',events);return {ok:true,events};}
  _endStage(reason,events){const s=this.state;if(s.ended||s.scene==='briefing')return;
    const summary={levelIndex:s.levelIndex,context:LEVELS[s.levelIndex].id,elapsed:s.stageElapsed,reason,...clone(s.stageMetrics)};
    s.metrics.stageStats.push(summary);s.objects=[];s.stopAvailable=false;s.pendingContext=null;
    if(!s.stageMetrics.usefulMistakes&&!s.stageMetrics.missedDistractions)this._achievement('careful-stage');
    events.push({type:'level-complete',levelIndex:s.levelIndex,reason,summary:clone(summary)});this._record('level-complete',{levelIndex:s.levelIndex,reason});
    if(s.stageIndex+1>=PLANS[s.mode].length){this._finishRun(reason==='stop'?'healthy-stop':'complete',events);return;}
    s.stageIndex++;s.levelIndex=PLANS[s.mode][s.stageIndex];s.lives=Math.min(3,s.lives+1);s.scene='briefing';s.awaitingNext=true;s.paused=false;this._resetStage();this.save();}
  requestStop(){const s=this.state;if(!s.started||s.ended||s.paused||s.isTutorial)return fail('Hier ist gerade kein bewusster Stopp verfügbar.');
    if(!(s.levelIndex===1&&s.scene==='limit-choice'||s.levelIndex===2&&s.scene==='playing'&&s.stopAvailable))return fail('Die Stoppentscheidung wird an deiner Grenze oder in der Ruhephase verfügbar.');
    const events=[];s.metrics.healthyStops++;this._arcade(100);s.balance=Math.min(100,s.balance+10);s.overload=Math.max(0,s.overload-15);this._balance();this._achievement('healthy-stop');
    events.push({type:'healthy-stop',levelIndex:s.levelIndex,points:100});this._endStage('stop',events);return {ok:true,events};}
  continueAfterLimit(){const s=this.state;if(s.paused||s.ended||s.scene!=='limit-choice'||s.levelIndex!==1||s.extensionUsed)return fail('Eine Verlängerung ist hier nicht verfügbar.');
    s.extensionUsed=true;s.metrics.limitExtensions++;s.duration+=15;s.remaining=15;s.scene='playing';s.stopAvailable=false;s.overload=Math.min(99,s.overload+15);this._balance();this._record('limit-extended',{seconds:15,overload:15});this.save();
    return {ok:true,seconds:15,overload:15,events:[{type:'limit-continued',seconds:15,overload:15}]};}
  continueSleep(){const s=this.state;if(s.paused||s.ended||s.scene!=='playing'||s.levelIndex!==2||!s.stopAvailable||s.sleepContinued)return fail('Dieses Bonusangebot ist gerade nicht verfügbar.');
    s.sleepContinued=true;s.metrics.sleepContinues++;this._arcade(200);s.overload=Math.min(99,s.overload+15);this._balance();this._record('sleep-continued',{points:200,overload:15});this.save();return {ok:true,points:200,overload:15,events:[{type:'sleep-continued',points:200,overload:15}]};}
  _finishRun(result,events){const s=this.state;if(s.ended)return;s.ended=true;s.scene='results';s.result=result;s.finishedAt=this._time();s.objects=[];s.awaitingNext=false;s.paused=false;s.stopAvailable=false;this._balance();
    if(!s.credited&&!s.isTutorial){s.credited=true;const coins=Math.max(1,Math.floor(s.score/500)+s.metrics.healthyStops*2);s.awardedCoins=coins;this.profile.coins=Math.min(MAX,this.profile.coins+coins);this.profile.totalRuns++;
      this.profile.totalRuns=Math.min(MAX,this.profile.totalRuns);this.profile.highScores[s.mode]=Math.max(this.profile.highScores[s.mode],s.score);if(s.mode==='campaign'&&result!=='lives'||s.mode==='master'&&result!=='lives')this._achievement('context-master');}
    events.push({type:'ended',result,score:s.score,scoreArcade:s.scoreArcade,balanceScore:s.balanceScore,coins:s.awardedCoins});this._record('ended',{result});this.save();}
  buySkin(id){const skin=SKIN_MAP.get(id);if(!skin)return fail('Unbekannter Skin.');if(this.profile.unlockedSkins.includes(id))return fail('Dieser Skin ist bereits freigeschaltet.');
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
      this.profile.achievements=[...new Set((Array.isArray(p.achievements)?p.achievements:[]).filter(id=>['first-cut','flow-five','careful-stage','healthy-stop','context-master'].includes(id)))];}
    const source=saved.state;if(!isObject(source)||!MODES.includes(source.mode)||!['home','briefing','playing','limit-choice','results'].includes(source.scene))throw new Error('state');
    const s=emptyState(integer(source.rng,this.seed,1,0xffffffff),this.profile.selectedSkin);s.mode=source.mode;s.gamingLimit=[45,60,90].includes(source.gamingLimit)?source.gamingLimit:90;
    s.started=source.started===true;s.isTutorial=source.isTutorial===true&&s.mode==='campaign';
    if(!Number.isInteger(source.stageIndex)||source.stageIndex<(s.isTutorial?-1:0)||source.stageIndex>=PLANS[s.mode].length)throw new Error('stage');
    s.stageIndex=source.stageIndex;
    if(s.isTutorial&&s.stageIndex!==-1)throw new Error('tutorial');s.levelIndex=s.isTutorial?0:PLANS[s.mode][s.stageIndex];if(source.levelIndex!==s.levelIndex)throw new Error('level');
    s.scene=source.scene;s.ended=source.ended===true;s.credited=source.credited===true||s.ended;s.awaitingNext=s.scene==='briefing';s.paused=source.paused===true;
    if(s.ended!== (s.scene==='results')||s.scene==='limit-choice'&&(s.levelIndex!==1||s.isTutorial))throw new Error('scene');
    s.context=CONTEXTS.includes(source.context)?source.context:LEVELS[s.levelIndex].context;
    if(s.levelIndex!==3&&s.context!==LEVELS[s.levelIndex].context)throw new Error('context');
    s.extensionUsed=source.extensionUsed===true&&s.levelIndex===1;s.sleepContinued=source.sleepContinued===true&&s.levelIndex===2;
    s.duration=s.isTutorial?60:s.levelIndex===1?s.gamingLimit+(s.extensionUsed?15:0):LEVELS[s.levelIndex].duration;
    s.stageElapsed=number(source.stageElapsed,0,0,s.duration);s.remaining=Math.max(0,s.duration-s.stageElapsed);s.elapsed=number(source.elapsed,0,0,1000000);
    if(s.scene==='limit-choice'&&s.stageElapsed<s.duration-.001)throw new Error('limit');
    for(const key of ['score','combo','bestCombo','decisionStreak','objectSequence','runSerial','spawnCount','tutorialDecisions','tutorialCuts','tutorialPassed','awardedCoins'])s[key]=integer(source[key]);
    s.scoreArcade=s.score;s.balance=number(source.balance,50,0,100);s.overload=number(source.overload,0,0,100);s.lives=integer(source.lives,3,0,3);
    if(!s.ended&&s.lives===0)throw new Error('lives');s.stopAvailable=s.scene==='limit-choice'||s.levelIndex===2&&s.stageElapsed>=8&&!s.ended;
    s.effects={slow:number(source.effects?.slow,0,0,6),shield:integer(source.effects?.shield,0,0,1),multiplier:number(source.effects?.multiplier,0,0,10),flow:number(source.effects?.flow,0,0,5)};
    for(const key of Object.keys(s.metrics))if(!['contextsPlayed','stageStats'].includes(key))s.metrics[key]=integer(source.metrics?.[key]);
    s.metrics.contextsPlayed=[...new Set((Array.isArray(source.metrics?.contextsPlayed)?source.metrics.contextsPlayed:[]).filter(value=>CONTEXTS.includes(value)))];
    s.metrics.stageStats=(Array.isArray(source.metrics?.stageStats)?source.metrics.stageStats:[]).slice(0,4).filter(item=>isObject(item)&&Number.isInteger(item.levelIndex)&&item.levelIndex>=0&&item.levelIndex<4).map(item=>({levelIndex:item.levelIndex,context:LEVELS[item.levelIndex].id,elapsed:number(item.elapsed,0,0,105),reason:['time','stop'].includes(item.reason)?item.reason:'time',...Object.fromEntries(Object.keys(stageMetrics()).map(key=>[key,integer(item[key])]))}));
    const completed=s.isTutorial?0:s.stageIndex+(s.scene==='results'&&source.result!=='lives'?1:0);
    if(s.started&&(s.metrics.stageStats.length!==completed||s.metrics.stageStats.some((item,index)=>item.levelIndex!==PLANS[s.mode][index])))throw new Error('progress');
    for(const key of Object.keys(s.stageMetrics))s.stageMetrics[key]=integer(source.stageMetrics?.[key]);
    s.spawnTimer=number(source.spawnTimer,.5,0,2);s.masterSwitchIndex=integer(source.masterSwitchIndex,0,0,3);s.pendingContext=CONTEXTS.includes(source.pendingContext)&&s.levelIndex===3?source.pendingContext:null;
    if(s.levelIndex===3&&(s.context!==['study','gaming','sleep','study'][s.masterSwitchIndex]||s.stageElapsed+.0000001<s.masterSwitchIndex*25||s.pendingContext&&s.pendingContext!==['gaming','sleep','study'][s.masterSwitchIndex]))throw new Error('master context');
    s.skin=this.profile.unlockedSkins.includes(source.skin)?source.skin:this.profile.selectedSkin;s.result=['complete','healthy-stop','lives'].includes(source.result)?source.result:null;
    s.startedAt=number(source.startedAt,this._time());if(s.ended)s.finishedAt=number(source.finishedAt,this._time());
    s.tutorialReason=['learned','timeout','skipped'].includes(source.tutorialReason)?source.tutorialReason:null;
    s.tutorialResults=isObject(source.tutorialResults)?{decisions:integer(source.tutorialResults.decisions),cuts:integer(source.tutorialResults.cuts),passed:integer(source.tutorialResults.passed),elapsed:number(source.tutorialResults.elapsed,0,0,60),reason:s.tutorialReason}:null;
    s.history=(Array.isArray(source.history)?source.history:[]).slice(-200).filter(isObject).map(item=>({type:typeof item.type==='string'?item.type.slice(0,50):'unknown',time:number(item.time),elapsed:number(item.elapsed),context:CONTEXTS.includes(item.context)?item.context:'study'}));
    const savedWidth=number(saved.width,this.width,240,5000),savedHeight=number(saved.height,this.height,240,5000),ids=new Set();
    s.objects=(Array.isArray(source.objects)?source.objects:[]).slice(-50).filter(item=>isObject(item)&&typeof item.id==='string'&&CONTENT_MAP.has(item.contentId)&&CONTEXTS.includes(item.context)&&[item.x,item.y,item.vx,item.vy,item.gravity].every(Number.isFinite)).filter(item=>{if(ids.has(item.id))return false;ids.add(item.id);return true;}).map(item=>{const content=CONTENT_MAP.get(item.contentId);return {id:item.id.slice(0,100),contentId:content.id,label:content.label,text:content.text,kind:content.powerup?'powerup':content.kindByContext[item.context],powerup:content.powerup||null,context:item.context,x:number(item.x,0,-savedWidth,savedWidth*2),y:number(item.y,0,-savedHeight,savedHeight*2),vx:number(item.vx,0,-2000,2000),vy:number(item.vy,-400,-5000,5000),gravity:number(item.gravity,40,0,1000),radius:number(item.radius,36,10,100),age:number(item.age,0,0,12)};});
    if(s.scene!=='playing'&&s.scene!=='limit-choice')s.objects=[];
    this.state=s;this._balance();const targetWidth=this.width,targetHeight=this.height;this.width=savedWidth;this.height=savedHeight;this.resize(targetWidth,targetHeight);
  }catch{this.state=emptyState(this.seed,this.profile.selectedSkin);this.storageFailed=true;this.storageError='unreadable';}}
  getSnapshot(){return clone({state:this.state,profile:this.profile,width:this.width,height:this.height,storageFailed:this.storageFailed});}
  exportData(){return clone({game:'Notification Ninja',version:'1.0.0',schemaVersion:1,width:this.width,height:this.height,profile:this.profile,state:this.state});}
}
export const Game = NinjaGame;
