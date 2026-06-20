# FretFlow — Guitar Learning Platform
## Claude Code Project Prompt

---

## Project Overview

Build **FretFlow v4**, a production-ready, fully self-contained single-file HTML guitar learning web application. The app must run entirely in the browser with no backend, no build step, no external dependencies beyond CDN-hosted fonts and icons, and no account or login required.

The aesthetic is **warm acoustic guitar** — mahogany, spruce, maple, and gold tones — using the Playfair Display serif font for headings and Inter for body text. The UI should feel handcrafted and premium, like the inside of a fine acoustic guitar, not a tech startup dashboard.

---

## Tech Stack

- **Single file**: One `.html` file containing all HTML, CSS, and JavaScript inline
- **Fonts**: Google Fonts CDN — `Playfair Display` (headings), `Inter` (body), `JetBrains Mono` (code/labels)
- **Icons**: Font Awesome 6.5.1 via CDN (`fa-solid` class icons only — no emoji anywhere in the UI)
- **Audio**: Web Audio API (native browser, no library)
- **Canvas**: Native HTML5 Canvas for tuner meter, metronome pendulum, Circle of Fifths
- **Storage**: `localStorage` for lesson progress persistence
- **No frameworks**: Vanilla JS only — no React, Vue, or jQuery
- **No emoji**: Replace all emoji with Font Awesome icons throughout

---

## Design System

### Colour Tokens (CSS custom properties on `:root`)

```css
--wood-dark:     #1a0f08   /* page background */
--wood-mid:      #2d1a0e   /* card base */
--wood-light:    #3d2412   /* card hover */
--wood-grain:    #4a2e18   /* button base */
--wood-highlight:#5c3a20   /* button hover */
--mahogany:      #7d3f1e   /* accent dark */
--walnut:        #8b5e3c   /* scale note dots */
--maple:         #c8956b   /* secondary text highlight */
--spruce:        #e8d5b0   /* light text on dark */
--cream:         #f5edd8   /* primary text on dark */
--parchment:     #faf4e8   /* input text */
--gold:          #d4a443   /* primary accent */
--gold-bright:   #e8b84b   /* hover accent */
--gold-glow:     #f0c060   /* glow effects */
--amber:         #c27c2a   /* secondary accent */
--rust:          #b54e1a   /* danger / flamenco */
--copper:        #a0522d   /* tertiary */
--string-color:  #c8a84b   /* fretboard strings */
--text-primary:  #2d1a0e
--text-sec:      #5a3a22
--text-muted:    #8a6a50
--text-light:    #c8a880
--text-on-dark:  #f5edd8
--border-warm:   rgba(200,149,107,0.25)
--border-gold:   rgba(212,164,67,0.4)
```

### Typography
- Headings: `font-family: 'Playfair Display', serif; font-weight: 700–900;`
- Body: `font-family: 'Inter', sans-serif; font-size: 14px;`
- Monospace (frets, chords, Hz): `font-family: 'JetBrains Mono', monospace;`

### Body Background — Wood Grain Texture
Apply a subtle repeating CSS gradient on `body` to simulate wood grain:
```css
background-image:
  repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(90,58,34,0.04) 3px, rgba(90,58,34,0.04) 4px),
  repeating-linear-gradient(180deg, transparent 0px, transparent 8px, rgba(60,36,18,0.06) 8px, rgba(60,36,18,0.06) 9px);
```

### Cards
- `background: linear-gradient(135deg, var(--wood-mid), var(--wood-light))`
- `border: 1px solid var(--border-warm)`
- `border-radius: 12px`
- Top-edge gold inlay: `position:absolute; top:0; left:0; right:0; height:1px; background: linear-gradient(90deg, transparent, var(--gold), transparent)`

### Buttons
Three variants:
1. `btn-gold` — gradient amber/gold, dark text, primary actions
2. `btn-wood` — dark wood gradient, cream text, secondary actions
3. `btn-ghost` — no background, warm border, muted text

All buttons use `display:inline-flex; align-items:center; gap:7px` to pair icons with text.

---

## Navigation

Sticky top nav (`position:sticky; top:0; z-index:200`) with:
- `backdrop-filter: blur(20px)` + semi-transparent background
- Gold bottom border
- Logo: "FretFlow" in Playfair Display, gold colour
- Nav buttons for each section (icon + label)

Sections (nav order):
1. Home
2. Fretboard
3. Scales
4. Chords
5. Circle of Fifths
6. Transposer
7. Tuner
8. Songs
9. Learn
10. Metronome (opens overlay, not a section)

Each `section` div is `display:none` by default; `display:block` when active. Use a `go(id)` JS function to switch sections and update nav button active states.

---

## Section Specifications

### 1. Home

**Hero area:**
- Full-width, no CTA buttons on the hero — just the large `FretFlow` title and a short tagline
- Animated breathing guitar body silhouette (CSS `border-radius` ellipse + `@keyframes breathe` scale animation)
- `FretFlow` in very large Playfair Display, gradient text (spruce → gold → maple)
- Subtitle in small uppercase Inter, gold colour
- Thin gold horizontal rule divider

**Tools grid:**
- `display: grid; grid-template-columns: repeat(auto-fill, minmax(145px, 1fr))`
- 9 cards: Fretboard, Scales, Chords, Circle of Fifths, Transposer, Tuner, Songs, Learn, Metronome
- Each card has: icon in a styled box, name in Playfair Display, description in small Inter
- Hover: `transform: translateY(-3px)` + gold border glow
- No emoji on cards — use Font Awesome icons

---

### 2. Fretboard

**Controls row:**
- Root Note `<select>` (all 12 chromatic notes: C C# D D# E F F# G G# A A# B)
- Scale Type `<select>` (grouped `<optgroup>` — see scale list below)
- View Mode toggle buttons: Notes | Intervals | Dots
- Fret count `<select>`: 12, 15, 17, 22, 24

**SVG Fretboard (`<svg id="fb-svg">`):**
- Viewbox: `0 0 900 220`, minimum width 720px (horizontally scrollable on mobile)
- 6 strings rendered as horizontal lines, thickness increasing low-to-high (1.5px to 3.2px)
- String colours: golden-amber tones simulating wound/plain strings
- Nut: thick vertical rectangle at left edge
- Fret lines: thin vertical lines across all strings
- Fret position markers at frets 3, 5, 7, 9, 12 (double dot), 15, 17, 19, 21, 24
- Fret numbers below the board
- Open string note labels (e.g. "E", "A") left of nut
- Notes in scale rendered as circles:
  - Root note: larger (r=12), radial gradient gold/amber, with outer glow ring
  - Scale notes: smaller (r=10), dark wood gradient
  - View=Notes: show note name inside circle (e.g. "G")
  - View=Intervals: show interval symbol (R, b2, 2, b3, 3, 4, b5, 5, b6, 6, b7, 7)
  - View=Dots: show only a small dot
- Click any circle → `playNote(midi)` via Web Audio API (triangle oscillator, ~1.2s decay)
- Re-render on any control change

**Legend:** Root note dot (gold), Scale note dot (walnut), below the fretboard

---

### 3. Scales Library

**Filters:**
- Genre: All | Rock | Blues | Jazz | Flamenco | Classical | Metal | World
- Difficulty: All | Beginner | Intermediate | Advanced
- Type: All | Diatonic | Pentatonic | Blues | Modal | Exotic | Symmetric | Bebop | Japanese

**Scale cards grid** (`auto-fill, minmax(200px, 1fr)`):
Each card shows: name, genre/difficulty/type badges, note names in the root key, description

**Scale detail panel** (appears below grid on click):
- Note pills in a row (root pill: gold gradient, other pills: dark wood)
- "View on Fretboard" button → sets fretboard root + scale and navigates to Fretboard
- "Hear Scale" button → plays notes sequentially via Web Audio, ascending + octave at end

**Complete scale list** (implement all of these):

*Diatonic / Major Modes:*
- Major (Ionian): `[0,2,4,5,7,9,11]`
- Dorian: `[0,2,3,5,7,9,10]`
- Phrygian: `[0,1,3,5,7,8,10]`
- Lydian: `[0,2,4,6,7,9,11]`
- Mixolydian: `[0,2,4,5,7,9,10]`
- Natural Minor (Aeolian): `[0,2,3,5,7,8,10]`
- Locrian: `[0,1,3,5,6,8,10]`

*Pentatonic:*
- Pentatonic Major: `[0,2,4,7,9]`
- Pentatonic Minor: `[0,3,5,7,10]`

*Blues:*
- Blues Scale: `[0,3,5,6,7,10]`
- Blues Major: `[0,2,3,4,7,9]`

*Harmonic / Melodic:*
- Harmonic Minor: `[0,2,3,5,7,8,11]`
- Melodic Minor: `[0,2,3,5,7,9,11]`
- Harmonic Major: `[0,2,4,5,7,8,11]`

*Exotic / World:*
- Phrygian Dominant: `[0,1,4,5,7,8,10]`
- Double Harmonic (Byzantine): `[0,1,4,5,7,8,11]`
- Arabic / Hijaz: `[0,2,3,6,7,8,10]`
- Hungarian Minor: `[0,2,3,6,7,8,11]`
- Neapolitan Minor: `[0,1,3,5,7,8,11]`
- Romanian Minor: `[0,2,3,6,7,9,10]`
- Enigmatic: `[0,1,4,6,8,10,11]`
- Persian: `[0,1,4,5,6,8,11]`

*Symmetric:*
- Whole Tone: `[0,2,4,6,8,10]`
- Diminished (W-H): `[0,2,3,5,6,8,9,11]`
- Diminished (H-W): `[0,1,3,4,6,7,9,10]`
- Augmented: `[0,3,4,7,8,11]`
- Prometheus: `[0,2,4,6,9,10]`

*Bebop / Jazz:*
- Bebop Dominant: `[0,2,4,5,7,9,10,11]`
- Bebop Major: `[0,2,4,5,7,8,9,11]`
- Bebop Minor: `[0,2,3,4,5,7,9,10]`
- Jazz Melodic Minor: `[0,2,3,5,7,9,11]`

*Japanese:*
- Yo: `[0,2,5,7,9]`
- In: `[0,1,5,7,8]`
- Hirajoshi: `[0,2,3,7,8]`
- Iwato: `[0,1,5,6,10]`
- Insen: `[0,1,5,7,10]`

*Other:*
- Octatonic: `[0,1,3,4,6,7,9,10]`

---

### 4. Chord Explorer

**Search + Type filter row**

**Chord grid** (`auto-fill, minmax(118px, 1fr)`):
Each chord card shows:
- Barre indicator badge if applicable (with fret number)
- Chord name in Playfair Display, gold
- Type label (monospace, muted)
- SVG chord diagram (6 strings, 5 frets)
  - Nut bar at top
  - Fret lines, string lines
  - "x" for muted strings, "○" for open strings
  - Gold gradient filled circles for fingered frets
- Fingering string below (e.g. `x32010`)
- Click card → arpeggiate chord via Web Audio (45ms delay between strings)

**Chord diagram rendering:**
Build `cSVG(frets)` function that takes a 6-element array (`-1` = muted, `0` = open, `1–5` = fret number) and returns an SVG string.

**Complete chord database** (implement all of these):

*Open Major:* C, G, D, A, E
*Barre Major (E-shape at various frets):* F (fr1), F#/Gb (fr2), G#/Ab (fr4), A#/Bb (fr6), B (fr7), C barre (fr8)
*Barre Major (A-shape):* B (fr2), C (fr3), D (fr5), Eb/D# (fr6)
*Open Minor:* Am, Em, Dm
*Barre Minor (Em-shape):* Fm (fr1), F#m/Gbm (fr2), Gm (fr3), G#m/Abm (fr4)
*Barre Minor (Am-shape):* Bm (fr2), Cm (fr3), C#m/Dbm (fr4), Ebm/D#m (fr6)
*Dominant 7th:* G7, C7, D7, A7, E7, B7, F7 (barre)
*Major 7th:* Cmaj7, Gmaj7, Amaj7, Dmaj7, Emaj7, Fmaj7, Bmaj7
*Minor 7th:* Am7, Em7, Dm7, Bm7, Cm7, F#m7, Fm7
*9th:* G9, C9, D9, A9, E9, Cmaj9, Gmaj9
*11th:* G11, C11, A11
*13th:* G13, C13, A13
*Diminished:* Bdim, Cdim, Ddim, F#dim, Bdim7, Gdim7
*Augmented:* Caug, Eaug, Gaug, Aaug
*Sus/Add:* Dsus2, Asus2, Esus2, Csus2, Gsus2, Dsus4, Esus4, Asus4, Gsus4, Cadd9, Gadd9, Dadd9
*Power chords:* E5, A5, D5, G5, B5, F5, C5

---

### 5. Circle of Fifths

**Canvas-based interactive circle** (`<canvas id="cof-canvas" width="340" height="340">`):

**Visual structure (concentric rings):**
- Outer ring (radius 95–155px): 12 segments, major key labels (C G D A E B F# Db Ab Eb Bb F), clockwise starting top
- Inner ring (radius 48–95px): relative minor labels (Am Em Bm F#m C#m G#m D#m Bbm Fm Cm Gm Dm)
- Center circle (radius 48px): shows selected key name or "Click a key"

**Rendering:**
- Each segment: radial gradient (dark wood centre → lighter wood edge)
- Selected segment: highlighted with amber/gold gradient + thicker gold border stroke
- Key text: Playfair Display, gold when selected, maple when not
- Minor text: Inter, muted colour

**Click interaction:**
- Calculate clicked segment from mouse angle and radius
- Update `cofSelected` variable
- Redraw canvas
- Show info panel to the right of the canvas

**Info panel (shown on key selection):**
- Key name in large Playfair Display heading
- Relative minor box: label + relative minor key name + explanation text
- "Diatonic Chords" section: 3×3 grid (7 chords + 2 empty or show full 7)
  - Each chord cell shows: Roman numeral degree (I ii iii IV V vi vii°), chord name, chord quality (major/minor/dim)
  - Click chord cell → arpeggiate via Web Audio
- "Neighbour keys" text (adjacent keys on the circle, ±1 sharp/flat)
- "View on Fretboard" button → loads that key's major scale on the fretboard
- "Hear Scale" button → plays the scale

**Diatonic chords for all 12 major keys** must be hardcoded. Pattern: I=major, ii=minor, iii=minor, IV=major, V=major, vi=minor, vii°=diminished.

---

### 6. Chord Transposer

**Semitone shift buttons:** −7, −5, −2, −1, +1, +2, +5, +7
**Current key display** (large Playfair, gold)
**Auto-detect Key button** — counts chord root frequency in input, shows result in banner
**Reset button**

**Two-column layout** (stacked on mobile):
- Left panel: `<textarea>` for input (monospace font, dark background)
- Right panel: rendered output div (monospace font)

**Transposition logic:**
- Regex: `/\b([A-G][#b]?(?:maj7?|min7?|m7?|add9|sus[24]?|aug|dim|b5|7|9|11|13)?(?:\/[A-G][#b]?)?)\b/g`
- Map flats to sharps internally for arithmetic, display as sharps
- Handle slash chords (e.g. `G/B` → transpose both)
- Highlight transposed chords with `<span class="chord-hl">` (gold colour)
- Live update on every keystroke in textarea

---

### 7. Chromatic Tuner

**Layout:** Centred, max-width 400px card

**Display elements:**
1. Large note name (Playfair Display, 72px) — colour: green when in tune, gold when close, rust when far
2. Frequency in Hz (monospace, small)
3. Deviation text — e.g. "12.3 cents sharp" or "In tune" (NOT just a number — always explain the unit)
4. Canvas meter (300×160px)
5. Status text (with animated red dot when recording)
6. Start/Stop button (gold gradient)
7. String selector buttons (6 — labelled "6 — E2", "5 — A2", etc.)
8. Target display text (shows target string's frequency)
9. Alternate tunings row

**Tuner meter (Canvas):**
- Arc spanning ~153° (−50 to +50 cents)
- Background arc: dark wood colour
- Zone colouring on arc:
  - ±50 to ±15: rust/red opacity
  - ±15 to ±5: amber opacity
  - ±5 to 0: green opacity
- Centre tick mark at 0
- Needle: line from centre pivot to arc, coloured by in-tune state
- Hub: small radial-gradient circle at pivot
- Labels: "−50", "0", "+50" at arc ends and centre
- "IN TUNE" text displayed in green when within ±5 cents

**Pitch detection algorithm:**
- Use autocorrelation on `Float32Array` from `AnalyserNode` (fftSize=4096)
- RMS gate: skip if signal too quiet (< 0.008 threshold)
- Trim buffer to signal onset
- Find autocorrelation peak → interpolate for sub-sample accuracy
- Return fundamental frequency in Hz

**Smoothing (critical for fluid needle):**
- Apply exponential moving average to detected frequency: `smoothed = smoothed * 0.85 + raw * 0.15`
- Apply same smoothing to cents value separately
- This prevents needle jitter while still being responsive

**Cents explanation (important — display this correctly):**
- 1 cent = 1/100th of a semitone
- Show as: "8.2 cents sharp" (tuned too high) or "5.1 cents flat" (tuned too low)
- In-tune threshold: within ±5 cents
- Close threshold: within ±15 cents

**Alternate tunings** (buttons to reconfigure open string MIDI values):
- Standard EADGBe: [40,45,50,55,59,64]
- Drop D: [38,45,50,55,59,64]
- Eb Standard: [37,44,49,54,58,63]
- D Standard: [36,43,48,53,57,62]
- Open G: [38,43,50,55,59,62]
- Open D: [38,45,50,54,57,62]
- DADGAD: [38,45,50,55,57,62]
- Open E: [40,47,52,56,59,64]

---

### 8. Song Library

**Search bar + difficulty filter** above genre tabs

**Genre tabs** (horizontal scrollable row, pill buttons):
All | Acoustic | Rock | Pop | Blues | Jazz | Folk | Country | Metal | Classical | Flamenco

**Song grid** (`auto-fill, minmax(225px, 1fr)`):
Each card:
- 3px left border (gradient, genre-specific colour)
- Title, Artist
- Chord names pill (monospace, gold, truncated with ellipsis)
- Meta row: BPM, Difficulty badge (green/gold/rust), Capo if applicable, Genre
- Click → opens play-along panel below grid

**Play-along panel:**
- Appears below grid (not modal)
- Song title + artist + meta
- Strum pattern display
- For each section (Verse, Chorus, Bridge etc):
  - Section label (small uppercase, amber)
  - Chord line (monospace, gold, pre-formatted with spacing)
  - Lyric line below chords (body font, muted)
- "Transpose" button → loads song chords into transposer section
- "View Chords" button → navigates to Chord Explorer

**Pagination:** 16 songs per page, numbered page buttons

**Song database** — include complete chord progressions + lyrics for at least these songs across all genres:

*Acoustic:* Knockin' on Heaven's Door (Bob Dylan), Wonderwall (Oasis), Blackbird (Beatles), Tears in Heaven (Clapton), More Than Words (Extreme)
*Rock:* House of the Rising Sun (Animals), Wish You Were Here (Pink Floyd), Sweet Home Alabama (Lynyrd Skynyrd), Smoke on the Water (Deep Purple), Stairway to Heaven (Led Zeppelin), Hotel California (Eagles), Creep (Radiohead), Brown Eyed Girl (Van Morrison), With or Without You (U2), Purple Rain (Prince), Nothing Else Matters (Metallica), Smells Like Teen Spirit (Nirvana)
*Pop:* Let It Be (Beatles), Yesterday (Beatles), Stand By Me (Ben E. King), Can't Help Falling In Love (Elvis), Shallow (Lady Gaga), Over the Rainbow, Budapest (George Ezra), Angels (Robbie Williams)
*Blues:* Sweet Home Chicago (Robert Johnson), The Thrill Is Gone (BB King), Pride and Joy (Stevie Ray Vaughan), Crossroads (Robert Johnson)
*Folk:* Blowin' in the Wind (Dylan), The Sound of Silence (Simon & Garfunkel), Fast Car (Tracy Chapman), La Bamba (Ritchie Valens)
*Country:* Country Roads (John Denver), Ring of Fire (Johnny Cash), Jolene (Dolly Parton)
*Metal:* Enter Sandman (Metallica), Nothing Else Matters (Metallica)
*Classical:* Classical Gas (Mason Williams), Romanza (Trad. Spanish)
*Jazz:* Autumn Leaves (Kosma)
*Flamenco:* Malagueña (Trad.), Entre dos Aguas (Paco de Lucía)

Each song object schema:
```js
{
  t: "Song Title",
  a: "Artist Name",
  g: "genre",           // acoustic|rock|pop|blues|jazz|folk|country|metal|classical|flamenco
  d: "easy",            // easy|medium|hard
  bpm: 120,
  capo: 0,
  strum: "D DU UDU",    // strumming pattern description
  chords: ["C","G","Am","F"],  // array for the chord strip
  sec: [                // sections array
    {
      l: "Verse",       // section label
      ln: [             // lines array
        { c: "C              G", v: "Lyric text here" },
        { c: "Am             F", v: "Next line here" }
      ]
    }
  ]
}
```

**Flamenco sub-module** (shown when genre = All or Flamenco):
Grid of technique cards, each with:
- Name (Playfair Display)
- Description
- Compás pattern: numbered boxes (1–12 for 12-beat patterns), strong beats highlighted in rust/amber gradient

---

### 9. Learning Paths

**Path tabs:** Beginner | Intermediate | Advanced | Flamenco | Jazz | Blues

**Progress bar** (thin, gold gradient fill, animated width transition)

**Lesson list:**
- Each lesson: numbered circle, title, duration/topic meta, optional badge (gold pill)
- Completed lessons: green circle with checkmark, green-tinted background
- Click → toggle completed state, persist to `localStorage` under key `ff4_done`

**Lesson content per path** (minimum lessons per path):
- Beginner: 10 lessons
- Intermediate: 9 lessons
- Advanced: 7 lessons
- Flamenco: 9 lessons
- Jazz: 7 lessons
- Blues: 7 lessons

---

### 10. Metronome (Overlay)

**Trigger:** Nav button opens a fixed overlay (`position:fixed; inset:0; backdrop-filter:blur(16px)`)
**Close:** Click outside the box, or the ✕ button

**Metronome box contents:**

**Animated SVG Pendulum:**
```
SVG viewBox: 0 0 120 200
- Pivot point at (60, 14)
- Rod: <line> from pivot to bob, updates x2/y2 on each animation frame
- Bob: <circle> at rod end, radial gradient gold/dark-wood
- Beat number text inside bob
- Decorative housing plate at top
```
Pendulum physics: smooth interpolation (`current += (target - current) * 0.12` per frame via `requestAnimationFrame`). Target angle alternates ±32° on each beat.

**BPM display:** Large Playfair Display number, gradient text (spruce → gold)
**BPM label:** small monospace "BPM"

**Beat dots row:** Filled dots that light up gold sequentially (one per beat in the bar)

**BPM range slider:** 30–300, styled with gold thumb

**Controls row:** −10 | −5 | [Start/Stop] | +5 | +10 buttons

**Tap Tempo button:** Full-width button below controls. Stores last 8 tap times, calculates average interval → BPM. Resets if gap > 2.5 seconds.

**Time signature selector:** Pill buttons — 2/4 | 3/4 | 4/4 | 6/8 | 12-beat (Flamenco)

**Audio engine (critical — use AudioContext scheduler, NOT `setInterval` for clicks):**
```js
// Schedule clicks ahead of time using AudioContext.currentTime
// Look-ahead: 100ms, scheduling interval: 25ms
// This gives sample-accurate timing unaffected by JS event loop
function schedule() {
  while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
    scheduleClick(currentBeat, nextNoteTime);
    advanceBeat();
  }
}
// Accent beat 0 differently (higher pitch: 1050Hz vs 700Hz)
// Visual updates via setTimeout(delay) synced to scheduled note times
```

---

## JavaScript Architecture

### Global State Variables
```js
let OPEN_STRINGS = [40,45,50,55,59,64]; // MIDI values, standard tuning
let fbViewMode = 'notes';               // 'notes' | 'intervals' | 'dots'
let trpOffset = 0;                      // semitone transposition offset
let tunerOn = false;                    // tuner running state
let smoothedFreq = null;                // EMA-smoothed frequency
let smoothedCents = 0;                  // EMA-smoothed cents
let cofSelected = null;                 // selected key in Circle of Fifths
let curGenre = 'all';                   // song filter genre
let songPage = 0;                       // pagination state
let mBpm = 120;                         // metronome BPM
let mBeat = 0;                          // current beat index
let mSig = 4;                           // beats per bar
let mOn = false;                        // metronome running
let done = JSON.parse(localStorage.getItem('ff4_done') || '{}'); // lesson progress
```

### Audio Context
```js
let AudioCtx = null;
function getAC() {
  if (!AudioCtx) AudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (AudioCtx.state === 'suspended') AudioCtx.resume();
  return AudioCtx;
}
```

### Note Playback
```js
function playNote(midi, duration = 1.2) {
  const ctx = getAC();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  osc.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
  osc.type = 'triangle';
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.start(); osc.stop(ctx.currentTime + duration);
}
```

### MIDI ↔ Frequency
```js
function midiToFreq(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }
```

---

## Data Structures

### Scale Object
```js
const SCALES = {
  key: {
    n: 'Display Name',
    i: [0, 2, 4, ...],  // semitone intervals from root
    g: 'Genre',          // Rock | Blues | Jazz | Flamenco | Classical | Metal | World
    d: 'Difficulty',     // Beginner | Intermediate | Advanced
    c: 'Category',       // Diatonic | Pentatonic | Blues | Modal | Exotic | Symmetric | Bebop | Japanese
    desc: 'One sentence description.'
  }
};
```

### Chord Object
```js
const CHORDS = [
  {
    n: 'Chord Name',   // e.g. 'F', 'Bm', 'Cmaj7'
    t: 'type',         // major | minor | dom7 | maj7 | min7 | dom9 | dom11 | dom13 | dim | aug | sus | barre | power
    b: false,          // is barre chord?
    f: [1,1,2,3,3,1],  // fret array, -1 = muted
    fi: '133211',      // fingering string
    fr: 1,             // fret position (for barre chords, optional)
    shape: 'E'         // barre shape (optional): 'E' | 'A' | 'Em' | 'Am'
  }
];
```

### Song Object
```js
// (see schema in Songs section above)
```

---

## Accessibility & UX Requirements

- All interactive elements have `cursor:pointer`
- Hover states on all clickable elements
- Smooth `transition: all 0.2s–0.25s` on buttons, cards
- Section transitions: `@keyframes fadeUp` (opacity + translateY)
- Mobile-responsive: all grids use `auto-fill` / `minmax`, controls wrap with `flex-wrap:wrap`
- Horizontal scroll on fretboard (overflow-x: auto wrapper)
- Custom scrollbar styling (thin, warm wood colour)
- No emoji anywhere — Font Awesome icons only
- Footer: brand name + version + "All tools run in your browser · No account · No ads"

---

## Important Implementation Notes

1. **Single file only** — everything inline. No `import`, no external JS files.

2. **Section switching** — use a single `go(id)` function. Lazy-initialize heavy renders (fretboard, COF canvas) only when their section becomes active.

3. **Metronome timing** — MUST use AudioContext scheduler pattern, not `setInterval` for the audio clicks. `setInterval` is only used to call `schedule()` every 25ms.

4. **Tuner smoothing** — MUST apply EMA smoothing to both frequency AND cents. Smoothing factor 0.15 (15% new value, 85% previous). This is what makes the needle fluid.

5. **Cents are correct** — cents is the right unit for tuning deviation (1/100th semitone). Always display as "X.X cents sharp/flat", never just a number.

6. **No global `onclick` on SVG elements** — use `onclick` attribute directly on SVG `<circle>` elements for note playback. Keep function references in global scope.

7. **Circle of Fifths click** — recalculate canvas click position relative to `getBoundingClientRect()`. Angle calculation: `Math.atan2(dy, dx) + Math.PI/2`, normalise to `[0, 2π]`.

8. **localStorage key** — use `ff4_done` to avoid conflicts with previous versions.

9. **Chord SVG diagrams** — build as inline SVG strings. Use a `<defs>` gradient defined once with `id="dg"` for the dot fill. Check if defs already included before adding again.

10. **Wood texture** — apply the repeating gradient to `body`, not a separate element, so it appears behind everything naturally.

---

## File Output

Deliver a single file named `fretflow.html`. The file must:
- Open correctly in Chrome, Firefox, and Safari by double-clicking (no server required)
- Pass basic HTML5 validation (valid doctype, charset, viewport meta)
- Load completely under 5 seconds on a standard connection (CDN resources only)
- Work offline after first load (all logic is local; only fonts/icons need network)
- Contain no placeholder content, TODO comments, or stub functions — every feature must be fully implemented
