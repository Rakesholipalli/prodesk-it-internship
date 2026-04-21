# Kanban Task Board

A Trello-like task management dashboard built with React.js.

---

## Features

- Add tasks to any column with a priority level
- Delete tasks with a single click
- Move tasks between columns using quick-action buttons
- Inline editing — click any task to edit it in place
- Priority system — High (red), Medium (yellow), Low (green)
- Drag and drop tasks across columns and reorder within columns
- Search bar to filter tasks by name in real time
- LocalStorage persistence — tasks survive page refresh
- Disabled add button when input is empty

---

## Tech Used

React, Vite, JavaScript, dnd-kit, lucide-react, CSS Variables

---

## How to Run

```bash
cd kanban-board
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## Project Structure

```
src/
├── components/
│   ├── Column.jsx          # Droppable column with add-task form
│   ├── TaskCard.jsx        # Sortable card with edit, move, delete
│   └── TaskCardOverlay.jsx # Ghost card shown while dragging
├── utils/
│   └── storage.js          # LocalStorage helpers and constants
├── App.jsx                 # Root component — state, DnD context, search
├── App.css                 # All styles
└── index.css               # Reset and CSS variables
```

---

## Live Demo

Live Demo: https://prodesk-it-internship-ipi2.vercel.app/
