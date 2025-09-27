# From-Scratch Guide

Rebuilding Digital Diary is an excellent exercise for learners who want to mix Python, HTML, CSS, and JavaScript. This checklist walks you through the main pieces without copying verbatim code.

## 1. Backend Foundations

1. Create `app.py` that:
   - Instantiates `Flask(__name__)`.
   - Creates a `diary_entries/` directory using `Path.mkdir(exist_ok=True)`.
   - Loads banned-word patterns from `config/banned_patterns.json`, validating each with `re.compile`.
2. Implement helper functions:
   - `get_today_date()` → return `datetime.now().strftime("%Y-%m-%d")`.
   - `get_entry_filename(date)` → return `DIARY_DIR / f"{date}.txt"`.
   - `get_all_entries()` → iterate `DIARY_DIR` for `.txt` files, return sorted stems.
   - `_find_banned_match(text)` → loop over compiled regex objects and return the first match snippet.
3. Add routes:
   - `/` → render template.
   - `/api/today`, `/api/entries`, `/api/entry/<date>` → read files and return JSON.
   - `/api/save` → accept JSON `{date, content}`, write UTF-8 file.
   - `/api/banned-words` → return metadata (`rule_count`, friendly message).
   - `/api/banned-words/check` → accept `{content}` and return `{matched, snippet}`.

## 2. HTML Template

- Create `templates/index.html` with:
  - Header containing the app title and a date badge.
  - Two-column layout: textarea workspace + sidebar list of dates.
  - Hidden overlay (`div`) containing an image (`pengganggu.jpg`) and a message `<span>` for matched words.
- Include CSS/JS using `url_for('static', filename='...')` and add version query strings for cache busting.

## 3. JavaScript Controller

- Implement `static/js/app.js`:
  - Define a `DiaryApp` class that caches DOM nodes in `constructor` and calls `init()`.
  - `init()` should fetch today’s entry, fetch the sidebar list, set up listeners, and run an initial banned-word check.
  - Autosave logic: debounce `saveEntry()` with `setTimeout(…, 1000)` and clear timers on new input.
  - Banned-word logic: debounce requests to `/api/banned-words/check`, use `AbortController` to cancel stale fetches, and show/hide overlay accordingly.
  - When switching dates, await `saveEntry()` before fetching the new entry to prevent data loss.

## 4. Styling

- `static/css/style.css` should:
  - Apply a gradient background and a card-style container (`backdrop-filter`, `box-shadow`).
  - Make the layout responsive (stack columns on small screens).
  - Define overlay styles: fullscreen fixed, centered content, fade-in animation, and `aria-hidden` toggling.

## 5. Configuration Files

- Track a template at `config/banned_patterns_template.json` offering starter patterns.
- Encourage users to copy it to `config/banned_patterns.json` and customize.
- Consider adding `config/banned_patterns.json` to `.gitignore` so deployments can keep private rules.

## 6. Testing the Build

- Manual checks:
  - Start the server, type safe text (overlay should stay hidden).
  - Type a known banned phrase (overlay should appear with snippet, hide after 5 seconds).
  - Switch between dates and confirm data persists.
- Automated helper: write a small script (like `test.py`) that imports `load_banned_words()` and prints matches for sample sentences.

## 7. Hardening for Production

- Run Flask behind a WSGI server (Gunicorn, Waitress, etc.) and a reverse proxy (NGINX, Apache).
- Store `diary_entries/` and `config/` on persistent storage or S3/EFS if deploying to the cloud.
- Add authentication or rate limiting if you expose the app publicly—file-based storage isn’t multi-user secure by default.
- Use environment variables or secrets management for any sensitive configuration you add later.
