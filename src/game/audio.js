// Lightweight procedural audio (no external assets).
// Uses WebAudio and unlocks on first user gesture.

export function createAudio(scene) {
  const AudioCtx = globalThis.AudioContext || globalThis.webkitAudioContext;

  const state = {
    ctx: null,
    master: null,
    enabled: true,
    unlocked: false,
    engine: {
      osc: null,
      gain: null,
      filter: null,
      lfo: null,
      lfoGain: null,
      playing: false
    },
    nextFlakAt: 0
  };

  function ensure() {
    if (!state.enabled) return false;
    if (!AudioCtx) return false;
    if (!state.ctx) {
      state.ctx = new AudioCtx();
      state.master = state.ctx.createGain();
      state.master.gain.value = 0.22;
      state.master.connect(state.ctx.destination);
    }
    return true;
  }

  async function unlock() {
    if (!ensure()) return;
    if (state.unlocked) return;
    try {
      if (state.ctx.state !== 'running') await state.ctx.resume();
      state.unlocked = state.ctx.state === 'running';
    } catch {
      // ignore
    }
  }

  function now() {
    return state.ctx?.currentTime ?? 0;
  }

  function envPerc(gainNode, t0, a = 0.001, d = 0.08, peak = 1, sustain = 0) {
    gainNode.gain.cancelScheduledValues(t0);
    gainNode.gain.setValueAtTime(0.0001, t0);
    gainNode.gain.linearRampToValueAtTime(peak, t0 + a);
    gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, sustain), t0 + a + d);
  }

  function beep({ type = 'square', freq = 440, dur = 0.08, vol = 0.35, slideTo = null, filterHz = null }) {
    if (!ensure() || !state.unlocked) return;

    const t0 = now();
    const osc = state.ctx.createOscillator();
    const gain = state.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo != null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
    }

    let last = osc;
    if (filterHz != null) {
      const f = state.ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.setValueAtTime(filterHz, t0);
      last.connect(f);
      last = f;
    }

    last.connect(gain);
    gain.connect(state.master);

    envPerc(gain, t0, 0.002, dur, vol, 0.0001);

    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function noisePop({ dur = 0.12, vol = 0.22, filterHz = 1200 }) {
    if (!ensure() || !state.unlocked) return;

    const t0 = now();
    const bufferSize = Math.floor(state.ctx.sampleRate * dur);
    const buffer = state.ctx.createBuffer(1, bufferSize, state.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      // quick decaying noise
      const k = 1 - i / bufferSize;
      data[i] = (Math.random() * 2 - 1) * k;
    }

    const src = state.ctx.createBufferSource();
    src.buffer = buffer;

    const f = state.ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.setValueAtTime(filterHz, t0);
    f.Q.setValueAtTime(0.9, t0);

    const gain = state.ctx.createGain();

    src.connect(f);
    f.connect(gain);
    gain.connect(state.master);

    envPerc(gain, t0, 0.001, dur, vol, 0.0001);

    src.start(t0);
    src.stop(t0 + dur + 0.03);
  }

  function startEngine() {
    if (!ensure() || !state.unlocked) return;
    if (state.engine.playing) return;

    const t0 = now();
    const osc = state.ctx.createOscillator();
    const gain = state.ctx.createGain();
    const filter = state.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(85, t0);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(520, t0);
    filter.Q.setValueAtTime(0.7, t0);

    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(0.08, t0 + 0.12);

    // subtle LFO wobble
    const lfo = state.ctx.createOscillator();
    const lfoGain = state.ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(6, t0);
    lfoGain.gain.setValueAtTime(10, t0);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(state.master);

    osc.start(t0);
    lfo.start(t0);

    state.engine = { osc, gain, filter, lfo, lfoGain, playing: true };
  }

  function stopEngine() {
    const e = state.engine;
    if (!e.playing) return;

    const t0 = now();
    try {
      e.gain.gain.cancelScheduledValues(t0);
      e.gain.gain.setValueAtTime(e.gain.gain.value, t0);
      e.gain.gain.linearRampToValueAtTime(0.0001, t0 + 0.12);
      e.osc.stop(t0 + 0.14);
      e.lfo.stop(t0 + 0.14);
    } catch {
      // ignore
    }
    state.engine.playing = false;
  }

  function updateEngine({ vy = 0, landing = false, hpPct = 1 }) {
    if (!state.unlocked) return;
    startEngine();

    const e = state.engine;
    if (!e.playing) return;

    const t0 = now();
    const wobble = landing ? 0.65 : 1;
    const dmg = hpPct < 0.35 ? 0.85 : 1;
    const base = 85;
    const add = Math.min(40, Math.abs(vy) * 0.05);
    const freq = (base + add) * wobble * dmg;

    e.osc.frequency.setTargetAtTime(freq, t0, 0.03);
    e.filter.frequency.setTargetAtTime(520 + add * 9, t0, 0.05);

    // Slightly quieter when landing.
    const targetGain = landing ? 0.055 : 0.08;
    e.gain.gain.setTargetAtTime(targetGain, t0, 0.05);
  }

  function playGun() {
    beep({ type: 'square', freq: 520, slideTo: 240, dur: 0.05, vol: 0.16, filterHz: 1800 });
  }

  function playBombDrop() {
    beep({ type: 'triangle', freq: 220, slideTo: 140, dur: 0.09, vol: 0.12, filterHz: 1200 });
  }

  function playExplosion(big = false) {
    noisePop({ dur: big ? 0.22 : 0.14, vol: big ? 0.26 : 0.20, filterHz: big ? 520 : 820 });
    beep({ type: 'sine', freq: big ? 90 : 140, slideTo: 60, dur: big ? 0.18 : 0.12, vol: big ? 0.12 : 0.08, filterHz: 520 });
  }

  function playFlak() {
    const ms = scene.time.now;
    if (ms < state.nextFlakAt) return;
    state.nextFlakAt = ms + 90;
    noisePop({ dur: 0.06, vol: 0.10, filterHz: 1600 });
  }

  // Unlock on first user action.
  const unlockHandler = () => unlock();
  scene.input.on('pointerdown', unlockHandler);
  scene.input.keyboard?.on('keydown', unlockHandler);

  scene.events.once('shutdown', () => {
    scene.input.off('pointerdown', unlockHandler);
    scene.input.keyboard?.off('keydown', unlockHandler);
    stopEngine();
  });

  return {
    unlock,
    updateEngine,
    stopEngine,
    playGun,
    playBombDrop,
    playExplosion,
    playFlak
  };
}
