/* ═══════════════════════════════════════════════════════════════════════════
   SCALES LIBRARY
══════════════════════════════════════════════════════════════════════════════ */
let scaleFilters   = { genre: 'All', diff: 'All', type: 'All' };
let selectedScale  = null;
let scalesInit     = false;
let hearScaleTimer = null;

function setScaleFilter(cat, val) {
  scaleFilters[cat] = val;
  document.querySelectorAll(`#sf-${cat} .filter-pill`).forEach(p => {
    p.classList.toggle('active', p.dataset.val === val);
  });
  selectedScale = null;
  document.getElementById('scale-detail').style.display = 'none';
  renderScalesGrid();
}

function renderScalesGrid() {
  const grid = document.getElementById('scales-grid');
  const { genre, diff, type } = scaleFilters;

  const filtered = Object.entries(SCALES).filter(([, s]) => {
    if (genre !== 'All' && s.g !== genre) return false;
    if (diff  !== 'All' && s.d !== diff)  return false;
    if (type  !== 'All' && s.c !== type)  return false;
    return true;
  });

  if (!filtered.length) {
    grid.innerHTML = `<div class="scales-empty"><i class="fa-solid fa-magnifying-glass"></i>No scales match the current filters.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(([key, s]) => {
    const noteNames = s.i.map(iv => NOTES[(iv) % 12]).join('  ');
    const diffClass = s.d === 'Beginner' ? 'badge-diff-beginner'
                    : s.d === 'Intermediate' ? 'badge-diff-intermediate'
                    : 'badge-diff-advanced';
    const isSelected = selectedScale === key;
    return `<div class="scale-card${isSelected ? ' selected' : ''}" onclick="showScaleDetail('${key}')">
      <div class="scale-card-name">${s.n}</div>
      <div class="scale-badges">
        <span class="badge badge-genre">${s.g}</span>
        <span class="badge ${diffClass}">${s.d}</span>
        <span class="badge badge-type">${s.c}</span>
      </div>
      <div class="scale-card-notes">${noteNames}</div>
      <div class="scale-card-desc">${s.desc}</div>
    </div>`;
  }).join('');
}

function showScaleDetail(key) {
  selectedScale = key;
  const s = SCALES[key];
  const detail = document.getElementById('scale-detail');

  // Compute note names in C (rootIdx = 0)
  const pills = s.i.map((iv, idx) => {
    const noteName = NOTES[iv % 12];
    return `<span class="note-pill ${idx === 0 ? 'root' : 'other'}">${noteName}</span>`;
  }).join('');

  detail.innerHTML = `
    <div class="detail-name">${s.n}</div>
    <div class="note-pills">${pills}</div>
    <div class="detail-actions">
      <button class="btn btn-gold" onclick="viewScaleOnFretboard('${key}')">
        <i class="fa-solid fa-guitar"></i> View on Fretboard
      </button>
      <button class="btn btn-wood" onclick="hearScale('${key}')">
        <i class="fa-solid fa-play"></i> Hear Scale
      </button>
    </div>
    <div class="detail-desc">
      <strong style="color:var(--cream);">Key of C &nbsp;·&nbsp;</strong>
      <span style="font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--maple);">
        ${s.i.map(iv => NOTES[iv % 12]).join(' – ')}
      </span><br><br>
      ${s.desc}
      &nbsp;<span style="color:var(--text-muted);">${s.i.length} notes &nbsp;·&nbsp; ${s.g} &nbsp;·&nbsp; ${s.d}</span>
    </div>`;

  detail.style.display = 'block';
  detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Refresh grid to show selection highlight
  renderScalesGrid();
}

function hearScale(key) {
  const s = SCALES[key];
  const rootMidi = 60; // C4
  const allIntervals = [...s.i, 12]; // play scale + octave
  const items = allIntervals.map((iv, idx) => ({ iv, delay: idx * 380 }));
  scheduleNoteSequence(items, ({ iv }) => playNote(rootMidi + iv, 0.7));
}

function viewScaleOnFretboard(key) {
  // Map SCALES key to fb-scale select option value
  document.getElementById('fb-root').value = '0'; // C
  document.getElementById('fb-scale').value = key;
  setFbView('notes');
  go('fretboard');
}

