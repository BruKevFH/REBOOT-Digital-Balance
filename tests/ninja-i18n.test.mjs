import test from 'node:test';
import assert from 'node:assert/strict';
import {getPreferences,normalizePreferences,updatePreferences,PREFERENCES_KEY} from '../notification-ninja/src/preferences.js';
import {tr,setLanguage,getLanguage,getLocale} from '../notification-ninja/src/i18n.js';
import {CONTENT} from '../notification-ninja/src/game.js';
import {SKILLS,ACHIEVEMENTS} from '../notification-ninja/src/progression.js';

const store=()=>{const values=new Map();return {values,getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};};

test('device preferences retain only safe display and audio fields, without touching a player save',()=>{
  const storage=store();storage.setItem('notification-ninja:save:v1','original-player');
  updatePreferences({language:'en',calmEffects:true,username:'Private Name',email:'not-saved'}, {storage});
  assert.deepEqual(getPreferences(storage),{language:'en',calmEffects:true,musicVolume:.4,effectsVolume:.5,muted:false,screenShake:true});
  assert.equal(storage.getItem('notification-ninja:save:v1'),'original-player');
  assert.deepEqual(JSON.parse(storage.getItem(PREFERENCES_KEY)),{language:'en',calmEffects:true,musicVolume:.4,effectsVolume:.5,muted:false,screenShake:true});
});

test('unknown languages and malformed preference data are bounded to supported values',()=>{
  assert.equal(normalizePreferences({language:'fr',calmEffects:true}).language,'de');
  const storage=store();storage.setItem(PREFERENCES_KEY,'not JSON');assert.equal(getPreferences(storage).language,'de');
  updatePreferences({language:'en',calmEffects:false},{storage});
  updatePreferences({language:'invalid',calmEffects:'yes'},{storage});assert.deepEqual(getPreferences(storage),{language:'en',calmEffects:false,musicVolume:.4,effectsVolume:.5,muted:false,screenShake:true});
});

test('blocked storage still allows a calm English session without losing the preference immediately',()=>{
  const storage={getItem:()=>null,setItem:()=>{throw new Error('quota');}};
  assert.doesNotThrow(()=>updatePreferences({language:'en',calmEffects:true,musicVolume:.4,effectsVolume:.5,muted:false,screenShake:true},{storage}));
  assert.deepEqual(getPreferences(storage),{language:'en',calmEffects:true,musicVolume:.4,effectsVolume:.5,muted:false,screenShake:true});
});

test('language changes are explicit and invalid values cannot replace an active language',()=>{
  assert.equal(setLanguage('en'),true);assert.equal(getLanguage(),'en');assert.equal(getLocale(),'en-GB');
  assert.equal(setLanguage('fr'),false);assert.equal(getLanguage(),'en');
  setLanguage('de');assert.equal(getLocale(),'de-DE');
});

test('German is preserved verbatim, including numbers, punctuation and whitespace',()=>{
  setLanguage('de');for(const source of ['  Lernen  ','+14 Münzen','Neuer Ninja-Rang: Schatten-Ninja!','Ninja_42','  '])assert.equal(tr(source),source);
});

test('English covers gameplay decisions, contextual objects, skill names and achievement descriptions',()=>{
  setLanguage('en');assert.equal(tr('Lernen'),'Study');assert.equal(tr('Zurück'),'Back');
  for(const id of ['homework','gaming-invite','quiet','autoplay']){
    const item=CONTENT.find(value=>value.id===id);assert.notEqual(tr(item.label),item.label);assert.notEqual(tr(item.text),item.text);
  }
  for(const skill of SKILLS)assert.notEqual(tr(skill.description),skill.description);
  for(const achievement of ACHIEVEMENTS)assert.notEqual(tr(achievement.description),achievement.description);
  setLanguage('de');
});

test('English preserves unsupported literal text and never interprets markup or player names as HTML',()=>{
  setLanguage('en');for(const source of ['Player_42','<img src=x onerror=alert(1)>','https://example.test/','123456'])assert.equal(tr(source),source);
  setLanguage('de');
});

test('a language switch reverses authored labels without changing the source objects',()=>{
  const item=CONTENT.find(value=>value.id==='autoplay'),before=JSON.stringify(item);
  setLanguage('en');const english=tr(item.text);assert.notEqual(english,item.text);
  setLanguage('de');assert.equal(tr(item.text),item.text);assert.equal(JSON.stringify(item),before);
});

test('English explains expired, unverified and oversized account runs without losing the no-reward warning',()=>{
  setLanguage('en');
  for(const [source,expected]of [
    ['Dieser Run bleibt eine ungewertete Übung.','This run stays an unranked practice round.'],
    ['Das Prüfprotokoll ist voll. Dein Kontoguthaben bleibt unverändert.','The verification log is full. Your account balance stays unchanged.'],
    ['Als Übung abschließen · ohne Kontobelohnung','Finish as practice · no account reward'],
    ['Fortschritt aktualisieren','Refresh progress'],
    ['Neue Wochenaufgaben beginnen montags nach UTC.','New weekly tasks start on Mondays in UTC.']
  ])assert.equal(tr(source),expected);
  setLanguage('de');
});


test('English gaming briefings use the authored duration for every campaign and ordinary window',()=>{
  setLanguage('en');
  for(const seconds of [30,35,40,45,50,60,90])assert.equal(tr(`Dein Zeitfenster: ${seconds} Sekunden. Am Ende entscheidest du, ob du bewusst aufhörst.`),`Your time window: ${seconds} seconds. At the end, you decide whether to stop deliberately.`);
  setLanguage('de');
});


test('English account feedback covers network throttling, wallet rejection and failed replay validation',()=>{
  setLanguage('en');
  for(const source of ['Dafür fehlen Münzen.','Zu viele Anfragen. Bitte versuche es später erneut.','Diese Runde ist abgelaufen. Dein lokales Übungsergebnis bleibt erhalten.','Dieses Ergebnis konnte nicht geprüft werden.','Der Dienst konnte die Anfrage gerade nicht bearbeiten. Bitte versuche es erneut.'])assert.notEqual(tr(source),source);
  setLanguage('de');
});
