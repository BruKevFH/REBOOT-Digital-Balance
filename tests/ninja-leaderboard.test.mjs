import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {once} from 'node:events';
import {createNinjaLeaderboardServer,validateOrigins} from '../server/ninja-leaderboard.mjs';
import {createLeaderboard,validateLeaderboardConfig} from '../notification-ninja/src/leaderboard.js';

const origin='http://127.0.0.1:8000';
class Storage{
  data=new Map();getItem(key){return this.data.get(key)??null;}setItem(key,value){this.data.set(key,String(value));}removeItem(key){this.data.delete(key);}
}
async function fixture(t,options={}){
  const server=createNinjaLeaderboardServer({allowedOrigins:[origin],...options});server.listen(0,'127.0.0.1');await once(server,'listening');
  t.after(()=>server.listening?new Promise(resolve=>server.close(resolve)):undefined);
  const endpoint=`http://127.0.0.1:${server.address().port}`;
  const api=async(route,{token,method='GET',body,originValue=origin,headers:extraHeaders,...rest}={})=>{
    const headers={...(originValue?{Origin:originValue}:{}),...(token?{Authorization:`Bearer ${token.playerId}.${token.token}`} : {}),...(body?{'Content-Type':'application/json'}:{}),...extraHeaders};
    const response=await fetch(`${endpoint}${route}`,{method,headers,...(body?{body:JSON.stringify(body)}:{}),...rest});
    return {status:response.status,headers:response.headers,body:response.status===204?null:await response.json()};
  };
  const create=async(name='Ninja Mira')=>(await api('/v1/players',{method:'POST',body:{username:name}})).body;
  return {server,endpoint,api,create};
}
const run=(score=1000,runId='round-0001')=>({username:'Ninja Mira',runId,mode:'open',difficulty:'normal',score,result:'lives',duration:25,decisions:20});

test('leaderboard accepts only explicit safe origins and endpoint addresses',()=>{
  assert.equal(validateOrigins(['https://brukevfh.github.io',origin]).size,2);
  for(const origins of [[],['*'],['null'],['http://example.com'],['https://example.com/path'],['https://example.com/']])assert.throws(()=>validateOrigins(origins));
  assert.equal(validateLeaderboardConfig({enabled:false,endpoint:'https://example.com'}).ok,false);
  assert.equal(validateLeaderboardConfig({enabled:true,endpoint:'http://127.0.0.1:8082/'}).endpoint,'http://127.0.0.1:8082');
  for(const endpoint of ['javascript:alert(1)','http://example.com','https://u:p@example.com','https://example.com?token=x'])assert.equal(validateLeaderboardConfig({enabled:true,endpoint}).ok,false);
});

test('two independent players share a filtered ranking and each appears once with their best run',async t=>{
  const {api,create}=await fixture(t),first=await create(),second=await create('Ninja Tom');
  assert.equal((await api('/v1/runs',{method:'POST',token:first,body:run(1000)})).status,201);
  assert.equal((await api('/v1/runs',{method:'POST',token:first,body:run(500,'round-0002')})).status,201);
  assert.equal((await api('/v1/runs',{method:'POST',token:second,body:{...run(1500),username:'Ninja Tom'}})).status,201);
  assert.equal((await api('/v1/runs',{method:'POST',token:second,body:{...run(4000,'round-hard'),difficulty:'hard',username:'Ninja Tom'}})).status,201);
  const result=await api('/v1/leaderboard?mode=open&difficulty=normal',{token:first});
  assert.equal(result.status,200);assert.equal(result.body.totalPlayers,2);
  assert.deepEqual(result.body.entries.map(item=>[item.rank,item.username,item.score]),[[1,'Ninja Tom',1500],[2,'Ninja Mira',1000]]);
  assert.equal(result.body.own.rank,2);assert.equal(result.body.entries.some(item=>'token' in item||'token_hash' in item),false);
  assert.equal((await api('/v1/leaderboard?mode=open&difficulty=easy')).body.totalPlayers,0);
  assert.equal((await api('/v1/leaderboard?mode=study&difficulty=normal')).status,400);
});

test('run submission is idempotent and changed payloads cannot reuse a run ID',async t=>{
  const {api,create}=await fixture(t),token=await create();
  assert.equal((await api('/v1/runs',{method:'POST',token,body:run()})).status,201);
  assert.equal((await api('/v1/runs',{method:'POST',token,body:run()})).body.duplicate,true);
  assert.equal((await api('/v1/runs',{method:'POST',token,body:run(2000)})).status,409);
  const result=await api('/v1/leaderboard');assert.equal(result.body.entries.length,1);assert.equal(result.body.entries[0].score,1000);
});

test('deleting a player requires their token and removes only their own runs',async t=>{
  const {api,create}=await fixture(t),first=await create(),second=await create('Ninja Tom');
  await api('/v1/runs',{method:'POST',token:first,body:run()});await api('/v1/runs',{method:'POST',token:second,body:{...run(1500),username:'Ninja Tom'}});
  assert.equal((await api('/v1/player',{method:'DELETE',token:{...first,token:second.token}})).status,401);
  assert.equal((await api('/v1/player',{method:'DELETE',token:first})).body.deleted,true);
  const result=await api('/v1/leaderboard');assert.deepEqual(result.body.entries.map(item=>item.username),['Ninja Tom']);
  assert.equal((await api('/v1/runs',{method:'POST',token:first,body:run(500,'round-0002')})).status,401);
});

test('API rejects invalid scores, non-game modes, malformed names, absent auth and unsafe CORS requests',async t=>{
  const {api,create}=await fixture(t),token=await create();
  for(const patch of [{score:Infinity},{score:-1},{score:20000001},{score:30000,decisions:0},{decisions:900001},{decisions:800,duration:5},{duration:4},{duration:86401},{mode:'training'},{mode:'study'},{result:'complete'},{difficulty:'cheat'},{runId:'../../bad'},{username:'<img src=x>'}]){
    assert.equal((await api('/v1/runs',{method:'POST',token,body:{...run(),...patch}})).status,400,JSON.stringify(patch));
  }
  assert.equal((await api('/v1/runs',{method:'POST',body:run()})).status,401);
  assert.equal((await api('/v1/leaderboard',{originValue:null})).status,403);
  assert.equal((await api('/v1/leaderboard',{originValue:'https://attacker.example'})).status,403);
  const preflight=await api('/v1/runs',{method:'OPTIONS',headers:{'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'content-type,authorization'}});
  assert.equal(preflight.status,204);assert.equal(preflight.headers.get('access-control-allow-origin'),origin);
  assert.equal((await api('/v1/runs',{method:'OPTIONS',headers:{'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'x-other'}})).status,403);
  assert.equal((await api('/v1/leaderboard?limit=1000')).status,400);
});

test('SQLite leaderboard survives server restart without storing plaintext authentication tokens',async t=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'ninja-leaderboard-'));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
  const databasePath=path.join(directory,'ranks.sqlite');
  const first=await fixture(t,{databasePath}),token=await first.create();await first.api('/v1/runs',{method:'POST',token,body:run()});
  await new Promise(resolve=>first.server.close(resolve));
  const second=await fixture(t,{databasePath});const result=await second.api('/v1/leaderboard',{token});
  assert.equal(result.body.entries[0].score,1000);assert.equal(result.body.own.rank,1);
  assert.equal(fs.readFileSync(databasePath).includes(Buffer.from(token.token)),false);
});

function browserFixture(endpoint,storage=new Storage()){
  const calls=[];
  const fetchImpl=async(url,options)=>{
    calls.push(String(url));
    if(url==='./leaderboard-config.json')return new Response(JSON.stringify({enabled:true,endpoint}),{headers:{'Content-Type':'application/json'}});
    return fetch(url,{...options,headers:{...options.headers,Origin:origin}});
  };
  return {client:createLeaderboard({storage,fetchImpl}),calls,storage};
}

test('browser adapter creates identity only after opt-in, shares scores across clients, restores and deletes authenticated entries',async t=>{
  const {endpoint}=await fixture(t),first=browserFixture(endpoint),second=browserFixture(endpoint);
  assert.equal((await first.client.init()).configured,true);assert.equal(first.calls.length,1);
  assert.equal((await first.client.load()).entries.length,0);assert.equal(first.calls.some(url=>url.endsWith('/v1/players')),false);
  assert.equal((await first.client.submit(run())).ok,true);assert.equal((await second.client.submit({...run(2000),username:'Ninja Tom'})).ok,true);
  assert.equal((await first.client.load()).entries.length,2);
  const restored=browserFixture(endpoint,first.storage);assert.equal((await restored.client.load()).own.rank,2);
  assert.equal((await restored.client.deletePlayer()).deleted,true);assert.equal((await second.client.load()).entries.length,1);
  assert.equal(first.storage.data.size,0);
});

test('disabled browser leaderboard returns a clear disconnected state without contacting remote services',async()=>{
  const calls=[],client=createLeaderboard({storage:new Storage(),fetchImpl:async url=>{calls.push(url);return new Response(JSON.stringify({enabled:false,endpoint:''}));}});
  assert.equal((await client.init()).configured,false);assert.equal((await client.load()).ok,false);assert.equal((await client.submit(run())).ok,false);
  assert.deepEqual(await client.deletePlayer(),{ok:true,skipped:true});assert.deepEqual(calls,['./leaderboard-config.json']);
});

test('blocked storage and failed requests never publish a score or lose deletion credentials',async t=>{
  const {endpoint}=await fixture(t);const storage=new Storage();storage.setItem=()=>{throw new Error('denied');};const {client,calls}=browserFixture(endpoint,storage);
  assert.equal((await client.submit(run())).ok,false);assert.equal(calls.some(url=>url.endsWith('/v1/players')),false);
  const good=browserFixture(endpoint);assert.equal((await good.client.submit(run())).ok,true);
  const saved=[...good.storage.data.entries()];
  const offline=createLeaderboard({storage:good.storage,fetchImpl:async()=>{throw new Error('offline');}});
  assert.equal((await offline.deletePlayer()).ok,false);assert.deepEqual([...good.storage.data.entries()],saved);
});

test('public server binding and HTTPS checks require deliberate origin and proxy configuration',async t=>{
  assert.throws(()=>createNinjaLeaderboardServer({requireHTTPS:true,trustProxy:false}));
  const {api}=await fixture(t,{requireHTTPS:true,trustProxy:true});
  assert.equal((await api('/v1/leaderboard')).status,426);
  assert.equal((await api('/v1/leaderboard',{headers:{'X-Forwarded-Proto':'https'}})).status,200);
});

test('concurrent browser loads share initialization and do not publish or miss a pending config',async t=>{
  const {endpoint}=await fixture(t);let configCalls=0;
  const client=createLeaderboard({storage:new Storage(),fetchImpl:async(url,options)=>{
    if(url==='./leaderboard-config.json'){configCalls++;await new Promise(resolve=>setTimeout(resolve,10));return new Response(JSON.stringify({enabled:true,endpoint}));}
    return fetch(url,{...options,headers:{...options.headers,Origin:origin}});
  }});
  const results=await Promise.all([client.init(),client.load(),client.load({difficulty:'hard'})]);
  assert.equal(configCalls,1);assert.equal(results[0].configured,true);assert.equal(results[1].ok,true);assert.equal(results[2].ok,true);
});

test('a free-host database reset permits explicit republication and deletion of an already missing identity',async t=>{
  const first=await fixture(t),browser=browserFixture(first.endpoint);
  assert.equal((await browser.client.submit(run())).ok,true);
  const stale=new Storage();for(const[key,value]of browser.storage.data)stale.setItem(key,value);
  const port=first.server.address().port;await new Promise(resolve=>first.server.close(resolve));
  const fresh=createNinjaLeaderboardServer({allowedOrigins:[origin]});fresh.listen(port,'127.0.0.1');await once(fresh,'listening');
  t.after(()=>new Promise(resolve=>fresh.close(resolve)));
  const restored=browserFixture(first.endpoint,browser.storage);
  assert.equal((await restored.client.load()).totalPlayers,0);
  assert.equal((await restored.client.submit(run(2000,'after-reset-0001'))).ok,true);
  assert.equal((await restored.client.load()).own.score,2000);
  const missing=browserFixture(first.endpoint,stale);
  assert.equal((await missing.client.deletePlayer()).ok,true);assert.equal(stale.data.size,0);
  assert.equal((await restored.client.load()).entries.length,1);
});
