import test from 'node:test';
import assert from 'node:assert/strict';
import {hudNumber} from '../notification-ninja/src/hud-numbers.js';
test('HUD preserves exact four/six digit scores and complete streaks in both languages',()=>{
  assert.deepEqual(hudNumber(4600,'de-DE'),{text:'4.600',full:'4.600'});
  assert.deepEqual(hudNumber(999999,'en-GB'),{text:'999,999',full:'999,999'});
  assert.deepEqual(hudNumber(12345,'de-DE',{series:true}),{text:'×12.345',full:'×12.345'});
});
test('long HUD values are localized while their full exact values remain available',()=>{
  assert.match(hudNumber(12345678,'en-GB').text,/^12\.3m$/i);
  assert.equal(hudNumber(12345678,'de-DE').full,'12.345.678');
  assert(!hudNumber(12345678,'de-DE').text.includes('…'));
  assert.equal(hudNumber(-20).full,'0');assert.equal(hudNumber(NaN).full,'0');
});
