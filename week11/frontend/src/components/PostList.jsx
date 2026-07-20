import { useState } from 'react';
import { Trash2, Loader2, BookOpen, User, Calendar } from 'lucide-react';
import './PostList.css';

function PostList({ posts, onPostDeleted }) {
  const [deletingIds, setDeletingIds] = useState(new Set());

  const handleDelete = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setDeletingIds(prev => new Set([...prev, postId]));

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/posts/${postId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        onPostDeleted(postId);
      } else {
        throw new Error(data.message || 'Failed to delete post');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      alert(`Failed to delete post: ${err.message}`);
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="post-list">
      <h2><BookOpen size={20} style={{display: 'inline', marginRight: '8px'}} /> All Posts ({posts.length})</h2>
      
      <div className="posts-grid">
        {posts.map((post) => (
          <article key={post._id} className="post-card">
            {post.imageUrl && (
              <div className="post-image">
                <img src={post.imageUrl} alt={post.title} />
              </div>
            )}

            <div className="post-content">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-text">{post.content}</p>
              
              <div className="post-meta">
                <span className="post-author"><User size={14} /> {post.author}</span>
                <span className="post-date"><Calendar size={14} /> {formatDate(post.createdAt)}</span>
              </div>
            </div>

            <div className="post-actions">
              <button
                className="btn btn-danger btn-small"
                onClick={() => handleDelete(post._id)}
                disabled={deletingIds.has(post._id)}
              >
                {deletingIds.has(post._id) ? (
                  <>
                    <Loader2 size={14} className="spinner" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} /> Delete
                  </>
                )}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default PostList;
