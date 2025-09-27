#!/usr/bin/env python3
"""
Digital Diary Web Application
A simple, elegant digital diary with auto-save functionality.
"""

from flask import Flask, render_template, request, jsonify
from pathlib import Path
from datetime import datetime
import json
import re

app = Flask(__name__)


# Use a diary_entries directory located next to app.py (absolute path)
DIARY_DIR = Path(__file__).resolve().parent / "diary_entries"
DIARY_DIR.mkdir(parents=True, exist_ok=True)

# Config directory and banned words file
CONFIG_DIR = Path(__file__).resolve().parent / "config"
CONFIG_DIR.mkdir(parents=True, exist_ok=True)
BANNED_WORDS_FILE = CONFIG_DIR / "banned_patterns.json"
LEGACY_BANNED_WORDS_FILE = CONFIG_DIR / "banned_words.json"

_REGEX_FLAG_MAP = {
    "i": re.IGNORECASE,
    "m": re.MULTILINE,
    "s": re.DOTALL,
    "x": re.VERBOSE,
    "a": re.ASCII,
    "u": re.UNICODE,
}


def _normalize_banned_entries(raw_entries):
    """Normalize raw entries into dictionaries with regex metadata."""
    normalized = []

    if not isinstance(raw_entries, list):
        return normalized

    for entry in raw_entries:
        pattern = ""
        flags = ""
        label = None

        if isinstance(entry, dict):
            pattern = str(entry.get("pattern", "")).strip()
            flags = "".join(ch for ch in str(entry.get("flags", "")).lower() if ch in _REGEX_FLAG_MAP)
            label = str(entry.get("label", "")).strip() or None
        elif isinstance(entry, str):
            literal = entry.strip()
            if not literal:
                continue
            pattern = re.escape(literal)
            flags = "i"
            label = literal
        else:
            continue

        if not pattern:
            continue

        py_flags = 0
        for flag in flags:
            py_flags |= _REGEX_FLAG_MAP.get(flag, 0)

        try:
            re.compile(pattern, py_flags)
        except re.error:
            continue

        record = {"pattern": pattern, "flags": flags, "_py_flags": py_flags}
        if label:
            record["label"] = label
        normalized.append(record)

    return normalized


def load_banned_words():
    """Load banned word definitions from JSON config file."""
    try:
        target_file = BANNED_WORDS_FILE
        if not target_file.exists() and LEGACY_BANNED_WORDS_FILE.exists():
            target_file = LEGACY_BANNED_WORDS_FILE

        if not target_file.exists():
            # initialize with empty list so user can edit later
            target_file.write_text("[]", encoding="utf-8")
            return []

        data = target_file.read_text(encoding="utf-8")
        raw_entries = json.loads(data)
        return _normalize_banned_entries(raw_entries)
    except Exception:
        return []


def _compile_regex(entry):
    pattern = entry.get("pattern")
    if not pattern:
        return None

    py_flags = entry.get("_py_flags")
    if not isinstance(py_flags, int):
        py_flags = 0
        for flag in entry.get("flags", ""):
            py_flags |= _REGEX_FLAG_MAP.get(flag, 0)

    try:
        return re.compile(pattern, py_flags)
    except re.error:
        return None


def _find_banned_match(text):
    if not isinstance(text, str) or not text:
        return None

    entries = load_banned_words()
    for entry in entries:
        regex = _compile_regex(entry)
        if not regex:
            continue
        match = regex.search(text)
        if match:
            snippet = match.group(0)
            return {
                "snippet": snippet,
            }

    return None

def get_today_date():
    """Get today's date in YYYY-MM-DD format."""
    return datetime.now().strftime("%Y-%m-%d")

def get_entry_filename(date_str):
    """Get the filename for a diary entry (Path object)."""
    return DIARY_DIR / f"{date_str}.txt"

def get_all_entries():
    """Get all diary entry dates."""
    entries = []
    if DIARY_DIR.exists():
        for p in DIARY_DIR.iterdir():
            if p.is_file() and p.suffix == '.txt':
                entries.append(p.stem)
    return sorted(entries, reverse=True)

@app.route('/')
def index():
    """Main page - today's diary entry."""
    return render_template('index.html')

@app.route('/api/today')
def get_today():
    """Get today's date and entry content."""
    today = get_today_date()
    filename = get_entry_filename(today)
    
    content = ""
    try:
        if filename.exists():
            content = filename.read_text(encoding='utf-8')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    return jsonify({
        'date': today,
        'content': content
    })

@app.route('/api/save', methods=['POST'])
def save_entry():
    """Save diary entry content."""
    data = request.get_json(silent=True) or {}
    date_str = data.get('date')
    content = data.get('content', '')

    if not date_str:
        return jsonify({'error': 'Date is required'}), 400

    filename = get_entry_filename(date_str)

    try:
        filename.write_text(content, encoding='utf-8')
        return jsonify({'success': True, 'message': 'Entry saved successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/entries')
def list_entries():
    """Get list of all diary entries."""
    entries = get_all_entries()
    return jsonify({'entries': entries})

@app.route('/api/entry/<date>')
def get_entry(date):
    """Get a specific diary entry by date."""
    filename = get_entry_filename(date)

    if not filename.exists():
        return jsonify({'error': 'Entry not found'}), 404

    try:
        content = filename.read_text(encoding='utf-8')
        return jsonify({
            'date': date,
            'content': content
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/banned-words')
def get_banned_words():
    """Return high-level banned words metadata without exposing patterns."""
    entries = load_banned_words()
    return jsonify({
        'rule_count': len(entries),
        'message': 'Banned patterns are enforced server-side and not exposed.'
    })


@app.route('/api/banned-words/check', methods=['POST'])
def check_banned_words():
    """Check supplied content for banned patterns without revealing them."""
    data = request.get_json(silent=True) or {}
    content = data.get('content', '')

    if not isinstance(content, str):
        return jsonify({'error': 'content must be a string'}), 400

    match_info = _find_banned_match(content)
    if match_info:
        return jsonify({'matched': True, 'snippet': match_info['snippet']})

    return jsonify({'matched': False})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
