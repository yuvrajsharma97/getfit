import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiX, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useMetrics } from '../context/MetricsContext';
import { useToast } from '../context/ToastContext';
import { collection, addDoc, doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import RestTimer from '../components/workout/RestTimer';

const WorkoutSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { metrics, stats } = useMetrics();
  const toast = useToast();

  // Get workout data from navigation state
  const { workout, dayNumber, dayName } = location.state || {};

  const [sessionStartTime] = useState(new Date());
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [savingSession, setSavingSession] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restDuration, setRestDuration] = useState(60);

  // Initialize session data with sets for each exercise
  const [sessionData, setSessionData] = useState(() => {
    if (!workout || !workout.exercises) return { exercises: [] };

    return {
      exercises: workout.exercises.map((ex, idx) => ({
        exerciseId: ex.exerciseId || `exercise-${idx}`,
        exerciseName: ex.exerciseName,
        muscleGroup: ex.muscleGroup || 'unknown',
        equipment: ex.equipment || 'bodyweight',
        orderIndex: idx,
        plannedSets: parseInt(ex.sets) || 3,
        plannedReps: ex.reps || '10',
        plannedRestTime: parseInt(ex.restTime) || 60,
        notes: ex.notes || '',
        sets: Array(parseInt(ex.sets) || 3).fill(null).map((_, i) => ({
          setNumber: i + 1,
          reps: null,
          weight: null,
          completed: false,
          timestamp: null
        })),
        completed: false
      }))
    };
  });

  // Redirect if no workout data
  useEffect(() => {
    if (!workout || !dayNumber) {
      navigate('/active-workout');
    }
  }, [workout, dayNumber, navigate]);

  if (!workout || !dayNumber) {
    return null;
  }

  const currentExercise = sessionData.exercises[currentExerciseIndex];
  const completedSets = currentExercise?.sets.filter(s => s.completed).length || 0;
  const totalSets = currentExercise?.sets.length || 0;

  // Update a specific set
  const updateSet = (exerciseIdx, setIdx, data) => {
    setSessionData(prev => {
      const updated = { ...prev };
      updated.exercises[exerciseIdx].sets[setIdx] = {
        ...updated.exercises[exerciseIdx].sets[setIdx],
        ...data,
        completed: true,
        timestamp: new Date()
      };
      return updated;
    });

    // Show rest timer after completing a set (except for the last set of the exercise)
    const totalSetsInExercise = sessionData.exercises[exerciseIdx].sets.length;
    if (setIdx < totalSetsInExercise - 1) {
      const exercise = sessionData.exercises[exerciseIdx];
      setRestDuration(exercise.plannedRestTime || 60);
      setShowRestTimer(true);
      toast.success('Set completed! Take a rest.');
    } else {
      toast.success('Exercise complete!');
    }
  };

  // Mark exercise as complete and move to next
  const completeExercise = () => {
    setSessionData(prev => {
      const updated = { ...prev };
      updated.exercises[currentExerciseIndex].completed = true;
      return updated;
    });

    if (currentExerciseIndex < sessionData.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      // All exercises complete - finish workout
      finishWorkout();
    }
  };

  // Skip to next exercise
  const skipExercise = () => {
    if (window.confirm('Skip this exercise? Your progress will not be saved for this exercise.')) {
      toast.warning('Exercise skipped');
      if (currentExerciseIndex < sessionData.exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
      } else {
        finishWorkout();
      }
    }
  };

  // Calculate session statistics
  const calculateSessionStats = () => {
    const endTime = new Date();
    const duration = Math.round((endTime - sessionStartTime) / 60000); // minutes

    const totalVolume = sessionData.exercises.reduce((total, ex) => {
      return total + ex.sets.reduce((exTotal, set) => {
        return exTotal + (set.completed && set.weight && set.reps ? set.weight * set.reps : 0);
      }, 0);
    }, 0);

    const totalCompletedSets = sessionData.exercises.reduce((t, ex) =>
      t + ex.sets.filter(s => s.completed).length, 0
    );

    const totalReps = sessionData.exercises.reduce((t, ex) =>
      t + ex.sets.reduce((st, s) => st + (s.completed && s.reps ? s.reps : 0), 0), 0
    );

    return {
      endTime,
      duration,
      totalVolume: Math.round(totalVolume * 10) / 10,
      totalSets: totalCompletedSets,
      totalReps
    };
  };

  // Save workout session to Firestore
  const finishWorkout = async () => {
    if (savingSession) return;

    const confirmFinish = window.confirm(
      'Finish workout?\n\nYour progress will be saved and counted towards your weekly goal.'
    );

    if (!confirmFinish) return;

    setSavingSession(true);

    try {
      const stats = calculateSessionStats();
      const today = new Date().toISOString().split('T')[0];

      // Create workout session document
      const sessionDoc = {
        userId: user.uid,
        routineId: workout.id || null,
        routineName: workout.name || 'Custom Workout',
        workoutDayNumber: dayNumber,
        workoutDayName: dayName,
        startTime: Timestamp.fromDate(sessionStartTime),
        endTime: Timestamp.fromDate(stats.endTime),
        duration: stats.duration,
        totalVolume: stats.totalVolume,
        totalSets: stats.totalSets,
        totalReps: stats.totalReps,
        completionStatus: 'completed',
        exercises: sessionData.exercises.map(ex => ({
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          muscleGroup: ex.muscleGroup,
          equipment: ex.equipment,
          orderIndex: ex.orderIndex,
          plannedSets: ex.plannedSets,
          plannedReps: ex.plannedReps,
          sets: ex.sets,
          totalVolume: ex.sets.reduce((t, s) =>
            t + (s.completed && s.weight && s.reps ? s.weight * s.reps : 0), 0
          ),
          completed: ex.completed
        })),
        createdAt: serverTimestamp()
      };

      // Save to workoutSessions subcollection
      await addDoc(
        collection(db, 'users', user.uid, 'workoutSessions'),
        sessionDoc
      );

      // Update daily activity
      const activityRef = doc(db, 'users', user.uid, 'activity', today);
      const activityDoc = await getDoc(activityRef);
      const currentData = activityDoc.exists() ? activityDoc.data() : {};

      const updatedCompletedDays = [
        ...(currentData.completedWorkoutDays || []),
        dayNumber
      ];

      const currentWeeklyWorkouts = currentData.weeklyWorkouts || stats.thisWeek?.workouts || 0;
      const newWeeklyWorkouts = currentWeeklyWorkouts + 1;

      await setDoc(activityRef, {
        ...currentData,
        date: today,
        userId: user.uid,
        updatedAt: serverTimestamp(),
        completedWorkoutDays: updatedCompletedDays,
        lastCompletedWorkout: {
          dayNumber,
          dayName,
          workoutName: workout.name,
          completedAt: new Date().toISOString(),
        },
        weeklyWorkouts: newWeeklyWorkouts,
        workoutsGoal: metrics.workoutsGoal || 5,
      }, { merge: true });

      toast.success(`Workout complete! Duration: ${stats.duration} min • Volume: ${stats.totalVolume} kg`, 5000);

      navigate('/active-workout');
    } catch (error) {
      console.error('Error saving workout session:', error);
      toast.error('Failed to save workout. Please try again.');
    } finally {
      setSavingSession(false);
    }
  };

  // Calculate overall progress
  const totalExercises = sessionData.exercises.length;
  const completedExercises = sessionData.exercises.filter(ex => ex.completed).length;
  const overallProgress = ((completedExercises + (completedSets / totalSets)) / totalExercises) * 100;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => {
                if (window.confirm('Exit workout? Your progress will not be saved.')) {
                  navigate('/active-workout');
                }
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              Exit
            </button>

            <button
              onClick={finishWorkout}
              disabled={savingSession}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
            >
              {savingSession ? 'Saving...' : 'Finish Workout'}
            </button>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-1">{dayName}</h1>
          <p className="text-sm text-gray-600">
            Exercise {currentExerciseIndex + 1} of {totalExercises} •
            Set {completedSets + 1} of {totalSets}
          </p>

          {/* Progress Bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Current Exercise Card */}
        <div className="bg-white rounded-xl border-2 border-indigo-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1 capitalize">
                {currentExercise.exerciseName}
              </h2>
              <p className="text-gray-600">
                {currentExercise.plannedSets} sets × {currentExercise.plannedReps} reps
              </p>
            </div>
            <button
              onClick={skipExercise}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {currentExercise.notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Note:</span> {currentExercise.notes}
              </p>
            </div>
          )}

          {/* Sets List */}
          <div className="space-y-3 mb-6">
            {currentExercise.sets.map((set, setIdx) => (
              <SetRow
                key={setIdx}
                set={set}
                setNumber={set.setNumber}
                isActive={!set.completed && completedSets === setIdx}
                previousSet={setIdx > 0 ? currentExercise.sets[setIdx - 1] : null}
                onComplete={(data) => updateSet(currentExerciseIndex, setIdx, data)}
              />
            ))}
          </div>

          {/* Complete Exercise Button */}
          {completedSets === totalSets && (
            <button
              onClick={completeExercise}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <FiCheck className="w-5 h-5" />
              {currentExerciseIndex < totalExercises - 1 ? 'Next Exercise' : 'Complete Workout'}
            </button>
          )}
        </div>

        {/* Exercise Progress */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Workout Progress</h3>
          <div className="space-y-2">
            {sessionData.exercises.map((ex, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  idx === currentExerciseIndex ? 'bg-indigo-50' : ''
                }`}
              >
                {ex.completed ? (
                  <FiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : idx === currentExerciseIndex ? (
                  <div className="w-5 h-5 border-2 border-indigo-600 rounded-full flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                )}
                <span className={`text-sm capitalize flex-1 ${
                  idx === currentExerciseIndex ? 'font-semibold text-gray-900' : 'text-gray-600'
                }`}>
                  {ex.exerciseName}
                </span>
                <span className="text-xs text-gray-500">
                  {ex.sets.filter(s => s.completed).length}/{ex.sets.length}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rest Timer Modal */}
      {showRestTimer && (
        <RestTimer
          duration={restDuration}
          onComplete={() => {
            setShowRestTimer(false);
            toast.info('Rest complete! Ready for next set.');
          }}
          onSkip={() => {
            setShowRestTimer(false);
            toast.info('Rest skipped');
          }}
          onClose={() => setShowRestTimer(false)}
        />
      )}
    </div>
  );
};

// Individual Set Row Component
const SetRow = ({ set, setNumber, isActive, previousSet, onComplete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [reps, setReps] = useState(previousSet?.reps || '');
  const [weight, setWeight] = useState(previousSet?.weight || '');

  useEffect(() => {
    if (isActive && !set.completed) {
      setIsEditing(true);
    }
  }, [isActive, set.completed]);

  const handleSave = () => {
    if (reps && weight) {
      onComplete({
        reps: parseInt(reps),
        weight: parseFloat(weight)
      });
      setIsEditing(false);
      setReps('');
      setWeight('');
    }
  };

  if (set.completed) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiCheckCircle className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-gray-700">Set {setNumber}</span>
        </div>
        <div className="text-right">
          <p className="font-bold text-gray-900 text-lg">
            {set.weight} kg × {set.reps}
          </p>
          <p className="text-xs text-gray-600">
            Volume: {(set.weight * set.reps).toFixed(1)} kg
          </p>
        </div>
      </div>
    );
  }

  if (isEditing && isActive) {
    return (
      <div className="bg-indigo-50 border-2 border-indigo-300 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
            {setNumber}
          </div>
          <span className="font-semibold text-gray-900">Set {setNumber}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-lg font-semibold focus:border-indigo-500 focus:ring-0"
              placeholder={previousSet?.weight || "20"}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Reps
            </label>
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-lg font-semibold focus:border-indigo-500 focus:ring-0"
              placeholder={previousSet?.reps || "10"}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!reps || !weight}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
        >
          Complete Set
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 border-2 border-gray-300 text-gray-400 rounded-full flex items-center justify-center font-bold">
          {setNumber}
        </div>
        <span className="font-semibold text-gray-500">Set {setNumber}</span>
      </div>
      <span className="text-sm text-gray-400">Waiting...</span>
    </div>
  );
};

export default WorkoutSession;
