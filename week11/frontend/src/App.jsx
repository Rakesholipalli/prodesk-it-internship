import { useState, useEffect } from 'react';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import EmptyState from './components/EmptyState';
import CreateButton from './components/CreateButton';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/posts`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setPosts(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch posts');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    setShowForm(false);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <Header />

        <main className="app-main">
          <div className="container">
            {showForm && (
              <PostForm
                onPostCreated={handlePostCreated}
                onCancel={() => setShowForm(false)}
              />
            )}

            {loading && <LoadingSpinner />}

            {error && <ErrorMessage message={error} onRetry={fetchPosts} />}

            {!loading && !error && posts.length > 0 && !showForm && (
              <CreateButton onClick={() => setShowForm(true)} />
            )}

            {!loading && !error && (
              <PostList posts={posts} onPostDeleted={handlePostDeleted} />
            )}

            {!loading && !error && posts.length === 0 && !showForm && (
              <EmptyState onCreatePost={() => setShowForm(true)} />
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
