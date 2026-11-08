import test from 'node:test';
import assert from 'node:assert/strict';
import {createNinjaStore} from '../server/ninja-store.mjs';
import {createNinjaAuth} from '../server/ninja-auth.mjs';
import {createNinjaServer} from '../server/ninja-service.mjs';
import {base32,fromBase32,totp,checkTotp,mfaCrypto} from '../server/ninja-mfa.mjs';
import {once} from 'node:events';

const key='a'.repeat(64);
const password='Very secure Nina 2026 Password';
const user='MFA Ninja';
const credential={username:user,password,email:'mfa@example.test',passwordConfirmation:password,privacyAccepted:true};
const stamp=1700000000000;
const err=code=>error=>error.code===code;
function fixture(t){
 let time=stamp;const store=createNinjaStore({now:()=>time}),auth=createNinjaAuth(store,{now:()=>time,mfaKey:key});
 t.after(()=>store.close());return {store,auth,now:()=>time,tick:ms=>time+=ms};
}
test('TOTP matches well-known RFC 6238 SHA1 vectors with 6-digit truncation',()=>{
 const secret=base32(Buffer.from('12345678901234567890'));
 assert.equal(fromBase32(secret).toString(),'12345678901234567890');
 assert.equal(totp(secret,59/30|0),'287082');
 assert.equal(totp(secret,1111111109/30|0),'081804');
 assert.equal(checkTotp(secret,'287082',59000,-1),1);
 assert.equal(checkTotp(secret,'287082',59000,1),null,'replay of counter is forbidden');
});
test('encrypted secrets cannot be read or modified without the configured key',()=>{
 const crypt=mfaCrypto(key),text='ALPHABASE32SECRETABCDEF';
 const encoded=crypt.encrypt(text);
 assert(!encoded.includes(text));assert.equal(crypt.decrypt(encoded),text);
 assert.notEqual(crypt.encrypt(text),encoded,'randomized nonce');
 assert.throws(()=>mfaCrypto('b'.repeat(64)).decrypt(encoded),err('MFA_CONFIGURATION'));
 assert.equal(mfaCrypto('not-a-key'),null);
});
test('MFA setup requires password, confirmation, produces one-time recovery codes and encrypted database values',async t=>{
 const {store,auth}=fixture(t),registered=await auth.register(credential);
 assert.deepEqual(await auth.mfa.status(registered.user.id),{available:true,enabled:false,pending:false});
 await assert.rejects(auth.mfa.begin(registered.user.id,'wrong'),err('PASSWORD_CONFIRMATION_FAILED'));
 const setup=await auth.mfa.begin(registered.user.id,password);
 assert(setup.uri.startsWith('otpauth://totp/Notification%20Ninja'));
 assert(!JSON.stringify(store.db.prepare('SELECT * FROM ninja_mfa').all()).includes(setup.secret));
 await assert.rejects(auth.mfa.confirm(registered.user.id,'123456'),err('INVALID_MFA'));
 const period=Math.floor(stamp/30000),backup=await auth.mfa.confirm(registered.user.id,totp(setup.secret,period),registered.token);
 assert.equal(backup.enabled,true);assert.equal(backup.recoveryCodes.length,10);
 assert.equal(new Set(backup.recoveryCodes).size,10);
 const row=store.db.prepare('SELECT * FROM ninja_mfa WHERE user_id=?').get(registered.user.id);
 assert.equal(row.enabled,1);
 assert.equal(row.pending_secret,'');
 for(const secret of [setup.secret,...backup.recoveryCodes])assert(!JSON.stringify(row).includes(secret));
 assert.equal((await auth.mfa.status(registered.user.id)).enabled,true);
});
test('password login is never authenticated before MFA and challenge retry/replay are blocked',async t=>{
 const {auth,store,tick,now}=fixture(t),registered=await auth.register(credential);
 const setup=await auth.mfa.begin(registered.user.id,password);
 const backup=(await auth.mfa.confirm(registered.user.id,totp(setup.secret,Math.floor(now()/30000)),registered.token)).recoveryCodes;
 const result=await auth.login({username:user,password});
 assert.equal(result.mfaRequired,true);assert(!('token' in result));
 await assert.rejects(auth.mfa.verifyLogin(result.challenge,'123456'),err('INVALID_MFA'));
 const attempts=store.db.prepare('SELECT attempts FROM ninja_mfa_challenges WHERE challenge_hash=?').get((await import('node:crypto')).createHash('sha256').update(result.challenge).digest('hex')).attempts;
 assert.equal(attempts,1,'failed attempts persist and cannot be rolled back');
 tick(31_000);
 const logged=await auth.mfa.verifyLogin(result.challenge,totp(setup.secret,Math.floor(now()/30000)));
 assert(logged.token);assert.equal((await auth.authenticate(logged.token)).id,registered.user.id);
 const another=await auth.login({username:user,password});
 await assert.rejects(auth.mfa.verifyLogin(another.challenge,totp(setup.secret,Math.floor(now()/30000))),err('INVALID_MFA'));
 const byBackup=await auth.mfa.verifyLogin(another.challenge,backup[0]);
 assert(byBackup.token);
 const third=await auth.login({username:user,password});
 await assert.rejects(auth.mfa.verifyLogin(third.challenge,backup[0]),err('INVALID_MFA'));
 for(let i=0;i<5;i++)await assert.rejects(auth.mfa.verifyLogin(third.challenge,'000000'),err('INVALID_MFA'));
 await assert.rejects(auth.mfa.verifyLogin(third.challenge,backup[1]),err('INVALID_MFA'));
});
test('recovery codes remain single-use and account recovery cannot bypass MFA',async t=>{
 const {auth,tick,now}=fixture(t),registered=await auth.register(credential);
 const setup=await auth.mfa.begin(registered.user.id,password);
 const code=totp(setup.secret,Math.floor(now()/30000));
 const backup=(await auth.mfa.confirm(registered.user.id,code,registered.token)).recoveryCodes;
 await assert.rejects(auth.resetPassword({username:user,password:'Changed secure password 2026',recoveryKey:registered.recoveryKey}),err('MFA_REQUIRED'));
 const reset=await auth.resetPassword({username:user,password:'Changed secure password 2026',recoveryKey:registered.recoveryKey,mfaCode:backup[0]});
 assert(reset.token);
 assert.equal((await auth.login({username:user,password:'Changed secure password 2026'})).mfaRequired,true);
 await assert.rejects(auth.resetPassword({username:user,password:'Yet another secure password',recoveryKey:registered.recoveryKey,mfaCode:backup[1]}),err('INVALID_RECOVERY'));
 tick(31_000);
 await assert.rejects(auth.mfa.disable(registered.user.id,password,'123456'),err('PASSWORD_CONFIRMATION_FAILED'));
 const disable=await auth.mfa.disable(registered.user.id,'Changed secure password 2026',totp(setup.secret,Math.floor(now()/30000)),reset.token);
 assert.equal(disable.enabled,false);
 const login=await auth.login({username:user,password:'Changed secure password 2026'});
 assert(login.token);assert(!login.mfaRequired);
});
test('without a server encryption key, MFA setup fails closed but existing password accounts still work',async t=>{
 const store=createNinjaStore();t.after(()=>store.close());
 const auth=createNinjaAuth(store,{mfaKey:''}),registered=await auth.register(credential);
 assert.equal((await auth.mfa.status(registered.user.id)).available,false);
 await assert.rejects(auth.mfa.begin(registered.user.id,password),err('MFA_NOT_CONFIGURED'));
 assert((await auth.login({username:user,password})).token);
});
test('HTTP login with MFA returns only challenge and no authenticated bearer token',async t=>{
 let time=stamp;const server=createNinjaServer({mfaKey:key,now:()=>time});
 t.after(()=>server.listening?new Promise(resolve=>server.close(resolve)):undefined);
 server.listen(0,'127.0.0.1');await once(server,'listening');
 const endpoint='http://127.0.0.1:'+server.address().port+'/api/v3';
 async function post(route,body,token){
  const response=await fetch(endpoint+route,{method:'POST',headers:{'content-type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)});
  return {status:response.status,body:await response.json()};
 }
 const register=await post('/auth/register',credential);assert.equal(register.status,201);
 const userId=register.body.user.id;
 const setup=await post('/auth/mfa/setup',{password},register.body.token);assert.equal(setup.status,200);
 const enabled=await post('/auth/mfa/confirm',{code:totp(setup.body.secret,Math.floor(time/30000))},register.body.token);
 assert.equal(enabled.status,200);assert.equal(enabled.body.enabled,true);
 const first=await post('/auth/login',{username:user,password});
 assert.equal(first.status,200);assert(first.body.mfaRequired);assert(!first.body.token);assert(!first.body.profile);
 time+=31_000;
 const verify=await post('/auth/mfa/verify',{challenge:first.body.challenge,code:totp(setup.body.secret,Math.floor(time/30000))});
 assert.equal(verify.status,200);
 assert.equal(verify.body.user.id,userId);
 assert(verify.body.token);
});
