/* ═══════════════════════════════════════════════════════════════════════════
   METRONOME  — AudioContext scheduler (NOT setInterval for clicks)
   setInterval(25ms) calls schedule(), which looks 100ms ahead and queues
   OscillatorNode clicks at exact AudioContext times. Visual updates use
   setTimeout keyed to the same scheduled times.
══════════════════════════════════════════════════════════════════════════════ */
const TIME_SIGS = [
  { label:'2/4', beats:2 }, { label:'3/4', beats:3 },
  { label:'4/4', beats:4 }, { label:'6/8', beats:6 },
  { label:'12', beats:12 },
];

// mBpm, mBeat, mSig, mOn already in globals
let metroSchedId   = null;   // setInterval id for scheduler
let metroRafId     = null;   // requestAnimationFrame id for pendulum
let nextNoteTime   = 0;
const LOOK_AHEAD   = 0.1;    // seconds
const SCHED_INT    = 25;     // ms

let pendulumAngle  = 0;      // current angle (degrees)
let pendulumTarget = 32;     // swings ±32°
let tapTimes       = [];     // for tap tempo
let metroVisualTimeouts = []; // pending visual-beat setTimeout ids, cleared on stop

// ─── AudioContext scheduler ───────────────────────────────────────────────
function metroSchedule() {
  const ac = getAC();
  while (nextNoteTime < ac.currentTime + LOOK_AHEAD) {
    metroScheduleClick(mBeat, nextNoteTime);
    metroAdvanceBeat();
  }
}

function metroScheduleClick(beat, time) {
  const ac   = getAC();
  const osc  = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);
  // Accent beat 0: higher pitch
  osc.frequency.value = beat === 0 ? 1050 : 700;
  osc.type = 'sine';
  gain.gain.setValueAtTime(beat === 0 ? 0.4 : 0.25, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
  osc.start(time);
  osc.stop(time + 0.06);

  // Schedule visual update at the moment the click fires
  const delay = Math.max(0, (time - ac.currentTime) * 1000);
  const tid = setTimeout(() => metroVisualBeat(beat), delay);
  metroVisualTimeouts.push(tid);
}

function metroAdvanceBeat() {
  nextNoteTime += 60.0 / mBpm;
  mBeat = (mBeat + 1) % mSig;
}

// ─── Visual beat update ───────────────────────────────────────────────────
function metroVisualBeat(beat) {
  // Flip pendulum target on every beat
  pendulumTarget = -pendulumTarget;
  // Update beat number in bob
  const numEl = document.getElementById('metro-beat-num');
  if (numEl) numEl.textContent = beat + 1;
  // Light up beat dots
  const dots = document.querySelectorAll('.beat-dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === beat));
}

// ─── Pendulum rAF loop ────────────────────────────────────────────────────
function pendulumLoop() {
  pendulumAngle += (pendulumTarget - pendulumAngle) * 0.12;
  updatePendulumSVG(pendulumAngle);
  if (mOn) metroRafId = requestAnimationFrame(pendulumLoop);
}

function updatePendulumSVG(deg) {
  const RAD = Math.PI / 180;
  const L   = 143;
  const px  = 60, py = 14;
  const bx  = px + Math.sin(deg * RAD) * L;
  const by  = py + Math.cos(deg * RAD) * L;
  const rod = document.getElementById('metro-rod');
  const bob = document.getElementById('metro-bob');
  const num = document.getElementById('metro-beat-num');
  if (rod) { rod.setAttribute('x2', bx.toFixed(1)); rod.setAttribute('y2', by.toFixed(1)); }
  if (bob) { bob.setAttribute('cx', bx.toFixed(1)); bob.setAttribute('cy', by.toFixed(1)); }
  if (num) { num.setAttribute('x', bx.toFixed(1)); num.setAttribute('y', (by + 5).toFixed(1)); }
}

// ─── Start / Stop ─────────────────────────────────────────────────────────
function toggleMetronome() {
  if (mOn) stopMetronome(); else startMetronome();
}

function startMetronome() {
  const ac   = getAC();
  mOn        = true;
  mBeat      = 0;
  nextNoteTime = ac.currentTime + 0.05;
  pendulumTarget = 32;
  pendulumAngle  = 0;

  metroSchedId = setInterval(metroSchedule, SCHED_INT);
  metroRafId   = requestAnimationFrame(pendulumLoop);

  const btn = document.getElementById('metro-start-btn');
  if (btn) { btn.innerHTML = '<i class="fa-solid fa-stop"></i> Stop'; btn.classList.add('playing'); }
}

function stopMetronome() {
  mOn = false;
  if (metroSchedId) { clearInterval(metroSchedId); metroSchedId = null; }
  if (metroRafId)   { cancelAnimationFrame(metroRafId); metroRafId = null; }
  metroVisualTimeouts.forEach(clearTimeout);
  metroVisualTimeouts = [];

  // Reset pendulum to centre
  pendulumTarget = 0; pendulumAngle = 0;
  updatePendulumSVG(0);

  const btn = document.getElementById('metro-start-btn');
  if (btn) { btn.innerHTML = '<i class="fa-solid fa-play"></i> Start'; btn.classList.remove('playing'); }

  // Reset dots
  document.querySelectorAll('.beat-dot').forEach(d => d.classList.remove('active'));
  const num = document.getElementById('metro-beat-num');
  if (num) num.textContent = '1';
}

// ─── BPM control ──────────────────────────────────────────────────────────
function metroSetBpm(bpm) {
  mBpm = Math.max(30, Math.min(300, bpm));
  const disp = document.getElementById('metro-bpm-display');
  const sldr = document.getElementById('metro-slider');
  if (disp) disp.textContent = mBpm;
  if (sldr) sldr.value = mBpm;
}

function metroAdjBpm(delta) { metroSetBpm(mBpm + delta); }

// ─── Tap Tempo ────────────────────────────────────────────────────────────
function tapTempo() {
  const now = performance.now();
  // Reset if gap > 2.5 seconds
  if (tapTimes.length && now - tapTimes[tapTimes.length - 1] > 2500) tapTimes = [];
  tapTimes.push(now);
  if (tapTimes.length > 8) tapTimes.shift();
  if (tapTimes.length >= 2) {
    const intervals = [];
    for (let i = 1; i < tapTimes.length; i++) intervals.push(tapTimes[i] - tapTimes[i-1]);
    const avg = intervals.reduce((a,b) => a+b, 0) / intervals.length;
    metroSetBpm(Math.round(60000 / avg));
  }
  // Flash tap button
  const btn = document.getElementById('metro-tap-btn');
  if (btn) {
    btn.style.borderColor = 'var(--gold)';
    btn.style.color       = 'var(--gold)';
    setTimeout(() => { btn.style.borderColor = ''; btn.style.color = ''; }, 120);
  }
}

// ─── Time signature ───────────────────────────────────────────────────────
function buildTimeSigs() {
  const row = document.getElementById('time-sig-row');
  if (!row) return;
  row.innerHTML = TIME_SIGS.map(t =>
    `<button class="time-sig-btn${mSig === t.beats ? ' active' : ''}" onclick="setTimeSig(${t.beats})">${t.label}</button>`
  ).join('');
}

function setTimeSig(beats) {
  mSig  = beats;
  mBeat = 0;
  buildTimeSigs();
  buildBeatDots();
  if (mOn) { stopMetronome(); startMetronome(); }
}

function buildBeatDots() {
  const wrap = document.getElementById('beat-dots');
  if (!wrap) return;
  wrap.innerHTML = Array.from({length: mSig}, (_, i) =>
    `<div class="beat-dot${i === 0 ? ' accent' : ''}"></div>`
  ).join('');
}

// ─── Open / Close overlay ─────────────────────────────────────────────────
function openMetronome() {
  const overlay = document.getElementById('metro-overlay');
  overlay.style.display = 'flex';
  // Init UI elements
  buildTimeSigs();
  buildBeatDots();
  metroSetBpm(mBpm);
  updatePendulumSVG(0);
}

function closeMetronome() {
  stopMetronome();
  const overlay = document.getElementById('metro-overlay');
  overlay.style.display = 'none';
}

