import { doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, collection, getDocs, query, where, writeBatch } from 'firebase/firestore';
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

// ==================== WORKOUT MANAGEMENT FUNCTIONS ====================

/**
 * Save a workout template to user's routines
 * @param {string} userId - The user's unique ID
 * @param {Object} workoutTemplate - The workout template to save
 * @returns {Promise<string>} - Returns the routine ID
 */
export const saveWorkoutToUser = async (userId, workoutTemplate) => {
  try {
    console.log(`Saving workout to user ${userId}:`, workoutTemplate.name);

    const routinesRef = collection(db, 'users', userId, 'routines');
    const routineData = {
      ...workoutTemplate,
      isCustom: workoutTemplate.isCustom || false,
      isActive: false,
      startedAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Use addDoc to automatically generate an ID and return the document reference
    const docRef = await addDoc(routinesRef, routineData);
    console.log('Workout saved successfully with ID:', docRef.id);

    return docRef.id;
  } catch (error) {
    console.error('Error saving workout to user:', error);
    throw error;
  }
};

/**
 * Get all workouts for a user
 * @param {string} userId - The user's unique ID
 * @returns {Promise<Array>}
 */
export const getUserWorkouts = async (userId) => {
  try {
    console.log(`Fetching workouts for user ${userId}`);

    const routinesRef = collection(db, 'users', userId, 'routines');
    const snapshot = await getDocs(routinesRef);

    const routines = [];
    snapshot.forEach((doc) => {
      routines.push({ id: doc.id, ...doc.data() });
    });

    console.log(`Found ${routines.length} workouts`);
    return routines;
  } catch (error) {
    console.error('Error fetching user workouts:', error);
    return [];
  }
};

/**
 * Get a specific workout by ID
 * @param {string} userId - The user's unique ID
 * @param {string} routineId - The routine ID
 * @returns {Promise<Object|null>}
 */
export const getUserWorkout = async (userId, routineId) => {
  try {
    const routineRef = doc(db, 'users', userId, 'routines', routineId);
    const routineSnap = await getDoc(routineRef);

    if (routineSnap.exists()) {
      return { id: routineSnap.id, ...routineSnap.data() };
    }

    return null;
  } catch (error) {
    console.error('Error fetching workout:', error);
    return null;
  }
};

/**
 * Update a user's workout
 * @param {string} userId - The user's unique ID
 * @param {string} routineId - The routine ID
 * @param {Object} updates - Data to update
 * @returns {Promise<void>}
 */
export const updateUserWorkout = async (userId, routineId, updates) => {
  try {
    console.log(`Updating workout ${routineId} for user ${userId}`);

    const routineRef = doc(db, 'users', userId, 'routines', routineId);
    await updateDoc(routineRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    console.log('Workout updated successfully');
  } catch (error) {
    console.error('Error updating workout:', error);
    throw error;
  }
};

/**
 * Delete a user's workout
 * @param {string} userId - The user's unique ID
 * @param {string} routineId - The routine ID
 * @returns {Promise<void>}
 */
export const deleteUserWorkout = async (userId, routineId) => {
  try {
    console.log(`Deleting workout ${routineId} for user ${userId}`);

    const routineRef = doc(db, 'users', userId, 'routines', routineId);
    await deleteDoc(routineRef);

    console.log('Workout deleted successfully');
  } catch (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
};

/**
 * Set a workout as active (deactivates other workouts)
 * @param {string} userId - The user's unique ID
 * @param {string} routineId - The routine ID to activate
 * @returns {Promise<void>}
 */
export const setActiveWorkout = async (userId, routineId) => {
  try {
    console.log(`Setting active workout ${routineId} for user ${userId}`);

    const routinesRef = collection(db, 'users', userId, 'routines');
    const snapshot = await getDocs(routinesRef);

    const batch = writeBatch(db);

    // Deactivate all workouts
    snapshot.forEach((docSnap) => {
      batch.update(docSnap.ref, { isActive: false });
    });

    // Activate the selected workout
    const activeRoutineRef = doc(db, 'users', userId, 'routines', routineId);
    batch.update(activeRoutineRef, {
      isActive: true,
      startedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await batch.commit();
    console.log('Active workout set successfully');
  } catch (error) {
    console.error('Error setting active workout:', error);
    throw error;
  }
};

/**
 * Get the active workout for a user
 * @param {string} userId - The user's unique ID
 * @returns {Promise<Object|null>}
 */
export const getActiveWorkout = async (userId) => {
  try {
    const routinesRef = collection(db, 'users', userId, 'routines');
    const q = query(routinesRef, where('isActive', '==', true));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const activeDoc = snapshot.docs[0];
    return { id: activeDoc.id, ...activeDoc.data() };
  } catch (error) {
    console.error('Error fetching active workout:', error);
    return null;
  }
};
