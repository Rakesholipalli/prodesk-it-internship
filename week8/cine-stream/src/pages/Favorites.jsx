import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { getFavorites } from '../utils/localStorage';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = () => {
    const favs = getFavorites();
    setFavorites(favs);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleFavoriteChange = () => {
    loadFavorites();
  };

  return (
    <div className="movies-container">
      <h1 className="page-title">My Favorites</h1>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <h2>No favorites yet</h2>
          <p>Start adding movies to your favorites by clicking the heart icon</p>
        </div>
      ) : (
        <div className="movies-grid">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onFavoriteChange={handleFavoriteChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
