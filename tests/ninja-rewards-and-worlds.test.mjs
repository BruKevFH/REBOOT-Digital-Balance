import test from 'node:test';
import assert from 'node:assert/strict';
import {NinjaGame,SKINS} from '../notification-ninja/src/game.js';
import {readFileSync} from 'node:fs';
class MemoryStore{constructor(){this.files=new Map()}getItem(key){return this.files.get(key)||null}setItem(key,v){this.files.set(key,String(v))}}
const begin=(game)=>{assert.equal(game.startQuickRound('study').ok,true);assert.equal(game.nextLevel().ok,true);assert.equal(game.state.scene,'playing');};
const answer=(game,count)=>{const earned=[];for(let i=0;i<count;i++){const events=[];game._good(events,{context:'study',x:160,y:170});earned.push(events.filter(e=>e.type==='coin-earned'));}return earned};
const finish=game=>{game.state.elapsed=45;game.state.stageElapsed=45;const events=[];game._finishRun('complete',events);return events;};

test('short everyday simulation earns one coin per correct decision, with a transparent per-run cap',()=>{
 const storage=new MemoryStore(),game=new NinjaGame({storage,seed:'quick-rewards'});
 begin(game);
 const events=answer(game,26);
 assert(events.slice(0,24).every(list=>list.length===1&&list[0].amount===1));
 assert(events.slice(24).every(list=>list.length===0));
 assert.equal(game.state.runCoins,24);
 assert.equal(game.profile.coins,0,'coins cannot be spent before round settlement');
 const completion=finish(game);
 assert.equal(game.state.awardedCoins,26,'24 decision coins plus the ordinary 2-coin completion bonus');
 assert.equal(game.profile.coins,26);
 assert.equal(completion.filter(e=>e.type==='ended').length,1);
 const snapshot=JSON.stringify(game.profile);
 finish(game);assert.equal(JSON.stringify(game.profile),snapshot,'no duplicate credit from repeated finish');
 const loaded=new NinjaGame({storage,seed:'quick-rewards'});
 assert.equal(loaded.profile.coins,26);
});

test('two decision mastery skins unlock at cumulative 60/180 correct, once each, without purchasing',()=>{
 const storage=new MemoryStore(),game=new NinjaGame({storage,seed:'cosmetic-mastery'});
 for(const [i,limit] of [30,30,60,60].entries()){
   begin(game);answer(game,limit);const events=finish(game);
   if(i===0)assert(!game.profile.unlockedSkins.includes('focus-fox'));
   if(i===1){assert(game.profile.unlockedSkins.includes('focus-fox'));assert.equal(events.filter(e=>e.type==='skin-unlocked'&&e.id==='focus-fox').length,1);}
   if(i===2)assert.equal(events.filter(e=>e.type==='skin-unlocked').length,0);
   if(i===3){assert(game.profile.unlockedSkins.includes('night-guardian'));assert.equal(events.filter(e=>e.type==='skin-unlocked'&&e.id==='night-guardian').length,1);}
 }
 assert.equal(game.profile.stats.correct,180);
 assert.equal(game.profile.unlockedSkins.filter(id=>id==='focus-fox').length,1);
 assert.equal(game.profile.unlockedSkins.filter(id=>id==='night-guardian').length,1);
 assert.equal(game.buySkin('focus-fox').ok,false,'earned-only skin cannot be bought');
 assert.equal(game.selectSkin('night-guardian').ok,true);
 const restored=new NinjaGame({storage,seed:'cosmetic-mastery'});
 assert.equal(restored.profile.selectedSkin,'night-guardian');
 assert(restored.profile.unlockedSkins.includes('focus-fox'));
 assert(restored.profile.unlockedSkins.includes('night-guardian'));
 assert.deepEqual(SKINS.filter(s=>s.unlock==='mastery').map(s=>[s.id,s.requiredCorrect]),[['focus-fox',60],['night-guardian',180]]);
});

test('mobile SUPER remains a real touch button, scenes and rewards ship in online and offline builds',()=>{
 const read=f=>readFileSync('notification-ninja/'+f,'utf8');
 const styles=read('ninja-feedback-v7.css'),ui=read('src/main.js'),render=read('src/renderer.js');
 const pkg=readFileSync('scripts/package_ninja.py','utf8');
 assert.match(styles,/touch-action:manipulation/);
 assert.match(styles,/body\.is-playing:not\(\.is-paused\) \.super-dock/);
 assert.match(ui,/\$\('super-button'\)\.onclick=activateSuper/);
 for(const name of ['dojo-study.png','dojo-gaming-v5.svg','dojo-sleep.png','ninja-mint-balance-v9.svg'])assert(render.includes(name));
 assert(ui.includes('nn-round-reward')&&ui.includes('nn-reward-progress'));
 assert(read('index.html').includes('ninja-feedback-v7.css'));
 assert(pkg.includes('ninja-feedback-v7.css'));
 assert(read('sw.js').includes('ninja-feedback-v7.css'));
});
