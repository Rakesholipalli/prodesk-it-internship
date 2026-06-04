# CineStream

A modern movie discovery application with AI-powered mood matching, infinite scroll, and persistent favorites built with React.js and Google Gemini AI.

---

## Features

- Infinite scroll — Seamlessly load more movies as you scroll without pagination buttons
- Debounced search — Real-time movie search with optimized API calls (500ms delay)
- AI mood matcher — Get personalized movie recommendations based on your mood using Google Gemini 2.5 Flash
- Autocomplete suggestions — Smart mood suggestions dropdown with 20+ predefined prompts
- Persistent favorites — Save favorite movies to localStorage, survives page refresh
- Real-time validation — Input changes clear recommendations instantly, prompting new searches
- Multiple Gemini models — Support for 10+ Gemini AI models (Flash, Pro, Lite variants)
- Responsive design — Mobile-first design with Netflix-inspired dark theme
- Network optimization — Debounced search prevents API spam, only 1 request per search term
- Error handling — Graceful fallback recommendations when AI service is unavailable
- Loading states — Smooth loading indicators for better UX

---

## Tech Used

React.js, Vite, Google Generative AI (Gemini), TMDB API, LocalStorage, Intersection Observer API, CSS3

---

## How to Run

```bash
cd cine-stream
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

**Environment Setup:**

Create a `.env` file in the root directory:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

---

## Project Structure

```
src/
├── components/
│   ├── AIMoodMatcher.jsx       # AI mood matcher component
│   ├── AIMoodMatcher.css       # Mood matcher styles
│   ├── Header.jsx              # App header with navigation
│   ├── LoadingSpinner.jsx      # Loading indicator
│   ├── LoadingSpinner.css      # Spinner styles
│   ├── MovieCard.jsx           # Individual movie card with favorites
│   ├── MovieCard.css           # Movie card styles
│   ├── MovieGrid.jsx           # Grid layout for movies
│   ├── MovieGrid.css           # Grid styles
│   ├── Navbar.jsx              # Navigation bar
│   ├── Navbar.css              # Navbar styles
│   ├── SearchBar.jsx           # Search input component
│   └── SearchBar.css           # Search bar styles
├── hooks/
│   ├── useDebounce.js          # Custom debounce hook
│   └── useInfiniteScroll.js    # Custom infinite scroll hook
├── pages/
│   ├── Favorites.jsx           # Favorites page
│   ├── Favorites.css           # Favorites page styles
│   ├── Home.jsx                # Home page with movie grid
│   ├── Home.css                # Home page styles
│   └── MoodMatcher.jsx         # AI mood matcher page
├── services/
│   ├── api.js                  # TMDB API + Gemini AI integration
│   └── aiService.js            # Gemini AI service (alternative)
├── utils/
│   ├── debounce.js             # Debounce utility function
│   └── localStorage.js         # LocalStorage helpers
├── App.jsx                     # Root component with routing
├── App.css                     # Main app styles
├── index.css                   # Global styles and CSS variables
└── main.jsx                    # App entry point
```

---

## Live Demo

Live Demo: https://prodesk-it-internship-musc.vercel.app/
