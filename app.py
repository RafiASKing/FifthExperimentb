#!/usr/bin/env python3
"""
Digital Diary Web Application
A simple, elegant digital diary with auto-save functionality.
"""

from flask import Flask, render_template, request, jsonify
from pathlib import Path
from datetime import datetime

app = Flask(__name__)


# Use a diary_entries directory located next to app.py (absolute path)
DIARY_DIR = Path(__file__).resolve().parent / "diary_entries"
DIARY_DIR.mkdir(parents=True, exist_ok=True)

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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
