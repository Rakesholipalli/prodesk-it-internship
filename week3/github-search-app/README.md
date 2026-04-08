# Dev Detective 🔍

A GitHub User Search App built with HTML, CSS, and vanilla JavaScript using the GitHub REST API. Has single user search, paginated repository listing, per-field error handling, and a Battle Mode that compares two developers using a scoring system.

## Features

- Search any GitHub user and view their profile (avatar, bio, join date, portfolio URL)
- Paginated repository list showing 10 repos per page with total count
- Loading spinner while data is fetching
- Inline "User not found" error with red border on invalid input
- Battle Mode: compare two developers head-to-head simultaneously using `Promise.all`
- GitHub Strength score with tooltip showing the full formula breakdown
- Winner reason displayed under the winning card
- Draw state when both scores are equal
- Lucide SVG icons throughout for consistent professional UI

## Battle Logic

Each user is assigned a score based on:

```
Score = (Followers × 3) + (Repos × 2) + (Stars × 5)
```

- Stars are calculated by looping through all public repositories and summing `stargazers_count`
- The user with the higher score wins
- If scores are equal → Draw (both cards highlighted in blue)
- Winner card → green highlight
- Loser card → red highlight

## Technologies Used

- HTML5 with semantic elements
- CSS3 (Flexbox, CSS custom properties, transitions)
- Vanilla JavaScript (fetch, async/await, Promise.all, Promise.allSettled, IntersectionObserver)
- GitHub REST API (`https://api.github.com`)
- Lucide Icons via CDN (`unpkg.com/lucide@latest`) — rendered with `lucide.createIcons()`

## How to Run

```bash
cd github-search-app
npx serve .
```

Then open `http://localhost:3000` in your browser.

Or just double-click `index.html` to open directly in your browser.

## Live Demo

Live Demo: https://prodesk-it-internship-skun.vercel.app/

## API Rate Limits

GitHub allows 60 unauthenticated requests/hour. If you hit the limit, wait or add a Personal Access Token.
