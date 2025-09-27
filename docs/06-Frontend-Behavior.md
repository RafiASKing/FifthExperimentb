# Frontend Behavior

`static/js/app.js` defines a single class, `DiaryApp`, that manages all client-side interactions using modern but framework-free JavaScript.

## Initialization Sequence

When `DOMContentLoaded` fires:

1. `DiaryApp` caches references to key elements (textarea, status chip, date label, sidebar container, overlay, message text).
2. Event listeners are registered:
   - `input` on the textarea for autosave + banned-word checks.
   - `beforeunload` to flush any pending save on page exit.
3. Two initial fetches run sequentially:
   - `GET /api/today` fills the editor.
   - `GET /api/entries` populates the sidebar.
4. The date badge is updated with a friendly string (Today, Yesterday, or formatted date).
5. A banned-word check runs immediately on the loaded text to surface violations even before typing.

## Auto-Save Cycle

- Each keystroke resets a one-second `setTimeout`. When it fires, `saveEntry()` sends `POST /api/save` with `{ date, content }`.
- Response handling updates the status chip: `Saving → Saved → Ready` (with a brief delay before returning to Ready).
- Navigating to a different date triggers an immediate save by clearing the debounce and awaiting the `saveEntry()` promise before fetching the new entry.

## Banned-Word Detection

- Instead of downloading patterns, the client sends the current text to `/api/banned-words/check`.
- Requests are debounced similarly to autosave and use an `AbortController` so stale fetches are canceled if the user keeps typing.
- Server responses:
  - `{ matched: true, snippet: "..." }` → overlay is shown with the offending snippet.
  - `{ matched: false }` → overlay is hidden.
- The overlay message reads `"{snippet} is tidak baik, hapus!"`. It stays visible for five seconds, but the timer resets if matches continue arriving.

## Sidebar Interaction

- Entries fetched from `/api/entries` render as clickable divs.
- Clicking an entry saves the current text (if needed), loads the historical content, updates the status chip, and re-runs the banned-word check.
- The active date receives an `.active` class for highlighting.

## Cache Busting & Assets

- `index.html` adds `?v=...` query strings to CSS and JS includes to avoid stale caching during development.
- The overlay image path `static/img/pengganggu.jpg` is hard-coded; swap the file to change the visual without editing code.

Overall, the frontend favors clarity: one class, descriptive method names, and minimal global state so beginners can read straight through and understand the flow.
