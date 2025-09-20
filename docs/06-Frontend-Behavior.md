# Frontend Behavior

## Initialization
- On DOMContentLoaded, `DiaryApp`:
  - Caches DOM refs
  - Loads banned words, today's entry, and entries list
  - Sets up event listeners (input auto-save, beforeunload)
  - Starts a 15s interval + focus/visibility listeners to refresh banned words

## Auto-Save
- On input, waits 1s without typing then POSTs `/api/save`
- Status chip shows: Saving → Saved → Ready

## Banned Words Detection
- Words loaded from `/api/banned-words`
- Matching logic (simple): lower-case includes
- On match:
  - Shows overlay (full-screen dark backdrop)
  - Displays `pengganggu.jpg`
  - Shows big aggressive message: `{matched} is tidak baik, hapus!`
  - Hides after 5 seconds (timer resets if triggered repeatedly)

## Cache Busting
- `index.html` adds `?v=...` to CSS/JS URLs to fight stale caches.
