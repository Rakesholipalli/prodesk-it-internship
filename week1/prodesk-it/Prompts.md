# AI Prompts Used

### Prompt 1:
How to create a sticky glassmorphism navbar using Tailwind CSS?

### Why I used it:
I wasn't sure whether to use `fixed` or `sticky` positioning, and I wanted to get the backdrop-filter classes right.

### What I learned:
`backdrop-filter: blur()` needs a semi-transparent background to actually show the blur. Also `-webkit-backdrop-filter` is needed for Safari.

---

### Prompt 2:
How to persist dark mode preference using localStorage in vanilla JS?

### Why I used it:
I wanted the dark mode toggle to remember the user's choice on page reload.

### What I learned:
You can combine `localStorage` with `prefers-color-scheme` so the right theme loads even on first visit before the user picks anything.

---

### Prompt 3:
What Tailwind classes give a 1-col on mobile, 2-col on tablet, 3-col on desktop grid?

### Why I used it:
I kept second-guessing the responsive prefix syntax for grid columns.

### What I learned:
`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` — the breakpoint prefixes just stack on top of each other, no media queries needed.

---

### Prompt 4:
How does setCustomValidity work with reportValidity to show native browser tooltips?

### Why I used it:
The service `<select>` wasn't triggering the browser's built-in validation tooltip on submit.

### What I learned:
`setCustomValidity('')` clears the error, and `reportValidity()` shows the native tooltip without actually submitting the form.

---

### Prompt 5:
What is the most performant way to trigger CSS animations when elements scroll into view?

### Why I used it:
I didn't want to use a scroll event listener since those fire constantly and hurt performance.

### What I learned:
`IntersectionObserver` is way better — it runs off the main thread and only fires when the element actually enters the viewport.

---

### Prompt 6:
How to animate a hamburger icon into an X using CSS transforms?

### Why I used it:
I wanted a smooth open/close animation on the mobile menu button without any extra library.

### What I learned:
You can use `translateY` + `rotate` on three `<span>` elements to get the hamburger-to-X effect with just CSS transforms.

---

### Prompt 7:
How to define a custom keyframe animation inside tailwind.config.js?

### Why I used it:
I wanted a `fadeUp` animation on the hero text that I could use as a Tailwind class.

### What I learned:
Add the keyframes under `theme.extend.keyframes` and the animation under `theme.extend.animation`, then use it as `animate-fadeUp` in HTML.

---

### Prompt 8:
What CSS properties are needed for a frosted glass effect with Safari support?

### Why I used it:
The glassmorphism navbar wasn't working on Safari in testing.

### What I learned:
Safari needs `-webkit-backdrop-filter` alongside the standard `backdrop-filter`. Without it the blur just doesn't show up.

---

### Prompt 9:
How to offset smooth scroll so content doesn't hide behind a fixed navbar?

### Why I used it:
Clicking nav links was scrolling the section title right behind the fixed navbar.

### What I learned:
Use `getBoundingClientRect().top + window.scrollY` to get the absolute position, then subtract the navbar height before calling `window.scrollTo`.

---

### Prompt 10:
What is the correct way to load Google Fonts without blocking page render?

### Why I used it:
The font was causing a render-blocking request that hurt Lighthouse performance score.

### What I learned:
Load the font with `media="print"` and `onload="this.media='all'"` — the browser fetches it without blocking, then swaps it in when ready.
