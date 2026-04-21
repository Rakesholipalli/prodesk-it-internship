# CoverCraft AI ✦

An AI-powered cover letter generator built with HTML, CSS, and vanilla JavaScript using the Google Gemini API. Supports PDF resume upload with client-side text extraction, dynamic prompt engineering, and a clean dark UI.

Live Demo: https://prodesk-it-internship-gojd-5lojvxd0o.vercel.app/

## Features

- Fill in your name, job role, company, and job description
- Upload your resume as a PDF — text is extracted in the browser using pdf.js
- AI generates a personalized, structured cover letter via Gemini 2.5 Flash
- Loading states ("Parsing Resume..." → "Generating...") during async operations
- Copy to clipboard button with visual confirmation
- Drag and drop PDF upload support
- Error banner for API or input failures
- API key secured via Vite environment variables (never committed to GitHub)
- Lucide SVG icons throughout for a consistent professional UI

## AI Logic

The prompt sent to Gemini is dynamically built based on user input:

```
If PDF uploaded  → Resume text is extracted and injected into the prompt
If no PDF        → Key skills field is used instead
```

The prompt instructs Gemini to write 3-4 structured paragraphs, match the job description, avoid placeholder brackets, and format with clear paragraph breaks.

## Technologies Used

- HTML5 with semantic elements
- CSS3 (Flexbox, CSS custom properties, transitions, radial gradient background)
- Vanilla JavaScript (fetch, async/await, FileReader, ArrayBuffer)
- Google Gemini API (`gemini-2.5-flash` via `generativelanguage.googleapis.com`)
- pdfjs-dist — client-side PDF text extraction
- Vite — dev server and environment variable handling
- Lucide Icons via CDN (`unpkg.com/lucide@latest`)

## How to Run

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Environment Variables

Create a `.env` file in the root:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get a free API key at [aistudio.google.com](https://aistudio.google.com/app/apikey)

Never commit your `.env` file. It is already listed in `.gitignore`.

## Security

- API key is stored in `.env` and accessed via `import.meta.env.VITE_GEMINI_API_KEY`
- `.env` is gitignored — only `.env.example` is committed as a template
- PDF parsing happens entirely in the browser — no file is uploaded to any server

## API Rate Limits

Gemini free tier allows 15 requests/minute and 1500 requests/day. If you hit the limit, wait a minute and try again.
