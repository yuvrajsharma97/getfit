import { useMemo, useState } from 'react';
import { FiTrendingUp, FiAward } from 'react-icons/fi';

const ExercisePRChart = ({ workouts }) => {
  const [selectedExercise, setSelectedExercise] = useState(null);

  const exercisePRs = useMemo(() => {
    if (!workouts || workouts.length === 0) return [];

    const exerciseMap = new Map();

    // Process all workouts and track PRs
    workouts.forEach(workout => {
      if (workout.exercises) {
        workout.exercises.forEach(exercise => {
          const exerciseName = exercise.exerciseName;

          if (!exerciseName) return;

          // Calculate max weight and volume for this exercise in this workout
          const completedSets = exercise.sets.filter(s => s.completed && s.weight && s.reps);

          if (completedSets.length === 0) return;

          const maxWeight = Math.max(...completedSets.map(s => s.weight));
          const totalVolume = completedSets.reduce((sum, s) => sum + (s.weight * s.reps), 0);
          const maxReps = Math.max(...completedSets.map(s => s.reps));

          if (!exerciseMap.has(exerciseName)) {
            exerciseMap.set(exerciseName, {
              exerciseName,
              maxWeight,
              maxWeightDate: workout.startTime,
              totalVolume,
              maxVolume: totalVolume,
              maxVolumeDate: workout.startTime,
              maxReps,
              maxRepsDate: workout.startTime,
              totalSessions: 1,
              history: [{
                date: workout.startTime,
                weight: maxWeight,
                volume: totalVolume,
                reps: maxReps,
              }],
            });
          } else {
            const current = exerciseMap.get(exerciseName);

            // Update PRs
            if (maxWeight > current.maxWeight) {
              current.maxWeight = maxWeight;
              current.maxWeightDate = workout.startTime;
            }

            if (totalVolume > current.maxVolume) {
              current.maxVolume = totalVolume;
              current.maxVolumeDate = workout.startTime;
            }

            if (maxReps > current.maxReps) {
              current.maxReps = maxReps;
              current.maxRepsDate = workout.startTime;
            }

            current.totalVolume += totalVolume;
            current.totalSessions += 1;
            current.history.push({
              date: workout.startTime,
              weight: maxWeight,
              volume: totalVolume,
              reps: maxReps,
            });
          }
        });
      }
    });

    // Sort by max weight descending
    return Array.from(exerciseMap.values())
      .sort((a, b) => b.maxWeight - a.maxWeight);
  }, [workouts]);

  if (exercisePRs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiAward className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">No Personal Records Yet</h3>
        <p className="text-gray-600">Complete workouts to track your personal records</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top PRs List */}
      <div className="space-y-3">
        {exercisePRs.slice(0, 10).map((exercise, index) => (
          <div
            key={exercise.exerciseName}
            className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedExercise(selectedExercise === exercise.exerciseName ? null : exercise.exerciseName)}
          >
            {/* Exercise Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {/* Rank Badge */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-yellow-100 text-yellow-700' :
                  index === 1 ? 'bg-gray-200 text-gray-700' :
                  index === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-indigo-50 text-indigo-600'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 capitalize">
                    {exercise.exerciseName}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {exercise.totalSessions} session{exercise.totalSessions !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Max Weight */}
              <div className="text-right">
                <p className="text-2xl font-bold text-indigo-600">
                  {exercise.maxWeight} kg
                </p>
                <p className="text-xs text-gray-500">
                  Max Weight
                </p>
              </div>
            </div>

            {/* PR Details (expanded) */}
            {selectedExercise === exercise.exerciseName && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <FiTrendingUp className="w-4 h-4 text-emerald-600" />
                    <p className="text-sm font-semibold text-gray-700">Max Volume</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {Math.round(exercise.maxVolume)} kg
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(exercise.maxVolumeDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <FiAward className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-semibold text-gray-700">Max Reps</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {exercise.maxReps}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(exercise.maxRepsDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <p className="text-sm font-semibold text-gray-700">Total Volume</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {Math.round(exercise.totalVolume)} kg
                  </p>
                  <p className="text-xs text-gray-500">
                    All time
                  </p>
                </div>
              </div>
            )}

            {/* Mini Progress Chart */}
            {selectedExercise === exercise.exerciseName && exercise.history.length > 1 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">Progress</p>
                <MiniProgressChart data={exercise.history.slice(-10)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Mini chart component for exercise progress
const MiniProgressChart = ({ data }) => {
  if (!data || data.length < 2) return null;

  const maxWeight = Math.max(...data.map(d => d.weight));
  const minWeight = Math.min(...data.map(d => d.weight));
  const range = maxWeight - minWeight || 1;

  const chartHeight = 60;
  const chartWidth = 400;

  const points = data.map((item, index) => ({
    x: (index / (data.length - 1)) * chartWidth,
    y: chartHeight - ((item.weight - minWeight) / range) * chartHeight,
    weight: item.weight,
  }));

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-16">
      <path
        d={pathData}
        fill="none"
        stroke="#4F46E5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r="3"
          fill="#4F46E5"
        />
      ))}
    </svg>
  );
};

export default ExercisePRChart;
