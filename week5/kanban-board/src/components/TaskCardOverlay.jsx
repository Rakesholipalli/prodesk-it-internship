import { GripVertical, X } from 'lucide-react';
import { COLUMN_META } from '../utils/storage';

export default function TaskCardOverlay({ task }) {
  if (!task) return null;

  return (
    <div className={`task-card priority-${task.priority} drag-overlay`}>
      <div className="card-top">
        <span className="drag-handle"><GripVertical size={16} strokeWidth={2} /></span>
        <span className="card-text">{task.text}</span>
        <button className="card-delete-btn" disabled><X size={14} strokeWidth={2.5} /></button>
      </div>
      <div className="card-meta">
        <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
        <div className="move-buttons" />
      </div>
    </div>
  );
}
