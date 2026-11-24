import test from 'node:test';
import assert from 'node:assert/strict';
import {fork} from 'node:child_process';
import {once} from 'node:events';
import {mkdtemp,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {randomBytes,randomUUID} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import {Pool} from 'pg';
import {postgresConnectionOptions} from '../server/ninja-postgres-store.mjs';
import {testMfaCode} from '../server/ninja-mfa.mjs';

const password='Temporary restart acceptance password!';
const tables=['users','sessions','profiles','wallets','ninja_ledger','ninja_actions','ninja_runs','ninja_verified_scores','ninja_mfa','ninja_mfa_challenges'];
if(process.env.TEST_DATABASE_URL){
  const url=new URL(process.env.TEST_DATABASE_URL);
  if(!['postgres:','postgresql:'].includes(url.protocol)||!['127.0.0.1','localhost','[::1]'].includes(url.hostname)||url.searchParams.has('host')||url.searchParams.has('hostaddr'))throw new TypeError('Restart acceptance only permits a dedicated loopback PostgreSQL test database without host overrides.');
}

for(const dialect of ['sqlite','postgres'])test(`${dialect}: encrypted MFA, pending login and consumed recovery survive actual process restarts`,{
  skip:dialect==='postgres'&&!process.env.TEST_DATABASE_URL,timeout:90000
},async t=>{
  const directory=await mkdtemp(path.join(tmpdir(),'ninja-process-restart-'));
  const databasePath=path.join(directory,'accounts.sqlite');
  const key=randomBytes(32).toString('hex');
  const schema='mfa_restart_'+randomUUID().replaceAll('-','');
  let clock=Date.UTC(2026,10,17,12),child=null,endpoint,admin=null,databaseURL;

  async function stop(){
    if(!child)return;
    const current=child;child=null;
    if(current.exitCode!==null||current.signalCode!==null)return;
    const exit=once(current,'exit');
    const timer=setTimeout(()=>current.kill('SIGKILL'),5000);
    try{current.kill('SIGTERM');await exit;}finally{clearTimeout(timer);}
  }
  t.after(async()=>{
    try{await stop();}finally{
      try{if(admin){try{await admin.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);}finally{await admin.end();}}}
      finally{await rm(directory,{recursive:true,force:true});}
    }
  });
  if(dialect==='postgres'){
    admin=new Pool({...postgresConnectionOptions(process.env.TEST_DATABASE_URL),connectionTimeoutMillis:5000});
    await admin.query(`CREATE SCHEMA ${schema}`);
    const url=new URL(process.env.TEST_DATABASE_URL);
    url.searchParams.set('options',`-c search_path=${schema}`);databaseURL=url.href;
  }
  async function start(){
    child=fork(fileURLToPath(new URL('./fixtures/ninja-account-restart-worker.mjs',import.meta.url)),[],{
      stdio:['ignore','ignore','ignore','ipc'],
      env:{NINJA_TEST_CLOCK:String(clock),NINJA_TEST_MFA_KEY:key,
        ...(databaseURL?{NINJA_TEST_DATABASE_URL:databaseURL}:{NINJA_TEST_DATABASE_PATH:databasePath})}
    });
    const current=child;
    const ready=await new Promise((resolve,reject)=>{
      const exited=()=>{clearTimeout(timer);reject(new Error('Isolated restart worker exited before ready.'));};
      const timer=setTimeout(()=>{current.off('exit',exited);reject(new Error('Isolated restart worker did not become ready.'));},15000);
      current.once('exit',exited);current.once('error',exited);
      current.once('message',message=>{clearTimeout(timer);current.off('exit',exited);current.off('error',exited);resolve(message);});
    });
    assert.equal(ready.ready,true);endpoint=`http://127.0.0.1:${ready.port}/api/v3`;
  }
  async function api(route,{method='GET',token,body,status=200}={}){
    const response=await fetch(endpoint+route,{method,signal:AbortSignal.timeout(15000),headers:{
      ...(token?{Authorization:`Bearer ${token}`} :{}),...(body!==undefined?{'Content-Type':'application/json'}:{})
    },...(body!==undefined?{body:JSON.stringify(body)}:{})});
    const result=await response.json();
    assert.equal(response.status,status,`${method} ${route}: ${result.code||'unexpected status'}`);return result;
  }
  async function register(username){return api('/auth/register',{method:'POST',status:201,body:{
    username,email:username.replaceAll(' ','').toLowerCase()+'@example.test',password,passwordConfirmation:password,privacyAccepted:true
  }});}
  const login=()=>api('/auth/login',{method:'POST',body:{username:'Restart Alpha',password}});
  const verify=(challenge,code,status=200)=>api('/auth/mfa/verify',{method:'POST',status,body:{challenge,code}});

  await start();
  const alpha=await register('Restart Alpha'),beta=await register('Restart Beta');
  await api('/actions',{method:'POST',token:beta.token,body:{type:'settings.update',payload:{language:'en'},idempotencyKey:'restart-beta-language'}});
  const betaBefore=await api('/me',{token:beta.token});
  const setup=await api('/mfa/setup',{method:'POST',token:alpha.token,body:{password}});
  const confirmed=await api('/mfa/confirm',{method:'POST',token:alpha.token,body:{code:testMfaCode(setup.secret,Math.floor(clock/30000))}});
  assert.equal(confirmed.recoveryCodes.length,10);
  const pending=await login();assert.equal(pending.mfaRequired,true);assert.equal(pending.token,undefined);
  await api('/me',{token:pending.challenge,status:401});

  await stop();clock+=31000;await start();
  assert.deepEqual((await api('/me',{token:beta.token})).profile,betaBefore.profile);
  const status=await api('/mfa/status',{token:alpha.token});
  assert.deepEqual(status,{enabled:true,available:true,recoveryCodesRemaining:10});
  const authenticated=await verify(pending.challenge,testMfaCode(setup.secret,Math.floor(clock/30000)));
  assert.equal((await api('/me',{token:authenticated.token})).user.id,alpha.user.id);
  await verify(pending.challenge,confirmed.recoveryCodes[0],401);
  const recoveryLogin=await login();
  const recovered=await verify(recoveryLogin.challenge,confirmed.recoveryCodes[0]);
  assert.equal((await api('/mfa/status',{token:recovered.token})).recoveryCodesRemaining,9);

  await stop();clock+=31000;await start();
  assert.equal((await api('/me',{token:recovered.token})).user.id,alpha.user.id);
  const spent=await login();await verify(spent.challenge,confirmed.recoveryCodes[0],401);
  assert.equal((await api('/mfa/status',{token:recovered.token})).recoveryCodesRemaining,9);
  await api('/auth/logout',{method:'POST',token:recovered.token});
  await api('/me',{token:recovered.token,status:401});
  assert.deepEqual((await api('/me',{token:beta.token})).profile,betaBefore.profile);
  for(const account of [alpha,beta])await api('/account',{method:'DELETE',token:account.token,body:{password}});
  await stop();

  if(admin){
    for(const table of tables)assert.equal(Number((await admin.query(`SELECT count(*) AS n FROM ${schema}.${table}`)).rows[0].n),0,`${table} cascades on deletion`);
  }else{
    const db=new DatabaseSync(databasePath);
    try{for(const table of tables)assert.equal(db.prepare(`SELECT count(*) AS n FROM ${table}`).get().n,0,`${table} cascades on deletion`);}finally{db.close();}
  }
});
