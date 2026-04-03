# AI Prompts Used

### Prompt 1:
What is the difference between `localStorage.setItem` and `sessionStorage`?

### Why I used it:
I knew I wanted data to persist after the browser closes, but I wasn't 100% sure which storage API to use.

### What I learned:
`localStorage` persists until manually cleared, while `sessionStorage` clears when the tab closes. For a tracker app, `localStorage` is the right choice.

---

### Prompt 2:
Why does `10 + 10` give `1010` instead of `20` when reading from an input field?

### Why I used it:
My balance calculation was wrong and I couldn't figure out why at first.

### What I learned:
Input values are always strings. I needed to wrap them with `Number()` before doing arithmetic. Simple fix once I understood the cause.

---

### Prompt 3:
How does `JSON.stringify` and `JSON.parse` work with arrays?

### Why I used it:
I was storing my expenses array in localStorage but getting `[object Object]` back on reload.

### What I learned:
`JSON.stringify` converts the array to a string for storage, and `JSON.parse` converts it back. Without this the array gets coerced to a plain string.

---

### Prompt 4:
How do I update a Chart.js chart after the data changes without creating a new chart?

### Why I used it:
I had already written the chart creation code and just needed to know how to refresh it when expenses are added or deleted.

### What I learned:
Update `chart.data.datasets[0].data` and call `chart.update()`. The chart re-renders smoothly without flickering.

---

### Prompt 5:
What does `toFixed(2)` do and when should I use it?

### Why I used it:
My balance was showing values like `29999.999998` due to floating point arithmetic.

### What I learned:
`toFixed(2)` rounds to 2 decimal places and returns a string. I used `Number()` around it to keep it as a number for calculations.

---

### Prompt 6:
How do I format a date string like `2026-03-31` into `31 Mar 2026`?

### Why I used it:
The date input returns ISO format which looks technical. I wanted something more readable in the UI.

### What I learned:
Split by `-`, use a months array, and reassemble. No library needed — just a small helper function.

---

### Prompt 7:
How do I use the Frankfurter API to get exchange rates?

### Why I used it:
I wanted live currency conversion but didn't want to deal with API keys or sign-ups.

### What I learned:
`https://api.frankfurter.app/latest?from=INR&to=USD,EUR,GBP` returns live rates for free. The response is straightforward JSON with a `rates` object.

---

### Prompt 8:
What does `e.target.closest()` do in JavaScript?

### Why I used it:
I was using event delegation on the expense list and needed to find the button that was clicked even when clicking the icon inside it.

### What I learned:
`closest()` walks up the DOM tree from the clicked element and returns the first ancestor matching the selector. It handles clicks on child elements inside a button cleanly.

---

### Prompt 9:
How do I generate a basic PDF with jsPDF?

### Why I used it:
I had never used jsPDF before and needed to understand the basic API — how to set fonts, add text, and save the file.

### What I learned:
`doc.text()`, `doc.setFontSize()`, and `doc.save()` are the core methods. For tables, `doc.autoTable()` from the autotable plugin handles alignment and styling automatically.

---

### Prompt 10:
How do I initialize Lucide icons that are added dynamically to the DOM?

### Why I used it:
I added Lucide icon tags inside dynamically rendered list items but they were showing as blank.

### What I learned:
`lucide.createIcons()` needs to be called after any DOM update, not just once on page load. I added it at the end of my `render()` function.
