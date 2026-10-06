# Elemental Blueprint

**Live: [elements.atasha.me](https://elements.atasha.me)**

A self-knowledge and compatibility app built on the Five Elements (Wood, Fire, Earth, Metal, Water), treated strictly as a behavioral pattern language: how you start things, how you hold people, what happens under pressure, and what brings you back. No astrology, no destiny, no diagnosis.

Built by Atasha from her brother's product spec ([SPEC.md](SPEC.md)).

## What it does

- **Types you.** Ten scenario questions plus a five-item stress check give your element mix and your current state (Grounded, Integrating, or Reactive). States are weather, not identity.
- **Blueprint.** Your pattern in full: drives, gifts, mature and shadow registers, stress signature, three practices, and your profile as a partner.
- **Matches.** All 25 partner patterns ranked two ways: The Pull (what you are drawn to right now) and The Hold (what tends to last).
- **Compare.** Pair two results: cycle arrows between both people's elements, a written report, and repair scripts. Send someone your link with **Share my pattern** and they land straight on how you pair.
- **Read someone else.** Answer as you saw another person behave; the result is marked as your read of them.

Everything stays in the browser that took the assessment. There is no backend, no account, and no analytics.

## Look

A late-90s Saturn / PS1 lo-poly language: a software-rasterized, dithered element crystal whose shape is your data and whose motion is your state, segmented HUD bars, pixel relation glyphs, and a crystal stage over a scrolling floor grid.

## Run it

- **Just open `index.html`.** The whole app is one file: vanilla JS, no build, no dependencies.
- **Optional local companion:** `node server.js`, then open http://localhost:8873. This adds Ask and Read anyone, which pipe questions to the Claude Code CLI on your machine.
- **Tests:** open `index.html?debug=1` and check the console for `15/15 fixtures passed`.
- **Deploy:** `./deploy.sh` publishes `index.html` and `site/` to Cloudflare.

[AGENTS.md](AGENTS.md) is the full technical guide: architecture, decisions, and gotchas.
