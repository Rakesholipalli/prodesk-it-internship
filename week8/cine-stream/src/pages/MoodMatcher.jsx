import { useState } from 'react';
import { Sparkles, AlertTriangle } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { getMoodBasedMovie } from '../services/api';

const MoodMatcher = () => {
  const [moodInput, setMoodInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [submittedMood, setSubmittedMood] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!moodInput.trim()) {
      setError('Please enter a mood or description');
      setResult(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const data = await getMoodBasedMovie(moodInput);
      setResult(data);
      setSubmittedMood(moodInput);
    } catch (err) {
      setError('Failed to get movie recommendation. Please check your Gemini API key and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMoodInput(value);
    
    if (value !== submittedMood) {
      setResult(null);
      setError(null);
    }
  };

  return (
    <div className="mood-matcher">
      <h2>AI Mood Matcher</h2>
      <p style={{ textAlign: 'center', color: 'var(--netflix-light-gray)', marginBottom: '2rem' }}>
        Tell me your mood and I'll recommend the perfect movie!
      </p>

      <form onSubmit={handleSubmit} className="mood-form">
        <input
          type="text"
          className="mood-input"
          placeholder="e.g., I want a sad action movie, or I'm feeling adventurous..."
          value={moodInput}
          onChange={handleInputChange}
          disabled={loading}
        />
        <button
          type="submit"
          className="mood-button"
          disabled={loading}
        >
          {loading ? 'Finding...' : 'Find Movie'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      )}

      {result && (
        <div className="mood-result">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            {result.isFallback ? (
              <>
                <AlertTriangle size={24} /> AI service temporarily unavailable
              </>
            ) : (
              <>
                <Sparkles size={24} /> AI Recommendation
              </>
            )}
          </h3>
          <p>Based on your mood: "{moodInput}"</p>
          {result.isFallback ? (
            <p style={{ color: 'var(--netflix-white)', marginBottom: '1.5rem' }}>
              Showing smart movie recommendation instead: <strong>{result.aiResponse}</strong>
            </p>
          ) : (
            <p style={{ color: 'var(--netflix-white)', marginBottom: '1.5rem' }}>
              AI suggested: <strong>{result.aiResponse}</strong>
            </p>
          )}
          <div style={{ maxWidth: '300px', margin: '0 auto' }}>
            <MovieCard movie={result.movie} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodMatcher;
