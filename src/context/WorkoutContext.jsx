import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getUserWorkouts,
  getUserWorkout,
  saveWorkoutToUser,
  updateUserWorkout,
  deleteUserWorkout,
  setActiveWorkout as setActiveWorkoutFirestore,
  getActiveWorkout,
} from '../services/firestore';

const WorkoutContext = createContext();

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

export const WorkoutProvider = ({ children }) => {
  const { user } = useAuth();

  const [workouts, setWorkouts] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Load user's workouts from Firestore
   */
  const loadWorkouts = useCallback(async () => {
    if (!user?.uid) {
      setWorkouts([]);
      setActiveWorkout(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [userWorkouts, activeWorkoutData] = await Promise.all([
        getUserWorkouts(user.uid),
        getActiveWorkout(user.uid),
      ]);

      setWorkouts(userWorkouts);
      setActiveWorkout(activeWorkoutData);
    } catch (err) {
      console.error('Error loading workouts:', err);
      setError('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  /**
   * Save a workout template to user's routines
   */
  const saveWorkout = useCallback(async (workoutTemplate) => {
    if (!user?.uid) {
      throw new Error('User must be logged in to save workout');
    }

    try {
      setError(null);
      const routineId = await saveWorkoutToUser(user.uid, workoutTemplate);
      await loadWorkouts(); // Refresh the list
      return routineId;
    } catch (err) {
      console.error('Error saving workout:', err);
      setError('Failed to save workout');
      throw err;
    }
  }, [user?.uid, loadWorkouts]);

  /**
   * Update a workout
   */
  const updateWorkout = useCallback(async (routineId, updates) => {
    if (!user?.uid) {
      throw new Error('User must be logged in to update workout');
    }

    try {
      setError(null);
      await updateUserWorkout(user.uid, routineId, updates);
      await loadWorkouts(); // Refresh the list
    } catch (err) {
      console.error('Error updating workout:', err);
      setError('Failed to update workout');
      throw err;
    }
  }, [user?.uid, loadWorkouts]);

  /**
   * Delete a workout
   */
  const deleteWorkout = useCallback(async (routineId) => {
    if (!user?.uid) {
      throw new Error('User must be logged in to delete workout');
    }

    try {
      setError(null);
      await deleteUserWorkout(user.uid, routineId);
      await loadWorkouts(); // Refresh the list
    } catch (err) {
      console.error('Error deleting workout:', err);
      setError('Failed to delete workout');
      throw err;
    }
  }, [user?.uid, loadWorkouts]);

  /**
   * Set a workout as active
   */
  const activateWorkout = useCallback(async (routineId) => {
    if (!user?.uid) {
      throw new Error('User must be logged in to activate workout');
    }

    try {
      setError(null);
      await setActiveWorkoutFirestore(user.uid, routineId);
      await loadWorkouts(); // Refresh to get updated active status
    } catch (err) {
      console.error('Error activating workout:', err);
      setError('Failed to activate workout');
      throw err;
    }
  }, [user?.uid, loadWorkouts]);

  /**
   * Get a specific workout by ID
   */
  const getWorkoutById = useCallback(async (routineId) => {
    if (!user?.uid) {
      return null;
    }

    try {
      return await getUserWorkout(user.uid, routineId);
    } catch (err) {
      console.error('Error fetching workout:', err);
      return null;
    }
  }, [user?.uid]);

  /**
   * Refresh workouts from Firestore
   */
  const refreshWorkouts = useCallback(async () => {
    await loadWorkouts();
  }, [loadWorkouts]);

  // Load workouts when user changes
  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  const value = {
    // State
    workouts,
    activeWorkout,
    loading,
    error,

    // Actions
    saveWorkout,
    updateWorkout,
    deleteWorkout,
    activateWorkout,
    getWorkoutById,
    refreshWorkouts,

    // Computed
    hasWorkouts: workouts.length > 0,
    hasActiveWorkout: !!activeWorkout,
    customWorkouts: workouts.filter(w => w.isCustom),
    savedTemplates: workouts.filter(w => !w.isCustom),
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

export default WorkoutContext;
