import test from 'node:test';
import assert from 'node:assert/strict';
import {NinjaGame,STORAGE_KEY} from '../notification-ninja/src/game.js';
import {SESSION_KEY,isSignedIn,setSignedIn,deleteLocalProfile} from '../notification-ninja/src/local-profile.js';

class Storage{data=new Map();getItem(k){return this.data.get(k)??null;}setItem(k,v){this.data.set(k,String(v));}removeItem(k){this.data.delete(k);}}

test('existing named profiles stay signed in on migration while empty names do not',()=>{
  const storage=new Storage();assert.equal(isSignedIn(storage,true),true);assert.equal(isSignedIn(storage,false),false);
});
test('signing out persists and never removes the profile or wallet',()=>{
  const storage=new Storage(),game=new NinjaGame({storage});game.setUsername('Ninja Lea');const saved=storage.getItem(STORAGE_KEY);
  assert.equal(setSignedIn(storage,false).ok,true);assert.equal(isSignedIn(storage,true),false);assert.equal(storage.getItem(STORAGE_KEY),saved);
  assert.equal(setSignedIn(storage,true).ok,true);assert.equal(isSignedIn(storage,true),true);assert.equal(storage.getItem(STORAGE_KEY),saved);
});
test('deleting a local profile removes only Ninja save, session and music',()=>{
  const storage=new Storage(),game=new NinjaGame({storage});game.setUsername('Delete Ninja');setSignedIn(storage,true);
  storage.setItem('notification-ninja:music','false');storage.setItem('reboot:save','keep');storage.setItem('mind-maze:save','keep');storage.setItem('foreign','keep');
  assert.deepEqual(deleteLocalProfile(storage),{ok:true,sessionOnly:false});
  for(const key of [STORAGE_KEY,SESSION_KEY,'notification-ninja:music'])assert.equal(storage.getItem(key),null);
  for(const key of ['reboot:save','mind-maze:save','foreign'])assert.equal(storage.getItem(key),'keep');
  const fresh=new NinjaGame({storage});assert.equal(fresh.profile.player.username,'');assert.equal(fresh.profile.coins,0);assert.deepEqual(fresh.profile.unlockedSkins,['default']);
});
test('blocked storage produces an honest deletion failure and never clears unrelated keys',()=>{
  const storage={getItem:()=> 'existing',removeItem:()=>{throw new Error('blocked');}};
  assert.equal(deleteLocalProfile(storage).ok,false);assert.equal(setSignedIn({setItem:()=>{throw new Error('full');}},false).ok,false);
  assert.deepEqual(deleteLocalProfile(null),{ok:true,sessionOnly:true});
});
