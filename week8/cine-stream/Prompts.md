# AI Prompts Used

---

## Prompt 1: Understanding Debounced Search Implementation

**Prompt:**
> How does debouncing work in React with useEffect and setTimeout? I want to understand the cleanup function pattern.

**Why I used it:**
I knew I needed to prevent excessive API calls while users type in the search bar, but I wasn't sure how the cleanup function in useEffect prevents memory leaks and cancels pending timers.

**What I learned:**
The cleanup function (return statement in useEffect) runs before the next effect and on unmount. By calling `clearTimeout(timer)` in the cleanup, each keystroke cancels the previous timer, so only the final timer (after user stops typing) actually executes the search. This prevents API spam.

---

## Prompt 2: Infinite Scroll with Intersection Observer

**Prompt:**
> What's the difference between scroll event listeners and IntersectionObserver for infinite scroll? Which is more performant?

**Why I used it:**
I wanted to implement infinite scroll but wasn't sure if I should use `window.addEventListener('scroll')` or the newer IntersectionObserver API.

**What I learned:**
IntersectionObserver is way more performant because it runs off the main thread and only fires when elements actually enter/exit the viewport. Scroll listeners fire constantly (even when nothing changes) and can cause jank. The `ref` callback pattern in React works perfectly with IntersectionObserver.

---

## Prompt 3: LocalStorage for Persistent Favorites

**Prompt:**
> How do I properly serialize and deserialize complex objects when storing them in localStorage? What about handling errors?

**Why I used it:**
I needed to persist the user's favorite movies across page reloads, but localStorage only stores strings. I wasn't sure about the best way to handle JSON parsing errors.

**What I learned:**
Always wrap `JSON.parse()` in a try-catch block because corrupted localStorage data will throw errors. Use `JSON.stringify()` to store arrays/objects, and provide fallback values (like empty arrays) when parsing fails. Also learned to check if localStorage is available before using it (some browsers block it in private mode).

---

## Prompt 4: Google Gemini API Integration

**Prompt:**
> What's the correct way to initialize the Google Generative AI SDK and handle different model versions? How do I handle API errors gracefully?

**Why I used it:**
I was getting 404 errors with certain Gemini model names and needed to understand which models are actually available and how to handle API failures.

**What I learned:**
Model names must match exactly what's available in the API (e.g., `gemini-2.5-flash` not `gemini-2.0-flash-exp`). Always implement fallback logic for AI features since APIs can fail. The `generateContent()` method returns a promise, so proper async/await with try-catch is essential.

---

## Prompt 5: React State Management for Form Inputs

**Prompt:**
> When should I clear state in React forms? How do I track if user input has changed from a submitted value?

**Why I used it:**
I wanted the AI mood matcher to hide recommendations when users modify their input, but I needed to understand the best pattern for tracking "submitted" vs "current" input values.

**What I learned:**
Keep two separate state variables: one for current input (`moodInput`) and one for submitted value (`submittedMood`). Compare them in the onChange handler to detect changes. This pattern is cleaner than trying to use useEffect with complex dependencies.

---

## Prompt 6: Autocomplete Dropdown Implementation

**Prompt:**
> How do I implement an autocomplete dropdown that filters suggestions as the user types? What about handling blur events without breaking click handlers?

**Why I used it:**
I wanted to add suggestion dropdowns to the mood matcher but wasn't sure how to handle the timing between blur (closing dropdown) and click (selecting suggestion).

**What I learned:**
Use `setTimeout` with a small delay (200ms) in the blur handler. This gives the click event time to fire before the dropdown closes. Filter suggestions using `Array.filter()` with `includes()` for substring matching. Highlight matching text using `dangerouslySetInnerHTML` with regex replacement (though I learned to be careful with XSS).

---

## Prompt 7: CSS Animations and Transitions

**Prompt:**
> What's the difference between CSS transitions and animations? When should I use @keyframes vs transition property?

**Why I used it:**
I wanted smooth slide-in effects for the suggestion dropdown and wasn't sure whether to use transitions or keyframe animations.

**What I learned:**
Use `transition` for simple state changes (hover, focus). Use `@keyframes` for complex multi-step animations. For the dropdown, I used a `slideDown` keyframe animation because it needs to animate from a specific starting point (translateY(-10px)) to final position, not just between two states.

---

## Prompt 8: Async/Await Error Handling Best Practices

**Prompt:**
> What's the proper way to handle errors in async functions in React? Should I use try-catch or .catch()?

**Why I used it:**
My API calls were failing silently and I needed to understand proper error handling patterns in React components.

**What I learned:**
Always use try-catch with async/await in React. Set error state in the catch block and display it to users. Use a `finally` block to reset loading states regardless of success/failure. Never leave async functions without error handling - it causes unhandled promise rejections.

---

## Prompt 9: React useCallback and Dependency Arrays

**Prompt:**
> When should I use useCallback? What happens if I include a function in a useEffect dependency array?

**Why I used it:**
My useEffect was running infinitely because I included a function in the dependency array, and I didn't understand why.

**What I learned:**
Functions are recreated on every render, so including them in dependency arrays causes infinite loops. Wrap functions in `useCallback` to memoize them, or remove them from dependencies if they don't use props/state. For my debounce effect, I removed the `loadMovies` function from dependencies and called the API directly instead.

---

## Prompt 10: Environment Variables in Vite

**Prompt:**
> How do I properly use environment variables in Vite? Why must they start with VITE_ prefix?

**Why I used it:**
My API keys weren't loading from the .env file and I was getting undefined errors.

**What I learned:**
Vite only exposes environment variables that start with `VITE_` to prevent accidentally leaking server-side secrets to the client. Access them using `import.meta.env.VITE_VARIABLE_NAME` (not `process.env`). The .env file must be in the project root, and you need to restart the dev server after changing it.

---

## Summary

These prompts helped me understand core concepts like:
- Debouncing and performance optimization
- React hooks (useEffect, useCallback, useState)
- API integration and error handling
- LocalStorage and data persistence
- CSS animations and transitions
- Async/await patterns

I used AI as a learning tool to understand **why** things work, not just to copy-paste code. Each prompt led to me implementing the feature myself with proper understanding of the underlying concepts.
