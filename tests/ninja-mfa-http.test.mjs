import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {createNinjaServer} from '../server/ninja-service.mjs';
import {testMfaCode} from '../server/ninja-mfa.mjs';
const password='A strong HTTP ninja password 2026';
const mfaKey='ab'.repeat(32);
async function fixture(t,{key=mfaKey}={}){
 let time=1711111110000;
 const app=createNinjaServer({now:()=>time,mfaKey:key});
 app.listen(0,'127.0.0.1');await once(app,'listening');
 const address='http://127.0.0.1:'+app.address().port+'/api/v3';
 t.after(()=>new Promise(resolve=>app.close(resolve)));
 const api=async(route,{method='GET',token,body}={})=>{
  const response=await fetch(address+route,{method,headers:{...(token?{Authorization:'Bearer '+token}:{}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
  return {status:response.status,data:await response.json()};
 };
 return {api,now:()=>time,advance:ms=>{time+=ms;}};
}
test('HTTP MFA requires real second factor before any server session token exists',async t=>{
 const {api,now,advance}=await fixture(t);
 const created=await api('/auth/register',{method:'POST',body:{username:'HTTP Ninja',email:'httpninja@example.test',password,passwordConfirmation:password,privacyAccepted:true}});
 assert.equal(created.status,201);
 const registration=created.data;
 let result=await api('/mfa/status',{token:registration.token});
 assert.equal(result.status,200);assert.equal(result.data.enabled,false);assert.equal(result.data.available,true);
 result=await api('/mfa/setup',{method:'POST',token:registration.token,body:{password}});
 assert.equal(result.status,200);assert(result.data.otpauthUri.startsWith('otpauth://totp/'));
 const secret=result.data.secret;
 result=await api('/mfa/confirm',{method:'POST',token:registration.token,body:{code:testMfaCode(secret,Math.floor(now()/30000))}});
 assert.equal(result.status,200);assert.equal(result.data.recoveryCodes.length,10);
 advance(31000);
 const begin=await api('/auth/login',{method:'POST',body:{username:'HTTP Ninja',password}});
 assert.equal(begin.status,200);assert.equal(begin.data.mfaRequired,true);assert.equal(begin.data.token,undefined);
 assert.equal((await api('/me',{token:begin.data.challenge})).status,401);
 assert.equal((await api('/mfa/setup',{method:'POST',token:begin.data.challenge,body:{password}})).status,401);
 const done=await api('/auth/mfa/verify',{method:'POST',body:{challenge:begin.data.challenge,code:testMfaCode(secret,Math.floor(now()/30000))}});
 assert.equal(done.status,200);assert.match(done.data.token,/^[A-Za-z0-9_-]{43}$/);
 assert.equal((await api('/me',{token:done.data.token})).status,200);
 assert.equal((await api('/auth/mfa/verify',{method:'POST',body:{challenge:begin.data.challenge,code:testMfaCode(secret,Math.floor(now()/30000))}})).status,401);
});
test('MFA enrollment fails safely without Render key, while regular accounts remain usable',async t=>{
 const {api}=await fixture(t,{key:null});
 const registered=await api('/auth/register',{method:'POST',body:{username:'No Key Ninja',password}});
 assert.equal(registered.status,201);
 const status=await api('/mfa/status',{token:registered.data.token});
 assert.equal(status.status,200);assert.equal(status.data.available,false);
 const setup=await api('/mfa/setup',{method:'POST',token:registered.data.token,body:{password}});
 assert.equal(setup.status,503);assert.equal(setup.data.code,'MFA_UNAVAILABLE');
 const login=await api('/auth/login',{method:'POST',body:{username:'No Key Ninja',password}});
 assert.equal(login.status,200);assert(login.data.token);
});
