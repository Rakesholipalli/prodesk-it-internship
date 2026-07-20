import { useState } from 'react';
import { Check, X, Clock, Pencil } from 'lucide-react';
import './PostForm.css';

function PostForm({ onPostCreated, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('author', formData.author);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        onPostCreated(data.data);
        setFormData({ title: '', content: '', author: '' });
        setImageFile(null);
        setImagePreview(null);
      } else {
        throw new Error(data.message || 'Failed to create post');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-form-container">
      <form onSubmit={handleSubmit} className="post-form">
        <h2><Pencil size={20} style={{display: 'inline', marginRight: '8px'}} /> Create New Post</h2>

        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title"
            required
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your post content here..."
            required
            rows={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author *</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image (Optional)</label>
          <div className="image-upload">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
            />
            
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  className="btn-remove-image"
                  onClick={removeImage}
                  disabled={loading}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
          <small className="form-hint">Max size: 5MB | Formats: JPG, PNG, GIF</small>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            <X size={16} /> Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <Clock size={16} /> Creating...
              </>
            ) : (
              <>
                <Check size={16} /> Create Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostForm;
