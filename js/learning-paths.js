/* ═══════════════════════════════════════════════════════════════════════════
   LEARNING PATHS
══════════════════════════════════════════════════════════════════════════════ */
// ─── Helper to build "try in app" actions ────────────────────────────────
function lessonTryAction(action) {
  const [type, ...args] = action.split(':');
  if (type === 'fretboard') {
    document.getElementById('fb-root').value = args[0];
    document.getElementById('fb-scale').value = args[1];
    if (args[2]) setFbView(args[2]); else setFbView('notes');
    go('fretboard');
  } else if (type === 'chord') {
    const ch = CHORDS.find(c => c.n === args[0]);
    if (ch) arpeggiate(ch.f);
  } else if (type === 'scale') {
    showScaleDetail(args[0]); go('scales');
  } else if (type === 'chords-type') {
    setChordType(args[0]); go('chords');
  } else if (type === 'metro') {
    mBpm = parseInt(args[0]); mSig = parseInt(args[1]);
    openMetronome();
  } else if (type === 'song') {
    go('songs');
  } else {
    go(type);
  }
}

// Compact teaching content for every lesson. Each: intro · steps · tip · try
const PATHS = {
  beginner: {
    label:'Beginner', color:'#34d399',
    lessons:[
      {title:'Your First Chord',          meta:'10 min · Em open chord',     badge:'Start Here',
        intro:'Em (E minor) is the friendliest chord on the guitar. Two fingers, all six strings ring open, and it sounds great immediately.',
        steps:[
          {h:'Hand position',         b:'Thumb behind the neck at the 2nd fret. Curl your fingers so they\'re above the strings, not flat across them.'},
          {h:'Place finger 2',        b:'Middle finger on the A string (5th from top), 2nd fret. Press just behind the fret wire — not on top of it.'},
          {h:'Place finger 3',        b:'Ring finger on the D string (4th from top), 2nd fret, right next to your middle finger.'},
          {h:'Strum all six strings', b:'Sweep from the low E down to the high E. Every string should ring cleanly with no buzz.'},
        ],
        tip:'If a string buzzes, you\'re either pressing too softly or too far from the fret wire. Aim for the spot right behind the wire — that\'s where the least pressure gives the clearest tone.',
        try:[{label:'Hear Em chord', action:'chord:Em'}, {label:'Browse chord library', action:'chords'}]},

      {title:'Power Chords', meta:'12 min · The rock backbone',
        intro:'Power chords are two-note shapes (root + 5th) used across rock, punk and metal. They\'re moveable — learn one shape and you have every power chord on the neck.',
        steps:[
          {h:'Learn E5',  b:'Open low E + 2nd fret on the A string. That\'s the E power chord — try strumming just those two strings.'},
          {h:'Learn A5',  b:'Open A + 2nd fret on the D string. Same shape, one string up.'},
          {h:'Move it',   b:'Slide the shape (without open strings) up the neck. 3rd fret root on low E = G5. 5th fret = A5. The shape never changes.'},
          {h:'Mute extras',b:'Lightly rest your strumming hand on the unused strings so you don\'t accidentally hit them.'},
        ],
        tip:'Power chords sound bigger with distortion but work clean too. Practice transitioning E5 → A5 → D5 cleanly before adding any effects.',
        try:[{label:'Hear E5', action:'chord:E5'}, {label:'See all power chords', action:'chords-type:power'}]},

      {title:'Basic Strumming Patterns', meta:'15 min · Rhythm foundation',
        intro:'A great chord vocabulary is useless without rhythm. The most important strumming pattern in popular music is D-DU-UDU.',
        steps:[
          {h:'Keep the hand moving',  b:'Your strumming arm should move continuously in eighth-notes — even on "ghost" strums where you don\'t hit the strings.'},
          {h:'D-DU-UDU',              b:'Down (beat 1), Down-Up (beat 2), Up-Down-Up (beats 3 & 4). Try it slowly with a metronome at 60 BPM.'},
          {h:'Accent the downbeats',  b:'Hit beats 1 and 3 slightly harder than the others. That\'s where the pulse lives.'},
          {h:'Loosen up',             b:'Hold the pick lightly. A tight grip = stiff rhythm. Let your wrist do the work, not your forearm.'},
        ],
        tip:'Loop a single chord (try G) for 5 minutes with the metronome on. Strumming evenness matters more than fancy patterns at this stage.',
        try:[{label:'Open metronome at 60 BPM', action:'metro:60:4'}]},

      {title:'The Pentatonic Scale', meta:'20 min · Your first lead scale',
        intro:'The minor pentatonic is the most-used scale in rock and blues. Five notes, no wrong choices, and it sits beautifully under the fingers.',
        steps:[
          {h:'Learn position 1',   b:'A minor pentatonic, 5th fret. Two notes per string in a "box" shape spanning four frets.'},
          {h:'Play it ascending',  b:'Start on the low E, 5th fret. Pick each note slowly. End on the high E, 8th fret.'},
          {h:'Then descending',    b:'Reverse it. Slowness now buys speed later.'},
          {h:'Find the root',      b:'The root note (A) appears on the 6th string 5th fret AND the 4th string 7th fret AND the 1st string 5th fret. Knowing where the root is = knowing the key.'},
        ],
        tip:'Once it\'s in your fingers, try improvising any 5 notes from the scale over a slow 12-bar blues backing track. It\'ll sound right almost no matter what you play.',
        try:[{label:'View A minor pentatonic', action:'fretboard:9:pent_min'}, {label:'Hear the scale', action:'scale:pent_min'}]},

      {title:'Reading Chord Charts', meta:'10 min · Music notation 101',
        intro:'Chord charts use a 6-string grid to show where to put your fingers. Once you can read them, you can learn any chord on the planet.',
        steps:[
          {h:'Strings are vertical',  b:'Low E on the left, high E on the right. The top horizontal line is the nut.'},
          {h:'Numbers = fret',        b:'A "3" on a string means press the 3rd fret on that string. The number sits in the row corresponding to that fret.'},
          {h:'X and O at the top',    b:'X = don\'t play that string. O = play it open (no fret).'},
          {h:'Fingering notation',    b:'"x32010" is C major: don\'t play low E, 3rd fret A string, 2nd fret D string, open G, 1st fret B, open high E.'},
        ],
        tip:'When learning a new chord, say the fret pattern aloud: "x-three-two-zero-one-zero." Verbalizing it cements the shape in memory.',
        try:[{label:'See chord diagrams', action:'chords'}]},

      {title:'Barre Chords Introduction', meta:'25 min · The F chord',
        intro:'Barre chords use one finger as a "moveable nut" across all six strings. The F chord is the rite of passage every guitarist faces.',
        steps:[
          {h:'Set the barre',     b:'Lay your index finger flat across all 6 strings at the 1st fret. Roll it slightly so the bony edge does the pressing, not the fleshy pad.'},
          {h:'Build the shape',   b:'Add: middle finger on G string 2nd fret. Ring + pinky on D and A strings, 3rd fret.'},
          {h:'Press from your arm',b:'The pressure for the barre comes from pulling your elbow back, not squeezing your thumb. Save the thumb.'},
          {h:'Move it up',        b:'Same shape at the 3rd fret = G major. 5th fret = A major. You now know 12 major chords.'},
        ],
        tip:'Barre chords take weeks to feel comfortable. Practice in 2-minute bursts spread through the day rather than long painful sessions.',
        try:[{label:'Hear F chord', action:'chord:F'}, {label:'All barre chords', action:'chords-type:major'}]},

      {title:'Basic Music Theory', meta:'20 min · Notes, intervals, keys',
        intro:'You don\'t need a music degree, but you need three concepts: the musical alphabet, intervals, and the idea of a "key".',
        steps:[
          {h:'The alphabet',  b:'Music uses A B C D E F G — then repeats. Between most consecutive letters is a "whole step" (2 frets). Between B-C and E-F it\'s a "half step" (1 fret).'},
          {h:'Sharps & flats',b:'A # raises a note by one fret. A ♭ lowers it. C# = D♭ (same note, two names).'},
          {h:'Intervals',     b:'The distance between two notes. 2 frets = "major 2nd". 4 frets = "major 3rd". 7 frets = "perfect 5th". These intervals define chord quality.'},
          {h:'The major scale',b:'The W-W-H-W-W-W-H pattern. C major = C D E F G A B. That pattern starting on any note gives you that note\'s major scale.'},
        ],
        tip:'Open the Circle of Fifths in the app. Every adjacent key differs by one sharp or flat — it\'s the cleanest visual of how keys relate.',
        try:[{label:'Open Circle of Fifths', action:'cof'}, {label:'View C major scale', action:'fretboard:0:major'}]},

      {title:'The Blues Shuffle', meta:'18 min · Rhythm & feel',
        intro:'The blues shuffle is the rhythmic engine of nearly every blues, rock, and rockabilly song. It\'s a "swung" eighth-note feel.',
        steps:[
          {h:'The pattern',     b:'On an A power chord (open A + 2nd fret D), alternate the 2nd fret and 4th fret on the D string in eighth notes.'},
          {h:'Swing it',        b:'Instead of "1-and-2-and" evenly, play "1...and-2...and" — the "and" comes late. Think of a galloping triplet feel.'},
          {h:'Loop 12 bars',    b:'4 bars on A, 2 bars on D, 2 bars on A, 1 bar on E, 1 bar on D, 2 bars on A. The classic 12-bar form.'},
          {h:'Palm mute',       b:'Rest the side of your strumming palm lightly on the strings near the bridge. That tight, percussive sound = blues shuffle.'},
        ],
        tip:'Listen to "Sweet Home Chicago" or "Pride and Joy" — let your foot tap and feel where the swing lives.',
        try:[{label:'Play blues songs', action:'song'}, {label:'Metronome 100 BPM', action:'metro:100:4'}]},

      {title:'Fingerpicking Basics', meta:'22 min · Travis picking',
        intro:'Fingerpicking is the foundation of folk, classical and country guitar. The "Travis pick" pattern alone covers a thousand songs.',
        steps:[
          {h:'Assign fingers',   b:'Thumb (p) → bass strings (low E, A, D). Index (i) → G. Middle (m) → B. Ring (a) → high E.'},
          {h:'Steady thumb',     b:'On any chord, alternate thumb between the root and the 5th of the bass. For C: alternate A string and D string.'},
          {h:'Add the melody',   b:'While the thumb pulses steadily, pluck the higher strings with i-m-a in a repeating pattern.'},
          {h:'The Travis pattern',b:'p (root) – i – p (5th) – m – p (root) – i – p (5th) – a. Slow it down to half speed at first.'},
        ],
        tip:'Practice fingerpicking for 5 minutes at the start of every session — it builds the right-hand independence that all advanced techniques require.',
        try:[{label:'Hear Blackbird', action:'song'}]},

      {title:'Playing Your First Song', meta:'30 min · Putting it together',
        intro:'You now have: open chords, strumming, and a sense of rhythm. Let\'s play "Knockin\' on Heaven\'s Door" — three chords, classic feel, beloved by everyone.', badge:'Milestone',
        steps:[
          {h:'The chords',     b:'G, D, Am, C. All open. Practice the changes G → D → Am → C → D in a loop.'},
          {h:'Strum pattern',  b:'D-DU-UDU at a relaxed 72 BPM. The song is slow — don\'t rush.'},
          {h:'Verse pattern',  b:'2 bars per chord: G, D, Am — then G, D, C, D. Hum or sing the melody if you know it.'},
          {h:'The chorus',     b:'G, D, Am held, then G, D, C, D. Notice it\'s nearly the same as the verse — the song uses simplicity by design.'},
        ],
        tip:'Record yourself playing it (your phone is fine). Listen back. You\'ll hear timing slips you can\'t feel while playing. That\'s how musicians improve.',
        try:[{label:'Open the play-along', action:'song'}, {label:'Set metronome 72 BPM', action:'metro:72:4'}]},
    ]
  },

  intermediate: {
    label:'Intermediate', color:'#22d3ee',
    lessons:[
      {title:'The CAGED System', meta:'30 min · Fretboard mastery',
        intro:'Every chord on the guitar can be played in 5 places, based on the C, A, G, E and D open chord shapes. CAGED unlocks the entire fretboard.',
        steps:[
          {h:'C shape',  b:'Open C chord. The root is on the A string. Now slide that whole shape up 2 frets (using barre) → D major.'},
          {h:'A shape',  b:'Open A chord barred. Root on the A string. Slide up — same chord, different position.'},
          {h:'G shape',  b:'Less common as a barre, but the shape exists. Root on the low E and high E.'},
          {h:'E shape & D shape',b:'The E-shape barre (F chord) and D-shape are the other two. Together, these 5 shapes cover every major chord at every fret.'},
        ],
        tip:'For each major chord, find all 5 CAGED positions on the fretboard. They overlap — adjacent shapes share notes, which is how you connect them.',
        try:[{label:'See chord variants', action:'chords'}, {label:'View C major fretboard', action:'fretboard:0:major'}]},

      {title:'Modal Theory', meta:'25 min · Beyond major & minor',
        intro:'The 7 modes are the major scale started from each of its 7 notes. Each mode has its own flavor — Dorian (bluesy), Mixolydian (rocky), Phrygian (Spanish).',
        steps:[
          {h:'Ionian',     b:'= Major scale. Bright, resolved. C major = C D E F G A B.'},
          {h:'Dorian',     b:'Start on the 2nd. D Dorian = D E F G A B C. Minor with a major 6th — moody but hopeful.'},
          {h:'Phrygian',   b:'Start on the 3rd. E Phrygian = E F G A B C D. Spanish/flamenco flavor from that flat 2nd.'},
          {h:'Lydian, Mixolydian, Aeolian, Locrian',b:'Each starts on the next scale degree. Lydian = dreamy. Mixolydian = bluesy major. Aeolian = natural minor. Locrian = tense, rarely used.'},
        ],
        tip:'The easiest way to hear modes: loop a single chord, then play notes from each mode over it. Same notes, totally different sound depending on the root.',
        try:[{label:'D Dorian on fretboard', action:'fretboard:2:dorian'}, {label:'E Phrygian', action:'fretboard:4:phrygian'}]},

      {title:'Sweep Picking Introduction', meta:'35 min · Speed technique',
        intro:'Sweep picking lets you fly through arpeggios at speeds impossible with alternate picking. Think of it as one continuous brush across the strings.',
        steps:[
          {h:'The motion',     b:'Drag the pick across multiple strings in ONE direction — not pick-pick-pick. Like a small strum.'},
          {h:'Synchronize',    b:'Fret one note at a time, lifting the previous finger as you place the next. Otherwise notes ring into each other.'},
          {h:'Start tiny',     b:'A 3-string A minor sweep: 12th fret high E, 13th fret B, 14th fret G. Down-stroke through all three.'},
          {h:'Use a metronome',b:'Start at 60 BPM with triplets. Don\'t increase speed until you can play it cleanly 5 times in a row.'},
        ],
        tip:'Sweep picking sounds bad before it sounds good. Record yourself — focus on note clarity first, speed second.',
        try:[{label:'A minor arpeggio', action:'chord:Am'}, {label:'Metronome', action:'metro:60:4'}]},

      {title:'Advanced Barre Chords', meta:'20 min · A & C shapes',
        intro:'The E-shape barre gave you 12 major chords. Adding the A-shape and C-shape lets you play any chord in multiple positions for smooth voice leading.',
        steps:[
          {h:'A-shape major',  b:'Barre at the 2nd fret with index. Use one finger (or 3 fingers) to fret the D, G, B strings at the 4th fret. → B major.'},
          {h:'A-shape minor',  b:'Same barre, fret D and G at 4th, B at 3rd. → B minor.'},
          {h:'C-shape',        b:'Trickier — uses a partial barre. Worth learning for jazz and chord melody.'},
          {h:'Combine shapes', b:'Practice G major in E-shape (3rd fret) then A-shape (10th fret). Same chord, two completely different sounds.'},
        ],
        tip:'Knowing 3 voicings of every major and minor chord means you can stay in one fret area for a whole song instead of jumping around.',
        try:[{label:'A-shape barre chords', action:'chords'}]},

      {title:'Music Theory: Modes', meta:'30 min · Deeper dive',
        intro:'Time to use modes musically. A mode isn\'t just a scale — it\'s a *sound*, defined by which intervals are present.',
        steps:[
          {h:'Identify by character', b:'Dorian = minor + bright 6th. Mixolydian = major + dark 7th. Phrygian = minor + Spanish ♭2.'},
          {h:'Match modes to chords', b:'Over a Dm7, Dorian sounds great. Over D7, Mixolydian. The chord tells you which mode fits.'},
          {h:'Modal chord progressions',b:'I-bVII-I (G-F-G) is Mixolydian. i-bII-i (Em-Fm-Em) is Phrygian.'},
          {h:'Practice in context',  b:'Loop a Dm7 vamp. Solo using D Dorian. Listen to which notes "land" and which create tension.'},
        ],
        tip:'Modes only "sound modal" when the chord harmony supports them. Soloing in Dorian over a I-IV-V just sounds like minor — you need that Dorian chord backdrop.',
        try:[{label:'Browse modes', action:'scales'}]},

      {title:'Improvisation Basics', meta:'40 min · Play over backing',
        intro:'Improvising is just real-time composing. The skill is knowing what notes are *safe*, then learning to make any note *intentional*.',
        steps:[
          {h:'Start with one scale', b:'Pentatonic minor in A. Loop an Am backing track and just play scale notes in any order.'},
          {h:'Use space',            b:'Don\'t play constantly. Silence is part of the music. Let phrases breathe.'},
          {h:'Repeat & develop',     b:'Play a 3-note phrase. Repeat it. Now change one note. Repeat. Change another. That\'s a solo.'},
          {h:'Target chord tones',   b:'On chord changes, land on the root or 3rd of the new chord. Even random notes between feel resolved.'},
        ],
        tip:'Improvise in front of a mirror or recording yourself. Watching playback teaches you what you actually do vs. what you think you do.',
        try:[{label:'A minor pentatonic', action:'fretboard:9:pent_min'}]},

      {title:'Extended Chords', meta:'25 min · 7ths, 9ths, 11ths',
        intro:'Adding notes to triads creates richer harmony. Maj7, m7, dom7, 9, 11, 13 — each adds a specific flavour.',
        steps:[
          {h:'7ths first',     b:'Cmaj7 = C E G B (sweet). C7 = C E G B♭ (bluesy). Cm7 = C E♭ G B♭ (smooth). Practice the difference by ear.'},
          {h:'9ths',           b:'Add the 9th (a 2nd, octave up) → Cmaj9 = C E G B D. That D adds shimmer.'},
          {h:'11th & 13th',    b:'Stack more 3rds. C13 has every chord tone — usually voiced by dropping the 5th to keep it playable.'},
          {h:'Where they fit', b:'Maj7 → mellow / jazzy. Dom7 → blues / funk / rock. m7 → smooth / R&B. 9/11/13 → jazz / sophistication.'},
        ],
        tip:'Replace every chord in a song you know with its 7th equivalent (G → G7, Em → Em7, C → Cmaj7). Notice how much more "musical" it sounds.',
        try:[{label:'Maj 7 chords', action:'chords-type:maj7'}, {label:'9th chords', action:'chords-type:dom9'}]},

      {title:'Rhythm Techniques', meta:'20 min · Syncopation & feel',
        intro:'Where a great player separates from a good one is rhythm. Strumming patterns, percussive techniques, ghost strums, and syncopation.',
        steps:[
          {h:'Sixteenth notes',  b:'Subdivide each beat into 4. Practice playing on the "e" and "a" of each beat instead of just downbeats.'},
          {h:'Ghost strums',     b:'Strum without hitting the strings — the motion stays, the sound doesn\'t. Maintains rhythmic flow.'},
          {h:'Percussive slaps', b:'Slap the strings with your strumming-hand palm between strums. Creates a drum-like backbeat.'},
          {h:'Syncopation',      b:'Accent the "and" of beats instead of the beats themselves. Makes any pattern instantly funkier.'},
        ],
        tip:'Tap your foot on the downbeats while strumming on the upbeats. If you can do that without losing the beat, your rhythm is solid.',
        try:[{label:'Metronome 90 BPM', action:'metro:90:4'}]},

      {title:'Scales for Soloing', meta:'35 min · Pentatonic patterns',
        intro:'5 pentatonic positions across the neck = the whole fretboard at your disposal. Once memorised, you can solo anywhere.',
        steps:[
          {h:'Position 1',  b:'A minor pentatonic, 5th fret. The "home" box.'},
          {h:'Position 2',  b:'Same scale, 7th-10th fret. Connects to position 1 by sliding.'},
          {h:'Positions 3, 4, 5',b:'Continue up the neck. Each position overlaps with adjacent positions — there are no gaps.'},
          {h:'Connect them',b:'Practice an ascending run that passes through all 5 positions. You\'ll cover the entire neck in one phrase.'},
        ],
        tip:'When soloing, don\'t stay in one position. Slide between them — the position changes themselves become part of the phrase.',
        try:[{label:'A pentatonic 24 frets', action:'fretboard:9:pent_min'}]},
    ]
  },

  advanced: {
    label:'Advanced', color:'#818cf8',
    lessons:[
      {title:'Advanced Scale Patterns', meta:'40 min · 3-notes-per-string', badge:'Pro',
        intro:'Three notes per string opens up speed and fluency unavailable in the standard 2-note-per-string pentatonic boxes.',
        steps:[
          {h:'The shift',  b:'Where pentatonic has 2 notes per string, 3-NPS scales add the missing diatonic note. C major becomes C-D-E on the low E, F-G-A on the A, etc.'},
          {h:'Speed gains',b:'Three notes per string allows true legato — hammer-ons and pull-offs flow naturally without picking every note.'},
          {h:'Position changes',b:'Each new position is one string further up. Master the shifting between them.'},
          {h:'Apply to modes', b:'Use 3-NPS shapes for every mode. The pattern stays — only which notes are "in" the mode changes.'},
        ],
        tip:'Petrucci, Vai, Satriani — all built their speed on 3-NPS scales. Practice ascending then descending the C major scale in 3-NPS for 5 minutes daily.',
        try:[{label:'C major 24 frets', action:'fretboard:0:major'}]},

      {title:'Tapping Technique', meta:'35 min · Two-hand tapping',
        intro:'Eddie Van Halen made tapping famous, but it predates him by centuries — classical guitarists called it "hammer-on from nowhere."',
        steps:[
          {h:'The motion',    b:'Use your picking-hand index or middle finger to hammer-on a note above the highest fretted note. Pull off to reveal the lower notes.'},
          {h:'Three-finger triplet',b:'Tap (right hand), pull-off (left ring), hammer (left index). Repeat as a triplet.'},
          {h:'Muting is critical',b:'Use your picking-hand palm to mute lower strings. Tapping ringing on unwanted strings = mush.'},
          {h:'Move it across strings',b:'Once the triplet feels stable on one string, move the same shape to other strings.'},
        ],
        tip:'Tapping requires precision more than speed. Practice each triplet slowly until every note has equal volume — then add speed.',
        try:[{label:'A minor scale', action:'fretboard:9:aeolian'}]},

      {title:'Hybrid Picking', meta:'30 min · Plectrum + fingers',
        intro:'Hybrid picking combines a flatpick with your middle, ring and pinky fingers. Gets you fingerstyle fluency with picking attack.',
        steps:[
          {h:'Hold the pick normally',b:'Thumb + index as always. Middle, ring, pinky stay free.'},
          {h:'Practice patterns',  b:'Pick the bass note with the plectrum, then pluck higher strings with middle and ring simultaneously.'},
          {h:'Country style',      b:'Brad Paisley and Albert Lee are the masters. Listen to "Mountain Music" or "Country Boy".'},
          {h:'Chicken pickin\'',   b:'Aggressive snap-pluck with the middle finger creates the percussive "chicken" sound.'},
        ],
        tip:'Start with chord-based hybrid patterns before attempting single-note runs. Build right-hand independence first.',
        try:[{label:'Open Songs library', action:'song'}]},

      {title:'Advanced Music Theory', meta:'45 min · Reharmonisation',
        intro:'Reharmonisation = swapping out chords in a progression for ones that sound more sophisticated or surprising while keeping the melody.',
        steps:[
          {h:'Tritone substitution',b:'Replace V7 with the dom7 chord a tritone away. D7 → Ab7. Common in jazz turnarounds.'},
          {h:'Secondary dominants', b:'Insert a V7 of the next chord. C → G → Am becomes C → E7 → Am. Adds tension/release.'},
          {h:'Diminished passing chords',b:'A diminished chord between two diatonic chords moves them smoothly: C → C#dim → Dm.'},
          {h:'Modal interchange',   b:'Borrow chords from the parallel minor key. In C major, borrow Fm or A♭ from C minor.'},
        ],
        tip:'Take a song you know — replace one chord at a time with a reharmonised option. Hear how each change shifts the emotion.',
        try:[{label:'Circle of Fifths', action:'cof'}]},

      {title:'Jazz Chord Voicings', meta:'40 min · Drop-2, Drop-3',
        intro:'Closed chord voicings (all notes within an octave) sound cluttered. "Drop" voicings spread the notes across the neck for clarity.',
        steps:[
          {h:'Start with Cmaj7',  b:'Closed: C E G B. Drop the 2nd-highest note an octave → G C E B. That\'s a drop-2.'},
          {h:'Drop-2 on top 4 strings',b:'Cmaj7 drop-2 at the 5th fret: x-3-5-4-5-x. Sounds open and modern.'},
          {h:'Drop-3',          b:'Drop the 3rd-highest note an octave. Used for chord melody work.'},
          {h:'Voice leading',   b:'Choose voicings where each note moves the smallest possible distance to the next chord. That\'s how comping sounds smooth.'},
        ],
        tip:'Memorise drop-2 voicings for maj7, m7 and dom7 on the top 4 strings. That alone covers 90% of jazz comping.',
        try:[{label:'Maj 7 chords', action:'chords-type:maj7'}]},

      {title:'Classical Guitar Technique', meta:'35 min · Segovia approach',
        intro:'Classical guitar demands proper posture, fingernail technique, and right-hand discipline. The technique transfers to *every* style.',
        steps:[
          {h:'Posture',       b:'Foot on a footstool. Guitar at a 45° angle. Right forearm rests over the bout, not on the strings.'},
          {h:'Right-hand position',b:'Wrist relaxed. Fingers approach strings at a slight angle. Use the side of your fingertip + nail.'},
          {h:'Apoyando (rest stroke)',b:'After plucking, your finger rests on the adjacent string. Strong, projecting tone.'},
          {h:'Tirando (free stroke)',b:'Finger doesn\'t rest after plucking. Used for arpeggios where adjacent strings must keep ringing.'},
        ],
        tip:'Practice "Romanza" (Spanish Romance) — the right-hand arpeggio pattern is one of the most beautiful and instructive exercises in the repertoire.',
        try:[{label:'See Romanza', action:'song'}]},

      {title:'Composition Fundamentals', meta:'50 min · Write your own', badge:'Creative',
        intro:'Composition isn\'t magic. It\'s a few simple decisions: key, mood, form, and a hook. The hook is everything.',
        steps:[
          {h:'Start with a riff',   b:'A 2-4 bar phrase that catches your ear. Loop it. If it still sounds good after 10 loops, it\'s a keeper.'},
          {h:'Build form',          b:'Verse → Chorus → Verse → Chorus → Bridge → Chorus. The chorus is where the hook lives.'},
          {h:'Contrast verse & chorus',b:'If the verse is mellow, the chorus should hit harder. Different chords, different dynamics.'},
          {h:'Less is more',        b:'Most great songs have 3-5 chords and a memorable melody. Complexity rarely improves a song.'},
        ],
        tip:'Record every idea, even bad ones. The good ones often emerge by combining or evolving an idea you initially discarded.',
        try:[{label:'Open Circle of Fifths', action:'cof'}, {label:'Browse Songs', action:'song'}]},
    ]
  },

  flamenco: {
    label:'Flamenco', color:'#f87171',
    lessons:[
      {title:'Palmas and Compás', meta:'20 min · Rhythm foundation', badge:'Duende',
        intro:'Flamenco lives in the compás — the rhythmic cycle. Before you play a single note, you have to feel the count in your bones.',
        steps:[
          {h:'The 12-beat compás',b:'Soleá, Bulería and Alegrías all use a 12-beat cycle. Accents fall on beats 3, 6, 8, 10, 12 (or variations).'},
          {h:'Palmas',           b:'Hand claps. Sordas (muted, cupped hands) on weak beats, claras (sharp) on accents. The percussive bed of flamenco.'},
          {h:'Count aloud',      b:'1-2-3-4-5-6-7-8-9-10-11-12. Accent the strong beats. Once you can do this while walking, you have the compás.'},
          {h:'Listen first',     b:'Spend 10 minutes a day listening to Camarón de la Isla or Paco de Lucía. The compás soaks in passively.'},
        ],
        tip:'Use a metronome set to 200 BPM in 12-beat mode. Try clapping along, accenting the standard Soleá accents.',
        try:[{label:'Flamenco metronome', action:'metro:200:12'}, {label:'Flamenco songs', action:'song'}]},

      {title:'Rasgueado Technique', meta:'30 min · Fan strumming',
        intro:'The rasgueado is the explosive fan-strum that defines flamenco rhythm guitar. Each finger uncurls independently into the strings.',
        steps:[
          {h:'Start curled',  b:'Form a loose fist with your strumming hand, fingers curled into the palm.'},
          {h:'Pinky first',   b:'Flick the pinky outward across the strings. Then ring. Then middle. Then index.'},
          {h:'Down then up',  b:'Fingers go down (uncurling). Then sweep all four back up with the thumb. That\'s a full rasgueado cycle.'},
          {h:'Build speed slowly',b:'Start at half-speed for control. Speed comes from relaxation, not from forcing.'},
        ],
        tip:'Practice on a desk or your thigh first to isolate the finger motion before applying it to strings.',
        try:[{label:'Flamenco scales', action:'fretboard:4:phryg_dom'}]},

      {title:'Picado Technique', meta:'35 min · Single-note speed',
        intro:'Picado is alternating index and middle fingers for fast single-note runs. The flamenco equivalent of alternate picking.',
        steps:[
          {h:'i-m alternation', b:'Pluck strictly alternating: index (i), middle (m), i, m...'},
          {h:'Rest stroke',     b:'Each finger comes to rest on the adjacent (lower) string after plucking. Strong tone.'},
          {h:'Synchronize',     b:'Each picked note must coincide exactly with the fret-hand finger landing. Sloppy = no flamenco.'},
          {h:'Scales as etudes',b:'Run the Phrygian Dominant scale up and down using picado. That\'s the literal sound of flamenco.'},
        ],
        tip:'Practice on a single open string first. Speed alternation without clean tone is just noise.',
        try:[{label:'Phrygian dominant', action:'fretboard:4:phryg_dom'}]},

      {title:'The Phrygian Mode', meta:'25 min · Flamenco harmony',
        intro:'The flamenco sound is unmistakable: that dark, modal flavour comes from the Phrygian (and Phrygian Dominant) mode.',
        steps:[
          {h:'E Phrygian',         b:'E F G A B C D. The half-step from E to F (the ♭2) is the signature flamenco interval.'},
          {h:'The Andalusian cadence',b:'Am - G - F - E. This descending bass line resolving to E is the most iconic flamenco progression.'},
          {h:'Phrygian Dominant',  b:'Raise the 3rd: E F G# A B C D. Even more "Spanish" — the bridge between minor and major.'},
          {h:'Open string drones', b:'Flamenco loves open strings ringing while the melody plays above. Try keeping low E ringing under everything.'},
        ],
        tip:'Listen to "Entre dos Aguas" by Paco de Lucía. Identify the moments where Phrygian Dominant vs. straight Phrygian appears.',
        try:[{label:'E Phrygian on fretboard', action:'fretboard:4:phrygian'}, {label:'Phrygian Dominant', action:'fretboard:4:phryg_dom'}]},

      {title:'Alzapúa', meta:'30 min · Thumb technique',
        intro:'Alzapúa uses the thumb for both downstroke melody and upstroke chord — a uniquely flamenco technique that creates a galloping rhythm.',
        steps:[
          {h:'Thumb down',  b:'Pluck a bass note with a downstroke of the thumb.'},
          {h:'Thumb up',    b:'Drag the thumb upward across the high strings (like an upstroke pick).'},
          {h:'Combine',     b:'Down (single note) → Up (chord strum) → Down (single note). Develops a galloping triplet rhythm.'},
          {h:'Apply',       b:'Use it over a Phrygian Dominant scale to play melodic lines with built-in chord backing.'},
        ],
        tip:'Alzapúa demands a strong, calloused thumb. Build calluses gradually — don\'t blister yourself.',
        try:[{label:'Flamenco songs', action:'song'}]},

      {title:'Flamenco Scales', meta:'25 min · Phrygian Dominant',
        intro:'Beyond Phrygian Dominant, flamenco uses several exotic scales. Hijaz, double harmonic, and Andalusian variations.',
        steps:[
          {h:'Phrygian Dominant', b:'Most common. E F G# A B C D. Spanish flavor.'},
          {h:'Hijaz',             b:'E F G# A B C D# — Arabic flavor. Very close to flamenco but with that raised 7th.'},
          {h:'Double Harmonic',   b:'E F G# A B C D# — Byzantine. Both 2nd and 7th raised.'},
          {h:'Use in falsetas',   b:'A falseta is an instrumental melodic interlude. Compose falsetas using these scales for authentic flamenco color.'},
        ],
        tip:'Listen to "Malagueña" — it cycles through several of these scales within a single phrase.',
        try:[{label:'Phrygian Dominant', action:'fretboard:4:phryg_dom'}, {label:'Hijaz scale', action:'fretboard:4:hijaz'}]},

      {title:'Zapateado', meta:'20 min · Footwork & rhythm',
        intro:'Zapateado is the percussive footwork of flamenco dancers — but guitarists must internalize the same rhythms.',
        steps:[
          {h:'Listen actively',    b:'Watch flamenco performances. The dancer\'s feet are an additional percussion instrument in dialogue with the guitar.'},
          {h:'Stomp the compás',   b:'Practice playing while stomping the accent beats with your foot. Trains the rhythm at a physical level.'},
          {h:'Llamadas',           b:'These are rhythmic "calls" — pre-arranged figures that signal a change in the dance/music.'},
          {h:'Remate',             b:'The dramatic closing figure. Guitarist + dancer + cantaor (singer) all land together.'},
        ],
        tip:'Even if you\'ll never dance, watching flamenco zapateado will transform your sense of rhythm.',
        try:[{label:'12-beat metronome', action:'metro:180:12'}]},

      {title:'Soleares', meta:'45 min · Classic palos',
        intro:'Soleá ("solitude") is the mother of flamenco palos — slow, intense, in 12-beat compás. Every flamenco guitarist must know it.',
        steps:[
          {h:'The compás',     b:'12 beats with accents on 3, 6, 8, 10, 12. The "1-2" before the cycle starts is felt but often silent.'},
          {h:'Key & harmony',  b:'Always in E Phrygian. The Andalusian cadence (Am-G-F-E) is the harmonic spine.'},
          {h:'Falsetas',       b:'Compose 4-bar instrumental melodic phrases (falsetas) using the Phrygian scale and Phrygian Dominant.'},
          {h:'Air vs density', b:'Soleá is patient. Leave space. Long sustained chords can be more powerful than dense runs.'},
        ],
        tip:'Study Paco de Lucía\'s Soleá recordings. Notice how he stretches time — playing slightly behind or ahead of the compás for emotional effect.',
        try:[{label:'Soleá compás', action:'metro:200:12'}, {label:'View Phrygian on neck', action:'fretboard:4:phrygian'}]},

      {title:'Bulería', meta:'50 min · Fast 12-beat compás', badge:'Advanced',
        intro:'Bulería is Soleá\'s wild fast cousin — also 12 beats, but explosive, syncopated and fiercely rhythmic.',
        steps:[
          {h:'Compás at 240+ BPM',b:'The same 12-beat structure, but faster. Felt as 6 strong pulses per cycle.'},
          {h:'Syncopation',       b:'Bulería loves playing AROUND the beat. Accents fall on weak subdivisions. Listen carefully.'},
          {h:'Quejío',            b:'The vocal "cry" or sob — a Bulería falseta should evoke this emotional release.'},
          {h:'Open string drones',b:'Keep open low E ringing as a drone under fast Phrygian runs. Iconic Bulería sound.'},
        ],
        tip:'Bulería is meant to feel celebratory and unpredictable. Don\'t play it metronome-stiff — even within the compás, breathe with it.',
        try:[{label:'Bulería tempo', action:'metro:240:12'}, {label:'Flamenco songs', action:'song'}]},
    ]
  },

  jazz: {
    label:'Jazz', color:'#fbbf24',
    lessons:[
      {title:'Jazz Theory Foundations', meta:'35 min · Chord extensions',
        intro:'Jazz harmony uses 4-note chords minimum. Triads sound thin. The 7th is mandatory; 9, 11, 13 are common; alterations (♭9, #11) add tension.',
        steps:[
          {h:'7ths are baseline', b:'Every major chord → maj7. Every minor → m7. Every dominant → 7. Triads only in special cases.'},
          {h:'Extensions',         b:'9 = 2nd up an octave. 11 = 4th up. 13 = 6th up. Each adds colour without changing the chord\'s fundamental quality.'},
          {h:'Alterations',        b:'♭9, #9, ♭5, #5, #11 — these create tension that must resolve. Common on dominant chords.'},
          {h:'Read jazz lead sheets',b:'Chord symbols like "Cm7♭5" or "G7♭9#5" look intimidating — break them into parts: root + quality + extensions.'},
        ],
        tip:'Take any pop song. Replace its plain triads with 7th and 9th chords. The whole song instantly sounds more sophisticated.',
        try:[{label:'Maj 7 chords', action:'chords-type:maj7'}, {label:'Dom 9 chords', action:'chords-type:dom9'}]},

      {title:'ii-V-I Progressions', meta:'30 min · Core jazz movement',
        intro:'The ii-V-I is the most important harmonic movement in jazz. Practically every standard is built from chains of ii-V-Is.',
        steps:[
          {h:'Identify it',  b:'In C major: ii = Dm7, V = G7, I = Cmaj7. The pattern m7 → 7 → maj7.'},
          {h:'Every key',    b:'Learn ii-V-I in all 12 keys. Use the Circle of Fifths — adjacent keys share most of the ii-V-I notes.'},
          {h:'Minor variant',b:'In minor: iim7♭5 → V7♭9 → im7. Same function, darker colour.'},
          {h:'Chains',       b:'"Autumn Leaves" is just ii-V-I in G major, then ii-V-i in E minor, then back. Most standards work this way.'},
        ],
        tip:'Loop a ii-V-I in C with a metronome. Comp it for 10 minutes. Internalize that this progression resolves — your improvisation will follow.',
        try:[{label:'Circle of Fifths', action:'cof'}, {label:'Autumn Leaves', action:'song'}]},

      {title:'Jazz Chord Voicings', meta:'40 min · Shell & guide tones',
        intro:'On guitar, you can\'t play all the notes of an extended chord. Jazz guitarists use "shell voicings" — just the essential 3 or 4 notes that define the chord.',
        steps:[
          {h:'Shell chord = R + 3 + 7',b:'These three notes define the chord\'s quality. Drop everything else.'},
          {h:'Guide tones',           b:'The 3rd and 7th are the "guide tones." Voice-led smoothly between chords, they carry the whole progression.'},
          {h:'Freddie Green style',   b:'4-to-the-bar comping with 3-note shells on strings 6-4. The rhythm guitarist\'s bread and butter.'},
          {h:'Drop-2 voicings',       b:'4-note voicings spread across the neck. For more harmonically full comping.'},
        ],
        tip:'Take a jazz standard. Comp it using only shell voicings (R + 3 + 7) at first. You\'ll hear how little harmonic information is actually needed.',
        try:[{label:'Maj 7 chords', action:'chords-type:maj7'}, {label:'Min 7 chords', action:'chords-type:min7'}]},

      {title:'Bebop Scales', meta:'35 min · Charlie Parker style',
        intro:'Bebop scales add a chromatic passing tone to a regular scale. The result: smooth 8-note phrases where chord tones land on the downbeats.',
        steps:[
          {h:'Bebop dominant',b:'Mixolydian + raised 7. Over G7: G A B C D E F F# G. The F# is the passing tone.'},
          {h:'Bebop major',   b:'Major + raised 5. Over Cmaj7: C D E F G G# A B. The G# passes between G and A.'},
          {h:'Bebop minor',   b:'Dorian + passing tone between b3 and 4. Smooth minor lines.'},
          {h:'On the beat',   b:'In bebop, chord tones (R, 3, 5, 7) ALWAYS land on the downbeats. The passing tone falls on weak beats.'},
        ],
        tip:'Transcribe a Charlie Parker solo. Slow it down. You\'ll see the bebop scales in action — and learn more in 1 hour than from any textbook.',
        try:[{label:'Bebop scales', action:'fretboard:0:bebop_dom'}, {label:'View scales library', action:'scales'}]},

      {title:'Jazz Improvisation', meta:'45 min · Playing over changes', badge:'Creative',
        intro:'Jazz improvisation is fluent musical conversation in the language of the changes. Master the changes, then forget them.',
        steps:[
          {h:'Know the changes cold',b:'You can\'t improvise over chords you don\'t know. Learn the chord-by-chord map of the standard first.'},
          {h:'Target chord tones',  b:'Land on the 3rd or 7th of each new chord. The rest of your phrase is decoration.'},
          {h:'Use motifs',          b:'Repeat a 3-5 note phrase, then evolve it. That\'s how a solo tells a story.'},
          {h:'Quote others',        b:'Quoting bits of other melodies (even a famous solo) is honoured in jazz. It\'s called "saying hello" to a tradition.'},
        ],
        tip:'Play along with a backing track of "Autumn Leaves." Don\'t worry about scales — focus on landing on chord tones. The rest follows.',
        try:[{label:'Autumn Leaves', action:'song'}]},

      {title:'Jazz Standards', meta:'40 min · Autumn Leaves & more',
        intro:'The "Great American Songbook" is the jazz vocabulary. Standards are the shared language jazz musicians speak when they meet.',
        steps:[
          {h:'Autumn Leaves',  b:'4-bar phrases. ii-V-i in Em alternating with ii-V-I in G. The simplest standard to start with.'},
          {h:'All The Things You Are',b:'Modulates through 5 keys. Sophisticated voice leading. A graduation exercise.'},
          {h:'Misty',          b:'Erroll Garner\'s ballad. Beautiful chord changes, manageable form.'},
          {h:'Blue Bossa',     b:'A jazz-bossa standard. Latin groove + minor ii-V-i. Fun to solo over.'},
        ],
        tip:'Pick ONE standard. Learn its melody, its changes, its key, and a basic chord-melody arrangement. That single standard teaches you more than 10 partially-learned ones.',
        try:[{label:'Browse Jazz songs', action:'song'}]},

      {title:'Chord Melody', meta:'50 min · Solo guitar arrangement',
        intro:'Chord melody = playing the melody on top of harmonised chords, simultaneously. The solo jazz guitarist\'s art form.',
        steps:[
          {h:'Find the melody',  b:'Identify which note is the melody at each chord change. That note must be the highest note in your voicing.'},
          {h:'Harmonise it',     b:'Build the chord beneath that melody note. Sometimes the basic chord works; sometimes you need to re-voice.'},
          {h:'Connect with passing',b:'Between chord/melody points, use diatonic passing chords to keep motion going.'},
          {h:'Add bass motion',  b:'Your thumb plays the bass note. Walking bass under static chord melody = full band sound.'},
        ],
        tip:'Joe Pass\'s "Virtuoso" album is the masterclass. Listen to him play "Autumn Leaves" solo — the whole quartet seems to be playing.',
        try:[{label:'Open Songs library', action:'song'}]},
    ]
  },

  blues: {
    label:'Blues', color:'#f87171',
    lessons:[
      {title:'12-Bar Blues', meta:'20 min · The foundation',
        intro:'The 12-bar blues is the most-played progression in music. Three chords, twelve bars, infinite expression.',
        steps:[
          {h:'The form',  b:'4 bars I (e.g. A7), 2 bars IV (D7), 2 bars I (A7), 1 bar V (E7), 1 bar IV (D7), 2 bars I (A7).'},
          {h:'In every key',b:'Once you know it in A, learn it in E, then in G. Most blues is in A, E or G.'},
          {h:'The turnaround',b:'The last 2 bars (V-IV-I, or I-V) "turn around" to start the form again. Every great blues song has a great turnaround.'},
          {h:'Listen', b:'"Pride and Joy" by SRV, "Sweet Home Chicago," "Crossroads" — all 12-bar blues. Play along with them.'},
        ],
        tip:'Count the bars while listening to any blues song. You\'ll start hearing the form everywhere — and predicting chord changes.',
        try:[{label:'Blues songs', action:'song'}, {label:'Metronome 90 BPM', action:'metro:90:4'}]},

      {title:'The Blues Scale', meta:'25 min · Minor pentatonic + b5',
        intro:'The blues scale is minor pentatonic plus one extra note: the "blue note" (flat 5th). That single note carries the entire blues feeling.',
        steps:[
          {h:'A minor pentatonic',b:'A C D E G. The home base.'},
          {h:'Add the blue note', b:'Add E♭ (between D and E). A C D E♭ E G. 6 notes total.'},
          {h:'How to use it',     b:'The ♭5 is a passing tone — slide INTO it and OUT of it. Never land on it for long.'},
          {h:'Position 1',        b:'5th fret, low E string. A C D E♭ E G... cover all 6 strings in a familiar pentatonic shape.'},
        ],
        tip:'Bend the ♭5 up to the natural 5th. That bend, even a quarter step, is the literal "cry" of the blues.',
        try:[{label:'A blues scale', action:'fretboard:9:blues'}, {label:'Hear it', action:'scale:blues'}]},

      {title:'Blues String Bending', meta:'30 min · Expression & feel',
        intro:'Bending strings is the blues guitarist\'s voice. A clean note is just a starting point — you bend it to sing.',
        steps:[
          {h:'Whole step bend', b:'Bend the 7th-fret G string up until it matches the 9th-fret pitch. Use multiple fingers (3rd backed by 2nd, 1st).'},
          {h:'Half step bend',  b:'Smaller bend. Often into the ♭3 → 3rd transition, which is the literal "blues" expression.'},
          {h:'Pre-bend & release',b:'Bend the string before picking, then release it after. Reverse contour, often deeply expressive.'},
          {h:'Vibrato',         b:'Continuous tiny bend-release at the end of a long note. Adds sustain and emotion.'},
        ],
        tip:'Match your bent note to a fretted reference note for pitch accuracy. Out-of-tune bends are the most common amateur mistake.',
        try:[{label:'A blues scale', action:'fretboard:9:blues'}]},

      {title:'Vibrato Technique', meta:'20 min · Sustain & tone',
        intro:'Vibrato is what makes a single sustained note compelling. It\'s also the most personal aspect of a guitarist\'s sound — Clapton, BB, Page all instantly recognizable by vibrato alone.',
        steps:[
          {h:'Wrist vibrato',   b:'Pivot from the wrist, not the finger. Slight up-and-down or side-to-side motion that sustains continuously.'},
          {h:'Speed & width',   b:'Slow + wide = soulful. Fast + narrow = aggressive. Match it to the feel of the moment.'},
          {h:'Consistency',     b:'Your vibrato should be even — a wobble, not a random oscillation. Practice slowly with a metronome.'},
          {h:'When to use it',  b:'Only on long notes. Vibrato on short notes is wasted effort.'},
        ],
        tip:'BB King\'s "butterfly" vibrato is wide and elegant. Try to match its width, speed, and shape — your hand will figure out what feels right.',
        try:[{label:'Blues songs', action:'song'}]},

      {title:'B.B. King Style', meta:'35 min · Box position mastery', badge:'Icon',
        intro:'BB King essentially defined modern blues lead. His magic: economical phrasing, killer vibrato, and devastating bends — all from one fretboard position.',
        steps:[
          {h:'The B.B. box',   b:'A small 4-fret zone, centred around the 12th fret on the B and high E strings (in A major / A blues).'},
          {h:'String 2 and 1', b:'Most of BB\'s licks happen on just the top two strings. Sparse + clear.'},
          {h:'Big bends',      b:'Bend the 12th fret B up a full tone. Vibrato on the bent note. That alone evokes BB.'},
          {h:'Less is more',   b:'Listen to "The Thrill Is Gone." Count the notes per measure — there are very few. Each one says a lot.'},
        ],
        tip:'Spend an entire practice session improvising using only the top two strings. You\'ll discover phrasing that "more notes" had been hiding from you.',
        try:[{label:'A blues scale', action:'fretboard:9:blues'}, {label:'Thrill Is Gone', action:'song'}]},

      {title:'Delta Blues', meta:'30 min · Open tuning & slide',
        intro:'Delta blues — Robert Johnson, Son House, Charley Patton — uses open tunings, slide, and aggressive rhythmic strumming. It\'s the raw root.',
        steps:[
          {h:'Open G tuning',  b:'D G D G B D. Strum open = G major chord. Suddenly the entire neck is reorganized.'},
          {h:'Slide basics',   b:'Glass or metal slide on your ring or pinky finger. Rest it lightly on the strings — never press to the fretboard.'},
          {h:'Damp behind',    b:'Your other fingers must mute strings BEHIND the slide. Otherwise undesirable overtones drown the note.'},
          {h:'Rhythmic strumming',b:'Aggressive downstrokes with the thumb on bass strings, fingers on treble. Often percussive — slap the strings.'},
        ],
        tip:'Re-string with heavier gauges for slide. Light strings buzz against the frets. Heavy strings (11s or 12s) ring cleanly.',
        try:[{label:'Crossroads', action:'song'}]},

      {title:'Blues Soloing Over Changes', meta:'40 min · Call and response',
        intro:'A great blues solo isn\'t random scale notes — it\'s a conversation with the chord changes. Each chord wants slightly different notes.',
        steps:[
          {h:'Over I (A7)',    b:'A minor pentatonic + blue note. Stay home. Land on A, C#, E, G.'},
          {h:'Over IV (D7)',   b:'You can stay in A minor pentatonic, OR switch to D minor pentatonic. Switching = "outside" sophistication.'},
          {h:'Over V (E7)',    b:'A minor pentatonic still works. But for extra punch, target the major 3rd of E (G#).'},
          {h:'Call and response',b:'Play a phrase ("call"). Pause. Play a related phrase ("response"). Listen between phrases — that\'s where the soul lives.'},
        ],
        tip:'Record a 12-bar blues backing track. Solo for 5 minutes. Listen back. Note where your phrases landed naturally on chord changes vs. drifted off — that\'s your roadmap for improvement.',
        try:[{label:'A minor pentatonic', action:'fretboard:9:pent_min'}, {label:'Blues songs', action:'song'}]},
    ]
  },
};

let curPath        = 'beginner';
let curLessonIdx   = null;   // currently expanded lesson
let learnInit      = false;

function buildPathTabs() {
  document.getElementById('path-tabs').innerHTML = Object.entries(PATHS).map(([key, p]) =>
    `<button class="path-tab${key === curPath ? ' active' : ''}" onclick="setPath('${key}')">${p.label}</button>`
  ).join('');
}

function setPath(key) {
  curPath = key;
  curLessonIdx = null;
  buildPathTabs();
  renderLessons();
}

function renderLessons() {
  const path      = PATHS[curPath];
  const lessons   = path.lessons;
  const pathDone  = lessons.filter((_, i) => done[`${curPath}_${i}`]).length;
  const pct       = Math.round(pathDone / lessons.length * 100);

  document.getElementById('path-label').textContent = `${path.label} Path · ${pathDone}/${lessons.length} completed`;
  document.getElementById('path-pct').textContent   = pct + '%';
  document.getElementById('path-progress').style.width = pct + '%';

  document.getElementById('lesson-list').innerHTML = lessons.map((l, i) => {
    const key       = `${curPath}_${i}`;
    const isDone    = !!done[key];
    const isOpen    = curLessonIdx === i;
    const numIcon   = isDone ? '<i class="fa-solid fa-check"></i>' : (i + 1);

    // Build the detail body when this lesson is open
    let detail = '';
    if (isOpen && l.intro) {
      const stepsHtml = (l.steps || []).map((s, idx) => `
        <div class="ls-step">
          <div class="ls-step-num">${idx + 1}</div>
          <div>
            <div class="ls-step-h">${s.h}</div>
            <div class="ls-step-b">${s.b}</div>
          </div>
        </div>`).join('');
      const tryHtml = (l.try || []).map(t =>
        `<button class="ls-try-btn" onclick="event.stopPropagation();lessonTryAction('${t.action}')">
          <i class="fa-solid fa-arrow-right"></i> ${t.label}
        </button>`).join('');

      detail = `<div class="lesson-detail">
        <div class="ls-intro">${l.intro}</div>
        ${stepsHtml ? `<div class="ls-steps">${stepsHtml}</div>` : ''}
        ${l.tip ? `<div class="ls-tip"><i class="fa-solid fa-lightbulb"></i> <span>${l.tip}</span></div>` : ''}
        ${tryHtml ? `<div class="ls-try-row">${tryHtml}</div>` : ''}
        <div class="ls-actions">
          <button class="ls-complete-btn ${isDone ? 'undo' : ''}" onclick="event.stopPropagation();toggleLesson('${key}')">
            <i class="fa-solid ${isDone ? 'fa-rotate-left' : 'fa-circle-check'}"></i>
            ${isDone ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
        </div>
      </div>`;
    }

    return `<div class="lesson-item${isDone ? ' done' : ''}${isOpen ? ' open' : ''}" onclick="openLesson(${i})">
      <div class="lesson-row">
        <div class="lesson-num">${numIcon}</div>
        <div class="lesson-body">
          <div class="lesson-title">${l.title}</div>
          <div class="lesson-meta">${l.meta}</div>
        </div>
        ${l.badge ? `<span class="lesson-badge">${l.badge}</span>` : ''}
        <i class="fa-solid fa-chevron-${isOpen ? 'up' : 'down'} ls-chevron"></i>
      </div>
      ${detail}
    </div>`;
  }).join('');
}

function openLesson(idx) {
  curLessonIdx = curLessonIdx === idx ? null : idx;
  renderLessons();
  if (curLessonIdx !== null) {
    setTimeout(() => {
      const el = document.querySelectorAll('.lesson-item')[curLessonIdx];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  }
}

function toggleLesson(key) {
  if (done[key]) delete done[key]; else done[key] = true;
  localStorage.setItem('ff4_done', JSON.stringify(done));
  renderLessons();
}

