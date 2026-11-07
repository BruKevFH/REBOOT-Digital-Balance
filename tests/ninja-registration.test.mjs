import test from 'node:test';
import assert from 'node:assert/strict';
import {validateRegistration,createAccounts,ACCOUNT_SESSION_KEY} from '../notification-ninja/src/accounts.js';

const signup={username:'Focus Ninja',email:'ninja@example.test',password:'correct-horse-42',passwordConfirmation:'correct-horse-42',privacyAccepted:true};
test('registration form requires matching passwords and explicit privacy consent',()=>{
 assert.equal(validateRegistration(signup).ok,true);
 assert.equal(validateRegistration({...signup,passwordConfirmation:'other-password'}).field,'passwordConfirmation');
 for(const privacyAccepted of [false,undefined,'on',1])assert.equal(validateRegistration({...signup,privacyAccepted}).field,'privacyAccepted');
 for(const email of ['broken','ninja@','a b@example.test'])assert.equal(validateRegistration({...signup,email}).field,'email');
});

test('registration transmits consent and confirmation but never retains credentials in session cache',async()=>{
 const memory=new Map(),calls=[],storage={getItem:key=>memory.get(key)||null,setItem:(key,value)=>memory.set(key,value),removeItem:key=>memory.delete(key),get length(){return memory.size;},key:i=>[...memory.keys()][i]};
 const client=createAccounts({baseURL:'http://localhost:8083/notification-ninja/',sessionStorage:storage,fetchImpl:async(url,options)=>{calls.push({url,options});return {ok:true,status:200,json:async()=>url.endsWith('accounts-config.json')?{enabled:true,endpoint:'/api/v3'}:{token:'x'.repeat(43),expiresAt:Date.now()+60000,user:{id:'ninja-a',username:signup.username},profile:{coins:0,player:{username:signup.username}},revision:0}};}});
 await client.register(signup);
 assert.deepEqual(JSON.parse(calls.at(-1).options.body),signup);
 assert.equal(calls.at(-1).options.credentials,'omit');
 const cached=storage.getItem(ACCOUNT_SESSION_KEY);
 for(const secret of [signup.password,signup.passwordConfirmation,signup.email])assert.equal(cached.includes(secret),false);
 assert.equal(client.getSession().user.username,signup.username);
});
