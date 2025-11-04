import { fetchAllExercises, getBodyParts } from '../services/exerciseDB.js';
import { cacheExercisesToFirestore, getExerciseCacheMetadata } from '../services/firestore.js';

/**
 * Seed exercises from ExerciseDB API to Firestore
 * This function should be run once during initial setup or when you want to refresh the exercise database
 *
 * @param {number} limit - Number of exercises to fetch (default: 200)
 * @param {boolean} forceUpdate - Force update even if cache exists (default: false)
 * @returns {Promise<Object>} - Returns status and count of exercises seeded
 */
export const seedExercises = async (limit = 200, forceUpdate = false) => {
  try {
    console.log('========================================');
    console.log('Starting exercise seeding process...');
    console.log('========================================');

    // Check if exercises are already cached
    const cacheMetadata = await getExerciseCacheMetadata();

    if (cacheMetadata.exists && !forceUpdate) {
      console.log('Exercise cache already exists:');
      console.log(`- Total exercises: ${cacheMetadata.totalExercises}`);
      console.log(`- Last updated: ${cacheMetadata.lastUpdated?.toLocaleString()}`);
      console.log('\nTo force update, call seedExercises(limit, true)');

      return {
        success: true,
        message: 'Exercise cache already exists',
        totalExercises: cacheMetadata.totalExercises,
        lastUpdated: cacheMetadata.lastUpdated,
        alreadyExists: true,
      };
    }

    // Fetch exercises from ExerciseDB API
    console.log(`\nFetching ${limit} exercises from ExerciseDB API...`);
    const exercises = await fetchAllExercises(limit);

    if (!exercises || exercises.length === 0) {
      throw new Error('No exercises fetched from API');
    }

    console.log(`Successfully fetched ${exercises.length} exercises`);

    // Log exercise distribution by body part
    const bodyParts = getBodyParts();
    const distribution = {};

    bodyParts.forEach(part => {
      const count = exercises.filter(ex => ex.bodyPart === part).length;
      if (count > 0) {
        distribution[part] = count;
      }
    });

    console.log('\nExercise distribution by body part:');
    Object.entries(distribution)
      .sort((a, b) => b[1] - a[1])
      .forEach(([part, count]) => {
        console.log(`  ${part}: ${count} exercises`);
      });

    // Cache exercises to Firestore
    console.log('\nCaching exercises to Firestore...');
    await cacheExercisesToFirestore(exercises);

    console.log('\n========================================');
    console.log('Exercise seeding completed successfully!');
    console.log(`Total exercises cached: ${exercises.length}`);
    console.log('========================================');

    return {
      success: true,
      message: 'Exercises seeded successfully',
      totalExercises: exercises.length,
      distribution,
      lastUpdated: new Date(),
    };

  } catch (error) {
    console.error('\n========================================');
    console.error('ERROR: Exercise seeding failed');
    console.error('========================================');
    console.error('Error details:', error.message);

    // Provide helpful error messages
    if (error.message.includes('API key')) {
      console.error('\nPlease ensure you have:');
      console.error('1. Set up your RapidAPI account');
      console.error('2. Subscribed to the ExerciseDB API');
      console.error('3. Added VITE_RAPIDAPI_KEY to your .env file');
    }

    throw error;
  }
};

/**
 * Seed a balanced set of exercises covering all body parts
 * This ensures we have good coverage across all muscle groups
 *
 * @returns {Promise<Object>} - Returns status and count of exercises seeded
 */
export const seedBalancedExercises = async () => {
  try {
    console.log('Seeding balanced exercise set...');

    // Fetch more exercises to ensure good coverage (300-400 should cover all body parts well)
    const result = await seedExercises(300, true);

    return result;
  } catch (error) {
    console.error('Error seeding balanced exercises:', error);
    throw error;
  }
};

/**
 * Utility function to check exercise cache status
 * Useful for debugging or displaying in admin panel
 *
 * @returns {Promise<void>}
 */
export const checkExerciseCache = async () => {
  try {
    const metadata = await getExerciseCacheMetadata();

    console.log('\n========================================');
    console.log('Exercise Cache Status');
    console.log('========================================');

    if (metadata.exists) {
      console.log('Status: Cached');
      console.log(`Total exercises: ${metadata.totalExercises}`);
      console.log(`Last updated: ${metadata.lastUpdated?.toLocaleString()}`);

      const daysSinceUpdate = metadata.lastUpdated
        ? Math.floor((Date.now() - metadata.lastUpdated.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      if (daysSinceUpdate !== null) {
        console.log(`Days since last update: ${daysSinceUpdate}`);

        if (daysSinceUpdate > 30) {
          console.log('\nRecommendation: Consider updating the cache (it\'s over 30 days old)');
        }
      }
    } else {
      console.log('Status: Not cached');
      console.log('\nRun seedExercises() to populate the cache');
    }

    console.log('========================================\n');

    return metadata;
  } catch (error) {
    console.error('Error checking exercise cache:', error);
    throw error;
  }
};

// Export default for easy importing
export default {
  seedExercises,
  seedBalancedExercises,
  checkExerciseCache,
};
