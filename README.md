# pbs-player-react

React hook to initialize the PBS Partner Player using a bundled `player.js`.  
The package **does not render an iframe** — consumers create and style the iframe in their app and pass a `ref` to the hook.

## Files in this repo

- `src/usePBSPlayer.js` — the hook (exports default).
- `src/player.js` — **YOUR** downloaded PBS `player.js` (place it here).
- `src/index.js` — package entry.
- `scripts/copy-player-to-dist.js` — copy `player.js` into `dist/` after build.
- `package.json` — scripts & config.

---

## Quick start (local)

1. Clone / create repo and place your downloaded `player.js` at `src/player.js`.

2. Install dev deps:

```bash
npm install
