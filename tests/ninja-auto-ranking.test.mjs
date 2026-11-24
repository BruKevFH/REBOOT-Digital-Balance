import test from 'node:test';
import assert from 'node:assert/strict';
import {AUTO_RANKING_MAX_PENDING,autoRankingKey,eligibleForAutoRanking,createAutoRankingPublisher} from '../notification-ninja/src/auto-ranking.js';
import {createNinjaStore} from '../server/ninja-store.mjs';
import {createNinjaAuth} from '../server/ninja-auth.mjs';
import {createNinjaGameService} from '../server/ninja-game-service.mjs';
import {buildReplay} from '../scripts/check_ninja_live.mjs';

const id=number=>`00000000-0000-4000-8000-${String(number).padStart(12,'0')}`;
const run=number=>({id:id(number),verified:true,published:false,mode:'open',result:'lives',ruleset:'open-v2',score:1234});
const acknowledgement=number=>({run:{...run(number),published:true},profile:{coins:7},revision:3});
class Storage{
  data=new Map();
  getItem(key){return this.data.get(key)??null;}
  setItem(key,value){this.data.set(key,String(value));}
  removeItem(key){this.data.delete(key);}
}
const user=()=>({userId:'player-a',authenticated:true,admin:false});
function fixture({storage=new Storage(),publish=async value=>({run:{...run(1),id:value,published:true}}),identity=user(),maxPending}={}){
  const calls=[],statuses=[];let current=identity;
  const accounts={publish:async value=>{calls.push(value);return publish(value);}};
  const publisher=createAutoRankingPublisher({accounts,storage,getIdentity:()=>current,onStatus:value=>statuses.push(value),...(maxPending?{maxPending}:{})});
  return {publisher,accounts,calls,statuses,storage,setIdentity:value=>{current=value;}};
}
function deferred(){let resolve,reject;return {promise:new Promise((a,b)=>{resolve=a;reject=b;}),resolve,reject};}

test('only newly verified complete account Open Runs are eligible; guests, admins and every other result stay private',async()=>{
  assert(eligibleForAutoRanking(run(1),user()));
  for(const patch of [{score:0},{score:-1},{score:Infinity},{verified:false},{published:true},{published:undefined},{mode:'study'},{result:'stopped'},{ruleset:'legacy'},{id:'not-a-server-run'}])assert.equal(eligibleForAutoRanking({...run(1),...patch},user()),false);
  for(const identity of [{authenticated:false,userId:'guest'},{authenticated:true},{...user(),admin:true},{...user(),role:'admin'},{...user(),sandbox:true},{...user(),unlimitedCoins:true}]){
    const f=fixture({identity});assert.equal(f.publisher.enqueue(run(1)).ok,false);await f.publisher.flush();assert.deepEqual(f.calls,[]);assert.equal(f.storage.data.size,0);
  }
});

test('enqueue stores only a user-bound run ID; publication goes through accounts.publish and needs an exact verified acknowledgement',async()=>{
  const f=fixture({publish:async()=>acknowledgement(1)});
  assert.equal(f.publisher.enqueue(run(1)).queued,true);
  const saved=f.storage.getItem(autoRankingKey('player-a'));
  assert.deepEqual(JSON.parse(saved),{version:1,pending:[id(1)]});
  for(const field of ['score','coins','password','token'])assert.equal(saved.includes(field),false);
  const result=await f.publisher.flush();assert.equal(result.ok,true);assert.equal(result.published.length,1);assert.deepEqual(f.calls,[id(1)]);
  assert.equal(f.storage.getItem(autoRankingKey('player-a')),null);
  assert.equal(f.statuses.filter(value=>value.status==='published').length,1);
});

test('a lost response keeps the exact run ID durable and a fresh publisher retries after reload without inventing success',async()=>{
  const storage=new Storage(),failed=fixture({storage,publish:async()=>{throw Object.assign(new Error('lost after commit'),{code:'NETWORK',retryable:true});}});
  failed.publisher.enqueue(run(1));assert.equal((await failed.publisher.flush()).ok,false);
  assert.deepEqual(failed.publisher.getState().pending,[id(1)]);assert.equal(failed.statuses.some(value=>value.status==='published'),false);
  const reloaded=fixture({storage,publish:async()=>acknowledgement(1)});assert.deepEqual(reloaded.calls,[],'Reload alone does not enumerate or publish historical results.');
  assert.equal((await reloaded.publisher.flush()).ok,true);assert.deepEqual(reloaded.calls,[id(1)]);
  assert.equal(storage.getItem(autoRankingKey('player-a')),null);
});

test('concurrent flush calls and duplicate enqueues send one request; an enqueue during delivery is preserved',async()=>{
  const pending=deferred();let first=true;
  const f=fixture({publish:async value=>{if(first){first=false;return pending.promise;}return {run:{...run(2),id:value,published:true}};}});
  f.publisher.enqueue(run(1));assert.equal(f.publisher.enqueue(run(1)).duplicate,true);
  const a=f.publisher.flush(),b=f.publisher.flush();assert.equal(a,b);await Promise.resolve();assert.deepEqual(f.calls,[id(1)]);
  f.publisher.enqueue(run(2));pending.resolve(acknowledgement(1));assert.equal((await a).ok,true);
  assert.deepEqual(f.calls,[id(1),id(2)]);assert.deepEqual(f.publisher.getState().pending,[]);
});

test('account switch never sends A pending runs as B and a late response cannot remove A work or emit B success',async()=>{
  const pending=deferred(),f=fixture({publish:()=>pending.promise});f.publisher.enqueue(run(1));const delivery=f.publisher.flush();await Promise.resolve();
  f.setIdentity({userId:'player-b',authenticated:true});pending.resolve(acknowledgement(1));assert.equal((await delivery).reason,'identity-changed');
  assert.deepEqual(f.publisher.getState('player-a').pending,[id(1)]);assert.deepEqual(f.publisher.getState().pending,[]);assert.equal(f.statuses.some(value=>value.status==='published'),false);
  await f.publisher.flush();assert.deepEqual(f.calls,[id(1)]);
});

test('B resume waits for an old A flight then automatically delivers only B queued runs',async()=>{
  const pending=deferred(),f=fixture({publish:value=>value===id(1)?pending.promise:Promise.resolve(acknowledgement(2))});
  f.publisher.enqueue(run(1));const a=f.publisher.flush();await Promise.resolve();
  f.setIdentity({userId:'player-b',authenticated:true});f.publisher.enqueue(run(2));const b=f.publisher.flush();
  pending.resolve(acknowledgement(1));assert.equal((await a).reason,'identity-changed');assert.equal((await b).ok,true);
  assert.deepEqual(f.calls,[id(1),id(2)]);assert.deepEqual(f.publisher.getState('player-a').pending,[id(1)]);assert.deepEqual(f.publisher.getState('player-b').pending,[]);
  assert.deepEqual(f.statuses.filter(value=>value.status==='published').map(value=>value.userId),['player-b']);
});

test('logout/destroy retains the durable outbox while confirmed deletion clears only its own user and cancels late effects',async()=>{
  const storage=new Storage(),pending=deferred(),f=fixture({storage,publish:()=>pending.promise});
  storage.setItem(autoRankingKey('player-b'),JSON.stringify({version:1,pending:[id(2)]}));f.publisher.enqueue(run(1));const delivery=f.publisher.flush();await Promise.resolve();f.publisher.destroy();pending.resolve(acknowledgement(1));await delivery;
  assert.deepEqual(JSON.parse(storage.getItem(autoRankingKey('player-a'))).pending,[id(1)]);
  const next=fixture({storage});assert.equal(next.publisher.clearUser('player-a'),true);assert.equal(storage.getItem(autoRankingKey('player-a')),null);assert(storage.getItem(autoRankingKey('player-b')));
  assert.equal(next.publisher.clearUser(undefined),true);
});

test('expired sessions, server failures, rate limits and stale sessions retain pending work for a later authenticated retry',async()=>{
  for(const error of [{code:'UNAUTHENTICATED',status:401},{code:'STALE_SESSION',status:409},{code:'RATE_LIMIT',status:429},{code:'INTERNAL',status:500}]){
    const f=fixture({publish:async()=>{throw Object.assign(new Error('temporarily unavailable'),error);}});f.publisher.enqueue(run(1));await f.publisher.flush();
    assert.deepEqual(f.publisher.getState().pending,[id(1)]);assert.equal(f.statuses.some(value=>value.status==='published'),false);
  }
});

test('server terminal rejections are surfaced and removed without blocking the next genuine run',async()=>{
  const f=fixture({publish:async value=>{if(value===id(1))throw Object.assign(new Error('not ranked'),{code:'RUN_NOT_RANKED',status:409});return acknowledgement(2);}});
  f.publisher.enqueue(run(1));f.publisher.enqueue(run(2));const result=await f.publisher.flush();assert.deepEqual(f.calls,[id(1),id(2)]);assert.equal(result.ok,false);assert.deepEqual(result.rejected,[{runId:id(1),code:'RUN_NOT_RANKED'}]);
  assert.equal(f.statuses.filter(value=>value.status==='rejected').length,1);assert.equal(f.statuses.filter(value=>value.status==='published').length,1);
});

test('missing, mismatched and unverified server acknowledgements never report published or discard pending work',async()=>{
  for(const result of [{},{run:{...run(1),published:false}},{run:{...acknowledgement(1).run,verified:false}},acknowledgement(2)]){
    const f=fixture({publish:async()=>result});f.publisher.enqueue(run(1));assert.equal((await f.publisher.flush()).reason,'invalid-acknowledgement');assert.deepEqual(f.publisher.getState().pending,[id(1)]);assert.equal(f.statuses.some(value=>value.status==='published'),false);
  }
});

test('a full bounded outbox refuses overflow explicitly and never drops an older unpublished run',()=>{
  const f=fixture();for(let n=1;n<=AUTO_RANKING_MAX_PENDING;n++)assert.equal(f.publisher.enqueue(run(n)).ok,true);
  const original=f.storage.getItem(autoRankingKey('player-a'));
  assert.equal(f.publisher.enqueue(run(999)).reason,'queue-full');assert.equal(f.storage.getItem(autoRankingKey('player-a')),original);assert.equal(f.publisher.getState().pending.length,AUTO_RANKING_MAX_PENDING);
});

test('unavailable browser storage uses an honest memory-only queue and throwing status callbacks cannot interrupt delivery',async()=>{
  const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');},removeItem(){throw Error('blocked');}},calls=[];
  const publisher=createAutoRankingPublisher({storage:blocked,getIdentity:user,accounts:{publish:async value=>{calls.push(value);return acknowledgement(1);}},onStatus(){throw Error('presentation failed');}});
  assert.equal(publisher.enqueue(run(1)).durable,false);assert.equal((await publisher.flush()).ok,true);assert.deepEqual(calls,[id(1)]);
});

test('malformed or oversized saved outboxes are preserved without guessing, publishing or overwriting their contents',async()=>{
  for(const raw of ['broken JSON',JSON.stringify({version:1,pending:[{id:id(1),score:99999}]}),'x'.repeat(20001)]){
    const storage=new Storage();storage.setItem(autoRankingKey('player-a'),raw);const f=fixture({storage});
    assert.equal(f.publisher.enqueue(run(2)).reason,'unreadable-outbox');assert.equal((await f.publisher.flush()).reason,'unreadable-outbox');assert.equal(storage.getItem(autoRankingKey('player-a')),raw);assert.deepEqual(f.calls,[]);
  }
});

test('default identity derives signed-in and admin status from the real account session rather than guest profile values',async()=>{
  const calls=[],accounts={getSession:()=>({user:{id:'real-player'},profile:{adminSandbox:false}}),publish:async value=>{calls.push(value);return acknowledgement(1);}};
  const publisher=createAutoRankingPublisher({accounts,storage:new Storage()});assert.equal(publisher.enqueue(run(1)).ok,true);await publisher.flush();assert.deepEqual(calls,[id(1)]);
  accounts.getSession=()=>({user:{id:'real-admin'},profile:{adminSandbox:true}});assert.equal(publisher.enqueue(run(2)).ok,false);await publisher.flush();assert.deepEqual(calls,[id(1)]);
});

test('automatic publication uses real replay-verified server data and never a forged client score',async t=>{
  let stamp=Date.UTC(2026,10,24,12);const now=()=>stamp,store=createNinjaStore({now});t.after(()=>store.close());
  const auth=createNinjaAuth(store,{now}),game=createNinjaGameService(store,{now});
  const account=await auth.register({username:'Auto Ranking Ninja',password:'Synthetic auto-ranking password!'});
  const issued=game.startRun(account.user.id,{kind:'normal',mode:'open',difficulty:'normal',viewport:{width:800,height:700}});
  const played=buildReplay(issued);stamp+=played.simulatedMs+500;
  const finished=game.finishRun(account.user.id,issued.runId,{commands:played.commands});assert.equal(finished.run.verified,true);
  assert.equal(game.leaderboard().total,0,'Verification alone does not publish historical results.');
  const wallet=game.getState(account.user.id).profile.coins;
  const publisher=createAutoRankingPublisher({accounts:{publish:id=>game.publishRun(account.user.id,id)},storage:new Storage(),getIdentity:()=>({userId:account.user.id,authenticated:true})});
  publisher.enqueue({...finished.run,score:Number.MAX_SAFE_INTEGER,decisions:Number.MAX_SAFE_INTEGER});
  assert.equal((await publisher.flush()).ok,true);
  const board=game.leaderboard();assert.equal(board.total,1);assert.equal(board.entries[0].score,finished.run.score);assert.equal(board.entries[0].decisions,finished.run.decisions);
  assert.equal(game.getState(account.user.id).profile.coins,wallet,'Publication does not create rewards.');
});
