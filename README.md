# Music Notebook

Experimental cross-device music notebook using React, TypeScript, Vite, and alphaTab.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Use **Simple / Tab / Playback** to switch from a compact harmonic summary to editable alphaTex and a playable score.

## Architecture

- Song metadata and harmonic notes are stored separately from notation source.
- alphaTex is the initial editable score format, rendered by alphaTab.
- alphaTab Vite plugin handles fonts, SoundFont, workers and worklets.
- This is a proof of concept; editing is local and not yet persisted.
- Playback requires loading a SoundFont (downloaded on first visit).

## References

- https://alphatab.net/docs/getting-started/installation-vite
- https://alphatab.net/docs/reference/api/tex
