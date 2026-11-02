import test from 'node:test';
import assert from 'node:assert/strict';
import {getPreferences,normalizePreferences,updatePreferences,PREFERENCES_KEY,onPreferencesChange} from '../notification-ninja/src/preferences.js';
import {createPracticeModel} from '../notification-ninja/src/practice.js';
import {createAudio} from '../notification-ninja/src/audio.js';
import {NinjaGame} from '../notification-ninja/src/game.js';
import {tr,setLanguage} from '../notification-ninja/src/i18n.js';

const storage=()=>{const values=new Map();return {values,getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};};

test('old language and calm preferences migrate with independent sound and shake defaults',()=>{
  const store=storage();store.setItem(PREFERENCES_KEY,JSON.stringify({language:'en',calmEffects:true}));
  assert.deepEqual(getPreferences(store),{language:'en',calmEffects:true,musicVolume:.4,effectsVolume:.5,muted:false,screenShake:true});
  updatePreferences({musicVolume:.2,effectsVolume:.8,muted:true,screenShake:false},{storage:store});
  assert.deepEqual(getPreferences(store),{language:'en',calmEffects:true,musicVolume:.2,effectsVolume:.8,muted:true,screenShake:false});
  assert.equal(normalizePreferences(JSON.parse(store.getItem(PREFERENCES_KEY))).muted,true);
});

test('preference bounds reject malformed values, drop identity fields and retain other saves',()=>{
  const store=storage();store.setItem('notification-ninja:save:v1','guest');store.setItem('account-save','account');
  const next=updatePreferences({musicVolume:4,effectsVolume:-3,screenShake:false,password:'secret',coins:999,username:'Private'},{storage:store});
  assert.equal(next.musicVolume,1);assert.equal(next.effectsVolume,0);assert.equal(next.screenShake,false);
  const before=store.getItem(PREFERENCES_KEY);
  updatePreferences({musicVolume:NaN,effectsVolume:'1',muted:'true',screenShake:null},{storage:store});
  assert.equal(store.getItem(PREFERENCES_KEY),before);assert.equal(store.getItem('notification-ninja:save:v1'),'guest');assert.equal(store.getItem('account-save'),'account');
  assert.equal('password'in next,false);assert.equal('coins'in next,false);assert.equal('username'in next,false);
});

test('blocked preference storage retains only the same session storage identity and informs listeners',()=>{
  const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}},changes=[];
  const unsubscribe=onPreferencesChange(value=>changes.push(value));
  updatePreferences({muted:true,musicVolume:.11},{storage:blocked});unsubscribe();
  assert.equal(getPreferences(blocked).muted,true);assert.equal(getPreferences(blocked).musicVolume,.11);assert.equal(getPreferences(storage()).muted,false);assert.equal(changes.length,1);
});

test('practice covers nine contextual decisions in each world without time or ranked rewards',()=>{
  const game=new NinjaGame({storage:null}),before=game.exportData();
  for(const context of ['study','gaming','sleep']){
    const practice=createPracticeModel(context);let count=0;
    while(!practice.getState().finished){
      const state=practice.getState();assert.equal(state.context,context);assert.equal(state.ranked,false);assert.equal(state.rewards,false);assert.equal('remaining'in state,false);
      assert.ok(state.item.text);assert.ok(state.item.visual);assert.ok(['useful','distraction'].includes(state.item.kind));
      assert.equal(practice.next(),false);const result=practice.choose(state.item.kind==='distraction'?'slice':'keep');assert.equal(result.correct,true);assert.ok(result.explanation.length>30);assert.equal(practice.choose('slice').ok,false);assert.equal(practice.next(),true);count++;
    }
    assert.equal(count,9);assert.equal(practice.getState().correct,9);assert.equal(practice.next(),false);assert.equal(practice.choose('keep').ok,false);
  }
  assert.deepEqual(game.exportData(),before);
});

test('practice changes meaning with context, explains mistakes and resets deliberately',()=>{
  const practice=createPracticeModel('study');while(practice.getState().item.id!=='gaming-invite'){practice.choose('keep');practice.next();}
  assert.equal(practice.getState().item.kind,'distraction');assert.equal(practice.choose('keep').correct,false);assert.equal(practice.getState().correct,1);assert.equal(practice.getState().feedback.expected,'slice');
  assert.equal(practice.setContext('gaming'),true);assert.equal(practice.getState().item.id,'gaming-invite');assert.equal(practice.getState().item.kind,'useful');assert.equal(practice.choose('keep').correct,true);
  const saved=practice.getState();assert.equal(practice.setContext('open'),false);assert.deepEqual(practice.getState(),saved);assert.equal(createPracticeModel('fake').getState().context,'study');
});

function fakeWebAudio(){
  const contexts=[];
  class Param{value=0;cancelScheduledValues(){}setValueAtTime(value){this.value=value;}linearRampToValueAtTime(value){this.value=value;}exponentialRampToValueAtTime(value){this.value=value;}}
  class Node{gain=new Param();frequency=new Param();connections=[];stopped=false;connect(node){this.connections.push(node);}disconnect(){this.connections=[];}start(){}stop(){this.stopped=true;}}
  class Context{currentTime=0;sampleRate=1000;state='running';destination={};gains=[];constructor(){contexts.push(this);}createGain(){const node=new Node();this.gains.push(node);return node;}createOscillator(){return new Node();}createBufferSource(){return new Node();}createBiquadFilter(){return new Node();}createBuffer(channels,length){return {getChannelData:()=>new Float32Array(length)};}async resume(){this.state='running';}async close(){this.state='closed';}}
  return {Context,contexts};
}

test('WebAudio routes independent music/effects levels and master mute without an automatic context',async()=>{
  const old=globalThis.AudioContext,{Context,contexts}=fakeWebAudio();globalThis.AudioContext=Context;
  const audio=createAudio();try{
    audio.setMix({musicVolume:.2,effectsVolume:.8,muted:false});audio.setEnabled(true);assert.equal(contexts.length,0,'preferences never autoplay or allocate audio');
    assert.equal(await audio.unlock(),true);const [master,music,effects]=contexts[0].gains;
    assert.equal(effects.gain.value,.8);assert.equal(master.gain.value,.4);assert.equal(effects.connections[0],master);assert.equal(music.connections[0],master);
    audio.update({scene:'home'},.016);assert.ok(audio.getStats().musicVoices>0);assert.equal(music.gain.value,.48*.2);assert.equal(audio.play('click'),true);
    audio.setMix({musicVolume:0});audio.update({scene:'home'},.016);assert.equal(audio.getStats().musicVoices,0);assert.equal(audio.play('click'),true,'music off leaves effects on');
    audio.setMix({musicVolume:.7,effectsVolume:0});for(let i=0;i<4&&!audio.getStats().musicVoices;i++){contexts[0].currentTime+=.5;audio.update({scene:'home'},.016);}assert.ok(audio.getStats().musicVoices>0);assert.equal(effects.gain.value,0);assert.equal(audio.play('click'),false,'effects off leaves music on');
    audio.setMix({muted:true});assert.equal(master.gain.value,0);assert.equal(audio.getStats().activeVoices,0);audio.update({scene:'home'},.016);assert.equal(audio.getStats().playing,false);assert.equal(audio.play('click'),false);
    audio.setMix({muted:false,effectsVolume:.3});audio.update({scene:'home'},.016);assert.equal(master.gain.value,.4);assert.equal(effects.gain.value,.3);assert.equal(audio.play('click'),true);assert.equal(audio.getStats().musicVolume,.7);
  }finally{audio.dispose();if(old===undefined)delete globalThis.AudioContext;else globalThis.AudioContext=old;}
});

test('practice choice controls and independent settings are translated in English',()=>{
  setLanguage('en');for(const text of ['Wegwischen','Durchlassen','Musiklautstärke','Effektlautstärke','Kamerawackeln erlauben','Üben in deinem Tempo','Auswahlübung starten'])assert.notEqual(tr(text),text);setLanguage('de');
});
