import MovieCard from './MovieCard';
import './MovieGrid.css';

const MovieGrid = ({ movies, onFavoriteToggle }) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="movie-grid-empty">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
          <polyline points="17 2 12 7 7 2" />
        </svg>
        <p>No movies found</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
};

export default MovieGrid;
