import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Create a user document in Firestore
 * @param {string} userId - The user's unique ID
 * @param {Object} userData - User data to store
 * @returns {Promise<void>}
 */
export const createUserDocument = async (userId, userData) => {
  try {
    console.log('Creating user document for:', userId);

    const userRef = doc(db, 'users', userId);
    const userDoc = {
      uid: userId,
      email: userData.email,
      displayName: userData.displayName || '',
      photoURL: userData.photoURL || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...userData
    };

    await setDoc(userRef, userDoc);
    console.log('User document created successfully');
    return userDoc;
  } catch (error) {
    console.error('Error creating user document:', error.code, error.message);
    throw error;
  }
};

/**
 * Get a user document from Firestore
 * @param {string} userId - The user's unique ID
 * @returns {Promise<Object|null>}
 */
export const getUserDocument = async (userId) => {
  try {
    console.log('Fetching user document for:', userId);

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log('User document found');
      return userSnap.data();
    } else {
      console.log('No user document found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user document:', error.code, error.message);
    throw error;
  }
};

/**
 * Update a user document in Firestore
 * @param {string} userId - The user's unique ID
 * @param {Object} data - Data to update
 * @returns {Promise<void>}
 */
export const updateUserDocument = async (userId, data) => {
  try {
    console.log('Updating user document for:', userId);

    const userRef = doc(db, 'users', userId);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };

    await updateDoc(userRef, updateData);
    console.log('User document updated successfully');
  } catch (error) {
    console.error('Error updating user document:', error.code, error.message);
    throw error;
  }
};

/**
 * Save onboarding data for a user
 * @param {string} userId - The user's unique ID
 * @param {Object} onboardingData - Onboarding preferences data
 * @returns {Promise<void>}
 */
export const saveOnboardingData = async (userId, onboardingData) => {
  try {
    console.log('Saving onboarding data for:', userId);

    const userRef = doc(db, 'users', userId);
    const preferences = {
      goals: onboardingData.goals || [],
      experienceLevel: onboardingData.experienceLevel || '',
      equipment: onboardingData.equipment || [],
      workoutFrequency: onboardingData.workoutFrequency || '',
      onboardingCompleted: true,
      onboardingCompletedAt: serverTimestamp(),
    };

    // Update user document with preferences and initialize stats
    await updateDoc(userRef, {
      preferences,
      stats: {
        totalWorkouts: 0,
        currentStreak: 0,
        lastWorkoutDate: null,
      },
      updatedAt: serverTimestamp(),
    });

    console.log('Onboarding data saved successfully');
  } catch (error) {
    console.error('Error saving onboarding data:', error.code, error.message);
    throw error;
  }
};

/**
 * Check if user has completed onboarding
 * @param {string} userId - The user's unique ID
 * @returns {Promise<boolean>}
 */
export const hasCompletedOnboarding = async (userId) => {
  try {
    const userDoc = await getUserDocument(userId);
    return userDoc?.preferences?.onboardingCompleted === true;
  } catch (error) {
    console.error('Error checking onboarding status:', error.code, error.message);
    return false;
  }
};

/**
 * Get user preferences from Firestore
 * @param {string} userId - The user's unique ID
 * @returns {Promise<Object|null>}
 */
export const getUserPreferences = async (userId) => {
  try {
    const userDoc = await getUserDocument(userId);
    return userDoc?.preferences || null;
  } catch (error) {
    console.error('Error getting user preferences:', error.code, error.message);
    return null;
  }
};

// ==================== EXERCISE CACHING FUNCTIONS ====================

/**
 * Cache exercises to Firestore
 * @param {Array} exercises - Array of exercise objects from ExerciseDB API
 * @returns {Promise<void>}
 */
export const cacheExercisesToFirestore = async (exercises) => {
  try {
    console.log(`Caching ${exercises.length} exercises to Firestore...`);

    const batch = writeBatch(db);
    const exercisesRef = collection(db, 'exercises');

    // Use batch writes for better performance
    exercises.forEach((exercise) => {
      const exerciseDocRef = doc(exercisesRef, exercise.id);
      batch.set(exerciseDocRef, {
        ...exercise,
        cachedAt: serverTimestamp(),
      });
    });

    await batch.commit();

    // Update cache metadata
    const metaRef = doc(db, 'metadata', 'exerciseCache');
    await setDoc(metaRef, {
      totalExercises: exercises.length,
      lastUpdated: serverTimestamp(),
    });

    console.log('Exercises cached successfully to Firestore');
  } catch (error) {
    console.error('Error caching exercises to Firestore:', error);
    throw error;
  }
};

/**
 * Get all cached exercises from Firestore
 * @returns {Promise<Array>}
 */
export const getCachedExercises = async () => {
  try {
    console.log('Fetching cached exercises from Firestore...');

    const exercisesRef = collection(db, 'exercises');
    const snapshot = await getDocs(exercisesRef);

    const exercises = [];
    snapshot.forEach((doc) => {
      exercises.push({ id: doc.id, ...doc.data() });
    });

    console.log(`Fetched ${exercises.length} cached exercises from Firestore`);
    return exercises;
  } catch (error) {
    console.error('Error fetching cached exercises:', error);
    return [];
  }
};

/**
 * Get exercises filtered by body part
 * @param {string} bodyPart - Body part to filter by
 * @returns {Promise<Array>}
 */
export const getExercisesByBodyPart = async (bodyPart) => {
  try {
    console.log(`Fetching exercises for body part: ${bodyPart}`);

    const exercisesRef = collection(db, 'exercises');
    const q = query(exercisesRef, where('bodyPart', '==', bodyPart));
    const snapshot = await getDocs(q);

    const exercises = [];
    snapshot.forEach((doc) => {
      exercises.push({ id: doc.id, ...doc.data() });
    });

    console.log(`Found ${exercises.length} exercises for ${bodyPart}`);
    return exercises;
  } catch (error) {
    console.error('Error fetching exercises by body part:', error);
    return [];
  }
};

/**
 * Get exercises filtered by equipment
 * @param {string} equipment - Equipment type to filter by
 * @returns {Promise<Array>}
 */
export const getExercisesByEquipment = async (equipment) => {
  try {
    console.log(`Fetching exercises for equipment: ${equipment}`);

    const exercisesRef = collection(db, 'exercises');
    const q = query(exercisesRef, where('equipment', '==', equipment));
    const snapshot = await getDocs(q);

    const exercises = [];
    snapshot.forEach((doc) => {
      exercises.push({ id: doc.id, ...doc.data() });
    });

    console.log(`Found ${exercises.length} exercises for ${equipment}`);
    return exercises;
  } catch (error) {
    console.error('Error fetching exercises by equipment:', error);
    return [];
  }
};

/**
 * Search cached exercises by name
 * @param {string} searchQuery - Search query string
 * @returns {Promise<Array>}
 */
export const searchCachedExercises = async (searchQuery) => {
  try {
    if (!searchQuery || searchQuery.trim().length < 2) {
      return await getCachedExercises();
    }

    console.log(`Searching cached exercises for: ${searchQuery}`);

    // Firestore doesn't support full-text search, so we'll fetch all and filter
    const allExercises = await getCachedExercises();
    const searchTerm = searchQuery.toLowerCase().trim();

    const filteredExercises = allExercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(searchTerm)
    );

    console.log(`Found ${filteredExercises.length} exercises matching "${searchQuery}"`);
    return filteredExercises;
  } catch (error) {
    console.error('Error searching cached exercises:', error);
    return [];
  }
};

/**
 * Update exercise cache from ExerciseDB API
 * @returns {Promise<void>}
 */
export const updateExerciseCache = async () => {
  try {
    console.log('Updating exercise cache...');

    // Import fetchAllExercises dynamically to avoid circular dependency
    const { fetchAllExercises } = await import('./exerciseDB.js');

    const exercises = await fetchAllExercises();
    await cacheExercisesToFirestore(exercises);

    console.log('Exercise cache updated successfully');
  } catch (error) {
    console.error('Error updating exercise cache:', error);
    throw error;
  }
};

/**
 * Check if exercise cache exists and is recent
 * @returns {Promise<Object>} - Returns { exists: boolean, lastUpdated: Date|null, totalExercises: number }
 */
export const getExerciseCacheMetadata = async () => {
  try {
    const metaRef = doc(db, 'metadata', 'exerciseCache');
    const metaSnap = await getDoc(metaRef);

    if (metaSnap.exists()) {
      const data = metaSnap.data();
      return {
        exists: true,
        lastUpdated: data.lastUpdated?.toDate() || null,
        totalExercises: data.totalExercises || 0,
      };
    }

    return {
      exists: false,
      lastUpdated: null,
      totalExercises: 0,
    };
  } catch (error) {
    console.error('Error getting exercise cache metadata:', error);
    return {
      exists: false,
      lastUpdated: null,
      totalExercises: 0,
    };
  }
};
