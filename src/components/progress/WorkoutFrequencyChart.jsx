import { useMemo } from 'react';

const WorkoutFrequencyChart = ({ workouts }) => {
  const chartData = useMemo(() => {
    if (!workouts || workouts.length === 0) return [];

    // Get last 7 days
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count: 0,
      });
    }

    // Count workouts per day
    workouts.forEach(workout => {
      if (workout.startTime) {
        const workoutDate = new Date(workout.startTime);
        workoutDate.setHours(0, 0, 0, 0);
        const dateStr = workoutDate.toISOString().split('T')[0];
        const day = days.find(d => d.date === dateStr);
        if (day) {
          day.count++;
        }
      }
    });

    return days;
  }, [workouts]);

  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  return (
    <div className="space-y-4">
      {chartData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No workout data available
        </div>
      ) : (
        <>
          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-40">
            {chartData.map((day, index) => {
              const height = (day.count / maxCount) * 100;
              const hasWorkout = day.count > 0;

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  {/* Bar */}
                  <div className="w-full flex flex-col justify-end h-32">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        hasWorkout
                          ? 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                          : 'bg-gray-200'
                      }`}
                      style={{ height: `${height}%`, minHeight: hasWorkout ? '8px' : '4px' }}
                    >
                      {/* Count label */}
                      {hasWorkout && (
                        <div className="text-center text-white font-bold text-xs pt-1">
                          {day.count}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Day label */}
                  <div className="text-xs font-medium text-gray-600">
                    {day.dayName}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-bold text-indigo-600">
                {chartData.reduce((sum, d) => sum + d.count, 0)}
              </span>{' '}
              workout{chartData.reduce((sum, d) => sum + d.count, 0) !== 1 ? 's' : ''} this week
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkoutFrequencyChart;
