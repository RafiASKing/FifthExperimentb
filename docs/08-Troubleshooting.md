# Troubleshooting

## Overlay Never Appears

- Hard refresh (`Ctrl+F5`) to break cached JavaScript.
- Open DevTools → Network → look for `POST /api/banned-words/check`. If it fails, check Flask logs for errors.
- Run `python test.py` with sample sentences to confirm your regex actually matches.
- Verify `static/img/pengganggu.jpg` exists; missing image won’t stop the overlay but is a visual clue.

## Overlay Won’t Go Away

- The overlay stays up until the matched snippet is removed. Double-check the message text to see what needs deleting.
- Ensure your regex isn’t overly broad (e.g., `.*` or missing `\b` boundaries). Tighten expressions as needed.
- If you modified the timeout in `showAnnoyingOverlay()`, confirm it still clears the `.show` class after the delay.

## Changes Not Reflected

- `index.html` already appends `?v=...` to assets, but browsers can still cache aggressively. Use a private window or hard refresh.
- For CSS/JS edits, check DevTools → Sources to confirm you’re seeing the latest file.

## Entries Not Saving

- Watch the status chip while typing. If it gets stuck on “Error saving,” open the Console for details.
- Confirm `diary_entries/` exists and is writable by the Python process.
- Look at the terminal running Flask for stack traces (e.g., permission errors or missing directories).

## Missing Entries in Sidebar

- Filenames must be `YYYY-MM-DD.txt`. Any other naming convention is ignored.
- If you manually deleted files, refresh the page so `/api/entries` updates.

## API 500 Errors

- Common causes include invalid JSON in `config/banned_patterns.json` or malformed regex. Validate with `python -m json.tool` or an online tester.
- The server skips invalid patterns, but a malformed file (like trailing commas) will throw before normalization.

## Windows Notes

- Follow the PowerShell commands in the setup guide, especially for activating the virtual environment.
- If port 5000 is busy, either stop the other process or change the port at the bottom of `app.py` (`app.run(..., port=5001)`).
