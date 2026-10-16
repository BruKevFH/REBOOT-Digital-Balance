import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {once} from 'node:events';
import {createHash} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
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
const run=(score=1000,runId='round-0001')=>({username:'Ninja Mira',runId,mode:'open',difficulty:'normal',ruleset:'open-v2',score,result:'lives',duration:25,decisions:20});

test('leaderboard accepts only explicit safe origins and endpoint addresses',()=>{
  assert.equal(validateOrigins(['https://brukevfh.github.io',origin]).size,2);
  for(const origins of [[],['*'],['null'],['http://example.com'],['https://example.com/path'],['https://example.com/']])assert.throws(()=>validateOrigins(origins));
  assert.equal(validateLeaderboardConfig({enabled:false,endpoint:'https://example.com'}).ok,false);
  assert.equal(validateLeaderboardConfig({enabled:true,endpoint:'http://127.0.0.1:8082/'}).endpoint,'http://127.0.0.1:8082');
  for(const endpoint of ['javascript:alert(1)','http://example.com','https://u:p@example.com','https://example.com?token=x'])assert.equal(validateLeaderboardConfig({enabled:true,endpoint}).ok,false);
});

test('two independent players share one three-heart ranking and each appears once with their best run',async t=>{
  const {api,create}=await fixture(t),first=await create(),second=await create('Ninja Tom');
  assert.equal((await api('/v2/runs',{method:'POST',token:first,body:run(1000)})).status,201);
  assert.equal((await api('/v2/runs',{method:'POST',token:first,body:run(500,'round-0002')})).status,201);
  assert.equal((await api('/v2/runs',{method:'POST',token:second,body:{...run(1500),username:'Ninja Tom'}})).status,201);
  assert.equal((await api('/v2/runs',{method:'POST',token:second,body:{...run(4000,'round-hard'),difficulty:'hard',username:'Ninja Tom'}})).status,400);
  const result=await api('/v2/leaderboard?mode=open&difficulty=normal',{token:first});
  assert.equal(result.status,200);assert.equal(result.body.ruleset,'open-v2');assert.equal(result.body.difficulty,'normal');assert.equal(result.body.totalPlayers,2);
  assert.deepEqual(result.body.entries.map(item=>[item.rank,item.username,item.score]),[[1,'Ninja Tom',1500],[2,'Ninja Mira',1000]]);
  assert.equal(result.body.own.rank,2);assert.equal(result.body.entries.some(item=>'token' in item||'token_hash' in item),false);
  assert.equal((await api('/v2/leaderboard?mode=open&difficulty=easy')).status,400);
  assert.equal((await api('/v2/leaderboard?mode=open&difficulty=hard')).status,400);
  assert.equal((await api('/v2/leaderboard?ruleset=legacy')).status,400);
  assert.equal((await api('/v2/leaderboard?mode=study&difficulty=normal')).status,400);
});

test('run submission is idempotent and changed payloads cannot reuse a run ID',async t=>{
  const {api,create}=await fixture(t),token=await create();
  assert.equal((await api('/v2/runs',{method:'POST',token,body:run()})).status,201);
  assert.equal((await api('/v2/runs',{method:'POST',token,body:run()})).body.duplicate,true);
  assert.equal((await api('/v2/runs',{method:'POST',token,body:run(2000)})).status,409);
  const result=await api('/v2/leaderboard');assert.equal(result.body.entries.length,1);assert.equal(result.body.entries[0].score,1000);
});

test('deleting a player requires their token and removes only their own runs',async t=>{
  const {api,create}=await fixture(t),first=await create(),second=await create('Ninja Tom');
  await api('/v2/runs',{method:'POST',token:first,body:run()});await api('/v2/runs',{method:'POST',token:second,body:{...run(1500),username:'Ninja Tom'}});
  assert.equal((await api('/v1/player',{method:'DELETE',token:{...first,token:second.token}})).status,401);
  assert.equal((await api('/v1/player',{method:'DELETE',token:first})).body.deleted,true);
  const result=await api('/v2/leaderboard');assert.deepEqual(result.body.entries.map(item=>item.username),['Ninja Tom']);
  assert.equal((await api('/v2/runs',{method:'POST',token:first,body:run(500,'round-0002')})).status,401);
});

test('API rejects invalid scores, non-game modes, malformed names, absent auth and unsafe CORS requests',async t=>{
  const {api,create}=await fixture(t),token=await create();
  for(const patch of [{score:Infinity},{score:-1},{score:20000001},{score:30000,decisions:0},{decisions:900001},{decisions:800,duration:5},{duration:4},{duration:86401},{mode:'training'},{mode:'study'},{result:'complete'},{difficulty:'cheat'},{difficulty:'easy'},{difficulty:'hard'},{ruleset:'legacy'},{ruleset:'open-v1'},{ruleset:null},{ruleset:undefined},{runId:'../../bad'},{username:'<img src=x>'}]){
    assert.equal((await api('/v2/runs',{method:'POST',token,body:{...run(),...patch}})).status,400,JSON.stringify(patch));
  }
  assert.equal((await api('/v2/runs',{method:'POST',body:run()})).status,401);
  assert.equal((await api('/v2/leaderboard',{originValue:null})).status,403);
  assert.equal((await api('/v2/leaderboard',{originValue:'https://attacker.example'})).status,403);
  const preflight=await api('/v2/runs',{method:'OPTIONS',headers:{'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'content-type,authorization'}});
  assert.equal(preflight.status,204);assert.equal(preflight.headers.get('access-control-allow-origin'),origin);
  assert.equal((await api('/v2/runs',{method:'OPTIONS',headers:{'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'x-other'}})).status,403);
  assert.equal((await api('/v2/leaderboard?limit=1000')).status,400);
});

test('SQLite leaderboard survives server restart without storing plaintext authentication tokens',async t=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'ninja-leaderboard-'));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
  const databasePath=path.join(directory,'ranks.sqlite');
  const first=await fixture(t,{databasePath}),token=await first.create();await first.api('/v2/runs',{method:'POST',token,body:run()});
  await new Promise(resolve=>first.server.close(resolve));
  const second=await fixture(t,{databasePath});const result=await second.api('/v2/leaderboard',{token});
  assert.equal(result.body.entries[0].score,1000);assert.equal(result.body.own.rank,1);
  assert.equal(fs.readFileSync(databasePath).includes(Buffer.from(token.token)),false);
});

test('existing SQLite databases retain every legacy score and identity without mixing them into the new ranking',async t=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'ninja-legacy-ranks-'));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
  const databasePath=path.join(directory,'ranks.sqlite');
  const token={playerId:'12345678-1234-1234-1234-123456789abc',token:'x'.repeat(43)};
  const oldDB=new DatabaseSync(databasePath);
  oldDB.exec(`PRAGMA foreign_keys=ON;
    CREATE TABLE ninja_players(id TEXT PRIMARY KEY,token_hash TEXT NOT NULL,name TEXT NOT NULL,created_at INTEGER NOT NULL);
    CREATE TABLE ninja_runs(player_id TEXT NOT NULL REFERENCES ninja_players(id) ON DELETE CASCADE,run_id TEXT NOT NULL,mode TEXT NOT NULL,difficulty TEXT NOT NULL,score INTEGER NOT NULL,duration REAL NOT NULL,decisions INTEGER NOT NULL,submitted_at INTEGER NOT NULL,PRIMARY KEY(player_id,run_id));
    CREATE INDEX ninja_ranks ON ninja_runs(mode,difficulty,score DESC);`);
  oldDB.prepare('INSERT INTO ninja_players VALUES(?,?,?,?)').run(token.playerId,createHash('sha256').update(token.token).digest('hex'),'Ninja Mira',100);
  for(const difficulty of ['easy','normal','hard'])oldDB.prepare('INSERT INTO ninja_runs VALUES(?,?,?,?,?,?,?,?)').run(token.playerId,`legacy-${difficulty}`, 'open',difficulty,19000,100,80,200);
  const originalRows=oldDB.prepare('SELECT * FROM ninja_runs ORDER BY run_id').all().map(row=>({...row}));oldDB.close();

  const first=await fixture(t,{databasePath});
  const empty=await first.api('/v2/leaderboard',{token});assert.equal(empty.status,200);assert.equal(empty.body.totalPlayers,0);assert.equal(empty.body.own,null);
  assert.equal((await first.api('/v1/leaderboard',{token})).body.totalPlayers,0,'older URLs must also exclude old rules');
  assert.equal((await first.api('/v2/runs',{method:'POST',token,body:{...run(19000,'legacy-normal'),duration:100,decisions:80}})).status,409,'an old run ID cannot relabel an existing result');
  assert.equal((await first.api('/v1/runs',{method:'POST',token,body:{...run(1000,'stale-client-1'),ruleset:undefined}})).status,400,'cached old clients cannot submit four-heart scores');
  assert.equal((await first.api('/v2/runs',{method:'POST',token,body:run(1000,'new-rules-001')})).status,201,'existing credentials remain valid');
  const ranked=await first.api('/v2/leaderboard',{token});assert.equal(ranked.body.totalPlayers,1);assert.equal(ranked.body.own.score,1000);
  await new Promise(resolve=>first.server.close(resolve));

  const saved=new DatabaseSync(databasePath);
  const migrated=saved.prepare("SELECT * FROM ninja_runs WHERE ruleset='legacy' ORDER BY run_id").all();
  assert.equal(migrated.length,3);
  assert.deepEqual(migrated.map(({ruleset,...row})=>row),originalRows);
  assert.equal(saved.prepare('SELECT COUNT(*) AS count FROM ninja_players').get().count,1);
  assert.equal(saved.prepare("SELECT COUNT(*) AS count FROM ninja_runs WHERE ruleset='open-v2'").get().count,1);
  saved.close();
  const restarted=await fixture(t,{databasePath});assert.equal((await restarted.api('/v2/leaderboard',{token})).body.own.score,1000,'migration is repeatable on restart');
  assert.equal((await restarted.api('/v1/player',{method:'DELETE',token})).body.deleted,true,'old credentials still remove all of their records');
  await new Promise(resolve=>restarted.server.close(resolve));
  const deleted=new DatabaseSync(databasePath);assert.equal(deleted.prepare('SELECT COUNT(*) AS count FROM ninja_runs').get().count,0);deleted.close();
});

function browserFixture(endpoint,storage=new Storage(),{closeConnections=false}={}){
  const calls=[];
  const fetchImpl=async(url,options)=>{
    calls.push(String(url));
    if(url==='./leaderboard-config.json')return new Response(JSON.stringify({enabled:true,endpoint}),{headers:{'Content-Type':'application/json'}});
    return fetch(url,{...options,headers:{...options.headers,Origin:origin,...(closeConnections?{Connection:'close'}:{})}});
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

test('browser adapter fixes the single ruleset and refuses old saves before creating an online identity',async t=>{
  const {endpoint}=await fixture(t),browser=browserFixture(endpoint);
  const loaded=await browser.client.load({mode:'study',difficulty:'hard',ruleset:'legacy'});
  assert.equal(loaded.ok,true);assert.equal(loaded.ruleset,'open-v2');assert.equal(loaded.difficulty,'normal');
  const query=new URL(browser.calls.at(-1));assert.equal(query.pathname,'/v2/leaderboard');assert.equal(query.searchParams.get('ruleset'),'open-v2');assert.equal(query.searchParams.get('mode'),'open');assert.equal(query.searchParams.get('difficulty'),'normal');
  for(const patch of [{ruleset:'legacy'},{ruleset:undefined},{difficulty:'hard'},{mode:'training'},{result:'complete'}])assert.equal((await browser.client.submit({...run(),...patch})).ok,false);
  assert.equal(browser.calls.some(url=>url.endsWith('/v1/players')||url.endsWith('/v2/runs')),false);
  assert.equal(browser.storage.data.size,0);
});

test('browser never displays scores from a server that omits the current ruleset',async()=>{
  const client=createLeaderboard({storage:new Storage(),fetchImpl:async url=>new Response(JSON.stringify(url==='./leaderboard-config.json'?{enabled:true,endpoint:'https://example.com'}:{ok:true,entries:[{score:999999}],totalPlayers:1}))});
  const result=await client.load();assert.equal(result.ok,false);assert.equal('entries' in result,false);assert.equal(client.getStatus().online,false);
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
  assert.equal((await api('/v2/leaderboard')).status,426);
  assert.equal((await api('/v2/leaderboard',{headers:{'X-Forwarded-Proto':'https'}})).status,200);
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
  // A new server process must receive a new connection, rather than a pooled
  // Undici socket whose close notification can race the same-port restart.
  const transport={closeConnections:true};
  const first=await fixture(t),browser=browserFixture(first.endpoint,new Storage(),transport);
  assert.equal((await browser.client.submit(run())).ok,true);
  const stale=new Storage();for(const[key,value]of browser.storage.data)stale.setItem(key,value);
  const port=first.server.address().port;await new Promise(resolve=>first.server.close(resolve));
  const fresh=createNinjaLeaderboardServer({allowedOrigins:[origin]});fresh.listen(port,'127.0.0.1');await once(fresh,'listening');
  t.after(()=>new Promise(resolve=>fresh.close(resolve)));
  const restored=browserFixture(first.endpoint,browser.storage,transport);
  const empty=await restored.client.load();assert.equal(empty.ok,true,empty.reason);assert.equal(empty.totalPlayers,0);
  assert.equal((await restored.client.submit(run(2000,'after-reset-0001'))).ok,true);
  assert.equal((await restored.client.load()).own.score,2000);
  const missing=browserFixture(first.endpoint,stale,transport);
  assert.equal((await missing.client.deletePlayer()).ok,true);assert.equal(stale.data.size,0);
  assert.equal((await restored.client.load()).entries.length,1);
});
