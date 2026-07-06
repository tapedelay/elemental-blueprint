# Elemental Blueprint

Seed spec for a new Claude Code project. This file is the source of truth until code exists. Built by Atasha for her brother, who authored the underlying product spec.

**One line:** A self-knowledge and compatibility app built on the Five Elements (Wu Xing), treated strictly as a behavioral pattern language: core drives, stress responses, somatic tendencies, attachment styles. No astrology, no mysticism, no destiny language. One beautiful, minimal, self-contained HTML app.

## 0. Locked decisions

1. One self-contained `index.html`. Vanilla JS, no framework, no build step, no dependencies. Inline CSS and SVG.
2. All data stays on device: `localStorage` plus an exportable "blueprint code" for sharing and Compare mode. No backend, no accounts, no analytics.
3. Mobile-first, responsive, fully functional offline (fonts must degrade gracefully).
4. Strict separation inside the file: `CONTENT` (questions, profiles, match copy) as one const block at the top; `ENGINE` as pure functions below it. Copy edits must never require touching logic.
5. If this ever grows a server, the data shapes below map 1:1 to tables (users, assessments, answers, results). Do not build that now.

## 1. What the app does

1. **Types the user.** Primary and optional Secondary element from Wood, Fire, Earth, Metal, Water, scored as percentages from a scenario assessment.
2. **Assesses maturity.** Whether the user currently runs Grounded (mature), Integrating (mixed), or Reactive (shadow) within their elements. States are weather, not identity.
3. **Ranks compatibility.** Scores all 25 partner archetypes (5 primaries x 5 secondaries; doubles count as "pure" types), adjusted by maturity state, life stage, and polarity preference. Surfaces Top 5 and Bottom 5, full list on demand.
4. **Teaches.** A Blueprint page (drives, gifts, shadow, stress signature, growth practices) and a Compare mode that reads two people's codes and renders a dyad report.

## 2. The framework (canonical definitions)

| Element | Archetype | Core drive | Mature expression | Shadow expression | Stress signature |
|---|---|---|---|---|---|
| Wood | The Pioneer / Builder | Growth, expansion, execution | Decisive momentum, clean assertion, vision turned into action | Frustration, anger, impulsivity, bulldozing | Fight: pushes harder, blames the obstacle |
| Fire | The Catalyst / Communicator | Connection, joy, expression | Warmth with boundaries, charisma, full presence | Anxiety, scatter, burnout, boundary-less chaos | Flood: seeks stimulation and reassurance |
| Earth | The Stabilizer / Sanctuary | Community, grounding, nurture | Steady support, reliable center, generosity without self-erasure | Obsessive worry, stubborn inertia, meddling | Tend-and-cling: over-involves, ruminates |
| Metal | The Architect / Executive | Logic, structure, standards, boundaries | Clarity, discernment, integrity, refined order | Cold perfectionism, rigidity, isolation | Fortress: withdraws behind rules and correctness |
| Water | The Philosopher / Visionary | Depth, meaning, introspection | Calm depth, long-view courage, wisdom | Over-analysis, emotional freezing, withdrawal | Freeze: disappears inward |

**Attachment lens** (informs copywriting; never shown to the user as a clinical label): Fire shadow trends anxious-pursuing, Earth shadow anxious-caretaking, Metal shadow avoidant-controlling, Water shadow avoidant-freezing, Wood shadow fight-response.

### Cycles

- **Generative (Sheng):** Wood feeds Fire, Fire creates Earth, Earth bears Metal, Metal carries Water, Water feeds Wood.
- **Controlling (Ke):** Wood breaks Earth, Earth dams Water, Water quenches Fire, Fire melts Metal, Metal cuts Wood.

Any pairing of partner primary P against user primary U resolves to exactly one relation: `SAME`, `P_GENERATES_U`, `U_GENERATES_P`, `P_CONTROLS_U`, `U_CONTROLS_P`.

## 3. The assessment

### Design rules for questions

1. Scenario-based, concrete, second-person. Never name an element or use framework jargon in a question or option.
2. Five options per question, one per element. Each option carries a key `(element, valence)` where valence is `M` (mature), `S` (shadow), or `N` (neutral typing signal).
3. Across the bank, every element needs at least 3 mature-coded and 3 shadow-coded options, so maturity is measurable.
4. All five options within a question must be equally socially desirable. No obviously virtuous answer, no obviously pathological answer.
5. Randomize option order per session. Vary domains: work, conflict, rest, love, fear, group dynamics.
6. Pairing trick: ask the same event twice, once as "best version of you" and once as "worst version of you." The delta is pure maturity signal. Keep this pattern when expanding the bank.
7. The user picks the closest option (2 points). A long-press on a second option marks "also me" (1 point).

### Scoring

```
pct[e]      = points[e] / totalPoints                    (shown as %)
primary     = argmax(pct)
secondary   = second-highest element if its pct >= 18%, else none
maturity[e] = matureHits[e] / (matureHits[e] + shadowHits[e])   (skip elements with no valenced hits)
overall     = sum over e of pct[e] * maturity[e]
state       = overall >= 0.62 : Grounded
              overall <= 0.42 : Reactive
              otherwise       : Integrating
```

### Seed question bank v1 (10 items, keys inline)

1. **A completely free Saturday appears, zero obligations. Your honest first move:**
   a. Start the project I have been itching to launch `Wood M`
   b. Text a few people; something fun will assemble itself `Fire M`
   c. Slow morning, cook something real, tend the house `Earth M`
   d. Finally sort the thing that has been quietly bothering me `Metal M`
   e. Long walk alone with a notebook and no destination `Water M`
2. **Someone close to you is upset with you and goes quiet. Before you can edit yourself, you:**
   a. Push to resolve it right now; the silence feels like a wall to break `Wood S`
   b. Fill the air with warmth, jokes, affection, anything `Fire S`
   c. Start doing things for them and checking in, repeatedly `Earth S`
   d. Retreat into being technically correct `Metal S`
   e. Go still and quietly build a theory of what this really means `Water S`
3. **What quietly offends you most in other people:**
   a. Passivity; people who will not act `Wood N`
   b. Coldness; people who will not play or feel `Fire N`
   c. Selfishness; people who will not show up for their own `Earth N`
   d. Sloppiness; people who do not care about doing it right `Metal N`
   e. Shallowness; people who will not go beneath the surface `Water N`
4. **A project you care about takes a real hit. The best version of your first 24 hours:**
   a. Attack it from a new angle; motion is medicine `Wood M`
   b. Talk it through with someone until it gets lighter `Fire M`
   c. Steady the basics first: sleep, food, people, then reassess `Earth M`
   d. Audit the failure, rewrite the standard, cut what broke `Metal M`
   e. Step back far enough to ask whether the goal was even right `Water M`
5. **Same hit, worst version of you:**
   a. Bulldoze ahead angry and break something that was working `Wood S`
   b. Spin up noise and distraction until I am exhausted `Fire S`
   c. Freeze in worry and manage everyone else's reactions instead `Earth S`
   d. Go cold, perfectionistic, privately contemptuous `Metal S`
   e. Disappear into my head for days and call it processing `Water S`
6. **A group you are part of is stuck and circling. You naturally become:**
   a. The one who forces a decision `Wood M`
   b. The one who revives the room `Fire M`
   c. The one who checks that everyone is actually okay `Earth M`
   d. The one who structures the mess into steps `Metal M`
   e. The one who names the deeper thing nobody said `Water M`
7. **Your honest relationship to rules:**
   a. Speed limits; I break the dumb ones without guilt `Wood S`
   b. Mood-killers; I would rather charm my way around them `Fire S`
   c. How we keep each other safe; I uphold the caring ones `Earth M`
   d. Mostly written for reasons people never bothered to learn `Metal M`
   e. I comply on the surface and keep my real opinion submerged `Water S`
8. **What rest looks like when you actually let yourself have it:**
   a. A different kind of doing; stillness is not rest to me `Wood N`
   b. A full table, laughter, people I love `Fire M`
   c. Hard to take until everyone else is settled first `Earth S`
   d. Impossible inside chaos; order first, then I can stop `Metal S`
   e. Silence, one idea, nobody talking `Water M`
9. **Someone you love is struggling. Your first instinct:**
   a. Remove the obstacle for them; act on their behalf `Wood M`
   b. Lift them; energize, encourage, make them laugh again `Fire M`
   c. Hold them; presence, food, time, no agenda `Earth M`
   d. Solve it; find the real problem and hand them the correct plan `Metal M`
   e. Understand it; ask the one question that reframes everything `Water M`
10. **The fear you would least like to admit out loud:**
    a. Being trapped, stalled, made to wait forever `Wood N`
    b. Being unloved, unfelt, left outside the warmth `Fire N`
    c. Being needed by no one, or failing the people I hold `Earth N`
    d. Being exposed as flawed under real scrutiny `Metal N`
    e. Being fully seen and then drained, or finding out none of it meant anything `Water N`

Valence coverage check (must hold as the bank grows): every element currently has 4 to 5 mature options and exactly 3 shadow options. Maintain at least 3 of each per element.

## 4. The matching engine

### Base relation scores (0 to 100)

| Relation (partner P vs user U) | Stability | Chemistry | Meaning |
|---|---|---|---|
| `P_GENERATES_U` | 95 | 60 | They feed you; nourishment without effort |
| `U_GENERATES_P` | 85 | 55 | You feed them; purpose, with a depletion risk |
| `SAME` | 70 | 50 | Deep resonance; doubled blind spots |
| `U_CONTROLS_P` | 45 | 80 | You shape them; generous pruning or quiet stifling |
| `P_CONTROLS_U` | 30 | 95 | They shape you; magnetic friction, the classic trap |

### Scoring pseudocode

```
S(a, b) = stability score of relation(b vs a)
C(a, b) = chemistry score of relation(b vs a)
for each of the 25 partner combos (p1, p2):
    stab = 0.7 * S(U.primary, p1) + 0.3 * S(U.primary, p2)
    chem = 0.7 * C(U.primary, p1) + 0.3 * C(U.primary, p2)
    if U.secondary exists:
        stab = 0.8 * stab + 0.2 * S(U.secondary, p1)
        chem = 0.8 * chem + 0.2 * C(U.secondary, p1)
    blend by maturity state:
        Grounded:    score = 0.75 * stab + 0.25 * chem
        Integrating: score = 0.55 * stab + 0.45 * chem
        Reactive:    score = 0.30 * stab + 0.70 * chem
    demographic modifiers (multiplicative, clamp final to 0..100):
        age band 18-33:                      * 1.08 if p1 in {Wood, Fire}
        age band 34-37:                      no change
        age band 38+:                        * 1.08 if p1 in {Earth, Metal}
        polarity "direction and containment": * 1.10 if p1 = Metal, * 1.05 if p1 = Wood
        polarity "warmth and flow":           * 1.10 if p1 in {Earth, Water}, * 1.05 if p1 = Fire
        polarity "a live switch between both": no change
    tier labels:
        score >= 85 : Co-Builder (high stability)
        70 to 84    : Growth Match
        55 to 69    : Workable with Awareness
        40 to 54    : Effortful
        below 40    : Volatile
    trap badge:
        if relation involves P_CONTROLS_U and state = Reactive:
            badge = "High chemistry, high volatility"
```

### The dual ranking (core product insight)

Reactive and Integrating users get two lists, one tap apart:

- **The Pull:** ranked by their actual state's blend (chemistry-heavy). This is what they will genuinely be drawn to. Trap badges shown honestly, never hidden.
- **The Hold:** the same 25 combos ranked with the Grounded blend. This is what would actually last.

The visible gap between the two lists is the growth content of the entire app. Grounded users see one list, with a small footnote showing what their Reactive-state pull would have been.

### Gender and polarity

Gender of the desired partner never changes element math; it only sets pronouns and example copy. Polarity is asked as a plain preference, deliberately decoupled from gender: "What do you most want more of from a partner: direction and containment, warmth and flow, or a live switch between both?"

## 5. Data model

`localStorage` key `eb.v1`:

```json
{
  "profile": { "name": "", "ageBand": "27-33", "seeking": "women", "polarity": "flow" },
  "answers": [ { "q": 1, "pick": "fire", "pickValence": "M", "also": "water" } ],
  "scores": {
    "pct": { "wood": 12, "fire": 31, "earth": 9, "metal": 22, "water": 26 },
    "primary": "fire", "secondary": "water",
    "maturity": { "overall": 0.58, "perElement": { "fire": 0.5, "water": 0.66 } },
    "state": "integrating"
  },
  "results": { "ranked": [], "computedAt": "" },
  "meta": { "version": 1 }
}
```

**Blueprint code:** `EB1.` + base64url(JSON of the `scores` block). Compare mode decodes a partner's code, computes the dyad in both directions, and renders a two-pentagon report: cycle arrows between their primaries and secondaries, three strengths, three frictions, one repair script for each person.

## 6. Screens

1. **Landing.** App name, one line ("A pattern language for how you love, work, and break"), Begin.
2. **Framing.** Three short paragraphs on what this is and is not: a secular behavioral mirror, not a verdict, not medicine, not fate.
3. **About you.** Age band, who you are looking for (copy only), polarity preference.
4. **Assessment.** One question per screen, five options, progress dots, back always allowed. About three minutes.
5. **Reveal.** The pentagon draws itself stroke by stroke, percentages count up and settle, the primary is named, then the state, then a one-paragraph portrait.
6. **Blueprint.** Full profile: drives, gifts, mature and shadow columns side by side, stress signature, three concrete practices.
7. **Matches.** Top 5 as cards, Bottom 5 collapsed beneath, full 25 on demand. Each opens a detail sheet: why it works, where it grinds, one communication script. Dual-ranking toggle per section 4.
8. **Compare.** Paste a partner's code, get the dyad report.
9. **Persistent footer.** Retake, copy my code, erase my data, disclaimer.

## 7. Design direction

> **v2 override (client direction, 2026-07-06):** black background, late-90s console aesthetic (Sega Saturn / PS1): crunchy low-rez vector look, but minimal, high contrast, nothing flashy, data highlighted above all. Implemented as: void-black `#08090A` ground, phosphor off-white `#E8EDEA` ink, faint CRT scanlines, hard corners, aliased (`crispEdges`) pentagon strokes, square vertex markers, mono uppercase display type (the serif is retired), `>` / `+` cursor glyphs on answers. Element colors brightened to hold AA on black: Wood `#4CC08A`, Fire `#FF5C3D`, Earth `#F0B43C`, Metal `#9FB0B8`, Water `#4FA8E8`. Color-meaning rule unchanged (a color only ever means its element); additionally each Sheng ring segment is now a gradient from the element it leaves to the element it feeds, so the generative cycle reads as color flow. The user's score polygon and percentages render phosphor-white: the data is the brightest thing on screen. The v1 porcelain direction below is retained for reference only.

**Direction (v1, superseded):** a scholar's instrument. Ink on cool porcelain, precise strokes, five mineral accents that belong to the elements and to nothing else. The restraint of a measuring device, not the warmth of a wellness app.

**Signature element:** the living pentagon. The Sheng ring drawn as one continuous stroke, the Ke star as thin inner chords. It is simultaneously the results chart, the reveal animation, the Compare visualization (two overlaid pentagons), and the app's only logo.

**Palette** (derived from the classical five-color correspondences, muted to mineral):

| Token | Hex | Use |
|---|---|---|
| Paper | `#F2F1EC` | Background; cool porcelain, deliberately not cream |
| Ink | `#1A1D1E` | Text, strokes, all UI chrome |
| Wood | `#3F6B58` | Pine green |
| Fire | `#B8432F` | Vermilion |
| Earth | `#C4932F` | Loess ochre |
| Metal | `#8E979E` | Unpolished silver (use `#6E777D` when it must carry text) |
| Water | `#22384C` | Deep ink-blue |

Rule: there is no single brand accent. The system of five is the identity. UI chrome stays ink on paper; an element color appears only where it means that element. Do not drift into the generic cream-plus-terracotta-plus-serif template; vermilion belongs to Fire alone.

**Type:** display in Young Serif (fallback Georgia) used sparingly and large; all numerals, question counters, percentages, and blueprint codes in IBM Plex Mono (fallback monospace) for the instrument feel; body copy in the system UI stack so the app stays honest offline.

**Motion:** one orchestrated moment, the Reveal (about 2.5 seconds of pentagon strokes, counting numerals, then the name). Everything else is 150 to 200 ms ease. Respect `prefers-reduced-motion` by cutting straight to final states.

**Quality floor:** responsive to 320 px, visible keyboard focus, AA contrast for every element color on paper, no emoji anywhere in the UI.

## 8. Copy, ethics, sources

1. Secular and somatic everywhere. Banned vocabulary in-app: destiny, energy healing, chakra, astrology terms, medical or diagnostic claims.
2. States are weather, not identity: Grounded, Integrating, Reactive. Never "immature person," never pathologizing language.
3. Persistent disclaimer: "A self-reflection tool. Not a psychological assessment, diagnosis, or advice."
4. The reference texts below inform principles only. All in-app copy must be original. Never quote or closely paraphrase these books.

Reference texts (for principle-mining while writing content):

- *The Five Archetypes*, Carey Davidson: secular typing, stress responses, primary and secondary combinations.
- *Between Heaven and Earth*, Beinfield and Korngold: the psychological archetypes.
- *Dragon Rises, Red Bird Flies*, Leon Hammer: defense mechanisms, deeper shadow mapping.
- *The Energies of Love*, Eden and Feinstein: romantic dynamics and communication styles.
- *The Way of the Superior Man*, David Deida: the polarity modifier, translated here into degendered direction-versus-flow language.

## 9. Build phases

- **Phase 1 (MVP, one sitting):** typing engine, the 10-question bank, Reveal, pentagon SVG, Blueprint copy for the 5 pure types. Done when seeded answer fixtures produce the expected primary, secondary, and state.
- **Phase 2:** matching engine, copy for all 25 combos, Matches UI with detail sheets.
- **Phase 3:** dual ranking, blueprint codes, Compare mode with the dyad report.
- **Phase 4:** motion polish, dark mode, PWA manifest for home-screen install.

## 10. Claude Code working notes

1. Route architecture and copywriting passes to Opus or Fable; implementation passes to Sonnet.
2. Engine functions stay pure and side-effect free. A tiny inline harness behind `?debug=1` runs fixture answer sets and asserts primary, secondary, state, and top match to the console. No test framework.
3. Keep `index.html` under roughly 150 KB. Commit at each phase boundary.
4. When writing the 25 combo profiles and 5 pure-type Blueprints, write them all in one dedicated session so the voice stays consistent.

## 11. Open questions for the client

1. Is "Elemental Blueprint" the final name, or working title?
2. Should a friendship or working-partnership mode ship later, or is romance the only lens?
3. How honest should trap-badge copy be: gentle nudge or plain warning?
4. Any languages beyond English planned? It affects how the content block is structured now.
