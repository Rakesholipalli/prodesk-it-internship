# AI Prompts Used

### Prompt 1:
How do I call the Gemini API directly from the browser using fetch?

### Why I used it:
I knew the API existed but wasn't sure about the exact endpoint format, request body structure, and where to pass the API key.

### What I learned:
You pass the key as a query parameter `?key=YOUR_KEY` and the body needs a `contents` array with `parts` inside. The response comes back under `candidates[0].content.parts[0].text`.

---

### Prompt 2:
How do I read a PDF file in the browser without a backend using pdf.js?

### Why I used it:
I wanted to let users upload their resume and extract the text client-side, but I had never used pdf.js before and didn't know how to load pages and get text content.

### What I learned:
You use `getDocument()` with an `ArrayBuffer`, then loop through each page calling `getTextContent()`. Each page returns an `items` array where each item has a `str` property you join together.

---

### Prompt 3:
What is prompt engineering and how do I write a good prompt for generating a cover letter?

### Why I used it:
My first attempt just said "write a cover letter for [name]" and the output was very generic. I wanted to understand how to get structured, personalized output.

### What I learned:
Being specific about format (number of paragraphs, tone, what to include) dramatically improves output. Adding "do NOT use placeholder brackets" stops the model from outputting things like `[X years of experience]`.

---

### Prompt 4:
How do I implement drag and drop file upload in vanilla JavaScript?

### Why I used it:
I wanted a drag-and-drop zone for the PDF upload but wasn't sure which events to listen to or how to prevent the browser from just opening the file.

### What I learned:
You need `dragover` with `e.preventDefault()` to stop the browser default behavior, then `drop` to grab `e.dataTransfer.files`. Without `preventDefault()` on dragover, the drop event never fires.

---

### Prompt 5:
How do I show a loading spinner inside a button while an async operation is running?

### Why I used it:
The Gemini API takes 2-5 seconds to respond and I wanted the button to show a spinner during that time instead of just freezing.

### What I learned:
You toggle a CSS class on a spinner element and disable the button simultaneously. Using a CSS `border` animation with `border-top-color` different from the rest gives a clean spinner with just a few lines of CSS.

---

### Prompt 6:
How do I use CSS custom properties (variables) to build a consistent dark theme?

### Why I used it:
I was hardcoding colors everywhere and wanted a cleaner way to manage the dark color palette across the whole UI.

### What I learned:
Defining colors in `:root` as `--variable-name` lets you change the entire theme from one place. It also makes hover states and variations much easier since you reference the variable instead of repeating hex codes.

---

### Prompt 7:
How do I copy text to clipboard in JavaScript and give visual feedback to the user?

### Why I used it:
I wanted the "Copy" button to confirm the copy happened visually, not just silently copy.

### What I learned:
`navigator.clipboard.writeText()` is the modern async API. You swap the button icon/text on success and use `setTimeout` to revert it after 2 seconds. It needs to be called from a user gesture (click) or it throws a permission error.

---

### Prompt 8:
How do I use Vite to hide an API key using environment variables in a frontend project?

### Why I used it:
My API key was hardcoded in `main.js` which would expose it on GitHub. I needed a way to keep it secret.

### What I learned:
Vite reads `.env` files and exposes variables prefixed with `VITE_` via `import.meta.env.VITE_KEY_NAME`. The `.env` file goes in `.gitignore` and you commit a `.env.example` as a template instead.

---

### Prompt 9:
How do I use Lucide icons in a plain HTML project without a framework?

### Why I used it:
I wanted professional SVG icons instead of emojis but didn't want to install a heavy icon library or use a React component.

### What I learned:
Lucide has a UMD build you can load via CDN. You add `data-lucide="icon-name"` attributes to elements and call `lucide.createIcons()` after the DOM loads. It replaces the elements with inline SVGs automatically.

---

### Prompt 10:
How do I make a radial gradient background glow effect that stays fixed behind the content?

### Why I used it:
I wanted the purple ambient glow behind the form card but wasn't sure how to layer it behind everything without affecting the layout.

### What I learned:
Use `position: fixed` with `pointer-events: none` and a high negative `z-index` so it sits behind all content and doesn't interfere with clicks. `radial-gradient` with a transparent outer stop creates the soft glow fade.
