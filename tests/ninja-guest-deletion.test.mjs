import test from 'node:test';
import assert from 'node:assert/strict';
import {deleteGuestProfile} from '../notification-ninja/src/guest-profile-deletion.js';
import {STORAGE_KEY} from '../notification-ninja/src/game.js';
import {SESSION_KEY} from '../notification-ninja/src/local-profile.js';
import {MAIN_MISSIONS} from '../notification-ninja/src/adventure.js';
import {EN_HOME} from '../notification-ninja/src/locales/en-home.js';
import {readFileSync} from 'node:fs';

const oldKey='notification-ninja:leaderboard:v1';
function storage(){
  const items=new Map([[STORAGE_KEY,'existing-game'],[SESSION_KEY,'signed-in'],[oldKey,'old-credential']]);
  return {items,getItem:key=>items.get(key)??null,removeItem:key=>items.delete(key)};
}
test('guest deletion removes local data after confirmed old leaderboard deletion',async()=>{
  const s=storage(),calls=[];
  const r=await deleteGuestProfile({storage:s,leaderboard:{async init(){calls.push('init')},async deletePlayer(){calls.push('delete');s.removeItem(oldKey);return {ok:true}}}});
  assert.deepEqual(calls,['init','delete']);
  assert.equal(r.ok,true);assert.equal(r.localOnly,false);assert.equal(s.getItem(STORAGE_KEY),null);assert.equal(s.getItem(SESSION_KEY),null);assert.equal(s.getItem(oldKey),null);
});
test('a failed old leaderboard delete preserves guest progress by default',async()=>{
  const s=storage();const r=await deleteGuestProfile({storage:s,leaderboard:{async init(){},async deletePlayer(){return {ok:false}}}});
  assert.equal(r.ok,false);assert.equal(r.remotePending,true);assert.equal(s.getItem(STORAGE_KEY),'existing-game');assert.equal(s.getItem(oldKey),'old-credential');
});
test('an exception during remote deletion never reports successful deletion',async()=>{
  const s=storage();const r=await deleteGuestProfile({storage:s,leaderboard:{async init(){throw Error('offline')},async deletePlayer(){throw Error('not called')}}});
  assert.equal(r.ok,false);assert.equal(r.remotePending,true);assert.equal(s.getItem(STORAGE_KEY),'existing-game');
});
test('explicit local-only deletion retains a possible old online deletion credential',async()=>{
  const s=storage();let calls=0;
  const r=await deleteGuestProfile({storage:s,allowLocalOnly:true,leaderboard:{async init(){calls++},async deletePlayer(){calls++;return {ok:false}}}});
  assert.equal(r.ok,true);assert.equal(r.localOnly,true);assert.equal(r.remotePending,true);assert.equal(calls,0);assert.equal(s.getItem(STORAGE_KEY),null);assert.equal(s.getItem(oldKey),'old-credential');
});
test('blocked local storage does not claim successful deletion',async()=>{
  const s=storage();
  const r=await deleteGuestProfile({storage:s,leaderboard:{async init(){},async deletePlayer(){return {ok:true}}},deleteLocal:()=>({ok:false,reason:'storage blocked'})});
  assert.equal(r.ok,false);assert.equal(r.reason,'storage blocked');assert.equal(s.getItem(STORAGE_KEY),'existing-game');
});
test('public homepage and English copy describe the 18 main missions accurately',()=>{
  const german='18 Hauptmissionen in drei Kapiteln führen durch Lernen, Gaming und Schlaf. Acht zusätzliche Herausforderungen und drei Bosse warten danach auf dich.';
  const page=readFileSync('notification-ninja/home.html','utf8');
  assert.equal(MAIN_MISSIONS.length,18);assert(page.includes(german));assert.equal(typeof EN_HOME[german],'string');assert.match(EN_HOME[german],/18 main missions/);
  assert(!page.includes('Acht verbundene Missionen'));
});
