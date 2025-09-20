# Digital Diary Web Application

A simple, elegant digital diary web application built with Python Flask and vanilla JavaScript. Write your daily thoughts and automatically save them with a beautiful, intuitive interface.

## Features

- 📝 **Daily Entry**: Main page shows a text area for today's diary entry
- 💾 **Auto-Save**: Content automatically saves to date-named files (YYYY-MM-DD.txt)
- 📅 **Date-Based**: Each day presents a fresh, blank page
- 📚 **Browse Past Entries**: Simple sidebar to view and navigate previous entries
- 🎨 **Elegant Design**: Clean, modern interface with gradient background
- 💻 **Responsive**: Works on desktop and mobile devices

## Technologies Used

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: Local file system (.txt files)

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ThirdExperiment
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

## Usage

- **Writing**: Simply start typing in the text area. Your content will automatically save after you stop typing for 1 second.
- **Browsing**: Click on any date in the "Past Entries" sidebar to view previous entries.
- **Navigation**: Click "Today" to return to the current day's entry.

## File Structure

```
├── app.py                 # Flask backend application
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css     # Application styles
│   └── js/
│       └── app.js        # Frontend JavaScript
└── diary_entries/        # Directory for diary entries (auto-created)
    ├── 2025-09-17.txt    # Example diary entry
    └── ...
```

## API Endpoints

- `GET /` - Main application page
- `GET /api/today` - Get today's date and entry content
- `POST /api/save` - Save diary entry content
- `GET /api/entries` - List all diary entries
- `GET /api/entry/<date>` - Get specific diary entry by date

## Features in Detail

### Auto-Save Functionality
- Content saves automatically 1 second after you stop typing
- Visual feedback shows save status (Saving → Saved → Ready)
- No manual save required

### Date Management
- Automatically detects current date
- Creates new blank entries for new days
- Organizes entries chronologically

### Responsive Design
- Clean, modern interface
- Mobile-friendly layout
- Smooth animations and transitions

## Development

To modify or extend the application:

1. **Backend changes**: Edit `app.py` for API modifications
2. **Frontend styling**: Modify `static/css/style.css`
3. **Frontend behavior**: Update `static/js/app.js`
4. **Layout changes**: Edit `templates/index.html`

## License

This project is open source. Feel free to modify and distribute as needed.
