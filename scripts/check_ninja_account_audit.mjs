// Isolated account/economy journey through the real HTTP API and real process restarts.
// Usage: TEST_DATABASE_URL=postgresql://...@127.0.0.1/test_db node scripts/check_ninja_account_audit.mjs
// Without TEST_DATABASE_URL, SQLite is checked alone. Remote database URLs are rejected.
// Every coin is earned through replay-validated public simulation commands; no wallet grants.
// The clock is synthetic to avoid waiting in real time for model replays. This is not a native-input playthrough.
// Temporary accounts, processes, SQLite files and unique PostgreSQL schemas are removed.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {mkdtemp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import path from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {randomBytes,randomUUID} from 'node:crypto';
import {Pool} from 'pg';
import {NinjaGame} from '../notification-ninja/src/game.js';
import {MAIN_MISSIONS} from '../notification-ninja/src/adventure.js';
import {isThrowReady} from '../notification-ninja/src/throwers.js';
import {testMfaCode} from '../server/ninja-mfa.mjs';
const clone=v=>JSON.parse(JSON.stringify(v));
const root=fileURLToPath(new URL('../',import.meta.url));
const output=path.resolve(process.env.NINJA_TEST_OUTPUT||path.join(root,'test-results/ninja-account-audit'));
const database=process.env.TEST_DATABASE_URL;
if(database){
 const url=new URL(database);
 if(!['postgres:','postgresql:'].includes(url.protocol)||!['127.0.0.1','localhost','[::1]'].includes(url.hostname)||url.searchParams.has('host')||url.searchParams.has('hostaddr'))throw Error('This account audit only permits a dedicated loopback PostgreSQL test database without host overrides.');
}
await mkdir(output,{recursive:true});
const workerSource=`
 import {createNinjaServer,createPostgresNinjaServer} from ${JSON.stringify(new URL('../server/ninja-service.mjs',import.meta.url).href)};
 let clock=Number(process.env.AUDIT_CLOCK);
 const options={now:()=>clock,mfaKey:process.env.AUDIT_MFA_KEY,rateLimits:{api:{limit:20000},auth:{limit:1000},reset:{limit:1000},finish:{limit:1000}}};
 const app=process.env.AUDIT_DATABASE_URL?await createPostgresNinjaServer({...options,databaseURL:process.env.AUDIT_DATABASE_URL}):createNinjaServer({...options,databasePath:process.env.AUDIT_DATABASE_PATH});
 app.listen(0,'127.0.0.1',()=>process.send({ready:true,port:app.address().port}));
 process.on('message',message=>{if(message.type==='clock'){clock=message.value;process.send({ack:message.id});}});
 process.on('SIGTERM',()=>app.close(async()=>{await app.ninja.store.close();process.exit(0);}));
`;
const version=JSON.parse(await readFile(path.join(root,'notification-ninja/dist/build.json'),'utf8')).version;
const password='Temporary Full Audit password 2026!';
const report={version,method:'Isolated real child server processes, synthetic clock explicitly advanced for replay simulation; no wallet or inventory grants',dialects:[],issues:[]};
function simulate(issued,{open=false}={}){
 let time=issued.startedAt;const game=new NinjaGame({storage:null,now:()=>time,seed:issued.seed,width:issued.initial.width,height:issued.initial.height});
 game.profile=clone(issued.initial.profile);game.state=clone(issued.initial.state);const commands=[];
 const call=(method,...args)=>{commands.push([method,clone(args)]);return game[method](...args);};
 call('nextLevel');
 for(let i=0;i<20000&&!game.state.ended;i++){
  if(game.state.scene==='briefing'){call('nextLevel');continue;}
  if(game.state.scene==='limit-choice'){call('requestStop');continue;}
  if(issued.initial.state.missionId==='sleep-06'&&game.state.elapsed>=30&&game.state.stopAvailable){call('requestStop');continue;}
  if(!open||game.state.elapsed<20)for(const item of [...game.state.objects])if(!game.state.ended&&item.kind==='distraction'&&isThrowReady(item))call('swipe',[{x:item.x,y:item.y-12},{x:item.x,y:item.y+12}]);
  if(!game.state.ended){time+=50;call('update',.05);}
 }
 assert(game.state.ended);return {game,commands,time};
}
for(const dialect of (database?['sqlite','postgres']:['sqlite'])){
 const entry={dialect,checks:[],missions:[],ok:false};report.dialects.push(entry);
 const directory=await mkdtemp(path.join(tmpdir(),'ninja-account-audit-data-')),schema='audit_'+randomUUID().replaceAll('-','');
 let clock=Date.UTC(2026,10,17,12),child=null,admin=null,databaseURL=null,ipcId=0,endpoint;
 const mfaKey=randomBytes(32).toString('hex');
 async function start(){
  child=spawn(process.execPath,['--input-type=module','--eval',workerSource],{
   stdio:['ignore','ignore','ignore','ipc'],
   env:{AUDIT_CLOCK:String(clock),AUDIT_MFA_KEY:mfaKey,AUDIT_DATABASE_PATH:directory+'/accounts.sqlite',...(databaseURL?{AUDIT_DATABASE_URL:databaseURL}:{})}
  });
  const current=child;
  const message=await new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>reject(Error('Isolated audit worker did not become ready.')),15000);
   const failed=()=>{clearTimeout(timer);reject(Error('Isolated audit worker exited before ready.'));};
   current.once('error',failed);current.once('exit',failed);
   current.once('message',data=>{clearTimeout(timer);current.off('exit',failed);current.off('error',failed);resolve(data);});
  });
  assert(message.ready);endpoint=`http://127.0.0.1:${message.port}/api/v3`;
 }
 async function stop(){
  if(!child)return;const current=child;child=null;
  if(current.exitCode!==null||current.signalCode!==null)return;
  const exit=once(current,'exit');
  const timer=setTimeout(()=>current.kill('SIGKILL'),5000);
  try{current.kill('SIGTERM');await exit;}finally{clearTimeout(timer);}
 }
 async function tick(value){clock=value;const id=++ipcId;await new Promise((resolve,reject)=>{
  const current=child;
  const cleanup=()=>{clearTimeout(timer);current.off('message',handler);current.off('exit',failed);};
  const handler=m=>{if(m.ack===id){cleanup();resolve();}};
  const failed=()=>{cleanup();reject(Error('Isolated audit worker exited before clock acknowledgement.'));};
  const timer=setTimeout(()=>{cleanup();reject(Error('Isolated audit worker did not acknowledge the clock.'));},10000);
  current.on('message',handler);current.once('exit',failed);current.send({type:'clock',id,value},error=>{if(error){cleanup();reject(Error('Isolated audit worker clock channel closed.'));}});
 });}
 async function api(route,{method='GET',body,token,status=200}={}){const response=await fetch(endpoint+route,{method,signal:AbortSignal.timeout(15000),headers:{...(body!==undefined?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});const data=await response.json();assert.equal(response.status,status,`${dialect} ${method} ${route}: ${data.code||'status'}`);return data;}
 async function action(account,type,id,payload,key=randomUUID()){return api('/actions',{method:'POST',token:account.token,body:{type,...(id!==undefined?{id}:{}),...(payload!==undefined?{payload}:{}),idempotencyKey:key}});}
 const accounts=[];
 try{
  if(dialect==='postgres'){admin=new Pool({connectionString:database,connectionTimeoutMillis:5000});await admin.query(`CREATE SCHEMA ${schema}`);const url=new URL(database);url.searchParams.set('options','-c search_path='+schema);databaseURL=url.href;}
  await start();const health=await api('/health');assert.equal(health.durableStorage,true);entry.checks.push('health_persistent_no_paths');
  for(const bad of [{email:'bad',passwordConfirmation:password,privacyAccepted:true},{email:'bad@example.test',passwordConfirmation:'mismatch',privacyAccepted:true},{email:'bad@example.test',passwordConfirmation:password,privacyAccepted:false}])await api('/auth/register',{method:'POST',status:400,body:{username:'Invalid Audit',password,...bad}});
  for(const suffix of ['Alpha','Beta']){const account=await api('/auth/register',{method:'POST',status:201,body:{username:`Audit ${suffix}`,email:`audit-${suffix.toLowerCase()}@example.test`,password,passwordConfirmation:password,privacyAccepted:true}});account.password=password;accounts.push(account);}
  const [a,b]=accounts;
  a.token=(await api('/auth/login',{method:'POST',body:{username:'AUDIT-ALPHA@EXAMPLE.TEST',password}})).token;
  await action(a,'settings.update',undefined,{language:'en',musicVolume:.17});await action(b,'settings.update',undefined,{language:'de',musicVolume:.83});
  const beforeB=await api('/me',{token:b.token});
  const forged=await api('/profile',{method:'PATCH',token:a.token,body:{username:'Audit Alpha',coins:999999,userId:b.user.id}});assert.equal(forged.profile.coins,0);
  await api('/actions',{method:'POST',token:a.token,status:400,body:{type:'settings.update',payload:{coins:-10},idempotencyKey:'forged-settings-coin'}});
  await api('/actions',{method:'POST',token:a.token,status:409,body:{type:'skin.buy',id:'solar',payload:{price:-80},idempotencyKey:'forged-price-audit'}});
  await api('/actions',{method:'POST',token:a.token,status:409,body:{type:'career.claim',id:'study-01',idempotencyKey:'unearned-claim-audit'}});
  entry.checks.push('registration_validation','separate_private_profiles','forged_wallet_prices_and_unearned_claims_refused');
  for(const mission of MAIN_MISSIONS){const issued=await api('/runs/start',{method:'POST',token:a.token,status:201,body:{kind:'mission',missionId:mission.id,viewport:{width:800,height:700}}});const played=simulate(issued);await tick(played.time);const finish=await api(`/runs/${issued.runId}/finish`,{method:'POST',token:a.token,body:{commands:played.commands}});assert(finish.run.verified);assert(finish.profile.adventure.completed.includes(mission.id),mission.id+' completion');const claimed=await action(a,'career.claim',mission.id);assert.equal(claimed.profile.coins,finish.profile.coins+mission.reward);const repeat=await api(`/runs/${issued.runId}/finish`,{method:'POST',token:a.token,body:{commands:played.commands}});assert(repeat.replayed);assert.equal(repeat.profile.coins,claimed.profile.coins);entry.missions.push({id:mission.id,verified:true,rewardClaimed:true,balance:claimed.profile.coins});}
  let state=await api('/me',{token:a.token});assert(state.profile.coins>=80);assert(state.profile.unlockedWorlds.includes('gaming')&&state.profile.unlockedWorlds.includes('sleep'));
  const buyBody={type:'skin.buy',id:'solar',idempotencyKey:'concurrent-genuine-earned-solar'};
  const buys=await Promise.all(Array.from({length:3},()=>api('/actions',{method:'POST',token:a.token,body:buyBody})));
  assert.equal(buys.filter(x=>!x.replayed).length,1);assert(buys.every(x=>x.profile.coins===state.profile.coins-80));
  await api('/actions',{method:'POST',token:a.token,status:409,body:{...buyBody,id:'mint'}});
  await action(a,'skin.equip','solar');
  assert.deepEqual((await api('/me',{token:b.token})).profile,beforeB.profile);entry.checks.push('18_verified_missions_rewards_once','worlds_unlocked_by_play','concurrent_idempotent_purchase_from_earned_coins','owned_outfit_equipped','no_cross_account_mutation');
  for(const account of accounts){const issued=await api('/runs/start',{method:'POST',token:account.token,status:201,body:{kind:'normal',mode:'open',viewport:{width:800,height:700}}});const played=simulate(issued,{open:true});assert.equal(played.game.state.result,'lives');assert(played.game.state.score>0);await tick(played.time);await api(`/runs/${issued.runId}/finish`,{method:'POST',token:account.token,body:{commands:played.commands}});assert.equal((await api('/leaderboard')).total,account===a?0:1);await api(`/runs/${issued.runId}/publish`,{method:'POST',token:account===a?b.token:a.token,status:404});await api(`/runs/${issued.runId}/publish`,{method:'POST',token:account.token});await api(`/runs/${issued.runId}/publish`,{method:'POST',token:account.token});}
  const board=await api('/leaderboard');assert.equal(board.total,2);assert(board.entries.every(row=>!('email'in row)&&!('userId'in row)));
  const setup=await api('/mfa/setup',{method:'POST',token:a.token,body:{password}});const enabled=await api('/mfa/confirm',{method:'POST',token:a.token,body:{code:testMfaCode(setup.secret,Math.floor(clock/30000))}});assert.equal(enabled.recoveryCodes.length,10);
  const persisted=await Promise.all(accounts.map(account=>api('/me',{token:account.token})));await stop();await start();
  for(let i=0;i<accounts.length;i++)assert.deepEqual((await api('/me',{token:accounts[i].token})).profile,persisted[i].profile);
  assert.deepEqual((await api('/leaderboard')).entries,board.entries);assert.equal((await api('/mfa/status',{token:a.token})).enabled,true);
  await tick(clock+31000);const challenge=await api('/auth/login',{method:'POST',body:{username:'Audit Alpha',password}});assert(challenge.mfaRequired&&!challenge.token);await api('/me',{token:challenge.challenge,status:401});const verified=await api('/auth/mfa/verify',{method:'POST',body:{challenge:challenge.challenge,code:testMfaCode(setup.secret,Math.floor(clock/30000))}});a.token=verified.token;
  await api('/auth/mfa/verify',{method:'POST',status:401,body:{challenge:challenge.challenge,code:enabled.recoveryCodes[0]}});
  const recoveryChallenge=await api('/auth/login',{method:'POST',body:{username:'Audit Alpha',password}});const recovered=await api('/auth/mfa/verify',{method:'POST',body:{challenge:recoveryChallenge.challenge,code:enabled.recoveryCodes[0]}});a.token=recovered.token;
  const usedRecoveryChallenge=await api('/auth/login',{method:'POST',body:{username:'Audit Alpha',password}});await api('/auth/mfa/verify',{method:'POST',status:401,body:{challenge:usedRecoveryChallenge.challenge,code:enabled.recoveryCodes[0]}});
  const reset=await api('/auth/reset',{method:'POST',body:{username:'Audit Beta',recoveryKey:b.recoveryKey,password:'New Full Audit Beta password!'}});await api('/me',{token:b.token,status:401});b.token=reset.token;b.password='New Full Audit Beta password!';
  await api('/auth/logout',{method:'POST',token:b.token});await api('/me',{token:b.token,status:401});b.token=(await api('/auth/login',{method:'POST',body:{username:'audit-beta@example.test',password:b.password}})).token;
  entry.checks.push('explicit_verified_publication_and_no_duplicate_scores','actual_process_restart_keeps_both_accounts_wallet_inventory_progress_ranking_mfa','mfa_challenge_not_session','mfa_otp_and_one_use_recovery','password_recovery_revokes_old_sessions','logout_revokes_session');
  for(const account of accounts){await api('/account',{method:'DELETE',token:account.token,body:{password:account.password}});await api('/me',{token:account.token,status:401});}assert.equal((await api('/leaderboard')).total,0);
  await stop();
  let counts;if(admin){counts={};for(const table of ['users','sessions','wallets','profiles','ninja_runs','ninja_actions','ninja_ledger','ninja_verified_scores','ninja_mfa','ninja_mfa_challenges'])counts[table]=Number((await admin.query(`SELECT count(*) AS n FROM ${schema}.${table}`)).rows[0].n);}else{const {DatabaseSync}=await import('node:sqlite');const db=new DatabaseSync(directory+'/accounts.sqlite');counts={};for(const table of ['users','sessions','wallets','profiles','ninja_runs','ninja_actions','ninja_ledger','ninja_verified_scores','ninja_mfa','ninja_mfa_challenges'])counts[table]=db.prepare(`SELECT count(*) AS n FROM ${table}`).get().n;db.close();}
  assert(Object.values(counts).every(n=>n===0));entry.cleanup=counts;entry.ok=true;console.log(dialect+' full lifecycle PASS');
 }catch(error){entry.error=error.stack;report.issues.push({dialect,error:error.message});console.error(dialect+' audit failure: '+error.message);}
 finally{
  try{await stop();}catch(error){report.issues.push({dialect,cleanup:'worker',error:error.message});}
  if(admin){try{await admin.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);}catch(error){report.issues.push({dialect,cleanup:'schema',error:error.message});}finally{await admin.end();}}
  try{await rm(directory,{recursive:true,force:true});}finally{await writeFile(output+'/report.json',JSON.stringify(report,null,2));}
 }
}
if(report.issues.length)process.exitCode=1;
