import { GoogleGenerativeAI } from '@google/generative-ai';

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

export const MODEL_INFO = {
  [GEMINI_MODELS.FLASH_2_5]: {
    name: 'Gemini 2.5 Flash',
    speed: 'Very Fast',
    quality: 'High',
    cost: 'Low',
    description: 'Latest stable Flash model - RECOMMENDED'
  },
  [GEMINI_MODELS.FLASH_2_5_LITE]: {
    name: 'Gemini 2.5 Flash Lite',
    speed: 'Fastest',
    quality: 'Good',
    cost: 'Lowest',
    description: 'Ultra-fast lightweight model'
  },
  [GEMINI_MODELS.FLASH_LATEST]: {
    name: 'Gemini Flash Latest',
    speed: 'Very Fast',
    quality: 'High',
    cost: 'Low',
    description: 'Auto-updated to latest Flash version'
  },
  [GEMINI_MODELS.PRO_LATEST]: {
    name: 'Gemini Pro Latest',
    speed: 'Moderate',
    quality: 'Highest',
    cost: 'Higher',
    description: 'Auto-updated to latest Pro version'
  },
  [GEMINI_MODELS.FLASH_3_5]: {
    name: 'Gemini 3.5 Flash',
    speed: 'Very Fast',
    quality: 'Highest',
    cost: 'Low',
    description: 'Next-gen Flash model'
  },
  [GEMINI_MODELS.PRO_3_1]: {
    name: 'Gemini 3.1 Pro Preview',
    speed: 'Moderate',
    quality: 'Highest',
    cost: 'Higher',
    description: 'Most advanced model (preview)'
  }
};

export const getMoodBasedMovieRecommendation = async (
  moodPrompt, 
  modelName = GEMINI_MODELS.FLASH_2_5
) => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file');
    }

    // Validate model name
    if (!Object.values(GEMINI_MODELS).includes(modelName)) {
      console.warn(`Invalid model: ${modelName}. Using default: ${GEMINI_MODELS.FLASH_2_5}`);
      modelName = GEMINI_MODELS.FLASH_2_5;
    }

    console.log(`Using Gemini model: ${modelName}`);

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });

    // Engineered prompt to ensure single movie title response
    const prompt = `Suggest ONE movie based on this mood: ${moodPrompt}. Return ONLY the movie title as a plaintext string. Do not include any explanation, quotes, or additional text. Just the movie title.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const movieTitle = response.text().trim();

    // Sanitize the response - remove quotes, extra whitespace, and newlines
    const sanitizedTitle = movieTitle
      .replace(/^["']|["']$/g, '') // Remove leading/trailing quotes
      .replace(/\n/g, '') // Remove newlines
      .trim();

    return sanitizedTitle;
  } catch (error) {
    console.error('Error getting AI movie recommendation:', error);
    throw error;
  }
};

/*
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development
});

export const getMoodBasedMovieRecommendation = async (moodPrompt) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a movie recommendation assistant. When given a mood or context, respond with ONLY a single movie title. No explanations, no quotes, just the title."
        },
        {
          role: "user",
          content: `Suggest ONE movie based on this mood: ${moodPrompt}`
        }
      ],
      temperature: 0.7,
      max_tokens: 50
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error getting AI movie recommendation:', error);
    throw error;
  }
};
*/
