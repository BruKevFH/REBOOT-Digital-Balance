import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {randomUUID} from 'node:crypto';
import {Pool} from 'pg';
import {createNinjaServer,createPostgresNinjaServer} from '../server/ninja-service.mjs';
import {postgresConnectionOptions} from '../server/ninja-postgres-store.mjs';

const revision='abcdef0123456789abcdef0123456789abcdef01';
async function listen(t,server){
  server.listen(0,'127.0.0.1');await once(server,'listening');
  t.after(async()=>{if(server.listening)await new Promise(resolve=>server.close(resolve));await server.ninja.storageClosed;});
  return `http://127.0.0.1:${server.address().port}/api/v3/health`;
}

test('health exposes only a normalized full commit and omits all invalid metadata',async t=>{
  for(const sourceRevision of [revision.toUpperCase(),null,'','private-not-a-revision','a'.repeat(40)+'\n',{value:revision}]){
    const health=await (await fetch(await listen(t,createNinjaServer({sourceRevision})))).json();
    if(sourceRevision===revision.toUpperCase())assert.equal(health.sourceRevision,revision);
    else assert.equal('sourceRevision' in health,false);
    assert.deepEqual(Object.keys(health).sort(),['apiVersion','durableStorage','ok','ruleset','service',...(sourceRevision===revision.toUpperCase()?['sourceRevision']:[])].sort());
  }
});

test('factory reads Render commit metadata once and never publishes arbitrary environment contents',async t=>{
  const previous=process.env.RENDER_GIT_COMMIT;
  try{
    process.env.RENDER_GIT_COMMIT=revision;
    const committed=await listen(t,createNinjaServer());
    process.env.RENDER_GIT_COMMIT='arbitrary-private-provider-value';
    const invalid=await listen(t,createNinjaServer());
    assert.equal((await(await fetch(committed)).json()).sourceRevision,revision);
    const body=await(await fetch(invalid)).text();
    assert.equal('sourceRevision' in JSON.parse(body),false);assert.equal(body.includes('arbitrary-private-provider-value'),false);
  }finally{if(previous===undefined)delete process.env.RENDER_GIT_COMMIT;else process.env.RENDER_GIT_COMMIT=previous;}
});

test('PostgreSQL health preserves explicit revision through its asynchronous factory',{skip:!process.env.TEST_DATABASE_URL},async t=>{
  const admin=new Pool(postgresConnectionOptions(process.env.TEST_DATABASE_URL));
  const schema='revision_'+randomUUID().replaceAll('-','');
  await admin.query(`CREATE SCHEMA ${schema}`);
  t.after(async()=>{await admin.query(`DROP SCHEMA ${schema} CASCADE`);await admin.end();});
  const url=new URL(process.env.TEST_DATABASE_URL);url.searchParams.set('options',`-csearch_path=${schema}`);
  const server=await createPostgresNinjaServer({databaseURL:url.href,sourceRevision:revision});
  const health=await(await fetch(await listen(t,server))).json();
  assert.equal(health.storage,'postgresql');assert.equal(health.durableStorage,true);assert.equal(health.sourceRevision,revision);
});
