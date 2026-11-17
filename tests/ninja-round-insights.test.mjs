import test from 'node:test';
import assert from 'node:assert/strict';
import {CONTENT} from '../notification-ninja/src/game.js';
import {setLanguage} from '../notification-ninja/src/i18n.js';
import {getRoundInsights,renderRoundInsights} from '../notification-ninja/src/round-insights.js';

function freeze(value){if(value&&typeof value==='object'){for(const child of Object.values(value))freeze(child);Object.freeze(value);}return value;}
const state=(metrics={},rest={})=>({context:'study',result:'lives',elapsed:40,metrics:{correctDecisions:8,usefulMistakes:0,missedDistractions:0,shieldedMistakes:0,...metrics},...rest});

test('round review reports actual counters and a useful next step without touching a frozen run',()=>{
  const input=freeze(state({correctDecisions:17,usefulMistakes:3,missedDistractions:1,shieldedMistakes:2},{profile:{coins:91,unlockedSkins:['default']}}));
  const before=JSON.stringify(input),review=getRoundInsights(input);
  assert.equal(review.reason,'useful-mistakes');
  assert.deepEqual(review.counts,{correct:17,usefulMistakes:3,missedDistractions:1,shieldedMistakes:2});
  assert.equal(review.totalDecisions,23);
  assert.equal(review.context,'study');
  assert.equal(JSON.stringify(input),before);
  assert.equal('profile' in review,false);assert.equal('reward' in review,false);assert.equal('coins' in review,false);
});

test('zero-decision and voluntary-ending reviews never invent a perfect round',()=>{
  const empty=getRoundInsights(state({correctDecisions:0},{result:'stopped'}));
  assert.equal(empty.reason,'no-decisions');assert.equal(empty.intentionalStop,true);
  assert.equal(getRoundInsights(state({}, {result:'healthy-stop'})).reason,'intentional-stop');
  assert.equal(getRoundInsights(state({healthyStops:1})).reason,'intentional-stop');
  assert.equal(getRoundInsights(state()).reason,'steady-round');
  setLanguage('en');
  const html=renderRoundInsights(state({correctDecisions:0},{result:'stopped'}));
  assert.match(html,/No decision was counted/);assert.doesNotMatch(html,/\b(?:perfect|badge|achievement|coins|XP)\b/i);
  assert.match(html,/You chose to end the round yourself/);
  setLanguage('de');
});

test('observed error type determines the suggestion, including errors caught by a shield',()=>{
  assert.equal(getRoundInsights(state({usefulMistakes:1,missedDistractions:4})).reason,'missed-distractions');
  assert.equal(getRoundInsights(state({usefulMistakes:2,missedDistractions:2})).reason,'useful-mistakes');
  assert.equal(getRoundInsights(state({shieldedMistakes:2})).reason,'shielded-mistakes');
  assert.equal(getRoundInsights(state({missedDistractions:1},{result:'stopped'})).reason,'missed-distractions');
});

test('malformed counters remain finite and route attributes cannot inherit untrusted context',()=>{
  for(const input of [null,undefined,[],true,'not a run']){
    assert.doesNotThrow(()=>getRoundInsights(input));assert.equal(getRoundInsights(input).reason,'no-decisions');
  }
  const review=getRoundInsights(state({correctDecisions:NaN,usefulMistakes:Infinity,missedDistractions:-2,shieldedMistakes:'16'}, {context:'sleep" onclick="evil()'}));
  assert.deepEqual(review.counts,{correct:0,usefulMistakes:0,missedDistractions:0,shieldedMistakes:0});assert.equal(review.context,'study');
  const bounded=getRoundInsights(state({correctDecisions:Number.MAX_SAFE_INTEGER,usefulMistakes:1.8}));
  assert.equal(bounded.counts.correct,1_000_000_000);assert.equal(bounded.counts.usefulMistakes,1);assert(Number.isFinite(bounded.totalDecisions));
  assert.match(renderRoundInsights(state({}, {context:'<script>'})),/data-experience-practice="study"/);
  assert.doesNotMatch(renderRoundInsights(state({}, {context:'<script>'})),/<script>/);
});

test('last-error guidance only accepts a canonical signal, matching kind, real count and valid timestamp',()=>{
  const mistake={contentId:'gaming-invite',context:'gaming',kind:'useful',protected:false,elapsed:12,label:'Forged <script>'};
  const accepted=getRoundInsights(state({usefulMistakes:1},{lastMistake:mistake}));
  assert.equal(accepted.context,'gaming');assert.equal(accepted.lastMistake.label,CONTENT.find(item=>item.id==='gaming-invite').label);
  assert.equal(accepted.lastMistake.expected,'keep');assert.equal('elapsed' in accepted.lastMistake,false);
  for(const invalid of [
    {...mistake,contentId:'invented'}, {...mistake,kind:'distraction'}, {...mistake,context:'master'},
    {...mistake,elapsed:100}, {...mistake,elapsed:NaN}, {...mistake,elapsed:-1}, {...mistake,contentId:'power-coins'}
  ])assert.equal(getRoundInsights(state({usefulMistakes:1},{lastMistake:invalid})).lastMistake,null);
  assert.equal(getRoundInsights(state({correctDecisions:0},{lastMistake:mistake})).lastMistake,null);
  assert.equal(getRoundInsights(state({shieldedMistakes:1},{lastMistake:{...mistake,protected:true}})).lastMistake.expected,'keep');
  const distracted=getRoundInsights(state({missedDistractions:1},{lastMistake:{contentId:'streak',context:'sleep',kind:'distraction',elapsed:30}}));
  assert.equal(distracted.context,'sleep');assert.equal(distracted.lastMistake.expected,'slice');
});

test('review actions preserve the actual practice context in both languages without claiming rewards',()=>{
  const input=state({usefulMistakes:1},{context:'sleep',lastMistake:{contentId:'safety',context:'sleep',kind:'useful',elapsed:25}});
  setLanguage('de');let html=renderRoundInsights(input);
  assert.match(html,/NIMs Rundenrückblick/);assert.match(html,/Hilfreiches geschnitten/);assert.match(html,/ECHTE WARNUNG/);
  assert.match(html,/data-experience-practice="sleep"/);assert.match(html,/data-experience-codex="sleep"/);
  setLanguage('en');html=renderRoundInsights(input);
  assert.match(html,/NIM’s round review/);assert.match(html,/Useful items sliced/);assert.match(html,/Your last signal · Rest/);
  assert.match(html,/deliberately let it through/);assert.doesNotMatch(html,/Rundenrückblick|Hilfreiches|Durchlassen|ECHTE WARNUNG|\b(?:coins|XP|verified)\b/i);
  assert.match(html,/translate="no"/);
  setLanguage('de');
});
