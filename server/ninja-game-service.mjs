import {operation} from './ninja-operations.mjs';
import {createHash,randomBytes,randomUUID} from 'node:crypto';
import {NinjaGame,OPEN_RULESET} from '../notification-ninja/src/game.js';
import {getPlayerProgress} from '../notification-ninja/src/player.js';
import {normalizeAdventure} from '../notification-ninja/src/adventure.js';
import {normalizeJourney,applyRankUnlocks} from '../notification-ninja/src/journey.js';

export const GAME_SERVICE_CONFIG=Object.freeze({maxCommands:40000,maxLogBytes:2*1024*1024,runTTL:24*60*60*1000,wallClockTolerance:3000,maxSwipePoints:256,ruleset:OPEN_RULESET});
const MAX=Number.MAX_SAFE_INTEGER;
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const clone=value=>JSON.parse(JSON.stringify(value));
const fail=(status,code,message)=>Object.assign(new Error(message),{status,code});
const bad=(message='Diese Anfrage ist ungültig.')=>fail(400,'INVALID_REQUEST',message);
const checked=(result)=>{if(!result||result.ok!==true)throw fail(409,'ACTION_REJECTED',result?.reason||'Diese Aktion ist gerade nicht möglich.');return result;};
const hash=value=>createHash('sha256').update(value).digest('hex');
const stringify=value=>JSON.stringify(value);
const keyPattern=/^[A-Za-z0-9_:.\-]{8,100}$/;
const runPattern=/^[a-f0-9-]{36}$/;
const SETTINGS_KEYS=new Set(['language','calmEffects','musicVolume','effectsVolume','muted','screenShake']);
const NO_ARGS=new Set(['nextLevel','pause','resume','resumeRun','requestStop','continueAfterLimit','continueSleep','activateSuper','finishRound','skipTutorial']);
const METHODS=new Set([...NO_ARGS,'setPaused','update','resize','swipe']);

/** Only explicitly supported, bounded preferences can enter an account profile. */
function settingsPatch(value){
  if(!object(value))throw bad('Die Einstellungen sind ungültig.');
  const patch={};
  for(const [key,item]of Object.entries(value)){
    if(!SETTINGS_KEYS.has(key))throw bad('Diese Einstellung ist unbekannt.');
    if(key==='language'){if(!['de','en'].includes(item))throw bad('Wähle Deutsch oder Englisch.');}
    else if(['musicVolume','effectsVolume'].includes(key)){if(typeof item!=='number'||!Number.isFinite(item)||item<0||item>1)throw bad('Die Lautstärke muss zwischen 0 und 1 liegen.');}
    else if(typeof item!=='boolean')throw bad('Diese Einstellung braucht einen Wahrheitswert.');
    patch[key]=item;
  }
  return patch;
}
const defaultSettings=()=>({language:'de',calmEffects:false,musicVolume:.4,effectsVolume:.5,muted:false,screenShake:true});
function memory(){const map=new Map();return {getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,String(value)),removeItem:key=>map.delete(key)};}
function addNotifications(game,before,stamp){
  const owned=[['skill','unlockedSkills'],['world','unlockedWorlds'],['background','unlockedBackgrounds'],['skin','unlockedSkins'],['achievement','achievements']];
  for(const [type,key]of owned)for(const ref of game.profile[key]||[])if(!(before[key]||[]).includes(ref))game.addNotification({type,ref,createdAt:stamp});
  const previous=getPlayerProgress(before).level,current=getPlayerProgress(game.profile).level;
  if(current>previous&&current<=100000)game.addNotification({type:'level',ref:String(current),createdAt:stamp});
}
function profileModel(profile,stamp){
  const game=new NinjaGame({storage:memory(),now:()=>stamp});
  game.profile=clone(profile);
  game.profile.accountCalendar='utc';
  normalizeJourney(game.profile,stamp);normalizeAdventure(game.profile,stamp);applyRankUnlocks(game.profile,stamp);
  game.profile.settings={...defaultSettings(),...(object(profile.settings)?settingsPatch(profile.settings):{})};
  return game;
}
function validateViewport(value){
  if(!object(value)||![value.width,value.height].every(n=>typeof n==='number'&&Number.isFinite(n)&&n>=240&&n<=5000))throw bad('Die Spielfeldgröße ist ungültig.');
  return {width:value.width,height:value.height};
}
function validateCommand(entry){
  if(!Array.isArray(entry)||entry.length!==2||typeof entry[0]!=='string'||!METHODS.has(entry[0])||!Array.isArray(entry[1]))throw bad('Das Rundenprotokoll enthält einen unbekannten Befehl.');
  const [method,args]=entry;
  if(NO_ARGS.has(method)){if(args.length)throw bad('Dieser Rundenbefehl hat unerwartete Daten.');return;}
  if(method==='update'){if(args.length!==1||typeof args[0]!=='number'||!Number.isFinite(args[0])||args[0]<0||args[0]>.05)throw bad('Die Schrittzeit im Rundenprotokoll ist ungültig.');return;}
  if(method==='setPaused'){if(args.length!==1||typeof args[0]!=='boolean')throw bad('Der Pausenbefehl ist ungültig.');return;}
  if(method==='resize'){if(args.length!==2)throw bad();validateViewport({width:args[0],height:args[1]});return;}
  if(method==='swipe'){
    if(args.length!==1)throw bad('Die Wischbewegung ist ungültig.');
    const value=args[0],points=Array.isArray(value)?value:object(value)?[{x:value.x1,y:value.y1},{x:value.x2,y:value.y2}]:[];
    if(points.length<2||points.length>GAME_SERVICE_CONFIG.maxSwipePoints||points.some(point=>!object(point)||![point.x,point.y].every(n=>typeof n==='number'&&Number.isFinite(n)&&Math.abs(n)<=10000)))throw bad('Die Wischbewegung ist ungültig.');
  }
}

/** Account-bound rules, atomic wallet mutations and server replay. No submitted score is trusted. */
export function createNinjaGameService(store,{now=()=>Date.now(),maxCommands=GAME_SERVICE_CONFIG.maxCommands,maxLogBytes=GAME_SERVICE_CONFIG.maxLogBytes,runTTL=GAME_SERVICE_CONFIG.runTTL,wallClockTolerance=GAME_SERVICE_CONFIG.wallClockTolerance}={}){
  if(!store?.db||typeof store.transaction!=='function')throw new TypeError('A Ninja store is required.');
  for(const [name,value,min,max]of [['maxCommands',maxCommands,1,200000],['maxLogBytes',maxLogBytes,256,8*1024*1024],['runTTL',runTTL,1000,7*24*60*60*1000],['wallClockTolerance',wallClockTolerance,0,10000]])if(!Number.isSafeInteger(value)||value<min||value>max)throw new TypeError(`Invalid ${name}.`);
  const db=store.db;
  const clock=()=>{const value=now();if(!Number.isSafeInteger(value)||value<0||value>MAX-runTTL)throw new TypeError('The game clock must return a valid timestamp.');return value;};
  if(store.dialect!=='postgres')store.transaction(()=>{
    db.exec(`
      CREATE TABLE IF NOT EXISTS ninja_game_migrations(version INTEGER PRIMARY KEY,applied_at INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS ninja_ledger(
        id INTEGER PRIMARY KEY AUTOINCREMENT,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        reference TEXT NOT NULL,kind TEXT NOT NULL,delta INTEGER NOT NULL CHECK(typeof(delta)='integer'),
        balance_after INTEGER NOT NULL CHECK(balance_after>=0),created_at INTEGER NOT NULL,
        UNIQUE(user_id,reference)
      );
      CREATE TABLE IF NOT EXISTS ninja_actions(
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,key TEXT NOT NULL,
        body_hash TEXT NOT NULL,response TEXT NOT NULL CHECK(json_valid(response)),created_at INTEGER NOT NULL,
        PRIMARY KEY(user_id,key)
      );
      CREATE TABLE IF NOT EXISTS ninja_runs(
        id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        seed TEXT NOT NULL,started_at INTEGER NOT NULL,expires_at INTEGER NOT NULL,
        initial TEXT NOT NULL CHECK(json_valid(initial)),profile_revision INTEGER NOT NULL,
        status TEXT NOT NULL CHECK(status IN('active','superseded','finished')),
        commands_hash TEXT,response TEXT CHECK(response IS NULL OR json_valid(response)),finished_at INTEGER,
        published INTEGER NOT NULL DEFAULT 0 CHECK(published IN(0,1))
      );
      CREATE INDEX IF NOT EXISTS ninja_runs_owner ON ninja_runs(user_id,status,started_at);
      CREATE UNIQUE INDEX IF NOT EXISTS ninja_one_active_run ON ninja_runs(user_id) WHERE status='active';
      CREATE TABLE IF NOT EXISTS ninja_verified_scores(
        run_id TEXT PRIMARY KEY REFERENCES ninja_runs(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        ruleset TEXT NOT NULL,score INTEGER NOT NULL CHECK(score>0),
        duration REAL NOT NULL CHECK(duration>0),decisions INTEGER NOT NULL CHECK(decisions>0),submitted_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS ninja_verified_score_order ON ninja_verified_scores(ruleset,score DESC,duration DESC,submitted_at);
    `);
    db.prepare('INSERT OR IGNORE INTO ninja_game_migrations(version,applied_at) VALUES(?,?)').run(1,clock());
  });
  function* getState(userId){
    const state=(yield store.getProfile(userId)),game=profileModel(state.profile,clock());
    return {profile:clone(game.profile),revision:state.revision,serverNow:clock(),calendar:'utc'};
  }
  function* walletDelta(userId,delta,reference,kind,stamp){
    if(!Number.isSafeInteger(delta))throw fail(500,'INVALID_WALLET_DELTA','Die Münzen konnten nicht berechnet werden.');
    const current=(yield store.getProfile(userId)).profile.coins,next=current+delta;
    if(!Number.isSafeInteger(next)||next<0)throw fail(409,'INSUFFICIENT_COINS','Dafür fehlen Münzen.');
    (yield db.prepare('UPDATE wallets SET balance=? WHERE user_id=?').run(next,userId));
    (yield db.prepare('INSERT INTO ninja_ledger(user_id,reference,kind,delta,balance_after,created_at) VALUES(?,?,?,?,?,?)').run(userId,reference,kind,delta,next,stamp));
  }
  function* action(userId,body){
    if(!object(body)||typeof body.type!=='string'||typeof body.idempotencyKey!=='string'||!keyPattern.test(body.idempotencyKey)||Object.keys(body).some(key=>!['type','id','payload','idempotencyKey'].includes(key)))throw bad('Für diese Aktion fehlt eine gültige Wiederholungskennung.');
    const id=body.id,stamp=clock(),bodyHash=hash(stringify({type:body.type,id:id??null,payload:body.payload??null}));
    return store.transaction(function*(){
      const previous=(yield db.prepare('SELECT body_hash,response FROM ninja_actions WHERE user_id=? AND key=?').get(userId,body.idempotencyKey));
      if(previous){if(previous.body_hash!==bodyHash)throw fail(409,'IDEMPOTENCY_CONFLICT','Diese Wiederholungskennung wurde bereits für eine andere Aktion verwendet.');return {...JSON.parse(previous.response),...(yield* getState(userId)),replayed:true};}
      const before=(yield store.getProfile(userId)).profile,game=profileModel(before,stamp);let result;
      const methods={
        'skin.buy':'buySkin','skin.equip':'selectSkin','world.buy':'buyWorld','background.buy':'buyBackground','background.equip':'selectBackground',
        'skill.buy':'buySkill','super.equip':'selectSuper','achievement.claim':'claimAchievement','daily.claim':'claimDailyReward',
        'career.claim':'claimCareerReward','weekly.claim':'claimWeeklyReward','notification.read':'markNotificationRead','guide.seen':'markGuideSeen'
      };
      if(Object.hasOwn(methods,body.type)){
        if(body.type==='super.equip'&&id===null)result=game.selectSuper(null);
        else{if(typeof id!=='string'||!id||id.length>100)throw bad('Die Auswahl ist ungültig.');result=game[methods[body.type]](id);}
      }else if(body.type==='weekly.skin')result=game.claimWeeklySkin();
      else if(body.type==='notifications.read')result=game.markNotificationsRead();
      else if(body.type==='settings.update'){const patch=settingsPatch(body.payload);game.profile.settings={...game.profile.settings,...patch};result={ok:true,settings:clone(game.profile.settings)};}
      else if(body.type==='guest.import'){
        if(!object(body.payload))throw bad();
        if(game.profile.guestImportVersion===1)result={ok:true,alreadyImported:true,ignoredProgress:true};
        else{
          if(body.payload.settings!==undefined)game.profile.settings={...game.profile.settings,...settingsPatch(body.payload.settings)};
          if(body.payload.tutorialCompleted===true)game.profile.tutorialCompleted=true;
          // No balance, XP, unlocked item or completion ever comes from local guest storage.
          game.profile.guestImportVersion=1;result={ok:true,imported:true,ignoredProgress:true};
        }
      }else throw bad('Diese Kontoaktion ist unbekannt.');
      checked(result);addNotifications(game,before,stamp);
      const delta=game.profile.coins-before.coins;
      (yield* walletDelta(userId,delta,`action:${body.idempotencyKey}`,body.type,stamp));
      const state=(yield store.putProfile(userId,game.profile)),response={profile:state.profile,revision:state.revision,action:clone(result)};
      (yield db.prepare('INSERT INTO ninja_actions(user_id,key,body_hash,response,created_at) VALUES(?,?,?,?,?)').run(userId,body.idempotencyKey,bodyHash,stringify(response),stamp));
      return response;
    });
  }
  function* startRun(userId,body){
    if(!object(body)||!['quick','mission','normal'].includes(body.kind)||Object.keys(body).some(key=>!['kind','context','mode','missionId','difficulty','gamingLimit','viewport','tutorial','forceTutorial'].includes(key)))throw bad('Wähle eine gültige Spielrunde.');
    const viewport=validateViewport(body.viewport),stamp=clock(),seed=body.mode==='daily'?hash('notification-ninja:daily:'+new Date(stamp).toISOString().slice(0,10)):randomBytes(32).toString('hex'),id=randomUUID();
    if(body.difficulty!==undefined&&!['easy','normal','hard'].includes(body.difficulty))throw bad('Wähle einen gültigen Schwierigkeitsgrad.');
    if(body.gamingLimit!==undefined&&![45,60,90].includes(body.gamingLimit))throw bad('Wähle eine gültige Gaming-Grenze.');
    if(body.tutorial!==undefined&&typeof body.tutorial!=='boolean'||body.forceTutorial!==undefined&&typeof body.forceTutorial!=='boolean')throw bad();
    return store.transaction(function*(){
      const current=(yield store.getProfile(userId)),game=profileModel(current.profile,stamp);
      game.seed=new NinjaGame({seed,storage:null}).seed;game.width=viewport.width;game.height=viewport.height;
      const sequence=current.runSequence+1;if(!Number.isSafeInteger(sequence))throw fail(503,'RUN_SEQUENCE_LIMIT','Eine neue Runde ist gerade nicht verfügbar.');
      game.state.runSerial=sequence-1;
      const options={difficulty:body.difficulty??'easy',...(body.gamingLimit!==undefined?{gamingLimit:body.gamingLimit}:{})};let started;
      if(body.kind==='quick')started=game.startQuickRound(body.context,options);
      else if(body.kind==='mission')started=game.startMission(body.missionId,options);
      else{
        if(!['campaign','study','gaming','sleep','master','open','boss-rush','daily'].includes(body.mode))throw bad('Wähle einen gültigen Spielmodus.');
        started=game.start({mode:body.mode,...options,...(body.mode==='daily'?{challengeDay:new Date(stamp).toISOString().slice(0,10)}:{}),tutorial:body.tutorial??(body.forceTutorial===true),forceTutorial:body.forceTutorial??false});
      }
      checked(started);const initial=game.exportData(),expiresAt=stamp+runTTL;
      (yield db.prepare("UPDATE ninja_runs SET status='superseded' WHERE user_id=? AND status='active'").run(userId));
      (yield db.prepare('UPDATE profiles SET run_sequence=? WHERE user_id=?').run(sequence,userId));
      (yield db.prepare("INSERT INTO ninja_runs(id,user_id,seed,started_at,expires_at,initial,profile_revision,status) VALUES(?,?,?,?,?,?,?,'active')").run(id,userId,seed,stamp,expiresAt,stringify(initial),current.revision));
      return {runId:id,seed,startedAt:stamp,expiresAt,initial,ruleset:initial.state.openRuleset||null};
    });
  }
  function* ownedRun(userId,id){if(typeof id!=='string'||!runPattern.test(id))throw fail(404,'RUN_NOT_FOUND','Diese Runde ist nicht verfügbar.');const row=(yield db.prepare('SELECT * FROM ninja_runs WHERE id=? AND user_id=?').get(id,userId));if(!row)throw fail(404,'RUN_NOT_FOUND','Diese Runde ist nicht verfügbar.');return row;}
  function* finishRun(userId,id,body){
    if(!object(body)||!Array.isArray(body.commands)||Object.keys(body).some(key=>key!=='commands'))throw bad('Sende das vollständige Rundenprotokoll.');
    const json=stringify(body.commands);if(Buffer.byteLength(json)>maxLogBytes||body.commands.length>maxCommands)throw fail(413,'RUN_LOG_TOO_LARGE','Das Rundenprotokoll ist zu groß.');
    const commandsHash=hash(json),stamp=clock(),row=(yield* ownedRun(userId,id));
    if(row.status==='finished'){
      if(row.commands_hash!==commandsHash)throw fail(409,'RUN_FINISH_CONFLICT','Diese Runde wurde bereits mit einem anderen Protokoll abgeschlossen.');
      const previous=JSON.parse(row.response);return {...previous,...(yield* getState(userId)),run:{...previous.run,published:row.published===1},replayed:true};
    }
    if(row.status!=='active')throw fail(409,'RUN_SUPERSEDED','Diese Runde wurde durch einen neuen Start ersetzt.');
    if(stamp>row.expires_at)throw fail(410,'RUN_EXPIRED','Diese Runde ist abgelaufen. Dein lokales Übungsergebnis bleibt erhalten.');
    const initial=JSON.parse(row.initial);let simulated=0;
    const game=new NinjaGame({storage:memory(),now:()=>row.started_at+Math.round(simulated*1000),seed:row.seed,width:initial.width,height:initial.height});
    game.profile=clone(initial.profile);game.state=clone(initial.state);
    for(const command of body.commands){
      validateCommand(command);const [method,args]=command;
      if(game.state.ended&&method!=='resize')throw bad('Das Rundenprotokoll läuft nach dem Ergebnis weiter.');
      if(method==='update'){
        simulated+=args[0];
        if(simulated*1000>stamp-row.started_at+wallClockTolerance)throw fail(422,'IMPOSSIBLE_DURATION','Diese Runde ist schneller als die vergangene Zeit abgelaufen.');
      }
      game[method](...args);
    }
    if(!game.state.ended||game.state.scene!=='results'||!['complete','healthy-stop','lives','locked','stopped'].includes(game.state.result))throw fail(422,'RUN_NOT_FINISHED','Die Runde ist noch nicht abgeschlossen.');
    if(!Number.isSafeInteger(game.state.score)||!Number.isSafeInteger(game.state.awardedCoins))throw fail(422,'INVALID_RUN_RESULT','Dieses Ergebnis konnte nicht geprüft werden.');
    return store.transaction(function*(){
      const fresh=(yield* ownedRun(userId,id));
      if(fresh.status==='finished'){
        if(fresh.commands_hash!==commandsHash)throw fail(409,'RUN_FINISH_CONFLICT','Diese Runde wurde bereits anders abgeschlossen.');
        return {...JSON.parse(fresh.response),...(yield* getState(userId)),replayed:true};
      }
      if(fresh.status!=='active')throw fail(409,'RUN_SUPERSEDED','Diese Runde wurde durch einen neuen Start ersetzt.');
      const current=(yield store.getProfile(userId)),credited=profileModel(current.profile,stamp),before=clone(credited.profile);
      // Re-credit canonical final state onto the latest profile: purchases/claims made
      // while paused survive, and date-sensitive challenges use server time.
      credited.profile.achievements=[...new Set([...credited.profile.achievements,...game.profile.achievements.filter(value=>!initial.profile.achievements.includes(value))])];
      if(game.profile.tutorialCompleted)credited.profile.tutorialCompleted=true;
      credited.state=clone(game.state);credited.state.ended=false;credited.state.credited=false;
      credited._finishRun(game.state.result,[]);
      addNotifications(credited,before,stamp);
      (yield* walletDelta(userId,credited.profile.coins-before.coins,`run:${id}`,'run.reward',stamp));
      const saved=(yield store.putProfile(userId,credited.profile)),state=credited.state;
      const run={id,result:state.result,score:state.score,decisions:state.metrics.correctDecisions,duration:state.elapsed,verified:true,published:false,mode:state.mode,ruleset:state.openRuleset||null,awardedCoins:state.awardedCoins};
      const response={profile:saved.profile,revision:saved.revision,run};
      (yield db.prepare("UPDATE ninja_runs SET status='finished',commands_hash=?,response=?,finished_at=? WHERE id=?").run(commandsHash,stringify(response),stamp,id));
      return response;
    });
  }
  function* publishRun(userId,id){
    return store.transaction(function*(){
      const row=(yield* ownedRun(userId,id));
      if(row.status!=='finished')throw fail(409,'RUN_NOT_VERIFIED','Beende und prüfe zuerst deinen Open Run.');
      const run=JSON.parse(row.response).run;
      if(!run.verified||run.mode!=='open'||run.result!=='lives'||run.ruleset!==OPEN_RULESET||run.score<=0||run.decisions<=0||run.duration<=0)throw fail(409,'RUN_NOT_RANKED','Nur ein geprüfter Open Run bis zum letzten Herz zählt für die Rangliste.');
      const stamp=clock();
      (yield db.prepare('INSERT OR IGNORE INTO ninja_verified_scores(run_id,user_id,ruleset,score,duration,decisions,submitted_at) VALUES(?,?,?,?,?,?,?)').run(id,userId,OPEN_RULESET,run.score,run.duration,run.decisions,stamp));
      (yield db.prepare('UPDATE ninja_runs SET published=1 WHERE id=?').run(id));
      return {...(yield* getState(userId)),run:{...run,published:true},leaderboard:(yield* leaderboard(userId,{ruleset:OPEN_RULESET,limit:25}))};
    });
  }
  function* leaderboard(userId=null,{ruleset=OPEN_RULESET,limit=25}={}){
    if(ruleset!==OPEN_RULESET)throw bad('Diese Ranglistenregeln sind nicht verfügbar.');
    const requested=typeof limit==='string'&&/^\d{1,3}$/.test(limit)?Number(limit):limit;
    if(!Number.isInteger(requested)||requested<1||requested>100)throw bad('Wähle eine gültige Ranglistenlänge.');
    const rows=(yield db.prepare(`WITH best AS (
      SELECT s.*,u.username,ROW_NUMBER() OVER(PARTITION BY s.user_id ORDER BY s.score DESC,s.duration DESC,s.submitted_at ASC,s.run_id ASC) AS personal
      FROM ninja_verified_scores s JOIN users u ON u.id=s.user_id WHERE s.ruleset=?
    ), ranked AS (
      SELECT *,ROW_NUMBER() OVER(ORDER BY score DESC,duration DESC,submitted_at ASC,run_id ASC) AS rank FROM best WHERE personal=1
    ) SELECT user_id,username,rank,score,duration,decisions,submitted_at FROM ranked ORDER BY rank`).all(ruleset));
    const publicRow=row=>({rank:row.rank,username:row.username,score:row.score,duration:row.duration,decisions:row.decisions,submittedAt:row.submitted_at,mine:row.user_id===userId});
    return {ruleset,verified:true,entries:rows.slice(0,requested).map(publicRow),total:rows.length,own:rows.find(row=>row.user_id===userId)?publicRow(rows.find(row=>row.user_id===userId)):null};
  }
  return Object.fromEntries(Object.entries({getState,action,startRun,finishRun,publishRun,leaderboard}).map(([name,callback])=>[name,operation(callback)]));
}
