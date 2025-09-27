# Configuration

This app keeps configuration simple and transparent. You edit JSON files and static assets—no admin UI required.

## Banned Word Patterns

- Location: `config/banned_patterns.json`
- Each entry is an object with:
  - `pattern` *(required)* – the raw regular expression.
  - `flags` *(optional)* – regex flags (`i`, `m`, `s`, `x`, `u`, `a`). The code removes `g` automatically to avoid stateful JS regex behavior.
  - `label` *(optional)* – your description for readability.

Example:

```json
[
  {
    "label": "Name Rafi",
    "pattern": "\\brafi\\b",
    "flags": "iu"
  },
  {
    "label": "Kontol variations",
    "pattern": "\\bk[o0]+n+t[o0]+l+\\b",
    "flags": "iu"
  }
]
```

### How Matching Works

1. The backend loads the JSON, validates each regex with Python’s `re` module, and keeps a compiled copy.
2. The browser never receives the actual patterns. Instead, when text changes, the client POSTs `/api/banned-words/check` with `{ "content": "..." }`.
3. Flask scans the text. If a pattern matches, the response is `{ "matched": true, "snippet": "..." }`.
4. The frontend shows the overlay using the snippet, so users know what to remove without revealing the full banned list.

This approach lets you keep production rules private—even in the browser’s network inspector only the match result is visible.

### Editing Workflow

1. Copy the template file and make it yours:
   ```powershell
   Copy-Item .\config\banned_words_template.json .\config\banned_patterns.json -Force
   ```
2. Open the new `banned_patterns.json` and add/update patterns.
3. Optionally add the file to `.gitignore` if you don’t want to commit sensitive rules.
4. Use `python test.py` to quickly check which phrases trigger matches.

### Legacy Fallback

If `config/banned_patterns.json` does not exist but `config/banned_words.json` does, each string is escaped into a case-insensitive regex. This keeps older deployments working while you migrate to the richer format.

## Overlay Assets

- **Image** – `static/img/pengganggu.jpg`. Swap it with another image (same filename) or adjust the `<img>` tag in `templates/index.html`.
- **Message** – Built in `showAnnoyingOverlay()` inside `static/js/app.js`. Edit the string `"{word} is tidak baik, hapus!"` to change the tone or language.
- **Duration** – Controlled by `setTimeout` in `showAnnoyingOverlay()` (default 5000 ms). Lower or raise for different urgency.

## Diary Storage

- All entries live in `diary_entries/` next to `app.py`.
- File names follow `YYYY-MM-DD.txt` and are stored as UTF-8.
- The `/api/entries` endpoint reflects whatever files exist, so backups and manual edits show up immediately.
