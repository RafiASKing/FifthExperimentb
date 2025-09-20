# Setup

These steps are Windows/PowerShell-friendly.

## Prerequisites
- Python 3.10+
- pip

## Install
```powershell
# From project root
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Run
```powershell
python .\app.py
```
Then open http://127.0.0.1:5000

## Project Structure
```
app.py
requirements.txt
config/
  banned_words.json              # ignored by git (local-only)
  banned_words_template.json     # committed (example/template)
diary_entries/
static/
  css/style.css
  js/app.js
  img/pengganggu.jpg
templates/
  index.html
```

## Dev Tips
- Hard refresh (Ctrl+F5) after frontend changes.
- If JS/CSS look stale, versioned query params are used in `index.html` to bust cache.
- The server auto-reloads when `app.py` changes (debug mode).
