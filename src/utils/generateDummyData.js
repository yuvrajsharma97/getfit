/**
 * Dummy Data Generator for GetFit App
 *
 * Generates realistic fitness tracking data for testing:
 * - Daily activity metrics (steps, calories, water, sleep)
 * - Workout sessions with exercises and sets
 * - Weight progression data
 * - Weekly and monthly aggregates
 */

import { collection, doc, setDoc, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

// Sample exercises with realistic data
const EXERCISES = {
  push: [
    { id: '0007', name: 'barbell bench press', muscleGroup: 'chest', equipment: 'barbell', baseWeight: 60 },
    { id: '1512', name: 'dumbbell shoulder press', muscleGroup: 'shoulders', equipment: 'dumbbell', baseWeight: 20 },
    { id: '0139', name: 'barbell incline bench press', muscleGroup: 'chest', equipment: 'barbell', baseWeight: 50 },
    { id: '1650', name: 'dumbbell triceps extension', muscleGroup: 'triceps', equipment: 'dumbbell', baseWeight: 12 },
    { id: '1277', name: 'dumbbell lateral raise', muscleGroup: 'shoulders', equipment: 'dumbbell', baseWeight: 10 },
  ],
  pull: [
    { id: '0033', name: 'barbell bent over row', muscleGroup: 'back', equipment: 'barbell', baseWeight: 50 },
    { id: '0027', name: 'assisted pull-up', muscleGroup: 'back', equipment: 'assisted', baseWeight: 40 },
    { id: '1294', name: 'dumbbell one arm row', muscleGroup: 'back', equipment: 'dumbbell', baseWeight: 22 },
    { id: '0172', name: 'barbell curl', muscleGroup: 'biceps', equipment: 'barbell', baseWeight: 25 },
    { id: '1280', name: 'dumbbell hammer curl', muscleGroup: 'biceps', equipment: 'dumbbell', baseWeight: 12 },
  ],
  legs: [
    { id: '0043', name: 'barbell squat', muscleGroup: 'legs', equipment: 'barbell', baseWeight: 70 },
    { id: '0230', name: 'barbell romanian deadlift', muscleGroup: 'hamstrings', equipment: 'barbell', baseWeight: 60 },
    { id: '1427', name: 'dumbbell lunge', muscleGroup: 'legs', equipment: 'dumbbell', baseWeight: 15 },
    { id: '1368', name: 'leg press', muscleGroup: 'legs', equipment: 'machine', baseWeight: 100 },
    { id: '0156', name: 'calf raise', muscleGroup: 'calves', equipment: 'bodyweight', baseWeight: 0 },
  ],
  fullBody: [
    { id: '0043', name: 'barbell squat', muscleGroup: 'legs', equipment: 'barbell', baseWeight: 70 },
    { id: '0007', name: 'barbell bench press', muscleGroup: 'chest', equipment: 'barbell', baseWeight: 60 },
    { id: '0033', name: 'barbell bent over row', muscleGroup: 'back', equipment: 'barbell', baseWeight: 50 },
    { id: '1512', name: 'dumbbell shoulder press', muscleGroup: 'shoulders', equipment: 'dumbbell', baseWeight: 20 },
    { id: '0230', name: 'barbell romanian deadlift', muscleGroup: 'hamstrings', equipment: 'barbell', baseWeight: 60 },
  ]
};

const WORKOUT_TEMPLATES = [
  { name: 'Push Day', type: 'push', exercises: EXERCISES.push },
  { name: 'Pull Day', type: 'pull', exercises: EXERCISES.pull },
  { name: 'Leg Day', type: 'legs', exercises: EXERCISES.legs },
  { name: 'Full Body', type: 'fullBody', exercises: EXERCISES.fullBody },
];

/**
 * Generate random number within range
 */
const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate random float within range
 */
const randomFloat = (min, max, decimals = 1) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
};

/**
 * Get date N days ago
 */
const getDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
};

/**
 * Generate daily activity data for the last 30 days
 */
export const generateDailyActivities = async (userId, startWeight = 85) => {
  const activities = [];
  let currentWeight = startWeight;
  const weightGoal = startWeight - 5; // Goal: lose 5kg
  const dailyWeightChange = (startWeight - weightGoal) / 30; // Gradual weight loss

  for (let daysAgo = 29; daysAgo >= 0; daysAgo--) {
    const date = getDaysAgo(daysAgo);
    const dateString = date.toISOString().split('T')[0];

    // Simulate gradual weight loss with some fluctuation
    currentWeight -= dailyWeightChange;
    currentWeight += randomFloat(-0.3, 0.3, 1); // Daily fluctuation

    // Goals
    const stepsGoal = 10000;
    const caloriesGoal = 500;
    const waterGoal = 8;
    const sleepGoal = 8;

    // Generate realistic daily metrics with some variation
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const steps = randomInRange(
      isWeekend ? 5000 : 7000,
      isWeekend ? 12000 : 15000
    );

    const calories = randomInRange(300, 700);
    const water = randomInRange(5, 10);
    const sleep = randomFloat(6, 9, 1);

    // Determine week number
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Monday
    const weekIdentifier = weekStart.toISOString().split('T')[0];

    activities.push({
      date: dateString,
      userId,

      // Daily metrics
      steps,
      stepsGoal,
      stepsProgress: Math.min(Math.round((steps / stepsGoal) * 100), 100),

      calories,
      caloriesGoal,
      caloriesProgress: Math.min(Math.round((calories / caloriesGoal) * 100), 100),

      water,
      waterGoal,
      waterProgress: Math.min(Math.round((water / waterGoal) * 100), 100),

      sleep,
      sleepGoal,
      sleepProgress: Math.min(Math.round((sleep / sleepGoal) * 100), 100),

      weight: parseFloat(currentWeight.toFixed(1)),
      activeMinutes: randomInRange(30, 90),

      // Weekly metrics (will be updated when workouts are added)
      weeklyWorkouts: 0,
      weeklyWorkoutsGoal: 5,
      weeklyTotalTime: '0h 0m',
      weeklyCaloriesBurned: 0,

      lastWeekReset: weekIdentifier,
      updatedAt: Timestamp.fromDate(date),
    });
  }

  return activities;
};

/**
 * Generate workout session with exercises and sets
 */
const generateWorkoutSession = (userId, date, template, dayNumber, progressMultiplier = 1) => {
  const startTime = new Date(date);
  startTime.setHours(randomInRange(7, 18), randomInRange(0, 59), 0, 0);

  const duration = randomInRange(45, 75); // 45-75 minutes
  const endTime = new Date(startTime.getTime() + duration * 60000);

  const exercises = template.exercises.map((exercise, idx) => {
    const numSets = randomInRange(3, 4);
    const sets = [];

    // Progressive overload: weight increases slightly over time
    const weightProgression = exercise.baseWeight * progressMultiplier;
    const baseWeight = weightProgression + randomFloat(-2, 2);

    for (let i = 0; i < numSets; i++) {
      // Weight might decrease slightly in later sets (fatigue)
      const weight = parseFloat((baseWeight - (i * randomFloat(0, 2.5))).toFixed(1));
      const reps = randomInRange(8, 12);

      sets.push({
        setNumber: i + 1,
        reps,
        weight,
        completed: true,
        timestamp: new Date(startTime.getTime() + (idx * 8 + i * 2) * 60000), // Spread out over workout
      });
    }

    const totalVolume = sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);

    return {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      muscleGroup: exercise.muscleGroup,
      equipment: exercise.equipment,
      orderIndex: idx,
      plannedSets: numSets,
      plannedReps: '8-12',
      plannedRestTime: 90,
      sets,
      totalVolume,
      completed: true,
    };
  });

  const totalVolume = exercises.reduce((sum, ex) => sum + ex.totalVolume, 0);
  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const totalReps = exercises.reduce((sum, ex) =>
    sum + ex.sets.reduce((s, set) => s + set.reps, 0), 0
  );

  return {
    userId,
    routineId: 'push-pull-legs-intermediate',
    routineName: 'Push Pull Legs - Intermediate',
    workoutDayNumber: dayNumber,
    workoutDayName: template.name,
    startTime: Timestamp.fromDate(startTime),
    endTime: Timestamp.fromDate(endTime),
    duration,
    totalVolume: Math.round(totalVolume),
    totalSets,
    totalReps,
    completionStatus: 'completed',
    exercises,
    createdAt: Timestamp.fromDate(startTime),
  };
};

/**
 * Generate workout sessions for the last 30 days
 * Following a 4-day per week schedule (Push, Pull, Legs, Full Body)
 */
export const generateWorkoutSessions = async (userId) => {
  const sessions = [];
  const workoutDays = [1, 3, 5, 6]; // Monday, Wednesday, Friday, Saturday

  for (let weeksAgo = 4; weeksAgo >= 0; weeksAgo--) {
    // Progressive overload: slightly increase weights each week
    const progressMultiplier = 1 + (0.02 * (4 - weeksAgo)); // 2% increase per week

    workoutDays.forEach((dayOfWeek, idx) => {
      const date = getDaysAgo(weeksAgo * 7 + (7 - dayOfWeek));

      // Don't create workouts in the future
      if (date > new Date()) return;

      // Use different workout template based on day
      const templateIndex = idx % WORKOUT_TEMPLATES.length;
      const template = WORKOUT_TEMPLATES[templateIndex];

      const session = generateWorkoutSession(
        userId,
        date,
        template,
        templateIndex + 1,
        progressMultiplier
      );

      sessions.push(session);
    });
  }

  return sessions;
};

/**
 * Update daily activities with workout data
 */
const updateActivitiesWithWorkouts = (activities, sessions) => {
  // Group sessions by week
  const sessionsByWeek = new Map();

  sessions.forEach(session => {
    const sessionDate = session.startTime.toDate();
    const weekStart = new Date(sessionDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    const weekId = weekStart.toISOString().split('T')[0];

    if (!sessionsByWeek.has(weekId)) {
      sessionsByWeek.set(weekId, []);
    }
    sessionsByWeek.get(weekId).push(session);
  });

  // Update activities with weekly workout stats
  activities.forEach(activity => {
    const activityDate = new Date(activity.date);
    const weekStart = new Date(activityDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    const weekId = weekStart.toISOString().split('T')[0];

    const weekSessions = sessionsByWeek.get(weekId) || [];

    if (weekSessions.length > 0) {
      const totalTime = weekSessions.reduce((sum, s) => sum + s.duration, 0);
      const hours = Math.floor(totalTime / 60);
      const minutes = totalTime % 60;

      activity.weeklyWorkouts = weekSessions.length;
      activity.weeklyTotalTime = `${hours}h ${minutes}m`;
      activity.weeklyCaloriesBurned = weekSessions.reduce((sum, s) =>
        sum + Math.round(s.totalVolume * 0.5), 0
      ); // Rough calorie estimation
    }
  });

  return activities;
};

/**
 * Main function to generate and push all dummy data to Firebase
 */
export const generateAndPushDummyData = async (userId) => {
  console.log('🚀 Starting dummy data generation for user:', userId);

  // Validate user ID
  if (!userId) {
    throw new Error('User ID is required');
  }

  console.log('✅ User ID validated:', userId);

  try {
    // 1. Generate daily activities
    console.log('📊 Generating daily activities (30 days)...');
    const activities = await generateDailyActivities(userId, 85);

    // 2. Generate workout sessions
    console.log('💪 Generating workout sessions...');
    const sessions = await generateWorkoutSessions(userId);

    // 3. Update activities with workout data
    console.log('🔄 Updating activities with workout stats...');
    const updatedActivities = updateActivitiesWithWorkouts(activities, sessions);

    // 4. Push to Firebase
    console.log('☁️ Pushing data to Firebase...');

    // Push daily activities
    console.log(`  - Pushing ${updatedActivities.length} daily activities...`);
    let activityCount = 0;
    for (const activity of updatedActivities) {
      try {
        const activityRef = doc(db, 'users', userId, 'activity', activity.date);
        await setDoc(activityRef, activity);
        activityCount++;
        if (activityCount % 10 === 0) {
          console.log(`    ✓ ${activityCount}/${updatedActivities.length} activities saved`);
        }
      } catch (error) {
        console.error(`    ✗ Failed to save activity ${activity.date}:`, error.message);
        throw new Error(`Failed to save activity data: ${error.message}`);
      }
    }
    console.log(`  ✓ All ${activityCount} activities saved successfully`);

    // Push workout sessions
    console.log(`  - Pushing ${sessions.length} workout sessions...`);
    let sessionCount = 0;
    for (const session of sessions) {
      try {
        await addDoc(collection(db, 'users', userId, 'workoutSessions'), session);
        sessionCount++;
        if (sessionCount % 5 === 0) {
          console.log(`    ✓ ${sessionCount}/${sessions.length} sessions saved`);
        }
      } catch (error) {
        console.error(`    ✗ Failed to save workout session:`, error.message);
        throw new Error(`Failed to save workout session: ${error.message}`);
      }
    }
    console.log(`  ✓ All ${sessionCount} sessions saved successfully`);

    // Set active workout
    console.log('  - Setting active workout...');
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      activeWorkoutId: 'push-pull-legs-intermediate',
      lastWeekReset: updatedActivities[updatedActivities.length - 1].lastWeekReset,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    console.log('✅ Dummy data generation complete!');
    console.log('\n📈 Summary:');
    console.log(`   - Daily activities: ${updatedActivities.length} days`);
    console.log(`   - Workout sessions: ${sessions.length} workouts`);
    console.log(`   - Weight progress: 85kg → ${updatedActivities[updatedActivities.length - 1].weight}kg`);
    console.log(`   - Total volume lifted: ${sessions.reduce((sum, s) => sum + s.totalVolume, 0).toFixed(0)}kg`);
    console.log(`   - Total workout time: ${Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / 60)}h`);

    return {
      success: true,
      stats: {
        activities: updatedActivities.length,
        sessions: sessions.length,
        startWeight: 85,
        endWeight: updatedActivities[updatedActivities.length - 1].weight,
      }
    };

  } catch (error) {
    console.error('❌ Error generating dummy data:', error);

    // Provide more helpful error messages
    let errorMessage = error.message;

    if (error.code === 'permission-denied') {
      errorMessage = 'Permission denied. Please deploy Firestore security rules. See FIREBASE_SETUP.md for instructions.';
    } else if (error.message.includes('Missing or insufficient permissions')) {
      errorMessage = 'Missing permissions. Deploy Firestore rules from Firebase Console. See FIREBASE_SETUP.md.';
    }

    return {
      success: false,
      error: errorMessage,
      code: error.code,
    };
  }
};

/**
 * Clear all dummy data (useful for testing)
 */
export const clearDummyData = async (userId) => {
  console.log('🗑️ Clearing dummy data...');
  // Note: This would require implementing deleteDoc for all activities and sessions
  // Left as an exercise for production use
  console.log('⚠️ Clear function not implemented - manually delete from Firebase Console');
};

export default {
  generateAndPushDummyData,
  generateDailyActivities,
  generateWorkoutSessions,
  clearDummyData,
};
