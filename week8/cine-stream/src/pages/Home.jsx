import { useState, useEffect, useCallback } from 'react';
import MovieCard from '../components/MovieCard';
import { fetchPopularMovies, searchMovies } from '../services/api';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadMovies = useCallback(async (pageNum, isSearch = false, query = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const data = isSearch 
        ? await searchMovies(query, pageNum)
        : await fetchPopularMovies(pageNum);
      
      if (pageNum === 1) {
        setMovies(data.results);
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }
      
      setHasMore(pageNum < data.total_pages);
    } catch (err) {
      setError('Failed to load movies. Please check your API key and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setMovies([]);
      setHasMore(true);
      
      if (searchQuery.trim()) {
        console.log('🔍 Debounced search triggered for:', searchQuery);
        searchMovies(searchQuery, 1).then(data => {
          setMovies(data.results);
          setHasMore(1 < data.total_pages);
          setLoading(false);
        }).catch(err => {
          setError('Failed to load movies. Please check your API key and try again.');
          console.error(err);
          setLoading(false);
        });
      } else {
        console.log('📺 Loading popular movies');
        fetchPopularMovies(1).then(data => {
          setMovies(data.results);
          setHasMore(1 < data.total_pages);
          setLoading(false);
        }).catch(err => {
          setError('Failed to load movies. Please check your API key and try again.');
          console.error(err);
          setLoading(false);
        });
      }
    }, 500);

    return () => {
      console.log('⏱️ Clearing debounce timer');
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      
      if (searchQuery.trim()) {
        loadMovies(nextPage, true, searchQuery);
      } else {
        loadMovies(nextPage, false);
      }
    }
  }, [page, loading, hasMore, searchQuery, loadMovies]);

  const lastMovieRef = useInfiniteScroll(loadMore, hasMore, loading);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for movies..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="movies-container">
        <h1 className="page-title">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Popular Movies'}
        </h1>

        {error && <div className="error">{error}</div>}

        <div className="movies-grid">
          {movies.map((movie, index) => {
            if (movies.length === index + 1) {
              return (
                <div key={movie.id} ref={lastMovieRef}>
                  <MovieCard movie={movie} />
                </div>
              );
            } else {
              return <MovieCard key={movie.id} movie={movie} />;
            }
          })}
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}

        {!loading && movies.length === 0 && !error && (
          <div className="empty-state">
            <h2>No movies found</h2>
            <p>Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
