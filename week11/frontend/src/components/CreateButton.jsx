import { Plus } from 'lucide-react';

function CreateButton({ onClick }) {
  return (
    <div className="actions">
      <button className="btn btn-primary" onClick={onClick}>
        <Plus size={16} /> Create New Post
      </button>
    </div>
  );
}

export default CreateButton;
