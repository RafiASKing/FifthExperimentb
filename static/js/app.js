// Digital Diary Application JavaScript

class DiaryApp {
    constructor() {
        this.currentDate = '';
        this.saveTimeout = null;
        this.entries = [];
        this.init();
    }

    async init() {
        this.setupElements();
        this.setupEventListeners();
        await this.loadTodaysEntry();
        await this.loadEntries();
        this.updateDateDisplay();
    }

    setupElements() {
        this.diaryText = document.getElementById('diaryText');
        this.saveStatus = document.getElementById('saveStatus');
        this.currentDateEl = document.getElementById('currentDate');
        this.entriesList = document.getElementById('entriesList');
    }

    setupEventListeners() {
        // Auto-save on text change
        this.diaryText.addEventListener('input', () => {
            this.handleTextChange();
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
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DiaryApp();
});