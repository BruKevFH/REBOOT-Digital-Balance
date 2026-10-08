const MAX_VOICES = 32;
const MASTER_VOLUME = 0.36;
const STYLES = {
  study: { bpm: 96, root: 50, arp: [0, 4, 7, 9, 7, 4, 2, 7], chords: [0, 5, 9, 7], bright: false },
  gaming: { bpm: 132, root: 45, arp: [0, 3, 7, 10, 7, 3, 5, 7], chords: [0, 5, 3, 7], bright: true },
  sleep: { bpm: 74, root: 48, arp: [0, 4, 7, 9, 7, 4, 2, 4], chords: [0, 5, 7, 0], bright: false },
  master: { bpm: 122, root: 47, arp: [0, 3, 7, 10, 7, 5, 3, 7], chords: [0, 5, 3, 7], bright: true }
};
const note = midi => 440 * 2 ** ((midi - 69) / 12);

function styleFor(state) {
  const value = state?.levelId ?? state?.level?.id ?? state?.level?.name ?? state?.levelName;
  const text = String(value ?? '').toLowerCase();
  if (/gaming|game|spiel/.test(text)) return 'gaming';
  if (/sleep|schlaf|nacht/.test(text)) return 'sleep';
  if (/master|meister|mixed|mix/.test(text)) return 'master';
  const index = state?.levelIndex ?? (typeof state?.level === 'number' ? state.level : 0);
  return ['study', 'gaming', 'sleep', 'master'][index] || 'study';
}

/** Optional procedural audio. Constructing this module never opens an AudioContext. */
export function createAudio() {
  let context = null, master = null, music = null, effects = null, noise = null;
  let enabled = false, unlocked = false, disposed = false, unlocking = null;
  let playing = false, mode = 'study', contextMode = 'study', flow = false, nextBeat = null, step = 0;
  let scheduledSteps = 0, eventCount = 0, lastEvent = null, lastError = null;
  const voices = new Set();

  function ramp(param, value, seconds = 0.025) {
    if (!context || !param) return;
    const time = context.currentTime;
    param.cancelScheduledValues(time);
    param.setValueAtTime(param.value, time);
    param.linearRampToValueAtTime(value, time + seconds);
  }

  function release(voice, stop = false) {
    if (!voices.delete(voice)) return;
    voice.source.onended = null;
    if (stop) {
      try { voice.source.stop(); } catch { /* An already ended source is harmless. */ }
    }
    for (const node of voice.nodes) {
      try { node.disconnect(); } catch { /* Disposal may follow an ended callback. */ }
    }
  }

  function stopVoices(group) {
    for (const voice of [...voices]) if (!group || voice.group === group) release(voice, true);
  }

  function voice(source, gain, nodes, time, duration, volume, group) {
    while (voices.size >= MAX_VOICES) release(voices.values().next().value, true);
    const end = time + Math.max(0.025, duration);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), time + Math.min(0.012, duration / 4));
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    const entry = { source, nodes, end, group };
    voices.add(entry);
    source.onended = () => release(entry);
    try { source.start(time); source.stop(end + 0.01); }
    catch { release(entry, true); return false; }
    return true;
  }

  function tone(frequency, duration, volume, time, group = 'effects', type = 'triangle', endFrequency) {
    if (!context || !enabled || !unlocked || disposed) return false;
    const source = context.createOscillator(), gain = context.createGain();
    source.type = type;
    source.frequency.setValueAtTime(frequency, time);
    if (endFrequency) source.frequency.exponentialRampToValueAtTime(endFrequency, time + duration);
    source.connect(gain); gain.connect(group === 'music' ? music : effects);
    return voice(source, gain, [source, gain], time, duration, volume, group);
  }

  function hiss(time, duration, volume, cutoff, group = 'music') {
    if (!context || !enabled || !unlocked || !noise) return false;
    const source = context.createBufferSource(), filter = context.createBiquadFilter(), gain = context.createGain();
    source.buffer = noise; filter.type = 'highpass'; filter.frequency.setValueAtTime(cutoff, time);
    source.connect(filter); filter.connect(gain); gain.connect(group === 'music' ? music : effects);
    return voice(source, gain, [source, filter, gain], time, duration, volume, group);
  }

  function quietMusic() {
    playing = false; nextBeat = null;
    ramp(music?.gain, 0, 0.012);
    stopVoices('music');
  }

  async function unlock() {
    if (disposed) return false;
    if (unlocking) return unlocking;
    unlocking = (async () => {
      try {
        if (!context) {
          const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
          if (!AudioContextClass) throw new Error('WebAudio wird in diesem Browser nicht unterstützt.');
          context = new AudioContextClass();
          master = context.createGain(); music = context.createGain(); effects = context.createGain();
          master.gain.value = enabled ? MASTER_VOLUME : 0;
          music.gain.value = 0; effects.gain.value = 1;
          music.connect(master); effects.connect(master); master.connect(context.destination);
          noise = context.createBuffer(1, Math.ceil(context.sampleRate * 0.3), context.sampleRate);
          const samples = noise.getChannelData(0);
          for (let i = 0; i < samples.length; i++) samples[i] = (Math.random() * 2 - 1) * (1 - i / samples.length);
        }
        if (context.state !== 'running') await context.resume();
        if (disposed) return false;
        unlocked = context.state === 'running';
        if (!unlocked) throw new Error('Audio konnte nicht freigegeben werden.');
        lastError = null;
        return true;
      } catch (error) {
        enabled = false; unlocked = false; quietMusic(); stopVoices();
        ramp(master?.gain, 0);
        lastError = String(error?.message || error);
        return false;
      }
    })();
    try { return await unlocking; } finally { unlocking = null; }
  }

  function setEnabled(value) {
    if (disposed) return false;
    enabled = value === true;
    if (!enabled) { quietMusic(); stopVoices(); }
    ramp(master?.gain, enabled ? MASTER_VOLUME : 0);
    return enabled;
  }

  function currentStyle() {
    if (mode !== 'master') return STYLES[mode];
    if (contextMode === 'sleep') return { ...STYLES.sleep, bpm: 84 };
    if (contextMode === 'study') return { ...STYLES.master, bpm: 108, bright: false };
    return STYLES.master;
  }

  function schedule(time) {
    const style = currentStyle(), beat = step % 8;
    const shift = style.chords[Math.floor(step / 8) % style.chords.length];
    const pitch = flow ? 12 : 0;
    const quiet = mode === 'sleep' || mode === 'master' && contextMode === 'sleep';
    tone(note(style.root + 12 + shift + style.arp[beat] + pitch), quiet ? 0.34 : 0.19,
      quiet ? 0.018 : 0.025, time, 'music', 'triangle');
    if (beat % 4 === 0) {
      tone(note(style.root - 12 + shift), 0.4, quiet ? 0.025 : 0.047, time, 'music', 'sine');
      if (!quiet) tone(120, 0.12, 0.09, time, 'music', 'sine', 42);
    }
    if (beat === 0) {
      for (const interval of [0, mode === 'gaming' || mode === 'master' ? 3 : 4, 7])
        tone(note(style.root + shift + interval), 1.45, quiet ? 0.012 : 0.009, time, 'music', 'sine');
    }
    if (!quiet && beat % 4 === 2) hiss(time, 0.08, style.bright ? 0.033 : 0.015, 1600);
    if ((style.bright || flow) && (beat % 2 === 0 || flow)) hiss(time, 0.035, flow ? 0.028 : 0.018, 6500);
    step++; scheduledSteps++;
  }

  function update(state = {}, dt = 0) {
    if (!context || !enabled || !unlocked || disposed) return;
    const scene = state.scene ?? state.phase ?? (state.started && !state.ended ? 'playing' : 'home');
    const active = scene === 'playing' && state.paused !== true && state.ended !== true;
    if (!active || context.state !== 'running') { if (playing || nextBeat !== null) quietMusic(); return; }
    const selected = styleFor(state), selectedContext = ['study', 'gaming', 'sleep'].includes(state.context) ? state.context : 'study';
    if (mode !== selected) { quietMusic(); mode = selected; step = 0; }
    if (contextMode !== selectedContext) { if (mode === 'master') quietMusic(); contextMode = selectedContext; }
    flow = Number(state.effects?.flow ?? state.flow ?? 0) > 0;
    if (!playing) { playing = true; ramp(music.gain, mode === 'sleep' || mode === 'master' && contextMode === 'sleep' ? 0.58 : 0.92, 0.12); }
    const now = context.currentTime;
    for (const entry of [...voices]) if (entry.end + 0.1 < now) release(entry, true);
    if (nextBeat === null || nextBeat < now - 0.15 || Number(dt) > 1) nextBeat = now + 0.035;
    const interval = 60 / currentStyle().bpm / 2;
    let count = 0;
    while (nextBeat < now + 0.12 && count++ < 8) { schedule(nextBeat); nextBeat += interval; }
  }

  function play(event) {
    if (!context || !enabled || !unlocked || disposed || context.state !== 'running') return false;
    const name = typeof event === 'string' ? event : event?.type;
    const time = context.currentTime + 0.004;
    const sparkle = (notes, gap = 0.045, volume = 0.052) => notes.forEach((hz, index) => tone(hz, 0.18, volume, time + gap * index));
    if (name === 'sliced') {
      tone((1120 + eventCount % 5 * 65) * (flow ? 1.15 : 1), 0.047, 0.1, time, 'effects', 'triangle', 720);
      hiss(time, 0.025, 0.03, 4500, 'effects');
    } else if (name === 'useful-mistake') {
      tone(150, 0.26, 0.11, time, 'effects', 'triangle', 62);
      tone(92, 0.22, 0.055, time + 0.025, 'effects', 'sine');
    } else if (name === 'useful-passed') sparkle([659, 784], 0.07, 0.035);
    else if (name === 'powerup' || ['shield', 'slow', 'multiplier'].includes(name)) sparkle([659, 830, 988]);
    else if (name === 'flow-started') sparkle([440, 554, 659, 880, 1046], 0.055);
    else if (name === 'level-complete') sparkle([523, 659, 784, 1046, 1318, 1568], 0.09, 0.06);
    else if (name === 'ended') sparkle([392, 494, 587, 784], 0.085, 0.045);
    else if (name === 'click') tone(680, 0.04, 0.043, time, 'effects', 'sine', 880);
    else if (name === 'start') {
      tone(170, 0.28, 0.09, time, 'effects', 'sine', 1000);
      hiss(time, 0.15, 0.04, 2200, 'effects');
    } else return false;
    lastEvent = name; eventCount++;
    return true;
  }

  function dispose() {
    if (disposed) return;
    disposed = true; enabled = false; unlocked = false; playing = false; nextBeat = null;
    stopVoices();
    for (const node of [music, effects, master]) { try { node?.disconnect(); } catch { /* Idempotent shutdown. */ } }
    if (context) { try { Promise.resolve(context.close()).catch(() => {}); } catch { /* Closed contexts need no action. */ } }
    noise = null;
  }

  function getStats() {
    return { enabled, unlocked, contextState: context?.state || 'locked', activeVoices: voices.size,
      musicVoices: [...voices].filter(entry => entry.group === 'music').length,
      mode, context: contextMode, playing, flow, scheduledSteps, eventCount, lastEvent, volume: enabled ? MASTER_VOLUME : 0, lastError };
  }

  return Object.freeze({ unlock, setEnabled, update, play, dispose, getStats });
}
