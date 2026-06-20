/* ═══════════════════════════════════════════════════════════════════════════
   CHORD EXPLORER
══════════════════════════════════════════════════════════════════════════════ */
const CHORD_TYPES = ['all','major','minor','dom7','maj7','min7','dom9','dom11','dom13','dim','aug','sus2','sus4','add9','power'];
const CHORD_TYPE_LABELS = { all:'All', major:'Major', minor:'Minor', dom7:'Dom 7', maj7:'Maj 7', min7:'Min 7', dom9:'9th', dom11:'11th', dom13:'13th', dim:'Diminished', aug:'Augmented', sus2:'Sus 2', sus4:'Sus 4', add9:'Add 9', power:'Power' };
let curChordType = 'all';
let chordsInit   = false;

// f: [str6,str5,str4,str3,str2,str1] frets; -1=muted, 0=open
const CHORDS = [
  // Open Major
  {n:'C',    t:'major', b:false, f:[-1,3,2,0,1,0], fr:1,  fi:'x32010'},
  {n:'G',    t:'major', b:false, f:[3,2,0,0,0,3],  fr:1,  fi:'320003'},
  {n:'D',    t:'major', b:false, f:[-1,-1,0,2,3,2],fr:1,  fi:'xx0232'},
  {n:'A',    t:'major', b:false, f:[-1,0,2,2,2,0], fr:1,  fi:'x02220'},
  {n:'E',    t:'major', b:false, f:[0,2,2,1,0,0],  fr:1,  fi:'022100'},
  // Barre Major E-shape
  {n:'F',    t:'major', b:true,  f:[1,1,2,3,3,1],  fr:1,  fi:'133211', shape:'E'},
  {n:'F#',   t:'major', b:true,  f:[2,2,4,4,4,2],  fr:2,  fi:'244322', shape:'E'},
  {n:'G#',   t:'major', b:true,  f:[4,4,6,6,6,4],  fr:4,  fi:'466544', shape:'E'},
  {n:'A#',   t:'major', b:true,  f:[6,6,8,8,8,6],  fr:6,  fi:'688766', shape:'E'},
  {n:'B',    t:'major', b:true,  f:[7,7,9,9,9,7],  fr:7,  fi:'799877', shape:'E'},
  // Barre Major A-shape
  {n:'B',    t:'major', b:true,  f:[-1,2,4,4,4,2], fr:2,  fi:'x24442', shape:'A'},
  {n:'C',    t:'major', b:true,  f:[-1,3,5,5,5,3], fr:3,  fi:'x35553', shape:'A'},
  {n:'D',    t:'major', b:true,  f:[-1,5,7,7,7,5], fr:5,  fi:'x57775', shape:'A'},
  {n:'Eb',   t:'major', b:true,  f:[-1,6,8,8,8,6], fr:6,  fi:'x68886', shape:'A'},
  // Open Minor
  {n:'Am',   t:'minor', b:false, f:[-1,0,2,2,1,0], fr:1,  fi:'x02210'},
  {n:'Em',   t:'minor', b:false, f:[0,2,2,0,0,0],  fr:1,  fi:'022000'},
  {n:'Dm',   t:'minor', b:false, f:[-1,-1,0,2,3,1],fr:1,  fi:'xx0231'},
  // Barre Minor Em-shape
  {n:'Fm',   t:'minor', b:true,  f:[1,1,3,3,2,1],  fr:1,  fi:'133211', shape:'Em'},
  {n:'F#m',  t:'minor', b:true,  f:[2,2,4,4,3,2],  fr:2,  fi:'244322', shape:'Em'},
  {n:'Gm',   t:'minor', b:true,  f:[3,3,5,5,4,3],  fr:3,  fi:'355433', shape:'Em'},
  {n:'G#m',  t:'minor', b:true,  f:[4,4,6,6,5,4],  fr:4,  fi:'466544', shape:'Em'},
  // Barre Minor Am-shape
  {n:'Bm',   t:'minor', b:true,  f:[-1,2,4,4,3,2], fr:2,  fi:'x24432', shape:'Am'},
  {n:'Cm',   t:'minor', b:true,  f:[-1,3,5,5,4,3], fr:3,  fi:'x35543', shape:'Am'},
  {n:'C#m',  t:'minor', b:true,  f:[-1,4,6,6,5,4], fr:4,  fi:'x46654', shape:'Am'},
  {n:'Ebm',  t:'minor', b:true,  f:[-1,6,8,8,7,6], fr:6,  fi:'x68876', shape:'Am'},
  // Dom 7
  {n:'G7',   t:'dom7',  b:false, f:[3,2,0,0,0,1],  fr:1,  fi:'320001'},
  {n:'C7',   t:'dom7',  b:false, f:[-1,3,2,3,1,0], fr:1,  fi:'x32310'},
  {n:'D7',   t:'dom7',  b:false, f:[-1,-1,0,2,1,2],fr:1,  fi:'xx0212'},
  {n:'A7',   t:'dom7',  b:false, f:[-1,0,2,0,2,0], fr:1,  fi:'x02020'},
  {n:'E7',   t:'dom7',  b:false, f:[0,2,0,1,0,0],  fr:1,  fi:'020100'},
  {n:'B7',   t:'dom7',  b:false, f:[-1,2,1,2,0,2], fr:1,  fi:'x21202'},
  {n:'F7',   t:'dom7',  b:true,  f:[1,1,2,3,1,1],  fr:1,  fi:'131211', shape:'E'},
  // Maj 7
  {n:'Cmaj7',t:'maj7',  b:false, f:[-1,3,2,0,0,0], fr:1,  fi:'x32000'},
  {n:'Gmaj7',t:'maj7',  b:false, f:[3,2,0,0,0,2],  fr:1,  fi:'320002'},
  {n:'Amaj7',t:'maj7',  b:false, f:[-1,0,2,1,2,0], fr:1,  fi:'x02120'},
  {n:'Dmaj7',t:'maj7',  b:false, f:[-1,-1,0,2,2,2],fr:1,  fi:'xx0222'},
  {n:'Emaj7',t:'maj7',  b:false, f:[0,2,1,1,0,0],  fr:1,  fi:'021100'},
  {n:'Fmaj7',t:'maj7',  b:true,  f:[1,1,3,2,1,1],  fr:1,  fi:'113211', shape:'E'},
  {n:'Bmaj7',t:'maj7',  b:true,  f:[-1,2,4,3,4,2], fr:2,  fi:'x24342', shape:'A'},
  // Min 7
  {n:'Am7',  t:'min7',  b:false, f:[-1,0,2,0,1,0], fr:1,  fi:'x02010'},
  {n:'Em7',  t:'min7',  b:false, f:[0,2,2,0,3,0],  fr:1,  fi:'022030'},
  {n:'Dm7',  t:'min7',  b:false, f:[-1,-1,0,2,1,1],fr:1,  fi:'xx0211'},
  {n:'Bm7',  t:'min7',  b:true,  f:[-1,2,4,2,3,2], fr:2,  fi:'x24232', shape:'Am'},
  {n:'Cm7',  t:'min7',  b:true,  f:[-1,3,5,3,4,3], fr:3,  fi:'x35343', shape:'Am'},
  {n:'F#m7', t:'min7',  b:true,  f:[2,2,4,2,3,2],  fr:2,  fi:'224232', shape:'Em'},
  {n:'Fm7',  t:'min7',  b:true,  f:[1,1,3,1,2,1],  fr:1,  fi:'131121', shape:'Em'},
  // 9th
  {n:'G9',   t:'dom9',  b:false, f:[3,2,0,2,0,1],  fr:1,  fi:'320201'},
  {n:'C9',   t:'dom9',  b:false, f:[-1,3,2,3,3,3], fr:1,  fi:'x32333'},
  {n:'A9',   t:'dom9',  b:false, f:[-1,0,2,0,2,3], fr:1,  fi:'x02023'},
  {n:'E9',   t:'dom9',  b:false, f:[0,2,0,1,0,2],  fr:1,  fi:'020102'},
  {n:'D9',   t:'dom9',  b:true,  f:[-1,5,4,5,3,5], fr:3,  fi:'x54535', shape:'A'},
  {n:'Cmaj9',t:'dom9',  b:false, f:[-1,3,0,0,0,0], fr:1,  fi:'x30000'},
  {n:'Gmaj9',t:'dom9',  b:false, f:[3,2,0,2,0,0],  fr:1,  fi:'320200'},
  // 11th
  {n:'G11',  t:'dom11', b:false, f:[3,-1,0,2,1,1], fr:1,  fi:'3x0211'},
  {n:'C11',  t:'dom11', b:false, f:[-1,3,3,3,1,1], fr:1,  fi:'x33311'},
  {n:'A11',  t:'dom11', b:false, f:[-1,0,0,0,3,0], fr:1,  fi:'x00030'},
  // 13th
  {n:'G13',  t:'dom13', b:false, f:[3,2,0,0,1,1],  fr:1,  fi:'320011'},
  {n:'C13',  t:'dom13', b:false, f:[-1,3,2,3,3,5], fr:3,  fi:'x32335'},
  {n:'A13',  t:'dom13', b:false, f:[-1,0,2,0,2,2], fr:1,  fi:'x02022'},
  // Diminished
  {n:'Bdim', t:'dim',   b:false, f:[-1,2,3,4,3,-1],fr:1,  fi:'x2343x'},
  {n:'Cdim', t:'dim',   b:false, f:[-1,3,4,5,4,-1],fr:3,  fi:'x3454x'},
  {n:'Ddim', t:'dim',   b:false, f:[-1,-1,0,1,0,1],fr:1,  fi:'xx0101'},
  {n:'F#dim',t:'dim',   b:false, f:[2,-1,0,1,0,2], fr:1,  fi:'2x0102'},
  {n:'Bdim7',t:'dim',   b:false, f:[-1,2,3,1,3,-1],fr:1,  fi:'x2313x'},
  {n:'Gdim7',t:'dim',   b:false, f:[3,-1,2,3,2,3], fr:2,  fi:'3x2323'},
  // Augmented
  {n:'Caug', t:'aug',   b:false, f:[-1,3,2,1,1,0], fr:1,  fi:'x32110'},
  {n:'Eaug', t:'aug',   b:false, f:[0,3,2,1,1,0],  fr:1,  fi:'032110'},
  {n:'Gaug', t:'aug',   b:false, f:[3,2,2,1,1,0],  fr:1,  fi:'322110'},
  {n:'Aaug', t:'aug',   b:false, f:[-1,0,3,2,2,1], fr:1,  fi:'x03221'},
  // Sus 2
  {n:'Dsus2',t:'sus2',  b:false, f:[-1,-1,0,2,3,0],fr:1,  fi:'xx0230'},
  {n:'Asus2',t:'sus2',  b:false, f:[-1,0,2,2,0,0], fr:1,  fi:'x02200'},
  {n:'Esus2',t:'sus2',  b:false, f:[0,2,2,1,0,2],  fr:1,  fi:'022102'},
  {n:'Csus2',t:'sus2',  b:false, f:[-1,3,3,0,1,1], fr:1,  fi:'x33011'},
  {n:'Gsus2',t:'sus2',  b:false, f:[3,2,0,0,3,3],  fr:1,  fi:'320033'},
  // Sus 4
  {n:'Dsus4',t:'sus4',  b:false, f:[-1,-1,0,2,3,3],fr:1,  fi:'xx0233'},
  {n:'Esus4',t:'sus4',  b:false, f:[0,2,2,2,0,0],  fr:1,  fi:'022200'},
  {n:'Asus4',t:'sus4',  b:false, f:[-1,0,2,2,3,0], fr:1,  fi:'x02230'},
  {n:'Gsus4',t:'sus4',  b:false, f:[3,2,0,0,1,3],  fr:1,  fi:'320013'},
  // Add 9
  {n:'Cadd9',t:'add9',  b:false, f:[-1,3,2,0,3,0], fr:1,  fi:'x32030'},
  {n:'Gadd9',t:'add9',  b:false, f:[3,2,0,2,0,3],  fr:1,  fi:'320203'},
  {n:'Dadd9',t:'add9',  b:false, f:[-1,-1,0,4,3,2],fr:2,  fi:'xx0432'},
  // Power chords
  {n:'E5',   t:'power', b:false, f:[0,2,2,-1,-1,-1],fr:1, fi:'022xxx'},
  {n:'A5',   t:'power', b:false, f:[-1,0,2,2,-1,-1],fr:1, fi:'x022xx'},
  {n:'D5',   t:'power', b:false, f:[-1,-1,0,2,3,-1],fr:1, fi:'xx023x'},
  {n:'G5',   t:'power', b:false, f:[3,5,5,-1,-1,-1],fr:3, fi:'355xxx'},
  {n:'B5',   t:'power', b:true,  f:[-1,2,4,4,-1,-1],fr:2, fi:'x244xx'},
  {n:'F5',   t:'power', b:true,  f:[1,3,3,-1,-1,-1],fr:1, fi:'133xxx'},
  {n:'C5',   t:'power', b:false, f:[-1,3,5,5,-1,-1],fr:3, fi:'x355xx'},

  // ─── ALTERNATE VOICINGS (CAGED positions up the neck) ──────────────────
  // C major  (open + A-shape fr3 already exist above)
  {n:'C',    t:'major', b:true,  f:[8,10,10,9,8,8],     fr:8,  fi:'8(10)(10)988', shape:'E'},
  {n:'C',    t:'major', b:false, f:[-1,-1,10,12,13,12], fr:10, fi:'xx(10)(12)(13)(12)', shape:'D'},
  // G major  (open already exists above)
  {n:'G',    t:'major', b:true,  f:[3,5,5,4,3,3],       fr:3,  fi:'355433', shape:'E'},
  {n:'G',    t:'major', b:true,  f:[-1,10,12,12,12,10], fr:10, fi:'x(10)(12)(12)(12)(10)', shape:'A'},
  {n:'G',    t:'major', b:false, f:[-1,-1,5,7,8,7],     fr:5,  fi:'xx5787',  shape:'D'},
  // D major  (open + A-shape fr5 already exist above)
  {n:'D',    t:'major', b:true,  f:[10,12,12,11,10,10], fr:10, fi:'(10)(12)(12)(11)(10)(10)', shape:'E'},
  // A major  (open already exists above)
  {n:'A',    t:'major', b:true,  f:[5,7,7,6,5,5],       fr:5,  fi:'577655', shape:'E'},
  {n:'A',    t:'major', b:true,  f:[-1,12,14,14,14,12], fr:12, fi:'x(12)(14)(14)(14)(12)', shape:'A'},
  // E major  (open already exists above)
  {n:'E',    t:'major', b:true,  f:[-1,7,9,9,9,7],      fr:7,  fi:'x79997', shape:'A'},
  {n:'E',    t:'major', b:true,  f:[12,14,14,13,12,12], fr:12, fi:'(12)(14)(14)(13)(12)(12)', shape:'E'},
  // A minor
  {n:'Am',   t:'minor', b:true,  f:[5,7,7,5,5,5],    fr:5,  fi:'577555', shape:'Em'},
  {n:'Am',   t:'minor', b:true,  f:[-1,12,14,14,13,12], fr:12, fi:'x(12)(14)(14)(13)(12)', shape:'Am'},
  // E minor
  {n:'Em',   t:'minor', b:true,  f:[-1,7,9,9,8,7],   fr:7,  fi:'x79987', shape:'Am'},
  {n:'Em',   t:'minor', b:true,  f:[12,14,14,12,12,12], fr:12, fi:'(12)(14)(14)(12)(12)(12)', shape:'Em'},
  // D minor
  {n:'Dm',   t:'minor', b:true,  f:[-1,5,7,7,6,5],   fr:5,  fi:'x57765', shape:'Am'},
  {n:'Dm',   t:'minor', b:true,  f:[10,12,12,10,10,10], fr:10, fi:'(10)(12)(12)(10)(10)(10)', shape:'Em'},
  // Cmaj7 alternates
  {n:'Cmaj7',t:'maj7',  b:true,  f:[-1,3,5,4,5,3],   fr:3,  fi:'x35453', shape:'A'},
  {n:'Cmaj7',t:'maj7',  b:true,  f:[8,10,9,9,8,-1],  fr:8,  fi:'(8)(10)(9)(9)(8)x', shape:'E'},
  // Am7 alternates
  {n:'Am7',  t:'min7',  b:true,  f:[5,7,5,5,5,5],    fr:5,  fi:'575555', shape:'Em'},
  {n:'Am7',  t:'min7',  b:true,  f:[-1,12,14,12,13,12], fr:12, fi:'x(12)(14)(12)(13)(12)', shape:'Am'},
  // G7 alternates
  {n:'G7',   t:'dom7',  b:true,  f:[3,5,3,4,3,3],    fr:3,  fi:'353433', shape:'E'},
  {n:'G7',   t:'dom7',  b:true,  f:[-1,10,12,10,12,10], fr:10, fi:'x(10)(12)(10)(12)(10)', shape:'A'},
  // E7 alternate
  {n:'E7',   t:'dom7',  b:true,  f:[-1,7,9,7,9,7],   fr:7,  fi:'x79797', shape:'A'},
  // D7 alternate
  {n:'D7',   t:'dom7',  b:true,  f:[-1,5,7,5,7,5],   fr:5,  fi:'x57575', shape:'A'},
  // A7 alternate
  {n:'A7',   t:'dom7',  b:true,  f:[5,7,5,6,5,5],    fr:5,  fi:'575655', shape:'E'},
  // C7 alternate
  {n:'C7',   t:'dom7',  b:true,  f:[8,10,8,9,8,8],   fr:8,  fi:'(8)(10)(8)(9)(8)(8)', shape:'E'},
];

// Shared SVG defs — injected once into DOM
(function injectSvgDefs() {
  const s = document.createElement('div');
  s.innerHTML = `<svg style="position:absolute;width:0;height:0;overflow:hidden;" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="dg" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#67e8f9"/>
        <stop offset="100%" stop-color="#0e7490"/>
      </radialGradient>
    </defs>
  </svg>`;
  document.body.insertBefore(s.firstElementChild, document.body.firstChild);
})();

function cSVG(frets, fr) {
  fr = fr || 1;
  const sx = i => 8 + i * 12;
  const ry = j => 20 + j * 13;
  let s = `<svg viewBox="0 0 80 98" xmlns="http://www.w3.org/2000/svg">`;
  if (fr === 1) {
    s += `<rect x="6" y="20" width="62" height="3.5" fill="#22d3ee" rx="1"/>`;
  } else {
    s += `<text x="73" y="30" font-size="7" font-family="JetBrains Mono,monospace" fill="#4a7a8a">${fr}fr</text>`;
  }
  for (let j = 0; j <= 5; j++) s += `<line x1="8" y1="${ry(j)}" x2="68" y2="${ry(j)}" stroke="rgba(34,211,238,0.25)" stroke-width="0.8"/>`;
  for (let i = 0; i < 6; i++) s += `<line x1="${sx(i)}" y1="20" x2="${sx(i)}" y2="${ry(5)}" stroke="rgba(34,211,238,0.30)" stroke-width="0.7"/>`;
  const active = frets.filter(f => f > 0);
  if (active.length) {
    const minF = Math.min(...active);
    const barIdx = frets.reduce((a, f, i) => f === minF ? [...a, i] : a, []);
    if (barIdx.length >= 4) {
      const by = ry(minF - fr) + 6.5;
      s += `<rect x="${sx(barIdx[0])-4}" y="${by-5.5}" width="${sx(barIdx[barIdx.length-1])-sx(barIdx[0])+8}" height="11" fill="url(#dg)" rx="5.5" opacity="0.88"/>`;
    }
  }
  for (let i = 0; i < 6; i++) {
    const f = frets[i], x = sx(i);
    if (f === -1) {
      s += `<text x="${x}" y="16" text-anchor="middle" font-size="10" fill="#4a7a8a" font-family="sans-serif">×</text>`;
    } else if (f === 0) {
      s += `<circle cx="${x}" cy="13" r="3.5" fill="none" stroke="#4a7a8a" stroke-width="1"/>`;
    } else {
      const row = f - fr;
      if (row >= 0 && row < 5) {
        s += `<circle cx="${x}" cy="${ry(row)+6.5}" r="5.5" fill="url(#dg)"/>`;
      }
    }
  }
  return s + '</svg>';
}

// Track which variant is currently shown for each chord (key = "Name|type")
let chordVariantIdx = {};

function renderChords() {
  const query  = (document.getElementById('chord-search')?.value || '').toLowerCase();
  const grid   = document.getElementById('chords-grid');

  // Filter chords first
  const filtered = CHORDS.filter(c => {
    if (curChordType !== 'all' && c.t !== curChordType) return false;
    if (query && !c.n.toLowerCase().includes(query)) return false;
    return true;
  });

  // Group by name + type (preserves order — first occurrence becomes group leader)
  const groups   = new Map();
  const groupKeys = [];
  filtered.forEach(c => {
    const key = `${c.n}|${c.t}`;
    if (!groups.has(key)) { groups.set(key, []); groupKeys.push(key); }
    groups.get(key).push(c);
  });

  if (!groupKeys.length) {
    grid.innerHTML = `<div style="color:var(--text-muted);padding:32px;grid-column:1/-1;text-align:center;">No chords found</div>`;
    return;
  }

  grid.innerHTML = groupKeys.map(key => {
    const variants = groups.get(key);
    const total    = variants.length;
    const idx      = (chordVariantIdx[key] || 0) % total;
    const c        = variants[idx];
    const fStr     = c.f.map(f => f === -1 ? 'x' : f).join('');
    const hasMulti = total > 1;

    return `<div class="chord-card" onclick="arpeggiate(${JSON.stringify(c.f)})" data-key="${key}">
      ${c.b ? `<span class="barre-badge">fr${c.fr}${c.shape ? ' · '+c.shape : ''}</span>` : ''}
      <div class="chord-card-name">${c.n}</div>
      <div class="chord-type-label">${CHORD_TYPE_LABELS[c.t]}</div>
      <div class="chord-diagram">${cSVG(c.f, c.fr)}</div>
      <div class="chord-fingering">${fStr}</div>
      ${hasMulti ? `
        <div class="variant-nav" onclick="event.stopPropagation()">
          <button class="variant-arrow" onclick="cycleVariant('${key}',-1,event)" title="Previous position">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <span class="variant-counter">${idx + 1} / ${total}</span>
          <button class="variant-arrow" onclick="cycleVariant('${key}',1,event)" title="Next position">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      ` : ''}
    </div>`;
  }).join('');
}

function cycleVariant(key, dir, e) {
  if (e) e.stopPropagation();
  const total = CHORDS.filter(c => `${c.n}|${c.t}` === key).length;
  const cur   = chordVariantIdx[key] || 0;
  chordVariantIdx[key] = ((cur + dir) % total + total) % total;
  renderChords();
}

function buildChordTypeFilter() {
  const row = document.getElementById('chord-type-row');
  row.innerHTML = CHORD_TYPES.map(t =>
    `<button class="filter-pill${t === curChordType ? ' active' : ''}" onclick="setChordType('${t}')">${CHORD_TYPE_LABELS[t]}</button>`
  ).join('');
}
function setChordType(t) {
  curChordType = t;
  buildChordTypeFilter();
  renderChords();
}

function arpeggiate(frets) {
  // Strum from low E to high E with a long ring-out.
  const items = frets
    .map((f, i) => ({ f, i, delay: i * 32 }))
    .filter(item => item.f >= 0);
  scheduleNoteSequence(items, ({ f, i }) => {
    const velocity = 0.42 + (5 - i) * 0.02;
    playNote(OPEN_STRINGS[i] + f, 4.8, velocity);
  });
}

