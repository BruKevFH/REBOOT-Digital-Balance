import { EVENTS, MODULES, INSIGHTS, SLOT_ORDER, STORY_BEATS } from './content.js';

export const STORAGE_KEY = 'reboot-neon-balance:v1';
const MODES = new Set(['story', 'endless', 'daily']);
const MINIS = new Set(['focus', 'shield', 'memory', 'signal']);
const MAX = Number.MAX_SAFE_INTEGER;
const HISTORY = { runs: 25, events: 5000, timeline: 1000, minis: 500 };
const INITIAL_STATS = { energy: 78, focus: 76, mood: 72, balance: 60, social: 62 };
const PERSON_IDS = ['mia', 'leon', 'sami', 'nora'];
const EVENT_BY_ID = new Map(EVENTS.map(event => [event.id, event]));
const MODULE_BY_ID = new Map(MODULES.map(module => [module.id, module]));
const INSIGHT_IDS = new Set(INSIGHTS.map(insight => insight.id));
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const number = (value, fallback = 0, min = 0, max = MAX) =>
  typeof value === 'number' && Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
const integer = (value, fallback = 0, min = 0, max = MAX) => Math.trunc(number(value, fallback, min, max));
const text = (value, fallback = '', max = 160) => typeof value === 'string' ? value.slice(0, max) : fallback;
const add = (value, delta) => number(value + delta, 0);
const clone = value => JSON.parse(JSON.stringify(value));
const strings = (value, allowed = null, limit = 100) => [...new Set(
  (Array.isArray(value) ? value : []).filter(item => typeof item === 'string' &&
    item.length <= 160 && (!allowed || allowed.has(item))).slice(-limit)
)];

function hash(value) {
  let result = 2166136261;
  for (const character of String(value)) result = Math.imul(result ^ character.charCodeAt(0), 16777619);
  return result >>> 0;
}

function date(value, fallback) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value)) ? value : fallback;
}

function playerPosition(value) {
  if (!object(value) || !Number.isFinite(value.x) || !Number.isFinite(value.z)) return null;
  const yaw = typeof value.yaw === 'number' && Number.isFinite(value.yaw) ? value.yaw : 0;
  const turn = Math.PI * 2;
  return { x: number(value.x, 0, -100, 100), z: number(value.z, 0, -100, 100),
    yaw: ((yaw + Math.PI) % turn + turn) % turn - Math.PI,
    pitch: number(value.pitch, 0, -1.5, 1.5) };
}

function freshProfile(timestamp) {
  return {
    id: 'local-player', name: 'Player', createdAt: timestamp, level: 1, xp: 0, chips: 0,
    unlocked: [], achievements: [], bestBalance: 0, totalRuns: 0, totalDays: 0,
    settings: { sound: true, reducedMotion: false }
  };
}

function restoreProfile(value, timestamp) {
  const profile = freshProfile(timestamp);
  if (!object(value)) return profile;
  profile.name = text(value.name, 'Player', 20).trim() || 'Player';
  profile.createdAt = date(value.createdAt, timestamp);
  for (const key of ['xp', 'chips', 'totalRuns', 'totalDays']) profile[key] = integer(value[key]);
  profile.bestBalance = integer(value.bestBalance, 0, 0, 100);
  profile.level = 1 + Math.floor(profile.xp / 120);
  profile.unlocked = strings(value.unlocked, new Set(MODULE_BY_ID.keys()), 5);
  profile.achievements = strings(value.achievements);
  if (object(value.settings)) {
    for (const key of ['sound', 'reducedMotion']) {
      if (typeof value.settings[key] === 'boolean') profile.settings[key] = value.settings[key];
    }
  }
  return profile;
}

function restoreRun(value, timestamp) {
  if (!object(value) || !MODES.has(value.mode) || typeof value.id !== 'string' || !value.id ||
    !Number.isSafeInteger(value.day) || value.day < 1 ||
    !Number.isInteger(value.slotIndex) || value.slotIndex < 0 || value.slotIndex >= SLOT_ORDER.length) return null;
  const ended = value.ended === true;
  const maxDay = value.mode === 'story' ? 21 : value.mode === 'daily' ? 3 : MAX;
  if ((!ended && value.day > maxDay) || value.day > maxDay + (maxDay === MAX ? 0 : 1) ||
    (value.day > maxDay && value.slotIndex !== 0) || (ended && value.credited !== true) ||
    (!ended && value.credited === true)) return null;
  const stats = {};
  const relationships = {};
  for (const [key, initial] of Object.entries(INITIAL_STATS)) stats[key] = number(value.stats?.[key], initial, 0, 100);
  for (const key of PERSON_IDS) relationships[key] = number(value.relationships?.[key], 50, 0, 100);
  const run = {
    id: text(value.id), mode: value.mode, startedAt: date(value.startedAt, timestamp),
    day: value.day, slotIndex: value.slotIndex, stats, relationships,
    sleepHours: number(value.sleepHours, 8, 3, 10.5), screenMinutes: number(value.screenMinutes),
    nightScreen: number(value.nightScreen), dailyScreenMinutes: number(value.dailyScreenMinutes),
    maxNightScreen: number(value.maxNightScreen), xp: integer(value.xp), chips: integer(value.chips),
    timeline: (Array.isArray(value.timeline) ? value.timeline : []).slice(-HISTORY.timeline).filter(object).map(entry => ({
      day: integer(entry.day, 1, 1), slot: text(entry.slot), eventId: text(entry.eventId),
      event: text(entry.event, '', 300), choice: text(entry.choice, '', 300),
      choiceIndex: integer(entry.choiceIndex, -1, -1, 100),
      ...(Number.isSafeInteger(entry.beatDay) ? { beatDay: Math.max(1, entry.beatDay) } : {})
    })),
    seen: (Array.isArray(value.seen) ? value.seen : []).filter(id => EVENT_BY_ID.has(id)).slice(-40),
    miniScores: (Array.isArray(value.miniScores) ? value.miniScores : []).slice(-HISTORY.minis).filter(entry =>
      object(entry) && MINIS.has(entry.type)).map(entry => ({
        day: integer(entry.day, 1, 1), type: entry.type, score: integer(entry.score, 0, 0, 100)
      })),
    completedQuests: strings(value.completedQuests, new Set(['focus', 'screen', 'sleep']), 3),
    insights: strings(value.insights, INSIGHT_IDS), rerolls: integer(value.rerolls, 0, 0, 1),
    ended, credited: ended, currentEventId: null, pendingMini: null,
    seed: integer(value.seed, hash(value.id), 0, 0xffffffff),
    bonus: integer(value.bonus), manual: value.manual === true,
    playerPosition: playerPosition(value.playerPosition),
    readChapters: [...new Set((Array.isArray(value.readChapters) ? value.readChapters : [])
      .filter(day => Number.isSafeInteger(day) && day >= 1 && day <= maxDay))]
  };
  run.bestMiniScores = {};
  for (const type of MINIS) {
    const retainedBest = Math.max(0, ...run.miniScores.filter(entry => entry.type === type).map(entry => entry.score));
    run.bestMiniScores[type] = Math.max(retainedBest, integer(value.bestMiniScores?.[type], 0, 0, 100));
  }
  if (ended) run.endedAt = date(value.endedAt, timestamp);
  const event = EVENT_BY_ID.get(value.currentEventId);
  if (!ended && event?.slot === SLOT_ORDER[run.slotIndex]) run.currentEventId = event.id;
  if (value.pendingMini != null && !ended) {
    const decision = run.timeline.at(-1);
    if (!MINIS.has(value.pendingMini) || !event || event.mini !== value.pendingMini ||
      !run.currentEventId || decision?.day !== run.day || decision.slot !== event.slot ||
      decision.eventId !== event.id || !event.choices[decision.choiceIndex]) return null;
    run.pendingMini = value.pendingMini;
  }
  return run;
}

/** Synchronous, renderer-independent rules. Each public mutation saves one complete snapshot. */
export class Game {
  constructor({ storage, now = () => Date.now(), seed = 'REBOOT-Neon-Balance' } = {}) {
    this.now = typeof now === 'function' ? now : () => Date.now();
    this.seed = hash(seed);
    this.sequence = 0;
    this.storageFailed = false;
    this.storageError = null;
    if (storage === undefined) {
      try { storage = typeof window !== 'undefined' ? globalThis.localStorage : null; }
      catch { this.storageFailed = true; this.storageError = 'unavailable'; storage = null; }
    }
    this.storage = storage;
    this.profile = freshProfile(this._timestamp());
    this.run = null;
    this.runs = [];
    this.events = [];
    if (this.storage) this._restore();
  }

  get activeMode() { return this.run && !this.run.ended ? this.run.mode : null; }

  _timestamp() {
    let value;
    try { value = this.now(); } catch { value = Date.now(); }
    if (typeof value !== 'number' || !Number.isFinite(value) || Math.abs(value) > 8640000000000000) value = Date.now();
    return new Date(value).toISOString();
  }

  _id(kind) { this.sequence = add(this.sequence, 1); return `${kind}-${hash(this._timestamp()).toString(16)}-${this.sequence}-${this.seed.toString(16)}`; }

  _restore() {
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      if (raw === null) return;
      const state = JSON.parse(raw);
      if (!object(state) || state.schemaVersion !== 1) throw new Error('Invalid save schema');
      this.profile = restoreProfile(state.profile, this._timestamp());
      this.sequence = integer(state.sequence);
      this.run = restoreRun(state.run, this._timestamp());
      const ids = new Set();
      this.runs = (Array.isArray(state.runs) ? state.runs : []).slice(-HISTORY.runs).map(run => restoreRun(run, this._timestamp()))
        .filter(run => run?.ended && !ids.has(run.id) && ids.add(run.id));
      this.events = (Array.isArray(state.events) ? state.events : []).slice(-HISTORY.events).filter(entry => object(entry) &&
        typeof entry.type === 'string').map(entry => ({
          id: text(entry.id), runId: text(entry.runId), ts: date(entry.ts, this._timestamp()),
          day: integer(entry.day, 1, 1), type: text(entry.type), data: object(entry.data) ? clone(entry.data) : {}
        }));
    } catch {
      this.profile = freshProfile(this._timestamp()); this.run = null; this.runs = []; this.events = [];
      this.storageFailed = true; this.storageError = 'unreadable';
    }
  }

  _record(type, data = {}) {
    this.events.push({ id: this._id('event'), runId: this.run?.id || '',
      ts: this._timestamp(), day: this.run?.day || 1, type, data: clone(data) });
    if (this.events.length > HISTORY.events) this.events.splice(0, this.events.length - HISTORY.events);
  }

  _timeline(entry) {
    this.run.timeline.push(entry);
    if (this.run.timeline.length > HISTORY.timeline) this.run.timeline.splice(0, this.run.timeline.length - HISTORY.timeline);
  }

  save() {
    if (!this.storage || typeof this.storage.setItem !== 'function') {
      this.storageFailed = true; this.storageError = 'unavailable'; return false;
    }
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 1, sequence: this.sequence,
        profile: this.profile, run: this.run, runs: this.runs, events: this.events }));
      this.storageFailed = false; this.storageError = null; return true;
    } catch { this.storageFailed = true; this.storageError = 'write-failed'; return false; }
  }

  start(mode = 'story') {
    if (!MODES.has(mode)) return null;
    const id = this._id('run');
    this.run = {
      id, mode, startedAt: this._timestamp(), day: 1, slotIndex: 0,
      stats: mode === 'daily' ? { energy: 70, focus: 70, mood: 70, balance: 55, social: 60 } : { ...INITIAL_STATS },
      sleepHours: 8, screenMinutes: 0, nightScreen: 0, dailyScreenMinutes: 0, maxNightScreen: 0,
      xp: 0, chips: 0, relationships: { mia: 50, leon: 50, sami: 50, nora: 50 },
      timeline: [], seen: [], miniScores: [], completedQuests: [], insights: [],
      bestMiniScores: { focus: 0, shield: 0, memory: 0, signal: 0 },
      rerolls: this.profile.unlocked.includes('haptic') ? 1 : 0,
      currentEventId: null, pendingMini: null, seed: hash(`${this.seed}:${id}:${mode}`),
      ended: false, credited: false, bonus: 0, manual: false,
      playerPosition: null, readChapters: []
    };
    this._record('run_start', { mode });
    this._chapter();
    this.save();
    return this.run;
  }

  resume() { return this.run && !this.run.ended ? this.run : null; }

  _chapter() {
    const beat = this.run.mode === 'story' && STORY_BEATS[this.run.day];
    if (beat && !this.run.timeline.some(entry => entry.beatDay === this.run.day)) {
      this._timeline({ beatDay: this.run.day, day: this.run.day, event: beat.title, choice: 'chapter' });
      this._record('chapter', { title: beat.title });
    }
  }

  currentEvent() {
    const run = this.resume();
    if (!run) return null;
    const existing = EVENT_BY_ID.get(run.currentEventId);
    if (existing?.slot === SLOT_ORDER[run.slotIndex]) return existing;
    const pool = EVENTS.filter(event => event.slot === SLOT_ORDER[run.slotIndex]);
    const unseen = pool.filter(event => !run.seen.includes(event.id));
    const candidates = unseen.length ? unseen : pool;
    const event = candidates[hash(`${run.seed}:${run.day}:${run.slotIndex}`) % candidates.length];
    if (!event) return null;
    run.currentEventId = event.id;
    this.save();
    return event;
  }

  /** Haptic's daily charge selects a different scene before any choice is committed. */
  rerollEvent() {
    const run = this.resume();
    if (!run || run.pendingMini || !this.profile.unlocked.includes('haptic') || run.rerolls < 1) return null;
    const previous = this.currentEvent();
    if (!previous) return null;
    const alternatives = EVENTS.filter(event => event.slot === previous.slot && event.id !== previous.id);
    if (!alternatives.length) return null;
    const event = alternatives[hash(`${run.seed}:${run.day}:${run.slotIndex}:reroll`) % alternatives.length];
    run.rerolls--;
    run.currentEventId = event.id;
    this._record('event_reroll', { from: previous.id, to: event.id });
    this.save();
    return event;
  }

  _impact(impact = {}) {
    const run = this.run;
    for (const key of Object.keys(INITIAL_STATS)) run.stats[key] = number(run.stats[key] + number(impact[key], 0, -MAX), run.stats[key], 0, 100);
    const screen = number(impact.screen, 0, -MAX);
    run.screenMinutes = add(run.screenMinutes, screen);
    run.dailyScreenMinutes = add(run.dailyScreenMinutes, screen);
    if (run.slotIndex >= 4) run.nightScreen = add(run.nightScreen, screen);
    run.maxNightScreen = Math.max(run.maxNightScreen, run.nightScreen);
    run.sleepHours = number(run.sleepHours + number(impact.sleep, 0, -MAX), 8, 3, 10.5);
    run.xp = add(run.xp, number(impact.xp, 0, -MAX));
    run.chips = add(run.chips, number(impact.chips, 0, -MAX));
    for (const key of PERSON_IDS) {
      run.relationships[key] = number(run.relationships[key] + number(impact.rel?.[key], 0, -MAX), 50, 0, 100);
    }
  }

  _quests() {
    const run = this.run;
    const candidates = [run.stats.focus >= 60 && 'focus', run.dailyScreenMinutes < 180 && 'screen',
      run.sleepHours >= 8 && run.sleepHours <= 10 && 'sleep'].filter(Boolean);
    for (const id of candidates) if (!run.completedQuests.includes(id)) run.completedQuests.push(id);
  }

  choose(index) {
    const run = this.resume();
    const event = run && EVENT_BY_ID.get(run.currentEventId);
    if (!run || run.pendingMini || !event || event.slot !== SLOT_ORDER[run.slotIndex] ||
      !Number.isInteger(index) || !event.choices[index]) return null;
    const choice = event.choices[index];
    this._impact(choice.impact);
    this._timeline({ day: run.day, slot: event.slot, eventId: event.id,
      event: event.title, choice: choice.label, choiceIndex: index });
    run.seen.push(event.id); if (run.seen.length > 40) run.seen.shift();
    if (event.insight && !run.insights.includes(event.insight)) run.insights.push(event.insight);
    this._quests();
    this._record('choice', { eventId: event.id, choice: choice.label, impact: choice.impact || {}, stats: run.stats });
    if (event.mini && MINIS.has(event.mini)) {
      run.pendingMini = event.mini;
      this.save();
      return { mini: event.mini, dayEnded: false, runEnded: false, event, choice };
    }
    const result = this._advance();
    this.save();
    return { ...result, event, choice };
  }

  finishMini(type, scorePercent) {
    const run = this.resume();
    if (!run || !run.pendingMini || type !== run.pendingMini ||
      typeof scorePercent !== 'number' || !Number.isFinite(scorePercent)) return null;
    const score = Math.round(number(scorePercent, 0, 0, 100));
    run.pendingMini = null;
    run.miniScores.push({ day: run.day, type, score });
    if (run.miniScores.length > HISTORY.minis) run.miniScores.splice(0, run.miniScores.length - HISTORY.minis);
    run.bestMiniScores[type] = Math.max(run.bestMiniScores[type], score);
    run.xp = add(run.xp, Math.round(score / 10));
    run.chips = add(run.chips, score >= 75 ? 2 : score >= 45 ? 1 : 0);
    run.stats.focus = number(run.stats.focus + (score >= 70 ? 3 : score < 35 ? -3 : 0), 0, 0, 100);
    if (this.profile.unlocked.includes('pulse')) run.stats.energy = number(run.stats.energy + 2, 0, 0, 100);
    this._quests();
    this._record('minigame', { type, score });
    const result = this._advance();
    this.save();
    return result;
  }

  _advance() {
    const run = this.run;
    run.currentEventId = null;
    run.slotIndex++;
    const dayEnded = run.slotIndex >= SLOT_ORDER.length;
    if (dayEnded) {
      const sleepDelta = run.sleepHours - 8;
      if (sleepDelta < 0) {
        run.stats.energy = number(run.stats.energy + sleepDelta * 7, 0, 0, 100);
        run.stats.focus = number(run.stats.focus + sleepDelta * 5, 0, 0, 100);
      } else run.stats.energy = number(run.stats.energy + Math.min(6, sleepDelta * 2), 0, 0, 100);
      if (run.nightScreen > 60) run.stats.focus = number(run.stats.focus - (this.profile.unlocked.includes('light') ? 2.7 : 3), 0, 0, 100);
      if (this.profile.unlocked.includes('privacy')) run.stats.balance = number(run.stats.balance + 5, 0, 0, 100);
      this._quests();
      this._record('day_end', { sleepHours: run.sleepHours, screenMinutes: run.dailyScreenMinutes,
        nightScreen: run.nightScreen, stats: run.stats, quests: run.completedQuests });
      this.profile.totalDays = add(this.profile.totalDays, 1);
      run.day = add(run.day, 1); run.slotIndex = 0; run.sleepHours = 8;
      run.nightScreen = 0; run.dailyScreenMinutes = 0; run.completedQuests = [];
      run.rerolls = this.profile.unlocked.includes('haptic') ? 1 : 0;
    }
    const runEnded = (run.mode === 'story' && run.day > 21) || (run.mode === 'daily' && run.day > 3);
    if (runEnded) this.finishRun(); else if (dayEnded) this._chapter();
    return { dayEnded, runEnded };
  }

  finishRun(manual = false) {
    const run = this.run;
    if (!run || run.ended || run.credited) return null;
    run.ended = true; run.credited = true; run.manual = Boolean(manual);
    run.endedAt = this._timestamp(); run.currentEventId = null; run.pendingMini = null;
    run.bonus = Math.round((run.stats.balance + run.stats.focus + run.stats.mood) / 6);
    this.profile.xp = add(this.profile.xp, add(run.xp, run.bonus));
    this.profile.chips = add(this.profile.chips, run.chips);
    this.profile.totalRuns = add(this.profile.totalRuns, 1);
    this.profile.bestBalance = Math.max(this.profile.bestBalance, Math.round(run.stats.balance));
    this.profile.level = 1 + Math.floor(this.profile.xp / 120);
    const achievements = {
      'first-run': true, balanced: run.stats.balance >= 75,
      'lab-rat': run.bestMiniScores.signal >= 80,
      focus: run.bestMiniScores.focus >= 80,
      social: Object.values(run.relationships).some(value => value >= 75),
      'night-owl': run.maxNightScreen >= 90
    };
    for (const [id, earned] of Object.entries(achievements)) if (earned && !this.profile.achievements.includes(id)) this.profile.achievements.push(id);
    this._record('run_end', { manual: run.manual, stats: run.stats, xp: run.xp, bonus: run.bonus, chips: run.chips });
    this.runs.push(clone(run));
    if (this.runs.length > HISTORY.runs) this.runs.splice(0, this.runs.length - HISTORY.runs);
    this.save();
    return run;
  }

  unlockModule(id) {
    const module = MODULE_BY_ID.get(id);
    if (!module || this.profile.unlocked.includes(id)) return false;
    const run = this.resume();
    const runChips = run ? run.chips : 0;
    if (add(this.profile.chips, runChips) < module.cost) return false;
    const fromRun = Math.min(runChips, module.cost);
    if (run) run.chips -= fromRun;
    this.profile.chips -= module.cost - fromRun;
    this.profile.unlocked.push(id);
    if (id === 'haptic' && run) run.rerolls = 1;
    this._record('module_unlock', { module: id, cost: module.cost });
    this.save();
    return true;
  }

  setName(name) {
    this.profile.name = text(name, 'Player', 20).trim() || 'Player';
    this.save();
    return this.profile.name;
  }

  exportData() {
    return clone({ version: '1.0.0', schemaVersion: 1, profile: this.profile,
      run: this.run, runs: this.runs, events: this.events });
  }
}
