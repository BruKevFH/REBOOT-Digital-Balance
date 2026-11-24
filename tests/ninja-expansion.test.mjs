import test from 'node:test';
import assert from 'node:assert/strict';
import {NinjaGame,SKINS,STORAGE_KEY} from '../notification-ninja/src/game.js';
import {SKILLS,SUPERS,ACHIEVEMENTS,sanitizeProgress,buySkill,equipSuper,unlockAchievements,getAchievementProgress,claimAchievement} from '../notification-ninja/src/progression.js';
import {MAIN_MISSIONS,CAREER_MISSIONS,getWeeklyChallenges,getWeeklyReward} from '../notification-ninja/src/adventure.js';
import {isThrowReady} from '../notification-ninja/src/throwers.js';
import {createNinjaStore} from '../server/ninja-store.mjs';
import {createNinjaAuth} from '../server/ninja-auth.mjs';
import {createNinjaGameService} from '../server/ninja-game-service.mjs';
import {EN_EXPANSION} from '../notification-ninja/src/locales/en-expansion.js';

const clone=value=>JSON.parse(JSON.stringify(value));
const originalSkillIds=['focus-root','slow-super','flow-boost','guard-root','shield-super','second-chance','coin-root','sweep-super','coin-boost'];
const addedSkillIds=SKILLS.filter(skill=>!originalSkillIds.includes(skill.id)).map(skill=>skill.id);
const collectionGoals=ACHIEVEMENTS.slice(24);
const memory=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};};
function ownedThrough(id){const owned=new Set();function include(value){const skill=SKILLS.find(item=>item.id===value);if(!skill)return;for(const parent of skill.requires)include(parent);owned.add(value);}include(id);return SKILLS.filter(skill=>owned.has(skill.id)).map(skill=>skill.id);}
function fixture(id,{superId=null,mode='study',storage=memory()}={}){
 const clock={now:Date.UTC(2026,10,18,12)},game=new NinjaGame({storage,seed:'expanded-techniques',width:800,height:750,now:()=>clock.now});
 game.profile.unlockedSkills=id==='all'?SKILLS.map(item=>item.id):ownedThrough(id);
 game.profile.selectedSuper=superId;
 game.profile.unlockedWorlds=['study','gaming','sleep','master'];game.profile.tutorialCompleted=true;
 if(mode==='boss')game.profile.adventure.completed=['study-focus','open-trial'];
 const options={mode,tutorial:false,...(mode==='daily'?{challengeDay:'2026-11-18'}:{}),...(mode==='boss'?{bossId:'scout'}:{})};
 assert.equal(game.start(options).ok,true);assert.equal(game.nextLevel().ok,true);
 return {game,clock,storage};
}
function tick(game,clock){clock.now+=50;return game.update(.05);}
function playUntil(game,clock,predicate,{max=20000,superAtCharge=false}={}){
 const events=[];
 for(let i=0;i<max&&!predicate();i++){
  if(game.state.scene==='briefing')events.push(...game.nextLevel().events||[]);
  if(game.state.scene==='limit-choice')events.push(...game.requestStop().events||[]);
  for(const object of [...game.state.objects])if(object.kind==='distraction'&&isThrowReady(object))events.push(...game.swipe([{x:object.x,y:object.y-10},{x:object.x,y:object.y+10}]));
  if(superAtCharge&&game.state.superCharge>=100)events.push(...game.activateSuper().events||[]);
  if(!game.state.ended)events.push(...tick(game,clock));else break;
 }
 assert(predicate(),'The public deterministic simulation reaches its expected state');return events;
}
// These small fixtures place a canonical object for collision/effect isolation. They do
// not call private scoring methods and are not claimed as naturally earned playthroughs.
function place(game,id){game.state.objects=[];game.state.spawnTimer=100;const object=game._spawnContent(id);assert(object);object.x=400;object.y=300;object.vx=0;object.vy=-200;object.gravity=0;object.age=1;return object;}
function cut(game,object,offset=0){return game.swipe([{x:object.x-15,y:object.y+offset},{x:object.x+15,y:object.y+offset}]);}

// Old prices and parent chains remain unchanged; all new nodes require real purchases.
test('extended branches retain the nine original contracts and cannot grant orphaned advanced techniques',()=>{
 assert.equal(SKILLS.length,18);assert.equal(SUPERS.length,6);assert.equal(ACHIEVEMENTS.length,36);assert.equal(SKINS.length,12);
 for(const branch of ['focus','guard','coins']){
  const skills=SKILLS.filter(item=>item.branch===branch);assert.deepEqual(skills.map(item=>item.cost),[35,90,180,240,360,480]);
  const profile={coins:1385,achievements:[],...sanitizeProgress(null)};
  for(const skill of skills){const before=profile.coins;assert.equal(buySkill(profile,skill.id).ok,true);assert.equal(profile.coins,before-skill.cost);}
  assert.equal(profile.coins,0);assert.equal(profile.unlockedSkills.length,6);assert.equal(buySkill(profile,skills.at(-1).id).ok,false);
 }
 for(const id of addedSkillIds){const p={coins:5000,achievements:[],...sanitizeProgress({unlockedSkills:[id],selectedSuper:id})};const before=clone(p);assert.equal(p.unlockedSkills.length,0);assert.equal(p.selectedSuper,null);assert.equal(buySkill(p,id).ok,false);assert.deepEqual(p,before);}
});

test('clear current charges only helpful passes and focus reserve begins a regular run with twenty charge',()=>{
 const {game,clock}=fixture('clear-current');const object=place(game,'homework');object.y=-object.radius-1;tick(game,clock);
 assert.equal(game.state.metrics.usefulPassed,1);assert.equal(game.state.superCharge,13);
 const distraction=place(game,'autoplay');cut(game,distraction);assert.equal(game.state.superCharge,23,'Ordinary cuts get the existing10-point charge');
 const reserve=fixture('focus-reserve',{superId:'zen-super'}).game;assert.equal(reserve.state.superCharge,20);
 const training=new NinjaGame({storage:null});training.profile.unlockedSkills=ownedThrough('focus-reserve');training.profile.selectedSuper='zen-super';assert.equal(training.start({mode:'campaign',forceTutorial:true}).ok,true);assert.equal(training.state.isTutorial,true);assert.equal(training.state.superCharge,0);
});

test('gentle blade narrows only helpful hitboxes while keeping distraction collisions unchanged',()=>{
 const regular=fixture('second-chance').game,careful=fixture('gentle-blade').game;
 const a=place(regular,'homework'),b=place(careful,'homework');cut(regular,a,a.radius*.9);cut(careful,b,b.radius*.9);
 assert.equal(regular.state.metrics.shieldedMistakes,1);assert.equal(careful.state.metrics.shieldedMistakes,0);assert(careful.state.objects.includes(b));
 cut(careful,b);assert.equal(careful.state.metrics.shieldedMistakes,1,'A genuine centred wrong cut remains a mistake');
 for(const game of [regular,careful]){const object=place(game,'autoplay');cut(game,object,object.radius*.9);assert.equal(game.state.metrics.cuts,1);}
});

test('double find earns faster from coin bonuses without bypassing the existing stage wallet cap',()=>{
 const {game}=fixture('coin-pouch');const first=cut(game,place(game,'power-coins'));
 assert.equal(first.find(event=>event.type==='coin-earned').amount,2);assert.equal(game.state.runCoins,2);
 for(let i=0;i<20;i++)cut(game,place(game,'power-coins'));
 assert.equal(game.state.runCoins,10,'Existingeasy8×golden1.25 cap remains10');assert.equal(game.state.stageMetrics.earnedCoins,10);
 assert.equal(game.profile.coins,0,'Run coins still wait for an actual round outcome');
});

test('golden patience slows only coin flight without changing the clock or regular signal motion',()=>{
 const base=fixture('star-super'),slow=fixture('coin-drift');
 const a=place(base.game,'power-coins'),b=place(slow.game,'power-coins');tick(base.game,base.clock);tick(slow.game,slow.clock);
 assert.equal(a.y,290);assert.equal(b.y,292.5);assert.equal(base.game.state.elapsed,slow.game.state.elapsed);
 const c=place(base.game,'autoplay'),d=place(slow.game,'autoplay');tick(base.game,base.clock);tick(slow.game,slow.clock);assert.equal(c.y,d.y);
});

test('stage shield replenishes only on a genuine new campaign stage and never stacks charges',()=>{
 const {game,clock}=fixture('stage-shield',{mode:'campaign'});assert.equal(game.state.effects.shield,1);cut(game,place(game,'homework'));assert.equal(game.state.effects.shield,0);
 playUntil(game,clock,()=>game.state.levelIndex===1&&game.state.scene==='briefing');assert.equal(game.state.effects.shield,1);assert.equal(game.state.metrics.shieldedMistakes,1);
 const noUpgrade=fixture('lotus-super',{mode:'campaign'});cut(noUpgrade.game,place(noUpgrade.game,'homework'));playUntil(noUpgrade.game,noUpgrade.clock,()=>noUpgrade.game.state.levelIndex===1&&noUpgrade.game.state.scene==='briefing');assert.equal(noUpgrade.game.state.effects.shield,0);
});

test('each new Super is charged by decisions, applies its actual effect, and survives pause/reload',()=>{
 for(const id of ['zen-super','lotus-super','star-super']){
  const {game,clock,storage}=fixture(id,{superId:id});playUntil(game,clock,()=>game.state.superCharge===100);
  assert.equal(game.activateSuper().ok,true);assert.equal(game.state.superCharge,0);assert.equal(game.state.metrics.superUses,1);
  if(id==='zen-super'){assert.equal(game.state.effects.slow,6);assert(game.state.effects.flow>=6);}
  if(id==='lotus-super')assert.equal(game.state.effects.shield,3);
  if(id==='star-super')assert.equal(game.state.effects.multiplier,12);
  game.pause();const before=clone(game.state.effects);const restored=new NinjaGame({storage,now:()=>clock.now,width:800,height:750});
  assert.equal(restored.state.selectedSuper,id);assert.deepEqual(restored.state.effects,before);assert.equal(restored.state.paused,true);
  assert.deepEqual(restored.update(.05),[]);assert.deepEqual(restored.state.effects,before);
 }
});

test('Lotus charges protect three individual mistakes and a normal pickup never discards remaining protection',()=>{
 const {game,clock}=fixture('lotus-super',{superId:'lotus-super'});playUntil(game,clock,()=>game.state.superCharge===100);game.activateSuper();
 const lives=game.state.lives;cut(game,place(game,'power-shield'));assert.equal(game.state.effects.shield,3);
 for(const remaining of [2,1,0]){cut(game,place(game,'homework'));assert.equal(game.state.effects.shield,remaining);assert.equal(game.state.lives,lives);}
 cut(game,place(game,'homework'));assert.equal(game.state.lives,lives-1);assert.equal(game.state.metrics.shieldedMistakes,3);
});

test('Star Super doubles real cut and helpful-pass points while leaving earned coins unchanged',()=>{
 const regular=fixture('star-super',{superId:'star-super'}),star=fixture('star-super',{superId:'star-super'});
 for(const run of [regular,star])playUntil(run.game,run.clock,()=>run.game.state.superCharge===100);
 assert.equal(star.game.activateSuper().ok,true);
 const slice=run=>{const before=run.game.state.score;const events=cut(run.game,place(run.game,'autoplay'));const hit=events.find(event=>event.type==='sliced');assert(hit);assert.equal(run.game.state.score-before,hit.points+events.filter(event=>event.type==='combo-milestone').reduce((sum,event)=>sum+event.points,0));return hit.points;};
 assert.equal(slice(star),2*slice(regular));
 const pass=run=>{const object=place(run.game,'homework');object.y=-object.radius-1;const before=run.game.state.score;const events=tick(run.game,run.clock),kept=events.find(event=>event.type==='useful-passed');assert(kept);assert.equal(run.game.state.score-before,kept.points+events.filter(event=>event.type==='combo-milestone').reduce((sum,event)=>sum+event.points,0));return kept.points;};
 assert.equal(pass(star),2*pass(regular));
 const pickup=run=>{const before=run.game.state.runCoins,events=cut(run.game,place(run.game,'power-coins'));const earned=events.find(event=>event.type==='coin-earned');assert(earned);assert.equal(run.game.state.runCoins-before,earned.amount);return earned.amount;};
 assert.equal(pickup(star),pickup(regular));assert.equal(star.game.state.runCoins,regular.game.state.runCoins);
});

test('the final world purchase unlocks its collection immediately and persists an unclaimed reward',()=>{
 const storage=memory(),game=new NinjaGame({storage});game.profile.coins=1000;
 assert.equal(game.buyWorld('gaming').ok,true);assert.equal(game.buyWorld('sleep').ok,true);
 const before=clone(game.profile);assert.equal(game.buyWorld('invented').ok,false);assert.deepEqual(game.profile,before);
 game.profile.coins=319;const unaffordable=clone(game.profile);assert.equal(game.buyWorld('master').ok,false);assert.deepEqual(game.profile,unaffordable);
 game.profile.coins=320;const purchased=game.buyWorld('master');assert.equal(purchased.ok,true);assert.deepEqual(purchased.achievements,['world-collection']);
 assert.equal(game.profile.coins,0);assert.equal(getAchievementProgress(game.profile,'world-collection').unlocked,true);assert.deepEqual(game.profile.claimedAchievements,[]);
 const restored=new NinjaGame({storage});assert.equal(restored.profile.coins,0);assert.equal(restored.claimAchievement('world-collection').reward,8);assert.equal(restored.profile.coins,8);
 assert.equal(restored.claimAchievement('world-collection').ok,false);const owned=clone(restored.profile);assert.equal(restored.buyWorld('master').ok,false);assert.deepEqual(restored.profile,owned);
 assert.equal(new NinjaGame({storage}).claimAchievement('world-collection').ok,false);
});

test('buying a sixth genuine outfit unlocks its collection without automatic achievement coins',()=>{
 const storage=memory(),game=new NinjaGame({storage});game.profile.coins=1000;
 // This ownership fixture represents two previously earned ranks alongside purchases.
 game.profile.unlockedSkins=['default','dawn','shadow'];
 assert.equal(game.buySkin('solar').ok,true);assert.equal(game.buySkin('mint').ok,true);
 game.profile.coins=319;const before=clone(game.profile);assert.equal(game.buySkin('neon').ok,false);assert.deepEqual(game.profile,before);
 game.profile.coins=320;const purchased=game.buySkin('neon');assert.equal(purchased.ok,true);assert.deepEqual(purchased.achievements,['wardrobe-six']);assert.equal(game.profile.coins,0);
 assert.equal(getAchievementProgress(game.profile,'wardrobe-six').current,6);assert.equal(getAchievementProgress(game.profile,'wardrobe-six').unlocked,true);assert.deepEqual(game.profile.claimedAchievements,[]);
 const restored=new NinjaGame({storage});assert.equal(restored.profile.coins,0);assert.equal(restored.claimAchievement('wardrobe-six').reward,6);assert.equal(restored.profile.coins,6);
 const owned=clone(restored.profile);assert.equal(restored.buySkin('neon').ok,false);assert.deepEqual(restored.profile,owned);assert.equal(new NinjaGame({storage}).claimAchievement('wardrobe-six').ok,false);
});

test('an earned weekly outfit can complete the wardrobe once, with the collection reward left to claim',()=>{
 const storage=memory(),now=Date.UTC(2026,10,18,12),game=new NinjaGame({storage,now:()=>now});game.profile.coins=71;
 game.profile.unlockedSkins=['default','solar','mint','dawn','shadow'];
 assert.equal(game.claimWeeklySkin().ok,false);assert(!game.profile.achievements.includes('wardrobe-six'));assert.equal(game.profile.coins,71);
 // Only the already-earned weekly progress is seeded; collection runs through the public claim.
 for(const task of getWeeklyChallenges(game.profile,now))game.profile.adventure.weekly.progress[task.id]=task.target;
 const reward=getWeeklyReward(game.profile,now);assert.equal(reward.ready,true);
 const claimed=game.claimWeeklySkin();assert.equal(claimed.ok,true);assert.equal(claimed.id,reward.id);assert.deepEqual(claimed.achievements,['wardrobe-six']);assert.equal(game.profile.coins,71);assert.deepEqual(game.profile.claimedAchievements,[]);
 const restored=new NinjaGame({storage,now:()=>now});assert.equal(getWeeklyReward(restored.profile,now).claimed,true);assert.equal(getAchievementProgress(restored.profile,'wardrobe-six').unlocked,true);
 const before=clone(restored.profile);assert.equal(restored.claimWeeklySkin().ok,false);assert.deepEqual(restored.profile,before);
 assert.equal(restored.claimAchievement('wardrobe-six').reward,6);assert.equal(restored.profile.coins,77);assert.equal(new NinjaGame({storage,now:()=>now}).claimAchievement('wardrobe-six').ok,false);
});

test('new purchased techniques and their larger effect limits remain excluded from every competitive challenge',()=>{
 for(const mode of ['open','boss','boss-rush','daily']){
  const {game,clock,storage}=fixture('all',{mode,superId:'star-super'});
  assert.deepEqual(game.state.skillIds,[]);assert.equal(game.state.selectedSuper,null);assert.equal(game.state.superCharge,0);assert.equal(game.state.effects.shield,0);
  const object=place(game,'homework');object.y=-object.radius-1;tick(game,clock);assert.equal(game.state.superCharge,0);assert.equal(game.activateSuper().ok,false);
  // A legacy/corrupt local snapshot must not re-enable normal-play effect limits.
  game.state.effects.shield=3;game.state.effects.multiplier=12;game.save();const restored=new NinjaGame({storage,now:()=>clock.now,width:800,height:750});
  assert.deepEqual(restored.state.skillIds,[]);assert.equal(restored.state.effects.shield,1);assert.equal(restored.state.effects.multiplier,10);
 }
});

test('collection achievements derive from known reachable content, reject invented identities and require explicit one-time claims',()=>{
 const invalid={coins:0,achievements:[],...sanitizeProgress(null),unlockedSkins:Array.from({length:8},(_,i)=>'invented'+i),adventure:{completed:['autoplay-overlord','sleep-06','made-up']}};
 assert.equal(getAchievementProgress(invalid,'career-complete').current,0);assert.equal(getAchievementProgress(invalid,'boss-trinity').current,0);assert.equal(getAchievementProgress(invalid,'wardrobe-six').current,0);
 const profile={coins:0,achievements:[],...sanitizeProgress({unlockedSkills:SKILLS.map(item=>item.id),unlockedWorlds:['study','gaming','sleep','master']}),unlockedSkins:SKINS.map(item=>item.id),adventure:{completed:CAREER_MISSIONS.map(item=>item.id)}};
 unlockAchievements(profile);assert(collectionGoals.every(item=>profile.achievements.includes(item.id)));assert.equal(profile.coins,0);
 let total=0;for(const goal of collectionGoals){const result=claimAchievement(profile,goal.id);assert.equal(result.ok,true);total+=goal.reward;assert.equal(profile.coins,total);assert.equal(claimAchievement(profile,goal.id).ok,false);}
 assert.equal(total,105);assert(collectionGoals.every(item=>getAchievementProgress(profile,item.id).claimed));
});

test('the eighteenth main mission unlocks its new achievement in the same genuine outcome, and old completed saves migrate without coins',()=>{
 const storage=memory(),clock={now:Date.UTC(2026,10,18,12)},game=new NinjaGame({storage,now:()=>clock.now,width:800,height:750,seed:'eighteenth-mission'});
 game.profile.unlockedWorlds=['study','gaming','sleep'];game.profile.adventure.completed=MAIN_MISSIONS.slice(0,17).map(item=>item.id);game.profile.coins=199;
 assert.equal(game.startMission('sleep-06').ok,true);game.nextLevel();playUntil(game,clock,()=>game.state.elapsed>=30&&game.state.metrics.correctDecisions>=12);
 const outcome=game.requestStop();assert.equal(outcome.ok,true);assert(game.profile.adventure.completed.includes('sleep-06'));assert(game.profile.achievements.includes('career-complete'));assert(outcome.events.some(event=>event.type==='achievement-unlocked'&&event.id==='career-complete'));assert(!game.profile.claimedAchievements.includes('career-complete'));
 const old=JSON.parse(storage.getItem(STORAGE_KEY));old.profile.achievements=old.profile.achievements.filter(id=>!collectionGoals.some(item=>item.id===id));storage.setItem(STORAGE_KEY,JSON.stringify(old));const coins=old.profile.coins;
 const migrated=new NinjaGame({storage,now:()=>clock.now});assert(migrated.profile.achievements.includes('career-complete'));assert.equal(migrated.profile.coins,coins);assert(!migrated.profile.claimedAchievements.includes('career-complete'));
});

test('all extended catalog labels have authored English copy without translating stable identities',()=>{
 for(const item of [...SKILLS.filter(skill=>addedSkillIds.includes(skill.id)),...collectionGoals]){assert.equal(typeof EN_EXPANSION[item.name],'string',item.id+' name');assert.equal(typeof EN_EXPANSION[item.description],'string',item.id+' description');assert(!Object.hasOwn(EN_EXPANSION,item.id));}
});

test('server replay reproduces a new Super and every new passive from its trusted run snapshot',async t=>{
 const clock={now:Date.UTC(2026,10,18,12)},store=createNinjaStore({databasePath:':memory:',now:()=>clock.now});t.after(()=>store.close());
 const auth=createNinjaAuth(store,{now:()=>clock.now}),service=createNinjaGameService(store,{now:()=>clock.now});const account=await auth.register({username:'Expansion replay',password:'Synthetic expansion replay password!'});
 // This internal fixture represents already purchased techniques, not a client grant.
 await store.putProfile(account.user.id,{...account.profile,unlockedSkills:SKILLS.map(item=>item.id),selectedSuper:'star-super'});
 const issued=await service.startRun(account.user.id,{kind:'quick',context:'study',difficulty:'easy',viewport:{width:800,height:750}});
 const game=new NinjaGame({storage:null,now:()=>clock.now,seed:issued.seed,width:800,height:750});game.profile=clone(issued.initial.profile);game.state=clone(issued.initial.state);
 const commands=[];const call=(method,...args)=>{commands.push([method,clone(args)]);return game[method](...args);};call('nextLevel');let supers=0;
 for(let i=0;i<5000&&!game.state.ended;i++){
  for(const object of [...game.state.objects])if((object.kind==='distraction'||object.kind==='powerup')&&isThrowReady(object))call('swipe',[{x:object.x,y:object.y-10},{x:object.x,y:object.y+10}]);
  if(!game.state.ended&&game.state.superCharge===100){assert.equal(call('activateSuper').ok,true);supers++;}
  if(!game.state.ended){clock.now+=50;call('update',.05);}
 }
 assert(game.state.ended);assert(supers>0);const verified=await service.finishRun(account.user.id,issued.runId,{commands});
 assert.equal(verified.run.verified,true);assert.equal(verified.run.score,game.state.score);assert.equal(verified.profile.coins,game.profile.coins);assert.equal(verified.profile.stats.superUses,supers);
 const repeated=await service.finishRun(account.user.id,issued.runId,{commands});assert.equal(repeated.replayed,true);assert.equal(repeated.profile.coins,verified.profile.coins);
});
