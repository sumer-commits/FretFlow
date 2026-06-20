/* ─── AUDIO ENGINE ───────────────────────────────────────────────────────── */
let AudioCtx = null;

// Tracks setTimeout ids for any in-flight note sequence (hearScale, hearCOFScale,
// arpeggiate) so re-triggering cancels the previous run instead of overlapping it.
let pendingNoteTimeouts = [];
function scheduleNoteSequence(items, fn) {
  pendingNoteTimeouts.forEach(clearTimeout);
  pendingNoteTimeouts = items.map((item, i) =>
    setTimeout(() => fn(item, i), item.delay)
  );
}
function getAC() {
  if (!AudioCtx) AudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (AudioCtx.state === 'suspended') AudioCtx.resume().catch(() => {});
  return AudioCtx;
}

// ─── Master limiter (shared) — prevents clipping when chords are strummed ──
let _masterBus = null;
function getMasterBus() {
  if (_masterBus) return _masterBus;
  const ac = getAC();
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -10;   // clamp peaks above -10 dB
  comp.knee.value      = 8;
  comp.ratio.value     = 12;
  comp.attack.value    = 0.003;
  comp.release.value   = 0.15;
  const trim = ac.createGain();
  trim.gain.value = 0.85;
  comp.connect(trim);
  trim.connect(ac.destination);
  _masterBus = comp;
  return _masterBus;
}

// ─── Plucked-string synthesis (additive — predictable, stable) ────────────
// Real guitar strings vibrate at a fundamental + integer harmonics. Each
// harmonic has its own amplitude and decays at its own rate (high harmonics
// die fast, fundamental persists). Layering sine oscillators at integer
// ratios with per-harmonic decay envelopes produces a clean plucked-string
// sound with none of the stability headaches of feedback synthesis.
function playNote(midi, duration = 4.5, velocity = 0.5) {
  const ctx  = getAC();
  const freq = 440 * Math.pow(2, (midi - 69) / 12);
  const now  = ctx.currentTime;
  const bus  = getMasterBus();

  // Master envelope: fast attack, sustained body, then long tail.
  // Two-stage decay keeps the note loud for the first half before fading.
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(velocity * 0.32, now + 0.004);
  master.gain.setTargetAtTime(velocity * 0.20, now + 0.004, 0.9);   // gentle initial drop
  master.gain.exponentialRampToValueAtTime(0.0003, now + duration); // long tail

  // Brightness filter — barely moves. Real strings stay bright the whole ring.
  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.setValueAtTime(Math.min(14000, freq * 16), now);
  tone.frequency.exponentialRampToValueAtTime(Math.max(3500, freq * 9), now + duration);
  tone.Q.value = 0.2;

  // Light body resonance — warmth without dulling
  const body = ctx.createBiquadFilter();
  body.type = 'peaking';
  body.frequency.value = 320;
  body.Q.value = 1.2;
  body.gain.value = 1.5;

  tone.connect(body);
  body.connect(master);
  master.connect(bus);

  // Harmonic spectrum — louder, longer-ringing upper harmonics for sparkle.
  const harmonics = [
    { ratio: 1, amp: 1.0,  decay: 1.00 },  // fundamental
    { ratio: 2, amp: 0.85, decay: 0.97 },  // octave
    { ratio: 3, amp: 0.65, decay: 0.92 },  // 5th + octave
    { ratio: 4, amp: 0.50, decay: 0.86 },  // 2 octaves
    { ratio: 5, amp: 0.35, decay: 0.78 },  // 3rd + 2 oct
    { ratio: 6, amp: 0.25, decay: 0.70 },  // 5th + 2 oct
    { ratio: 7, amp: 0.18, decay: 0.60 },
    { ratio: 8, amp: 0.13, decay: 0.52 },  // 3 octaves
    { ratio: 9, amp: 0.09, decay: 0.45 },
    { ratio:10, amp: 0.06, decay: 0.38 },
  ];

  const oscNodes = [];
  harmonics.forEach(h => {
    if (freq * h.ratio > 13000) return; // avoid aliasing

    const osc = ctx.createOscillator();
    osc.frequency.value = freq * h.ratio;
    osc.type = 'sine';

    const g = ctx.createGain();
    g.gain.setValueAtTime(h.amp, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration * h.decay);

    osc.connect(g);
    g.connect(tone);
    osc.start(now);
    osc.stop(now + duration * h.decay + 0.05);
    oscNodes.push(osc);
  });

  // Pick attack — light click so it's heard, not dominant
  const sr       = ctx.sampleRate;
  const clickLen = Math.min(300, Math.floor(sr * 0.006));
  const clickBuf = ctx.createBuffer(1, clickLen, sr);
  const clickD   = clickBuf.getChannelData(0);
  for (let i = 0; i < clickLen; i++) {
    clickD[i] = (Math.random() * 2 - 1) * Math.exp(-i / (clickLen * 0.22)) * 0.5;
  }
  const click = ctx.createBufferSource();
  click.buffer = clickBuf;

  const clickFilter = ctx.createBiquadFilter();
  clickFilter.type = 'bandpass';
  clickFilter.frequency.value = Math.min(5000, freq * 4);
  clickFilter.Q.value = 1.0;

  const clickGain = ctx.createGain();
  clickGain.gain.value = 0.12;

  click.connect(clickFilter);
  clickFilter.connect(clickGain);
  clickGain.connect(master);
  click.start(now);

  setTimeout(() => {
    try {
      oscNodes.forEach(o => o.disconnect());
      master.disconnect(); tone.disconnect(); body.disconnect();
      clickGain.disconnect(); clickFilter.disconnect();
    } catch(e) {}
  }, duration * 1000 + 200);
}

function midiToFreq(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }

