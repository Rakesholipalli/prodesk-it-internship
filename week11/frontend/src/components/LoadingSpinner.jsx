import { Loader2 } from 'lucide-react';

function LoadingSpinner() {
  return (
    <div className="loading">
      <Loader2 className="spinner" size={50} />
      <p>Loading posts...</p>
    </div>
  );
}

export default LoadingSpinner;
