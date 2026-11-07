import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {REFLECTION_CONTEXTS,reflectionQuest,renderReflectionQuest,readReflectionSeals,awardReflectionSeal,clearReflectionSeals} from '../notification-ninja/src/reflection-quest.js';
import {tr,setLanguage} from '../notification-ninja/src/i18n.js';
const read=file=>readFileSync('notification-ninja/'+file,'utf8');
const storage=()=>{const m=new Map();return {getItem:id=>m.get(id)||null,setItem:(id,value)=>m.set(id,value),removeItem:id=>m.delete(id),raw:m};};

test('homepage is informational: all entry choices lead to the dojo gate and no card starts a game',()=>{
 const home=read('home.html'),game=read('src/main.js');
 assert(home.includes('href="./index.html#login"'));
 assert(home.includes('href="./index.html#register"'));
 assert(home.includes('href="./index.html#guest"'));
 assert.equal((home.match(/class="situation-card"/g)||[]).length,3);
 assert.equal((home.match(/<article class="situation-card"/g)||[]).length,3);
 assert(!home.includes('?quick='));
 assert(!home.includes('href="./index.html"'));
 assert(!home.includes('Jetzt spielen'));
 assert(!home.includes('Spiel starten'));
 assert(game.includes("if(route==='guest')"));
 assert(game.includes("else enterDojo()"));
 assert(!game.includes("if(route==='guest'){launchQuick"));
});

test('regular bazaar offers only matching play worlds and outfits, preserves legacy-owned cosmetics',()=>{
 const main=read('src/main.js');
 assert(main.includes("shopTab=['worlds','skins'].includes(tab)?tab:'worlds'"));
 assert(main.includes("[['worlds','Spielorte'],['skins','Ninja-Designs']]"));
 assert(main.includes("const oldOwned=BACKGROUNDS.filter(background=>background.cost>0&&backgrounds.includes(background.id))"));
 assert(main.includes('shop-legacy-archive'));
 assert(main.includes('data-background-equip'));
 assert(!main.includes("[['worlds','Spielorte'],['backgrounds','Hintergründe']"));
});

test('every reflective scenario has a meaningful contextual decision and an independent rationale',()=>{
 assert.deepEqual(REFLECTION_CONTEXTS,['study','gaming','sleep']);
 for(const context of REFLECTION_CONTEXTS){
  const q=reflectionQuest(context);
  assert.equal(q.answers.length,3);
  assert.equal(q.reasons.length,3);
  assert(Number.isInteger(q.correct)&&q.correct>=0&&q.correct<3);
  assert(Number.isInteger(q.reason)&&q.reason>=0&&q.reason<3);
  assert(q.explanation.length>60);
  assert(q.takeaway.length>30);
  assert(q.wrong.filter(x=>x.length).length>=2);
  const choice=renderReflectionQuest({context,step:'choice'});
  assert.equal((choice.match(/data-reflection-choice="/g)||[]).length,3);
  const why=renderReflectionQuest({context,step:'reason'});
  assert.equal((why.match(/data-reflection-reason="/g)||[]).length,3);
  const bad=renderReflectionQuest({context,step:'wrong-choice',choice:(q.correct+1)%3});
  assert(bad.includes('data-action="reflection-retry"'));
  const won=renderReflectionQuest({context,step:'success',reward:{earned:true,saved:true},seals:[context]});
  assert(won.includes(q.seal));
  assert(won.includes(q.takeaway));
 }
});

test('insight seals persist once per context and are isolated by profile and account',()=>{
 const s=storage();
 assert.deepEqual(readReflectionSeals(s,'guest'),[]);
 const first=awardReflectionSeal(s,'guest','study');
 assert.deepEqual(first,{earned:true,saved:true,seals:['study']});
 assert.equal(awardReflectionSeal(s,'guest','study').earned,false,'no repeatable awards');
 assert.deepEqual(readReflectionSeals(s,'guest'),['study']);
 assert.deepEqual(readReflectionSeals(s,'account-123'),[],'account and guest separate');
 for(const ctx of ['gaming','sleep'])assert.equal(awardReflectionSeal(s,'guest',ctx).earned,true);
 assert.equal(readReflectionSeals(s,'guest').length,3);
 assert.equal(awardReflectionSeal(s,'guest','invented').earned,false);
 assert.equal(clearReflectionSeals(s,'guest'),true);
 assert.deepEqual(readReflectionSeals(s,'guest'),[]);
});

test('storage failures cannot give fake durable coin rewards or crash the reflection',()=>{
 const failed={getItem:()=>{throw Error('blocked');},setItem:()=>{throw Error('blocked');},removeItem:()=>{throw Error('blocked');}};
 const award=awardReflectionSeal(failed,'guest','study');
 assert.equal(award.saved,false);
 assert.equal(award.earned,true);
 assert.deepEqual(readReflectionSeals(failed,'guest'),[]);
 const success=renderReflectionQuest({context:'study',step:'success',reward:award});
 assert(success.includes('Speichern ist hier blockiert'));
 assert(success.includes('keine zusätzlichen Münzen'));
 const source=read('src/reflection-quest.js');
 assert(!source.includes('accounts.action('));
 assert(!source.includes('coin'));
});

test('new reflection and access copy is actually translatable to English',()=>{
 setLanguage('en');
 for(const german of [
  'Was würdest du wirklich tun?','Als Gast ins Dojo',
  'Siegel des Fokus','Siegel der Balance','Siegel der Ruhe',
  reflectionQuest('study').situation,reflectionQuest('gaming').situation,reflectionQuest('sleep').situation,
  'Die Siegel sind reine Lernabzeichen, keine zusätzlichen Münzen oder Ranglistenpunkte. Sie bleiben auf diesem Gerät und werden nicht mit dem Konto synchronisiert.'
 ]){
  assert.notEqual(tr(german),german,'Missing translation: '+german);
 }
 setLanguage('de');
});
