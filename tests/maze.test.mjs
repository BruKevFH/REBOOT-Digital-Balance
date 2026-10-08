import test from 'node:test';
import assert from 'node:assert/strict';
import { Game, ROOMS, TOOLS, STORAGE_KEY } from '../mind-maze/src/game.js';

class Storage {
  constructor() { this.data = new Map(); }
  getItem(key) { return this.data.get(key) ?? null; }
  setItem(key, value) { this.data.set(key, String(value)); }
}
function setup(storage = new Storage(), seed = 'maze-test') {
  let time = 100000;
  const game = new Game({ storage, seed, now: () => time });
  return { game, storage, tick: milliseconds => { time += milliseconds; } };
}
const answers = [[2, 4, 1, 3], ['map', 'alarm', 'team'], [true, false, true, false], 'traverse', ['plan', 'wire', 'test', 'send'], 'FOKUS'];
function solveRoom(game, room = game.state.roomIndex) {
  assert.equal(game.observeClue().ok, true);
  if (room === 3) for (const tile of ['A', 'C', 'D', 'F']) assert.equal(game.traverseTile(tile).ok, true);
  const result = game.solve(answers[room]);
  assert.equal(result.ok, true, result.reason);
  return result;
}
function reach(game, room) {
  while (game.state.roomIndex < room) { solveRoom(game); assert.equal(game.nextRoom().ok, true); }
}

test('six authored rooms and optional secret have usable clues and substantive puzzle definitions', () => {
  assert.equal(ROOMS.length, 7);
  assert.deepEqual(ROOMS.map(room => room.index), [0, 1, 2, 3, 4, 5, 6]);
  assert.deepEqual(ROOMS.map(room => room.kind), ['memory', 'filter', 'logic', 'bridge', 'schedule', 'exit', 'secret']);
  assert.equal(new Set(ROOMS.map(room => room.id)).size, 7);
  for (const room of ROOMS) {
    assert.ok(room.narrative.length > 80); assert.ok(room.clue.text.length > 40);
    assert.ok(room.clue.lines.length >= 2); assert.ok(room.lesson.length > 40);
  }
  assert.equal(ROOMS[2].puzzle.switches.length, 4);
  assert.equal(ROOMS[1].puzzle.options.length, 6);
  assert.equal(TOOLS.length, 4);
});

test('complete balanced route requires all six puzzles, physical bridge witnesses and a separate exit', () => {
  const { game, storage } = setup();
  assert.equal(game.start().ok, true);
  assert.deepEqual(game.state.position, { x: 0, z: 5.5, yaw: 0, pitch: 0 });
  for (let room = 0; room < 6; room++) {
    assert.equal(game.state.roomIndex, room);
    assert.equal(game.nextRoom().ok, false);
    solveRoom(game);
    assert.equal(game.state.roomIndex, room, 'a puzzle cannot teleport the player to the next room');
    assert.equal(game.state.roomSolved, true);
    assert.equal(game.state.ended, false);
    if (room < 5) assert.equal(game.nextRoom().ok, true);
  }
  assert.equal(game.nextRoom().ok, false);
  assert.deepEqual(game.state.fragments, ['F', 'O', 'K', 'U', 'S']);
  assert.equal(game.state.credits, 10);
  assert.equal(game.state.metrics.roomsWithoutTools, 6);
  const escape = game.finish('balanced');
  assert.equal(escape.ok, true); assert.equal(escape.ending, 'balanced');
  assert.ok(escape.score > 600);
  const final = game.exportData();
  assert.equal(game.finish('balanced').ok, false);
  assert.equal(game.solve('FOKUS').ok, false);
  assert.equal(game.nextRoom().ok, false);
  assert.deepEqual(game.exportData(), final);
  const restored = new Game({ storage });
  assert.equal(restored.state.ended, true);
  assert.equal(restored.state.ending, 'balanced');
  assert.equal(restored.resume().ok, false);
  assert.equal(restored.state.score, escape.score);
});

test('clue reads do not farm focus, stress, credits or repeated evidence', () => {
  const { game } = setup(); game.start();
  const first = game.observeClue();
  assert.equal(first.ok, true); assert.deepEqual(first.clue.sequence, [2, 4, 1, 3]);
  const before = game.exportData();
  for (let i = 0; i < 10; i++) assert.equal(game.observeClue().ok, true);
  assert.deepEqual(game.exportData(), before);
  assert.equal(game.state.metrics.cluesRead, 1);
});

test('wrong answers, duplicate solve and missing clue cannot advance or award credits', () => {
  const { game } = setup(); game.start();
  assert.equal(game.solve(answers[0]).ok, false);
  assert.equal(game.state.metrics.mistakes, 0, 'unread clues do not count as a wrong puzzle attempt');
  game.observeClue();
  assert.equal(game.solve([2, 4, 3, 1]).ok, false);
  assert.equal(game.state.metrics.mistakes, 1);
  assert.equal(game.state.credits, 0); assert.equal(game.state.score, 0);
  assert.equal(game.state.roomSolved, false); assert.equal(game.state.roomIndex, 0);
  assert.equal(game.state.focus, 76); assert.equal(game.state.stress, 20);
  assert.equal(game.solve(answers[0]).ok, true);
  const solved = game.exportData();
  assert.equal(game.solve(answers[0]).ok, false);
  assert.deepEqual(game.exportData(), solved);
});

test('attention filter rejects duplicates, missing true messages and deceptive additions', () => {
  const { game } = setup(); game.start(); reach(game, 1); game.observeClue();
  for (const answer of [['map', 'alarm'], ['map', 'alarm', 'alarm'], ['map', 'alarm', 'streak'], ['map', 'alarm', 'team', 'sale']]) assert.equal(game.solve(answer).ok, false);
  assert.equal(game.solve(['team', 'map', 'alarm']).ok, true, 'filter order does not matter');
});

test('power circuit validates all four conditions, accepting exactly one of 16 combinations', () => {
  const accepted = [];
  for (let bits = 0; bits < 16; bits++) {
    const { game } = setup(null); game.start(); reach(game, 2); game.observeClue();
    const answer = [0, 1, 2, 3].map(bit => Boolean(bits & (1 << bit)));
    if (game.solve(answer).ok) accepted.push(answer);
  }
  assert.deepEqual(accepted, [[true, false, true, false]]);
  const { game } = setup(); game.start(); reach(game, 2); game.observeClue();
  assert.equal(game.solve([1, 0, 1, 0]).ok, false, 'numeric truthiness cannot bypass boolean switch validation');
});

test('secret is optional, requires solved power node and returns to that room with position intact', () => {
  const { game, storage } = setup(); game.start();
  assert.equal(game.enterSecret().ok, false);
  reach(game, 2); assert.equal(game.enterSecret().ok, false);
  solveRoom(game); game.setPosition({ x: 6, z: 4.8, yaw: .4, pitch: -.2 });
  assert.equal(game.enterSecret().ok, true);
  assert.equal(game.state.roomIndex, 6); assert.equal(game.state.roomSolved, false);
  assert.deepEqual(game.state.position, { x: 0, z: 5.5, yaw: 0, pitch: 0 });
  game.observeClue();
  assert.equal(game.solve('alle sachen').ok, false);
  assert.equal(game.solve('  eine   sache ').ok, true);
  assert.equal(game.state.secretSolved, true);
  const restored = new Game({ storage });
  assert.equal(restored.state.roomIndex, 6); assert.equal(restored.state.secretSolved, true);
  assert.equal(restored.leaveSecret().ok, true);
  assert.equal(restored.state.roomIndex, 2); assert.equal(restored.state.roomSolved, true);
  assert.equal(restored.state.position.x, 6); assert.equal(restored.state.position.z, 4.8);
  assert.equal(restored.nextRoom().ok, true);
  reach(restored, 5); restored.observeClue();
  assert.equal(restored.solve('PAUSE', 'quiet').ok, true);
  assert.equal(restored.finish('balanced').ok, false);
  assert.equal(restored.finish('quiet').ok, true);
  assert.equal(restored.state.ending, 'quiet');
});

test('quiet exit cannot be claimed without secret and wrong final word does not open a door', () => {
  const { game } = setup(); game.start(); reach(game, 5); game.observeClue();
  assert.equal(game.solve('PAUSE', 'quiet').ok, false);
  assert.equal(game.solve('PAUSE', 'balanced').ok, false);
  assert.equal(game.solve('FOKUS', 'unknown').ok, false);
  assert.equal(game.state.roomSolved, false); assert.equal(game.finish().ok, false);
  assert.equal(game.solve(' fokus ', 'balanced').ok, true);
  assert.equal(game.state.ended, false);
});

test('a bridge answer alone cannot replace actual ordered traversal; hazards reset progress once', () => {
  const { game } = setup(); game.start(); reach(game, 3); game.observeClue();
  assert.equal(game.solve('traverse').ok, false);
  assert.equal(game.traverseTile('A').ok, true);
  assert.equal(game.traverseTile('A').repeated, true);
  assert.deepEqual(game.state.trapWitness, ['A']);
  assert.equal(game.traverseTile('B').ok, false);
  assert.deepEqual(game.state.trapWitness, []);
  const hazards = game.state.metrics.hazards, stress = game.state.stress;
  assert.equal(game.hitHazard('tile-B').repeated, true);
  assert.equal(game.state.metrics.hazards, hazards); assert.equal(game.state.stress, stress);
  for (const tile of ['A', 'C', 'D']) game.traverseTile(tile);
  assert.equal(game.solve('traverse').ok, false);
  assert.equal(game.traverseTile('F').complete, true);
  assert.equal(game.traverseTile('F').complete, true, 'remaining on the final tile keeps the completed witness');
  assert.equal(game.solve('traverse').ok, true);
});

test('repeated bridge hazards persist a reset without repeated stress or rewards', () => {
  const { game, storage } = setup(); game.start(); reach(game, 3); game.observeClue();
  game.hitHazard('beam'); game.traverseTile('A'); game.traverseTile('C');
  const stress = game.state.stress, hazards = game.state.metrics.hazards;
  assert.equal(game.hitHazard('beam').repeated, true);
  const restored = new Game({ storage });
  assert.deepEqual(restored.state.trapWitness, []);
  assert.equal(restored.state.stress, stress); assert.equal(restored.state.metrics.hazards, hazards);
});

test('bypass and shield are distinct alternatives with real resource costs and physical movement', () => {
  const { game } = setup(); game.start(); reach(game, 2);
  assert.equal(game.state.credits, 4);
  assert.equal(game.buyTool('bypass').ok, true); assert.equal(game.state.credits, 1);
  assert.equal(game.useTool('bypass').ok, true, 'tool route may solve without a clue read');
  assert.equal(game.state.routes[2], 'bypass'); assert.equal(game.state.tools.bypass.charges, 0);
  const before = game.exportData(); assert.equal(game.useTool('bypass').ok, false); assert.deepEqual(game.exportData(), before);
  game.nextRoom(); assert.equal(game.buyTool('shield').ok, true);
  assert.equal(game.useTool('shield').type, 'traversal'); assert.equal(game.state.roomSolved, false);
  assert.equal(game.solve('traverse').ok, false);
  assert.equal(game.traverseTile('B').hazard, false);
  game.traverseTile('E'); assert.equal(game.traverseTile('F').complete, true);
  assert.equal(game.solve('traverse').ok, true);
  assert.equal(game.state.routes[3], 'shield'); assert.equal(game.state.metrics.hazards, 0);
});

test('planner upgrade executes scheduling once and invalid purchases/upgrades cannot spend points', () => {
  const { game } = setup(); game.start(); reach(game, 4);
  const credits = game.state.credits;
  assert.equal(game.buyTool('unknown').ok, false); assert.equal(game.upgradeTool('planner').ok, false);
  assert.equal(game.state.credits, credits);
  game.buyTool('planner');
  assert.equal(game.state.tools.planner.level, 1);
  assert.equal(game.upgradeTool('planner').ok, true);
  assert.equal(game.state.tools.planner.level, 2);
  assert.equal(game.state.credits, credits - 5);
  const after = game.state.credits;
  assert.equal(game.upgradeTool('planner').ok, false); assert.equal(game.state.credits, after);
  const result = game.useTool('planner'); assert.equal(result.ok, true); assert.equal(result.type, 'solved');
  assert.equal(game.state.routes[4], 'planner'); assert.equal(game.state.tools.planner.charges, 0);
});

test('scanner consumes a charge; repeated ordinary clue reads cannot emulate recovery', () => {
  const { game } = setup(); game.start();
  game.observeClue(); game.solve([]);
  const focus = game.state.focus, stress = game.state.stress;
  assert.equal(game.useTool('scanner').type, 'clue');
  assert.equal(game.state.focus, focus + 8); assert.equal(game.state.stress, stress - 6);
  assert.equal(game.state.tools.scanner.charges, 1);
  const after = game.exportData(); game.observeClue(); assert.deepEqual(game.exportData(), after);
});

test('distraction cooldown and exact ID response prevent duplicate trigger/reward; pending survives reload', () => {
  const { game, storage, tick } = setup(); game.start();
  const first = game.triggerDistraction(); assert.equal(first.ok, true); assert.equal(first.distraction.deceptive, true);
  assert.equal(game.triggerDistraction().ok, false);
  assert.equal(game.respondDistraction('forged-id', 'click').ok, false);
  assert.equal(game.respondDistraction(first.distraction.id, 'unknown').ok, false);
  const restored = new Game({ storage, now: () => 100000 });
  assert.equal(restored.state.pendingDistraction.id, first.distraction.id);
  assert.equal(restored.respondDistraction(first.distraction.id, 'ignore').ok, true);
  assert.equal(restored.state.metrics.deceptiveIgnored, 1);
  const snapshot = restored.exportData(); assert.equal(restored.respondDistraction(first.distraction.id, 'ignore').ok, false);
  assert.deepEqual(restored.exportData(), snapshot);
  game.respondDistraction(first.distraction.id, 'ignore'); tick(11999);
  assert.equal(game.triggerDistraction().reason, 'cooldown'); tick(1);
  assert.equal(game.triggerDistraction().ok, true);
});

test('adaptive intelligence increases precision after identified lures and exports concrete evidence', () => {
  const a = setup(), b = setup(); a.game.start(); b.game.start();
  for (let i = 0; i < 8; i++) {
    const first = a.game.triggerDistraction(), second = b.game.triggerDistraction();
    assert.deepEqual(first, second, 'same seed/evidence/clock produces the same interruption');
    const action = first.distraction.deceptive ? 'ignore' : 'click';
    assert.equal(a.game.respondDistraction(first.distraction.id, action).ok, true);
    b.game.respondDistraction(second.distraction.id, action);
    a.tick(20000); b.tick(20000);
  }
  assert.equal(a.game.distractionLevel(), 3);
  assert.equal(a.game.state.metrics.deceptiveIgnored, 6);
  assert.equal(a.game.state.metrics.usefulClicks, 2);
  const next = a.game.triggerDistraction(); assert.equal(next.distraction.adaptation, 'precision');
  const evidence = a.game.exportData().state;
  assert.equal(evidence.distractions.filter(item => item.deceptive && item.action === 'ignore').length, 6);
  assert.ok(evidence.history.some(item => item.type === 'distraction-response' && item.data.deceptive));
});

test('repeated deceptive clicks change temptation pattern; overload reduces aggression rather than failing run', () => {
  const { game, tick } = setup(); game.start();
  for (let i = 0; i < 2; i++) {
    const event = game.triggerDistraction(); game.respondDistraction(event.distraction.id, 'click'); tick(20000);
  }
  const temptation = game.triggerDistraction(); assert.equal(temptation.distraction.adaptation, 'temptation');
  game.respondDistraction(temptation.distraction.id, 'click'); tick(20000);
  game.observeClue(); for (let i = 0; i < 10; i++) game.solve([]);
  assert.equal(game.state.ended, false); assert.ok(game.state.stress >= 65);
  const recovery = game.triggerDistraction(); assert.equal(recovery.distraction.adaptation, 'recovery');
  assert.equal(recovery.distraction.deceptive, false); assert.equal(recovery.distraction.level, 1);
  assert.equal(game.distractionCooldown(), 20000);
  const stress = game.state.stress;
  game.respondDistraction(recovery.distraction.id, 'click'); assert.ok(game.state.stress < stress);
  assert.equal(game.state.ended, false);
});

test('upgraded shield absorbs one deceptive click without erasing evidence', () => {
  const { game } = setup(); game.start(); reach(game, 3);
  assert.equal(game.buyTool('shield').ok, true); assert.equal(game.upgradeTool('shield').ok, true);
  assert.equal(game.useTool('shield').ok, true);
  const focus = game.state.focus, stress = game.state.stress;
  const event = game.triggerDistraction();
  const response = game.respondDistraction(event.distraction.id, 'click');
  assert.equal(response.protected, true); assert.equal(game.state.deceptionShield, 0);
  assert.equal(game.state.focus, focus); assert.equal(game.state.stress, stress);
  assert.equal(game.state.metrics.deceptiveClicks, 1);
});

test('position, partial bridge witness, tools, clues and metrics restore with validated bounded values', () => {
  const { game, storage } = setup(); game.start(); reach(game, 3); game.observeClue();
  game.traverseTile('A'); game.traverseTile('C'); game.setPosition({ x: 3, z: -4, yaw: 9, pitch: 99 }); game.save();
  const restored = new Game({ storage });
  assert.equal(restored.resume().ok, true); assert.equal(restored.state.roomIndex, 3);
  assert.deepEqual(restored.state.trapWitness, ['A', 'C']); assert.ok(restored.state.observed.includes(3));
  assert.equal(restored.state.position.x, 3); assert.equal(restored.state.position.z, -4);
  assert.equal(restored.state.position.pitch, 1.5); assert.ok(Math.abs(restored.state.position.yaw) <= Math.PI);
  restored.traverseTile('D'); restored.traverseTile('F'); assert.equal(restored.solve('traverse').ok, true);
  const raw = JSON.parse(storage.getItem(STORAGE_KEY));
  Object.assign(raw.state, { focus: 1000, stress: -1, credits: 'NaN', score: null });
  raw.state.position = { x: 1000, z: -1000, yaw: 'bad', pitch: -99 };
  raw.state.tools.scanner.level = 99; raw.state.tools.scanner.charges = 999;
  storage.setItem(STORAGE_KEY, JSON.stringify(raw));
  const bounded = new Game({ storage });
  assert.equal(bounded.state.focus, 100); assert.equal(bounded.state.stress, 0);
  assert.equal(bounded.state.credits, 0); assert.equal(bounded.state.score, 0);
  assert.equal(bounded.state.position.x, 200); assert.equal(bounded.state.position.z, -200);
  assert.equal(bounded.state.tools.scanner.level, 2); assert.equal(bounded.state.tools.scanner.charges, 20);
});

test('corrupted saves and impossible room jumps fall back safely; storage faults keep gameplay usable', () => {
  for (const raw of ['not JSON', 'null', '{"schemaVersion":9}', JSON.stringify({ schemaVersion: 1, state: { roomIndex: 5, solved: [] } })]) {
    const storage = new Storage(); storage.setItem(STORAGE_KEY, raw);
    const game = new Game({ storage }); assert.equal(game.storageFailed, true); assert.equal(game.state.started, false);
    assert.equal(game.start().ok, true); assert.equal(game.storageFailed, false);
  }
  const unavailable = new Game({ storage: null }); assert.equal(unavailable.start().ok, true);
  assert.equal(unavailable.save().ok, false); assert.equal(unavailable.storageFailed, true);
  assert.equal(unavailable.observeClue().ok, true); assert.equal(unavailable.solve(answers[0]).ok, true);
  const blocked = new Game({ storage: { getItem() { throw Error('denied'); }, setItem() { throw Error('full'); } } });
  assert.equal(blocked.start().ok, true); assert.equal(blocked.storageFailed, true);
  assert.equal(blocked.observeClue().ok, true); assert.equal(blocked.solve(answers[0]).ok, true);
});

test('all mutation failures expose a reason and exported snapshots cannot mutate live progress', () => {
  const { game } = setup();
  for (const result of [game.resume(), game.nextRoom(), game.enterSecret(), game.solve([]), game.useTool('bypass'), game.finish()]) {
    assert.equal(result.ok, false); assert.equal(typeof result.reason, 'string');
  }
  game.start(); const exported = game.exportData();
  exported.state.stress = 999; exported.state.tools.scanner.charges = 999;
  assert.equal(game.state.stress, 15); assert.equal(game.state.tools.scanner.charges, 2);
  assert.doesNotThrow(() => JSON.stringify(game.exportData()));
});
