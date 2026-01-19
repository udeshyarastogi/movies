import React, { useState } from 'react';
import './App.css';

function App() {
  const [userInput, setUserInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) {
      setError('Please enter a genre or description');
      return;
    }

    setLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: userInput.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get recommendations');
      }

      setRecommendations(data.recommendations || []);
      setUserInput('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">🎬 Movie Recommendation App</h1>
        <p className="subtitle">Get personalized movie recommendations powered by AI</p>

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label htmlFor="userInput" className="label">
              What kind of movies are you in the mood for?
            </label>
            <input
              id="userInput"
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="e.g., action movies with a strong female lead"
              className="input"
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="button"
            disabled={loading}
          >
            {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
          </button>
        </form>

        {error && (
          <div className="error">
            <p>⚠️ {error}</p>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="recommendations">
            <h2 className="recommendations-title">Recommended Movies</h2>
            <div className="movies-grid">
              {recommendations.map((movie, index) => (
                <div key={index} className="movie-card">
                  <h3 className="movie-title">{movie.title || movie.name || 'Unknown Movie'}</h3>
                  {movie.year && (
                    <p className="movie-year">Year: {movie.year}</p>
                  )}
                  {movie.reason && (
                    <p className="movie-reason">{movie.reason}</p>
                  )}
                  {movie.description && (
                    <p className="movie-reason">{movie.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>AI is thinking...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
