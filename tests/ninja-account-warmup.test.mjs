import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {createAccounts,ACCOUNT_SESSION_KEY} from '../notification-ninja/src/accounts.js';
import {tr,setLanguage} from '../notification-ninja/src/i18n.js';

const endpoint='http://localhost:8083/api/v3';
const json=(value,status=200)=>({ok:status<400,status,json:async()=>value});
const html=(status=503)=>({ok:status<400,status,json:async()=>{throw new SyntaxError('<html>Render starting</html>');}});
const ready=()=>json({ok:true,apiVersion:3});
const deferred=()=>{let resolve;return {promise:new Promise(done=>resolve=done),resolve};};
const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
const session=(id='a')=>({user:{id,username:'Test '+id},token:id.repeat(43),expiresAt:Date.now()+60000,profile:{coins:id==='a'?7:20,player:{username:'Test '+id}},revision:1,endpoint});
function storage(saved){const map=new Map(saved?[[ACCOUNT_SESSION_KEY,JSON.stringify(saved)]]:[]);map.set('guest-save','unchanged');return {getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value),removeItem:key=>map.delete(key),get length(){return map.size;},key:i=>[...map.keys()][i]};}
function fixture(handler,options={}){const calls=[],store=options.sessionStorage||storage();const accounts=createAccounts({baseURL:'http://localhost:8083/',sessionStorage:store,fetchImpl:async(url,init)=>{calls.push({url,...init});if(url.endsWith('accounts-config.json'))return json({enabled:true,endpoint});return handler(url,init);},...options});return {accounts,calls,store};}

test('guest restore returns immediately without fetching configuration or contacting a cold API',async()=>{
 const {accounts,calls,store}=fixture(()=>new Promise(()=>{}));
 assert.equal(await accounts.restore(),null);assert.deepEqual(calls,[]);assert.equal(store.getItem('guest-save'),'unchanged');
});

test('shared readiness retries only anonymous health GETs and sanitizes temporary Render HTML',async()=>{
 let attempts=0;const {accounts,calls,store}=fixture(()=>++attempts<3?html():ready());const changes=[];accounts.subscribe(value=>changes.push(value));
 const [a,b]=await Promise.all([accounts.warmup({delays:[0,0]}),accounts.warmup({delays:[0,0]})]);
 assert(a.online&&b.online);assert.equal(attempts,3);assert(changes.some(value=>value.warming));assert.equal(accounts.getStatus().warming,false);
 for(const call of calls.filter(value=>value.url.endsWith('/health'))){assert.equal(call.method,'GET');assert.equal(call.headers.Authorization,undefined);assert.equal(call.body,undefined);assert.equal(call.credentials,'omit');}
 assert.equal(accounts.getSession(),null);assert.equal(store.getItem('guest-save'),'unchanged');assert(!JSON.stringify(changes).includes('<html>'));
});

test('persistent unready responses stop after the bounded readiness attempts',async()=>{
 const {accounts,calls}=fixture(()=>html());
 await assert.rejects(accounts.warmup({delays:[0,0]}),error=>error.code==='SERVICE_WAKING'&&error.retryable&&!error.message.includes('<html>'));
 assert.equal(calls.filter(value=>value.url.endsWith('/health')).length,3);assert.equal(accounts.getStatus().online,false);assert.equal(accounts.getStatus().warming,false);
});

test('readiness timeouts remain bounded even when a transport ignores AbortSignal',{timeout:5000},async()=>{
 const {accounts,calls}=fixture(()=>new Promise(()=>{}),{timeout:5});
 await assert.rejects(accounts.warmup({delays:[0]}),error=>error.code==='CONNECTION_TIMEOUT');
 assert.equal(calls.filter(value=>value.url.endsWith('/health')).length,2);assert.equal(accounts.getStatus().warming,false);
});

test('cancelling readiness during backoff prevents any later health retry',async()=>{
 const controller=new AbortController(),{accounts,calls}=fixture(()=>html());const pending=accounts.warmup({signal:controller.signal,delays:[100]});
 await tick();controller.abort();await assert.rejects(pending,error=>error.code==='REQUEST_CANCELLED');await tick();
 assert.equal(calls.filter(value=>value.url.endsWith('/health')).length,1);assert.equal(accounts.getStatus().warming,false);
});

test('one readiness caller can cancel without aborting another interested caller',async()=>{
 const health=deferred(),controller=new AbortController(),{accounts,calls}=fixture(()=>health.promise);
 const a=accounts.warmup({signal:controller.signal,delays:[]}),b=accounts.warmup({delays:[]});await tick();controller.abort();await assert.rejects(a,error=>error.code==='REQUEST_CANCELLED');
 assert.equal(calls.at(-1).signal.aborted,false);health.resolve(ready());assert.equal((await b).online,true);assert.equal(calls.filter(value=>value.url.endsWith('/health')).length,1);
});

test('restoration fixes its identity before a delayed config and cannot restore a later different login',async()=>{
 const config=deferred(),store=storage(session()),calls=[];
 const accounts=createAccounts({baseURL:'http://localhost:8083/',sessionStorage:store,fetchImpl:async(url,options)=>{calls.push({url,...options});return url.endsWith('accounts-config.json')?config.promise:json(session('b'));}});
 const restoration=accounts.restore();accounts.forget();const login=accounts.login({username:'B',password:'local-test-only'});config.resolve(json({enabled:true,endpoint}));
 await assert.rejects(restoration,error=>error.code==='STALE_SESSION');await login;assert.equal(accounts.getSession().user.id,'b');assert.equal(accounts.getSession().profile.coins,20);assert(!calls.some(call=>call.url.endsWith('/me')));
});

test('aborting a profile restore preserves its saved session and ignores its late response',async()=>{
 const pending=deferred(),controller=new AbortController(),{accounts,store}=fixture(url=>url.endsWith('/me')?pending.promise:json(session('b')),{sessionStorage:storage(session())});
 const restoration=accounts.restore({signal:controller.signal});await tick();controller.abort();await assert.rejects(restoration,error=>error.code==='REQUEST_CANCELLED');assert.equal(accounts.getSession().user.id,'a');
 await accounts.login({username:'B',password:'local-test-only'});pending.resolve(json({...session(),revision:99}));await tick();assert.equal(accounts.getSession().user.id,'b');assert.equal(store.getItem('guest-save'),'unchanged');
});

test('cold or malformed mutation responses are never automatically retried',async()=>{
 let failLogin=true;const {accounts,calls}=fixture(url=>url.endsWith('/health')?ready():url.endsWith('/auth/login')&&!failLogin?json(session()):html());
 await accounts.warmup({delays:[]});await assert.rejects(accounts.login({username:'A',password:'local-test-only'}),error=>error.code==='SERVICE_WAKING');assert.equal(calls.filter(call=>call.method==='POST').length,1);
 failLogin=false;await accounts.login({username:'A',password:'local-test-only'});await assert.rejects(accounts.action('skin.buy','solar'),error=>error.code==='SERVICE_WAKING');
 assert.equal(calls.filter(call=>call.url.endsWith('/actions')).length,1);assert.equal(accounts.getSession().profile.coins,7);
 const invalid=fixture(()=>html(200));await assert.rejects(invalid.accounts.register({username:'A',password:'local-test-only'}),error=>error.code==='INVALID_RESPONSE'&&!error.message.includes('<html>'));assert.equal(invalid.calls.filter(call=>call.method==='POST').length,1);
});

test('configuration changes abort an old readiness task without moving credentials to the new endpoint',async()=>{
 const health=deferred();let configReads=0;const calls=[];const accounts=createAccounts({baseURL:'http://localhost/',sessionStorage:storage(),fetchImpl:async(url,options)=>{calls.push({url,...options});if(url.endsWith('accounts-config.json'))return json({enabled:true,endpoint:++configReads===1?endpoint:'https://new.example.test/api/v3'});return health.promise;}});
 const pending=accounts.warmup({delays:[]});await tick();await accounts.init({retry:true});await assert.rejects(pending,error=>error.code==='REQUEST_CANCELLED');health.resolve(ready());await tick();assert.equal(accounts.getStatus().online,false);assert(!calls.some(call=>call.url.startsWith('https://new.example.test')));
});

test('real local HTTP cold-start HTML becomes a verified API connection without sending a token in health checks',async t=>{
 const calls=[];let healthCalls=0;const server=http.createServer((request,response)=>{calls.push({method:request.method,url:request.url,authorization:request.headers.authorization});
  if(request.url==='/accounts-config.json'){response.setHeader('Content-Type','application/json');return response.end(JSON.stringify({enabled:true,endpoint:'/api/v3'}));}
  if(request.url==='/api/v3/health'&&++healthCalls===1){response.writeHead(503,{'Content-Type':'text/html'});return response.end('<html>Render starting, no application JSON</html>');}
  response.setHeader('Content-Type','application/json');response.end(JSON.stringify(request.url==='/api/v3/health'?{ok:true,apiVersion:3}:session()));
 });await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>server.close(resolve)));
 const accounts=createAccounts({baseURL:`http://127.0.0.1:${server.address().port}/`,sessionStorage:storage()});
 assert.equal((await accounts.warmup({delays:[1]})).online,true);await accounts.login({username:'A',password:'local-test-only'});await accounts.warmup({delays:[]});
 assert.equal(calls.filter(call=>call.method==='POST').length,1);assert.equal(healthCalls,3);for(const call of calls.filter(call=>call.url==='/api/v3/health'))assert.equal(call.authorization,undefined);
});

test('cold-start status and cancellation feedback have authored English without exposing server HTML',()=>{
 setLanguage('en');for(const text of ['Die Online-Verbindung ist noch nicht bereit. Dein Gastspiel bleibt verfügbar. Bitte versuche es erneut.','Der Online-Dienst wird gestartet. Du kannst sofort als Gast spielen.','Online-Verbindung wird hergestellt …','Die Verbindungsprüfung wurde abgebrochen.','Die Kontoverbindung wurde inzwischen geändert.'])assert.notEqual(tr(text),text);setLanguage('de');
});
