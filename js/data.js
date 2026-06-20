/* ═══════════════════════════════════════════════════════════════════════════
   GLOBAL STATE
══════════════════════════════════════════════════════════════════════════════ */
let OPEN_STRINGS = [40,45,50,55,59,64]; // MIDI: low E → high E
let fbViewMode   = 'notes';
let trpOffset    = 0;
let tunerOn      = false;
let smoothedFreq = null;
let smoothedCents = 0;
let cofSelected  = null;
let curGenre     = 'all';
let songPage     = 0;
let mBpm         = 120;
let mBeat        = 0;
let mSig         = 4;
let mOn          = false;
let done;
try {
  done = JSON.parse(localStorage.getItem('ff4_done') || '{}');
} catch {
  done = {};
}

/* ─── CONSTANTS ──────────────────────────────────────────────────────────── */
const NOTES          = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const INTERVAL_NAMES = ['R','b2','2','b3','3','4','b5','5','b6','6','b7','7'];

/* ─── SCALES DATA ────────────────────────────────────────────────────────── */
const SCALES = {
  major:      { n:'Major (Ionian)',              i:[0,2,4,5,7,9,11],      g:'Rock',       d:'Beginner',     c:'Diatonic',   desc:'The foundation of Western music — bright and uplifting.' },
  dorian:     { n:'Dorian',                      i:[0,2,3,5,7,9,10],      g:'Rock',       d:'Intermediate', c:'Diatonic',   desc:'Minor with a raised 6th — soulful and bluesy.' },
  phrygian:   { n:'Phrygian',                    i:[0,1,3,5,7,8,10],      g:'Metal',      d:'Intermediate', c:'Diatonic',   desc:'Dark and Spanish-sounding, built on the third degree.' },
  lydian:     { n:'Lydian',                      i:[0,2,4,6,7,9,11],      g:'Jazz',       d:'Intermediate', c:'Diatonic',   desc:'Major with a raised 4th — dreamy and ethereal.' },
  mixolydian: { n:'Mixolydian',                  i:[0,2,4,5,7,9,10],      g:'Rock',       d:'Intermediate', c:'Diatonic',   desc:'Major with a flat 7th — the classic rock and blues mode.' },
  aeolian:    { n:'Natural Minor (Aeolian)',      i:[0,2,3,5,7,8,10],      g:'Rock',       d:'Beginner',     c:'Diatonic',   desc:'The natural minor scale — melancholic and expressive.' },
  locrian:    { n:'Locrian',                     i:[0,1,3,5,6,8,10],      g:'Metal',      d:'Advanced',     c:'Diatonic',   desc:'The darkest mode — dissonant and unstable.' },
  pent_maj:   { n:'Pentatonic Major',            i:[0,2,4,7,9],           g:'Rock',       d:'Beginner',     c:'Pentatonic', desc:'Five notes of pure brightness — essential for country and rock.' },
  pent_min:   { n:'Pentatonic Minor',            i:[0,3,5,7,10],          g:'Rock',       d:'Beginner',     c:'Pentatonic', desc:'The most-used scale in rock and blues soloing.' },
  blues:      { n:'Blues Scale',                 i:[0,3,5,6,7,10],        g:'Blues',      d:'Beginner',     c:'Blues',      desc:'Pentatonic minor with the "blue note" tritone added.' },
  blues_maj:  { n:'Blues Major',                 i:[0,2,3,4,7,9],         g:'Blues',      d:'Intermediate', c:'Blues',      desc:'Major pentatonic enriched with a chromatic passing tone.' },
  harm_min:   { n:'Harmonic Minor',              i:[0,2,3,5,7,8,11],      g:'Classical',  d:'Intermediate', c:'Modal',      desc:'Natural minor with raised 7th — exotic and dramatic.' },
  mel_min:    { n:'Melodic Minor',               i:[0,2,3,5,7,9,11],      g:'Jazz',       d:'Intermediate', c:'Modal',      desc:'Ascending melodic minor — used extensively in jazz.' },
  harm_maj:   { n:'Harmonic Major',              i:[0,2,4,5,7,8,11],      g:'Classical',  d:'Advanced',     c:'Modal',      desc:'Major scale with a flat 6th — regal and exotic.' },
  phryg_dom:  { n:'Phrygian Dominant',           i:[0,1,4,5,7,8,10],      g:'Flamenco',   d:'Advanced',     c:'Exotic',     desc:'The flamenco scale — passionate, Spanish and Moorish.' },
  byzantine:  { n:'Double Harmonic (Byzantine)', i:[0,1,4,5,7,8,11],      g:'World',      d:'Advanced',     c:'Exotic',     desc:'Symmetrical scale evoking Middle Eastern and Byzantine music.' },
  hijaz:      { n:'Arabic / Hijaz',              i:[0,2,3,6,7,8,10],      g:'World',      d:'Advanced',     c:'Exotic',     desc:'Central to Arabic maqam music — tense and yearning.' },
  hung_min:   { n:'Hungarian Minor',             i:[0,2,3,6,7,8,11],      g:'World',      d:'Advanced',     c:'Exotic',     desc:'Gypsy minor with raised 4th — fiery Eastern European flavour.' },
  neap_min:   { n:'Neapolitan Minor',            i:[0,1,3,5,7,8,11],      g:'Classical',  d:'Advanced',     c:'Exotic',     desc:'Rare scale favoured by Romantic composers.' },
  romanian:   { n:'Romanian Minor',              i:[0,2,3,6,7,9,10],      g:'World',      d:'Advanced',     c:'Exotic',     desc:'Dorian with raised 4th — vibrant folk flavour.' },
  enigmatic:  { n:'Enigmatic',                   i:[0,1,4,6,8,10,11],     g:'World',      d:'Advanced',     c:'Exotic',     desc:'Invented by Verdi — mysterious and unresolvable.' },
  persian:    { n:'Persian',                     i:[0,1,4,5,6,8,11],      g:'World',      d:'Advanced',     c:'Exotic',     desc:'Ancient scale of the Persian Empire — otherworldly tension.' },
  whole_tone: { n:'Whole Tone',                  i:[0,2,4,6,8,10],        g:'Jazz',       d:'Advanced',     c:'Symmetric',  desc:'Six whole steps — completely ambiguous and dreamlike.' },
  dim_wh:     { n:'Diminished (W-H)',            i:[0,2,3,5,6,8,9,11],    g:'Jazz',       d:'Advanced',     c:'Symmetric',  desc:'Eight-note symmetric scale alternating whole and half steps.' },
  dim_hw:     { n:'Diminished (H-W)',            i:[0,1,3,4,6,7,9,10],    g:'Jazz',       d:'Advanced',     c:'Symmetric',  desc:'Eight-note scale alternating half and whole steps.' },
  augmented:  { n:'Augmented',                   i:[0,3,4,7,8,11],        g:'Jazz',       d:'Advanced',     c:'Symmetric',  desc:'Six-note symmetric scale built from two augmented triads.' },
  prometheus: { n:'Prometheus',                  i:[0,2,4,6,9,10],        g:'Jazz',       d:'Advanced',     c:'Symmetric',  desc:"Scriabin's mystic scale — impressionistic and ethereal." },
  bebop_dom:  { n:'Bebop Dominant',              i:[0,2,4,5,7,9,10,11],   g:'Jazz',       d:'Advanced',     c:'Bebop',      desc:"Mixolydian with added major 7 — Charlie Parker's foundation." },
  bebop_maj:  { n:'Bebop Major',                 i:[0,2,4,5,7,8,9,11],    g:'Jazz',       d:'Advanced',     c:'Bebop',      desc:'Major scale with added chromatic passing tone.' },
  bebop_min:  { n:'Bebop Minor',                 i:[0,2,3,4,5,7,9,10],    g:'Jazz',       d:'Advanced',     c:'Bebop',      desc:'Dorian with added chromatic between b3 and 4.' },
  jazz_mel:   { n:'Jazz Melodic Minor',          i:[0,2,3,5,7,9,11],      g:'Jazz',       d:'Advanced',     c:'Bebop',      desc:'Ascending melodic minor — the mother of jazz harmony.' },
  yo:         { n:'Yo',                          i:[0,2,5,7,9],           g:'World',      d:'Intermediate', c:'Japanese',   desc:'Traditional Japanese pentatonic scale — bright and open.' },
  in_scale:   { n:'In',                          i:[0,1,5,7,8],           g:'World',      d:'Intermediate', c:'Japanese',   desc:'Japanese minor pentatonic — subtle and introspective.' },
  hirajoshi:  { n:'Hirajoshi',                   i:[0,2,3,7,8],           g:'World',      d:'Intermediate', c:'Japanese',   desc:'Japanese koto scale — contemplative and austere.' },
  iwato:      { n:'Iwato',                       i:[0,1,5,6,10],          g:'World',      d:'Advanced',     c:'Japanese',   desc:'Darkest Japanese scale — mysterious and unsettling.' },
  insen:      { n:'Insen',                       i:[0,1,5,7,10],          g:'World',      d:'Intermediate', c:'Japanese',   desc:'Sparse Japanese pentatonic with an eerie minor quality.' },
  octatonic:  { n:'Octatonic',                   i:[0,1,3,4,6,7,9,10],    g:'Jazz',       d:'Advanced',     c:'Symmetric',  desc:'Eight-note symmetric scale used in 20th-century classical music.' },
};

