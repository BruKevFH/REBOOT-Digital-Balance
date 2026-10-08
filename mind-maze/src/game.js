export const STORAGE_KEY = 'mind-maze:save:v1';

export const TOOLS = [
  { id: 'scanner', name: 'Fokus-Scanner', cost: 1, charges: 1, maxLevel: 2, upgradeCost: 2,
    description: 'Liest die echte Raumspur und bündelt deine Aufmerksamkeit.', effect: 'Hinweis sichtbar; +8 Fokus, −6 Stress. Upgrade: +12 / −10.' },
  { id: 'shield', name: 'Impulsschild', cost: 2, charges: 1, maxLevel: 2, upgradeCost: 2,
    description: 'Dämpft falsche Impulse auf der Brücke. Du musst trotzdem selbst hinübergehen.', effect: 'Ein Brückendurchgang ohne Fallenstress. Upgrade schützt auch vor einem Täuschungsklick.' },
  { id: 'planner', name: 'Ein-Aufgaben-Planer', cost: 3, charges: 1, maxLevel: 2, upgradeCost: 2,
    description: 'Macht Abhängigkeiten sichtbar. Die zweite Stufe kann einen Ablauf ausführen.', effect: 'Stufe 1 zeigt den Taktlabor-Hinweis; Stufe 2 löst dessen Ablauf alternativ.' },
  { id: 'bypass', name: 'Analoger Bypass', cost: 3, charges: 1, maxLevel: 1, upgradeCost: 0,
    description: 'Überbrückt den digitalen Schaltknoten über eine unabhängige Leitung.', effect: 'Alternative Lösung für den Energieknoten; weniger Rätselpunkte.' }
];

export const ROOMS = [
  {
    index: 0, id: 'echo-lock', kind: 'memory', title: 'Echo-Schleuse', subtitle: 'Eine Spur reicht.',
    narrative: 'Du erwachst in einer digitalen Anlage. Der Ausgang ist verriegelt. Vier Lichtimpulse öffnen die erste Schleuse; daneben drängen bunte Meldungen nach vorn. Die Anlage prüft, welcher Spur du Aufmerksamkeit gibst.',
    objective: 'Lies die echte Lichtspur und wiederhole ihre Reihenfolge am Terminal.',
    lesson: 'Arbeitsgedächtnis hält nur begrenzt viele Informationen zugleich. Eine Aufgabe und eine klare Spur helfen.',
    clue: { title: 'Die echte Lichtspur', text: 'Die Wartungsnotiz zeigt vier Pulse: 2 → 4 → 1 → 3. Die Anzeigen daneben gehören nicht zur Schleuse.', lines: ['Zuerst 2.', 'Dann 4.', 'Dann 1.', 'Zum Schluss 3.'], sequence: [2, 4, 1, 3] },
    puzzle: { type: 'memory', prompt: 'Gib die vier Lichtimpulse in der richtigen Reihenfolge ein.', sequence: [2, 4, 1, 3], options: [1, 2, 3, 4].map(id => ({ id, label: `Impuls ${id}` })) }
  },
  {
    index: 1, id: 'signal-archive', kind: 'filter', title: 'Signalarchiv', subtitle: 'Wichtig ist nicht dasselbe wie laut.',
    narrative: 'Das Archiv sortiert Nachrichten nach Lautstärke, nicht nach Bedeutung. Du brauchst die Meldungen, die deinen Weg oder die Sicherheit betreffen. Ein blinkender Streak besitzt keine Schlüsselgewalt.',
    objective: 'Wähle genau die drei relevanten Meldungen aus.',
    lesson: 'Aufmerksamkeitsfilter sind Entscheidungen: Was gehört jetzt zur Aufgabe, und was kann warten?',
    clue: { title: 'Auftrag statt Aufmerksamkeit', text: 'Relevant sind der Lageplan, die echte Leitungswarnung und die Teamnotiz. Feed, Rabatt und Streak helfen dir nicht beim Entkommen.', lines: ['Weg finden: Lageplan.', 'Gefahr prüfen: Leitungswarnung.', 'Aufgabe abstimmen: Teamnotiz.'] },
    puzzle: { type: 'filter', prompt: 'Welche Meldungen gehören zu deinem Auftrag?', options: [
      { id: 'map', label: 'Lageplan: Der Energieknoten liegt hinter Tür 2.' },
      { id: 'streak', label: 'Deine Streak vermisst dich! Öffne den Feed.' },
      { id: 'alarm', label: 'Leitungswarnung: Vor dem Einschalten die Schaltregeln lesen.' },
      { id: 'sale', label: 'Nur heute: neue Farben für dein Terminal.' },
      { id: 'team', label: 'Teamnotiz: Teste die Leitung vor dem Senden.' },
      { id: 'feed', label: 'Zwölf neue Clips warten auf dich.' }
    ] }
  },
  {
    index: 2, id: 'power-node', kind: 'logic', title: 'Energieknoten', subtitle: 'Prüfen, bevor du klickst.',
    narrative: 'Vier Leitungen konkurrieren um einen Ausgang. Die Anlage bietet dauernd einen „Sofort-Fix“ an. Die echte Schaltung verlangt, alle Bedingungen gemeinsam zu prüfen. An der Seitenwand ist eine auffällig stille Wartungstür.',
    objective: 'Finde eine Schalterkombination, die alle vier Regeln erfüllt.',
    lesson: 'Eine laute Abkürzung ersetzt keine Prüfung. Ein Modell mit klaren Bedingungen reduziert unnötige Versuche.',
    clue: { title: 'Vier Bedingungen', text: 'Genau zwei Schalter müssen an sein. A ist erforderlich. Wenn A an ist, muss C an sein. B und C dürfen nicht gemeinsam an sein; D funktioniert nur mit B.', lines: ['Genau zwei Schalter an.', 'A erforderlich; A braucht C.', 'B und C schließen sich aus.', 'D braucht B.'] },
    puzzle: { type: 'logic', prompt: 'Schalte A, B, C und D. Prüfe dann die gesamte Kombination.', switches: [
      { id: 'A', label: 'A · Versorgung' }, { id: 'B', label: 'B · Impulskreis' },
      { id: 'C', label: 'C · ruhige Leitung' }, { id: 'D', label: 'D · Verstärker' }
    ] }
  },
  {
    index: 3, id: 'impulse-bridge', kind: 'bridge', title: 'Impulsbrücke', subtitle: 'Erst schauen. Dann gehen.',
    narrative: 'Ein Boden aus sechs Feldern trennt dich von der nächsten Tür. Einige Impulse locken dich auf eine Abkürzung. Die Wartungsspur ist langsamer zu lesen, aber zuverlässig. Dein Weg zählt erst, wenn du ihn tatsächlich gehst.',
    objective: 'Lies die Spur und betrete A, C, D, F in dieser Reihenfolge.',
    lesson: 'Ein kurzer Orientierungsstopp kann impulsive Fehler verhindern. Schutzwerkzeuge ersetzen nicht deine Handlung.',
    clue: { title: 'Die Wartungsspur', text: 'Der sichere Weg verläuft A → C → D → F. B und E sind Täuschungsfelder. Mit einem Impulsschild kannst du eine andere Strecke über mindestens drei verschiedene Felder bis F nehmen.', lines: ['A → C → D → F.', 'B und E führen ohne Schutz in eine Falle.', 'Gehe den Weg selbst; ein Terminalklick reicht nicht.'] },
    puzzle: { type: 'bridge', prompt: 'Gehe über die Felder. Bestätige erst am anderen Ende.', tiles: ['A', 'B', 'C', 'D', 'E', 'F'], path: ['A', 'C', 'D', 'F'] }
  },
  {
    index: 4, id: 'timing-lab', kind: 'schedule', title: 'Taktlabor', subtitle: 'Wechsel kosten Aufmerksamkeit.',
    narrative: 'Vier Aufgaben blinken gleichzeitig. Alles parallel zu starten wirkt schnell, erzeugt aber Rücksprünge: Ein Test ohne Leitung und eine Nachricht ohne Testergebnis helfen niemandem. Du bringst die Aufgaben in einen ausführbaren Ablauf.',
    objective: 'Ordne Plan, Leitung, Test und Senden nach ihren Abhängigkeiten.',
    lesson: 'Multitasking besteht oft aus schnellen Wechseln. Klare Reihenfolgen sparen Wechsel und vermeiden Nacharbeit.',
    clue: { title: 'Abhängigkeiten vor Geschwindigkeit', text: 'Erst den Plan lesen, dann die Leitung verbinden. Der Test braucht die fertige Leitung. Senden darf erst nach dem Test stattfinden.', lines: ['Plan vor Leitung.', 'Leitung vor Test.', 'Test vor Senden.'] },
    puzzle: { type: 'schedule', prompt: 'Baue einen Ablauf aus den vier Aufgaben.', tasks: [
      { id: 'send', label: 'Ergebnis senden' }, { id: 'test', label: 'Leitung testen' },
      { id: 'plan', label: 'Plan lesen' }, { id: 'wire', label: 'Leitung verbinden' }
    ] }
  },
  {
    index: 5, id: 'exit-core', kind: 'exit', title: 'Ausgangskern', subtitle: 'Du setzt das letzte Signal.',
    narrative: 'Die Anlage hat keinen echten Countdown. Sie wollte, dass jede Unterbrechung wichtiger wirkt als dein Ziel. Deine gesammelten Fragmente öffnen den regulären Ausgang. Wer den Stillraum entdeckt hat, kennt eine zweite Route.',
    objective: 'Öffne eine Ausgangsroute mit dem passenden Wort und gehe anschließend zur Tür.',
    lesson: 'Bewusst auswählen, ordnen und Pausen erlauben: Kontrolle bedeutet nicht, jede Meldung zu beantworten.',
    clue: { title: 'Zwei Wege aus der Anlage', text: 'Die fünf Raumfragmente ergeben FOKUS für den regulären Ausgang. Der Stillraum verrät PAUSE für den leisen Ausgang. Ein gelöstes Terminal öffnet die Tür; du musst sie noch selbst erreichen.', lines: ['Regulär: FOKUS.', 'Leise Route: PAUSE, nur mit gelöstem Stillraum.', 'Kein Zeitlimit. Erreiche die geöffnete Tür.'] },
    puzzle: { type: 'exit', prompt: 'Wähle die Route und gib das Ausgangswort ein.', routes: [
      { id: 'balanced', label: 'Regulärer Ausgang · FOKUS' }, { id: 'quiet', label: 'Leiser Ausgang · PAUSE' }
    ] }
  },
  {
    index: 6, id: 'quiet-room', kind: 'secret', title: 'Stillraum', subtitle: 'Die versteckte Pause.',
    narrative: 'Hinter der Wartungstür gibt es keine Werbung und keinen Alarm. Eine analoge Karte nennt das Prinzip, das die Anlage ständig verdeckte. Dieser Raum ist optional; er öffnet einen anderen Ausgang und schenkt dir zusätzliche Werkzeugpunkte.',
    objective: 'Lies die analoge Karte und ergänze ihr Prinzip.',
    lesson: 'Eine selbst gewählte Pause kann Stress senken. Sie ist ein Werkzeug, kein Versagen.',
    clue: { title: 'Die analoge Karte', text: '„Wenn alles zugleich drängt: EINE SACHE nach der anderen.“ Das Prinzip ist EINE SACHE. Darunter steht das Ausgangswort PAUSE.', lines: ['EINE SACHE nach der anderen.', 'Leiser Ausgang: PAUSE.'] },
    puzzle: { type: 'secret', prompt: 'Welches Prinzip steht auf der Karte?', placeholder: 'Zwei Wörter' }
  }
];

const MAX = Number.MAX_SAFE_INTEGER;
const TOOL_MAP = new Map(TOOLS.map(tool => [tool.id, tool]));
const SAFE_PATH = ['A', 'C', 'D', 'F'];
const FILTER = ['map', 'alarm', 'team'];
const ORDER = ['plan', 'wire', 'test', 'send'];
const LETTERS = ['F', 'O', 'K', 'U', 'S'];
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const finite = (value, fallback = 0, min = 0, max = MAX) => typeof value === 'number' && Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
const integer = (value, fallback = 0, min = 0, max = MAX) => Math.trunc(finite(value, fallback, min, max));
const clone = value => JSON.parse(JSON.stringify(value));
const fail = reason => ({ ok: false, reason });
const word = value => typeof value === 'string' ? value.trim().toUpperCase().replace(/\s+/g, ' ') : '';
const same = (a, b) => Array.isArray(a) && a.length === b.length && a.every((value, index) => value === b[index]);
const indices = value => [...new Set((Array.isArray(value) ? value : []).filter(index => Number.isInteger(index) && index >= 0 && index <= 6))];
const hash = value => { let h = 2166136261; for (const c of String(value)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };

function position(value) {
  if (!object(value) || !Number.isFinite(value.x) || !Number.isFinite(value.z)) return null;
  const yaw = finite(value.yaw, 0, -MAX);
  return { x: finite(value.x, 0, -200, 200), z: finite(value.z, 0, -200, 200),
    yaw: ((yaw + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI,
    pitch: finite(value.pitch, 0, -1.5, 1.5) };
}

function freshState(seed, timestamp) {
  return {
    started: false, seed, startedAt: timestamp, roomIndex: 0, roomSolved: false,
    solved: [], observed: [], tools: Object.fromEntries(TOOLS.map(tool => [tool.id,
      { owned: tool.id === 'scanner', level: tool.id === 'scanner' ? 1 : 0, charges: tool.id === 'scanner' ? 2 : 0 }])),
    credits: 0, focus: 80, stress: 15, trapWitness: [], shieldActive: false,
    deceptionShield: 0, fragments: [], secretUnlocked: false, secretSolved: false,
    returnRoomIndex: null, mainPosition: null, position: { x: 0, z: 5.5, yaw: 0, pitch: 0 }, routes: {}, exitRoute: null,
    score: 0, ended: false, ending: null, distractionSequence: 0, lastDistractionAt: null,
    pendingDistraction: null, distractions: [], hazardIds: [],
    metrics: { cluesRead: 0, mistakes: 0, hazards: 0, toolUses: 0, upgrades: 0,
      spawned: 0, clicked: 0, ignored: 0, deceptiveClicks: 0, deceptiveIgnored: 0,
      usefulClicks: 0, usefulIgnored: 0, roomsWithoutTools: 0 },
    roomMistakes: {}, history: []
  };
}

const LURES = [
  { title: 'Neue Clips im Anlagenfeed', text: 'Ein kurzer Blick? Die Schleuse kann warten.', category: 'feed', deceptive: true },
  { title: 'Sofort-Fix verfügbar', text: 'Überspringe die Schaltregeln. Ein Klick fühlt sich schneller an.', category: 'shortcut', deceptive: true },
  { title: 'Dein Impuls-Bonus wartet', text: 'Sammle den blinkenden Bonus, bevor du weiterdenkst.', category: 'reward', deceptive: true },
  { title: 'Priorität: Alles gleichzeitig', text: 'Starte alle Aufgaben parallel. Prüfen lässt sich später.', category: 'multitask', deceptive: true }
];

/** Renderer-independent escape rules; movement witnesses enter only through traverseTile. */
export class Game {
  constructor({ storage, now = () => Date.now(), seed = 'MIND-MAZE' } = {}) {
    this.now = typeof now === 'function' ? now : () => Date.now();
    this.seed = hash(seed); this.storageFailed = false; this.storageError = null;
    if (storage === undefined) {
      try { storage = typeof window !== 'undefined' ? globalThis.localStorage : null; }
      catch { storage = null; this.storageFailed = true; this.storageError = 'unavailable'; }
    }
    this.storage = storage;
    this.state = freshState(this.seed, this._time());
    this._restore();
  }

  _time() { try { return finite(this.now(), Date.now(), 0, 8640000000000000); } catch { return Date.now(); } }
  currentRoom() { return ROOMS[this.state.roomIndex]; }
  resume() { return this.state.started && !this.state.ended ? { ok: true, state: this.state } : fail('Kein offener Run zum Fortsetzen.'); }
  _live() { return this.state.started && !this.state.ended; }
  _record(type, data = {}) {
    this.state.history.push({ type, room: this.state.roomIndex, time: this._time(), data: clone(data) });
    if (this.state.history.length > 300) this.state.history.splice(0, this.state.history.length - 300);
  }
  _change(focus, stress) {
    this.state.focus = finite(this.state.focus + focus, 80, 0, 100);
    this.state.stress = finite(this.state.stress + stress, 15, 0, 100);
  }

  _restore() {
    if (!this.storage) return;
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      if (raw === null) return;
      const saved = JSON.parse(raw);
      if (!object(saved) || saved.schemaVersion !== 1 || !object(saved.state)) throw new Error('invalid schema');
      const source = saved.state;
      if (!Number.isInteger(source.roomIndex) || source.roomIndex < 0 || source.roomIndex > 6) throw new Error('invalid room');
      const state = freshState(integer(source.seed, this.seed, 0, 0xffffffff), this._time());
      state.started = source.started === true; state.startedAt = finite(source.startedAt, this._time());
      state.solved = indices(source.solved); state.observed = indices(source.observed);
      state.roomIndex = source.roomIndex; state.roomSolved = state.solved.includes(state.roomIndex);
      // A save cannot jump over an unresolved main room or into a locked secret room.
      const mainIndex = state.roomIndex === 6 ? 2 : state.roomIndex;
      if (Array.from({ length: mainIndex }, (_, index) => index).some(index => !state.solved.includes(index)) ||
        (state.roomIndex === 6 && !state.solved.includes(2))) throw new Error('invalid progress');
      let prefix = 0; while (state.solved.includes(prefix) && prefix < 6) prefix++;
      if (state.solved.some(index => index < 6 && index >= prefix) ||
        (state.solved.includes(6) && prefix < 3) || prefix < mainIndex || prefix > mainIndex + 1) throw new Error('invalid solved rooms');
      for (const key of ['credits', 'score', 'distractionSequence', 'deceptionShield']) state[key] = integer(source[key]);
      state.deceptionShield = Math.min(1, state.deceptionShield);
      state.focus = finite(source.focus, 80, 0, 100); state.stress = finite(source.stress, 15, 0, 100);
      for (const tool of TOOLS) {
        const value = source.tools?.[tool.id]; if (!object(value)) continue;
        const owned = value.owned === true;
        state.tools[tool.id] = { owned, level: owned ? integer(value.level, 1, 1, tool.maxLevel) : 0,
          charges: owned ? integer(value.charges, 0, 0, 20) : 0 };
      }
      state.trapWitness = (Array.isArray(source.trapWitness) ? source.trapWitness : [])
        .filter(tile => ROOMS[3].puzzle.tiles.includes(tile)).slice(-6);
      state.shieldActive = source.shieldActive === true && state.roomIndex === 3 && state.tools.shield.owned;
      if (!state.shieldActive && !state.trapWitness.every((tile, i) => tile === SAFE_PATH[i])) state.trapWitness = [];
      state.secretUnlocked = state.solved.includes(2); state.secretSolved = state.solved.includes(6);
      state.returnRoomIndex = state.roomIndex === 6 ? 2 : null;
      state.position = position(source.position) || { x: 0, z: 5.5, yaw: 0, pitch: 0 }; state.mainPosition = position(source.mainPosition);
      state.fragments = LETTERS.filter((letter, i) => state.solved.includes(i));
      state.routes = {};
      for (const index of state.solved) state.routes[index] = typeof source.routes?.[index] === 'string' ? source.routes[index].slice(0, 30) : 'balanced';
      for (const key of Object.keys(state.metrics)) state.metrics[key] = integer(source.metrics?.[key]);
      state.roomMistakes = {};
      for (let i = 0; i <= 6; i++) if (source.roomMistakes?.[i]) state.roomMistakes[i] = integer(source.roomMistakes[i]);
      state.lastDistractionAt = typeof source.lastDistractionAt === 'number' && Number.isFinite(source.lastDistractionAt) ? finite(source.lastDistractionAt, 0) : null;
      state.distractions = (Array.isArray(source.distractions) ? source.distractions : []).slice(-100).filter(object).map(item => ({
        id: typeof item.id === 'string' ? item.id.slice(0, 100) : '',
        title: typeof item.title === 'string' ? item.title.slice(0, 200) : '',
        text: typeof item.text === 'string' ? item.text.slice(0, 500) : '',
        category: typeof item.category === 'string' ? item.category.slice(0, 30) : 'unknown',
        deceptive: item.deceptive === true, level: integer(item.level, 1, 1, 3),
        adaptation: ['normal', 'precision', 'temptation', 'recovery'].includes(item.adaptation) ? item.adaptation : 'normal',
        time: finite(item.time), action: ['click', 'ignore'].includes(item.action) ? item.action : null
      }));
      state.pendingDistraction = state.distractions.find(item => item.id === source.pendingDistraction?.id && item.action === null) || null;
      state.hazardIds = [...new Set((Array.isArray(source.hazardIds) ? source.hazardIds : []).filter(id => typeof id === 'string').slice(-30))];
      state.history = (Array.isArray(source.history) ? source.history : []).slice(-300).filter(object).map(item => ({
        type: typeof item.type === 'string' ? item.type.slice(0, 40) : 'unknown', room: integer(item.room, 0, 0, 6),
        time: finite(item.time), data: object(item.data) ? clone(item.data) : {}
      }));
      state.exitRoute = ['balanced', 'quiet'].includes(source.exitRoute) && state.solved.includes(5) ? source.exitRoute : null;
      if (state.exitRoute === 'quiet' && !state.secretSolved) state.exitRoute = null;
      state.ended = source.ended === true && state.roomIndex === 5 && state.roomSolved && Boolean(state.exitRoute);
      state.ending = state.ended ? state.exitRoute : null;
      if (state.ended) state.finishedAt = finite(source.finishedAt, this._time());
      this.state = state;
    } catch { this.state = freshState(this.seed, this._time()); this.storageFailed = true; this.storageError = 'unreadable'; }
  }

  save() {
    if (!this.storage || typeof this.storage.setItem !== 'function') {
      this.storageFailed = true; this.storageError = 'unavailable'; return fail('Lokales Speichern ist nicht verfügbar. Du kannst in dieser Sitzung weiterspielen.');
    }
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 1, state: this.state }));
      this.storageFailed = false; this.storageError = null; return { ok: true };
    } catch {
      this.storageFailed = true; this.storageError = 'write-failed';
      return fail('Speichern ist blockiert oder der Speicher ist voll. Dein Fortschritt bleibt in dieser Sitzung erhalten.');
    }
  }

  start() { this.state = freshState(this.seed, this._time()); this.state.started = true; this._record('start'); this.save(); return { ok: true, state: this.state }; }
  setPosition(value) {
    if (!this._live()) return fail('Starte zuerst einen Run.');
    const valid = position(value); if (!valid) return fail('Ungültige Position.');
    this.state.position = valid; return { ok: true, position: valid };
  }
  observeClue() {
    if (!this._live()) return fail('Starte zuerst einen Run.');
    const state = this.state;
    if (!state.observed.includes(state.roomIndex)) {
      state.observed.push(state.roomIndex); state.metrics.cluesRead++; this._record('clue-read'); this.save();
    }
    return { ok: true, clue: this.currentRoom().clue };
  }

  _award(route = 'balanced', tool = false) {
    const state = this.state;
    if (state.roomSolved) return fail('Dieser Raum ist bereits gelöst.');
    state.roomSolved = true; state.solved.push(state.roomIndex); state.routes[state.roomIndex] = route;
    state.score += state.roomIndex === 6 ? 80 : tool ? 75 : 100;
    state.credits += state.roomIndex === 6 ? 3 : state.roomIndex === 5 ? 0 : 2;
    if (!tool) state.metrics.roomsWithoutTools++;
    this._change(4, -4);
    if (state.roomIndex < 5) state.fragments.push(LETTERS[state.roomIndex]);
    if (state.roomIndex === 2) state.secretUnlocked = true;
    if (state.roomIndex === 6) { state.secretSolved = true; this._change(10, -15); }
    this._record('room-solved', { route, tool }); this.save();
    return { ok: true, solved: true, roomIndex: state.roomIndex, route, credits: state.credits };
  }

  solve(answer, route = 'balanced') {
    if (!this._live()) return fail('Starte zuerst einen Run.');
    const state = this.state, room = state.roomIndex;
    if (state.roomSolved) return fail('Dieser Raum ist bereits gelöst.');
    if (!state.observed.includes(room)) return fail('Lies zuerst den echten Hinweis im Raum.');
    let correct = false;
    if (room === 0) correct = same(answer, [2, 4, 1, 3]);
    if (room === 1) correct = Array.isArray(answer) && answer.length === 3 && new Set(answer).size === 3 && FILTER.every(id => answer.includes(id));
    if (room === 2 && Array.isArray(answer) && answer.length === 4 && answer.every(value => typeof value === 'boolean')) {
      const [a, b, c, d] = answer;
      correct = answer.filter(Boolean).length === 2 && a && (!a || c) && !(b && c) && (!d || b);
    }
    if (room === 3) {
      correct = answer === 'traverse' && (state.shieldActive ? state.trapWitness.at(-1) === 'F' && new Set(state.trapWitness).size >= 3 : same(state.trapWitness, SAFE_PATH));
      if (correct) return this._award(state.shieldActive ? 'shield' : 'balanced', state.shieldActive);
    }
    if (room === 4) correct = same(answer, ORDER);
    if (room === 5) {
      if (!['balanced', 'quiet'].includes(route)) return fail('Wähle einen gültigen Ausgang.');
      if (route === 'quiet' && !state.secretSolved) return fail('Die leise Route braucht das Prinzip aus dem Stillraum.');
      correct = word(answer) === (route === 'quiet' ? 'PAUSE' : 'FOKUS');
      if (correct) state.exitRoute = route;
    }
    if (room === 6) correct = word(answer) === 'EINE SACHE';
    if (correct) return this._award(route);
    state.metrics.mistakes++; state.roomMistakes[room] = (state.roomMistakes[room] || 0) + 1;
    this._change(-4, 5); this._record('wrong-answer'); this.save();
    return fail(room === 3 ? 'Die Brücke braucht deinen tatsächlichen Weg A → C → D → F oder eine geschützte Strecke bis F.' : 'Das passt noch nicht zu allen Hinweisen. Prüfe die Spur; es gibt kein Zeitlimit.');
  }

  nextRoom() {
    if (!this._live()) return fail('Starte zuerst einen Run.');
    const state = this.state;
    if (!state.roomSolved) return fail('Die Tür öffnet erst nach der Raumaufgabe.');
    if (state.roomIndex === 6) return fail('Gehe vom Stillraum zurück zum Energieknoten.');
    if (state.roomIndex === 5) return fail('Erreiche jetzt den echten Ausgang.');
    state.roomIndex++; state.roomSolved = state.solved.includes(state.roomIndex);
    state.position = { x: 0, z: 5.5, yaw: 0, pitch: 0 }; state.shieldActive = false; state.trapWitness = []; state.hazardIds = [];
    this._record('room-entered'); this.save(); return { ok: true, room: this.currentRoom(), roomIndex: state.roomIndex };
  }

  enterSecret() {
    const state = this.state;
    if (!this._live() || state.roomIndex !== 2 || !state.roomSolved || !state.secretUnlocked) return fail('Die Wartungstür wird nach dem gelösten Energieknoten zugänglich.');
    state.returnRoomIndex = 2; state.mainPosition = state.position ? clone(state.position) : null;
    state.roomIndex = 6; state.roomSolved = state.secretSolved; state.position = { x: 0, z: 5.5, yaw: 0, pitch: 0 };
    this._record('secret-entered'); this.save(); return { ok: true, room: this.currentRoom(), roomIndex: 6 };
  }
  leaveSecret() {
    const state = this.state;
    if (!this._live() || state.roomIndex !== 6) return fail('Du bist nicht im Stillraum.');
    state.roomIndex = 2; state.roomSolved = state.solved.includes(2); state.returnRoomIndex = null;
    state.position = state.mainPosition || { x: 6, z: 4.8, yaw: 0, pitch: 0 }; state.mainPosition = null;
    this._record('secret-left'); this.save(); return { ok: true, room: this.currentRoom(), roomIndex: 2 };
  }

  hitHazard(id) {
    if (!this._live() || this.state.roomIndex !== 3 || this.state.roomSolved) return fail('Hier ist keine aktive Brückenfalle.');
    if (typeof id !== 'string' || !id || id.length > 60) return fail('Unbekannte Falle.');
    if (this.state.shieldActive) return { ok: true, protected: true, hazard: false };
    this.state.trapWitness = [];
    if (this.state.hazardIds.includes(id)) { this.save(); return { ok: true, hazard: true, repeated: true, reset: true }; }
    this.state.hazardIds.push(id); this.state.metrics.hazards++;
    this.state.trapWitness = []; this._change(-6, 8); this._record('hazard', { id }); this.save();
    return { ok: true, hazard: true, protected: false, reset: true };
  }
  traverseTile(id) {
    const state = this.state;
    if (!this._live() || state.roomIndex !== 3 || state.roomSolved) return fail('Die Brücke ist nicht aktiv.');
    if (!ROOMS[3].puzzle.tiles.includes(id)) return fail('Unbekanntes Brückenfeld.');
    if (!state.observed.includes(3) && !state.shieldActive) return fail('Lies zuerst die Wartungsspur.');
    if (state.trapWitness.at(-1) === id) {
      const complete = state.shieldActive ? id === 'F' && new Set(state.trapWitness).size >= 3 : same(state.trapWitness, SAFE_PATH);
      return { ok: true, repeated: true, complete, protected: state.shieldActive, next: state.shieldActive ? null : SAFE_PATH[state.trapWitness.length] || null };
    }
    if (!state.shieldActive && id !== SAFE_PATH[state.trapWitness.length]) {
      const result = this.hitHazard(`tile-${id}`); state.trapWitness = []; this.save();
      return { ...result, ok: false, reason: 'Falscher Impuls. Orientiere dich neu an A → C → D → F.', complete: false, next: 'A' };
    }
    state.trapWitness.push(id); if (state.trapWitness.length > 6) state.trapWitness.shift();
    const complete = state.shieldActive ? id === 'F' && new Set(state.trapWitness).size >= 3 : same(state.trapWitness, SAFE_PATH);
    this._record('tile-traversed', { id, protected: state.shieldActive }); this.save();
    return { ok: true, complete, hazard: false, protected: state.shieldActive, next: state.shieldActive ? null : SAFE_PATH[state.trapWitness.length] || null };
  }

  buyTool(id) {
    if (!this._live()) return fail('Starte zuerst einen Run.');
    const tool = TOOL_MAP.get(id); if (!tool) return fail('Unbekanntes Werkzeug.');
    const owned = this.state.tools[id];
    if (owned.charges >= 20) return fail('Dieses Werkzeug ist bereits vollständig geladen.');
    if (this.state.credits < tool.cost) return fail('Dafür fehlen Werkzeugpunkte.');
    this.state.credits -= tool.cost; owned.owned = true; owned.level = Math.max(1, owned.level); owned.charges += tool.charges;
    this._record('tool-bought', { id, cost: tool.cost }); this.save(); return { ok: true, tool: clone(owned), id };
  }
  upgradeTool(id) {
    if (!this._live()) return fail('Starte zuerst einen Run.');
    const tool = TOOL_MAP.get(id), owned = this.state.tools[id];
    if (!tool || !owned?.owned) return fail('Kaufe das Werkzeug zuerst.');
    if (owned.level >= tool.maxLevel) return fail('Die höchste Stufe ist bereits erreicht.');
    if (this.state.credits < tool.upgradeCost) return fail('Dafür fehlen Werkzeugpunkte.');
    this.state.credits -= tool.upgradeCost; owned.level++; this.state.metrics.upgrades++;
    this._record('tool-upgraded', { id, level: owned.level }); this.save(); return { ok: true, id, level: owned.level };
  }
  useTool(id) {
    if (!this._live() || this.state.roomSolved) return fail('Hier braucht es gerade kein Werkzeug.');
    const tool = TOOL_MAP.get(id), owned = this.state.tools[id];
    if (!tool || !owned?.owned || owned.charges < 1) return fail('Dieses Werkzeug ist nicht geladen.');
    const room = this.state.roomIndex;
    if (id === 'bypass' && room !== 2) return fail('Der Bypass gehört zum Energieknoten.');
    if (id === 'shield' && (room !== 3 || this.state.shieldActive)) return fail('Der Schild schützt einen aktiven Brückendurchgang.');
    if (id === 'planner' && room !== 4) return fail('Der Planer gehört zum Taktlabor.');
    owned.charges--; this.state.metrics.toolUses++;
    this._record('tool-used', { id, level: owned.level });
    if (id === 'bypass') return { ...this._award('bypass', true), type: 'solved', id };
    if (id === 'planner' && owned.level >= 2) return { ...this._award('planner', true), type: 'solved', id };
    if (id === 'shield') {
      this.state.shieldActive = true; this.state.trapWitness = []; this.state.hazardIds = [];
      if (owned.level >= 2) this.state.deceptionShield = 1;
      if (!this.state.observed.includes(3)) this.state.observed.push(3);
      this.save(); return { ok: true, type: 'traversal', id, protected: true };
    }
    this.observeClue();
    if (id === 'scanner') this._change(owned.level >= 2 ? 12 : 8, owned.level >= 2 ? -10 : -6);
    this.save(); return { ok: true, type: 'clue', id, clue: this.currentRoom().clue };
  }

  distractionLevel() {
    const state = this.state;
    if (state.stress >= 65 || state.focus < 35) return 1;
    return state.metrics.deceptiveIgnored >= 5 ? 3 : state.metrics.deceptiveIgnored >= 2 || state.metrics.deceptiveClicks >= 2 ? 2 : 1;
  }
  _adaptation() {
    const state = this.state;
    if (state.stress >= 65 || state.focus < 35) return 'recovery';
    if (state.metrics.deceptiveClicks >= 2 && state.metrics.clicked > state.metrics.ignored) return 'temptation';
    return state.metrics.deceptiveIgnored >= 3 ? 'precision' : 'normal';
  }
  distractionCooldown() { return this._adaptation() === 'recovery' ? 20000 : this.distractionLevel() >= 2 ? 10000 : 12000; }
  triggerDistraction() {
    const state = this.state;
    if (!this._live() || state.roomSolved) return fail('Keine aktive Raumaufgabe.');
    if (state.pendingDistraction) return fail('Eine Unterbrechung wartet bereits auf deine Entscheidung.');
    const time = this._time();
    if (state.lastDistractionAt !== null && time < state.lastDistractionAt) state.lastDistractionAt = time;
    if (state.lastDistractionAt !== null && time - state.lastDistractionAt < this.distractionCooldown()) return fail('cooldown');
    const adaptation = this._adaptation(), level = this.distractionLevel();
    let message;
    if (adaptation === 'recovery') {
      message = { title: 'Echtes Signal: Raum für eine Pause', text: 'Es gibt kein Zeitlimit. Nimm eine Sache nach der anderen; der Hinweis bleibt verfügbar.', category: 'recovery', deceptive: false };
    } else if ((state.distractionSequence + 1) % 4 === 0) {
      message = { title: 'Echtes Signal aus der Wartung', text: `Dein Auftrag bleibt: ${this.currentRoom().objective}`, category: 'task', deceptive: false };
    } else {
      const index = hash(`${state.seed}:${state.roomIndex}:${state.distractionSequence}:${adaptation}`) % LURES.length;
      message = { ...LURES[index] };
      if (adaptation === 'temptation') message.text += ' Die Anlage wiederholt ein Muster, auf das du schon reagiert hast.';
      if (adaptation === 'precision') message.title = `Vermeintliche Teamnotiz: ${message.title}`;
    }
    state.distractionSequence++; state.metrics.spawned++; state.lastDistractionAt = time;
    const distraction = { id: `maze-${state.seed}-${state.distractionSequence}`, ...message, level, adaptation, time, action: null };
    state.pendingDistraction = distraction; state.distractions.push(distraction);
    if (state.distractions.length > 100) state.distractions.shift();
    this._record('distraction', { id: distraction.id, deceptive: distraction.deceptive, level, adaptation }); this.save();
    return { ok: true, distraction: clone(distraction) };
  }
  respondDistraction(id, action) {
    const state = this.state, pending = state.pendingDistraction;
    if (!this._live() || !pending || pending.id !== id || !['click', 'ignore'].includes(action)) return fail('Diese Unterbrechung ist nicht mehr aktiv.');
    pending.action = action; state.metrics[action === 'click' ? 'clicked' : 'ignored']++;
    let protectedClick = false;
    if (pending.deceptive) {
      state.metrics[action === 'click' ? 'deceptiveClicks' : 'deceptiveIgnored']++;
      if (action === 'click' && state.deceptionShield > 0) { state.deceptionShield--; protectedClick = true; }
      else this._change(action === 'click' ? -8 : 3, action === 'click' ? 9 : -2);
    } else {
      state.metrics[action === 'click' ? 'usefulClicks' : 'usefulIgnored']++;
      if (action === 'click') this._change(pending.category === 'recovery' ? 8 : 3, pending.category === 'recovery' ? -10 : -2);
    }
    state.pendingDistraction = null;
    const feedback = pending.deceptive ? action === 'ignore' ? 'Du hast eine Täuschung erkannt und deine Aufgabe behalten.' : protectedClick ? 'Der Schild hat den Impuls abgefangen. Der Inhalt war trotzdem eine Täuschung.' : 'Die Meldung versprach Fortschritt, lenkte aber von deinem Auftrag ab.' : 'Diese Meldung bezog sich auf deinen echten Auftrag.';
    this._record('distraction-response', { id, action, deceptive: pending.deceptive, protected: protectedClick }); this.save();
    return { ok: true, deceptive: pending.deceptive, protected: protectedClick, feedback, level: this.distractionLevel() };
  }

  finish(route = this.state.exitRoute) {
    const state = this.state;
    if (!this._live() || state.roomIndex !== 5 || !state.roomSolved || route !== state.exitRoute || !['balanced', 'quiet'].includes(route)) return fail('Löse zuerst das Ausgangsterminal und erreiche dann die passende Tür.');
    state.ended = true; state.ending = route; state.finishedAt = this._time(); state.pendingDistraction = null;
    state.score = Math.max(0, Math.round(state.score + state.focus - state.stress + state.metrics.deceptiveIgnored * 5 - state.metrics.mistakes * 10 - state.metrics.hazards * 5));
    this._record('escaped', { route, score: state.score }); this.save();
    return { ok: true, ended: true, ending: route, score: state.score };
  }
  exportData() { return clone({ game: 'MIND MAZE – Escape the Distraction', version: '1.0.0', schemaVersion: 1, state: this.state }); }
}
