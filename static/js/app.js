// Digital Diary Application JavaScript

class DiaryApp {
    constructor() {
        this.currentDate = '';
        this.saveTimeout = null;
        this.entries = [];
        this.bannedWords = [];
        this.overlayTimer = null;
        this.init();
    }

    async init() {
        this.setupElements();
        this.setupEventListeners();
    await this.loadBannedWords();
        await this.loadTodaysEntry();
        await this.loadEntries();
        this.updateDateDisplay();
        try { console.debug('DiaryApp initialized'); } catch {}
        // Periodically refresh banned patterns (every 15s) so config edits apply without reload
        this._bwInterval = setInterval(() => this.loadBannedWords(), 15000);
    }

    setupElements() {
        this.diaryText = document.getElementById('diaryText');
        this.saveStatus = document.getElementById('saveStatus');
        this.currentDateEl = document.getElementById('currentDate');
        this.entriesList = document.getElementById('entriesList');
        this.overlayEl = document.getElementById('annoyingOverlay');
        this.bannedMsgEl = document.getElementById('bannedMessage');
    }

    setupEventListeners() {
        // Auto-save on text change
        this.diaryText.addEventListener('input', () => {
            this.handleTextChange();
            this.checkForBannedWords();
        });

        // Refresh banned patterns when window gains focus or tab becomes visible
        window.addEventListener('focus', () => this.loadBannedWords());
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) this.loadBannedWords();
        });

        // Save on page unload
        window.addEventListener('beforeunload', () => {
            if (this.saveTimeout) {
                clearTimeout(this.saveTimeout);
                this.saveEntry();
            }
        });
    }

    updateDateDisplay() {
        const today = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        this.currentDateEl.textContent = today.toLocaleDateString('en-US', options);
    }

    async loadTodaysEntry() {
        try {
            const response = await fetch('/api/today');
            const data = await response.json();
            
            this.currentDate = data.date;
            this.diaryText.value = data.content;
            this.updateSaveStatus('ready');
            this.checkForBannedWords();
        } catch (error) {
            console.error('Error loading today\'s entry:', error);
            this.updateSaveStatus('Error loading entry');
        }
    }

    async loadEntries() {
        try {
            const response = await fetch('/api/entries');
            const data = await response.json();
            
            this.entries = data.entries;
            this.renderEntriesList();
        } catch (error) {
            console.error('Error loading entries:', error);
            this.entriesList.innerHTML = '<div class="loading">Error loading entries</div>';
        }
    }

    renderEntriesList() {
        if (this.entries.length === 0) {
            this.entriesList.innerHTML = '<div class="no-entries">No entries yet. Start writing!</div>';
            return;
        }

        this.entriesList.innerHTML = '';
        
        this.entries.forEach(date => {
            const entryEl = document.createElement('div');
            entryEl.className = 'entry-item';
            if (date === this.currentDate) {
                entryEl.classList.add('active');
            }
            
            const dateEl = document.createElement('div');
            dateEl.className = 'entry-date';
            dateEl.textContent = this.formatDate(date);
            
            entryEl.appendChild(dateEl);
            
            entryEl.addEventListener('click', () => {
                this.loadEntry(date);
            });
            
            this.entriesList.appendChild(entryEl);
        });
    }

    formatDate(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const dateOnly = dateStr;
        const todayStr = today.toISOString().split('T')[0];
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (dateOnly === todayStr) {
            return 'Today';
        } else if (dateOnly === yesterdayStr) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            });
        }
    }

    async loadEntry(date) {
        try {
            // Save current entry before switching
            if (this.saveTimeout) {
                clearTimeout(this.saveTimeout);
                await this.saveEntry();
            }

            const response = await fetch(`/api/entry/${date}`);
            const data = await response.json();
            
            if (response.ok) {
                this.currentDate = data.date;
                this.diaryText.value = data.content;
                this.updateSaveStatus('ready');
                this.renderEntriesList(); // Re-render to update active state
                
                // Update date display if not today
                const today = new Date().toISOString().split('T')[0];
                if (date !== today) {
                    this.currentDateEl.textContent = this.formatDate(date) + ' Entry';
                } else {
                    this.updateDateDisplay();
                }
            } else {
                console.error('Error loading entry:', data.error);
            }
        } catch (error) {
            console.error('Error loading entry:', error);
        }
    }

    handleTextChange() {
        this.updateSaveStatus('saving');
        
        // Clear existing timeout
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }
        
        // Set new timeout for auto-save (1 second delay)
        this.saveTimeout = setTimeout(() => {
            this.saveEntry();
        }, 1000);
    }

    async saveEntry() {
        try {
            const response = await fetch('/api/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    date: this.currentDate,
                    content: this.diaryText.value
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.updateSaveStatus('saved');
                
                // Refresh entries list if this is a new entry
                if (!this.entries.includes(this.currentDate) && this.diaryText.value.trim()) {
                    await this.loadEntries();
                }
                
                setTimeout(() => {
                    this.updateSaveStatus('ready');
                }, 2000);
            } else {
                this.updateSaveStatus('Error saving');
                console.error('Save error:', data.error);
            }
        } catch (error) {
            this.updateSaveStatus('Error saving');
            console.error('Network error:', error);
        }
        
        this.saveTimeout = null;
    }

    updateSaveStatus(status) {
        this.saveStatus.className = `save-status ${status.toLowerCase().replace(' ', '-')}`;
        
        const statusText = this.saveStatus.querySelector('.status-text');
        statusText.textContent = status;
    }

    async loadBannedWords() {
        try {
            const res = await fetch('/api/banned-words');
            const data = await res.json();
            const rawList = Array.isArray(data.banned_words) ? data.banned_words : [];
            this.bannedWords = rawList
                .map(w => typeof w === 'string' ? w.toLowerCase().trim() : '')
                .filter(Boolean);
            try { console.debug('Loaded banned words:', this.bannedWords); } catch {}
        } catch (e) {
            console.warn('Failed to load banned words:', e);
            this.bannedWords = [];
        }
    }

    checkForBannedWords() {
        if (!this.bannedWords || this.bannedWords.length === 0) return;
        const rawText = this.diaryText.value || '';
        const text = rawText.toLowerCase();
        let matched = null;
        for (const w of this.bannedWords) {
            if (!w) continue;
            const idx = text.indexOf(w);
            if (idx !== -1) {
                // preserve original casing by slicing original text
                matched = rawText.substring(idx, idx + w.length);
                break;
            }
        }
        if (matched) {
            try { console.debug('Banned word matched:', matched); } catch {}
            this.showAnnoyingOverlay(matched);
        }
    }

    showAnnoyingOverlay(matchedWord) {
        if (!this.overlayEl) return;
        if (this.overlayEl.classList.contains('show')) {
            // restart timer
            clearTimeout(this.overlayTimer);
        } else {
            this.overlayEl.classList.add('show');
        }

        if (this.bannedMsgEl) {
            const word = (matchedWord || '').trim();
            this.bannedMsgEl.textContent = word ? `${word} is tidak baik, hapus!` : `Kata ini tidak baik, hapus!`;
        }

        this.overlayTimer = setTimeout(() => {
            this.hideAnnoyingOverlay();
        }, 5000);
    }

    hideAnnoyingOverlay() {
        if (!this.overlayEl) return;
        this.overlayEl.classList.remove('show');
        if (this.overlayTimer) {
            clearTimeout(this.overlayTimer);
            this.overlayTimer = null;
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DiaryApp();
});