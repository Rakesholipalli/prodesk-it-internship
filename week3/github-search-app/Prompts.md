# AI Prompts Used

### Prompt 1:
What is the difference between `fetch()` and `axios` for making API calls in vanilla JavaScript?

### Why I used it:
The assignment said Level 1 and 2 must use `fetch()`. I wanted to understand why before just following the rule.

### What I learned:
`fetch()` is built into the browser — no install needed. It returns a Promise but doesn't automatically throw on 4xx errors, so you have to manually check `res.ok` or `res.status`. That's why I added the 404 check separately.

---

### Prompt 2:
Why does `fetch()` not throw an error on a 404 response?

### Why I used it:
I searched for a GitHub user that didn't exist and the app didn't crash, but it also didn't show an error. I couldn't figure out why.

### What I learned:
`fetch()` only rejects on network failure. A 404 is still a "successful" HTTP response from the browser's perspective. You have to check `res.status === 404` yourself and throw manually.

---

### Prompt 3:
How does `async/await` work with `try/catch` for error handling?

### Why I used it:
I was writing `.then().catch()` chains and they were getting hard to read. I wanted to understand the cleaner syntax.

### What I learned:
`async/await` is just syntactic sugar over Promises. Wrapping `await` calls in `try/catch` is the same as `.catch()` but reads like normal synchronous code. Much easier to follow.

---

### Prompt 4:
What does `Promise.all` do and when should I use `Promise.allSettled` instead?

### Why I used it:
In Battle Mode I needed to fetch two users at the same time. I used `Promise.all` first but it crashed if one username was wrong. I needed to show errors per field.

### What I learned:
`Promise.all` fails fast — if any Promise rejects, the whole thing rejects. `Promise.allSettled` waits for all of them and gives you each result with a `status` of `'fulfilled'` or `'rejected'`. That's what I needed for per-field error handling.

---

### Prompt 5:
How do I format an ISO date string like `2023-01-25T12:00:00Z` into `25 Jan 2023` in JavaScript?

### Why I used it:
The GitHub API returns dates in ISO format and I needed to display them in a readable way.

### What I learned:
`new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })` does exactly this. The `en-GB` locale gives the day-first format.

---

### Prompt 6:
How do I sum a property across all objects in a JavaScript array?

### Why I used it:
GitHub doesn't give total stars directly. I had to loop through all repos and add up `stargazers_count` myself.

### What I learned:
`array.reduce((sum, item) => sum + item.property, 0)` is the clean way to do this. Starting with `0` as the initial value handles empty arrays too.

---

### Prompt 7:
How does CSS `position: sticky` work and why does it sometimes not stick?

### Why I used it:
I was trying to make the tab bar stay visible while scrolling but it wasn't working.

### What I learned:
`sticky` only works if the parent element has a defined height and doesn't have `overflow: hidden`. Also needs `top: 0` set explicitly. Without those it just behaves like `relative`.

---

### Prompt 8:
How do I use an icon library like Lucide in a plain HTML project without npm?

### Why I used it:
I wanted professional SVG icons but didn't want to set up a build tool just for icons.

### What I learned:
Lucide has a CDN build you can drop in with a `<script>` tag. You add `<i data-lucide="icon-name">` in HTML or inject it via JS, then call `lucide.createIcons()` to replace them with actual SVGs. You need to call it again after any dynamic HTML is injected into the DOM.

---

### Prompt 9:
How do I use CSS `transition` to animate a border color change on an input field?

### Why I used it:
The red border on invalid inputs was appearing instantly. I wanted it to animate smoothly.

### What I learned:
Adding `transition: border-color 0.2s` to the input makes the color change animate. You can list multiple properties or use `transition: all 0.2s` but that's less performant.

---

### Prompt 10:
How does the `IntersectionObserver` API work for detecting when elements enter the viewport?

### Why I used it:
I wanted to understand a more performant alternative to scroll event listeners for future projects after reading about it.

### What I learned:
`IntersectionObserver` fires a callback only when a target element crosses a threshold in the viewport. It runs off the main thread so it doesn't block rendering, unlike `addEventListener('scroll', ...)` which fires on every pixel of scroll.
