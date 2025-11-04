import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

const MetricsContext = createContext();

export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error('useMetrics must be used within a MetricsProvider');
  }
  return context;
};

export const MetricsProvider = ({ children }) => {
  const { user } = useAuth();

  // Real-time data from Firestore
  const [metrics, setMetrics] = useState({
    steps: null,
    stepsGoal: 10000,
    calories: null,
    caloriesGoal: 500,
    water: null,
    waterGoal: 8,
    sleep: null,
    sleepGoal: 8,
    weight: null,
    workouts: null,
    workoutsGoal: 5,
    activeMinutes: null
  });

  const [stats, setStats] = useState({
    thisWeek: {
      workouts: null,
      totalTime: null,
      calories: null,
      weight: null
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Helper function to check if it's a new week (Monday)
  const getWeekIdentifier = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday
    const monday = new Date(now.setDate(diff));
    return monday.toISOString().split('T')[0]; // Return Monday's date as week identifier
  };

  // Check and reset weekly metrics if it's a new week
  const checkAndResetWeeklyMetrics = async (userId) => {
    try {
      const currentWeek = getWeekIdentifier();
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const lastWeekReset = userData.lastWeekReset;

        // If it's a new week, reset weekly metrics
        if (!lastWeekReset || lastWeekReset !== currentWeek) {
          console.log('New week detected! Resetting weekly metrics...');

          const today = new Date().toISOString().split('T')[0];
          const userActivityRef = doc(db, 'users', userId, 'activity', today);

          // Reset weekly metrics to null
          await setDoc(userActivityRef, {
            weeklyWorkouts: null,
            weeklyTotalTime: null,
            weeklyCaloriesBurned: null,
            lastWeekReset: currentWeek,
            updatedAt: serverTimestamp(),
          }, { merge: true });

          // Update user document with last reset week
          await setDoc(userRef, {
            lastWeekReset: currentWeek,
          }, { merge: true });

          console.log('Weekly metrics reset successfully!');
        }
      }
    } catch (error) {
      console.error('Error checking/resetting weekly metrics:', error);
    }
  };

  // Fetch real-time activity data from Firestore
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const loadActivityData = async () => {
      try {
        // Check and reset weekly metrics on component mount
        await checkAndResetWeeklyMetrics(user.uid);

        const today = new Date().toISOString().split('T')[0];
        const userActivityRef = doc(db, 'users', user.uid, 'activity', today);

        // First, try to get today's data
        const todaySnapshot = await getDoc(userActivityRef);

        if (todaySnapshot.exists()) {
          // Today's data exists - use real-time listener
          console.log('✅ Found activity data for today');
          setupRealtimeListener(userActivityRef);
        } else {
          // No data for today - try to find most recent data
          console.log('⚠️ No activity data for today, looking for recent data...');
          await loadMostRecentData();
        }
      } catch (error) {
        console.error('Error loading activity data:', error);
        setIsLoading(false);
      }
    };

    const setupRealtimeListener = (docRef) => {
      const unsubscribe = onSnapshot(
        docRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            updateMetricsFromData(data);
            console.log('📊 Real-time data updated');
          }
          setIsLoading(false);
        },
        (error) => {
          console.error('Error in real-time listener:', error);
          setIsLoading(false);
        }
      );

      return unsubscribe;
    };

    const loadMostRecentData = async () => {
      try {
        // Try to load data from the last 7 days
        const promises = [];
        for (let i = 1; i <= 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          promises.push(getDoc(doc(db, 'users', user.uid, 'activity', dateStr)));
        }

        const snapshots = await Promise.all(promises);

        // Find the most recent data
        for (const snapshot of snapshots) {
          if (snapshot.exists()) {
            const data = snapshot.data();
            updateMetricsFromData(data);
            console.log(`✅ Loaded data from ${data.date}`);
            setIsLoading(false);
            return;
          }
        }

        // No data found in last 7 days
        console.log('⚠️ No activity data found in the last 7 days');
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading recent data:', error);
        setIsLoading(false);
      }
    };

    const updateMetricsFromData = (data) => {
      // Update metrics with data
      setMetrics(prev => ({
        ...prev,
        steps: data.steps ?? null,
        calories: data.calories ?? null,
        water: data.water ?? null,
        sleep: data.sleep ?? null,
        weight: data.weight ?? null,
        activeMinutes: data.activeMinutes ?? null,
        workouts: data.weeklyWorkouts ?? null,
        // Update goals if they exist in the data
        stepsGoal: data.stepsGoal ?? prev.stepsGoal,
        caloriesGoal: data.caloriesGoal ?? prev.caloriesGoal,
        waterGoal: data.waterGoal ?? prev.waterGoal,
        sleepGoal: data.sleepGoal ?? prev.sleepGoal,
        workoutsGoal: data.weeklyWorkoutsGoal ?? prev.workoutsGoal,
      }));

      // Update weekly stats
      setStats({
        thisWeek: {
          workouts: data.weeklyWorkouts ?? null,
          totalTime: data.weeklyTotalTime ?? null,
          calories: data.weeklyCaloriesBurned ?? null,
          weight: data.weight ?? null
        }
      });

      setLastUpdated(data.updatedAt?.toDate() || new Date(data.date));
    };

    loadActivityData();

    // Note: We're not setting up a persistent listener for historical data
    // Only for today's data if it exists
  }, [user]);

  // Save activity data to Firestore
  const saveActivity = async (activityType, value) => {
    if (!user) return { success: false, error: 'No user authenticated' };

    try {
      const today = new Date().toISOString().split('T')[0];
      const userActivityRef = doc(db, 'users', user.uid, 'activity', today);

      // Get updated values
      const updatedMetrics = { ...metrics };

      // Update the specific field
      if (activityType === 'steps' && value) updatedMetrics.steps = parseInt(value);
      if (activityType === 'calories' && value) updatedMetrics.calories = parseInt(value);
      if (activityType === 'water' && value) updatedMetrics.water = parseInt(value);
      if (activityType === 'sleep' && value) updatedMetrics.sleep = parseFloat(value);

      // Prepare comprehensive activity data for progress tracking
      const dataToSave = {
        // Metadata
        date: today,
        userId: user.uid,
        updatedAt: serverTimestamp(),
        lastUpdatedField: activityType,

        // Daily Activity Metrics (save all values every time for complete tracking)
        steps: updatedMetrics.steps,
        stepsGoal: metrics.stepsGoal,

        calories: updatedMetrics.calories,
        caloriesGoal: metrics.caloriesGoal,

        water: updatedMetrics.water,
        waterGoal: metrics.waterGoal,

        sleep: updatedMetrics.sleep,
        sleepGoal: metrics.sleepGoal,

        // User Profile Data
        weight: metrics.weight ?? 70, // Default weight if not set
        activeMinutes: metrics.activeMinutes ?? 0,

        // Weekly Summary Data (for progress charts)
        weeklyWorkouts: stats.thisWeek.workouts ?? 0,
        weeklyWorkoutsGoal: metrics.workoutsGoal,
        weeklyTotalTime: stats.thisWeek.totalTime ?? '0h 0m',
        weeklyCaloriesBurned: stats.thisWeek.calories ?? 0,

        // Progress Percentages (useful for charts)
        stepsProgress: calculatePercentage(updatedMetrics.steps, metrics.stepsGoal),
        caloriesProgress: calculatePercentage(updatedMetrics.calories, metrics.caloriesGoal),
        waterProgress: calculatePercentage(updatedMetrics.water, metrics.waterGoal),
        sleepProgress: calculatePercentage(updatedMetrics.sleep, metrics.sleepGoal),
      };

      // Save to Firestore (merge: true allows updating without overwriting other fields)
      await setDoc(userActivityRef, dataToSave, { merge: true });

      return { success: true };
    } catch (error) {
      console.error('Error saving activity:', error);
      return { success: false, error: error.message };
    }
  };

  // Helper function to calculate percentage
  const calculatePercentage = (current, goal) => {
    if (current === null || current === undefined || goal === null || goal === undefined || goal === 0) {
      return 0;
    }
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  // Update goals
  const updateGoals = async (goalUpdates) => {
    if (!user) return { success: false, error: 'No user authenticated' };

    try {
      const today = new Date().toISOString().split('T')[0];
      const userActivityRef = doc(db, 'users', user.uid, 'activity', today);

      const updates = {
        ...goalUpdates,
        updatedAt: serverTimestamp()
      };

      await setDoc(userActivityRef, updates, { merge: true });

      // Update local state
      setMetrics(prev => ({
        ...prev,
        ...goalUpdates
      }));

      return { success: true };
    } catch (error) {
      console.error('Error updating goals:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    metrics,
    stats,
    isLoading,
    lastUpdated,
    saveActivity,
    updateGoals,
    calculatePercentage
  };

  return (
    <MetricsContext.Provider value={value}>
      {children}
    </MetricsContext.Provider>
  );
};
