import test from 'node:test';
import assert from 'node:assert/strict';
import {createAccounts,createAccountStorage,validateAccountsConfig,ACCOUNT_SESSION_KEY} from '../notification-ninja/src/accounts.js';
import {createVerifiedRun,readVerifiedTrace,restoreVerifiedGame,gameFromServerSnapshot,traceKey} from '../notification-ninja/src/verified-run.js';
import {NinjaGame,STORAGE_KEY} from '../notification-ninja/src/game.js';
class Storage{data=new Map();get length(){return this.data.size;}key(i){return [...this.data.keys()][i]??null;}getItem(k){return this.data.get(k)??null;}setItem(k,v){this.data.set(k,String(v));}removeItem(k){this.data.delete(k);}}
const session=()=>({user:{id:'user-a',username:'Test Ninja'},token:'x'.repeat(43),expiresAt:Date.now()+1000000,profile:{coins:0,player:{username:'Test Ninja'}},revision:0});
const response=(body,status=200)=>({ok:status<400,status,json:async()=>body});
function client(handler,opts={}){const storage=new Storage(),calls=[];const accounts=createAccounts({baseURL:'http://localhost:8083/notification-ninja/',sessionStorage:storage,fetchImpl:async(url,options)=>{calls.push({url,...options});if(url.endsWith('accounts-config.json'))return response({enabled:true,endpoint:'/api/v3'});return handler(url,options);},...opts});return {accounts,storage,calls};}

test('account configuration permits exact local development or HTTPS but rejects credentialled and unsafe hosts',()=>{
 assert.equal(validateAccountsConfig({enabled:true,endpoint:'/api/v3'},'http://localhost:8083/game/').endpoint,'http://localhost:8083/api/v3');
 for(const endpoint of ['http://evil.example/api/v3','https://a:b@example.com/api','javascript:alert(1)','https://example.com/?token=secret'])assert.equal(validateAccountsConfig({enabled:true,endpoint}).configured,false);
 assert.equal(validateAccountsConfig({enabled:false}).configured,false);
});

test('real account login stores token only in supplied session store and never retains passwords or recovery keys',async()=>{
 const secret='super-secret-password',key='NNR-'+'z'.repeat(43),{accounts,storage,calls}=client(()=>response({...session(),recoveryKey:key}));
 const result=await accounts.register({username:'Test Ninja',password:secret});assert.equal(result.recoveryKey,key);assert.equal(accounts.getStatus().signedIn,true);
 const saved=storage.getItem(ACCOUNT_SESSION_KEY);assert.ok(saved.includes('x'.repeat(43)));assert.ok(!saved.includes(secret));assert.ok(!saved.includes(key));assert.equal(calls[1].credentials,'omit');
 assert.equal(calls[1].url,'http://localhost:8083/api/v3/auth/register');assert.equal(calls[1].headers.Authorization,undefined);
});

test('authoritative action replaces wallet and a supplied idempotency key survives retries',async()=>{
 const {accounts,calls}=client((url,options)=>response(url.endsWith('/auth/login')?session():{profile:{coins:7,player:{username:'Test Ninja'}},revision:3}));await accounts.login({username:'Test Ninja',password:'not-retained'});
 await accounts.action('achievement.claim','first-cut',null,'same-retry-key');assert.equal(accounts.getSession().profile.coins,7);assert.equal(accounts.getSession().revision,3);
 const call=calls.at(-1);assert.equal(call.headers.Authorization,'Bearer '+'x'.repeat(43));assert.equal(JSON.parse(call.body).idempotencyKey,'same-retry-key');
});

test('logout clears session and only this account cache, preserving original guest and unrelated account data even after network loss',async()=>{
 let broken=false;const {accounts,storage}=client(()=>{if(broken)throw Error('offline');return response(session());});await accounts.login({username:'Test Ninja',password:'password-secret'});
 storage.setItem(STORAGE_KEY,'guest-save');createAccountStorage(storage,'user-a').setItem(STORAGE_KEY,'account-a');createAccountStorage(storage,'user-b').setItem(STORAGE_KEY,'account-b');broken=true;
 await assert.rejects(accounts.logout(),error=>error.code==='NETWORK');assert.equal(accounts.getSession(),null);assert.equal(storage.getItem(ACCOUNT_SESSION_KEY),null);assert.equal(storage.getItem(STORAGE_KEY),'guest-save');assert.equal(createAccountStorage(storage,'user-a').getItem(STORAGE_KEY),null);assert.equal(createAccountStorage(storage,'user-b').getItem(STORAGE_KEY),'account-b');
});

test('expired or rejected session never becomes an offline authenticated account',async()=>{
 const {accounts}=client((url)=>response(url.endsWith('/auth/login')?session():{error:'Bitte erneut anmelden.',code:'UNAUTHENTICATED'},url.endsWith('/auth/login')?200:401));await accounts.login({username:'Test Ninja',password:'not-kept'});
 await assert.rejects(accounts.restore(),error=>error.status===401);assert.equal(accounts.getSession(),null);
});

test('disabled account host remains an explicit guest fallback and retry fetches a new configuration',async()=>{
 const storage=new Storage();let enabled=false,count=0;const accounts=createAccounts({sessionStorage:storage,baseURL:'http://localhost/',fetchImpl:async url=>{count++;return response({enabled,endpoint:'/api/v3'});}});
 assert.equal((await accounts.init()).configured,false);await assert.rejects(accounts.login({}),e=>e.code==='NOT_CONFIGURED');enabled=true;assert.equal((await accounts.init({retry:true})).configured,true);assert.equal(count,2);
});

test('account caches fall back to session memory when browser storage is blocked',()=>{
 const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');},removeItem(){throw Error('blocked');}},cache=createAccountStorage(blocked,'private');cache.setItem(STORAGE_KEY,'profile');assert.equal(cache.getItem(STORAGE_KEY),'profile');cache.removeItem(STORAGE_KEY);assert.equal(cache.getItem(STORAGE_KEY),null);
});

function serverRun(){const model=new NinjaGame({storage:null,seed:'server-owned',now:()=>500000,width:600,height:600});model.enterGuest();model.startQuickRound('study');return {runId:'run-a',seed:'server-owned',startedAt:500000,expiresAt:9999999999999,initial:model.exportData(),ruleset:null};}
test('recorder logs only top-level public calls, stops at real result, and restores the exact input simulation',()=>{
 const run=serverRun(),storage=new Storage(),game=gameFromServerSnapshot(run.initial,{storage:null,now:()=>500000});let ended=0;
 const recorder=createVerifiedRun(game,{run,userId:'user-a',storage,onEnded:()=>ended++});game.nextLevel();game.pause();game.resume();for(let i=0;i<50;i++)game.update(.05);game.finishRound();game.resize(700,700);
 assert.equal(ended,1);const commands=recorder.getCommands();assert.deepEqual(commands.slice(0,3).map(c=>c[0]),['nextLevel','pause','resume']);assert.equal(commands.at(-1)[0],'finishRound');assert.equal(commands.filter(c=>c[0]==='setPaused').length,0);
 const trace=readVerifiedTrace(storage,'user-a'),replayed=restoreVerifiedGame(trace,{storage:null,now:()=>500000});assert.equal(replayed.state.scoreArcade,game.state.scoreArcade);assert.equal(replayed.state.elapsed,game.state.elapsed);assert.equal(replayed.state.result,'stopped');assert.deepEqual(replayed.state.metrics,game.state.metrics);
 assert.equal(readVerifiedTrace(storage,'other-user'),null);recorder.clear();recorder.flush();assert.equal(storage.getItem(traceKey('user-a')),null);recorder.destroy();
});

test('run recorder bounds traces and reports overflow without inventing a verified score',()=>{
 const run=serverRun(),game=gameFromServerSnapshot(run.initial,{storage:null}),storage=new Storage();let overflow=0;const recorder=createVerifiedRun(game,{run,userId:'user-a',storage,maxCommands:2,onOverflow:()=>overflow++});game.nextLevel();game.update(.05);game.update(.05);game.update(.05);assert.equal(overflow,1);assert.equal(recorder.getStatus().overflow,true);assert.equal(recorder.getCommands().length,2);assert.equal(game.state.ended,false);
});

test('aborted account fetch surfaces readable retryable failure without discarding the guest save',async()=>{
 const {accounts,storage}=client(()=>{throw Error('network');});storage.setItem(STORAGE_KEY,'original');await assert.rejects(accounts.login({username:'Test Ninja',password:'secret'}),error=>error.retryable&&error.code==='NETWORK');assert.equal(storage.getItem(STORAGE_KEY),'original');
});

function deferred(){let resolve;return {promise:new Promise(r=>resolve=r),resolve};}
test('a late A action cannot overwrite B wallet after account switch',async()=>{
 const pending=deferred();let loginCount=0;const {accounts}=client((url)=>{
  if(url.endsWith('/auth/login')){const value=session();if(loginCount++){value.user={id:'user-b',username:'Other Ninja'};value.token='y'.repeat(43);value.profile={coins:5,player:{username:'Other Ninja'}};}return response(value);}
  if(url.endsWith('/actions'))return pending.promise;
  return response({ok:true});
 });
 await accounts.login({username:'A',password:'password-secret'});const action=accounts.action('achievement.claim','first-cut',null,'delayed-a-key');await new Promise(r=>setTimeout(r,0));await accounts.logout();await accounts.login({username:'B',password:'password-secret'});pending.resolve(response({profile:{coins:999,player:{username:'Test Ninja'}},revision:88}));await assert.rejects(action,e=>e.code==='STALE_SESSION');assert.equal(accounts.getSession().user.id,'user-b');assert.equal(accounts.getSession().profile.coins,5);
});

test('late logout for A cannot clear a newer B login',async()=>{
 const pending=deferred();let count=0;const {accounts}=client(url=>{if(url.endsWith('/auth/logout'))return pending.promise;const value=session();if(count++){value.user={id:'user-b',username:'B Ninja'};value.token='y'.repeat(43);}return response(value);});await accounts.login({});const logout=accounts.logout();await new Promise(r=>setTimeout(r,0));await accounts.login({});pending.resolve(response({ok:true}));await assert.rejects(logout,e=>e.code==='STALE_SESSION');assert.equal(accounts.getSession().user.id,'user-b');
});

test('out-of-order same-user action responses keep the highest authoritative profile revision',async()=>{
 const first=deferred(),second=deferred();let count=0;const {accounts}=client(url=>url.endsWith('/auth/login')?response(session()):++count===1?first.promise:second.promise);await accounts.login({});const a=accounts.action('guide.seen','welcome'),b=accounts.action('guide.seen','career');await new Promise(r=>setTimeout(r,0));second.resolve(response({profile:{coins:10,player:{username:'Test Ninja'}},revision:2}));await b;first.resolve(response({profile:{coins:7,player:{username:'Test Ninja'}},revision:1}));await a;assert.equal(accounts.getSession().revision,2);assert.equal(accounts.getSession().profile.coins,10);
});

test('an expired action clears authentication but keeps the user-bound pending run trace for reauthentication',async()=>{
 const {accounts,storage}=client(url=>url.endsWith('/auth/login')?response(session()):response({code:'UNAUTHENTICATED',message:'Session expired.'},401));await accounts.login({});storage.setItem(traceKey('user-a'),'pending');await assert.rejects(accounts.action('guide.seen','welcome'),e=>e.status===401);assert.equal(accounts.getSession(),null);assert.equal(storage.getItem(traceKey('user-a')),'pending');
});

test('failed login while signed in does not log out the current unrelated account',async()=>{
 let count=0;const {accounts}=client(()=>++count===1?response(session()):response({message:'Anmeldung fehlgeschlagen.',code:'INVALID_CREDENTIALS'},401));await accounts.login({});await assert.rejects(accounts.login({username:'Other Ninja',password:'wrong-password'}),e=>e.status===401);assert.equal(accounts.getSession().user.id,'user-a');
});

test('a lower revision rename response cannot regress the current authoritative display name',async()=>{
 const pending=deferred();const {accounts}=client(url=>url.endsWith('/auth/login')?response(session()):url.endsWith('/profile')?pending.promise:response({user:{id:'user-a',username:'Newer Ninja'},profile:{coins:4,player:{username:'Newer Ninja'}},revision:5}));await accounts.login({});const rename=accounts.rename('Older Ninja');await new Promise(r=>setTimeout(r,0));await accounts.restore();pending.resolve(response({user:{id:'user-a',username:'Older Ninja'},profile:{coins:2,player:{username:'Older Ninja'}},revision:2}));await rename;assert.equal(accounts.getSession().user.username,'Newer Ninja');assert.equal(accounts.getSession().profile.player.username,'Newer Ninja');
});

test('a delayed profile refresh cannot replace a newer same-account purchase or name',async()=>{
 const pending=deferred();const {accounts}=client(url=>url.endsWith('/auth/login')?response(session()):url.endsWith('/me')?pending.promise:response({user:{id:'user-a',username:'Latest Ninja'},profile:{coins:15,selectedSkin:'solar',player:{username:'Latest Ninja'}},revision:8}));
 await accounts.login({});const refresh=accounts.restore();await new Promise(r=>setTimeout(r,0));await accounts.rename('Latest Ninja');
 pending.resolve(response({user:{id:'user-a',username:'Old Ninja'},profile:{coins:95,selectedSkin:'default',player:{username:'Old Ninja'}},revision:2}));
 const restored=await refresh;assert.equal(restored.revision,8);assert.equal(restored.user.username,'Latest Ninja');assert.equal(restored.profile.selectedSkin,'solar');assert.equal(accounts.getSession().profile.coins,15);
});

test('an ambiguous lost mutation response retries the original key and applies its confirmed wallet once',async()=>{
 const keys=[];let sent=0;const {accounts}=client((url,options)=>{if(url.endsWith('/auth/login'))return response(session());keys.push(JSON.parse(options.body).idempotencyKey);if(!sent++)throw Error('response lost after server committed');return response({profile:{coins:40,unlockedSkins:['default','solar'],player:{username:'Test Ninja'}},revision:1,replayed:true});});
 await accounts.login({});await assert.rejects(accounts.action('skin.buy','solar'),e=>e.code==='NETWORK');assert.equal(accounts.getSession().profile.coins,0,'no invented debit or ownership before confirmation');
 const result=await accounts.action('skin.buy','solar');assert.equal(keys[0],keys[1]);assert.equal(result.replayed,true);assert.equal(accounts.getSession().profile.coins,40);assert.deepEqual(accounts.getSession().profile.unlockedSkins,['default','solar']);
});

test('a rejected HTTP request means reachable service while a transport failure means disconnected',async()=>{
 let mode='login';const {accounts}=client(url=>{if(url.endsWith('/auth/login'))return response(session());if(mode==='network')throw Error('offline');return response({code:'INVALID_USERNAME',message:'Name is invalid.'},400);});
 await accounts.login({});await assert.rejects(accounts.rename('invalid!'),e=>e.status===400);assert.equal(accounts.getStatus().online,true);assert.equal(accounts.getStatus().signedIn,true);
 mode='network';await assert.rejects(accounts.rename('Valid Ninja'),e=>e.code==='NETWORK');assert.equal(accounts.getStatus().online,false);assert.equal(accounts.getStatus().signedIn,true);
});
