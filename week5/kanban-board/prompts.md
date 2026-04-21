# AI Prompts Used

### Prompt 1:
What is the difference between `localStorage.getItem` and `JSON.parse` — do I need both?

### Why I used it:
I was saving tasks to localStorage but when I reloaded the page, I got a string instead of an array and my `.map()` was breaking.

### What I learned:
`localStorage` only stores strings. `JSON.stringify` converts the array before saving, and `JSON.parse` converts it back on load. Without `JSON.parse`, you get a raw string and array methods won't work.

---

### Prompt 2:
How does `useState` with a function initializer work — what is the difference between `useState(loadTasks())` and `useState(loadTasks)`?

### Why I used it:
I was calling `loadTasks()` directly inside `useState` and wasn't sure if that was correct or if it would run on every render.

### What I learned:
Passing a function reference like `useState(loadTasks)` is called lazy initialization — React only calls it once on mount. Calling it directly like `useState(loadTasks())` runs it on every render, which is wasteful for something like reading from localStorage.

---

### Prompt 3:
How do I make a component draggable using dnd-kit — what is the minimum setup needed?

### Why I used it:
I had never used dnd-kit before and the docs had a lot of options. I just needed to understand the core hooks to get started without overcomplicating it.

### What I learned:
You need `DndContext` at the top level, `useDraggable` or `useSortable` on the item, and `useDroppable` on the container. The `transform` from the hook goes into the element's `style` using `CSS.Transform.toString()`.

---

### Prompt 4:
What is `DragOverlay` in dnd-kit and why do I need it?

### Why I used it:
When dragging a card, it was disappearing from its original position and looked broken. I saw `DragOverlay` mentioned but didn't understand what it was for.

### What I learned:
`DragOverlay` renders a separate floating copy of the card while dragging, independent of the original DOM position. Without it, the dragged element jumps around awkwardly. It makes the drag feel smooth and polished.

---

### Prompt 5:
What is the difference between `onDragOver` and `onDragEnd` in dnd-kit?

### Why I used it:
I wasn't sure where to put the logic for moving a card to a different column — I tried `onDragEnd` first but the card wasn't updating visually while dragging.

### What I learned:
`onDragOver` fires continuously as you drag over a target — good for live column switching. `onDragEnd` fires once when you release — good for final reordering. I needed both: `onDragOver` to move between columns and `onDragEnd` to reorder within the same column.

---

### Prompt 6:
How does `useMemo` work and when should I use it instead of just filtering inside the render?

### Why I used it:
I was filtering tasks by search query directly in the JSX and wanted to know if that was fine or if I needed `useMemo`.

### What I learned:
For small arrays it doesn't matter much, but `useMemo` caches the result and only recalculates when its dependencies change. It's a good habit for derived data like filtered lists so it doesn't recompute on every unrelated re-render.

---

### Prompt 7:
How do I auto-focus a textarea when a component switches into edit mode?

### Why I used it:
I added inline editing to the task card — clicking the text shows a textarea — but the cursor wasn't landing in it automatically, which felt unpolished.

### What I learned:
You can't call `.focus()` immediately on render because the element isn't in the DOM yet at that point. The fix is a `useEffect` that watches the `editing` state and calls `inputRef.current.focus()` inside it, which runs after the DOM updates.

---

### Prompt 8:
How do I prevent the drag from triggering when I click a button inside a draggable card?

### Why I used it:
Clicking the delete button or the move buttons on a card was also starting a drag, which felt wrong and made the buttons hard to use.

### What I learned:
dnd-kit's `PointerSensor` has an `activationConstraint` option. Setting `distance: 5` means the drag only starts after the pointer moves 5px, so a regular click on a button completes without triggering drag. This is the standard pattern for interactive elements inside draggable items.

---

### Prompt 9:
How do I handle the Enter and Escape keys in a textarea for saving and cancelling an edit?

### Why I used it:
My inline edit textarea had no keyboard support — pressing Enter just added a newline and there was no way to cancel without clicking away.

### What I learned:
In the `onKeyDown` handler, check `e.key === 'Enter'` with `!e.shiftKey` to save (and call `e.preventDefault()` to stop the newline), and `e.key === 'Escape'` to cancel and restore the original text. Shift+Enter still inserts a newline as expected.

---

### Prompt 10:
How do I disable a button in React when an input is empty?

### Why I used it:
The Add Task button was clickable even with nothing typed, which could cause empty cards to be added. I wanted to disable it until there's actual input.

### What I learned:
Just add `disabled={!inputText.trim()}` to the button. React handles the rest — the button becomes unclickable and I styled the disabled state in CSS with `cursor: not-allowed` and a muted background so it's visually clear to the user.
