import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID,randomBytes} from 'node:crypto';
import {mkdtemp,rm,readFile,stat,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {Worker} from 'node:worker_threads';
import {Pool} from 'pg';
import {createNinjaStore} from '../server/ninja-store.mjs';
import {createPostgresNinjaStore,postgresConnectionOptions} from '../server/ninja-postgres-store.mjs';
import {createNinjaAuth} from '../server/ninja-auth.mjs';
import {createNinjaGameService} from '../server/ninja-game-service.mjs';
import {bootstrapNinjaAdmin,bootstrapNinjaAdminFromEnv} from '../server/ninja-admin-bootstrap.mjs';
import {ADMIN_TEST_BUDGET,WEEK_MS,utcWeekStart,weekId} from '../server/ninja-competition.mjs';
import {SKILLS,SUPERS,WORLDS,BACKGROUNDS,ACHIEVEMENTS} from '../notification-ninja/src/progression.js';
import {SKINS} from '../notification-ninja/src/skin-catalog.js';

const WEEK=Date.UTC(2026,10,16),DAY=86400000,password='Private synthetic account password 2026!';
const postgres=process.env.TEST_DATABASE_URL;
async function fixture(t,dialect){
  const directory=await mkdtemp(path.join(tmpdir(),'ninja-podium-admin-')),schema='podium_'+randomUUID().replaceAll('-','');
  let clock=WEEK,store,auth,game,admin=null,databaseURL;
  if(dialect==='postgres'){
    const url=new URL(postgres);
    assert(['localhost','127.0.0.1','[::1]'].includes(url.hostname),'Use an isolated loopback test database.');
    for(const key of ['host','hostaddr','port','dbname','user','password'])assert(!url.searchParams.has(key),'Database host overrides are not test configuration.');
    admin=new Pool(postgresConnectionOptions(postgres));await admin.query(`CREATE SCHEMA ${schema}`);
    url.searchParams.set('options','-csearch_path='+schema);databaseURL=url.href;
  }
  async function open(){
    store=dialect==='postgres'?await createPostgresNinjaStore({databaseURL,now:()=>clock}):createNinjaStore({databasePath:path.join(directory,'test.sqlite'),now:()=>clock});
    auth=createNinjaAuth(store,{now:()=>clock});game=createNinjaGameService(store,{now:()=>clock});
  }
  t.after(async()=>{await store?.close();if(admin){await admin.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);await admin.end();}await rm(directory,{force:true,recursive:true});});
  await open();
  return {
    get store(){return store;},get auth(){return auth;},get game(){return game;},now:()=>clock,setClock:stamp=>{clock=stamp;},
    databasePath:path.join(directory,'test.sqlite'),databaseURL,dialect,
    account:username=>auth.register({username,password}),
    async restart(){await store.close();await open();},
    // Explicit verified-score fixtures isolate ranking/settlement; real replay validation has its own tests.
    async score(userId,{score,duration=60,submittedAt=clock,finishedAt=submittedAt,id=randomUUID(),published=true}={}){
      const run={id,verified:true,mode:'open',result:'lives',ruleset:'open-v2',score,duration,decisions:10};
      await store.db.prepare("INSERT INTO ninja_runs(id,user_id,seed,started_at,expires_at,initial,profile_revision,status,response,finished_at,published) VALUES(?,?,?,?,?,?,0,'finished',?,?,?)").run(id,userId,'ranking-fixture',finishedAt-duration*1000,finishedAt+DAY,'{}',JSON.stringify({run}),finishedAt,published?1:0);
      if(published)await store.db.prepare('INSERT INTO ninja_verified_scores(run_id,user_id,ruleset,score,duration,decisions,submitted_at) VALUES(?,?,?,?,?,?,?)').run(id,userId,'open-v2',score,duration,10,submittedAt);
      return id;
    }
  };
}

async function concurrentClients(f,requests){
  const barrier=new SharedArrayBuffer(4),workers=[],ready=[],done=[];
  for(const request of requests){
    const worker=new Worker(`const {workerData,parentPort}=require('node:worker_threads');
      (async()=>{let store;try{
        const storage=await import(workerData.storeURL),{createNinjaGameService}=await import(workerData.gameURL);
        store=workerData.dialect==='postgres'?await storage.createPostgresNinjaStore({databaseURL:workerData.databaseURL,now:()=>workerData.now}):storage.createNinjaStore({databasePath:workerData.databasePath,now:()=>workerData.now});
        const game=createNinjaGameService(store,{now:()=>workerData.now});
        parentPort.postMessage({ready:true});Atomics.wait(new Int32Array(workerData.barrier),0,0);
        const req=workerData.request,result=req.type==='publish'?await game.publishRun(req.userId,req.runId):req.type==='claim'?await game.action(req.userId,req.command):await game.getState(req.userId);
        parentPort.postMessage({ok:true,coins:result.profile.coins});
      }catch(error){parentPort.postMessage({ok:false,code:error.code,message:error.message});}finally{await store?.close();}})();`,{eval:true,workerData:{databasePath:f.databasePath,databaseURL:f.databaseURL,dialect:f.dialect,now:f.now(),request,barrier,storeURL:new URL(f.dialect==='postgres'?'../server/ninja-postgres-store.mjs':'../server/ninja-store.mjs',import.meta.url).href,gameURL:new URL('../server/ninja-game-service.mjs',import.meta.url).href}});
    workers.push(worker);
    ready.push(new Promise((resolve,reject)=>{worker.on('message',msg=>{if(msg.ready)resolve();else if(!msg.ok)reject(new Error(msg.message));});worker.on('error',reject);}));
    done.push(new Promise((resolve,reject)=>{worker.on('message',msg=>{if(!msg.ready)resolve(msg);});worker.on('error',reject);worker.on('exit',code=>{if(code!==0)reject(new Error('Competition worker failed.'));});}));
  }
  try{await Promise.all(ready);Atomics.store(new Int32Array(barrier),0,1);Atomics.notify(new Int32Array(barrier),0,workers.length);return await Promise.all(done);}
  finally{await Promise.all(workers.map(worker=>worker.terminate()));}
}

for(const dialect of ['sqlite','postgres']){
  const options={skip:dialect==='postgres'&&!postgres,timeout:90000};
  test(`${dialect}: weekly podium uses full UTC results, distinct players and deterministic frozen prizes`,options,async t=>{
    const f=await fixture(t,dialect),a=await f.account('Podium Alpha'),b=await f.account('Podium Bravo'),c=await f.account('Podium Charlie'),d=await f.account('Podium Delta');
    const owner=await bootstrapNinjaAdmin({store:f.store,auth:f.auth,game:f.game,username:'Podium Owner',password,now:f.now});
    f.setClock(WEEK+DAY);
    await f.score(a.user.id,{score:600,submittedAt:WEEK+1000});
    await f.score(a.user.id,{score:700,submittedAt:WEEK+2000});
    await f.score(b.user.id,{score:700,submittedAt:WEEK+3000});
    await f.score(c.user.id,{score:600,submittedAt:WEEK+4000});
    await f.score(d.user.id,{score:500,submittedAt:WEEK+5000});
    await f.score(owner.user.id,{score:999999,submittedAt:WEEK+6000});
    const board=await f.game.leaderboard(null,{period:'week',limit:1});
    assert.equal(board.total,4);assert.equal(board.entries.length,1);assert.equal(board.entries[0].username,'Podium Alpha');
    assert.deepEqual((await f.game.leaderboard(null,{period:'week',limit:100})).entries.map(row=>row.username),['Podium Alpha','Podium Bravo','Podium Charlie','Podium Delta']);
    assert.equal((await f.game.getState(a.user.id)).podium.available.length,0,'The active week cannot pay out early');
    // A run finished in the previous week and published later is global only.
    await f.score(d.user.id,{score:10000,submittedAt:WEEK+WEEK_MS+1,finishedAt:WEEK+WEEK_MS-1});
    f.setClock(WEEK+WEEK_MS);
    const states=await Promise.all([a,b,c,d].map(player=>f.game.getState(player.user.id)));
    assert.deepEqual(states.map(state=>state.podium.available.map(prize=>[prize.place,prize.coins])),[[[1,100]],[[2,60]],[[3,30]],[]]);
    assert.equal((await f.game.leaderboard(null,{period:'week'})).total,0,'A late publication does not enter the new week either');
    assert.equal((await f.game.leaderboard(null,{period:'all'})).entries[0].username,'Podium Delta');
    // Later edits cannot rerank a completed, frozen week.
    await f.score(d.user.id,{score:20000,submittedAt:WEEK+7000,finishedAt:WEEK+7000});
    assert.equal((await f.game.getState(d.user.id)).podium.available.length,0);
    await f.store.db.prepare('DELETE FROM users WHERE id=?').run(a.user.id);
    assert.equal((await f.game.getState(d.user.id)).podium.available.length,0,'Deleting a winner does not backfill an already frozen podium');
    assert.equal((await f.game.getState(owner.user.id)).podium.available.length,0,'Admin test accounts cannot receive prizes');
    await f.restart();
    assert.deepEqual((await f.game.getState(b.user.id)).podium.available,[{week:'2026-11-16',place:2,coins:60,claimed:false}]);
  });

  test(`${dialect}: podium claims are transactional, one per week and safe under retries and races`,options,async t=>{
    const f=await fixture(t,dialect),a=await f.account('Claim Alpha'),b=await f.account('Claim Bravo');
    await f.score(a.user.id,{score:100,submittedAt:WEEK+DAY});await f.score(b.user.id,{score:50,submittedAt:WEEK+DAY});
    f.setClock(WEEK+WEEK_MS);
    const command={type:'podium.claim',id:'2026-11-16',payload:{coins:999999,place:1},idempotencyKey:'podium-claim-alpha'};
    const paid=await f.game.action(a.user.id,command);assert.equal(paid.profile.coins,100);assert.equal(paid.action.reward,100);
    const repeated=await f.game.action(a.user.id,command);assert.equal(repeated.replayed,true);assert.equal(repeated.profile.coins,100);
    await assert.rejects(Promise.resolve().then(()=>f.game.action(a.user.id,{...command,idempotencyKey:'podium-claim-again'})),error=>error.code==='PODIUM_ALREADY_CLAIMED');
    const raced=await Promise.allSettled(['one','two','three'].map(key=>Promise.resolve().then(()=>f.game.action(b.user.id,{type:'podium.claim',id:'2026-11-16',idempotencyKey:'podium-bravo-'+key}))));
    assert.equal(raced.filter(item=>item.status==='fulfilled').length,1);assert.equal((await f.game.getState(b.user.id)).profile.coins,60);
    assert.equal((await f.store.db.prepare("SELECT count(*) AS n FROM ninja_ledger WHERE user_id=? AND kind='podium.claim'").get(b.user.id)).n,1);
    await assert.rejects(Promise.resolve().then(()=>f.game.action(b.user.id,{type:'podium.claim',id:'2026-11-23',idempotencyKey:'podium-current-week'})),error=>error.code==='PODIUM_NOT_READY');
    await f.score(b.user.id,{score:900,submittedAt:WEEK+WEEK_MS+DAY});f.setClock(WEEK+2*WEEK_MS);
    await f.game.action(b.user.id,{type:'podium.claim',id:'2026-11-23',idempotencyKey:'podium-next-week'});
    assert.equal((await f.game.getState(b.user.id)).profile.coins,160,'The next completed week has its own one-time reward');
    await f.restart();assert.equal((await f.game.getState(b.user.id)).profile.coins,160);
    assert.equal((await f.game.getState(b.user.id)).podium.available.filter(prize=>prize.claimed).length,2);
  });

  test(`${dialect}: period ranking includes a player below the global top 100`,options,async t=>{
    const f=await fixture(t,dialect),current=await f.account('Current Week'),old=WEEK-DAY;
    // Clone synthetic fixture identities in one transaction; password hashing is unrelated to ranking.
    await f.store.transaction(function*(){
      for(let index=0;index<101;index++){
        const userId=randomUUID(),runId=randomUUID(),name='Old Player '+index;
        yield f.store.db.prepare('INSERT INTO users(id,username,username_key,password_hash,recovery_hash,created_at) SELECT ?,?,?,password_hash,recovery_hash,created_at FROM users WHERE id=?').run(userId,name,name.toLowerCase(),current.user.id);
        yield f.store.db.prepare('INSERT INTO profiles(user_id,data) SELECT ?,data FROM profiles WHERE user_id=?').run(userId,current.user.id);
        yield f.store.db.prepare('INSERT INTO wallets(user_id,balance) VALUES(?,0)').run(userId);
        yield f.store.db.prepare("INSERT INTO ninja_runs(id,user_id,seed,started_at,expires_at,initial,profile_revision,status,response,finished_at,published) VALUES(?,?,?, ?,?,'{}',0,'finished','{}',?,1)").run(runId,userId,'historical-rank-fixture',old-60000,old+DAY,old);
        yield f.store.db.prepare('INSERT INTO ninja_verified_scores(run_id,user_id,ruleset,score,duration,decisions,submitted_at) VALUES(?,?,?,?,60,10,?)').run(runId,userId,'open-v2',1000+index,old);
      }
    });
    await f.score(current.user.id,{score:10,submittedAt:WEEK+1000});f.setClock(WEEK+DAY);
    const global=await f.game.leaderboard(current.user.id,{period:'all',limit:100});assert.equal(global.entries.length,100);assert.equal(global.own.rank,102);assert(global.entries.every(row=>!row.mine));
    const weekly=await f.game.leaderboard(current.user.id,{period:'week',limit:100});assert.equal(weekly.total,1);assert.equal(weekly.own.rank,1);assert.equal(weekly.entries[0].mine,true);
    f.setClock(WEEK+WEEK_MS);assert.equal((await f.game.getState(current.user.id)).podium.available[0].coins,100);
  });

  test(`${dialect}: enabling podiums preserves old accounts without minting historical prizes`,options,async t=>{
    const f=await fixture(t,dialect),a=await f.account('Legacy Podium');
    await f.score(a.user.id,{score:10000,submittedAt:WEEK-DAY});
    f.setClock(WEEK+4*WEEK_MS);assert.deepEqual((await f.game.getState(a.user.id)).podium.available,[]);
    await assert.rejects(Promise.resolve().then(()=>f.game.action(a.user.id,{type:'podium.claim',id:'2026-11-09',idempotencyKey:'historical-no-prize'})),error=>error.code==='PODIUM_NOT_READY');
    assert.equal((await f.game.getState(a.user.id)).profile.coins,0);
    assert.equal((await f.game.leaderboard(null,{period:'all'})).entries.length,1,'Historical verified scores remain available globally');
  });

  test(`${dialect}: independent clients serialize rollover, late publication and one-time claims`,options,async t=>{
    const f=await fixture(t,dialect),a=await f.account('Rollover Alpha'),b=await f.account('Rollover Bravo');
    await f.score(a.user.id,{score:100,submittedAt:WEEK+DAY});
    const late=await f.score(b.user.id,{score:500,finishedAt:WEEK+WEEK_MS-1,published:false});
    f.setClock(WEEK+WEEK_MS);
    const mixed=await concurrentClients(f,[{type:'state',userId:a.user.id},{type:'publish',userId:b.user.id,runId:late},{type:'state',userId:b.user.id}]);
    assert(mixed.every(result=>result.ok),JSON.stringify(mixed));
    assert.equal((await f.store.db.prepare('SELECT count(*) AS n FROM ninja_podium_weeks').get()).n,1);
    assert.equal((await f.store.db.prepare('SELECT count(*) AS n FROM ninja_podium_rewards').get()).n,1);
    assert.deepEqual((await f.game.getState(a.user.id)).podium.available,[{week:'2026-11-16',place:1,coins:100,claimed:false}]);
    assert.equal((await f.game.getState(b.user.id)).podium.available.length,0);
    assert.equal((await f.game.leaderboard(null,{period:'all'})).entries[0].username,'Rollover Bravo');
    assert.equal((await f.game.leaderboard(null,{period:'week'})).total,0);
    const claims=await concurrentClients(f,['one','two','three'].map(key=>({type:'claim',userId:a.user.id,command:{type:'podium.claim',id:'2026-11-16',idempotencyKey:'independent-claim-'+key}})));
    assert.equal(claims.filter(result=>result.ok).length,1);assert(claims.filter(result=>!result.ok).every(result=>result.code==='PODIUM_ALREADY_CLAIMED'));
    assert.equal((await f.game.getState(a.user.id)).profile.coins,100);
    assert.equal((await f.store.db.prepare("SELECT count(*) AS n FROM ninja_ledger WHERE kind='podium.claim'").get()).n,1);
  });

  test(`${dialect}: owner bootstrap is private, idempotent and cannot take over a normal account`,options,async t=>{
    const f=await fixture(t,dialect),regular=await f.account('Normal Owner');
    await assert.rejects(bootstrapNinjaAdmin({store:f.store,auth:f.auth,game:f.game,username:'Normal Owner',password,now:f.now}),error=>error.code==='ADMIN_NAME_CONFLICT');
    assert.equal((await f.store.getUser(regular.user.id)).role,'player');
    assert.deepEqual(await bootstrapNinjaAdminFromEnv({store:f.store,env:{}}),{enabled:false});
    const recoveryKey='NNR-'+randomBytes(32).toString('base64url');
    const env={NINJA_ADMIN_BOOTSTRAP_USERNAME:'Ninja Team Admin',NINJA_ADMIN_BOOTSTRAP_PASSWORD:password,NINJA_ADMIN_BOOTSTRAP_RECOVERY_KEY:recoveryKey};
    const created=await bootstrapNinjaAdminFromEnv({store:f.store,auth:f.auth,game:f.game,env,now:f.now});assert.equal(created.created,true);
    assert.equal(JSON.stringify(created).includes(password),false);assert.equal(JSON.stringify(created).includes(recoveryKey),false);
    const again=await bootstrapNinjaAdminFromEnv({store:f.store,auth:f.auth,game:f.game,env:{...env,NINJA_ADMIN_BOOTSTRAP_PASSWORD:'A different private bootstrap password!'},now:f.now});assert.equal(again.created,false);
    const login=await f.auth.login({username:'Ninja Team Admin',password});assert.equal(login.account.role,'admin');assert.equal(login.profile.adminSandbox,true);
    await assert.rejects(f.auth.login({username:'Ninja Team Admin',password:'A different private bootstrap password!'}),error=>error.code==='INVALID_CREDENTIALS');
    const reset=await f.auth.resetPassword({username:'Ninja Team Admin',recoveryKey,password:'A privately changed owner password!'});assert.equal(reset.account.role,'admin');
    await f.restart();assert.equal((await f.game.getState(created.user.id)).account.unlimitedCoins,true);
    await f.auth.deleteAccount(created.user.id,{password:'A privately changed owner password!'});
    assert.equal((await f.store.db.prepare('SELECT count(*) AS n FROM ninja_admin_accounts WHERE user_id=?').get(created.user.id)).n,0);
  });

  test(`${dialect}: unlimited admin purchases stay private and profile JSON cannot forge the role`,options,async t=>{
    const f=await fixture(t,dialect),admin=await bootstrapNinjaAdmin({store:f.store,auth:f.auth,game:f.game,username:'Budget Admin',password,now:f.now});
    for(const [type,id]of [['skin.buy','solar'],['skill.buy','focus-root'],['world.buy','gaming']]){
      const bought=await f.game.action(admin.user.id,{type,id,idempotencyKey:'admin-'+type.replace('.','-')});
      assert.equal(bought.profile.coins,ADMIN_TEST_BUDGET);assert.equal(bought.account.unlimitedCoins,true);
    }
    assert((await f.game.getState(admin.user.id)).profile.unlockedSkins.includes('solar'));
    const run=await f.score(admin.user.id,{score:1000,submittedAt:WEEK+DAY});
    await assert.rejects(Promise.resolve().then(()=>f.game.publishRun(admin.user.id,run)),error=>error.code==='ADMIN_TEST_ACCOUNT');
    assert.equal((await f.game.leaderboard(null,{period:'all'})).total,0);
    const regular=await f.auth.register({username:'No Admin Forgery',password,role:'admin',adminSandbox:true,unlimitedCoins:true});
    const forged=await f.store.putProfile(regular.user.id,{...regular.profile,coins:ADMIN_TEST_BUDGET,adminSandbox:true,role:'admin',account:{role:'admin'},unlimitedCoins:true,podium:{available:[{coins:100}]}});
    assert.equal(forged.profile.coins,0);assert.equal(forged.profile.adminSandbox,undefined);assert.equal(forged.profile.role,undefined);assert.equal(forged.profile.podium,undefined);
    assert.equal((await f.game.getState(regular.user.id)).account.role,'player');
    await assert.rejects(Promise.resolve().then(()=>f.game.action(regular.user.id,{type:'skin.buy',id:'solar',idempotencyKey:'forged-admin-buy'})),error=>error.code==='ACTION_REJECTED');
  });

  test(`${dialect}: owner creation rolls back completely and simultaneous setup is idempotent`,options,async t=>{
    const f=await fixture(t,dialect),username='Atomic Owner';
    const failingStore={...f.store,db:{prepare(sql){if(sql.startsWith('INSERT INTO ninja_ledger'))throw new Error('Injected owner ledger failure');return f.store.db.prepare(sql);}}};
    await assert.rejects(bootstrapNinjaAdmin({store:failingStore,game:f.game,username,password,now:f.now}),/Injected owner ledger failure/);
    for(const table of ['users','profiles','wallets','sessions','ninja_admin_accounts','ninja_ledger'])assert.equal((await f.store.db.prepare(`SELECT count(*) AS n FROM ${table}`).get()).n,0,table+' rolled back');
    const owners=await Promise.all(Array.from({length:3},()=>bootstrapNinjaAdmin({store:f.store,game:f.game,username,password,now:f.now})));
    assert.equal(owners.filter(result=>result.created).length,1);assert.equal(new Set(owners.map(result=>result.user.id)).size,1);
    assert.equal((await f.store.db.prepare('SELECT count(*) AS n FROM sessions').get()).n,0,'Owner setup creates no session');
    assert.equal((await f.store.db.prepare('SELECT count(*) AS n FROM ninja_ledger').get()).n,1);
    assert.equal((await f.auth.login({username,password})).account.role,'admin');
  });

  test(`${dialect}: admin can purchase the complete current catalog with real prerequisites and prices`,options,async t=>{
    const f=await fixture(t,dialect),admin=await bootstrapNinjaAdmin({store:f.store,game:f.game,username:'Catalog Admin',password,now:f.now});
    assert.equal(SKILLS.length,18);assert.equal(SUPERS.length,6);assert.equal(ACHIEVEMENTS.length,36);assert.equal(SKINS.length,12);
    await assert.rejects(Promise.resolve().then(()=>f.game.action(admin.user.id,{type:'skill.buy',id:'star-super',idempotencyKey:'admin-prerequisite'})),error=>error.code==='ACTION_REJECTED');
    const purchases=[...SKILLS.map(item=>['skill.buy',item]),...WORLDS.filter(item=>item.cost>0).map(item=>['world.buy',item]),...BACKGROUNDS.filter(item=>item.cost>0).map(item=>['background.buy',item]),...SKINS.filter(item=>item.cost>0&&!item.unlock).map(item=>['skin.buy',item])];
    for(const [type,item]of purchases){
      const key='catalog-'+type.replace('.','-')+'-'+item.id,result=await f.game.action(admin.user.id,{type,id:item.id,idempotencyKey:key});
      assert.equal(result.profile.coins,ADMIN_TEST_BUDGET);
      const debit=await f.store.db.prepare('SELECT delta FROM ninja_ledger WHERE user_id=? AND reference=?').get(admin.user.id,'action:'+key);assert.equal(debit.delta,-item.cost);
    }
    const state=await f.game.getState(admin.user.id);assert.equal(state.profile.unlockedSkills.length,18);assert.equal(state.profile.unlockedWorlds.length,4);
    assert.deepEqual(state.profile.adventure.completed,[],'Purchases do not complete missions');assert(Object.values(state.profile.adventure.progress).every(value=>value===0));
  });
}

test('owner CLI persists private credentials before provisioning and refuses unsafe output paths',async t=>{
  const directory=await mkdtemp(path.join(tmpdir(),'ninja-owner-cli-')),databasePath=path.join(directory,'accounts.sqlite'),output=path.join(directory,'private.json'),root=fileURLToPath(new URL('../',import.meta.url));
  t.after(()=>rm(directory,{recursive:true,force:true}));
  function run(file,extra=[]){return spawnSync(process.execPath,['scripts/provision_ninja_admin.mjs','--username','Private CLI Owner','--database-path',databasePath,'--output',file,...extra],{cwd:root,env:{...process.env,DATABASE_URL:''},encoding:'utf8'});}
  const created=run(output);assert.equal(created.status,0,created.stderr);
  const credentials=JSON.parse(await readFile(output,'utf8'));assert.equal((await stat(output)).mode&0o777,0o600);
  for(const secret of [credentials.password,credentials.recoveryKey])assert.equal((created.stdout+created.stderr).includes(secret),false);
  const store=createNinjaStore({databasePath});t.after(()=>store.close());const auth=createNinjaAuth(store);
  assert.equal((await auth.login({username:credentials.username,password:credentials.password})).account.role,'admin');
  const original=await readFile(output,'utf8'),refused=run(output);assert.equal(refused.status,1);assert.equal(await readFile(output,'utf8'),original);
  const repeatPath=path.join(directory,'repeat.json'),repeated=run(repeatPath);assert.equal(repeated.status,0,repeated.stderr);assert.equal(JSON.parse(repeated.stdout).existingAdminUnchanged,true);await assert.rejects(access(repeatPath));
  const checkoutPath=path.join(root,'server','private-owner-test-'+randomUUID()+'.json');assert.equal(run(checkoutPath).status,1);await assert.rejects(access(checkoutPath));
  const missingParent=path.join(directory,'does-not-exist','private.json');assert.equal(run(missingParent).status,1);
  assert.equal((await store.db.prepare('SELECT count(*) AS n FROM ninja_admin_accounts').get()).n,1);
});

test('UTC competition weeks use Monday midnight through year boundaries',()=>{
  assert.equal(weekId(utcWeekStart(Date.UTC(2027,0,1,23,59,59))),'2026-12-28');
  assert.equal(utcWeekStart(WEEK+WEEK_MS-1),WEEK);assert.equal(utcWeekStart(WEEK+WEEK_MS),WEEK+WEEK_MS);
});
