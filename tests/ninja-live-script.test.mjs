import test from 'node:test';
import assert from 'node:assert/strict';
import {buildReplay} from '../scripts/check_ninja_live.mjs';
import {createNinjaStore} from '../server/ninja-store.mjs';
import {createNinjaAuth} from '../server/ninja-auth.mjs';
import {createNinjaGameService} from '../server/ninja-game-service.mjs';

test('live acceptance generates real server-verifiable Open Run and economy traces',async t=>{
  let stamp=Date.UTC(2026,10,7,12);
  const now=()=>stamp,store=createNinjaStore({now});t.after(()=>store.close());
  const auth=createNinjaAuth(store,{now}),service=createNinjaGameService(store,{now});
  const account=await auth.register({username:'Live Trace Ninja',password:'Synthetic acceptance password'});
  for(const body of [{kind:'normal',mode:'open',difficulty:'easy'},{kind:'quick',context:'study',difficulty:'hard'}]){
    const issued=service.startRun(account.user.id,{...body,viewport:{width:800,height:700}});
    const played=buildReplay(issued,{correctUntil:body.mode==='open'?45:Infinity});
    stamp+=played.simulatedMs+500;
    const finished=service.finishRun(account.user.id,issued.runId,{commands:played.commands});
    assert.equal(finished.run.score,played.score);assert.equal(finished.run.result,played.result);assert.equal(finished.run.verified,true);
    assert.equal(finished.run.awardedCoins,played.earned);assert.ok(played.commands.some(command=>command[0]==='swipe'));
    if(body.mode==='open')assert.equal(service.publishRun(account.user.id,issued.runId).run.published,true);
    else assert.equal(finished.run.result,'complete');
  }
});
