/* ═══════════════════════════════════════════════════════════════════════════
   CHORD TRANSPOSER
══════════════════════════════════════════════════════════════════════════════ */
const ENHARMONIC = {'Cb':'B','Db':'C#','Eb':'D#','Fb':'E','Gb':'F#','Ab':'G#','Bb':'A#'};
const SHARP_NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

function trpToSharp(n) { return ENHARMONIC[n] || n; }
function trpNoteIdx(n) { return SHARP_NOTES.indexOf(trpToSharp(n)); }

function trpShiftNote(note, semis) {
  const idx = trpNoteIdx(note);
  if (idx < 0) return note;
  return SHARP_NOTES[((idx + semis) % 12 + 12) % 12];
}

function trpShift(n) {
  trpOffset += n;
  trpUpdate();
}

function trpReset() {
  trpOffset = 0;
  document.getElementById('trp-detect-banner').style.display = 'none';
  trpUpdate();
}

function trpDetectKey() {
  const text  = document.getElementById('trp-input').value;
  const regex = /\b([A-G][#b]?)\b/g;
  const freq  = {};
  let m;
  while ((m = regex.exec(text)) !== null) {
    const k = trpToSharp(m[1]); freq[k] = (freq[k] || 0) + 1;
  }
  if (!Object.keys(freq).length) return;
  const detected = Object.entries(freq).sort((a,b) => b[1]-a[1])[0][0];
  const banner   = document.getElementById('trp-detect-banner');
  banner.style.display = 'block';
  banner.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> &nbsp;Detected key: <strong>${detected}</strong> (most frequent root)`;
}

function trpUpdate() {
  const input  = document.getElementById('trp-input').value;
  const keyEl  = document.getElementById('trp-key-display');
  const output = document.getElementById('trp-output');

  const baseKey = trpOffset === 0 ? '—' : SHARP_NOTES[((trpOffset % 12) + 12) % 12];
  keyEl.textContent = trpOffset === 0 ? '—' : (trpOffset > 0 ? `+${trpOffset}` : `${trpOffset}`);

  if (!input.trim()) { output.textContent = ''; return; }

  const regex = /\b([A-G][#b]?(?:maj7?|min7?|m7?|add9|sus[24]?|aug|dim|b5|7|9|11|13)?(?:\/[A-G][#b]?)?)\b/g;
  const escaped = input.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  const result = escaped.replace(regex, (match) => {
    const slashIdx = match.indexOf('/');
    if (slashIdx > -1) {
      const root    = match.slice(0, slashIdx);
      const bass    = match.slice(slashIdx + 1);
      const rootM   = root.match(/^[A-G][#b]?/);
      const bassM   = bass.match(/^[A-G][#b]?/);
      if (!rootM || !bassM) return match;
      const newRoot = trpShiftNote(rootM[0], trpOffset) + root.slice(rootM[0].length);
      const newBass = trpShiftNote(bassM[0], trpOffset);
      return `<span class="chord-hl">${newRoot}/${newBass}</span>`;
    }
    const noteM = match.match(/^[A-G][#b]?/);
    if (!noteM) return match;
    const newNote  = trpShiftNote(noteM[0], trpOffset);
    const suffix   = match.slice(noteM[0].length);
    return `<span class="chord-hl">${newNote}${suffix}</span>`;
  });

  output.innerHTML = result;
}

// Pre-load a sample song
function trpLoadSample() {
  const sample = `[Verse]
G          Em
Knockin' on heaven's door
C                D
Mama, take this badge off of me
G          Em
I can't use it anymore
C                D
It's gettin' dark, too dark to see

[Chorus]
G      D        Am
Knock, knock, knockin' on heaven's door
G      D        C
Knock, knock, knockin' on heaven's door`;
  const el = document.getElementById('trp-input');
  if (el && !el.value) el.value = sample;
}

