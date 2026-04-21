import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, ArrowRight, Check } from 'lucide-react';
import { COLUMNS, COLUMN_META } from '../utils/storage';

/**
 * TaskCard — a single draggable task card.
 * Supports inline editing, priority badge, move buttons, and delete.
 */
export default function TaskCard({ task, onDelete, onMove, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(task.text);
  const inputRef              = useRef(null);

  // dnd-kit sortable hook
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { column: task.column } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Focus the textarea when editing starts
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  function handleTextClick() {
    setDraft(task.text);
    setEditing(true);
  }

  function commitEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== task.text) {
      onEdit(task.id, trimmed);
    }
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit(); }
    if (e.key === 'Escape') { setEditing(false); setDraft(task.text); }
  }

  // Columns the card can move to (all except current)
  const moveTargets = COLUMNS.filter(c => c !== task.column);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card priority-${task.priority} ${isDragging ? 'dragging' : ''}`}
    >
      {/* Top row: drag handle + text/edit + delete */}
      <div className="card-top">
        {/* Drag handle — only this area triggers drag */}
        <span
          className="drag-handle"
          {...attributes}
          {...listeners}
          title="Drag to move"
          aria-label="Drag handle"
        >
          <GripVertical size={16} strokeWidth={2} />
        </span>

        {editing ? (
          <textarea
            ref={inputRef}
            className="card-edit-input"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            rows={2}
            aria-label="Edit task text"
          />
        ) : (
          <span
            className="card-text"
            onClick={handleTextClick}
            title="Click to edit"
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && handleTextClick()}
          >
            {task.text}
          </span>
        )}

        <button
          className="card-delete-btn"
          onClick={() => onDelete(task.id)}
          title="Delete task"
          aria-label="Delete task"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Bottom row: priority badge + move buttons */}
      <div className="card-meta">
        <span className={`priority-badge ${task.priority}`}>
          {task.priority}
        </span>

        <div className="move-buttons">
          {moveTargets.map(col => (
            <button
              key={col}
              className="move-btn"
              onClick={() => onMove(task.id, col)}
              title={`Move to ${COLUMN_META[col].label}`}
            >
              <ArrowRight size={11} strokeWidth={2.5} />
              {COLUMN_META[col].label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
