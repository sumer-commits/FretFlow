/* ═══════════════════════════════════════════════════════════════════════════
   SONG LIBRARY
══════════════════════════════════════════════════════════════════════════════ */
const GENRES = ['all','acoustic','rock','pop','blues','jazz','folk','country','metal','classical','flamenco'];
const GENRE_LABELS = {all:'All',acoustic:'Acoustic',rock:'Rock',pop:'Pop',blues:'Blues',jazz:'Jazz',folk:'Folk',country:'Country',metal:'Metal',classical:'Classical',flamenco:'Flamenco'};

const SONGS = [
  // ── ACOUSTIC ──────────────────────────────────────────────────────────────
  {t:"Knockin' on Heaven's Door",a:"Bob Dylan",g:"acoustic",d:"easy",bpm:72,capo:0,strum:"D DU UDU",chords:["G","D","Am","C"],sec:[
    {l:"Verse",ln:[{c:"G              D",v:"Mama, take this badge off of me"},{c:"G              Am",v:"I can't use it anymore"},{c:"G              D",v:"It's gettin' dark, too dark to see"},{c:"G           C      D",v:"I feel like I'm knockin' on heaven's door"}]},
    {l:"Chorus",ln:[{c:"G      D        Am",v:"Knock, knock, knockin' on heaven's door"},{c:"G      D        C",v:"Knock, knock, knockin' on heaven's door"}]}
  ]},
  {t:"Wonderwall",a:"Oasis",g:"acoustic",d:"easy",bpm:87,capo:2,strum:"DU UDU DU",chords:["Em7","G","Dsus4","A7sus4"],sec:[
    {l:"Verse",ln:[{c:"Em7             G",v:"Today is gonna be the day"},{c:"Dsus4               A7sus4",v:"That they're gonna throw it back to you"},{c:"Em7             G",v:"By now you should've somehow"},{c:"Dsus4         A7sus4",v:"Realized what you gotta do"}]},
    {l:"Chorus",ln:[{c:"G      Dsus4   A7sus4   Em7",v:"And all the roads we have to walk are winding"},{c:"G       Dsus4    A7sus4",v:"And all the lights that lead us there are blinding"}]}
  ]},
  {t:"Blackbird",a:"The Beatles",g:"acoustic",d:"medium",bpm:96,capo:0,strum:"Fingerpicking",chords:["G","Am","G/B","C","A7","D7"],sec:[
    {l:"Verse",ln:[{c:"G          Am    G/B   C",v:"Blackbird singing in the dead of night"},{c:"C       A7       D7    G",v:"Take these broken wings and learn to fly"},{c:"C    G/B    A7",v:"All your life"},{c:"D7          G",v:"You were only waiting for this moment to arise"}]},
    {l:"Bridge",ln:[{c:"F   Em   Dm   C",v:"Blackbird fly, blackbird fly"},{c:"Bb          A7",v:"Into the light of the dark black night"}]}
  ]},
  {t:"Tears in Heaven",a:"Eric Clapton",g:"acoustic",d:"medium",bpm:80,capo:0,strum:"Fingerpicking",chords:["A","E/G#","F#m","A/E","D/F#","E7sus4","E7"],sec:[
    {l:"Verse",ln:[{c:"A          E/G#        F#m",v:"Would you know my name if I saw you in heaven?"},{c:"A/E       D/F#    E7sus4  E7",v:"Would it be the same if I saw you in heaven?"},{c:"A          E/G#       F#m",v:"I must be strong and carry on"},{c:"A/E    D/F#  E7sus4  E7  A",v:"'Cause I know I don't belong here in heaven"}]},
    {l:"Chorus",ln:[{c:"D/F#       E7sus4    E7    A",v:"Time can bring you down, time can bend your knees"},{c:"D/F#    E7sus4    A    E/G#",v:"Time can break your heart, have you begging please"}]}
  ]},
  {t:"More Than Words",a:"Extreme",g:"acoustic",d:"hard",bpm:92,capo:0,strum:"Fingerpicking",chords:["G","G/B","Cadd9","Am7","C","D","Dsus4","Em"],sec:[
    {l:"Verse",ln:[{c:"G           G/B     Cadd9",v:"Saying I love you is not the words I want to hear"},{c:"Am7        C         D   Dsus4 D",v:"From you, it's not that I want you not to say"},{c:"G           G/B    Cadd9",v:"But if you only knew how easy it would be"},{c:"Am7       C        D      Dsus4",v:"To show me how you feel"}]},
    {l:"Chorus",ln:[{c:"Em              Am7",v:"More than words is all you have to do"},{c:"D7                G",v:"To make it real, then you wouldn't have to say"},{c:"Am7    D7   G",v:"That you love me, 'cause I'd already know"}]}
  ]},
  // ── ROCK ──────────────────────────────────────────────────────────────────
  {t:"House of the Rising Sun",a:"The Animals",g:"rock",d:"medium",bpm:98,capo:0,strum:"Arpeggio",chords:["Am","C","D","F","E"],sec:[
    {l:"Verse",ln:[{c:"Am    C     D      F",v:"There is a house in New Orleans"},{c:"Am    C     E",v:"They call the Rising Sun"},{c:"Am    C     D         F",v:"And it's been the ruin of many a poor boy"},{c:"Am    E     Am",v:"And God I know I'm one"}]}
  ]},
  {t:"Wish You Were Here",a:"Pink Floyd",g:"rock",d:"medium",bpm:63,capo:0,strum:"Fingerpicking",chords:["Em7","G","A7sus4","C","D","Am"],sec:[
    {l:"Intro/Verse",ln:[{c:"Em7                   G",v:"So, so you think you can tell"},{c:"Em7                        A7sus4",v:"Heaven from hell, blue skies from pain?"},{c:"C                           D",v:"Can you tell a green field from a cold steel rail?"},{c:"Am                          G",v:"A smile from a veil? Do you think you can tell?"}]},
    {l:"Chorus",ln:[{c:"C               D",v:"We're just two lost souls swimming in a fish bowl"},{c:"G                 D",v:"Year after year, running over the same old ground"},{c:"Em7              C   G",v:"We wish you were here"}]}
  ]},
  {t:"Sweet Home Alabama",a:"Lynyrd Skynyrd",g:"rock",d:"easy",bpm:98,capo:0,strum:"D DD UDU",chords:["D","C","G"],sec:[
    {l:"Verse",ln:[{c:"D           C         G",v:"Big wheels keep on turning"},{c:"D             C        G",v:"Carry me home to see my kin"},{c:"D        C         G",v:"Singing songs about the Southland"},{c:"D                  C            G",v:"I miss Alabamy once again and I think it's a sin"}]},
    {l:"Chorus",ln:[{c:"D         C    G",v:"Sweet home Alabama, where the skies are so blue"},{c:"D         C       G",v:"Sweet home Alabama, Lord, I'm coming home to you"}]}
  ]},
  {t:"Smoke on the Water",a:"Deep Purple",g:"rock",d:"easy",bpm:112,capo:0,strum:"Power chord riff",chords:["Gm","Bb","C","Db"],sec:[
    {l:"Verse",ln:[{c:"Gm                     Bb   C",v:"We all came out to Montreux"},{c:"Gm              Bb    Db   C",v:"On the Lake Geneva shoreline"},{c:"Gm                        Bb   C",v:"To make records with a mobile"},{c:"Gm          Bb      Db  C",v:"We didn't have much time"}]},
    {l:"Chorus",ln:[{c:"Gm   Bb  C",v:"Smoke on the water, a fire in the sky"},{c:"Gm   Bb     Db   C",v:"Smoke on the water"}]}
  ]},
  {t:"Hotel California",a:"Eagles",g:"rock",d:"hard",bpm:74,capo:0,strum:"Arpeggio",chords:["Bm","F#","A","E","G","D","Em","F#7"],sec:[
    {l:"Verse",ln:[{c:"Bm                  F#",v:"On a dark desert highway, cool wind in my hair"},{c:"A                      E",v:"Warm smell of colitas rising up through the air"},{c:"G                     D",v:"Up ahead in the distance, I saw a shimmering light"},{c:"Em                             F#",v:"My head grew heavy and my sight grew dim, I had to stop for the night"}]},
    {l:"Chorus",ln:[{c:"G                  D",v:"Welcome to the Hotel California"},{c:"Bm                        F#",v:"Such a lovely place, such a lovely face"},{c:"G                        D",v:"Plenty of room at the Hotel California"},{c:"Em                   F#",v:"Any time of year you can find it here"}]}
  ]},
  {t:"Creep",a:"Radiohead",g:"rock",d:"easy",bpm:92,capo:0,strum:"D DU",chords:["G","B","C","Cm"],sec:[
    {l:"Verse",ln:[{c:"G                B",v:"When you were here before, couldn't look you in the eye"},{c:"C                    Cm",v:"You're just like an angel, your skin makes me cry"},{c:"G                  B",v:"You float like a feather in a beautiful world"},{c:"C                    Cm",v:"I wish I was special, you're so very special"}]},
    {l:"Chorus",ln:[{c:"G              B",v:"But I'm a creep, I'm a weirdo"},{c:"C                Cm",v:"What the hell am I doing here? I don't belong here"}]}
  ]},
  {t:"Brown Eyed Girl",a:"Van Morrison",g:"rock",d:"easy",bpm:150,capo:0,strum:"D DU UDU",chords:["G","C","D","Em"],sec:[
    {l:"Verse",ln:[{c:"G              C",v:"Hey where did we go, days when the rains came?"},{c:"G              D",v:"Down in the hollow, playing a new game"},{c:"G             C",v:"Laughing and a-running hey hey, skipping and a-jumping"},{c:"G          D             G",v:"In the misty morning fog with our hearts a-thumping"}]},
    {l:"Chorus",ln:[{c:"D               G    C",v:"My brown eyed girl, my brown eyed girl"},{c:"G            D",v:"Do you remember when we used to sing"}]}
  ]},
  {t:"With or Without You",a:"U2",g:"rock",d:"easy",bpm:110,capo:0,strum:"D DU UDU",chords:["D","A","Bm","G"],sec:[
    {l:"Verse",ln:[{c:"D                A",v:"See the stone set in your eyes"},{c:"Bm                 G",v:"See the thorn twist in your side"},{c:"D                 A",v:"I wait for you"},{c:"Bm              G",v:"Sleight of hand and twist of fate"}]},
    {l:"Chorus",ln:[{c:"D               A",v:"And you give yourself away"},{c:"Bm               G",v:"And you give yourself away"},{c:"D     A       Bm    G",v:"With or without you, I can't live with or without you"}]}
  ]},
  {t:"Nothing Else Matters",a:"Metallica",g:"rock",d:"medium",bpm:70,capo:0,strum:"Fingerpicking",chords:["Em","Am","C","D","G","B7"],sec:[
    {l:"Verse",ln:[{c:"Em              Am",v:"So close no matter how far"},{c:"C              G         B7",v:"Couldn't be much more from the heart"},{c:"Em               Am",v:"Forever trusting who we are"},{c:"C      D    G",v:"And nothing else matters"}]},
    {l:"Chorus",ln:[{c:"Em           D        C",v:"Never cared for what they do"},{c:"Em           D        C",v:"Never cared for what they know"},{c:"Em    D    C    G    B7  Em",v:"But I know"}]}
  ]},
  {t:"Smells Like Teen Spirit",a:"Nirvana",g:"rock",d:"medium",bpm:116,capo:0,strum:"D DUDUDU",chords:["F5","Bb5","Ab5","Db5"],sec:[
    {l:"Verse",ln:[{c:"F5    Bb5   Ab5   Db5",v:"Load up on guns, bring your friends"},{c:"F5    Bb5   Ab5   Db5",v:"It's fun to lose and to pretend"},{c:"F5    Bb5   Ab5   Db5",v:"She's over-bored and self-assured"},{c:"F5    Bb5   Ab5   Db5",v:"Oh no, I know a dirty word"}]},
    {l:"Chorus",ln:[{c:"F5       Bb5    Ab5     Db5",v:"Hello, hello, hello, how low?"},{c:"F5   Bb5  Ab5   Db5",v:"With the lights out it's less dangerous"},{c:"F5   Bb5    Ab5   Db5",v:"Here we are now, entertain us"}]}
  ]},
  // ── POP ───────────────────────────────────────────────────────────────────
  {t:"Let It Be",a:"The Beatles",g:"pop",d:"easy",bpm:70,capo:0,strum:"D DU UDU",chords:["C","G","Am","F"],sec:[
    {l:"Verse",ln:[{c:"C              G",v:"When I find myself in times of trouble"},{c:"Am                F",v:"Mother Mary comes to me"},{c:"C               G",v:"Speaking words of wisdom"},{c:"F        C",v:"Let it be"}]},
    {l:"Chorus",ln:[{c:"C   G   Am  F",v:"Let it be, let it be, let it be, let it be"},{c:"C             G        F   C",v:"Whisper words of wisdom, let it be"}]}
  ]},
  {t:"Yesterday",a:"The Beatles",g:"pop",d:"medium",bpm:96,capo:0,strum:"Fingerpicking",chords:["F","Em7","A7","Dm","Bb","C","C7"],sec:[
    {l:"Verse",ln:[{c:"F               Em7   A7",v:"Yesterday, all my troubles seemed so far away"},{c:"Dm    C    Bb        C7   F",v:"Now it looks as though they're here to stay"},{c:"Dm  C    Bb    F",v:"Oh I believe in yesterday"}]},
    {l:"Bridge",ln:[{c:"Em7  A7   Dm  C  Bb  Dm",v:"Why she had to go I don't know, she wouldn't say"},{c:"Em7  A7    Dm  C    Bb    F",v:"I said something wrong, now I long for yesterday"}]}
  ]},
  {t:"Stand By Me",a:"Ben E. King",g:"pop",d:"easy",bpm:121,capo:0,strum:"D DU",chords:["A","F#m","D","E"],sec:[
    {l:"Verse",ln:[{c:"A                          F#m",v:"When the night has come and the land is dark"},{c:"D                 E              A",v:"And the moon is the only light we'll see"},{c:"A                            F#m",v:"No I won't be afraid, no I won't be afraid"},{c:"D              E           A",v:"Just as long as you stand, stand by me"}]},
    {l:"Chorus",ln:[{c:"A",v:"Darlin' darlin' stand by me"},{c:"F#m",v:"Oh stand by me"},{c:"D         E          A",v:"Oh stand, stand by me, stand by me"}]}
  ]},
  {t:"Can't Help Falling in Love",a:"Elvis Presley",g:"pop",d:"easy",bpm:68,capo:0,strum:"D DU UDU",chords:["C","Em","Am","F","G","C/E","Dm"],sec:[
    {l:"Verse",ln:[{c:"C     Em  Am   F   C",v:"Wise men say only fools rush in"},{c:"F   G   Am  F  C  G  C",v:"But I can't help falling in love with you"},{c:"C    Em   Am   F   C",v:"Shall I stay, would it be a sin?"},{c:"F   G    Am   F   C   G  C",v:"If I can't help falling in love with you?"}]},
    {l:"Bridge",ln:[{c:"Em             B7",v:"Like a river flows surely to the sea"},{c:"Em             B7",v:"Darling so it goes, some things are meant to be"},{c:"F   G   Am  F  C   G  C",v:"Take my hand, take my whole life too"}]}
  ]},
  {t:"Shallow",a:"Lady Gaga & Bradley Cooper",g:"pop",d:"medium",bpm:96,capo:0,strum:"D DU UDU",chords:["Em7","D","G","C","Am"],sec:[
    {l:"Verse",ln:[{c:"Em7              D              G",v:"Tell me something girl, are you happy in this modern world?"},{c:"Em7               D                G",v:"Or do you need more? Is there something else you're searching for?"},{c:"Em7           D           G",v:"I'm falling, in all the good times I find myself"},{c:"Em7       D     G",v:"Longing for change and in the bad times I fear myself"}]},
    {l:"Chorus",ln:[{c:"Am                G         D",v:"I'm off the deep end, watch as I dive in"},{c:"Am               G       D",v:"I'll never meet the ground"},{c:"Am         G         D",v:"Crash through the surface where they can't hurt us"},{c:"G         Am        C   G  D",v:"We're far from the shallow now"}]}
  ]},
  {t:"Budapest",a:"George Ezra",g:"pop",d:"easy",bpm:128,capo:0,strum:"D DU UDU",chords:["C","G","Am","F"],sec:[
    {l:"Verse",ln:[{c:"C                           G",v:"My house in Budapest, my hidden treasure chest"},{c:"Am                        F",v:"Golden grand piano, my beautiful Castillo"},{c:"C                       G",v:"You, ooh, you, ooh, I'd leave it all"},{c:"Am           F",v:"My acres of a land I have achieved"}]},
    {l:"Chorus",ln:[{c:"C    G     Am    F",v:"Give me one good reason why I should never make a change"},{c:"C       G        Am     F",v:"Baby if you hold me then all of this will go away"}]}
  ]},
  {t:"Over the Rainbow",a:"Judy Garland",g:"pop",d:"easy",bpm:76,capo:0,strum:"Fingerpicking",chords:["C","Em","F","Fm","G","Am","E7"],sec:[
    {l:"Verse",ln:[{c:"C        Em        F    C",v:"Somewhere over the rainbow, way up high"},{c:"F        C       Am  E7   F   C",v:"There's a land that I heard of once in a lullaby"},{c:"C       Em        F    C",v:"Somewhere over the rainbow, skies are blue"},{c:"F           C         Am   E7   F   C",v:"And the dreams that you dare to dream really do come true"}]},
    {l:"Bridge",ln:[{c:"G              F      C",v:"Someday I'll wish upon a star"},{c:"G               F         C",v:"And wake up where the clouds are far behind me"}]}
  ]},
  {t:"Angels",a:"Robbie Williams",g:"pop",d:"easy",bpm:74,capo:0,strum:"D DU",chords:["A","E","F#m","D","Bm"],sec:[
    {l:"Verse",ln:[{c:"A                         E",v:"I sit and wait, does an angel contemplate my fate?"},{c:"F#m                  D",v:"And do they know the places where we go"},{c:"A                E",v:"When we're grey and old?"},{c:"F#m             D",v:"'Cause I've been told that salvation lets their wings unfold"}]},
    {l:"Chorus",ln:[{c:"A              E",v:"And through it all she offers me protection"},{c:"F#m            D",v:"A lot of love and affection"},{c:"A           E",v:"Whether I'm right or wrong"},{c:"F#m             D          A",v:"And down the waterfall wherever it may take me"}]}
  ]},
  // ── BLUES ─────────────────────────────────────────────────────────────────
  {t:"Sweet Home Chicago",a:"Robert Johnson",g:"blues",d:"medium",bpm:92,capo:0,strum:"Shuffle",chords:["E7","A7","B7"],sec:[
    {l:"Verse",ln:[{c:"E7                               A7",v:"Oh baby don't you want to go?"},{c:"E7                         B7",v:"Back to the land of California"},{c:"A7                            E7",v:"To my sweet home Chicago"},{c:"B7      A7   E7",v:"Oh baby don't you want to go?"}]}
  ]},
  {t:"The Thrill Is Gone",a:"B.B. King",g:"blues",d:"medium",bpm:55,capo:0,strum:"Slow Blues",chords:["Bm","Em","G","F#7"],sec:[
    {l:"Verse",ln:[{c:"Bm",v:"The thrill is gone, the thrill is gone away"},{c:"Bm",v:"The thrill is gone baby, the thrill is gone away"},{c:"Em                         Bm",v:"You know you done me wrong baby"},{c:"F#7            Bm",v:"And you'll be sorry someday"}]}
  ]},
  {t:"Pride and Joy",a:"Stevie Ray Vaughan",g:"blues",d:"hard",bpm:120,capo:0,strum:"Shuffle",chords:["E7","A7","B7"],sec:[
    {l:"Verse",ln:[{c:"E7",v:"Well you've heard about lovin' giving sight to the blind"},{c:"A7",v:"My baby's lovin' cause the sun to shine"},{c:"E7",v:"She's my sweet little thang, she's my pride and joy"},{c:"B7              A7         E7",v:"She's my sweet little baby, I'm her little lover boy"}]}
  ]},
  {t:"Crossroads",a:"Robert Johnson",g:"blues",d:"hard",bpm:116,capo:0,strum:"Shuffle",chords:["A7","D7","E7"],sec:[
    {l:"Verse",ln:[{c:"A7",v:"I went to the crossroad, fell down on my knees"},{c:"D7                       A7",v:"I went to the crossroad, fell down on my knees"},{c:"E7             D7              A7",v:"Asked the Lord above have mercy, save poor Bob if you please"}]}
  ]},
  // ── FOLK ──────────────────────────────────────────────────────────────────
  {t:"Blowin' in the Wind",a:"Bob Dylan",g:"folk",d:"easy",bpm:84,capo:0,strum:"D DU UDU",chords:["D","G","A"],sec:[
    {l:"Verse",ln:[{c:"D               G          D",v:"How many roads must a man walk down"},{c:"D               G        A",v:"Before you call him a man?"},{c:"D                G         D",v:"How many seas must a white dove sail"},{c:"D              G           A",v:"Before she sleeps in the sand?"}]},
    {l:"Chorus",ln:[{c:"G          A       D",v:"The answer, my friend, is blowin' in the wind"},{c:"G         A         D",v:"The answer is blowin' in the wind"}]}
  ]},
  {t:"The Sound of Silence",a:"Simon & Garfunkel",g:"folk",d:"medium",bpm:104,capo:0,strum:"Fingerpicking",chords:["Am","G","C","F","E"],sec:[
    {l:"Verse",ln:[{c:"Am                G",v:"Hello darkness my old friend"},{c:"Am                        G",v:"I've come to talk with you again"},{c:"C           F       C",v:"Because a vision softly creeping"},{c:"C         F          C",v:"Left its seeds while I was sleeping"},{c:"F                       C",v:"And the vision that was planted in my brain"},{c:"Am              E     Am",v:"Still remains within the sound of silence"}]}
  ]},
  {t:"Fast Car",a:"Tracy Chapman",g:"folk",d:"easy",bpm:100,capo:0,strum:"Fingerpicking",chords:["Dmaj7","A","Bm","G"],sec:[
    {l:"Verse",ln:[{c:"Dmaj7              A",v:"You got a fast car, I want a ticket to anywhere"},{c:"Bm                     G",v:"Maybe we make a deal, maybe together we can get somewhere"},{c:"Dmaj7           A",v:"Any place is better, starting from zero got nothing to lose"},{c:"Bm                G",v:"Maybe we'll make something, me myself I got nothing to prove"}]},
    {l:"Chorus",ln:[{c:"Dmaj7      A",v:"You got a fast car, I got a plan to get us out of here"},{c:"Bm         G",v:"I been working at the convenience store"},{c:"Dmaj7      A    Bm   G",v:"Managed to save just a little bit of money, won't have to drive too far"}]}
  ]},
  {t:"La Bamba",a:"Ritchie Valens",g:"folk",d:"easy",bpm:168,capo:0,strum:"D DU DU",chords:["C","F","G"],sec:[
    {l:"Verse",ln:[{c:"C    F    G",v:"Para bailar La Bamba"},{c:"C       F       G",v:"Para bailar La Bamba"},{c:"C     F       G",v:"Se necesita una poca de gracia"},{c:"C        F      G",v:"Una poca de gracia para mí para tí"}]},
    {l:"Chorus",ln:[{c:"C  F  G    C  F  G",v:"Arriba, arriba, y arriba y arriba"},{c:"C      F     G",v:"Por ti seré, por ti seré"}]}
  ]},
  // ── COUNTRY ───────────────────────────────────────────────────────────────
  {t:"Take Me Home, Country Roads",a:"John Denver",g:"country",d:"easy",bpm:84,capo:2,strum:"D DU UDU",chords:["G","Em","C","D"],sec:[
    {l:"Verse",ln:[{c:"G                  Em",v:"Almost heaven, West Virginia"},{c:"C                 G",v:"Blue Ridge Mountains, Shenandoah River"},{c:"G               Em",v:"Life is old there, older than the trees"},{c:"C              G        D",v:"Younger than the mountains, growing like a breeze"}]},
    {l:"Chorus",ln:[{c:"G                  D",v:"Take me home, country roads"},{c:"Em                 C",v:"To the place I belong"},{c:"G              D",v:"West Virginia, mountain mama"},{c:"C           G",v:"Take me home, country roads"}]}
  ]},
  {t:"Ring of Fire",a:"Johnny Cash",g:"country",d:"easy",bpm:104,capo:0,strum:"D DU",chords:["G","C","D"],sec:[
    {l:"Verse",ln:[{c:"G                C     G",v:"Love is a burning thing"},{c:"G            D    G",v:"And it makes a fiery ring"},{c:"G             C    G",v:"Bound by wild desire"},{c:"G         D       G",v:"I fell into a ring of fire"}]},
    {l:"Chorus",ln:[{c:"D                  C    G",v:"I fell into a burning ring of fire"},{c:"D                        G",v:"I went down, down, down and the flames went higher"},{c:"C           G",v:"And it burns, burns, burns"},{c:"D         G",v:"The ring of fire, the ring of fire"}]}
  ]},
  {t:"Jolene",a:"Dolly Parton",g:"country",d:"easy",bpm:105,capo:0,strum:"DU DU",chords:["Am","C","G","E"],sec:[
    {l:"Chorus",ln:[{c:"Am           C",v:"Jolene, Jolene, Jolene, Jolene"},{c:"G                      Am",v:"I'm begging of you please don't take my man"},{c:"Am           C",v:"Jolene, Jolene, Jolene, Jolene"},{c:"G                      Am",v:"Please don't take him just because you can"}]},
    {l:"Verse",ln:[{c:"Am              C",v:"Your beauty is beyond compare"},{c:"G                 Am",v:"With flaming locks of auburn hair"},{c:"Am              C            G",v:"With ivory skin and eyes of emerald green"},{c:"Am              C",v:"Your smile is like a breath of spring"},{c:"G                Am",v:"Your voice is soft like summer rain"},{c:"Am                C          G      Am",v:"And I cannot compete with you Jolene"}]}
  ]},
  // ── METAL ─────────────────────────────────────────────────────────────────
  {t:"Enter Sandman",a:"Metallica",g:"metal",d:"medium",bpm:123,capo:0,strum:"Palm mute riff",chords:["Em","G5","F#5","E5","C","D"],sec:[
    {l:"Verse",ln:[{c:"Em",v:"Say your prayers little one"},{c:"Em",v:"Don't forget my son"},{c:"Em",v:"To include everyone"},{c:"G5  F#5  E5",v:"Tuck you in warm within"}]},
    {l:"Chorus",ln:[{c:"C    D    Em",v:"Exit light, enter night"},{c:"C        D     E5",v:"Take my hand, we're off to never-never land"}]}
  ]},
  // ── CLASSICAL ─────────────────────────────────────────────────────────────
  {t:"Classical Gas",a:"Mason Williams",g:"classical",d:"hard",bpm:120,capo:0,strum:"Fingerpicking",chords:["Am","G","F","E7","C","Dm"],sec:[
    {l:"Theme A",ln:[{c:"Am  G   Am",v:"[Fingerpicked melody — no lyrics]"},{c:"F   E7  Am",v:"[Ascending run]"}]},
    {l:"Theme B",ln:[{c:"C   G   Am  Dm",v:"[Classical fingerpicking pattern]"},{c:"E7          Am",v:"[Resolution to Am]"}]}
  ]},
  {t:"Romanza",a:"Traditional Spanish",g:"classical",d:"hard",bpm:80,capo:0,strum:"Fingerpicking p i m a",chords:["Em","B7","G","C","Am"],sec:[
    {l:"Section A",ln:[{c:"Em",v:"[Fingerpicked melody on high strings]"},{c:"B7       Em",v:"[Resolution phrase]"}]},
    {l:"Section B",ln:[{c:"E   Am  E  Am",v:"[Major section — bright and flowing]"},{c:"G   C   G  B7",v:"[Return to Em]"}]}
  ]},
  // ── JAZZ ──────────────────────────────────────────────────────────────────
  {t:"Autumn Leaves",a:"Joseph Kosma",g:"jazz",d:"hard",bpm:100,capo:0,strum:"Jazz comping",chords:["Cm7","F7","Bbmaj7","Ebmaj7","Am7b5","D7","Gm"],sec:[
    {l:"A Section",ln:[{c:"Cm7       F7         Bbmaj7",v:"The falling leaves drift by the window"},{c:"Ebmaj7     Am7b5    D7      Gm",v:"The autumn leaves of red and gold"}]},
    {l:"B Section",ln:[{c:"Am7b5     D7        Gm",v:"I see your lips, the summer kisses"},{c:"Cm7     F7         Bbmaj7",v:"The sunburned hands I used to hold"},{c:"Ebmaj7    Am7b5  D7   Gm",v:"Since you went away the days grow long"}]}
  ]},
  // ── FLAMENCO ──────────────────────────────────────────────────────────────
  {t:"Malagueña",a:"Traditional",g:"flamenco",d:"hard",bpm:120,capo:0,strum:"Rasgueado + Picado",chords:["E","F","G","Am"],sec:[
    {l:"Theme",ln:[{c:"Am   G   F   E",v:"[Phrygian descent — iconic flamenco cadence]"},{c:"Am",v:"[Tremolo melody]"}]},
    {l:"Falseta",ln:[{c:"E7  Am  E7  Am",v:"[Rhythmic rasgueado section]"},{c:"F   E",v:"[Resolution to E Phrygian]"}]}
  ]},
  {t:"Entre dos Aguas",a:"Paco de Lucía",g:"flamenco",d:"hard",bpm:130,capo:0,strum:"Rumba flamenca",chords:["Am","E7","Dm","G","C"],sec:[
    {l:"Main Theme",ln:[{c:"Am          E7",v:"[Rumba rhythm — 1-2-3, 1-2]"},{c:"Am",v:"[Picado melody line]"}]},
    {l:"Bridge",ln:[{c:"Dm   Am   E7   Am",v:"[Chord modulation]"},{c:"G    C    E7",v:"[Return to Phrygian]"}]}
  ]},
];

const FLAMENCO_TECHNIQUES = [
  { n:'Rasgueado', desc:'Fan strum using sequential finger releases — produces the signature flamenco chord burst.', beats:[1,0,0,2,0,0,3,0,0,4,0,0] },
  { n:'Picado', desc:'Single-note scale technique using alternating index and middle fingers at speed.', beats:[1,0,2,0,3,0,4,0,5,0,6,0] },
  { n:'Alzapúa', desc:'Thumb technique combining downstroke melody with upstroke chord — unique to flamenco.', beats:[1,0,0,0,2,0,0,0,3,0,0,0] },
  { n:'Golpe', desc:'Percussive tap on the guitar body with the ring finger — adds rhythmic punctuation.', beats:[0,0,0,1,0,0,0,1,0,0,0,1] },
  { n:'Tremolo', desc:'Rapid repetition of a single note (p-a-m-i) creating a singing, sustained melody.', beats:[1,0,2,0,3,0,4,0,1,0,2,0] },
  { n:'Soleares Compás', desc:'12-beat cycle with accents on 3, 6, 8, 10, 12 — the foundation of soleares.', beats:[0,0,1,0,0,1,0,1,0,1,0,1], strong:[3,6,8,10,12] },
];

// curGenre and songPage already in global state
let songDiff   = 'all';
let selectedSong = null;
let songsInit  = false;
const PAGE_SIZE = 16;

function buildGenreTabs() {
  document.getElementById('genre-tabs').innerHTML = GENRES.map(g =>
    `<button class="genre-tab${g === curGenre ? ' active' : ''}" onclick="setSongGenre('${g}')">${GENRE_LABELS[g]}</button>`
  ).join('');
}

function setSongGenre(g) {
  curGenre = g; songPage = 0; selectedSong = null;
  buildGenreTabs(); renderSongs(); renderFlamenco();
}
function setSongDiff(d) {
  songDiff = d; songPage = 0; selectedSong = null;
  document.querySelectorAll('.diff-pill').forEach(p => p.classList.toggle('active', p.dataset.val === d));
  renderSongs();
}

function filteredSongs() {
  const q = (document.getElementById('song-search')?.value || '').toLowerCase();
  return SONGS.filter(s => {
    if (curGenre !== 'all' && s.g !== curGenre) return false;
    if (songDiff !== 'all' && s.d !== songDiff) return false;
    if (q && !s.t.toLowerCase().includes(q) && !s.a.toLowerCase().includes(q)) return false;
    return true;
  });
}

function renderSongs() {
  const songs = filteredSongs();
  const pages  = Math.max(1, Math.ceil(songs.length / PAGE_SIZE));
  songPage     = Math.min(songPage, pages - 1);
  const slice  = songs.slice(songPage * PAGE_SIZE, (songPage + 1) * PAGE_SIZE);

  document.getElementById('songs-grid').innerHTML = slice.length ? slice.map((s, i) => {
    const globalIdx = songPage * PAGE_SIZE + i;
    const diffClass = s.d === 'easy' ? 'diff-easy' : s.d === 'medium' ? 'diff-medium' : 'diff-hard';
    const capoStr   = s.capo > 0 ? `· Capo ${s.capo}` : '';
    const isSelected = selectedSong === s;
    return `<div class="song-card song-genre-${s.g}${isSelected ? ' selected' : ''}" onclick="showPlayPanel(${globalIdx})">
      <div class="song-title">${s.t}</div>
      <div class="song-artist">${s.a}</div>
      <div class="song-chords">${s.chords.join(' · ')}</div>
      <div class="song-meta">
        <span class="diff-badge ${diffClass}">${s.d}</span>
        <span class="song-meta-item"><i class="fa-solid fa-drum"></i> ${s.bpm} BPM</span>
        <span class="song-meta-item">${GENRE_LABELS[s.g]} ${capoStr}</span>
      </div>
    </div>`;
  }).join('') : `<div style="color:var(--text-muted);padding:32px;grid-column:1/-1;text-align:center;">No songs found</div>`;

  // Pagination
  document.getElementById('songs-pagination').innerHTML = Array.from({length: pages}, (_, i) =>
    `<button class="page-btn${i === songPage ? ' active' : ''}" onclick="goSongPage(${i})">${i+1}</button>`
  ).join('');

  document.getElementById('play-panel-wrap').innerHTML = '';
}

function goSongPage(p) { songPage = p; selectedSong = null; renderSongs(); }

function showPlayPanel(globalIdx) {
  const songs = filteredSongs();
  const s = songs[globalIdx];
  if (!s) return;
  selectedSong = s;
  renderSongs(); // re-render to show selection

  const capoStr = s.capo > 0 ? `Capo ${s.capo} · ` : '';
  const sections = s.sec.map(sec => `
    <div class="play-section-label">${sec.l}</div>
    ${sec.ln.map(ln => `
      <div class="play-chord-line">${ln.c}</div>
      <div class="play-lyric-line">${ln.v}</div>
    `).join('')}
  `).join('');

  document.getElementById('play-panel-wrap').innerHTML = `
    <div class="play-panel">
      <div class="play-song-title">${s.t}</div>
      <div class="play-song-artist">${s.a} · ${capoStr}${s.bpm} BPM · ${GENRE_LABELS[s.g]}</div>
      <span class="play-strum"><i class="fa-solid fa-music" style="margin-right:5px;"></i>${s.strum}</span>
      ${sections}
      <div class="play-actions">
        <button class="btn btn-wood" onclick="loadSongIntoTransposer(${globalIdx})">
          <i class="fa-solid fa-arrows-left-right"></i> Transpose
        </button>
        <button class="btn btn-ghost" onclick="go('chords')">
          <i class="fa-solid fa-hand"></i> View Chords
        </button>
      </div>
    </div>`;
  document.getElementById('play-panel-wrap').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function loadSongIntoTransposer(globalIdx) {
  const songs = filteredSongs();
  const s = songs[globalIdx];
  if (!s) return;
  const text = s.sec.map(sec =>
    `[${sec.l}]\n` + sec.ln.map(ln => `${ln.c}\n${ln.v}`).join('\n')
  ).join('\n\n');
  go('transposer');
  setTimeout(() => {
    const el = document.getElementById('trp-input');
    if (el) { el.value = text; trpReset(); trpUpdate(); }
  }, 100);
}

function renderFlamenco() {
  const wrap = document.getElementById('flamenco-module');
  if (curGenre !== 'all' && curGenre !== 'flamenco') { wrap.innerHTML = ''; return; }
  wrap.innerHTML = `
    <div class="flamenco-module">
      <div class="flamenco-title"><i class="fa-solid fa-fire" style="color:var(--rust);margin-right:8px;"></i>Flamenco Techniques</div>
      <div class="flamenco-grid">
        ${FLAMENCO_TECHNIQUES.map(t => {
          const strong = t.strong || t.beats.map((b,i) => b > 0 ? i+1 : -1).filter(x => x > 0);
          const boxes  = Array.from({length:12},(_,i) => {
            const isStrong = strong.includes(i+1);
            return `<div class="compas-beat${isStrong ? ' strong' : ''}">${i+1}</div>`;
          }).join('');
          return `<div class="flamenco-card">
            <div class="flamenco-card-name">${t.n}</div>
            <div class="flamenco-card-desc">${t.desc}</div>
            <div class="compas-row">${boxes}</div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
}

