import { useState } from 'react';
import { Heart, Star, Film } from 'lucide-react';
import { getMoviePosterUrl } from '../services/api';
import { addFavorite, removeFavorite, isFavorite } from '../utils/localStorage';

const MovieCard = ({ movie, onFavoriteChange }) => {
  const [isFav, setIsFav] = useState(isFavorite(movie.id));
  const posterUrl = getMoviePosterUrl(movie.poster_path);
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (isFav) {
      removeFavorite(movie.id);
      setIsFav(false);
    } else {
      addFavorite(movie);
      setIsFav(true);
    }
    if (onFavoriteChange) {
      onFavoriteChange();
    }
  };

  return (
    <div className="movie-card">
      <div className="movie-poster-container">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="movie-poster"
            loading="lazy"
          />
        ) : (
          <div className="movie-poster placeholder">
            <Film size={48} />
          </div>
        )}
        <button
          className="favorite-button"
          onClick={handleFavoriteClick}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            size={20}
            className={`heart-icon ${isFav ? 'favorited' : ''}`}
            fill={isFav ? 'currentColor' : 'none'}
          />
        </button>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-details">
          <span className="movie-year">{year}</span>
          <span className="movie-rating">
            <Star size={14} fill="currentColor" /> {rating}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
