import axios from 'axios';

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const RAPIDAPI_HOST = import.meta.env.VITE_RAPIDAPI_HOST || 'exercisedb.p.rapidapi.com';
const BASE_URL = 'https://exercisedb.p.rapidapi.com';

// In-memory cache to avoid hitting API rate limits
let exerciseCache = {
  all: null,
  timestamp: null,
};

const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

// API client configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-RapidAPI-Key': RAPIDAPI_KEY,
    'X-RapidAPI-Host': RAPIDAPI_HOST,
  },
  timeout: 10000,
});

/**
 * Check if cache is valid
 */
const isCacheValid = () => {
  if (!exerciseCache.all || !exerciseCache.timestamp) return false;
  return Date.now() - exerciseCache.timestamp < CACHE_DURATION;
};

/**
 * Fetch all exercises (with limit to avoid rate limits)
 * @param {number} limit - Maximum number of exercises to fetch
 * @returns {Promise<Array>}
 */
export const fetchAllExercises = async (limit = 200) => {
  try {
    // Check cache first
    if (isCacheValid()) {
      console.log('Returning exercises from cache');
      return exerciseCache.all.slice(0, limit);
    }

    console.log('Fetching exercises from ExerciseDB API...');
    const response = await apiClient.get('/exercises', {
      params: { limit },
    });

    // Update cache
    exerciseCache.all = response.data;
    exerciseCache.timestamp = Date.now();

    console.log(`Fetched ${response.data.length} exercises from API`);
    return response.data;
  } catch (error) {
    console.error('Error fetching exercises:', error.response?.data || error.message);

    // Return cached data if available, even if stale
    if (exerciseCache.all) {
      console.log('Returning stale cache due to API error');
      return exerciseCache.all.slice(0, limit);
    }

    throw new Error('Failed to fetch exercises. Please try again later.');
  }
};

/**
 * Fetch exercises by body part
 * @param {string} bodyPart - Body part to filter by
 * @returns {Promise<Array>}
 */
export const fetchExercisesByBodyPart = async (bodyPart) => {
  try {
    console.log(`Fetching exercises for body part: ${bodyPart}`);
    const response = await apiClient.get(`/exercises/bodyPart/${bodyPart}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching exercises by body part:', error.response?.data || error.message);
    throw new Error(`Failed to fetch exercises for ${bodyPart}`);
  }
};

/**
 * Fetch exercises by equipment
 * @param {string} equipment - Equipment to filter by
 * @returns {Promise<Array>}
 */
export const fetchExercisesByEquipment = async (equipment) => {
  try {
    console.log(`Fetching exercises for equipment: ${equipment}`);
    const response = await apiClient.get(`/exercises/equipment/${equipment}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching exercises by equipment:', error.response?.data || error.message);
    throw new Error(`Failed to fetch exercises for ${equipment}`);
  }
};

/**
 * Fetch single exercise by ID
 * @param {string} id - Exercise ID
 * @returns {Promise<Object>}
 */
export const fetchExerciseById = async (id) => {
  try {
    console.log(`Fetching exercise with ID: ${id}`);
    const response = await apiClient.get(`/exercises/exercise/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching exercise by ID:', error.response?.data || error.message);
    throw new Error('Failed to fetch exercise details');
  }
};

/**
 * Search exercises by name
 * @param {string} query - Search query
 * @param {Array} exercises - Optional array of exercises to search in (uses cache if not provided)
 * @returns {Promise<Array>}
 */
export const searchExercises = async (query, exercises = null) => {
  try {
    if (!query || query.trim().length < 2) {
      return exercises || exerciseCache.all || [];
    }

    const searchTerm = query.toLowerCase().trim();

    // If exercises array is provided, search in it
    if (exercises) {
      return exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchTerm)
      );
    }

    // Otherwise, fetch all exercises first if not cached
    if (!exerciseCache.all) {
      await fetchAllExercises();
    }

    // Search in cached exercises
    return exerciseCache.all.filter((exercise) =>
      exercise.name.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error('Error searching exercises:', error);
    return [];
  }
};

/**
 * Get available body parts
 * @returns {Array<string>}
 */
export const getBodyParts = () => {
  return [
    'back',
    'cardio',
    'chest',
    'lower arms',
    'lower legs',
    'neck',
    'shoulders',
    'upper arms',
    'upper legs',
    'waist',
  ];
};

/**
 * Get available equipment types
 * @returns {Array<string>}
 */
export const getEquipmentTypes = () => {
  return [
    'assisted',
    'band',
    'barbell',
    'body weight',
    'bosu ball',
    'cable',
    'dumbbell',
    'elliptical machine',
    'ez barbell',
    'hammer',
    'kettlebell',
    'leverage machine',
    'medicine ball',
    'olympic barbell',
    'resistance band',
    'roller',
    'rope',
    'skierg machine',
    'sled machine',
    'smith machine',
    'stability ball',
    'stationary bike',
    'stepmill machine',
    'tire',
    'trap bar',
    'upper body ergometer',
    'weighted',
    'wheel roller',
  ];
};

/**
 * Clear exercise cache (useful for testing or forcing refresh)
 */
export const clearCache = () => {
  exerciseCache = {
    all: null,
    timestamp: null,
  };
  console.log('Exercise cache cleared');
};
