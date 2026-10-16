import test from 'node:test';
import assert from 'node:assert/strict';
import {NinjaGame,STORAGE_KEY,SKINS} from '../notification-ninja/src/game.js';
import {CAREER_MISSIONS,getCareerMissions,getWeeklyChallenges,getWeeklyReward,getWeekInfo} from '../notification-ninja/src/adventure.js';
import {isThrowReady} from '../notification-ninja/src/throwers.js';

class Storage {values=new Map();getItem(key){return this.values.get(key)??null;}setItem(key,value){this.values.set(key,String(value));}}
const clone=value=>JSON.parse(JSON.stringify(value));
const time=new Date(2026,9,16,12).getTime();
function setup(){const storage=new Storage(),clock={now:time},game=new NinjaGame({storage,seed:'career-integration',width:1000,height:750,now:()=>clock.now});return {game,storage,clock};}
function play(game,clock,{openStop=100,sleepStop=8}={}){
  const events=[];
  for(let frame=0;frame<16000&&!game.state.ended;frame++){
    const s=game.state,suicide=s.mode==='open'&&s.elapsed>openStop;
    for(const object of [...s.objects])if(isThrowReady(object)&&object.y>object.radius&&object.y<game.height-object.radius&&
      (suicide?object.kind==='useful':object.kind==='distraction'||object.kind==='powerup'))
      events.push(...game.swipe([{x:object.x,y:object.y-8},{x:object.x,y:object.y+8}]));
    if(s.scene==='limit-choice')events.push(...game.requestStop().events||[]);
    if(s.mode==='sleep'&&s.stopAvailable&&s.metrics.correctDecisions>=sleepStop)events.push(...game.requestStop().events||[]);
    clock.now+=50;events.push(...game.update(.05));
  }
  assert.equal(game.state.ended,true,'a genuine run must finish');return events;
}
function stageCareer(game){game.profile.unlockedWorlds=['study','gaming','sleep','master'];game.profile.adventure.completed=CAREER_MISSIONS.filter(m=>m.id!=='autoplay-overlord').map(m=>m.id);}

test('career starts with one available mission and locked or mismatched requests preserve a running game',()=>{
  const {game}=setup();assert.deepEqual(getCareerMissions(game.profile,time).filter(m=>m.available).map(m=>m.id),['study-focus']);
  assert.equal(game.startMission('study-focus').ok,true);game.nextLevel();game.update(.05);const before=clone(game.state);
  for(const request of [()=>game.startMission('autoplay-scout'),()=>game.startMission('unknown'),()=>game.start({mode:'boss',bossId:'scout'}),()=>game.start({mode:'open',missionId:'study-focus'}),()=>game.start({mode:'study',missionId:'unknown'})]){
    assert.equal(request().ok,false);assert.deepEqual(game.state,before);
  }
});

test('genuine study mission opens the next route, saves completion, and pays only on one explicit claim',()=>{
  const {game,clock,storage}=setup();game.setUsername('Mission Ninja');assert.equal(game.startMission('study-focus').ok,true);game.nextLevel();const events=play(game,clock);
  assert.equal(game.state.result,'complete');assert.ok(game.state.metrics.correctDecisions>=20);assert.ok(events.some(e=>e.type==='career-completed'&&e.id==='study-focus'));
  assert.equal(getCareerMissions(game.profile,clock.now).find(m=>m.id==='open-trial').available,true);
  const before=game.profile.coins,claim=game.claimCareerReward('study-focus');assert.equal(claim.ok,true);assert.equal(game.profile.coins,before+5);
  assert.equal(game.claimCareerReward('study-focus').ok,false);game.save();const restored=new NinjaGame({storage,now:()=>clock.now});
  assert.equal(restored.profile.coins,before+5);assert.equal(restored.profile.player.username,'Mission Ninja');assert.equal(restored.claimCareerReward('study-focus').ok,false);
  assert.equal(restored.profile.totalRuns,1);assert.equal(restored.state.missionId,'study-focus');
});

test('career world purchases and prerequisites both remain necessary; finishing a mission does not grant a paid room',()=>{
  const {game,clock}=setup();game.startMission('study-focus');game.nextLevel();play(game,clock);
  assert.equal(game.startMission('gaming-boundary').ok,false);assert.deepEqual(game.profile.unlockedWorlds,['study']);
  game.profile.coins=80;assert.equal(game.buyWorld('gaming').ok,true);assert.equal(game.startMission('gaming-boundary',{gamingLimit:45,difficulty:'hard'}).ok,true);
  assert.equal(game.state.gamingLimit,45);assert.equal(game.state.difficulty,'hard');game.nextLevel();play(game,clock);
  assert.ok(game.profile.adventure.completed.includes('gaming-boundary'));assert.equal(game.state.extensionUsed,false);assert.equal(game.startMission('autoplay-guardian').ok,false);
});

test('a selected Open career mission retains open-v2 through its target and ends only with exhausted hearts',()=>{
  const {game,clock}=setup();game.profile.adventure.completed=['study-focus'];assert.equal(game.startMission('open-trial',{difficulty:'hard'}).ok,true);game.nextLevel();
  assert.equal(game.state.openRuleset,'open-v2');assert.equal(game.state.maxLives,3);assert.equal(game.state.difficulty,'normal');assert.deepEqual(game.state.skillIds,[]);
  play(game,clock,{openStop:100});assert.ok(game.state.elapsed>100);assert.equal(game.state.result,'lives');assert.equal(game.state.lives,0);assert.equal(game.state.openRuleset,'open-v2');
  assert.ok(game.profile.adventure.completed.includes('open-trial'));assert.equal(game.profile.highScores.open,game.state.scoreArcade);
});

test('a real career boss victory unlocks its successor and its reward cannot be replayed after save',()=>{
  const {game,clock,storage}=setup();game.profile.adventure.completed=['study-focus','open-trial'];assert.equal(game.start({mode:'boss',bossId:'scout'}).ok,true);
  assert.equal(game.state.missionId,'autoplay-scout');game.nextLevel();const events=play(game,clock);assert.ok(events.some(e=>e.type==='career-completed'&&e.id==='autoplay-scout'));
  assert.equal(game.state.boss.defeated,true);assert.equal(game.state.openRuleset,null);assert.equal(game.profile.highScores.open,0);
  const before=game.profile.coins;assert.equal(game.claimCareerReward('autoplay-scout').reward,8);const restored=new NinjaGame({storage,now:()=>clock.now});
  assert.equal(restored.state.missionId,'autoplay-scout');assert.equal(restored.state.boss.defeated,true);assert.equal(restored.profile.coins,before+8);assert.equal(restored.claimCareerReward('autoplay-scout').ok,false);
});

test('paused boss mission restores its exact target and can genuinely finish without duplicated credit',()=>{
  const {game,clock,storage}=setup();stageCareer(game);game.startMission('autoplay-overlord');game.nextLevel();
  for(let i=0;i<150;i++){clock.now+=50;game.update(.05);}game.pause();const before=clone(game.state),restored=new NinjaGame({storage,width:1000,height:750,now:()=>clock.now});
  assert.equal(restored.state.missionId,'autoplay-overlord');assert.deepEqual(restored.state.boss,before.boss);assert.equal(restored.state.paused,true);assert.equal(restored.profile.totalRuns,0);
  restored.resume();play(restored,clock);assert.equal(restored.state.boss.defeated,true);assert.equal(restored.profile.totalRuns,1);assert.ok(restored.profile.adventure.completed.includes('autoplay-overlord'));
});

test('weekly completion, claims and earned outfits survive game restoration without replacing the equipped look',()=>{
  const {game,clock,storage}=setup();game.profile.unlockedSkins.push('solar');game.selectSkin('solar');
  // Diverse genuine runs cover Open survival as well as precise finished rounds.
  game.start({mode:'open',tutorial:false});game.nextLevel();play(game,clock,{openStop:105});
  for(let run=0;run<8&&!getWeeklyChallenges(game.profile,clock.now).every(t=>t.completed);run++){
    game.start({mode:'study',tutorial:false});game.nextLevel();play(game,clock);
  }
  assert.ok(getWeeklyChallenges(game.profile,clock.now).every(t=>t.completed));const reward=getWeeklyReward(game.profile,clock.now);assert.equal(reward.ready,true);
  const before=game.profile.coins;for(const task of getWeeklyChallenges(game.profile,clock.now))assert.equal(game.claimWeeklyReward(task.id).ok,true);
  assert.equal(game.profile.coins,before+15);assert.equal(game.claimWeeklySkin().ok,true);assert.equal(game.profile.selectedSkin,'solar');assert.ok(game.profile.unlockedSkins.includes(reward.id));
  const restored=new NinjaGame({storage,now:()=>clock.now});assert.equal(restored.profile.coins,before+15);assert.equal(restored.profile.selectedSkin,'solar');assert.ok(restored.profile.unlockedSkins.includes(reward.id));
  assert.equal(restored.claimWeeklySkin().ok,false);for(const task of getWeeklyChallenges(restored.profile,clock.now))assert.equal(restored.claimWeeklyReward(task.id).ok,false);
  assert.equal(restored.selectSkin(reward.id).ok,true);assert.equal(restored.profile.selectedSkin,reward.id);
});

test('new week removes old unclaimed progress while retaining earned currency, career and wardrobe',()=>{
  const {game,clock,storage}=setup();game.profile.coins=175;game.profile.adventure.completed=['study-focus'];game.profile.unlockedSkins.push('lotus');game.selectSkin('lotus');game.save();
  const next=getWeekInfo(clock.now).next+1000,restored=new NinjaGame({storage,now:()=>next});
  assert.equal(restored.profile.coins,175);assert.equal(restored.profile.selectedSkin,'lotus');assert.ok(restored.profile.adventure.completed.includes('study-focus'));
  assert.ok(getWeeklyChallenges(restored.profile,next).every(t=>t.current===0&&!t.claimed));assert.equal(restored.claimWeeklySkin().ok,false);
});

test('weekly descriptors and authored skins use one identity across rewards, wardrobe and inbox',()=>{
  const {game}=setup();for(const id of ['lotus','ember','tide']){const skin=SKINS.find(item=>item.id===id);assert.equal(skin.unlock,'weekly');assert.equal(game.buySkin(id).ok,false);assert.equal(game.addNotification({type:'skin',ref:id}).ok,true);}
  const gift=getWeeklyReward(game.profile,time);assert.equal(SKINS.find(skin=>skin.id===gift.id).name,gift.skin.name);assert.equal(game.exportData().version,'1.8.1');
});

test('invalid boss mission metadata cannot turn a saved normal run into a boss victory or erase the wallet',()=>{
  const {game,storage,clock}=setup();game.profile.coins=218;game.startMission('study-focus');game.nextLevel();game.pause();
  const data=JSON.parse(storage.getItem(STORAGE_KEY));data.state.mode='boss';data.state.missionId='autoplay-overlord';data.state.boss={id:'overlord',health:0,defeated:true};storage.setItem(STORAGE_KEY,JSON.stringify(data));
  const restored=new NinjaGame({storage,now:()=>clock.now});assert.equal(restored.profile.coins,218);assert.equal(restored.state.started,false);assert.equal(restored.profile.totalRuns,0);assert.equal(restored.claimCareerReward('autoplay-overlord').ok,false);
});
