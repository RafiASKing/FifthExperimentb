# Overview

Digital Diary is a lightweight journaling app that showcases how far you can go with Flask on the backend and plain JavaScript in the browser. The goal is to keep every moving part understandable for someone who knows basic Python and JS while still offering “real app” conveniences like auto-save, history, and content moderation.

## What You Get

- **Daily workspace** – Today’s entry is always front and center in a calm, distraction-light UI.
- **Instant auto-save** – Stops you from losing work by writing to disk one second after you pause typing.
- **History sidebar** – Populates from the actual text files on disk, so navigation is just a click away.
- **Regex-powered moderation** – Banned patterns live in a JSON file. Matching text triggers a five-second fullscreen warning.
- **Transparent architecture** – No database, no frameworks, just files and clearly named functions.

## How It Works

1. Browsers request `/` and receive the single HTML template.
2. The JavaScript class `DiaryApp` loads today’s entry and the list of past days through JSON endpoints.
3. When you type, a short debounce saves the text to `diary_entries/YYYY-MM-DD.txt` and sends the same text to a server-only regex scanner.
4. Matches return a snippet; the overlay flashes the warning and picture until the text is cleaned up.

## Why Files Instead of a Database?

- Files are easy to audit, back up, or edit manually.
- Each entry is UTF-8 plain text named after its date—perfect for beginners to inspect.
- New contributors can focus on Python control flow and JavaScript fetch calls rather than SQL or ORMs.

Keep this document nearby while exploring the rest of the `/docs` folder; each page goes deeper into setup, configuration, APIs, and even step-by-step rebuild guidance.

## Tech Stack
- Backend: Flask (Python)
- Frontend: HTML/CSS, vanilla JS
- Storage: Local filesystem
