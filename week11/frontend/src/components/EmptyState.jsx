import { FileText, Plus } from 'lucide-react';

function EmptyState({ onCreatePost }) {
  return (
    <div className="empty-state">
      <h2>
        <FileText size={32} style={{ display: 'inline', marginRight: '12px' }} />
        No Posts Yet
      </h2>
      <p>Create your first post to get started!</p>
      <button className="btn btn-primary" onClick={onCreatePost}>
        <Plus size={16} /> Create New Post
      </button>
    </div>
  );
}

export default EmptyState;
