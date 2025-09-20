# Configuration

## Banned Words
Edit `config/banned_words.json` with a simple array of strings. This file is in `.gitignore`, so your personal list stays local.

Example:
```json
[
  "rafi",
  "bothealth"
]
```

Git-tracked template example is in `config/banned_words_template.json`. Copy it to `banned_words.json` on first run:
```powershell
Copy-Item .\config\banned_words_template.json .\config\banned_words.json -Force
```

## Image Overlay
- The overlay shows `static/img/pengganggu.jpg` for 5 seconds.
- Replace the image to customize, keeping the same file name to avoid changing code.

## Timing
- Overlay duration is set to 5000ms in `static/js/app.js` → `showAnnoyingOverlay()`.

## Message Text
- The warning message is generated dynamically with the matched word: "{word} is tidak baik, hapus!".
- Modify in `showAnnoyingOverlay()` if you prefer another phrasing.
