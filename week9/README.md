# The Data Hub

A robust RESTful API server built with Node.js and Express.js, featuring full CRUD operations, custom middleware logging, and mock JWT authentication for blog post management.

---

## Features

- **Full CRUD Operations** — Create, Read, Update, and Delete blog posts with comprehensive validation
- **In-Memory Database** — Fast data manipulation using JavaScript arrays (no database setup required)
- **Custom Middleware Logger** — Automatic request logging with HTTP method, URL path, and timestamp
- **Mock JWT Authentication** — Login endpoint generating mock JSON Web Tokens for auth simulation
- **ES6+ Refactored Code** — Modern JavaScript with const/let, arrow functions, and modular helper functions
- **Input Validation & Sanitization** — Server-side validation with character limits and input sanitization for security
- **CORS Support** — Cross-Origin Resource Sharing enabled for frontend integration
- **RESTful Architecture** — Industry-standard REST principles with proper HTTP status codes
- **Hot Reload Support** — Nodemon integration for automatic server restart during development
- **Timestamp Tracking** — Automatic createdAt and updatedAt timestamps on all posts
- **Comprehensive Error Handling** — Global error handler with graceful degradation for edge cases and API downtime scenarios
- **Health Check Endpoint** — Monitor server status, uptime, and memory usage
- **404 Route Handler** — User-friendly messages for undefined routes with available endpoint suggestions
- **Environment Configuration** — Support for environment variables (PORT, NODE_ENV)

---

## Tech Used

Node.js, Express.js, Nodemon, JavaScript (ES6+), REST API Architecture

---

## How to Run

```bash
cd week9
npm install
npm start
```

For development with auto-reload:
```bash
npm run dev
```

Then test the endpoints at `http://localhost:5000`

**Thunder Client Setup:**
Import the collection file `The Data Hub API.json` into Thunder Client extension in VS Code for quick API testing.

**Health Check:**
Visit `http://localhost:5000/health` to monitor server status and performance metrics.

---

## Project Structure

```
week9/
├── server.js                   # Main Express server with all routes
├── package.json                # Dependencies and scripts
├── .gitignore                  # Git ignore rules
├── thunder-collection_The Data Hub API.json  # Thunder Client collection
├── DEMO_SCRIPT.txt             # Video demo script
└── AI_PROMPTS_USED.md          # AI learning documentation
```

---

## Live Demo

Live Demo: http://localhost:5000
