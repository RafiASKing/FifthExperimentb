# API Reference

Base URL: `http://127.0.0.1:5000`

## GET /

Renders `templates/index.html` with links to static assets.

## GET /api/today

**Response**

```json
{
	"date": "2025-09-27",
	"content": "..."
}
```

Returns today’s date and saved text (empty string if the file is missing).

## GET /api/entries

**Response**

```json
{
	"entries": ["2025-09-27", "2025-09-26", "2025-09-20"]
}
```

The entries array is sorted newest-first and mirrors filenames in `diary_entries/`.

## GET /api/entry/<date>

- Path parameter `date` must be `YYYY-MM-DD`.

**200 Response**

```json
{
	"date": "2025-09-20",
	"content": "..."
}
```

**404 Response**

```json
{
	"error": "Entry not found"
}
```

## POST /api/save

Saves an entry to `diary_entries/<date>.txt`.

**Request body**

```json
{
	"date": "2025-09-27",
	"content": "Today I..."
}
```

**Responses**

- **200 OK** — `{ "success": true, "message": "Entry saved successfully" }`
- **400 Bad Request** — `{ "error": "Date is required" }`
- **500 Internal Server Error** — `{ "error": "..." }`

## GET /api/banned-words

Returns metadata only, keeping the actual regex rules private.

```json
{
	"rule_count": 3,
	"message": "Banned patterns are enforced server-side and not exposed."
}
```

## POST /api/banned-words/check

Checks submitted text against server-side regex patterns.

**Request body**

```json
{
	"content": "Some text"
}
```

**Matched response**

```json
{
	"matched": true,
	"snippet": "goblok"
}
```

**No match response**

```json
{
	"matched": false
}
```

**Invalid payload**

```json
{
	"error": "content must be a string"
}
```
