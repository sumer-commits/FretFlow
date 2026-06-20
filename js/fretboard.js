/* ═══════════════════════════════════════════════════════════════════════════
   FRETBOARD
══════════════════════════════════════════════════════════════════════════════ */
let fbInitialised = false;

function setFbView(mode) {
  fbViewMode = mode;
  ['notes','intervals','dots'].forEach(m => {
    document.getElementById('vm-' + m).classList.toggle('active', m === mode);
  });
  renderFretboard();
}

function renderFretboard() {
  const rootIdx   = parseInt(document.getElementById('fb-root').value);
  const scaleKey  = document.getElementById('fb-scale').value;
  const fretCount = parseInt(document.getElementById('fb-frets').value);

  const scale       = SCALES[scaleKey] || SCALES.major;
  const intervals   = scale.i;
  const intervalSet = new Set(intervals);

  // Layout constants
  const NUT_X  = 58;
  const FRET_W = fretCount <= 12 ? 62 : fretCount <= 15 ? 56 : fretCount <= 17 ? 52 : fretCount <= 22 ? 46 : 42;
  const TOP_Y  = 36;
  const BOT_Y  = 168;
  const svgW   = NUT_X + fretCount * FRET_W + 20;
  const svgH   = 220;
  const strY   = s => TOP_Y + s * (BOT_Y - TOP_Y) / 5;

  // String aesthetics (string 0 = low E, string 5 = high E) — silvery cyan
  const strThick  = [3.2, 2.6, 2.2, 1.8, 1.5, 1.2];
  const strColors = ['#5eead4','#67e8f9','#7dd3fc','#a5f3fc','#bae6fd','#cffafe'];
  const openLabels = ['E','A','D','G','B','e'];

  let s = `<svg viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}" xmlns="http://www.w3.org/2000/svg">`;

  // Defs — Arctic cyan for root, dark navy for scale notes
  s += `<defs>
    <radialGradient id="rg_root" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#67e8f9"/>
      <stop offset="60%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#0e7490"/>
    </radialGradient>
    <radialGradient id="rg_note" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#1a3047"/>
      <stop offset="100%" stop-color="#060c14"/>
    </radialGradient>
  </defs>`;

  // Background fretboard strip
  s += `<rect x="${NUT_X}" y="${TOP_Y - 2}" width="${fretCount * FRET_W}" height="${BOT_Y - TOP_Y + 4}" fill="rgba(34,211,238,0.04)" stroke="rgba(34,211,238,0.10)" stroke-width="1" rx="2"/>`;

  // Position markers
  const midY = (TOP_Y + BOT_Y) / 2;
  [3,5,7,9,12,15,17,19,21,24].filter(f => f <= fretCount).forEach(f => {
    const mx = NUT_X + (f - 0.5) * FRET_W;
    if (f === 12 || f === 24) {
      s += `<circle cx="${mx}" cy="${midY - 10}" r="4.5" fill="rgba(34,211,238,0.18)"/>`;
      s += `<circle cx="${mx}" cy="${midY + 10}" r="4.5" fill="rgba(34,211,238,0.18)"/>`;
    } else {
      s += `<circle cx="${mx}" cy="${midY}" r="4.5" fill="rgba(34,211,238,0.18)"/>`;
    }
  });

  // Fret lines
  for (let f = 1; f <= fretCount; f++) {
    const x = NUT_X + f * FRET_W;
    s += `<line x1="${x}" y1="${TOP_Y - 1}" x2="${x}" y2="${BOT_Y + 1}" stroke="rgba(34,211,238,0.18)" stroke-width="1.5"/>`;
  }

  // Nut
  s += `<rect x="${NUT_X - 7}" y="${TOP_Y - 2}" width="7" height="${BOT_Y - TOP_Y + 4}" fill="url(#rg_root)" rx="1" opacity="0.9"/>`;
  s += `<rect x="${NUT_X - 7}" y="${TOP_Y - 2}" width="7" height="${BOT_Y - TOP_Y + 4}" fill="none" stroke="rgba(34,211,238,0.5)" stroke-width="0.5" rx="1"/>`;

  // Strings + open string labels + notes on open strings
  for (let st = 0; st < 6; st++) {
    const y         = strY(st);
    const openMidi  = OPEN_STRINGS[st];

    s += `<line x1="${NUT_X}" y1="${y}" x2="${NUT_X + fretCount * FRET_W}" y2="${y}" stroke="${strColors[st]}" stroke-width="${strThick[st]}" stroke-linecap="round" opacity="0.85"/>`;
    s += `<text x="${NUT_X - 16}" y="${y + 4}" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="11" fill="#4a7a8a">${openLabels[st]}</text>`;

    const openInterval = ((openMidi % 12) - rootIdx + 12) % 12;
    if (intervalSet.has(openInterval)) {
      const isRoot = openInterval === 0;
      const r = isRoot ? 12 : 10;
      const ox = NUT_X - 30;
      const lbl = fbViewMode === 'notes' ? NOTES[openMidi % 12] : fbViewMode === 'intervals' ? INTERVAL_NAMES[openInterval] : '';
      if (isRoot) s += `<circle cx="${ox}" cy="${y}" r="${r + 4}" fill="rgba(34,211,238,0.12)" stroke="rgba(34,211,238,0.35)" stroke-width="1"/>`;
      s += `<circle cx="${ox}" cy="${y}" r="${r}" fill="${isRoot ? 'url(#rg_root)' : 'url(#rg_note)'}" stroke="${isRoot ? 'rgba(34,211,238,0.7)' : 'rgba(129,140,248,0.5)'}" stroke-width="1" onclick="playNote(${openMidi})" style="cursor:pointer"/>`;
      if (fbViewMode !== 'dots') {
        s += `<text x="${ox}" y="${y + 4}" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="${isRoot ? 9 : 8}" fill="${isRoot ? '#060c14' : '#e8f4f8'}" font-weight="${isRoot ? '700' : '400'}" pointer-events="none">${lbl}</text>`;
      } else {
        s += `<circle cx="${ox}" cy="${y}" r="3" fill="${isRoot ? '#060c14' : '#e8f4f8'}" pointer-events="none"/>`;
      }
    }

    for (let f = 1; f <= fretCount; f++) {
      const midi     = openMidi + f;
      const interval = ((midi % 12) - rootIdx + 12) % 12;
      if (!intervalSet.has(interval)) continue;

      const isRoot = interval === 0;
      const r  = isRoot ? 12 : 10;
      const x  = NUT_X + (f - 0.5) * FRET_W;
      const lbl = fbViewMode === 'notes' ? NOTES[midi % 12] : fbViewMode === 'intervals' ? INTERVAL_NAMES[interval] : '';

      if (isRoot) {
        s += `<circle cx="${x}" cy="${y}" r="${r + 4}" fill="rgba(34,211,238,0.12)" stroke="rgba(34,211,238,0.35)" stroke-width="1"/>`;
      }
      s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${isRoot ? 'url(#rg_root)' : 'url(#rg_note)'}" stroke="${isRoot ? 'rgba(34,211,238,0.7)' : 'rgba(129,140,248,0.5)'}" stroke-width="1" onclick="playNote(${midi})" style="cursor:pointer"/>`;
      if (fbViewMode !== 'dots') {
        s += `<text x="${x}" y="${y + 4}" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="${isRoot ? 9 : 8}" fill="${isRoot ? '#060c14' : '#e8f4f8'}" font-weight="${isRoot ? '700' : '400'}" pointer-events="none">${lbl}</text>`;
      } else {
        s += `<circle cx="${x}" cy="${y}" r="3" fill="${isRoot ? '#060c14' : '#e8f4f8'}" pointer-events="none"/>`;
      }
    }
  }

  // Fret numbers below the board
  for (let f = 1; f <= fretCount; f++) {
    const x = NUT_X + (f - 0.5) * FRET_W;
    s += `<text x="${x}" y="${BOT_Y + 20}" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#4a7a8a">${f}</text>`;
  }

  s += '</svg>';
  document.getElementById('fb-container').innerHTML = s;
}

