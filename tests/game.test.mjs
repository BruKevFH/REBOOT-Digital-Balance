import test from 'node:test';
import assert from 'node:assert/strict';
import { Game, STORAGE_KEY } from '../src/game.js';
import { EVENTS, MODULES } from '../src/content.js';

const NOW = () => Date.UTC(2026, 9, 7, 12);

class MemoryStorage {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
}

function make(storage = new MemoryStorage(), seed = 1234) {
  return new Game({ storage, now: NOW, seed });
}

function step(game, index = 0, score = 80) {
  const event = game.currentEvent();
  assert.ok(event);
  const choice = game.choose(index);
  assert.ok(choice);
  assert.equal(game.choose(index), null, 'a committed event cannot accept the same click twice');
  return choice.mini ? game.finishMini(choice.mini, score) : choice;
}

function present(game, id) {
  const event = EVENTS.find(item => item.id === id);
  assert.ok(event, `missing fixture event: ${id}`);
  game.run.slotIndex = ['morning', 'school', 'lunch', 'afternoon', 'evening', 'night'].indexOf(event.slot);
  game.run.currentEventId = event.id;
  return event;
}

test('Story ends after exactly 126 choices and credits the account once', () => {
  const storage = new MemoryStorage();
  const game = make(storage);
  game.start('story');
  for (let choice = 1; choice <= 126; choice++) {
    const result = step(game);
    assert.equal(result.runEnded, choice === 126);
    assert.equal(result.dayEnded, choice % 6 === 0);
    assert.equal(game.run.day, 1 + Math.floor(choice / 6));
    assert.equal(game.run.slotIndex, choice % 6);
  }
  assert.equal(game.profile.totalDays, 21);
  assert.equal(game.profile.totalRuns, 1);
  assert.equal(game.events.filter(event => event.type === 'choice').length, 126);
  assert.equal(game.run.timeline.filter(entry => entry.eventId).length, 126);
  assert.equal(game.runs.length, 1);
  assert.equal(game.profile.xp, game.run.xp + game.run.bonus);
  assert.equal(game.profile.chips, game.run.chips);
  assert.equal(game.profile.level, 1 + Math.floor(game.profile.xp / 120));
  assert.ok(game.profile.achievements.includes('first-run'));
  const before = game.exportData();
  assert.equal(game.finishRun(), null);
  assert.equal(game.finishRun(true), null);
  assert.equal(game.choose(0), null);
  assert.equal(game.finishMini('focus', 100), null);
  assert.equal(game.resume(), null);
  assert.equal(game.activeMode, null);
  assert.deepEqual(game.exportData(), before);
  const restored = make(storage);
  assert.equal(restored.resume(), null);
  assert.equal(restored.finishRun(), null);
  assert.deepEqual(restored.profile, game.profile);
});

test('Daily ends after exactly 18 choices with three logged days', () => {
  const game = make();
  game.start('daily');
  assert.deepEqual(game.run.stats, { energy: 70, focus: 70, mood: 70, balance: 55, social: 60 });
  for (let choice = 1; choice <= 18; choice++) {
    const result = step(game, 1);
    assert.equal(result.runEnded, choice === 18);
  }
  assert.equal(game.run.day, 4);
  assert.equal(game.run.slotIndex, 0);
  assert.equal(game.profile.totalDays, 3);
  assert.equal(game.profile.totalRuns, 1);
});

test('Endless continues past day 21 and can be finished manually without duplicate credit', () => {
  const game = make();
  game.start('endless');
  for (let i = 0; i < 144; i++) assert.equal(step(game).runEnded, false);
  assert.equal(game.run.day, 25);
  assert.equal(game.profile.totalDays, 24);
  assert.equal(game.run.ended, false);
  assert.equal(game.activeMode, 'endless');
  assert.equal(game.profile.totalRuns, 0);
  assert.ok(game.finishRun(true));
  assert.equal(game.run.manual, true);
  assert.equal(game.profile.totalRuns, 1);
  assert.equal(game.profile.xp, game.run.xp + game.run.bonus);
  assert.equal(game.finishRun(true), null);
});

test('current events do not reroll on repeated access or reload; presentation does not mark them played', () => {
  const storage = new MemoryStorage();
  const game = make(storage);
  game.start();
  const id = game.currentEvent().id;
  for (let i = 0; i < 20; i++) assert.equal(game.currentEvent().id, id);
  assert.deepEqual(game.run.seen, []);
  const restored = make(storage);
  assert.equal(restored.resume().day, 1);
  assert.equal(restored.currentEvent().id, id);
  assert.deepEqual(restored.run.seen, []);
});

test('seeded event progression remains identical across repeated reloads including seen history', () => {
  const uninterrupted = make();
  const storage = new MemoryStorage();
  let resumed = make(storage);
  uninterrupted.start('endless'); resumed.start('endless');
  for (let i = 0; i < 150; i++) {
    assert.equal(resumed.currentEvent().id, uninterrupted.currentEvent().id);
    step(uninterrupted, i % 3); step(resumed, i % 3);
    resumed = make(storage);
    assert.deepEqual(resumed.run.stats, uninterrupted.run.stats);
    assert.deepEqual(resumed.run.seen, uninterrupted.run.seen);
  }
});

test('pending mini persists applied choice and accepts exactly one matching completion', () => {
  const storage = new MemoryStorage();
  const game = make(storage);
  game.start();
  present(game, 'class-ping');
  const choice = game.choose(1);
  assert.equal(choice.mini, 'shield');
  assert.equal(game.run.slotIndex, 1);
  assert.equal(game.run.pendingMini, 'shield');
  assert.equal(game.run.stats.focus, 83);
  const before = game.exportData();
  assert.equal(game.choose(1), null);
  assert.equal(game.finishMini('focus', 100), null);
  assert.equal(game.finishMini('shield', NaN), null);
  assert.deepEqual(game.exportData(), before);
  const restored = make(storage);
  assert.equal(restored.run.pendingMini, 'shield');
  assert.equal(restored.currentEvent().id, 'class-ping');
  assert.equal(restored.run.stats.focus, 83);
  assert.deepEqual(restored.finishMini('shield', 75), { dayEnded: false, runEnded: false });
  assert.equal(restored.run.slotIndex, 2);
  assert.equal(restored.run.pendingMini, null);
  assert.equal(restored.run.xp, 8);
  assert.equal(restored.run.chips, 2);
  assert.equal(restored.run.stats.focus, 86);
  const earned = restored.exportData();
  assert.equal(restored.finishMini('shield', 75), null);
  assert.equal(restored.choose(1), null);
  assert.deepEqual(restored.exportData(), earned);
  const again = make(storage);
  assert.equal(again.finishMini('shield', 100), null);
  assert.equal(again.run.slotIndex, 2);
  assert.equal(again.events.filter(event => event.type === 'choice').length, 1);
  assert.equal(again.events.filter(event => event.type === 'minigame').length, 1);
});

test('mini percentages clamp and reward thresholds preserve the original game', () => {
  const cases = [[-100, 0, 0, 0, -3], [44, 44, 4, 0, 0], [45, 45, 5, 1, 0],
    [74, 74, 7, 1, 3], [75, 75, 8, 2, 3], [1000, 100, 10, 2, 3]];
  for (const [input, score, xp, chips, focusBonus] of cases) {
    const game = make(); game.start(); present(game, 'class-ping'); game.choose(1);
    const focus = game.run.stats.focus;
    assert.ok(game.finishMini('shield', input));
    assert.deepEqual(game.run.miniScores, [{ day: 1, type: 'shield', score }]);
    assert.equal(game.run.xp, xp);
    assert.equal(game.run.chips, chips);
    assert.equal(game.run.stats.focus, focus + focusBonus);
  }
});

test('invalid choices and unknown modes leave state untouched', () => {
  const game = make();
  assert.equal(game.start('bogus'), null);
  assert.equal(game.run, null);
  game.start();
  assert.equal(game.choose(0), null, 'an unpresented event cannot be committed');
  game.currentEvent();
  const before = game.exportData();
  for (const index of [-1, 3, 999, 0.5, NaN, Infinity, '1']) assert.equal(game.choose(index), null);
  assert.equal(game.start('bogus'), null);
  assert.deepEqual(game.exportData(), before);
});

test('no storage, read failure, full storage and later recovery leave play usable', () => {
  const ephemeral = make(null);
  assert.equal(ephemeral.save(), false);
  assert.equal(ephemeral.storageFailed, true);
  ephemeral.start('daily');
  assert.ok(step(ephemeral));
  const inaccessible = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
  const blocked = make(inaccessible);
  assert.equal(blocked.storageFailed, true);
  blocked.start(); assert.ok(step(blocked));
  const storage = new MemoryStorage();
  const game = make(storage); game.start(); game.currentEvent();
  const writable = storage.setItem.bind(storage);
  storage.setItem = () => { throw new Error('QuotaExceededError'); };
  assert.ok(game.choose(0));
  assert.equal(game.storageFailed, true);
  assert.equal(game.save(), false);
  assert.equal(game.run.slotIndex, 1);
  assert.equal(make(storage).run.slotIndex, 0, 'failed write did not pretend to persist progress');
  storage.setItem = writable;
  assert.equal(game.save(), true);
  assert.equal(game.storageFailed, false);
  assert.equal(make(storage).run.slotIndex, 1);
  const nodeDefault = new Game({ now: NOW });
  assert.equal(nodeDefault.storage, null);
});

test('browser localStorage getter failures are caught', () => {
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const oldStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  try {
    Object.defineProperty(globalThis, 'window', { value: {}, configurable: true });
    Object.defineProperty(globalThis, 'localStorage', { get() { throw new Error('blocked'); }, configurable: true });
    const game = new Game({ now: NOW });
    assert.equal(game.storage, null);
    assert.equal(game.storageFailed, true);
    assert.ok(game.start());
  } finally {
    if (oldWindow) Object.defineProperty(globalThis, 'window', oldWindow); else delete globalThis.window;
    if (oldStorage) Object.defineProperty(globalThis, 'localStorage', oldStorage); else delete globalThis.localStorage;
  }
});

test('malformed storage and unsupported schema safely start a fresh profile', () => {
  for (const value of ['{broken', 'null', '[]', '{"schemaVersion":999}']) {
    const storage = new MemoryStorage(); storage.setItem(STORAGE_KEY, value);
    const game = make(storage);
    assert.equal(game.run, null);
    assert.equal(game.profile.name, 'Player');
    assert.equal(game.storageFailed, true);
    assert.ok(game.start());
    assert.equal(game.storageFailed, false, 'a valid subsequent save recovers corrupt storage');
  }
});

test('saved profiles and stats normalize finite values, known IDs, settings and level', () => {
  const storage = new MemoryStorage(); make(storage).start();
  const state = JSON.parse(storage.getItem(STORAGE_KEY));
  Object.assign(state.profile, { xp: 250, chips: -20, level: 999, totalDays: -1,
    bestBalance: 999, name: '  Long player name that exceeds the boundary',
    unlocked: ['pulse', 'pulse', 'unknown'], settings: { sound: false, reducedMotion: 'yes' } });
  Object.assign(state.run.stats, { energy: 1000, focus: -20, mood: null, balance: 'NaN' });
  Object.assign(state.run.relationships, { mia: -10, sami: 1000 });
  Object.assign(state.run, { xp: null, chips: -10, sleepHours: 99, screenMinutes: 'Infinity', nightScreen: -1 });
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
  const game = make(storage);
  assert.equal(game.profile.xp, 250); assert.equal(game.profile.level, 3);
  assert.equal(game.profile.chips, 0); assert.equal(game.profile.totalDays, 0);
  assert.equal(game.profile.bestBalance, 100); assert.ok(game.profile.name.length <= 20);
  assert.deepEqual(game.profile.unlocked, ['pulse']);
  assert.deepEqual(game.profile.settings, { sound: false, reducedMotion: false });
  assert.deepEqual(game.run.stats, { energy: 100, focus: 0, mood: 72, balance: 60, social: 62 });
  assert.equal(game.run.relationships.mia, 0); assert.equal(game.run.relationships.sami, 100);
  assert.equal(game.run.sleepHours, 10.5); assert.equal(game.run.screenMinutes, 0);
  assert.equal(game.run.xp, 0); assert.equal(game.run.chips, 0); assert.equal(game.run.nightScreen, 0);
});

test('invalid mode/day/slot, inconsistent credit and forged pending minis cannot resume', () => {
  const changes = [{ mode: 'unknown' }, { day: 0 }, { day: 22 }, { day: 1.5 },
    { slotIndex: -1 }, { slotIndex: 6 }, { slotIndex: 1.2 }, { credited: true },
    { ended: true, credited: false }, { pendingMini: 'shield', currentEventId: 'class-ping', slotIndex: 1 }];
  for (const change of changes) {
    const storage = new MemoryStorage(); make(storage).start();
    const state = JSON.parse(storage.getItem(STORAGE_KEY));
    state.profile.xp = 240; Object.assign(state.run, change);
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    const game = make(storage);
    assert.equal(game.resume(), null);
    assert.equal(game.profile.xp, 240, 'an invalid run does not destroy valid account progress');
  }
});

test('module purchases combine bank and live chips, charge once, and do not spend credited run totals', () => {
  const game = make(); game.start();
  game.profile.chips = 2; game.run.chips = 3;
  assert.equal(game.unlockModule('pulse'), true);
  assert.equal(game.run.chips, 0); assert.equal(game.profile.chips, 1);
  assert.equal(game.unlockModule('pulse'), false);
  assert.equal(game.unlockModule('unknown'), false);
  assert.equal(game.unlockModule('privacy'), false);
  assert.equal(game.profile.chips, 1);
  game.run.chips = 6;
  assert.equal(game.unlockModule('haptic'), true);
  assert.equal(game.run.rerolls, 1);
  assert.equal(game.profile.chips, 1); assert.equal(game.run.chips, 0);
  game.run.chips = 10;
  game.finishRun(true);
  assert.equal(game.profile.chips, 11);
  assert.equal(game.unlockModule('privacy'), true);
  assert.equal(game.profile.chips, 1);
  assert.equal(game.run.chips, 10, 'completed run is historical and cannot be charged twice');
  assert.equal(game.unlockModule('focus'), false);
});

test('every module uses its documented chip cost and bank-only purchases work', () => {
  for (const module of MODULES) {
    const game = make();
    game.profile.chips = module.cost - 1;
    assert.equal(game.unlockModule(module.id), false);
    game.profile.chips++;
    assert.equal(game.unlockModule(module.id), true);
    assert.equal(game.profile.chips, 0);
    assert.deepEqual(game.profile.unlocked, [module.id]);
  }
});

test('choice impacts clamp stats and keep zero-valued relationships instead of resetting them', () => {
  const game = make(); game.start();
  game.run.stats = { energy: 99, focus: 99, mood: 99, balance: 99, social: 99 };
  present(game, 'morning-scroll'); game.choose(1);
  assert.equal(game.run.stats.energy, 100); assert.equal(game.run.stats.focus, 100);
  assert.equal(game.run.stats.balance, 100);
  game.run.relationships.mia = 0;
  present(game, 'late-message'); game.choose(0);
  assert.equal(game.run.relationships.mia, 5);
  game.run.stats = { energy: 1, focus: 1, mood: 99, balance: 1, social: 50 };
  game.run.sleepHours = 3;
  present(game, 'loop-bed'); game.choose(0);
  assert.equal(game.run.stats.energy, 0); assert.equal(game.run.stats.focus, 0);
  assert.equal(game.run.stats.balance, 0); assert.equal(game.run.stats.mood, 100);
  assert.equal(game.events.filter(event => event.type === 'day_end').at(-1).data.sleepHours, 3);
});

test('sleep, late screens, privacy and light consequences are applied once at day completion', () => {
  function close(withModules) {
    const game = make(); game.start('daily');
    game.profile.unlocked = withModules;
    present(game, 'blue-light-myth');
    const result = game.choose(1);
    assert.equal(result.dayEnded, true);
    assert.equal(game.profile.totalDays, 1);
    assert.equal(game.run.sleepHours, 8); assert.equal(game.run.nightScreen, 0);
    assert.equal(game.run.screenMinutes, 90); assert.equal(game.run.maxNightScreen, 90);
    assert.equal(game.choose(1), null);
    assert.equal(game.profile.totalDays, 1);
    return game;
  }
  const basic = close([]), enhanced = close(['light', 'privacy', 'haptic']);
  assert.equal(basic.run.stats.energy, 47.5);
  assert.equal(basic.run.stats.focus, 50.5);
  assert.ok(Math.abs(enhanced.run.stats.focus - 50.8) < 1e-10);
  assert.equal(enhanced.run.stats.balance, basic.run.stats.balance + 5);
  assert.equal(enhanced.run.rerolls, 1);
  basic.finishRun(true);
  assert.ok(basic.profile.achievements.includes('night-owl'));
});

test('pulse, insights, daily quest history and minigame achievements survive saving', () => {
  const storage = new MemoryStorage();
  const game = make(storage); game.start(); game.profile.unlocked = ['pulse'];
  present(game, 'lab-noise'); game.choose(0);
  assert.deepEqual(game.run.insights, ['privacy']);
  assert.ok(game.run.completedQuests.includes('focus'));
  const energy = game.run.stats.energy;
  game.finishMini('signal', 90);
  assert.equal(game.run.stats.energy, energy + 2);
  game.finishRun(true);
  assert.ok(game.profile.achievements.includes('lab-rat'));
  assert.deepEqual(make(storage).run.insights, ['privacy']);
  const daily = make(); daily.start();
  for (let i = 0; i < 6; i++) step(daily, 1);
  const summary = daily.events.find(event => event.type === 'day_end');
  assert.ok(summary.data.quests.includes('focus'));
  assert.deepEqual(daily.run.completedQuests, [], 'new day starts fresh daily goals');
});

test('export contains independent plain data and never combines already credited run totals', () => {
  const game = make(); game.start();
  game.profile.xp = 120; game.profile.chips = 10;
  game.run.xp = 30; game.run.chips = 4;
  game.finishRun(true);
  const data = game.exportData();
  assert.equal(data.profile.xp, 120 + 30 + game.run.bonus);
  assert.equal(data.profile.chips, 14);
  assert.equal(data.runs.length, 1);
  assert.equal(data.runs[0].xp, 30);
  assert.equal(data.run.credited, true);
  data.profile.xp = 999; data.runs[0].stats.energy = 0; data.events.length = 0;
  assert.notEqual(game.profile.xp, 999);
  assert.notEqual(game.runs[0].stats.energy, 0);
  assert.ok(game.events.length > 0);
  assert.doesNotThrow(() => JSON.stringify(game.exportData()));
});

test('name limits, archived runs and account/module history survive mode changes', () => {
  const storage = new MemoryStorage();
  const game = make(storage);
  assert.equal(game.setName('   '), 'Player');
  assert.equal(game.setName('ABCDEFGHIJKLMNOPQRSTextra'), 'ABCDEFGHIJKLMNOPQRST');
  game.profile.chips = 4; game.unlockModule('pulse');
  game.start('endless'); step(game); game.finishRun(true);
  const account = structuredClone(game.profile);
  game.start('daily');
  assert.equal(game.activeMode, 'daily'); assert.equal(game.runs.length, 1);
  assert.deepEqual(game.profile, account);
  const restored = make(storage);
  assert.equal(restored.profile.name, 'ABCDEFGHIJKLMNOPQRST');
  assert.deepEqual(restored.profile.unlocked, ['pulse']);
  assert.equal(restored.resume().mode, 'daily');
  assert.equal(restored.runs[0].mode, 'endless');
});

test('spatial position and already read chapters resume without resetting or duplicating chapters', () => {
  const storage = new MemoryStorage();
  const game = make(storage); game.start();
  game.run.playerPosition = { x: 12.25, z: -8.5, yaw: .5, pitch: -.4 };
  game.run.readChapters = [1];
  game.save();
  const restored = make(storage);
  assert.equal(restored.run.playerPosition.x, 12.25);
  assert.equal(restored.run.playerPosition.z, -8.5);
  assert.ok(Math.abs(restored.run.playerPosition.yaw - .5) < 1e-10);
  assert.equal(restored.run.playerPosition.pitch, -.4);
  assert.deepEqual(restored.run.readChapters, [1]);
  restored.currentEvent();
  assert.equal(restored.events.filter(event => event.type === 'chapter').length, 1);
  assert.equal(restored.run.timeline.filter(entry => entry.beatDay === 1).length, 1);
});

test('imported positions clamp to world bounds and reject nonfinite coordinates; chapters validate days', () => {
  const storage = new MemoryStorage(); make(storage).start();
  const state = JSON.parse(storage.getItem(STORAGE_KEY));
  state.run.playerPosition = { x: 2000, z: -2000, yaw: 1000, pitch: 8 };
  state.run.readChapters = [0, 1, 1, 4, 21, 22, -1, 1.5, '8'];
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
  const game = make(storage);
  assert.equal(game.run.playerPosition.x, 100); assert.equal(game.run.playerPosition.z, -100);
  assert.ok(game.run.playerPosition.yaw >= -Math.PI && game.run.playerPosition.yaw <= Math.PI);
  assert.equal(game.run.playerPosition.pitch, 1.5);
  assert.deepEqual(game.run.readChapters, [1, 4, 21]);
  state.run.playerPosition.x = null;
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
  assert.equal(make(storage).run.playerPosition, null);
});

test('haptic changes only the presented scene once per day, persists it, and rejects pending/ended runs', () => {
  const storage = new MemoryStorage();
  const game = make(storage); game.start();
  assert.equal(game.rerollEvent(), null);
  game.profile.unlocked = ['haptic']; game.run.rerolls = 1;
  const previous = game.currentEvent();
  const vitals = structuredClone(game.run.stats);
  const replacement = game.rerollEvent();
  assert.ok(replacement); assert.notEqual(replacement.id, previous.id);
  assert.equal(replacement.slot, previous.slot);
  assert.equal(game.run.rerolls, 0);
  assert.equal(game.run.slotIndex, 0); assert.equal(game.run.day, 1);
  assert.equal(game.run.xp, 0); assert.equal(game.run.chips, 0);
  assert.deepEqual(game.run.stats, vitals);
  assert.equal(game.rerollEvent(), null);
  const restored = make(storage);
  assert.equal(restored.currentEvent().id, replacement.id);
  assert.equal(restored.run.rerolls, 0);
  assert.equal(restored.rerollEvent(), null);
  for (let i = 0; i < 6; i++) step(restored);
  assert.equal(restored.run.rerolls, 1);
  present(restored, 'class-ping'); restored.choose(1);
  assert.equal(restored.rerollEvent(), null);
  restored.finishRun(true);
  assert.equal(restored.rerollEvent(), null);
});

test('long endless histories remain bounded while day totals and old minigame records remain meaningful', () => {
  const game = make(null); game.start('endless');
  present(game, 'lab-noise'); game.choose(0); game.finishMini('signal', 90);
  for (let i = 0; i < 5000; i++) step(game, 0, 0);
  assert.equal(game.run.timeline.length, 1000);
  assert.equal(game.events.length, 5000);
  assert.equal(game.run.miniScores.length, 500);
  assert.equal(game.profile.totalDays, Math.floor((5000 + 4) / 6));
  assert.equal(game.run.bestMiniScores.signal, 90);
  assert.ok(!game.run.miniScores.some(score => score.type === 'signal' && score.score >= 80),
    'old score actually left the retained history');
  game.finishRun(true);
  assert.ok(game.profile.achievements.includes('lab-rat'), 'best scores preserve historical eligibility');
  for (let i = 0; i < 30; i++) { game.start('daily'); game.finishRun(true); }
  assert.equal(game.profile.totalRuns, 31);
  assert.equal(game.runs.length, 25);
  const storage = new MemoryStorage(); game.storage = storage; game.save();
  const restored = make(storage);
  assert.equal(restored.profile.totalRuns, 31);
  assert.equal(restored.runs.length, 25);
  assert.equal(restored.events.length, 5000);
});

test('oversized imported histories retain recent entries without dropping account totals', () => {
  const storage = new MemoryStorage();
  const game = make(storage); game.start(); game.finishRun(true);
  const state = JSON.parse(storage.getItem(STORAGE_KEY));
  const old = state.runs[0];
  state.profile.totalRuns = 40;
  state.runs = Array.from({ length: 40 }, (_, index) => ({ ...old, id: `imported-${index}` }));
  state.events = Array.from({ length: 6000 }, (_, index) => ({ id: `event-${index}`, type: 'choice', data: {} }));
  state.run.timeline = Array.from({ length: 1100 }, (_, index) => ({ day: 1, event: `scene-${index}`, choice: 'choice' }));
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
  const restored = make(storage);
  assert.equal(restored.profile.totalRuns, 40);
  assert.equal(restored.runs.length, 25);
  assert.equal(restored.runs[0].id, 'imported-15');
  assert.equal(restored.events.length, 5000);
  assert.equal(restored.events[0].id, 'event-1000');
  assert.equal(restored.run.timeline.length, 1000);
  assert.equal(restored.run.timeline[0].event, 'scene-100');
});
