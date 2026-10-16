const MAX_VOICES = 32;
const MASTER_VOLUME = 0.4;
const STYLES = {
  menu: { bpm: 72, root: 57, arp: [0, null, 7, null, 12, null, 9, 7, 4, null, 7, null, 9, null, 4, null], chords: [0, 5, 0, 7], instrument: 'dojo-pluck' },
  study: { bpm: 100, root: 60, arp: [0, 4, 7, 12, 9, 7, 4, null, 2, 5, 9, 12, 7, 4, 2, null], chords: [0, 5, 7, 0], instrument: 'pizzicato' },
  gaming: { bpm: 116, root: 60, arp: [7, 12, 7, 4, 9, null, 7, 4, 0, 4, 7, 12, 9, 7, 4, null], chords: [0, 5, 0, 7], instrument: 'marimba' },
  sleep: { bpm: 80, root: 60, arp: [12, null, 7, null, 4, 7, 0, null, 9, null, 7, 4, 2, null, 0, null], chords: [0, 5, 0, 7], instrument: 'music-box' }
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

/** Local, playful music. Constructing this module never opens an AudioContext. */
export function createAudio() {
  let context = null, master = null, music = null, effects = null, noise = null;
  let enabled = false, unlocked = false, disposed = false, unlocking = null;
  let playing = false, mode = 'study', contextMode = 'study', flow = false, nextBeat = null, step = 0;
  let scheduledSteps = 0, eventCount = 0, lastEvent = null, lastError = null, pace = 1, bonusPhase = null;
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
    return STYLES[mode === 'master' ? contextMode : mode] || STYLES.study;
  }

  function pluck(frequency, time, instrument, volume = 0.045) {
    const bell = instrument === 'music-box', wood = instrument === 'marimba', calm = instrument === 'dojo-pluck';
    tone(frequency, calm ? 1.25 : bell ? 0.85 : wood ? 0.24 : 0.2, volume, time, 'music', bell || wood || calm ? 'sine' : 'triangle');
    // A short, quiet overtone supplies the pick, wooden strike or music-box tine.
    tone(frequency * (wood ? 3 : 2.005), calm ? 0.36 : bell ? 0.42 : 0.045, volume * (calm ? 0.08 : bell ? 0.2 : 0.12), time, 'music', 'sine');
  }

  function schedule(time) {
    const style = currentStyle(), beat = step % 8;
    const shift = style.chords[Math.floor(step / 16) % style.chords.length];
    const calm = style.instrument === 'dojo-pluck', quiet = style.instrument === 'music-box' || calm, gaming = style.instrument === 'marimba';
    const melody = style.arp[step % style.arp.length];
    if (melody !== null) pluck(note(style.root + shift + melody), time, style.instrument, calm ? 0.028 : quiet ? 0.033 : 0.054);
    if (beat % 4 === 0) {
      tone(note(style.root - 24 + shift + (beat === 4 ? 7 : 0)), calm ? 1.6 : quiet ? 0.8 : 0.22,
        calm ? 0.018 : quiet ? 0.023 : 0.055, time, 'music', 'sine');
      if (!quiet) tone(105, 0.1, gaming ? 0.07 : 0.03, time, 'music', 'sine', 48);
    }
    if (beat === 0) {
      for (const [index, interval] of [0, 4, 7].entries())
        tone(note(style.root - 12 + shift + interval), calm ? 2.3 : quiet ? 1.1 : 0.38, calm ? 0.007 : quiet ? 0.01 : 0.018,
          time + index * 0.015, 'music', quiet ? 'sine' : 'triangle');
    }
    if (!quiet && beat % 4 === 2) hiss(time, 0.055, gaming ? 0.028 : 0.012, 1800);
    if (!quiet && (gaming && beat % 2 === 1 || flow)) hiss(time, 0.025, flow ? 0.018 : 0.01, 6000);
    if (flow && !quiet && beat % 2 === 1)
      tone(note(style.root + 12 + shift + (beat % 4 === 1 ? 7 : 12)), 0.11, 0.018, time, 'music', 'sine');
    step++; scheduledSteps++;
  }

  function update(state = {}, dt = 0) {
    if (!context || !enabled || !unlocked || disposed) return;
    const scene = state.scene ?? state.phase ?? (state.started && !state.ended ? 'playing' : 'home');
    const isMenu = state.isMenu === true || ['menu', 'home', 'landing', 'onboarding'].includes(scene);
    const active = state.paused !== true && (isMenu || scene === 'playing' && state.ended !== true) && globalThis.document?.hidden !== true;
    if (!active || context.state !== 'running') { if (playing || nextBeat !== null) quietMusic(); return; }
    const selected = isMenu ? 'menu' : styleFor(state), selectedContext = ['study', 'gaming', 'sleep'].includes(state.context) ? state.context : 'study';
    if (mode !== selected) { quietMusic(); mode = selected; step = 0; }
    if (contextMode !== selectedContext) { if (mode === 'master') { quietMusic(); step = 0; } contextMode = selectedContext; }
    flow = !isMenu && Number(state.effects?.flow ?? state.flow ?? 0) > 0;
    if (!playing) { playing = true; ramp(music.gain, isMenu ? 0.48 : mode === 'sleep' || mode === 'master' && contextMode === 'sleep' ? 0.58 : 0.92, isMenu ? 0.35 : 0.12); }
    const now = context.currentTime;
    for (const entry of [...voices]) if (entry.end + 0.1 < now) release(entry, true);
    if (nextBeat === null || nextBeat < now - 0.15 || Number(dt) > 1) nextBeat = now + 0.035;
    // A gentle musical lift follows the rising pace without turning the calm rooms into a rush.
    pace = isMenu ? 1 : 1 + Math.min(0.18, Math.max(0, Number(state.speedFactor || 1) - 1) * 0.25);
    bonusPhase = isMenu ? null : typeof state.bonusPhase === 'string' ? state.bonusPhase : state.bonusPhase?.id || null;
    const interval = 60 / currentStyle().bpm / pace / 2;
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
    } else if (name === 'boss-hit') {
      // A wooden impact and a quiet upward chime give correct choices a physical reply.
      tone(170, 0.075, 0.055, time, 'effects', 'sine', 95);
      tone(660, 0.13, 0.024, time + 0.025, 'effects', 'triangle', 820);
    } else if (name === 'boss-cue' || name === 'boss-telegraph') {
      // Two spaced bamboo knocks announce the wave before it arrives.
      tone(240, 0.11, 0.045, time, 'effects', 'sine', 150);
      tone(300, 0.13, 0.045, time + 0.2, 'effects', 'sine', 190);
    } else if (name === 'boss-wave') {
      hiss(time, 0.12, 0.025, 1400, 'effects');
      tone(165, 0.18, 0.045, time, 'effects', 'sine', 82);
    } else if (name === 'boss-phase') {
      sparkle([330, 440, 494, 659], 0.095, 0.034);
      tone(110, 0.32, 0.035, time, 'effects', 'sine', 165);
    } else if (name === 'boss-defeated') {
      sparkle([392, 494, 587, 784, 988, 1175], 0.09, 0.044);
      tone(196, 0.5, 0.03, time, 'effects', 'sine', 392);
    } else if (name === 'useful-mistake') {
      tone(150, 0.26, 0.11, time, 'effects', 'triangle', 62);
      tone(92, 0.22, 0.055, time + 0.025, 'effects', 'sine');
    } else if (name === 'useful-passed') sparkle([659, 784], 0.07, 0.035);
    else if (name === 'powerup' || ['shield', 'slow', 'multiplier', 'bonus'].includes(name)) sparkle([523, 659, 784, 1046], 0.055);
    else if (name === 'combo') {
      const lift = Math.min(4, Math.floor(Number(event?.combo || event?.count || 5) / 5));
      sparkle([523, 659, 784].map(hz => hz * 2 ** (lift / 12)), 0.038, 0.055);
    }
    else if (name === 'combo-milestone') {
      const milestone = Number(event?.milestone);
      if (milestone === 10) sparkle([440, 554, 659, 880], 0.065, 0.044);
      else if (milestone === 25) {
        sparkle([440, 554, 659, 880, 1109], 0.065, 0.047);
        tone(220, 0.32, 0.035, time, 'effects', 'sine', 440);
      } else if (milestone === 50) {
        sparkle([440, 554, 659, 880, 1109, 1319, 1760], 0.065, 0.049);
        tone(220, 0.46, 0.035, time, 'effects', 'sine', 440);
        tone(659, 0.38, 0.022, time + 0.39, 'effects', 'sine');
      } else return false;
    }
    else if (name === 'coin-earned') {
      sparkle([1046, 1568, 2093], 0.035, 0.038);
    } else if (name === 'super-used') {
      const id = event?.id || event?.skillId;
      if (id === 'slow-super') {
        tone(880, 0.65, 0.055, time, 'effects', 'sine', 220);
        sparkle([784, 659, 523], 0.13, 0.025);
      } else if (id === 'shield-super') sparkle([392, 523, 659, 784, 1046], 0.045, 0.05);
      else {
        hiss(time, 0.24, 0.06, 1200, 'effects');
        tone(220, 0.35, 0.05, time, 'effects', 'triangle', 1046);
        sparkle([523, 659, 784, 1046], 0.045, 0.045);
      }
    } else if (name === 'achievement-unlocked') sparkle([523, 659, 784, 1046, 1318, 1568], 0.075, 0.06);
    else if (name === 'skill-unlocked') sparkle([392, 523, 659, 784, 1046], 0.065, 0.052);
    else if (name === 'bonus-phase-start') sparkle([659, 784, 1046, 784, 1318], 0.055, 0.05);
    else if (name === 'bonus-phase-end') sparkle([784, 659, 523], 0.075, 0.035);
    else if (name === 'second-chance') sparkle([330, 440, 523, 659, 880], 0.07, 0.05);
    else if (name === 'flow-started') sparkle([440, 554, 659, 880, 1046], 0.055);
    else if (name === 'level-complete' || name === 'victory') sparkle([523, 659, 784, 1046, 1318, 1568], 0.09, 0.06);
    else if (name === 'ended') sparkle([392, 494, 587, 784], 0.085, 0.045);
    else if (name === 'click') tone(680, 0.04, 0.043, time, 'effects', 'sine', 880);
    else if (name === 'start' || name === 'play') sparkle([392, 523, 659, 784], 0.065, 0.055);
    else return false;
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
      mode, context: contextMode, bpm: currentStyle().bpm, instrument: currentStyle().instrument,
      playing, flow, pace, effectiveBpm: Math.round(currentStyle().bpm * pace), bonusPhase, scheduledSteps, eventCount, lastEvent, volume: enabled ? MASTER_VOLUME : 0, lastError };
  }

  return Object.freeze({ unlock, setEnabled, update, play, dispose, getStats });
}
