# Setup

Follow these steps to run Digital Diary locally. They assume Windows + PowerShell, but the commands translate easily to macOS or Linux.

## 1. Check Prerequisites

- Python 3.10 or newer (`python --version`)
- `pip` (bundled with modern Python)
- Optional: Git for cloning the repo

## 2. Create and Activate a Virtual Environment

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

> macOS/Linux activation:
> ```bash
> source .venv/bin/activate
> ```

## 3. Install Dependencies

```powershell
pip install -r requirements.txt
```

Only Flask is required, so the install should finish quickly.

## 4. Run the Development Server

```powershell
python app.py
```

Visit `http://127.0.0.1:5000` in your browser. Debug mode is enabled by default, so code changes reload automatically.

## 5. First-Run Checklist

- `diary_entries/` is auto-created beside `app.py` if it doesn’t exist.
- `config/banned_patterns.json` is expected; if missing, an empty JSON array is created.
- Typing in the editor saves a new file named `YYYY-MM-DD.txt` under `diary_entries/`.

## 6. Stopping and Cleaning Up

- Press `Ctrl+C` in the terminal to stop the server.
- Run `deactivate` to exit the virtual environment.

## Project Layout (after first run)

```
app.py
config/
  banned_patterns.json          # local regex rules (add to .gitignore if needed)
  banned_words_template.json    # example starter patterns
diary_entries/                  # generated text files per day
docs/                           # project documentation (this folder)
static/
  css/style.css
  js/app.js
  img/pengganggu.jpg
templates/
  index.html
requirements.txt
test.py                         # helper to exercise banned regex
```

## Development Tips

- Use a hard refresh (`Ctrl+F5`) after editing JS/CSS to defeat caching.
- `index.html` references assets with version query strings (`?v=...`) to help cache busting.
- Keep `config/banned_patterns.json` out of version control if you plan to deploy with private rules.
