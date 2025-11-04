import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiCalendar, FiActivity, FiChevronDown, FiChevronUp, FiCheckCircle, FiCircle, FiCheck } from 'react-icons/fi';
import { useWorkout } from '../context/WorkoutContext';
import { useAuth } from '../context/AuthContext';
import { useMetrics } from '../context/MetricsContext';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

const ActiveWorkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeWorkout, loading } = useWorkout();
  const { metrics, stats } = useMetrics();

  const [expandedDays, setExpandedDays] = useState([]);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [completedWorkoutDays, setCompletedWorkoutDays] = useState([]);
  const [savingWorkout, setSavingWorkout] = useState(false);

  // Redirect if no active workout
  useEffect(() => {
    if (!loading && !activeWorkout) {
      navigate('/workouts');
    }
  }, [activeWorkout, loading, navigate]);

  // Load completed workouts from today's activity
  useEffect(() => {
    const loadCompletedWorkouts = async () => {
      if (!user) return;

      try {
        const today = new Date().toISOString().split('T')[0];
        const activityRef = doc(db, 'users', user.uid, 'activity', today);
        const activityDoc = await getDoc(activityRef);

        if (activityDoc.exists()) {
          const data = activityDoc.data();
          if (data.completedWorkoutDays) {
            setCompletedWorkoutDays(data.completedWorkoutDays);
          }
        }
      } catch (error) {
        console.error('Error loading completed workouts:', error);
      }
    };

    loadCompletedWorkouts();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workout...</p>
        </div>
      </div>
    );
  }

  if (!activeWorkout) {
    return null;
  }

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-orange-100 text-orange-700',
    athlete: 'bg-red-100 text-red-700',
  };

  const typeLabels = {
    '3-day-split': '3-Day Split',
    '4-day-split': '4-Day Split',
    '5-day-split': '5-Day Split',
    'full-body': 'Full Body',
  };

  const capitalizeWords = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const toggleDay = (dayNumber) => {
    setExpandedDays(prev =>
      prev.includes(dayNumber)
        ? prev.filter(d => d !== dayNumber)
        : [...prev, dayNumber]
    );
  };

  const toggleExerciseComplete = (dayNumber, exerciseIndex) => {
    const exerciseId = `${dayNumber}-${exerciseIndex}`;
    setCompletedExercises(prev =>
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const isExerciseComplete = (dayNumber, exerciseIndex) => {
    return completedExercises.includes(`${dayNumber}-${exerciseIndex}`);
  };

  const isWorkoutDayComplete = (dayNumber) => {
    return completedWorkoutDays.includes(dayNumber);
  };

  const handleStartWorkout = (dayNumber, dayName) => {
    if (!user || !activeWorkout) return;

    // Check if already completed
    if (isWorkoutDayComplete(dayNumber)) {
      alert('This workout has already been completed today!');
      return;
    }

    // Find the workout day data
    const workoutDay = activeWorkout.days.find(d => d.dayNumber === dayNumber);
    if (!workoutDay) {
      alert('Workout day not found!');
      return;
    }

    // Navigate to workout session page
    navigate('/workout-session', {
      state: {
        workout: {
          id: activeWorkout.id,
          name: activeWorkout.name,
          exercises: workoutDay.exercises
        },
        dayNumber,
        dayName
      }
    });
  };

  const handleCompleteWorkout = async (dayNumber, dayName) => {
    if (!user || !activeWorkout) return;

    // Check if already completed
    if (isWorkoutDayComplete(dayNumber)) {
      alert('This workout has already been completed today!');
      return;
    }

    const confirmComplete = window.confirm(
      `Mark "${dayName}" as complete without tracking sets?\n\nFor detailed tracking, click "Start Workout" instead.`
    );

    if (!confirmComplete) return;

    setSavingWorkout(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const activityRef = doc(db, 'users', user.uid, 'activity', today);

      // Get current activity data
      const activityDoc = await getDoc(activityRef);
      const currentData = activityDoc.exists() ? activityDoc.data() : {};

      // Update completed workout days
      const updatedCompletedDays = [
        ...(currentData.completedWorkoutDays || []),
        dayNumber
      ];

      // Calculate new weekly workout count
      const currentWeeklyWorkouts = (currentData.weeklyWorkouts || stats.thisWeek.workouts || 0);
      const newWeeklyWorkouts = currentWeeklyWorkouts + 1;

      // Save to Firestore
      await setDoc(activityRef, {
        ...currentData,
        date: today,
        userId: user.uid,
        updatedAt: serverTimestamp(),

        // Workout completion data
        completedWorkoutDays: updatedCompletedDays,
        lastCompletedWorkout: {
          dayNumber,
          dayName,
          workoutName: activeWorkout.name,
          completedAt: new Date().toISOString(),
        },

        // Update weekly workout count
        weeklyWorkouts: newWeeklyWorkouts,
        workoutsGoal: metrics.workoutsGoal || 5,
      }, { merge: true });

      // Update local state
      setCompletedWorkoutDays(updatedCompletedDays);

      alert(`Workout complete! 🎉\n\n"${dayName}" has been marked as complete.\nWeekly workouts: ${newWeeklyWorkouts}`);
    } catch (error) {
      console.error('Error saving workout completion:', error);
      alert('Failed to save workout completion. Please try again.');
    } finally {
      setSavingWorkout(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{activeWorkout.name}</h1>
                <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                  Active Program
                </span>
              </div>
              <p className="text-gray-600 max-w-2xl">{activeWorkout.description}</p>
            </div>
            <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${difficultyColors[activeWorkout.difficulty]}`}>
              {capitalizeWords(activeWorkout.difficulty)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Program Overview</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FiCalendar className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Frequency</p>
                <p className="font-semibold text-gray-900">{activeWorkout.daysPerWeek} days/week</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FiClock className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold text-gray-900">{activeWorkout.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FiActivity className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Split Type</p>
                <p className="font-semibold text-gray-900">{typeLabels[activeWorkout.type]}</p>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Goals</h3>
            <div className="flex flex-wrap gap-2">
              {activeWorkout.goals.map((goal, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-sm font-medium bg-indigo-50 text-indigo-700 rounded-full"
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>

          {/* Equipment */}
          {activeWorkout.equipment && activeWorkout.equipment.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Equipment Needed</h3>
              <div className="flex flex-wrap gap-2">
                {activeWorkout.equipment.map((equipment, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-lg"
                  >
                    {capitalizeWords(equipment)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Workout Days */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Workout Schedule</h2>

          <div className="space-y-4">
            {activeWorkout.days.map((day) => {
              const dayExercises = day.exercises || [];
              const completedCount = dayExercises.filter((_, idx) =>
                isExerciseComplete(day.dayNumber, idx)
              ).length;
              const totalCount = dayExercises.length;

              return (
                <div
                  key={day.dayNumber}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  {/* Day Header */}
                  <button
                    onClick={() => toggleDay(day.dayNumber)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full font-bold">
                        {day.dayNumber}
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900">{day.name}</h3>
                        <p className="text-sm text-gray-600">
                          {completedCount} / {totalCount} exercises completed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {isWorkoutDayComplete(day.dayNumber) ? (
                        <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
                          <FiCheckCircle className="w-4 h-4" />
                          Completed
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartWorkout(day.dayNumber, day.name);
                            }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
                          >
                            <FiActivity className="w-4 h-4" />
                            Start Workout
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompleteWorkout(day.dayNumber, day.name);
                            }}
                            disabled={savingWorkout}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Mark as complete without tracking"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {expandedDays.includes(day.dayNumber) ? (
                        <FiChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <FiChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Day Exercises */}
                  {expandedDays.includes(day.dayNumber) && (
                    <div className="border-t border-gray-200">
                      <div className="p-6 space-y-4">
                        {dayExercises.map((exercise, index) => {
                          const isComplete = isExerciseComplete(day.dayNumber, index);

                          return (
                            <div
                              key={index}
                              className={`flex items-start gap-4 p-4 rounded-lg transition-all ${
                                isComplete ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'
                              }`}
                            >
                              <button
                                onClick={() => toggleExerciseComplete(day.dayNumber, index)}
                                className="flex-shrink-0 mt-1"
                              >
                                {isComplete ? (
                                  <FiCheckCircle className="w-6 h-6 text-green-600" />
                                ) : (
                                  <FiCircle className="w-6 h-6 text-gray-400 hover:text-indigo-600 transition-colors" />
                                )}
                              </button>

                              <div className="flex items-center justify-center w-8 h-8 bg-white border-2 border-indigo-600 text-indigo-600 rounded-full font-bold text-sm flex-shrink-0">
                                {index + 1}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className={`font-semibold capitalize mb-1 ${
                                  isComplete ? 'text-green-900 line-through' : 'text-gray-900'
                                }`}>
                                  {exercise.exerciseName}
                                </h4>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                  <span>
                                    <span className="font-medium">Sets:</span> {exercise.sets}
                                  </span>
                                  <span>
                                    <span className="font-medium">Reps:</span> {exercise.reps}
                                  </span>
                                  <span>
                                    <span className="font-medium">Rest:</span> {exercise.restTime}s
                                  </span>
                                </div>
                                {exercise.notes && (
                                  <p className="mt-2 text-sm text-gray-600 italic">
                                    Note: {exercise.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default ActiveWorkout;
