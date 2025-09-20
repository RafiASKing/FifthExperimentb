# From-Scratch Guide

This guide helps anyone rebuild a similar app without copying exact code.

## 1) Backend
- Create a Flask app with routes:
  - `/` render template
  - `/api/today` (returns date + content)
  - `/api/entries` (list dates)
  - `/api/entry/<date>` (load one)
  - `/api/save` (save entry)
  - `/api/banned-words` (serve list from config file)
- Functions:
  - `get_today_date()`: `datetime.now().strftime("%Y-%m-%d")`
  - `get_entry_filename(date)`: join diary dir with `f"{date}.txt"`
  - `get_all_entries()`: list `.txt` files in diary dir

## 2) Templates
- `index.html` container with:
  - Header (title + date display)
  - Main split: editor area + sidebar list of entries
  - Overlay: fixed full-viewport div with image and message

## 3) Frontend JS
- Class organizes logic:
  - On init: cache DOM, fetch today + entries + banned words
  - Add `input` handler with debounce to auto-save
  - Add `beforeunload` to save if pending
  - Implement `checkForBannedWords()` using lower-case includes against loaded list
  - Show overlay `5s` with message

## 4) Styles
- Base layout: modern card UI, gradient background
- Overlay: full-screen fixed, centered image, large warning message near bottom center

## 5) Config
- Track a template file in git: `config/banned_words_template.json`
- Ignore `config/banned_words.json` in `.gitignore`
- On first run, copy template to the working file

## 6) Testing
- Open app, type sample banned words, see overlay and message
- Stop and start app to ensure persistence and reload

## 7) Production Notes
- Use a proper WSGI server (e.g., gunicorn + reverse proxy)
- Store diary files on a persistent volume
- Sanitize inputs if exposing publicly
