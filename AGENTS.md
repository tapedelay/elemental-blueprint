# AGENTS.md

## 1. What this is

Elemental Blueprint is a self-knowledge and dating-compatibility web app that treats the Wu Xing five elements (Wood, Fire, Earth, Metal, Water) strictly as a secular behavioral pattern language: a 10-question assessment types the user, renders a full "Blueprint" of their pattern, and scores pairings with public figures or hand-entered profiles. It is one self-contained `index.html` (vanilla JS, no framework, no build, no dependencies) plus an optional zero-dependency Node companion (`server.js`) that bridges two features ("Ask" and "Read anyone") to the Claude Code CLI on the local machine, billed to the owner's own Claude subscription.

`SPEC.md` in this folder is the authoritative product spec (authored by the client, Atasha's brother) with dated amendments in sections 3, 7, 11a, 11b, and 11c. Read it before changing engine math or copy.

## 2. Build / run / test (verified 2026-07-09; static run re-verified 2026-10-06 on macOS via `python3 -m http.server 8873`)

There is no build step, no package.json, and no dependency install. Verified toolchain: Node v24.11.1 (any modern Node works; `server.js` uses only core `http`/`fs`/`path`/`child_process`).

| Task | Command |
|---|---|
| Run everything | `node server.js` from this folder, then open http://localhost:8873 |
| One-click run (Windows) | double-click `launch.bat` (Windows Terminal tab running the server + opens the browser) |
| Static only | open `index.html` directly; everything works except Ask / Read anyone, which self-hide |
| Test suite | open http://localhost:8873/?debug=1 and check the console: the fixture harness must print `14/14 fixtures passed` (or call `runFixtures()` in the console; it returns `true` on pass) |
| Server syntax check | `node --check server.js` |
| App script syntax check | `node -e "new Function(require('fs').readFileSync('index.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1])"` |

The preview/dev launch config is `.claude/launch.json` (name `elemental-blueprint`, port 8873). A sibling entry also exists in the parent folder's `Other/.claude/launch.json` with `autoPort: false`.

Ask / Read anyone additionally require the Claude Code CLI (`claude`) installed and signed in; the server spawns `claude -p --output-format text` per request (180 s timeout, 200 KB caps).

## 3. Architecture

```
index.html        the entire app, in strict section order:
                    <style>   night-build v2 theme (true black, phosphor ink, element colors)
                    CONTENT   every user-facing string, question bank, element blueprints, prompts
                    ENGINE    pure functions only, no DOM: scoring, ties, dyad math, codecs
                    FIXTURES  hand-computed expected values + runFixtures() harness (?debug=1)
                    UI        DOM, storage, screens, companion fetches; init() IIFE at the bottom
server.js         zero-dep local companion, binds 127.0.0.1:8873 only:
                    static file serving (path-traversal guarded)
                    GET  /api/health   -> { ok: true }
                    POST /api/ask      -> pipes prompt via stdin to `claude -p`; optional
                                          search:true appends --allowedTools WebSearch (only tool ever granted);
                                          rejects requests with a foreign Origin header (CSRF gate)
SPEC.md           authoritative spec + amendments; section 4 is the ground truth for dyad math
launch.bat        Windows one-click runner
__impl_questions.json  historical WIP artifact: the question-bank draft that was baked into CONTENT; safe to delete
.claude/launch.json    preview launch config
```

**Data flow, assessment path:** quiz answers (pick = 2 pts, optional "also me" = 1 pt) -> `scoreAnswers()` -> `{pct, pctF, primary, secondary, maturity, state}` -> persisted to localStorage `eb.v1` as the public shape from SPEC section 5 (`publicScores()`) -> screens render from the in-memory `UI` singleton. State thresholds: grounded >= 0.62, reactive <= 0.42, secondary >= 18%.

**Data flow, Read anyone:** name -> `buildPersonaPrompt()` (rules live in `CONTENT.persona.rules`) -> `POST /api/ask {search:true}` -> Claude returns strict JSON -> `parsePersona()` renormalizes pct to 100 and retypes primary/secondary from the numbers (never trusts the model's labels) -> `dyadScore(UI.scores, parsed.scores)` computes the pairing entirely locally from the `GEN`/`KE`/`REL` tables (SPEC section 4) -> rendered card + the pairing JSON is appended to subsequent Ask prompts.

**Screens:** `landing / framing / about / quiz / lately / reveal / blueprint / direct`, driven by `go(screen)` -> `render()` map. `render()` bumps the `UI._gen` generation counter, clears timers, and resets the companion busy flags; every async callback that touches the DOM captures `gen` and bails if it changed.

**Storage:** `eb.v1` (active result), `eb.profiles.v1` (saved results, cap 12, auto-stash before anything replaces the active result). Both have in-memory fallbacks (`memStore` / `memProfiles`) for private-mode/quota failures. Ask history is in-memory only, never persisted.

## 4. Current state

**Complete and verified (10/10 fixtures, plus live end-to-end runs in the browser):**
- Phase 1 per SPEC: typing engine, 10-question bank, reveal, pentagon SVG, five pure-type element blueprints, shareable `EB1.` code (copy in footer).
- Night-build v2 design (client-directed override of the spec's porcelain theme, documented in SPEC section 7): true black, AA-on-black element colors, Saturn/PS1 vector look, data-shaded lo-poly gem, scanlines. `forced-color-adjust:none` is set (the owner's Windows runs High Contrast by default).
- Ask companion (SPEC 11a) and Read anyone persona reads + local dyad scoring (SPEC 11b), both hardened by multi-agent review: Origin gate, generation guards, em-dash sanitizer (`cleanStr`), busy-flag lifecycle.
- Co-primary tie handling (SPEC section 3 amendment): display-resolution ties show both elements as primary everywhere, dyad math goes symmetric. Derived via `isCoPrimary()` from pct, never stored, so old saves/codes need no migration.
- Direct entry, blueprint-code loading, saved-results store (SPEC 11c), including forged-code rejection in `decodeBlueprint()`.
- Repo is pushed to GitHub: private `tapedelay/elemental-blueprint`, local `master` in sync with `origin/master` (verified 2026-07-09, at this commit). Direct-to-master pushes, no branches or PRs, per portfolio convention.

**Added 2026-10-06 (SPEC 11d), 14/14 fixtures:**
- Stress check screen (`lately`) after the bank; `scoreAnswers(answers, lately)` blends it into state. Fixes state barely depending on answers.
- Observer reads (`profile.subject`, `UI.observed`, CONTENT `other`/`o` wording), required names, saved-result rename/delete, every result listed on finish.
- Matches: `comboScore`/`rankMatches` with age/polarity modifiers, The Pull / The Hold, detail sheets.
- Compare: both-direction cards, `cycleEdges` arrow pentagon, orbit scene, `pairingReport`; Read anyone shares `dyadCardHTML`.
- 25 partner-pattern profiles (`CONTENT.combos`, `comboKey`), folded into `pairingReport`, Matches details, Compare, and the Blueprint "As a partner" section; a fixture checks all 25 exist and pass the banned-vocabulary/em-dash rules.
- Lo-poly crystal renderer (`crystalVerts`/`rasterCrystal`/`drawCrystal`/`drawOrbit`, `mountCrystals` under the `_gen` guard), boot, image export (`saveCardImage`).

**Still open:**
- Friendship/work lens, PWA manifest, question bank growth toward ~20 items.
- `index.html` is ~173 KB, over SPEC section 10's ~150 KB guideline (accepted 2026-10-06 for the 25 profiles; the guideline is soft).

**Untested / known gaps:**
- No real-device pass yet (iPad/phone). The quiz's long-press "also me" gesture and the 375 px layout are the risk areas.
- The relation *label* on a co-primary pairing describes the canonical-first channel only (the score itself is symmetric); acceptable, but a future copy pass could name both channels.

## 5. Next steps, in priority order

1. **Phase 2, matching engine content.** Write all 25 element-pair combo profiles in a single session (SPEC section 10, voice-consistency rule) and add the ranked-matches screen using the existing `dyadScore`. Ground truth: SPEC section 4 tables and pseudocode; respect the documented deviation that a specific-person read never assesses the subject's maturity, but ranked hypothetical matching per spec may apply the age/polarity modifiers that `dyadScore` currently omits.
2. **Real-device pass.** Run the full quiz on an iPad/phone: long-press "also me" (450 ms threshold, `UI._suppressClick` guard), reveal count-up, direct-entry number inputs, form focus states. Fix what breaks.
3. **Send it to the client (her brother).** The app is feature-complete for a first review; his SPEC section 11 open questions (final name, friendship mode, trap-badge bluntness, languages) block Phase 2 copy decisions.
4. **Phase 1.5 leftovers (optional, from a first-principles review):** live conditional-flow diagnostics drawn on the pentagon (generation/control/drain arrows from the user's actual numbers) and shadow-matched practice suggestions.

## 6. Decisions and gotchas

- **CONTENT / ENGINE separation is a hard contract.** All copy lives in the CONTENT const; ENGINE functions are pure and DOM-free. Fixtures depend on this. Do not interleave.
- **Two documented engine deviations from a naive SPEC reading; they are commented in the code and must NOT be "fixed":** (1) "also me" answers count toward maturity hits at weight 1, (2) overall maturity is normalized over elements WITH valenced hits only.
- **Copy rules:** strictly secular language; banned vocabulary (destiny, chakra, astrology terms, any medical/diagnostic framing) and the states-are-weather-never-identity rule are SPEC section 8; no emoji anywhere in the UI is SPEC section 7; attachment labels being internal-only (never shown as a clinical label) is SPEC section 2. No em dashes in user-facing text is a code-level rule with no SPEC text behind it: model output is sanitized by `cleanStr` (em dashes become "; ", dangling punctuation after truncation is trimmed), and hand-written CONTENT follows it by convention.
- **Never color-code quiz options by element.** Color = element identity everywhere else in the app; on the quiz it would leak the mapping and bias answers.
- **Co-primary is judged at display resolution** (rounded pct equality), deliberately: if the screen shows 27% and 27%, claiming an order between them is indefensible. The canonical element order still decides which is stored as `primary` (stable storage shape), but presentation and dyad math treat them symmetrically.
- **Ethics rule in dyad math:** the subject's maturity/state is never assessed; the stability/chemistry blend weights come from the USER's state only (grounded .75/.25, integrating .55/.45, reactive .30/.70). Tiers cut at 85/70/55/40 on the unrounded blend. The "trap" badge = subject-controls-user relation while the user is reactive.
- **`decodeBlueprint` enforces producer invariants** (all five pct keys numeric and summing to ~100, primary != secondary, valid state/maturity). The two producers of the full stored shape (`scoreAnswers`, `manualScores`) guarantee these; keep the validator in sync if the shape ever changes. Note `parsePersona` deliberately produces a partial shape (`pct`/`pctF`/`primary`/`secondary`, no maturity or state, since a public figure's maturity is never assessed); its output feeds `dyadScore` only and would not pass `decodeBlueprint`.
- **Stash-before-rename:** `renderAbout()` must stash the outgoing result BEFORE its name field renders, because `#nm` live-binds every keystroke into `UI.profile.name` and `stashCurrent()` labels the stash from that field. Moving the stash later reintroduces a result-relabeling bug that was caught in review.
- **`UI._gen` guard pattern:** any async callback (fetches, timers, rAF) that touches the DOM must capture `const gen = UI._gen` at start and return early if `UI._gen !== gen` when it fires. `render()` is the only place `_gen` increments.
- **Companion security model:** prompt goes to the CLI via stdin only (no shell-arg surface); `search:true` is a strict boolean that appends the fixed pair `--allowedTools WebSearch` and nothing else; POST `/api/ask` rejects any request bearing a foreign `Origin` header, closing the preflight-free `text/plain` cross-site POST hole while keeping same-machine curl (no Origin header) working.
- **Manual-entry maturity is synthetic:** direct entry has no per-answer valence data, so `manualScores` uses representative state midpoints (grounded .72, integrating .52, reactive .32) for `maturity.overall` and leaves `perElement` empty. Do not treat these as measured.
- **Preview/testing quirk:** the embedded preview tab often reports `visibilityState === "hidden"`, which suspends requestAnimationFrame; screenshots time out and count-up animations stall. Verify via DOM evaluation/snapshots instead; the reveal count-up has a settle timeout for exactly this reason. Synthetic long-press testing needs real PointerEvent sequences plus a wait past the 450 ms threshold.
- **Windows High Contrast:** the owner's machine runs forced colors by default; `html{forced-color-adjust:none}` is already set. If colors ever look wrong on her machine, check HCM first.
- **Port 8873 is fixed** (`autoPort: false` in the parent `Other/.claude/launch.json`). If the port is busy, it has previously been an orphaned preview server; kill that process rather than moving the port.

## Open questions for the owner

1. Has your brother (the spec author) seen the current build? His SPEC section 11 answers (final name, friendship mode, trap-badge bluntness, languages) gate Phase 2 copy.
2. Should ranked matching (Phase 2) apply the SPEC section 4 age-band and polarity modifiers? `dyadScore` deliberately omits them for specific-person reads; the spec implies they belong to hypothetical ranked matches.
3. Is `__impl_questions.json` (the WIP question-bank draft) worth keeping in the repo, or should it be deleted now that the bank lives in CONTENT?
