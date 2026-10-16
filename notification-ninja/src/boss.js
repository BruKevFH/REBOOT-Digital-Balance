/** Authored, local Autoplay encounters. Boss rules never participate in Open Run ranking. */
const phases=Object.freeze([
  Object.freeze({context:'study',name:'Lernfokus',hint:'Lernhefte behalten. Den endlosen Feed wegwischen.'}),
  Object.freeze({context:'gaming',name:'Team statt Autoplay',hint:'Dein Team darf bleiben. Autoplay und Werbung wegwischen.'}),
  Object.freeze({context:'sleep',name:'Gute-Nacht-Finale',hint:'Ruhe behalten. Noch ein Video kann bis morgen warten.'})
]);
export const BOSS_DEFINITIONS=Object.freeze([
  Object.freeze({id:'scout',name:'Autoplay-Späher',description:'Ein neugieriger Papierdrache versucht, deinen Fokus zu klauen.',maxHealth:20,requiredCorrect:20,color:'#ae8066',accent:'#efbb66',waveInterval:9,phases}),
  Object.freeze({id:'guardian',name:'Feed-Wächter',description:'Durchbrich seine angekündigten Nachrichtenwellen und behalte dein Ziel.',maxHealth:28,requiredCorrect:28,color:'#668e87',accent:'#9bc5a1',waveInterval:8,phases}),
  Object.freeze({id:'overlord',name:'Autoplay-Meister',description:'Drei Lebensbereiche, ein klarer Kopf: Bezwinge den Meister der Endlosschleife.',maxHealth:36,requiredCorrect:36,color:'#8772a0',accent:'#ebbe78',waveInterval:7,phases})
]);
export const getBoss=id=>BOSS_DEFINITIONS.find(boss=>boss.id===id)||null;
export function createBossState(id){const def=getBoss(id);return def?{id:def.id,health:def.maxHealth,maxHealth:def.maxHealth,phase:0,pendingPhase:null,defeated:false,waveClock:0,nextWaveAt:8,cueRemaining:0,burstRemaining:0,waves:0}:null;}
export function bossPhaseForHealth(boss){const def=getBoss(boss?.id);if(!def)return 0;const damage=def.maxHealth-boss.health;return damage>=Math.ceil(def.maxHealth*2/3)?2:damage>=Math.ceil(def.maxHealth/3)?1:0;}
export function getBossSpeed(boss){const tier=BOSS_DEFINITIONS.findIndex(def=>def.id===boss?.id);return tier<0?1:.92+tier*.08+boss.phase*.12+(boss.burstRemaining>0?.12:0);}
/** Reject inconsistent boss saves; values are derived from authored definitions, never trusted from disk. */
export function restoreBossState(value){
  if(!value||typeof value!=='object'||Array.isArray(value))return null;
  const def=getBoss(value.id);if(!def||!Number.isInteger(value.health)||value.health<0||value.health>def.maxHealth||value.maxHealth!==def.maxHealth||!Number.isInteger(value.phase)||value.phase<0||value.phase>2)return null;
  if(value.defeated!==(value.health===0)||value.phase>bossPhaseForHealth(value))return null;
  const bounded=(n,max)=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=max;
  if(!bounded(value.waveClock,1000000)||!bounded(value.nextWaveAt,1000020)||value.nextWaveAt<value.waveClock-1.4||!bounded(value.cueRemaining,1.35)||!bounded(value.burstRemaining,3)||!Number.isInteger(value.waves)||value.waves<0||value.waves>1000000)return null;
  if(value.cueRemaining>0&&value.burstRemaining>0)return null;
  const target=bossPhaseForHealth(value),pending=target>value.phase?target:null;
  if(value.pendingPhase!==pending)return null;
  return {id:def.id,health:value.health,maxHealth:def.maxHealth,phase:value.phase,pendingPhase:pending,defeated:value.defeated,waveClock:value.waveClock,nextWaveAt:value.nextWaveAt,cueRemaining:value.cueRemaining,burstRemaining:value.burstRemaining,waves:value.waves};
}
