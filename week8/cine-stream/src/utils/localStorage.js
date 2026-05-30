const FAVORITES_KEY = 'cinestream_favorites';

export const getFavorites = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
};

export const saveFavorites = (favorites) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

export const addFavorite = (movie) => {
  const favorites = getFavorites();
  if (!favorites.find(fav => fav.id === movie.id)) {
    const updatedFavorites = [...favorites, movie];
    saveFavorites(updatedFavorites);
    return updatedFavorites;
  }
  return favorites;
};

export const removeFavorite = (movieId) => {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(fav => fav.id !== movieId);
  saveFavorites(updatedFavorites);
  return updatedFavorites;
};

export const isFavorite = (movieId) => {
  const favorites = getFavorites();
  return favorites.some(fav => fav.id === movieId);
};
