import test from 'node:test';
import assert from 'node:assert/strict';
import { NinjaGame, Game, LEVELS, SKINS, CONTENT, STORAGE_KEY, DIFFICULTIES, SKILLS, WORLDS, BACKGROUNDS } from '../notification-ninja/src/game.js';
import { isThrowReady } from '../notification-ninja/src/throwers.js';

class Storage {
  constructor() { this.data = new Map(); }
  getItem(key) { return this.data.get(key) ?? null; }
  setItem(key, value) { this.data.set(key, String(value)); }
}

function setup(mode = 'study', options = {}) {
  const storage = options.storage === undefined ? new Storage() : options.storage;
  const game = new NinjaGame({ storage, seed: 'ninja-test', now: () => 100000, width: 800, height: 600, ...options });
  game.profile.unlockedWorlds = ['study','gaming','sleep','master'];
  assert.equal(game.start({ mode, gamingLimit: options.gamingLimit ?? 90, tutorial: options.tutorial ?? false, difficulty: options.difficulty ?? 'easy' }).ok, true);
  assert.equal(game.state.scene, 'briefing');
  assert.equal(game.nextLevel().ok, true);
  assert.equal(game.state.scene, 'playing');
  return { game, storage };
}

function object(game, contentId = 'streak', values = {}) {
  const item = game._spawnContent(contentId);
  assert.ok(item, `Unknown fixture content: ${contentId}`);
  Object.assign(item, { x: 100, y: 100, vx: 0, vy: 0, radius: 16, age: 0 }, values);
  return item;
}

function cut(game, contentId = 'streak') {
  game.state.objects = [];
  const item = object(game, contentId);
  const events = game.swipe([{ x: 70, y: 100 }, { x: 130, y: 100 }]);
  return { item, events };
}

function passUseful(game, contentId = 'homework') {
  game.state.objects = [];
  object(game, contentId, { y: -200, vy: -100, age: 2 });
  return game.update(0.05);
}

function nearEnd(game, seconds) {
  game.state.stageElapsed = seconds - 0.01;
  game.state.elapsed = Math.max(game.state.elapsed, seconds - 0.01);
  game.state.remaining = 0.01;
  game.state.objects = [];
  return game.update(0.05);
}

function ofType(events, type) { return events.filter(event => event.type === type); }

test('authored levels, skins and contextual notification meanings are distinct and usable', () => {
  assert.equal(Game, NinjaGame);
  assert.equal(STORAGE_KEY, 'notification-ninja:save:v1');
  assert.equal(LEVELS.length, 4);
  assert.deepEqual(SKINS.map(skin => [skin.id, skin.cost]), [['default', 0], ['solar', 80], ['mint', 180], ['neon', 320]]);
  const byId = new Map(CONTENT.map(content => [content.id, content]));
  assert.equal(byId.size, CONTENT.length);
  for (const content of CONTENT) {
    assert.ok(content.label.length > 0);
    assert.ok(content.text.length > 0);
  }
  assert.deepEqual(byId.get('homework').kindByContext, { study: 'useful', gaming: 'distraction', sleep: 'distraction' });
  assert.deepEqual(byId.get('gameclip').kindByContext, { study: 'distraction', gaming: 'useful', sleep: 'distraction' });
  assert.deepEqual(byId.get('quiet').kindByContext, { study: 'distraction', gaming: 'distraction', sleep: 'useful' });
  for (const context of ['study', 'gaming', 'sleep']) {
    const { game } = setup(context);
    for (const id of ['homework', 'gameclip', 'quiet', 'urgent-school', 'break', 'safety', 'scary-lure']) {
      assert.equal(object(game, id).kind, byId.get(id).kindByContext[context], `${id} in ${context}`);
    }
  }
});

test('starting validates modes and explicit gaming budgets without changing a live run', () => {
  const { game } = setup('gaming');
  for (const request of [{ mode: 'unknown' }, { mode: 'gaming', gamingLimit: 0 }, { mode: 'gaming', gamingLimit: 46 }, { mode: 'gaming', gamingLimit: NaN }]) {
    const before = game.getSnapshot();
    const result = game.start(request);
    assert.equal(result.ok, false);
    assert.ok(result.reason);
    assert.deepEqual(game.getSnapshot(), before);
  }
  for (const gamingLimit of [45, 60, 90]) {
    const { game: selected } = setup('gaming', { gamingLimit });
    assert.equal(selected.state.remaining, gamingLimit);
  }
});

test('swept swipes cut a fast crossing exactly once and clicks cannot collect objects', () => {
  const { game } = setup();
  game.state.objects = [];
  const item = object(game, 'streak', { x: 350, y: 160 });
  for (const points of [[{ x: 350, y: 160 }], [{ x: 350, y: 160 }, { x: 350, y: 160 }], [{ x: 350, y: 160 }, { x: 352, y: 160 }]]) {
    assert.equal(ofType(game.swipe(points), 'sliced').length, 0);
    assert.ok(game.state.objects.some(candidate => candidate.id === item.id));
  }
  const events = game.swipe({ x1: 0, y1: 160, x2: 700, y2: 160 });
  assert.equal(ofType(events, 'sliced').length, 1);
  assert.equal(game.state.metrics.cuts, 1);
  assert.equal(game.state.objects.some(candidate => candidate.id === item.id), false);
  const after = game.state.score;
  assert.ok(after > 0);
  assert.equal(ofType(game.swipe({ x1: 0, y1: 160, x2: 700, y2: 160 }), 'sliced').length, 0);
  assert.equal(game.state.score, after);
});

test('collision follows every segment and rejects a bounding-box false hit', () => {
  const { game } = setup();
  game.state.objects = [];
  const miss = object(game, 'streak', { x: 100, y: 100, radius: 10 });
  assert.equal(ofType(game.swipe([{ x: 0, y: 0 }, { x: 200, y: 0 }, { x: 200, y: 200 }]), 'sliced').length, 0);
  assert.ok(game.state.objects.includes(miss));
  const events = game.swipe([{ x: 0, y: 0 }, { x: 0, y: 100 }, { x: 200, y: 100 }]);
  assert.equal(ofType(events, 'sliced').length, 1);
});

test('useful messages passing, useful cuts and missed distractions have separate consequences', () => {
  const { game } = setup();
  game.state.objects = [];
  object(game, 'homework', { y: -200, vy: -100, age: 2 });
  const before = { score: game.state.score, balance: game.state.balance };
  assert.equal(ofType(game.update(0.05), 'useful-passed').length, 1);
  assert.equal(game.state.metrics.usefulPassed, 1);
  assert.equal(game.state.score, before.score + 100);
  assert.equal(game.state.balance, before.balance + 5);
  game.state.combo = 5;
  const lives = game.state.lives;
  assert.equal(ofType(cut(game, 'homework').events, 'useful-mistake').length, 1);
  assert.equal(game.state.metrics.usefulMistakes, 1);
  assert.equal(game.state.lives, lives - 1);
  assert.equal(game.state.combo, 0);
  assert.equal(game.state.overload, 18);
  game.state.objects = [];
  object(game, 'streak', { y: -200, vy: -100, age: 2 });
  assert.equal(ofType(game.update(0.05), 'distraction-missed').length, 1);
  assert.equal(game.state.metrics.missedDistractions, 1);
  assert.equal(game.state.overload, 30);
  assert.equal(game.state.metrics.cuts, 0);
  assert.equal(game.state.lives, lives - 2, 'each missed distraction costs one heart too');
  assert.equal(game.state.metrics.lifeLost, 2);
});

test('a useful cut at the overload threshold still costs exactly one heart', () => {
  const { game } = setup();
  game.state.objects = [];
  game.state.overload = 95;
  const events = cut(game, 'homework').events;
  assert.equal(ofType(events, 'life-lost').length, 1);
  assert.equal(game.state.lives, 4);
  assert.equal(game.state.metrics.lifeLost, 1);
  assert.equal(game.state.overload, 60);
});

test('pause freezes position, effects and budget; resume continues without catch-up', () => {
  const { game } = setup('gaming');
  game.state.objects = [];
  object(game, 'streak', { vx: 100, vy: -100 });
  game.state.effects.slow = 4;
  assert.equal(game.pause().ok, true);
  const paused = game.getSnapshot();
  for (let i = 0; i < 30; i++) assert.deepEqual(game.update(5), []);
  assert.deepEqual(game.getSnapshot(), paused);
  assert.deepEqual(game.swipe({ x1: 0, y1: 100, x2: 400, y2: 100 }), []);
  assert.equal(game.resume().ok, true);
  const prior = game.state.stageElapsed;
  game.update(1);
  assert.ok(game.state.stageElapsed > prior);
  assert.ok(game.state.stageElapsed - prior <= 0.05000001, 'large frame delay must be bounded');
});

test('gaming limits are explicit choices with a single 15-second extension', () => {
  for (const gamingLimit of [45, 60, 90]) {
    const { game, storage } = setup('gaming', { gamingLimit });
    const events = nearEnd(game, gamingLimit);
    assert.equal(ofType(events, 'limit-reached').length, 1);
    assert.equal(game.state.scene, 'limit-choice');
    assert.equal(game.state.ended, false);
    const pausedClock = game.state.stageElapsed;
    game.update(0.05);
    assert.equal(game.state.stageElapsed, pausedClock);
    assert.equal(game.continueAfterLimit().ok, true);
    assert.equal(game.state.extensionUsed, true);
    assert.equal(game.state.scene, 'playing');
    assert.equal(game.state.remaining, 15);
    assert.equal(game.state.overload, 15);
    assert.equal(game.continueAfterLimit().ok, false);
    nearEnd(game, gamingLimit + 15);
    assert.equal(game.state.scene, 'limit-choice');
    assert.equal(game.continueAfterLimit().ok, false);
    const restored = new NinjaGame({ storage, width: 800, height: 600 });
    assert.equal(restored.state.scene, 'limit-choice');
    assert.equal(restored.state.extensionUsed, true);
    assert.equal(restored.continueAfterLimit().ok, false);
    assert.equal(restored.requestStop().ok, true);
    assert.equal(restored.state.ended, true);
  }
});

test('choosing to stop at the gaming limit is a healthy completion credited once', () => {
  const { game } = setup('gaming');
  for(let i=0;i<12;i++)cut(game);
  nearEnd(game, 90);
  const score = game.state.score;
  assert.equal(game.requestStop().ok, true);
  assert.equal(game.state.score, score + 100);
  assert.equal(game.state.metrics.healthyStops, 1);
  assert.equal(game.state.ended, true);
  const awarded = game.profile.coins;
  assert.equal(awarded, 3);
  assert.equal(game.requestStop().ok, false);
  game.update(0.05);
  assert.equal(game.profile.coins, awarded);
  assert.equal(game.profile.totalRuns, 1);
});

test('sleep offers a healthy early stop after eight seconds without inventing a failure', () => {
  const { game } = setup('sleep');
  assert.equal(game.state.stopAvailable, false);
  assert.equal(game.requestStop().ok, false);
  game.state.stageElapsed = 7.99;
  game.state.elapsed = 7.99;
  game.state.remaining = 67.01;
  game.update(0.05);
  assert.equal(game.state.stopAvailable, true);
  const lives = game.state.lives;
  assert.equal(game.requestStop().ok, true);
  assert.equal(game.state.ended, true);
  assert.equal(game.state.lives, lives);
  assert.equal(game.state.metrics.healthyStops, 1);
  assert.ok(game.state.score >= 100);
});

test('sleep continuation is an explicit one-time bonus with a cost and does not reset the clock', () => {
  const { game } = setup('sleep');
  assert.equal(game.continueSleep().ok, false);
  game.state.stageElapsed = 8;
  game.state.elapsed = 8;
  game.state.remaining = 67;
  game.update(0.05);
  const before = { score: game.state.score, elapsed: game.state.stageElapsed, balance: game.state.balanceScore };
  assert.equal(game.continueSleep().ok, true);
  assert.equal(game.state.score, before.score + 200);
  assert.equal(game.state.overload, 15);
  assert.equal(game.state.stageElapsed, before.elapsed);
  assert.equal(game.state.metrics.sleepContinues, 1);
  assert.ok(game.state.balanceScore < before.balance);
  assert.equal(game.continueSleep().ok, false);
  assert.equal(game.requestStop().ok, true);
  assert.equal(game.state.ended, true);
});

test('campaign completion waits for the next briefing action rather than silently starting a level', () => {
  const { game } = setup('campaign');
  game.state.lives = 2;
  const completed = nearEnd(game, 75);
  assert.equal(ofType(completed, 'level-complete').length, 1);
  assert.equal(game.state.scene, 'briefing');
  assert.equal(game.state.awaitingNext, true);
  const elapsed = game.state.elapsed;
  game.update(0.05);
  assert.equal(game.state.elapsed, elapsed);
  assert.equal(game.nextLevel().ok, true);
  assert.equal(game.state.context, 'gaming');
  assert.equal(game.state.scene, 'playing');
  assert.equal(game.state.lives, 3, 'one heart is restored between campaign levels');
});

test('powerups provide one shield, timed slow motion and score doubling with an honest clock', () => {
  const { game } = setup();
  assert.equal(ofType(cut(game, 'power-shield').events, 'powerup').length, 1);
  assert.equal(game.state.effects.shield, 1);
  const before = { lives: game.state.lives, overload: game.state.overload };
  cut(game, 'homework');
  assert.equal(game.state.effects.shield, 0);
  assert.equal(game.state.lives, before.lives);
  assert.equal(game.state.overload, before.overload);
  assert.equal(game.state.metrics.shieldedMistakes, 1);
  cut(game, 'homework');
  assert.equal(game.state.lives, before.lives - 1);
  cut(game, 'power-slow');
  assert.equal(game.state.effects.slow, 6);
  game.state.objects = [];
  const moving = object(game, 'streak', { vx: 100 });
  const elapsed = game.state.stageElapsed;
  game.update(0.05);
  assert.equal(game.state.stageElapsed, elapsed + 0.05);
  assert.ok(Math.abs(moving.x - 102.5) < 0.00001);
  assert.ok(game.state.effects.slow < 6);
  cut(game, 'power-multiplier');
  assert.equal(game.state.effects.multiplier, 10);
  game.state.combo = 0;
  const score = game.state.score;
  cut(game, 'streak');
  assert.equal(game.state.score - score, 200);
  assert.equal(game.state.metrics.powerups, 3);
});

test('five consecutive good decisions trigger flow and safe chaining leaves useful messages untouched', () => {
  const { game } = setup();
  for (let i = 0; i < 4; i++) cut(game, 'streak');
  assert.equal(game.state.metrics.flowTriggers, 0);
  game.state.objects = [];
  object(game, 'streak');
  const nearby = object(game, 'update', { x: 150, y: 140 });
  const useful = object(game, 'homework', { x: 160, y: 160 });
  const events = game.swipe([{ x: 70, y: 100 }, { x: 130, y: 100 }]);
  assert.equal(ofType(events, 'flow-started').length, 1);
  assert.equal(game.state.metrics.flowTriggers, 1);
  assert.equal(game.state.effects.flow, 5);
  assert.equal(game.state.objects.some(item => item.id === nearby.id), false);
  assert.equal(game.state.objects.some(item => item.id === useful.id), true);
  assert.equal(game.state.metrics.usefulMistakes, 0);
  assert.equal(game.state.bestCombo, 6);
});

test('useful passes count toward flow, which slows motion without extending the stage clock', () => {
  const { game } = setup();
  for (let i = 0; i < 3; i++) cut(game, 'streak');
  passUseful(game);
  assert.equal(game.state.metrics.flowTriggers, 0);
  assert.equal(ofType(passUseful(game), 'flow-started').length, 1);
  assert.equal(game.state.metrics.flowTriggers, 1);
  game.state.objects = [];
  const moving = object(game, 'streak', { vx: 100 });
  const elapsed = game.state.stageElapsed;
  game.update(0.05);
  assert.ok(moving.x > 100 && moving.x < 105, 'flow must change real physical velocity');
  assert.equal(game.state.stageElapsed, elapsed + 0.05);
  assert.ok(game.state.effects.flow > 0 && game.state.effects.flow < 5);
});

test('first campaign starts a tutorial requiring both slices and useful passes without arcade or profile awards', () => {
  const storage = new Storage();
  const game = new NinjaGame({ storage, seed: 'tutorial', width: 800, height: 600 });
  assert.equal(game.profile.tutorialCompleted, false);
  assert.equal(game.start({ mode: 'campaign' }).ok, true);
  assert.equal(game.state.isTutorial, true);
  assert.equal(game.state.stageIndex, -1);
  assert.equal(game.nextLevel().ok, true);
  cut(game); cut(game);
  for (let i = 0; i < 3; i++) passUseful(game);
  assert.equal(game.state.scene, 'playing');
  assert.equal(game.profile.tutorialCompleted, false);
  passUseful(game);
  assert.equal(game.state.scene, 'briefing');
  assert.equal(game.state.awaitingNext, true);
  assert.equal(game.profile.tutorialCompleted, true);
  assert.equal(game.profile.coins, 0);
  assert.equal(game.profile.totalRuns, 0);
  assert.equal(game.state.score, 0);
  assert.equal(game.state.scoreArcade, 0);
  const restored = new NinjaGame({ storage });
  assert.equal(restored.profile.tutorialCompleted, true);
  assert.equal(game.nextLevel().ok, true);
  assert.equal(game.state.isTutorial, false);
  assert.equal(game.state.context, 'study');
  assert.equal(game.state.remaining, 75);
});

test('tutorial can be explicitly skipped and never becomes a scored sixty-second run', () => {
  const game = new NinjaGame({ storage: new Storage() });
  game.start({ mode: 'campaign' });
  assert.equal(game.skipTutorial().ok, true);
  assert.equal(game.state.isTutorial, false);
  assert.equal(game.state.scene, 'briefing');
  assert.equal(game.nextLevel().ok, true);
  assert.equal(game.state.remaining, 75);
  assert.equal(game.skipTutorial().ok, false);
  const tutorial = new NinjaGame({ storage: new Storage() });
  tutorial.start({ mode: 'campaign' });
  tutorial.nextLevel();
  nearEnd(tutorial, 60);
  assert.equal(tutorial.state.scene, 'briefing');
  assert.equal(tutorial.state.score, 0);
  assert.equal(tutorial.profile.coins, 0);
  assert.equal(tutorial.profile.totalRuns, 0);
});

test('master context changes at twenty-five, fifty and seventy-five seconds with a fixed ninety-second budget', () => {
  const { game } = setup('master');
  assert.equal(game.state.remaining, 90);
  let context = game.state.context;
  for (const boundary of [25, 50, 75]) {
    game.state.objects = [];
    game.state.stageElapsed = boundary - 0.01;
    game.state.elapsed = boundary - 0.01;
    game.state.remaining = 90 - boundary + 0.01;
    const events = game.update(0.05);
    assert.equal(ofType(events, 'context-changed').length, 1);
    assert.notEqual(game.state.context, context);
    assert.ok(Math.abs(game.state.remaining - (90 - game.state.stageElapsed)) < 0.00001);
    context = game.state.context;
  }
  nearEnd(game, 90);
  assert.equal(game.state.ended, true);
  assert.equal(game.state.scoreArcade, game.state.score);
  assert.ok(game.state.balanceScore >= 0 && game.state.balanceScore <= 100);
});

test('master waits for old cards to drain and retains each card birth-context classification', () => {
  const { game } = setup('master');
  game.state.objects = [];
  const oldCard = object(game, 'gameclip');
  assert.equal(oldCard.kind, 'distraction');
  game.state.stageElapsed = 24.99;
  game.state.elapsed = 24.99;
  const changing = game.update(0.05);
  assert.equal(ofType(changing, 'context-changing').length, 1);
  assert.equal(ofType(changing, 'context-changed').length, 0);
  assert.equal(game.state.context, 'study');
  assert.equal(oldCard.context, 'study');
  assert.equal(oldCard.kind, 'distraction');
  const events = game.swipe([{ x: 70, y: oldCard.y }, { x: 130, y: oldCard.y }]);
  assert.equal(ofType(events, 'sliced').length, 1);
  assert.equal(ofType(game.update(0.05), 'context-changed').length, 1);
  assert.equal(game.state.context, 'gaming');
  assert.equal(object(game, 'gameclip').kind, 'useful');
});

test('equal seeds and frame inputs generate identical contextual objects', () => {
  const { game: first } = setup('study', { storage: null });
  const { game: second } = setup('study', { storage: null });
  for (let i = 0; i < 50; i++) {
    assert.deepEqual(first.update(0.05), second.update(0.05));
  }
  assert.ok(first.state.objects.length > 0);
  assert.deepEqual(first.state.objects, second.state.objects);
  assert.equal(first.state.score, second.state.score);
});

test('an authored useful card flies from the bottom beyond the top and earns a pass without any swipe', () => {
  const { game } = setup();
  game.state.objects = [];
  const card = game._spawnContent('homework');
  assert.ok(card.y > game.height);
  assert.ok(card.vy < 0);
  let passed = [];
  for (let frame = 0; frame < 120 && passed.length === 0; frame++) {
    game.state.objects = game.state.objects.filter(item => item.id === card.id);
    passed = ofType(game.update(0.05), 'useful-passed').filter(event => event.id === card.id);
  }
  assert.equal(passed.length, 1);
  assert.ok(card.y + card.radius < 0);
  assert.ok(game.state.stageElapsed >= 4 && game.state.stageElapsed <= 4.65);
  assert.equal(game.state.metrics.usefulPassed, 1);
  assert.equal(game.state.metrics.cuts, 0);
  assert.equal(game.state.score, 100);
  assert.equal(game.state.scoreArcade, 100);
  assert.equal(game.state.lives, 5);
});

test('results reward and high score survive loading without duplicate profile awards', () => {
  const { game, storage } = setup();
  for(let i=0;i<14;i++)cut(game);
  game.state.score = game.state.scoreArcade = 1250;
  nearEnd(game, 75);
  assert.equal(game.state.ended, true);
  assert.equal(game.state.credited, true);
  assert.equal(game.profile.coins, 3);
  assert.equal(game.profile.totalRuns, 1);
  assert.equal(game.profile.highScores.study, 1250);
  const profile = structuredClone(game.profile);
  assert.equal(game.nextLevel().ok, false);
  game.update(0.05);
  assert.deepEqual(game.profile, profile);
  const restored = new NinjaGame({ storage });
  assert.deepEqual(restored.profile, profile);
  assert.equal(restored.resumeRun().ok, false);
  restored.update(0.05);
  assert.deepEqual(restored.profile, profile);
});

test('skin purchases validate funds and ownership and selection persists', () => {
  const { game, storage } = setup();
  assert.equal(game.buySkin('solar').ok, false);
  assert.equal(game.buySkin('unknown').ok, false);
  assert.equal(game.selectSkin('neon').ok, false);
  game.profile.coins = 100;
  assert.equal(game.buySkin('solar').ok, true);
  assert.equal(game.profile.coins, 20);
  assert.equal(game.buySkin('solar').ok, false);
  assert.equal(game.profile.coins, 20);
  assert.equal(game.selectSkin('solar').ok, true);
  assert.equal(game.profile.selectedSkin, 'solar');
  assert.equal(game.state.skin, 'solar');
  const restored = new NinjaGame({ storage });
  assert.equal(restored.profile.coins, 20);
  assert.equal(restored.profile.selectedSkin, 'solar');
  assert.ok(restored.profile.unlockedSkins.includes('solar'));
});

test('paused runs restore complete physical state and resume deliberately', () => {
  const { game, storage } = setup('gaming', { gamingLimit: 60 });
  game.state.objects = [];
  object(game, 'streak', { x: 230, y: 180, vx: 75, vy: -200, radius: 48, age: 0.4 });
  game.state.effects.slow = 3.5;
  game.state.score = 70;
  game.state.stageElapsed = 4.25;
  game.state.elapsed = 4.25;
  game.state.remaining = 55.75;
  game.pause();
  assert.equal(game.save().ok, true);
  const restored = new NinjaGame({ storage, width: 800, height: 600 });
  assert.equal(restored.state.score, 70);
  assert.equal(restored.state.stageElapsed, 4.25);
  assert.equal(restored.state.remaining, 55.75);
  assert.equal(restored.state.effects.slow, 3.5);
  assert.equal(restored.state.objects.length, 1);
  assert.deepEqual(restored.state.objects[0], game.state.objects[0]);
  assert.equal(restored.state.paused, true);
  assert.deepEqual(restored.update(0.05), []);
  assert.equal(restored.resumeRun().ok, true);
  assert.equal(restored.state.paused, false);
});

test('genuine campaign progress restores the completed prefix and the next active level', () => {
  const { game, storage } = setup('campaign');
  game.state.lives = 2;
  nearEnd(game, 75);
  assert.equal(game.state.metrics.stageStats.length, 1);
  assert.equal(game.nextLevel().ok, true);
  assert.equal(game.state.stageIndex, 1);
  assert.equal(game.pause().ok, true);
  const restored = new NinjaGame({ storage, width: 800, height: 600 });
  assert.equal(restored.state.scene, 'playing');
  assert.equal(restored.state.paused, true);
  assert.equal(restored.state.stageIndex, 1);
  assert.equal(restored.state.levelIndex, 1);
  assert.equal(restored.state.context, 'gaming');
  assert.equal(restored.state.remaining, 90);
  assert.equal(restored.state.lives, 3);
  assert.equal(restored.state.metrics.stageStats.length, 1);
  assert.equal(restored.state.metrics.stageStats[0].levelIndex, 0);
  assert.equal(restored.state.metrics.stageStats[0].elapsed, 75);
  assert.equal(restored.profile.totalRuns, 0);
  assert.equal(restored.resumeRun().ok, true);
});

test('resize preserves object proportions and velocities instead of resetting a run', () => {
  const { game } = setup();
  game.state.objects = [];
  const item = object(game, 'streak', { x: 200, y: 300, vx: 100, vy: -80 });
  const elapsed = game.state.stageElapsed;
  assert.equal(game.resize(400, 300).ok, true);
  assert.equal(item.x, 100);
  assert.equal(item.y, 150);
  assert.equal(item.vx, 50);
  assert.equal(item.vy, -40);
  assert.equal(game.state.stageElapsed, elapsed);
  const before = game.getSnapshot();
  assert.equal(game.resize(NaN, 0).ok, false);
  assert.deepEqual(game.getSnapshot(), before);
});

test('storage faults do not stop play; snapshots are detached and invalid frames cannot poison state', () => {
  const broken = { getItem() { throw new Error('unavailable'); }, setItem() { throw new Error('full'); } };
  const { game } = setup('study', { storage: broken });
  assert.equal(game.storageFailed, true);
  assert.equal(game.save().ok, false);
  assert.equal(ofType(cut(game).events, 'sliced').length, 1);
  const snapshot = game.getSnapshot();
  snapshot.state.score = -123;
  snapshot.profile.coins = -456;
  assert.ok(game.state.score >= 0);
  assert.ok(game.profile.coins >= 0);
  const prior = game.state.stageElapsed;
  for (const value of [NaN, Infinity, -1]) assert.deepEqual(game.update(value), []);
  assert.equal(game.state.stageElapsed, prior);
  assert.deepEqual(game.swipe([{ x: NaN, y: 0 }, { x: 100, y: Infinity }]), []);
  assert.ok(Number.isFinite(game.state.score));
});

test('corrupt or impossible saved state cannot restore phantom rewards or an invalid run', () => {
  for (const raw of ['{bad json', JSON.stringify({ schemaVersion: 99, state: { scene: 'playing' }, profile: { coins: 999 } })]) {
    const storage = new Storage();
    storage.setItem(STORAGE_KEY, raw);
    const game = new NinjaGame({ storage });
    assert.equal(game.resumeRun().ok, false);
    assert.equal(game.profile.totalRuns, 0);
    assert.equal(game.profile.coins, 0);
  }
  const { game, storage } = setup();
  game.save();
  const data = JSON.parse(storage.getItem(STORAGE_KEY));
  data.state.levelIndex = 999;
  data.state.objects = Array.from({ length: 60 }, (_, i) => ({ id: i, x: Infinity, y: -Infinity }));
  data.state.score = '999999';
  storage.setItem(STORAGE_KEY, JSON.stringify(data));
  const restored = new NinjaGame({ storage });
  assert.equal(restored.resumeRun().ok, false);
  assert.ok(restored.state.objects.length <= 50);
  assert.ok(Number.isFinite(restored.state.score));
  const { game: campaign, storage: campaignStorage } = setup('campaign');
  campaign.profile.coins = 37;
  campaign.save();
  const forgedProgress = JSON.parse(campaignStorage.getItem(STORAGE_KEY));
  Object.assign(forgedProgress.state, { stageIndex: 3, levelIndex: 3, context: 'study' });
  assert.deepEqual(forgedProgress.state.metrics.stageStats, []);
  campaignStorage.setItem(STORAGE_KEY, JSON.stringify(forgedProgress));
  const rejectedCampaign = new NinjaGame({ storage: campaignStorage });
  assert.equal(rejectedCampaign.state.scene, 'home');
  assert.equal(rejectedCampaign.resumeRun().ok, false);
  assert.equal(rejectedCampaign.profile.coins, 37, 'valid profile funds survive rejection of impossible run progress');
});

test('Master finale launches more waves and ramps new flights without changing the ninety-second clock', () => {
  function waves(begin, switchIndex) {
    const { game } = setup('master');
    game.state.stageElapsed = begin;
    game.state.elapsed = begin;
    game.state.remaining = 90 - begin;
    game.state.masterSwitchIndex = switchIndex;
    game.state.context = 'study';
    game.state.spawnTimer = .1;
    const times = [], launches = [];
    for (let frame = 0; frame < 180; frame++) {
      game.state.objects = [];
      const launched = ofType(game.update(.05), 'spawned');
      if (launched.length) { times.push(game.state.stageElapsed); launches.push(launched); }
    }
    const average = (times.at(-1) - times[0]) / (times.length - 1);
    return { game, times, average, first: launches[0][0] };
  }
  const earlier = waves(10, 0), finale = waves(75, 3);
  assert.ok(earlier.average > 1.15 && earlier.average < 1.25);
  assert.ok(finale.average > .67 && finale.average < .74);
  assert.ok(finale.times.length > earlier.times.length);
  for (const field of ['x', 'y', 'vx', 'gravity', 'radius']) assert.equal(finale.first[field], earlier.first[field], `unchanged ${field}`);
  assert.ok(finale.first.vy < earlier.first.vy, 'later newly launched cards move faster');
  assert.ok(Math.abs(finale.game.state.stageElapsed - 84) < .000001);
  assert.ok(Math.abs(finale.game.state.remaining - 6) < .000001);
  assert.equal(finale.game.state.duration, 90);
});

test('Master final transition drains old cards and pause blocks every additional launch', () => {
  const { game } = setup('master');
  game.state.stageElapsed = 74.99;
  game.state.elapsed = 74.99;
  game.state.remaining = 15.01;
  game.state.masterSwitchIndex = 2;
  game.state.context = 'sleep';
  game.state.spawnTimer = 0;
  const old = object(game, 'quiet', { x: 200, y: 150, vy: 0 });
  assert.equal(old.kind, 'useful');
  assert.equal(ofType(game.update(.05), 'context-changing').length, 1);
  for (let frame = 0; frame < 10; frame++) assert.equal(ofType(game.update(.05), 'spawned').length, 0);
  assert.equal(game.state.pendingContext, 'study');
  assert.equal(game.state.spawnCount, 0);
  assert.equal(game.state.spawnTimer, 0);
  game.pause();
  const paused = game.getSnapshot();
  for (let frame = 0; frame < 40; frame++) assert.deepEqual(game.update(.05), []);
  assert.deepEqual(game.getSnapshot(), paused);
  game.resume();
  old.y = -old.radius - 1;
  old.vy = -100;
  const drained = game.update(.05);
  assert.equal(ofType(drained, 'useful-passed').length, 1);
  assert.equal(ofType(drained, 'context-changed').length, 1);
  assert.equal(game.state.context, 'study');
  assert.equal(game.state.pendingContext, null);
  assert.equal(old.context, 'sleep');
  assert.equal(old.kind, 'useful');
  const launched = [];
  for (let frame = 0; frame < 8; frame++) launched.push(...ofType(game.update(.05), 'spawned'));
  assert.ok(launched.length > 0);
  assert.ok(launched.every(card => card.context === 'study'));
});

test('each missed distraction costs exactly one heart and five misses end an easy run', () => {
  const { game } = setup();
  assert.equal(game.state.lives, 5);
  for (let i = 0; i < 5; i++) {
    game.state.objects = [];
    game.state.combo = 3;
    game.state.decisionStreak = 4;
    object(game, 'streak', { y: -200, vy: -100 });
    const events = game.update(.05);
    assert.equal(ofType(events, 'distraction-missed').length, 1);
    const loss = ofType(events, 'life-lost');
    assert.equal(loss.length, 1);
    assert.equal(loss[0].reason, 'distraction-missed');
    assert.equal(game.state.lives, 4 - i);
    assert.equal(game.state.combo, 0);
    assert.equal(game.state.decisionStreak, 0);
    assert.equal(game.state.ended, i === 4);
  }
  assert.equal(game.state.result, 'lives');
  assert.equal(game.state.metrics.lifeLost, 5);
  assert.equal(game.state.metrics.missedDistractions, 5);
});

test('campaign recovery restores one heart and never exceeds five', () => {
  for (const before of [1, 4, 5]) {
    const { game } = setup('campaign');
    game.state.lives = before;
    nearEnd(game, 75);
    assert.equal(game.state.lives, Math.min(5, before + 1));
    assert.equal(game.nextLevel().ok, true);
    assert.equal(game.state.context, 'gaming');
  }
});

test('version-one saves preserve three-heart runs, coins, unlocked skins and highscores', () => {
  const { game, storage } = setup('gaming');
  game.state.lives = 3;
  game.profile.coins = 127;
  game.profile.highScores.gaming = 8800;
  game.profile.unlockedSkins.push('solar');
  game.profile.selectedSkin = 'solar';
  game.state.skin = 'solar';
  game.pause();
  const restored = new NinjaGame({ storage });
  assert.equal(restored.storageFailed, false);
  assert.equal(restored.state.lives, 3);
  assert.equal(restored.state.scene, 'playing');
  assert.equal(restored.profile.coins, 127);
  assert.equal(restored.profile.highScores.gaming, 8800);
  assert.equal(restored.profile.selectedSkin, 'solar');
  assert.ok(restored.profile.unlockedSkins.includes('solar'));
  restored.state.lives = 5;
  restored.save();
  assert.equal(new NinjaGame({ storage }).state.lives, 5);
});

test('each room launches its own familiar illustrated objects in small, gentle waves', () => {
  const specific = {
    study: ['homework', 'pencil', 'urgent-school'],
    gaming: ['gaming-invite', 'loot', 'gameclip'],
    sleep: ['quiet', 'teddy', 'moon']
  };
  const forbidden = { study: ['teddy', 'moon', 'loot'], gaming: ['teddy', 'moon', 'pencil'], sleep: ['loot', 'pencil', 'urgent-school'] };
  for (const [context, interval] of [['study', 1.55], ['gaming', 1.55*.92], ['sleep', 1.55*1.08]]) {
    const { game } = setup(context), seen = new Set();
    for (let wave = 0; wave < 160; wave++) {
      game.state.objects = [];
      game.state.spawnTimer = 0;
      const events = [];
      game._spawn(events);
      assert.ok(events.length >= 1 && events.length <= 2);
      assert.equal(game.state.spawnTimer, interval);
      for (const event of events) seen.add(event.contentId);
    }
    for (const id of specific[context]) assert.ok(seen.has(id), `${id} belongs in ${context}`);
    for (const id of forbidden[context]) assert.equal(seen.has(id), false, `${id} stays in its own room`);
  }
  for (const content of CONTENT) {
    assert.ok(content.visual, `${content.id} has an illustration`);
    assert.ok(content.shortLabel.length <= 12, `${content.id} has a readable short label`);
  }
});

test('large targets keep separate lanes for their full flight and crowded waves wait safely', () => {
  for (const width of [240, 390, 800, 1440]) {
    const { game } = setup('gaming', { width });
    const expectedRadius = Math.min(width * .16, width < 650 ? 50 : 48);
    const first = game._spawnContent('streak');
    const second = game._spawnContent('gaming-invite');
    assert.ok(first && second);
    assert.equal(first.radius, expectedRadius);
    while (game._spawnContent('streak')) { /* fill only the separated lanes */ }
    assert.ok(game.state.objects.length <= 5);
    for (const a of game.state.objects) {
      assert.equal(a.vx, 0);
      assert.ok(a.x >= a.radius && a.x <= width - a.radius);
      for (const b of game.state.objects) if (a.id !== b.id) {
        assert.ok(Math.abs(a.x - b.x) >= a.radius + b.radius + 24, `separate targets at ${width}px`);
      }
    }
    const before = game.state.objects.length, events = [];
    game._spawn(events);
    assert.equal(game.state.objects.length, before);
    assert.equal(events.length, 0, 'a full board never squeezes in another target');
  }
});


function prepared(skills = [], selectedSuper = null) {
  const storage = new Storage(), game = new NinjaGame({ storage, seed: 'progression', width: 800, height: 600 });
  game.profile.coins = 1000;
  for (const id of skills) assert.equal(game.buySkill(id).ok, true, id);
  if (selectedSuper) assert.equal(game.selectSuper(selectedSuper).ok, true);
  assert.equal(game.start({ mode: 'study', tutorial: false }).ok, true);
  game.nextLevel();
  return { game, storage };
}

test('difficulty changes hearts, flight and spawn budgets; invalid difficulty cannot reset a run', () => {
  const flights = [], intervals = [];
  for (const difficulty of DIFFICULTIES) {
    const { game } = setup('study', { difficulty: difficulty.id });
    assert.equal(game.state.maxLives, difficulty.lives);
    assert.equal(game.state.lives, difficulty.lives);
    assert.equal(game.state.difficulty, difficulty.id);
    flights.push(game._spawnContent('streak').vy);
    game.state.objects = [];game.state.spawnTimer = 0;game._spawn([]);intervals.push(game.state.spawnTimer);
    const prior = game.getSnapshot();
    assert.equal(game.start({ difficulty: 'impossible' }).ok, false);
    assert.deepEqual(game.getSnapshot(), prior);
  }
  assert.ok(flights[0] > flights[1] && flights[1] > flights[2], 'harder cards travel upward faster');
  assert.ok(intervals[0] > intervals[1] && intervals[1] > intervals[2]);
});

test('ramping affects new cards, retains existing trajectories and freezes completely in pause', () => {
  const { game } = setup('study', { difficulty: 'hard' });
  const prior = game._spawnContent('streak');const vy = prior.vy, gravity = prior.gravity;
  game.state.elapsed = 60;game.update(.05);
  assert.ok(game.state.speedFactor > 2.4 && game.state.speedFactor < 2.75);
  assert.ok(Math.abs(prior.vy - (vy + gravity*.05)) < .000001, 'existing velocity changes only by gravity');
  const fast = game._spawnContent('streak');assert.ok(fast.vy < vy);
  game.pause();const snapshot = game.getSnapshot();
  for (let i=0;i<100;i++) game.update(.05);
  assert.deepEqual(game.getSnapshot(), snapshot);
  game.resume();game.state.elapsed=500;game.update(.05);assert.equal(game.state.speedFactor,2.75);
});

test('shield absorbs a missed distraction once and tutorial hearts reset without ending the run', () => {
  const { game } = setup();cut(game,'power-shield');
  game.state.objects=[];object(game,'streak',{y:-200,vy:-100});
  const protectedMiss=game.update(.05);
  assert.equal(ofType(protectedMiss,'distraction-missed')[0].protected,true);
  assert.equal(ofType(protectedMiss,'life-lost').length,0);assert.equal(game.state.lives,5);
  game.state.objects=[];object(game,'streak',{y:-200,vy:-100});game.update(.05);assert.equal(game.state.lives,4);
  const tutorial = new NinjaGame({storage:new Storage()});tutorial.start({mode:'campaign',difficulty:'hard'});tutorial.nextLevel();
  assert.equal(tutorial.state.maxLives,5);
  for(let i=0;i<5;i++){tutorial.state.objects=[];object(tutorial,'streak',{y:-200,vy:-100});tutorial.update(.05);}
  assert.equal(tutorial.state.lives,5);assert.equal(tutorial.state.ended,false);assert.equal(tutorial.state.runCoins,0);
  tutorial.skipTutorial();assert.equal(tutorial.state.lives,3);assert.equal(tutorial.state.maxLives,3);
});

test('coins accrue from correct decisions, collectables and combos, then settle only once across reloads', () => {
  const {game,storage}=setup();
  for(let i=0;i<13;i++)cut(game);
  assert.equal(game.state.runCoins,0);assert.equal(game.profile.coins,0);
  const coin=cut(game).events;assert.equal(ofType(coin,'coin-earned')[0].amount,1);
  cut(game,'power-coins');assert.equal(game.state.runCoins,2);
  for(let i=0;i<11;i++)cut(game);
  assert.equal(game.state.runCoins,3,'one decision coin, one collectible coin and one combo coin');
  assert.equal(game.profile.coins,0,'pending coins cannot be spent mid-run');
  nearEnd(game,75);const awarded=game.state.awardedCoins;assert.equal(awarded,5);assert.equal(game.profile.coins,awarded);
  const before=structuredClone(game.profile),restored=new NinjaGame({storage});
  restored.update(.05);assert.deepEqual(restored.profile,before);assert.equal(restored.profile.stats.coinsEarned,awarded);
});

test('paused skill purchases and super selection affect the next run and cannot change a live loadout', () => {
  const {game,storage}=setup();game.profile.coins=200;
  assert.equal(game.buySkill('focus-root').ok,false);assert.deepEqual(game.state.skillIds,[]);
  game.pause();assert.equal(game.buySkill('focus-root').ok,true);assert.equal(game.buySkill('slow-super').ok,true);
  assert.deepEqual(game.state.skillIds,[]);assert.equal(game.state.selectedSuper,null);
  assert.equal(game.profile.selectedSuper,'slow-super');
  const restored=new NinjaGame({storage,width:800,height:600});assert.deepEqual(restored.state.skillIds,[]);assert.equal(restored.state.selectedSuper,null);
  restored.start({mode:'study',tutorial:false});restored.nextLevel();assert.deepEqual(restored.state.skillIds,['focus-root','slow-super']);
  assert.equal(restored.state.selectedSuper,'slow-super');cut(restored);assert.equal(restored.state.superCharge,10);
});

test('all three supers require a full charge and paused, tutorial or unowned activation is rejected', () => {
  const branches=[['focus-root','slow-super'],['guard-root','shield-super'],['coin-root','sweep-super']];
  for(const [root,superId] of branches){const {game}=prepared([root,superId],superId);
    assert.equal(game.activateSuper().ok,false);
    while(game.state.superCharge<100)cut(game);
    game.pause();assert.equal(game.activateSuper().ok,false);game.resume();
    const events=game.activateSuper().events;assert.equal(ofType(events,'super-used')[0].id,superId);
    assert.equal(game.state.superCharge,0);assert.equal(game.state.metrics.superUses,1);
    if(superId==='slow-super')assert.equal(game.state.effects.slow,8);
    if(superId==='shield-super')assert.equal(game.state.effects.shield,1);
    assert.equal(game.activateSuper().ok,false);
  }
  const {game}=setup();game.state.superCharge=100;assert.equal(game.activateSuper().ok,false);
});

test('sweep clears distractions safely, credits real cuts and coins, and cannot recharge itself', () => {
  const {game}=prepared(['coin-root','sweep-super'],'sweep-super');
  for(let i=0;i<13;i++)cut(game);game.state.objects=[];
  const bad=object(game,'streak',{x:120}),good=object(game,'homework',{x:350}),power=object(game,'power-coins',{x:600});
  const before=game.state.metrics.cuts;const events=game.activateSuper().events;
  assert.equal(ofType(events,'sliced').length,1);assert.equal(game.state.metrics.cuts,before+1);
  assert.equal(game.state.objects.some(item=>item.id===bad.id),false);
  assert.ok(game.state.objects.some(item=>item.id===good.id));assert.ok(game.state.objects.some(item=>item.id===power.id));
  assert.equal(game.state.superCharge,0);assert.equal(game.state.metrics.usefulMistakes,0);
});

test('passive guard, longer Flow, extra coins and second chance have one-run effects', () => {
  const {game,storage}=prepared(SKILLS.map(skill=>skill.id),'shield-super');
  assert.equal(game.state.effects.shield,1);cut(game,'homework');assert.equal(game.state.lives,5);assert.equal(game.state.effects.shield,0);
  for(let i=0;i<5;i++)cut(game);assert.equal(game.state.effects.flow,7);assert.equal(game.state.superCharge,50);
  assert.equal(game.state.runCoins,0);for(let i=0;i<7;i++)cut(game);assert.equal(game.state.runCoins,1);
  for(let i=0;i<3;i++)cut(game,'power-coins');assert.equal(game.state.runCoins,5,'coin boost fractional carry is preserved');
  game.state.lives=1;const revived=cut(game,'homework').events;assert.equal(ofType(revived,'second-chance').length,1);assert.equal(game.state.lives,1);
  game.pause();const restored=new NinjaGame({storage});assert.equal(restored.state.reviveUsed,true);restored.resume();
  cut(restored,'homework');assert.equal(restored.state.ended,true);assert.equal(restored.state.result,'lives');
});

test('bonus phases alternate, change real rewards, freeze during pause and wait for master context drain', () => {
  const {game}=setup();game.state.bonusClock=19.99;game.update(.05);
  assert.equal(game.state.bonusPhase.id,'coin-rush');const before=game.state.runCoins;
  const coinEvents=cut(game,'power-coins').events;assert.equal(game.state.runCoins-before,2);assert.equal(ofType(coinEvents,'coin-earned')[0].amount,2);
  game.pause();const snapshot=game.getSnapshot();for(let i=0;i<100;i++)game.update(.05);assert.deepEqual(game.getSnapshot(),snapshot);game.resume();
  game.state.objects=[];game.state.spawnTimer=100;const ended=[];for(let i=0;i<120;i++)ended.push(...game.update(.05));
  assert.equal(ofType(ended,'bonus-phase-end').length,1);assert.equal(game.state.bonusPhase,null);
  game.state.bonusClock=39.99;game.update(.05);assert.equal(game.state.bonusPhase.id,'combo-party');game.state.combo=0;const score=game.state.score;cut(game);assert.equal(game.state.score-score,200);
  game.state.bonusPhase=null;game.state.bonusClock=59.99;game.update(.05);assert.equal(game.state.bonusPhase.id,'focus-wave');
  const {game:master}=setup('master');master.state.stageElapsed=25;master.state.elapsed=25;master.state.bonusClock=19.99;object(master,'homework');master.update(.05);
  assert.equal(master.state.pendingContext,'gaming');assert.equal(master.state.bonusClock,19.99);assert.equal(master.state.bonusPhase,null);
});

test('new achievement milestones and explicit rewards persist and cannot be claimed twice', () => {
  const {game,storage}=prepared(['focus-root','slow-super'],'slow-super');
  for(let i=0;i<13;i++)cut(game);game.activateSuper();nearEnd(game,75);
  for(const id of ['first-skill','first-super','combo-10'])assert.ok(game.profile.achievements.includes(id));
  const before=game.profile.coins,result=game.claimAchievement('first-super');assert.equal(result.ok,true);assert.equal(game.profile.coins,before+4);
  assert.equal(game.claimAchievement('first-super').ok,false);assert.equal(game.profile.coins,before+4);
  const restored=new NinjaGame({storage});assert.equal(restored.claimAchievement('first-super').ok,false);assert.equal(restored.profile.stats.superUses,1);
  assert.ok(restored.profile.claimedAchievements.includes('first-super'));
});

test('legacy profiles migrate safely and extended live state survives a paused reload', () => {
  const {game,storage}=setup();game.profile.coins=57;game.profile.achievements=['first-cut','flow-five','healthy-stop'];game.pause();
  const saved=JSON.parse(storage.getItem(STORAGE_KEY));
  for(const key of ['unlockedSkills','selectedSuper','stats','claimedAchievements'])delete saved.profile[key];
  for(const key of ['difficulty','maxLives','speedFactor','runCoins','selectedSuper','skillIds','bonusClock','bonusPhase'])delete saved.state[key];
  storage.setItem(STORAGE_KEY,JSON.stringify(saved));const old=new NinjaGame({storage});
  assert.equal(old.profile.coins,57);assert.deepEqual(old.profile.achievements,['first-cut','flow-five','healthy-stop']);assert.deepEqual(old.profile.unlockedSkills,[]);assert.equal(old.state.difficulty,'easy');
  const enhanced=prepared(['focus-root','slow-super','flow-boost'],'slow-super');for(let i=0;i<10;i++)cut(enhanced.game);enhanced.game.activateSuper();
  enhanced.game.state.bonusClock=19.99;enhanced.game.update(.05);enhanced.game.pause();
  const resumed=new NinjaGame({storage:enhanced.storage,width:800,height:600});
  for(const key of ['skillIds','selectedSuper','runCoins','superCharge','bonusPhase','bonusClock','reviveUsed'])assert.deepEqual(resumed.state[key],enhanced.game.state[key],key);
  assert.ok(resumed.state.effects.slow>7);assert.deepEqual(resumed.profile,enhanced.game.profile);assert.equal(resumed.exportData().version,'1.6.0');
});


test('coin rush creates collectible waves and focus waves change the actual contextual spawn mix', () => {
  function mix(phase) {
    const {game}=setup('study');game.state.spawnCount=2;
    game.state.bonusPhase=phase?{id:phase,name:'Test',remaining:6}:null;
    const tally={total:0,coins:0,bad:0,regular:0};
    for(let i=0;i<400;i++){game.state.objects=[];game.state.spawnTimer=0;const events=[];game._spawn(events);
      for(const event of events){tally.total++;if(event.contentId==='power-coins')tally.coins++;if(event.kind!=='powerup'){tally.regular++;if(event.kind==='distraction')tally.bad++;}}
    }
    return tally;
  }
  const ordinary=mix(null),coins=mix('coin-rush'),focus=mix('focus-wave');
  assert.ok(coins.coins/coins.total>ordinary.coins/ordinary.total+.25);
  assert.ok(focus.bad/focus.regular>ordinary.bad/ordinary.regular+.15);
});

test('difficulty coin bonuses retain fractional earnings and successful hard rounds record a claimable milestone', () => {
  for(const [difficulty,coins,remainder] of [['easy',1,0],['normal',1,.25],['hard',1,.5]]){
    const {game}=setup('study',{difficulty});cut(game,'power-coins');assert.equal(game.state.runCoins,coins);assert.equal(game.state.coinRemainder,remainder);
    nearEnd(game,75);assert.equal(game.profile.stats.hardClears,difficulty==='hard'?1:0);
    assert.equal(game.profile.achievements.includes('hard-clear'),difficulty==='hard');
  }
});


test('fresh profiles must buy worlds in order and locked mode starts leave the run untouched', () => {
  const game=new NinjaGame({storage:new Storage()});
  assert.deepEqual(game.profile.unlockedWorlds,['study']);
  for(const mode of ['gaming','sleep','master']){const before=game.getSnapshot();assert.equal(game.start({mode}).ok,false);assert.deepEqual(game.getSnapshot(),before);}
  game.profile.coins=600;
  for(const id of ['sleep','master']){const before=structuredClone(game.profile);assert.equal(game.buyWorld(id).ok,false);assert.deepEqual(game.profile,before);}
  assert.equal(game.buyWorld('gaming').ok,true);assert.equal(game.profile.coins,520);assert.equal(game.buyWorld('gaming').ok,false);assert.equal(game.profile.coins,520);
  assert.equal(game.buyWorld('sleep').ok,true);assert.equal(game.profile.coins,340);assert.equal(game.buyWorld('master').ok,true);assert.equal(game.profile.coins,20);
  assert.deepEqual(game.profile.unlockedWorlds,WORLDS.map(world=>world.id));
  assert.equal(game.start({mode:'master'}).ok,true);game.nextLevel();
  const before=structuredClone(game.profile);assert.equal(game.buyBackground('paper-garden').ok,false);assert.deepEqual(game.profile,before);
});

test('a campaign ends at the next locked world, settles coins once and restores the exact completed prefix', () => {
  const storage=new Storage(),game=new NinjaGame({storage,width:800,height:600});
  game.start({mode:'campaign',difficulty:'hard',tutorial:false});game.nextLevel();
  for(let i=0;i<40;i++)cut(game);
  nearEnd(game,75);
  assert.equal(game.state.scene,'results');assert.equal(game.state.result,'locked');assert.equal(game.state.nextLockedWorld,'gaming');
  assert.equal(game.state.stageIndex,0);assert.equal(game.state.levelIndex,0);assert.equal(game.state.metrics.stageStats.length,1);
  assert.equal(game.profile.achievements.includes('context-master'),false);assert.equal(game.profile.achievements.includes('hard-clear'),false);assert.equal(game.profile.stats.hardClears,0);
  assert.ok(game.profile.coins>0&&game.profile.coins<80);const before=structuredClone(game.profile),restored=new NinjaGame({storage,width:800,height:600});
  assert.equal(restored.storageFailed,false);assert.equal(restored.state.result,'locked');assert.equal(restored.state.nextLockedWorld,'gaming');assert.equal(restored.state.metrics.stageStats.length,1);assert.deepEqual(restored.profile,before);
  restored.update(.05);assert.equal(restored.nextLevel().ok,false);assert.deepEqual(restored.profile,before);
  assert.equal(restored.buyWorld('gaming').ok,false);restored.profile.coins=80;
  assert.equal(restored.buyWorld('gaming').ok,true);assert.equal(restored.start({mode:'gaming'}).ok,true);
});

test('campaign ownership gates every later room and preserves two completed stages at the sleep gate', () => {
  const storage=new Storage(),game=new NinjaGame({storage,width:800,height:600});game.profile.coins=80;game.buyWorld('gaming');
  game.start({mode:'campaign',tutorial:false,gamingLimit:45});game.nextLevel();nearEnd(game,75);
  assert.equal(game.state.scene,'briefing');assert.equal(game.state.levelIndex,1);game.nextLevel();nearEnd(game,45);game.requestStop();
  assert.equal(game.state.result,'locked');assert.equal(game.state.nextLockedWorld,'sleep');assert.equal(game.state.stageIndex,1);assert.equal(game.state.metrics.stageStats.length,2);
  const restored=new NinjaGame({storage});assert.equal(restored.storageFailed,false);assert.equal(restored.state.result,'locked');assert.equal(restored.state.levelIndex,1);assert.equal(restored.state.metrics.stageStats.length,2);
});

test('background buying and equipping are separate, world-gated and snapshotted until the next run', () => {
  const storage=new Storage(),game=new NinjaGame({storage,width:800,height:600});game.profile.coins=300;
  assert.equal(game.selectBackground('paper-garden').ok,false);assert.equal(game.buyBackground('pixel-cove').ok,false);assert.equal(game.profile.coins,300);
  assert.equal(game.buyBackground('paper-garden').ok,true);assert.equal(game.profile.coins,140);assert.equal(game.profile.selectedBackgrounds.study,'classroom');
  assert.equal(game.selectBackground('paper-garden').ok,true);assert.equal(game.profile.selectedBackgrounds.study,'paper-garden');
  game.start({mode:'study',tutorial:false});game.nextLevel();assert.equal(game.state.backgrounds.study,'paper-garden');
  assert.equal(game.selectBackground('classroom').ok,false);game.pause();assert.equal(game.selectBackground('classroom').ok,true);
  assert.equal(game.state.backgrounds.study,'paper-garden');assert.equal(game.profile.selectedBackgrounds.study,'classroom');
  const restored=new NinjaGame({storage,width:800,height:600});assert.equal(restored.state.backgrounds.study,'paper-garden');assert.equal(restored.profile.selectedBackgrounds.study,'classroom');
  restored.start({mode:'study',tutorial:false});assert.equal(restored.state.backgrounds.study,'classroom');
  const saved=JSON.parse(storage.getItem(STORAGE_KEY));saved.state.backgrounds={study:'moon-isles',gaming:'paper-garden',sleep:'not-real'};storage.setItem(STORAGE_KEY,JSON.stringify(saved));
  const validated=new NinjaGame({storage});assert.deepEqual(validated.state.backgrounds,{study:'classroom',gaming:'game-room',sleep:'bedroom'});
});

test('legacy active gaming runs continue without retroactive ownership and preserve funds', () => {
  const {game,storage}=setup('gaming');game.profile.coins=43;game.state.stageElapsed=44;game.pause();
  const saved=JSON.parse(storage.getItem(STORAGE_KEY));for(const key of ['unlockedWorlds','unlockedBackgrounds','selectedBackgrounds'])delete saved.profile[key];delete saved.state.backgrounds;
  storage.setItem(STORAGE_KEY,JSON.stringify(saved));const restored=new NinjaGame({storage});
  assert.equal(restored.storageFailed,false);assert.equal(restored.state.levelIndex,1);assert.deepEqual(restored.profile.unlockedWorlds,['study']);assert.equal(restored.profile.coins,43);
  assert.equal(restored.start({mode:'gaming'}).ok,false);assert.equal(restored.resumeRun().ok,true);assert.equal(restored.state.scene,'playing');
  nearEnd(restored,90);assert.equal(restored.state.scene,'limit-choice');assert.equal(restored.requestStop().ok,true);assert.equal(restored.state.result,'healthy-stop');
});

test('coin rush reserves its first gold collectable until a full board naturally frees a lane', () => {
  const {game,storage}=setup('study');
  while(game._spawnContent('homework')){ /* Fill separated lanes without removing useful cards. */ }
  const ids=game.state.objects.map(object=>object.id);game.state.bonusClock=19.99;game.update(.05);
  assert.equal(game.state.bonusPhase.id,'coin-rush');assert.equal(game.state.bonusCoinPending,true);
  const blocked=[];game.state.spawnTimer=0;game._spawn(blocked);assert.equal(blocked.length,0);assert.deepEqual(game.state.objects.map(object=>object.id),ids);
  game.state.bonusPhase=null;game.pause();const restored=new NinjaGame({storage,width:800,height:600});assert.equal(restored.state.bonusCoinPending,true);restored.resume();
  restored.state.objects[0].y=-200;restored.state.objects[0].vy=-100;restored.state.spawnTimer=0;
  const events=restored.update(.05);assert.equal(ofType(events,'useful-passed').length,1);assert.equal(ofType(events,'spawned')[0].contentId,'power-coins');assert.equal(restored.state.bonusCoinPending,false);
  assert.equal(restored.state.objects.filter(object=>ids.includes(object.id)).length,ids.length-1);
});

test('completed players can explicitly replay unscored training without losing coins or changing difficulty after it', () => {
  const game=new NinjaGame({storage:new Storage()});game.profile.tutorialCompleted=true;game.profile.coins=55;
  assert.equal(game.start({mode:'campaign',difficulty:'normal',forceTutorial:true}).ok,true);assert.equal(game.state.isTutorial,true);assert.equal(game.state.lives,5);game.nextLevel();
  cut(game);cut(game);for(let i=0;i<4;i++)passUseful(game);
  assert.equal(game.state.isTutorial,false);assert.equal(game.state.scene,'briefing');assert.equal(game.state.difficulty,'normal');assert.equal(game.state.lives,4);assert.equal(game.state.runCoins,0);assert.equal(game.profile.coins,55);
});

function autoplayFrame(game) {
  const events=game.update(.05);
  for(const item of [...game.state.objects]) {
    if(item.kind==='useful'||!isThrowReady(item)||item.y<=item.radius||item.y>=game.height-item.radius)continue;
    events.push(...game.swipe([{x:item.x-item.radius*.85,y:item.y},{x:item.x+item.radius*.85,y:item.y}]));
  }
  return events;
}

function autoplayStudy(game,difficulty='normal') {
  assert.equal(game.start({mode:'study',difficulty,tutorial:false}).ok,true);game.nextLevel();
  for(let frame=0;frame<1600&&!game.state.ended;frame++)autoplayFrame(game);
  assert.equal(game.state.result,'complete');return game.state.awardedCoins;
}

test('real active frames visibly accelerate each difficulty at 15, 30 and 60 seconds with an honest clock', () => {
  for(const [difficulty,minimums] of [['easy',[1.17,1.34,1.62]],['normal',[1.29,1.58,2.03]],['hard',[1.41,1.82,2.45]]]) {
    const {game}=setup('gaming',{difficulty});
    const seen=[];
    for(const [index,target] of [15,30,60].entries()) {
      while(game.state.elapsed<target-.000001)autoplayFrame(game);
      assert.ok(game.state.speedFactor>=minimums[index],`${difficulty} at ${target}`);
      assert.ok(Math.abs(game.state.stageElapsed-target)<.051);
      assert.ok(Math.abs(game.state.remaining-(90-game.state.stageElapsed))<.000001);
      seen.push(game.state.speedFactor);
    }
    assert.ok(seen[0]<seen[1]&&seen[1]<seen[2]);
    while(game.state.scene==='playing')autoplayFrame(game);
    assert.ok(Math.abs(game.state.speedFactor-DIFFICULTIES.find(item=>item.id===difficulty).speedCap)<.00000001);
    assert.equal(game.state.scene,'limit-choice');assert.ok(Math.abs(game.state.stageElapsed-90)<.00000001);
  }
});

test('faster late waves keep their separate lanes on narrow screens as the launch count increases', () => {
  const {game}=setup('gaming',{difficulty:'hard',width:390,height:600});
  const launches=[0,0];
  while(game.state.stageElapsed<60-.000001) {
    const events=autoplayFrame(game);
    for(const event of ofType(events,'spawned')) {
      if(game.state.stageElapsed<=15)launches[0]++;
      if(game.state.stageElapsed>=45)launches[1]++;
    }
    for(const first of game.state.objects)for(const second of game.state.objects)if(first.id!==second.id) {
      assert.ok(Math.abs((first.launch?.laneX??first.x)-(second.launch?.laneX??second.x))>=first.radius+second.radius+24,'whole-flight lane reservations stay separate at high tempo');
      if(isThrowReady(first)&&isThrowReady(second))assert.ok(Math.abs(first.x-second.x)>=first.radius+second.radius+24,'swipeable targets never overlap');
    }
  }
  assert.ok(launches[1]>launches[0],`${launches[0]} first versus ${launches[1]} late launches`);
  assert.equal(game.state.lives,3,'correct native-style swipes remain safe');
});

test('perfect finite studies earn a small, bounded purse rather than converting large scores into currency', () => {
  for(const difficulty of ['easy','normal','hard'])for(let seed=0;seed<3;seed++) {
    const game=new NinjaGame({storage:null,seed:`economy-${seed}`,width:1000,height:700});
    const coins=autoplayStudy(game,difficulty);
    assert.ok(game.state.score>10000);
    assert.ok(game.state.metrics.correctDecisions>=40);
    assert.ok(coins>=5&&coins<=(difficulty==='hard'?14:12),`${difficulty} earned ${coins}`);
    assert.equal(game.profile.stats.coinsEarned,coins);
    assert.equal(game.profile.totalRuns,1);
  }
});

test('normal play funds the first ability after three completed rounds without automatic achievement money', () => {
  const game=new NinjaGame({storage:new Storage(),seed:'first-three-rounds'});
  for(let round=1;round<=3;round++) {
    autoplayStudy(game);
    assert.equal(game.profile.coins,round*12);
    if(round<3){const before=structuredClone(game.profile);assert.equal(game.buySkill('focus-root').ok,false);assert.deepEqual(game.profile,before);}
  }
  assert.equal(game.buySkill('focus-root').ok,true);assert.equal(game.profile.coins,1);
  assert.equal(game.profile.claimedAchievements.length,0);
  assert.ok(game.profile.achievements.includes('first-skill'));
});

test('repeated short sleep offers and idle failure cannot farm free completion money', () => {
  const {game}=setup('sleep');
  for(let round=0;round<5;round++) {
    game.start({mode:'sleep',tutorial:false});game.nextLevel();
    while(!game.state.stopAvailable)game.update(.05);
    assert.equal(game.continueSleep().ok,true);assert.equal(game.requestStop().ok,true);
    assert.equal(game.state.awardedCoins,0);assert.equal(game.profile.coins,0);
  }
  game.start({mode:'study',tutorial:false});game.nextLevel();
  while(!game.state.ended)game.update(.05);
  assert.equal(game.state.result,'lives');assert.equal(game.state.awardedCoins,0);assert.equal(game.profile.coins,0);
});

test('coin rush and arbitrary collectible streaks respect the stage purse and restore it without duplicate awards', () => {
  const {game,storage}=setup('study',{difficulty:'normal'});game.state.bonusPhase={id:'coin-rush',name:'Münzregen',remaining:6};
  for(let count=0;count<100;count++)cut(game,'power-coins');
  assert.equal(game.state.runCoins,10);assert.equal(game.state.stageMetrics.earnedCoins,10);assert.equal(game.profile.coins,0);
  game.pause();const restored=new NinjaGame({storage,width:800,height:600});restored.resume();
  assert.equal(ofType(cut(restored,'power-coins').events,'coin-earned').length,0);
  restored.state.objects=[];restored.state.spawnCount=2;restored.state.bonusCoinPending=true;const cappedSpawns=[];
  for(let wave=0;wave<100;wave++){restored.state.objects=[];restored._spawn(cappedSpawns);}
  assert.equal(cappedSpawns.some(item=>item.contentId==='power-coins'),false,'no worthless collectible spawns after the stage purse is full');
  nearEnd(restored,75);assert.equal(restored.profile.coins,10);
  const again=new NinjaGame({storage});assert.equal(again.profile.coins,10);assert.equal(again.profile.totalRuns,1);
});

test('coin-root offers an earlier first coin while the full money branch remains a bounded improvement', () => {
  const base=setup().game,boosted=prepared(['coin-root']).game;
  for(let count=0;count<12;count++){cut(base);cut(boosted);}
  assert.equal(base.state.runCoins,0);assert.equal(boosted.state.runCoins,1);
  for(let count=0;count<2;count++)cut(base);assert.equal(base.state.runCoins,1);
  const upgraded=prepared(['coin-root','sweep-super','coin-boost']).game;
  for(let count=0;count<100;count++)cut(upgraded,'power-coins');
  assert.equal(upgraded.state.stageMetrics.earnedCoins,10,'25% benefit has a finite purse too');
});

test('a paid campaign resets the small stage purse while carrying only the actually earned coins forward', () => {
  const {game}=setup('campaign');
  for(let count=0;count<100;count++)cut(game,'power-coins');assert.equal(game.state.runCoins,8);
  nearEnd(game,75);assert.equal(game.state.scene,'briefing');assert.equal(game.state.stageMetrics.earnedCoins,0);
  game.nextLevel();for(let count=0;count<100;count++)cut(game,'power-coins');
  assert.equal(game.state.runCoins,16);assert.equal(game.state.stageMetrics.earnedCoins,8);assert.equal(game.profile.coins,0);
});

test('old saved money, paid unlocks and pending coins survive the new price list without retroactive charges', () => {
  const {game,storage}=setup('study');
  game.profile.coins=2917;game.profile.unlockedSkills=SKILLS.map(item=>item.id);game.profile.selectedSuper='slow-super';
  game.profile.unlockedBackgrounds=BACKGROUNDS.map(item=>item.id);game.profile.selectedBackgrounds.study='paper-garden';
  game.profile.unlockedSkins=['default','solar','mint','neon'];game.profile.selectedSkin='solar';
  game.profile.achievements=['first-cut','flow-five'];game.profile.claimedAchievements=['first-cut'];
  game.state.runCoins=50;game.state.metrics.correctDecisions=20;game.pause();
  const saved=JSON.parse(storage.getItem(STORAGE_KEY));delete saved.state.stageMetrics.earnedCoins;storage.setItem(STORAGE_KEY,JSON.stringify(saved));
  const restored=new NinjaGame({storage,width:800,height:600});assert.equal(restored.storageFailed,false);assert.deepEqual(restored.profile,game.profile);
  assert.equal(restored.state.runCoins,50);assert.equal(restored.claimAchievement('first-cut').ok,false);
  restored.resume();nearEnd(restored,75);assert.equal(restored.state.awardedCoins,52);assert.equal(restored.profile.coins,2969);
});

test('open play is free and starts a JSON-safe untimed round without changing the four worlds', () => {
  const game=new NinjaGame({storage:new Storage()});
  assert.deepEqual(game.profile.unlockedWorlds,['study']);assert.equal(game.profile.highScores.open,0);
  assert.equal(game.start({mode:'open',forceTutorial:true,difficulty:'normal'}).ok,true);
  assert.equal(LEVELS.length,4);assert.equal(game.state.levelIndex,0);assert.equal(game.state.stageIndex,0);assert.equal(game.state.context,'study');
  assert.equal(game.state.isTutorial,false);assert.equal(game.profile.tutorialCompleted,false);
  assert.equal(game.state.duration,0);assert.equal(game.state.remaining,0);assert.equal(game.nextLevel().ok,true);
  assert.equal(game.requestStop().ok,false);assert.equal(game.continueAfterLimit().ok,false);assert.equal(game.continueSleep().ok,false);
  const exported=JSON.parse(JSON.stringify(game.exportData()));assert.equal(exported.state.duration,0);assert.equal(exported.state.remaining,0);
});

test('open play survives the old 75 and 90 second limits and keeps accelerating beyond five minutes', () => {
  const {game}=setup('open',{difficulty:'normal'});let earlier=0;
  for(const seconds of [75,90,180,300]) {
    while(game.state.elapsed<seconds-.000001)autoplayFrame(game);
    assert.equal(game.state.scene,'playing');assert.equal(game.state.ended,false);assert.equal(game.state.awaitingNext,false);
    assert.equal(game.state.duration,0);assert.equal(game.state.remaining,0);assert.equal(game.state.context,'study');
    assert.ok(game.state.speedFactor>earlier);earlier=game.state.speedFactor;
    assert.ok(Math.abs(game.state.stageElapsed-seconds)<.051);
  }
  assert.ok(game.state.speedFactor>4);assert.equal(game.state.metrics.stageStats.length,0);
  assert.equal(game.nextLevel().ok,false);assert.equal(game.requestStop().ok,false);
});

test('only losing all hearts ends an open round and its local highscore and scarce coins settle once', () => {
  const {game,storage}=setup('open',{difficulty:'hard'});
  while(game.state.elapsed<100-.000001)autoplayFrame(game);
  assert.ok(game.state.score>0);const correct=game.state.metrics.correctDecisions;
  for(let error=0;error<10&&!game.state.ended;error++)cut(game,'homework');
  assert.equal(game.state.ended,true);assert.equal(game.state.result,'lives');assert.equal(game.state.lives,0);
  assert.equal(game.profile.highScores.open,game.state.score);assert.equal(game.profile.totalRuns,1);
  assert.equal(game.profile.stats.correct,correct);assert.equal(game.profile.stats.hardClears,0);
  assert.equal(game.profile.achievements.includes('context-master'),false);assert.equal(game.profile.achievements.includes('hard-clear'),false);assert.equal(game.profile.achievements.includes('careful-stage'),false);
  assert.ok(game.state.awardedCoins>0&&game.state.awardedCoins<=12);
  const before=structuredClone(game.profile),restored=new NinjaGame({storage});
  assert.equal(restored.storageFailed,false);assert.equal(restored.state.result,'lives');assert.equal(restored.profile.highScores.open,game.state.score);
  restored.update(.05);assert.equal(restored.resumeRun().ok,false);assert.deepEqual(restored.profile,before);
});

test('open competition ignores paid skills and supers while honoring a purchased cosmetic skin', () => {
  const first=new NinjaGame({storage:new Storage(),seed:'same-open-seed',width:800,height:600});
  const paid=new NinjaGame({storage:new Storage(),seed:'same-open-seed',width:800,height:600});paid.profile.coins=10000;
  for(const skill of SKILLS)assert.equal(paid.buySkill(skill.id).ok,true);paid.buySkin('solar');paid.selectSkin('solar');paid.selectSuper('shield-super');
  first.start({mode:'open',gamingLimit:45,difficulty:'normal'});paid.start({mode:'open',gamingLimit:90,difficulty:'normal'});
  first.nextLevel();paid.nextLevel();
  assert.equal(paid.state.skin,'solar');assert.equal(first.state.skin,'default');assert.deepEqual(paid.state.skillIds,[]);assert.equal(paid.state.selectedSuper,null);assert.equal(paid.state.effects.shield,0);
  for(let frame=0;frame<600;frame++){assert.deepEqual(autoplayFrame(first),autoplayFrame(paid));assert.deepEqual(first.state.objects,paid.state.objects);}
  for(const key of ['score','lives','superCharge','runCoins','speedFactor'])assert.equal(first.state[key],paid.state[key],key);
  assert.equal(paid.state.superCharge,0);assert.equal(paid.activateSuper().ok,false);
});

test('a long open save restores the upward clock, repeating bonuses and moving objects without a timed finish', () => {
  const {game,storage}=setup('open',{difficulty:'normal'});
  while(game.state.elapsed<301-.000001)autoplayFrame(game);game.pause();
  const expected=game.getSnapshot(),restored=new NinjaGame({storage,width:800,height:600});
  assert.equal(restored.storageFailed,false);assert.equal(restored.state.mode,'open');assert.equal(restored.state.duration,0);assert.equal(restored.state.remaining,0);
  for(const key of ['elapsed','stageElapsed','speedFactor','bonusClock','bonusNextAt','bonusSequence','bonusPhase','runCoins'])assert.deepEqual(restored.state[key],expected.state[key],key);
  assert.deepEqual(restored.state.objects,expected.state.objects);assert.equal(restored.state.paused,true);
  const time=restored.state.elapsed;restored.update(.05);assert.equal(restored.state.elapsed,time);
  restored.resumeRun();autoplayFrame(restored);assert.ok(restored.state.elapsed>time);assert.equal(restored.state.scene,'playing');
});

test('restoring open play enforces its standard loadout even when paid fields were saved on the profile', () => {
  const {game,storage}=prepared(SKILLS.map(skill=>skill.id),'slow-super');
  game.start({mode:'open'});game.nextLevel();game.pause();
  const saved=JSON.parse(storage.getItem(STORAGE_KEY));saved.state.skillIds=SKILLS.map(skill=>skill.id);saved.state.selectedSuper='slow-super';saved.state.superCharge=100;saved.state.effects.flow=7;saved.state.effects.slow=8;
  storage.setItem(STORAGE_KEY,JSON.stringify(saved));const restored=new NinjaGame({storage});
  assert.equal(restored.storageFailed,false);assert.deepEqual(restored.state.skillIds,[]);assert.equal(restored.state.selectedSuper,null);assert.equal(restored.state.superCharge,0);
  assert.equal(restored.state.effects.flow,5);assert.equal(restored.state.effects.slow,6);assert.equal(restored.profile.unlockedSkills.length,9);
  restored.resumeRun();assert.equal(restored.activateSuper().ok,false);
});

test('old profiles gain an empty open highscore without losing finite records and open saves reject fake completion', () => {
  const {game,storage}=setup('study');game.profile.highScores.study=12345;game.profile.coins=77;game.pause();
  const legacy=JSON.parse(storage.getItem(STORAGE_KEY));delete legacy.profile.highScores.open;storage.setItem(STORAGE_KEY,JSON.stringify(legacy));
  const restored=new NinjaGame({storage});assert.equal(restored.profile.highScores.open,0);assert.equal(restored.profile.highScores.study,12345);assert.equal(restored.profile.coins,77);
  restored.start({mode:'open'});restored.nextLevel();restored.save();const forged=JSON.parse(storage.getItem(STORAGE_KEY));
  Object.assign(forged.state,{scene:'results',ended:true,result:'complete'});storage.setItem(STORAGE_KEY,JSON.stringify(forged));
  const rejected=new NinjaGame({storage});assert.equal(rejected.state.scene,'home');assert.equal(rejected.storageFailed,true);assert.equal(rejected.profile.coins,77);assert.equal(rejected.profile.highScores.study,12345);
});

test('open run is always one fair mode with exactly three hearts and a gentle beginning', () => {
  for(const requested of ['easy','normal','hard']){
    const game=new NinjaGame({storage:new Storage()});
    assert.equal(game.start({mode:'open',difficulty:requested,tutorial:false}).ok,true);
    assert.equal(game.state.difficulty,'normal');
    assert.equal(game.state.maxLives,3);
    assert.equal(game.state.lives,3);
    game.nextLevel();
    assert.ok(game.state.spawnTimer>1);
    assert.ok(game.state.speedFactor<=1);
  }
});
