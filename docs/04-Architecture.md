# Architecture

Digital Diary keeps the stack deliberately small: a single Flask app serving HTML and JSON, plus a lightweight JavaScript controller that coordinates the UI.

## High-Level Flow

1. Browser requests `/`; Flask renders `templates/index.html`.
2. `static/js/app.js` instantiates `DiaryApp` once the DOM is ready.
3. `DiaryApp` fetches today’s entry (`/api/today`) and the history list (`/api/entries`).
4. As the user types, a 1-second debounce saves content via `POST /api/save`.
5. The same text is POSTed to `/api/banned-words/check`, letting Flask apply private regex rules and return the first match snippet.
6. Frontend shows or hides the warning overlay based on the server response.

## Backend Responsibilities

| Endpoint | Purpose |
|----------|---------|
| `GET /` | Render `index.html` with cache-busted CSS/JS links. |
| `GET /api/today` | Return today’s date and current content. |
| `GET /api/entries` | Return all `YYYY-MM-DD` filenames from `diary_entries/`. |
| `GET /api/entry/<date>` | Fetch a specific diary file or 404 if missing. |
| `POST /api/save` | Persist JSON `{date, content}` to disk. |
| `GET /api/banned-words` | Expose rule count only (no patterns). |
| `POST /api/banned-words/check` | Scan submitted text with compiled regex and report matches. |

Helper functions load and normalize banned patterns, compile regex safely, and handle file paths using `pathlib.Path`. All storage is UTF-8 plain text, avoiding databases entirely.

## Frontend Responsibilities

- `DiaryApp` caches DOM nodes for the textarea, status chip, date badge, sidebar, and overlay.
- Saves are debounced with `setTimeout`; the chip cycles through `Saving → Saved → Ready`.
- Sidebar clicks trigger saves before navigating to the requested date.
- Banned-word checks use `fetch` with an `AbortController`, so rapid typing cancels outdated requests.
- Overlay feedback (image + message) is managed by adding/removing the `.show` class and a timeout.

## Data Storage Strategy

- `diary_entries/` stores one file per day (`YYYY-MM-DD.txt`).
- `config/banned_patterns.json` stores regex rules. A legacy `banned_words.json` fallback keeps older setups compatible.
- Backups are as simple as copying those folders.

## Styling & Accessibility

- `static/css/style.css` provides the gradient background, glassmorphism cards, and responsive layout.
- Overlay is fixed-position with `backdrop-filter` for a dramatic warning effect.
- `index.html` includes ARIA attributes on the overlay and status chip to give screen readers useful cues.
