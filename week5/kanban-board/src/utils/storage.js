const STORAGE_KEY = 'kanban-tasks-v1';

export const COLUMNS = ['todo', 'inprogress', 'done'];

export const COLUMN_META = {
  todo:       { label: 'To Do',       color: '#6c63ff' },
  inprogress: { label: 'In Progress', color: '#f59e0b' },
  done:       { label: 'Done',        color: '#22c55e' },
};

export const PRIORITIES = ['high', 'medium', 'low'];

const DEFAULT_TASKS = [
  { id: 'demo-1', text: 'Design the wireframes',    column: 'todo',       priority: 'high',   createdAt: Date.now() - 3000 },
  { id: 'demo-2', text: 'Set up project structure', column: 'inprogress', priority: 'medium', createdAt: Date.now() - 2000 },
  { id: 'demo-3', text: 'Write unit tests',         column: 'done',       priority: 'low',    createdAt: Date.now() - 1000 },
];

export function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_TASKS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_TASKS;
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // storage full or unavailable — fail silently
  }
}

export function generateId() {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
