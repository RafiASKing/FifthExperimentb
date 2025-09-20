# Troubleshooting

## Overlay not showing
- Hard refresh (Ctrl+F5)
- Open Console: ensure “Loaded banned words: …” appears
- Confirm API: `GET /api/banned-words` returns your list
- Ensure `static/img/pengganggu.jpg` exists

## Changes not reflected
- Check `index.html` cache-busting params for CSS/JS
- Clear browser cache or use a private window

## Save not working
- Watch the status chip; errors appear in Console
- Check permissions for `diary_entries/`

## API 404 for entry
- Ensure filename exists as `YYYY-MM-DD.txt`
- Entries list is sourced from files present in `diary_entries/`

## Windows specifics
- Use PowerShell commands as shown in Setup
- If port in use, stop existing python processes or change port in `app.py`
