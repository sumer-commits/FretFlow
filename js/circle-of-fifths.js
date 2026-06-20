/* ═══════════════════════════════════════════════════════════════════════════
   CIRCLE OF FIFTHS
══════════════════════════════════════════════════════════════════════════════ */
const COF_KEYS   = ['C','G','D','A','E','B','F#','Db','Ab','Eb','Bb','F'];
const COF_MINORS = ['Am','Em','Bm','F#m','C#m','G#m','D#m','Bbm','Fm','Cm','Gm','Dm'];
// Diatonic chords: [I, ii, iii, IV, V, vi, vii°] for each key (index matches COF_KEYS)
const COF_DIATONIC = {
  C:  [{r:'I',n:'C',q:'major'},{r:'ii',n:'Dm',q:'minor'},{r:'iii',n:'Em',q:'minor'},{r:'IV',n:'F',q:'major'},{r:'V',n:'G',q:'major'},{r:'vi',n:'Am',q:'minor'},{r:'vii°',n:'Bdim',q:'dim'}],
  G:  [{r:'I',n:'G',q:'major'},{r:'ii',n:'Am',q:'minor'},{r:'iii',n:'Bm',q:'minor'},{r:'IV',n:'C',q:'major'},{r:'V',n:'D',q:'major'},{r:'vi',n:'Em',q:'minor'},{r:'vii°',n:'F#dim',q:'dim'}],
  D:  [{r:'I',n:'D',q:'major'},{r:'ii',n:'Em',q:'minor'},{r:'iii',n:'F#m',q:'minor'},{r:'IV',n:'G',q:'major'},{r:'V',n:'A',q:'major'},{r:'vi',n:'Bm',q:'minor'},{r:'vii°',n:'C#dim',q:'dim'}],
  A:  [{r:'I',n:'A',q:'major'},{r:'ii',n:'Bm',q:'minor'},{r:'iii',n:'C#m',q:'minor'},{r:'IV',n:'D',q:'major'},{r:'V',n:'E',q:'major'},{r:'vi',n:'F#m',q:'minor'},{r:'vii°',n:'G#dim',q:'dim'}],
  E:  [{r:'I',n:'E',q:'major'},{r:'ii',n:'F#m',q:'minor'},{r:'iii',n:'G#m',q:'minor'},{r:'IV',n:'A',q:'major'},{r:'V',n:'B',q:'major'},{r:'vi',n:'C#m',q:'minor'},{r:'vii°',n:'D#dim',q:'dim'}],
  B:  [{r:'I',n:'B',q:'major'},{r:'ii',n:'C#m',q:'minor'},{r:'iii',n:'D#m',q:'minor'},{r:'IV',n:'E',q:'major'},{r:'V',n:'F#',q:'major'},{r:'vi',n:'G#m',q:'minor'},{r:'vii°',n:'A#dim',q:'dim'}],
  'F#': [{r:'I',n:'F#',q:'major'},{r:'ii',n:'G#m',q:'minor'},{r:'iii',n:'A#m',q:'minor'},{r:'IV',n:'B',q:'major'},{r:'V',n:'C#',q:'major'},{r:'vi',n:'D#m',q:'minor'},{r:'vii°',n:'Fdim',q:'dim'}],
  Db: [{r:'I',n:'Db',q:'major'},{r:'ii',n:'Ebm',q:'minor'},{r:'iii',n:'Fm',q:'minor'},{r:'IV',n:'Gb',q:'major'},{r:'V',n:'Ab',q:'major'},{r:'vi',n:'Bbm',q:'minor'},{r:'vii°',n:'Cdim',q:'dim'}],
  Ab: [{r:'I',n:'Ab',q:'major'},{r:'ii',n:'Bbm',q:'minor'},{r:'iii',n:'Cm',q:'minor'},{r:'IV',n:'Db',q:'major'},{r:'V',n:'Eb',q:'major'},{r:'vi',n:'Fm',q:'minor'},{r:'vii°',n:'Gdim',q:'dim'}],
  Eb: [{r:'I',n:'Eb',q:'major'},{r:'ii',n:'Fm',q:'minor'},{r:'iii',n:'Gm',q:'minor'},{r:'IV',n:'Ab',q:'major'},{r:'V',n:'Bb',q:'major'},{r:'vi',n:'Cm',q:'minor'},{r:'vii°',n:'Ddim',q:'dim'}],
  Bb: [{r:'I',n:'Bb',q:'major'},{r:'ii',n:'Cm',q:'minor'},{r:'iii',n:'Dm',q:'minor'},{r:'IV',n:'Eb',q:'major'},{r:'V',n:'F',q:'major'},{r:'vi',n:'Gm',q:'minor'},{r:'vii°',n:'Adim',q:'dim'}],
  F:  [{r:'I',n:'F',q:'major'},{r:'ii',n:'Gm',q:'minor'},{r:'iii',n:'Am',q:'minor'},{r:'IV',n:'Bb',q:'major'},{r:'V',n:'C',q:'major'},{r:'vi',n:'Dm',q:'minor'},{r:'vii°',n:'Edim',q:'dim'}],
};
let cofInit = false;

function drawCOF() {
  const canvas = document.getElementById('cof-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 170, cy = 170;
  const outerR = 155, innerR = 95, centerR = 48;
  ctx.clearRect(0, 0, 340, 340);

  const seg = (2 * Math.PI) / 12;

  for (let i = 0; i < 12; i++) {
    const startA = -Math.PI / 2 + i * seg;
    const endA   = startA + seg;
    const midA   = startA + seg / 2;
    const isSelOuter = cofSelected === COF_KEYS[i];
    const isSelInner = cofSelected === COF_MINORS[i];

    // Outer ring
    const og = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
    if (isSelOuter) {
      og.addColorStop(0, '#0e7490'); og.addColorStop(1, '#22d3ee');
    } else {
      og.addColorStop(0, '#0c1825'); og.addColorStop(1, '#122436');
    }
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR, startA, endA);
    ctx.closePath();
    ctx.fillStyle = og;
    ctx.fill();
    ctx.strokeStyle = isSelOuter ? 'rgba(34,211,238,0.8)' : 'rgba(34,211,238,0.18)';
    ctx.lineWidth = isSelOuter ? 2 : 0.8;
    ctx.stroke();

    // Major label
    const lx = cx + Math.cos(midA) * 125;
    const ly = cy + Math.sin(midA) * 125;
    ctx.fillStyle = isSelOuter ? '#67e8f9' : '#a0c0cc';
    ctx.font = `${isSelOuter ? 'bold ' : ''}16px 'Playfair Display', serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(COF_KEYS[i], lx, ly);

    // Inner ring
    const ig = ctx.createRadialGradient(cx, cy, centerR, cx, cy, innerR);
    if (isSelInner) {
      ig.addColorStop(0, '#3730a3'); ig.addColorStop(1, '#818cf8');
    } else {
      ig.addColorStop(0, '#070f1b'); ig.addColorStop(1, '#0c1825');
    }
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, innerR, startA, endA);
    ctx.closePath();
    ctx.fillStyle = ig;
    ctx.fill();
    ctx.strokeStyle = 'rgba(34,211,238,0.12)';
    ctx.lineWidth = 0.6;
    ctx.stroke();

    // Minor label
    const mx = cx + Math.cos(midA) * 72;
    const my = cy + Math.sin(midA) * 72;
    ctx.fillStyle = isSelInner ? '#c7d2fe' : '#4a7a8a';
    ctx.font = `11px 'Inter', sans-serif`;
    ctx.fillText(COF_MINORS[i], mx, my);
  }

  // Center circle
  const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, centerR);
  cg.addColorStop(0, '#0c1825'); cg.addColorStop(1, '#060c14');
  ctx.beginPath(); ctx.arc(cx, cy, centerR, 0, 2 * Math.PI);
  ctx.fillStyle = cg; ctx.fill();
  ctx.strokeStyle = 'rgba(34,211,238,0.35)'; ctx.lineWidth = 1.5; ctx.stroke();

  // Center text
  const selKey = cofSelected || '';
  ctx.fillStyle = selKey ? '#22d3ee' : '#4a7a8a';
  ctx.font = selKey ? "bold 18px 'Playfair Display', serif" : "12px 'Inter', sans-serif";
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(selKey || 'Click a key', cx, cy);
}

function cofClick(e) {
  const canvas = document.getElementById('cof-canvas');
  const rect   = canvas.getBoundingClientRect();
  const px = e.clientX - rect.left, py = e.clientY - rect.top;
  const cx = 170, cy = 170;
  const dx = px - cx, dy = py - cy;
  const dist = Math.sqrt(dx*dx + dy*dy);
  let angle  = Math.atan2(dy, dx) + Math.PI / 2;
  if (angle < 0) angle += 2 * Math.PI;
  const idx  = Math.floor(angle / (2 * Math.PI / 12)) % 12;

  if (dist > 155 || dist < 10) return; // outside
  const isOuter = dist >= 95;
  cofSelected = isOuter ? COF_KEYS[idx] : COF_MINORS[idx];

  drawCOF();
  renderCOFInfo();
}

function renderCOFInfo() {
  const info = document.getElementById('cof-info');
  if (!cofSelected) return;
  const isMajor = COF_KEYS.includes(cofSelected);
  const keyIdx  = isMajor ? COF_KEYS.indexOf(cofSelected) : COF_MINORS.indexOf(cofSelected);
  const majorKey = COF_KEYS[keyIdx];
  const minorKey = COF_MINORS[keyIdx];
  const relLabel = isMajor ? 'Relative minor' : 'Relative major';
  const relKey   = isMajor ? minorKey : majorKey;
  const nbLeft   = COF_KEYS[(keyIdx + 11) % 12];
  const nbRight  = COF_KEYS[(keyIdx + 1) % 12];
  const diatonic = COF_DIATONIC[majorKey] || [];

  const scaleKey = isMajor ? 'major' : 'aeolian';
  const rootMidiVal = NOTES.indexOf(majorKey.replace('b','').replace('#',''));

  info.innerHTML = `
    <div class="cof-key-title">${cofSelected}</div>
    <div class="cof-relative-box" style="margin-bottom:14px;">
      <div style="font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-muted);margin-bottom:4px;">${relLabel}</div>
      <div style="font-family:'Playfair Display',serif;font-size:18px;color:var(--maple);">${relKey}</div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">
        ${isMajor ? 'Same key signature — starts on the 6th degree' : 'Same key signature — starts on the 3rd degree'}
      </div>
    </div>
    <div style="font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px;">Diatonic Chords</div>
    <div class="cof-diatonic-grid">
      ${diatonic.map(ch => `
        <div class="cof-chord-cell" onclick="arpeggiateByName('${ch.n}')">
          <div class="cof-roman">${ch.r}</div>
          <div class="cof-chord-name">${ch.n}</div>
          <div class="cof-quality">${ch.q}</div>
        </div>`).join('')}
    </div>
    <div class="cof-neighbours" style="margin-bottom:14px;">
      <i class="fa-solid fa-circle-nodes" style="color:var(--amber);margin-right:6px;"></i>
      Neighbours: <strong style="color:var(--cream);">${nbLeft}</strong> (−1♭) &nbsp;·&nbsp; <strong style="color:var(--cream);">${nbRight}</strong> (+1♯)
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn btn-gold" onclick="viewScaleOnFretboard('${scaleKey}')">
        <i class="fa-solid fa-guitar"></i> View on Fretboard
      </button>
      <button class="btn btn-wood" onclick="hearCOFScale('${majorKey}')">
        <i class="fa-solid fa-play"></i> Hear Scale
      </button>
    </div>`;
}

function hearCOFScale(keyName) {
  const rootIdx = NOTES.indexOf(keyName.replace(/b$/, '').replace(/#$/, ''));
  if (rootIdx < 0) return;
  const intervals = [0,2,4,5,7,9,11,12];
  const items = intervals.map((iv, i) => ({ iv, delay: i * 360 }));
  scheduleNoteSequence(items, ({ iv }) => playNote(60 + rootIdx + iv, 0.7));
}

function arpeggiateByName(chordName) {
  const ch = CHORDS.find(c => c.n === chordName);
  if (ch) arpeggiate(ch.f);
  else {
    // Synthesise a major/minor arpeggio
    const rootIdx = NOTES.findIndex(n => chordName.startsWith(n));
    if (rootIdx < 0) return;
    const isMinor = chordName.includes('m') && !chordName.includes('maj');
    const isDim   = chordName.includes('dim');
    const thirds  = isDim ? [0,3,6] : isMinor ? [0,3,7] : [0,4,7];
    thirds.forEach((iv, i) => {
      setTimeout(() => playNote(60 + rootIdx + iv, 1.0), i * 120);
    });
  }
}

