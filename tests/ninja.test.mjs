import test from 'node:test';
import assert from 'node:assert/strict';
import { NinjaGame, Game, LEVELS, SKINS, CONTENT, STORAGE_KEY } from '../notification-ninja/src/game.js';

class Storage {
  constructor() { this.data = new Map(); }
  getItem(key) { return this.data.get(key) ?? null; }
  setItem(key, value) { this.data.set(key, String(value)); }
}

function setup(mode = 'study', options = {}) {
  const storage = options.storage === undefined ? new Storage() : options.storage;
  const game = new NinjaGame({ storage, seed: 'ninja-test', now: () => 100000, width: 800, height: 600, ...options });
  assert.equal(game.start({ mode, gamingLimit: options.gamingLimit ?? 90, tutorial: options.tutorial ?? false }).ok, true);
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
  assert.deepEqual(SKINS.map(skin => [skin.id, skin.cost]), [['default', 0], ['solar', 20], ['mint', 45], ['neon', 80]]);
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
  assert.equal(game.state.lives, lives - 2, 'both unprotected mistakes lose exactly one heart');
});

test('a mistake at the overload threshold still costs exactly one heart', () => {
  const { game } = setup();
  game.state.objects = [];
  game.state.overload = 95;
  object(game, 'streak', { y: -200, vy: -100, age: 2 });
  const events = game.update(0.05);
  assert.equal(ofType(events, 'life-lost').length, 1);
  assert.equal(game.state.lives, 2);
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
  nearEnd(game, 90);
  const score = game.state.score;
  assert.equal(game.requestStop().ok, true);
  assert.equal(game.state.score, score + 100);
  assert.equal(game.state.metrics.healthyStops, 1);
  assert.equal(game.state.ended, true);
  const awarded = game.profile.coins;
  assert.equal(awarded, 2);
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
  for (let frame = 0; frame < 80 && passed.length === 0; frame++) {
    game.state.objects = game.state.objects.filter(item => item.id === card.id);
    passed = ofType(game.update(0.05), 'useful-passed').filter(event => event.id === card.id);
  }
  assert.equal(passed.length, 1);
  assert.ok(card.y + card.radius < 0);
  assert.ok(game.state.stageElapsed >= 2.5 && game.state.stageElapsed <= 3.2);
  assert.equal(game.state.metrics.usefulPassed, 1);
  assert.equal(game.state.metrics.cuts, 0);
  assert.equal(game.state.score, 100);
  assert.equal(game.state.scoreArcade, 100);
  assert.equal(game.state.lives, 3);
});

test('results reward and high score survive loading without duplicate profile awards', () => {
  const { game, storage } = setup();
  game.state.score = game.state.scoreArcade = 1250;
  nearEnd(game, 75);
  assert.equal(game.state.ended, true);
  assert.equal(game.state.credited, true);
  assert.equal(game.profile.coins, 2);
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
  assert.equal(game.profile.coins, 80);
  assert.equal(game.buySkin('solar').ok, false);
  assert.equal(game.profile.coins, 80);
  assert.equal(game.selectSkin('solar').ok, true);
  assert.equal(game.profile.selectedSkin, 'solar');
  assert.equal(game.state.skin, 'solar');
  const restored = new NinjaGame({ storage });
  assert.equal(restored.profile.coins, 80);
  assert.equal(restored.profile.selectedSkin, 'solar');
  assert.ok(restored.profile.unlockedSkins.includes('solar'));
});

test('paused runs restore complete physical state and resume deliberately', () => {
  const { game, storage } = setup('gaming', { gamingLimit: 60 });
  game.state.objects = [];
  object(game, 'streak', { x: 230, y: 180, vx: 75, vy: -200, radius: 36, age: 0.4 });
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

test('Master finale launches more waves while keeping the flight physics and ninety-second clock', () => {
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
  assert.ok(earlier.average > 1.02 && earlier.average < 1.08);
  assert.ok(finale.average > .74 && finale.average < .82);
  assert.ok(finale.times.length > earlier.times.length);
  for (const field of ['x', 'y', 'vx', 'vy', 'gravity', 'radius']) assert.equal(finale.first[field], earlier.first[field], `unchanged ${field}`);
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
