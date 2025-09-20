# Overview

Digital Diary is a simple, elegant web app built with Flask and vanilla JS. It focuses on:

- Daily writing with a clean, distraction-minimal UI
- Auto-saving entries to date-stamped `.txt` files
- Browsing past entries
- Optional "annoying" overlay that appears when banned words are typed (with an image and bold warning message)

## Key Features
- Auto-save after 1s idle
- Today-first UX; pick any past date on the sidebar
- File-based storage (no DB)
- Config-driven banned words list
- Fullscreen overlay with 5s timeout and bold warning text

## Why File-Based
- Simple to reason about
- Easy backups/versioning
- Human-readable `.txt` files by date

## Tech Stack
- Backend: Flask (Python)
- Frontend: HTML/CSS, vanilla JS
- Storage: Local filesystem
