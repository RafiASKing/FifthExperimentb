# API Reference

Base URL: `http://127.0.0.1:5000`

## GET /
- Renders the main HTML page.

## GET /api/today
- Response: `{ "date": "YYYY-MM-DD", "content": "..." }`

## GET /api/entries
- Response: `{ "entries": ["YYYY-MM-DD", ...] }`

## GET /api/entry/<date>
- Path: `date` as `YYYY-MM-DD`
- 200: `{ "date": "YYYY-MM-DD", "content": "..." }`
- 404: `{ "error": "Entry not found" }`

## POST /api/save
- Body JSON: `{ "date": "YYYY-MM-DD", "content": "..." }`
- 200: `{ "success": true, "message": "Entry saved successfully" }`

## GET /api/banned-words
- Response: `{ "banned_words": ["word1", "word2", ...] }`
- Source: `config/banned_words.json`
