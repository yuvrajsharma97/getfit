import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiClock, FiTrendingUp, FiActivity } from 'react-icons/fi';

const WorkoutHistoryList = ({ workouts, showAll = false }) => {
  const [expandedWorkout, setExpandedWorkout] = useState(null);

  if (!workouts || workouts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No workouts logged yet</p>
        <p className="text-sm mt-2">Complete a workout to see it here</p>
      </div>
    );
  }

  const displayedWorkouts = showAll ? workouts : workouts.slice(0, 5);

  return (
    <div className="space-y-3">
      {displayedWorkouts.map((workout) => {
        const isExpanded = expandedWorkout === workout.id;

        return (
          <div
            key={workout.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
          >
            {/* Workout Header */}
            <button
              onClick={() => setExpandedWorkout(isExpanded ? null : workout.id)}
              className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900">
                      {workout.workoutDayName || workout.routineName || 'Workout'}
                    </h4>
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                      {workout.completionStatus || 'completed'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      {workout.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <FiTrendingUp className="w-4 h-4" />
                      {Math.round(workout.totalVolume || 0)} kg
                    </span>
                    <span className="flex items-center gap-1">
                      <FiActivity className="w-4 h-4" />
                      {workout.totalSets || 0} sets
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    {workout.startTime ? new Date(workout.startTime).toLocaleString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }) : 'No date'}
                  </p>
                </div>

                {isExpanded ? (
                  <FiChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </div>
            </button>

            {/* Workout Details (Expanded) */}
            {isExpanded && workout.exercises && (
              <div className="px-4 pb-4 border-t border-gray-200 bg-gray-50">
                <div className="mt-4 space-y-3">
                  <h5 className="text-sm font-semibold text-gray-700">Exercises</h5>
                  {workout.exercises.map((exercise, idx) => {
                    const completedSets = exercise.sets.filter(s => s.completed);
                    const totalVolume = completedSets.reduce(
                      (sum, s) => sum + (s.weight * s.reps || 0),
                      0
                    );

                    return (
                      <div
                        key={idx}
                        className="bg-white rounded-lg p-3 border border-gray-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h6 className="font-semibold text-gray-900 capitalize">
                              {exercise.exerciseName}
                            </h6>
                            <p className="text-xs text-gray-500">
                              {completedSets.length} sets • {totalVolume.toFixed(1)} kg volume
                            </p>
                          </div>
                        </div>

                        {/* Sets Detail */}
                        <div className="mt-2 space-y-1">
                          {exercise.sets.map((set, setIdx) => {
                            if (!set.completed) return null;

                            return (
                              <div
                                key={setIdx}
                                className="flex items-center justify-between text-sm py-1"
                              >
                                <span className="text-gray-600">
                                  Set {set.setNumber}
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {set.weight} kg × {set.reps} reps
                                </span>
                                <span className="text-gray-500 text-xs">
                                  {(set.weight * set.reps).toFixed(1)} kg
                                </span>
                              </div>
                            );
                          })}
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

      {!showAll && workouts.length > 5 && (
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            Showing 5 of {workouts.length} workouts
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkoutHistoryList;
