# FretFlow structure

FretFlow was originally a single self-contained `fretflow.html` file (HTML +
CSS + JS inline). It's now split into a plain multi-file static site —
still **zero build step, no bundler, no framework** — so it can be opened
from any static host (or `file://`) exactly as before, just organized into
files that are easier to navigate and co-work on.

## Why plain scripts, not ES modules

Files are loaded via plain `<link rel="stylesheet">` / `<script src>` tags
in global scope, not `type="module"`. ES modules are blocked by CORS when
opened directly via `file://` in most browsers — plain scripts aren't, so
the "runs entirely in the browser, no server required" property is preserved.

## File map

| File | Contents (from the original `═══` section banners) |
|---|---|
| `index.html` | Page shell: `<head>` links, nav + all 9 section markups, metronome overlay, footer, script tags |
| `css/tokens.css` | Design tokens (`:root` vars), reset, base, scrollbar, typography |
| `css/layout.css` | Nav, sections, cards, buttons, footer chrome |
| `css/home.css` | Home page + hero/bento grid styling |
| `css/fretboard.css` / `tuner.css` / `metronome.css` / `chords.css` / `circle-of-fifths.css` / `transposer.css` / `songs.css` / `learning-paths.css` / `scales.css` | Per-feature styles |
| `js/data.js` | Global state vars, constants, scales data table |
| `js/audio.js` | Audio engine: `getAC()`, master limiter, `playNote`, `scheduleNoteSequence` |
| `js/fretboard.js` / `tuner.js` / `metronome.js` / `chords.js` / `circle-of-fifths.js` / `transposer.js` / `songs.js` / `learning-paths.js` / `scales.js` | One file per feature, unchanged logic |
| `js/app.js` | Nav router (`go()`), metronome-overlay close handler, `go('home')` bootstrap — loaded last |

Script load order matters once: `data.js` and `audio.js` must load before
the feature scripts (they declare the shared `let`/`const` state and the
audio engine those scripts call into); `app.js` loads last since it's the
only file with top-level code that calls into every other module.

## Bug fixes applied during this refactor

Four correctness bugs found in code review were fixed before the split
(see `fretflow.html` git history / `js/data.js`, `js/audio.js`,
`js/metronome.js`):
1. Unguarded `JSON.parse` on `localStorage` progress data — now wrapped in `try/catch`.
2. Metronome visual-beat `setTimeout`s weren't cancelled on stop — now tracked and cleared.
3. `hearScale`/`hearCOFScale`/`arpeggiate` could overlap audio on rapid re-trigger — now cancel the prior sequence via a shared `scheduleNoteSequence` helper.
4. `AudioContext.resume()` promise rejections were unhandled — now caught.

## Running locally

```
npx serve .
```
(config already in `.claude/launch.json`) then open `index.html`.

## Deploying

Already linked to Vercel — `vercel --prod` or push to the connected branch.
The repo is also on GitHub at `sumer-commits/FretFlow` for collaboration.

## Note

`fretflow.html` (the original single-file version) is kept in git history
only — it's removed from the working tree now that `index.html` + `css/` +
`js/` is the canonical source.
