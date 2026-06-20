/* ═══════════════════════════════════════════════════════════════════════════
   CHROMATIC TUNER
   Architecture: slow detection loop (80ms) feeds smoothedFreq/smoothedCents.
   rAF loop reads those values, applies a second EMA for the needle angle,
   then draws the canvas. Text DOM updates are throttled separately.
══════════════════════════════════════════════════════════════════════════════ */
const ALT_TUNINGS = [
  { n:'Standard',  s:[40,45,50,55,59,64] },
  { n:'Drop D',    s:[38,45,50,55,59,64] },
  { n:'Eb',        s:[37,44,49,54,58,63] },
  { n:'D Std',     s:[36,43,48,53,57,62] },
  { n:'Open G',    s:[38,43,50,55,59,62] },
  { n:'Open D',    s:[38,45,50,54,57,62] },
  { n:'DADGAD',    s:[38,45,50,55,57,62] },
  { n:'Open E',    s:[40,47,52,56,59,64] },
];
const STRING_NAMES  = ['6','5','4','3','2','1'];
const STRING_NOTES  = ['E2','A2','D3','G3','B3','E4'];

let tunerStream      = null;
let tunerAnalyser    = null;
let tunerBuf         = null;
let tunerInterval    = null;
let tunerRaf         = null;
let tunerInit        = false;
let tunerSelString   = -1;   // -1 = chromatic
let curAltTuning     = 0;    // index into ALT_TUNINGS
let needleSmoothed   = 0;    // rAF-level needle smoothing (separate from smoothedCents)
let lastNoteDisplay  = '';
let lastCentsDisplay = 999;

// ─── Pitch detection (runs on slow interval) ─────────────────────────────
function autoCorrelate(buf, sr) {
  // RMS gate — skip if signal too quiet
  let rms = 0;
  const N = buf.length;
  for (let i = 0; i < N; i++) rms += buf[i] * buf[i];
  if (Math.sqrt(rms / N) < 0.008) return -1;

  // Search lag range covering guitar/bass (55 Hz – 1400 Hz)
  const minLag = Math.floor(sr / 1400);
  const maxLag = Math.min(Math.ceil(sr / 55), (N >> 1) - 1);

  // Compute autocorrelation and find best lag
  let bestLag = minLag, bestCorr = -Infinity;
  const corrs = new Float32Array(maxLag + 2);

  for (let lag = minLag; lag <= maxLag + 1; lag++) {
    let c = 0;
    const len = N - lag;
    for (let i = 0; i < len; i++) c += buf[i] * buf[i + lag];
    corrs[lag] = c / len;
    if (lag <= maxLag && c / len > bestCorr) { bestCorr = c / len; bestLag = lag; }
  }

  if (bestCorr < 0.01) return -1;

  // Parabolic interpolation for sub-sample accuracy
  if (bestLag > minLag && bestLag < maxLag) {
    const c1 = corrs[bestLag - 1], c2 = corrs[bestLag], c3 = corrs[bestLag + 1];
    const d = 2 * (2 * c2 - c1 - c3);
    if (Math.abs(d) > 1e-10) bestLag += (c3 - c1) / d;
  }

  return sr / bestLag;
}

function freqToNote(freq) {
  // Returns { name, octave, midi, targetFreq, cents }
  const midi      = 12 * Math.log2(freq / 440) + 69;
  const midiRound = Math.round(midi);
  const name      = NOTES[((midiRound % 12) + 12) % 12];
  const octave    = Math.floor((midiRound - 12) / 12);
  const targetFreq = 440 * Math.pow(2, (midiRound - 69) / 12);
  const cents      = 1200 * Math.log2(freq / targetFreq);
  return { name, octave, midi: midiRound, targetFreq, cents };
}

function tunerDetect() {
  if (!tunerAnalyser || !tunerBuf) return;
  tunerAnalyser.getFloatTimeDomainData(tunerBuf);
  const sr   = getAC().sampleRate;
  const freq = autoCorrelate(tunerBuf, sr);

  if (freq > 0 && freq < 4200) {
    // EMA smoothing on frequency: 85% old, 15% new
    smoothedFreq = smoothedFreq ? smoothedFreq * 0.85 + freq * 0.15 : freq;

    let cents;
    if (tunerSelString >= 0) {
      // String-locked mode: compare against selected open string
      const targetMidi = OPEN_STRINGS[tunerSelString];
      const targetFreq = midiToFreq(targetMidi);
      cents = 1200 * Math.log2(smoothedFreq / targetFreq);
    } else {
      // Chromatic: find closest note
      const info = freqToNote(smoothedFreq);
      cents = info.cents;
    }
    // EMA smoothing on cents
    smoothedCents = smoothedCents * 0.85 + cents * 0.15;
  } else {
    // Signal lost — decay smoothed values toward 0 slowly
    if (smoothedFreq) {
      smoothedFreq  *= 0.92;
      smoothedCents *= 0.88;
      if (smoothedFreq < 20) { smoothedFreq = null; smoothedCents = 0; }
    }
  }
}

// ─── Canvas meter ────────────────────────────────────────────────────────
function drawTunerMeter() {
  const canvas = document.getElementById('tuner-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 300, H = 160;
  const CX = 150, CY = 150; // pivot at bottom-center
  const R  = 118;

  // Arc: 153° centered pointing up
  const span  = 153 * Math.PI / 180;
  const sA    = -Math.PI / 2 - span / 2;
  const eA    = -Math.PI / 2 + span / 2;
  const c2a   = c => sA + (c + 50) / 100 * span; // cents → angle

  ctx.clearRect(0, 0, W, H);

  // Background arc track
  ctx.beginPath(); ctx.arc(CX, CY, R, sA, eA);
  ctx.lineWidth = 16; ctx.strokeStyle = '#160c04'; ctx.stroke();

  // Zone arcs (drawn as coloured segments)
  const zones = [
    [-50,-15,'#b54e1a',0.45], [-15,-5,'#c27c2a',0.55],
    [ -5,  5,'#3d9a3d',0.70], [  5, 15,'#c27c2a',0.55],
    [ 15, 50,'#b54e1a',0.45],
  ];
  zones.forEach(([from, to, col, alpha]) => {
    ctx.beginPath(); ctx.arc(CX, CY, R, c2a(from), c2a(to));
    ctx.lineWidth = 16; ctx.globalAlpha = alpha;
    ctx.strokeStyle = col; ctx.stroke();
  });
  ctx.globalAlpha = 1;

  // Tick marks
  [-50,-25,0,25,50].forEach(c => {
    const a = c2a(c), isCentre = c === 0;
    ctx.beginPath();
    ctx.moveTo(CX + Math.cos(a)*(R - 10), CY + Math.sin(a)*(R - 10));
    ctx.lineTo(CX + Math.cos(a)*(R + (isCentre ? 6 : 3)), CY + Math.sin(a)*(R + (isCentre ? 6 : 3)));
    ctx.lineWidth = isCentre ? 2 : 1;
    ctx.strokeStyle = isCentre ? 'rgba(212,164,67,0.8)' : 'rgba(100,70,40,0.6)';
    ctx.stroke();
  });

  // Arc labels
  ctx.font = '9px JetBrains Mono, monospace';
  ctx.fillStyle = '#6a4a30'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  [[-50,sA],[0,c2a(0)],[50,eA]].forEach(([label, a]) => {
    const lx = CX + Math.cos(a)*(R + 18), ly = CY + Math.sin(a)*(R + 18);
    ctx.fillText(label < 0 ? '−50' : label > 0 ? '+50' : '0', lx, ly);
  });

  // "IN TUNE" banner
  const inTune = Math.abs(needleSmoothed) <= 5 && smoothedFreq;
  if (inTune) {
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillStyle = '#3d9a3d';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('IN TUNE', CX, CY - R * 0.55);
  }

  // Needle
  const clampedCents = Math.max(-50, Math.min(50, needleSmoothed));
  const needleA = c2a(clampedCents);
  const close   = Math.abs(needleSmoothed) < 15;
  const needleColor = inTune ? '#4daf4d' : close ? '#d4a443' : '#c0603a';

  ctx.beginPath();
  ctx.moveTo(CX, CY);
  ctx.lineTo(CX + Math.cos(needleA) * (R - 4), CY + Math.sin(needleA) * (R - 4));
  ctx.lineWidth  = 2.5; ctx.strokeStyle = needleColor;
  ctx.lineCap    = 'round'; ctx.stroke();

  // Hub
  const hg = ctx.createRadialGradient(CX, CY, 0, CX, CY, 9);
  hg.addColorStop(0, '#67e8f9'); hg.addColorStop(1, '#0c1825');
  ctx.beginPath(); ctx.arc(CX, CY, 7, 0, Math.PI * 2);
  ctx.fillStyle = hg; ctx.fill();
  ctx.strokeStyle = 'rgba(34,211,238,0.5)'; ctx.lineWidth = 1; ctx.stroke();
}

// ─── rAF render loop (60 fps) ────────────────────────────────────────────
function tunerRenderLoop() {
  // Smooth the needle at the render level (separate, faster EMA)
  const target = smoothedFreq ? Math.max(-50, Math.min(50, smoothedCents)) : 0;
  needleSmoothed += (target - needleSmoothed) * 0.12;

  drawTunerMeter();

  // Update DOM text — throttled: only when value changes enough
  if (smoothedFreq) {
    const info = tunerSelString >= 0
      ? { name: NOTES[OPEN_STRINGS[tunerSelString] % 12], targetFreq: midiToFreq(OPEN_STRINGS[tunerSelString]) }
      : freqToNote(smoothedFreq);

    const noteName  = info.name;
    const absCents  = Math.abs(smoothedCents);
    const inTune    = absCents < 5;
    const close     = absCents < 15;

    // Note name + colour
    if (noteName !== lastNoteDisplay) {
      const el = document.getElementById('tuner-note');
      el.textContent  = noteName;
      el.className    = 'tuner-note ' + (inTune ? 'in-tune' : close ? 'close' : 'off');
      lastNoteDisplay = noteName;
    } else {
      const el = document.getElementById('tuner-note');
      el.className = 'tuner-note ' + (inTune ? 'in-tune' : close ? 'close' : 'off');
    }

    // Freq + cents text (throttle: only update if moved >0.5 cents)
    if (Math.abs(smoothedCents - lastCentsDisplay) > 0.5) {
      lastCentsDisplay = smoothedCents;
      document.getElementById('tuner-freq').textContent =
        smoothedFreq.toFixed(1) + ' Hz';
      const cVal = smoothedCents.toFixed(1);
      document.getElementById('tuner-cents').textContent = inTune
        ? 'In tune'
        : (smoothedCents > 0 ? cVal + ' cents sharp' : Math.abs(+cVal).toFixed(1) + ' cents flat');
    }
  } else {
    if (lastNoteDisplay !== '') {
      document.getElementById('tuner-note').textContent  = '—';
      document.getElementById('tuner-note').className    = 'tuner-note';
      document.getElementById('tuner-freq').textContent  = '— Hz';
      document.getElementById('tuner-cents').textContent = tunerOn ? 'Play a note…' : 'Press Start to begin';
      lastNoteDisplay  = '';
      lastCentsDisplay = 999;
    }
  }

  if (tunerOn) tunerRaf = requestAnimationFrame(tunerRenderLoop);
}

// ─── Start / Stop ────────────────────────────────────────────────────────
async function toggleTuner() {
  if (tunerOn) {
    stopTuner();
  } else {
    await startTuner();
  }
}

async function startTuner() {
  try {
    tunerStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  } catch(e) {
    document.getElementById('tuner-status').textContent = 'Microphone access denied';
    return;
  }
  const ac     = getAC();
  tunerAnalyser = ac.createAnalyser();
  tunerAnalyser.fftSize = 4096;
  tunerAnalyser.smoothingTimeConstant = 0;
  tunerBuf = new Float32Array(tunerAnalyser.fftSize);
  const src = ac.createMediaStreamSource(tunerStream);
  src.connect(tunerAnalyser);

  smoothedFreq  = null; smoothedCents = 0;
  needleSmoothed = 0; lastNoteDisplay = ''; lastCentsDisplay = 999;
  tunerOn = true;

  // Slow detection loop
  tunerInterval = setInterval(tunerDetect, 80);

  // Fast render loop
  tunerRaf = requestAnimationFrame(tunerRenderLoop);

  // UI
  document.getElementById('tuner-btn').innerHTML  = '<i class="fa-solid fa-stop"></i> Stop';
  document.getElementById('tuner-dot').classList.add('live');
  document.getElementById('tuner-status').textContent = 'Listening…';
}

function stopTuner() {
  tunerOn = false;
  if (tunerInterval)  { clearInterval(tunerInterval); tunerInterval = null; }
  if (tunerRaf)       { cancelAnimationFrame(tunerRaf); tunerRaf = null; }
  if (tunerStream)    { tunerStream.getTracks().forEach(t => t.stop()); tunerStream = null; }
  tunerAnalyser = null; tunerBuf = null;
  smoothedFreq  = null; smoothedCents = 0; needleSmoothed = 0;

  document.getElementById('tuner-btn').innerHTML  = '<i class="fa-solid fa-microphone"></i> Start Tuning';
  document.getElementById('tuner-dot').classList.remove('live');
  document.getElementById('tuner-status').textContent = 'Microphone off';
  document.getElementById('tuner-note').textContent   = '—';
  document.getElementById('tuner-note').className     = 'tuner-note';
  document.getElementById('tuner-freq').textContent   = '— Hz';
  document.getElementById('tuner-cents').textContent  = 'Press Start to begin';
  lastNoteDisplay = ''; lastCentsDisplay = 999;
  drawTunerMeter(); // draw blank meter
}

// ─── String selectors ────────────────────────────────────────────────────
function buildStringSelectors() {
  const row = document.getElementById('string-selectors');
  row.innerHTML = OPEN_STRINGS.map((midi, i) => {
    const noteName = NOTES[midi % 12];
    const octave   = Math.floor((midi - 12) / 12);
    const active   = tunerSelString === i;
    return `<button class="string-btn${active ? ' active' : ''}"
      onclick="selectTunerString(${i})">
      ${STRING_NAMES[i]} — ${noteName}${octave}
    </button>`;
  }).join('');
  // Chromatic button
  row.innerHTML += `<button class="string-btn${tunerSelString === -1 ? ' active' : ''}" onclick="selectTunerString(-1)">Chromatic</button>`;
}

function selectTunerString(idx) {
  tunerSelString = idx;
  buildStringSelectors();
  const target = document.getElementById('tuner-target');
  if (idx >= 0) {
    const freq = midiToFreq(OPEN_STRINGS[idx]).toFixed(2);
    target.textContent = `Target: ${NOTES[OPEN_STRINGS[idx] % 12]} — ${freq} Hz`;
  } else {
    target.textContent = '';
  }
  // Reset smoothing when switching strings
  smoothedFreq = null; smoothedCents = 0; needleSmoothed = 0;
}

// ─── Alternate tunings ───────────────────────────────────────────────────
function buildAltTunings() {
  const wrap = document.getElementById('alt-tunings');
  wrap.innerHTML = ALT_TUNINGS.map((t, i) =>
    `<button class="alt-btn${i === curAltTuning ? ' active' : ''}" onclick="setTuning(${i})">${t.n}</button>`
  ).join('');
}

function setTuning(idx) {
  curAltTuning  = idx;
  OPEN_STRINGS  = [...ALT_TUNINGS[idx].s];
  tunerSelString = -1;
  smoothedFreq  = null; smoothedCents = 0; needleSmoothed = 0;
  buildAltTunings();
  buildStringSelectors();
  document.getElementById('tuner-target').textContent = '';
  // Also update fretboard if it was rendered
  if (fbInitialised) renderFretboard();
}

// ─── Init (called on first visit) ────────────────────────────────────────
function initTuner() {
  buildStringSelectors();
  buildAltTunings();
  drawTunerMeter(); // draw blank meter immediately
}

