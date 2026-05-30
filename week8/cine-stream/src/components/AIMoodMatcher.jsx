import { useState } from 'react';
import { getMoodBasedMovieRecommendation } from '../services/aiService';
import './AIMoodMatcher.css';

const AIMoodMatcher = ({ onMovieRecommendation }) => {
  const [moodInput, setMoodInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRecommendation, setLastRecommendation] = useState(null);
  const [submittedMood, setSubmittedMood] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!moodInput.trim()) {
      setError('Please describe your mood or what you want to watch');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLastRecommendation(null);

    try {
      const movieTitle = await getMoodBasedMovieRecommendation(moodInput);
      
      setLastRecommendation(movieTitle);
      setSubmittedMood(moodInput);
      
      onMovieRecommendation(movieTitle);
      
    } catch (err) {
      console.error('AI Mood Matcher Error:', err);
      setError(
        err.message || 'Failed to get recommendation. Please check your API key configuration.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMoodInput('');
    setError(null);
    setLastRecommendation(null);
    setSubmittedMood('');
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMoodInput(value);
    
    if (value !== submittedMood) {
      setLastRecommendation(null);
      setError(null);
    }
  };

  return (
    <div className="ai-mood-matcher">
      <div className="ai-mood-header">
        <div className="ai-mood-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
            <path d="M14 13h-4" />
            <path d="M9 16h6" />
          </svg>
        </div>
        <div>
          <h2 className="ai-mood-title">AI Mood Matcher</h2>
          <p className="ai-mood-subtitle">
            Describe your mood and let AI find the perfect movie
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="ai-mood-form">
        <div className="ai-mood-input-container">
          <textarea
            className="ai-mood-input"
            placeholder="e.g., I'm feeling sad but want an action movie, or I want something uplifting and funny..."
            value={moodInput}
            onChange={handleInputChange}
            rows="3"
            disabled={isLoading}
          />
        </div>

        <div className="ai-mood-actions">
          <button
            type="submit"
            className="ai-mood-submit-btn"
            disabled={isLoading || !moodInput.trim()}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Finding your movie...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Get Recommendation
              </>
            )}
          </button>

          {moodInput && !isLoading && (
            <button
              type="button"
              className="ai-mood-clear-btn"
              onClick={handleClear}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="ai-mood-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {lastRecommendation && !error && (
        <div className="ai-mood-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          AI recommended: <strong>{lastRecommendation}</strong>
        </div>
      )}
    </div>
  );
};

export default AIMoodMatcher;
