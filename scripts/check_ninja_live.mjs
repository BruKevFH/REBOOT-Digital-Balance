#!/usr/bin/env node
/** Explicit live acceptance. Provider credentials are neither read nor required.
 * prepare -> an operator restarts the actual service -> verify -> cleanup.
 * Keep the private state file outside the checkout; it contains synthetic accounts only.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes} from 'node:crypto';
import {setGlobalProxyFromEnv} from 'node:http';
import {NinjaGame} from '../notification-ninja/src/game.js';
import {isThrowReady} from '../notification-ninja/src/throwers.js';
import {getDailyChallenges} from '../notification-ninja/src/journey.js';
import {getCareerMissions,getWeeklyChallenges} from '../notification-ninja/src/adventure.js';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const ORIGIN='https://brukevfh.github.io';
const DEFAULT_BASE='https://notification-ninja-accounts.onrender.com';
const clone=value=>JSON.parse(JSON.stringify(value));
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const log=(event,details={})=>console.log(JSON.stringify({event,...details}));
const check=(condition,message)=>assert.ok(condition,message);

export function buildReplay(issued,{correctUntil=45}={}){
  let logicalTime=issued.startedAt;
  const game=new NinjaGame({storage:null,now:()=>logicalTime,seed:issued.seed,width:issued.initial.width,height:issued.initial.height});
  game.profile=clone(issued.initial.profile);game.state=clone(issued.initial.state);
  const commands=[];
  const call=(method,...args)=>{commands.push([method,clone(args)]);return game[method](...args);};
  call('nextLevel');
  for(let frame=0;frame<18000&&!game.state.ended;frame++){
    if(game.state.scene==='briefing'){call('nextLevel');continue;}
    if(game.state.scene==='limit-choice'){call('requestStop');continue;}
    if(game.state.elapsed<correctUntil)for(const item of [...game.state.objects]){
      if(game.state.ended)break;
      if((item.kind==='distraction'||item.kind==='powerup')&&isThrowReady(item))call('swipe',[{x:item.x,y:item.y-12},{x:item.x,y:item.y+12}]);
    }
    if(!game.state.ended){logicalTime+=50;call('update',.05);}
  }
  check(game.state.ended,'The shared game simulation must reach its real result.');
  check(game.state.score>0,'The live replay needs a positive earned score.');
  if(game.state.mode==='open')check(game.state.result==='lives','Open Run must end at the final heart.');
  else check(game.state.result==='complete','Economy round must be completed through gameplay.');
  return {commands,elapsed:game.state.elapsed,simulatedMs:logicalTime-issued.startedAt,score:game.state.score,result:game.state.result,earned:game.state.awardedCoins};
}

function argumentsFor(argv){
  const [phase,...rest]=argv;
  check(['prepare','verify','cleanup'].includes(phase),'Choose prepare, verify or cleanup.');
  const options={phase,base:DEFAULT_BASE,state:'/tmp/ninja-live-acceptance.json'};
  for(let i=0;i<rest.length;i+=2){
    check(['--base','--state'].includes(rest[i])&&rest[i+1],'Use --base URL and --state PATH.');
    options[rest[i].slice(2)]=rest[i+1];
  }
  const base=new URL(options.base);
  check(!base.username&&!base.password&&!base.search&&!base.hash&&base.pathname==='/','Use a plain service origin without credentials.');
  check(base.protocol==='https:'||(process.env.NINJA_LIVE_ALLOW_LOCAL==='1'&&base.protocol==='http:'&&['127.0.0.1','localhost'].includes(base.hostname)),'Live acceptance requires HTTPS.');
  options.base=base.origin;options.state=path.resolve(options.state);
  check(options.state!==ROOT&&!options.state.startsWith(ROOT+path.sep),'State must be outside the repository.');
  return options;
}

async function privateFile(options,{create=false}={}){
  // Resolve the existing parent directory to reject a symlink back into the checkout.
  const realParent=await fs.realpath(path.dirname(options.state));
  check(realParent!==ROOT&&!realParent.startsWith(ROOT+path.sep),'State parent must be outside the repository.');
  if(create){const handle=await fs.open(options.state,'wx',0o600);await handle.close();}
  const stat=await fs.lstat(options.state);
  check(stat.isFile()&&!stat.isSymbolicLink(),'State must be an ordinary private file.');
  await fs.chmod(options.state,0o600);
}

async function main(argv){
  const options=argumentsFor(argv);
  if(process.env.HTTPS_PROXY||process.env.HTTP_PROXY||process.env.https_proxy||process.env.http_proxy)setGlobalProxyFromEnv();
  let state;
  if(options.phase==='prepare'){
    await privateFile(options,{create:true});
    const id=randomBytes(5).toString('hex');
    state={version:1,base:options.base,origin:ORIGIN,createdAt:new Date().toISOString(),stage:'preparing',accounts:['a','b'].map(suffix=>({username:'qa'+id+suffix,email:'qa'+id+suffix+'@example.invalid',password:'Qa!'+randomBytes(24).toString('base64url'),registrationAttempted:false,deleted:false}))};
  }else{
    await privateFile(options);
    try{state=JSON.parse(await fs.readFile(options.state,'utf8'));}catch{throw new Error('Private state is unreadable or invalid JSON.');}
    check(state.version===1&&state.base===options.base&&state.origin===ORIGIN,'State belongs to a different target or version.');
    check(Array.isArray(state.accounts)&&state.accounts.length===2,'State must contain the two synthetic accounts.');
    check(state.accounts.every(account=>/^qa[0-9a-f]{10}[ab]$/.test(account.username)&&account.email===account.username+'@example.invalid'),'Only this script’s synthetic accounts may be handled.');
  }
  // Serialize checkpoints so simultaneous accounts cannot overwrite each other's updates.
  let saving=Promise.resolve();
  const save=()=>{
    const snapshot=JSON.stringify(state,null,2)+'\n';
    saving=saving.then(async()=>{
      const temporary=options.state+'.tmp-'+randomBytes(6).toString('hex');
      let handle;
      try{handle=await fs.open(temporary,'wx',0o600);await handle.writeFile(snapshot);await handle.sync();await handle.close();handle=null;await fs.rename(temporary,options.state);}
      finally{if(handle)await handle.close();await fs.rm(temporary,{force:true});}
    });
    return saving;
  };
  await save();

  async function request(route,{method='GET',token,body,expected=200,retry=method==='GET'||method==='OPTIONS',origin=ORIGIN,headers={}}={}){
    for(let attempt=0;attempt<8;attempt++){
      let response;
      try{response=await fetch(options.base+'/api/v3'+route,{method,headers:{Origin:origin,...(token?{Authorization:'Bearer '+token}:{}),...(body!==undefined?{'Content-Type':'application/json'}:{}),...headers},...(body!==undefined?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(45000)});}
      catch{
        if(!retry||attempt===7)throw new Error(`${method} ${route}: connection failed; no automatic auth retry was made.`);
        log('retry',{method,route,attempt:attempt+1,reason:'connection'});await sleep(Math.min(30000,2000*(attempt+1)));continue;
      }
      if(retry&&[429,502,503,504].includes(response.status)&&attempt<7){
        const header=response.headers.get('retry-after'),seconds=Number(header),until=Date.parse(header||'');
        const delay=Number.isFinite(seconds)&&seconds>=0?seconds*1000:Number.isFinite(until)?Math.max(0,until-Date.now()):Math.min(30000,2000*(attempt+1));
        log('retry',{method,route,attempt:attempt+1,status:response.status});await response.body?.cancel();
        // Chunk waits to keep each wait bounded while respecting long Retry-After values.
        for(let left=Math.max(1000,delay);left>0;left-=30000)await sleep(Math.min(30000,left));continue;
      }
      let result;try{result=response.status===204?null:await response.json();}catch{throw new Error(`${method} ${route}: response was not API JSON (HTTP ${response.status}).`);}
      check((Array.isArray(expected)?expected:[expected]).includes(response.status),`${method} ${route}: expected HTTP ${expected}, received ${response.status}.`);
      return {body:result,headers:response.headers,status:response.status};
    }
  }
  async function health(){
    const result=await request('/health');
    check(result.body.ok===true&&result.body.apiVersion===3&&result.body.durableStorage===true,'Service must report ready durable v3 storage.');
    check(result.body.storage==='postgresql'||process.env.NINJA_LIVE_ALLOW_LOCAL==='1','Remote service must use PostgreSQL.');
    check(result.headers.get('access-control-allow-origin')===ORIGIN,'The public frontend must receive its exact CORS origin.');
    return result.body;
  }
  async function me(account){return (await request('/me',{token:account.token})).body;}
  async function action(account,type,{id,payload}={}){
    const body={type,...(id!==undefined?{id}:{}),...(payload!==undefined?{payload}:{}),idempotencyKey:'qa-'+randomBytes(16).toString('hex')};
    account.pendingAction=body;await save();
    const result=(await request('/actions',{method:'POST',token:account.token,body,retry:true})).body;
    const repeated=(await request('/actions',{method:'POST',token:account.token,body,retry:true})).body;
    check(repeated.replayed===true&&repeated.profile.coins===result.profile.coins,'Retrying a claim or purchase must not repeat its wallet effect.');
    delete account.pendingAction;await save();return result;
  }
  async function collectRewards(account){
    let current=await me(account);
    // Getters act only on a detached copy. Rewards are granted by the server actions.
    for(let cycle=0;cycle<3;cycle++){
      const profile=clone(current.profile),now=current.serverNow;
      const ready=[
        ...(profile.achievements||[]).filter(id=>!(profile.claimedAchievements||[]).includes(id)).map(id=>({type:'achievement.claim',id})),
        ...getDailyChallenges(profile,now).filter(task=>task.completed&&!task.claimed).map(task=>({type:'daily.claim',id:task.id})),
        ...getCareerMissions(profile,now).filter(mission=>mission.ready).map(mission=>({type:'career.claim',id:mission.id})),
        ...getWeeklyChallenges(profile,now).filter(task=>task.completed&&!task.claimed).map(task=>({type:'weekly.claim',id:task.id}))
      ];
      if(!ready.length)break;
      for(const reward of ready){await action(account,reward.type,{id:reward.id});account.claims=(account.claims||0)+1;await save();}
      current=await me(account);
    }
    return current;
  }
  async function play(account,{open=false}={}){
    const body=open?{kind:'normal',mode:'open',difficulty:'easy',viewport:{width:800,height:700}}:{kind:'quick',context:'study',difficulty:'hard',viewport:{width:800,height:700}};
    // Start is not retried: a lost response could otherwise supersede a real run.
    const issued=(await request('/runs/start',{method:'POST',token:account.token,body,expected:201})).body;
    account.pendingRun={id:issued.runId,startedAt:issued.startedAt};await save();
    const played=buildReplay(issued,{correctUntil:open?45:Infinity});
    log('run_simulated',{account:account.username,mode:open?'open':'study-hard',seconds:Number(played.elapsed.toFixed(2)),score:played.score});
    // Honor the elapsed time on the real server clock; no tolerance shortcut.
    const serverNow=Number.isSafeInteger(issued.startedAt)?issued.startedAt:Date.now();
    const due=Date.now()+played.simulatedMs+500;
    const waitedFrom=Date.now();
    while(Date.now()<due)await sleep(Math.min(1000,due-Date.now()));
    check(Date.now()-waitedFrom>=played.simulatedMs,'Real time must pass before replay submission.');
    check(Number.isSafeInteger(serverNow),'Server start timestamp must be valid.');
    const finished=(await request(`/runs/${issued.runId}/finish`,{method:'POST',token:account.token,body:{commands:played.commands},retry:true})).body;
    check(finished.run.verified===true&&finished.run.score===played.score&&finished.run.result===played.result,'Server must reproduce the actual game result.');
    const duplicate=(await request(`/runs/${issued.runId}/finish`,{method:'POST',token:account.token,body:{commands:played.commands},retry:true})).body;
    check(duplicate.replayed===true&&duplicate.profile.coins===finished.profile.coins,'Repeated finish must not duplicate coins.');
    if(open){
      const published=(await request(`/runs/${issued.runId}/publish`,{method:'POST',token:account.token,retry:true})).body;
      check(published.run.published===true,'Publishing must be explicit and confirmed.');
      account.rankedRun={id:issued.runId,score:finished.run.score,duration:finished.run.duration,decisions:finished.run.decisions};
    }
    account.rounds=(account.rounds||0)+1;delete account.pendingRun;await save();return finished;
  }

  if(options.phase==='prepare'){
    try{
      await health();
      const denied=await request('/health',{origin:'https://cors-denied.example.invalid',expected:403});
      check(denied.headers.get('access-control-allow-origin')===null,'Unapproved origin must not receive CORS authorization.');
      const preflight=await request('/actions',{method:'OPTIONS',expected:204,headers:{'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'Authorization, Content-Type'}});
      check(preflight.headers.get('access-control-allow-origin')===ORIGIN,'Public frontend preflight must succeed.');
      const preparations=await Promise.allSettled(state.accounts.map(async(account,index)=>{
        account.registrationAttempted=true;await save();
        const created=(await request('/auth/register',{method:'POST',expected:201,body:{username:account.username,email:account.email,password:account.password,passwordConfirmation:account.password,privacyAccepted:true}})).body;
        account.token=created.token;account.id=created.user.id;await save();
        const signedIn=(await request('/auth/login',{method:'POST',body:{username:account.username,password:account.password}})).body;
        check(signedIn.user.id===account.id,'Login must reach the same account.');account.token=signedIn.token;await save();
        await action(account,'settings.update',{payload:{language:index?'de':'en',musicVolume:.23,effectsVolume:.61,screenShake:false,calmEffects:true}});
        await play(account,{open:true});
        let current=await collectRewards(account);
        for(let round=0;current.profile.coins<35&&round<6;round++){
          await play(account);current=await collectRewards(account);
        }
        check(current.profile.coins>=35,'Earned gameplay rewards must pay for the 35-coin focus skill.');
        const before=current.profile.coins;
        const purchased=await action(account,'skill.buy',{id:'focus-root'});
        check(purchased.profile.coins===before-35&&purchased.profile.unlockedSkills.includes('focus-root'),'Server must debit exactly 35 coins and grant the skill.');
        check((account.claims||0)>0,'At least one earned reward claim must be verified.');
        const after=await me(account);check(after.profile.totalRuns>=1&&after.profile.stats.correct>0,'Saved progress must come from verified rounds.');
        account.expected=after;account.prepared=true;await save();
        log('account_prepared',{account:account.username,coins:after.profile.coins,rounds:account.rounds,rewardClaims:account.claims,skill:'focus-root'});
      }));
      for(let index=0;index<preparations.length;index++)if(preparations[index].status==='rejected')log('account_prepare_failed',{account:state.accounts[index].username,reason:preparations[index].reason?.message||'Unknown failure'});
      check(preparations.every(result=>result.status==='fulfilled'),'An account preparation failed; run cleanup with the retained state.');
      const board=(await request('/leaderboard?limit=100')).body;
      state.expectedBoard=board.entries.filter(row=>state.accounts.some(account=>account.username===row.username));
      check(state.expectedBoard.length===2,'Both explicitly published Open Runs must be public.');
      check(state.expectedBoard.every(row=>!('email' in row)&&!('userId' in row)),'Public ranking must not expose private identity fields.');
      state.stage='prepared';state.preparedAt=new Date().toISOString();await save();log('prepared',{accounts:2,restartRequired:true});
    }catch(error){state.stage='prepare-failed';await save();log('prepare_failed',{cleanupRequired:true});throw error;}
  }else if(options.phase==='verify'){
    check(['prepared','verified'].includes(state.stage),'Finish prepare before restart verification.');
    await health();
    for(const account of state.accounts){
      const persisted=await me(account);
      assert.deepEqual(persisted.profile,account.expected.profile,'Full account profile must persist through the operator’s actual server restart.');
      check(persisted.revision===account.expected.revision,'Stored profile revision must persist.');
      const signedIn=(await request('/auth/login',{method:'POST',body:{username:account.email,password:account.password}})).body;
      check(signedIn.user.id===account.id,'Email login after restart must reach the same account.');
      const temporaryToken=signedIn.token;account.verificationToken=temporaryToken;await save();
      await request('/auth/logout',{method:'POST',token:temporaryToken});
      await request('/me',{token:temporaryToken,expected:401});
      delete account.verificationToken;account.verified=true;await save();
      log('account_persisted',{account:account.username,coins:persisted.profile.coins,inventory:true,progress:true,emailLogin:true,logout:true});
    }
    const board=(await request('/leaderboard?limit=100')).body;
    const rows=board.entries.filter(row=>state.accounts.some(account=>account.username===row.username));
    const stableRows=entries=>entries.map(({rank,mine,...row})=>row).sort((a,b)=>a.username.localeCompare(b.username));
    assert.deepEqual(stableRows(rows),stableRows(state.expectedBoard),'Both published scores must survive restart; other players may change their global ranks.');
    state.stage='verified';state.verifiedAt=new Date().toISOString();await save();log('verified',{accounts:2,rankingPersisted:true});
  }else{
    const failures=[];
    for(const account of state.accounts){
      if(account.deleted)continue;
      if(!account.registrationAttempted){account.deleted=true;delete account.password;delete account.token;await save();log('account_not_created',{account:account.username});continue;}
      try{
        const oldTokens=[account.token,account.verificationToken].filter(Boolean);
        let identity=account.token?(await request('/me',{token:account.token,expected:[200,401]})):null;
        if(!identity||identity.status===401){
          const login=await request('/auth/login',{method:'POST',body:{username:account.username,password:account.password},expected:[200,401]});
          if(login.status===401){
            const board=(await request('/leaderboard?limit=100')).body;
            check(!board.entries.some(row=>row.username===account.username),'An absent account must not have a public score.');
            account.deleted=true;delete account.password;delete account.token;delete account.verificationToken;await save();log('account_absent',{account:account.username});continue;
          }
          identity=login;account.token=login.body.token;await save();
        }
        check(identity.body.user?.username===account.username,'Cleanup must authenticate its own synthetic account.');
        check(!account.id||identity.body.user.id===account.id,'Cleanup identity must match its checkpoint.');
        account.id=identity.body.user.id;await save();
        const token=account.token;
        // Authentication mutations are sent once. A lost deletion response is
        // resolved by read/login checks, never by blindly repeating registration.
        try{await request('/account',{method:'DELETE',token,body:{password:account.password}});}catch{log('deletion_outcome_check',{account:account.username});}
        for(const revoked of new Set([...oldTokens,token]))await request('/me',{token:revoked,expected:401});
        await request('/auth/login',{method:'POST',body:{username:account.username,password:account.password},expected:401});
        const board=(await request('/leaderboard?limit=100')).body;
        check(!board.entries.some(row=>row.username===account.username),'Deleted synthetic score must disappear.');
        account.deleted=true;delete account.password;delete account.token;delete account.verificationToken;await save();
        log('account_deleted',{account:account.username,sessionRevoked:true,rankingRemoved:true});
      }catch{failures.push(account.username);log('cleanup_account_failed',{account:account.username});}
    }
    check(failures.length===0,'Cleanup remains incomplete; private state was retained for another cleanup attempt.');
    state.stage='cleaned';state.cleanedAt=new Date().toISOString();await save();log('cleaned',{accounts:state.accounts.filter(account=>account.deleted).length});
  }
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  main(process.argv.slice(2)).catch(error=>{console.error('Live acceptance failed: '+error.message);process.exitCode=1;});
}
