import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { LayoutDashboard, Search, X } from 'lucide-react';

import Column from './components/Column';
import TaskCardOverlay from './components/TaskCardOverlay';
import { loadTasks, saveTasks, generateId, COLUMNS, COLUMN_META } from './utils/storage';
import './App.css';

export default function App() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [tasks, setTasks]           = useState(loadTasks);
  const [search, setSearch]         = useState('');
  const [activeTask, setActiveTask] = useState(null); // task being dragged

  // ── Persist to localStorage on every change ────────────────────────────────
  useEffect(() => { saveTasks(tasks); }, [tasks]);

  // ── DnD sensors ───────────────────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // ── Filtered tasks (search) ────────────────────────────────────────────────
  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter(t => t.text.toLowerCase().includes(q));
  }, [tasks, search]);

  // ── CRUD helpers ──────────────────────────────────────────────────────────
  const addTask = useCallback((text, priority, column) => {
    setTasks(prev => [
      ...prev,
      { id: generateId(), text, priority, column, createdAt: Date.now() },
    ]);
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const moveTask = useCallback((id, targetColumn) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, column: targetColumn } : t)
    );
  }, []);

  const editTask = useCallback((id, newText) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, text: newText } : t)
    );
  }, []);

  // ── Drag & Drop handlers ──────────────────────────────────────────────────
  function handleDragStart({ active }) {
    setActiveTask(tasks.find(t => t.id === active.id) ?? null);
  }

  function handleDragOver({ active, over }) {
    if (!over) return;

    const activeId  = active.id;
    const overId    = over.id;

    // Find source column
    const sourceTask = tasks.find(t => t.id === activeId);
    if (!sourceTask) return;

    // Determine target column: over could be a column droppable or another card
    const targetColumn = COLUMNS.includes(overId)
      ? overId
      : tasks.find(t => t.id === overId)?.column;

    if (!targetColumn || sourceTask.column === targetColumn) return;

    // Move card to new column (append at end)
    setTasks(prev => prev.map(t =>
      t.id === activeId ? { ...t, column: targetColumn } : t
    ));
  }

  function handleDragEnd({ active, over }) {
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id;
    const overId   = over.id;

    // If dropped on a card in the same column → reorder
    const activeTask = tasks.find(t => t.id === activeId);
    const overTask   = tasks.find(t => t.id === overId);

    if (activeTask && overTask && activeTask.column === overTask.column) {
      setTasks(prev => {
        const columnTasks = prev.filter(t => t.column === activeTask.column);
        const rest        = prev.filter(t => t.column !== activeTask.column);
        const oldIndex    = columnTasks.findIndex(t => t.id === activeId);
        const newIndex    = columnTasks.findIndex(t => t.id === overId);
        const reordered   = arrayMove(columnTasks, oldIndex, newIndex);
        return [...rest, ...reordered];
      });
    }
  }

  // ── Derived counts ────────────────────────────────────────────────────────
  const totalVisible = filteredTasks.length;

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-left">
          <div className="header-logo" aria-hidden="true">
            <LayoutDashboard size={20} color="#fff" strokeWidth={2} />
          </div>
          <h1>Kan<span>ban</span></h1>
        </div>

        {/* Search */}
        <div className="search-wrapper">
          <span className="search-icon" aria-hidden="true">
            <Search size={15} strokeWidth={2} />
          </span>
          <input
            className="search-input"
            type="search"
            placeholder="Filter tasks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Filter tasks by name"
          />
          {search && (
            <button
              className="search-clear"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>

        <span className="task-count">
          {totalVisible} task{totalVisible !== 1 ? 's' : ''}
          {search ? ' found' : ' total'}
        </span>
      </header>

      {/* ── Board ── */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <main className="board" role="main">
          {COLUMNS.map(colId => {
            const meta        = COLUMN_META[colId];
            const columnTasks = filteredTasks.filter(t => t.column === colId);

            return (
              <Column
                key={colId}
                id={colId}
                label={meta.label}
                color={meta.color}
                tasks={columnTasks}
                onAdd={addTask}
                onDelete={deleteTask}
                onMove={moveTask}
                onEdit={editTask}
              />
            );
          })}
        </main>

        {/* Drag overlay — renders the "floating" card while dragging */}
        <DragOverlay>
          {activeTask ? <TaskCardOverlay task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
