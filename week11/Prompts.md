# AI Prompts Used

This document shows how I used AI assistance during the development of this MERN application. I used AI as a learning tool to understand concepts, debug issues, and learn best practices - not to generate entire features.

---

## Prompt 1
**Question:** What is the difference between `mongoose.connect()` with MongoDB Atlas vs local MongoDB?

**Why I used it:**  
I was getting connection timeout errors with MongoDB Atlas and needed to understand whether to use a cloud database or local instance for development.

**What I learned:**  
Atlas requires IP whitelisting and proper connection string format with username/password. Local MongoDB (`mongodb://127.0.0.1:27017/dbname`) is simpler for development and doesn't require network configuration.

---

## Prompt 2
**Question:** How does `multer.memoryStorage()` work and why use it instead of `diskStorage`?

**Why I used it:**  
I needed to understand the best way to handle image uploads before sending them to Cloudinary without saving them to disk first.

**What I learned:**  
`memoryStorage()` keeps files in memory as buffers, which is perfect for streaming directly to cloud services like Cloudinary. No need to write/delete temporary files from disk.

---

## Prompt 3
**Question:** Why does my `.env` file not load environment variables in ES modules?

**Why I used it:**  
My Cloudinary credentials weren't loading even though they were in the `.env` file. The app kept showing "API key not found" errors.

**What I learned:**  
`dotenv.config()` must be called **before** importing other modules. I moved it to the very top of `server.js` and the issue was resolved. ES modules load imports before execution, so timing matters.

---

## Prompt 4
**Question:** What's the correct way to handle CORS in Express when frontend is on a different port?

**Why I used it:**  
I was getting CORS errors when my React frontend (port 5173) tried to fetch from the backend (port 5000).

**What I learned:**  
Use `cors()` middleware with proper `origin` configuration. Setting `origin: 'http://localhost:5173'` allows the frontend to make requests. The order of middleware matters - CORS must come before route handlers.

---

## Prompt 5
**Question:** How do I properly stream a file buffer to Cloudinary's `upload_stream()`?

**Why I used it:**  
I had the image buffer from multer but wasn't sure how to use Cloudinary's streaming upload API correctly.

**What I learned:**  
Wrap `upload_stream()` in a Promise, pipe the buffer through it, and handle both success (`secure_url`) and error events. The stream approach is more memory-efficient than converting to base64.

---

## Prompt 6
**Question:** What's the difference between `const`, `let`, and `var`, and why avoid `var`?

**Why I used it:**  
I wanted to follow modern JavaScript best practices and needed to understand which to use in different situations.

**What I learned:**  
`const` for values that won't be reassigned (most cases), `let` for values that change (counters, state). `var` has function scope and hoisting issues - modern code should avoid it entirely.

---

## Prompt 7
**Question:** How do I test React components with Vitest and Testing Library?

**Why I used it:**  
The assignment required real tests, and I had never used Vitest before. I needed to understand the setup and basic testing patterns.

**What I learned:**  
Vitest works like Jest but is faster with Vite. Use `render()` from Testing Library, `screen` queries to find elements, and `expect()` for assertions. Mock `fetch` globally for API testing.

---

## Prompt 8
**Question:** What does `@testing-library/jest-dom` provide and why use it?

**Why I used it:**  
I saw `toBeInTheDocument()` in examples but it wasn't available in basic Vitest. I needed to understand what additional matchers to install.

**What I learned:**  
`@testing-library/jest-dom` adds DOM-specific matchers like `toBeInTheDocument()`, `toHaveClass()`, `toHaveTextContent()`. Import it in the test setup file to make these matchers available globally.

---

## Prompt 9
**Question:** How do I refactor inline JSX into reusable React components?

**Why I used it:**  
My `App.jsx` was getting too large with lots of inline JSX blocks. I wanted to learn the proper way to extract components while maintaining functionality.

**What I learned:**  
Extract logical sections (Header, Footer, LoadingSpinner, etc.) into separate component files. Pass data and handlers via props. Each component should have a single responsibility. This makes code more maintainable and testable.

---

## Prompt 10
**Question:** What's the difference between `happy-dom` and `jsdom` for testing?

**Why I used it:**  
I was getting ESM module errors with jsdom on Windows. I needed to understand alternative DOM environments for React testing.

**What I learned:**  
`happy-dom` is a lighter, faster alternative to jsdom with better ESM support. It works seamlessly with Vitest and handles most React testing scenarios. Just change `environment: 'jsdom'` to `environment: 'happy-dom'` in the config.

