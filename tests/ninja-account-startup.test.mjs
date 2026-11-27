import test from 'node:test';
import assert from 'node:assert/strict';
import {createAccountStartup} from '../notification-ninja/src/account-startup.js';
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};
function fixture({session={user:{id:'account-a'},token:'token-a'},init=async()=>({configured:true}),warmup=async()=>({online:true}),restore}={}){
 const calls={init:0,warmup:0,restore:0,forget:0};let current=session;
 const accounts={getSession:()=>current,init:async()=>{calls.init++;return init();},warmup:async options=>{calls.warmup++;return warmup(options);},restore:async options=>{calls.restore++;return restore?restore(options):{user:{id:'account-a'},profile:{coins:40},revision:2};},forget(){calls.forget++;current=null;}};
 return {accounts,calls,setSession:value=>{current=value;}};
}
test('anonymous startup never waits for API health or requests an authenticated profile',async()=>{
 const config=deferred(),f=fixture({session:null,init:()=>config.promise});let applied=false;
 const startup=createAccountStartup({accounts:f.accounts,apply:()=>{applied=true;}}),work=startup.start();
 assert.deepEqual(f.calls,{init:1,warmup:0,restore:0,forget:0});config.resolve({configured:true});assert.equal(await work,null);assert.equal(applied,false);assert.equal(f.calls.warmup,0);
});
test('a saved account is restored only after a healthy connection',async()=>{
 const health=deferred(),f=fixture({warmup:()=>health.promise}),applied=[];
 const startup=createAccountStartup({accounts:f.accounts,apply:r=>applied.push(r)}),work=startup.start();
 await Promise.resolve();assert.equal(f.calls.restore,0);health.resolve({online:true});await work;assert.equal(applied[0].profile.coins,40);assert.equal(f.calls.restore,1);
});
test('navigation during connection defers the profile instead of replacing the guest view',async()=>{
 const health=deferred(),f=fixture({warmup:()=>health.promise});let route='landing',applied=0;
 const startup=createAccountStartup({accounts:f.accounts,capture:()=>route,canApply:initial=>route===initial,apply:()=>applied++}),work=startup.start();
 route='playing';health.resolve({online:true});await work;assert.equal(applied,0);assert.equal(startup.takeReady().user.id,'account-a');assert.equal(startup.takeReady(),null);
});
test('choosing guest mode cancels even a health fetch that ignores its abort signal',async()=>{
 const health=deferred(),f=fixture({warmup:()=>health.promise});let applied=0;
 const startup=createAccountStartup({accounts:f.accounts,apply:()=>applied++}),work=startup.start();await Promise.resolve();startup.cancel({forget:true});health.resolve({online:true});await work;
 assert.equal(f.calls.forget,1);assert.equal(f.calls.restore,0);assert.equal(applied,0);
});
test('a late profile from an earlier session cannot replace the current account',async()=>{
 const response=deferred(),f=fixture({restore:()=>response.promise});let applied=0;
 const startup=createAccountStartup({accounts:f.accounts,apply:()=>applied++}),work=startup.start();await Promise.resolve();await Promise.resolve();f.setSession({user:{id:'account-b'},token:'token-b'});response.resolve({user:{id:'account-a'},profile:{coins:900}});await work;assert.equal(applied,0);assert.equal(startup.takeReady(),null);
});
test('deferred state is discarded after a session switch and unavailable health stays nonfatal',async()=>{
 const f=fixture(),startup=createAccountStartup({accounts:f.accounts,canApply:()=>false});await startup.start();f.setSession(null);assert.equal(startup.takeReady(),null);
 const offline=fixture({warmup:async()=>({online:false})});await createAccountStartup({accounts:offline.accounts,apply:()=>assert.fail('offline restore applied')}).start();assert.equal(offline.calls.restore,0);
});
