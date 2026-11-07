import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {once} from 'node:events';
import {createNinjaServer,validateNinjaOrigins} from '../server/ninja-service.mjs';
import {NinjaGame} from '../notification-ninja/src/game.js';

const password='A strong HTTP Ninja password';
const allowed='https://allowed.example';
async function fixture(t,options={}){
  let stamp=1700000000000;
  const server=createNinjaServer({allowedOrigins:[allowed],now:()=>stamp,...options});server.listen(0,'127.0.0.1');await once(server,'listening');
  const endpoint=`http://127.0.0.1:${server.address().port}`;
  const close=()=>server.listening?new Promise(resolve=>server.close(resolve)):Promise.resolve();t.after(close);
  async function api(route,{method='GET',token,body,headers={},origin=allowed,...rest}={}){
    const response=await fetch(`${endpoint}/api/v3${route}`,{method,headers:{...(origin?{Origin:origin}:{}),...(token?{Authorization:`Bearer ${token}`} :{}),...(body!==undefined?{'Content-Type':'application/json'}:{}),...headers},...(body!==undefined?{body:JSON.stringify(body)}:{}),...rest});
    return {status:response.status,headers:response.headers,body:response.status===204?null:await response.json()};
  }
  const register=async(username='Ninja Mira')=>{const result=await api('/auth/register',{method:'POST',body:{username,password,email:username.toLowerCase().replaceAll(' ','')+'@example.test',passwordConfirmation:password,privacyAccepted:true}});assert.equal(result.status,201);return result.body;};
  return {server,endpoint,api,register,close,tick:ms=>stamp+=ms};
}
const rawRequest=(endpoint,{method='GET',route='/api/v3/health',headers={},body,chunks}={})=>new Promise((resolve,reject)=>{
  const url=new URL(endpoint),request=http.request({hostname:url.hostname,port:url.port,method,path:route,headers},response=>{
    const chunks=[];response.on('data',chunk=>chunks.push(chunk));response.on('end',()=>resolve({status:response.statusCode,headers:response.headers,text:Buffer.concat(chunks).toString('utf8')}));
  });request.on('error',reject);if(chunks)for(const chunk of chunks)request.write(chunk);request.end(body);
});

test('v3 health/config and static client are served without disclosing storage paths or secrets',async t=>{
  const {api,endpoint}=await fixture(t),health=await api('/health');
  assert.equal(health.status,200);assert.deepEqual(health.body,{ok:true,service:'notification-ninja',apiVersion:3,ruleset:'open-v2',durableStorage:false});
  const configResponse=await fetch(`${endpoint}/notification-ninja/accounts-config.json`),config=await configResponse.json();
  assert.equal(configResponse.status,200);assert.equal(config.enabled,true);assert.equal(config.endpoint,`${endpoint}/api/v3`);assert.equal(config.apiVersion,3);
  const redirect=await fetch(endpoint,{redirect:'manual'});assert.equal(redirect.status,302);assert.equal(redirect.headers.get('location'),'/notification-ninja/home.html');
  const home=await fetch(`${endpoint}/notification-ninja/home.html`);assert.equal(home.status,200);assert.match(await home.text(),/Notification Ninja/i);
  assert.match(home.headers.get('content-type'),/text\/html/);assert.equal(home.headers.get('x-content-type-options'),'nosniff');assert.equal(home.headers.get('x-frame-options'),'DENY');assert.match(home.headers.get('content-security-policy'),/object-src 'none'/);
  const head=await fetch(`${endpoint}/notification-ninja/styles.css`,{method:'HEAD'});assert.equal(head.status,200);assert.ok(Number(head.headers.get('content-length'))>0);assert.equal(await head.text(),'');
});

test('HTTP registration/login/me use bearer-only sessions, ignore cookies and reject missing or forged tokens',async t=>{
  const {api}=await fixture(t),account=await (async()=>{const result=await api('/auth/register',{method:'POST',body:{username:'Ninja Mira',password,email:'mira@example.test',passwordConfirmation:password,privacyAccepted:true}});assert.equal(result.status,201);assert.equal(result.headers.get('set-cookie'),null);return result.body;})();
  const me=await api('/me',{token:account.token});assert.equal(me.status,200);assert.equal(me.body.user.username,'Ninja Mira');assert.equal(me.body.profile.coins,0);
  for(const headers of [{},{Cookie:`session=${account.token}`},{Authorization:'Bearer forged'},{Authorization:'Basic anything'}]){
    const response=await api('/me',{headers});assert.equal(response.status,401);assert.equal(response.body.code,'UNAUTHENTICATED');
  }
  const login=await api('/auth/login',{method:'POST',body:{username:'ninja mira',password}});assert.equal(login.status,200);assert.equal('recoveryKey' in login.body,false);
  assert.equal((await api('/me',{token:login.body.token,origin:null})).status,200,'CLI bearer requests do not need an Origin');
  assert.equal((await api('/auth/logout',{method:'POST',token:account.token})).status,200);assert.equal((await api('/me',{token:account.token})).status,401);
  assert.equal((await api('/me',{token:login.body.token})).status,200);
});

test('CORS allows only exact origins and supported preflights; cross-site cookies cannot mutate accounts',async t=>{
  const {api,endpoint,register}=await fixture(t),account=await register();
  const denied=await api('/profile',{method:'PATCH',token:account.token,origin:'https://attacker.example',body:{username:'Stolen Ninja'}});assert.equal(denied.status,403);assert.equal(denied.headers.get('access-control-allow-origin'),null);
  assert.equal((await api('/profile',{method:'PATCH',headers:{Cookie:`session=${account.token}`},body:{username:'Stolen Ninja'}})).status,401);
  const same=await api('/me',{token:account.token,origin:endpoint});assert.equal(same.status,200);assert.equal(same.headers.get('access-control-allow-origin'),endpoint);
  const preflight=await api('/actions',{method:'OPTIONS',headers:{'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'Authorization, Content-Type'}});
  assert.equal(preflight.status,204);assert.equal(preflight.headers.get('access-control-allow-origin'),allowed);assert.equal(preflight.headers.get('access-control-allow-credentials'),null);
  for(const headers of [{'Access-Control-Request-Method':'PUT'},{'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'x-dangerous'},{'Access-Control-Request-Headers':'Authorization'}])assert.equal((await api('/actions',{method:'OPTIONS',headers})).status,403);
  assert.equal((await api('/actions',{method:'OPTIONS',origin:null})).status,400);
  assert.equal((await api('/me',{token:account.token})).body.user.username,'Ninja Mira');
});

test('two accounts cannot read, finish, publish, rename or delete each other through client-supplied IDs',async t=>{
  const {api,register}=await fixture(t),first=await register(),second=await register('Ninja Tom');
  const started=await api('/runs/start',{method:'POST',token:first.token,body:{kind:'quick',context:'study',viewport:{width:1000,height:700}}});assert.equal(started.status,201);
  const runId=started.body.runId;
  for(const route of [`/runs/${runId}/finish`,`/runs/${runId}/publish`])assert.equal((await api(route,{method:'POST',token:second.token,body:{commands:[['finishRound',[]]]}})).status,404);
  const renamed=await api('/profile',{method:'PATCH',token:first.token,body:{username:'Ninja Luna',userId:second.user.id}});assert.equal(renamed.status,200);assert.equal(renamed.body.user.id,first.user.id);
  assert.equal((await api('/me',{token:second.token})).body.user.username,'Ninja Tom');
  const deleted=await api('/account',{method:'DELETE',token:first.token,body:{password,userId:second.user.id}});assert.equal(deleted.status,200);
  assert.equal((await api('/me',{token:first.token})).status,401);assert.equal((await api('/me',{token:second.token})).status,200);
});

test('HTTP recovery revokes existing sessions and confirmed account deletion removes persisted data',async t=>{
  const {api,register}=await fixture(t),account=await register();
  const reset=await api('/auth/reset',{method:'POST',body:{username:'Ninja Mira',recoveryKey:account.recoveryKey,password:'Replacement Ninja password'}});assert.equal(reset.status,200);assert.notEqual(reset.body.recoveryKey,account.recoveryKey);
  assert.equal((await api('/me',{token:account.token})).status,401);
  assert.equal((await api('/account',{method:'DELETE',token:reset.body.token,body:{password}})).status,403);
  assert.equal((await api('/me',{token:reset.body.token})).status,200);
  assert.equal((await api('/account',{method:'DELETE',token:reset.body.token,body:{password:'Replacement Ninja password'}})).status,200);
  assert.equal((await api('/auth/login',{method:'POST',body:{username:'Ninja Mira',password:'Replacement Ninja password'}})).status,401);
});

test('HTTP JSON validation, request-size caps and encodings fail cleanly without private diagnostics',async t=>{
  const logged=[],{endpoint,register,api}=await fixture(t,{logError:event=>logged.push(event)}),account=await register();
  for(const text of ['{','null','[]','42','"string"']){
    const response=await rawRequest(endpoint,{method:'POST',route:'/api/v3/auth/login',headers:{'Content-Type':'application/json'},body:text});assert.equal(response.status,400);assert.equal(JSON.parse(response.text).code,'INVALID_JSON');
  }
  const noType=await rawRequest(endpoint,{method:'POST',route:'/api/v3/auth/login',body:'{}'});assert.equal(noType.status,415);
  const encoding=await rawRequest(endpoint,{method:'POST',route:'/api/v3/auth/login',headers:{'Content-Type':'application/json','Content-Encoding':'gzip'},body:'{}'});assert.equal(encoding.status,415);
  const large=await rawRequest(endpoint,{method:'POST',route:'/api/v3/auth/login',headers:{'Content-Type':'application/json'},body:JSON.stringify({padding:'x'.repeat(32769)})});assert.equal(large.status,413);
  const started=await api('/runs/start',{method:'POST',token:account.token,body:{kind:'quick',context:'study',viewport:{width:1000,height:700}}});
  const log=await rawRequest(endpoint,{method:'POST',route:`/api/v3/runs/${started.body.runId}/finish`,headers:{'Content-Type':'application/json',Authorization:`Bearer ${account.token}`},body:JSON.stringify({commands:[],padding:'x'.repeat(2*1024*1024)})});assert.equal(log.status,413);
  assert.deepEqual(logged,[]);assert.equal((await api('/me',{token:account.token})).status,200);
});

test('rate limits apply to repeated authentication and reset traffic and recover after their window',async t=>{
  const {api,tick}=await fixture(t,{rateLimits:{auth:{limit:2,window:1000},reset:{limit:1,window:1000}}});
  for(let i=0;i<2;i++)assert.equal((await api('/auth/login',{method:'POST',body:{username:'Unknown Ninja',password},headers:{'X-Forwarded-For':`198.51.100.${i+1}`}})).status,401);
  const limited=await api('/auth/login',{method:'POST',body:{username:'Unknown Ninja',password},headers:{'X-Forwarded-For':'203.0.113.1'}});assert.equal(limited.status,429);assert.equal(limited.headers.get('retry-after'),'1');
  assert.equal((await api('/auth/reset',{method:'POST',body:{username:'Unknown Ninja',password,recoveryKey:'bad'}})).status,401);
  assert.equal((await api('/auth/reset',{method:'POST',body:{username:'Unknown Ninja',password,recoveryKey:'bad'}})).status,429);
  tick(1000);assert.equal((await api('/auth/login',{method:'POST',body:{username:'Unknown Ninja',password}})).status,401);
  assert.equal((await api('/health')).status,200);
});

test('streamed JSON bodies have the same size cap when Content-Length is absent',async t=>{
  const {endpoint}=await fixture(t),prefix='{"padding":"',suffix='"}';
  const streamed=await rawRequest(endpoint,{method:'POST',route:'/api/v3/auth/login',headers:{'Content-Type':'application/json'},chunks:[prefix,'x'.repeat(20000),'x'.repeat(20000),suffix]});
  assert.equal(streamed.status,413);assert.equal(JSON.parse(streamed.text).code,'REQUEST_TOO_LARGE');
  const small=await rawRequest(endpoint,{method:'POST',route:'/api/v3/auth/login',headers:{'Content-Type':'application/json'},chunks:['{"username":"Unknown Ninja",','"password":"A wrong Ninja password"}']});assert.equal(small.status,401);
});

test('a controlled proxy isolates client rate limits using its appended address and ignores attacker prefixes',async t=>{
  const {api}=await fixture(t,{trustProxy:true,rateLimits:{auth:{limit:1,window:60000}}});
  const login=forwarded=>api('/auth/login',{method:'POST',body:{username:'Unknown Ninja',password},headers:{'X-Forwarded-For':forwarded}});
  assert.equal((await login('198.51.100.9, 203.0.113.10')).status,401);
  assert.equal((await login('198.51.100.99, 203.0.113.10')).status,429,'a different untrusted prefix does not create a fresh bucket');
  assert.equal((await login('203.0.113.11')).status,401,'another actual client keeps its own bucket');
  assert.equal((await login('not-an-address')).status,401,'invalid forwarded addresses fall back to the socket peer');
  assert.equal((await login('another-invalid-value')).status,429);
});

test('full rate-limit storage expires old client buckets so new clients can recover without restarting',async t=>{
  const {api,tick}=await fixture(t,{trustProxy:true,maxRateBuckets:2,rateLimits:{api:{limit:2,window:1000}}});
  const request=ip=>api('/missing',{headers:{'X-Forwarded-For':ip}});
  assert.equal((await request('203.0.113.1')).status,401);
  assert.equal((await request('203.0.113.2')).status,401);
  const full=await request('203.0.113.3');assert.equal(full.status,429);assert.equal(full.body.code,'RATE_LIMIT');
  assert.equal((await request('203.0.113.1')).status,401,'existing clients retain their own still-available quota');
  tick(1000);
  assert.equal((await request('203.0.113.3')).status,401,'expired buckets at the exact capacity are reclaimed');
  assert.equal((await request('203.0.113.4')).status,401);
});

test('general API and run-finish limits are enforced independently of successful authentication',async t=>{
  const limited=await fixture(t,{rateLimits:{api:{limit:3,window:1000}}}),account=await limited.register();
  assert.equal((await limited.api('/me',{token:account.token})).status,200);assert.equal((await limited.api('/me',{token:account.token})).status,200);assert.equal((await limited.api('/me',{token:account.token})).status,429);
  limited.tick(1000);assert.equal((await limited.api('/me',{token:account.token})).status,200);
  const finishLimited=await fixture(t,{rateLimits:{finish:{limit:1,window:1000}}}),second=await finishLimited.register();
  const run=await finishLimited.api('/runs/start',{method:'POST',token:second.token,body:{kind:'quick',context:'study',viewport:{width:1000,height:700}}}),route=`/runs/${run.body.runId}/finish`;
  assert.equal((await finishLimited.api(route,{method:'POST',token:second.token,body:{commands:[['finishRound',[]]]}})).status,200);
  assert.equal((await finishLimited.api(route,{method:'POST',token:second.token,body:{commands:[['finishRound',[]]]}})).status,429);
});

test('production proxy requires HTTPS and returns HSTS and an HTTPS account endpoint',async t=>{
  const directory=fs.mkdtempSync(path.join(process.cwd(),'.ninja-tls-test-'));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
  const {api,endpoint}=await fixture(t,{databasePath:path.join(directory,'accounts.sqlite'),requireHTTPS:true,trustProxy:true,durableStorage:true});
  assert.equal((await api('/health')).status,426);
  const health=await api('/health',{headers:{'X-Forwarded-Proto':'https'}});assert.equal(health.status,200);assert.equal(health.headers.get('strict-transport-security'),'max-age=31536000');
  const config=await fetch(`${endpoint}/notification-ninja/accounts-config.json`,{headers:{'X-Forwarded-Proto':'https'}});assert.equal(config.status,200);assert.equal((await config.json()).endpoint,`${endpoint.replace('http:','https:')}/api/v3`);
});

test('unexpected service failures return a neutral error and logs contain no sensitive details',async t=>{
  const events=[],{api,register,server}=await fixture(t,{logError:event=>events.push(event)}),account=await register();
  server.ninja.game.getState=()=>{throw new Error(`private /disk/sqlite token=${account.token} password=${password}`);};
  const failed=await api('/me',{token:account.token});assert.equal(failed.status,500);assert.equal(failed.body.code,'INTERNAL_ERROR');
  for(const secret of ['/disk/sqlite',account.token,password])assert.equal(JSON.stringify([events,failed.body]).includes(secret),false);
  assert.deepEqual(events,[{event:'request_failed',code:'INTERNAL_ERROR'}]);
});

test('static traversal, hidden files, source files, external symlinks and malformed Host are rejected',async t=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'ninja-static-'));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
  const webRoot=path.join(directory,'public');fs.mkdirSync(webRoot);fs.writeFileSync(path.join(webRoot,'home.html'),'<h1>Notification Ninja</h1>');fs.writeFileSync(path.join(directory,'secret.txt'),'private file');fs.symlinkSync(path.join(directory,'secret.txt'),path.join(webRoot,'leak.txt'));
  const {endpoint}=await fixture(t,{webRoot});
  for(const route of ['/notification-ninja/%2e%2e%2fsecret.txt','/notification-ninja/.env','/notification-ninja/src/game.js','/notification-ninja/leak.txt','/server/ninja-auth.mjs','/notification-ninja/%00secret']){
    const result=await rawRequest(endpoint,{route});assert.equal(result.status,404,route);assert.equal(result.text.includes('private file'),false);
  }
  assert.equal((await rawRequest(endpoint,{route:'/notification-ninja/%zz'})).status,400);
  for(const host of ['user@example.com','example.com?bad','example.com#bad','example.com:99999','example.com/path'])assert.equal((await rawRequest(endpoint,{headers:{Host:host}})).status,400,host);
  assert.equal((await rawRequest(endpoint,{route:'https://attacker.example/api/v3/health'})).status,400);
  assert.equal((await rawRequest(endpoint,{method:'POST',route:'/notification-ninja/home.html'})).status,405);
});

test('account preferences and safe guest import persist through an actual HTTP server restart',async t=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'ninja-http-restart-'));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
  const databasePath=path.join(directory,'accounts.sqlite'),first=await fixture(t,{databasePath}),account=await first.register();
  const action=await first.api('/actions',{method:'POST',token:account.token,body:{type:'guest.import',idempotencyKey:'import-first-001',payload:{tutorialCompleted:true,settings:{language:'en',musicVolume:.2},coins:999999,xp:99999,unlockedSkins:['neon']}}});assert.equal(action.status,200);assert.equal(action.body.profile.coins,0);assert.equal(action.body.profile.unlockedSkins.includes('neon'),false);
  const retry=await first.api('/actions',{method:'POST',token:account.token,body:{type:'guest.import',idempotencyKey:'import-first-001',payload:{tutorialCompleted:true,settings:{language:'en',musicVolume:.2},coins:999999,xp:99999,unlockedSkins:['neon']}}});assert.equal(retry.status,200);assert.equal(retry.body.replayed,true);
  await first.close();const second=await fixture(t,{databasePath});
  const me=await second.api('/me',{token:account.token});assert.equal(me.status,200);assert.equal(me.body.profile.settings.language,'en');assert.equal(me.body.profile.settings.musicVolume,.2);assert.equal(me.body.profile.tutorialCompleted,true);assert.equal(me.body.profile.coins,0);
  assert.equal((await second.api('/health')).body.durableStorage,true);
  const noSecondImport=await second.api('/actions',{method:'POST',token:account.token,body:{type:'guest.import',idempotencyKey:'import-second-002',payload:{settings:{language:'de'},coins:100000}}});assert.equal(noSecondImport.status,200);assert.equal(noSecondImport.body.action.alreadyImported,true);assert.equal(noSecondImport.body.profile.settings.language,'en');
});

function losingOpenLog(started){
  const game=new NinjaGame({storage:null,seed:started.seed,width:started.initial.width,height:started.initial.height});game.profile=structuredClone(started.initial.profile);game.state=structuredClone(started.initial.state);
  const commands=[],call=(name,args=[])=>{commands.push([name,args]);game[name](...args);};call('nextLevel');
  for(let i=0;i<2400&&!game.state.ended;i++){
    call('update',[.05]);
    for(const object of [...game.state.objects]){
      if(game.state.ended)break;
      if(object.age<.5||object.kind==='powerup'||object.kind==='useful'&&game.state.score===0)continue;
      call('swipe',[[{x:object.x-object.radius*.8,y:object.y},{x:object.x+object.radius*.8,y:object.y}]]);
    }
  }
  assert.equal(game.state.ended,true);assert.equal(game.state.result,'lives');assert.ok(game.state.score>0);return {commands,elapsed:game.state.elapsed};
}

test('HTTP seeded replay creates a verified score only after explicit publish; two players share it across restart',async t=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'ninja-http-ranked-'));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
  const databasePath=path.join(directory,'accounts.sqlite'),first=await fixture(t,{databasePath}),mira=await first.register(),tom=await first.register('Ninja Tom');
  for(const player of [mira,tom]){
    const started=await first.api('/runs/start',{method:'POST',token:player.token,body:{kind:'normal',mode:'open',viewport:{width:1000,height:700}}});assert.equal(started.status,201);assert.equal(started.body.initial.state.maxLives,3);
    const simulated=losingOpenLog(started.body);first.tick(Math.ceil(simulated.elapsed*1000));
    const finish=await first.api(`/runs/${started.body.runId}/finish`,{method:'POST',token:player.token,body:{commands:simulated.commands}});assert.equal(finish.status,200,JSON.stringify(finish.body));assert.equal(finish.body.run.verified,true);assert.equal(finish.body.run.published,false);
    const before=await first.api('/leaderboard');assert.equal(before.body.entries.some(row=>row.username===player.user.username),false);
    const published=await first.api(`/runs/${started.body.runId}/publish`,{method:'POST',token:player.token});assert.equal(published.status,200);assert.equal(published.body.run.published,true);
    assert.equal((await first.api(`/runs/${started.body.runId}/publish`,{method:'POST',token:player.token})).status,200);
  }
  const leaderboard=await first.api('/leaderboard',{token:mira.token});assert.equal(leaderboard.status,200);assert.equal(leaderboard.body.entries.length,2);assert.equal(leaderboard.body.verified,true);assert.ok(leaderboard.body.own);
  assert.equal(leaderboard.body.entries.every(row=>!('userId' in row)&&!('user_id' in row)&&!('token' in row)),true);
  await first.close();const second=await fixture(t,{databasePath}),restored=await second.api('/leaderboard',{token:tom.token});assert.deepEqual(restored.body.entries.map(({mine,...row})=>row),leaderboard.body.entries.map(({mine,...row})=>row));assert.equal(restored.body.own.username,'Ninja Tom');
  const removed=await second.api('/account',{method:'DELETE',token:mira.token,body:{password}});assert.equal(removed.status,200);assert.deepEqual((await second.api('/leaderboard')).body.entries.map(row=>row.username),['Ninja Tom']);
});

test('a manually ended run remains unranked and forged score fields cannot substitute for a trace',async t=>{
  const {api,register}=await fixture(t),account=await register(),started=await api('/runs/start',{method:'POST',token:account.token,body:{kind:'normal',mode:'open',viewport:{width:1000,height:700}}}),route=`/runs/${started.body.runId}`;
  assert.equal((await api(`${route}/finish`,{method:'POST',token:account.token,body:{score:999999,result:'lives',commands:[['finishRound',[]]]}})).status,400);
  const ended=await api(`${route}/finish`,{method:'POST',token:account.token,body:{commands:[['finishRound',[]]]}});assert.equal(ended.status,200);assert.equal(ended.body.run.result,'stopped');assert.equal(ended.body.run.ruleset,null);
  assert.equal((await api(`${route}/publish`,{method:'POST',token:account.token})).status,409);assert.equal((await api('/leaderboard')).body.entries.length,0);
});

test('deployment validation refuses unsafe origins, volatile production storage, missing TLS proxy and invalid limits',()=>{
  assert.equal(validateNinjaOrigins(['https://allowed.example','http://localhost:8083']).size,2);
  for(const value of ['*','null','http://external.example','https://allowed.example/path','https://user:pass@allowed.example','https://allowed.example/'])assert.throws(()=>validateNinjaOrigins([value]),/ALLOWED_ORIGINS/);
  assert.throws(()=>createNinjaServer({requireHTTPS:true}),/TLS proxy/);
  assert.throws(()=>createNinjaServer({requireHTTPS:true,trustProxy:true}),/durable DATA_DIR/);
  assert.throws(()=>createNinjaServer({requireHTTPS:true,trustProxy:true,databasePath:'/tmp/ninja-not-durable.sqlite'}),/durable DATA_DIR/);
  for(const rateLimits of [null,{unknown:{limit:1,window:1}},{api:{limit:0}},{api:{window:NaN}}])assert.throws(()=>createNinjaServer({rateLimits}),/rate.limit|Rate limit/i);
  for(const maxRateBuckets of [0,-1,1.5,NaN,1000001])assert.throws(()=>createNinjaServer({maxRateBuckets}),/bucket capacity/);
});

test('new HTTP signups require email, matching password confirmation and explicit privacy consent',async t=>{
  const {api}=await fixture(t);
  const valid={username:'Privacy Ninja',email:'privacy@example.test',password,passwordConfirmation:password,privacyAccepted:true};
  for(const [patch,code]of [[{email:undefined},'INVALID_EMAIL'],[{email:'bad-address'},'INVALID_EMAIL'],[{passwordConfirmation:'different-password'},'PASSWORD_MISMATCH'],[{privacyAccepted:false},'PRIVACY_REQUIRED'],[{privacyAccepted:'true'},'PRIVACY_REQUIRED']]){
    const rejected=await api('/auth/register',{method:'POST',body:{...valid,...patch}});assert.equal(rejected.status,400);assert.equal(rejected.body.code,code);
  }
  const created=await api('/auth/register',{method:'POST',body:valid});assert.equal(created.status,201);
  const login=await api('/auth/login',{method:'POST',body:{username:'PRIVACY@example.test',password}});assert.equal(login.status,200);assert.equal(login.body.user.id,created.body.user.id);
  assert.equal(JSON.stringify(created.body).includes(valid.email),false,'email is private, never returned in public identity/profile');
});
