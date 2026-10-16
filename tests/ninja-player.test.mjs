import test from 'node:test';
import assert from 'node:assert/strict';
import {NinjaGame,STORAGE_KEY} from '../notification-ninja/src/game.js';
import {GUIDE_IDS,normalizePlayer,validateUsername,getPlayerProgress} from '../notification-ninja/src/player.js';

class Storage {
  data = new Map();
  getItem(key) { return this.data.get(key) ?? null; }
  setItem(key,value) { this.data.set(key,String(value)); }
}

test('username normalization supports Unicode letters and consistent, trimmed spaces', () => {
  for (const [value,expected] of [
    ['  Ninja   Kai  ','Ninja Kai'],['E\u0301loïse_7','Éloïse_7'],
    ['忍者少年','忍者少年'],['Ömer-25','Ömer-25'],['A\u00a0\u2003B','A B']
  ]) {
    assert.deepEqual(validateUsername(value),{ok:true,username:expected});
  }
  assert.equal(validateUsername('x'.repeat(3)).ok,true);
  assert.equal(validateUsername('x'.repeat(18)).ok,true);
  assert.equal(validateUsername('x'.repeat(19)).ok,false);
});

test('username validation rejects short names, markup, email addresses and hidden controls', () => {
  for (const value of [
    '', '  ', 'ab', 'a'.repeat(19), null, 123, {}, '<b>Ninja</b>',
    'a@b.de','Ninja!','Ninja🎮','Ninja\nKai','Ninja\tKai','Ninja\r',
    'Nin\u0000ja','Nin\u200bja','Ninja\u2028Kai','Ninja\u2029Kai'
  ]) {
    const result=validateUsername(value);
    assert.equal(result.ok,false,String(value));
    assert.ok(result.reason.length>0);
    assert.equal(result.username,'');
  }
});

test('normalizing player data is detached, bounded and preserves known guide acknowledgements only', () => {
  const profile={player:{username:'  Nina   8 ',createdAt:1e20,guideSeen:['welcome','unknown','welcome','first-skill',5]}};
  const before=structuredClone(profile),player=normalizePlayer(profile);
  assert.deepEqual(profile,before);
  assert.deepEqual(player,{username:'Nina 8',createdAt:8640000000000000,guideSeen:['welcome','first-skill'],notifications:[]});
  player.guideSeen.push('shop');
  assert.deepEqual(profile,before);
  assert.deepEqual(normalizePlayer({player:{username:'<bad>',createdAt:123,guideSeen:['shop'],notifications:[]}}),
    {username:'',createdAt:0,guideSeen:['shop'],notifications:[]});
  assert.deepEqual(normalizePlayer(null),{username:'',createdAt:0,guideSeen:[],notifications:[]});
});

test('setting a username changes only identity, creates its timestamp once and never grants coins', () => {
  const storage=new Storage();let time=1000;
  const game=new NinjaGame({storage,now:()=>time});game.profile.coins=87;
  const before=structuredClone(game.profile);
  assert.deepEqual(game.setUsername('  Ninja   Mira  '),{ok:true,username:'Ninja Mira'});
  assert.deepEqual(game.profile,{...before,player:{username:'Ninja Mira',createdAt:1000,guideSeen:[],notifications:[]}});
  time=9000;assert.equal(game.setUsername('Mira_9').ok,true);
  assert.equal(game.profile.player.createdAt,1000);assert.equal(game.profile.coins,87);
  const restored=new NinjaGame({storage});assert.deepEqual(restored.profile.player,game.profile.player);
});

test('rejected username edits are atomic for the profile, active run and persisted save', () => {
  const storage=new Storage(),game=new NinjaGame({storage});
  game.setUsername('Ninja Lea');game.start({mode:'study'});game.nextLevel();
  const before=game.getSnapshot(),saved=storage.getItem(STORAGE_KEY);
  for (const name of ['x','<img>','a@b.de','Lea\nNinja']) {
    assert.equal(game.setUsername(name).ok,false);
    assert.deepEqual(game.getSnapshot(),before);
    assert.equal(storage.getItem(STORAGE_KEY),saved);
  }
});

test('guide acknowledgement validates IDs and remains idempotent across profile edits and reloads', () => {
  const storage=new Storage(),game=new NinjaGame({storage});game.setUsername('Ninja Ari');
  assert.equal(new Set(GUIDE_IDS).size,GUIDE_IDS.length);
  const before=game.getSnapshot();assert.equal(game.markGuideSeen('not-a-guide').ok,false);assert.deepEqual(game.getSnapshot(),before);
  assert.equal(game.markGuideSeen('welcome').ok,true);assert.equal(game.markGuideSeen('welcome').ok,true);
  assert.equal(game.markGuideSeen('training-swipe').ok,true);game.setUsername('Ari_2');
  assert.deepEqual(game.profile.player.guideSeen,['welcome','training-swipe']);
  const restored=new NinjaGame({storage});assert.deepEqual(restored.profile.player,game.profile.player);
  assert.equal(restored.markGuideSeen('welcome').ok,true);assert.equal(restored.profile.player.guideSeen.length,2);
});

test('each authored unlock has a persistent guide acknowledgement and unknown or repeated IDs stay bounded', () => {
  const storage=new Storage(),game=new NinjaGame({storage});
  for (const id of ['skill:slow-super','skill:shield-super','skill:sweep-super','world:gaming',
    'background:paper-garden','skin:solar','achievement:flow-five']) {
    assert.equal(game.markGuideSeen(id).ok,true,id);
    assert.equal(game.markGuideSeen(id).ok,true,id);
  }
  const expected=[...game.profile.player.guideSeen];
  for (const id of ['skill:__proto__','world:unknown','background:paper-garden<script>',
    'skin:bogus','achievement:first-cut\u0000']) assert.equal(game.markGuideSeen(id).ok,false,id);
  assert.deepEqual(game.profile.player.guideSeen,expected);
  const restored=new NinjaGame({storage});assert.deepEqual(restored.profile.player.guideSeen,expected);
  const hostile={player:{username:'Ninja Kai',guideSeen:[...Array(10000).fill('unknown'),...GUIDE_IDS,...GUIDE_IDS]}};
  assert.deepEqual(normalizePlayer(hostile).guideSeen,GUIDE_IDS);
});

test('player identity survives real skill and world purchases, background selection and reward claiming', () => {
  const game=new NinjaGame({storage:new Storage(),now:()=>100});
  game.setUsername('Ninja Finn');game.markGuideSeen('shop');game.profile.coins=400;
  const player=structuredClone(game.profile.player);
  assert.equal(game.buySkill('focus-root').ok,true);
  assert.equal(game.buyWorld('gaming').ok,true);
  assert.equal(game.buyBackground('paper-garden').ok,true);
  assert.equal(game.selectBackground('paper-garden').ok,true);
  assert.equal(game.claimAchievement('first-skill').ok,true);
  assert.deepEqual(game.profile.player,player);
});

test('legacy progression migrates without resetting coins, skins, skills, worlds, achievements or counters', () => {
  const storage=new Storage(),game=new NinjaGame({storage});game.profile.coins=500;
  game.buyWorld('gaming');game.buySkill('focus-root');game.buySkill('slow-super');game.buySkin('solar');game.selectSkin('solar');
  game.profile.stats.correct=123;game.profile.stats.superUses=4;game.profile.totalRuns=8;game.save();
  const saved=JSON.parse(storage.getItem(STORAGE_KEY));delete saved.profile.player;storage.setItem(STORAGE_KEY,JSON.stringify(saved));
  const expected=structuredClone(saved.profile),restored=new NinjaGame({storage});
  assert.equal(restored.storageFailed,false);
  assert.deepEqual(restored.profile,{...expected,unlockedSkins:[...expected.unlockedSkins,'dawn'],journey:{...expected.journey,seenRanks:['dawn']},player:{username:'',createdAt:0,guideSeen:[],notifications:[]}});
  const xp=getPlayerProgress(restored.profile);
  assert.equal(xp.xp,123*5+4*10+8*25);
  restored.setUsername('Veteran');
  assert.equal(restored.profile.coins,expected.coins);assert.deepEqual(restored.profile.unlockedSkills,expected.unlockedSkills);
});

test('damaged player identity is repaired independently of a valid active saved run', () => {
  const storage=new Storage(),game=new NinjaGame({storage});game.profile.coins=42;
  game.start({mode:'study'});game.nextLevel();game.pause();
  const saved=JSON.parse(storage.getItem(STORAGE_KEY));saved.profile.player={username:'<script>',createdAt:-99,guideSeen:['shop','bogus']};
  storage.setItem(STORAGE_KEY,JSON.stringify(saved));const restored=new NinjaGame({storage});
  assert.equal(restored.storageFailed,false);assert.equal(restored.state.scene,'playing');assert.equal(restored.state.paused,true);assert.equal(restored.profile.coins,42);
  assert.deepEqual(restored.profile.player,{username:'',createdAt:0,guideSeen:['shop'],notifications:[]});
});

test('XP is derived from completed gameplay counters with cumulative square level thresholds', () => {
  assert.deepEqual(getPlayerProgress({}),{xp:0,level:1,currentXP:0,nextXP:100,needed:100,progress:0});
  assert.deepEqual(getPlayerProgress({stats:{correct:15},totalRuns:1}),{xp:100,level:2,currentXP:100,nextXP:400,needed:300,progress:0});
  assert.deepEqual(getPlayerProgress({stats:{correct:50,superUses:5},totalRuns:4}),{xp:400,level:3,currentXP:400,nextXP:900,needed:500,progress:0});
  const midway=getPlayerProgress({stats:{correct:40},totalRuns:1,xp:999999,level:100});
  assert.equal(midway.xp,225);assert.equal(midway.level,2);assert.equal(midway.currentXP,100);assert.equal(midway.nextXP,400);assert.equal(midway.needed,175);assert.equal(midway.progress,125/300);
});

test('XP rejects invalid counters, truncates fractions and saturates all integer fields safely', () => {
  assert.equal(getPlayerProgress({stats:{correct:NaN,superUses:Infinity},totalRuns:-1}).xp,0);
  assert.equal(getPlayerProgress({stats:{correct:'10',superUses:2.9},totalRuns:1.8}).xp,45);
  for (const profile of [null,[],{stats:[]}, {stats:{correct:Infinity},totalRuns:'9'}]) assert.equal(getPlayerProgress(profile).xp,0);
  const max=getPlayerProgress({stats:{correct:Number.MAX_SAFE_INTEGER,superUses:Number.MAX_SAFE_INTEGER},totalRuns:Number.MAX_SAFE_INTEGER});
  assert.equal(max.xp,Number.MAX_SAFE_INTEGER);assert.equal(max.nextXP,Number.MAX_SAFE_INTEGER);assert.equal(max.needed,0);assert.equal(max.progress,1);
  for (const key of ['xp','level','currentXP','nextXP','needed']) {assert.ok(Number.isSafeInteger(max[key]),key);assert.ok(max[key]>=0,key);}
});

test('identity can be set when storage is blocked and exported snapshots remain detached', () => {
  const storage={getItem(){return null;},setItem(){throw new Error('blocked');}};
  const game=new NinjaGame({storage,now:()=>1000});
  assert.equal(game.setUsername('Offline Ninja').ok,true);assert.equal(game.markGuideSeen('welcome').ok,true);assert.equal(game.storageFailed,true);
  const snapshot=game.getSnapshot();snapshot.profile.player.username='Changed';snapshot.profile.player.guideSeen.push('shop');
  assert.equal(game.profile.player.username,'Offline Ninja');assert.deepEqual(game.profile.player.guideSeen,['welcome']);
  const exported=game.exportData();assert.equal(exported.version,'1.8.0');assert.equal(exported.profile.player.username,'Offline Ninja');
  assert.equal(game.start({mode:'study'}).ok,true);
});

test('notifications accept authored unlocks and canonical bounded level numbers only', () => {
  const storage=new Storage(),game=new NinjaGame({storage});game.setUsername('Ninja Kai');
  for (const [type,ref] of [['skill','sweep-super'],['world','gaming'],['background','paper-garden'],
    ['skin','solar'],['achievement','first-cut'],['level','2'],['level','100000']]) {
    const result=game.addNotification({type,ref});
    assert.equal(result.ok,true,`${type}:${ref}`);
    assert.equal(result.notification.id,`${type}:${ref}`);
    assert.equal(result.notification.read,false);
  }
  const before=game.getSnapshot(),saved=storage.getItem(STORAGE_KEY);
  for (const value of [null,[],{}, {type:'message',ref:'hello'},{type:'skill',ref:'unknown'},
    {type:'skill',ref:'<script>'},{type:'world',ref:'__proto__'},{type:'skin',ref:1},
    ...['1','0','-2','02','2.0','2e2','100001','Infinity',' 2','2\n'].map(ref=>({type:'level',ref})),
    {type:'level',ref:2}]) {
    assert.equal(game.addNotification(value).ok,false,JSON.stringify(value));
    assert.deepEqual(game.getSnapshot(),before);
    assert.equal(storage.getItem(STORAGE_KEY),saved);
  }
  assert.ok(GUIDE_IDS.includes('level-up'));
});

test('notification deduplication retains the original time and read state without changing coins', () => {
  const storage=new Storage();let time=1000;
  const game=new NinjaGame({storage,now:()=>time});game.profile.coins=42;
  const first=game.addNotification({type:'skill',ref:'slow-super'});
  first.notification.read=true;
  assert.equal(game.profile.player.notifications[0].read,false,'returned notification is detached');
  assert.deepEqual(game.markNotificationsRead(),{ok:true,count:1});
  time=9000;const duplicate=game.addNotification({type:'skill',ref:'slow-super'});
  assert.equal(duplicate.ok,true);assert.equal(duplicate.notification.createdAt,1000);assert.equal(duplicate.notification.read,true);
  assert.equal(game.profile.player.notifications.length,1);assert.equal(game.profile.coins,42);
  const restored=new NinjaGame({storage});assert.deepEqual(restored.profile.player.notifications,game.profile.player.notifications);
  assert.deepEqual(restored.markNotificationsRead(),{ok:true,count:0});
});

test('the inbox keeps its newest fifty entries and reading them persists idempotently', () => {
  const storage=new Storage();let time=1000;
  const game=new NinjaGame({storage,now:()=>++time});
  for (let level=2;level<=61;level++) game.addNotification({type:'level',ref:String(level)});
  const notifications=game.profile.player.notifications;
  assert.equal(notifications.length,50);assert.equal(notifications[0].id,'level:61');assert.equal(notifications.at(-1).id,'level:12');
  assert.equal(notifications.every(item=>!item.read),true);
  assert.deepEqual(game.markNotificationsRead(),{ok:true,count:50});
  const saved=storage.getItem(STORAGE_KEY);assert.deepEqual(game.markNotificationsRead(),{ok:true,count:0});assert.equal(storage.getItem(STORAGE_KEY),saved);
  const restored=new NinjaGame({storage});assert.equal(restored.profile.player.notifications.length,50);assert.equal(restored.profile.player.notifications.every(item=>item.read),true);
});

test('inbox normalization drops unknown refs, repairs IDs and bounds timestamps without retaining saved references', () => {
  const input={player:{username:'Ninja Kai',notifications:[
    {id:'bad-id',type:'skill',ref:'slow-super',createdAt:1e20,read:true},
    {type:'skill',ref:'slow-super',createdAt:1,read:false},
    {type:'world',ref:'unknown',createdAt:2,read:false},
    {type:'level',ref:'2',createdAt:Infinity,read:'yes'},null,
    ...Array.from({length:70},(_,i)=>({type:'level',ref:String(i+3),createdAt:i,read:false}))
  ]}};
  const before=structuredClone(input),player=normalizePlayer(input);
  assert.deepEqual(input,before);assert.equal(player.notifications.length,50);
  assert.deepEqual(player.notifications[0],{id:'skill:slow-super',type:'skill',ref:'slow-super',createdAt:8640000000000000,read:true});
  assert.deepEqual(player.notifications[1],{id:'level:2',type:'level',ref:'2',createdAt:0,read:false});
  assert.equal(new Set(player.notifications.map(item=>item.id)).size,50);
  player.notifications[0].read=false;assert.deepEqual(input,before);
});

test('identity edits, guide acknowledgements and progression purchases preserve a migrated inbox', () => {
  const storage=new Storage(),game=new NinjaGame({storage,now:()=>1000});game.profile.coins=200;
  game.setUsername('Ninja Kai');game.addNotification({type:'achievement',ref:'first-cut'});
  const expected=structuredClone(game.profile.player.notifications);
  game.setUsername('Kai_8');game.markGuideSeen('first-achievement');assert.equal(game.buySkill('focus-root').ok,true);assert.equal(game.buyWorld('gaming').ok,true);
  assert.deepEqual(game.profile.player.notifications,expected);
  const restored=new NinjaGame({storage});assert.equal(restored.profile.player.username,'Kai_8');assert.deepEqual(restored.profile.player.notifications,expected);
  assert.equal(restored.profile.coins,85);assert.equal(restored.profile.player.guideSeen.includes('first-achievement'),true);
});

test('viewing one unlock dismisses only its inbox item, preserves rewards and survives reloading', () => {
  class CountedStorage extends Storage {writes=0;setItem(key,value){super.setItem(key,value);this.writes++;}}
  const storage=new CountedStorage(),game=new NinjaGame({storage,now:()=>1000});
  game.profile.coins=47;game.profile.achievements=['first-cut'];
  game.addNotification({type:'achievement',ref:'first-cut'});
  game.addNotification({type:'skill',ref:'focus-root'});
  game.addNotification({type:'level',ref:'2'});
  game.start({mode:'study',tutorial:false});game.nextLevel();game.pause();
  const before=game.getSnapshot(),expected=structuredClone(before.profile),writes=storage.writes;
  expected.player.notifications.find(item=>item.id==='achievement:first-cut').read=true;
  assert.deepEqual(game.markNotificationRead('achievement:first-cut'),{ok:true,id:'achievement:first-cut'});
  assert.deepEqual(game.profile,expected,'viewing an achievement does not claim its coins or alter other progress');
  assert.deepEqual(game.state,before.state,'reading the inbox never changes the run');
  assert.equal(storage.writes,writes+1);
  assert.equal(game.profile.player.notifications.filter(item=>!item.read).length,2);
  const saved=storage.getItem(STORAGE_KEY);
  assert.deepEqual(game.markNotificationRead('achievement:first-cut'),{ok:true,id:'achievement:first-cut'});
  assert.equal(storage.getItem(STORAGE_KEY),saved);assert.equal(storage.writes,writes+1,'repeat views do not rewrite the save');
  const restored=new NinjaGame({storage,now:()=>1000});
  assert.deepEqual(restored.profile,expected);
  assert.deepEqual(restored.markNotificationsRead(),{ok:true,count:2},'bulk action only dismisses the two remaining items');
  assert.deepEqual(restored.markNotificationsRead(),{ok:true,count:0});
  assert.equal(new NinjaGame({storage,now:()=>1000}).profile.player.notifications.every(item=>item.read),true);
});

test('unknown and forged inbox IDs cannot dismiss notifications, write saves or award rewards', () => {
  class CountedStorage extends Storage {writes=0;setItem(key,value){super.setItem(key,value);this.writes++;}}
  const storage=new CountedStorage(),game=new NinjaGame({storage,now:()=>1000});
  game.profile.coins=23;game.addNotification({type:'achievement',ref:'first-cut'});
  const before=game.getSnapshot(),saved=storage.getItem(STORAGE_KEY),writes=storage.writes;
  const forged={toString(){throw new Error('an inbox ID must never be coerced');}};
  for(const id of [null,undefined,0,{},[],forged,'','achievement:first-cut ','achievement:missing','skill:focus-root','__proto__','x'.repeat(97)]){
    const result=game.markNotificationRead(id);assert.equal(result.ok,false);assert.ok(result.reason);
    assert.deepEqual(game.getSnapshot(),before);assert.equal(storage.getItem(STORAGE_KEY),saved);assert.equal(storage.writes,writes);
  }
  assert.equal(new NinjaGame({storage,now:()=>1000}).profile.player.notifications[0].read,false);
});
