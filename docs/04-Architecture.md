# Architecture

## High-Level Flow
- User loads `/` → `templates/index.html`
- Frontend JS initializes, fetches `/api/today`, `/api/entries`, and `/api/banned-words`
- User types → auto-save debounce (1s) POSTs `/api/save`
- Banned words detection runs on input; if matched, overlay shows for 5s

## Backend (Flask)
- `GET /` → render `index.html`
- `GET /api/today` → returns `{ date, content }`
- `GET /api/entries` → returns list of available entry dates
- `GET /api/entry/<date>` → returns a particular entry
- `POST /api/save` → writes entry to `diary_entries/<YYYY-MM-DD>.txt`
- `GET /api/banned-words` → returns the list from `config/banned_words.json`

## Data Storage
- File per day in `diary_entries/` named `YYYY-MM-DD.txt`

## Frontend
- `static/js/app.js` contains class `DiaryApp`
- Debounced auto-save; status chips: Saving → Saved → Ready
- Banned words check on every input and after load
- Overlay DOM has image + message; visibility toggled with `.show`

## Styling
- Clean card layout, gradient background
- Overlay is fixed, covers viewport with dark backdrop
