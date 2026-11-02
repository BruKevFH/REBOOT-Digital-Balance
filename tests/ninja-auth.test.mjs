import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {DatabaseSync} from 'node:sqlite';
import {createNinjaStore} from '../server/ninja-store.mjs';
import {AUTH_CONFIG,createNinjaAuth} from '../server/ninja-auth.mjs';

const password='A strong Ninja password 17';
const nextPassword='My new Ninja password 29';
const hash=value=>createHash('sha256').update(value).digest('hex');
function fixture(t,options={}){
  let stamp=1700000000000;
  const now=()=>stamp,store=createNinjaStore({now,...options});
  t.after(()=>store.close());
  const auth=createNinjaAuth(store,{now,...options});
  return {store,auth,now,tick:ms=>stamp+=ms};
}
const code=(expected,status)=>error=>{assert.equal(error.code,expected);if(status)assert.equal(error.status,status);return true;};

test('registration uses salted scrypt and hashes high-entropy session and recovery secrets',async t=>{
  const {store,auth}=fixture(t),first=await auth.register({username:'Ninja Mira',password}),second=await auth.register({username:'Ninja Tom',password});
  assert.match(first.token,/^[A-Za-z0-9_-]{43}$/);assert.match(first.recoveryKey,/^NNR-[A-Za-z0-9_-]{43}$/);
  assert.equal(first.user.username,'Ninja Mira');assert.equal(first.profile.coins,0);assert.equal(first.profile.player.username,'Ninja Mira');
  assert.equal('guest' in first.profile.player,false);assert.equal(first.profile.accountCalendar,'utc');assert.equal(first.revision,0);
  const row=store.db.prepare('SELECT * FROM users WHERE id=?').get(first.user.id),other=store.db.prepare('SELECT password_hash FROM users WHERE id=?').get(second.user.id);
  assert.match(row.password_hash,/^scrypt-v1\$32768\$8\$1\$/);assert.notEqual(row.password_hash,other.password_hash);
  assert.equal(row.recovery_hash,hash(first.recoveryKey));
  const session=store.db.prepare('SELECT * FROM sessions WHERE user_id=?').get(first.user.id);assert.equal(session.token_hash,hash(first.token));
  const stored=JSON.stringify([row,session,store.getProfile(first.user.id)]);
  for(const secret of [password,first.token,first.recoveryKey])assert.equal(stored.includes(secret),false);
  assert.deepEqual(Object.keys(first.user).sort(),['id','username']);
});

test('login accepts normalized names, rotates tokens and returns no recovery secret',async t=>{
  const {auth}=fixture(t),first=await auth.register({username:'  Ninja   Mirá ',password});
  const result=await auth.login({username:'ninja mira\u0301',password});
  assert.equal(result.user.id,first.user.id);assert.equal(result.user.username,'Ninja Mirá');assert.notEqual(result.token,first.token);
  assert.equal('recoveryKey' in result,false);assert.equal(auth.authenticate(result.token).id,first.user.id);
});

test('unknown and incorrect credentials return the same neutral failure',async t=>{
  const {auth}=fixture(t);await auth.register({username:'Ninja Mira',password});
  const errors=[];
  for(const input of [{username:'Ninja Mira',password:'wrong password'},{username:'Unknown Ninja',password},{username:'<script>',password},{username:'Ninja Mira',password:{value:password}},{username:'Ninja Mira',password:'\ud800'}]){
    await assert.rejects(auth.login(input),error=>{errors.push([error.code,error.status,error.message]);return true;});
  }
  for(const error of errors)assert.deepEqual(error,errors[0]);assert.equal(errors[0][0],'INVALID_CREDENTIALS');
});

test('usernames reject markup, controls and unsafe lengths, and passwords enforce bounds',async t=>{
  const {auth}=fixture(t);
  for(const username of ['', 'ab','x'.repeat(19),'<img src=x>','Ninja\nName','A\u200bBC',null,{}])await assert.rejects(auth.register({username,password}),code('INVALID_USERNAME',400));
  for(const bad of ['', '123456789','a'.repeat(129),'\ud800'.repeat(10),null,{}])await assert.rejects(auth.register({username:'Ninja Mira',password:bad}),code('INVALID_PASSWORD',400));
  const unicode=await auth.register({username:'猫の忍者',password:'🌙'.repeat(10)});assert.ok(auth.authenticate(unicode.token));
  assert.equal(AUTH_CONFIG.passwordMinLength,10);assert.equal(AUTH_CONFIG.passwordMaxLength,128);
});

test('case and compatibility variants cannot claim the same account name concurrently',async t=>{
  const {store,auth}=fixture(t);
  const results=await Promise.allSettled(['Ｎｉｎｊａ Mira','ninja mira'].map(username=>auth.register({username,password})));
  assert.equal(results.filter(result=>result.status==='fulfilled').length,1);
  const failure=results.find(result=>result.status==='rejected').reason;assert.equal(failure.code,'NAME_UNAVAILABLE');assert.equal(failure.status,409);
  assert.equal(store.db.prepare('SELECT count(*) AS n FROM users').get().n,1);
  assert.equal(store.db.prepare('SELECT count(*) AS n FROM wallets').get().n,1);
});

test('logout invalidates one session without affecting another account or session',async t=>{
  const {auth}=fixture(t),first=await auth.register({username:'Ninja Mira',password}),again=await auth.login({username:'Ninja Mira',password}),second=await auth.register({username:'Ninja Tom',password});
  assert.deepEqual(auth.logout(first.token),{ok:true});assert.deepEqual(auth.logout(first.token),{ok:true});
  assert.throws(()=>auth.authenticate(first.token),code('UNAUTHENTICATED',401));
  assert.equal(auth.authenticate(again.token).id,first.user.id);assert.equal(auth.authenticate(second.token).id,second.user.id);
  for(const token of ['',null,{},`${again.token}x`,'a'.repeat(43)])assert.throws(()=>auth.authenticate(token),code('UNAUTHENTICATED',401));
});

test('session expiry is enforced at its exact boundary and stale rows are pruned',async t=>{
  const {auth,store,tick}=fixture(t,{sessionTTL:1000}),first=await auth.register({username:'Ninja Mira',password});
  tick(999);assert.equal(auth.authenticate(first.token).id,first.user.id);tick(1);
  assert.throws(()=>auth.authenticate(first.token),code('UNAUTHENTICATED',401));
  await auth.login({username:'Ninja Mira',password});assert.equal(store.db.prepare('SELECT count(*) AS n FROM sessions').get().n,1);
});

test('same-millisecond logins always retain the newly issued session up to the configured cap',async t=>{
  const {auth,store}=fixture(t,{maxSessions:2}),first=await auth.register({username:'Ninja Mira',password});
  const second=await auth.login({username:'Ninja Mira',password}),third=await auth.login({username:'Ninja Mira',password});
  assert.throws(()=>auth.authenticate(first.token),code('UNAUTHENTICATED',401));
  assert.equal(auth.authenticate(second.token).id,first.user.id);assert.equal(auth.authenticate(third.token).id,first.user.id);
  assert.equal(store.db.prepare('SELECT count(*) AS n FROM sessions').get().n,2);
});

test('recovery rotates both password and recovery key and revokes every old session',async t=>{
  const {auth}=fixture(t),first=await auth.register({username:'Ninja Mira',password}),again=await auth.login({username:'Ninja Mira',password});
  const reset=await auth.resetPassword({username:'NINJA MIRA',recoveryKey:first.recoveryKey,password:nextPassword});
  assert.notEqual(reset.recoveryKey,first.recoveryKey);assert.equal(reset.user.id,first.user.id);
  for(const token of [first.token,again.token])assert.throws(()=>auth.authenticate(token),code('UNAUTHENTICATED',401));
  assert.equal(auth.authenticate(reset.token).id,first.user.id);
  await assert.rejects(auth.login({username:'Ninja Mira',password}),code('INVALID_CREDENTIALS',401));
  assert.equal((await auth.login({username:'Ninja Mira',password:nextPassword})).user.id,first.user.id);
  await assert.rejects(auth.resetPassword({username:'Ninja Mira',recoveryKey:first.recoveryKey,password}),code('INVALID_RECOVERY',401));
});

test('failed recovery is neutral, cannot use another account key, and leaves credentials intact',async t=>{
  const {auth}=fixture(t),first=await auth.register({username:'Ninja Mira',password}),second=await auth.register({username:'Ninja Tom',password});
  let neutral;
  for(const input of [{username:'Ninja Mira',recoveryKey:second.recoveryKey},{username:'Unknown Ninja',recoveryKey:first.recoveryKey},{username:'Ninja Mira',recoveryKey:'invalid'}]){
    await assert.rejects(auth.resetPassword({...input,password:nextPassword}),error=>{neutral??=error.message;assert.equal(error.message,neutral);assert.equal(error.code,'INVALID_RECOVERY');return true;});
  }
  assert.ok(auth.authenticate(first.token));assert.ok(await auth.login({username:'Ninja Mira',password}));
});

test('a recovery key can succeed only once when reset requests race',async t=>{
  const {auth}=fixture(t),first=await auth.register({username:'Ninja Mira',password});
  const resets=await Promise.allSettled([nextPassword,'Another new Ninja password'].map(replacement=>auth.resetPassword({username:'Ninja Mira',recoveryKey:first.recoveryKey,password:replacement})));
  assert.equal(resets.filter(item=>item.status==='fulfilled').length,1);assert.equal(resets.find(item=>item.status==='rejected').reason.code,'INVALID_RECOVERY');
});

test('renaming updates the profile identity atomically and refuses another player name',async t=>{
  const {auth,store}=fixture(t),first=await auth.register({username:'Ninja Mira',password}),second=await auth.register({username:'Ninja Tom',password});
  const renamed=auth.rename(first.user.id,'Ninja Luna');assert.equal(renamed.profile.player.username,'Ninja Luna');assert.equal(renamed.revision,1);
  assert.equal(auth.authenticate(first.token).username,'Ninja Luna');assert.equal(auth.rename(first.user.id,'Ninja Luna').revision,1);
  assert.throws(()=>auth.rename(first.user.id,'NINJA TOM'),code('NAME_UNAVAILABLE',409));
  assert.equal(store.getProfile(first.user.id).profile.player.username,'Ninja Luna');assert.equal(store.getProfile(second.user.id).profile.player.username,'Ninja Tom');
  await assert.rejects(auth.login({username:'Ninja Mira',password}),code('INVALID_CREDENTIALS',401));assert.ok(await auth.login({username:'Ninja Luna',password}));
});

test('confirmed deletion removes own account, dependent rows and sessions, preserving other accounts',async t=>{
  const {auth,store}=fixture(t),first=await auth.register({username:'Ninja Mira',password}),second=await auth.register({username:'Ninja Tom',password});
  store.db.exec('CREATE TABLE test_owned_records(user_id TEXT REFERENCES users(id) ON DELETE CASCADE,value TEXT)');
  const insert=store.db.prepare('INSERT INTO test_owned_records VALUES(?,?)');insert.run(first.user.id,'mine');insert.run(second.user.id,'theirs');
  await assert.rejects(auth.deleteAccount(first.user.id,{password:'incorrect password'}),code('PASSWORD_CONFIRMATION_FAILED',403));assert.ok(auth.authenticate(first.token));
  assert.deepEqual(await auth.deleteAccount(first.user.id,{password}),{ok:true,deleted:true});
  assert.throws(()=>auth.authenticate(first.token),code('UNAUTHENTICATED',401));assert.equal(auth.authenticate(second.token).id,second.user.id);
  for(const table of ['sessions','profiles','wallets'])assert.equal(store.db.prepare(`SELECT count(*) AS n FROM ${table} WHERE user_id=?`).get(first.user.id).n,0);
  assert.deepEqual(store.db.prepare('SELECT value FROM test_owned_records').all().map(row=>row.value),['theirs']);
  await assert.rejects(auth.login({username:'Ninja Mira',password}),code('INVALID_CREDENTIALS',401));
});

test('accounts, wallet, profile, session and recovery survive a SQLite close and restart',async t=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'ninja-auth-'));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
  const databasePath=path.join(directory,'nested','accounts.sqlite'),now=()=>1700000000000;
  const firstStore=createNinjaStore({databasePath,now}),firstAuth=createNinjaAuth(firstStore,{now}),registered=await firstAuth.register({username:'Ninja Mira',password});
  firstStore.transaction(()=>{firstStore.db.prepare('UPDATE wallets SET balance=? WHERE user_id=?').run(45,registered.user.id);const profile=firstStore.getProfile(registered.user.id).profile;profile.highScore=1234;firstStore.putProfile(registered.user.id,profile);});
  firstStore.close();const secondStore=createNinjaStore({databasePath,now});t.after(()=>secondStore.close());const secondAuth=createNinjaAuth(secondStore,{now});
  assert.equal(secondAuth.authenticate(registered.token).id,registered.user.id);assert.equal(secondStore.getProfile(registered.user.id).profile.highScore,1234);assert.equal(secondStore.getProfile(registered.user.id).profile.coins,45);assert.equal(secondStore.getProfile(registered.user.id).revision,1);
  assert.equal(secondStore.db.prepare('SELECT count(*) AS n FROM ninja_auth_migrations').get().n,1);
  assert.ok(await secondAuth.resetPassword({username:'Ninja Mira',recoveryKey:registered.recoveryKey,password:nextPassword}));
  const bytes=Buffer.concat([fs.readFileSync(databasePath),...(fs.existsSync(`${databasePath}-wal`)?[fs.readFileSync(`${databasePath}-wal`)]:[])]);
  for(const secret of [password,registered.token,registered.recoveryKey])assert.equal(bytes.includes(Buffer.from(secret)),false);
});

test('profile JSON cannot overwrite the wallet, authenticated identity or guest flag',async t=>{
  const {store,auth}=fixture(t),registered=await auth.register({username:'Ninja Mira',password});
  const forged=structuredClone(registered.profile);forged.coins=999999;forged.player={username:'Another Ninja',guest:true,createdAt:0};
  const updated=store.transaction(()=>store.putProfile(registered.user.id,forged));assert.equal(updated.profile.coins,0);assert.equal(updated.profile.player.username,'Ninja Mira');assert.equal('guest' in updated.profile.player,false);assert.equal(updated.revision,1);
  updated.profile.coins=8;assert.equal(store.getProfile(registered.user.id).profile.coins,0);
  assert.throws(()=>store.getProfile('missing'),code('ACCOUNT_NOT_FOUND',404));assert.throws(()=>store.getUser('missing'),code('ACCOUNT_NOT_FOUND',404));
});

test('SQLite transactions roll back wallet and profile together on failure',async t=>{
  const {store,auth}=fixture(t),registered=await auth.register({username:'Ninja Mira',password});
  assert.throws(()=>store.transaction(()=>{store.db.prepare('UPDATE wallets SET balance=15 WHERE user_id=?').run(registered.user.id);store.putProfile(registered.user.id,registered.profile);throw new Error('abort');}),/abort/);
  assert.equal(store.getProfile(registered.user.id).profile.coins,0);assert.equal(store.getProfile(registered.user.id).revision,0);
  assert.throws(()=>store.transaction(()=>store.transaction(()=>{})),/Nested/);
  assert.throws(()=>store.transaction(async()=>{}),/synchronous/);
  assert.throws(()=>store.transaction(()=>{store.db.prepare('UPDATE wallets SET balance=3 WHERE user_id=?').run(registered.user.id);return Promise.resolve();}),/promises/);
  assert.equal(store.getProfile(registered.user.id).profile.coins,0);
});

test('SQLite rejects negative, fractional or orphaned wallets and oversized profiles',async t=>{
  const {store,auth}=fixture(t),registered=await auth.register({username:'Ninja Mira',password});
  for(const balance of [-1,0.5,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>store.db.prepare('UPDATE wallets SET balance=? WHERE user_id=?').run(balance,registered.user.id),/CHECK/);
  assert.throws(()=>store.db.prepare('INSERT INTO wallets VALUES(?,?)').run('unknown',4),/FOREIGN KEY/);
  assert.throws(()=>store.putProfile(registered.user.id,{...registered.profile,padding:'x'.repeat(524288)}),code('PROFILE_TOO_LARGE',413));
  assert.equal(store.getProfile(registered.user.id).revision,0);
});

test('auth migrations preserve legacy tables and reject incompatible schemas without replacement',t=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'ninja-auth-migration-'));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
  const databasePath=path.join(directory,'legacy.sqlite'),legacy=new DatabaseSync(databasePath);legacy.exec("CREATE TABLE legacy_scores(name TEXT,score INTEGER);INSERT INTO legacy_scores VALUES('Previous Ninja',42)");legacy.close();
  const migrated=createNinjaStore({databasePath});assert.equal(migrated.db.prepare('SELECT score FROM legacy_scores').get().score,42);migrated.close();
  const brokenPath=path.join(directory,'incompatible.sqlite'),broken=new DatabaseSync(brokenPath);broken.exec("CREATE TABLE users(id TEXT PRIMARY KEY,important TEXT);INSERT INTO users VALUES('existing','keep me')");broken.close();
  assert.throws(()=>createNinjaStore({databasePath:brokenPath}),/schema is incompatible|no such column/);
  const unchanged=new DatabaseSync(brokenPath);assert.equal(unchanged.prepare('SELECT important FROM users').get().important,'keep me');unchanged.close();
});

test('invalid storage and authentication configuration fails before serving requests',t=>{
  const {store}=fixture(t);
  for(const value of ['',null,42])assert.throws(()=>createNinjaStore({databasePath:value}),/databasePath/);
  assert.throws(()=>createNinjaStore({now:()=>NaN}),/clock/);
  for(const sessionTTL of [0,999,31*24*60*60*1000,NaN])assert.throws(()=>createNinjaAuth(store,{sessionTTL}),/sessionTTL/);
  for(const maxSessions of [0,1.5,21])assert.throws(()=>createNinjaAuth(store,{maxSessions}),/maxSessions/);
});

test('new accounts use one UTC daily/weekly calendar across device timezones while guests retain local dates',()=>{
  const imports={auth:new URL('../server/ninja-auth.mjs',import.meta.url).href,store:new URL('../server/ninja-store.mjs',import.meta.url).href,game:new URL('../notification-ninja/src/game.js',import.meta.url).href};
  const script=`import {createNinjaAuth} from ${JSON.stringify(imports.auth)};import {createNinjaStore} from ${JSON.stringify(imports.store)};import {NinjaGame} from ${JSON.stringify(imports.game)};const now=()=>Date.parse('2026-10-26T00:30:00Z');const store=createNinjaStore({now});const profile=(await createNinjaAuth(store,{now}).register({username:'Calendar Ninja',password:'Calendar password 123'})).profile;const guest=new NinjaGame({storage:null,now}).profile;console.log(JSON.stringify({account:{calendar:profile.accountCalendar,day:profile.journey.day,week:profile.adventure.weekly.week,daily:Object.keys(profile.journey.progress),weekly:Object.keys(profile.adventure.weekly.progress)},guest:{day:guest.journey.day,week:guest.adventure.weekly.week}}));store.close();`;
  const results=['UTC','Pacific/Auckland','America/Los_Angeles'].map(TZ=>JSON.parse(execFileSync(process.execPath,['--input-type=module','-e',script],{env:{...process.env,TZ},encoding:'utf8'})));
  for(const result of results){assert.deepEqual(result.account,results[0].account);assert.equal(result.account.calendar,'utc');assert.equal(result.account.day,'2026-10-26');assert.equal(result.account.week,'2026-W44');}
  assert.equal(results[0].guest.day,'2026-10-26');assert.equal(results[2].guest.day,'2026-10-25');assert.notEqual(results[0].guest.week,results[2].guest.week);
});
