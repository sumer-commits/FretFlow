/* ─── NAVIGATION ─────────────────────────────────────────────────────────── */
const SECTIONS = ['home','fretboard','scales','chords','cof','transposer','tuner','songs','learn'];

function go(id) {
  SECTIONS.forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.toggle('active', s === id);
  });
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${id}'`)) {
      btn.classList.add('active');
    }
  });
  // Lazy-init sections on first visit
  if (id === 'fretboard' && !fbInitialised) {
    fbInitialised = true;
    renderFretboard();
  }
  if (id === 'scales' && !scalesInit) {
    scalesInit = true;
    renderScalesGrid();
  }
  if (id === 'chords' && !chordsInit) {
    chordsInit = true;
    buildChordTypeFilter();
    renderChords();
  }
  if (id === 'cof' && !cofInit) {
    cofInit = true;
    const c = document.getElementById('cof-canvas');
    c.addEventListener('click', cofClick);
    drawCOF();
  }
  if (id === 'songs' && !songsInit) {
    songsInit = true;
    buildGenreTabs();
    renderSongs();
    renderFlamenco();
  }
  if (id === 'learn' && !learnInit) {
    learnInit = true;
    buildPathTabs();
    renderLessons();
  }
  if (id === 'tuner' && !tunerInit) {
    tunerInit = true;
    initTuner();
  }
  // Stop tuner if navigating away
  if (id !== 'tuner' && tunerOn) stopTuner();
  if (id === 'transposer' && !document.getElementById('trp-input').value) {
    trpLoadSample();
    trpUpdate();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Close metronome on outside click
document.getElementById('metro-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeMetronome();
});

/* ─── INIT ───────────────────────────────────────────────────────────────── */
go('home');
