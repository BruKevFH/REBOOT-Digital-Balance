import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {once} from 'node:events';
import {randomUUID} from 'node:crypto';
import {createNinjaServer,createPostgresNinjaServer} from '../server/ninja-service.mjs';
import {NinjaGame} from '../notification-ninja/src/game.js';
import {isThrowReady} from '../notification-ninja/src/throwers.js';

const clone=value=>JSON.parse(JSON.stringify(value));
const password='Temporary acceptance ninja password!';

// Exercise public simulation inputs. Neither submitted scores nor fixture wallet
// grants are used: every saved reward comes from a replayed, server-issued run.
function playOpenRun(issued,clock){
  let logicalTime=issued.startedAt;
  const game=new NinjaGame({storage:null,now:()=>logicalTime,seed:issued.seed,width:800,height:700});
  game.profile=clone(issued.initial.profile);game.state=clone(issued.initial.state);
  const commands=[];
  const call=(method,...args)=>{commands.push([method,clone(args)]);return game[method](...args);};
  call('nextLevel');
  for(let frame=0;frame<12000&&!game.state.ended;frame++){
    if(game.state.scene==='briefing'){call('nextLevel');continue;}
    if(game.state.elapsed<15)for(const item of [...game.state.objects]){
      if(item.kind==='distraction'&&isThrowReady(item))call('swipe',[{x:item.x,y:item.y-12},{x:item.x,y:item.y+12}]);
    }
    if(!game.state.ended){logicalTime+=50;clock.value+=50;call('update',.05);}
  }
  assert.equal(game.state.ended,true);
  assert.equal(game.state.result,'lives');
  assert.ok(game.state.score>0);
  return {commands,score:game.state.score};
}

for(const dialect of ['sqlite','postgres'])test(`${dialect}: two HTTP accounts, verified ranking and rewards survive app restart; test accounts are deleted`,{skip:dialect==='postgres'&&!process.env.TEST_DATABASE_URL},async t=>{
  const directory=await mkdtemp(path.join(os.tmpdir(),'ninja-http-persistence-'));
  const databasePath=path.join(directory,'accounts.sqlite');
  const clock={value:Date.UTC(2026,10,7,12)};
  const schema='http_'+randomUUID().replaceAll('-','');
  let admin,databaseURL,server,endpoint;
  if(dialect==='postgres'){
    const {Pool}=await import('pg');admin=new Pool({connectionString:process.env.TEST_DATABASE_URL});
    await admin.query(`CREATE SCHEMA ${schema}`);
    const url=new URL(process.env.TEST_DATABASE_URL);
    url.searchParams.set('options',`-c search_path=${schema}`);databaseURL=url.href;
  }
  async function stop(){if(server?.listening)await new Promise((resolve,reject)=>server.close(error=>error?reject(error):resolve()));await server?.ninja?.store?.close();}
  t.after(async()=>{await stop();if(admin){await admin.query(`DROP SCHEMA ${schema} CASCADE`);await admin.end();}await rm(directory,{recursive:true,force:true});});
  async function start(){
    const options={now:()=>clock.value,rateLimits:{api:{limit:1000},auth:{limit:100}}};
    server=dialect==='postgres'?await createPostgresNinjaServer({...options,databaseURL}):createNinjaServer({...options,databasePath});
    server.listen(0,'127.0.0.1');await once(server,'listening');endpoint=`http://127.0.0.1:${server.address().port}/api/v3`;
  }
  async function api(route,{method='GET',token,body,status=200}={}){
    const response=await fetch(endpoint+route,{method,headers:{...(token?{Authorization:`Bearer ${token}`} :{}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
    const result=await response.json();assert.equal(response.status,status,`${method} ${route}: ${result.code||'unexpected status'}`);return result;
  }
  await start();
  const accounts=[];
  for(const suffix of ['Alpha','Beta']){
    const username=`Acceptance ${suffix}`;
    const account=await api('/auth/register',{method:'POST',status:201,body:{username,email:`${suffix.toLowerCase()}@example.test`,password,passwordConfirmation:password,privacyAccepted:true}});
    const login=await api('/auth/login',{method:'POST',body:{username,password}});
    const token=login.token;
    await api('/actions',{method:'POST',token,body:{type:'settings.update',payload:{language:suffix==='Alpha'?'en':'de',screenShake:false},idempotencyKey:`settings-${suffix}`}});
    const issued=await api('/runs/start',{method:'POST',token,status:201,body:{kind:'normal',mode:'open',viewport:{width:800,height:700}}});
    const played=playOpenRun(issued,clock);
    const finished=await api(`/runs/${issued.runId}/finish`,{method:'POST',token,body:{commands:played.commands}});
    assert.equal(finished.run.verified,true);assert.equal(finished.run.score,played.score);
    const duplicate=await api(`/runs/${issued.runId}/finish`,{method:'POST',token,body:{commands:played.commands}});
    assert.equal(duplicate.profile.coins,finished.profile.coins);assert.equal(duplicate.replayed,true);
    await api(`/runs/${issued.runId}/publish`,{method:'POST',token});
    const state=await api('/me',{token});
    assert.ok(state.profile.totalRuns>0);assert.ok(state.profile.unlockedSkins.includes('default'));
    accounts.push({...account,token,state});
  }
  const board=await api('/leaderboard');assert.equal(board.total,2);
  assert.deepEqual(new Set(board.entries.map(entry=>entry.username)),new Set(accounts.map(account=>account.user.username)));
  assert.ok(board.entries.every(entry=>!('email' in entry)&&!('userId' in entry)));
  await stop();await start();
  for(const account of accounts){
    const state=await api('/me',{token:account.token});assert.deepEqual(state.profile,account.state.profile);
    const login=await api('/auth/login',{method:'POST',body:{username:account.user.username,password}});assert.equal(login.user.id,account.user.id);
  }
  assert.deepEqual((await api('/leaderboard')).entries,board.entries);
  for(const account of accounts){
    await api('/account',{method:'DELETE',token:account.token,body:{password}});
    await api('/me',{token:account.token,status:401});
    await api('/auth/login',{method:'POST',status:401,body:{username:account.user.username,password}});
  }
  assert.equal((await api('/leaderboard')).total,0);
});
