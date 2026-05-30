import { GoogleGenerativeAI } from "@google/generative-ai";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const GEMINI_MODELS = {
  FLASH_2_5: 'gemini-2.5-flash',
  FLASH_2_5_LITE: 'gemini-2.5-flash-lite',
  FLASH_2_0: 'gemini-2.0-flash',
  FLASH_2_0_LITE: 'gemini-2.0-flash-lite',
  FLASH_LATEST: 'gemini-flash-latest',
  FLASH_LITE_LATEST: 'gemini-flash-lite-latest',
  PRO_LATEST: 'gemini-pro-latest',
  FLASH_3_5: 'gemini-3.5-flash',
  PRO_3_1: 'gemini-3.1-pro-preview',
  FLASH_3_1_LITE: 'gemini-3.1-flash-lite',
  FLASH_3: 'gemini-3-flash-preview',
  PRO_3: 'gemini-3-pro-preview'
};

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
    );
    if (!response.ok) throw new Error('Failed to fetch popular movies');
    return await response.json();
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    if (!response.ok) throw new Error('Failed to search movies');
    return await response.json();
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMoviePosterUrl = (posterPath, size = 'w500') => {
  if (!posterPath) return null;
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
};

export const getMoodBasedMovie = async (moodPrompt, modelName = GEMINI_MODELS.FLASH_2_5) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  try {
    if (!Object.values(GEMINI_MODELS).includes(modelName)) {
      console.warn(`Invalid model: ${modelName}. Using default: ${GEMINI_MODELS.FLASH_2_5}`);
      modelName = GEMINI_MODELS.FLASH_2_5;
    }

    console.log('Calling Gemini API with mood:', moodPrompt);
    console.log('Using model:', modelName);
    
    const model = genAI.getGenerativeModel({
      model: modelName,
    });

    const prompt = `Suggest ONE movie title based on this mood: "${moodPrompt}". Return ONLY the movie title.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const movieTitle = response.text().trim().replace(/['"]/g, '');
    
    console.log('AI suggested movie:', movieTitle);
    
    const searchResults = await searchMovies(movieTitle);
    
    if (searchResults.results && searchResults.results.length > 0) {
      return {
        movie: searchResults.results[0],
        aiResponse: movieTitle,
        modelUsed: modelName
      };
    } else {
      throw new Error(`Movie "${movieTitle}" not found in TMDB`);
    }
  } catch (error) {
    console.error('Gemini API error:', error.message);
    console.log('Using fallback recommendations');
    const fallbackMovies = getMoodBasedFallback(moodPrompt);
    
    if (fallbackMovies.length > 0) {
      const randomMovie = fallbackMovies[Math.floor(Math.random() * fallbackMovies.length)];
      const searchResults = await searchMovies(randomMovie);
      
      if (searchResults.results && searchResults.results.length > 0) {
        return {
          movie: searchResults.results[0],
          aiResponse: randomMovie,
          isFallback: true,
          modelUsed: 'fallback'
        };
      }
    }
    
    throw error;
  }
};

const getMoodBasedFallback = (mood) => {
  const lowerMood = mood.toLowerCase();
  
  if ((lowerMood.includes('sad') || lowerMood.includes('emotional') || lowerMood.includes('tragic')) && 
      (lowerMood.includes('action') || lowerMood.includes('fight'))) {
    return ['Logan', 'John Wick', 'The Dark Knight', 'Gladiator', 'Man on Fire', 'Warrior'];
  }
  
  if (lowerMood.includes('happy') || lowerMood.includes('funny') || lowerMood.includes('comedy') || 
      lowerMood.includes('laugh') || lowerMood.includes('cheerful')) {
    return ['The Grand Budapest Hotel', 'Superbad', 'The Hangover', 'Bridesmaids', 'Ferris Bueller\'s Day Off', 'Crazy Stupid Love'];
  }
  
  if (lowerMood.includes('scary') || lowerMood.includes('horror') || lowerMood.includes('terrifying') || 
      lowerMood.includes('creepy') || lowerMood.includes('spooky')) {
    return ['The Conjuring', 'Get Out', 'A Quiet Place', 'Hereditary', 'The Shining', 'It'];
  }
  
  if (lowerMood.includes('romantic') || lowerMood.includes('love') || lowerMood.includes('romance') || 
      lowerMood.includes('date')) {
    return ['The Notebook', 'La La Land', 'Pride and Prejudice', 'Eternal Sunshine of the Spotless Mind', 'Before Sunrise', 'Crazy Rich Asians'];
  }
  
  if (lowerMood.includes('thriller') || lowerMood.includes('suspense') || lowerMood.includes('mystery') || 
      lowerMood.includes('tense')) {
    return ['Gone Girl', 'Shutter Island', 'Prisoners', 'Se7en', 'The Silence of the Lambs', 'Zodiac'];
  }
  
  if (lowerMood.includes('action') || lowerMood.includes('adventure') || lowerMood.includes('exciting') || 
      lowerMood.includes('adrenaline')) {
    return ['Mad Max Fury Road', 'Inception', 'The Matrix', 'Mission Impossible', 'Die Hard', 'Top Gun Maverick'];
  }
  
  if (lowerMood.includes('sad') || lowerMood.includes('emotional') || lowerMood.includes('cry') || 
      lowerMood.includes('touching') || lowerMood.includes('heartbreaking')) {
    return ['The Shawshank Redemption', 'Schindler\'s List', 'Forrest Gump', 'The Green Mile', 'A Beautiful Mind', 'Life is Beautiful'];
  }
  
  if (lowerMood.includes('sci-fi') || lowerMood.includes('science fiction') || lowerMood.includes('mind') || 
      lowerMood.includes('futuristic') || lowerMood.includes('space')) {
    return ['Interstellar', 'Inception', 'The Matrix', 'Blade Runner 2049', 'Arrival', 'Ex Machina'];
  }
  
  if (lowerMood.includes('inspirational') || lowerMood.includes('motivational') || lowerMood.includes('uplifting') || 
      lowerMood.includes('inspiring')) {
    return ['The Pursuit of Happyness', 'Rocky', 'Remember the Titans', 'The Blind Side', 'Good Will Hunting', 'Dead Poets Society'];
  }
  
  if (lowerMood.includes('dark') || lowerMood.includes('intense') || lowerMood.includes('gritty') || 
      lowerMood.includes('disturbing')) {
    return ['The Dark Knight', 'Joker', 'No Country for Old Men', 'Prisoners', 'Nightcrawler', 'Whiplash'];
  }
  
  if (lowerMood.includes('family') || lowerMood.includes('kids') || lowerMood.includes('children') || 
      lowerMood.includes('wholesome')) {
    return ['Toy Story', 'The Lion King', 'Finding Nemo', 'Up', 'Coco', 'Inside Out'];
  }
  
  if (lowerMood.includes('animated') || lowerMood.includes('animation') || lowerMood.includes('cartoon')) {
    return ['Spider-Man Into the Spider-Verse', 'Your Name', 'Spirited Away', 'WALL-E', 'The Incredibles', 'How to Train Your Dragon'];
  }
  
  if (lowerMood.includes('fantasy') || lowerMood.includes('magic') || lowerMood.includes('magical') || 
      lowerMood.includes('wizard')) {
    return ['The Lord of the Rings', 'Harry Potter', 'Pan\'s Labyrinth', 'The Princess Bride', 'Stardust', 'Big Fish'];
  }
  
  if (lowerMood.includes('war') || lowerMood.includes('historical') || lowerMood.includes('history') || 
      lowerMood.includes('battle')) {
    return ['Saving Private Ryan', '1917', 'Dunkirk', 'Hacksaw Ridge', 'Braveheart', 'Apocalypse Now'];
  }
  
  if (lowerMood.includes('crime') || lowerMood.includes('gangster') || lowerMood.includes('mafia') || 
      lowerMood.includes('heist')) {
    return ['The Godfather', 'Goodfellas', 'The Departed', 'Heat', 'Ocean\'s Eleven', 'Casino'];
  }
  
  if (lowerMood.includes('chill') || lowerMood.includes('relax') || lowerMood.includes('calm') || 
      lowerMood.includes('peaceful')) {
    return ['Lost in Translation', 'Her', 'The Secret Life of Walter Mitty', 'Amélie', 'Midnight in Paris', 'Before Sunrise'];
  }
  
  return ['The Shawshank Redemption', 'The Godfather', 'Pulp Fiction', 'Inception', 'Interstellar', 'The Dark Knight'];
};
