import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ClipboardList, Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import { PRIORITIES } from '../utils/storage';

/**
 * Column — one of the three Kanban columns.
 * Accepts tasks filtered to this column and exposes add/delete/move/edit callbacks.
 */
export default function Column({ id, label, color, tasks, onAdd, onDelete, onMove, onEdit }) {
  const [inputText, setInputText]   = useState('');
  const [priority, setPriority]     = useState('medium');

  // Make this column a drop target
  const { setNodeRef, isOver } = useDroppable({ id });

  function handleAdd(e) {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onAdd(trimmed, priority, id);
    setInputText('');
    setPriority('medium');
  }

  const taskIds = tasks.map(t => t.id);

  return (
    <div className={`column ${isOver ? 'drag-over' : ''}`}>
      {/* Column header */}
      <div className="column-header">
        <div className="column-title-group">
          <span className="column-dot" style={{ background: color }} />
          <span className="column-title">{label}</span>
        </div>
        <span className="column-badge">{tasks.length}</span>
      </div>

      {/* Cards */}
      <div
        ref={setNodeRef}
        className={`cards-container ${tasks.length === 0 ? 'empty-drop-zone' : ''}`}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">
                <ClipboardList size={28} strokeWidth={1.5} />
              </span>
              <span>Drop tasks here</span>
            </div>
          ) : (
            tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDelete}
                onMove={onMove}
                onEdit={onEdit}
              />
            ))
          )}
        </SortableContext>
      </div>

      {/* Add task form */}
      <form className="add-task-form" onSubmit={handleAdd}>
        <div className="add-task-row">
          <input
            className="add-task-input"
            type="text"
            placeholder="Add a task…"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            aria-label={`Add task to ${label}`}
          />
          <select
            className="priority-select"
            value={priority}
            onChange={e => setPriority(e.target.value)}
            aria-label="Task priority"
          >
            {PRIORITIES.map(p => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button className="add-btn" type="submit" disabled={!inputText.trim()}>
          <Plus size={15} strokeWidth={2.5} />
          Add Task
        </button>
      </form>
    </div>
  );
}
