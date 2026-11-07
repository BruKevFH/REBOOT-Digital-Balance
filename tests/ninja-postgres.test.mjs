import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {Pool} from 'pg';
import {createPostgresNinjaStore,postgresConnectionOptions} from '../server/ninja-postgres-store.mjs';
import {createNinjaAuth} from '../server/ninja-auth.mjs';
import {createNinjaGameService} from '../server/ninja-game-service.mjs';

const password='Postgres integration password 123';
const databaseURL=process.env.TEST_DATABASE_URL;
async function fixture(t){
  const admin=new Pool(postgresConnectionOptions(databaseURL)),schema='ninja_store_'+randomUUID().replaceAll('-','');
  await admin.query(`CREATE SCHEMA ${schema}`);
  const url=new URL(databaseURL);url.searchParams.set('options',`-csearch_path=${schema}`);
  const stores=[];
  t.after(async()=>{for(const store of stores)await store.close();await admin.query(`DROP SCHEMA ${schema} CASCADE`);await admin.end();});
  async function open(){const store=await createPostgresNinjaStore({databaseURL:url.href,now:()=>1700000000000});stores.push(store);return {store,auth:createNinjaAuth(store,{now:()=>1700000000000,maxSessions:2}),game:createNinjaGameService(store,{now:()=>1700000000000})};}
  return {open,url,admin,schema};
}

test('PostgreSQL remote connections always verify TLS, including URLs requesting insecure modes',()=>{
  for(const mode of ['disable','no-verify','require','prefer']){
    const config=postgresConnectionOptions(`postgresql://user:password@db.example/ninja?sslmode=${mode}&ssl=false`);
    assert.deepEqual(config.ssl,{rejectUnauthorized:true});assert.equal(new URL(config.connectionString).searchParams.has('sslmode'),false);assert.equal(new URL(config.connectionString).searchParams.has('ssl'),false);
  }
  assert.equal(postgresConnectionOptions('postgresql://user:password@127.0.0.1/ninja').ssl,false);
  assert.throws(()=>postgresConnectionOptions('https://example.test/db'),/PostgreSQL/);
});

test('PostgreSQL migrations, transactional rollback, profile protection and constraints use a real server',{skip:!databaseURL},async t=>{
  const {open}=await fixture(t),{store,auth}=await open();
  const account=await auth.register({username:'Store Ninja',password,email:'Store@Example.test',passwordConfirmation:password,privacyAccepted:true});
  assert.equal((await auth.login({username:'STORE@example.test',password})).user.id,account.user.id);
  assert.deepEqual((await store.db.prepare('SELECT version FROM ninja_auth_migrations ORDER BY version').all()).map(row=>row.version),[1,2]);
  await assert.rejects(store.transaction(async()=>{await store.db.prepare('UPDATE wallets SET balance=50 WHERE user_id=?').run(account.user.id);await store.putProfile(account.user.id,account.profile);throw new Error('rollback');}),/rollback/);
  assert.equal((await store.getProfile(account.user.id)).profile.coins,0);assert.equal((await store.getProfile(account.user.id)).revision,0);
  const protectedProfile=await store.putProfile(account.user.id,{...account.profile,coins:999,player:{username:'Forged',guest:true}});
  assert.equal(protectedProfile.profile.coins,0);assert.equal(protectedProfile.profile.player.username,'Store Ninja');assert.equal('guest' in protectedProfile.profile.player,false);
  for(const balance of [-1,Number.MAX_SAFE_INTEGER+1])await assert.rejects(store.db.prepare('UPDATE wallets SET balance=? WHERE user_id=?').run(balance,account.user.id),error=>error.code==='23514');
  await assert.rejects(store.db.prepare('INSERT INTO wallets(user_id,balance) VALUES(?,0)').run('missing'),error=>error.code==='23503');
  await assert.rejects(auth.register({username:'Second Ninja',password,email:'store@example.test',passwordConfirmation:password,privacyAccepted:true}),error=>error.code==='EMAIL_UNAVAILABLE');
  await store.close();const restarted=await open();assert.equal((await restarted.auth.authenticate(account.token)).id,account.user.id);assert.equal((await restarted.store.getProfile(account.user.id)).revision,1);
});

test('PostgreSQL concurrent same-key actions credit once and different-key purchases cannot overspend',{skip:!databaseURL},async t=>{
  const {open}=await fixture(t),{store,auth,game}=await open();
  const account=await auth.register({username:'Atomic Ninja',password});
  const body={type:'settings.update',payload:{language:'en'},idempotencyKey:'concurrent-same-key'};
  const results=await Promise.all(Array.from({length:6},()=>game.action(account.user.id,body)));
  assert.equal(results.filter(result=>result.replayed!==true).length,1);assert.equal((await store.getProfile(account.user.id)).revision,1);
  assert.equal((await store.db.prepare('SELECT count(*) AS n FROM ninja_ledger WHERE user_id=?').get(account.user.id)).n,1);
  const {SKINS}=await import('../notification-ninja/src/game.js');
  const skin=SKINS.find(item=>item.cost>0&&!item.unlock);
  assert.ok(skin,'priced shop skin');
  await store.db.prepare('UPDATE wallets SET balance=? WHERE user_id=?').run(skin.cost,account.user.id);
  const buys=await Promise.allSettled(Array.from({length:4},(_,i)=>game.action(account.user.id,{type:'skin.buy',id:skin.id,idempotencyKey:'concurrent-purchase-'+i})));
  assert.equal(buys.filter(result=>result.status==='fulfilled').length,1);
  const profile=(await store.getProfile(account.user.id)).profile;assert.equal(profile.coins,0);assert.equal(profile.unlockedSkins.filter(id=>id===skin.id).length,1);
});

test('PostgreSQL concurrent logins enforce session cap and recovery keys are one-use',{skip:!databaseURL},async t=>{
  const {open}=await fixture(t),{store,auth}=await open();
  const account=await auth.register({username:'Session Ninja',password});
  await Promise.all(Array.from({length:4},()=>auth.login({username:'Session Ninja',password})));
  assert.equal((await store.db.prepare('SELECT count(*) AS n FROM sessions WHERE user_id=?').get(account.user.id)).n,2);
  const resets=await Promise.allSettled(['First replacement password','Second replacement password'].map(newPassword=>auth.resetPassword({username:'Session Ninja',password:newPassword,recoveryKey:account.recoveryKey})));
  assert.equal(resets.filter(result=>result.status==='fulfilled').length,1);assert.equal(resets.find(result=>result.status==='rejected').reason.code,'INVALID_RECOVERY');
  await assert.rejects(auth.authenticate(account.token),error=>error.code==='UNAUTHENTICATED');
});

test('PostgreSQL forward migration adds new account fields while preserving existing users and sessions',{skip:!databaseURL},async t=>{
  const {open,admin,schema}=await fixture(t),initial=await open();
  const account=await initial.auth.register({username:'Legacy PG Ninja',password});
  await initial.store.close();
  await admin.query(`ALTER TABLE ${schema}.users DROP COLUMN email; ALTER TABLE ${schema}.users DROP COLUMN privacy_at; ALTER TABLE ${schema}.sessions DROP COLUMN session_order CASCADE; DELETE FROM ${schema}.ninja_auth_migrations WHERE version=2;`);
  const upgraded=await open();
  assert.equal((await upgraded.auth.authenticate(account.token)).id,account.user.id);
  assert.equal((await upgraded.auth.login({username:'Legacy PG Ninja',password})).user.id,account.user.id);
  const row=await upgraded.store.db.prepare('SELECT email,privacy_at FROM users WHERE id=?').get(account.user.id);assert.deepEqual(row,{email:null,privacy_at:null});
});
